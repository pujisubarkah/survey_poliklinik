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
    body.tanggal_update = new Date();
    const updated = await db.update(stok_obat).set(body).where(eq(stok_obat.id, id)).returning();
    return { success: true, data: updated[0] };
  }

  // DELETE: hapus stok obat by id
  if (method === 'DELETE') {
    await db.delete(stok_obat).where(eq(stok_obat.id, id));
    return { success: true };
  }

  return { success: false, message: 'Method not allowed' };
});
