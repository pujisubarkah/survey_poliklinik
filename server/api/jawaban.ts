import { db } from '@/server/database';
import { responden } from '@/server/database/schema/responden';
import { jawaban_survei } from '@/server/database/schema/jawaban_responden';


export default defineEventHandler(async (event) => {
    if (event.method === 'POST') {
        const body = await readBody(event)
        // Validasi: semua jawaban wajib terisi
        if (
            !body.jenis_kelamin ||
            !body.jenis_pasien ||
            typeof body.usia !== 'number' ||
            !body.q1 || !body.q2 || !body.q3 || !body.q4 || !body.q5
        ) {
            console.log('POST /jawaban - received invalid body:', body)
            return { success: false, message: 'Data tidak lengkap', received: body }
        }

        try {
            // Insert responden
            const [insertedResponden] = await db.insert(responden).values({
                jenis_kelamin: body.jenis_kelamin,
                jenis_pasien: body.jenis_pasien,
                usia: body.usia,
                // tanggal_submit otomatis now
            }).returning();

            // Jawaban sebagai object dari key q1-q5
            const jawabanObj = {
                'mekanisme atau prosedur untuk mendapatkan layanan di Klinik LAN?': body.q1,
                'kemampuan petugas dalam memberikan pelayanan?': body.q2,
                'kualitas sarana dan prasarana di Klinik LAN?': body.q3,
                'mendapatkan obat yang dibutuhkan sesuai sakitnya?': body.q4,
                'pelayanan Klinik LAN sudah sesuai harapan?': body.q5,
                'Saran': body.saran || ''
            };

            await db.insert(jawaban_survei).values({
                responden_id: insertedResponden.id,
                jawaban: jawabanObj,
            });

            return { success: true, data: insertedResponden };
        } catch (e) {
            console.error('POST /jawaban error:', e, '\nReceived body:', body)
            const errorMessage = e instanceof Error ? e.message : String(e);
            return { success: false, message: 'Gagal menyimpan data', error: errorMessage, received: body }
        }
    }
    return { success: false, message: 'Method not allowed' }
})

// Example initialization for identitas and q1-q5
const identitas = {
  value: {
    jenisKelamin: '',
    jenisPasien: '',
    usia: 0
  }
};
const q1 = { value: '' };
const q2 = { value: '' };
const q3 = { value: '' };
const q4 = { value: '' };
const q5 = { value: '' };

const payload = {
  jenis_kelamin: identitas.value.jenisKelamin,
  jenis_pasien: identitas.value.jenisPasien,
  usia: Number(identitas.value.usia),
  q1: q1.value,
  q2: q2.value,
  q3: q3.value,
  q4: q4.value,
  q5: q5.value,
}
