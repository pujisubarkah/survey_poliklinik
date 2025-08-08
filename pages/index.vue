<!-- pages/index.vue -->
<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
    <h1 class="text-3xl sm:text-4xl font-bold mb-6 text-center">Selamat Datang di Survey Kepuasan Pengunjung Poliklinik LAN</h1>
    <p class="text-lg sm:text-xl text-gray-700 mb-8 text-center max-w-xl">
      Terima kasih telah bersedia berpartisipasi dalam survey ini. Pendapat Anda sangat berarti untuk meningkatkan kualitas pelayanan kami.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 items-center">
      <NuxtLink to="/form">
        <button class="btn btn-primary btn-lg">Mulai Survey</button>
      </NuxtLink>
      <NuxtLink to="/login">
        <button class="btn btn-secondary btn-lg">Login Admin</button>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
// Halaman selamat datang, tombol menuju /form
</script>
