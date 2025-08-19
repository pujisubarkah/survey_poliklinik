import { db } from '~/server/database'
import { mutasi_obat } from '~/server/database/schema/mutasi_obat'
import { master_obat } from '~/server/database/schema/master_obat'
import { eq } from 'drizzle-orm'
import type { H3Event } from 'h3'

// GET: Ambil semua mutasi obat (bisa tambahkan filter sesuai kebutuhan)
export default defineEventHandler(async (event: H3Event) => {
  if (event.method === 'GET') {
    const query = getQuery(event)
    let where = []

    if (query.obat_id) {
      where.push(eq(mutasi_obat.obat_id, Number(query.obat_id)))
    }
    if (query.jenis_mutasi) {
      where.push(eq(mutasi_obat.jenis_mutasi, String(query.jenis_mutasi)))
    }

    const { and } = await import('drizzle-orm')
    // JOIN master_obat untuk dapatkan nama_obat
    const result = await db
      .select({
        id: mutasi_obat.id,
        obat_id: mutasi_obat.obat_id,
        jenis_mutasi: mutasi_obat.jenis_mutasi,
        jumlah: mutasi_obat.jumlah,
        stok_sebelum: mutasi_obat.stok_sebelum,
        stok_sesudah: mutasi_obat.stok_sesudah,
        tanggal: mutasi_obat.tanggal,
        keterangan: mutasi_obat.keterangan,
        pegawai_id: mutasi_obat.pegawai_id,
        nama_obat: master_obat.nama_obat
      })
      .from(mutasi_obat)
      .leftJoin(master_obat, eq(mutasi_obat.obat_id, master_obat.id))
      .where(where.length ? and(...where) : undefined)

    return { success: true, data: result }
  }

  // POST: Tambah mutasi obat baru
  if (event.method === 'POST') {
    const body = await readBody(event)
    // Validasi sederhana
    if (!body.obat_id || !body.jenis_mutasi || !body.jumlah || body.stok_sebelum === undefined || body.stok_sesudah === undefined) {
      return { success: false, message: 'Data wajib diisi' }
    }
    const inserted = await db.insert(mutasi_obat).values({
      obat_id: Number(body.obat_id),
      jenis_mutasi: String(body.jenis_mutasi),
      jumlah: Number(body.jumlah),
      stok_sebelum: Number(body.stok_sebelum),
      stok_sesudah: Number(body.stok_sesudah),
      tanggal: body.tanggal ? new Date(body.tanggal) : undefined,
      keterangan: body.keterangan || null,
      pegawai_id: body.pegawai_id ? Number(body.pegawai_id) : null
    }).returning()
    return { success: true, data: inserted }
  }

  // Method lain
  return { success: false, message: 'Method not allowed' }
})