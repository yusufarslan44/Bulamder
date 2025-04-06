import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        auth: [],
        upcomingAuth: [],
        loading: false,
        error: null
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
            this.loading = true
            this.error = null
            try {
                const { data } = await useAsyncData('upcomingAuth', () =>
                    $fetch('http://localhost:5000/api/auth/upcoming')
                )
                this.upcomingAuth = data.value || []
            } catch (error) {
                console.error('Yaklaşan etkinlikler yüklenirken hata:', error)
                this.error = 'Yaklaşan etkinlikler yüklenirken bir hata oluştu'
            } finally {
                this.loading = false
            }
        },


        async registerAuth(formData) {
            this.loading = true
            this.error = null
            console.log("çalıştı1 ");
            console.log("form data pinia", formData);
            try {
                const response = await $fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    body: formData
                })
                console.log("response ", response);

                // Eğer response.auth dizisi varsa, her bir öğeyi auth dizisine ekleyelim
                this.auth.push(response.auth) // Spread operator ile ekliyoruz
                return { success: true, message: 'Etkinlik başarıyla oluşturuldu' }


            } catch (error) {
                console.error('Etkinlik oluşturulurken hata:', error)
                this.error = 'Etkinlik oluşturulurken bir hata oluştu'
                return { success: false, message: this.error }
            } finally {
                this.loading = false
            }
        },

        // Etkinlik güncelle
        async loginAuth(formData) {
            this.loading = true
            this.error = null
            console.log("çalıştı1 ");
            console.log("form data pinia", formData);
            try {
                const response = await $fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    body: formData
                })
                console.log("response ", response);

                // Eğer response.auth dizisi varsa, her bir öğeyi auth dizisine ekleyelim
                this.auth.push(response.auth) // Spread operator ile ekliyoruz
                return { success: true, message: 'Etkinlik başarıyla oluşturuldu' }


            } catch (error) {
                console.error('Etkinlik oluşturulurken hata:', error)
                this.error = 'Etkinlik oluşturulurken bir hata oluştu'
                return { success: false, message: this.error }
            } finally {
                this.loading = false
            }
        },
        // Etkinlik sil
        async deleteAuth(authId) {
            this.loading = true
            this.error = null
            try {
                const response = await $fetch(`http://localhost:5000/api/auth/${authId}`, {
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
