<!-- pages/admin/survey-results.vue -->
<template>
  <div>
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

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Overall Satisfaction Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Distribusi Tingkat Kepuasan</h3>
        <div id="satisfactionDistribution" class="w-full h-80"></div>
      </div>

      <!-- Questions Average Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Rata-rata Per Pertanyaan</h3>
        <div id="questionsAverage" class="w-full h-80"></div>
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
      <div class="flex flex-wrap gap-4 mb-4">
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
              <th>No</th>
              <th>Tanggal</th>
              <th>Mekanisme/Prosedur</th>
              <th>Kemampuan Petugas</th>
              <th>Sarana & Prasarana</th>
              <th>Obat Sesuai</th>
              <th>Sesuai Harapan</th>
              <th>Saran/Kritik</th>
              <th>Rata-rata</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in paginatedData" :key="item.id">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ formatDate(item.tanggal_submit) }}</td>
              <td>{{ item.mekanisme ? getLabel(item.mekanisme) : '-' }}</td>
              <td>{{ item.petugas ? getLabel(item.petugas) : '-' }}</td>
              <td>{{ item.sarana ? getLabel(item.sarana) : '-' }}</td>
              <td>{{ item.obat }}</td>
              <td>{{ item.harapan ? getLabel(item.harapan) : '-' }}</td>
              <td>{{ item.saran }}</td>
              <td>
                <span :class="getScoreColor(item.average)">
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
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
import { ref, computed, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import * as XLSX from 'xlsx'

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

// Fetch data from API
async function fetchSurveyData() {
  isLoading.value = true
  fetchError.value = ''
  try {
    const res = await $fetch('/api/responden')
    if (res && res.success) {
      surveyData.value = res.data
      totalResponden.value = res.totalResponden
    } else {
      fetchError.value = res?.message || 'Gagal mengambil data'
    }
  } catch (e) {
    fetchError.value = e?.message || 'Gagal fetch data survey'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchSurveyData()
  nextTick(() => setTimeout(initCharts, 200))
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
  return surveyData.value.map(item => {
    const j = item.jawaban || {}
    return {
      id: item.id,
      tanggal_submit: item.tanggal_submit,
      gender: item.jenis_kelamin,      // Tambahkan ini
      pasien: item.jenis_pasien,       // Tambahkan ini
      usia: item.usia,                 // Tambahkan ini
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
const getEmoji = score => {
  const emojis = ['😠', '🙁', '😐', '🙂', '😄']
  return score >= 1 && score <= 5 ? emojis[score - 1] : '❓'
}
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
const getSatisfactionBadge = score => {
  if (score >= 4.5) return 'bg-green-100 text-green-800'
  if (score >= 3.5) return 'bg-blue-100 text-blue-800'
  if (score >= 2.5) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}
const getSatisfactionText = score => {
  if (score >= 4.5) return 'Sangat Puas'
  if (score >= 3.5) return 'Puas'
  if (score >= 2.5) return 'Cukup'
  return 'Kurang'
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

// Chart initialization (gunakan transformedData)
const initCharts = () => {
  // Satisfaction Distribution Chart
  const satisfactionChart = echarts.init(document.getElementById('satisfactionDistribution'))
  const satisfactionCounts = [0, 0, 0, 0, 0]
  transformedData.value.forEach(item => {
    const avgRounded = Math.round(item.average)
    if (avgRounded >= 1 && avgRounded <= 5) {
      satisfactionCounts[avgRounded - 1]++
    }
  })
  satisfactionChart.setOption({
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', left: 'left' },
    series: [{
      name: 'Tingkat Kepuasan',
      type: 'pie',
      radius: '60%',
      data: [
        { value: satisfactionCounts[0], name: 'Sangat Tidak Puas', itemStyle: { color: '#EF4444' } },
        { value: satisfactionCounts[1], name: 'Tidak Puas', itemStyle: { color: '#F97316' } },
        { value: satisfactionCounts[2], name: 'Biasa Saja', itemStyle: { color: '#EAB308' } },
        { value: satisfactionCounts[3], name: 'Puas', itemStyle: { color: '#22C55E' } },
        { value: satisfactionCounts[4], name: 'Sangat Puas', itemStyle: { color: '#15803D' } }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  })

  // Questions Average Chart
  const questionsChart = echarts.init(document.getElementById('questionsAverage'))
  const mekanismeAvg = transformedData.value.reduce((sum, item) => sum + item.mekanisme, 0) / (transformedData.value.length || 1)
  const petugasAvg = transformedData.value.reduce((sum, item) => sum + item.petugas, 0) / (transformedData.value.length || 1)
  const saranaAvg = transformedData.value.reduce((sum, item) => sum + item.sarana, 0) / (transformedData.value.length || 1)
  const harapanAvg = transformedData.value.reduce((sum, item) => sum + item.harapan, 0) / (transformedData.value.length || 1)

  questionsChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: {
      type: 'category',
      data: [
        'Mekanisme/Prosedur',
        'Kemampuan Petugas',
        'Sarana & Prasarana',
        'Sesuai Harapan'
      ]
    },
    yAxis: { type: 'value', min: 0, max: 5, axisLabel: { formatter: '{value}' } },
    series: [{
      name: 'Rata-rata Score',
      type: 'bar',
      data: [
        { value: mekanismeAvg.toFixed(1), itemStyle: { color: '#3B82F6' } },
        { value: petugasAvg.toFixed(1), itemStyle: { color: '#10B981' } },
        { value: saranaAvg.toFixed(1), itemStyle: { color: '#8B5CF6' } },
        { value: harapanAvg.toFixed(1), itemStyle: { color: '#F59E42' } }
      ],
      barWidth: '60%'
    }]
  })

  window.addEventListener('resize', () => {
    satisfactionChart.resize()
    questionsChart.resize()
  })
}

useSeoMeta({
  title: 'Hasil Survey - Admin Poliklinik LAN',
  description: 'Data hasil survey kepuasan pelayanan Poliklinik LAN'
})
</script>

<style scoped>
/* Chart containers */
#satisfactionDistribution,
#questionsAverage {
  min-height: 320px;
}

/* Table responsive */
@media (max-width: 768px) {
  .overflow-x-auto {
    font-size: 0.875rem;
  }
}

/* Animation for cards */
.bg-white {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.bg-white:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.1);
}
</style>
