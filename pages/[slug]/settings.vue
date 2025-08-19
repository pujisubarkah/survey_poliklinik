<!-- pages/admin/settings.vue -->
<template>
  <div>
    <!-- Header Section -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Pengaturan Keamanan</h2>
      <p class="text-gray-600">Ganti password akun admin Anda di sini.</p>
    </div>

    <!-- Security Settings Tab Only -->
    <div class="bg-white rounded-lg shadow p-6 max-w-xl mx-auto">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Ubah Password</h3>
      <div class="space-y-6">
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Password Lama</label>
            <input
              v-model="passwordForm.oldPassword"
              type="password"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru</label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
          <div>
            <button
              @click="changePassword"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors w-full"
            >
              Ubah Password
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

definePageMeta({
  layout: 'admin'
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const changePassword = async () => {
  if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
    alert('Mohon lengkapi semua field password')
    return
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    alert('Konfirmasi password tidak sesuai')
    return
  }
  if (passwordForm.newPassword.length < 6) {
    alert('Password minimal 6 karakter')
    return
  }

  try {
    const res = await $fetch('/api/admin/ganti-password', {
      method: 'POST',
      body: {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      }
    })
    if (res.success) {
      alert('Password berhasil diubah')
      passwordForm.oldPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
    } else {
      alert(res.message || 'Gagal mengubah password')
    }
  } catch (e) {
    alert('Terjadi error saat mengubah password')
  }
}
</script>

<style scoped>
input:focus {
  outline: none;
  box-shadow: 0 0 0 2px #3B82F6;
}
.bg-white {
  transition: box-shadow 0.2s ease-in-out;
}
.bg-white:hover {
  box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.1);
}
</style>
