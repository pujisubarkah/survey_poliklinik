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
                    @click="updateObatStok(obat)"
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

    <!-- Modal Detail Stok Obat -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-2xl w-full mx-4 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-900 flex items-center">
            <i class="fas fa-pills text-blue-600 mr-3"></i>
            Detail Stok Obat
          </h3>
          <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div v-if="selectedObat" class="space-y-6">
          <!-- Header Info -->
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <h4 class="text-lg font-semibold text-gray-800">{{ selectedObat.nama }}</h4>
            <p class="text-sm text-gray-600 mt-1">{{ selectedObat.bahan_aktif }}</p>
            <div class="flex items-center mt-2 space-x-4">
              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {{ selectedObat.kategori }}
              </span>
              <span class="text-sm text-gray-500">{{ selectedObat.bentuk_sediaan }}</span>
            </div>
          </div>

          <!-- Stok Information Cards -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-green-700">{{ detailStok.stok_awal || 0 }}</div>
              <div class="text-sm text-green-600 mt-1">Stok Awal</div>
              <i class="fas fa-box-open text-green-400 text-xl mt-2"></i>
            </div>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-blue-700">{{ detailStok.stok_masuk || 0 }}</div>
              <div class="text-sm text-blue-600 mt-1">Stok Masuk</div>
              <i class="fas fa-arrow-down text-blue-400 text-xl mt-2"></i>
            </div>
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-orange-700">{{ detailStok.stok_keluar || 0 }}</div>
              <div class="text-sm text-orange-600 mt-1">Stok Keluar</div>
              <i class="fas fa-arrow-up text-orange-400 text-xl mt-2"></i>
            </div>
            <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-purple-700">{{ detailStok.stok_akhir || 0 }}</div>
              <div class="text-sm text-purple-600 mt-1">Stok Akhir</div>
              <i class="fas fa-warehouse text-purple-400 text-xl mt-2"></i>
            </div>
          </div>

          <!-- Status dan Progress Bar -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-medium text-gray-700">Status Stok</span>
              <span 
                class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
                :class="{
                  'bg-green-100 text-green-800': detailStok.stok_akhir > 100,
                  'bg-yellow-100 text-yellow-800': detailStok.stok_akhir <= 100 && detailStok.stok_akhir > 20,
                  'bg-red-100 text-red-800': detailStok.stok_akhir <= 20
                }"
              >
                {{ getStokStatus(detailStok.stok_akhir) }}
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div 
                class="h-3 rounded-full transition-all duration-300"
                :class="{
                  'bg-green-500': detailStok.stok_akhir > 100,
                  'bg-yellow-500': detailStok.stok_akhir <= 100 && detailStok.stok_akhir > 20,
                  'bg-red-500': detailStok.stok_akhir <= 20
                }"
                :style="`width: ${Math.min((detailStok.stok_akhir / 200) * 100, 100)}%`"
              ></div>
            </div>
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>200+</span>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white border border-gray-200 rounded-lg p-4">
              <div class="flex items-center mb-2">
                <i class="fas fa-calendar-alt text-gray-400 mr-2"></i>
                <span class="text-sm font-medium text-gray-700">Terakhir Update</span>
              </div>
              <p class="text-sm text-gray-600">
                {{ formatDate(detailStok.tanggal_update) }}
              </p>
            </div>
            <div class="bg-white border border-gray-200 rounded-lg p-4">
              <div class="flex items-center mb-2">
                <i class="fas fa-hashtag text-gray-400 mr-2"></i>
                <span class="text-sm font-medium text-gray-700">ID Stok</span>
              </div>
              <p class="text-sm text-gray-600">{{ detailStok.id }}</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button 
              @click="closeDetailModal" 
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Tutup
            </button>
            <button 
              @click="editObatFromDetail" 
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <i class="fas fa-edit mr-2"></i>
              Edit Stok
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Edit Master Obat -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-md w-full mx-4 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Edit Master Obat</h3>
          <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="submitEditObat">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Nama Obat</label>
            <input 
              v-model="editForm.nama_obat" 
              type="text" 
              required 
              class="w-full px-3 py-2 border border-gray-300 rounded-md" 
              placeholder="Nama Obat" 
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Kandungan Aktif</label>
            <input 
              v-model="editForm.kandungan_aktif" 
              type="text" 
              required 
              class="w-full px-3 py-2 border border-gray-300 rounded-md" 
              placeholder="Kandungan Aktif" 
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Kategori Obat</label>
            <select 
              v-model="editForm.kategori_obat" 
              required 
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
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
            <select 
              v-model="editForm.kategori_sediaan" 
              required 
              class="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
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
            <input 
              v-model="editForm.merk" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md" 
              placeholder="Merk" 
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Stok Akhir</label>
            <input 
              v-model.number="editForm.stok_akhir" 
              type="number" 
              min="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md" 
              placeholder="Jumlah Stok" 
            />
          </div>
          <div class="flex justify-end gap-2">
            <button 
              type="button" 
              @click="closeEditModal" 
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Update Stok Obat -->
    <div v-if="showUpdateStokModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-md w-full mx-4 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <i class="fas fa-plus-square text-green-600 mr-3"></i>
            Tambah Stok Obat
          </h3>
          <button @click="closeUpdateStokModal" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div v-if="selectedObatForUpdate" class="mb-6">
          <!-- Info Obat -->
          <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 class="font-semibold text-gray-800">{{ selectedObatForUpdate.nama }}</h4>
            <p class="text-sm text-gray-600 mt-1">{{ selectedObatForUpdate.bahan_aktif }}</p>
            <div class="flex items-center justify-between mt-3">
              <span class="text-sm text-gray-500">Stok Saat Ini:</span>
              <span class="font-semibold text-lg" :class="{
                'text-green-600': selectedObatForUpdate.stok > 100,
                'text-yellow-600': selectedObatForUpdate.stok <= 100 && selectedObatForUpdate.stok > 20,
                'text-red-600': selectedObatForUpdate.stok <= 20
              }">
                {{ selectedObatForUpdate.stok }} unit
              </span>
            </div>
            
            <!-- Progress Bar Stok Saat Ini -->
            <div class="mt-2">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-300"
                  :class="{
                    'bg-green-500': selectedObatForUpdate.stok > 100,
                    'bg-yellow-500': selectedObatForUpdate.stok <= 100 && selectedObatForUpdate.stok > 20,
                    'bg-red-500': selectedObatForUpdate.stok <= 20
                  }"
                  :style="`width: ${Math.min((selectedObatForUpdate.stok / 200) * 100, 100)}%`"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <form @submit.prevent="submitUpdateStok">
          <!-- Input Stok Masuk -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <i class="fas fa-arrow-up text-green-600 mr-2"></i>
              Jumlah Stok Masuk
            </label>
            <div class="relative">
              <input 
                v-model.number="updateStokForm.stok_masuk" 
                type="number" 
                min="1"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Masukkan jumlah stok yang akan ditambahkan"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <span class="text-gray-500 text-sm">unit</span>
              </div>
            </div>
            
            <!-- Preview Stok Setelah Penambahan -->
            <div v-if="updateStokForm.stok_masuk > 0" class="mt-3 bg-green-50 rounded-lg p-3 border border-green-200">
              <div class="flex items-center justify-between">
                <span class="text-sm text-green-700">Stok Setelah Penambahan:</span>
                <span class="font-bold text-lg text-green-800">
                  {{ selectedObatForUpdate.stok + updateStokForm.stok_masuk }} unit
                </span>
              </div>
              
              <!-- Calculation Display -->
              <div class="text-xs text-green-600 mt-1">
                {{ selectedObatForUpdate.stok }} + {{ updateStokForm.stok_masuk }} = {{ selectedObatForUpdate.stok + updateStokForm.stok_masuk }}
              </div>
              
              <!-- Progress Bar Preview -->
              <div class="mt-2">
                <div class="w-full bg-green-200 rounded-full h-2">
                  <div 
                    class="h-2 rounded-full transition-all duration-300"
                    :class="{
                      'bg-green-500': (selectedObatForUpdate.stok + updateStokForm.stok_masuk) > 100,
                      'bg-yellow-500': (selectedObatForUpdate.stok + updateStokForm.stok_masuk) <= 100 && (selectedObatForUpdate.stok + updateStokForm.stok_masuk) > 20,
                      'bg-red-500': (selectedObatForUpdate.stok + updateStokForm.stok_masuk) <= 20
                    }"
                    :style="`width: ${Math.min(((selectedObatForUpdate.stok + updateStokForm.stok_masuk) / 200) * 100, 100)}%`"
                  ></div>
                </div>
                <div class="flex justify-between text-xs text-green-600 mt-1">
                  <span>0</span>
                  <span class="font-medium">{{ getStokStatus(selectedObatForUpdate.stok + updateStokForm.stok_masuk) }}</span>
                  <span>200+</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3">
            <button 
              type="button" 
              @click="closeUpdateStokModal" 
              class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <i class="fas fa-times mr-2"></i>
              Batal
            </button>
            <button 
              type="submit" 
              class="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              :disabled="!updateStokForm.stok_masuk || updateStokForm.stok_masuk < 1"
            >
              <i class="fas fa-plus mr-2"></i>
              Tambah Stok
            </button>
          </div>
        </form>
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
    const res = await $fetch('/api/master_obat', {
      method: 'POST',
      body: formObat.value
    })
    if (res.success) {
      alert('Master obat berhasil ditambahkan!')
      closeAddModal()
      // Refresh data
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
    } else {
      alert(res.message || 'Gagal menambah master obat')
    }
  } catch (e) {
    alert('Terjadi error saat menambah master obat')
  }
}

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
const showDetailModal = ref(false)
const showEditModal = ref(false)
const showUpdateStokModal = ref(false)
const selectedObat = ref(null)
const selectedObatForUpdate = ref(null)
const detailStok = ref({})
const editForm = ref({
  id: '',
  nama_obat: '',
  kandungan_aktif: '',
  kategori_obat: '',
  kategori_sediaan: '',
  merk: '',
  stok_akhir: 0,
  tanggal_update: ''
})
const updateStokForm = ref({
  stok_masuk: 0
})

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
const updateObatStok = (obat) => {
  selectedObatForUpdate.value = obat
  updateStokForm.value = {
    stok_baru: obat.stok, // Set default ke stok saat ini
    catatan: ''
  }
  showUpdateStokModal.value = true
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

// Modal Detail
// Open detail modal
const viewDetail = async (obat) => {
  selectedObat.value = obat
  try {
    const res = await $fetch(`/api/stok_obat/${obat.id}`)
    if (res.success && res.data) {
      detailStok.value = res.data
      showDetailModal.value = true
    } else {
      alert('Data stok obat tidak ditemukan')
    }
  } catch (e) {
    alert('Terjadi error saat mengambil detail stok obat')
  }
}

// Close detail modal
const closeDetailModal = () => {
  showDetailModal.value = false
  selectedObat.value = null
  detailStok.value = {}
}

// Edit dari modal detail
const editObatFromDetail = () => {
  closeDetailModal()
  updateObatStok(selectedObat.value)
}

// Get stok status text
const getStokStatus = (stok) => {
  if (stok > 100) return 'Stok Aman'
  if (stok > 20) return 'Stok Rendah'
  return 'Stok Habis'
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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

// Edit Modal State
// (Removed duplicate declaration of showEditModal and editForm)

// Open edit modal
const editObat = (obat) => {
  editForm.value = {
    id: obat.id,
    nama_obat: obat.nama,
    kandungan_aktif: obat.bahan_aktif,
    kategori_obat: obat.kategori,
    kategori_sediaan: obat.bentuk_sediaan,
    merk: obat.merk || '',
    stok_akhir: obat.stok,
    tanggal_update: obat.tanggal_update
  }
  showEditModal.value = true
}

// Close edit modal
const closeEditModal = () => {
  showEditModal.value = false
  editForm.value = {
    id: '',
    nama_obat: '',
    kandungan_aktif: '',
    kategori_obat: '',
    kategori_sediaan: '',
    merk: '',
    stok_akhir: 0,
    tanggal_update: ''
  }
}

// Submit edit form
const submitEditObat = async () => {
  try {
    const res = await $fetch(`/api/master_obat/${editForm.value.id}`, {
      method: 'PUT',
      body: {
        nama_obat: editForm.value.nama_obat,
        kandungan_aktif: editForm.value.kandungan_aktif,
        kategori_obat: editForm.value.kategori_obat,
        kategori_sediaan: editForm.value.kategori_sediaan,
        merk: editForm.value.merk,
        stok_akhir: editForm.value.stok_akhir
      }
    })
    if (res.success) {
      alert('Data obat berhasil diperbarui!')
      closeEditModal()
      refreshObat()
    } else {
      alert(res.message || 'Gagal memperbarui data obat')
    }
  } catch (e) {
    alert('Terjadi error saat memperbarui data obat')
  }
}

// Calculate stok preview for update
const calculateStokPreview = () => {
  if (updateStokForm.value.stok_baru < 0) {
    updateStokForm.value.stok_baru = 0
  }
}

// Submit update stok form
const submitUpdateStok = async () => {
  if (updateStokForm.value.stok_masuk < 1) {
    return alert('Jumlah stok masuk harus lebih dari 0')
  }

  const stokBaru = selectedObatForUpdate.value.stok + updateStokForm.value.stok_masuk

  try {
    const res = await $fetch(`/api/stok_obat/${selectedObatForUpdate.value.id}`, {
      method: 'PUT',
      body: {
        stok_masuk: updateStokForm.value.stok_masuk,
        stok_akhir: stokBaru
      }
    })
    if (res.success) {
      alert('Stok obat berhasil ditambahkan!')
      closeUpdateStokModal()
      refreshObat()
    } else {
      alert(res.message || 'Gagal menambah stok obat')
    }
  } catch (e) {
    alert('Terjadi error saat menambah stok obat')
  }
}

// Close update stok modal
const closeUpdateStokModal = () => {
  showUpdateStokModal.value = false
  selectedObatForUpdate.value = null
  updateStokForm.value = {
    stok_masuk: 0
  }
}

// SEO
useSeoMeta({
  title: 'Master Obat - Admin Poliklinik LAN',
  description: 'Kelola master data obat-obatan poliklinik LAN'
})
</script>
