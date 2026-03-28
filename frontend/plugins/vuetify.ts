import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    theme: {
      defaultTheme: 'monochrome',
      themes: {
        light: {
          dark: false,
          colors: {
            primary: '#2E7D32',
            secondary: '#4CAF50',
            accent: '#81C784',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107',
            background: '#F5F5F5'
          }
        },
        monochrome: {
          dark: true,
          colors: {
            primary: '#10b981',
            secondary: '#34d399',
            accent: '#6ee7b7',
            error: '#f87171',
            info: '#60a5fa',
            success: '#10b981',
            warning: '#fbbf24',
            background: '#0d1117',
            surface: '#1c2333',
            'on-surface': '#e2e8f0',
            'on-background': '#e2e8f0'
          }
        }
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
}) 
