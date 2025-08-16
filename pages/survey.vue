<template>
  <div class="min-h-screen overflow-y-auto bg-gray-100 py-6 px-4">
    <div class="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-10">
      <h2 class="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center">
        Survey Pelayanan Klinik LAN
      </h2>
      <form v-if="!submitted" @submit.prevent="handleSubmit">
        <!-- Identitas Responden (Form Layout) -->
        <div class="mb-8">
          <h3 class="text-lg font-bold mb-4">Identitas Responden</h3>
          <div class="grid grid-cols-1 gap-5">
            <div>
              <label class="block mb-2 font-medium">Jenis Kelamin <span class="text-red-500">*</span></label>
              <div class="flex gap-6">
                <label class="inline-flex items-center">
                  <input type="radio" v-model="identitas.jenisKelamin" value="Pria" required class="form-radio" />
                  <span class="ml-2">Pria</span>
                </label>
                <label class="inline-flex items-center">
                  <input type="radio" v-model="identitas.jenisKelamin" value="Wanita" required class="form-radio" />
                  <span class="ml-2">Wanita</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block mb-2 font-medium">Jenis Pasien <span class="text-red-500">*</span></label>
              <select v-model="identitas.jenisPasien" required class="form-select w-full">
                <option value="" disabled>Pilih Jenis Pasien</option>
                <option value="Pegawai">Pegawai</option>
                <option value="PPNPN">PPNPN</option>
                <option value="Peserta Pelatihan">Peserta Pelatihan</option>
                <option value="Tamu">Tamu</option>
              </select>
            </div>
            <div>
              <label class="block mb-2 font-medium">Usia <span class="text-red-500">*</span></label>
              <input type="number" v-model="identitas.usia" min="1" max="120" required class="form-input w-full" placeholder="Masukkan usia Anda" />
            </div>
          </div>
        </div>

        <div v-for="(q, qIdx) in questions" :key="qIdx" class="mb-6">
          <label class="block mb-2 text-sm sm:text-lg font-semibold break-words">
            {{ q.text }}
          </label>
          <!-- Likert -->
          <div v-if="q.type === 'likert'" class="flex flex-col sm:grid sm:grid-cols-5 place-items-center gap-2 sm:gap-4">
            <button
              v-for="(opt, idx) in q.options"
              :key="idx"
              type="button"
              class="flex flex-col items-center justify-center transition-all hover:scale-110 w-full"
              :class="answers[qIdx] === opt.label ? 'ring-4 ring-primary rounded-xl' : ''"
              @click="setLikert(qIdx, opt.label)"
            >
              <span class="text-5xl">{{ opt.emoji }}</span>
              <span class="text-xs sm:text-sm font-medium mt-1 text-center">{{ opt.label }}</span>
            </button>
          </div>
          <!-- Yes/No -->
          <div v-else-if="q.type === 'yesno'" class="flex gap-6 mt-2 justify-center">
            <button
              v-for="(opt, idx) in q.options"
              :key="idx"
              type="button"
              class="flex flex-col items-center justify-center transition-all hover:scale-110 w-24"
              :class="answers[qIdx] === opt.label ? 'ring-4 ring-primary rounded-xl' : ''"
              @click="setYesNo(qIdx, opt.label)"
            >
              <span class="text-5xl">{{ opt.emoji }}</span>
              <span class="text-xs sm:text-sm font-medium mt-1 text-center">{{ opt.label }}</span>
            </button>
          </div>
        </div>

        <!-- Saran & Kritik -->
        <div class="mb-8">
          <label class="block mb-2 text-sm sm:text-lg font-semibold break-words">
            Tuliskan Saran maupun Kritik Anda terhadap layanan yang Anda terima di Klinik LAN
          </label>
          <textarea
            v-model="openAnswer"
            rows="3"
            class="form-textarea w-full"
            placeholder="Tulis saran atau kritik Anda di sini..."
          ></textarea>
        </div>

        <button type="submit" class="btn btn-primary btn-md sm:btn-lg w-full mt-4 sm:mt-6">
          Kirim
        </button>
      </form>
      <div v-else class="flex flex-col items-center justify-center py-16">
        <span class="text-5xl mb-4">🎉</span>
        <p class="text-2xl font-bold text-green-700 mb-2 text-center">Terima kasih atas partisipasi Anda!</p>
        <p class="text-lg text-gray-700 text-center">Jawaban Anda telah kami terima.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const likertOptions = [
  [ // Q1: Mekanisme/prosedur
    { label: 'Sangat Sulit', emoji: '😠' },
    { label: 'Sulit', emoji: '🙁' },
    { label: 'Cukup Mudah', emoji: '😐' },
    { label: 'Mudah', emoji: '🙂' },
    { label: 'Sangat Mudah', emoji: '😄' }
  ],
  [ // Q2: Kompetensi petugas
    { label: 'Sangat Tidak Kompeten', emoji: '😠' },
    { label: 'Tidak Kompeten', emoji: '🙁' },
    { label: 'Cukup Kompeten', emoji: '😐' },
    { label: 'Kompeten', emoji: '🙂' },
    { label: 'Sangat Kompeten', emoji: '😄' }
  ],
  [ // Q3: Sarana/prasarana
    { label: 'Sangat Buruk', emoji: '😠' },
    { label: 'Buruk', emoji: '🙁' },
    { label: 'Cukup Nyaman', emoji: '😐' },
    { label: 'Nyaman', emoji: '🙂' },
    { label: 'Sangat Nyaman', emoji: '😄' }
  ],
  [ // Q5: Harapan
    { label: 'Sangat Tidak Sesuai', emoji: '😠' },
    { label: 'Tidak Sesuai', emoji: '🙁' },
    { label: 'Cukup Sesuai', emoji: '😐' },
    { label: 'Sesuai', emoji: '🙂' },
    { label: 'Sangat Sesuai', emoji: '😄' }
  ]
]

const questions = [
  {
    text: 'Bagaimana pendapat Anda tentang mekanisme atau prosedur untuk mendapatkan layanan di Klinik LAN?',
    type: 'likert',
    options: likertOptions[0]
  },
  {
    text: 'Bagaimana pendapat Anda tentang kemampuan petugas dalam memberikan pelayanan?',
    type: 'likert',
    options: likertOptions[1]
  },
  {
    text: 'Bagaimana pendapat Anda tentang kualitas sarana dan prasarana di Klinik LAN?',
    type: 'likert',
    options: likertOptions[2]
  },
  {
    text: 'Setelah dilakukan pemeriksaan (oleh dokter klinik) dan dinyatakan membutuhkan obat, apakah Anda mendapatkan obat yang dibutuhkan sesuai sakitnya?',
    type: 'yesno',
    options: [
      { label: 'Ya', emoji: '👍' },
      { label: 'Tidak', emoji: '👎' }
    ]
  },
  {
    text: 'Menurut Anda apakah pelayanan Klinik LAN sudah sesuai harapan?',
    type: 'likert',
    options: likertOptions[3]
  }
]

const answers = ref([
  '', '', '', '', '', ''
])
const submitted = ref(false)
const identitas = ref({
  jenisKelamin: '',
  jenisPasien: '',
  usia: ''
})

const q1 = ref('')
const q2 = ref('')
const q3 = ref('')
const q4 = ref('')
const q5 = ref('')

// Untuk open question (saran/kritik), misal:
const openAnswer = ref('')

function setLikert(idx, val) {
  answers.value[idx] = val
  if (idx === 0) q1.value = val
  if (idx === 1) q2.value = val
  if (idx === 2) q3.value = val
  if (idx === 4) q5.value = val
}
function setYesNo(idx, val) {
  answers.value[idx] = val
  if (idx === 3) q4.value = val
}
function setOpen(idx, val) { answers.value[idx] = val }

async function handleSubmit() {
  if (!identitas.value.jenisKelamin || !identitas.value.jenisPasien || !identitas.value.usia) {
    alert('Harap isi semua data identitas responden!')
    return
  }
  for (let i = 0; i < questions.length - 1; i++) {
    if (!answers.value[i]) {
      alert('Harap isi semua pertanyaan survei!')
      return
    }
  }
  if (!q1.value || !q2.value || !q3.value || !q4.value || !q5.value) {
    alert('Harap isi semua pertanyaan survei!');
    return;
  }

  const payload = {
    tanggal_submit: new Date().toISOString(),
    jenis_kelamin: identitas.value.jenisKelamin,
    jenis_pasien: identitas.value.jenisPasien,
    usia: Number(identitas.value.usia),
    q1: q1.value,
    q2: q2.value,
    q3: q3.value,
    q4: q4.value,
    q5: q5.value,
    saran: openAnswer.value
  }

  try {
    const res = await $fetch('/api/jawaban', {
      method: 'POST',
      body: payload
    })
    if (res?.success) {
      submitted.value = true
    } else {
      // Tampilkan pesan error detail dari backend
      let msg = res.message || 'Gagal mengirim survei, silakan coba lagi nanti.'
      if (res.received) {
        msg += '\n\nData yang dikirim:\n' + JSON.stringify(res.received, null, 2)
      }
      alert(msg)
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Terjadi kesalahan, silakan coba lagi nanti.')
  }
}
</script>
