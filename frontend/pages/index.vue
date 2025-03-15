<template>
    <v-container fluid class="pa-0">
        <!-- Hero Section -->
        <v-row no-gutters>
            <v-col cols="12">
                <div class="hero-section">
                    <v-container>
                        <v-row align="center" style="min-height: 80vh;">
                            <v-col cols="12" md="6">
                                <h1 class="text-h2 font-weight-bold mb-4">
                                    Çelikhan'a <br>
                                    Hoş Geldiniz
                                </h1>
                                <p class="text-body-1 mb-6">
                                    Doğal güzellikleri, zengin kültürü ve misafirperver insanlarıyla
                                    Çelikhan , sizleri bekliyor.
                                </p>
                                <v-btn color="primary" size="x-large" class="mr-4" to="/galeri">
                                    Galeriyi Keşfet
                                </v-btn>
                                <v-btn variant="outlined" size="x-large" to="/iletisim">
                                    İletişime Geç
                                </v-btn>
                            </v-col>
                            <v-col cols="12" md="6" class="d-flex justify-center">
                                <v-carousel cycle height="400" hide-delimiter-background show-arrows="hover"
                                    interval="6000">
                                    <v-carousel-item v-for="(image, i) in heroImages" :key="i" :src="image" cover
                                        class="hero-image">
                                    </v-carousel-item>
                                </v-carousel>
                            </v-col>
                        </v-row>
                    </v-container>
                </div>
            </v-col>
        </v-row>

        <!-- Son Haberler -->
        <v-container class="py-16">
            <v-row justify="center" class="mb-8">
                <v-col cols="12" md="8" class="text-center">
                    <h2 class="text-h3 font-weight-bold mb-3">Son Haberler</h2>
                    <p class="text-body-1">
                        Köyümüzden en güncel haberler ve gelişmeler
                    </p>
                </v-col>
            </v-row>

            <!-- Haberler için yatay slider -->
            <v-row>
                <v-col cols="12">
                    <v-carousel :key="filteredNews.length" :show-arrows="true" height="400" hide-delimiter-background
                        :interval="6000" cycle :continuous="false" delimiter-icon="mdi-circle" hide-delimiters>
                        <v-carousel-item v-for="i in Math.ceil(filteredNews.length / 3)" :key="i">
                            <v-row>
                                <v-col v-for="(haber, index) in filteredNews.slice((i - 1) * 3, i * 3)" :key="index"
                                    cols="12" md="4">
                                    <v-card class="h-100" elevation="2">
                                        <v-img :src="haber.imageUrl" height="200" cover></v-img>
                                        <v-card-item>
                                            <v-chip color="primary" size="small" class="mb-2">{{ haber.category
                                                }}</v-chip>
                                            <v-card-title class="text-h6 font-weight-bold">
                                                {{ haber.title }}
                                            </v-card-title>
                                            <v-card-text class="text-body-2">
                                                {{ haber.description }}
                                            </v-card-text>
                                            <div class="d-flex justify-space-between align-center">
                                                <span class="text-caption text-grey">{{ haber.date }}</span>
                                                <v-btn variant="text" color="primary" to="/gundem">
                                                    Devamını Oku
                                                </v-btn>
                                            </div>
                                        </v-card-item>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-carousel-item>
                    </v-carousel>
                    <div class="text-center mt-4">
                        <v-btn color="primary" to="/gundem">
                            Tüm Haberleri Gör
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-container>

        <!-- Yaklaşan Etkinlik -->
        <v-container fluid class="upcoming-event-section py-16">
            <v-row justify="center">
                <v-col cols="12" md="10">
                    <v-card color="primary" class="pa-8">
                        <v-row align="center">
                            <v-col cols="12" md="8">
                                <h2 class="text-h4 font-weight-bold text-white mb-4">
                                    {{ upcomingEvent.title }}
                                </h2>
                                <p class="text-body-1 text-white mb-6">
                                    {{ upcomingEvent.description }}
                                </p>
                                <div class="d-flex align-center mb-4">
                                    <v-icon icon="mdi-calendar" color="white" class="mr-2"></v-icon>
                                    <span class="text-white">{{ upcomingEvent.date }}</span>
                                </div>
                                <div class="d-flex align-center">
                                    <v-icon icon="mdi-map-marker" color="white" class="mr-2"></v-icon>
                                    <span class="text-white">{{ upcomingEvent.location }}</span>
                                </div>
                            </v-col>
                            <v-col cols="12" md="4" class="text-center">
                                <v-btn variant="outlined" color="white" size="x-large" to="/etkinlikler">
                                    Tüm Etkinlikler
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <!-- Galeri Önizleme -->
        <v-container class="py-16">
            <v-row justify="center" class="mb-8">
                <v-col cols="12" md="8" class="text-center">
                    <h2 class="text-h3 font-weight-bold mb-3">Galeri</h2>
                    <p class="text-body-1">
                        Köyümüzden seçkin fotoğraflar
                    </p>
                </v-col>
            </v-row>

            <!-- Galeri için yatay slider -->
            <v-row>
                <v-col cols="12">
                    <v-carousel :key="filteredPhotos.length" :show-arrows="true" height="310" hide-delimiter-background
                        :interval="6000" cycle :continuous="false" delimiter-icon="mdi-circle" hide-delimiters>
                        <v-carousel-item v-for="i in Math.ceil(filteredPhotos.length / 4)" :key="i">
                            <v-row>
                                <v-col v-for="(photo, index) in filteredPhotos.slice((i - 1) * 4, i * 4)" :key="index"
                                    cols="12" sm="6" md="3">
                                    <v-card class="mx-auto" elevation="2" height="100%">
                                        <v-img :src="photo.imageUrl" :alt="photo.title" class="align-end" height="200"
                                            cover>
                                            <v-card-title class="text-white bg-black bg-opacity-50">
                                                {{ photo.title }}
                                            </v-card-title>
                                        </v-img>

                                        <v-card-text>
                                            <div class="text-subtitle-1 mb-2">
                                                {{ photo.description.length > 25 ? photo.description.slice(0, 25) +
                                                    "..." : photo.description }}
                                            </div>

                                            <v-chip size="small" :color="getCategoryColor(photo.category)" class="mt-2">
                                                {{ getCategoryLabel(photo.category) }}
                                            </v-chip>
                                        </v-card-text>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </v-carousel-item>
                    </v-carousel>
                    <div class="text-center mt-4">
                        <v-btn color="primary" size="x-large" to="/galeri">
                            Tüm Fotoğrafları Gör
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </v-container>
</template>

<script setup>
const photos = computed(() => usePhotoStore().getPhotos)
const newsStore = computed(() => useNewsStore().getNews)
const filteredNews = computed(() => {
    let filtered = newsStore.value
    return filtered.slice(0, 20) // İlk 20 haberi al
})

const filteredPhotos = computed(() => {
    let filtered = photos.value
    return filtered.slice(0, 20) // İlk 20 fotoğrafı al
})

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

onBeforeMount(async () => {
    await usePhotoStore().fetchPhotos()
    await useNewsStore().fetchNews()
})

const upcomingEvent = {
    title: 'Geleneksel Köy Festivali',
    description: 'Her yıl düzenlenen geleneksel köy festivalimizde yerel lezzetler, müzik, dans ve eğlence sizleri bekliyor.',
    date: '15 Haziran 2024',
    location: 'Köy Meydanı'
}

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
    min-height: 80vh;
    display: flex;
    align-items: center;
}

.hero-image {
    animation: float 6s ease-in-out infinite;
    border-radius: 12px !important;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.v-carousel {
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
}

.upcoming-event-section {
    background-color: #f0fdf4;
}

.gallery-card {
    transition: transform 0.3s ease-in-out;
    cursor: pointer;
}

.gallery-card:hover {
    transform: translateY(-5px);
}

.gallery-image {
    transition: opacity 0.3s ease-in-out;
}

.gallery-card:hover .gallery-image {
    opacity: 0.9;
}

.v-card {
    transition: transform 0.2s;
}

.v-card:hover {
    transform: translateY(-5px);
}

.bg-opacity-50 {
    background-color: rgba(0, 0, 0, 0.5) !important;
}

@keyframes float {
    0% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-20px);
    }

    100% {
        transform: translateY(0px);
    }
}
</style>