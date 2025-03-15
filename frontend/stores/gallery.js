import { defineStore } from 'pinia'
import axios from 'axios'

export const useGalleryStore = defineStore('gallery', {
    state: () => ({
        photos: [],
        loading: false,
        error: null
    }),

    actions: {
        async fetchPhotos(category = 'all') {
            try {
                this.loading = true
                // API endpoint'i buraya gelecek
                const response = await axios.get(`API_URL/gallery${category !== 'all' ? `?category=${category}` : ''}`)
                this.photos = response.data
            } catch (error) {
                this.error = error.message
                console.error('Fotoğraflar yüklenirken hata:', error)
            } finally {
                this.loading = false
            }
        },

        async uploadPhoto(photoData) {
            try {
                this.loading = true
                const formData = new FormData()
                formData.append('image', photoData.file)
                formData.append('title', photoData.title)
                formData.append('description', photoData.description)
                formData.append('category', photoData.category)

                // API endpoint'i buraya gelecek
                const response = await axios.post('API_URL/gallery', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                return response.data
            } catch (error) {
                this.error = error.message
                console.error('Fotoğraf yüklenirken hata:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async deletePhoto(photoId) {
            try {
                this.loading = true
                // API endpoint'i buraya gelecek
                await axios.delete(`API_URL/gallery/${photoId}`)
                // Başarılı silme işleminden sonra listeyi güncelle
                this.photos = this.photos.filter(photo => photo.id !== photoId)
            } catch (error) {
                this.error = error.message
                console.error('Fotoğraf silinirken hata:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async updatePhoto(photoId, photoData) {
            try {
                this.loading = true
                const formData = new FormData()
                if (photoData.file) {
                    formData.append('image', photoData.file)
                }
                formData.append('title', photoData.title)
                formData.append('description', photoData.description)
                formData.append('category', photoData.category)

                // API endpoint'i buraya gelecek
                const response = await axios.put(`API_URL/gallery/${photoId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                return response.data
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