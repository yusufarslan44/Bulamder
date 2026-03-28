<template>
  <v-app>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>

<script setup>
const { initTheme } = useBlackWhiteTheme()

onMounted(() => {
  initTheme()
})
</script>
