import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { useNuxtApp } from '#app'

export const usePageContentStore = defineStore('pageContent', {
    state: () => ({
        pageContents: {},
        loading: false,
        error: null
    }),

    actions: {
        // Belirli bir sayfanın içeriğini getir
        async fetchPageContent(pageName) {
            const { $api } = useNuxtApp()
            this.loading = true
            this.error = null

            try {
                // Eğer zaten yüklendiyse tekrar yükleme
                if (this.pageContents[pageName]) {
                    this.loading = false
                    return this.pageContents[pageName]
                }

                const response = await $api(`/page-contents/${pageName}`)
                if (response && response.pageContent) {
                    // State'e ekle
                    this.pageContents[pageName] = response.pageContent
                    return response.pageContent
                }

                return null
            } catch (error) {
                console.error(`${pageName} sayfası içeriği yüklenirken hata:`, error)
                this.error = `Sayfa içeriği yüklenirken bir hata oluştu: ${error.message}`
                return null
            } finally {
                this.loading = false
            }
        },

        // Tüm sayfa içeriklerini getir
        async fetchAllPageContents() {
            const { $api } = useNuxtApp()
            this.loading = true
            this.error = null

            try {
                const response = await $api('/page-contents')
                if (response && response.pageContents) {
                    // Her sayfa içeriğini pageContents objesine ekle
                    response.pageContents.forEach(page => {
                        this.pageContents[page.pageName] = page
                    })
                    return response.pageContents
                }

                return []
            } catch (error) {
                console.error('Tüm sayfa içerikleri yüklenirken hata:', error)
                this.error = `Sayfa içerikleri yüklenirken bir hata oluştu: ${error.message}`
                return []
            } finally {
                this.loading = false
            }
        },

        // Yeni sayfa içeriği oluştur
        async createPageContent(pageData) {
            const { $api } = useNuxtApp()
            this.loading = true
            this.error = null

            // Auth store'dan token'ı al
            const authStore = useAuthStore()
            if (!authStore.token) {
                authStore.getTokenFromCookie()
            }

            if (!authStore.token) {
                this.error = "Yetkilendirme hatası: Oturum açmanız gerekiyor"
                return { success: false, message: this.error }
            }

            try {
                const response = await $api('/page-contents', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(pageData)
                })

                if (response && response.pageContent) {
                    // Oluşturulan sayfayı state'e ekle
                    this.pageContents[response.pageContent.pageName] = response.pageContent
                    return { success: true, pageContent: response.pageContent }
                }

                return { success: false, message: 'Sayfa içeriği oluşturulamadı' }
            } catch (error) {
                console.error('Sayfa içeriği oluşturulurken hata:', error)
                this.error = `Sayfa içeriği oluşturulurken bir hata oluştu: ${error.message}`
                return { success: false, message: this.error }
            } finally {
                this.loading = false
            }
        },

        // Sayfa içeriğini güncelle
        async updatePageContent(pageName, pageData) {
            const { $api } = useNuxtApp()
            this.loading = true
            this.error = null

            // Auth store'dan token'ı al
            const authStore = useAuthStore()
            if (!authStore.token) {
                authStore.getTokenFromCookie()
            }

            if (!authStore.token) {
                this.error = "Yetkilendirme hatası: Oturum açmanız gerekiyor"
                return { success: false, message: this.error }
            }

            try {
                const response = await $api(`/page-contents/${pageName}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(pageData)
                })

                if (response && response.pageContent) {
                    // Güncellenen sayfayı state'e ekle
                    this.pageContents[pageName] = response.pageContent
                    return { success: true, pageContent: response.pageContent }
                }

                return { success: false, message: 'Sayfa içeriği güncellenemedi' }
            } catch (error) {
                console.error('Sayfa içeriği güncellenirken hata:', error)
                this.error = `Sayfa içeriği güncellenirken bir hata oluştu: ${error.message}`
                return { success: false, message: this.error }
            } finally {
                this.loading = false
            }
        },

        // Sayfa içeriğini sil
        async deletePageContent(pageName) {
            const { $api } = useNuxtApp()
            this.loading = true
            this.error = null

            // Auth store'dan token'ı al
            const authStore = useAuthStore()
            if (!authStore.token) {
                authStore.getTokenFromCookie()
            }

            if (!authStore.token) {
                this.error = "Yetkilendirme hatası: Oturum açmanız gerekiyor"
                return { success: false, message: this.error }
            }

            try {
                const response = await $api(`/page-contents/${pageName}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })

                if (response) {
                    // Silinen sayfayı state'den kaldır
                    delete this.pageContents[pageName]
                    return { success: true, message: 'Sayfa içeriği başarıyla silindi' }
                }

                return { success: false, message: 'Sayfa içeriği silinemedi' }
            } catch (error) {
                console.error('Sayfa içeriği silinirken hata:', error)
                this.error = `Sayfa içeriği silinirken bir hata oluştu: ${error.message}`
                return { success: false, message: this.error }
            } finally {
                this.loading = false
            }
        }
    },

    getters: {
        getPageContent: (state) => (pageName) => state.pageContents[pageName] || null,
        isLoading: (state) => state.loading,
        getError: (state) => state.error
    }
}) 