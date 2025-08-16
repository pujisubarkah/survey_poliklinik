import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const responden = pgTable('responden', {
  id: serial('id').primaryKey(),
  tanggal_submit: timestamp('tanggal_submit', { withTimezone: true }).notNull().defaultNow(),
  jenis_kelamin: varchar('jenis_kelamin', { length: 20 }).notNull(),
  jenis_pasien: varchar('jenis_pasien', { length: 30 }).notNull(),
  usia: integer('usia').notNull(),
});
