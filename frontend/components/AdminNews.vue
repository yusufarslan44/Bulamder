<template>
    <div>
        <!-- Haber Oluşturma Formu -->
        <v-card class="mb-6 form-card rounded-xl" elevation="3" hover>
            <v-card-title class="d-flex align-center px-6 pt-5 pb-2">
                <div class="icon-container mr-3">
                    <v-icon size="24" color="white">mdi-newspaper-plus</v-icon>
                </div>
                <span class="text-h5 font-weight-bold">Yeni Haber Ekle</span>
            </v-card-title>

            <v-card-text class="px-6 py-4">
                <v-form @submit.prevent="handleNewsCreate" class="fade-in-item">
                    <v-row>
                        <v-col cols="12" md="8">
                            <v-text-field v-model="newsForm.title" label="Başlık" variant="outlined" 
                                density="comfortable" class="rounded-lg" prepend-inner-icon="mdi-format-title" required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-select v-model="newsForm.category" :items="categories" label="Kategori" 
                                variant="outlined" density="comfortable" class="rounded-lg" prepend-inner-icon="mdi-folder" required></v-select>
                        </v-col>
                        <v-col cols="12">
                            <div class="mb-2 editor-label d-flex align-center">
                                <v-icon size="small" color="primary" class="mr-2">mdi-text-box-edit</v-icon>
                                <span class="text-subtitle-2">Haber İçeriği</span>
                            </div>
                            <div class="editor-container rounded-lg">
                                <client-only>
                                    <QuillEditor ref="quillEditor" v-model:content="newsForm.description" content-type="html"
                                        theme="snow" :toolbar="customToolbar" />
                                </client-only>
                            </div>
                        </v-col>
                        <v-col cols="12" md="8">
                            <v-file-input v-model="newsForm.image" label="Haber Görseli" accept="image/*"
                                variant="outlined" density="comfortable" class="rounded-lg" prepend-icon="mdi-image" 
                                hint="Önerilen boyut: 1200x600px" required></v-file-input>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-switch v-model="newsForm.isFeatured" color="success" 
                                label="Haberi Öne Çıkar" inset></v-switch>
                        </v-col>
                        <v-col cols="12">
                            <v-btn type="submit" color="primary" size="large" :loading="newsStore.isLoading" 
                                block class="rounded-lg submit-btn">
                                <v-icon class="mr-2">mdi-plus-circle</v-icon>
                                Haber Oluştur
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>

        <!-- Haber Listesi -->
        <v-card class="rounded-xl list-card" elevation="3" hover>
            <v-card-title class="d-flex align-center px-6 pt-5 pb-2">
                <div class="icon-container mr-3">
                    <v-icon size="24" color="white">mdi-newspaper-variant-multiple</v-icon>
                </div>
                <span class="text-h5 font-weight-bold">Mevcut Haberler</span>
                <v-spacer></v-spacer>
                <v-select
                  v-model="selectedCategory"
                  :items="['Tümü', ...categories]"
                  label="Kategori Filtrele"
                  variant="outlined"
                  density="comfortable"
                  class="category-filter"
                  style="max-width: 220px;"
                  hide-details
                ></v-select>
            </v-card-title>
            <v-card-text class="px-6 py-4">
                <v-table class="rounded-lg table-container">
                    <thead>
                        <tr>
                            <th>Görsel</th>
                            <th>Başlık</th>
                            <th>Kategori</th>
                            <th>Tarih</th>
                            <th>Durum</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(news, index) in filteredNews" :key="news._id" class="table-row"
                            :class="{ 'fade-in-item': true }" :style="{ 'animation-delay': `${index * 0.05}s` }">
                            <td>
                                <v-img :src="news.imageUrl" width="80" height="60" class="rounded-lg" cover>
                                    <template v-slot:placeholder>
                                        <v-row class="fill-height ma-0" align="center" justify="center">
                                            <v-progress-circular indeterminate color="primary"></v-progress-circular>
                                        </v-row>
                                    </template>
                                </v-img>
                            </td>
                            <td class="font-weight-medium">{{ news.title }}</td>
                            <td>
                                <v-chip color="primary" size="small" variant="flat" class="category-chip">
                                    {{ getCategoryName(news.category) }}
                                </v-chip>
                            </td>
                            <td>{{ new Date(news.createdAt).toLocaleDateString('tr-TR') }}</td>
                            <td>
                                <v-chip v-if="news.isFeatured" color="success" size="small" variant="flat" class="status-chip">
                                    Öne Çıkan
                                </v-chip>
                                <v-chip v-else size="small" variant="flat" class="status-chip">
                                    Normal
                                </v-chip>
                            </td>
                            <td>
                                <div class="d-flex">
                                    <v-btn icon color="info" variant="tonal" size="small" class="mr-1 action-btn"
                                        @click="openNewsDetails(news)">
                                        <v-icon size="20">mdi-eye</v-icon>
                                        <v-tooltip activator="parent" location="top">Görüntüle</v-tooltip>
                                    </v-btn>
                                    <v-btn icon color="warning" variant="tonal" size="small" class="mr-1 action-btn"
                                        @click="openNewsEdit(news)">
                                        <v-icon size="20">mdi-pencil</v-icon>
                                        <v-tooltip activator="parent" location="top">Düzenle</v-tooltip>
                                    </v-btn>
                                    <v-btn icon color="error" variant="tonal" size="small" class="action-btn"
                                        @click="handleNewsDelete(news._id)" :loading="newsStore.isLoading">
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

        <!-- Haber Detay Modal -->
        <v-dialog v-model="newsDialog" max-width="700">
            <v-card v-if="selectedNews" class="rounded-xl detail-card" elevation="8">
                <v-img :src="selectedNews.imageUrl" height="300" cover class="detail-image">
                    <template v-slot:placeholder>
                        <v-row class="fill-height ma-0" align="center" justify="center">
                            <v-progress-circular indeterminate color="primary"></v-progress-circular>
                        </v-row>
                    </template>
                    <div class="image-overlay-gradient"></div>
                </v-img>
                <v-card-title class="text-h4 pt-5 px-6">{{ selectedNews.title }}</v-card-title>
                <v-card-subtitle class="px-6 pt-2">
                    <div class="d-flex align-center">
                        <v-icon size="small" color="primary" class="mr-1">mdi-calendar</v-icon>
                        <span>{{ new Date(selectedNews.createdAt).toLocaleDateString('tr-TR') }}</span>
                        <v-spacer></v-spacer>
                        <v-chip v-if="selectedNews.isFeatured" color="success" size="small" variant="flat">
                            Öne Çıkan
                        </v-chip>
                    </div>
                </v-card-subtitle>
                <v-card-text class="px-6">
                    <div class="text-body-1 news-content" v-html="selectedNews.description"></div>
                </v-card-text>
                <v-card-actions class="px-6 pb-4">
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="text" class="rounded-lg px-6" @click="newsDialog = false">
                        Kapat
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Haber Düzenleme Modal -->
        <v-dialog v-model="editNewsDialog" max-width="800">
            <v-card v-if="selectedNews" class="rounded-xl edit-card" elevation="8">
                <v-card-title class="text-h5 px-6 pt-5 pb-2 d-flex align-center">
                    <div class="icon-container mr-3">
                        <v-icon size="24" color="white">mdi-pencil</v-icon>
                    </div>
                    <span>Haberi Düzenle</span>
                </v-card-title>
                <v-card-text class="px-6 py-4">
                    <v-form @submit.prevent="handleNewsUpdate">
                        <v-row>
                            <v-col cols="12">
                                <v-text-field v-model="editNewsForm.title" label="Başlık" variant="outlined" 
                                    density="comfortable" class="rounded-lg" prepend-inner-icon="mdi-format-title" required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <div class="mb-2 editor-label d-flex align-center">
                                    <v-icon size="small" color="primary" class="mr-2">mdi-text-box-edit</v-icon>
                                    <span class="text-subtitle-2">Haber İçeriği</span>
                                </div>
                                <div class="editor-container rounded-lg">
                                    <client-only>
                                        <QuillEditor ref="quillEditor" v-model:content="editNewsForm.description"
                                            content-type="html" theme="snow" :toolbar="customToolbar" />
                                    </client-only>
                                </div>
                            </v-col>
                            <v-col cols="12">
                                <v-file-input v-model="editNewsForm.image" label="Yeni Görsel (İsteğe Bağlı)" 
                                    accept="image/*" variant="outlined" density="comfortable" class="rounded-lg" 
                                    prepend-icon="mdi-image"></v-file-input>
                            </v-col>
                        </v-row>

                        <v-card-actions class="px-0 pt-4 pb-0">
                            <v-spacer></v-spacer>
                            <v-btn color="error" variant="text" class="rounded-lg mr-2" @click="editNewsDialog = false">
                                İptal
                            </v-btn>
                            <v-btn color="primary" type="submit" class="rounded-lg px-6 submit-btn" :loading="newsStore.isLoading">
                                <v-icon class="mr-2">mdi-content-save</v-icon>
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
const quillEditor = ref(null)
const categories = ["Genel", "Spor", "Teknoloji", "Eğitim", "Kültür-Sanat", "Bilim"];
const selectedCategory = ref('Tümü');

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
const customToolbar = [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['image'], // 📌 Quill'in varsayılan resim butonu
    [{ align: [] }],
    ['clean']
]
// 📌 Quill'e resim ekleme fonksiyonu
const insertImageToQuill = (imageUrl) => {
    if (quillEditor.value) {
        const editor = quillEditor.value.getQuill()
        const range = editor.getSelection()
        editor.insertEmbed(range.index, 'image', imageUrl)
    }
}

const handleImageUpload = () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')

    input.addEventListener('change', async () => {
        const file = input.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.readAsDataURL(file)

        reader.onload = () => {
            insertImageToQuill(reader.result)
        }
    })

    input.click()
}
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
                image: null,
                category: '',
                isFeatured: false
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
        formData.append('image', editNewsForm.value.image[0] || editNewsForm.value.image)
    }

    const result = await newsStore.updateNews(selectedNews.value._id, formData)
    if (result.success) {
        editNewsDialog.value = false
    }
}

// Kategorileri formatla - ilk harfi büyük yap
const getCategoryName = (category) => {
    // Eğer kategori yoksa veya boşsa Genel olarak göster
    if (!category) return 'Genel';
    
    // Kategori değeri küçük harfle gelebilir, uygun biçimde eşleştir
    const normalizedCategory = category.toLowerCase();
    
    // Kategorileri küçük harfe çevir ve karşılaştır
    const match = categories.find(cat => cat.toLowerCase() === normalizedCategory);
    return match || category; // Eşleşme yoksa gelen değeri göster
}

// Haberleri kategoriye göre filtrele
const filteredNews = computed(() => {
    if (selectedCategory.value === 'Tümü') {
        return newsStore.getNews;
    } else {
        return newsStore.getNews.filter(news => 
            getCategoryName(news.category) === selectedCategory.value
        );
    }
});

onMounted(() => {
    newsStore.fetchNews()

})
</script>

<style scoped>
.form-card, .list-card, .detail-card, .edit-card {
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

.editor-container {
    border: 1px solid rgba(0, 0, 0, 0.12);
    overflow: hidden;
}

.editor-label {
    margin-left: 4px;
    opacity: 0.8;
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

.status-chip {
    font-size: 0.75rem;
    font-weight: 500;
}

.image-overlay-gradient {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    z-index: 1;
}

.news-content {
    max-height: 400px;
    overflow-y: auto;
    padding-right: 10px;
}

.news-content img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 10px 0;
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