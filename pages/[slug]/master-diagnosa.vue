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
            <option v-for="kategori in kategoriList" :key="kategori" :value="kategori">{{ kategori }}</option>
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
        Menampilkan {{ filteredDiagnosa.length }} dari {{ filteredDiagnosaAll.length }} data (Halaman {{ currentPage }} dari {{ totalPages }})
      </div>
      <div class="flex space-x-2">
        <button
          class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          Sebelumnya
        </button>
        <span v-for="page in totalPages" :key="page">
          <button
            class="px-3 py-1 rounded text-sm"
            :class="page === currentPage ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
        </span>
        <button
          class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Set layout
definePageMeta({
  layout: 'admin'
})

// Reactive data
const searchQuery = ref('')
const filterKategori = ref('')
const filterStatus = ref('')
const showAddModal = ref(false)

// Data from API
const diagnosaData = ref([])

onMounted(async () => {
  try {
    const res = await $fetch('/api/diagnosa')
    if (res.success) {
      diagnosaData.value = res.data.map(item => ({
        id: item.id,
        kode_icd: item.kode_icd,
        nama: item.nama_diagnosa,
        kategori: item.kategori,
        status: 'Aktif', // default, bisa diubah jika ada field status di DB
      }))
    }
  } catch (e) {
    console.error('Gagal fetch data diagnosa', e)
  }
})

// Kategori dinamis
const kategoriList = computed(() => {
  const set = new Set()
  diagnosaData.value.forEach(item => {
    if (item.kategori) set.add(item.kategori)
  })
  return Array.from(set)
})

// Pagination logic
const currentPage = ref(1)
const itemsPerPage = 20

const filteredDiagnosaAll = computed(() => {
  let filtered = diagnosaData.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(diagnosa =>
      diagnosa.kode_icd.toLowerCase().includes(query) ||
      diagnosa.nama.toLowerCase().includes(query)
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

const totalPages = computed(() => Math.ceil(filteredDiagnosaAll.value.length / itemsPerPage) || 1)

const filteredDiagnosa = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredDiagnosaAll.value.slice(start, start + itemsPerPage)
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
