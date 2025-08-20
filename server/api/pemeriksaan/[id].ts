import { pemeriksaan } from '../../database/schema/pemeriksaan';
import { pemeriksaan_obat } from '../../database/schema/pemeriksaan_obat';
import { pegawai_detail } from '../../database/schema/pegawai_detail';
import { pegawai } from '../../database/schema/pegawai';
import { diagnosis } from '../../database/schema/diagnosa';
import { db } from '../../database';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const id = Number(event.context.params?.id);
  if (!id || isNaN(id)) {
    event.node.res.statusCode = 400;
    return { success: false, message: 'Invalid or missing id parameter' };
  }

  if (method === 'GET') {
    try {
      // Get pemeriksaan with related data
      const pemeriksaanResult = await db
        .select({
          // Pemeriksaan fields
          id: pemeriksaan.id,
          pasien_nip: pemeriksaan.pasien_nip,
          tanggal_pemeriksaan: pemeriksaan.tanggal_pemeriksaan,
          waktu_pemeriksaan: pemeriksaan.waktu_pemeriksaan,
          jenis_pemeriksaan: pemeriksaan.jenis_pemeriksaan,
          keluhan: pemeriksaan.keluhan,
          diagnosis_id: pemeriksaan.diagnosis_id,
          tindakan: pemeriksaan.tindakan,
          dokter: pemeriksaan.dokter,
          status: pemeriksaan.status,
     
          // Pegawai fields
          pegawai_nama: pegawai.nama,
          pegawai_jabatan: pegawai.jabatan,
          pegawai_golongan: pegawai.golongan,
     
          // Pegawai detail fields
          pegawai_email: pegawai_detail.email,
          pegawai_jenis_kelamin: pegawai_detail.jenis_kelamin,
          pegawai_tanggal_lahir: pegawai_detail.tanggal_lahir,
          pegawai_alamat: pegawai_detail.alamat,
          pegawai_telp: pegawai_detail.telp,
          // Diagnosis fields
          diagnosis_kode_icd: diagnosis.kode_icd,
          diagnosis_nama_diagnosa: diagnosis.nama_diagnosa,
          diagnosis_kategori: diagnosis.kategori
        })
        .from(pemeriksaan)
        .leftJoin(pegawai, eq(pemeriksaan.pasien_nip, pegawai.nip))
        .leftJoin(pegawai_detail, eq(pemeriksaan.pasien_nip, pegawai_detail.nip))
        .leftJoin(diagnosis, eq(pemeriksaan.diagnosis_id, diagnosis.id))
        .where(eq(pemeriksaan.id, id));

      if (!pemeriksaanResult.length) {
        event.node.res.statusCode = 404;
        return { success: false, message: 'Pemeriksaan not found' };
      }

      const pemeriksaanData = pemeriksaanResult[0];

      // Get obat list for this pemeriksaan
      const obatList = await db
        .select({
          id: pemeriksaan_obat.id,
          obat_id: pemeriksaan_obat.obat_id,
          nama_obat: pemeriksaan_obat.nama_obat,
          dosis: pemeriksaan_obat.dosis,
          jumlah: pemeriksaan_obat.jumlah,
          stok_saat_itu: pemeriksaan_obat.stok_saat_itu
        })
        .from(pemeriksaan_obat)
        .where(eq(pemeriksaan_obat.pemeriksaan_id, id));

      // Format response
      const formattedData = {
        id: pemeriksaanData.id,
        pasien_nip: pemeriksaanData.pasien_nip,
        tanggal_pemeriksaan: pemeriksaanData.tanggal_pemeriksaan,
        waktu_pemeriksaan: pemeriksaanData.waktu_pemeriksaan,
        jenis_pemeriksaan: pemeriksaanData.jenis_pemeriksaan,
        keluhan: pemeriksaanData.keluhan,
        diagnosis_id: pemeriksaanData.diagnosis_id,
        tindakan: pemeriksaanData.tindakan,
        dokter: pemeriksaanData.dokter,
        status: pemeriksaanData.status,
    
        // Pasien information
        pasien: {
          nama: pemeriksaanData.pegawai_nama,
          nip: pemeriksaanData.pasien_nip,
          jabatan: pemeriksaanData.pegawai_jabatan,
          golongan: pemeriksaanData.pegawai_golongan,
  
          email: pemeriksaanData.pegawai_email,
          jenis_kelamin: pemeriksaanData.pegawai_jenis_kelamin,
          tanggal_lahir: pemeriksaanData.pegawai_tanggal_lahir,
          alamat: pemeriksaanData.pegawai_alamat,
          telp: pemeriksaanData.pegawai_telp
        },
        // Diagnosis information
        diagnosis: {
          id: pemeriksaanData.diagnosis_id,
          kode_icd: pemeriksaanData.diagnosis_kode_icd,
          nama_diagnosa: pemeriksaanData.diagnosis_nama_diagnosa,
          kategori: pemeriksaanData.diagnosis_kategori
        },
        // Obat list
        obat_list: obatList
      };

      return { success: true, data: formattedData };

    } catch (err) {
      console.error('Error getting pemeriksaan:', err);
      event.node.res.statusCode = 500;
      return {
        success: false,
        message: err instanceof Error ? err.message : String(err),
        detail: err,
      };
    }
  }

  if (method === 'PUT') {
    try {
      const body = await readBody(event);
      // Update pemeriksaan
      const [updated] = await db.update(pemeriksaan)
        .set({
          pasien_nip: body.pasien_nip,
          tanggal_pemeriksaan: body.tanggal_pemeriksaan,
          waktu_pemeriksaan: body.waktu_pemeriksaan,
          jenis_pemeriksaan: body.jenis_pemeriksaan,
          keluhan: body.keluhan,
          diagnosis_id: body.diagnosis_id,
          tindakan: body.tindakan,
          dokter: body.dokter,
          status: body.status,
  
        })
        .where(eq(pemeriksaan.id, id))
        .returning();
      if (!updated) {
        return { success: false, message: 'Pemeriksaan not found' };
      }
      // Update obat if provided
      if (body.obatList && Array.isArray(body.obatList)) {
        // Delete old obat
        await db.delete(pemeriksaan_obat).where(eq(pemeriksaan_obat.pemeriksaan_id, id));
        // Insert new obat
        for (const obat of body.obatList) {
          await db.insert(pemeriksaan_obat).values({
            pemeriksaan_id: id,
            obat_id: obat.obat_id,
            nama_obat: obat.nama_obat,
            dosis: obat.dosis,
            jumlah: obat.jumlah,
            stok_saat_itu: obat.stok_saat_itu,
          });
        }
      }
      return { success: true, data: updated };
    } catch (err) {
      event.node.res.statusCode = 500;
      return {
        success: false,
        message: err instanceof Error ? err.message : String(err),
        detail: err,
      };
    }
  }

  if (method === 'DELETE') {
    try {
      // Delete related obat first
      await db.delete(pemeriksaan_obat).where(eq(pemeriksaan_obat.pemeriksaan_id, id));
      // Delete pemeriksaan
      const [deleted] = await db.delete(pemeriksaan).where(eq(pemeriksaan.id, id)).returning();
      if (!deleted) {
        return { success: false, message: 'Pemeriksaan not found' };
      }
      return { success: true, data: deleted };
    } catch (err) {
      event.node.res.statusCode = 500;
      return {
        success: false,
        message: err instanceof Error ? err.message : String(err),
        detail: err,
      };
    }
  }

  event.node.res.statusCode = 405;
  return { success: false, message: 'Method not allowed' };
});
