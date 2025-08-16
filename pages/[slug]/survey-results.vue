<template>
  <div>
    <!-- Welcome Section -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ greeting }}, {{ displayName }}!</h2>
      <p class="text-blue-700 font-semibold mb-1">Sehat Selalu yah! Jangan sakit, nanti yang jaga klinik siapa kalau sakit 😊</p>
      <p class="text-gray-600">Ini adalah Ringkasan dan Statistik Klinik Kita. Ringkasan dan statistik sistem klinik LAN</p>
    </div>

    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Hasil Survey Kepuasan</h2>
          <p class="text-gray-600">Data hasil survey kepuasan pelayanan Poliklinik LAN</p>
        </div>
        <div class="flex items-center space-x-4 mt-4 sm:mt-0">
          <!-- Filter Tanggal -->
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">Periode:</label>
            <select v-model="selectedPeriod" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option value="all">Semua</option>
              <option value="today">Hari Ini</option>
              <option value="week">Minggu Ini</option>
              <option value="month">Bulan Ini</option>
              <option value="year">Tahun Ini</option>
            </select>
          </div>
          <!-- Export Button -->
          <button 
            @click="exportData"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <i class="fas fa-download mr-2"></i>
            Export Excel
          </button>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-500 bg-opacity-75">
            <i class="fas fa-chart-line text-white text-xl"></i>
          </div>
          <div class="ml-5">
            <p class="text-sm font-medium text-gray-500">Total Responden</p>
            <p class="text-2xl font-bold text-gray-900">{{ summaryStats.totalResponden }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-500 bg-opacity-75">
            <i class="fas fa-star text-white text-xl"></i>
          </div>
          <div class="ml-5">
            <p class="text-sm font-medium text-gray-500">Rata-rata Score</p>
            <p class="text-2xl font-bold text-gray-900">{{ summaryStats.averageScore.toFixed(1) }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-500 bg-opacity-75">
            <i class="fas fa-thumbs-up text-white text-xl"></i>
          </div>
          <div class="ml-5">
            <p class="text-sm font-medium text-gray-500">Tingkat Kepuasan</p>
            <p class="text-2xl font-bold text-gray-900">{{ summaryStats.satisfactionLevel }}%</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-500 bg-opacity-75">
            <i class="fas fa-calendar text-white text-xl"></i>
          </div>
          <div class="ml-5">
            <p class="text-sm font-medium text-gray-500">Survey Hari Ini</p>
            <p class="text-2xl font-bold text-gray-900">{{ summaryStats.todaySurvey }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section: Pie Chart per Pertanyaan -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Mekanisme/Prosedur</h3>
        <div ref="mekanismePie" style="width:100%;height:300px"></div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Kemampuan Petugas</h3>
        <div ref="petugasPie" style="width:100%;height:300px"></div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Sarana & Prasarana</h3>
        <div ref="saranaPie" style="width:100%;height:300px"></div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Sesuai Harapan</h3>
        <div ref="harapanPie" style="width:100%;height:300px"></div>
      </div>
    </div>

    <!-- Detailed Table -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h3 class="text-lg font-semibold text-gray-800">Data Detail Survey</h3>
        <div class="flex items-center space-x-4 mt-4 sm:mt-0">
          <!-- Search -->
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari data..."
              class="border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
          <!-- Items per page -->
          <select v-model="itemsPerPage" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option value="10">10 per halaman</option>
            <option value="25">25 per halaman</option>
            <option value="50">50 per halaman</option>
          </select>
        </div>
      </div>

      <!-- Filter Section -->
      <div class="px-6 py-4 flex flex-wrap gap-4">
        <select v-model="filterGender" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option value="">Semua Gender</option>
          <option value="Pria">Pria</option>
          <option value="Wanita">Wanita</option>
        </select>
        <select v-model="filterPasien" class="border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option value="">Semua Jenis Pasien</option>
          <option value="Pegawai">Pegawai</option>
          <option value="PPNPN">PPNPN</option>
          <option value="Peserta Pelatihan">Peserta Pelatihan</option>
          <option value="Tamu">Tamu</option>
        </select>
        <input v-model.number="filterUsiaMin" type="number" min="1" max="120" placeholder="Usia Min" class="border border-gray-300 rounded-md px-3 py-2 text-sm w-24">
        <input v-model.number="filterUsiaMax" type="number" min="1" max="120" placeholder="Usia Max" class="border border-gray-300 rounded-md px-3 py-2 text-sm w-24">
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mekanisme/Prosedur</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kemampuan Petugas</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sarana & Prasarana</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Obat Sesuai</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sesuai Harapan</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saran/Kritik</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rata-rata</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in paginatedData" :key="item.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(item.tanggal_submit) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.mekanisme ? getLabel(item.mekanisme) : '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.petugas ? getLabel(item.petugas) : '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.sarana ? getLabel(item.sarana) : '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.obat }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.harapan ? getLabel(item.harapan) : '-' }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ item.saran }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span :class="getScoreColor(item.average)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ item.average.toFixed(1) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="text-sm text-gray-700">
          Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} sampai 
          {{ Math.min(currentPage * itemsPerPage, filteredData.length) }} dari 
          {{ filteredData.length }} data
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="currentPage = Math.max(1, currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sebelumnya
          </button>
          <span class="px-3 py-2 text-sm text-gray-700">
            Halaman {{ currentPage }} dari {{ totalPages }}
          </span>
          <button
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>

    <!-- Gender and Patient Type Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-8">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-2">Statistik Gender</h3>
        <p>Pria: {{ filteredData.filter(i => i.gender === 'Pria').length }}</p>
        <p>Wanita: {{ filteredData.filter(i => i.gender === 'Wanita').length }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-2">Statistik Jenis Pasien</h3>
        <p>Pegawai: {{ filteredData.filter(i => i.pasien === 'Pegawai').length }}</p>
        <p>PPNPN: {{ filteredData.filter(i => i.pasien === 'PPNPN').length }}</p>
        <p>Peserta Pelatihan: {{ filteredData.filter(i => i.pasien === 'Peserta Pelatihan').length }}</p>
        <p>Tamu: {{ filteredData.filter(i => i.pasien === 'Tamu').length }}</p>
      </div>
    </div>

    <!-- Loading and Error Messages -->
    <div v-if="isLoading" class="text-center py-8 text-gray-500">Memuat data survey...</div>
    <div v-if="fetchError" class="text-center py-8 text-red-500">{{ fetchError }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import * as XLSX from 'xlsx'
import { useUserStore } from '~/stores/user'
import { storeToRefs } from 'pinia'

// Set layout
definePageMeta({
  layout: 'admin'
})

// Reactive data
const selectedPeriod = ref('all')
const searchQuery = ref('')
const itemsPerPage = ref(10)
const currentPage = ref(1)
const surveyData = ref([])
const totalResponden = ref(0)
const isLoading = ref(true)
const fetchError = ref('')
const filterGender = ref('')
const filterPasien = ref('')
const filterUsiaMin = ref('')
const filterUsiaMax = ref('')
const userStore = useUserStore()
userStore.hydrate?.() // panggil hydrate jika ada
const { user } = storeToRefs(userStore)

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 11) return 'Selamat Pagi'
  if (hour < 15) return 'Selamat Siang'
  if (hour < 18) return 'Selamat Sore'
  return 'Selamat Malam'
})

const displayName = computed(() => {
  if (user.value && user.value.nama) return user.value.nama
  if (user.value && user.value.username) return user.value.username
  return ''
})

// Chart refs
const mekanismePie = ref(null)
const petugasPie = ref(null)
const saranaPie = ref(null)
const harapanPie = ref(null)

// Store chart instances untuk cleanup
const chartInstances = ref([])

// Fetch data from API
async function fetchSurveyData() {
  isLoading.value = true
  fetchError.value = ''
  try {
    const res = await $fetch('/api/responden')
    if (res && res.success) {
      surveyData.value = res.data
      totalResponden.value = res.totalResponden
      // Panggil pie chart setelah data berhasil di-fetch
      if (res.recap) {
        await nextTick()
        initPieCharts(res.recap)
      }
    } else {
      fetchError.value = res?.message || 'Gagal mengambil data'
    }
  } catch (e) {
    fetchError.value = e?.message || 'Gagal fetch data survey'
  } finally {
    isLoading.value = false
  }
}

// Fungsi untuk render pie chart dari rekap endpoint
function renderPieChart(refElement, recap, colors, title) {
  if (!refElement?.value || !recap || Object.keys(recap).length === 0) {
    console.warn(`Chart ref atau data tidak tersedia untuk ${title}`)
    return
  }
  
  try {
    // Dispose chart jika sudah ada
    const existingChart = echarts.getInstanceByDom(refElement.value)
    if (existingChart) {
      existingChart.dispose()
    }
    
    const chart = echarts.init(refElement.value)
    
    // Store chart instance untuk cleanup
    chartInstances.value.push(chart)
    
    chart.setOption({
      tooltip: { 
        trigger: 'item', 
        formatter: '{b}: {c} ({d}%)' 
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: {
          fontSize: 10
        }
      },
      series: [{
        type: 'pie',
        radius: '50%',
        center: ['60%', '50%'],
        label: { 
          show: true, 
          formatter: '{d}%', 
          fontSize: 10
        },
        data: Object.entries(recap).map(([name, value], i) => ({
          name,
          value,
          itemStyle: { color: colors[i % colors.length] }
        }))
      }]
    })
    
    console.log(`Chart ${title} berhasil dirender`)
  } catch (error) {
    console.error(`Error rendering chart ${title}:`, error)
  }
}

function initPieCharts(recap) {
  console.log('Initializing pie charts with recap:', recap)
  
  // Delay untuk memastikan DOM sudah siap
  setTimeout(() => {
    renderPieChart(
      mekanismePie, 
      recap.mekanisme || {}, 
      ['#F59E0B', '#FBBF24', '#FCD34D', '#92400E', '#D97706'], 
      'Mekanisme/Prosedur'
    )
    renderPieChart(
      petugasPie, 
      recap.petugas || {}, 
      ['#10B981', '#34D399', '#6EE7B7', '#059669', '#047857'], 
      'Kemampuan Petugas'
    )
    renderPieChart(
      saranaPie, 
      recap.sarana || {}, 
      ['#EC4899', '#F472B6', '#F9A8D4', '#BE185D', '#9D174D'], 
      'Sarana & Prasarana'
    )
    renderPieChart(
      harapanPie, 
      recap.harapan || {}, 
      ['#4F46E5', '#818CF8', '#A5B4FC', '#3730A3', '#312E81'], 
      'Sesuai Harapan'
    )
  }, 100)
}

// Cleanup charts on unmount
onUnmounted(() => {
  chartInstances.value.forEach(chart => {
    if (chart) {
      chart.dispose()
    }
  })
  chartInstances.value = []
})

// Window resize handler
const handleResize = () => {
  chartInstances.value.forEach(chart => {
    if (chart) {
      chart.resize()
    }
  })
}

onMounted(async () => {
  await fetchSurveyData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Helper for mapping jawaban to score (Likert scale)
const likertMap = {
  'Sangat Sulit': 1, 'Sulit': 2, 'Cukup Mudah': 3, 'Mudah': 4, 'Sangat Mudah': 5,
  'Sangat Tidak Kompeten': 1, 'Tidak Kompeten': 2, 'Cukup Kompeten': 3, 'Kompeten': 4, 'Sangat Kompeten': 5,
  'Sangat Buruk': 1, 'Buruk': 2, 'Cukup Nyaman': 3, 'Nyaman': 4, 'Sangat Nyaman': 5,
  'Sangat Tidak Sesuai': 1, 'Tidak Sesuai': 2, 'Cukup Sesuai': 3, 'Sesuai': 4, 'Sangat Sesuai': 5
}

// Transform API data for table and chart
const transformedData = computed(() => {
  if (!surveyData.value || surveyData.value.length === 0) return []
  
  return surveyData.value.map(item => {
    const j = item.jawaban || {}
    return {
      id: item.id,
      tanggal_submit: item.tanggal_submit,
      gender: item.jenis_kelamin,
      pasien: item.jenis_pasien,
      usia: item.usia,
      mekanisme: likertMap[j['mekanisme atau prosedur untuk mendapatkan layanan di Klinik LAN?']] || 0,
      petugas: likertMap[j['kemampuan petugas dalam memberikan pelayanan?']] || 0,
      sarana: likertMap[j['kualitas sarana dan prasarana di Klinik LAN?']] || 0,
      obat: j['mendapatkan obat yang dibutuhkan sesuai sakitnya?'] || '',
      harapan: likertMap[j['pelayanan Klinik LAN sudah sesuai harapan?']] || 0,
      saran: j['Saran'] || '',
      average: (
        (
          (likertMap[j['mekanisme atau prosedur untuk mendapatkan layanan di Klinik LAN?']] || 0) +
          (likertMap[j['kemampuan petugas dalam memberikan pelayanan?']] || 0) +
          (likertMap[j['kualitas sarana dan prasarana di Klinik LAN?']] || 0) +
          (likertMap[j['pelayanan Klinik LAN sudah sesuai harapan?']] || 0)
        ) / 4
      ) || 0
    }
  })
})

const filteredData = computed(() => {
  let filtered = transformedData.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item =>
      item.saran.toLowerCase().includes(query) ||
      item.obat.toLowerCase().includes(query)
    )
  }
  // Filter by period
  if (selectedPeriod.value !== 'all') {
    const now = new Date()
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.tanggal_submit)
      switch (selectedPeriod.value) {
        case 'today':
          return itemDate.toDateString() === now.toDateString()
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return itemDate >= weekAgo
        case 'month':
          return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()
        case 'year':
          return itemDate.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })
  }
  // Filter by gender
  if (filterGender.value) {
    filtered = filtered.filter(item => item.gender === filterGender.value)
  }
  // Filter by patient type
  if (filterPasien.value) {
    filtered = filtered.filter(item => item.pasien === filterPasien.value)
  }
  // Filter by age
  if (filterUsiaMin.value) {
    filtered = filtered.filter(item => item.usia >= filterUsiaMin.value)
  }
  if (filterUsiaMax.value) {
    filtered = filtered.filter(item => item.usia <= filterUsiaMax.value)
  }
  return filtered
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value))
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredData.value.slice(start, end)
})

// Summary stats
const summaryStats = computed(() => {
  const total = filteredData.value.length
  const avgScore = total
    ? filteredData.value.reduce((sum, item) => sum + item.average, 0) / total
    : 0
  const satisfiedCount = filteredData.value.filter(item => item.average >= 4).length
  const satisfactionLevel = total ? (satisfiedCount / total) * 100 : 0
  const today = new Date().toDateString()
  const todayCount = filteredData.value.filter(item =>
    new Date(item.tanggal_submit).toDateString() === today
  ).length
  return {
    totalResponden: totalResponden.value,
    averageScore: avgScore,
    satisfactionLevel: Math.round(satisfactionLevel),
    todaySurvey: todayCount
  }
})

// Table helpers
const getLabel = score => {
  const labels = ['Sangat Tidak Puas', 'Tidak Puas', 'Biasa Saja', 'Puas', 'Sangat Puas']
  return score >= 1 && score <= 5 ? labels[score - 1] : 'Tidak Ada Data'
}

const getScoreColor = score => {
  if (score >= 4.5) return 'bg-green-100 text-green-800'
  if (score >= 3.5) return 'bg-yellow-100 text-yellow-800'
  if (score >= 2.5) return 'bg-orange-100 text-orange-800'
  return 'bg-red-100 text-red-800'
}

const formatDate = dateString => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const exportData = () => {
  const exportRows = filteredData.value.map(item => ({
    Tanggal: formatDate(item.tanggal_submit),
    Gender: item.gender,
    'Jenis Pasien': item.pasien,
    Usia: item.usia,
    'Mekanisme/Prosedur': item.mekanisme,
    'Kemampuan Petugas': item.petugas,
    'Sarana & Prasarana': item.sarana,
    'Obat Sesuai': item.obat,
    'Sesuai Harapan': item.harapan,
    'Saran/Kritik': item.saran,
    'Rata-rata': item.average.toFixed(1)
  }))
  const worksheet = XLSX.utils.json_to_sheet(exportRows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Survey')
  XLSX.writeFile(workbook, 'hasil-survey-poliklinik.xlsx')
}

useSeoMeta({
  title: 'Hasil Survey - Admin Poliklinik LAN',
  description: 'Data hasil survey kepuasan pelayanan Poliklinik LAN'
})
</script>