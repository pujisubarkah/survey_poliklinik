<!-- pages/admin/pemeriksaan.vue -->
<template>
  <div>
    <!-- Header Section -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div class="mb-4 sm:mb-0">
        <h2 class="text-xl font-semibold text-gray-800">Pemeriksaan Medis</h2>
        <p class="text-gray-600">Kelola data pemeriksaan dan rekam medis pegawai</p>
      </div>
      <div class="flex gap-2">
        <button 
          @click="showNewExamModal = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <i class="fas fa-plus mr-2"></i>
          Pemeriksaan Baru
        </button>
        <button
          @click="exportExcel"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <i class="fas fa-file-excel mr-2"></i>
          Export Excel
        </button>
      </div>
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
                <div class="text-sm text-gray-900">{{ formatDateTime(exam.tanggal_pemeriksaan, exam.waktu_pemeriksaan) }}</div>
                <div class="text-sm text-gray-500">{{ exam.waktu_pemeriksaan }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {{ exam.jenis_pemeriksaan }}
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
                list="pegawai-nama-list"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ketik nama pegawai"
              >
              <datalist id="pegawai-nama-list">
                <option v-for="p in pegawaiList" :key="p.nip" :value="p.nama">{{ p.nama }} ({{ p.nip }})</option>
              </datalist>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">NIP</label>
              <input
                v-model="newExam.pasien.nip"
                type="text"
                readonly
                class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                placeholder="NIP Pegawai"
              >
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Unit Kerja</label>
            <input
              v-model="newExam.pasien.unitKerja"
              type="text"
              readonly
              class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
              placeholder="Unit Kerja"
            >
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
            <input
              v-model="diagnosisInput"
              list="diagnosa-list"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ketik diagnosis atau pilih"
              @change="onDiagnosisChange"
            >
            <datalist id="diagnosa-list">
              <option v-for="d in diagnosaList" :key="d.id" :value="d.nama_diagnosa">{{ d.nama_diagnosa }}</option>
            </datalist>
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
              <div v-for="(obat, index) in newExam.obatList" :key="index" class="flex gap-2 items-start">
                <div class="flex-1">
                  <input
                    v-model="obat.nama"
                    list="obat-list"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ketik nama obat"
                  >
                  <datalist id="obat-list">
                    <option v-for="o in masterObatList" :key="o.id" :value="o.nama_obat">{{ o.nama_obat }} (Stok: {{ o.stok_akhir }})</option>
                  </datalist>
                  <p v-if="obat.nama && getStokObat(obat.nama) === 0" class="text-xs text-red-600 mt-1">Stok habis, tidak bisa diberikan</p>
                </div>
                <div class="w-20">
                  <input
                    type="text"
                    readonly
                    class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none text-center"
                    placeholder="Stok"
                    :value="obat.nama ? getStokObat(obat.nama) : ''"
                  >
                </div>
                <select
                  v-model="obat.dosis"
                  class="w-28 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :disabled="obat.nama && getStokObat(obat.nama) === 0"
                  required
                >
                  <option value="">Pilih dosis</option>
                  <option value="1x sehari">1x sehari</option>
                  <option value="2x sehari">2x sehari</option>
                  <option value="3x sehari">3x sehari</option>
                  <option value="4x sehari">4x sehari</option>
                </select>
                <input
                  v-model="obat.jumlah"
                  type="number"
                  placeholder="Jml"
                  min="1"
                  class="w-16 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :disabled="obat.nama && getStokObat(obat.nama) === 0"
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
                  <option value="dr. Rindra Eriska Hidayat, M.K.M">dr. Rindra Eriska Hidayat, M.K.M</option>
                  <option value="dr. Yuriko Francisca">dr. Yuriko Francisca</option>
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
import { ref, computed, onMounted, watch } from 'vue'
import * as XLSX from 'xlsx'
// Export Excel function
const exportExcel = () => {
  // Siapkan data untuk export
  const data = filteredExams.value.map(exam => ({
    Nama: exam.pasien?.nama || '',
    NIP: exam.pasien?.nip || '',
    'Unit Kerja': exam.pasien?.unitKerja || '',
    'Tanggal Pemeriksaan': exam.tanggal_pemeriksaan,
    'Waktu Pemeriksaan': exam.waktu_pemeriksaan,
    'Jenis Pemeriksaan': exam.jenis_pemeriksaan,
    Keluhan: exam.keluhan,
    Diagnosis: exam.nama_diagnosa || '',
    Tindakan: exam.tindakan,
    Dokter: exam.dokter,
    Status: exam.status,
    Obat: (exam.obat && Array.isArray(exam.obat)) ? exam.obat.map(o => `${o.nama_obat} (${o.dosis}, ${o.jumlah})`).join('; ') : ''
  }))
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Pemeriksaan')
  XLSX.writeFile(workbook, 'data_pemeriksaan.xlsx')
}

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
  diagnosis_id: null,
  tindakan: '',
  obatList: [
    { nama: '', dosis: '', jumlah: 1 }
  ],
  dokter: '',
  status: 'Menunggu'
})

const diagnosisInput = ref('')
const onDiagnosisChange = () => {
  const found = diagnosaList.value.find(d => d.nama_diagnosa === diagnosisInput.value)
  newExam.value.diagnosis_id = found ? found.id : null
}
// Sinkronisasi input jika diagnosis_id berubah (misal reset form)
watch(() => newExam.value.diagnosis_id, (id) => {
  const found = diagnosaList.value.find(d => d.id === id)
  diagnosisInput.value = found ? found.nama_diagnosa : ''
})

// Data pemeriksaan dari API
const examData = ref([])

// Data pegawai dan obat dari API
const pegawaiList = ref([])
const diagnosaList = ref([])
const masterObatList = ref([])

onMounted(async () => {
  // Fetch data pemeriksaan dari API
  try {
    const resPemeriksaan = await $fetch('/api/pemeriksaan')
    if (resPemeriksaan.success) {
      examData.value = resPemeriksaan.data
    }
  } catch (e) {
    console.error('Gagal fetch data pemeriksaan', e)
  }
  try {
    const res = await $fetch('/api/pegawai')
    pegawaiList.value = Array.isArray(res) ? res : []
  } catch (e) {
    console.error('Gagal fetch data pegawai', e)
  }

  try {
    const resDiagnosa = await $fetch('/api/diagnosa')
    diagnosaList.value = resDiagnosa.success ? resDiagnosa.data : []
  } catch (e) {
    console.error('Gagal fetch data diagnosa', e)
  }

  try {
    const resObat = await $fetch('/api/master_obat')
    masterObatList.value = resObat.success ? resObat.data : []
  } catch (e) {
    console.error('Gagal fetch data obat', e)
  }
})

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
const formatDateTime = (tanggal, waktu) => {
  if (!tanggal) return '';
  const iso = waktu ? `${tanggal}T${waktu}` : tanggal;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
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

// Helper untuk cek stok obat
const getStokObat = (namaObat) => {
  const found = masterObatList.value.find(o => o.nama_obat === namaObat)
  return found ? found.stok_akhir : 0
}

const saveNewExam = async () => {
  // Cek jika ada obat yang stoknya 0
  const adaStokHabis = newExam.value.obatList.some(obat => obat.nama && getStokObat(obat.nama) === 0)
  if (adaStokHabis) {
    alert('Ada obat yang stoknya habis, silakan ganti atau hapus dari daftar!')
    return
  }


  if (!newExam.value.diagnosis_id) {
    alert('Diagnosis wajib dipilih dari daftar!');
    return;
  }

  // Siapkan payload untuk API
  const payload = {
    pasien_nip: newExam.value.pasien.nip,
    tanggal_pemeriksaan: newExam.value.tanggalPemeriksaan,
    waktu_pemeriksaan: newExam.value.waktuPemeriksaan,
    jenis_pemeriksaan: newExam.value.jenisPemeriksaan,
    keluhan: newExam.value.keluhan,
    diagnosis_id: newExam.value.diagnosis_id,
    tindakan: newExam.value.tindakan,
    dokter: newExam.value.dokter,
    status: newExam.value.status,
    obatList: newExam.value.obatList.map(obat => {
      const selected = masterObatList.value.find(o => o.nama_obat === obat.nama)
      return {
        obat_id: selected ? selected.id : null,
        nama_obat: obat.nama,
        dosis: obat.dosis,
        jumlah: Number(obat.jumlah),
        stok_saat_itu: selected ? selected.stok_akhir : null
      }
    })
  }

  try {
    const res = await $fetch('/api/pemeriksaan', {
      method: 'POST',
      body: payload
    })
    if (res.success) {
      // Proses pengurangan stok obat
      for (const obat of newExam.value.obatList) {
        const selected = masterObatList.value.find(o => o.nama_obat === obat.nama)
        if (selected && selected.stok_akhir > 0) {
          await $fetch('/api/stok_obat/keluar', {
            method: 'POST',
            body: {
              obat_id: selected.id,
              stok_awal: selected.stok_akhir,
              stok_keluar: Number(obat.jumlah),
            }
          })
        }
      }
      closeNewExamModal()
      alert('Pemeriksaan baru berhasil ditambahkan!')
      // Refresh data dari API
      try {
        const getRes = await $fetch('/api/pemeriksaan')
        if (getRes.success) {
          examData.value = getRes.data
        }
      } catch (e) {}
    } else {
      alert(res.message || 'Gagal menyimpan data pemeriksaan')
    }
  } catch (e) {
    alert('Terjadi error saat menyimpan data pemeriksaan')
  }
}

// Watchers & feedback
watch(
  () => newExam.value.pasien.nama,
  (nama) => {
    const found = pegawaiList.value.find(p => p.nama === nama)
    if (found) {
      newExam.value.pasien.nip = found.nip
      newExam.value.pasien.unitKerja = found.nama_unit_kerja
    } else {
      newExam.value.pasien.nip = ''
      newExam.value.pasien.unitKerja = ''
    }
  }
)

// Debug: log pegawaiList saat modal dibuka
watch(showNewExamModal, (val) => {
  if (val) {
    console.log('pegawaiList:', pegawaiList.value)
  }
})

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
