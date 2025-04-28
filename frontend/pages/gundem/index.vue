<template>
    <v-container class="py-16">
        <!-- Başlık -->
        <v-row justify="center" class="mb-12">
            <v-col cols="12" md="8" class="text-center">
                <span class="text-overline text-green-darken-2 font-weight-bold d-block mb-2">HABERLER & DUYURULAR</span>
                <h1 class="text-h3 font-weight-bold mb-3">Gündem</h1>
                <div class="section-divider mx-auto mb-4"></div>
                <p class="text-body-1">
                    En güncel haberler ve gelişmeler
                </p>
            </v-col>
        </v-row>

        <!-- Öne Çıkan Haber -->
        <v-row class="mb-16" v-if="featuredNews">
            <v-col cols="12">
                <v-card elevation="3" class="featured-news-card rounded-xl overflow-hidden">
                    <v-row>
                        <v-col cols="12" md="6" class="pa-0">
                            <div class="featured-image-container">
                                <v-img :src="featuredNews.imageUrl" height="450" cover class="featured-image"></v-img>
                                <div class="image-overlay-gradient"></div>
                            </div>
                        </v-col>
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <div class="pa-8 fade-in">
                                <v-chip color="primary" class="mb-4 featured-chip elevation-1">{{ getCategoryName(featuredNews.category) }}</v-chip>
                                <h2 class="text-h4 font-weight-bold mb-4">
                                    {{ featuredNews.title }}
                                </h2>
                                <p class="text-body-1 mb-6 featured-excerpt" v-html="featuredNews.description.slice(0, 150) + '...'">
                                </p>
                                <div class="d-flex align-center justify-space-between">
                                    <span class="text-caption d-flex align-center">
                                        <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                                        {{ formatDate(featuredNews.createdAt) }}
                                    </span>
                                    <v-btn color="primary" class="rounded-xl elevation-2 px-4 read-more-btn" size="large">
                                        <NuxtLink class="gundem-link text-white" :to="`/gundem/${featuredNews._id}`">
                                            Devamını Oku
                                            <v-icon end icon="mdi-arrow-right" class="ml-1"></v-icon>
                                        </NuxtLink>
                                    </v-btn>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <!-- Filtreler -->
        <v-row class="mb-8">
            <v-col cols="12">
                <v-sheet class="filter-bar py-3 px-6 rounded-pill d-flex align-center flex-wrap">
                    <span class="mr-4 font-weight-medium">Filtrele:</span>
                    <v-chip-group v-model="selectedCategoryIndex" selected-class="primary-selected" mandatory>
                        <v-chip variant="outlined" class="rounded-pill filter-chip" value="all">Tümü</v-chip>
                        <v-chip v-for="(category, index) in categories" :key="index" 
                            variant="outlined" class="rounded-pill filter-chip" :value="category">
                            {{ category }}
                        </v-chip>
                    </v-chip-group>
                </v-sheet>
            </v-col>
        </v-row>

        <!-- Haber Kartları -->
        <v-row v-if="filteredNews.length > 0">
            <v-col v-for="(haber, index) in paginatedNews" :key="haber._id" cols="12" sm="6" md="4" 
                class="fade-in-item" :style="{ 'animation-delay': `${index * 0.1}s` }">
                <v-card height="100%" elevation="3" class="news-card rounded-xl overflow-hidden">
                    <div class="image-container">
                        <v-img :src="haber.imageUrl" height="220" cover class="news-image">
                            <template v-slot:placeholder>
                                <v-row class="fill-height ma-0" align="center" justify="center">
                                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                                </v-row>
                            </template>
                        </v-img>
                        <div class="image-overlay-gradient"></div>
                    </div>
                    <v-card-item class="pa-6">
                        <v-chip color="primary" size="small" class="mb-3 news-chip">{{ getCategoryName(haber.category) }}</v-chip>
                        <v-card-title class="text-h5 font-weight-bold mb-3 news-title">
                            {{ haber.title }}
                        </v-card-title>
                        <v-card-text class="pa-0">
                            <p class="text-body-2 mb-4 news-excerpt"
                                v-html="haber.description.length > 100 ? haber.description.slice(0, 100) + '...' : haber.description">
                            </p>
                            <div class="d-flex align-center justify-space-between mt-4">
                                <span class="text-caption d-flex align-center">
                                    <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                                    {{ formatDate(haber.createdAt) }}
                                </span>
                                <v-btn variant="text" color="primary" density="comfortable" class="read-more">
                                    <NuxtLink class="gundem-link text-green" :to="`/gundem/${haber._id}`"> 
                                        Devamını Oku
                                        <v-icon end icon="mdi-arrow-right"></v-icon>
                                    </NuxtLink>
                                </v-btn>
                            </div>
                        </v-card-text>
                    </v-card-item>
                </v-card>
            </v-col>
        </v-row>
        
        <!-- Sonuç bulunamadı mesajı -->
        <v-row v-else class="mt-8">
            <v-col cols="12" class="text-center">
                <v-alert type="info" class="mx-auto" style="max-width: 500px;" variant="tonal" closable>
                    Bu kategoride henüz haber bulunmamaktadır.
                    <v-btn color="primary" variant="text" class="mt-2" @click="selectedCategoryIndex = 'all'">
                        Tüm haberleri göster
                    </v-btn>
                </v-alert>
            </v-col>
        </v-row>

        <!-- Sayfalama -->
        <v-row class="mt-16" v-if="totalPages > 1">
            <v-col cols="12" class="d-flex justify-center">
                <v-pagination 
                    v-model="currentPage" 
                    :length="totalPages" 
                    :total-visible="7" 
                    rounded="circle"
                    active-color="primary"
                    class="pagination-container"
                ></v-pagination>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { useNewsStore } from '@/stores/news'

const currentPage = ref(1)
const newsStore = useNewsStore()
const itemsPerPage = 9 // Sayfa başına gösterilecek haber sayısı
const categories = ["Genel", "Spor", "Teknoloji", "Eğitim", "Kültür-Sanat", "Bilim"]
const selectedCategoryIndex = ref('all')

const news = computed(() => newsStore.getNews)

const featuredNews = computed(() => {
    if (news.value && news.value.length > 0) {
        const featured = news.value.find(item => item.isFeatured)
        return featured || news.value[0]
    }
    return null
})

// Haberleri kategori seçimine göre filtrele
const filteredNews = computed(() => {
    if (!news.value || news.value.length === 0) return []
    
    // Öne çıkan haberi hariç tut
    const regularNews = news.value.filter(item => item._id !== featuredNews.value?._id)
    
    if (selectedCategoryIndex.value === 'all') {
        return regularNews
    }
    
    return regularNews.filter(item => {
        const normalizedCategory = (item.category || '').toLowerCase()
        const selectedCategory = selectedCategoryIndex.value.toLowerCase()
        return normalizedCategory === selectedCategory
    })
})

// Toplam sayfa sayısını hesapla
const totalPages = computed(() => {
    return Math.ceil(filteredNews.value.length / itemsPerPage)
})

// Sayfalandırılmış haberleri al
const paginatedNews = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredNews.value.slice(startIndex, endIndex)
})

// Kategori adını biçimlendir
const getCategoryName = (category) => {
    if (!category) return 'Genel'
    
    // Eğer kategori küçük harfle geldiyse, uygun formata getir
    const normalizedCategory = category.toLowerCase()
    const match = categories.find(cat => cat.toLowerCase() === normalizedCategory)
    return match || category
}

// Tarih formatını düzenle
const formatDate = (timestamp) => {
    if (!timestamp) return ''
    return new Date(timestamp).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

// Sayfa değiştiğinde sayfa başına dön
watch(selectedCategoryIndex, () => {
    currentPage.value = 1
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
})

onMounted(async () => {
    await newsStore.fetchNews()
})
</script>

<style scoped>
.section-divider {
    height: 4px;
    width: 70px;
    background: linear-gradient(90deg, #09c256, #0b7231);
    border-radius: 2px;
}

.featured-news-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
}

.featured-news-card:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1) !important;
}

.featured-image-container {
    position: relative;
    height: 100%;
    overflow: hidden;
}

.featured-image {
    transition: transform 0.5s ease;
}

.featured-news-card:hover .featured-image {
    transform: scale(1.05);
}

.featured-chip {
    font-weight: 500;
}

.featured-excerpt {
    line-height: 1.6;
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

.filter-bar {
    background-color: rgba(9, 194, 86, 0.05);
    border: 1px solid rgba(9, 194, 86, 0.1);
}

.filter-chip {
    transition: all 0.3s ease;
}

.filter-chip:hover {
    background-color: rgba(9, 194, 86, 0.1);
}

.primary-selected {
    background-color: #09c256 !important;
    color: white !important;
}

.news-card {
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    overflow: hidden;
}

.news-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1) !important;
}

.image-container {
    position: relative;
    overflow: hidden;
}

.news-image {
    transition: transform 0.5s ease;
}

.news-card:hover .news-image {
    transform: scale(1.05);
}

.news-chip {
    letter-spacing: 0.5px;
    font-size: 0.7rem;
}

.news-title {
    line-height: 1.3;
}

.news-excerpt {
    min-height: 80px;
    line-height: 1.6;
}

.read-more {
    transition: transform 0.3s ease;
}

.read-more:hover {
    transform: translateX(5px);
}

.read-more-btn {
    transition: transform 0.3s ease;
}

.read-more-btn:hover {
    transform: translateY(-3px);
}

.gundem-link {
    text-decoration: none;
}

.pagination-container {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    border-radius: 30px;
    padding: 8px 16px;
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
        transform: translateX(20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
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

@media (max-width: 960px) {
    .featured-excerpt {
        min-height: auto;
    }
}
</style>