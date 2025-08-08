import { pgTable, serial, varchar, timestamp, integer, text } from 'drizzle-orm/pg-core';

export const pegawai = pgTable('pegawai', {
	id: serial('id').primaryKey(),
	created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
	nip: varchar('nip', { length: 255 }),
	nama: varchar('nama', { length: 255 }),
	unit_kerja_id: integer('unit_kerja_id'),
	jabatan: text('jabatan'),
	golongan: varchar('golongan', { length: 255 }),
	eselon: varchar('eselon', { length: 255 }),
});
