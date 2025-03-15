<template>
    <v-container class="py-16">
        <v-row class="mb-8">
            <v-col cols="12">
                <h1 class="text-h3 font-weight-bold text-center">Köyümüzden Kareler</h1>
            </v-col>
        </v-row>

        <v-row class="mb-8">
            <v-col cols="12">
                <v-chip-group v-model="selectedCategory" selected-class="primary" mandatory>
                    <v-chip value="all">Tümü</v-chip>
                    <v-chip value="dogal">Doğal</v-chip>
                    <v-chip value="kultur">Kültür</v-chip>
                    <v-chip value="etkinlik">Etkinlik</v-chip>
                    <v-chip value="tarihi">Tarihi</v-chip>
                </v-chip-group>
            </v-col>
        </v-row>

        <v-row v-if="isLoading" justify="center" align="center" style="min-height: 400px">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-row>

        <v-row v-else-if="error" justify="center" align="center" style="min-height: 400px">
            <v-alert type="error" text>{{ error }}</v-alert>
        </v-row>

        <v-row v-else>
            <v-col v-for="photo in filteredPhotos" :key="photo._id" cols="12" sm="6" md="4" lg="3">
                <v-card @click="openPhotoDialog(photo)" class="mx-auto" elevation="2" height="100%">
                    <v-img :src="photo.imageUrl" :alt="photo.title" class="align-end" height="200" cover>
                        <v-card-title class="text-white bg-black bg-opacity-50">
                            {{ photo.title }}
                        </v-card-title>
                    </v-img>

                    <v-card-text>
                        <div class="text-subtitle-1 mb-2">
                            {{ photo.description }}
                        </div>
                        <v-chip size="small" :color="getCategoryColor(photo.category)" class="mt-2">
                            {{ getCategoryLabel(photo.category) }}
                        </v-chip>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-dialog v-model="dialog" max-width="800px">
            <v-card v-if="selectedPhoto">
                <v-img :src="selectedPhoto.imageUrl" :alt="selectedPhoto.title" max-height="500" cover></v-img>
                <v-card-title>{{ selectedPhoto.title }}</v-card-title>
                <v-card-text>
                    <p class="text-body-1">{{ selectedPhoto.description }}</p>
                    <v-chip size="small" :color="getCategoryColor(selectedPhoto.category)" class="mt-4">
                        {{ getCategoryLabel(selectedPhoto.category) }}
                    </v-chip>
                    <div class="text-caption mt-2">
                        {{ new Date(selectedPhoto.createdAt).toLocaleDateString('tr-TR') }}
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="text" @click="dialog = false">
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

const photos = computed(() => usePhotoStore().getPhotos)
// const isLoading = computed(() => photoStore().isLoading)
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
    await usePhotoStore().fetchPhotos()
})
</script>

<style scoped>
.v-card {
    transition: transform 0.2s;
}

.v-card:hover {
    transform: translateY(-5px);
}

.bg-opacity-50 {
    background-color: rgba(0, 0, 0, 0.5) !important;
}
</style>