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
});