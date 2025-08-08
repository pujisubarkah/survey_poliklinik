<!-- pages/admin/settings.vue -->
<template>
  <div>
    <!-- Header Section -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Pengaturan Sistem</h2>
      <p class="text-gray-600">Konfigurasi dan pengaturan aplikasi Survey Poliklinik LAN</p>
    </div>

    <!-- Settings Tabs -->
    <div class="mb-6">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            <i :class="tab.icon" class="mr-2"></i>
            {{ tab.name }}
          </button>
        </nav>
      </div>
    </div>

    <!-- General Settings -->
    <div v-if="activeTab === 'general'" class="space-y-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Pengaturan Umum</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nama Aplikasi</label>
            <input
              v-model="settings.general.appName"
              type="text"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nama Institusi</label>
            <input
              v-model="settings.general.institutionName"
              type="text"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email Kontak</label>
            <input
              v-model="settings.general.contactEmail"
              type="email"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
            <input
              v-model="settings.general.phoneNumber"
              type="tel"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
            <textarea
              v-model="settings.general.address"
              rows="3"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Pengaturan Tampilan</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tema</label>
            <select
              v-model="settings.general.theme"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Bahasa</label>
            <select
              v-model="settings.general.language"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Survey Settings -->
    <div v-if="activeTab === 'survey'" class="space-y-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Pengaturan Survey</h3>
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-700">Aktifkan Survey</h4>
              <p class="text-sm text-gray-500">Mengizinkan pengguna untuk mengisi survey</p>
            </div>
            <button
              @click="settings.survey.isActive = !settings.survey.isActive"
              :class="[
                settings.survey.isActive ? 'bg-blue-600' : 'bg-gray-200',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              ]"
            >
              <span
                :class="[
                  settings.survey.isActive ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                ]"
              ></span>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">URL Survey</label>
              <input
                v-model="settings.survey.surveyUrl"
                type="url"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Batas Waktu Pengisian (menit)</label>
              <input
                v-model="settings.survey.timeLimit"
                type="number"
                min="1"
                max="60"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Pesan Pembuka Survey</label>
            <textarea
              v-model="settings.survey.welcomeMessage"
              rows="3"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Pesan Terima Kasih</label>
            <textarea
              v-model="settings.survey.thankYouMessage"
              rows="3"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Pertanyaan Survey</h3>
        <div class="space-y-4">
          <div v-for="(question, index) in settings.survey.questions" :key="index" class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <h4 class="text-sm font-medium text-gray-700">Pertanyaan {{ index + 1 }}</h4>
              <button
                @click="removeQuestion(index)"
                class="text-red-600 hover:text-red-800"
                :disabled="settings.survey.questions.length <= 1"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
            <input
              v-model="question.text"
              type="text"
              placeholder="Masukkan pertanyaan..."
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
          <button
            @click="addQuestion"
            class="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            <i class="fas fa-plus mr-2"></i>
            Tambah Pertanyaan
          </button>
        </div>
      </div>
    </div>

    <!-- Notification Settings -->
    <div v-if="activeTab === 'notifications'" class="space-y-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Pengaturan Notifikasi</h3>
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-700">Email Notifikasi</h4>
              <p class="text-sm text-gray-500">Terima notifikasi melalui email</p>
            </div>
            <button
              @click="settings.notifications.emailEnabled = !settings.notifications.emailEnabled"
              :class="[
                settings.notifications.emailEnabled ? 'bg-blue-600' : 'bg-gray-200',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out'
              ]"
            >
              <span
                :class="[
                  settings.notifications.emailEnabled ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                ]"
              ></span>
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-gray-700">Push Notifikasi</h4>
              <p class="text-sm text-gray-500">Terima notifikasi push di browser</p>
            </div>
            <button
              @click="settings.notifications.pushEnabled = !settings.notifications.pushEnabled"
              :class="[
                settings.notifications.pushEnabled ? 'bg-blue-600' : 'bg-gray-200',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out'
              ]"
            >
              <span
                :class="[
                  settings.notifications.pushEnabled ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                ]"
              ></span>
            </button>
          </div>

          <div v-if="settings.notifications.emailEnabled">
            <label class="block text-sm font-medium text-gray-700 mb-2">Email Administrator</label>
            <input
              v-model="settings.notifications.adminEmail"
              type="email"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
          </div>

          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-3">Jenis Notifikasi</h4>
            <div class="space-y-3">
              <div class="flex items-center">
                <input
                  v-model="settings.notifications.newSurvey"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label class="ml-2 text-sm text-gray-700">Survey baru masuk</label>
              </div>
              <div class="flex items-center">
                <input
                  v-model="settings.notifications.dailyReport"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label class="ml-2 text-sm text-gray-700">Laporan harian</label>
              </div>
              <div class="flex items-center">
                <input
                  v-model="settings.notifications.weeklyReport"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label class="ml-2 text-sm text-gray-700">Laporan mingguan</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Security Settings -->
    <div v-if="activeTab === 'security'" class="space-y-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Pengaturan Keamanan</h3>
        <div class="space-y-6">
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-3">Ubah Password</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru</label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
              </div>
              <div class="md:col-span-2">
                <button
                  @click="changePassword"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Ubah Password
                </button>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-6">
            <h4 class="text-sm font-medium text-gray-700 mb-3">Pengaturan Session</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Durasi Session (jam)</label>
                <select
                  v-model="settings.security.sessionDuration"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="1">1 Jam</option>
                  <option value="4">4 Jam</option>
                  <option value="8">8 Jam</option>
                  <option value="24">24 Jam</option>
                </select>
              </div>
              <div class="flex items-center">
                <input
                  v-model="settings.security.autoLogout"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label class="ml-2 text-sm text-gray-700">Auto logout saat tidak aktif</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Management -->
    <div v-if="activeTab === 'data'" class="space-y-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Manajemen Data</h3>
        <div class="space-y-6">
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-3">Backup Data</h4>
            <p class="text-sm text-gray-500 mb-4">Backup otomatis akan dilakukan setiap hari pada jam 02:00 WIB</p>
            <div class="flex items-center space-x-4">
              <button
                @click="createBackup"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <i class="fas fa-download mr-2"></i>
                Buat Backup Sekarang
              </button>
              <div class="flex items-center">
                <input
                  v-model="settings.data.autoBackup"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label class="ml-2 text-sm text-gray-700">Aktifkan backup otomatis</label>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-6">
            <h4 class="text-sm font-medium text-gray-700 mb-3">Pembersihan Data</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Hapus data survey lama (hari)</label>
                <select
                  v-model="settings.data.dataRetentionDays"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="30">30 Hari</option>
                  <option value="90">90 Hari</option>
                  <option value="180">180 Hari</option>
                  <option value="365">1 Tahun</option>
                  <option value="0">Tidak Pernah</option>
                </select>
              </div>
              <div class="flex items-center">
                <input
                  v-model="settings.data.autoCleanup"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label class="ml-2 text-sm text-gray-700">Aktifkan pembersihan otomatis</label>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-6">
            <h4 class="text-sm font-medium text-red-600 mb-3">Zona Bahaya</h4>
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <p class="text-sm text-red-700 mb-4">
                <i class="fas fa-exclamation-triangle mr-2"></i>
                Tindakan berikut tidak dapat dibatalkan. Pastikan Anda telah membuat backup terlebih dahulu.
              </p>
              <div class="space-y-3">
                <button
                  @click="clearAllSurveyData"
                  class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <i class="fas fa-trash mr-2"></i>
                  Hapus Semua Data Survey
                </button>
                <button
                  @click="resetAllSettings"
                  class="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors ml-4"
                >
                  <i class="fas fa-undo mr-2"></i>
                  Reset Semua Pengaturan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end space-x-4">
      <button
        @click="resetSettings"
        class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
      >
        Reset
      </button>
      <button
        @click="saveSettings"
        class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
      >
        <i class="fas fa-save mr-2"></i>
        Simpan Pengaturan
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// Set layout
definePageMeta({
  layout: 'admin'
})

// Reactive data
const activeTab = ref('general')

const tabs = [
  { id: 'general', name: 'Umum', icon: 'fas fa-cog' },
  { id: 'survey', name: 'Survey', icon: 'fas fa-poll' },
  { id: 'notifications', name: 'Notifikasi', icon: 'fas fa-bell' },
  { id: 'security', name: 'Keamanan', icon: 'fas fa-shield-alt' },
  { id: 'data', name: 'Data', icon: 'fas fa-database' }
]

const settings = reactive({
  general: {
    appName: 'Survey Poliklinik LAN',
    institutionName: 'Lembaga Administrasi Negara',
    contactEmail: 'admin@lan.go.id',
    phoneNumber: '021-1234567',
    address: 'Jl. Veteran No. 10, Jakarta Pusat',
    theme: 'light',
    language: 'id'
  },
  survey: {
    isActive: true,
    surveyUrl: 'https://surveypoliklinik.netlify.app',
    timeLimit: 15,
    welcomeMessage: 'Selamat datang di Survey Kepuasan Pelayanan Poliklinik LAN. Mohon luangkan waktu Anda untuk mengisi survey ini.',
    thankYouMessage: 'Terima kasih atas partisipasi Anda! Masukan Anda sangat berharga untuk meningkatkan kualitas pelayanan kami.',
    questions: [
      { text: 'Bagaimana pendapat Anda tentang keramahan petugas?' },
      { text: 'Bagaimana penilaian Anda terhadap kebersihan tempat?' },
      { text: 'Apakah pelayanan kami sudah cukup cepat?' }
    ]
  },
  notifications: {
    emailEnabled: true,
    pushEnabled: true,
    adminEmail: 'admin@lan.go.id',
    newSurvey: true,
    dailyReport: true,
    weeklyReport: false
  },
  security: {
    sessionDuration: 8,
    autoLogout: true
  },
  data: {
    autoBackup: true,
    dataRetentionDays: 365,
    autoCleanup: false
  }
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Methods
const addQuestion = () => {
  settings.survey.questions.push({ text: '' })
}

const removeQuestion = (index) => {
  if (settings.survey.questions.length > 1) {
    settings.survey.questions.splice(index, 1)
  }
}

const changePassword = () => {
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

  // Simulate password change
  alert('Password berhasil diubah')
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

const createBackup = () => {
  // Simulate backup creation
  alert('Backup sedang dibuat. Anda akan mendapat notifikasi setelah selesai.')
}

const clearAllSurveyData = () => {
  if (confirm('Apakah Anda yakin ingin menghapus SEMUA data survey? Tindakan ini tidak dapat dibatalkan!')) {
    if (confirm('Sekali lagi, apakah Anda benar-benar yakin? Semua data survey akan terhapus permanen!')) {
      alert('Semua data survey telah dihapus')
    }
  }
}

const resetAllSettings = () => {
  if (confirm('Apakah Anda yakin ingin mereset semua pengaturan ke default?')) {
    // Reset to default values
    Object.assign(settings.general, {
      appName: 'Survey Poliklinik LAN',
      institutionName: 'Lembaga Administrasi Negara',
      contactEmail: 'admin@lan.go.id',
      phoneNumber: '021-1234567',
      address: 'Jl. Veteran No. 10, Jakarta Pusat',
      theme: 'light',
      language: 'id'
    })
    alert('Semua pengaturan telah direset ke default')
  }
}

const saveSettings = () => {
  // Simulate saving settings
  alert('Pengaturan berhasil disimpan')
}

const resetSettings = () => {
  if (confirm('Apakah Anda yakin ingin mereset perubahan yang belum disimpan?')) {
    // Reset to original values
    location.reload()
  }
}

// SEO
useSeoMeta({
  title: 'Pengaturan - Admin Poliklinik LAN',
  description: 'Konfigurasi dan pengaturan sistem Survey Poliklinik LAN'
})
</script>

<style scoped>
/* Tab transitions */
.tab-content {
  transition: opacity 0.3s ease-in-out;
}

/* Toggle switch animations */
button[role="switch"] {
  transition: all 0.2s ease-in-out;
}

/* Form focus states */
input:focus,
textarea:focus,
select:focus {
  outline: none;
  box-shadow: 0 0 0 2px #3B82F6;
}

/* Danger zone styling */
.bg-red-50 {
  background-color: #FEF2F2;
}

/* Card hover effects */
.bg-white {
  transition: box-shadow 0.2s ease-in-out;
}

.bg-white:hover {
  box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.1);
}
</style>
