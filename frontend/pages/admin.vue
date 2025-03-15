<template>
    <v-container fluid class="pa-0">
        <v-row no-gutters>
            <!-- Sol Menü -->
            <v-col cols="12" md="2">
                <v-card flat class="h-100 admin-sidebar" elevation="4">
                    <div class="d-flex align-center pa-4 brand-header">
                        <v-icon color="white" size="32" class="mr-2">mdi-shield-crown</v-icon>
                        <span class="text-h6 white--text font-weight-bold">Admin Paneli</span>
                    </div>
                    <v-divider color="rgba(255, 255, 255, 0.1)"></v-divider>
                    <v-list class="sidebar-menu py-4">
                        <v-list-item v-for="(item, i) in menuItems" :key="i" :value="item" :title="item.title"
                            @click="currentSection = item.value" :active="currentSection === item.value"
                            active-color="white" class="mb-3 menu-item" :prepend-icon="item.icon" color="white"
                            rounded="xl" :class="{ 'active-item': currentSection === item.value }">
                        </v-list-item>
                    </v-list>
                    <div class="user-section pa-4">
                        <v-avatar size="40" color="rgba(255, 255, 255, 0.2)" class="mr-3">
                            <v-icon color="white">mdi-account</v-icon>
                        </v-avatar>
                        <div>
                            <div class="text-subtitle-2 white--text font-weight-medium">Admin</div>
                            <div class="text-caption white--text text-opacity-75">Yönetici</div>
                        </div>
                    </div>
                </v-card>
            </v-col>

            <!-- Ana İçerik -->
            <v-col cols="12" md="10" class="main-content">
                <v-container class="pa-6">
                    <!-- Üst Bilgi Çubuğu -->
                    <v-card class="mb-6 header-card" elevation="2" rounded="lg" color="secondary">
                        <v-card-text>
                            <v-row align="center">
                                <v-col cols="6">
                                    <div class="d-flex align-center">
                                        <v-icon size="30" color="white" class="mr-3">{{ getCurrentSectionIcon
                                            }}</v-icon>
                                        <h2 class="text-h4 font-weight-bold white--text">{{ getCurrentSectionTitle }}
                                        </h2>
                                    </div>
                                </v-col>
                                <v-col cols="6" class="text-right">
                                    <v-btn color="primary" prepend-icon="mdi-refresh" @click="refreshData"
                                        :loading="isLoading" rounded="pill" elevation="2" class="px-6" dark>
                                        Yenile
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>

                    <!-- Dinamik İçerik -->
                    <v-fade-transition mode="out-in">
                        <v-card class="content-card" rounded="lg" elevation="1" color="surface">
                            <v-card-text class="pa-6">
                                <AdminStatistics v-if="currentSection === 'statistics'" />
                                <AdminGallery v-if="currentSection === 'gallery'" />
                                <AdminEvent v-if="currentSection === 'events'" />
                                <AdminNews v-if="currentSection === 'news'" />
                            </v-card-text>
                        </v-card>
                    </v-fade-transition>

                    <!-- Alt Bilgi Kartları -->
                    <v-row class="mt-6">
                        <v-col cols="12" md="4">
                            <v-card class="info-card" rounded="lg" elevation="1" color="info" dark>
                                <v-card-text class="pa-4">
                                    <div class="d-flex align-center">
                                        <v-avatar size="42" class="mr-3" color="rgba(255, 255, 255, 0.2)">
                                            <v-icon color="white">mdi-account-group</v-icon>
                                        </v-avatar>
                                        <div>
                                            <div class="text-body-1 font-weight-medium">Ziyaretçiler</div>
                                            <div class="text-h5 font-weight-bold">{{
                                                statisticStore.getStatistics?.visitorCount || 0 }}</div>
                                        </div>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-card class="info-card" rounded="lg" elevation="1" color="success" dark>
                                <v-card-text class="pa-4">
                                    <div class="d-flex align-center">
                                        <v-avatar size="42" class="mr-3" color="rgba(255, 255, 255, 0.2)">
                                            <v-icon color="white">mdi-image-multiple</v-icon>
                                        </v-avatar>
                                        <div>
                                            <div class="text-body-1 font-weight-medium">Toplam Fotoğraf</div>
                                            <div class="text-h5 font-weight-bold">{{
                                                statisticStore.getStatistics?.photoCount || 0 }}</div>
                                        </div>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-card class="info-card" rounded="lg" elevation="1" color="warning" dark>
                                <v-card-text class="pa-4">
                                    <div class="d-flex align-center">
                                        <v-avatar size="42" class="mr-3" color="rgba(255, 255, 255, 0.2)">
                                            <v-icon color="white">mdi-calendar-check</v-icon>
                                        </v-avatar>
                                        <div>
                                            <div class="text-body-1 font-weight-medium">Toplam Etkinlik</div>
                                            <div class="text-h5 font-weight-bold">{{
                                                statisticStore.getStatistics?.eventCount || 0 }}</div>
                                        </div>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { usePhotoStore } from '@/stores/photo'
import { useEventStore } from '@/stores/event'
import { useStatisticStore } from '@/stores/statistic'
import AdminEvent from '~/components/adminEvent.vue'
import AdminGallery from '~/components/AdminGallery.vue'
import AdminStatistics from '~/components/AdminStatistics.vue'
import AdminNews from '~/components/AdminNews.vue'

const photoStore = usePhotoStore()
const eventStore = useEventStore()
const statisticStore = useStatisticStore()
const newsStore = useNewsStore()

// Menü öğeleri
const menuItems = [
    {
        title: 'İstatistikler',
        value: 'statistics',
        icon: 'mdi-chart-box'
    },
    {
        title: 'Galeri Yönetimi',
        value: 'gallery',
        icon: 'mdi-image'
    },
    {
        title: 'Etkinlik Yönetimi',
        value: 'events',
        icon: 'mdi-calendar'
    },
    {
        title: 'Haber Yönetimi',
        value: 'news',
        icon: 'mdi-newspaper'
    }
]

// Genel state
const currentSection = ref('statistics')

// Computed properties
const getCurrentSectionTitle = computed(() => {
    const currentItem = menuItems.find(item => item.value === currentSection.value)
    return currentItem ? currentItem.title : ''
})

const getCurrentSectionIcon = computed(() => {
    const currentItem = menuItems.find(item => item.value === currentSection.value)
    return currentItem ? currentItem.icon : ''
})

const isLoading = computed(() => {
    return statisticStore.isLoading || photoStore.isLoading || eventStore.isLoading
})

// Methods
const refreshData = async () => {
    if (currentSection.value === 'statistics') {
        await statisticStore.fetchStatistics()
    } else if (currentSection.value === 'gallery') {
        await photoStore.fetchPhotos()
    } else if (currentSection.value === 'events') {
        await eventStore.fetchEvents()
    } else if (currentSection.value === 'news') {
        await newsStore.fetchNews()
    }
}

// Sayfa yüklendiğinde istatistikleri getir
onMounted(async () => {
    await statisticStore.fetchStatistics()
})
</script>

<style scoped>
.admin-sidebar {
    background: linear-gradient(135deg, #52f852, #0060f1) !important;
    min-height: 100vh;
    position: relative;
}

.brand-header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-menu {
    background-color: transparent !important;
}

.menu-item {
    margin: 4px 12px !important;
    border-radius: 12px !important;
    transition: all 0.3s ease;
}

.active-item {
    background-color: rgba(255, 255, 255, 0.15) !important;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateX(4px);
}

.v-list-item--active {
    background-color: rgba(255, 255, 255, 0.15) !important;
}

.main-content {
    background-color: #ffffff;
    min-height: 100vh;
}

.header-card {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.content-card {
    background-color: #37474f;
    min-height: 70vh;
    color: white;
}

.user-section {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.2);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.info-card {
    transition: transform 0.3s;
}

.info-card:hover {
    transform: translateY(-5px);
}
</style>