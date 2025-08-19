import { db } from '../../database';
import { stok_obat } from '../../database/schema/stok_obat';
import { eq, sql } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const url = event.node.req.url || '';

  // POST /api/stok_obat/masuk
  if (method === 'POST' && url.includes('/masuk')) {
    const body = await readBody(event);
    // Validasi minimal
    if (!body.obat_id || body.stok_masuk == null || body.stok_awal == null) {
      return { success: false, message: 'Data tidak lengkap', received: body };
    }

    const stok_akhir = (body.stok_awal || 0) + (body.stok_masuk || 0) - (body.stok_keluar || 0);
    const inserted = await db.insert(stok_obat).values({
      obat_id: body.obat_id,
      stok_awal: body.stok_awal,
      stok_masuk: body.stok_masuk,
      stok_keluar: body.stok_keluar || 0,
      tanggal_update: new Date(),
      stok_akhir,
    }).returning();

    return { success: true, data: inserted[0] };
  }



  return { success: false, message: 'Method not allowed' };
});
