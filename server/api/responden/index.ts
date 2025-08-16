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

			// Explicitly type jawaban as Record<string, string>
			const typedData = data.map(item => ({
				...item,
				jawaban: item.jawaban as Record<string, string>
			}));

			const totalResponden = typedData.length;

			// Rekap jawaban per pertanyaan (kecuali Saran)
			const recap = {
				mekanisme: {} as Record<string, number>,
				petugas: {} as Record<string, number>,
				sarana: {} as Record<string, number>,
				harapan: {} as Record<string, number>
			};

			typedData.forEach(item => {
				const j = item.jawaban || {};
				// Mekanisme/Prosedur
				const mekanisme = j['mekanisme atau prosedur untuk mendapatkan layanan di Klinik LAN?'];
				if (mekanisme) recap.mekanisme[mekanisme] = (recap.mekanisme[mekanisme] || 0) + 1;
				// Kemampuan Petugas
				const petugas = j['kemampuan petugas dalam memberikan pelayanan?'];
				if (petugas) recap.petugas[petugas] = (recap.petugas[petugas] || 0) + 1;
				// Sarana & Prasarana
				const sarana = j['kualitas sarana dan prasarana di Klinik LAN?'];
				if (sarana) recap.sarana[sarana] = (recap.sarana[sarana] || 0) + 1;
				// Kesesuaian Harapan
				const harapan = j['pelayanan Klinik LAN sudah sesuai harapan?'];
				if (harapan) recap.harapan[harapan] = (recap.harapan[harapan] || 0) + 1;
			});

			return { success: true, totalResponden, data, recap };
		} catch (e) {
			const errorMessage = e instanceof Error ? e.message : String(e);
			return { success: false, message: 'Gagal mengambil data', error: errorMessage };
		}
	}
	return { success: false, message: 'Method not allowed' }
});
