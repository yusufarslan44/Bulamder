<template>
  <v-container fluid class="not-found-page d-flex align-center justify-center py-16">
    <v-row justify="center" class="w-100 ma-0">
      <v-col cols="12" sm="10" md="7" lg="5">
        <v-card class="pa-8 pa-md-10 text-center rounded-xl not-found-card" elevation="6">
          <v-chip color="primary" variant="tonal" class="mb-4">
            Hata 404
          </v-chip>

          <h1 class="text-h4 text-md-h3 font-weight-bold mb-3">
            Sayfa Bulunamadı
          </h1>

          <p class="text-body-1 text-medium-emphasis mb-2">
            Aradığınız sayfaya ulaşılamadı. Bağlantı hatalı olabilir veya sayfa taşınmış olabilir.
          </p>

          <p class="text-caption text-medium-emphasis mb-8">
            İstenen yol: <strong>{{ missingPath }}</strong>
          </p>

          <div class="d-flex flex-column flex-sm-row justify-center ga-3">
            <v-btn color="primary" size="large" prepend-icon="mdi-home" to="/">
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
</template>

<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()

if (import.meta.server) {
  setResponseStatus(404, 'Page Not Found')
}

const missingPath = computed(() => {
  const slug = route.params.slug
  if (Array.isArray(slug) && slug.length > 0) return `/${slug.join('/')}`
  if (typeof slug === 'string' && slug.length > 0) return `/${slug}`
  return '/'
})

const goBack = () => {
  if (import.meta.client && window.history.length > 1) {
    window.history.back()
    return
  }
  navigateTo('/')
}
</script>

<style scoped>
.not-found-page {
  background: var(--gradient-background);
  min-height: calc(100vh - 160px);
}

.not-found-card {
  border: 1px solid rgba(46, 125, 50, 0.12);
}
</style>
