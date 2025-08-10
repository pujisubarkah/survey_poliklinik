import { pgTable, serial, integer, timestamp } from 'drizzle-orm/pg-core';

export const stok_obat = pgTable('stok_obat', {
  id: serial('id').primaryKey(),
  obat_id: integer('obat_id').notNull(),
  stok_awal: integer('stok_awal').notNull(),
  stok_masuk: integer('stok_masuk').notNull(),
  stok_keluar: integer('stok_keluar').notNull(),
  tanggal_update: timestamp('tanggal_update', { withTimezone: false }).notNull().defaultNow(),
  stok_akhir: integer('stok_akhir').notNull(),
});
