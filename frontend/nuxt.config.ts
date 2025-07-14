// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    ['@pinia/nuxt', {
      autoImports: ['defineStore', 'acceptHMRUpdate'],
    }]
  ],

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5001/api'
    }
  },

  build: {
    transpile: ['vuetify']
  },

  vite: {
    ssr: {
      noExternal: ['vuetify']
    },
    define: {
      'process.env.DEBUG': false,
    }
  },

  css: [
    '@mdi/font/css/materialdesignicons.min.css',
    'vuetify/styles',
    '@/assets/styles/main.css'
  ],

  app: {
    head: {
      title: 'Çelikhan Bulam Derneği',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Çelikhan Bulam Derneği resmi web sitesi' }
      ]
    }
  },

  compatibilityDate: '2025-01-14'
})