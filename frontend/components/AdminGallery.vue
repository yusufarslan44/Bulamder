<template>
    <div>
        <!-- Fotoğraf Yükleme Formu -->
        <v-card class="mb-6 form-card rounded-xl" elevation="3" hover>
            <v-card-title class="d-flex align-center px-6 pt-5 pb-2">
                <div class="icon-container mr-3">
                    <v-icon size="24" color="white">mdi-upload</v-icon>
                </div>
                <span class="text-h5 font-weight-bold">Yeni Fotoğraf Yükle</span>
            </v-card-title>
            <v-card-text class="px-6 py-4">
                <v-form @submit.prevent="handlePhotoUpload" class="fade-in-item">
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="photoForm.title" label="Başlık" variant="outlined" 
                                density="comfortable" class="rounded-lg" prepend-inner-icon="mdi-format-title" required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-select v-model="photoForm.category" :items="categories" label="Kategori" 
                                variant="outlined" density="comfortable" class="rounded-lg" prepend-inner-icon="mdi-folder" required></v-select>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea v-model="photoForm.description" label="Açıklama" variant="outlined" 
                                density="comfortable" class="rounded-lg" prepend-inner-icon="mdi-text-box" auto-grow rows="3" required></v-textarea>
                        </v-col>
                        <v-col cols="12">
                            <v-file-input v-model="photoForm.image" label="Fotoğraf" accept="image/*"
                                variant="outlined" density="comfortable" class="rounded-lg" prepend-icon="mdi-image" required></v-file-input>
                        </v-col>
                        <v-col cols="12">
                            <v-btn type="submit" color="primary" size="large" :loading="photoStore.isLoading" block class="rounded-lg submit-btn">
                                <v-icon class="mr-2">mdi-cloud-upload</v-icon>
                                Fotoğraf Yükle
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>

        <!-- Fotoğraf Listesi -->
        <v-card class="rounded-xl list-card" elevation="3" hover>
            <v-card-title class="d-flex align-center px-6 pt-5 pb-2">
                <div class="icon-container mr-3">
                    <v-icon size="24" color="white">mdi-image-multiple</v-icon>
                </div>
                <span class="text-h5 font-weight-bold">Mevcut Fotoğraflar</span>
            </v-card-title>
            <v-card-text class="px-6 py-4">
                <v-table class="rounded-lg table-container">
                    <thead>
                        <tr>
                            <th>Fotoğraf</th>
                            <th>Başlık</th>
                            <th>Kategori</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(photo, index) in photoStore.getPhotos" :key="photo._id" class="table-row"
                            :class="{ 'fade-in-item': true }" :style="{ 'animation-delay': `${index * 0.05}s` }">
                            <td>
                                <v-img :src="photo.imageUrl" width="80" height="60" class="rounded-lg" cover>
                                    <template v-slot:placeholder>
                                        <v-row class="fill-height ma-0" align="center" justify="center">
                                            <v-progress-circular indeterminate color="primary"></v-progress-circular>
                                        </v-row>
                                    </template>
                                </v-img>
                            </td>
                            <td class="font-weight-medium">{{ photo.title }}</td>
                            <td>
                                <v-chip color="primary" size="small" variant="flat" class="category-chip">
                                    {{ getCategoryLabel(photo.category) }}
                                </v-chip>
                            </td>
                            <td>
                                <div class="d-flex">
                                    <v-btn icon color="info" variant="tonal" size="small" class="mr-1 action-btn"
                                        @click="openPhotoPreview(photo)">
                                        <v-icon size="20">mdi-eye</v-icon>
                                        <v-tooltip activator="parent" location="top">Görüntüle</v-tooltip>
                                    </v-btn>
                                    <v-btn icon color="error" variant="tonal" size="small" class="action-btn"
                                        @click="handlePhotoDelete(photo._id)" :loading="photoStore.isLoading">
                                        <v-icon size="20">mdi-delete</v-icon>
                                        <v-tooltip activator="parent" location="top">Sil</v-tooltip>
                                    </v-btn>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-text>
        </v-card>

        <!-- Fotoğraf Önizleme Dialog -->
        <v-dialog v-model="previewDialog" max-width="800">
            <v-card v-if="selectedPhoto" class="rounded-xl preview-card" elevation="8">
                <v-img :src="selectedPhoto.imageUrl" max-height="500" contain class="preview-image">
                    <template v-slot:placeholder>
                        <v-row class="fill-height ma-0" align="center" justify="center">
                            <v-progress-circular indeterminate color="primary"></v-progress-circular>
                        </v-row>
                    </template>
                </v-img>
                <v-card-title class="text-h5 pt-5 px-6">{{ selectedPhoto.title }}</v-card-title>
                <v-card-text class="px-6 py-2">
                    <v-chip color="primary" size="small" variant="flat" class="mb-3">
                        {{ getCategoryLabel(selectedPhoto.category) }}
                    </v-chip>
                    <p class="text-body-1">{{ selectedPhoto.description }}</p>
                </v-card-text>
                <v-card-actions class="px-6 pb-4">
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="text" class="rounded-lg px-6" @click="previewDialog = false">
                        Kapat
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { usePhotoStore } from '@/stores/photo'

const photoStore = usePhotoStore()
const previewDialog = ref(false)
const selectedPhoto = ref(null)

// Form state
const photoForm = ref({
    title: '',
    description: '',
    category: '',
    image: null
})

// Kategori seçenekleri
const categories = [
    { title: 'Doğal', value: 'dogal' },
    { title: 'Kültür', value: 'kultur' },
    { title: 'Etkinlik', value: 'etkinlik' },
    { title: 'Tarihi', value: 'tarihi' }
]

// Yardımcı fonksiyonlar
const getCategoryLabel = (category) => {
    const labels = {
        dogal: 'Doğal',
        kultur: 'Kültür',
        etkinlik: 'Etkinlik',
        tarihi: 'Tarihi'
    }
    return labels[category] || category
}

// Fotoğraf önizleme
const openPhotoPreview = (photo) => {
    selectedPhoto.value = photo
    previewDialog.value = true
}

// Form işleyicileri
const handlePhotoUpload = async () => {
    const formData = new FormData()
    formData.append('title', photoForm.value.title)
    formData.append('description', photoForm.value.description)
    formData.append('category', photoForm.value.category)
    formData.append('image', photoForm.value.image)

    const result = await photoStore.uploadPhoto(formData)
    if (result.success) {
        // Form'u temizle
        photoForm.value = {
            title: '',
            description: '',
            category: '',
            image: null
        }
    }
}

const handlePhotoDelete = async (photoId) => {
    if (confirm('Bu fotoğrafı silmek istediğinizden emin misiniz?')) {
        await photoStore.deletePhoto(photoId)
    }
}

onMounted(() => {
    photoStore.fetchPhotos()
})
</script>

<style scoped>
.form-card, .list-card, .preview-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: none;
    overflow: hidden;
}

.form-card:hover, .list-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
}

.icon-container {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #09c256, #0b7231);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(9, 194, 86, 0.3);
}

.table-container {
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.table-row {
    transition: background-color 0.2s ease;
}

.table-row:hover {
    background-color: rgba(9, 194, 86, 0.05);
}

.action-btn {
    opacity: 0.7;
    transition: all 0.3s ease;
}

.action-btn:hover {
    opacity: 1;
    transform: translateY(-2px);
}

.submit-btn {
    background: linear-gradient(135deg, #09c256, #0b7231) !important;
    transition: all 0.3s ease;
}

.submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(9, 194, 86, 0.3) !important;
}

.category-chip {
    font-size: 0.75rem;
    font-weight: 500;
}

.preview-image {
    background-color: #f5f5f5;
}

.fade-in-item {
    animation: fadeInUp 0.6s ease forwards;
    opacity: 0;
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
</style>