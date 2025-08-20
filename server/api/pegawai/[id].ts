// api/pegawai/[id].ts
import { db } from '../../database';
import { pegawai } from '../../database/schema/pegawai';
// If your schema exports columns individually, import updated_at as well:
// import { updated_at } from '../../database/schema/pegawai';
import { pegawai_detail } from '../../database/schema/pegawai_detail';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  const id = Number(event.context?.params?.id);
  
  if (!id || isNaN(id)) {
    return createError({
      statusCode: 400,
      statusMessage: 'Parameter id tidak valid'
    });
  }

  try {
    // GET - Ambil data pegawai berdasarkan ID dengan struktur yang sama seperti /api/pegawai
    if (method === 'GET') {
      const result = await db
        .select({
          // Main pegawai fields
          id: pegawai.id,
          nip: pegawai.nip,
          nama: pegawai.nama,
          unit_kerja_id: pegawai.unit_kerja_id,
          jabatan: pegawai.jabatan,
          golongan: pegawai.golongan,
          eselon: pegawai.eselon,
          created_at: pegawai.created_at,
          // Detail fields as separate object (akan di-restructure)
          detail_id: pegawai_detail.id,
          detail_email: pegawai_detail.email,
          detail_unit_kerja: pegawai_detail.unit_kerja,
          detail_status_kepegawaian: pegawai_detail.status_kepegawaian,
          detail_alamat: pegawai_detail.alamat,
          detail_pendidikan: pegawai_detail.pendidikan,
          detail_telp: pegawai_detail.telp,
          detail_tanggal_lahir: pegawai_detail.tanggal_lahir,
          detail_jenis_kelamin: pegawai_detail.jenis_kelamin,
          detail_nm_goldar: pegawai_detail.nm_goldar,
          detail_peg_cpns_tmt: pegawai_detail.peg_cpns_tmt,
          detail_nip: pegawai_detail.nip
        })
        .from(pegawai)
        .leftJoin(pegawai_detail, eq(pegawai.nip, pegawai_detail.nip))
        .where(eq(pegawai.id, id));

      if (!result.length) {
        return createError({
          statusCode: 404,
          statusMessage: 'Pegawai tidak ditemukan'
        });
      }

      const pegawaiData = result[0];

      // Restructure data to match the expected format
      const formattedData = {
        id: pegawaiData.id,
        nip: pegawaiData.nip,
        nama: pegawaiData.nama,
        unit_kerja_id: pegawaiData.unit_kerja_id,
        jabatan: pegawaiData.jabatan,
        golongan: pegawaiData.golongan,
        eselon: pegawaiData.eselon,
        detail: {
          email: pegawaiData.detail_email,
          unit_kerja: pegawaiData.detail_unit_kerja,
          status_kepegawaian: pegawaiData.detail_status_kepegawaian,
          alamat: pegawaiData.detail_alamat,
          pendidikan: pegawaiData.detail_pendidikan,
          telp: pegawaiData.detail_telp,
          tanggal_lahir: pegawaiData.detail_tanggal_lahir,
          jenis_kelamin: pegawaiData.detail_jenis_kelamin,
          nm_goldar: pegawaiData.detail_nm_goldar,
          peg_cpns_tmt: pegawaiData.detail_peg_cpns_tmt,
          nip: pegawaiData.detail_nip
        },
        // Add foto URL (assuming it follows the same pattern)
        foto: pegawaiData.nip ? `https://dtjrketxxozstcwvotzh.supabase.co/storage/v1/object/public/foto_pegawai/${pegawaiData.nip}.jpg` : null,
        created_at: pegawaiData.created_at,
      };

      return {
        success: true,
        data: formattedData
      };
    }

    // PUT - Update data pegawai berdasarkan ID
    if (method === 'PUT') {
      const body = await readBody(event);
      
      // Validasi data yang diperlukan
      if (!body.nama || !body.nip) {
        return createError({
          statusCode: 400,
          statusMessage: 'Nama dan NIP harus diisi'
        });
      }

      await db.transaction(async (tx) => {
        // Update tabel pegawai
        const pegawaiUpdateData = {
          nama: body.nama,
          nip: body.nip,
          unit_kerja_id: body.unit_kerja_id ? Number(body.unit_kerja_id) : null,
          jabatan: body.jabatan || null,
          golongan: body.golongan || null,
          eselon: body.eselon || null,
          updated_at: new Date()
        };

        const updatedPegawai = await tx
          .update(pegawai)
          .set(pegawaiUpdateData)
          .where(eq(pegawai.id, id))
          .returning();

        if (!updatedPegawai.length) {
          throw new Error('Pegawai tidak ditemukan');
        }

        // Update tabel pegawai_detail
        const pegawaiDetailUpdateData = {
          email: body.email || null,
          unit_kerja: body.unit_kerja || null,
          status_kepegawaian: body.status_kepegawaian || null,
          alamat: body.alamat || null,
          pendidikan: body.pendidikan || null,
          telp: body.telp || null,
          tanggal_lahir: body.tanggal_lahir ? new Date(body.tanggal_lahir).toISOString() : null,
          jenis_kelamin: body.jenis_kelamin || null,
          nm_goldar: body.nm_goldar || null,
          peg_cpns_tmt: body.peg_cpns_tmt ? new Date(body.peg_cpns_tmt).toISOString() : null,
          nip: body.nip // Update NIP jika berubah
        };

        // Check if pegawai_detail exists
        const existingDetail = await tx
          .select({ id: pegawai_detail.id })
          .from(pegawai_detail)
          .where(eq(pegawai_detail.nip, body.nip));

        if (existingDetail.length > 0) {
          // Update existing detail
          await tx
            .update(pegawai_detail)
            .set(pegawaiDetailUpdateData)
            .where(eq(pegawai_detail.nip, body.nip));
        } else {
          // Insert new detail
          await tx
            .insert(pegawai_detail)
            .values(pegawaiDetailUpdateData);
        }
      });

      // Ambil data terbaru setelah update dengan struktur yang sama
      const updatedResult = await db
        .select({
          id: pegawai.id,
          nip: pegawai.nip,
          nama: pegawai.nama,
          unit_kerja_id: pegawai.unit_kerja_id,
          jabatan: pegawai.jabatan,
          golongan: pegawai.golongan,
          eselon: pegawai.eselon,
          created_at: pegawai.created_at,
          detail_id: pegawai_detail.id,
          detail_email: pegawai_detail.email,
          detail_unit_kerja: pegawai_detail.unit_kerja,
          detail_status_kepegawaian: pegawai_detail.status_kepegawaian,
          detail_alamat: pegawai_detail.alamat,
          detail_pendidikan: pegawai_detail.pendidikan,
          detail_telp: pegawai_detail.telp,
          detail_tanggal_lahir: pegawai_detail.tanggal_lahir,
          detail_jenis_kelamin: pegawai_detail.jenis_kelamin,
          detail_nm_goldar: pegawai_detail.nm_goldar,
          detail_peg_cpns_tmt: pegawai_detail.peg_cpns_tmt,
          detail_nip: pegawai_detail.nip
        })
        .from(pegawai)
        .leftJoin(pegawai_detail, eq(pegawai.nip, pegawai_detail.nip))
        .where(eq(pegawai.id, id));

      const updatedPegawaiData = updatedResult[0];
      const formattedUpdatedData = {
        id: updatedPegawaiData.id,
        nip: updatedPegawaiData.nip,
        nama: updatedPegawaiData.nama,
        unit_kerja_id: updatedPegawaiData.unit_kerja_id,
        jabatan: updatedPegawaiData.jabatan,
        golongan: updatedPegawaiData.golongan,
        eselon: updatedPegawaiData.eselon,
        detail: {
          unit_kerja: updatedPegawaiData.detail_unit_kerja,
          status_kepegawaian: updatedPegawaiData.detail_status_kepegawaian,
          alamat: updatedPegawaiData.detail_alamat,
          pendidikan: updatedPegawaiData.detail_pendidikan,
          telp: updatedPegawaiData.detail_telp,
          tanggal_lahir: updatedPegawaiData.detail_tanggal_lahir,
          jenis_kelamin: updatedPegawaiData.detail_jenis_kelamin,
          nm_goldar: updatedPegawaiData.detail_nm_goldar,
          peg_cpns_tmt: updatedPegawaiData.detail_peg_cpns_tmt,
          nip: updatedPegawaiData.detail_nip
        },
        foto: updatedPegawaiData.nip ? `https://dtjrketxxozstcwvotzh.supabase.co/storage/v1/object/public/foto_pegawai/${updatedPegawaiData.nip}.jpg` : null,
        created_at: updatedPegawaiData.created_at,
      
      };
      return {
        success: true,
        message: 'Data pegawai berhasil diupdate',
        data: formattedUpdatedData
      };
    }

    // DELETE - Hapus data pegawai berdasarkan ID
    if (method === 'DELETE') {
      await db.transaction(async (tx) => {
        // Hapus dari pegawai_detail terlebih dahulu (relasi via NIP)
        const pegawaiData = await tx
          .select({ nip: pegawai.nip })
          .from(pegawai)
          .where(eq(pegawai.id, id));

        if (!pegawaiData.length) {
          throw new Error('Pegawai tidak ditemukan');
        }

        const nip = pegawaiData[0].nip;

        if (nip === null || nip === undefined) {
          throw new Error('NIP pegawai tidak ditemukan');
        }

        await tx.delete(pegawai_detail).where(eq(pegawai_detail.nip, nip));
        await tx.delete(pegawai).where(eq(pegawai.id, id));
      });

      return {
        success: true,
        message: 'Pegawai dan data terkait berhasil dihapus',
        deletedId: id
      };
    }

    // Method tidak didukung
    return createError({
      statusCode: 405,
      statusMessage: 'Method tidak didukung'
    });

  } catch (error) {
    console.error(`Error ${method} pegawai:`, error);
    return createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Terjadi kesalahan server'
    });
  }
});