import { defineStore } from 'pinia'

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
                const response = await $fetch('http://localhost:5000/api/events')
                console.log("fecht events response", response);
                this.events = response
                console.log("events", this.events);
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
                const response = await fetch('http://localhost:5000/api/events/upcoming')
                const data = await response.json()
                this.upcomingEvents = data
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
            try {
                const response = await fetch('http://localhost:5000/api/events', {
                    method: 'POST',
                    body: formData
                })
                const data = await response.json()
                if (response.ok) {
                    // Yeni etkinliği listeye ekle
                    this.events.unshift(data.event)
                    return { success: true, message: 'Etkinlik başarıyla oluşturuldu' }
                } else {
                    throw new Error(data.message)
                }
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
            try {
                const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
                    method: 'PUT',
                    body: formData
                })
                const data = await response.json()
                if (response.ok) {
                    // Güncellenen etkinliği listede güncelle
                    const index = this.events.findIndex(event => event._id === eventId)
                    if (index !== -1) {
                        this.events[index] = data.event
                    }
                    return { success: true, message: 'Etkinlik başarıyla güncellendi' }
                } else {
                    throw new Error(data.message)
                }
            } catch (error) {
                console.error('Etkinlik güncellenirken hata:', error)
                this.error = 'Etkinlik güncellenirken bir hata oluştu'
                return { success: false, message: this.error }
            } finally {
                this.loading = false
            }
        },

        // Etkinlik sil
        async deleteEvent(eventId) {
            this.loading = true
            this.error = null
            try {
                const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
                    method: 'DELETE'
                })
                if (response.ok) {
                    // Silinen etkinliği listeden kaldır
                    this.events = this.events.filter(event => event._id !== eventId)
                    return { success: true, message: 'Etkinlik başarıyla silindi' }
                } else {
                    const data = await response.json()
                    throw new Error(data.message)
                }
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
        // Tüm etkinlikleri getir
        getEvents: (state) => state.events,

        // Yaklaşan etkinlikleri getir
        getUpcomingEvents: (state) => state.upcomingEvents,

        // Yükleniyor durumunu getir
        isLoading: (state) => state.loading,

        // Hata durumunu getir
        getError: (state) => state.error
    }
}) 