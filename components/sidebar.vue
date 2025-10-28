<!-- components/sidebar.vue -->
<template>
  <div class="sidebar-container">
    <!-- Sidebar Toggle Button (Hamburger) -->
    <button
      class="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-lg lg:hidden"
      @click="isOpen = true"
      v-if="!isOpen"
      aria-label="Buka Sidebar"
    >
      <i class="fas fa-bars text-xl text-blue-700"></i>
    </button>
    <!-- Sidebar Overlay for mobile -->
    <div 
      v-if="isOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      @click="closeSidebar"
    ></div>

    <!-- Sidebar -->
    <div 
      class="fixed left-0 top-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out"
      :class="[
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static lg:shadow-none'
      ]"
      style="width: 280px;"
    >
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <img src="/lanri_.png" alt="LAN RI" class="h-6 w-auto">
          </div>
          <div>
            <h2 class="text-lg font-bold text-white">Klinik LAN Jakarta</h2>
          </div>
        </div>
        <!-- Close button for mobile -->
        <button 
          @click="closeSidebar"
          class="lg:hidden p-2 rounded-md hover:bg-white/10 text-white"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="mt-6 px-4">
        <ul class="space-y-2">
          <!-- Pemeriksaan (paling atas) -->
          <li>
            <NuxtLink 
              to="/admin/pemeriksaan" 
              class="nav-link"
              :class="{ 'active': $route.path === '/admin/pemeriksaan' }"
            >
              <i class="fas fa-user-md nav-icon"></i>
              <span>Pemeriksaan</span>
            </NuxtLink>
          </li>
          <!-- Divider -->
          <li class="border-t border-gray-200 my-4"></li>
         

          <!-- Survey Results -->
          <li>
            <NuxtLink 
              to="/admin/survey-results" 
              class="nav-link"
              :class="{ 'active': $route.path === '/admin/survey-results' }"
            >
              <i class="fas fa-chart-line nav-icon"></i>
              <span>Hasil Survey</span>
            </NuxtLink>
          </li>

          <!-- QR Code -->
          <li>
            <NuxtLink 
              to="/admin/qr" 
              class="nav-link"
              :class="{ 'active': $route.path === '/admin/qr' }"
            >
              <i class="fas fa-qrcode nav-icon"></i>
              <span>QR Code</span>
            </NuxtLink>
          </li>
          <!-- Divider -->
          <li class="border-t border-gray-200 my-4"></li>
          <!-- Master Data Section -->
          <li>
            <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Master Data
            </div>
          </li>
          <!-- Pegawai -->
          <li>
            <NuxtLink 
              to="/admin/pegawai" 
              class="nav-link"
              :class="{ 'active': $route.path === '/admin/pegawai' }"
            >
              <i class="fas fa-users nav-icon"></i>
              <span>Pegawai</span>
            </NuxtLink>
          </li>

          <!-- Master Diagnosa -->
          <li>
            <NuxtLink 
              to="/admin/master-diagnosa" 
              class="nav-link"
              :class="{ 'active': $route.path === '/admin/master-diagnosa' }"
            >
              <i class="fas fa-stethoscope nav-icon"></i>
              <span>Master Diagnosa</span>
            </NuxtLink>
          </li>

          <!-- Master Obat -->
          <li>
            <NuxtLink 
              to="/admin/master-obat" 
              class="nav-link"
              :class="{ 'active': $route.path === '/admin/master-obat' }"
            >
              <i class="fas fa-pills nav-icon"></i>
              <span>Master Obat</span>
            </NuxtLink>
          </li>
          <!-- Divider for Settings -->
          <li class="border-t border-gray-200 my-4"></li>
          <!-- Settings -->
          <li>
            <NuxtLink 
              to="/admin/settings" 
              class="nav-link"
              :class="{ 'active': $route.path === '/admin/settings' }"
            >
              <i class="fas fa-cog nav-icon"></i>
              <span>Pengaturan</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- Footer -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <i class="fas fa-user-md text-white text-sm"></i>
            </div>
            <div class="text-sm">
              <p class="font-medium text-gray-800">
                {{ userStore.user && userStore.user.nama ? userStore.user.nama : 'Admin' }}
              </p>
              <p class="text-gray-600">
                {{ userStore.user && userStore.user.role ? userStore.user.role : 'Administrator' }}
              </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <script setup>
          import { ref, computed } from 'vue'

          // Props
          const props = defineProps({
            modelValue: {
              type: Boolean,
              default: false
            }
          })

          // Emits
          const emit = defineEmits(['update:modelValue'])

          // Computed
          const isOpen = computed({
            get() {
              return props.modelValue
            },
            set(value) {
              emit('update:modelValue', value)
            }
          })

          // Methods
          const closeSidebar = () => {
            isOpen.value = false
          }

          import { useUserStore } from '~/stores/user'
          const userStore = useUserStore()

          const logout = async () => {
            if (confirm('Apakah Anda yakin ingin logout?')) {
              userStore.logout()
              await navigateTo('/login')
            }
          }
</script>

<style scoped>
.nav-link {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  color: #374151;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
}

.nav-link:hover {
  background-color: #eff6ff;
  color: #1d4ed8;
}

.nav-link.active {
  background-color: #dbeafe;
  color: #1d4ed8;
  font-weight: 500;
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.sidebar-container {
  position: relative;
}

/* Custom scrollbar for navigation */
nav {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

nav::-webkit-scrollbar {
  width: 6px;
}

nav::-webkit-scrollbar-track {
  background: #f7fafc;
}

nav::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 3px;
}

nav::-webkit-scrollbar-thumb:hover {
  background-color: #a0aec0;
}
</style>
