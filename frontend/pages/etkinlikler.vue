<template>
    <v-container class="py-16">
        <!-- Başlık -->
        <v-row justify="center" class="mb-12">
            <v-col cols="12" md="8" class="text-center">
                <span class="text-overline text-green-darken-2 font-weight-bold d-block mb-2">PROGRAM & TAKVİM</span>
                <h1 class="text-h3 font-weight-bold mb-3">Etkinlikler</h1>
                <div class="section-divider mx-auto mb-4"></div>
                <p class="text-body-1">
                    Çelikhan'da düzenlenen etkinlikler, şenlikler ve buluşmalar
                </p>
            </v-col>
        </v-row>

        <!-- Yaklaşan Etkinlik -->
        <v-row class="mb-16" justify="center" v-if="upcomingEvent">
            <v-col cols="12" md="10">
                <v-card class="upcoming-event-card rounded-xl overflow-hidden" elevation="3">
                    <v-row>
                        <v-col cols="12" md="6" class="pa-0">
                            <div class="image-container">
                                <v-img :src="upcomingEvent.imageUrl"
                                    height="380" cover class="featured-image"></v-img>
                                <div class="image-overlay-gradient"></div>
                                <div class="event-badge">YAKLAŞAN ETKİNLİK</div>
                            </div>
                        </v-col>
                        <v-col cols="12" md="6" class="d-flex flex-column justify-center pa-8 fade-in">
                            <v-card-title class="text-h3 font-weight-bold mb-3">{{ upcomingEvent.title }}</v-card-title>
                            <div class="d-flex align-center mb-4 event-date">
                                <v-icon color="primary" class="mr-2">mdi-calendar</v-icon>
                                <span class="text-subtitle-1">{{ formatDate(upcomingEvent.date) }} - {{ formatDate(upcomingEvent.endDate) }}</span>
                            </div>
                            <div class="d-flex align-center mb-6 event-location">
                                <v-icon color="primary" class="mr-2">mdi-map-marker</v-icon>
                                <span class="text-subtitle-1">{{ upcomingEvent.location }}</span>
                            </div>
                            <v-card-text class="px-0 pt-0">
                                <p class="text-body-1 mb-6">{{ upcomingEvent.description }}</p>
                                <div class="d-flex mb-6">
                                    <v-chip color="primary" class="mr-2 rounded-pill">
                                        <v-icon size="small" class="mr-1">mdi-calendar-check</v-icon>
                                        Etkinlik
                                    </v-chip>
                                    <v-chip color="secondary" class="rounded-pill" v-if="upcomingEvent.participants && upcomingEvent.participants.length > 0">
                                        <v-icon size="small" class="mr-1">mdi-account-group</v-icon>
                                        {{ upcomingEvent.participants.length }} Katılımcı
                                    </v-chip>
                                </div>
                                <div class="event-countdown pa-4 rounded-lg mb-4">
                                    <div class="text-center text-subtitle-2 mb-2">Etkinliğe Kalan Süre</div>
                                    <div class="d-flex justify-space-around">
                                        <div class="countdown-item">
                                            <div class="text-h5 font-weight-bold">{{ countdown.days }}</div>
                                            <div class="text-caption">Gün</div>
                                        </div>
                                        <div class="countdown-item">
                                            <div class="text-h5 font-weight-bold">{{ countdown.hours }}</div>
                                            <div class="text-caption">Saat</div>
                                        </div>
                                        <div class="countdown-item">
                                            <div class="text-h5 font-weight-bold">{{ countdown.minutes }}</div>
                                            <div class="text-caption">Dakika</div>
                                        </div>
                                    </div>
                                </div>
                            </v-card-text>
                            <v-card-actions class="px-0">
                                <v-btn color="primary" size="large" class="rounded-xl elevation-2 px-6 pulse-button" @click="openEventDialog(upcomingEvent)">
                                    <v-icon left class="mr-2">mdi-information-outline</v-icon>
                                    Detayları Gör
                                </v-btn>
                            </v-card-actions>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <!-- Geçmiş Etkinlikler -->
        <v-row justify="center" class="mb-8">
            <v-col cols="12" md="10" class="d-flex justify-space-between align-center flex-wrap">
                <h2 class="text-h4 font-weight-bold">{{ upcomingEvent ? 'Diğer Etkinlikler' : 'Tüm Etkinlikler' }}</h2>
                <v-btn-group variant="outlined" color="primary" rounded="pill" class="mt-2 mt-sm-0">
                    <v-btn :color="filter === 'all' ? 'primary' : ''" @click="filter = 'all'">
                        Tümü
                    </v-btn>
                    <v-btn :color="filter === 'upcoming' ? 'primary' : ''" @click="filter = 'upcoming'">
                        Yaklaşan
                    </v-btn>
                    <v-btn :color="filter === 'past' ? 'primary' : ''" @click="filter = 'past'">
                        Geçmiş
                    </v-btn>
                </v-btn-group>
            </v-col>
        </v-row>
        
        <v-row justify="center">
            <v-col cols="12" md="10">
                <!-- Etkinlik bulunamadı mesajı -->
                <v-row v-if="filteredEvents.length === 0">
                    <v-col cols="12" class="text-center py-16">
                        <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-calendar-remove</v-icon>
                        <h3 class="text-h5 font-weight-medium mb-2">Etkinlik Bulunamadı</h3>
                        <p class="text-body-1 text-grey">Bu kategoride etkinlik bulunmuyor. Lütfen başka bir filtreleme seçeneği deneyin.</p>
                    </v-col>
                </v-row>
                
                <v-row v-else>
                    <v-col v-for="(event, index) in filteredEvents" :key="event._id" cols="12" md="6" lg="4"
                        :class="{ 'fade-in-item': true }" :style="{ 'animation-delay': `${index * 0.1}s` }">
                        <v-card height="100%" @click="openEventDialog(event)" class="event-card rounded-xl overflow-hidden" elevation="3">
                            <div class="image-container">
                                <v-img :src="event.imageUrl" height="220" cover class="event-image"></v-img>
                                <div class="image-overlay-gradient"></div>
                                <div class="status-badge" :class="getStatusClass(event.status)">
                                    {{ getStatusLabel(event.status) }}
                                </div>
                            </div>
                            <v-card-item class="pa-5">
                                <v-card-title class="text-h5 font-weight-bold mb-3">{{ event.title }}</v-card-title>
                                <div class="d-flex align-center mb-4">
                                    <v-icon size="small" color="primary" class="mr-2">mdi-calendar</v-icon>
                                    <span class="text-body-2">{{ formatDate(event.date) }}</span>
                                </div>
                                <div class="d-flex align-center mb-4">
                                    <v-icon size="small" color="primary" class="mr-2">mdi-map-marker</v-icon>
                                    <span class="text-body-2">{{ event.location }}</span>
                                </div>
                                <v-card-text class="px-0 pb-0">
                                    <p class="text-body-2 event-description">{{ event.description }}</p>
                                </v-card-text>
                                <v-card-actions class="pa-0 mt-4">
                                    <v-btn variant="text" color="primary" class="read-more-btn px-0">
                                        Detayları Gör
                                        <v-icon right class="ml-1">mdi-arrow-right</v-icon>
                                    </v-btn>
                                </v-card-actions>
                            </v-card-item>
                        </v-card>
                    </v-col>
                </v-row>
                
                <!-- Daha Fazla Yükleniyor -->
                <v-row v-if="filteredEvents.length > 6 && filteredEvents.length < events.length" class="mt-8">
                    <v-col cols="12" class="text-center">
                        <v-btn color="primary" variant="outlined" class="rounded-xl px-6" prepend-icon="mdi-refresh" @click="loadMore">
                            Daha Fazla Etkinlik Göster ({{ events.length - filteredEvents.length }} adet)
                        </v-btn>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <!-- Etkinlik Detay Modal -->
        <v-dialog v-model="dialog" max-width="900" transition="dialog-bottom-transition">
            <v-card v-if="selectedEvent" class="rounded-xl overflow-hidden">
                <div class="position-relative">
                    <v-img :src="selectedEvent.imageUrl" height="350" cover class="dialog-image"></v-img>
                    <div class="dialog-overlay-gradient"></div>
                    <v-btn icon class="close-btn" variant="text" color="white" @click="dialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <div class="status-badge-detail" :class="getStatusClass(selectedEvent.status)">
                        {{ getStatusLabel(selectedEvent.status) }}
                    </div>
                </div>
                <v-card-item class="pb-0">
                    <v-card-title class="text-h3 font-weight-bold mb-2">{{ selectedEvent.title }}</v-card-title>
                    <div class="d-flex flex-wrap gap-2 mb-4">
                        <div class="d-flex align-center mr-4">
                            <v-icon color="primary" class="mr-2">mdi-calendar</v-icon>
                            <span class="text-subtitle-1">{{ formatDate(selectedEvent.date) }} - {{ formatDate(selectedEvent.endDate) }}</span>
                        </div>
                        <div class="d-flex align-center">
                            <v-icon color="primary" class="mr-2">mdi-map-marker</v-icon>
                            <span class="text-subtitle-1">{{ selectedEvent.location }}</span>
                        </div>
                    </div>
                </v-card-item>
                <v-card-text>
                    <p class="text-body-1 mb-6">{{ selectedEvent.description }}</p>
                    
                    <template v-if="selectedEvent.program && selectedEvent.program.length > 0">
                        <v-divider class="mb-6"></v-divider>
                        <h3 class="text-h5 font-weight-bold mb-4">Etkinlik Programı</h3>
                        <v-timeline density="comfortable" align="start" class="event-timeline">
                            <v-timeline-item v-for="(activity, index) in selectedEvent.program" :key="index"
                                :dot-color="activity.color || 'primary'" size="small" class="timeline-item">
                                <template v-slot:opposite>
                                    <div class="text-subtitle-1 font-weight-medium timeline-time">{{ activity.time }}</div>
                                </template>
                                <div class="timeline-content pa-3">
                                    <div class="text-h6 font-weight-bold mb-1">{{ activity.title }}</div>
                                    <div class="text-body-2">{{ activity.description }}</div>
                                </div>
                            </v-timeline-item>
                        </v-timeline>
                    </template>
                    
                    <!-- Katılımcılar -->
                    <template v-if="selectedEvent.participants && selectedEvent.participants.length > 0">
                        <v-divider class="my-6"></v-divider>
                        <h3 class="text-h5 font-weight-bold mb-4">Katılımcılar</h3>
                        <v-chip-group>
                            <v-chip v-for="(participant, index) in selectedEvent.participants" :key="index" 
                                variant="outlined" color="primary" class="ma-1">
                                <v-avatar start>
                                    <v-img :src="participant.avatar || 'https://cdn.vuetifyjs.com/images/john.jpg'" alt="Katılımcı"></v-img>
                                </v-avatar>
                                {{ participant.name }}
                            </v-chip>
                        </v-chip-group>
                    </template>
                    
                    <!-- Sosyal Paylaşım -->
                    <v-sheet class="my-6 pa-5 rounded-xl text-center bg-grey-lighten-4">
                        <p class="text-body-2 mb-3">Bu etkinliği arkadaşlarınızla paylaşın</p>
                        <div class="d-flex justify-center">
                            <v-btn icon color="blue-darken-1" class="mx-1" variant="text" size="large">
                                <v-icon>mdi-facebook</v-icon>
                            </v-btn>
                            <v-btn icon color="blue-lighten-1" class="mx-1" variant="text" size="large">
                                <v-icon>mdi-twitter</v-icon>
                            </v-btn>
                            <v-btn icon color="green-darken-1" class="mx-1" variant="text" size="large">
                                <v-icon>mdi-whatsapp</v-icon>
                            </v-btn>
                            <v-btn icon color="pink-darken-1" class="mx-1" variant="text" size="large">
                                <v-icon>mdi-instagram</v-icon>
                            </v-btn>
                        </div>
                    </v-sheet>
                </v-card-text>
                <v-card-actions class="pa-4">
                    <v-btn color="primary" variant="tonal" prepend-icon="mdi-calendar" class="mr-2">
                        Takvime Ekle
                    </v-btn>
                    <v-btn color="error" variant="tonal" prepend-icon="mdi-bell">
                        Hatırlatıcı Kur
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" class="rounded-xl px-6" @click="dialog = false">Kapat</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup>
const dialog = ref(false)
const selectedEvent = ref(null)
const filter = ref('all')
const limit = ref(6)  // Başlangıçta gösterilecek etkinlik sayısı

// Etkinlik verilerini getir
const events = computed(() => useEventStore().getEvents)

// En yakın gelecek etkinlik
const upcomingEvent = computed(() => {
    const upcoming = events.value.filter(event => event.status === 'upcoming')
    if (upcoming.length === 0) return null
    
    // Tarih olarak en yakın olanı seç
    return upcoming.sort((a, b) => new Date(a.date) - new Date(b.date))[0]
})

// Filtrelenmiş etkinlikler (sayfalama ile)
const filteredEvents = computed(() => {
    let filtered = [...events.value]
    
    // Ana sayfada gösterilen yaklaşan etkinliği filtrele
    if (upcomingEvent.value) {
        filtered = filtered.filter(event => event._id !== upcomingEvent.value._id)
    }
    
    // Duruma göre filtrele
    if (filter.value === 'upcoming') {
        filtered = filtered.filter(event => event.status === 'upcoming')
    } else if (filter.value === 'past') {
        filtered = filtered.filter(event => event.status === 'past')
    }
    
    // Sırala (yaklaşan etkinlikler önce, sonra geçmiş etkinlikler)
    filtered.sort((a, b) => {
        if (a.status === 'upcoming' && b.status !== 'upcoming') return -1
        if (a.status !== 'upcoming' && b.status === 'upcoming') return 1
        return new Date(b.date) - new Date(a.date)
    })
    
    // Limit uygula
    return filtered.slice(0, limit.value)
})

// Geri sayım hesaplama
const countdown = computed(() => {
    if (!upcomingEvent.value) return { days: 0, hours: 0, minutes: 0 }
    
    const now = new Date()
    const eventDate = new Date(upcomingEvent.value.date)
    const diff = eventDate - now
    
    // Etkinlik geçmişse sıfır göster
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0 }
    
    // Gün, saat, dakika hesapla
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return { days, hours, minutes }
})

// Tarih formatı
const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Etkinlik durumu sınıfı
const getStatusClass = (status) => {
    switch(status) {
        case 'upcoming': return 'status-upcoming'
        case 'past': return 'status-past'
        case 'cancelled': return 'status-cancelled'
        default: return 'status-upcoming'
    }
}

// Etkinlik durumu etiketi
const getStatusLabel = (status) => {
    switch(status) {
        case 'upcoming': return 'Yaklaşan'
        case 'past': return 'Geçmiş'
        case 'cancelled': return 'İptal Edildi'
        default: return 'Etkinlik'
    }
}

// Daha fazla etkinlik göster
const loadMore = () => {
    limit.value += 6
}

// Etkinlik detayını aç
const openEventDialog = (event) => {
    selectedEvent.value = event
    dialog.value = true
}

// Etkinlikleri yükle
onMounted(async () => {
    await useEventStore().fetchEvents()
})
</script>

<style scoped>
.section-divider {
    height: 4px;
    width: 70px;
    background: linear-gradient(90deg, #09c256, #0b7231);
    border-radius: 2px;
}

.upcoming-event-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
    position: relative;
}

.upcoming-event-card:hover {
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
}

.image-container {
    position: relative;
    overflow: hidden;
    height: 100%;
}

.featured-image {
    transition: transform 0.8s ease;
}

.upcoming-event-card:hover .featured-image {
    transform: scale(1.05);
}

.event-badge {
    position: absolute;
    top: 20px;
    left: 20px;
    background-color: rgba(9, 194, 86, 0.9);
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-weight: bold;
    font-size: 0.8rem;
    letter-spacing: 1px;
    z-index: 2;
}

.status-badge {
    position: absolute;
    bottom: 20px;
    right: 20px;
    padding: 6px 12px;
    border-radius: 4px;
    font-weight: 500;
    font-size: 0.7rem;
    letter-spacing: 0.5px;
    z-index: 2;
}

.status-badge-detail {
    position: absolute;
    top: 20px;
    right: 60px;
    padding: 6px 12px;
    border-radius: 4px;
    font-weight: 500;
    font-size: 0.7rem;
    letter-spacing: 0.5px;
    z-index: 3;
}

.status-upcoming {
    background-color: rgba(9, 194, 86, 0.9);
    color: white;
}

.status-past {
    background-color: rgba(100, 116, 139, 0.9);
    color: white;
}

.status-cancelled {
    background-color: rgba(244, 67, 54, 0.9);
    color: white;
}

.image-overlay-gradient {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7));
    z-index: 1;
}

.event-date, .event-location {
    background-color: rgba(9, 194, 86, 0.05);
    border-radius: 8px;
    padding: 8px 12px;
}

.event-countdown {
    background-color: rgba(9, 194, 86, 0.05);
    border: 1px solid rgba(9, 194, 86, 0.1);
}

.countdown-item {
    background-color: white;
    padding: 8px 0;
    border-radius: 8px;
    min-width: 60px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    text-align: center;
}

.event-card {
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    overflow: hidden;
    cursor: pointer;
}

.event-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1) !important;
}

.event-image {
    transition: transform 0.5s ease;
}

.event-card:hover .event-image {
    transform: scale(1.05);
}

.event-description {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 60px;
}

.read-more-btn {
    transition: transform 0.3s ease;
}

.read-more-btn:hover {
    transform: translateX(5px);
}

.dialog-image {
    transition: transform 0.8s ease;
}

.dialog-overlay-gradient {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
    z-index: 2;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 3;
}

.event-timeline {
    border-left: 2px solid rgba(9, 194, 86, 0.2);
}

.timeline-item {
    padding-bottom: 24px;
}

.timeline-time {
    color: #09c256;
}

.timeline-content {
    background-color: rgba(9, 194, 86, 0.05);
    border-radius: 8px;
    transition: transform 0.3s ease;
}

.timeline-content:hover {
    transform: translateX(5px);
    background-color: rgba(9, 194, 86, 0.1);
}

.pulse-button {
    animation: pulse 2s infinite;
}

.fade-in {
    animation: fadeIn 0.8s ease-in-out;
}

.fade-in-item {
    animation: fadeInUp 0.6s ease forwards;
    opacity: 0;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(9, 194, 86, 0.4);
    }
    70% {
        box-shadow: 0 0 0 10px rgba(9, 194, 86, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(9, 194, 86, 0);
    }
}

@media (max-width: 960px) {
    .event-description {
        min-height: auto;
    }
    
    .timeline-time {
        font-size: 0.9rem;
    }
}
</style>