<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div class="mb-4 sm:mb-0">
        <h2 class="text-xl font-semibold text-gray-800">Laporan Mutasi Obat</h2>
        <p class="text-gray-600">Laporan stok masuk dan keluar obat-obatan</p>
      </div>
      <div class="flex gap-2">
        <button 
          @click="exportToExcel"
          class="btn btn-success"
        >
          <i class="fas fa-file-excel mr-2"></i>
          Export Excel
        </button>
        <button 
          @click="exportToPDF"
          class="btn btn-danger"
        >
          <i class="fas fa-file-pdf mr-2"></i>
          Export PDF
        </button>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
          <input
            v-model="filterTanggalMulai"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Selesai</label>
          <input
            v-model="filterTanggalSelesai"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Mutasi</label>
          <select
            v-model="filterJenisMutasi"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua</option>
            <option value="masuk">Stok Masuk</option>
            <option value="keluar">Stok Keluar</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Obat</label>
          <select
            v-model="filterObat"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Obat</option>
            <option v-for="obat in daftarObat" :key="obat.id" :value="obat.id">
              {{ obat.nama }}
            </option>
          </select>
        </div>
        <div class="flex items-end">
          <button 
            @click="applyFilter"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <i class="fas fa-search mr-2"></i>
            Filter
          </button>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-500 bg-opacity-75">
            <i class="fas fa-arrow-down text-white text-xl"></i>
          </div>
          <div class="ml-5">
            <p class="text-sm font-medium text-gray-500">Total Stok Masuk</p>
            <p class="text-2xl font-bold text-gray-900">{{ summaryStats.totalMasuk }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-red-500 bg-opacity-75">
            <i class="fas fa-arrow-up text-white text-xl"></i>
          </div>
          <div class="ml-5">
            <p class="text-sm font-medium text-gray-500">Total Stok Keluar</p>
            <p class="text-2xl font-bold text-gray-900">{{ summaryStats.totalKeluar }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-500 bg-opacity-75">
            <i class="fas fa-exchange-alt text-white text-xl"></i>
          </div>
          <div class="ml-5">
            <p class="text-sm font-medium text-gray-500">Total Transaksi</p>
            <p class="text-2xl font-bold text-gray-900">{{ summaryStats.totalTransaksi }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-500 bg-opacity-75">
            <i class="fas fa-pills text-white text-xl"></i>
          </div>
          <div class="ml-5">
            <p class="text-sm font-medium text-gray-500">Jenis Obat</p>
            <p class="text-2xl font-bold text-gray-900">{{ summaryStats.jenisObat }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Chart Mutasi Harian -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Mutasi Stok Harian</h3>
        <div ref="chartMutasiHarian" style="width:100%;height:300px"></div>
      </div>

      <!-- Chart Top Obat -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Top 10 Obat Dengan Mutasi Terbanyak</h3>
        <div ref="chartTopObat" style="width:100%;height:300px"></div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800">Detail Mutasi Obat</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Obat</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jenis Mutasi</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stok Sebelum</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stok Sesudah</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(mutasi, index) in paginatedMutasi" :key="mutasi.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(mutasi.tanggal) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ mutasi.nama_obat }}</div>
                <div class="text-sm text-gray-500">{{ mutasi.bahan_aktif }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': mutasi.jenis_mutasi === 'masuk',
                    'bg-red-100 text-red-800': mutasi.jenis_mutasi === 'keluar'
                  }"
                >
                  <i class="fas mr-1" :class="{
                    'fa-arrow-down': mutasi.jenis_mutasi === 'masuk',
                    'fa-arrow-up': mutasi.jenis_mutasi === 'keluar'
                  }"></i>
                  {{ mutasi.jenis_mutasi === 'masuk' ? 'Stok Masuk' : 'Stok Keluar' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                {{ mutasi.jumlah }} unit
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ mutasi.stok_sebelum }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ mutasi.stok_sesudah }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ mutasi.keterangan || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} sampai 
          {{ Math.min(currentPage * itemsPerPage, filteredMutasi.length) }} dari 
          {{ filteredMutasi.length }} data
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Sebelumnya
          </button>
          <span class="px-3 py-2 text-sm text-gray-700">
            Halaman {{ currentPage }} dari {{ totalPages }}
          </span>
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import * as XLSX from 'xlsx'

// Set layout
definePageMeta({
  layout: 'admin'
})

// Reactive data
const filterTanggalMulai = ref('')
const filterTanggalSelesai = ref('')
const filterJenisMutasi = ref('')
const filterObat = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(20)

const mutasiData = ref([])
const daftarObat = ref([])

// Chart refs
const chartMutasiHarian = ref(null)
const chartTopObat = ref(null)

// Fetch data
const fetchMutasiData = async () => {
  try {
    const res = await $fetch('/api/mutasi-obat', {
      query: {
        tanggal_mulai: filterTanggalMulai.value,
        tanggal_selesai: filterTanggalSelesai.value,
        jenis_mutasi: filterJenisMutasi.value,
        obat_id: filterObat.value
      }
    })
    if (res.success) {
      mutasiData.value = res.data
      await nextTick()
      renderCharts()
    }
  } catch (e) {
    console.error('Error fetching mutasi data:', e)
  }
}

const fetchDaftarObat = async () => {
  try {
    const res = await $fetch('/api/master_obat')
    if (res.success) {
      daftarObat.value = res.data.map(item => ({
        id: item.id,
        nama: item.nama_obat
      }))
    }
  } catch (e) {
    console.error('Error fetching obat data:', e)
  }
}

// Computed properties
const filteredMutasi = computed(() => {
  return mutasiData.value
})

const totalPages = computed(() => Math.ceil(filteredMutasi.value.length / itemsPerPage.value))

const paginatedMutasi = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredMutasi.value.slice(start, start + itemsPerPage.value)
})

const summaryStats = computed(() => {
  const totalMasuk = mutasiData.value
    .filter(m => m.jenis_mutasi === 'masuk')
    .reduce((sum, m) => sum + m.jumlah, 0)
  
  const totalKeluar = mutasiData.value
    .filter(m => m.jenis_mutasi === 'keluar')
    .reduce((sum, m) => sum + m.jumlah, 0)
  
  const totalTransaksi = mutasiData.value.length
  
  const jenisObat = new Set(mutasiData.value.map(m => m.obat_id)).size

  return {
    totalMasuk,
    totalKeluar,
    totalTransaksi,
    jenisObat
  }
})

// Methods
const applyFilter = () => {
  currentPage.value = 1
  fetchMutasiData()
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const renderCharts = () => {
  // Chart Mutasi Harian
  if (chartMutasiHarian.value) {
    const chart1 = echarts.init(chartMutasiHarian.value)
    
    // Group data by date
    const groupedByDate = {}
    mutasiData.value.forEach(m => {
      const date = new Date(m.tanggal).toDateString()
      if (!groupedByDate[date]) {
        groupedByDate[date] = { masuk: 0, keluar: 0 }
      }
      groupedByDate[date][m.jenis_mutasi] += m.jumlah
    })
    
    const dates = Object.keys(groupedByDate).sort()
    const dataMasuk = dates.map(date => groupedByDate[date].masuk)
    const dataKeluar = dates.map(date => groupedByDate[date].keluar)
    
    chart1.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['Stok Masuk', 'Stok Keluar'] },
      xAxis: { type: 'category', data: dates.map(d => new Date(d).toLocaleDateString('id-ID')) },
      yAxis: { type: 'value' },
      series: [
        { name: 'Stok Masuk', type: 'bar', data: dataMasuk, itemStyle: { color: '#10B981' } },
        { name: 'Stok Keluar', type: 'bar', data: dataKeluar, itemStyle: { color: '#EF4444' } }
      ]
    })
  }
  
  // Chart Top Obat
  if (chartTopObat.value) {
    const chart2 = echarts.init(chartTopObat.value)
    
    // Group by obat
    const groupedByObat = {}
    mutasiData.value.forEach(m => {
      if (!groupedByObat[m.nama_obat]) {
        groupedByObat[m.nama_obat] = 0
      }
      groupedByObat[m.nama_obat] += m.jumlah
    })
    
    const sortedObat = Object.entries(groupedByObat)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
    
    chart2.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'value' },
      yAxis: { type: 'category', data: sortedObat.map(([name]) => name) },
      series: [{
        type: 'bar',
        data: sortedObat.map(([, value]) => value),
        itemStyle: { color: '#8B5CF6' }
      }]
    })
  }
}

const exportToExcel = () => {
  const exportData = mutasiData.value.map((item, index) => ({
    'No': index + 1,
    'Tanggal': formatDate(item.tanggal),
    'Nama Obat': item.nama_obat,
    'Jenis Mutasi': item.jenis_mutasi === 'masuk' ? 'Stok Masuk' : 'Stok Keluar',
    'Jumlah': item.jumlah,
    'Stok Sebelum': item.stok_sebelum,
    'Stok Sesudah': item.stok_sesudah,
    'Keterangan': item.keterangan || '-'
  }))
  
  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Mutasi Obat')
  XLSX.writeFile(workbook, `laporan-mutasi-obat-${new Date().toISOString().split('T')[0]}.xlsx`)
}

const exportToPDF = () => {
  // Implement PDF export with jsPDF or similar library
  alert('Export PDF akan segera tersedia')
}

// Lifecycle
onMounted(async () => {
  // Set default date range (last 30 days)
  const today = new Date()
  const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  filterTanggalSelesai.value = today.toISOString().split('T')[0]
  filterTanggalMulai.value = lastMonth.toISOString().split('T')[0]
  
  await fetchDaftarObat()
  await fetchMutasiData()
})

// SEO
useSeoMeta({
  title: 'Laporan Mutasi Obat - Admin klinik LAN',
  description: 'Laporan mutasi stok masuk dan keluar obat-obatan'
})
</script>