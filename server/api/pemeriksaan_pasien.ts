import { pemeriksaan } from '../database/schema/pemeriksaan';
import { pemeriksaan_obat } from '../database/schema/pemeriksaan_obat';
import { pegawai_detail } from '../database/schema/pegawai_detail';
import { pegawai } from '../database/schema/pegawai';
import { diagnosis } from '../database/schema/diagnosa';
import { db } from '../database';
import { eq, desc, inArray } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const query = getQuery(event);

  if (method === 'GET') {
    try {
      console.log('Query params:', query); // Debug log
      
      // Build query with optional filter
      const selectConfig = {
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
      };

      let pemeriksaanResult;
      if (query.pasien_nip) {
        console.log('Filtering by pasien_nip:', query.pasien_nip); // Debug log
        pemeriksaanResult = await db
          .select(selectConfig)
          .from(pemeriksaan)
          .leftJoin(pegawai, eq(pemeriksaan.pasien_nip, pegawai.nip))
          .leftJoin(pegawai_detail, eq(pemeriksaan.pasien_nip, pegawai_detail.nip))
          .leftJoin(diagnosis, eq(pemeriksaan.diagnosis_id, diagnosis.id))
          .where(eq(pemeriksaan.pasien_nip, String(query.pasien_nip)))
          .orderBy(desc(pemeriksaan.tanggal_pemeriksaan), desc(pemeriksaan.waktu_pemeriksaan));
      } else {
        pemeriksaanResult = await db
          .select(selectConfig)
          .from(pemeriksaan)
          .leftJoin(pegawai, eq(pemeriksaan.pasien_nip, pegawai.nip))
          .leftJoin(pegawai_detail, eq(pemeriksaan.pasien_nip, pegawai_detail.nip))
          .leftJoin(diagnosis, eq(pemeriksaan.diagnosis_id, diagnosis.id))
          .orderBy(desc(pemeriksaan.tanggal_pemeriksaan), desc(pemeriksaan.waktu_pemeriksaan));
      }

      console.log('Found pemeriksaan records:', pemeriksaanResult.length); // Debug log

      if (!pemeriksaanResult.length) {
        return []; // Return empty array untuk konsistensi
      }

      // Get obat list for all pemeriksaan
      const pemeriksaanIds = pemeriksaanResult.map(p => p.id);
      let obatData: {
        pemeriksaan_id: number;
        id: number;
        obat_id: number;
        nama_obat: string;
        dosis: string;
        jumlah: number;
        stok_saat_itu: number;
      }[] = [];
      
      if (pemeriksaanIds.length > 0) {
        const rawObatData = await db
          .select({
            pemeriksaan_id: pemeriksaan_obat.pemeriksaan_id,
            id: pemeriksaan_obat.id,
            obat_id: pemeriksaan_obat.obat_id,
            nama_obat: pemeriksaan_obat.nama_obat,
            dosis: pemeriksaan_obat.dosis,
            jumlah: pemeriksaan_obat.jumlah,
            stok_saat_itu: pemeriksaan_obat.stok_saat_itu
          })
          .from(pemeriksaan_obat)
          .where(inArray(pemeriksaan_obat.pemeriksaan_id, pemeriksaanIds));

        obatData = rawObatData
          .filter(
            o =>
              o.pemeriksaan_id !== null &&
              o.id !== null &&
              o.obat_id !== null &&
              o.nama_obat !== null &&
              o.dosis !== null &&
              o.jumlah !== null &&
              o.stok_saat_itu !== null
          )
          .map(o => ({
            pemeriksaan_id: o.pemeriksaan_id as number,
            id: o.id as number,
            obat_id: o.obat_id as number,
            nama_obat: o.nama_obat as string,
            dosis: o.dosis as string,
            jumlah: o.jumlah as number,
            stok_saat_itu: o.stok_saat_itu as number
          }));
      }

      console.log('Found obat records:', obatData.length); // Debug log

      // Group obat by pemeriksaan_id
      const obatByPemeriksaan = obatData.reduce<Record<number, {
        id: number;
        obat_id: number;
        nama_obat: string;
        dosis: string;
        jumlah: number;
        stok_saat_itu: number;
      }[]>>((acc, obat) => {
        if (!acc[obat.pemeriksaan_id]) {
          acc[obat.pemeriksaan_id] = [];
        }
        acc[obat.pemeriksaan_id].push({
          id: obat.id,
          obat_id: obat.obat_id,
          nama_obat: obat.nama_obat,
          dosis: obat.dosis,
          jumlah: obat.jumlah,
          stok_saat_itu: obat.stok_saat_itu
        });
        return acc;
      }, {});

      // Format response
      const formattedData = pemeriksaanResult.map(pemeriksaanData => ({
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
        // Obat list for this pemeriksaan
        obat_list: obatByPemeriksaan[pemeriksaanData.id] || []
      }));

      console.log('Returning formatted data:', formattedData.length, 'records'); // Debug log
      return formattedData; // Return array directly

    } catch (err) {
      console.error('Error getting pemeriksaan list:', err);
      event.node.res.statusCode = 500;
      return {
        success: false,
        message: err instanceof Error ? err.message : String(err),
        detail: err,
      };
    }
  }

  // Handle POST method if needed
  if (method === 'POST') {
    try {
      const body = await readBody(event);
      
      // Validate required fields
      if (!body.pasien_nip || !body.tanggal_pemeriksaan) {
        event.node.res.statusCode = 400;
        return { success: false, message: 'pasien_nip dan tanggal_pemeriksaan harus diisi' };
      }

      // Insert pemeriksaan
      const [newPemeriksaan] = await db.insert(pemeriksaan).values({
        pasien_nip: body.pasien_nip,
        tanggal_pemeriksaan: body.tanggal_pemeriksaan,
        waktu_pemeriksaan: body.waktu_pemeriksaan,
        jenis_pemeriksaan: body.jenis_pemeriksaan,
        keluhan: body.keluhan,
        diagnosis_id: body.diagnosis_id,
        tindakan: body.tindakan,
        dokter: body.dokter,
        status: body.status || 'Proses'
      }).returning();

      // Insert obat if provided
      if (body.obatList && Array.isArray(body.obatList)) {
        for (const obat of body.obatList) {
          await db.insert(pemeriksaan_obat).values({
            pemeriksaan_id: newPemeriksaan.id,
            obat_id: obat.obat_id,
            nama_obat: obat.nama_obat,
            dosis: obat.dosis,
            jumlah: obat.jumlah,
            stok_saat_itu: obat.stok_saat_itu,
          });
        }
      }

      return { success: true, data: newPemeriksaan };
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