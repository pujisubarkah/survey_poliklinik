import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 255 }),
  password: varchar('password', { length: 255 }),
  email: varchar('email', { length: 255 }),
  nama: varchar('nama', { length: 255 }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
