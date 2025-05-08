<template>
    <nav class="navbar">
        <v-app-bar elevation="1" class="green-gradient">
            <v-container class="d-flex align-center">
                <!-- Logo -->
                <v-btn to="/" variant="text" class="text-h5 font-weight-bold mr-4 text-white">
                    LOGO
                </v-btn>

                <!-- Desktop Menu -->
                <v-tabs v-model="activeTab" color="white" class="hidden-sm-and-down ml-4" grow>
                    <v-tab v-for="item in menuItems" :key="item.path" :to="item.path" :value="item.path"
                        class="text-subtitle-1 font-weight-medium text-none px-6 text-white" style="min-width: 120px;">
                        {{ item.title }}
                    </v-tab>
                </v-tabs>

                <!-- Mobile Menu Button -->
                <v-app-bar-nav-icon class="hidden-md-and-up ml-auto white--text"
                    @click="isDrawerOpen = !isDrawerOpen"></v-app-bar-nav-icon>
            </v-container>
        </v-app-bar>

        <!-- Mobile Navigation Drawer -->
        <v-navigation-drawer v-model="isDrawerOpen" location="right" temporary>
            <v-list>
                <v-list-item v-for="item in menuItems" :key="item.path" :to="item.path" :value="item.path"
                    color="primary" class="mb-2">
                    <v-list-item-title class="text-h6 font-weight-medium py-2">
                        {{ item.title }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </nav>
</template>

<script setup>
const activeTab = ref(null)
const isDrawerOpen = ref(false)

const menuItems = [
    { title: 'Ana Sayfa', path: '/' },
    { title: 'Gündem', path: '/gundem' },
    { title: 'Galeri', path: '/galeri' },
    { title: 'Etkinlikler', path: '/etkinlikler' },
    { title: 'Hakkımızda', path: '/hakkimizda' },
    { title: 'İletişim', path: '/iletisim' }
]

// Aktif sayfayı takip et
onMounted(() => {
    const route = useRoute()
    activeTab.value = route.path
})
</script>

<style scoped>
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
}

.green-gradient {
    background: linear-gradient(90deg, #0ae465, #0c7c35);
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

.v-list-item-title {
    text-align: center;
}
</style>