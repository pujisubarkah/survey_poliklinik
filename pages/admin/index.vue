<!-- pages/admin/index.vue -->
<template>
  <div>
    <!-- Redirect to dashboard -->
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

// Redirect to dashboard page
await navigateTo('/admin/dashboard')
</script>
