import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { useNuxtApp } from '#app'

export const useGalleryStore = defineStore('gallery', {
    state: () => ({
        photos: [],
        loading: false,
        error: null
    }),

    actions: {
        async fetchPhotos(category = 'all') {
            const { $api } = useNuxtApp()
            try {
                this.loading = true
                // API endpoint'i kullanıyoruz
                const response = await $api(`/gallery${category !== 'all' ? `?category=${category}` : ''}`)
                this.photos = response
            } catch (error) {
                this.error = error.message
                console.error('Fotoğraflar yüklenirken hata:', error)
            } finally {
                this.loading = false
            }
        },

        async uploadPhoto(photoData) {
            const { $api } = useNuxtApp()
            try {
                this.loading = true

                // Auth store'dan token'ı al
                const authStore = useAuthStore();
                if (!authStore.token) {
                    authStore.getTokenFromCookie();
                }

                if (!authStore.token) {
                    this.error = "Yetkilendirme hatası: Oturum açmanız gerekiyor";
                    return { success: false, message: this.error };
                }

                const formData = new FormData()
                formData.append('image', photoData.file)
                formData.append('title', photoData.title)
                formData.append('description', photoData.description)
                formData.append('category', photoData.category)

                // API endpoint'i kullanıyoruz
                const response = await $api('/gallery', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                return response
            } catch (error) {
                this.error = error.message
                console.error('Fotoğraf yüklenirken hata:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async deletePhoto(photoId) {
            const { $api } = useNuxtApp()
            try {
                this.loading = true

                // Auth store'dan token'ı al
                const authStore = useAuthStore();
                if (!authStore.token) {
                    authStore.getTokenFromCookie();
                }

                if (!authStore.token) {
                    this.error = "Yetkilendirme hatası: Oturum açmanız gerekiyor";
                    return { success: false, message: this.error };
                }

                // API endpoint'i kullanıyoruz
                await $api(`/gallery/${photoId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                // Başarılı silme işleminden sonra listeyi güncelle
                this.photos = this.photos.filter(photo => photo.id !== photoId)
                return { success: true, message: 'Fotoğraf başarıyla silindi' }
            } catch (error) {
                this.error = error.message
                console.error('Fotoğraf silinirken hata:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async updatePhoto(photoId, photoData) {
            const { $api } = useNuxtApp()
            try {
                this.loading = true

                // Auth store'dan token'ı al
                const authStore = useAuthStore();
                if (!authStore.token) {
                    authStore.getTokenFromCookie();
                }

                if (!authStore.token) {
                    this.error = "Yetkilendirme hatası: Oturum açmanız gerekiyor";
                    return { success: false, message: this.error };
                }

                const formData = new FormData()
                if (photoData.file) {
                    formData.append('image', photoData.file)
                }
                formData.append('title', photoData.title)
                formData.append('description', photoData.description)
                formData.append('category', photoData.category)

                // API endpoint'i kullanıyoruz
                const response = await $api(`/gallery/${photoId}`, {
                    method: 'PUT',
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                return response
            } catch (error) {
                this.error = error.message
                console.error('Fotoğraf güncellenirken hata:', error)
                throw error
            } finally {
                this.loading = false
            }
        }
    },

    getters: {
        getPhotos: (state) => state.photos,
        getPhotosByCategory: (state) => (category) => {
            return category === 'all'
                ? state.photos
                : state.photos.filter(photo => photo.category === category)
        },
        isLoading: (state) => state.loading,
        getError: (state) => state.error
    }
}) 