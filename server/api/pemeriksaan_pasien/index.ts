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
  // Ambil query parameter
  const pasienNip = getQuery(event).pasien_nip;

  // Ambil semua pemeriksaan, atau filter by pasien_nip jika ada
  let data;
  if (pasienNip) {
    data = await db.select().from(pemeriksaan).where(eq(pemeriksaan.pasien_nip, String(pasienNip)));
  } else {
    data = await db.select().from(pemeriksaan);
  }

  // Ambil semua id yang dibutuhkan untuk join
  const diagnosisIds = data.map(p => p.diagnosis_id).filter(Boolean);
  const pasienNips = data.map(p => p.pasien_nip).filter(Boolean);

  // Ambil data diagnosis, pegawai, dan unitkerja
  const diagnosaList = diagnosisIds.length
    ? await db.select().from(diagnosis).where(inArray(diagnosis.id, diagnosisIds))
    : [];
  const pegawaiList = pasienNips.length
    ? await db.select().from(pegawai).where(inArray(pegawai.nip, pasienNips))
    : [];
  const unitKerjaIds = pegawaiList.map(p => p.unit_kerja_id).filter((id): id is number => id !== null && id !== undefined);
  const unitKerjaList = unitKerjaIds.length
    ? await db.select().from(unitkerja).where(inArray(unitkerja.id, unitKerjaIds))
    : [];

  // Ambil obat-obatan
  const pemeriksaanIds = data.map((p) => p.id);
  let obatList: any[] = [];
  if (pemeriksaanIds.length > 0) {
    obatList = await db.select().from(pemeriksaan_obat).where(
      inArray(pemeriksaan_obat.pemeriksaan_id, pemeriksaanIds)
    );
  }

  // Gabungkan hasil join ke response
  const result = data.map((p) => {
    const diagnosa = diagnosaList.find(d => d.id === p.diagnosis_id);
    const peg = pegawaiList.find(pg => pg.nip === p.pasien_nip);
    const unit = peg ? unitKerjaList.find(u => u.id === peg.unit_kerja_id) : null;
    return {
      ...p,
      nama_diagnosa: diagnosa ? diagnosa.nama_diagnosa : null,
      kode_icd: diagnosa ? diagnosa.kode_icd : null,
      pasien: peg
        ? {
            nama: peg.nama,
            unit_kerja: unit ? unit.nama_unit_kerja : null,
          }
        : null,
      obat: obatList.filter((o) => o.pemeriksaan_id === p.id)
    };
  });

  return { success: true, data: result };
});
