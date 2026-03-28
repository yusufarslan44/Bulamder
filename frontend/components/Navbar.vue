<template>
    <nav class="navbar">
        <v-app-bar elevation="1" height="76" :class="isBlackWhite ? 'dark-gradient' : 'green-gradient'">
            <v-container class="d-flex align-center nav-content">
                <!-- Logo -->
                <v-btn to="/" variant="text" class="text-h5 font-weight-bold mr-4 text-white logo-btn px-2" :ripple="false" exact>
                    <span class="logo-stack">
                        <img :src="logoSrc" alt="BULAMDER Logo" class="logo-img">
                    </span>
                </v-btn>

                <!-- Desktop Menu -->
                <v-tabs v-model="activeTab" color="white" class="hidden-sm-and-down ml-4 nav-tabs" grow>
                    <v-tab v-for="item in menuItems" :key="item.path" :to="item.path" :value="item.path"
                        class="text-subtitle-1 font-weight-medium text-none text-white menu-tab">
                        {{ item.title }}
                    </v-tab>
                </v-tabs>

                <!-- Theme Toggle Button (Desktop) -->
                <v-btn
                    variant="outlined"
                    size="small"
                    class="ml-3 hidden-sm-and-down theme-toggle-btn"
                    :title="isBlackWhite ? 'Aydınlık Temaya Geç' : 'Karanlık Temaya Geç'"
                    @click="toggleTheme"
                    rounded="pill"
                >
                    <v-icon size="16" class="mr-1">{{ isBlackWhite ? 'mdi-weather-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
                    <span class="text-caption font-weight-bold">{{ isBlackWhite ? 'Aydınlık' : 'Karanlık' }}</span>
                </v-btn>

                <!-- Mobile Menu Button -->
                <v-app-bar-nav-icon class="hidden-md-and-up ml-auto white--text"
                    @click="isDrawerOpen = !isDrawerOpen"></v-app-bar-nav-icon>
            </v-container>
        </v-app-bar>

        <!-- Mobile Navigation Drawer -->
        <v-navigation-drawer
            v-model="isDrawerOpen"
            location="right"
            temporary
            width="320"
            class="mobile-drawer"
        >
            <div class="mobile-drawer-inner">
                <div class="mobile-drawer-top">
                    <div class="mobile-brand">
                        <img :src="logoSrc" alt="BULAMDER Logo" class="mobile-brand-logo">
                        <div>
                            <div class="mobile-brand-title">BULAMDER</div>
                            <div class="mobile-brand-subtitle">Hızlı Erişim</div>
                        </div>
                    </div>
                    <v-btn icon variant="text" size="small" class="mobile-close-btn" @click="closeDrawer">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </div>

                <v-list nav class="mobile-menu-list">
                    <v-list-item
                        v-for="item in menuItems"
                        :key="item.path"
                        :to="item.path"
                        rounded="xl"
                        class="mobile-menu-item mb-2"
                        :class="{ 'mobile-menu-item-active': activeTab === item.path }"
                        @click="closeDrawer"
                    >
                        <template #prepend>
                            <v-icon :icon="item.icon" class="mobile-menu-icon"></v-icon>
                        </template>
                        <v-list-item-title class="mobile-menu-title">
                            {{ item.title }}
                        </v-list-item-title>
                        <v-list-item-subtitle class="mobile-menu-subtitle">
                            {{ item.description }}
                        </v-list-item-subtitle>
                        <template #append>
                            <v-icon size="18" class="mobile-menu-arrow">mdi-chevron-right</v-icon>
                        </template>
                    </v-list-item>
                </v-list>

                <div class="mobile-drawer-footer">
                    <v-btn
                        block
                        rounded="xl"
                        class="mobile-theme-toggle"
                        @click="toggleTheme"
                    >
                        <v-icon size="18" class="mr-2">{{ isBlackWhite ? 'mdi-weather-sunny' : 'mdi-moon-waning-crescent' }}</v-icon>
                        {{ isBlackWhite ? 'Aydınlık Temaya Geç' : 'Karanlık Temaya Geç' }}
                    </v-btn>
                </div>
            </div>
        </v-navigation-drawer>
    </nav>
</template>

<script setup>
const activeTab = ref(null)
const isDrawerOpen = ref(false)
const { isBlackWhite, toggleTheme } = useBlackWhiteTheme()
const logoSrc = computed(() => '/Gemini_Generated_Image_adxwneadxwneadxw-Photoroom.png')
const route = useRoute()

const menuItems = [
    { title: 'Ana Sayfa', path: '/', icon: 'mdi-home-outline', description: 'Genel görünüm ve öne çıkanlar' },
    { title: 'Gündem', path: '/gundem', icon: 'mdi-newspaper-variant-outline', description: 'Haberler ve duyurular' },
    { title: 'Galeri', path: '/galeri', icon: 'mdi-image-multiple-outline', description: 'Fotoğraflar ve arşiv' },
    { title: 'Etkinlikler', path: '/etkinlikler', icon: 'mdi-calendar-month-outline', description: 'Takvim ve buluşmalar' },
    { title: 'Hakkımızda', path: '/hakkimizda', icon: 'mdi-information-outline', description: 'Dernek ve ekip bilgisi' },
    { title: 'İletişim', path: '/iletisim', icon: 'mdi-message-text-outline', description: 'Bize ulaşın' }
]

const closeDrawer = () => {
    isDrawerOpen.value = false
}

const handleOutsideClick = (event) => {
    if (!isDrawerOpen.value) {
        return
    }

    const target = event.target
    if (!(target instanceof Element)) {
        return
    }

    if (target.closest('.navbar') || target.closest('.mobile-drawer')) {
        return
    }

    closeDrawer()
}

onMounted(() => {
    document.addEventListener('click', handleOutsideClick)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleOutsideClick)
})

watch(
    () => route.path,
    (newPath) => {
        activeTab.value = newPath
        isDrawerOpen.value = false
    },
    { immediate: true }
)
</script>

<style scoped>
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
}

.nav-content {
    width: 100%;
}

.logo-btn {
    text-transform: none !important;
    letter-spacing: 0.3px;
    min-width: 92px;
    height: auto !important;
    flex: 0 0 auto;
    z-index: 2;
    border-radius: 14px;
}

.logo-btn.v-btn--active,
.logo-btn.router-link-active,
.logo-btn.router-link-exact-active {
    background-color: transparent !important;
    box-shadow: none !important;
}

.logo-btn :deep(.v-btn__overlay),
.logo-btn :deep(.v-ripple__container) {
    display: none !important;
}

.logo-img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: none !important;
    filter: none !important;
    background: transparent !important;
}

.logo-stack {
    display: inline-flex;
    align-items: center;
}

/* Light tema navbar */
.green-gradient {
    background: linear-gradient(90deg, #0ae465, #0c7c35) !important;
}

/* Dark tema navbar */
.dark-gradient {
    background: linear-gradient(90deg, #0d1420 0%, #1a2640 100%) !important;
    border-bottom: 1px solid rgba(16, 185, 129, 0.18) !important;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.45) !important;
}

/* Tema toggle butonu */
.theme-toggle-btn {
    color: white !important;
    border-color: rgba(255, 255, 255, 0.4) !important;
    transition: all 0.3s ease;
    min-width: 100px;
}

.theme-toggle-btn:hover {
    background-color: rgba(255, 255, 255, 0.15) !important;
    border-color: rgba(255, 255, 255, 0.8) !important;
    transform: translateY(-1px);
}

.menu-tab {
    min-width: 104px;
    padding-inline: 14px !important;
}

.nav-tabs {
    flex: 1 1 auto;
    min-width: 0;
}

.v-tab {
    letter-spacing: 0.5px;
    text-transform: none !important;
    transition: all 0.3s ease;
}

.v-tab:hover {
    background-color: rgba(22, 163, 74, 0.05);
    transform: translateY(-2px);
}

.v-tab--selected {
    font-weight: 600 !important;
}

.v-list-item:hover {
    background-color: rgba(22, 163, 74, 0.05);
}

.theme-toggle-item:hover {
    background-color: rgba(16, 185, 129, 0.08) !important;
}

.v-list-item-title {
    text-align: center;
}

.mobile-drawer-inner {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 12px;
    gap: 12px;
}

.mobile-drawer :deep(.v-navigation-drawer__content) {
    background: linear-gradient(180deg, #f3fdf6 0%, #ffffff 100%);
}

.mobile-drawer-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(135deg, rgba(10, 228, 101, 0.14), rgba(12, 124, 53, 0.08));
    border: 1px solid rgba(12, 124, 53, 0.14);
    border-radius: 16px;
    padding: 10px 12px;
}

.mobile-brand {
    display: flex;
    align-items: center;
    gap: 10px;
}

.mobile-brand-logo {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    object-fit: cover;
    box-shadow: none !important;
    filter: none !important;
    background: transparent !important;
}

.mobile-brand-title {
    font-weight: 700;
    font-size: 0.95rem;
    color: #0b7231;
    letter-spacing: 0.2px;
    line-height: 1.1;
}

.mobile-brand-subtitle {
    font-size: 0.75rem;
    color: #2f855a;
    opacity: 0.9;
}

.mobile-close-btn {
    color: #0b7231 !important;
}

.mobile-menu-list {
    padding: 4px !important;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.84);
    border: 1px solid rgba(16, 185, 129, 0.12);
}

.mobile-menu-item {
    min-height: 64px !important;
    padding-inline: 12px !important;
    transition: all 0.24s ease;
}

.mobile-menu-item:hover {
    transform: translateX(3px);
    background: rgba(16, 185, 129, 0.08);
}

.mobile-menu-item-active {
    background: linear-gradient(135deg, rgba(10, 228, 101, 0.22), rgba(12, 124, 53, 0.12));
    border: 1px solid rgba(12, 124, 53, 0.2);
}

.mobile-menu-icon {
    color: #0b7231;
}

.mobile-menu-title {
    text-align: left;
    font-size: 0.95rem;
    font-weight: 600;
    color: #12412b;
}

.mobile-menu-subtitle {
    text-align: left;
    font-size: 0.76rem;
    color: #2d6a4f;
    opacity: 0.85;
}

.mobile-menu-arrow {
    color: #0b7231;
    opacity: 0.6;
}

.mobile-drawer-footer {
    margin-top: auto;
    padding-top: 8px;
}

.mobile-theme-toggle {
    justify-content: center;
    color: #ffffff !important;
    background: linear-gradient(135deg, #0c7c35, #0ae465) !important;
    text-transform: none;
    font-weight: 600;
    letter-spacing: 0;
}

body.bw-theme .mobile-drawer :deep(.v-navigation-drawer__content) {
    background: linear-gradient(180deg, #101b2b 0%, #172437 100%);
}

body.bw-theme .mobile-drawer-top {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.18), rgba(14, 116, 144, 0.16));
    border-color: rgba(52, 211, 153, 0.28);
}

body.bw-theme .mobile-menu-list {
    background: rgba(20, 31, 48, 0.9);
    border-color: rgba(148, 163, 184, 0.2);
}

body.bw-theme .mobile-brand-title,
body.bw-theme .mobile-menu-title,
body.bw-theme .mobile-menu-icon,
body.bw-theme .mobile-menu-arrow,
body.bw-theme .mobile-close-btn {
    color: #d1fae5 !important;
}

body.bw-theme .mobile-brand-subtitle,
body.bw-theme .mobile-menu-subtitle {
    color: #a7f3d0 !important;
}

body.bw-theme .mobile-menu-item:hover {
    background: rgba(16, 185, 129, 0.12);
}

body.bw-theme .mobile-menu-item-active {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.22), rgba(30, 41, 59, 0.34));
    border-color: rgba(110, 231, 183, 0.24);
}

@media (max-width: 1264px) {
    .menu-tab {
        min-width: 92px;
        padding-inline: 10px !important;
        font-size: 0.9rem !important;
    }

    .theme-toggle-btn {
        min-width: 88px;
        padding-inline: 10px !important;
    }

    .logo-img {
        width: 62px;
        height: 62px;
    }
}
</style>
