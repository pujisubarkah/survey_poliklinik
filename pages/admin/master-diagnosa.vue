<!-- pages/admin/master-diagnosa.vue -->
<template>
  <div>
    <!-- Action Bar -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div class="mb-4 sm:mb-0">
        <h2 class="text-xl font-semibold text-gray-800">Master Diagnosa</h2>
        <p class="text-gray-600">Kelola master data diagnosa medis</p>
      </div>
      <button 
        @click="showAddModal = true"
        class="btn btn-primary"
      >
        <i class="fas fa-plus mr-2"></i>
        Tambah Diagnosa
      </button>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Cari Diagnosa</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Kode ICD atau nama diagnosa..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
          <select
            v-model="filterKategori"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Kategori</option>
            <option value="Penyakit Umum">Penyakit Umum</option>
            <option value="Penyakit Kronis">Penyakit Kronis</option>
            <option value="Penyakit Menular">Penyakit Menular</option>
            <option value="Cedera">Cedera</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filterStatus"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Tidak Aktif">Tidak Aktif</option>
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
                Kode ICD
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Diagnosa
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
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
            <tr v-for="diagnosa in filteredDiagnosa" :key="diagnosa.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ diagnosa.kode_icd }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ diagnosa.nama }}</div>
                <div class="text-sm text-gray-500">{{ diagnosa.deskripsi }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span 
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800"
                >
                  {{ diagnosa.kategori }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="diagnosa.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ diagnosa.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button 
                    @click="editDiagnosa(diagnosa)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click="deleteDiagnosa(diagnosa.id)"
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
        Menampilkan {{ filteredDiagnosa.length }} dari {{ diagnosaData.length }} data
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
</template>

<script setup>
import { ref, computed } from 'vue'

// Set layout
definePageMeta({
  layout: 'admin'
})

// Reactive data
const searchQuery = ref('')
const filterKategori = ref('')
const filterStatus = ref('')
const showAddModal = ref(false)

// Sample data
const diagnosaData = ref([
  {
    id: 1,
    kode_icd: 'A09',
    nama: 'Diare dan Gastroenteritis',
    deskripsi: 'Infeksi saluran pencernaan yang menyebabkan diare',
    kategori: 'Penyakit Umum',
    status: 'Aktif'
  },
  {
    id: 2,
    kode_icd: 'K29.7',
    nama: 'Gastritis',
    deskripsi: 'Peradangan pada dinding lambung',
    kategori: 'Penyakit Umum',
    status: 'Aktif'
  },
  {
    id: 3,
    kode_icd: 'I10',
    nama: 'Hipertensi Esensial',
    deskripsi: 'Tekanan darah tinggi tanpa penyebab yang jelas',
    kategori: 'Penyakit Kronis',
    status: 'Aktif'
  },
  {
    id: 4,
    kode_icd: 'E11.9',
    nama: 'Diabetes Mellitus Tipe 2',
    deskripsi: 'Diabetes tanpa komplikasi',
    kategori: 'Penyakit Kronis',
    status: 'Aktif'
  },
  {
    id: 5,
    kode_icd: 'S06.0',
    nama: 'Gegar Otak',
    deskripsi: 'Cedera kepala ringan',
    kategori: 'Cedera',
    status: 'Tidak Aktif'
  }
])

// Computed
const filteredDiagnosa = computed(() => {
  let filtered = diagnosaData.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(diagnosa => 
      diagnosa.kode_icd.toLowerCase().includes(query) ||
      diagnosa.nama.toLowerCase().includes(query) ||
      diagnosa.deskripsi.toLowerCase().includes(query)
    )
  }

  if (filterKategori.value) {
    filtered = filtered.filter(diagnosa => diagnosa.kategori === filterKategori.value)
  }

  if (filterStatus.value) {
    filtered = filtered.filter(diagnosa => diagnosa.status === filterStatus.value)
  }

  return filtered
})

// Methods
const editDiagnosa = (diagnosa) => {
  console.log('Edit diagnosa:', diagnosa)
  // Implement edit functionality
}

const deleteDiagnosa = (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus diagnosa ini?')) {
    diagnosaData.value = diagnosaData.value.filter(d => d.id !== id)
  }
}

// SEO
useSeoMeta({
  title: 'Master Diagnosa - Admin Poliklinik LAN',
  description: 'Kelola master data diagnosa medis poliklinik LAN'
})
</script>
