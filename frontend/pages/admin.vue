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
                            class="mb-3 menu-item" :prepend-icon="item.icon" color="white" rounded="xl"
                            :class="{ 'active-item': currentSection === item.value }">
                        </v-list-item>
                    </v-list>
                    <div class="user-section pa-4">
                        <v-avatar size="40" color="rgba(255, 255, 255, 0.2)" class="mr-3">
                            <v-icon color="white">mdi-account</v-icon>
                        </v-avatar>
                        <div>
                            <div class="text-subtitle-2 white--text font-weight-medium">{{ authStore.user?.firstName ||
                                'Admin' }}</div>
                            <div class="text-caption white--text text-opacity-75">{{ authStore.user?.role || 'Yönetici'
                                }}</div>
                        </div>
                        <v-spacer></v-spacer>
                        <v-btn icon color="white" class="logout-btn" @click="handleLogout">
                            <v-icon>mdi-logout-variant</v-icon>
                        </v-btn>
                    </div>
                </v-card>
            </v-col>

            <!-- Ana İçerik -->
            <v-col cols="12" md="10" class="main-content">
                <v-container class="pa-6">
                    <!-- Üst Bilgi Çubuğu -->
                    <v-card class="mb-6 header-card" elevation="3" rounded="xl" color="secondary">
                        <v-card-text class="py-4">
                            <v-row align="center">
                                <v-col cols="6">
                                    <div class="d-flex align-center">
                                        <div class="header-icon-container mr-3">
                                            <v-icon size="30" color="white">{{ getCurrentSectionIcon }}</v-icon>
                                        </div>
                                        <h2 class="text-h4 font-weight-bold white--text">{{ getCurrentSectionTitle }}
                                        </h2>
                                    </div>
                                </v-col>
                                <v-col cols="6" class="text-right">
                                    <v-btn color="primary" prepend-icon="mdi-refresh" @click="refreshData"
                                        :loading="isLoading" rounded="pill" elevation="2" class="px-6 refresh-btn"
                                        size="large">
                                        Yenile
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>

                    <!-- İstatistik Kartları -->
                    <v-row class="mb-6 stats-row">
                        <v-col cols="12" md="4" class="fade-in-item">
                            <v-card class="stat-card rounded-xl" elevation="3" color="info" dark>
                                <v-card-text class="pa-4">
                                    <div class="d-flex align-center">
                                        <v-avatar size="54" class="mr-4 stat-icon" color="rgba(255, 255, 255, 0.2)">
                                            <v-icon color="white" size="30">mdi-account-group</v-icon>
                                        </v-avatar>
                                        <div>
                                            <div class="text-body-1 font-weight-medium mb-1">Ziyaretçiler</div>
                                            <div class="text-h4 font-weight-bold counter-animation">{{
                                                statisticStore.getStatistics?.visitorCount || 0 }}</div>
                                        </div>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="4" class="fade-in-item" style="animation-delay: 0.2s;">
                            <v-card class="stat-card rounded-xl" elevation="3" color="success" dark>
                                <v-card-text class="pa-4">
                                    <div class="d-flex align-center">
                                        <v-avatar size="54" class="mr-4 stat-icon" color="rgba(255, 255, 255, 0.2)">
                                            <v-icon color="white" size="30">mdi-image-multiple</v-icon>
                                        </v-avatar>
                                        <div>
                                            <div class="text-body-1 font-weight-medium mb-1">Toplam Fotoğraf</div>
                                            <div class="text-h4 font-weight-bold counter-animation">{{
                                                statisticStore.getStatistics?.photoCount || 0 }}</div>
                                        </div>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="4" class="fade-in-item" style="animation-delay: 0.4s;">
                            <v-card class="stat-card rounded-xl" elevation="3" color="warning" dark>
                                <v-card-text class="pa-4">
                                    <div class="d-flex align-center">
                                        <v-avatar size="54" class="mr-4 stat-icon" color="rgba(255, 255, 255, 0.2)">
                                            <v-icon color="white" size="30">mdi-calendar-check</v-icon>
                                        </v-avatar>
                                        <div>
                                            <div class="text-body-1 font-weight-medium mb-1">Toplam Etkinlik</div>
                                            <div class="text-h4 font-weight-bold counter-animation">{{
                                                statisticStore.getStatistics?.eventCount || 0 }}</div>
                                        </div>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>

                    <!-- Dinamik İçerik -->
                    <v-fade-transition mode="out-in">
                        <v-card class="content-card rounded-xl" elevation="3" color="surface">
                            <v-card-text class="pa-6">
                                <AdminStatistics v-if="currentSection === 'statistics'" />
                                <AdminGallery v-if="currentSection === 'gallery'" />
                                <AdminEvent v-if="currentSection === 'events'" />
                                <AdminNews v-if="currentSection === 'news'" />
                                <AdminPendingAdmins v-if="currentSection === 'pending-admins'" />
                                <AdminPageContent v-if="currentSection === 'page-contents'" />
                            </v-card-text>
                        </v-card>
                    </v-fade-transition>
                </v-container>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
definePageMeta({
    middleware: 'auth'
})
import { usePhotoStore } from '@/stores/photo'
import { useEventStore } from '@/stores/event'
import { useStatisticStore } from '@/stores/statistic'
import { useNewsStore } from '@/stores/news'
import { useAuthStore } from '@/stores/auth'
import { usePageContentStore } from '@/stores/pageContent'
import { useRouter } from 'vue-router'
import AdminEvent from '~/components/adminEvent.vue'
import AdminGallery from '~/components/AdminGallery.vue'
import AdminStatistics from '~/components/AdminStatistics.vue'
import AdminNews from '~/components/AdminNews.vue'
import AdminPendingAdmins from '~/components/AdminPendingAdmins.vue'
import AdminPageContent from '~/components/AdminPageContent.vue'

const photoStore = usePhotoStore()
const eventStore = useEventStore()
const statisticStore = useStatisticStore()
const newsStore = useNewsStore()
const authStore = useAuthStore()
const pageContentStore = usePageContentStore()
const router = useRouter()

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
        icon: 'mdi-newspaper-plus'
    },
    {
        title: 'Sayfa İçerikleri',
        value: 'page-contents',
        icon: 'mdi-file-document-edit'
    },
    {
        title: 'Bekleyen Yöneticiler',
        value: 'pending-admins',
        icon: 'mdi-account-multiple-plus'
    }
]

// Genel state
const currentSection = ref('events')

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
    return statisticStore.isLoading || photoStore.isLoading || eventStore.isLoading || pageContentStore.isLoading
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
    } else if (currentSection.value === 'page-contents') {
        await pageContentStore.fetchAllPageContents()
    }
}

// Çıkış işlemi
const handleLogout = () => {
    authStore.logout()
    router.push('/login')
}

// Sayfa yüklendiğinde verileri getir
onMounted(async () => {
    if (!authStore.isAuthenticated) {
        authStore.checkAuth()
    }

    try {
        await Promise.all([
            statisticStore.fetchStatistics(),
            eventStore.fetchEvents(),
            photoStore.fetchPhotos()
        ])
    } catch (error) {
        console.error("Admin paneli verileri yüklenirken hata:", error)
    }
})
</script>

<style scoped>
.admin-sidebar {
    background: linear-gradient(135deg, #09c256, #0b7231) !important;
    min-height: 100vh;
    position: relative;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.brand-header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 24px 16px;
}

.sidebar-menu {
    background-color: transparent !important;
    padding-top: 20px;
}

.menu-item {
    margin: 4px 12px !important;
    border-radius: 12px !important;
    transition: all 0.3s ease;
    height: 48px;
    opacity: 0.8;
}

.menu-item:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
    opacity: 1;
}

.active-item {
    background-color: rgba(255, 255, 255, 0.15) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateX(8px);
    opacity: 1;
}

.logout-btn {
    transition: all 0.3s ease;
    opacity: 0.8;
}

.logout-btn:hover {
    transform: translateY(-3px);
    opacity: 1;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.main-content {
    background-color: #f8f9fa;
    min-height: 100vh;
}

.header-card {
    border-radius: 16px;
    background: linear-gradient(135deg, #37474f, #263238) !important;
    overflow: hidden;
    transition: all 0.3s ease;
}

.header-icon-container {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.content-card {
    background-color: #ffffff;
    min-height: 60vh;
    border-radius: 16px;
    transition: all 0.3s ease;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05) !important;
    color: #333;
}

.stat-card {
    transition: all 0.3s ease;
    border-radius: 16px;
    overflow: hidden;
}

.stat-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1) !important;
}

.stat-icon {
    transition: all 0.3s ease;
}

.stat-card:hover .stat-icon {
    transform: scale(1.1);
}

.refresh-btn {
    transition: all 0.3s ease;
    background: linear-gradient(135deg, #09c256, #0b7231) !important;
}

.refresh-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(9, 194, 86, 0.3) !important;
}

.user-section {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.2);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 16px;
}

.fade-in-item {
    animation: fadeInUp 0.6s ease forwards;
    opacity: 0;
}

.counter-animation {
    animation: countUp 2s ease-out forwards;
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

@keyframes countUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 960px) {
    .admin-sidebar {
        min-height: auto;
    }

    .user-section {
        position: relative;
    }

    .stats-row {
        margin-bottom: 20px;
    }

    .stat-card {
        margin-bottom: 16px;
    }
}
</style>