<template>
    <div>
        <!-- Haber Oluşturma Formu -->
        <v-card class="mb-6" elevation="2" hover>
            <v-card-title class="d-flex align-center">
                <v-icon size="24" color="primary" class="mr-2">mdi-newspaper-plus</v-icon>
                Yeni Haber Ekle
            </v-card-title>

            <v-card-text>
                <v-form @submit.prevent="handleNewsCreate">


                    <v-text-field v-model="newsForm.title" label="Başlık" required></v-text-field>
                    <div class="my-2" style="border: 2px solid #ccc;">
                        <client-only>
                            <QuillEditor v-model:content="newsForm.description" content-type="html" theme="snow" />
                        </client-only>
                    </div>
                    <v-file-input v-model="newsForm.image" label="Haber Görseli" accept="image/*"
                        required></v-file-input>

                    <v-select v-model="newsForm.category" :items="categories" label="Kategori" required></v-select>

                    <v-switch v-model="newsForm.isFeatured" label="Haberi Öne Çıkar"></v-switch>

                    <v-btn type="submit" color="primary" :loading="newsStore.isLoading" block>
                        Oluştur
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>

        <!-- Haber Listesi -->
        <v-card elevation="2" hover>
            <v-card-title class="d-flex align-center">
                <v-icon size="24" color="primary" class="mr-2">mdi-newspaper-variant-multiple</v-icon>
                Mevcut Haberler
            </v-card-title>
            <v-card-text>
                <v-table>
                    <thead>
                        <tr>
                            <th>Görsel</th>
                            <th>Başlık</th>
                            <th>Tarih</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="news in newsStore.getNews" :key="news._id">
                            <td>
                                <v-img :src="news.imageUrl" width="100" aspect-ratio="1" cover></v-img>
                            </td>
                            <td>{{ news.title }}</td>
                            <td>{{ new Date(news.createdAt).toLocaleDateString('tr-TR') }}</td>
                            <td>
                                <v-btn icon="mdi-eye" color="info" variant="text" class="mr-2"
                                    @click="openNewsDetails(news)"></v-btn>
                                <v-btn icon="mdi-pencil" color="warning" variant="text" class="mr-2"
                                    @click="openNewsEdit(news)"></v-btn>
                                <v-btn icon="mdi-delete" color="error" variant="text"
                                    @click="handleNewsDelete(news._id)" :loading="newsStore.isLoading"></v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-text>
        </v-card>

        <!-- Haber Detay Modal -->
        <v-dialog v-model="newsDialog" max-width="600">
            <v-card v-if="selectedNews">
                <v-img :src="selectedNews.imageUrl" height="300" cover></v-img>
                <v-card-title>{{ selectedNews.title }}</v-card-title>
                <v-card-text>
                    <p class="text-body-1">{{ selectedNews.description }}</p>
                    <v-list>
                        <v-list-item>
                            <template v-slot:prepend>
                                <v-icon>mdi-calendar</v-icon>
                            </template>
                            <v-list-item-title>
                                {{ new Date(selectedNews.createdAt).toLocaleDateString('tr-TR') }}
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="text" @click="newsDialog = false">
                        Kapat
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Haber Düzenleme Modal -->
        <v-dialog v-model="editNewsDialog" max-width="600">
            <v-card v-if="selectedNews">
                <v-card-title>Haberi Düzenle</v-card-title>
                <v-card-text>
                    <v-form @submit.prevent="handleNewsUpdate">
                        <v-text-field v-model="editNewsForm.title" label="Başlık" required></v-text-field>

                        <v-textarea v-model="editNewsForm.description" label="Haber İçeriği" required></v-textarea>

                        <v-file-input v-model="editNewsForm.image" label="Yeni Görsel (İsteğe Bağlı)"
                            accept="image/*"></v-file-input>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="error" variant="text" @click="editNewsDialog = false">
                                İptal
                            </v-btn>
                            <v-btn color="primary" type="submit" :loading="newsStore.isLoading">
                                Güncelle
                            </v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { useNewsStore } from '@/stores/news'


const newsStore = useNewsStore()
const newsDialog = ref(false)
const editNewsDialog = ref(false)
const selectedNews = ref(null)

const categories = ["Genel", "Spor", "Teknoloji", "Eğitim", "Kültür-Sanat", "Bilim"];


const newsForm = ref({
    title: '',
    description: '',
    image: null,
    category: '',
    isFeatured: false
});

const editNewsForm = ref({
    title: '',
    description: '',
    image: null
})

const handleNewsCreate = async () => {
    try {
        if (!newsForm.value.title || !newsForm.value.description || !newsForm.value.image) {
            alert('Lütfen tüm alanları doldurun!');
            return;
        }

        console.log("Form değerleri:", {
            title: newsForm.value.title,
            description: newsForm.value.description,
            image: newsForm.value.image
        });

        const formData = new FormData()
        formData.append('title', newsForm.value.title);
        formData.append('description', newsForm.value.description);
        formData.append('image', newsForm.value.image[0] || newsForm.value.image);
        formData.append('category', newsForm.value.category.toLowerCase());
        formData.append('isFeatured', newsForm.value.isFeatured);
        // FormData içeriğini kontrol et
        for (let [key, value] of formData.entries()) {
            console.log(`FormData içeriği - ${key}:`, value);
        }

        const result = await newsStore.createNews(formData)
        console.log("API Yanıtı:", result);


        if (result.status == "success") {
            // Form'u temizle
            newsForm.value = {
                title: '',
                description: '',
                image: null
            }
            // Başarılı mesajı göster
            alert('Haber başarıyla oluşturuldu!')
            // Haberleri yeniden yükle
            await newsStore.fetchNews()
        }
    } catch (error) {
        console.error("Haber oluşturma hatası:", error);
        alert('Haber oluşturulurken bir hata oluştu: ' + error.message)
    }
}

const handleNewsDelete = async (newsId) => {
    if (confirm('Bu haberi silmek istediğinizden emin misiniz?')) {
        await newsStore.deleteNews(newsId)
    }
}

const openNewsDetails = (news) => {
    selectedNews.value = news
    newsDialog.value = true
}

const openNewsEdit = (news) => {
    selectedNews.value = news
    editNewsForm.value = {
        title: news.title,
        description: news.description,
        image: null
    }
    editNewsDialog.value = true
}

const handleNewsUpdate = async () => {
    const formData = new FormData()
    formData.append('title', editNewsForm.value.title)
    formData.append('description', editNewsForm.value.description)
    if (editNewsForm.value.image) {
        formData.append('image', editNewsForm.value.image)
    }

    const result = await newsStore.updateNews(selectedNews.value._id, formData)
    if (result.success) {
        editNewsDialog.value = false
    }
}

onMounted(() => {
    newsStore.fetchNews()
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