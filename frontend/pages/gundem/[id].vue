<template>
    <v-container class="py-16">
        <!-- Başlık ve Kategori -->
        <v-row justify="center" class="mb-8">
            <v-col cols="12" md="10">
                <v-chip color="primary" class="mb-4">{{ haber.category }}</v-chip>
                <h1 class="text-h3 font-weight-bold mb-4">{{ haber.title }}</h1>
                <div class="d-flex align-center mb-6">
                    <v-avatar size="40" class="mr-3">
                        <v-img :src="haber.authorImage || '/api/placeholder/50/50'" alt="Yazar"></v-img>
                    </v-avatar>
                    <div>
                        <div class="font-weight-medium">{{ haber.author }}</div>
                        <div class="text-caption text-grey">{{ haber.date }}</div>
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn variant="text" color="primary" prepend-icon="mdi-share-variant" class="mr-2">
                        Paylaş
                    </v-btn>
                    <v-btn variant="text" color="error" prepend-icon="mdi-bookmark">
                        Kaydet
                    </v-btn>
                </div>
            </v-col>
        </v-row>

        <!-- Ana Görsel -->
        <v-row justify="center" class="mb-8">
            <v-col cols="12" md="10">
                <v-img :src="haber.imageUrl" height="500" cover class="rounded"></v-img>
                <p class="text-caption mt-2 text-grey">{{ haber.imageCaption }}</p>
            </v-col>
        </v-row>

        <!-- Haber İçeriği -->
        <v-row justify="center" class="mb-16">
            <v-col cols="12" md="8">
                <div class="text-body-1 haber-icerik" v-html="haber.description"></div>

                <!-- Etiketler -->
                <v-sheet class="mt-10 pa-4 rounded bg-grey-lighten-4">
                    <div class="d-flex flex-wrap">
                        <v-chip v-for="(etiket, i) in haber.tags" :key="i" class="ma-1" variant="outlined"
                            color="primary" size="small">
                            {{ etiket }}
                        </v-chip>
                    </div>
                </v-sheet>
            </v-col>
        </v-row>

        <!-- İlgili Haberler -->
        <v-row justify="center">
            <v-col cols="12" md="10">
                <h2 class="text-h5 font-weight-bold mb-6">Benzer Haberler</h2>
                <v-row>
                    <v-col v-for="(benzerHaber, index) in benzerHaberler" :key="index" cols="12" md="4">
                        <v-card height="100%" elevation="2">
                            <v-img :src="benzerHaber.imageUrl" height="200" cover></v-img>
                            <v-card-item>
                                <v-chip color="primary" size="small" class="mb-2">{{ benzerHaber.category }}</v-chip>
                                <v-card-title class="text-h6 font-weight-bold mb-2">
                                    {{ benzerHaber.title }}
                                </v-card-title>
                                <v-card-text>
                                    <p class="text-body-2 mb-4"
                                        v-html="benzerHaber.description.length > 100 ? benzerHaber.description.slice(0, 125) + '...' : benzerHaber.description">
                                    </p>
                                    <div class="d-flex align-center justify-space-between">
                                        <span class="text-caption">{{ benzerHaber.date }}</span>
                                        <v-btn variant="text" color="primary" density="comfortable">
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

        <!-- Yorumlar Bölümü -->
        <!-- <v-row justify="center" class="mt-16">
            <v-col cols="12" md="8">
                <h2 class="text-h5 font-weight-bold mb-6">Yorumlar ({{ yorumlar.length }})</h2> -->

        <!-- Yorum Formu -->
        <!-- <v-card class="mb-8 pa-4" variant="outlined">
                    <v-textarea v-model="yeniYorum" label="Yorumunuzu yazın..." rows="3" variant="outlined"
                        hide-details></v-textarea>
                    <div class="d-flex justify-end mt-4">
                        <v-btn color="primary">
                            Yorum Yap
                        </v-btn>
                    </div>
                </v-card> -->

        <!-- Yorumlar Listesi -->
        <!-- <v-card v-for="(yorum, i) in yorumlar" :key="i" class="mb-4 pa-4" variant="outlined">
                    <div class="d-flex">
                        <v-avatar size="40" class="mr-3">
                            <v-img :src="yorum.userAvatar" alt="Kullanıcı"></v-img>
                        </v-avatar>
                        <div class="flex-grow-1">
                            <div class="d-flex justify-space-between">
                                <div class="font-weight-medium">{{ yorum.userName }}</div>
                                <div class="text-caption text-grey">{{ yorum.date }}</div>
                            </div>
                            <p class="mt-2">{{ yorum.comment }}</p>
                            <div class="d-flex mt-2">
                                <v-btn variant="text" size="small" prepend-icon="mdi-thumb-up">
                                    {{ yorum.likes }}
                                </v-btn>
                                <v-btn variant="text" size="small" prepend-icon="mdi-thumb-down" class="ml-2">
                                    {{ yorum.dislikes }}
                                </v-btn>
                                <v-btn variant="text" size="small" class="ml-2">
                                    Yanıtla
                                </v-btn>
                            </div>
                        </div>
                    </div>
                </v-card> -->

        <!-- Daha Fazla Yorum Butonu -->
        <!-- <div class="text-center mt-6" v-if="yorumlar.length > 5">
            <v-btn variant="outlined" color="primary">
                Daha Fazla Yorum Göster
            </v-btn>
        </div>
        </v-col>
        </v-row> -->

        <!-- Geri Dön Butonu -->
        <v-row justify="center" class="mt-16">
            <v-col cols="12" class="text-center">
                <v-btn color="primary" prepend-icon="mdi-arrow-left" to="/gundem">
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
.v-card {
    transition: transform 0.3s ease-in-out;
}

.v-card:hover {
    transform: translateY(-5px);
}

.gundem-link {
    text-decoration: none;
}

.haber-icerik {
    line-height: 1.8;
}

.haber-icerik p {
    margin-bottom: 1.5rem;
}

.haber-icerik h3 {
    margin: 2rem 0 1rem;
}

.haber-icerik img {
    max-width: 100%;
    border-radius: 8px;
    margin: 1.5rem 0;
}

.haber-icerik blockquote {
    padding: 1rem;
    border-left: 4px solid var(--v-primary-base);
    background-color: rgb(var(--v-theme-primary-lighten-5));
    margin: 1.5rem 0;
}
</style>