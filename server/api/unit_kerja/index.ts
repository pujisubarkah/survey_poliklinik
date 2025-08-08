import { db } from '../../database';
import { unitkerja } from '../../database/schema/unitkerja';

export default defineEventHandler(async (event) => {
  if (event.req.method === 'GET') {
    // Ambil semua data unitkerja
    const data = await db.select().from(unitkerja);
    return data;
  }
  if (event.req.method === 'POST') {
    const body = await readBody(event);
    const inserted = await db.insert(unitkerja).values(body).returning();
    return inserted[0];
  }
  return { error: 'Method not allowed' };
});
