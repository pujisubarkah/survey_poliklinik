import { db } from '../../database';
import { responden } from '../../database/schema/responden';
import { jawaban_survei } from '../../database/schema/jawaban_responden';
import { eq } from 'drizzle-orm';


export default defineEventHandler(async (event) => {
	if (event.method === 'GET') {
		try {
			const data = await db
				.select({
					id: responden.id,
					tanggal_submit: responden.tanggal_submit,
					jenis_kelamin: responden.jenis_kelamin,
					jenis_pasien: responden.jenis_pasien,
					usia: responden.usia,
					jawaban: jawaban_survei.jawaban
				})
				.from(responden)
				.leftJoin(jawaban_survei, eq(jawaban_survei.responden_id, responden.id));
			return { success: true, data };
		} catch (e) {
			const errorMessage = e instanceof Error ? e.message : String(e);
			return { success: false, message: 'Gagal mengambil data', error: errorMessage };
		}
	}
	return { success: false, message: 'Method not allowed' }
});
