<!-- pages/admin/pemeriksaan.vue -->
<template>
  <div>
    <!-- Header Section -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div class="mb-4 sm:mb-0">
        <h2 class="text-xl font-semibold text-gray-800">Pemeriksaan Medis</h2>
        <p class="text-gray-600">Kelola data pemeriksaan dan rekam medis pegawai</p>
      </div>
      <button 
        @click="showNewExamModal = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
      >
        <i class="fas fa-plus mr-2"></i>
        Pemeriksaan Baru
      </button>
    </div>

    <!-- Filter and Search -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Cari Pemeriksaan</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Nama pegawai, NIP, atau diagnosa..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Pemeriksaan</label>
          <input
            v-model="filterTanggal"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Pemeriksaan</label>
          <select
            v-model="filterJenis"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Jenis</option>
            <option value="Pemeriksaan Rutin">Pemeriksaan Rutin</option>
            <option value="Medical Check Up">Medical Check Up</option>
            <option value="Pemeriksaan Khusus">Pemeriksaan Khusus</option>
            <option value="Konsultasi">Konsultasi</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filterStatus"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Status</option>
            <option value="Selesai">Selesai</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Dalam Pemeriksaan">Dalam Pemeriksaan</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-500 bg-opacity-75">
            <i class="fas fa-calendar-check text-white text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Hari Ini</p>
            <p class="text-2xl font-bold text-gray-900">{{ todayExams }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-500 bg-opacity-75">
            <i class="fas fa-check-circle text-white text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Selesai</p>
            <p class="text-2xl font-bold text-gray-900">{{ completedExams }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-500 bg-opacity-75">
            <i class="fas fa-clock text-white text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Menunggu</p>
            <p class="text-2xl font-bold text-gray-900">{{ pendingExams }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-500 bg-opacity-75">
            <i class="fas fa-user-injured text-white text-xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Pasien</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalPatients }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pasien
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal & Waktu
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jenis Pemeriksaan
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Keluhan
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="exam in filteredExams" :key="exam.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span class="text-white font-medium text-sm">
                      {{ exam.pasien.nama.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ exam.pasien.nama }}</div>
                    <div class="text-sm text-gray-500">{{ exam.pasien.nip }}</div>
                    <div class="text-sm text-gray-500">{{ exam.pasien.unitKerja }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDateTime(exam.tanggalPemeriksaan) }}</div>
                <div class="text-sm text-gray-500">{{ exam.waktuPemeriksaan }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {{ exam.jenisPemeriksaan }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-xs truncate">{{ exam.keluhan }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusColor(exam.status)"
                >
                  {{ exam.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button 
                    @click="viewExam(exam)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Lihat Detail"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    @click="editExam(exam)"
                    class="text-green-600 hover:text-green-900"
                    title="Edit Pemeriksaan"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click="printExam(exam)"
                    class="text-purple-600 hover:text-purple-900"
                    title="Cetak Hasil"
                  >
                    <i class="fas fa-print"></i>
                  </button>
                  <button 
                    @click="deleteExam(exam.id)"
                    class="text-red-600 hover:text-red-900"
                    title="Hapus"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Menampilkan {{ filteredExams.length }} dari {{ examData.length }} data
        </div>
        <div class="flex space-x-2">
          <button class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
            Sebelumnya
          </button>
          <button class="px-3 py-1 bg-blue-600 text-white rounded text-sm">
            1
          </button>
          <button class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
            Selanjutnya
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Pemeriksaan Baru -->
    <div v-if="showNewExamModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-6 border-b">
          <h3 class="text-lg font-semibold text-gray-900">Pemeriksaan Baru</h3>
          <button @click="closeNewExamModal" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="saveNewExam" class="p-6 space-y-6">
          <!-- Data Pasien -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nama Pegawai</label>
              <input
                v-model="newExam.pasien.nama"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan nama pegawai"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">NIP</label>
              <input
                v-model="newExam.pasien.nip"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan NIP"
              >
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Unit Kerja</label>
            <select
              v-model="newExam.pasien.unitKerja"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih Unit Kerja</option>
              <option value="Sekretariat">Sekretariat</option>
              <option value="Bidang PKP2A">Bidang PKP2A</option>
              <option value="Bidang SPKN">Bidang SPKN</option>
              <option value="Bidang KAP">Bidang KAP</option>
              <option value="Pusat Kajian dan Diklat">Pusat Kajian dan Diklat</option>
            </select>
          </div>

          <!-- Tanggal dan Waktu Pemeriksaan -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Pemeriksaan</label>
              <input
                v-model="newExam.tanggalPemeriksaan"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Waktu Pemeriksaan</label>
              <input
                v-model="newExam.waktuPemeriksaan"
                type="time"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
          </div>

          <!-- Jenis Pemeriksaan -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Pemeriksaan *</label>
            <select
              v-model="newExam.jenisPemeriksaan"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih Jenis Pemeriksaan</option>
              <option value="Pemeriksaan Rutin">Pemeriksaan Rutin</option>
              <option value="Medical Check Up">Medical Check Up</option>
              <option value="Pemeriksaan Khusus">Pemeriksaan Khusus</option>
              <option value="Konsultasi">Konsultasi</option>
              <option value="Pemeriksaan Darurat">Pemeriksaan Darurat</option>
              <option value="Follow Up">Follow Up</option>
            </select>
          </div>

          <!-- Keluhan -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Keluhan</label>
            <textarea
              v-model="newExam.keluhan"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan keluhan pasien"
            ></textarea>
          </div>

          <!-- Diagnosis -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
            <textarea
              v-model="newExam.diagnosis"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan diagnosis"
            ></textarea>
          </div>

          <!-- Tindakan -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tindakan</label>
            <textarea
              v-model="newExam.tindakan"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan tindakan yang dilakukan"
            ></textarea>
          </div>

          <!-- Obat -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Obat *</label>
            <div class="space-y-3">
              <div v-for="(obat, index) in newExam.obatList" :key="index" class="flex gap-2">
                <select
                  v-model="obat.nama"
                  required
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Obat</option>
                  <option value="Paracetamol 500mg">Paracetamol 500mg</option>
                  <option value="Ibuprofen 400mg">Ibuprofen 400mg</option>
                  <option value="Amoxicillin 500mg">Amoxicillin 500mg</option>
                  <option value="Omeprazole 20mg">Omeprazole 20mg</option>
                  <option value="Amlodipine 5mg">Amlodipine 5mg</option>
                  <option value="Metformin 500mg">Metformin 500mg</option>
                  <option value="Vitamin B Complex">Vitamin B Complex</option>
                  <option value="Antasida">Antasida</option>
                  <option value="CTM 4mg">CTM 4mg</option>
                  <option value="Dexamethasone">Dexamethasone</option>
                </select>
                <input
                  v-model="obat.dosis"
                  type="text"
                  placeholder="Dosis (3x1)"
                  class="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <input
                  v-model="obat.jumlah"
                  type="number"
                  placeholder="Jml"
                  min="1"
                  class="w-16 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <button
                  v-if="newExam.obatList.length > 1"
                  @click="removeObat(index)"
                  type="button"
                  class="px-2 py-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
              <button
                @click="addObat"
                type="button"
                class="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
              >
                <i class="fas fa-plus"></i>
                Tambah Obat
              </button>
            </div>
          </div>

          <!-- Dokter dan Status -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Dokter</label>
              <select
                v-model="newExam.dokter"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Dokter</option>
                <option value="Dr. Ahmad Wijaya">Dr. Ahmad Wijaya</option>
                <option value="Dr. Sarah Putri">Dr. Sarah Putri</option>
                <option value="Dr. Budi Santoso">Dr. Budi Santoso</option>
                <option value="Dr. Maya Sari">Dr. Maya Sari</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                v-model="newExam.status"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Menunggu">Menunggu</option>
                <option value="Dalam Pemeriksaan">Dalam Pemeriksaan</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 pt-4 border-t">
            <button
              @click="closeNewExamModal"
              type="button"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Simpan Pemeriksaan
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Set layout
definePageMeta({
  layout: 'admin'
})

// Reactive data
const searchQuery = ref('')
const filterTanggal = ref('')
const filterJenis = ref('')
const filterStatus = ref('')
const showNewExamModal = ref(false)

// Form data for new examination
const newExam = ref({
  pasien: {
    nama: '',
    nip: '',
    unitKerja: ''
  },
  tanggalPemeriksaan: '',
  waktuPemeriksaan: '',
  jenisPemeriksaan: '',
  keluhan: '',
  diagnosis: '',
  tindakan: '',
  obatList: [
    { nama: '', dosis: '', jumlah: 1 }
  ],
  dokter: '',
  status: 'Menunggu'
})

// Sample examination data
const examData = ref([
  {
    id: 1,
    pasien: {
      nama: 'Budi Santoso',
      nip: '198501012010011001',
      unitKerja: 'Bidang PKP2A'
    },
    tanggalPemeriksaan: '2024-08-08',
    waktuPemeriksaan: '09:00',
    jenisPemeriksaan: 'Pemeriksaan Rutin',
    keluhan: 'Sakit kepala dan pusing sejak 3 hari',
    diagnosis: 'Tension headache',
    tindakan: 'Pemberian analgesik, istirahat cukup',
    obat: 'Paracetamol 500mg 3x1',
    status: 'Selesai',
    dokter: 'Dr. Ahmad Wijaya'
  },
  {
    id: 2,
    pasien: {
      nama: 'Sari Dewi',
      nip: '198703152012012002',
      unitKerja: 'Sekretariat'
    },
    tanggalPemeriksaan: '2024-08-08',
    waktuPemeriksaan: '10:30',
    jenisPemeriksaan: 'Medical Check Up',
    keluhan: 'Medical check up rutin tahunan',
    diagnosis: 'Sehat, tekanan darah normal',
    tindakan: 'Pemeriksaan fisik lengkap, lab darah',
    obat: '-',
    status: 'Dalam Pemeriksaan',
    dokter: 'Dr. Sarah Putri'
  },
  {
    id: 3,
    pasien: {
      nama: 'Ahmad Fauzi',
      nip: '198906082015011003',
      unitKerja: 'Bidang SPKN'
    },
    tanggalPemeriksaan: '2024-08-08',
    waktuPemeriksaan: '11:00',
    jenisPemeriksaan: 'Konsultasi',
    keluhan: 'Kontrol hipertensi rutin',
    diagnosis: 'Hipertensi terkontrol',
    tindakan: 'Kontrol tekanan darah, edukasi diet',
    obat: 'Amlodipine 5mg 1x1',
    status: 'Menunggu',
    dokter: 'Dr. Ahmad Wijaya'
  },
  {
    id: 4,
    pasien: {
      nama: 'Indira Putri',
      nip: '199002201018012004',
      unitKerja: 'Pusat Inovasi'
    },
    tanggalPemeriksaan: '2024-08-07',
    waktuPemeriksaan: '14:00',
    jenisPemeriksaan: 'Pemeriksaan Khusus',
    keluhan: 'Mata minus, sering pusing saat bekerja di komputer',
    diagnosis: 'Myopia, computer vision syndrome',
    tindakan: 'Pemeriksaan mata, saran kacamata',
    obat: 'Eye drops lubricant',
    status: 'Selesai',
    dokter: 'Dr. Lisa Andriani'
  },
  {
    id: 5,
    pasien: {
      nama: 'Rizki Pratama',
      nip: '199105101019011005',
      unitKerja: 'PSDM'
    },
    tanggalPemeriksaan: '2024-08-07',
    waktuPemeriksaan: '15:30',
    jenisPemeriksaan: 'Pemeriksaan Rutin',
    keluhan: 'Nyeri lambung, mual setelah makan',
    diagnosis: 'Gastritis akut',
    tindakan: 'Pemberian obat, diet, edukasi pola makan',
    obat: 'Omeprazole 20mg 1x1, Antasida 3x1',
    status: 'Selesai',
    dokter: 'Dr. Ahmad Wijaya'
  }
])

// Computed properties
const filteredExams = computed(() => {
  let filtered = examData.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(exam => 
      exam.pasien.nama.toLowerCase().includes(query) ||
      exam.pasien.nip.includes(query) ||
      exam.keluhan.toLowerCase().includes(query) ||
      exam.diagnosis.toLowerCase().includes(query)
    )
  }

  if (filterTanggal.value) {
    filtered = filtered.filter(exam => exam.tanggalPemeriksaan === filterTanggal.value)
  }

  if (filterJenis.value) {
    filtered = filtered.filter(exam => exam.jenisPemeriksaan === filterJenis.value)
  }

  if (filterStatus.value) {
    filtered = filtered.filter(exam => exam.status === filterStatus.value)
  }

  return filtered
})

const todayExams = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return examData.value.filter(exam => exam.tanggalPemeriksaan === today).length
})

const completedExams = computed(() => {
  return examData.value.filter(exam => exam.status === 'Selesai').length
})

const pendingExams = computed(() => {
  return examData.value.filter(exam => exam.status === 'Menunggu').length
})

const totalPatients = computed(() => {
  const uniquePatients = new Set(examData.value.map(exam => exam.pasien.nip))
  return uniquePatients.size
})

// Methods
const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Selesai':
      return 'bg-green-100 text-green-800'
    case 'Dalam Pemeriksaan':
      return 'bg-blue-100 text-blue-800'
    case 'Menunggu':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const viewExam = (exam) => {
  console.log('View exam:', exam)
  // Implement view functionality
}

const editExam = (exam) => {
  console.log('Edit exam:', exam)
  // Implement edit functionality
}

const printExam = (exam) => {
  console.log('Print exam:', exam)
  // Implement print functionality
}

const deleteExam = (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus data pemeriksaan ini?')) {
    examData.value = examData.value.filter(exam => exam.id !== id)
  }
}

// Modal methods
const closeNewExamModal = () => {
  showNewExamModal.value = false
  resetForm()
}

const resetForm = () => {
  newExam.value = {
    pasien: {
      nama: '',
      nip: '',
      unitKerja: ''
    },
    tanggalPemeriksaan: '',
    waktuPemeriksaan: '',
    jenisPemeriksaan: '',
    keluhan: '',
    diagnosis: '',
    tindakan: '',
    obatList: [
      { nama: '', dosis: '', jumlah: 1 }
    ],
    dokter: '',
    status: 'Menunggu'
  }
}

const addObat = () => {
  newExam.value.obatList.push({ nama: '', dosis: '', jumlah: 1 })
}

const removeObat = (index) => {
  if (newExam.value.obatList.length > 1) {
    newExam.value.obatList.splice(index, 1)
  }
}

const saveNewExam = () => {
  // Generate obat string from obatList
  const obatString = newExam.value.obatList
    .filter(obat => obat.nama)
    .map(obat => `${obat.nama} ${obat.dosis} (${obat.jumlah} box)`)
    .join(', ')

  // Create new examination record
  const newExamRecord = {
    id: Date.now(), // Simple ID generation
    pasien: { ...newExam.value.pasien },
    tanggalPemeriksaan: newExam.value.tanggalPemeriksaan,
    waktuPemeriksaan: newExam.value.waktuPemeriksaan,
    jenisPemeriksaan: newExam.value.jenisPemeriksaan,
    keluhan: newExam.value.keluhan,
    diagnosis: newExam.value.diagnosis,
    tindakan: newExam.value.tindakan,
    obat: obatString || '-',
    status: newExam.value.status,
    dokter: newExam.value.dokter
  }

  // Add to examination data
  examData.value.unshift(newExamRecord)
  
  // Close modal and reset form
  closeNewExamModal()
  
  // Show success message (you can implement toast/notification here)
  alert('Pemeriksaan baru berhasil ditambahkan!')
}

// SEO
useSeoMeta({
  title: 'Pemeriksaan Medis - Admin Poliklinik LAN',
  description: 'Kelola data pemeriksaan dan rekam medis pegawai LAN'
})
</script>

<style scoped>
/* Card hover effects */
.bg-white {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.bg-white:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.1);
}

/* Table row hover effect */
tbody tr:hover {
  background-color: #f9fafb;
}

/* Action button hover effects */
.text-blue-600:hover,
.text-green-600:hover,
.text-purple-600:hover,
.text-red-600:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
}
</style>
