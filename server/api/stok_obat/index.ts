import { db } from '../../database';
import { stok_obat } from '../../database/schema/stok_obat';
import { eq, sql } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const url = event.node.req.url || '';

  // POST /api/stok_obat/masuk
  if (method === 'POST' && url.includes('/masuk')) {
    const body = await readBody(event);
    const stok_akhir = (body.stok_awal || 0) + (body.stok_masuk || 0);
    const inserted = await db.insert(stok_obat).values({
      ...body,
      stok_keluar: 0,
      stok_akhir,
      tanggal_update: new Date(),
    }).returning();
    return { success: true, data: inserted[0] };
  }


  // GET: histori stok
  if (method === 'GET') {
    const data = await db.select().from(stok_obat);
    return { success: true, data };
  }

  return { success: false, message: 'Method not allowed' };
});
