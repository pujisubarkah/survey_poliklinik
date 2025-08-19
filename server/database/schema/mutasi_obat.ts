import { pgTable, serial, integer, varchar, text, timestamp } from 'drizzle-orm/pg-core'

export const mutasi_obat = pgTable('mutasi_obat', {
  id: serial('id').primaryKey(),
  obat_id: integer('obat_id').notNull(),
  jenis_mutasi: varchar('jenis_mutasi', { length: 20 }).notNull(),
  jumlah: integer('jumlah').notNull(),
  stok_sebelum: integer('stok_sebelum').notNull(),
  stok_sesudah: integer('stok_sesudah').notNull(),
  tanggal: timestamp('tanggal').defaultNow(),
  keterangan: text('keterangan'),
  pegawai_id: integer('pegawai_id')
})