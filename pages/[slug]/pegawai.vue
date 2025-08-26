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
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="pegawai in paginatedPegawai" :key="pegawai.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div v-if="pegawai.foto" class="h-10 w-10 flex-shrink-0">
                    <img 
                      :src="pegawai.foto" 
                      :alt="pegawai.nama"
                      class="h-10 w-10 rounded-full object-cover"
                      @error="e => e.target.style.display = 'none'"
                    >
                  </div>
                  <div v-else class="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
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
                    <div class="text-sm text-gray-500">{{ pegawai.detail?.email || '-' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ pegawai.nip }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ (pegawai.nama_unit_kerja || '').trim() || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button 
                    @click="handleEditPegawai(pegawai)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click="handleDeletePegawai(pegawai.id)"
                    :disabled="deletingId === pegawai.id"
                    class="text-red-600 hover:text-red-900"
                  >
                    <i v-if="deletingId === pegawai.id" class="fas fa-spinner fa-spin"></i>
                    <i v-else class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <!-- Tampilkan pesan jika tidak ada data -->
            <tr v-if="paginatedPegawai.length === 0">
              <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                <div class="py-8">
                  <i class="fas fa-users text-4xl mb-4"></i>
                  <p class="text-lg font-medium">Tidak ada data pegawai</p>
                  <p class="text-sm">Silakan tambah data pegawai terlebih dahulu</p>
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
        Menampilkan {{ paginatedPegawai.length }} dari {{ filteredPegawai.length }} data (halaman {{ currentPage }} dari {{ totalPages }})
      </div>
      <div class="flex space-x-2">
        <button
          class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
          :disabled="currentPage === 1"
          @click="currentPage = Math.max(1, currentPage - 1)"
        >
          Sebelumnya
        </button>
        <span class="px-3 py-1 bg-blue-600 text-white rounded text-sm">
          {{ currentPage }}
        </span>
        <button
          class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
          :disabled="currentPage === totalPages"
          @click="currentPage = Math.min(totalPages, currentPage + 1)"
        >
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
                    class="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg mx-auto"
                    @error="e => e.target.style.display = 'none'"
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
                <p class="text-gray-600 mb-2">{{ selectedPegawai.jabatan }}</p>
                <p class="text-sm text-gray-500 mb-2">{{ (selectedPegawai.nama_unit_kerja || '').trim() }}</p>
                <span 
                  class="inline-flex px-3 py-1 text-sm font-semibold rounded-full"
                  :class="selectedPegawai.detail?.status_kepegawaian === 'PNS' ? 'bg-blue-100 text-blue-800' : 
                         selectedPegawai.detail?.status_kepegawaian === 'PPPK' ? 'bg-green-100 text-green-800' : 
                         'bg-gray-100 text-gray-800'"
                >
                  {{ selectedPegawai.detail?.status_kepegawaian || 'Status tidak diketahui' }}
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
                  <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ selectedPegawai.detail?.email || '-' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
                  <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ selectedPegawai.jabatan }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Unit Kerja</label>
                  <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ (selectedPegawai.nama_unit_kerja || '').trim() || '-' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Golongan</label>
                  <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ selectedPegawai.golongan || '-' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Eselon</label>
                  <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ selectedPegawai.eselon || '-' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Status Kepegawaian</label>
                  <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ selectedPegawai.detail?.status_kepegawaian || '-' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Pendidikan</label>
                  <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ selectedPegawai.detail?.pendidikan || '-' }}</p>
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                  <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ selectedPegawai.detail?.alamat || '-' }}</p>
                  
                  <!-- Google Maps Embed -->
                  <div v-if="selectedPegawai.detail?.alamat" class="mt-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      <i class="fas fa-map-marker-alt mr-2 text-red-500"></i>
                      Lokasi di Google Maps
                    </label>
                    <div class="relative border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      <iframe
                        :src="'https://www.google.com/maps?q=' + encodeURIComponent(selectedPegawai.detail.alamat) + '&output=embed'"
                        width="100%"
                        height="250"
                        style="border:0;"
                        allowfullscreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                        class="w-full"
                      ></iframe>
                    </div>
                    
                    <!-- Action buttons -->
                    <div class="mt-3 flex flex-wrap gap-2">
                      <a 
                        :href="'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(selectedPegawai.detail.alamat)"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center px-3 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-full transition-colors"
                      >
                        <i class="fas fa-external-link-alt mr-1"></i>
                        Buka di Google Maps
                      </a>
                      
                      <button 
                        @click="copyAddress"
                        class="inline-flex items-center px-3 py-1 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <i class="fas fa-copy mr-1"></i>
                        Salin Alamat
                      </button>
                      
                      <a 
                        :href="'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(selectedPegawai.detail.alamat)"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center px-3 py-1 text-xs bg-green-100 text-green-700 hover:bg-green-200 rounded-full transition-colors"
                      >
                        <i class="fas fa-directions mr-1"></i>
                        Petunjuk Arah
                      </a>
                    </div>
                  </div>
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
                <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ selectedPegawai.detail?.telp || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ formatDate(selectedPegawai.detail?.tanggal_lahir) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ formatGender(selectedPegawai.detail?.jenis_kelamin) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Golongan Darah</label>
                <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ selectedPegawai.detail?.nm_goldar || '-' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">TMT CPNS</label>
                <p class="text-sm text-gray-900 bg-gray-50 p-2 rounded">{{ formatDate(selectedPegawai.detail?.peg_cpns_tmt) }}</p>
              </div>
            </div>
          </div>

          <!-- Medical History -->
          <div class="mt-6 border-t border-gray-200 pt-6">
            <div class="flex items-center justify-between mb-4">
              <h5 class="text-lg font-semibold text-gray-800">Riwayat Berobat</h5>
              <div v-if="loadingRiwayat" class="flex items-center text-sm text-gray-500">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                Memuat riwayat...
              </div>
            </div>
            
            <div v-if="selectedPegawai.riwayatBerobat && selectedPegawai.riwayatBerobat.length > 0" class="space-y-4">
              <div 
                v-for="(riwayat, index) in selectedPegawai.riwayatBerobat" 
                :key="riwayat.id"
                class="bg-blue-50 border border-blue-200 rounded-lg p-4"
              >
                <div class="flex justify-between items-start mb-3">
                  <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                      <p class="text-sm font-semibold text-blue-900">
                        {{ formatDate(riwayat.tanggal) }}
                      </p>
                      <p class="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {{ riwayat.waktu }}
                      </p>
                      <span 
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        :class="riwayat.status === 'Selesai' ? 'bg-green-100 text-green-800' : 
                               riwayat.status === 'Proses' ? 'bg-yellow-100 text-yellow-800' : 
                               'bg-gray-100 text-gray-800'"
                      >
                        {{ riwayat.status }}
                      </span>
                    </div>
                    
                    <p class="text-sm text-blue-700 mb-1">
                      <span class="font-medium">Jenis:</span> {{ riwayat.jenis_pemeriksaan }}
                    </p>
                    <p class="text-sm text-blue-700 mb-1">
                      <span class="font-medium">Keluhan:</span> {{ riwayat.keluhan }}
                    </p>
                    <p class="text-sm text-blue-700 mb-1">
                      <span class="font-medium">Diagnosa:</span> 
                      {{ riwayat.diagnosa }}
                      <span v-if="riwayat.kode_icd" class="text-xs text-blue-500 ml-1">
                        ({{ riwayat.kode_icd }})
                      </span>
                    </p>
                    <p class="text-sm text-blue-700 mb-2">
                      <span class="font-medium">Tindakan:</span> {{ riwayat.tindakan }}
                    </p>
                    <p class="text-sm text-blue-700">
                      <span class="font-medium">Dokter:</span> {{ riwayat.dokter }}
                    </p>
                  </div>
                  
                  <div class="text-right">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <i class="fas fa-stethoscope mr-1"></i>
                      Kunjungan {{ selectedPegawai.riwayatBerobat.length - index }}
                    </span>
                  </div>
                </div>
                
                <!-- Daftar Obat -->
                <div v-if="riwayat.obat_list && riwayat.obat_list.length > 0" class="mt-3 pt-3 border-t border-blue-200">
                  <p class="text-sm font-medium text-blue-900 mb-2">
                    <i class="fas fa-pills mr-1"></i>
                    Obat yang Diberikan:
                  </p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div 
                      v-for="(obat, obatIndex) in riwayat.obat_list" 
                      :key="obatIndex"
                      class="bg-white rounded p-2 border border-blue-100"
                    >
                      <p class="text-sm font-medium text-gray-900">{{ obat.nama_obat }}</p>
                      <p class="text-xs text-gray-600">
                        <span class="font-medium">Dosis:</span> {{ obat.dosis }}
                      </p>
                      <p class="text-xs text-gray-600">
                        <span class="font-medium">Jumlah:</span> {{ obat.jumlah }}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div v-else class="mt-3 pt-3 border-t border-blue-200">
                  <p class="text-sm text-blue-600 italic">
                    <i class="fas fa-info-circle mr-1"></i>
                    Tidak ada obat yang diberikan
                  </p>
                </div>
              </div>
            </div>
            
            <div v-else-if="!loadingRiwayat" class="text-center py-8 text-gray-500">
              <i class="fas fa-notes-medical text-4xl mb-3"></i>
              <p class="text-lg font-medium">Belum ada riwayat berobat</p>
              <p class="text-sm">Pegawai ini belum pernah melakukan pemeriksaan</p>
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
            @click="addMedicalRecord"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
          >
            <i class="fas fa-plus mr-2"></i>
            Tambah Riwayat Berobat
          </button>
          <button 
            @click="downloadDetailPegawai"
            class="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md transition-colors"
          >
            <i class="fas fa-download mr-2"></i>
            Download Detail
          </button>
        </div>
      </div>
    </div>

    <!-- Add Pegawai Modal -->
    <div 
      v-if="showAddModal"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      @click="closeAddModal"
    >
      <div 
        class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-90vh overflow-y-auto"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-800">Tambah Pegawai Pasien</h3>
          <button 
            @click="closeAddModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6">
          <form @submit.prevent="handleSubmitPegawai">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Data Pegawai -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="newPegawai.nama"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama lengkap"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  NIP <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="newPegawai.nip"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan NIP"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Unit Kerja <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="newPegawai.unit_kerja_id"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Unit Kerja</option>
                  <option value="1">Sekretariat</option>
                  <option value="2">Bidang PKP2A</option>
                  <option value="3">Bidang SPKN</option>
                  <option value="4">Pusat Inovasi</option>
                  <option value="5">PSDM</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Jabatan <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="newPegawai.jabatan"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan jabatan"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Golongan
                </label>
                <input
                  v-model="newPegawai.golongan"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: III/a"
                >
              </div>

              <!-- Detail Pegawai -->
              <div class="md:col-span-2 mb-4 mt-6">
                <h4 class="text-md font-semibold text-gray-800 mb-4 border-b pb-2">Detail Pegawai</h4>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  v-model="newPegawai.email"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="email@example.com"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon
                </label>
                <input
                  v-model="newPegawai.telp"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="08xxxxxxxxxx"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Status Kepegawaian <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="newPegawai.status_kepegawaian"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Status</option>
                  <option value="PNS">PNS</option>
                  <option value="PPPK">PPPK</option>
                  <option value="Kontrak">Kontrak</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Pendidikan
                </label>
                <input
                  v-model="newPegawai.pendidikan"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: S1 Administrasi"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Lahir
                </label>
                <input
                  v-model="newPegawai.tanggal_lahir"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Kelamin
                </label>
                <select
                  v-model="newPegawai.jenis_kelamin"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Golongan Darah
                </label>
                <select
                  v-model="newPegawai.nm_goldar"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Golongan Darah</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  TMT CPNS
                </label>
                <input
                  v-model="newPegawai.peg_cpns_tmt"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Alamat
                </label>
                <textarea
                  v-model="newPegawai.alamat"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan alamat lengkap"
                ></textarea>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-3">
              <button 
                type="button"
                @click="closeAddModal"
                class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit"
                :disabled="isSubmitting"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
              >
                <i v-if="isSubmitting" class="fas fa-spinner fa-spin mr-2"></i>
                <i v-else class="fas fa-save mr-2"></i>
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan Pegawai' }}
              </button>
            </div>
          </form>
        </div>
        </div>
      </div>
    </div>

    <!-- Edit Pegawai Modal -->
    <div 
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      @click="closeEditModal"
    >
      <div 
        class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-90vh overflow-y-auto"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-800">Edit Pegawai Pasien</h3>
          <button 
            @click="closeEditModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6">
          <form @submit.prevent="handleSubmitEdit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Data Pegawai -->
              <div class="md:col-span-2 mb-4">
                <h4 class="text-md font-semibold text-gray-800 mb-4 border-b pb-2">Data Pegawai</h4>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="editPegawai.nama"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama lengkap"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  NIP <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="editPegawai.nip"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan NIP"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Unit Kerja <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="editPegawai.unit_kerja_id"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Unit Kerja</option>
                  <option value="1">Sekretariat</option>
                  <option value="2">Bidang PKP2A</option>
                  <option value="3">Bidang SPKN</option>
                  <option value="4">Pusat Inovasi</option>
                  <option value="5">PSDM</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Jabatan <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="editPegawai.jabatan"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan jabatan"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Golongan
                </label>
                <input
                  v-model="editPegawai.golongan"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: III/a"
                >
              </div>

              <!-- Detail Pegawai -->
              <div class="md:col-span-2 mb-4 mt-6">
                <h4 class="text-md font-semibold text-gray-800 mb-4 border-b pb-2">Detail Pegawai</h4>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  v-model="editPegawai.email"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="email@example.com"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon
                </label>
                <input
                  v-model="editPegawai.telp"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="08xxxxxxxxxx"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Status Kepegawaian <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="editPegawai.status_kepegawaian"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Status</option>
                  <option value="PNS">PNS</option>
                  <option value="PPPK">PPPK</option>
                  <option value="Kontrak">Kontrak</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Pendidikan
                </label>
                <input
                  v-model="editPegawai.pendidikan"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: S1 Administrasi"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Lahir
                </label>
                <input
                  v-model="editPegawai.tanggal_lahir"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Kelamin
                </label>
                <select
                  v-model="editPegawai.jenis_kelamin"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Golongan Darah
                </label>
                <select
                  v-model="editPegawai.nm_goldar"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Golongan Darah</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  TMT CPNS
                </label>
                <input
                  v-model="editPegawai.peg_cpns_tmt"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Alamat
                </label>
                <textarea
                  v-model="editPegawai.alamat"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan alamat lengkap"
                ></textarea>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-3">
              <button 
                type="button"
                @click="closeEditModal"
                class="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit"
                :disabled="isEditing"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
              >
                <i v-if="isEditing" class="fas fa-spinner fa-spin mr-2"></i>
                <i v-else class="fas fa-save mr-2"></i>
                {{ isEditing ? 'Menyimpan...' : 'Update Pegawai' }}
              </button>
            </div>
          </form>
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
const filterJabatan = ref('')
const filterStatus = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDetailModalRef = ref(false)
const selectedPegawai = ref(null)
const currentPage = ref(1)
const itemsPerPage = 10
const isSubmitting = ref(false)
const isEditing = ref(false)
const deletingId = ref(null)
const loadingRiwayat = ref(false)

const newPegawai = ref({
  nama: '',
  nip: '',
  unit_kerja_id: '',
  jabatan: '',
  golongan: '',
  eselon: '',
  email: '',
  telp: '',
  status_kepegawaian: '',
  pendidikan: '',
  tanggal_lahir: '',
  jenis_kelamin: '',
  nm_goldar: '',
  peg_cpns_tmt: '',
  alamat: ''
})

const editPegawai = ref({
  id: null,
  nama: '',
  nip: '',
  unit_kerja_id: '',
  jabatan: '',
  golongan: '',
  eselon: '',
  email: '',
  telp: '',
  status_kepegawaian: '',
  pendidikan: '',
  tanggal_lahir: '',
  jenis_kelamin: '',
  nm_goldar: '',
  peg_cpns_tmt: '',
  alamat: ''
})

// Data pegawai
const pegawaiData = ref([])

onMounted(async () => {
  await loadPegawaiData()
})

const loadPegawaiData = async () => {
  try {
    console.log('Loading pegawai data...') // Debug log
    const response = await $fetch('/api/pegawai')
    console.log('API Response:', response) // Debug log
    
    // Handle different response structures
    if (Array.isArray(response)) {
      // Response is directly an array
      pegawaiData.value = response
      console.log('Direct array response - Pegawai data loaded:', pegawaiData.value) // Debug log
    } else if (response && response.success && Array.isArray(response.data)) {
      // Response has success property and data array
      pegawaiData.value = response.data
      console.log('Object response - Pegawai data loaded:', pegawaiData.value) // Debug log
    } else if (response && Array.isArray(response.data)) {
      // Response has data property (without success check)
      pegawaiData.value = response.data
      console.log('Data array response - Pegawai data loaded:', pegawaiData.value) // Debug log
    } else {
      console.error('Unexpected API response structure:', response)
      alert('Format response API tidak sesuai yang diharapkan')
    }
  } catch (error) {
    console.error('Error loading pegawai data:', error)
    alert('Gagal memuat data pegawai: ' + error.message)
  }
}

// Computed
const filteredPegawai = computed(() => {
  let filtered = pegawaiData.value || []
  console.log('Filtering pegawai data:', filtered) // Debug log

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(pegawai => 
      (pegawai.nama || '').toLowerCase().includes(query) ||
      (pegawai.nip || '').includes(query) ||
      (pegawai.nama_unit_kerja || '').toLowerCase().includes(query) ||
      (pegawai.jabatan || '').toLowerCase().includes(query)
    )
  }

  if (filterJabatan.value) {
    filtered = filtered.filter(pegawai => 
      (pegawai.nama_unit_kerja || '').trim() === filterJabatan.value
    )
  }

  if (filterStatus.value) {
    filtered = filtered.filter(pegawai => 
      pegawai.detail?.status_kepegawaian === filterStatus.value
    )
  }

  console.log('Filtered result:', filtered) // Debug log
  return filtered
})

const totalPages = computed(() => Math.ceil(filteredPegawai.value.length / itemsPerPage))
const paginatedPegawai = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const result = filteredPegawai.value.slice(start, start + itemsPerPage)
  console.log('Paginated result:', result) // Debug log
  return result
})

// Methods
const showDetailModalFunc = async (pegawai) => {
  try {
    console.log('Loading detail for pegawai:', pegawai) // Debug log
    
    // Set loading state
    loadingRiwayat.value = true
    
    // Ambil data detail pegawai dari API menggunakan ID
    const response = await $fetch(`/api/pegawai/${pegawai.id}`)
    console.log('Detail API response:', response) // Debug log
    
    let pegawaiData = null
    
    if (response && response.success && response.data) {
      pegawaiData = response.data
    } else {
      // Fallback: gunakan data yang sudah ada
      pegawaiData = pegawai
    }
    
    // Ambil riwayat berobat berdasarkan NIP pegawai menggunakan query parameter
    try {
      const riwayatResponse = await $fetch(`/api/pemeriksaan_pasien?pasien_nip=${pegawaiData.nip}`)
      console.log('Riwayat API response:', riwayatResponse) // Debug log
      
      let riwayatBerobat = []
      
      // Handle berbagai format response
      if (Array.isArray(riwayatResponse)) {
        // Response langsung berupa array
        riwayatBerobat = riwayatResponse
      } else if (riwayatResponse && riwayatResponse.success && Array.isArray(riwayatResponse.data)) {
        // Response dengan success property dan data array
        riwayatBerobat = riwayatResponse.data
      } else if (riwayatResponse && Array.isArray(riwayatResponse.data)) {
        // Response dengan data array (tanpa success check)
        riwayatBerobat = riwayatResponse.data
      }
      
      console.log('Raw riwayat data:', riwayatBerobat) // Debug log
      
      // Format riwayat berobat untuk tampilan
      const formattedRiwayat = riwayatBerobat.map(pemeriksaan => ({
        id: pemeriksaan.id,
        tanggal: pemeriksaan.tanggal_pemeriksaan,
        waktu: pemeriksaan.waktu_pemeriksaan,
        jenis_pemeriksaan: pemeriksaan.jenis_pemeriksaan,
        keluhan: pemeriksaan.keluhan,
        diagnosa: pemeriksaan.diagnosis?.nama_diagnosa || 'Diagnosis tidak tersedia',
        kode_icd: pemeriksaan.diagnosis?.kode_icd || '',
        kategori_diagnosis: pemeriksaan.diagnosis?.kategori || '',
        tindakan: pemeriksaan.tindakan,
        dokter: pemeriksaan.dokter,
        status: pemeriksaan.status,
        obat_list: pemeriksaan.obat?.map(obat => ({
          nama_obat: obat.nama_obat,
          dosis: obat.dosis,
          jumlah: obat.jumlah
        })) || []
      }))
      
      console.log('Formatted riwayat:', formattedRiwayat) // Debug log
      
      // Tambahkan riwayat ke data pegawai
      pegawaiData.riwayatBerobat = formattedRiwayat
      
    } catch (riwayatError) {
      console.error('Error loading riwayat berobat:', riwayatError)
      // Jika gagal ambil riwayat, set empty array
      pegawaiData.riwayatBerobat = []
    }
    
    selectedPegawai.value = pegawaiData
    showDetailModalRef.value = true
    
  } catch (error) {
    console.error('Error loading pegawai detail:', error)
    // Fallback: gunakan data yang sudah ada tanpa riwayat
    selectedPegawai.value = { ...pegawai, riwayatBerobat: [] }
    showDetailModalRef.value = true
  } finally {
    loadingRiwayat.value = false
  }
}

const closeDetailModal = () => {
  showDetailModalRef.value = false
  selectedPegawai.value = null
}

const editFromDetail = () => {
  if (selectedPegawai.value) {
    populateEditForm(selectedPegawai.value)
    closeDetailModal()
    showEditModal.value = true
  }
}

const addMedicalRecord = () => {
  closeDetailModal()
  // Implement add medical record functionality
  console.log('Add medical record for:', selectedPegawai.value.nama)
}

// Download detail pegawai dan riwayat berobat sebagai file JSON
const downloadDetailPegawai = () => {
  if (!selectedPegawai.value) return
  const data = {
    nama: selectedPegawai.value.nama,
    nip: selectedPegawai.value.nip,
    unit_kerja: selectedPegawai.value.nama_unit_kerja,
    jabatan: selectedPegawai.value.jabatan,
    golongan: selectedPegawai.value.golongan,
    eselon: selectedPegawai.value.eselon,
    detail: selectedPegawai.value.detail,
    riwayatBerobat: selectedPegawai.value.riwayatBerobat
  }
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `detail_pegawai_${selectedPegawai.value.nip || selectedPegawai.value.nama}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    return dateString
  }
}

const formatGender = (jenisKelamin) => {
  if (jenisKelamin === 'L') return 'Laki-laki'
  if (jenisKelamin === 'P') return 'Perempuan'
  return jenisKelamin || '-'
}

// Handle edit pegawai dengan modal
const handleEditPegawai = async (pegawai) => {
  try {
    // Ambil data lengkap pegawai dari API
    const response = await $fetch(`/api/pegawai/${pegawai.id}`)
    if (response && response.success && response.data) {
      populateEditForm(response.data)
      showEditModal.value = true
    } else {
      // Fallback: gunakan data yang sudah ada
      populateEditForm(pegawai)
      showEditModal.value = true
    }
  } catch (error) {
    console.error('Error loading pegawai for edit:', error)
    // Fallback: gunakan data yang sudah ada
    populateEditForm(pegawai)
    showEditModal.value = true
  }
}

const populateEditForm = (pegawai) => {
  editPegawai.value = {
    id: pegawai.id,
    nama: pegawai.nama || '',
    nip: pegawai.nip || '',
    unit_kerja_id: pegawai.unit_kerja_id || '',
    jabatan: pegawai.jabatan || '',
    golongan: pegawai.golongan || '',
    eselon: pegawai.eselon || '',
    email: pegawai.detail?.email || '',
    telp: pegawai.detail?.telp || '',
    status_kepegawaian: pegawai.detail?.status_kepegawaian || '',
    pendidikan: pegawai.detail?.pendidikan || '',
    tanggal_lahir: pegawai.detail?.tanggal_lahir || '',
    jenis_kelamin: pegawai.detail?.jenis_kelamin || '',
    nm_goldar: pegawai.detail?.nm_goldar || '',
    peg_cpns_tmt: pegawai.detail?.peg_cpns_tmt || '',
    alamat: pegawai.detail?.alamat || ''
  }
}

const handleSubmitEdit = async () => {
  if (isEditing.value) return
  
  isEditing.value = true
  
  try {
    const response = await $fetch(`/api/pegawai/${editPegawai.value.id}`, {
      method: 'PUT',
      body: editPegawai.value
    })
    
    if (response && response.success) {
      // Reload data setelah update
      await loadPegawaiData()
      
      alert('Data pegawai berhasil diupdate!')
      closeEditModal()
    } else {
      alert(response?.message || 'Gagal mengupdate data pegawai')
    }
  } catch (error) {
    console.error('Error updating pegawai:', error)
    alert('Terjadi kesalahan saat mengupdate data pegawai')
  } finally {
    isEditing.value = false
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  resetEditForm()
}

const resetEditForm = () => {
  editPegawai.value = {
    id: null,
    nama: '',
    nip: '',
    unit_kerja_id: '',
    jabatan: '',
    golongan: '',
    eselon: '',
    email: '',
    telp: '',
    status_kepegawaian: '',
    pendidikan: '',
    tanggal_lahir: '',
    jenis_kelamin: '',
    nm_goldar: '',
    peg_cpns_tmt: '',
    alamat: ''
  }
}

// Handle delete pegawai menggunakan API
const handleDeletePegawai = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus pegawai ini? Data yang dihapus tidak dapat dikembalikan.')) {
    return
  }
  
  deletingId.value = id
  
  try {
    const response = await $fetch(`/api/pegawai/${id}`, {
      method: 'DELETE'
    })

    if (response && response.success) {
      // Reload data setelah delete
      await loadPegawaiData()

      // Reset pagination jika perlu
      if (currentPage.value > totalPages.value && totalPages.value > 0) {
        currentPage.value = totalPages.value
      }

      alert(response.message || 'Data pegawai berhasil dihapus!')
    } else {
      alert(response?.message || 'Gagal menghapus data pegawai')
    }
  } catch (error) {
    console.error('Error deleting pegawai:', error)
    alert('Terjadi kesalahan saat menghapus data pegawai')
  } finally {
    deletingId.value = null
  }
}

// Handle submit pegawai baru
const handleSubmitPegawai = async () => {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    const response = await $fetch('/api/pegawai', {
      method: 'POST',
      body: newPegawai.value
    })
    
    if (response && response.success) {
      // Reload data setelah tambah
      await loadPegawaiData()
      
      alert('Pegawai berhasil ditambahkan!')
      closeAddModal()
    } else {
      alert(response?.message || 'Gagal menambahkan pegawai')
    }
  } catch (error) {
    console.error('Error adding pegawai:', error)
    alert('Terjadi kesalahan saat menambahkan pegawai')
  } finally {
    isSubmitting.value = false
  }
}

const closeAddModal = () => {
  showAddModal.value = false
  resetForm()
}

const resetForm = () => {
  newPegawai.value = {
    nama: '',
    nip: '',
    unit_kerja_id: '',
    jabatan: '',
    golongan: '',
    eselon: '',
    email: '',
    telp: '',
    status_kepegawaian: '',
    pendidikan: '',
    tanggal_lahir: '',
    jenis_kelamin: '',
    nm_goldar: '',
    peg_cpns_tmt: '',
    alamat: ''
  }
}

// Method untuk copy address
const copyAddress = async () => {
  if (selectedPegawai.value?.detail?.alamat) {
    try {
      await navigator.clipboard.writeText(selectedPegawai.value.detail.alamat)
      alert('Alamat berhasil disalin!')
    } catch (error) {
      console.error('Failed to copy address:', error)
      // Fallback untuk browser yang tidak support clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = selectedPegawai.value.detail.alamat
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Alamat berhasil disalin!')
    }
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
