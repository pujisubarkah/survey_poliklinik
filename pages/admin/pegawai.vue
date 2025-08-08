<!-- pages/admin/pegawai.vue -->
<template>
  <div>
    <!-- Action Bar -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div class="mb-4 sm:mb-0">
        <h2 class="text-xl font-semibold text-gray-800">Data Pegawai Pasien</h2>
        <p class="text-gray-600">Kelola data pegawai yang berobat di poliklinik</p>
      </div>
      <button 
        @click="showAddModal = true"
        class="btn btn-primary"
      >
        <i class="fas fa-plus mr-2"></i>
        Tambah Pegawai Pasien
      </button>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Cari Pegawai</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Nama, NIP, atau Unit Kerja..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Unit Kerja</label>
          <select
            v-model="filterJabatan"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Unit</option>
            <option value="Sekretariat">Sekretariat</option>
            <option value="Bidang PKP2A">Bidang PKP2A</option>
            <option value="Bidang SPKN">Bidang SPKN</option>
            <option value="Pusat Inovasi">Pusat Inovasi</option>
            <option value="PSDM">PSDM</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filterStatus"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Status</option>
            <option value="PNS">PNS</option>
            <option value="PPPK">PPPK</option>
            <option value="Kontrak">Kontrak</option>
          </select>
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
                Pegawai
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NIP
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit Kerja
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status Kepegawaian
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="pegawai in filteredPegawai" :key="pegawai.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span class="text-white font-medium text-sm">
                      {{ pegawai.nama.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <div 
                      class="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                      @click="showDetailModalFunc(pegawai)"
                    >
                      {{ pegawai.nama }}
                    </div>
                    <div class="text-sm text-gray-500">{{ pegawai.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ pegawai.nip }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ pegawai.unitKerja }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="pegawai.statusKepegawaian === 'PNS' ? 'bg-blue-100 text-blue-800' : 
                         pegawai.statusKepegawaian === 'PPPK' ? 'bg-green-100 text-green-800' : 
                         'bg-gray-100 text-gray-800'"
                >
                  {{ pegawai.statusKepegawaian }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button 
                    @click="editPegawai(pegawai)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click="deletePegawai(pegawai.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex items-center justify-between">
      <div class="text-sm text-gray-700">
        Menampilkan {{ filteredPegawai.length }} dari {{ pegawaiData.length }} data
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

    <!-- Detail Modal -->
    <div 
      v-if="showDetailModalRef && selectedPegawai"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      @click="closeDetailModal"
    >
      <div 
        class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-90vh overflow-y-auto"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-800">Detail Pegawai</h3>
          <button 
            @click="closeDetailModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Photo Section -->
            <div class="md:col-span-1">
              <div class="text-center">
                <div class="mx-auto mb-4">
                  <img 
                    v-if="selectedPegawai.foto"
                    :src="selectedPegawai.foto" 
                    :alt="selectedPegawai.nama"
                    class="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                  >
                  <div 
                    v-else
                    class="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-gray-200 shadow-lg mx-auto"
                  >
                    <span class="text-white font-bold text-3xl">
                      {{ selectedPegawai.nama.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                </div>
                <h4 class="text-xl font-bold text-gray-800 mb-1">{{ selectedPegawai.nama }}</h4>
                <p class="text-gray-600 mb-2">{{ selectedPegawai.jabatan }} - {{ selectedPegawai.unitKerja }}</p>
                <span 
                  class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
                  :class="selectedPegawai.statusKepegawaian === 'PNS' ? 'bg-blue-100 text-blue-800' : 
                         selectedPegawai.statusKepegawaian === 'PPPK' ? 'bg-green-100 text-green-800' : 
                         'bg-gray-100 text-gray-800'"
                >
                  {{ selectedPegawai.statusKepegawaian }}
                </span>
              </div>
            </div>

            <!-- Details Section -->
            <div class="md:col-span-2">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">NIP</label>
                  <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ selectedPegawai.nip }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ selectedPegawai.email }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
                  <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ selectedPegawai.jabatan }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Unit Kerja</label>
                  <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ selectedPegawai.unitKerja }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Golongan</label>
                  <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ selectedPegawai.golongan || '-' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Status Kepegawaian</label>
                  <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ selectedPegawai.statusKepegawaian }}</p>
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                  <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ selectedPegawai.alamat || '-' }}</p>
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Pendidikan</label>
                  <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ selectedPegawai.pendidikan || '-' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="mt-6 border-t border-gray-200 pt-6">
            <h5 class="text-lg font-semibold text-gray-800 mb-4">Informasi Personal</h5>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ selectedPegawai.telepon || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ formatDate(selectedPegawai.tanggalLahir) || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ selectedPegawai.jenisKelamin || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Bergabung di LAN</label>
                <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ formatDate(selectedPegawai.tanggalBergabung) || '-' }}</p>
              </div>
            </div>
          </div>

          <!-- Medical History -->
          <div class="mt-6 border-t border-gray-200 pt-6">
            <h5 class="text-lg font-semibold text-gray-800 mb-4">Riwayat Berobat</h5>
            <div v-if="selectedPegawai.riwayatBerobat && selectedPegawai.riwayatBerobat.length > 0" class="space-y-3">
              <div 
                v-for="(riwayat, index) in selectedPegawai.riwayatBerobat" 
                :key="index"
                class="bg-blue-50 border border-blue-200 rounded-lg p-3"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <p class="text-sm font-medium text-blue-900">{{ formatDate(riwayat.tanggal) }}</p>
                    <p class="text-sm text-blue-700 mt-1"><span class="font-medium">Keluhan:</span> {{ riwayat.keluhan }}</p>
                    <p class="text-sm text-blue-700"><span class="font-medium">Diagnosa:</span> {{ riwayat.diagnosa }}</p>
                  </div>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <i class="fas fa-stethoscope mr-1"></i>
                    Kunjungan {{ selectedPegawai.riwayatBerobat.length - index }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-6 text-gray-500">
              <i class="fas fa-notes-medical text-3xl mb-2"></i>
              <p>Belum ada riwayat berobat</p>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button 
            @click="closeDetailModal"
            class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Tutup
          </button>
          <button 
            @click="editFromDetail"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            <i class="fas fa-edit mr-2"></i>
            Edit Data
          </button>
          <button 
            @click="addMedicalRecord"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
          >
            <i class="fas fa-plus mr-2"></i>
            Tambah Riwayat Berobat
          </button>
        </div>
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
const filterJabatan = ref('')
const filterStatus = ref('')
const showAddModal = ref(false)
const showDetailModalRef = ref(false)
const selectedPegawai = ref(null)

// Sample data
const pegawaiData = ref([
  {
    id: 1,
    nama: 'Budi Santoso',
    nip: '198501012010011001',
    email: 'budi.santoso@lan.go.id',
    telepon: '08123456789',
    jabatan: 'Analis Kebijakan Ahli Madya',
    unitKerja: 'Bidang PKP2A',
    statusKepegawaian: 'PNS',
    tanggalLahir: '1985-01-01',
    jenisKelamin: 'Laki-laki',
    alamat: 'Jl. Sudirman No. 123, Jakarta Pusat',
    pendidikan: 'S2 Administrasi Publik',
    golongan: 'III/c',
    tanggalBergabung: '2010-01-01',
    riwayatBerobat: [
      { tanggal: '2024-01-15', keluhan: 'Sakit kepala', diagnosa: 'Tension headache' },
      { tanggal: '2024-02-20', keluhan: 'Flu', diagnosa: 'Common cold' }
    ],
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'
  },
  {
    id: 2,
    nama: 'Sari Dewi',
    nip: '198703152012012002',
    email: 'sari.dewi@lan.go.id',
    telepon: '08234567890',
    jabatan: 'Pranata Komputer Ahli Muda',
    unitKerja: 'Sekretariat',
    statusKepegawaian: 'PNS',
    tanggalLahir: '1987-03-15',
    jenisKelamin: 'Perempuan',
    alamat: 'Jl. Thamrin No. 456, Jakarta Pusat',
    pendidikan: 'S1 Teknik Informatika',
    golongan: 'III/a',
    tanggalBergabung: '2012-01-02',
    riwayatBerobat: [
      { tanggal: '2024-01-10', keluhan: 'Mata minus', diagnosa: 'Myopia' }
    ],
    foto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'
  },
  {
    id: 3,
    nama: 'Ahmad Fauzi',
    nip: '198906082015011003',
    email: 'ahmad.fauzi@lan.go.id',
    telepon: '08345678901',
    jabatan: 'Auditor Ahli Pertama',
    unitKerja: 'Bidang SPKN',
    statusKepegawaian: 'PPPK',
    tanggalLahir: '1989-06-08',
    jenisKelamin: 'Laki-laki',
    alamat: 'Jl. Gatot Subroto No. 789, Jakarta Selatan',
    pendidikan: 'S1 Akuntansi',
    golongan: 'III/a',
    tanggalBergabung: '2015-01-03',
    riwayatBerobat: [
      { tanggal: '2024-01-25', keluhan: 'Hipertensi', diagnosa: 'Essential hypertension' },
      { tanggal: '2024-02-15', keluhan: 'Kontrol tekanan darah', diagnosa: 'Hypertension follow-up' }
    ],
    foto: null
  },
  {
    id: 4,
    nama: 'Indira Putri',
    nip: '199002201018012004',
    email: 'indira.putri@lan.go.id',
    telepon: '08456789012',
    jabatan: 'Peneliti Ahli Muda',
    unitKerja: 'Pusat Inovasi',
    statusKepegawaian: 'PNS',
    tanggalLahir: '1990-02-20',
    jenisKelamin: 'Perempuan',
    alamat: 'Jl. Kuningan No. 321, Jakarta Selatan',
    pendidikan: 'S2 Ilmu Politik',
    golongan: 'III/b',
    tanggalBergabung: '2018-01-04',
    riwayatBerobat: [
      { tanggal: '2024-01-08', keluhan: 'Medical Check Up', diagnosa: 'Sehat' }
    ],
    foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face'
  },
  {
    id: 5,
    nama: 'Rizki Pratama',
    nip: '199105101019011005',
    email: 'rizki.pratama@lan.go.id',
    telepon: '08567890123',
    jabatan: 'Widyaiswara Ahli Muda',
    unitKerja: 'PSDM',
    statusKepegawaian: 'PNS',
    tanggalLahir: '1991-05-10',
    jenisKelamin: 'Laki-laki',
    alamat: 'Jl. HR Rasuna Said No. 654, Jakarta Selatan',
    pendidikan: 'S2 Manajemen SDM',
    golongan: 'III/b',
    tanggalBergabung: '2019-01-05',
    riwayatBerobat: [
      { tanggal: '2024-02-01', keluhan: 'Gastritis', diagnosa: 'Acute gastritis' }
    ],
    foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'
  }
])

// Computed
const filteredPegawai = computed(() => {
  let filtered = pegawaiData.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(pegawai => 
      pegawai.nama.toLowerCase().includes(query) ||
      pegawai.nip.includes(query) ||
      pegawai.unitKerja.toLowerCase().includes(query)
    )
  }

  if (filterJabatan.value) {
    filtered = filtered.filter(pegawai => pegawai.unitKerja === filterJabatan.value)
  }

  if (filterStatus.value) {
    filtered = filtered.filter(pegawai => pegawai.statusKepegawaian === filterStatus.value)
  }

  return filtered
})

// Methods
const showDetailModalFunc = (pegawai) => {
  selectedPegawai.value = pegawai
  showDetailModalRef.value = true
}

const closeDetailModal = () => {
  showDetailModalRef.value = false
  selectedPegawai.value = null
}

const editFromDetail = () => {
  closeDetailModal()
  editPegawai(selectedPegawai.value)
}

const addMedicalRecord = () => {
  closeDetailModal()
  // Implement add medical record functionality
  console.log('Add medical record for:', selectedPegawai.value.nama)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatRupiah = (amount) => {
  if (!amount) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

const editPegawai = (pegawai) => {
  console.log('Edit pegawai:', pegawai)
  // Implement edit functionality
}

const deletePegawai = (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus pegawai ini?')) {
    pegawaiData.value = pegawaiData.value.filter(p => p.id !== id)
  }
}

// SEO
useSeoMeta({
  title: 'Data Pegawai Pasien - Admin Poliklinik LAN',
  description: 'Kelola data pegawai yang berobat di poliklinik LAN'
})
</script>

<style scoped>
/* Modal animations */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

/* Modal content animation */
.modal-content-enter-active, .modal-content-leave-active {
  transition: all 0.3s ease;
}

.modal-content-enter-from, .modal-content-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-50px);
}

/* Hover effects */
.cursor-pointer:hover {
  text-decoration: underline;
}

/* Photo styling */
.photo-container {
  position: relative;
  overflow: hidden;
}

.photo-container img {
  transition: transform 0.2s ease;
}

.photo-container:hover img {
  transform: scale(1.05);
}

/* Card hover effects */
.bg-white {
  transition: box-shadow 0.2s ease-in-out;
}

.bg-white:hover {
  box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.1);
}

/* Custom scrollbar for modal */
.max-h-90vh {
  max-height: 90vh;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
