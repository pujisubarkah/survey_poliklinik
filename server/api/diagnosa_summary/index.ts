import { db } from '../../database'
import { pemeriksaan } from '../../database/schema/pemeriksaan'
import { diagnosis } from '../../database/schema/diagnosa'
import { eq, count, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  
  if (method === 'GET') {
    try {
      const query = getQuery(event)
      
      // Build query with filters
      const whereClauses = []

      if (query.tanggal_mulai && query.tanggal_akhir) {
        whereClauses.push(
          sql`${pemeriksaan.tanggal_pemeriksaan} BETWEEN ${query.tanggal_mulai} AND ${query.tanggal_akhir}`
        )
      } else if (query.tanggal_mulai) {
        whereClauses.push(sql`${pemeriksaan.tanggal_pemeriksaan} >= ${query.tanggal_mulai}`)
      } else if (query.tanggal_akhir) {
        whereClauses.push(sql`${pemeriksaan.tanggal_pemeriksaan} <= ${query.tanggal_akhir}`)
      }

      if (query.status) {
        whereClauses.push(eq(pemeriksaan.status, String(query.status)))
      }

      // Execute summary query grouped by diagnosis
      const { and } = await import('drizzle-orm')
      const result = await db
        .select({
          diagnosis_id: pemeriksaan.diagnosis_id,
          kode_icd: diagnosis.kode_icd,
          nama_diagnosa: diagnosis.nama_diagnosa,
          kategori_diagnosa: diagnosis.kategori,
          total_kasus: count(pemeriksaan.id).as('total_kasus'),
          // Persentase akan dihitung di frontend atau query terpisah
        })
        .from(pemeriksaan)
        .leftJoin(diagnosis, eq(pemeriksaan.diagnosis_id, diagnosis.id))
        .where(whereClauses.length ? and(...whereClauses) : undefined)
        .groupBy(
          pemeriksaan.diagnosis_id,
          diagnosis.kode_icd,
          diagnosis.nama_diagnosa,
          diagnosis.kategori
        )
        .orderBy(sql`total_kasus DESC`)

      // Hitung total keseluruhan untuk persentase
      const totalKeseluruhan = result.reduce((sum, item) => sum + Number(item.total_kasus), 0)

      // Tambahkan persentase ke setiap item
      const resultWithPercentage = result.map(item => ({
        ...item,
        total_kasus: Number(item.total_kasus),
        persentase: totalKeseluruhan > 0 ? 
          Number(((Number(item.total_kasus) / totalKeseluruhan) * 100).toFixed(2)) : 0
      }))
      
      return {
        success: true,
        data: resultWithPercentage,
        summary: {
          total_diagnosa: result.length,
          total_kasus: totalKeseluruhan,
          periode: {
            tanggal_mulai: query.tanggal_mulai || null,
            tanggal_akhir: query.tanggal_akhir || null
          }
        }
      }
    } catch (error) {
      console.error('GET /api/diagnosa_summary error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        data: []
      }
    }
  }
  
  return {
    success: false,
    message: 'Method not allowed'
  }
})