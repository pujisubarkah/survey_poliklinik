import { pemeriksaan } from '../../database/schema/pemeriksaan';
import { pemeriksaan_obat } from '../../database/schema/pemeriksaan_obat';
import { db } from '../../database';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const id = Number(event.context.params?.id);
  if (!id || isNaN(id)) {
    event.node.res.statusCode = 400;
    return { success: false, message: 'Invalid or missing id parameter' };
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
