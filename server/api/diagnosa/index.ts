import { db } from '../../database';
import { diagnosis } from '../../database/schema/diagnosa';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    const data = await db.select().from(diagnosis);
    return { success: true, data };
  }

  if (method === 'POST') {
    const body = await readBody(event);
    const inserted = await db.insert(diagnosis).values(body).returning();
    return { success: true, data: inserted[0] };
  }

  if (method === 'PUT') {
    const body = await readBody(event);
    if (!body.id) return { success: false, message: 'ID is required' };
    const updated = await db.update(diagnosis).set(body).where(eq(diagnosis.id, body.id)).returning();
    return { success: true, data: updated[0] };
  }

  if (method === 'DELETE') {
    const body = await readBody(event);
    if (!body.id) return { success: false, message: 'ID is required' };
    await db.delete(diagnosis).where(eq(diagnosis.id, body.id));
    return { success: true };
  }

  return { success: false, message: 'Method not allowed' };
});
