import { pgTable, serial, integer, jsonb } from 'drizzle-orm/pg-core';

export const jawaban_survei = pgTable('jawaban_survei', {
  id: serial('id').primaryKey(),
  responden_id: integer('responden_id').notNull(),
  jawaban: jsonb('jawaban').notNull(),
});
