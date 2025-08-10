import { db } from '../../database';
import { master_obat } from '../../database/schema/master_obat';
import { stok_obat } from '../../database/schema/stok_obat';
import { eq, desc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    // Join master_obat dengan stok_obat, ambil stok_akhir terbaru per obat
    // Ambil semua master_obat
    const obatList = await db.select().from(master_obat);
    // Untuk setiap obat, ambil stok_akhir terbaru
    const result = await Promise.all(
      obatList.map(async (obat) => {
        const stok = await db
          .select({
            stok_akhir: stok_obat.stok_akhir,
            tanggal_update: stok_obat.tanggal_update,
          })
          .from(stok_obat)
          .where(eq(stok_obat.obat_id, obat.id))
          .orderBy(desc(stok_obat.tanggal_update))
          .limit(1);
        return {
          ...obat,
          stok_akhir: stok[0]?.stok_akhir ?? 0,
          tanggal_update: stok[0]?.tanggal_update ?? null,
        };
      })
    );
    return { success: true, data: result };
  }

  if (method === 'POST') {
    const body = await readBody(event);
    const inserted = await db.insert(master_obat).values(body).returning();
    return { success: true, data: inserted[0] };
  }

  if (method === 'PUT') {
    const body = await readBody(event);
    if (!body.id) return { success: false, message: 'ID is required' };
    const updated = await db.update(master_obat).set(body).where(eq(master_obat.id, body.id)).returning();
    return { success: true, data: updated[0] };
  }

  if (method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) return { success: false, message: 'ID is required' };
    await db.delete(master_obat).where(eq(master_obat.id, body.id));
    return { success: true };
  }

  return { success: false, message: 'Method not allowed' };
});
