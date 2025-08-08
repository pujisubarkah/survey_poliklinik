<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
    <h1 class="text-2xl font-bold mb-4">QR Code Halaman Survei</h1>
    <canvas ref="canvasRef"></canvas>
    <p class="mt-4 text-center text-gray-600 break-all">{{ surveyURL }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import QRCode from 'qrcode'

definePageMeta({
  layout: 'admin'
})

const canvasRef = ref(null)
const surveyURL = 'https://surveypoliklinik.netlify.app' // Ganti dengan domain real-mu

onMounted(() => {
  if (canvasRef.value) {
    QRCode.toCanvas(canvasRef.value, surveyURL, {
      width: 300
    })
  }
})
</script>
