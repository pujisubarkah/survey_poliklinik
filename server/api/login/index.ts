import { db } from '../../database';
import { users } from '../../database/schema/users';
import { eq } from 'drizzle-orm/pg-core/expressions';
import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {
  if (event.req.method !== 'POST') {
    return { error: 'Method not allowed' };
  }

  const body = await readBody(event);
  const { username, password } = body;
  if (!username || !password) {
    return { error: 'Username dan password wajib diisi' };
  }

  // Cari user berdasarkan username
  const user = await db.select().from(users).where(eq(users.username, username));
  if (!user.length) {
    return { error: 'Username tidak ditemukan' };
  }

  // Cek password hash
  if (!user[0].password) {
    return { error: 'Password tidak valid' };
  }
  const match = await bcrypt.compare(password, user[0].password as string);
  if (!match) {
    return { error: 'Password salah' };
  }

  // Jangan kirim password ke client
  const { password: _pw, ...userData } = user[0];
  return { success: true, user: userData };
});
