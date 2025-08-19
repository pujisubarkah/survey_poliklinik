import { db } from '~/server/database'
import { users } from '~/server/database/schema/users'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const userId = event.context.user?.id // pastikan user id dari session

  if (!userId) return { success: false, message: 'Unauthorized' }

  // Ambil user
  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1)
  if (!user[0]) return { success: false, message: 'User tidak ditemukan' }

  // Verifikasi password lama
  if (!user[0].password || typeof user[0].password !== 'string') {
    return { success: false, message: 'Password tidak valid' }
  }
  const valid = await bcrypt.compare(body.oldPassword, user[0].password)
  if (!valid) return { success: false, message: 'Password lama salah' }

  // Hash password baru
  const newHash = await bcrypt.hash(body.newPassword, 10)
  await db.update(users).set({ password: newHash }).where(eq(users.id, userId))

  return { success: true }
})