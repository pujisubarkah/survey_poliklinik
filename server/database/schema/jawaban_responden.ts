import { pgTable, serial, integer, jsonb } from 'drizzle-orm/pg-core';

export const jawaban_responden = pgTable('jawaban_responden', {
  id: serial('id').primaryKey(),
  responden_id: integer('responden_id').notNull(),
  jawaban: jsonb('jawaban').notNull(),
});
