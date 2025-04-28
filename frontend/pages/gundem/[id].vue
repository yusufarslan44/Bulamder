<template>
    <v-container class="py-16">
        <!-- Breadcrumb Navigation -->
        <v-row class="mb-8">
            <v-col cols="12" md="10" class="mx-auto">
                <div class="d-flex align-center">
                    <v-btn variant="text" color="primary" density="compact" to="/gundem" class="mr-2 px-1">
                        <v-icon size="small" class="mr-1">mdi-home</v-icon>
                        Gündem
                    </v-btn>
                    <v-icon size="small" class="mx-1">mdi-chevron-right</v-icon>
                    <span class="text-caption text-grey-darken-1 text-truncate">{{ haber.title }}</span>
                </div>
            </v-col>
        </v-row>

        <!-- Başlık ve Kategori -->
        <v-row justify="center" class="mb-8">
            <v-col cols="12" md="10" class="fade-in">
                <v-chip color="primary" class="mb-4 elevation-1">{{ haber.category }}</v-chip>
                <h1 class="text-h3 font-weight-bold mb-6 title-animation">{{ haber.title }}</h1>
                <div class="d-flex flex-wrap align-center mb-8">
                    <div class="d-flex align-center mr-auto">
                        <v-avatar size="48" class="mr-3 elevation-2">
                            <v-img :src="haber.authorImage || '/api/placeholder/50/50'" alt="Yazar"></v-img>
                        </v-avatar>
                        <div>
                            <div class="font-weight-medium">{{ haber.author }}</div>
                            <div class="text-caption text-grey d-flex align-center">
                                <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                                {{ haber.date }}
                            </div>
                        </div>
                    </div>
                    <div class="d-flex mt-2 mt-sm-0">
                        <v-btn variant="outlined" color="primary" class="mr-2 rounded-pill share-btn" density="comfortable" prepend-icon="mdi-share-variant">
                            Paylaş
                        </v-btn>
                        <v-btn variant="outlined" color="error" class="rounded-pill save-btn" density="comfortable" prepend-icon="mdi-bookmark">
                            Kaydet
                        </v-btn>
                    </div>
                </div>
            </v-col>
        </v-row>

        <!-- Ana Görsel -->
        <v-row justify="center" class="mb-12">
            <v-col cols="12" md="10">
                <div class="main-image-container">
                    <v-img :src="haber.imageUrl" height="550" cover class="rounded-xl main-image"></v-img>
                    <div class="image-gradient-overlay rounded-xl"></div>
                </div>
                <p class="text-caption mt-2 text-grey text-center">{{ haber.imageCaption || 'Haber görseli' }}</p>
            </v-col>
        </v-row>

        <!-- Haber İçeriği -->
        <v-row justify="center" class="mb-16">
            <v-col cols="12" md="8" class="content-animation">
                <div class="text-body-1 haber-icerik" v-html="haber.description"></div>

                <!-- Etiketler -->
                <v-sheet class="mt-12 pa-5 rounded-xl bg-grey-lighten-4 tag-container">
                    <div class="d-flex align-center mb-3">
                        <v-icon color="primary" class="mr-2">mdi-tag-multiple</v-icon>
                        <span class="font-weight-medium">Etiketler</span>
                    </div>
                    <div class="d-flex flex-wrap">
                        <v-chip v-for="(etiket, i) in haber.tags" :key="i" class="ma-1 tag-chip" variant="outlined"
                            color="primary" size="small">
                            {{ etiket }}
                        </v-chip>
                    </div>
                </v-sheet>

                <!-- Sosyal Paylaşım -->
                <v-sheet class="mt-6 pa-5 rounded-xl bg-primary-lighten-5 text-center">
                    <p class="text-body-2 mb-3">Bu haberi beğendiyseniz, arkadaşlarınızla paylaşın!</p>
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
            </v-col>
        </v-row>

        <!-- İlgili Haberler -->
        <v-container class="py-8 related-news-section">
            <v-row justify="center" class="mb-8">
                <v-col cols="12" md="10" class="text-center">
                    <h2 class="text-h4 font-weight-bold mb-3">Benzer Haberler</h2>
                    <div class="section-divider mx-auto mb-4"></div>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-col cols="12" md="10">
                    <v-row>
                        <v-col v-for="(benzerHaber, index) in benzerHaberler" :key="index" cols="12" sm="6" md="4">
                            <v-card height="100%" elevation="3" class="news-card rounded-xl overflow-hidden">
                                <div class="image-container">
                                    <v-img :src="benzerHaber.imageUrl" height="200" cover class="news-image"></v-img>
                                    <div class="image-overlay-gradient"></div>
                                </div>
                                <v-card-item class="pa-5">
                                    <v-chip color="primary" size="small" class="mb-2 news-chip">{{ benzerHaber.category }}</v-chip>
                                    <v-card-title class="text-h6 font-weight-bold mb-2 news-title">
                                        {{ benzerHaber.title }}
                                    </v-card-title>
                                    <v-card-text class="pa-0">
                                        <p class="text-body-2 mb-4 news-excerpt"
                                            v-html="benzerHaber.description.length > 100 ? benzerHaber.description.slice(0, 100) + '...' : benzerHaber.description">
                                        </p>
                                        <div class="d-flex align-center justify-space-between">
                                            <span class="text-caption d-flex align-center">
                                                <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                                                {{ benzerHaber.date }}
                                            </span>
                                            <v-btn variant="text" color="primary" density="comfortable" class="read-more">
                                                <NuxtLink class="gundem-link text-green" :to="`/gundem/${benzerHaber._id}`">
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
                </v-col>
            </v-row>
        </v-container>

        <!-- Geri Dön Butonu -->
        <v-row justify="center" class="mt-12">
            <v-col cols="12" class="text-center">
                <v-btn color="primary" prepend-icon="mdi-arrow-left" to="/gundem" class="rounded-xl elevation-2 px-6 back-button">
                    Gündem Sayfasına Dön
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>


const route = useRoute()
const newsStore = useNewsStore()
const haberId = route.params.id

// Haber verisi
const haber = ref({})
const benzerHaberler = ref([])
const yorumlar = ref([])
const yeniYorum = ref('')

// Haberin detaylarını getir
const getHaberDetay = async () => {
    try {
        haber.value = await newsStore.fetchNewsById(haberId)
        console.log("haber", haber.value);
        benzerHaberler.value = await newsStore.fetchRelatedNews(haberId)
        // yorumlar.value = await newsStore.fetchComments(haberId)
    } catch (error) {
        console.error('Haber detayları alınamadı:', error)
    }
}

onMounted(async () => {
    await getHaberDetay()
})
</script>

<style scoped>
.section-divider {
    height: 4px;
    width: 70px;
    background: linear-gradient(90deg, #09c256, #0b7231);
    border-radius: 2px;
    margin: 0 auto;
}

.main-image-container {
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.main-image {
    transition: transform 0.8s ease;
}

.main-image-container:hover .main-image {
    transform: scale(1.02);
}

.image-gradient-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4));
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

.title-animation {
    animation: fadeInUp 0.8s ease-in-out;
}

.fade-in {
    animation: fadeIn 0.8s ease-in-out;
}

.content-animation {
    animation: fadeInUp 1s ease-in-out 0.3s;
    animation-fill-mode: both;
}

.haber-icerik {
    line-height: 1.8;
    font-size: 1.1rem;
}

.haber-icerik p {
    margin-bottom: 1.8rem;
}

.haber-icerik h3 {
    margin: 2.5rem 0 1.2rem;
    font-weight: 600;
    color: #333;
}

.haber-icerik img {
    max-width: 100%;
    border-radius: 12px;
    margin: 2rem 0;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.haber-icerik blockquote {
    padding: 1.5rem;
    border-left: 4px solid #09c256;
    background-color: rgba(9, 194, 86, 0.05);
    margin: 2rem 0;
    border-radius: 0 8px 8px 0;
    font-style: italic;
}

.tag-container {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.tag-container:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05) !important;
}

.tag-chip {
    transition: all 0.3s ease;
}

.tag-chip:hover {
    transform: scale(1.05);
}

.share-btn, .save-btn {
    transition: all 0.3s ease;
}

.share-btn:hover, .save-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.related-news-section {
    background-color: rgba(9, 194, 86, 0.02);
    border-radius: 16px;
    margin-top: 2rem;
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
    min-height: 50px;
    line-height: 1.6;
}

.read-more {
    transition: transform 0.3s ease;
}

.read-more:hover {
    transform: translateX(5px);
}

.back-button {
    transition: all 0.3s ease;
}

.back-button:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1) !important;
}

.gundem-link {
    text-decoration: none;
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

@media (max-width: 960px) {
    .haber-icerik {
        font-size: 1rem;
    }
    
    .haber-icerik h3 {
        margin: 2rem 0 1rem;
    }
}
</style>