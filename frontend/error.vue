<template>
  <NuxtLayout>
    <v-container fluid class="error-page d-flex align-center justify-center py-16">
      <v-row justify="center" class="w-100 ma-0">
        <v-col cols="12" sm="10" md="7" lg="5">
          <v-card class="pa-8 pa-md-10 text-center rounded-xl error-card" elevation="6">
            <v-chip color="primary" variant="tonal" class="mb-4">
              Hata {{ statusCode }}
            </v-chip>

            <h1 class="text-h4 text-md-h3 font-weight-bold mb-3">
              {{ title }}
            </h1>

            <p class="text-body-1 text-medium-emphasis mb-8">
              {{ description }}
            </p>

            <div class="d-flex flex-column flex-sm-row justify-center ga-3">
              <v-btn
                color="primary"
                size="large"
                prepend-icon="mdi-home"
                @click="goHome"
              >
                Anasayfaya Dön
              </v-btn>
              <v-btn
                variant="outlined"
                color="primary"
                size="large"
                prepend-icon="mdi-arrow-left"
                @click="goBack"
              >
                Geri Git
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const statusCode = computed(() => props.error?.statusCode ?? 500)

const title = computed(() => {
  if (statusCode.value === 404) return 'Sayfa Bulunamadı'
  return 'Bir Hata Oluştu'
})

const description = computed(() => {
  if (statusCode.value === 404) {
    return 'Aradığınız sayfaya ulaşılamadı. Bağlantı hatalı olabilir veya sayfa taşınmış olabilir.'
  }

  return 'Beklenmeyen bir sorun oluştu. Lütfen tekrar deneyin veya anasayfaya dönün.'
})

const goHome = () => {
  clearError({ redirect: '/' })
}

const goBack = () => {
  if (import.meta.client && window.history.length > 1) {
    window.history.back()
    return
  }
  clearError({ redirect: '/' })
}
</script>

<style scoped>
.error-page {
  background: var(--gradient-background);
  min-height: calc(100vh - 160px);
}

.error-card {
  border: 1px solid rgba(46, 125, 50, 0.12);
}
</style>
