<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-card class="mb-4">
                    <v-card-title class="d-flex align-center">
                        <h2 class="text-h5">Sayfa İçeriklerini Yönet</h2>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" prepend-icon="mdi-plus" @click="showCreateDialog = true">
                            Yeni İçerik Ekle
                        </v-btn>
                    </v-card-title>

                    <v-card-text>
                        <v-tabs v-model="activeTab" bg-color="primary">
                            <v-tab value="pages">Sayfalar</v-tab>
                            <v-tab value="edit" :disabled="!selectedPage">İçerik Düzenle</v-tab>
                        </v-tabs>

                        <v-window v-model="activeTab">
                            <!-- Sayfa Listesi -->
                            <v-window-item value="pages">
                                <v-table>
                                    <thead>
                                        <tr>
                                            <th>Sayfa Adı</th>
                                            <th>Başlık</th>
                                            <th>Bölüm Sayısı</th>
                                            <th>Durum</th>
                                            <th>İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="page in pagesList" :key="page.pageName"
                                            :class="{ 'selected-row': selectedPage && selectedPage.pageName === page.pageName }">
                                            <td>{{ getPageTitle(page.pageName) }}</td>
                                            <td>{{ page.title }}</td>
                                            <td>{{ page.sections.length }}</td>
                                            <td>
                                                <v-chip :color="page.status === 'published' ? 'success' : 'warning'"
                                                    size="small">
                                                    {{ page.status === 'published' ? 'Yayında' : 'Taslak' }}
                                                </v-chip>
                                            </td>
                                            <td>
                                                <v-btn icon="mdi-pencil" size="small" class="mr-2" color="primary"
                                                    @click="selectPage(page)" variant="text"></v-btn>
                                                <v-btn icon="mdi-delete" size="small" color="error"
                                                    @click="showDeleteConfirmation(page)" variant="text"></v-btn>
                                            </td>
                                        </tr>
                                        <tr v-if="pagesList.length === 0">
                                            <td colspan="5" class="text-center">Henüz sayfa içeriği bulunmuyor</td>
                                        </tr>
                                    </tbody>
                                </v-table>
                            </v-window-item>

                            <!-- İçerik Düzenleme -->
                            <v-window-item value="edit">
                                <template v-if="selectedPage">
                                    <v-form @submit.prevent="updatePage">
                                        <v-row>
                                            <v-col cols="12" md="8">
                                                <v-text-field v-model="editForm.title" label="Sayfa Başlığı"
                                                    required></v-text-field>
                                            </v-col>
                                            <v-col cols="12" md="4">
                                                <v-select v-model="editForm.status" label="Durum" :items="[
                                                    { title: 'Yayında', value: 'published' },
                                                    { title: 'Taslak', value: 'draft' }
                                                ]" required></v-select>
                                            </v-col>
                                        </v-row>

                                        <h3 class="text-h6 mb-3 mt-4">Sayfa Bölümleri</h3>

                                        <!-- Bölüm seçimi -->
                                        <v-card class="mb-6 pa-3 bg-grey-lighten-4">
                                            <v-card-text>
                                                <v-select v-model="activeSectionIndex" :items="sectionSelectItems"
                                                    label="Düzenlenecek Bölümü Seçin" variant="outlined"
                                                    @update:model-value="selectSection"></v-select>
                                            </v-card-text>
                                        </v-card>

                                        <!-- Seçilen bölüm düzenleme formu -->
                                        <div v-if="activeSection" class="section-editor pa-4 mb-4 border rounded">
                                            <div class="d-flex align-center mb-4">
                                                <h4 class="text-subtitle-1">{{
                                                    getSectionTitle(activeSection.sectionName) }}</h4>
                                            </div>

                                            <v-row>
                                                <v-col cols="12" md="6">
                                                    <v-text-field v-model="activeSection.title"
                                                        label="Bölüm Başlığı"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" md="6">
                                                    <v-text-field v-model="activeSection.subtitle"
                                                        label="Alt Başlık"></v-text-field>
                                                </v-col>

                                                <!-- Genel içerik (tüm bölümler için) -->
                                                <v-col cols="12"
                                                    v-if="!isSectionTypeWithSpecialEditor(activeSection.sectionName)">
                                                    <v-textarea v-model="activeSection.content" label="İçerik" rows="6"
                                                        auto-grow></v-textarea>
                                                </v-col>

                                                <!-- Görsel alanı (tüm bölümler için) -->
                                                <v-col cols="12" md="6"
                                                    v-if="!isSectionTypeWithSpecialEditor(activeSection.sectionName)">
                                                    <v-file-input 
                                                        v-model="activeSection.imageFile" 
                                                        label="Görsel Yükle" 
                                                        accept="image/*"
                                                        variant="outlined"
                                                        density="comfortable" 
                                                        prepend-icon="mdi-image"
                                                        @update:model-value="handleImageUpload"
                                                        class="rounded-lg"
                                                        show-size 
                                                        hint="Maksimum 5MB"
                                                        :loading="imageUploading"
                                                    ></v-file-input>
                                                </v-col>
                                                <v-col cols="12" md="6"
                                                    v-if="!isSectionTypeWithSpecialEditor(activeSection.sectionName) && activeSection.imageUrl">
                                                    <v-img 
                                                        :src="activeSection.imageUrl" 
                                                        max-height="150" 
                                                        contain 
                                                        class="bg-grey-lighten-4 rounded-lg"
                                                    >
                                                        <template v-slot:placeholder>
                                                            <v-row class="fill-height ma-0" align="center" justify="center">
                                                                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                                                            </v-row>
                                                        </template>
                                                    </v-img>
                                                    <div class="d-flex justify-end mt-1">
                                                        <v-btn color="error" size="small" variant="text" @click="removeImage" icon density="comfortable">
                                                            <v-icon>mdi-delete</v-icon>
                                                        </v-btn>
                                                    </div>
                                                </v-col>
                                            </v-row>

                                            <!-- Ekip bölümü özel editörü -->
                                            <div v-if="activeSection.sectionName === 'team'">
                                                <h5 class="text-h6 mb-3">Ekip Üyeleri</h5>

                                                <v-expansion-panels variant="accordion" class="mb-4">
                                                    <v-expansion-panel
                                                        v-for="(member, mIndex) in activeSection.members || []"
                                                        :key="mIndex">
                                                        <v-expansion-panel-title>
                                                            <div class="d-flex align-center">
                                                                <v-avatar size="32" class="mr-2" v-if="member.image">
                                                                    <v-img :src="member.image" cover></v-img>
                                                                </v-avatar>
                                                                {{ member.name || `Üye ${mIndex + 1}` }}
                                                            </div>
                                                        </v-expansion-panel-title>
                                                        <v-expansion-panel-text>
                                                            <v-row>
                                                                <v-col cols="12" md="6">
                                                                    <v-text-field v-model="member.name"
                                                                        label="Ad Soyad"></v-text-field>
                                                                </v-col>
                                                                <v-col cols="12" md="6">
                                                                    <v-text-field v-model="member.position"
                                                                        label="Pozisyon"></v-text-field>
                                                                </v-col>
                                                                <v-col cols="12" md="6">
                                                                    <v-text-field v-model="member.image"
                                                                        label="Fotoğraf URL"></v-text-field>
                                                                </v-col>
                                                                <v-col cols="12" md="6">
                                                                    <v-textarea v-model="member.description"
                                                                        label="Açıklama" rows="3"></v-textarea>
                                                                </v-col>
                                                                <v-col cols="12" class="d-flex justify-end">
                                                                    <v-btn color="error"
                                                                        @click="removeTeamMember(mIndex)" size="small">
                                                                        <v-icon left>mdi-delete</v-icon> Üyeyi Sil
                                                                    </v-btn>
                                                                </v-col>
                                                            </v-row>
                                                        </v-expansion-panel-text>
                                                    </v-expansion-panel>
                                                </v-expansion-panels>

                                                <v-btn color="secondary" prepend-icon="mdi-account-plus"
                                                    @click="addTeamMember" variant="outlined">
                                                    Yeni Ekip Üyesi Ekle
                                                </v-btn>
                                            </div>

                                            <!-- Features bölümü özel editörü -->
                                            <div v-if="activeSection.sectionName === 'features'">
                                                <h5 class="text-h6 mb-3">Özellik Kartları</h5>

                                                <v-expansion-panels variant="accordion" class="mb-4">
                                                    <v-expansion-panel
                                                        v-for="(feature, fIndex) in activeSection.features || []"
                                                        :key="fIndex">
                                                        <v-expansion-panel-title>
                                                            <div class="d-flex align-center">
                                                                <v-icon class="mr-2">{{ feature.icon || 'mdi-star'
                                                                }}</v-icon>
                                                                {{ feature.title || `Özellik ${fIndex + 1}` }}
                                                            </div>
                                                        </v-expansion-panel-title>
                                                        <v-expansion-panel-text>
                                                            <v-row>
                                                                <v-col cols="12" md="6">
                                                                    <v-text-field v-model="feature.title"
                                                                        label="Başlık"></v-text-field>
                                                                </v-col>
                                                                <v-col cols="12" md="6">
                                                                    <v-text-field v-model="feature.icon"
                                                                        label="İkon (mdi-star gibi)"></v-text-field>
                                                                </v-col>
                                                                <v-col cols="12">
                                                                    <v-textarea v-model="feature.description"
                                                                        label="Açıklama" rows="3"></v-textarea>
                                                                </v-col>
                                                                <v-col cols="12" class="d-flex justify-end">
                                                                    <v-btn color="error" @click="removeFeature(fIndex)"
                                                                        size="small">
                                                                        <v-icon left>mdi-delete</v-icon> Özelliği Sil
                                                                    </v-btn>
                                                                </v-col>
                                                            </v-row>
                                                        </v-expansion-panel-text>
                                                    </v-expansion-panel>
                                                </v-expansion-panels>

                                                <v-btn color="secondary" prepend-icon="mdi-plus-circle"
                                                    @click="addFeature" variant="outlined">
                                                    Yeni Özellik Ekle
                                                </v-btn>
                                            </div>

                                            <!-- Stats bölümü özel editörü -->
                                            <div v-if="activeSection.sectionName === 'stats'">
                                                <h5 class="text-h6 mb-3">İstatistik Kartları</h5>

                                                <v-row>
                                                    <v-col v-for="(stat, sIndex) in activeSection.stats || []"
                                                        :key="sIndex" cols="12" md="6">
                                                        <v-card class="pa-3">
                                                            <v-row>
                                                                <v-col cols="6">
                                                                    <v-text-field v-model="stat.value" label="Değer"
                                                                        hint="Örn: 10+"></v-text-field>
                                                                </v-col>
                                                                <v-col cols="6">
                                                                    <v-text-field v-model="stat.label" label="Etiket"
                                                                        hint="Örn: Yıllık Tecrübe"></v-text-field>
                                                                </v-col>
                                                            </v-row>
                                                            <div class="d-flex justify-end">
                                                                <v-btn color="error" @click="removeStat(sIndex)"
                                                                    size="small" density="compact">
                                                                    <v-icon>mdi-delete</v-icon>
                                                                </v-btn>
                                                            </div>
                                                        </v-card>
                                                    </v-col>
                                                </v-row>

                                                <v-btn color="secondary" prepend-icon="mdi-plus" @click="addStat"
                                                    variant="outlined" class="mt-3">
                                                    Yeni İstatistik Ekle
                                                </v-btn>
                                            </div>

                                            <!-- Values bölümü özel editörü -->
                                            <div v-if="activeSection.sectionName === 'values'">
                                                <h5 class="text-h6 mb-3">Değerler</h5>

                                                <v-expansion-panels variant="accordion" class="mb-4">
                                                    <v-expansion-panel
                                                        v-for="(value, vIndex) in activeSection.values || []"
                                                        :key="vIndex">
                                                        <v-expansion-panel-title>
                                                            <div class="d-flex align-center">
                                                                <v-icon class="mr-2">{{ value.icon || 'mdi-heart'
                                                                }}</v-icon>
                                                                {{ value.title || `Değer ${vIndex + 1}` }}
                                                            </div>
                                                        </v-expansion-panel-title>
                                                        <v-expansion-panel-text>
                                                            <v-row>
                                                                <v-col cols="12" md="6">
                                                                    <v-text-field v-model="value.title"
                                                                        label="Başlık"></v-text-field>
                                                                </v-col>
                                                                <v-col cols="12" md="6">
                                                                    <v-text-field v-model="value.icon"
                                                                        label="İkon (mdi-heart gibi)"></v-text-field>
                                                                </v-col>
                                                                <v-col cols="12">
                                                                    <v-textarea v-model="value.description"
                                                                        label="Açıklama" rows="3"></v-textarea>
                                                                </v-col>
                                                                <v-col cols="12" class="d-flex justify-end">
                                                                    <v-btn color="error" @click="removeValue(vIndex)"
                                                                        size="small">
                                                                        <v-icon left>mdi-delete</v-icon> Değeri Sil
                                                                    </v-btn>
                                                                </v-col>
                                                            </v-row>
                                                        </v-expansion-panel-text>
                                                    </v-expansion-panel>
                                                </v-expansion-panels>

                                                <v-btn color="secondary" prepend-icon="mdi-plus-circle"
                                                    @click="addValue" variant="outlined">
                                                    Yeni Değer Ekle
                                                </v-btn>
                                            </div>

                                        </div>

                                        <!-- Yeni bölüm ekle -->
                                        <v-card
                                            v-if="!activeSectionIndex && editForm.sections.length < availableSectionTypes.length"
                                            class="mb-4 pa-3 bg-grey-lighten-4">
                                            <v-card-text>
                                                <v-select v-model="newSectionType" :items="availableSectionTypes.filter(type =>
                                                    !editForm.sections.some(s => s.sectionName === type.value)
                                                )" label="Yeni Bölüm Tipi" item-title="title"
                                                    item-value="value"></v-select>
                                                <v-btn color="secondary" prepend-icon="mdi-plus" @click="addSection"
                                                    :disabled="!newSectionType" variant="outlined" class="mt-3">
                                                    Yeni Bölüm Ekle
                                                </v-btn>
                                            </v-card-text>
                                        </v-card>

                                        <div class="d-flex mt-6">
                                            <v-spacer></v-spacer>
                                            <v-btn color="error" class="mr-2" @click="cancelEdit">İptal</v-btn>
                                            <v-btn color="primary" type="submit" :loading="isLoading">Değişiklikleri
                                                Kaydet</v-btn>
                                        </div>
                                    </v-form>
                                </template>
                            </v-window-item>
                        </v-window>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Yeni İçerik Oluşturma Dialog -->
        <v-dialog v-model="showCreateDialog" max-width="600">
            <v-card>
                <v-card-title>Yeni Sayfa İçeriği Oluştur</v-card-title>
                <v-card-text>
                    <v-form @submit.prevent="createPage">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-select v-model="createForm.pageName" label="Sayfa Tipi" :items="pageTypes"
                                    item-title="title" item-value="value" hint="Oluşturulacak sayfa tipini seçin"
                                    required></v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="createForm.title" label="Başlık" required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-select v-model="createForm.status" label="Durum" :items="[
                                    { title: 'Yayında', value: 'published' },
                                    { title: 'Taslak', value: 'draft' }
                                ]" required></v-select>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="showCreateDialog = false">İptal</v-btn>
                    <v-btn color="primary" @click="createPage" :loading="isLoading">Oluştur</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Silme Onayı Dialog -->
        <v-dialog v-model="showDeleteDialog" max-width="500">
            <v-card>
                <v-card-title>Sayfa İçeriğini Sil</v-card-title>
                <v-card-text>
                    <p>{{ getPageTitle(deletePageName) }} sayfasının içeriğini silmek istediğinizden emin misiniz? Bu
                        işlem geri
                        alınamaz.</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" @click="showDeleteDialog = false">İptal</v-btn>
                    <v-btn color="error" @click="deletePage" :loading="isLoading">Sil</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Bildirim Snackbar -->
        <v-snackbar v-model="showSnackbar" :color="snackbarColor" timeout="3000">
            {{ snackbarText }}
            <template v-slot:actions>
                <v-btn color="white" variant="text" @click="showSnackbar = false">Kapat</v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { usePageContentStore } from '~/stores/pageContent'

const pageContentStore = usePageContentStore()

// Durum değişkenleri
const activeTab = ref('pages')
const selectedPage = ref(null)
const showCreateDialog = ref(false)
const showDeleteDialog = ref(false)
const deletePageName = ref('')
const showSnackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')
const imageUploading = ref(false) // Resim yükleme durumu için

// Bölüm düzenleme için değişkenler
const activeSectionIndex = ref(null)  // Seçili bölümün indeksi
const activeSection = ref(null)       // Seçili bölüm verisi
const newSectionType = ref(null)      // Yeni eklenecek bölüm tipi

// Sayfa tipleri
const pageTypes = [
    { title: 'Ana Sayfa', value: 'index' },
    { title: 'Hakkımızda', value: 'hakkimizda' }
]

// Bölüm tipleri
const sectionTypes = {
    index: [
        { title: 'Hero Bölümü', value: 'hero' },
        { title: 'Özellikler', value: 'features' },
        { title: 'Haberler', value: 'news' },
        { title: 'Galeri', value: 'gallery' }
    ],
    hakkimizda: [
        { title: 'Başlık', value: 'header' },
        { title: 'Vizyon', value: 'vision' },
        { title: 'Misyon', value: 'mission' },
        { title: 'İstatistikler', value: 'stats' },
        { title: 'Ekip', value: 'team' },
        { title: 'Değerler', value: 'values' }
    ],
    // Diğer sayfalar...
}

// Varsayılan şablonlar
const defaultTemplates = {
    team: {
        members: [
            {
                name: 'Ahmet Yılmaz',
                position: 'CEO & Kurucu',
                description: '15 yıllık sektör tecrübesi ile şirketimizi yönetiyor.',
                image: 'https://cdn.pixabay.com/photo/2019/11/10/11/13/businessman-4615724_1280.jpg',
                social: [
                    { icon: 'mdi-linkedin', link: '#' },
                    { icon: 'mdi-twitter', link: '#' }
                ]
            }
        ]
    },
    features: {
        features: [
            { icon: 'mdi-pine-tree', title: 'Doğal Güzellikler', description: 'Eşsiz manzaralar ve temiz hava' },
            { icon: 'mdi-food', title: 'Yerel Lezzetler', description: 'Yöresel mutfak kültürü' }
        ]
    },
    stats: {
        stats: [
            { value: '10+', label: 'Yıllık Tecrübe' },
            { value: '500+', label: 'Mutlu Müşteri' }
        ]
    },
    values: {
        values: [
            {
                icon: 'mdi-shield-check',
                title: 'Güvenilirlik',
                description: 'Verdiğimiz sözleri tutarız, gizlilik ve güvenlik en önemli önceliklerimizdir.'
            },
            {
                icon: 'mdi-lightbulb',
                title: 'Yenilikçilik',
                description: 'Teknoloji ve trendleri yakından takip eder, sürekli gelişime önem veririz.'
            }
        ]
    }
}

// Seçili sayfa için kullanılabilir bölüm tipleri
const availableSectionTypes = computed(() => {
    if (!selectedPage.value) return []

    const pageType = selectedPage.value.pageName
    return sectionTypes[pageType] || []
})

// Seçili sayfa için mevcut bölümleri gösteren dropdown seçenekleri
const sectionSelectItems = computed(() => {
    if (!editForm.sections) return []

    return [
        { title: 'Yeni Bölüm Ekle...', value: null },
        ...editForm.sections.map((section, index) => ({
            title: getSectionTitle(section.sectionName),
            value: index
        }))
    ]
})

// Form verileri
const createForm = reactive({
    pageName: '',
    title: '',
    status: 'published',
})

const editForm = reactive({
    title: '',
    status: 'published',
    sections: []
})

// Özel editör gerektiren bölüm tiplerini kontrol et
const isSectionTypeWithSpecialEditor = (sectionName) => {
    return ['team', 'features', 'stats', 'values'].includes(sectionName)
}

// Sayfa adını okunabilir hale getir
const getPageTitle = (pageName) => {
    const page = pageTypes.find(p => p.value === pageName)
    return page ? page.title : pageName
}

// Bölüm adını okunabilir hale getir
const getSectionTitle = (sectionName) => {
    if (!selectedPage.value) return sectionName

    const pageType = selectedPage.value.pageName
    const section = sectionTypes[pageType]?.find(s => s.value === sectionName)

    return section ? section.title : sectionName
}

// İçerikleri yükle
onMounted(async () => {
    await loadPageContents()
})

// Tüm sayfa içeriklerini yükle
const loadPageContents = async () => {
    await pageContentStore.fetchAllPageContents()
}

// Sayfa listesi
const pagesList = computed(() => {
    // pageContents objesini diziye çevir
    const pages = Object.values(pageContentStore.pageContents)
    return pages.sort((a, b) => a.pageName.localeCompare(b.pageName))
})

// Yükleniyor durumu
const isLoading = computed(() => pageContentStore.isLoading)

// Sayfa seçimi
const selectPage = (page) => {
    selectedPage.value = page

    // Form verilerini doldur
    editForm.title = page.title
    editForm.status = page.status
    editForm.sections = JSON.parse(JSON.stringify(page.sections)) // Deep copy

    // Bölüm seçimini sıfırla
    activeSectionIndex.value = null
    activeSection.value = null

    // Düzenleme sekmesine geç
    activeTab.value = 'edit'
}

// Bölüm seçimi
const selectSection = (index) => {
    if (index === null) {
        activeSection.value = null
        return
    }

    // Bölümü kopyala (referans sorunlarını önlemek için)
    activeSection.value = editForm.sections[index]

    // Bölüm tipine göre varsayılan verileri ekle (eğer yoksa)
    if (activeSection.value.sectionName === 'team' && !activeSection.value.members) {
        activeSection.value.members = JSON.parse(JSON.stringify(defaultTemplates.team.members))
    }
    else if (activeSection.value.sectionName === 'features' && !activeSection.value.features) {
        activeSection.value.features = JSON.parse(JSON.stringify(defaultTemplates.features.features))
    }
    else if (activeSection.value.sectionName === 'stats' && !activeSection.value.stats) {
        activeSection.value.stats = JSON.parse(JSON.stringify(defaultTemplates.stats.stats))
    }
    else if (activeSection.value.sectionName === 'values' && !activeSection.value.values) {
        activeSection.value.values = JSON.parse(JSON.stringify(defaultTemplates.values.values))
    }
}

// Bölüm Ekleme
const addSection = () => {
    if (!newSectionType.value) return

    // Yeni bölüm şablonunu oluştur
    const newSection = {
        sectionName: newSectionType.value,
        title: '',
        subtitle: '',
        content: '',
        imageUrl: ''
    }

    // Özel bölüm tipleri için varsayılan verileri ekle
    if (newSectionType.value === 'team') {
        newSection.members = JSON.parse(JSON.stringify(defaultTemplates.team.members))
    }
    else if (newSectionType.value === 'features') {
        newSection.features = JSON.parse(JSON.stringify(defaultTemplates.features.features))
    }
    else if (newSectionType.value === 'stats') {
        newSection.stats = JSON.parse(JSON.stringify(defaultTemplates.stats.stats))
    }
    else if (newSectionType.value === 'values') {
        newSection.values = JSON.parse(JSON.stringify(defaultTemplates.values.values))
    }

    // Bölümü ekle
    editForm.sections.push(newSection)

    // Yeni eklenen bölümü seç
    activeSectionIndex.value = editForm.sections.length - 1
    selectSection(activeSectionIndex.value)

    // Seçiciyi sıfırla
    newSectionType.value = null
}

// Ekip üyesi ekleme
const addTeamMember = () => {
    if (!activeSection.value.members) {
        activeSection.value.members = []
    }

    activeSection.value.members.push({
        name: '',
        position: '',
        description: '',
        image: '',
        social: []
    })
}

// Ekip üyesi silme
const removeTeamMember = (index) => {
    activeSection.value.members.splice(index, 1)
}

// Özellik ekleme
const addFeature = () => {
    if (!activeSection.value.features) {
        activeSection.value.features = []
    }

    activeSection.value.features.push({
        icon: 'mdi-star',
        title: '',
        description: ''
    })
}

// Özellik silme
const removeFeature = (index) => {
    activeSection.value.features.splice(index, 1)
}

// İstatistik ekleme
const addStat = () => {
    if (!activeSection.value.stats) {
        activeSection.value.stats = []
    }

    activeSection.value.stats.push({
        value: '',
        label: ''
    })
}

// İstatistik silme
const removeStat = (index) => {
    activeSection.value.stats.splice(index, 1)
}

// Değer ekleme
const addValue = () => {
    if (!activeSection.value.values) {
        activeSection.value.values = []
    }

    activeSection.value.values.push({
        icon: 'mdi-heart',
        title: '',
        description: ''
    })
}

// Değer silme
const removeValue = (index) => {
    activeSection.value.values.splice(index, 1)
}

// Düzenlemeyi İptal Et
const cancelEdit = () => {
    selectedPage.value = null
    activeSection.value = null
    activeSectionIndex.value = null
    activeTab.value = 'pages'
}

// Sayfa Güncelleme
const updatePage = async () => {
    // Formdan gelen verileri hazırla
    const updateData = {
        title: editForm.title,
        sections: editForm.sections,
        status: editForm.status
    }

    // Store'a gönder
    const result = await pageContentStore.updatePageContent(selectedPage.value.pageName, updateData)

    if (result.success) {
        showNotification('Sayfa içeriği başarıyla güncellendi', 'success')
        activeTab.value = 'pages' // Listeye dön
    } else {
        showNotification(result.message, 'error')
    }
}

// Yeni Sayfa Oluşturma
const createPage = async () => {
    // Validasyon
    if (!createForm.pageName || !createForm.title) {
        showNotification('Lütfen tüm gerekli alanları doldurun', 'error')
        return
    }

    // Formdan gelen verileri hazırla
    const pageData = {
        pageName: createForm.pageName,
        title: createForm.title,
        status: createForm.status,
        sections: [] // Boş bölümler listesi ile başla
    }

    // Store'a gönder
    const result = await pageContentStore.createPageContent(pageData)

    if (result.success) {
        showNotification('Sayfa içeriği başarıyla oluşturuldu', 'success')
        showCreateDialog.value = false

        // Formu temizle
        createForm.pageName = ''
        createForm.title = ''
        createForm.status = 'published'

        // Oluşturulan sayfayı seç ve düzenleme moduna geç
        selectPage(result.pageContent)
    } else {
        showNotification(result.message, 'error')
    }
}

// Silme Onay Dialogunu Göster
const showDeleteConfirmation = (page) => {
    deletePageName.value = page.pageName
    showDeleteDialog.value = true
}

// Sayfa Silme
const deletePage = async () => {
    // Store'a gönder
    const result = await pageContentStore.deletePageContent(deletePageName.value)

    if (result.success) {
        showNotification('Sayfa içeriği başarıyla silindi', 'success')
        showDeleteDialog.value = false

        // Eğer seçili sayfa silinen sayfaysa, seçimi temizle
        if (selectedPage.value && selectedPage.value.pageName === deletePageName.value) {
            selectedPage.value = null
            activeTab.value = 'pages'
        }
    } else {
        showNotification(result.message, 'error')
    }
}

// Bildirim Gösterme
const showNotification = (text, color) => {
    snackbarText.value = text
    snackbarColor.value = color
    showSnackbar.value = true
}

// Resim yükleme
const handleImageUpload = async () => {
    if (!activeSection.value || !activeSection.value.imageFile) return
    
    const file = activeSection.value.imageFile
    
    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Dosya boyutu 5MB\'ı geçemez!', 'error')
        activeSection.value.imageFile = null
        return
    }
    
    imageUploading.value = true
    
    try {
        const formData = new FormData()
        formData.append('image', file)
        
        // API'ye yükleme isteği
        const response = await $fetch('/api/upload', {
            method: 'POST',
            body: formData
        })
        
        if (response.success && response.imageUrl) {
            activeSection.value.imageUrl = response.imageUrl
            showNotification('Görsel başarıyla yüklendi', 'success')
        } else {
            showNotification('Görsel yüklenirken bir hata oluştu', 'error')
        }
    } catch (error) {
        console.error('Görsel yükleme hatası:', error)
        showNotification('Görsel yüklenirken bir hata oluştu', 'error')
    } finally {
        imageUploading.value = false
        // Yüklenen dosyayı temizleme
        activeSection.value.imageFile = null
    }
}

// Resim kaldırma
const removeImage = () => {
    if (confirm('Bu görseli kaldırmak istediğinizden emin misiniz?')) {
        activeSection.value.imageUrl = ''
    }
}
</script>

<style scoped>
.section-item {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #f9f9f9;
}

.section-editor {
    background-color: #f5f5f5;
    border-color: #e0e0e0 !important;
}

.selected-row {
    background-color: rgba(9, 194, 86, 0.1);
}
</style>