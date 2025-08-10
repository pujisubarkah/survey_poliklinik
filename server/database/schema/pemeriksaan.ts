import { pgTable, serial, varchar, integer, date, time, text } from 'drizzle-orm/pg-core';

export const pemeriksaan = pgTable('pemeriksaan', {
  id: serial('id').primaryKey(),
  pasien_nip: varchar('pasien_nip', { length: 30 }).notNull(), // relasi ke pegawai.nip
  tanggal_pemeriksaan: date('tanggal_pemeriksaan').notNull(),
  waktu_pemeriksaan: time('waktu_pemeriksaan').notNull(),
  jenis_pemeriksaan: varchar('jenis_pemeriksaan', { length: 100 }).notNull(),
  keluhan: text('keluhan'),
  diagnosis_id: integer('diagnosis_id').notNull(), // relasi ke diagnosa.id
  tindakan: text('tindakan'),
  dokter: varchar('dokter', { length: 255 }).notNull(),
  status: varchar('status', { length: 50 }).notNull(),
});
