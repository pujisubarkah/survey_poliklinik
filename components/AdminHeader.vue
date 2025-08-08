<!-- components/AdminHeader.vue -->
<template>
  <div>
    <!-- Mobile Header -->
    <header class="lg:hidden bg-white shadow-sm border-b border-gray-200">
      <div class="flex items-center justify-between px-4 py-3">
        <div class="flex items-center space-x-3">
          <button 
            @click="$emit('toggleSidebar')"
            class="p-2 rounded-md hover:bg-gray-100"
          >
            <i class="fas fa-bars text-gray-600"></i>
          </button>
          <img src="/lanri_.png" alt="LAN RI" class="h-8 w-auto">
          <h1 class="text-lg font-semibold text-gray-800">Admin Panel</h1>
        </div>
      </div>
    </header>

    <!-- Desktop Header -->
    <header class="hidden lg:block bg-white shadow-sm border-b border-gray-200">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">{{ pageTitle }}</h1>
            <p class="text-gray-600">{{ pageDescription }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <button class="p-2 rounded-md hover:bg-gray-100 relative">
              <i class="fas fa-bell text-gray-600"></i>
              <span class="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </button>
            
            <!-- User Menu -->
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <i class="fas fa-user-md text-white text-sm"></i>
              </div>
              <div class="text-sm">
                <p class="font-medium text-gray-800">Admin</p>
                <p class="text-gray-600">Administrator</p>
              </div>
              <!-- Dropdown Menu -->
              <div class="relative">
                <button 
                  @click="showDropdown = !showDropdown"
                  class="p-1 rounded-md hover:bg-gray-100"
                >
                  <i class="fas fa-chevron-down text-gray-600"></i>
                </button>
                
                <!-- Dropdown Content -->
                <div 
                  v-if="showDropdown"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50"
                >
                  <div class="py-1">
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <i class="fas fa-user mr-2"></i>
                      Profile
                    </a>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <i class="fas fa-cog mr-2"></i>
                      Settings
                    </a>
                    <hr class="my-1">
                    <button 
                      @click="logout"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <i class="fas fa-sign-out-alt mr-2"></i>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  pageTitle: {
    type: String,
    default: 'Admin Panel'
  },
  pageDescription: {
    type: String,
    default: 'Panel administrasi sistem'
  }
})

// Emits
const emit = defineEmits(['toggleSidebar'])

// Reactive data
const showDropdown = ref(false)

// Methods
const logout = async () => {
  if (confirm('Apakah Anda yakin ingin logout?')) {
    showDropdown.value = false
    // Clear authentication tokens here
    await navigateTo('/login')
  }
}

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showDropdown.value = false
    }
  })
})
</script>

<style scoped>
/* Dropdown animation */
.absolute {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Avatar gradient */
.bg-gradient-to-r {
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
}
</style>
