<template>
    <v-container class="py-16">
        <!-- Başlık -->
        <v-row justify="center" class="mb-12">
            <v-col cols="12" md="8" class="text-center">
                <span class="text-overline text-green-darken-2 font-weight-bold d-block mb-2">FOTOĞRAF GALERİSİ</span>
                <h1 class="text-h3 font-weight-bold mb-3">Köyümüzden Kareler</h1>
                <div class="section-divider mx-auto mb-4"></div>
                <p class="text-body-1">
                    Çelikhan'ın doğal güzellikleri, kültürel değerleri ve etkinliklerinden kareler
                </p>
            </v-col>
        </v-row>

        <!-- Kategori Filtreleme -->
        <v-row class="mb-10">
            <v-col cols="12">
                <v-sheet class="filter-bar py-3 px-6 rounded-pill d-flex align-center justify-center flex-wrap">
                    <span class="mr-4 font-weight-medium d-none d-sm-block">Filtrele:</span>
                    <v-chip-group v-model="selectedCategory" selected-class="primary-selected" mandatory class="category-chips">
                        <v-chip value="all" class="rounded-pill filter-chip elevation-1">Tümü</v-chip>
                        <v-chip value="dogal" class="rounded-pill filter-chip elevation-1">
                            <v-icon size="small" class="mr-1">mdi-pine-tree</v-icon>
                            Doğal
                        </v-chip>
                        <v-chip value="kultur" class="rounded-pill filter-chip elevation-1">
                            <v-icon size="small" class="mr-1">mdi-human-greeting-variant</v-icon>
                            Kültür
                        </v-chip>
                        <v-chip value="etkinlik" class="rounded-pill filter-chip elevation-1">
                            <v-icon size="small" class="mr-1">mdi-calendar-multiple</v-icon>
                            Etkinlik
                        </v-chip>
                        <v-chip value="tarihi" class="rounded-pill filter-chip elevation-1">
                            <v-icon size="small" class="mr-1">mdi-book-open-variant</v-icon>
                            Tarihi
                        </v-chip>
                    </v-chip-group>
                </v-sheet>
            </v-col>
        </v-row>

        <v-row v-if="isLoading" justify="center" align="center" style="min-height: 400px">
            <v-progress-circular indeterminate color="primary" size="64" width="6"></v-progress-circular>
        </v-row>

        <v-row v-else-if="error" justify="center" align="center" style="min-height: 400px">
            <v-alert type="error" text variant="elevated" class="mx-auto pa-6 rounded-xl">{{ error }}</v-alert>
        </v-row>

        <v-row v-else class="photo-grid">
            <v-col v-for="(photo, index) in filteredPhotos" :key="photo._id" cols="12" sm="6" md="4" lg="3"
                :class="{ 'fade-in-item': true }" :style="{ 'animation-delay': `${index * 0.1}s` }">
                <v-card @click="openPhotoDialog(photo)" class="gallery-card rounded-xl" elevation="3" height="100%">
                    <div class="image-container">
                        <v-img :src="photo.imageUrl" :alt="photo.title" height="220" cover class="gallery-image">
                            <div class="image-overlay-gradient"></div>
                            <v-card-title class="text-white position-relative">
                                {{ photo.title }}
                            </v-card-title>
                        </v-img>
                    </div>

                    <v-card-text class="pa-4">
                        <div class="text-subtitle-1 mb-3 gallery-description">
                            {{ photo.description }}
                        </div>
                        <div class="d-flex align-center justify-space-between">
                            <v-chip size="small" :color="getCategoryColor(photo.category)" class="category-chip">
                                <v-icon size="x-small" class="mr-1">mdi-tag</v-icon>
                                {{ getCategoryLabel(photo.category) }}
                            </v-chip>
                            <span class="text-caption text-grey">{{ new Date(photo.createdAt).toLocaleDateString('tr-TR') }}</span>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Boş Durum Mesajı -->
        <v-row v-if="filteredPhotos.length === 0 && !isLoading && !error" justify="center" class="my-16">
            <v-col cols="12" md="6" class="text-center">
                <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-image-off</v-icon>
                <h3 class="text-h5 font-weight-medium mb-2">Bu kategoride fotoğraf bulunamadı</h3>
                <p class="text-body-1 text-grey">Başka bir kategori seçmeyi deneyin veya daha sonra tekrar kontrol edin.</p>
            </v-col>
        </v-row>

        <!-- Görsel Detay Dialog -->
        <v-dialog v-model="dialog" max-width="900px" transition="dialog-bottom-transition">
            <v-card v-if="selectedPhoto" class="dialog-card rounded-xl overflow-hidden">
                <v-img :src="selectedPhoto.imageUrl" :alt="selectedPhoto.title" max-height="600" cover class="dialog-image"></v-img>
                <div class="dialog-overlay-gradient"></div>
                <v-btn icon class="close-btn" variant="text" color="white" @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-card-item class="pb-0">
                    <v-chip size="small" :color="getCategoryColor(selectedPhoto.category)" class="mb-2">
                        {{ getCategoryLabel(selectedPhoto.category) }}
                    </v-chip>
                    <v-card-title class="text-h4 font-weight-bold">{{ selectedPhoto.title }}</v-card-title>
                </v-card-item>
                <v-card-text>
                    <p class="text-body-1 mb-4">{{ selectedPhoto.description }}</p>
                    <div class="d-flex align-center">
                        <v-icon size="small" color="grey" class="mr-1">mdi-calendar</v-icon>
                        <span class="text-caption text-grey">
                            {{ new Date(selectedPhoto.createdAt).toLocaleDateString('tr-TR') }}
                        </span>
                    </div>
                </v-card-text>
                <v-divider class="mx-4"></v-divider>
                <v-card-actions class="pa-4">
                    <v-btn color="primary" variant="text" prepend-icon="mdi-share-variant">
                        Paylaş
                    </v-btn>
                    <v-btn color="error" variant="text" prepend-icon="mdi-heart">
                        Beğen
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="elevated" class="rounded-xl px-6" @click="dialog = false">
                        Kapat
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup>
const dialog = ref(false)
const selectedPhoto = ref(null)
const selectedCategory = ref('all')
const isLoading = ref(false)

const photos = computed(() => usePhotoStore().getPhotos)
const error = computed(() => usePhotoStore().getError)

const filteredPhotos = computed(() => {
    if (selectedCategory.value === 'all') {
        return photos.value
    }
    return photos.value.filter(photo => photo.category === selectedCategory.value)
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

const openPhotoDialog = (photo) => {
    selectedPhoto.value = photo
    dialog.value = true
}

onMounted(async () => {
    isLoading.value = true
    try {
        await usePhotoStore().fetchPhotos()
    } catch (e) {
        console.error("Fotoğraflar yüklenirken hata oluştu:", e)
    } finally {
        isLoading.value = false
    }
})
</script>

<style scoped>
.section-divider {
    height: 4px;
    width: 70px;
    background: linear-gradient(90deg, #09c256, #0b7231);
    border-radius: 2px;
}

.filter-bar {
    background-color: rgba(9, 194, 86, 0.05);
    border: 1px solid rgba(9, 194, 86, 0.1);
    max-width: 800px;
    margin: 0 auto;
}

.filter-chip {
    transition: all 0.3s ease;
    font-weight: 500;
}

.filter-chip:hover {
    background-color: rgba(9, 194, 86, 0.1);
    transform: translateY(-2px);
}

.primary-selected {
    background: linear-gradient(90deg, #09c256, #0b7231) !important;
    color: white !important;
    box-shadow: 0 4px 8px rgba(9, 194, 86, 0.2) !important;
}

.gallery-card {
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    overflow: hidden;
    cursor: pointer;
}

.gallery-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1) !important;
}

.image-container {
    position: relative;
    overflow: hidden;
}

.gallery-image {
    transition: transform 0.5s ease-in-out;
}

.gallery-card:hover .gallery-image {
    transform: scale(1.1);
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

.gallery-description {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 50px;
}

.category-chip {
    font-size: 0.7rem;
    letter-spacing: 0.5px;
}

.dialog-card {
    position: relative;
}

.dialog-image {
    position: relative;
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

.fade-in-item {
    animation: fadeInUp 0.6s ease forwards;
    opacity: 0;
}

.category-chips {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
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

@media (max-width: 600px) {
    .filter-chip {
        margin-bottom: 8px;
    }
    
    .gallery-description {
        min-height: 40px;
    }
}
</style>