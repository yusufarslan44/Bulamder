<template>
    <v-container class="py-16 event-detail-page">
        <v-row justify="center" class="mb-6">
            <v-col cols="12" md="10">
                <v-btn
                    variant="text"
                    color="primary"
                    prepend-icon="mdi-arrow-left"
                    class="px-0"
                    @click="navigateTo('/etkinlikler')"
                >
                    Etkinliklere Dön
                </v-btn>
            </v-col>
        </v-row>

        <v-row justify="center" v-if="eventStore.isLoading && !selectedEvent">
            <v-col cols="12" md="10">
                <v-card class="rounded-xl pa-8 text-center" elevation="2">
                    <v-progress-circular indeterminate color="primary" size="36" class="mb-3"></v-progress-circular>
                    <div class="text-body-1">Etkinlik yükleniyor...</div>
                </v-card>
            </v-col>
        </v-row>

        <v-row justify="center" v-else-if="selectedEvent">
            <v-col cols="12" md="10">
                <v-card class="rounded-xl overflow-hidden">
                    <div class="position-relative">
                        <v-img :src="selectedEvent.imageUrl" height="360" cover class="event-hero-image"></v-img>
                        <div class="hero-overlay-gradient"></div>
                        <div class="status-badge-detail" :class="getStatusClass(selectedEvent.status)">
                            {{ getStatusLabel(selectedEvent.status) }}
                        </div>
                    </div>

                    <v-card-item class="pb-0">
                        <v-card-title class="text-h3 font-weight-bold mb-2 event-title">
                            {{ selectedEvent.title }}
                        </v-card-title>
                        <div class="d-flex flex-wrap gap-2 mb-4">
                            <div class="d-flex align-center mr-4">
                                <v-icon color="primary" class="mr-2">mdi-calendar</v-icon>
                                <span class="text-subtitle-1">
                                    {{ formatDate(selectedEvent.date) }} - {{ formatDate(selectedEvent.endDate) }}
                                </span>
                            </div>
                            <div class="d-flex align-center">
                                <v-icon color="primary" class="mr-2">mdi-map-marker</v-icon>
                                <span class="text-subtitle-1">{{ selectedEvent.location }}</span>
                            </div>
                        </div>
                    </v-card-item>

                    <v-card-text>
                        <p class="text-body-1 mb-6">
                            {{ selectedEvent.description || 'Etkinlik detayları yakında paylaşılacak.' }}
                        </p>

                        <template v-if="selectedEvent.program && selectedEvent.program.length > 0">
                            <v-divider class="mb-6"></v-divider>
                            <h3 class="text-h5 font-weight-bold mb-4">Etkinlik Programı</h3>
                            <v-timeline density="comfortable" align="start" class="event-timeline">
                                <v-timeline-item
                                    v-for="(activity, index) in selectedEvent.program"
                                    :key="index"
                                    :dot-color="activity.color || 'primary'"
                                    size="small"
                                    class="timeline-item"
                                >
                                    <template #opposite>
                                        <div class="text-subtitle-1 font-weight-medium timeline-time">{{ activity.time }}</div>
                                    </template>
                                    <div class="timeline-content pa-3">
                                        <div class="text-h6 font-weight-bold mb-1">{{ activity.title }}</div>
                                        <div class="text-body-2">{{ activity.description }}</div>
                                    </div>
                                </v-timeline-item>
                            </v-timeline>
                        </template>

                        <template v-if="selectedEvent.participants && selectedEvent.participants.length > 0">
                            <v-divider class="my-6"></v-divider>
                            <h3 class="text-h5 font-weight-bold mb-4">Katılımcılar</h3>
                            <v-chip-group>
                                <v-chip
                                    v-for="(participant, index) in selectedEvent.participants"
                                    :key="index"
                                    variant="outlined"
                                    color="primary"
                                    class="ma-1"
                                >
                                    <v-avatar start>
                                        <v-img :src="participant.avatar || 'https://cdn.vuetifyjs.com/images/john.jpg'" alt="Katılımcı"></v-img>
                                    </v-avatar>
                                    {{ participant.name }}
                                </v-chip>
                            </v-chip-group>
                        </template>

                        <v-sheet class="my-6 pa-5 rounded-xl text-center share-sheet">
                            <p class="text-body-2 mb-3">Bu etkinliği arkadaşlarınızla paylaşın</p>
                            <div class="d-flex justify-center">
                                <v-btn icon color="blue-darken-1" class="mx-1 share-btn" variant="text" size="large" @click="shareEvent('facebook')">
                                    <v-icon>mdi-facebook</v-icon>
                                </v-btn>
                                <v-btn icon color="blue-lighten-1" class="mx-1 share-btn" variant="text" size="large" @click="shareEvent('twitter')">
                                    <v-icon>mdi-twitter</v-icon>
                                </v-btn>
                                <v-btn icon color="green-darken-1" class="mx-1 share-btn" variant="text" size="large" @click="shareEvent('whatsapp')">
                                    <v-icon>mdi-whatsapp</v-icon>
                                </v-btn>
                                <v-btn icon color="grey-darken-1" class="mx-1 share-btn" variant="text" size="large" @click="shareEvent('copy')">
                                    <v-icon>mdi-link-variant</v-icon>
                                </v-btn>
                            </div>
                        </v-sheet>
                    </v-card-text>

                    <v-card-actions class="pa-4 event-detail-actions">
                        <v-btn
                            color="primary"
                            variant="tonal"
                            prepend-icon="mdi-calendar"
                            class="mr-2"
                            @click="addToGoogleCalendar"
                        >
                            Takvime Ekle
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <v-row justify="center" v-else>
            <v-col cols="12" md="10">
                <v-card class="rounded-xl pa-8 text-center" elevation="2">
                    <v-icon size="56" color="grey">mdi-calendar-remove</v-icon>
                    <h2 class="text-h5 mt-3 mb-2">Etkinlik Bulunamadı</h2>
                    <p class="text-body-1 text-medium-emphasis mb-4">
                        Aradığınız etkinlik bulunamadı veya kaldırılmış olabilir.
                    </p>
                    <v-btn color="primary" to="/etkinlikler" prepend-icon="mdi-arrow-left">
                        Etkinlik Listesine Dön
                    </v-btn>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
const route = useRoute()
const eventStore = useEventStore()
const events = computed(() => eventStore.getEvents)

const selectedEvent = computed(() => {
    const eventId = String(route.params.id || '')
    return events.value.find((event) => String(event._id) === eventId) || null
})

const ensureEventData = async () => {
    if (selectedEvent.value) return
    await eventStore.fetchEvents()
}

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

const getStatusClass = (status) => {
    switch (status) {
        case 'upcoming': return 'status-upcoming'
        case 'past': return 'status-past'
        case 'cancelled': return 'status-cancelled'
        default: return 'status-upcoming'
    }
}

const getStatusLabel = (status) => {
    switch (status) {
        case 'upcoming': return 'Yaklaşan'
        case 'past': return 'Geçmiş'
        case 'cancelled': return 'İptal Edildi'
        default: return 'Etkinlik'
    }
}

const toGoogleCalendarDate = (date) => {
    const safeDate = date instanceof Date && !Number.isNaN(date.getTime()) ? date : new Date()
    return safeDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

const openGoogleCalendar = (event) => {
    if (!import.meta.client || !event) return

    const eventStart = new Date(event.date)
    if (Number.isNaN(eventStart.getTime())) return

    const eventEnd = event.endDate ? new Date(event.endDate) : new Date(eventStart.getTime() + (2 * 60 * 60 * 1000))
    const safeEnd = Number.isNaN(eventEnd.getTime()) || eventEnd <= eventStart
        ? new Date(eventStart.getTime() + (2 * 60 * 60 * 1000))
        : eventEnd

    const calendarStart = eventStart
    const calendarEnd = safeEnd
    const title = event.title
    const details = event.description || 'Etkinlik detayları'

    const calendarUrl = new URL('https://calendar.google.com/calendar/render')
    calendarUrl.searchParams.set('action', 'TEMPLATE')
    calendarUrl.searchParams.set('text', title)
    calendarUrl.searchParams.set('dates', `${toGoogleCalendarDate(calendarStart)}/${toGoogleCalendarDate(calendarEnd)}`)
    calendarUrl.searchParams.set('details', details)
    calendarUrl.searchParams.set('location', event.location || '')

    window.open(calendarUrl.toString(), '_blank', 'noopener,noreferrer')
}

const addToGoogleCalendar = () => {
    if (!selectedEvent.value) return
    openGoogleCalendar(selectedEvent.value)
}

const getEventShareUrl = () => {
    if (import.meta.client && window.location?.href) {
        return window.location.href
    }
    return `/etkinlikler/${String(route.params.id || '')}`
}

const shareEvent = async (platform) => {
    if (!selectedEvent.value || !import.meta.client) return

    const shareUrl = getEventShareUrl()
    const encodedShareUrl = encodeURIComponent(shareUrl)
    const eventTitle = selectedEvent.value.title || 'Etkinlik'
    const encodedTitle = encodeURIComponent(eventTitle)
    const encodedWhatsappText = encodeURIComponent(`${eventTitle} ${shareUrl}`)

    if (platform === 'copy') {
        try {
            await navigator.clipboard.writeText(shareUrl)
        } catch {
            // Clipboard API kullanılamazsa fallback olarak linki yeni sekmede aç.
            window.open(shareUrl, '_blank', 'noopener,noreferrer')
        }
        return
    }

    const shareTargets = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedShareUrl}&text=${encodedTitle}`,
        whatsapp: `https://wa.me/?text=${encodedWhatsappText}`
    }

    const targetUrl = shareTargets[platform]
    if (!targetUrl) return
    window.open(targetUrl, '_blank', 'noopener,noreferrer')
}

onMounted(async () => {
    await ensureEventData()
})

watch(() => route.params.id, async () => {
    await ensureEventData()
})
</script>

<style scoped>
.event-detail-page {
    min-height: 70vh;
}

.event-hero-image {
    transition: transform 0.6s ease;
}

.status-badge-detail {
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 6px 12px;
    border-radius: 4px;
    font-weight: 500;
    font-size: 0.75rem;
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

.hero-overlay-gradient {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 90px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
    z-index: 2;
}

.event-title {
    line-height: 1.2;
    word-break: break-word;
}

.event-detail-actions {
    gap: 8px;
    flex-wrap: wrap;
}

.share-sheet {
    background: #f5f5f5;
    border: 1px solid rgba(15, 23, 42, 0.08);
}

.share-btn {
    transition: transform 0.2s ease, background-color 0.2s ease;
}

.share-btn:hover {
    transform: translateY(-2px);
}

:global(body.bw-theme) .share-sheet {
    background: rgba(15, 23, 42, 0.42) !important;
    border: 1px solid rgba(148, 163, 184, 0.22);
}

:global(body.bw-theme) .share-sheet :deep(.text-body-2) {
    color: var(--text-primary) !important;
}

:global(body.bw-theme) .share-btn {
    color: #cbd5e1 !important;
}

:global(body.bw-theme) .share-btn:hover {
    background-color: rgba(16, 185, 129, 0.14) !important;
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
}

@media (max-width: 600px) {
    .event-title {
        font-size: 1.6rem !important;
    }

    .event-detail-actions .v-btn {
        flex: 1 1 100%;
        margin-right: 0 !important;
    }

    :deep(.event-timeline .v-timeline-item__opposite) {
        display: none;
    }
}
</style>
