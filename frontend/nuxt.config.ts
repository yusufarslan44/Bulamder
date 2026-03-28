// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    ['@pinia/nuxt', {
      autoImports: ['defineStore', 'acceptHMRUpdate'],
    }]
  ],

  runtimeConfig: {
    apiBase: process.env.NUXT_API_BASE || '',
    public: {
      NUXT_PUBLIC_API_BASE: process.env.NUXT_PUBLIC_API_BASE || ''
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
      ],
      link: [
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-bw-32x32.png', media: '(prefers-color-scheme: dark)' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-bw-16x16.png', media: '(prefers-color-scheme: dark)' }
      ]
    }
  },

  compatibilityDate: '2025-01-14'
})
