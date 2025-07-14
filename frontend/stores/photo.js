import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { useNuxtApp } from '#app'

export const usePhotoStore = defineStore('photo', {
  state: () => ({
    photos: [],
    loading: false,
    error: null
  }),

  actions: {
    // Tüm fotoğrafları getir
    async fetchPhotos() {
      const { $api } = useNuxtApp()
      this.loading = true
      this.error = null
      try {
        const response = await $api('/photos')
        console.log("pinia foto data", response);
        this.photos = response
      } catch (error) {
        console.error('Fotoğraflar yüklenirken hata:', error)
        this.error = 'Fotoğraflar yüklenirken bir hata oluştu'
      } finally {
        this.loading = false
      }
    },

    // Kategoriye göre fotoğrafları getir
    async fetchPhotosByCategory(category) {
      const { $api } = useNuxtApp()
      this.loading = true
      this.error = null
      try {
        const response = await $api(`/photos/category/${category}`)
        this.photos = response
      } catch (error) {
        console.error('Fotoğraflar yüklenirken hata:', error)
        this.error = 'Fotoğraflar yüklenirken bir hata oluştu'
      } finally {
        this.loading = false
      }
    },

    // Yeni fotoğraf yükle
    async uploadPhoto(formData) {
      const { $api } = useNuxtApp()
      this.loading = true
      this.error = null

      // Auth store'dan token'ı al
      const authStore = useAuthStore();
      if (!authStore.token) {
        authStore.getTokenFromCookie();
      }

      if (!authStore.token) {
        this.error = "Yetkilendirme hatası: Oturum açmanız gerekiyor";
        return { success: false, message: this.error };
      }

      try {
        const response = await $api('/photos', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
        if (response) {
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
      const { $api } = useNuxtApp()
      this.loading = true
      this.error = null

      // Auth store'dan token'ı al
      const authStore = useAuthStore();
      if (!authStore.token) {
        authStore.getTokenFromCookie();
      }

      if (!authStore.token) {
        this.error = "Yetkilendirme hatası: Oturum açmanız gerekiyor";
        return { success: false, message: this.error };
      }

      try {
        await $api(`/photos/${photoId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
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