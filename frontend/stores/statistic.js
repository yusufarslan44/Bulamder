import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

const API_URL = 'http://localhost:5000/api'

export const useStatisticStore = defineStore('statistic', {
  state: () => ({
    statistics: null,
    loading: false,
    error: null
  }),

  actions: {
    // İstatistikleri getir
    async fetchStatistics() {
      this.loading = true
      this.error = null
      try {
        // const response = await $fetch(`${API_URL}/statistics`)
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
        
        const response = await $fetch(`${API_URL}/statistics/visitor`, {
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