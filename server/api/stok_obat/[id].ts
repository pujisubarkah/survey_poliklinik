import { db } from '../../database';
import { stok_obat } from '../../database/schema/stok_obat';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const id = event.context.params?.id ? Number(event.context.params.id) : null;
  if (!id) {
    return { success: false, message: 'ID is required' };
  }

  // GET: detail stok obat by id
  if (method === 'GET') {
    const data = await db.select().from(stok_obat).where(eq(stok_obat.id, id));
    return { success: true, data: data[0] };
  }

  // PUT: update stok obat by id
  if (method === 'PUT') {
    const body = await readBody(event);
    console.log('PUT /api/stok_obat/[id] body:', body); // Debug log

    // Remove stok_akhir if present
    if ('stok_akhir' in body) {
      delete body.stok_akhir;
    }

    const updated = await db.update(stok_obat).set(body).where(eq(stok_obat.id, id)).returning();
    console.log('PUT /api/stok_obat/[id] updated:', updated); // Debug log
    return { success: true, data: updated[0] };
  }

  // DELETE: hapus stok obat by id
  if (method === 'DELETE') {
    await db.delete(stok_obat).where(eq(stok_obat.id, id));
    return { success: true };
  }

  return { success: false, message: 'Method not allowed' };
});
