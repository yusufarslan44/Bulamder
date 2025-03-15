<template>
    <div>
        <!-- Fotoğraf Yükleme Formu -->
        <v-card class="mb-6" elevation="2" hover>
            <v-card-title class="d-flex align-center">
                <v-icon size="24" color="primary" class="mr-2">mdi-upload</v-icon>
                Yeni Fotoğraf Yükle
            </v-card-title>
            <v-card-text>
                <v-form @submit.prevent="handlePhotoUpload">
                    <v-text-field v-model="photoForm.title" label="Başlık" required></v-text-field>

                    <v-textarea v-model="photoForm.description" label="Açıklama" required></v-textarea>

                    <v-select v-model="photoForm.category" :items="categories" label="Kategori" required></v-select>

                    <v-file-input v-model="photoForm.image" label="Fotoğraf" accept="image/*" required></v-file-input>

                    <v-btn type="submit" color="primary" :loading="photoStore.isLoading" block>
                        Yükle
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>

        <!-- Fotoğraf Listesi -->
        <v-card elevation="2" hover>
            <v-card-title class="d-flex align-center">
                <v-icon size="24" color="primary" class="mr-2">mdi-image-multiple</v-icon>
                Mevcut Fotoğraflar
            </v-card-title>
            <v-card-text>
                <v-table>
                    <thead>
                        <tr>
                            <th>Fotoğraf</th>
                            <th>Başlık</th>
                            <th>Kategori</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="photo in photoStore.getPhotos" :key="photo._id">
                            <td>
                                <v-img :src="photo.imageUrl" width="100" aspect-ratio="1" cover></v-img>
                            </td>
                            <td>{{ photo.title }}</td>
                            <td>{{ getCategoryLabel(photo.category) }}</td>
                            <td>
                                <v-btn icon="mdi-delete" color="error" variant="text"
                                    @click="handlePhotoDelete(photo._id)" :loading="photoStore.isLoading"></v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
import { usePhotoStore } from '@/stores/photo'

const photoStore = usePhotoStore()

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
.v-card {
    transition: transform 0.2s;
}

.v-card:hover {
    transform: translateY(-2px);
}
</style>