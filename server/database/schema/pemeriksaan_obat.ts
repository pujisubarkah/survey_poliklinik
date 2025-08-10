import { pgTable, serial, integer, varchar, timestamp, foreignKey } from 'drizzle-orm/pg-core';
import { pemeriksaan } from './pemeriksaan';
import { master_obat } from './master_obat';

export const pemeriksaan_obat = pgTable('pemeriksaan_obat', {
  id: serial('id').primaryKey(),
  pemeriksaan_id: integer('pemeriksaan_id').references(() => pemeriksaan.id, { onDelete: 'cascade' }),
  obat_id: integer('obat_id').references(() => master_obat.id, { onDelete: 'set null' }),
  nama_obat: varchar('nama_obat', { length: 128 }),
  dosis: varchar('dosis', { length: 64 }),
  jumlah: integer('jumlah'),
  stok_saat_itu: integer('stok_saat_itu'),
  created_at: timestamp('created_at').defaultNow(),
});
