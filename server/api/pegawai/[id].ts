// api/pegawai/[id].delete.ts
import { db } from '../../database';
import { pegawai } from '../../database/schema/pegawai';
import { pegawai_detail } from '../../database/schema/pegawai_detail';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const id = Number(event.context?.params?.id);
  if (!id || isNaN(id)) {
    return createError({
      statusCode: 400,
      statusMessage: 'Parameter id tidak valid'
    });
  }

  if (event.req.method === 'GET') {
    // Ambil detail pegawai berdasarkan ID
    try {
      const data = await db
        .select({
          id: pegawai.id,
          nip: pegawai.nip,
          nama: pegawai.nama,
          unit_kerja_id: pegawai.unit_kerja_id,
          jabatan: pegawai.jabatan,
          golongan: pegawai.golongan,
          eselon: pegawai.eselon,
          // join ke pegawai_detail
          detail: pegawai_detail
        })
        .from(pegawai)
        .leftJoin(pegawai_detail, eq(pegawai.nip, pegawai_detail.nip))
        .where(eq(pegawai.id, id));

      if (!data.length) {
        return createError({
          statusCode: 404,
          statusMessage: 'Pegawai tidak ditemukan'
        });
      }

      // Tambahkan field foto berdasarkan nip
      const pegawaiData = {
        ...data[0],
        foto: data[0].nip ? `https://dtjrketxxozstcwvotzh.supabase.co/storage/v1/object/public/foto_pegawai/${data[0].nip}.jpg` : null
      };

      return { success: true, data: pegawaiData };
    } catch (error) {
      console.error('Error fetching pegawai detail:', error);
      return createError({
        statusCode: 500,
        statusMessage: 'Gagal mengambil detail pegawai'
      });
    }
  }

  if (event.req.method === 'DELETE') {
    try {
      // Mulai transaksi (opsional, tapi disarankan)
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

      return { message: 'Pegawai dan data terkait berhasil dihapus', deletedId: id };
    } catch (error) {
      console.error('Error deleting pegawai:', error);
      return createError({
        statusCode: 500,
        statusMessage: 'Gagal menghapus data pegawai'
      });
    }
  }

  return { error: 'Method not allowed' };
});