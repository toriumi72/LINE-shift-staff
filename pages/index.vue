<script setup lang="ts">
const { loggedInUser } = useAuth()
definePageMeta({
  layout: 'individual',
})

onMounted(() => {
  navigateTo('/staff/home')
})
</script>

<template>
  
</template>

<style scoped>

</style>