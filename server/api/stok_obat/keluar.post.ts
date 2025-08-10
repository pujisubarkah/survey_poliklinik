import { db } from '../../database';
import { stok_obat } from '../../database/schema/stok_obat';
import { eq, sql } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const updated = await db
    .update(stok_obat)
    .set({
      stok_keluar: sql`${stok_obat.stok_keluar} + ${body.stok_keluar}`,
      tanggal_update: new Date(),
    })
    .where(eq(stok_obat.obat_id, body.obat_id))
    .returning();

  return { success: true, data: updated[0] };
});