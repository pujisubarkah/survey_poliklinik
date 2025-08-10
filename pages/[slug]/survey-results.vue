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

    <!-- Trend Chart -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Trend Kepuasan Mingguan</h3>
      <div id="trendChart" class="w-full h-80"></div>
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

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Keramahan Petugas
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kebersihan Tempat
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kecepatan Pelayanan
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rata-rata
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in paginatedData" :key="item.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(item.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="flex items-center">
                  <span class="text-lg mr-2">{{ getEmoji(item.keramahan) }}</span>
                  {{ getLabel(item.keramahan) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="flex items-center">
                  <span class="text-lg mr-2">{{ getEmoji(item.kebersihan) }}</span>
                  {{ getLabel(item.kebersihan) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="flex items-center">
                  <span class="text-lg mr-2">{{ getEmoji(item.kecepatan) }}</span>
                  {{ getLabel(item.kecepatan) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <span 
                  class="px-2 py-1 rounded-full text-xs font-semibold"
                  :class="getScoreColor(item.average)"
                >
                  {{ item.average.toFixed(1) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-1 rounded-full text-xs font-semibold"
                  :class="getSatisfactionBadge(item.average)"
                >
                  {{ getSatisfactionText(item.average) }}
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import * as echarts from 'echarts'

// Set layout
definePageMeta({
  layout: 'admin'
})

// Reactive data
const selectedPeriod = ref('all')
const searchQuery = ref('')
const itemsPerPage = ref(10)
const currentPage = ref(1)

// Mock data - dalam aplikasi nyata ini akan dari API
const surveyData = ref([
  {
    id: 1,
    created_at: '2024-01-15T10:30:00Z',
    keramahan: 5,
    kebersihan: 4,
    kecepatan: 4,
    average: 4.3
  },
  {
    id: 2,
    created_at: '2024-01-15T11:15:00Z',
    keramahan: 4,
    kebersihan: 5,
    kecepatan: 3,
    average: 4.0
  },
  {
    id: 3,
    created_at: '2024-01-15T14:20:00Z',
    keramahan: 5,
    kebersihan: 5,
    kecepatan: 5,
    average: 5.0
  },
  {
    id: 4,
    created_at: '2024-01-14T09:45:00Z',
    keramahan: 3,
    kebersihan: 4,
    kecepatan: 3,
    average: 3.3
  },
  {
    id: 5,
    created_at: '2024-01-14T16:30:00Z',
    keramahan: 4,
    kebersihan: 4,
    kecepatan: 4,
    average: 4.0
  },
  {
    id: 6,
    created_at: '2024-01-13T13:10:00Z',
    keramahan: 5,
    kebersihan: 3,
    kecepatan: 4,
    average: 4.0
  },
  {
    id: 7,
    created_at: '2024-01-13T15:45:00Z',
    keramahan: 2,
    kebersihan: 3,
    kecepatan: 2,
    average: 2.3
  },
  {
    id: 8,
    created_at: '2024-01-12T08:20:00Z',
    keramahan: 4,
    kebersihan: 5,
    kecepatan: 4,
    average: 4.3
  },
  {
    id: 9,
    created_at: '2024-01-12T12:30:00Z',
    keramahan: 5,
    kebersihan: 4,
    kecepatan: 5,
    average: 4.7
  },
  {
    id: 10,
    created_at: '2024-01-11T17:15:00Z',
    keramahan: 3,
    kebersihan: 3,
    kecepatan: 3,
    average: 3.0
  },
])

// Computed properties
const summaryStats = computed(() => {
  const total = surveyData.value.length
  const avgScore = surveyData.value.reduce((sum, item) => sum + item.average, 0) / total
  const satisfiedCount = surveyData.value.filter(item => item.average >= 4).length
  const satisfactionLevel = (satisfiedCount / total) * 100
  const today = new Date().toDateString()
  const todayCount = surveyData.value.filter(item => 
    new Date(item.created_at).toDateString() === today
  ).length

  return {
    totalResponden: total,
    averageScore: avgScore,
    satisfactionLevel: Math.round(satisfactionLevel),
    todaySurvey: todayCount
  }
})

const filteredData = computed(() => {
  let filtered = surveyData.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item => 
      formatDate(item.created_at).toLowerCase().includes(query) ||
      getLabel(item.keramahan).toLowerCase().includes(query) ||
      getLabel(item.kebersihan).toLowerCase().includes(query) ||
      getLabel(item.kecepatan).toLowerCase().includes(query)
    )
  }

  // Filter by period
  if (selectedPeriod.value !== 'all') {
    const now = new Date()
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.created_at)
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

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredData.value.slice(start, end)
})

// Methods
const getEmoji = (score) => {
  const emojis = ['😠', '🙁', '😐', '🙂', '😄']
  return emojis[score - 1] || '😐'
}

const getLabel = (score) => {
  const labels = ['Sangat Tidak Puas', 'Tidak Puas', 'Biasa Saja', 'Puas', 'Sangat Puas']
  return labels[score - 1] || 'Tidak Ada Data'
}

const getScoreColor = (score) => {
  if (score >= 4.5) return 'bg-green-100 text-green-800'
  if (score >= 3.5) return 'bg-yellow-100 text-yellow-800'
  if (score >= 2.5) return 'bg-orange-100 text-orange-800'
  return 'bg-red-100 text-red-800'
}

const getSatisfactionBadge = (score) => {
  if (score >= 4.5) return 'bg-green-100 text-green-800'
  if (score >= 3.5) return 'bg-blue-100 text-blue-800'
  if (score >= 2.5) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

const getSatisfactionText = (score) => {
  if (score >= 4.5) return 'Sangat Puas'
  if (score >= 3.5) return 'Puas'
  if (score >= 2.5) return 'Cukup'
  return 'Kurang'
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

const exportData = () => {
  // Implementasi export ke Excel
  alert('Fitur export sedang dalam pengembangan')
}

// Chart initialization
const initCharts = () => {
  // Satisfaction Distribution Chart
  const satisfactionChart = echarts.init(document.getElementById('satisfactionDistribution'))
  const satisfactionCounts = [0, 0, 0, 0, 0]
  surveyData.value.forEach(item => {
    const avgRounded = Math.round(item.average)
    if (avgRounded >= 1 && avgRounded <= 5) {
      satisfactionCounts[avgRounded - 1]++
    }
  })

  satisfactionChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
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
      }
    ]
  })

  // Questions Average Chart
  const questionsChart = echarts.init(document.getElementById('questionsAverage'))
  const keramahanAvg = surveyData.value.reduce((sum, item) => sum + item.keramahan, 0) / surveyData.value.length
  const kebersihanAvg = surveyData.value.reduce((sum, item) => sum + item.kebersihan, 0) / surveyData.value.length
  const kecepatanAvg = surveyData.value.reduce((sum, item) => sum + item.kecepatan, 0) / surveyData.value.length

  questionsChart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: ['Keramahan\nPetugas', 'Kebersihan\nTempat', 'Kecepatan\nPelayanan']
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 5,
      axisLabel: {
        formatter: '{value}'
      }
    },
    series: [
      {
        name: 'Rata-rata Score',
        type: 'bar',
        data: [
          { value: keramahanAvg.toFixed(1), itemStyle: { color: '#3B82F6' } },
          { value: kebersihanAvg.toFixed(1), itemStyle: { color: '#10B981' } },
          { value: kecepatanAvg.toFixed(1), itemStyle: { color: '#8B5CF6' } }
        ],
        barWidth: '60%'
      }
    ]
  })

  // Trend Chart
  const trendChart = echarts.init(document.getElementById('trendChart'))
  // Generate trend data (simplified)
  const trendData = []
  const trendLabels = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    trendLabels.push(date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }))
    
    // Mock trend data based on existing survey data
    const dayData = surveyData.value.filter(item => {
      const itemDate = new Date(item.created_at)
      return itemDate.toDateString() === date.toDateString()
    })
    
    const avgScore = dayData.length > 0 
      ? dayData.reduce((sum, item) => sum + item.average, 0) / dayData.length
      : Math.random() * 2 + 3 // Random data between 3-5 for demo
    
    trendData.push(avgScore.toFixed(1))
  }

  trendChart.setOption({
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: trendLabels
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 5
    },
    series: [
      {
        name: 'Rata-rata Kepuasan',
        type: 'line',
        data: trendData,
        smooth: true,
        itemStyle: {
          color: '#6366F1'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0, color: 'rgba(99, 102, 241, 0.3)'
            }, {
              offset: 1, color: 'rgba(99, 102, 241, 0.05)'
            }]
          }
        }
      }
    ]
  })

  // Make charts responsive
  window.addEventListener('resize', () => {
    satisfactionChart.resize()
    questionsChart.resize()
    trendChart.resize()
  })
}

// Lifecycle hooks
onMounted(() => {
  nextTick(() => {
    setTimeout(initCharts, 100)
  })
})

// SEO
useSeoMeta({
  title: 'Hasil Survey - Admin Poliklinik LAN',
  description: 'Data hasil survey kepuasan pelayanan Poliklinik LAN'
})
</script>

<style scoped>
/* Chart containers */
#satisfactionDistribution,
#questionsAverage,
#trendChart {
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
