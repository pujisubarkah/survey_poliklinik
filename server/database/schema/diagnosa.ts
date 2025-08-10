import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const diagnosis = pgTable('diagnosis', {
  id: serial('id').primaryKey(),
  kode_icd: varchar('kode_icd', { length: 50 }).notNull(),
  nama_diagnosa: varchar('nama_diagnosa', { length: 255 }).notNull(),
  kategori: varchar('kategori', { length: 100 }).notNull(),
});
