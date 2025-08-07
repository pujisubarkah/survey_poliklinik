<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <h1 class="text-xl font-bold mb-6">Bagaimana pengalaman Anda hari ini?</h1>
    <div class="flex gap-6 text-5xl">
      <span @click="submit(1)">😞</span>
      <span @click="submit(2)">😐</span>
      <span @click="submit(3)">😊</span>
      <span @click="submit(4)">😁</span>
      <span @click="submit(5)">🤩</span>
    </div>
    <p v-if="submitted" class="mt-6 text-green-600">Terima kasih atas feedback Anda!</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const submitted = ref(false)

async function submit(rating) {
  submitted.value = true
  await $fetch('/api/submit-rating', {
    method: 'POST',
    body: { rating }
  })
}
</script>
