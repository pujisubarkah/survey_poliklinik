import { db } from '../../database';
import { pegawai } from '../../database/schema/pegawai';
import { pegawai_detail } from '../../database/schema/pegawai_detail';
import { eq } from 'drizzle-orm/pg-core/expressions';
import { unitkerja } from '../../database/schema/unitkerja';

export default defineEventHandler(async (event) => {
  if (event.req.method === 'GET') {
    // Ambil semua data pegawai tanpa created_at
    const data = await db
      .select({
        id: pegawai.id,
        nip: pegawai.nip,
        nama: pegawai.nama,
        unit_kerja_id: pegawai.unit_kerja_id,
        jabatan: pegawai.jabatan,
        golongan: pegawai.golongan,
        eselon: pegawai.eselon,
        nama_unit_kerja: unitkerja.nama_unit_kerja,
        // join ke pegawai_detail
        detail: pegawai_detail
      })
      .from(pegawai)
      .leftJoin(unitkerja, eq(pegawai.unit_kerja_id, unitkerja.id))
      .leftJoin(pegawai_detail, eq(pegawai.nip, pegawai_detail.nip));
    // Tambahkan field foto berdasarkan nip
    const withFoto = data.map(p => ({
      ...p,
      foto: p.nip ? `https://dtjrketxxozstcwvotzh.supabase.co/storage/v1/object/public/foto_pegawai/${p.nip}.jpg` : null
    }))
    return withFoto;
  }
  if (event.req.method === 'POST') {
    const body = await readBody(event);
    // created_at tidak perlu diisi manual
    const { created_at, ...insertData } = body;
    const inserted = await db.insert(pegawai).values(insertData).returning({
      id: pegawai.id,
      nip: pegawai.nip,
      nama: pegawai.nama,
      unit_kerja_id: pegawai.unit_kerja_id,
      jabatan: pegawai.jabatan,
      golongan: pegawai.golongan,
      eselon: pegawai.eselon
    });
    return inserted[0];
  }
  return { error: 'Method not allowed' };
});
