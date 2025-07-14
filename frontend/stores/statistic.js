import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { useNuxtApp } from '#app'

export const useStatisticStore = defineStore('statistic', {
  state: () => ({
    statistics: null,
    loading: false,
    error: null
  }),

  actions: {
    // İstatistikleri getir
    async fetchStatistics() {
      const { $api } = useNuxtApp()
      this.loading = true
      this.error = null
      try {
        // const response = await $api('/statistics')
        // this.statistics = response
      } catch (error) {
        console.error('İstatistikler yüklenirken hata:', error)
        this.error = 'İstatistikler yüklenirken bir hata oluştu'
      } finally {
        this.loading = false
      }
    },

    // Ziyaretçi sayısını artır
    async incrementVisitorCount() {
      const { $api } = useNuxtApp()
      try {
        // Auth store'dan token'ı al
        const authStore = useAuthStore();
        if (!authStore.token) {
          authStore.getTokenFromCookie();
        }

        if (!authStore.token) {
          this.error = "Yetkilendirme hatası: Oturum açmanız gerekiyor";
          return { success: false, message: this.error };
        }

        const response = await $api('/statistics/visitor', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
        if (this.statistics) {
          this.statistics.visitorCount = response.visitorCount
        }
        return { success: true }
      } catch (error) {
        console.error('Ziyaretçi sayısı güncellenirken hata:', error)
        return { success: false, message: error.message }
      }
    }
  },

  getters: {
    // İstatistikleri getir
    getStatistics: (state) => state.statistics,

    // Yükleniyor durumunu getir
    isLoading: (state) => state.loading,

    // Hata durumunu getir
    getError: (state) => state.error
  }
}) 