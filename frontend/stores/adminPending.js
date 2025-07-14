import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { useNuxtApp } from '#app'

export const useAdminPendingStore = defineStore('adminPending', {
    state: () => ({
        pendingAdmins: [],
        loading: false,
        error: null
    }),

    actions: {
        // Bekleyen admin başvurularını getir
        async fetchPendingAdmins() {
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
                this.loading = false
                return { success: false, message: this.error }
            }

            try {
                const response = await $api('/auth/pending', {
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                this.pendingAdmins = response || []
                return { success: true, data: this.pendingAdmins }
            } catch (error) {
                console.error('Bekleyen adminler yüklenirken hata:', error)
                this.error = error.message || 'Bekleyen adminler getirilemedi'
                return { success: false, message: this.error }
            } finally {
                this.loading = false
            }
        },

        // Admin başvurusunu onayla/reddet
        async handleAdminAction(adminId, action, approvedBy) {
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
                this.loading = false
                return { success: false, message: this.error }
            }

            try {
                const response = await $api(`/auth/${adminId}/approve`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authStore.token}`
                    },
                    body: JSON.stringify({
                        action,
                        approvedBy
                    })
                })

                if (response) {
                    // İşlem başarılıysa listeyi güncelle
                    await this.fetchPendingAdmins()
                    return { success: true, message: action === 'approve' ? 'Admin başvurusu onaylandı' : 'Admin başvurusu reddedildi' }
                }

                return { success: false, message: 'İşlem başarısız oldu' }
            } catch (error) {
                console.error('Admin işlemi yapılırken hata:', error)
                this.error = error.message || 'İşlem başarısız oldu'
                return { success: false, message: this.error }
            } finally {
                this.loading = false
            }
        }
    },

    getters: {
        getPendingAdmins: (state) => state.pendingAdmins,
        isLoading: (state) => state.loading,
        getError: (state) => state.error
    }
}) 