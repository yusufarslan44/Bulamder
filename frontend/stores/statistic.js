import { defineStore } from 'pinia'
import axios from 'axios'

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
        // const { data } = await axios.get(`${API_URL}/statistics`)
        // this.statistics = data
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
        const { data } = await axios.post(`${API_URL}/statistics/visitor`)
        if (this.statistics) {
          this.statistics.visitorCount = data.visitorCount
        }
      } catch (error) {
        console.error('Ziyaretçi sayısı güncellenirken hata:', error)
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