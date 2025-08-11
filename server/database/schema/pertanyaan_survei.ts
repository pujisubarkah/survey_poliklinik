import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const pertanyaan_survei = pgTable('pertanyaan_survei', {
  id: serial('id').primaryKey(),
  pertanyaan: text('pertanyaan').notNull(),
  tipe: varchar('tipe', { length: 32 }).notNull(),
});
