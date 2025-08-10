<!-- pages/admin/master-obat.vue -->
<template>
  <div>
    <!-- Action Bar -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div class="mb-4 sm:mb-0">
        <h2 class="text-xl font-semibold text-gray-800">Master Obat</h2>
        <p class="text-gray-600">Kelola master data obat-obatan</p>
      </div>
      <button 
        @click="showAddModal = true"
        class="btn btn-primary"
      >
        <i class="fas fa-plus mr-2"></i>
        Tambah Obat
      </button>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Cari Obat</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Nama obat atau bahan aktif..."
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
            <option value="Antibiotik">Antibiotik</option>
            <option value="Analgesik">Analgesik</option>
            <option value="Antihistamin">Antihistamin</option>
            <option value="Vitamin">Vitamin</option>
            <option value="Antacid">Antacid</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Bentuk Sediaan</label>
          <select
            v-model="filterBentuk"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Bentuk</option>
            <option value="Tablet">Tablet</option>
            <option value="Kapsul">Kapsul</option>
            <option value="Sirup">Sirup</option>
            <option value="Injeksi">Injeksi</option>
            <option value="Salep">Salep</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filterStatus"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Status</option>
            <option value="Tersedia">Tersedia</option>
            <option value="Habis">Habis</option>
            <option value="Discontinued">Discontinued</option>
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
                Nama Obat
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bahan Aktif
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bentuk
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stok
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
            <tr v-for="obat in filteredObat" :key="obat.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ obat.nama }}</div>
                <div class="text-sm text-gray-500">{{ obat.merk }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ obat.bahan_aktif }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span 
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                >
                  {{ obat.kategori }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ obat.bentuk_sediaan }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="flex items-center">
                  <span class="mr-2">{{ obat.stok }}</span>
                  <div 
                    class="w-2 h-2 rounded-full"
                    :class="{
                      'bg-green-400': obat.stok > 100,
                      'bg-yellow-400': obat.stok <= 100 && obat.stok > 20,
                      'bg-red-400': obat.stok <= 20
                    }"
                  ></div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': obat.status === 'Tersedia',
                    'bg-red-100 text-red-800': obat.status === 'Habis',
                    'bg-gray-100 text-gray-800': obat.status === 'Discontinued'
                  }"
                >
                  {{ obat.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button 
                    @click="editObat(obat)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click="deleteObat(obat.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                  <button 
                    @click="viewDetail(obat)"
                    class="text-green-600 hover:text-green-900"
                  >
                    <i class="fas fa-eye"></i>
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
        Menampilkan {{ filteredObat.length }} dari {{ filteredObatAll.length }} data (Halaman {{ currentPage }} dari {{ totalPages }})
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

    <!-- Stock Alert -->
    <div class="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div class="flex items-center">
        <i class="fas fa-exclamation-triangle text-yellow-600 mr-2"></i>
        <h3 class="text-sm font-medium text-yellow-800">Peringatan Stok</h3>
      </div>
      <div class="mt-2 text-sm text-yellow-700">
        Ada {{ obatStokRendah.length }} obat dengan stok rendah (≤ 20 unit)
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
const filterBentuk = ref('')
const filterStatus = ref('')
const showAddModal = ref(false)

// Data from API
const obatData = ref([])

onMounted(async () => {
  try {
    const res = await $fetch('/api/master_obat')
    if (res.success) {
      // Map API fields to frontend fields
      obatData.value = res.data.map(item => ({
        id: item.id,
        nama: item.nama_obat,
        bahan_aktif: item.kandungan_aktif,
        kategori: item.kategori_obat,
        bentuk_sediaan: item.kategori_sediaan,
        stok: item.stok_akhir,
        tanggal_update: item.tanggal_update,
        status: item.stok_akhir > 0 ? 'Tersedia' : 'Habis',
      }))
    }
  } catch (e) {
    console.error('Gagal fetch data master_obat', e)
  }
})

// Pagination logic
const currentPage = ref(1)
const itemsPerPage = 20

const filteredObatAll = computed(() => {
  let filtered = obatData.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(obat =>
      obat.nama.toLowerCase().includes(query) ||
      obat.bahan_aktif.toLowerCase().includes(query)
    )
  }
  if (filterKategori.value) {
    filtered = filtered.filter(obat => obat.kategori === filterKategori.value)
  }
  if (filterBentuk.value) {
    filtered = filtered.filter(obat => obat.bentuk_sediaan === filterBentuk.value)
  }
  if (filterStatus.value) {
    filtered = filtered.filter(obat => obat.status === filterStatus.value)
  }
  return filtered
})

const totalPages = computed(() => Math.ceil(filteredObatAll.value.length / itemsPerPage) || 1)

const filteredObat = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredObatAll.value.slice(start, start + itemsPerPage)
})

const obatStokRendah = computed(() => {
  return obatData.value.filter(obat => obat.stok <= 20 && obat.status !== 'Discontinued')
})

// Methods
const editObat = (obat) => {
  console.log('Edit obat:', obat)
  // Implement edit functionality
}

const deleteObat = (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus obat ini?')) {
    obatData.value = obatData.value.filter(o => o.id !== id)
  }
}

const viewDetail = (obat) => {
  console.log('View detail obat:', obat)
  // Implement view detail functionality
}

// SEO
useSeoMeta({
  title: 'Master Obat - Admin Poliklinik LAN',
  description: 'Kelola master data obat-obatan poliklinik LAN'
})
</script>
