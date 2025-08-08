import { pgTable, serial, varchar, text, date } from 'drizzle-orm/pg-core';

export const pegawai_detail = pgTable('pegawai_detail', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }),
  unit_kerja: varchar('unit_kerja', { length: 255 }),
  status_kepegawaian: varchar('status_kepegawaian', { length: 255 }),
  alamat: text('alamat'),
  pendidikan: varchar('pendidikan', { length: 255 }),
  telp: varchar('telp', { length: 255 }),
  tanggal_lahir: date('tanggal_lahir'),
  jenis_kelamin: varchar('jenis_kelamin', { length: 50 }),
  nm_goldar: varchar('nm_goldar', { length: 10 }),
  peg_cpns_tmt: date('peg_cpns_tmt'),
  nip: varchar('nip', { length: 30 })
});
