import { pemeriksaan } from '../../database/schema/pemeriksaan';
import { pemeriksaan_obat } from '../../database/schema/pemeriksaan_obat';
// Update the import path below if the file is located elsewhere, for example:
import { diagnosis } from '../../database/schema/diagnosa';
// Or, if the file does not exist, create 'diagnosis.ts' in '../../database/schema/' with the appropriate exports.
import { pegawai } from '../../database/schema/pegawai';
import { unitkerja } from '../../database/schema/unitkerja';
import { db } from '../../database';
import { inArray, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id; // Ambil id dari URL
  if (!id) {
    return { success: false, message: 'ID tidak ditemukan di URL' };
  }

  // Ambil data pemeriksaan berdasarkan id
  const data = await db.select().from(pemeriksaan).where(eq(pemeriksaan.id, Number(id)));

  if (!data.length) {
    return { success: false, message: 'Data tidak ditemukan' };
  }

  const p = data[0];

  // Join diagnosis, pegawai, unit kerja
  const diagnosa = p.diagnosis_id
    ? await db.select().from(diagnosis).where(eq(diagnosis.id, p.diagnosis_id)).then(res => res[0])
    : null;
  const peg = p.pasien_nip
    ? await db.select().from(pegawai).where(eq(pegawai.nip, p.pasien_nip)).then(res => res[0])
    : null;
  const unit = peg && peg.unit_kerja_id
    ? await db.select().from(unitkerja).where(eq(unitkerja.id, peg.unit_kerja_id)).then(res => res[0])
    : null;

  // Ambil obat-obatan
  const obat = await db.select().from(pemeriksaan_obat).where(eq(pemeriksaan_obat.pemeriksaan_id, p.id));

  // Gabungkan hasil
  const result = {
    ...p,
    nama_diagnosa: diagnosa ? diagnosa.nama_diagnosa : null,
    kode_icd: diagnosa ? diagnosa.kode_icd : null,
    pasien: peg
      ? {
          nama: peg.nama,
          unit_kerja: unit ? unit.nama_unit_kerja : null,
        }
      : null,
    obat: obat
  };

  return { success: true, data: result };
});
