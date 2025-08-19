import { db } from '../../database'
import { pemeriksaan } from '../../database/schema/pemeriksaan'
import { pegawai_detail } from '../../database/schema/pegawai_detail'
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

      // Execute summary query grouped by gender
      const { and } = await import('drizzle-orm')
      const result = await db
        .select({
          jenis_kelamin: pegawai_detail.jenis_kelamin,
          total: count(pemeriksaan.id).as('total')
        })
        .from(pemeriksaan)
        .leftJoin(pegawai_detail, eq(pemeriksaan.pasien_nip, pegawai_detail.nip))
        .where(whereClauses.length ? and(...whereClauses) : undefined)
        .groupBy(pegawai_detail.jenis_kelamin)

      console.log('Gender query result:', result) // Debug log

      // Format data
      const genderData = {
        laki_laki: 0,
        perempuan: 0,
        total: 0,
        persentase_laki_laki: 0,
        persentase_perempuan: 0
      }

      result.forEach(item => {
        const total = Number(item.total)
        console.log('Processing gender item:', item.jenis_kelamin, total) // Debug log
        
        if (item.jenis_kelamin === 'L') {
          genderData.laki_laki = total
        } else if (item.jenis_kelamin === 'P') {
          genderData.perempuan = total
        }
        genderData.total += total
      })

      console.log('Final gender data:', genderData) // Debug log

      // Calculate percentage
      const totalPatients = genderData.total
      genderData.persentase_laki_laki = totalPatients > 0 ? 
        Number(((genderData.laki_laki / totalPatients) * 100).toFixed(2)) : 0
      genderData.persentase_perempuan = totalPatients > 0 ? 
        Number(((genderData.perempuan / totalPatients) * 100).toFixed(2)) : 0
      
      return {
        success: true,
        data: genderData,
        summary: {
          total_pasien: totalPatients,
          periode: {
            tanggal_mulai: query.tanggal_mulai || null,
            tanggal_akhir: query.tanggal_akhir || null
          }
        }
      }
    } catch (error) {
      console.error('GET /api/gender_summary error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        data: { laki_laki: 0, perempuan: 0, total: 0 }
      }
    }
  }
  
  return {
    success: false,
    message: 'Method not allowed'
  }
})