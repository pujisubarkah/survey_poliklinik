<!-- pages/login.vue -->
<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600">
    
    <!-- Header -->
    <header class="w-full p-4">
      <div class="flex items-center justify-between w-full">
        <!-- Left Side - 2 Logo Images -->
        <div class="flex items-center gap-4">
          <img src="/berakhlak.png" alt="Berakhlak" class="h-10 sm:h-12 w-auto opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-105">
          <img src="/germas.png" alt="Germas" class="h-10 sm:h-12 w-auto opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-105">
        </div>
        <!-- Right Side - 2 Logo Images -->
        <div class="flex items-center gap-4">
          <img src="/lanri_.png" alt="LAN RI" class="h-10 sm:h-12 w-auto opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-105">
          <img src="/SIMpel.png" alt="SIMpel" class="h-10 sm:h-12 w-auto opacity-90 hover:opacity-100 transition-all duration-300 hover:scale-105">
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col items-center justify-center p-8">
      <!-- Main Container -->
      <div class="flex w-full max-w-2xl h-96 rounded-[30px] bg-white/20 backdrop-blur-sm border border-white/30 relative">
        <!-- Hospital Info -->
        <div class="w-1/2 relative flex flex-col items-start justify-center">
          <div class="absolute inset-0 rounded-2xl bg-blue-900/40 backdrop-blur-[2px] z-0"></div>
          <div class="relative z-10 pl-6 pr-2 py-10 text-white text-left flex flex-col items-start w-full" style="font-family:Alliance, Nunito, sans-serif;">
            <img src="/lanri_.png" alt="Logo LAN RI" class="h-[70px] mb-4 self-start drop-shadow-lg" />
            <div class="mt-4 w-full">
              <div class="text-xl font-bold mb-2 leading-normal" style="white-space:normal;">KLINIK LAN</div>
              <div class="mb-2"><i class="fas fa-street-view mr-2"></i>Jl. Veteran No. 10 Jakarta Pusat</div>
              <div class="mb-2"><i class="fas fa-phone mr-2"></i>1111 / <i class="fas fa-fax mr-1"></i>111</div>
              <div class="mb-2"><i class="fas fa-envelope mr-2"></i>cs@rs-simpel.com</div>
              <div class="mb-2"><i class="fas fa-globe mr-2"></i>simgos.kemkes.go.id</div>
            </div>
          </div>
        </div>
        <!-- Login Form -->
        <div class="absolute left-1/2 -translate-x-1/2 md:left-[350px] md:translate-x-0 top-[-15px] w-[350px] h-[400px] bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center" style="box-shadow: 0 8px 32px 0 rgba(31,38,135,0.37);">
          <form @submit.prevent="handleLogin" class="space-y-4 w-full">
            <!-- Login Title -->
            <h1 class="text-2xl font-bold text-gray-800 mb-10 font-nunito">LOGIN</h1>

            <!-- Username Field -->
            <div class="relative mb-4">
              <input
                v-model="loginForm.username"
                type="text"
                name="LOGIN"
                placeholder="[Masukkan ID Pengguna Anda]"
                maxlength="50"
                required
                class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.username }"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                <i class="fas fa-user text-gray-400"></i>
              </div>
              <span v-if="errors.username" class="text-red-500 text-sm mt-1 block">
                {{ errors.username }}
              </span>
            </div>

            <!-- Password Field -->
            <div class="relative mb-4">
              <input
                v-model="loginForm.password"
                type="password"
                name="PASSWORD"
                placeholder="[Masukkan Kata Sandi Anda]"
                maxlength="50"
                required
                class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.password }"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                <i class="fas fa-lock text-gray-400"></i>
              </div>
              <span v-if="errors.password" class="text-red-500 text-sm mt-1 block">
                {{ errors.password }}
              </span>
            </div>

            <!-- Captcha removed -->

            <!-- Login Button -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-blue-600 text-white p-3 rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{{ isLoading ? 'Memproses...' : 'Masuk' }}</span>
              <i class="fas fa-angle-right" v-if="!isLoading"></i>
              <div v-if="isLoading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            </button>

            <!-- Lock Message (Hidden by default) -->
            <div v-if="lockMessage" class="text-center text-red-600 italic text-sm">
              {{ lockMessage }}
            </div>
          </form>
        </div>
      </div>
    </div>
    <footer class="w-full py-4 mt-auto">
      <div style="font-size: 14px; font-weight: bold;" class="text-center text-white drop-shadow">
        Selamat Datang di <br>
        Sistem Informasi Manajemen Klinik LAN made by Pusdatin 2025
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()

// Page meta
definePageMeta({
  layout: false // Use no layout for login page
})

// Reactive data
const loginForm = reactive({
  username: '',
  password: '',
  // captcha removed
})

const errors = reactive({
  username: '',
  password: ''
})

const isLoading = ref(false)
// captcha logic removed
const lockMessage = ref('')

// Methods
const validateForm = () => {
  // Reset errors
  errors.username = ''
  errors.password = ''

  let isValid = true

  if (!loginForm.username.trim()) {
    errors.username = 'Field ini wajib diisi'
    isValid = false
  }

  if (!loginForm.password.trim()) {
    errors.password = 'Field ini wajib diisi'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return

  isLoading.value = true

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: loginForm.username,
        password: loginForm.password
      })
    })
    const result = await res.json()

    if (!res.ok || !result.success) {
      throw new Error(result.error || 'Login gagal. Silakan coba lagi.')
    }

  // Buat slug dari nama user
  const nama = result.user.nama || result.user.username
  const slug = nama.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  // Set user data to store
  userStore.setUser(result.user)

  alert('Login berhasil!')
  await navigateTo(`/${slug}/dashboard`)
  } catch (error) {
  // showCaptcha removed
    alert(error.message)
  } finally {
    isLoading.value = false
  }
}

// refreshCaptcha removed

// SEO
useSeoMeta({
  title: 'Login - RSUP Demo SIMGOS',
  description: 'Halaman login untuk sistem SIMGOS RSUP Demo'
})
</script>

<style scoped>
/* Custom font for title */
.font-nunito {
  font-family: 'Nunito', sans-serif;
}

/* Additional styling for better visual match */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

/* Animation for loading */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Custom gradient background */
.bg-gradient-to-br {
  background: linear-gradient(135deg, #38bdf8 0%, #3b82f6 35%, #6366f1 100%);
}

/* Glassmorphism effect */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Header styling */
header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

/* Logo hover effects */
img[alt="Berakhlak"]:hover,
img[alt="Germas"]:hover,
img[alt="LAN RI"]:hover,
img[alt="SIMpel"]:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

/* Avatar hover effect */
.w-12.h-12:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
}

/* Responsive logo container */
@media (max-width: 640px) {
  .flex.items-center.gap-4 {
    gap: 0.5rem;
  }
  
  .flex.items-center.gap-4 img {
    height: 2rem;
  }
  
  .text-right {
    display: none;
  }
}

/* Responsive header */
@media (max-width: 768px) {
  header .flex.items-center.gap-4 {
    flex-wrap: wrap;
    max-width: 200px;
  }
}
</style>
