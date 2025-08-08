import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const unitkerja = pgTable('unit_kerja', {
  id: serial('id').primaryKey(),
  nama_unit_kerja: varchar('nama_unit_kerja', { length: 255 }),
});
