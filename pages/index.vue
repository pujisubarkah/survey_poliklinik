<!-- pages/form.vue -->
<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
    <h1 class="text-2xl font-bold mb-8 text-center">Survei Kepuasan Pengunjung</h1>

    <form @submit.prevent="handleSubmit" class="space-y-6 w-full max-w-xl">
      <div v-for="(question, index) in questions" :key="index">
        <p class="font-semibold mb-2">{{ index + 1 }}. {{ question }}</p>
        <div class="flex gap-4 text-3xl">
          <span v-for="(emoji, score) in emojis" :key="score"
            @click="selectAnswer(index, score + 1)"
            class="cursor-pointer hover:scale-125 transition-transform"
            :class="{
              'opacity-100': answers[index] === score + 1,
              'opacity-40': answers[index] !== score + 1
            }"
          >
            {{ emoji }}
          </span>
        </div>
      </div>

      <button type="submit" class="btn btn-primary w-full mt-4">Kirim Jawaban</button>
    </form>

    <div v-if="submitted" class="text-green-600 mt-6 text-lg font-semibold">
      🎉 Terima kasih atas partisipasi Anda!
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const questions = [
  'Bagaimana pendapat Anda tentang keramahan petugas?',
  'Bagaimana penilaian Anda terhadap kebersihan tempat?',
  'Apakah pelayanan kami sudah cukup cepat?'
]

const emojis = ['😠', '🙁', '😐', '🙂', '😄'] // nilai 1 - 5

const answers = ref(Array(questions.length).fill(0))
const submitted = ref(false)

function selectAnswer(questionIndex, rating) {
  answers.value[questionIndex] = rating
}

function handleSubmit() {
  if (answers.value.includes(0)) {
    alert('Harap isi semua pertanyaan ya, Kak!')
    return
  }
  console.log('Jawaban:', answers.value)
  submitted.value = true
}
</script>
