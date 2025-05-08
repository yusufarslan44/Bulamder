<template>
    <v-container fluid class="pa-0">
        <!-- Hero Section - Enhanced with better gradient and animations -->
        <v-row no-gutters>
            <v-col cols="12">
                <div class="hero-section">
                    <div class="hero-overlay"></div>
                    <v-container class="position-relative">
                        <v-row align="center" style="min-height: 90vh;">
                            <v-col cols="12" md="6" class="hero-content fade-in">
                                <span class="text-overline text-green-darken-2 font-weight-bold d-block mb-2">DOĞAYLA İÇ İÇE</span>
                                <h1 class="text-h2 font-weight-bold mb-4 text-animation">
                                    Çelikhan'a <br>
                                    <span class="text-gradient">Hoş Geldiniz</span>
                                </h1>
                                <p class="text-body-1 mb-8 max-width-500 animate-paragraph">
                                    Doğal güzellikleri, zengin kültürü ve misafirperver insanlarıyla
                                    Çelikhan, sizleri bekliyor. Yemyeşil doğası ve temiz havasıyla huzur bulacağınız bir yer.
                                </p>
                                <div class="d-flex flex-wrap gap-3">
                                    <v-btn color="primary" size="x-large" class="mr-4 elevation-3 rounded-xl pulse-button" to="/galeri">
                                        <v-icon left class="mr-2">mdi-image-multiple</v-icon>
                                        Galeriyi Keşfet
                                    </v-btn>
                                    <v-btn variant="outlined" color="primary" size="x-large" class="rounded-xl hover-float" to="/iletisim">
                                        <v-icon left class="mr-2">mdi-message-outline</v-icon>
                                        İletişime Geç
                                    </v-btn>
                                </div>
                            </v-col>
                            <v-col cols="12" md="6" class="d-flex justify-center">
                                <v-carousel cycle height="500" hide-delimiter-background show-arrows="hover"
                                    interval="6000" class="hero-carousel elevation-10">
                                    <v-carousel-item v-for="(image, i) in heroImages" :key="i" :src="image" cover
                                        class="hero-image rounded-xl">
                                        <div class="image-overlay rounded-xl"></div>
                                    </v-carousel-item>
                                </v-carousel>
                            </v-col>
                        </v-row>
                    </v-container>
                </div>
            </v-col>
        </v-row>

        <!-- Features Bar -->
        <v-row no-gutters class="features-bar">
            <v-container>
                <v-row class="py-4">
                    <v-col cols="12" md="4" class="feature-item text-center py-3">
                        <v-icon color="primary" size="36" class="mb-2">mdi-pine-tree</v-icon>
                        <h3 class="text-subtitle-1 font-weight-bold">Doğal Güzellikler</h3>
                        <p class="text-caption">Eşsiz manzaralar ve temiz hava</p>
                    </v-col>
                    <v-col cols="12" md="4" class="feature-item text-center py-3">
                        <v-icon color="primary" size="36" class="mb-2">mdi-food</v-icon>
                        <h3 class="text-subtitle-1 font-weight-bold">Yerel Lezzetler</h3>
                        <p class="text-caption">Yöresel mutfak kültürü</p>
                    </v-col>
                    <v-col cols="12" md="4" class="feature-item text-center py-3">
                        <v-icon color="primary" size="36" class="mb-2">mdi-account-group</v-icon>
                        <h3 class="text-subtitle-1 font-weight-bold">Misafirperverlik</h3>
                        <p class="text-caption">Sıcak ve samimi insanlar</p>
                    </v-col>
                </v-row>
            </v-container>
        </v-row>

        <!-- Son Haberler - Enhanced with modern card design -->
        <v-container class="py-16">
            <v-row justify="center" class="mb-12">
                <v-col cols="12" md="8" class="text-center">
                    <span class="text-overline text-green-darken-2 font-weight-bold d-block mb-2">GÜNCEL GELİŞMELER</span>
                    <h2 class="text-h3 font-weight-bold mb-3">Son Haberler</h2>
                    <div class="section-divider mx-auto mb-4"></div>
                    <p class="text-body-1">
                        Köyümüzden en güncel haberler ve gelişmeler
                    </p>
                </v-col>
            </v-row>

            <!-- Haberler için yatay slider - Enhanced with better cards -->
            <v-row>
                <v-col cols="12">
                    <v-carousel 
                        :key="filteredNews.length" 
                        :show-arrows="true" 
                        :height="$vuetify.display.xs || $vuetify.display.sm ? '450' : '450'" 
                        hide-delimiter-background
                        :interval="6000" 
                        cycle 
                        :continuous="false" 
                        delimiter-icon="mdi-circle" 
                        class="news-carousel"
                    >
                        <!-- Mobil görünümde her slayt tek kart gösterir -->
                        <template v-if="$vuetify.display.xs || $vuetify.display.sm">
                            <v-carousel-item v-for="(haber, index) in filteredNews.slice(0, 9)" :key="'m-'+index">
                                <v-row justify="center">
                                    <v-col cols="12" class="mobile-card pa-4">
                                        <v-card class="h-100 news-card rounded-xl" elevation="3">
                                            <v-img :src="haber.imageUrl" height="200" cover class="news-image">
                                                <div class="image-overlay-gradient"></div>
                                            </v-img>
                                            <v-card-item>
                                                <v-chip color="primary" size="small" class="mb-2 text-caption">{{ haber.category }}</v-chip>
                                                <v-card-title class="text-h6 font-weight-bold">
                                                    {{ haber.title }}
                                                </v-card-title>
                                                <v-card-text class="text-body-2 news-description"
                                                    v-html="haber.description.length > 100 ? haber.description.slice(0, 100) + '...' : haber.description">
                                                </v-card-text>
                                                <div class="d-flex justify-space-between align-center">
                                                    <span class="text-caption text-grey d-flex align-center">
                                                        <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                                                        {{ haber.date }}
                                                    </span>
                                                    <v-btn variant="text" color="primary" to="/gundem" class="read-more">
                                                        Devamını Oku
                                                        <v-icon size="small" class="ml-1">mdi-arrow-right</v-icon>
                                                    </v-btn>
                                                </div>
                                            </v-card-item>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-carousel-item>
                        </template>
                        
                        <!-- Masaüstü görünümde 3'lü kart gösterir -->
                        <template v-else>
                            <v-carousel-item v-for="i in Math.ceil(filteredNews.length / 3)" :key="i">
                                <v-row>
                                    <v-col v-for="(haber, index) in filteredNews.slice((i - 1) * 3, i * 3)" :key="index"
                                        cols="12" md="4">
                                        <v-card class="h-100 news-card rounded-xl" elevation="3">
                                            <v-img :src="haber.imageUrl" height="220" cover class="news-image">
                                                <div class="image-overlay-gradient"></div>
                                            </v-img>
                                            <v-card-item>
                                                <v-chip color="primary" size="small" class="mb-2 text-caption">{{ haber.category }}</v-chip>
                                                <v-card-title class="text-h6 font-weight-bold">
                                                    {{ haber.title }}
                                                </v-card-title>
                                                <v-card-text class="text-body-2 news-description"
                                                    v-html="haber.description.length > 100 ? haber.description.slice(0, 100) + '...' : haber.description">
                                                </v-card-text>
                                                <div class="d-flex justify-space-between align-center">
                                                    <span class="text-caption text-grey d-flex align-center">
                                                        <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                                                        {{ haber.date }}
                                                    </span>
                                                    <v-btn variant="text" color="primary" to="/gundem" class="read-more">
                                                        Devamını Oku
                                                        <v-icon size="small" class="ml-1">mdi-arrow-right</v-icon>
                                                    </v-btn>
                                                </div>
                                            </v-card-item>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-carousel-item>
                        </template>
                    </v-carousel>
                    <div class="text-center mt-8">
                        <v-btn color="primary" class="rounded-xl elevation-2 px-6" to="/gundem">
                            Tüm Haberleri Gör
                            <v-icon right class="ml-2">mdi-arrow-right</v-icon>
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-container>

        <!-- Yaklaşan Etkinlik - Enhanced with modern design -->
        <v-container fluid class="upcoming-event-section py-16 position-relative" v-if="upcomingEvent">
            <div class="event-pattern-overlay"></div>
            <v-row justify="center">
                <v-col cols="12" md="10">
                    <v-card color="primary" class="pa-8 rounded-xl elevation-10 event-card">
                        <v-row align="center">
                            <v-col cols="12" md="7">
                                <div class="event-badge mb-4">YAKLAŞAN ETKİNLİK</div>
                                <h2 class="text-h4 font-weight-bold text-white mb-4">
                                    {{ upcomingEvent.title }}
                                </h2>
                                <p class="text-body-1 text-white mb-6">
                                    {{ upcomingEvent.description }}
                                </p>
                                <div class="d-flex align-center mb-4 event-info">
                                    <v-icon icon="mdi-calendar" color="white" class="mr-2"></v-icon>
                                    <span class="text-white">{{ formatDate(upcomingEvent.date) }}</span>
                                </div>
                                <div class="d-flex align-center event-info" v-if="upcomingEvent.location">
                                    <v-icon icon="mdi-map-marker" color="white" class="mr-2"></v-icon>
                                    <span class="text-white">{{ upcomingEvent.location }}</span>
                                </div>
                            </v-col>
                            <v-col cols="12" md="5" class="text-center">
                                <div class="event-countdown pa-4 rounded-lg mb-4" v-if="eventCountdown">
                                    <div class="text-center text-subtitle-2 mb-2 text-white">Etkinliğe Kalan Süre</div>
                                    <div class="d-flex justify-space-around">
                                        <div class="countdown-item">
                                            <div class="text-h4 font-weight-bold">{{ eventCountdown.days }}</div>
                                            <div class="text-caption">Gün</div>
                                        </div>
                                        <div class="countdown-item">
                                            <div class="text-h4 font-weight-bold">{{ eventCountdown.hours }}</div>
                                            <div class="text-caption">Saat</div>
                                        </div>
                                        <div class="countdown-item">
                                            <div class="text-h4 font-weight-bold">{{ eventCountdown.minutes }}</div>
                                            <div class="text-caption">Dakika</div>
                                        </div>
                                    </div>
                                </div>
                                <v-btn variant="outlined" color="white" size="x-large" to="/etkinlikler" class="rounded-xl px-6 mt-4 event-button">
                                    <v-icon left class="mr-2">mdi-calendar-check</v-icon>
                                    Tüm Etkinlikler
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <!-- Galeri Önizleme - Enhanced with better grid layout -->
        <v-container class="py-16">
            <v-row justify="center" class="mb-12">
                <v-col cols="12" md="8" class="text-center">
                    <span class="text-overline text-green-darken-2 font-weight-bold d-block mb-2">FOTOĞRAFLAR</span>
                    <h2 class="text-h3 font-weight-bold mb-3">Galeri</h2>
                    <div class="section-divider mx-auto mb-4"></div>
                    <p class="text-body-1">
                        Köyümüzden seçkin fotoğraflar
                    </p>
                </v-col>
            </v-row>

            <!-- Galeri için yatay slider - Enhanced with better cards -->
            <v-row>
                <v-col cols="12">
                    <v-carousel 
                        :key="filteredPhotos.length" 
                        :show-arrows="true" 
                        :height="$vuetify.display.xs || $vuetify.display.sm ? '350' : '350'" 
                        hide-delimiter-background
                        :interval="6000" 
                        cycle 
                        :continuous="false" 
                        delimiter-icon="mdi-circle" 
                        class="gallery-carousel"
                    >
                        <!-- Mobil görünümde her slayt tek kart gösterir -->
                        <template v-if="$vuetify.display.xs || $vuetify.display.sm">
                            <v-carousel-item v-for="(photo, index) in filteredPhotos.slice(0, 12)" :key="'gm-'+index">
                                <v-row justify="center">
                                    <v-col cols="12" class="mobile-card pa-4">
                                        <v-card class="mx-auto gallery-card rounded-xl" elevation="3" height="100%">
                                            <v-img :src="photo.imageUrl" :alt="photo.title" class="align-end gallery-image" height="220"
                                                cover>
                                                <div class="image-overlay-gradient"></div>
                                                <v-card-title class="text-white position-relative">
                                                    {{ photo.title }}
                                                </v-card-title>
                                            </v-img>

                                            <v-card-text>
                                                <div class="text-subtitle-1 mb-2">
                                                    {{ photo.description.length > 25 ? photo.description.slice(0, 25) +
                                                        "..." : photo.description }}
                                                </div>

                                                <v-chip size="small" :color="getCategoryColor(photo.category)" class="mt-2">
                                                    <v-icon size="x-small" class="mr-1">mdi-tag</v-icon>
                                                    {{ getCategoryLabel(photo.category) }}
                                                </v-chip>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-carousel-item>
                        </template>
                        
                        <!-- Masaüstü görünümde 4'lü kart gösterir -->
                        <template v-else>
                            <v-carousel-item v-for="i in Math.ceil(filteredPhotos.length / 4)" :key="i">
                                <v-row>
                                    <v-col v-for="(photo, index) in filteredPhotos.slice((i - 1) * 4, i * 4)" :key="index"
                                        cols="12" sm="6" md="3">
                                        <v-card class="mx-auto gallery-card rounded-xl" elevation="3" height="100%">
                                            <v-img :src="photo.imageUrl" :alt="photo.title" class="align-end gallery-image" height="220"
                                                cover>
                                                <div class="image-overlay-gradient"></div>
                                                <v-card-title class="text-white position-relative">
                                                    {{ photo.title }}
                                                </v-card-title>
                                            </v-img>

                                            <v-card-text>
                                                <div class="text-subtitle-1 mb-2">
                                                    {{ photo.description.length > 25 ? photo.description.slice(0, 25) +
                                                        "..." : photo.description }}
                                                </div>

                                                <v-chip size="small" :color="getCategoryColor(photo.category)" class="mt-2">
                                                    <v-icon size="x-small" class="mr-1">mdi-tag</v-icon>
                                                    {{ getCategoryLabel(photo.category) }}
                                                </v-chip>
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>
                            </v-carousel-item>
                        </template>
                    </v-carousel>
                    <div class="text-center mt-8">
                        <v-btn color="primary" size="x-large" to="/galeri" class="rounded-xl elevation-2 px-6">
                            <v-icon left class="mr-2">mdi-image-multiple</v-icon>
                            Tüm Fotoğrafları Gör
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </v-container>
</template>

<script setup>
import { onMounted } from 'vue'

const photos = computed(() => usePhotoStore().getPhotos)
const newsStore = computed(() => useNewsStore().getNews)
const events = computed(() => useEventStore().getEvents)
const upcomingEvents = computed(() => useEventStore().getUpcomingEvents)

const filteredNews = computed(() => {
    let filtered = newsStore.value
    return filtered.slice(0, 20) // İlk 20 haberi al
})

const filteredPhotos = computed(() => {
    let filtered = photos.value
    return filtered.slice(0, 20) // İlk 20 fotoğrafı al
})

// En yakın etkinliği bul
const upcomingEvent = computed(() => {
    if (!upcomingEvents.value || upcomingEvents.value.length === 0) {
        // Eğer yaklaşan etkinlik yoksa veya yüklenmediyse, events'ten en yakın tarihi olanı göster
        if (!events.value || events.value.length === 0) return null
        
        // Tarih formatını kontrol ederek sıralama yap
        const sortedEvents = [...events.value].sort((a, b) => {
            const dateA = new Date(a.date)
            const dateB = new Date(b.date)
            return dateA - dateB
        })
        
        return sortedEvents[0]
    }
    
    // Yaklaşan etkinliklerde ilk sıradaki etkinliği döndür
    return upcomingEvents.value[0]
})

// Etkinlik için geri sayım hesaplama
const eventCountdown = computed(() => {
    if (!upcomingEvent.value || !upcomingEvent.value.date) return null
    
    const eventDate = new Date(upcomingEvent.value.date)
    const now = new Date()
    
    // Eğer etkinlik tarihi geçmişse countdown gösterme
    if (eventDate < now) return null
    
    const diff = eventDate - now
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return { days, hours, minutes }
})

// Tarih formatı için yardımcı fonksiyon
const formatDate = (dateString) => {
    if (!dateString) return ''
    
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString // Eğer geçerli bir tarih değilse orijinali döndür
    
    return date.toLocaleDateString('tr-TR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    })
}

const getCategoryColor = (category) => {
    const colors = {
        dogal: 'green',
        kultur: 'blue',
        etkinlik: 'purple',
        tarihi: 'orange'
    }
    return colors[category] || 'grey'
}

const getCategoryLabel = (category) => {
    const labels = {
        dogal: 'Doğal',
        kultur: 'Kültür',
        etkinlik: 'Etkinlik',
        tarihi: 'Tarihi'
    }
    return labels[category] || category
}

onMounted(async () => {
    try {
        await usePhotoStore().fetchPhotos()
        await useNewsStore().fetchNews()
        await useEventStore().fetchEvents()
        await useEventStore().fetchUpcomingEvents()
    } catch (error) {
        console.error('Veriler yüklenirken hata:', error)
    }
})

const heroImages = [
    'https://cdn.pixabay.com/photo/2021/06/19/17/51/italy-6349105_1280.jpg',
    'https://cdn.pixabay.com/photo/2016/11/19/15/03/buildings-1839726_1280.jpg',
    'https://cdn.pixabay.com/photo/2017/02/22/20/02/village-2090495_1280.jpg',
    'https://cdn.pixabay.com/photo/2014/03/03/16/12/village-279013_1280.jpg'
]
</script>

<style scoped>
.hero-section {
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    position: relative;
    min-height: 90vh;
    display: flex;
    align-items: center;
    overflow: hidden;
}

.hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 40%, rgba(9, 194, 86, 0.05) 0%, rgba(11, 114, 49, 0.1) 100%);
    z-index: 1;
}

.position-relative {
    position: relative;
    z-index: 2;
}

.hero-content {
    z-index: 2;
}

.hero-carousel {
    border-radius: 16px !important;
    overflow: hidden;
    width: 100%;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.hero-image {
    animation: float 6s ease-in-out infinite;
    border-radius: 16px !important;
    overflow: hidden;
    position: relative;
}

.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4));
    z-index: 1;
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

.text-gradient {
    background: linear-gradient(90deg, #09c256, #0b7231);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: inline-block;
}

.max-width-500 {
    max-width: 500px;
}

.text-animation {
    animation: fadeInUp 1s ease-in-out;
}

.animate-paragraph {
    animation: fadeInUp 1s ease-in-out 0.3s;
    animation-fill-mode: both;
}

.fade-in {
    animation: fadeIn 1.5s ease-in-out;
}

.pulse-button {
    animation: pulse 2s infinite;
}

.hover-float:hover {
    transform: translateY(-5px);
    transition: transform 0.3s ease;
}

.section-divider {
    height: 4px;
    width: 70px;
    background: linear-gradient(90deg, #09c256, #0b7231);
    border-radius: 2px;
}

.features-bar {
    background-color: white;
    box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.05), 0 10px 30px rgba(0, 0, 0, 0.05);
    position: relative;
    z-index: 5;
}

.feature-item {
    border-right: 1px solid rgba(0, 0, 0, 0.05);
}

.feature-item:last-child {
    border-right: none;
}

.news-carousel, .gallery-carousel {
    overflow: visible !important;
}

.news-card {
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    overflow: hidden;
    height: 100%;
}

.news-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1) !important;
}

.news-image {
    position: relative;
}

.news-description {
    min-height: 80px;
}

.read-more {
    transition: transform 0.3s ease;
}

.read-more:hover {
    transform: translateX(5px);
}

.upcoming-event-section {
    background-color: #f0fdf4;
    position: relative;
    overflow: hidden;
}

.event-pattern-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z' fill='%2309c256' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.5;
}

.event-card {
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #0b7231, #09c256);
    border: none;
}

.event-badge {
    display: inline-block;
    background-color: rgba(255, 255, 255, 0.2);
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
    color: white;
    letter-spacing: 1px;
}

.event-info {
    background-color: rgba(255, 255, 255, 0.1);
    padding: 8px 12px;
    border-radius: 6px;
    margin-bottom: 10px;
}

.event-countdown {
    background-color: rgba(0, 0, 0, 0.2);
}

.countdown-item {
    background-color: rgba(255, 255, 255, 0.1);
    padding: 10px;
    border-radius: 8px;
    min-width: 70px;
}

.event-button {
    transition: transform 0.3s ease, background-color 0.3s ease;
}

.event-button:hover {
    transform: translateY(-5px);
    background-color: rgba(255, 255, 255, 0.1);
}

.gallery-card {
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    overflow: hidden;
}

.gallery-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1) !important;
}

.gallery-image {
    transition: transform 0.5s ease-in-out;
    position: relative;
}

.gallery-card:hover .gallery-image {
    transform: scale(1.05);
}

.rounded-xl {
    border-radius: 16px !important;
}

.v-carousel {
    border-radius: 16px;
    overflow: hidden;
}

.v-card {
    transition: transform 0.2s, box-shadow 0.2s;
}

.v-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1) !important;
}

.bg-opacity-50 {
    background-color: rgba(0, 0, 0, 0.5) !important;
}

@keyframes float {
    0% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-15px);
    }

    100% {
        transform: translateY(0px);
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

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
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
    .feature-item {
        border-right: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
    
    .feature-item:last-child {
        border-bottom: none;
    }
    
    /* Hero kısmı için responsive ayarlar */
    .hero-carousel {
        margin-top: 30px;
        height: auto !important;
        max-height: 380px;
    }
    
    /* Haberler carousel için responsive ayarlar */
    .news-carousel {
        height: auto !important;
        padding-bottom: 50px;
    }
    
    .news-description {
        min-height: 60px;
    }
    
    /* Galeri carousel için responsive ayarlar */
    .gallery-carousel {
        height: auto !important;
        padding-bottom: 50px;
    }
}

@media (max-width: 768px) {
    .hero-section {
        min-height: auto;
        padding: 60px 0;
    }
    
    .hero-content {
        padding-bottom: 30px;
    }
    
    .event-card {
        padding: 20px !important;
    }
    
    .event-countdown {
        margin: 0 auto;
        max-width: 90%;
    }
    
    .countdown-item {
        min-width: 60px;
        padding: 8px;
    }
    
    .countdown-item .text-h4 {
        font-size: 1.5rem !important;
    }
    
    .news-description {
        min-height: 40px;
    }
    
    .d-flex.flex-wrap.gap-3 {
        justify-content: center;
    }
}

@media (max-width: 600px) {
    .hero-carousel {
        max-height: 300px;
    }
    
    .text-h2 {
        font-size: 2rem !important;
    }
    
    .event-countdown .d-flex {
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
    }
    
    .countdown-item {
        flex: 0 0 calc(33% - 10px);
    }
    
    .text-center {
        padding: 0 15px;
    }
}

@media (max-width: 480px) {
    .news-card, .gallery-card {
        margin-bottom: 20px;
    }
    
    .v-carousel__controls {
        margin-bottom: -20px;
    }
    
    .hero-content .d-flex {
        flex-direction: column;
        align-items: center;
    }
    
    .hero-content .v-btn {
        margin-right: 0 !important;
        margin-bottom: 10px;
        width: 100%;
    }
    
    .countdown-item {
        min-width: 55px;
        padding: 6px;
    }
    
    .section-divider {
        margin: 0 auto;
    }
}
</style>