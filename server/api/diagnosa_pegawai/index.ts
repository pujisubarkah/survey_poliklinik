import { db } from '../../database'
import { pemeriksaan } from '../../database/schema/pemeriksaan'
import { pegawai_detail } from '../../database/schema/pegawai_detail'
import { diagnosis } from '../../database/schema/diagnosa'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  
  if (method === 'GET') {
    try {
      const query = getQuery(event)
      
      // Build query with filters
      const whereClauses = []

      if (query.pasien_nip) {
        whereClauses.push(eq(pemeriksaan.pasien_nip, String(query.pasien_nip)))
      }
      if (query.tanggal_pemeriksaan) {
        whereClauses.push(eq(pemeriksaan.tanggal_pemeriksaan, String(query.tanggal_pemeriksaan)))
      }
      if (query.status) {
        whereClauses.push(eq(pemeriksaan.status, String(query.status)))
      }

      // Execute query with JOIN to pegawai_detail and diagnosis
      const { and } = await import('drizzle-orm')
      const result = await db
        .select({
          // Pemeriksaan fields
          id: pemeriksaan.id,
          pasien_nip: pemeriksaan.pasien_nip,
          tanggal_pemeriksaan: pemeriksaan.tanggal_pemeriksaan,
          waktu_pemeriksaan: pemeriksaan.waktu_pemeriksaan,
          jenis_pemeriksaan: pemeriksaan.jenis_pemeriksaan,
          keluhan: pemeriksaan.keluhan,
          diagnosis_id: pemeriksaan.diagnosis_id,
          tindakan: pemeriksaan.tindakan,
          dokter: pemeriksaan.dokter,
          status: pemeriksaan.status,
          // Pegawai detail fields
          nama_pegawai: pegawai_detail.nip,
          email: pegawai_detail.email,
          unit_kerja: pegawai_detail.unit_kerja,
          status_kepegawaian: pegawai_detail.status_kepegawaian,
          alamat: pegawai_detail.alamat,
          pendidikan: pegawai_detail.pendidikan,
          telp: pegawai_detail.telp,
          tanggal_lahir: pegawai_detail.tanggal_lahir,
          jenis_kelamin: pegawai_detail.jenis_kelamin,
          nm_goldar: pegawai_detail.nm_goldar,
          peg_cpns_tmt: pegawai_detail.peg_cpns_tmt,
          // Diagnosis fields
          kode_icd: diagnosis.kode_icd,
          nama_diagnosa: diagnosis.nama_diagnosa,
          kategori_diagnosa: diagnosis.kategori
        })
        .from(pemeriksaan)
        .leftJoin(pegawai_detail, eq(pemeriksaan.pasien_nip, pegawai_detail.nip))
        .leftJoin(diagnosis, eq(pemeriksaan.diagnosis_id, diagnosis.id))
        .where(whereClauses.length ? and(...whereClauses) : undefined)
      
      return {
        success: true,
        data: result,
        total: result.length
      }
    } catch (error) {
      console.error('GET /api/diagnosa_pegawai error:', error)
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