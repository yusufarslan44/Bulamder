import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useEventStore = defineStore('event', {
    state: () => ({
        events: [],
        upcomingEvents: [],
        loading: false,
        error: null
    }),

    actions: {
        // Tüm etkinlikleri getir
        async fetchEvents() {
            this.loading = true
            this.error = null
            try {
                const data = await $fetch('http://localhost:5000/api/events')
                console.log("data", data);
                this.events = data || []
            } catch (error) {
                console.error('Etkinlikler yüklenirken hata:', error)
                this.error = 'Etkinlikler yüklenirken bir hata oluştu'
            } finally {
                this.loading = false
            }
        },

        // Yaklaşan etkinlikleri getir
        async fetchUpcomingEvents() {
            this.loading = true
            this.error = null
            try {
                const response = await $fetch('http://localhost:5000/api/events/upcoming')
                this.upcomingEvents = response || []
            } catch (error) {
                console.error('Yaklaşan etkinlikler yüklenirken hata:', error)
                this.error = 'Yaklaşan etkinlikler yüklenirken bir hata oluştu'
            } finally {
                this.loading = false
            }
        },

        // Yeni etkinlik oluştur
        async createEvent(formData) {
            this.loading = true
            this.error = null
            console.log("çalıştı1 ");
            
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
                const response = await $fetch('http://localhost:5000/api/events', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    },
                    body: formData
                })
                console.log("response ", response);

                // Eğer response.events dizisi varsa, her bir öğeyi events dizisine ekleyelim
                this.events.push(response.event) // Spread operator ile ekliyoruz
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
        async updateEvent(eventId, formData) {
            this.loading = true
            this.error = null
            console.log("event id", eventId);
            
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
                const response = await $fetch(`http://localhost:5000/api/events/${eventId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    },
                    body: formData
                })
                console.log("response ", response);
                const index = this.events.findIndex(event => event._id === eventId)
                if (index !== -1) {
                    // response.event'i kullanarak güncelle
                    this.events[index] = response.event
                }

                return {
                    success: true,
                    message: 'Etkinlik başarıyla güncellendi'
                }
            } catch (error) {
                console.error('Etkinlik güncellenirken hata:', error)
                this.error = error.message || 'Etkinlik güncellenirken bir hata oluştu'
                return {
                    success: false,
                    message: this.error
                }
            } finally {
                this.loading = false
            }
        },
        // Etkinlik sil
        async deleteEvent(eventId) {
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
                const response = await $fetch(`http://localhost:5000/api/events/${eventId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${authStore.token}`
                    }
                })
                console.log("response  delete", response);
                if (response.message === "Etkinlik başarıyla silindi") {
                    this.events = this.events.filter(event => event._id !== eventId)
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
        getEvents: (state) => state.events,
        getUpcomingEvents: (state) => state.upcomingEvents,
        isLoading: (state) => state.loading,
        getError: (state) => state.error
    }
})
