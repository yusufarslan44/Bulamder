import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        auth: [],
        upcomingAuth: [],
        loading: false,
        error: null,
        user: null,
        token: null,
        isAuthenticated: false
    }),

    actions: {
        // Tüm etkinlikleri getir
        // async fetchAuth() {
        //     this.loading = true
        //     this.error = null
        //     try {
        //         const data = await $fetch('http://localhost:5000/api/auth')
        //         this.auth = data || []
        //     } catch (error) {
        //         console.error('Etkinlikler yüklenirken hata:', error)
        //         this.error = 'Etkinlikler yüklenirken bir hata oluştu'
        //     } finally {
        //         this.loading = false
        //     }
        // },


        async fetchUpcomingAuth() {
            const { $api } = useNuxtApp()
            this.loading = true
            this.error = null
            try {
                const response = await $api('/auth/upcoming')
                this.upcomingAuth = response || []
            } catch (error) {
                console.error('Yaklaşan etkinlikler yüklenirken hata:', error)
                this.error = 'Yaklaşan etkinlikler yüklenirken bir hata oluştu'
            } finally {
                this.loading = false
            }
        },

        // Cookie'den token'ı al
        getTokenFromCookie() {
            const cookies = document.cookie.split(';')
            const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='))
            if (tokenCookie) {
                this.token = tokenCookie.split('=')[1]
                this.isAuthenticated = true
                return true
            }
            return false
        },

        // Cookie'ye token'ı kaydet
        setTokenToCookie(token) {
            document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Lax`
            this.token = token
            this.isAuthenticated = true
        },

        // Cookie'den token'ı sil
        removeTokenFromCookie() {
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
            this.token = null
            this.isAuthenticated = false
            this.user = null
        },

        // Login işlemi
        async loginAuth(credentials) {
            const { $api } = useNuxtApp()
            try {
                // Credentials objeyse JSON.stringify yap
                if (typeof credentials === 'object') {
                    credentials = JSON.stringify(credentials);
                }

                const response = await $api('/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: credentials
                })

                // Token'ı cookie'ye kaydet
                if (response.token) {
                    this.setTokenToCookie(response.token)
                    // Kullanıcı bilgilerini kaydet
                    this.user = response.user
                    return true
                } else {
                    // Token yoksa giriş başarısız
                    throw new Error(response.message || 'Giriş başarısız')
                }
            } catch (error) {
                console.error('Login error:', error)
                // FetchError içinden gerçek hata mesajını çıkar
                if (error.response && error.response._data) {
                    throw new Error(error.response._data.message || 'Giriş başarısız')
                }
                throw error
            }
        },

        // Register işlemi
        async registerAuth(credentials) {
            const { $api } = useNuxtApp()
            try {
                const response = await $api('/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: credentials
                })

                return true
            } catch (error) {
                console.error('Register error:', error)
                throw error
            }
        },

        // Çıkış işlemi
        logout() {
            this.removeTokenFromCookie()
        },

        // Kullanıcı durumunu kontrol et
        checkAuth() {
            return this.getTokenFromCookie()
        },




        async deleteAuth(authId) {
            const { $api } = useNuxtApp()
            this.loading = true
            this.error = null
            try {
                const response = await $api(`/auth/${authId}`, {
                    method: 'DELETE'
                })
                console.log("response  delete", response);
                if (response.message === "Etkinlik başarıyla silindi") {
                    this.auth = this.auth.filter(auth => auth._id !== authId)
                    return { success: true, message: 'Etkinlik başarıyla silindi' }
                }
                throw new Error('Etkinlik silme başarısız')
            } catch (error) {
                console.error('Etkinlik silinirken hata:', error)
                this.error = 'Etkinlik silinirken bir hata oluştu'
                return { success: false, message: this.error }
            } finally {
                this.loading = false
            }
        }
    },

    getters: {
        getAuth: (state) => state.auth,
        getUpcomingAuth: (state) => state.upcomingAuth,
        isLoading: (state) => state.loading,
        getError: (state) => state.error
    }
})
