<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">Dashboard Analisis</h2>
      <p class="text-gray-600">Ringkasan data diagnosa dan demografi berdasarkan pemeriksaan</p>
    </div>

    <!-- Filter Section -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Filter Data</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
          <input
            v-model="filters.tanggal_mulai"
            type="date"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
          <input
            v-model="filters.tanggal_akhir"
            type="date"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="filters.status"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Status</option>
            <option value="Selesai">Selesai</option>
            <option value="Proses">Proses</option>
            <option value="Menunggu">Menunggu</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="loadAllData"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors w-full"
          >
            Filter
          </button>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div v-if="summary" class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600">
            <i class="fas fa-stethoscope text-2xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Diagnosa</p>
            <p class="text-2xl font-bold text-gray-900">{{ summary.total_diagnosa }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600">
            <i class="fas fa-users text-2xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Kasus</p>
            <p class="text-2xl font-bold text-gray-900">{{ summary.total_kasus }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-pink-100 text-pink-600">
            <i class="fas fa-venus text-2xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Pasien Perempuan</p>
            <p class="text-2xl font-bold text-gray-900">{{ genderSummary.perempuan || 0 }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600">
            <i class="fas fa-mars text-2xl"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Pasien Laki-laki</p>
            <p class="text-2xl font-bold text-gray-900">{{ genderSummary.laki_laki || 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Diagnosa Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Top 10 Diagnosa Terbanyak</h3>
        <div ref="diagnosisChartContainer" class="h-96 w-full"></div>
      </div>
      
      <!-- Gender Chart -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Distribusi Gender Pasien</h3>
        <div ref="genderChartContainer" class="h-96 w-full"></div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">Detail Diagnosa</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ranking
              </th>
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
                Total Kasus
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Persentase
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in diagnosaSummary" :key="item.diagnosis_id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                    {{ index + 1 }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ item.kode_icd }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ item.nama_diagnosa }}</div>
                <div class="text-sm text-gray-500">ID: {{ item.diagnosis_id }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  {{ item.kategori_diagnosa }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ item.total_kasus }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="text-sm font-medium text-gray-900 mr-2">{{ item.persentase }}%</div>
                  <div class="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-blue-600 h-2 rounded-full"
                      :style="{ width: item.persentase + '%' }"
                    ></div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted } from 'vue'

definePageMeta({
  layout: 'admin'
})

const diagnosaSummary = ref([])
const genderSummary = ref({})
const summary = ref(null)
const diagnosisChartContainer = ref(null)
const genderChartContainer = ref(null)
let diagnosisChartInstance = null
let genderChartInstance = null
let echarts = null

const filters = ref({
  tanggal_mulai: '',
  tanggal_akhir: '',
  status: ''
})

const loadDiagnosisSummary = async () => {
  try {
    const queryParams = new URLSearchParams()
    
    if (filters.value.tanggal_mulai) {
      queryParams.append('tanggal_mulai', filters.value.tanggal_mulai)
    }
    if (filters.value.tanggal_akhir) {
      queryParams.append('tanggal_akhir', filters.value.tanggal_akhir)
    }
    if (filters.value.status) {
      queryParams.append('status', filters.value.status)
    }

    const response = await $fetch(`/api/diagnosa_summary?${queryParams.toString()}`)
    
    if (response.success) {
      diagnosaSummary.value = response.data
      summary.value = response.summary
    }
  } catch (error) {
    console.error('Error loading diagnosa summary:', error)
  }
}

const loadGenderSummary = async () => {
  try {
    const queryParams = new URLSearchParams()
    
    if (filters.value.tanggal_mulai) {
      queryParams.append('tanggal_mulai', filters.value.tanggal_mulai)
    }
    if (filters.value.tanggal_akhir) {
      queryParams.append('tanggal_akhir', filters.value.tanggal_akhir)
    }
    if (filters.value.status) {
      queryParams.append('status', filters.value.status)
    }

    const response = await $fetch(`/api/gender_summary?${queryParams.toString()}`)
    
    if (response.success) {
      genderSummary.value = response.data
    }
  } catch (error) {
    console.error('Error loading gender summary:', error)
  }
}

const loadAllData = async () => {
  await loadDiagnosisSummary()
  await loadGenderSummary()
  await nextTick()
  updateDiagnosisChart()
  updateGenderChart()
}

const initChart = async () => {
  if (process.client) {
    try {
      echarts = await import('echarts')
    } catch (error) {
      console.error('Error loading echarts:', error)
    }
  }
}

const updateDiagnosisChart = async () => {
  if (!process.client || !diagnosisChartContainer.value || !echarts) return

  if (diagnosisChartInstance) {
    diagnosisChartInstance.dispose()
  }

  diagnosisChartInstance = echarts.init(diagnosisChartContainer.value)
  const top10 = diagnosaSummary.value.slice(0, 10)

  if (top10.length === 0) {
    const option = {
      title: {
        text: 'Tidak ada data',
        left: 'center',
        top: 'center'
      }
    }
    diagnosisChartInstance.setOption(option)
    return
  }

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ]

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} kasus ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 20,
      data: top10.map(item => item.nama_diagnosa),
      textStyle: {
        fontSize: 12
      }
    },
    series: [
      {
        name: 'Diagnosa',
        type: 'pie',
        radius: '60%',
        center: ['40%', '50%'],
        data: top10.map((item, index) => ({
          value: item.total_kasus,
          name: item.nama_diagnosa,
          itemStyle: {
            color: colors[index % colors.length]
          }
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: true,
          formatter: '{d}%'
        }
      }
    ]
  }

  diagnosisChartInstance.setOption(option)
}

const updateGenderChart = async () => {
  if (!process.client || !genderChartContainer.value || !echarts) return

  if (genderChartInstance) {
    genderChartInstance.dispose()
  }

  genderChartInstance = echarts.init(genderChartContainer.value)

  const genderData = [
    { 
      value: genderSummary.value.laki_laki || 0, 
      name: 'Laki-laki',
      itemStyle: { color: '#3B82F6' }
    },
    { 
      value: genderSummary.value.perempuan || 0, 
      name: 'Perempuan',
      itemStyle: { color: '#EC4899' }
    }
  ]

  const total = genderData.reduce((sum, item) => sum + item.value, 0)

  if (total === 0) {
    const option = {
      title: {
        text: 'Tidak ada data gender',
        left: 'center',
        top: 'center'
      }
    }
    genderChartInstance.setOption(option)
    return
  }

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} orang ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: 10,
      data: ['Laki-laki', 'Perempuan']
    },
    series: [
      {
        name: 'Gender',
        type: 'pie',
        radius: '65%',
        center: ['50%', '45%'],
        data: genderData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: true,
          formatter: function(params) {
            return params.name + '\n' + params.value + ' orang\n(' + params.percent + '%)'
          }
        }
      }
    ]
  }

  genderChartInstance.setOption(option)
}

const formatPeriode = (periode) => {
  if (!periode) return 'Semua Data'
  if (periode.tanggal_mulai && periode.tanggal_akhir) {
    return `${periode.tanggal_mulai} - ${periode.tanggal_akhir}`
  } else if (periode.tanggal_mulai) {
    return `Sejak ${periode.tanggal_mulai}`
  } else if (periode.tanggal_akhir) {
    return `Sampai ${periode.tanggal_akhir}`
  }
  return 'Semua Data'
}

onMounted(async () => {
  await initChart()
  await loadAllData()
})

onUnmounted(() => {
  if (diagnosisChartInstance) {
    diagnosisChartInstance.dispose()
  }
  if (genderChartInstance) {
    genderChartInstance.dispose()
  }
})
</script>