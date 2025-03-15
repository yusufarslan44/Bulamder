import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

export const usePhotoStore = defineStore('photo', {
  state: () => ({
    photos: [],
    loading: false,
    error: null
  }),

  actions: {
    // Tüm fotoğrafları getir
    async fetchPhotos() {
      this.loading = true
      this.error = null
      try {
        const { data } = await axios.get(`${API_URL}/photos`)
        console.log("pinia foto data", data);
        this.photos = data
      } catch (error) {
        console.error('Fotoğraflar yüklenirken hata:', error)
        this.error = 'Fotoğraflar yüklenirken bir hata oluştu'
      } finally {
        this.loading = false
      }
    },

    // Kategoriye göre fotoğrafları getir
    async fetchPhotosByCategory(category) {
      this.loading = true
      this.error = null
      try {
        const { data } = await axios.get(`${API_URL}/photos/category/${category}`)
        this.photos = data
      } catch (error) {
        console.error('Fotoğraflar yüklenirken hata:', error)
        this.error = 'Fotoğraflar yüklenirken bir hata oluştu'
      } finally {
        this.loading = false
      }
    },

    // Yeni fotoğraf yükle
    async uploadPhoto(formData) {
      this.loading = true
      this.error = null
      try {
        const { data } = await axios.post(`${API_URL}/photos`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        if (data) {
          // Fotoğrafları yeniden yükle
          await this.fetchPhotos()
          return { success: true, message: 'Fotoğraf başarıyla yüklendi' }
        }
      } catch (error) {
        console.error('Fotoğraf yüklenirken hata:', error)
        this.error = 'Fotoğraf yüklenirken bir hata oluştu'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    },

    // Fotoğraf sil
    async deletePhoto(photoId) {
      this.loading = true
      this.error = null
      try {
        await axios.delete(`${API_URL}/photos/${photoId}`)
        // Silinen fotoğrafı listeden kaldır
        this.photos = this.photos.filter(photo => photo._id !== photoId)
        return { success: true, message: 'Fotoğraf başarıyla silindi' }
      } catch (error) {
        console.error('Fotoğraf silinirken hata:', error)
        this.error = 'Fotoğraf silinirken bir hata oluştu'
        return { success: false, message: this.error }
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    // Yüklenen fotoğrafları getir
    getPhotos: (state) => state.photos,

    // Yükleniyor durumunu getir
    isLoading: (state) => state.loading,

    // Hata durumunu getir
    getError: (state) => state.error,

    // Kategoriye göre fotoğrafları filtrele
    getPhotosByCategory: (state) => (category) => {
      return state.photos.filter(photo => photo.category === category)
    }
  }
}) 