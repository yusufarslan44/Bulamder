<template>
    <v-container class="py-16">
        <!-- Başlık -->
        <v-row justify="center" class="mb-8">
            <v-col cols="12" md="8" class="text-center">
                <h1 class="text-h3 font-weight-bold mb-4">Gündem</h1>
                <p class="text-body-1">
                    En güncel haberler ve gelişmeler
                </p>
            </v-col>
        </v-row>

        <!-- Öne Çıkan Haber -->
        <v-row class="mb-16" v-if="featuredNews">
            <v-col cols="12">
                <v-card elevation="2">
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-img :src="featuredNews.imageUrl" height="400" cover></v-img>
                        </v-col>
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <div class="pa-6">
                                <v-chip color="primary" class="mb-4">{{ featuredNews.category }}</v-chip>
                                <h2 class="text-h4 font-weight-bold mb-4">
                                    {{ featuredNews.title }}
                                </h2>
                                <p class="text-body-1 mb-6" v-html="featuredNews.description.slice(0, 100)">

                                </p>
                                <div class="d-flex align-center justify-space-between">
                                    <span class="text-caption">{{ featuredNews.date }}</span>
                                    <v-btn color="primary">
                                        <NuxtLink class="gundem-link text-white" :to="`/gundem/${featuredNews._id}`">
                                            Devamını
                                            Oku </NuxtLink>
                                    </v-btn>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <!-- Haber Kartları -->
        <v-row>
            <v-col v-for="(haber, index) in displayedNews" :key="index" cols="12" md="4">
                <v-card height="100%" elevation="2">
                    <v-img :src="haber.imageUrl" height="200" cover></v-img>
                    <v-card-item>
                        <v-chip color="primary" size="small" class="mb-2">{{ haber.category }}</v-chip>
                        <v-card-title class="text-h5 font-weight-bold mb-2">
                            {{ haber.title }}
                        </v-card-title>
                        <v-card-text>
                            <p class="text-body-2 mb-4"
                                v-html="haber.description.length > 100 ? haber.description.slice(0, 100) + '...' : haber.description">
                            </p>
                            <div class="d-flex align-center justify-space-between">
                                <span class="text-caption">{{ haber.date }}</span>
                                <v-btn variant="text" color="primary" density="comfortable">
                                    <NuxtLink class="gundem-link text-green" :to="`/gundem/${haber._id}`"> Devamını
                                        Oku </NuxtLink>
                                    <v-icon end icon="mdi-arrow-right"></v-icon>
                                </v-btn>
                            </div>
                        </v-card-text>
                    </v-card-item>
                </v-card>
            </v-col>
        </v-row>

        <!-- Sayfalama -->
        <v-row class="mt-16">
            <v-col cols="12" class="d-flex justify-center">
                <v-pagination v-model="currentPage" :length="5" :total-visible="7" rounded="circle"></v-pagination>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>

const currentPage = ref(1)
const newsStore = useNewsStore()

const news = computed(() => newsStore.getNews)


const featuredNews = computed(() => {
    if (news.value && news.value.length > 0) {

        return news.value[0]
    }
    return null
})

// Get all news except the featured one for display in cards
const displayedNews = computed(() => {
    if (news.value && news.value.length > 0) {
        // Return all news items except the first one (which is featured)
        return news.value.slice(1)
    }
    return []
})

onMounted(async () => {
    await newsStore.fetchNews()
})
</script>

<style scoped>
.v-card {
    transition: transform 0.3s ease-in-out;
}

.v-card:hover {
    transform: translateY(-5px);
}

.gundem-link {
    text-decoration: none;
}
</style>