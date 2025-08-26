
<!-- pages/admin/master-obat.vue -->
<template>
    <!-- Modal Tambah Master Obat -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-md w-full mx-4 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Tambah Master Obat</h3>
          <button @click="closeAddModal" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
    <!-- Modal Tambah Stok Obat (global, di luar v-for) -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl max-w-md w-full mx-4 p-0 shadow-2xl border border-gray-200">
        <div class="flex items-center justify-between px-6 pt-6 pb-2 bg-green-50 rounded-t-xl border-b border-gray-100">
          <h3 class="text-lg font-bold text-green-700 flex items-center">
            <i class="fas fa-plus-circle text-green-500 mr-2"></i> Tambah Stok Obat
          </h3>
          <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>
        <div class="px-6 pt-4 pb-2">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Obat</label>
            <div class="flex items-center gap-2">
              <i class="fas fa-pills text-green-400"></i>
              <input v-model="editObatForm.nama_obat" type="text" disabled class="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 font-semibold text-green-700" />
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah Stok Masuk</label>
            <div class="flex gap-2">
              <input v-model.number="editObatForm.stok_masuk" type="number" min="1" class="w-full px-3 py-2 border border-green-300 rounded-md" placeholder="Jumlah masuk" />
              <button type="button" @click="submitStokMasuk" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold flex items-center gap-1"><i class="fas fa-plus"></i> Simpan</button>
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-6 border-t pt-4">
            <button type="button" @click="closeEditModal" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Batal</button>
          </div>
        </div>
      </div>
    </div>
        <form @submit.prevent="submitMasterObat">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Nama Obat</label>
            <input v-model="formObat.nama_obat" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Nama Obat" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Kandungan Aktif</label>
            <input v-model="formObat.kandungan_aktif" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Kandungan Aktif" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Kategori Obat</label>
            <select v-model="formObat.kategori_obat" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="">Pilih Kategori</option>
              <option value="Antibiotik">Antibiotik</option>
              <option value="Analgesik">Analgesik</option>
              <option value="Antihistamin">Antihistamin</option>
              <option value="Vitamin">Vitamin</option>
              <option value="Antacid">Antacid</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Bentuk Sediaan</label>
            <select v-model="formObat.kategori_sediaan" required class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="">Pilih Bentuk</option>
              <option value="Tablet">Tablet</option>
              <option value="Kapsul">Kapsul</option>
              <option value="Sirup">Sirup</option>
              <option value="Injeksi">Injeksi</option>
              <option value="Salep">Salep</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Merk (opsional)</label>
            <input v-model="formObat.merk" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Merk" />
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" @click="closeAddModal" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Batal</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Simpan</button>
          </div>
        </form>
      </div>
    </div>
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
                    @click="openEditModal(obat)"
                    class="text-green-600 hover:text-green-900"
                  >
                    <i class="fas fa-plus"></i>
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
    <!-- Modal Tambah Stok Obat (global, di luar v-for) -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl max-w-md w-full mx-4 p-0 shadow-2xl border border-gray-200">
        <div class="flex items-center justify-between px-6 pt-6 pb-2 bg-green-50 rounded-t-xl border-b border-gray-100">
          <h3 class="text-lg font-bold text-green-700 flex items-center">
            <i class="fas fa-plus-circle text-green-500 mr-2"></i> Tambah Stok Obat
          </h3>
          <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>
        <div class="px-6 pt-4 pb-2">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Obat</label>
            <div class="flex items-center gap-2">
              <i class="fas fa-pills text-green-400"></i>
              <input v-model="editObatForm.nama_obat" type="text" disabled class="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 font-semibold text-green-700" />
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah Stok Masuk</label>
            <div class="flex gap-2">
              <input v-model.number="editObatForm.stok_masuk" type="number" min="1" class="w-full px-3 py-2 border border-green-300 rounded-md" placeholder="Jumlah masuk" />
              <button type="button" @click="submitStokMasuk" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold flex items-center gap-1"><i class="fas fa-plus"></i> Simpan</button>
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-6 border-t pt-4">
            <button type="button" @click="closeEditModal" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Batal</button>
          </div>
        </div>
      </div>
    </div>
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
// Modal Tambah Master Obat
const formObat = ref({
  nama_obat: '',
  kandungan_aktif: '',
  kategori_obat: '',
  kategori_sediaan: '',
  merk: ''
})

const closeAddModal = () => {
  showAddModal.value = false
  formObat.value = { nama_obat: '', kandungan_aktif: '', kategori_obat: '', kategori_sediaan: '', merk: '' }
}

const submitMasterObat = async () => {
  if (!formObat.value.nama_obat || !formObat.value.kandungan_aktif || !formObat.value.kategori_obat || !formObat.value.kategori_sediaan) return
  try {
    // 1. Tambah master obat
    const res = await $fetch('/api/master_obat', {
      method: 'POST',
      body: formObat.value
    })
    if (res.success && res.data && res.data.id) {
      // 2. Buat stok awal
      const stokRes = await $fetch('/api/stok_obat', {
        method: 'PUT',
        body: {
          id_obat: res.data.id,
          stok_awal: 0 // Atau bisa diisi sesuai kebutuhan
        }
      })
      if (stokRes.success && stokRes.data && stokRes.data.id_stok) {
        alert('Master obat & stok awal berhasil dibuat!')
        closeAddModal()
        // 3. Refresh data dan mapping id_stok
        try {
          const refresh = await $fetch('/api/master_obat')
          if (refresh.success) {
            obatData.value = refresh.data.map(item => ({
              id: item.id,
              id_stok: item.id_stok || stokRes.data.id_stok,
              nama: item.nama_obat,
              bahan_aktif: item.kandungan_aktif,
              kategori: item.kategori_obat,
              bentuk_sediaan: item.kategori_sediaan,
              stok: item.stok_akhir,
              tanggal_update: item.tanggal_update,
              status: item.stok_akhir > 0 ? 'Tersedia' : 'Habis',
            }))
          }
        } catch (e) {}
      } else {
        alert('Master obat berhasil, tapi gagal membuat stok awal!')
      }
    } else {
      alert(res.message || 'Gagal menambah master obat')
    }
  } catch (e) {
    alert('Terjadi error saat menambah master obat')
  }
}

import { ref, computed, onMounted } from 'vue'

// Modal Tambah Stok Obat
const showEditModal = ref(false)
const editObatForm = ref({
  id: null,
  nama_obat: '',
  stok_masuk: 1
})

const openEditModal = (obat) => {
  // Cari id stok dari data detail jika tersedia
  let idStok = obat.id_stok || obat.id_stok_obat || obat.id_stokobat || obat.id_stok || null;
  if (!idStok && obat.id) idStok = obat.id;
  if (!idStok) {
    console.error('ID stok tidak ditemukan pada data obat:', obat);
    alert('ID stok tidak ditemukan, silakan cek data obat!');
    return;
  }
  editObatForm.value = {
    id: idStok,
    nama_obat: obat.nama,
    stok_masuk: 1
  }
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editObatForm.value = { id: null, nama_obat: '', stok_masuk: 1 }
}

const submitStokMasuk = async () => {
  if (!editObatForm.value.id || !editObatForm.value.stok_masuk || editObatForm.value.stok_masuk < 1) {
    alert('ID stok tidak ditemukan, cek data obat!');
    console.error('ID yang dikirim:', editObatForm.value.id);
    return;
  }
  console.log('Submit stok masuk, ID:', editObatForm.value.id, 'Jumlah:', editObatForm.value.stok_masuk);
  try {
    const res = await $fetch('/api/stok_obat/masuk.post', {
      method: 'POST',
      body: {
        id: editObatForm.value.id,
        jumlah: editObatForm.value.stok_masuk
      }
    })
    if (res.success) {
      // Update table instantly
      const idx = obatData.value.findIndex(o => o.id === editObatForm.value.id)
      if (idx !== -1) {
        obatData.value[idx].stok += editObatForm.value.stok_masuk
        obatData.value[idx].status = obatData.value[idx].stok > 0 ? 'Tersedia' : 'Habis'
      }
      closeEditModal()
    } else {
      alert(res.message || 'Gagal menambah stok obat')
    }
  } catch (e) {
    alert('Terjadi error saat menambah stok obat')
  }
}

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
// Edit stok obat
const editObat = async (obat) => {
  const stokBaru = prompt('Masukkan stok baru untuk obat ini:', obat.stok)
  if (stokBaru == null || isNaN(Number(stokBaru))) return
  try {
    const res = await $fetch(`/api/stok_obat/${obat.id}`, {
      method: 'PUT',
      body: { stok_akhir: Number(stokBaru) }
    })
    if (res.success) {
      alert('Stok obat berhasil diupdate!')
      refreshObat()
    } else {
      alert(res.message || 'Gagal update stok obat')
    }
  } catch (e) {
    alert('Terjadi error saat update stok obat')
  }
}

// Delete stok obat
const deleteObat = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus stok obat ini?')) {
    try {
      const res = await $fetch(`/api/stok_obat/${id}`, {
        method: 'DELETE'
      })
      if (res.success) {
        alert('Stok obat berhasil dihapus!')
        refreshObat()
      } else {
        alert(res.message || 'Gagal hapus stok obat')
      }
    } catch (e) {
      alert('Terjadi error saat hapus stok obat')
    }
  }
}

// Detail stok obat
const viewDetail = async (obat) => {
  try {
    const res = await $fetch(`/api/stok_obat/${obat.id}`)
    if (res.success && res.data) {
      alert(`Detail Stok Obat:\nID: ${res.data.id}\nStok Awal: ${res.data.stok_awal}\nStok Masuk: ${res.data.stok_masuk}\nStok Keluar: ${res.data.stok_keluar}\nStok Akhir: ${res.data.stok_akhir}`)
    } else {
      alert('Data stok obat tidak ditemukan')
    }
  } catch (e) {
    alert('Terjadi error saat mengambil detail stok obat')
  }
}

// Refresh data obat
const refreshObat = async () => {
  try {
    const refresh = await $fetch('/api/master_obat')
    if (refresh.success) {
      obatData.value = refresh.data.map(item => ({
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
  } catch (e) {}
}

// SEO
useSeoMeta({
  title: 'Master Obat - Admin Poliklinik LAN',
  description: 'Kelola master data obat-obatan poliklinik LAN'
})
</script>
