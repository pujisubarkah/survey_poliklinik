<template>
  <div class="min-h-screen overflow-y-auto bg-gray-100 py-6 px-4">
    <div class="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-10">
      <h2 class="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center">
        Isikan kepuasan anda terhadap pelayanan Poliklinik LAN
      </h2>
      <form v-if="!submitted" @submit.prevent="handleSubmit">
        <div v-for="(q, qIdx) in questions" :key="qIdx" class="mb-6">
          <label class="block mb-2 text-sm sm:text-lg font-semibold break-words">
            {{ q }}
          </label>
          <div class="flex flex-col sm:grid sm:grid-cols-5 place-items-center gap-2 sm:gap-4">
            <button
              v-for="(emoji, idx) in emojis"
              :key="idx"
              type="button"
              class="flex flex-col items-center justify-center transition-all hover:scale-110 w-full"
              :class="selectedKepuasan[qIdx] === idx + 1 ? 'ring-4 ring-primary rounded-xl' : ''"
              @click="setKepuasan(qIdx, idx + 1)"
            >
              <span class="text-4xl sm:text-5xl">{{ emoji }}</span>
              <span class="text-xs sm:text-sm font-medium mt-1 text-center">{{ emojiLabels[idx] }}</span>
            </button>
          </div>
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

const emojis = ['😠', '🙁', '😐', '🙂', '😄']
const emojiLabels = [
  'Sangat Tidak Puas',
  'Tidak Puas',
  'Biasa Saja',
  'Puas',
  'Sangat Puas'
]
const questions = [
  'Bagaimana pendapat Anda tentang keramahan petugas?',
  'Bagaimana penilaian Anda terhadap kebersihan tempat?',
  'Apakah pelayanan kami sudah cukup cepat?'
]
const selectedKepuasan = ref(Array(questions.length).fill(0))
const submitted = ref(false)

function setKepuasan(idx, val) {
  selectedKepuasan.value[idx] = val
}

function handleSubmit() {
  if (selectedKepuasan.value.includes(0)) {
    alert('Harap isi semua pertanyaan terlebih dahulu!')
    return
  }
  submitted.value = true
}
</script>
