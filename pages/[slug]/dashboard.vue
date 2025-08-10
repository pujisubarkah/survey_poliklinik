<!-- pages/admin/dashboard.vue -->
<template>
  <div class="pt-8 md:pt-8">
    <!-- Welcome Section -->
    <div class="mb-8">
  <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ greeting }}, {{ displayName }}!</h2>
  <p class="text-blue-700 font-semibold mb-1">Sehat Selalu yah! Jangan sakit, nanti yang jaga klinik siapa kalau sakit 😊</p>
  <p class="text-gray-600">Ini adalah Ringkasan dan Statistik Klinik Kita. Ringkasan dan statistik sistem klinik LAN</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Survey -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-500 bg-opacity-75">
            <i class="fas fa-chart-line text-white text-xl"></i>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Total Survey</dt>
              <dd class="text-3xl font-bold text-gray-900">{{ stats.totalSurvey }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <!-- Pegawai Aktif -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-500 bg-opacity-75">
            <i class="fas fa-users text-white text-xl"></i>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Pegawai Aktif</dt>
              <dd class="text-3xl font-bold text-gray-900">{{ stats.pegawaiAktif }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <!-- Total Diagnosa -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-500 bg-opacity-75">
            <i class="fas fa-stethoscope text-white text-xl"></i>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Total Diagnosa</dt>
              <dd class="text-3xl font-bold text-gray-900">{{ stats.totalDiagnosa }}</dd>
            </dl>
          </div>
        </div>
      </div>

      <!-- Stok Obat -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-orange-500 bg-opacity-75">
            <i class="fas fa-pills text-white text-xl"></i>
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Jenis Obat</dt>
              <dd class="text-3xl font-bold text-gray-900">{{ stats.jenisObat }}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Survey Satisfaction Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Tingkat Kepuasan Survey</h3>
        <div id="satisfactionChart" class="w-full h-80"></div>
      </div>

      <!-- Monthly Survey Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Survey Bulanan</h3>
        <div id="monthlyChart" class="w-full h-80"></div>
      </div>
    </div>

    <!-- Additional Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Top Diagnoses Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Top 10 Diagnosa</h3>
        <div id="diagnosisChart" class="w-full h-80"></div>
      </div>

      <!-- Drug Stock Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Status Stok Obat</h3>
        <div id="drugStockChart" class="w-full h-80"></div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800">Aktivitas Terbaru</h3>
      </div>
      <div class="p-6">
        <div class="space-y-4">
          <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center"
                :class="activity.iconBg"
              >
                <i :class="activity.icon" class="text-white text-sm"></i>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900">{{ activity.message }}</p>
              <p class="text-sm text-gray-500">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
// Greeting by time
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 11) return 'Selamat Pagi'
  if (hour < 15) return 'Selamat Siang'
  if (hour < 18) return 'Selamat Sore'
  return 'Selamat Malam'
})
import { useRoute } from 'vue-router'
import * as echarts from 'echarts'
// Ambil nama dari slug route dan format agar lebih rapi
const route = useRoute()
const displayName = computed(() => {
  const slug = route.params.slug || ''
  // Ubah slug ke format nama (rindra-hidayat => Rindra Hidayat)
  return slug
    .toString()
    .split('-')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')
})

// Set layout
definePageMeta({
  layout: 'admin'
})

// Reactive data
const stats = ref({
  totalSurvey: 1248,
  pegawaiAktif: 45,
  totalDiagnosa: 156,
  jenisObat: 234
})

const recentActivities = ref([
  {
    id: 1,
    message: 'Survey baru telah diselesaikan oleh pasien',
    time: '2 menit yang lalu',
    icon: 'fas fa-chart-line',
    iconBg: 'bg-blue-500'
  },
  {
    id: 2,
    message: 'Data pegawai baru telah ditambahkan',
    time: '15 menit yang lalu',
    icon: 'fas fa-user-plus',
    iconBg: 'bg-green-500'
  },
  {
    id: 3,
    message: 'Stok obat Paracetamol rendah',
    time: '1 jam yang lalu',
    icon: 'fas fa-exclamation-triangle',
    iconBg: 'bg-orange-500'
  },
  {
    id: 4,
    message: 'Diagnosa baru telah ditambahkan ke master data',
    time: '2 jam yang lalu',
    icon: 'fas fa-stethoscope',
    iconBg: 'bg-purple-500'
  }
])

// Chart initialization
const initCharts = () => {
  // Satisfaction Chart (Pie Chart)
  const satisfactionChart = echarts.init(document.getElementById('satisfactionChart'))
  satisfactionChart.setOption({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Tingkat Kepuasan',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 45, name: 'Sangat Puas' },
          { value: 32, name: 'Puas' },
          { value: 15, name: 'Cukup' },
          { value: 6, name: 'Kurang Puas' },
          { value: 2, name: 'Tidak Puas' }
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

  // Monthly Survey Chart (Line Chart)
  const monthlyChart = echarts.init(document.getElementById('monthlyChart'))
  monthlyChart.setOption({
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Survey',
        data: [120, 132, 101, 134, 90, 230, 210],
        type: 'line',
        smooth: true,
        itemStyle: {
          color: '#3B82F6'
        }
      }
    ]
  })

  // Top Diagnoses Chart (Bar Chart)
  const diagnosisChart = echarts.init(document.getElementById('diagnosisChart'))
  diagnosisChart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: ['Hipertensi', 'Diabetes', 'Gastritis', 'Diare', 'Flu', 'Demam', 'Batuk', 'Sakit Kepala', 'Alergi', 'Insomnia']
    },
    series: [
      {
        name: 'Jumlah Kasus',
        type: 'bar',
        data: [85, 78, 65, 55, 48, 42, 38, 35, 28, 22],
        itemStyle: {
          color: '#8B5CF6'
        }
      }
    ]
  })

  // Drug Stock Chart (Doughnut Chart)
  const drugStockChart = echarts.init(document.getElementById('drugStockChart'))
  drugStockChart.setOption({
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Status Stok',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 156, name: 'Stok Aman', itemStyle: { color: '#10B981' } },
          { value: 45, name: 'Stok Rendah', itemStyle: { color: '#F59E0B' } },
          { value: 12, name: 'Habis', itemStyle: { color: '#EF4444' } }
        ]
      }
    ]
  })

  // Make charts responsive
  window.addEventListener('resize', () => {
    satisfactionChart.resize()
    monthlyChart.resize()
    diagnosisChart.resize()
    drugStockChart.resize()
  })
}

// Lifecycle hooks
onMounted(() => {
  // Delay chart initialization to ensure DOM is ready
  nextTick(() => {
    setTimeout(initCharts, 100)
  })
})

// SEO
useSeoMeta({
  title: 'Dashboard - Admin Poliklinik LAN',
  description: 'Dashboard administrasi sistem Poliklinik LAN'
})
</script>

<style scoped>
/* Additional styling for charts */
#satisfactionChart,
#monthlyChart,
#diagnosisChart,
#drugStockChart {
  min-height: 320px;
}

/* Animation for stats cards */
.bg-white {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.bg-white:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>
