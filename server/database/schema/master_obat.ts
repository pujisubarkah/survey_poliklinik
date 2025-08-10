import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const master_obat = pgTable('master_obat', {
  id: serial('id').primaryKey(),
  nama_obat: varchar('nama_obat', { length: 255 }).notNull(),
  kandungan_aktif: text('kandungan_aktif').notNull(),
  kategori_obat: text('kategori_obat').notNull(),
  kategori_sediaan: varchar('kategori_sediaan', { length: 255 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: false }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: false }).notNull().defaultNow(),
});
