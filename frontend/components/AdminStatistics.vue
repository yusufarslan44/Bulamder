<template>
    <div>
        <!-- İstatistik Kartları -->
        <v-row>
            <v-col cols="12" md="4" class="fade-in-item">
                <v-card class="stat-card rounded-xl" elevation="3" hover height="200">
                    <v-card-text class="pa-6">
                        <div class="d-flex align-center mb-4">
                            <div class="icon-container mr-3">
                                <v-icon color="white" size="32">mdi-account-group</v-icon>
                            </div>
                            <span class="text-h6 font-weight-bold">Ziyaretçi Sayısı</span>
                        </div>
                        <div class="d-flex align-center justify-center mt-6">
                            <span class="text-h2 font-weight-bold counter-animation">{{ statisticStore.getStatistics?.visitorCount || 0 }}</span>
                        </div>
                        <div class="text-center mt-2 text-medium-emphasis">
                            <v-chip size="small" color="primary" variant="flat" class="stat-chip">Bu hafta</v-chip>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="4" class="fade-in-item" style="animation-delay: 0.2s;">
                <v-card class="stat-card rounded-xl" elevation="3" hover height="200">
                    <v-card-text class="pa-6">
                        <div class="d-flex align-center mb-4">
                            <div class="icon-container mr-3" style="background: linear-gradient(135deg, #4CAF50, #2E7D32);">
                                <v-icon color="white" size="32">mdi-image-multiple</v-icon>
                            </div>
                            <span class="text-h6 font-weight-bold">Toplam Fotoğraf</span>
                        </div>
                        <div class="d-flex align-center justify-center mt-6">
                            <span class="text-h2 font-weight-bold counter-animation">{{ statisticStore.getStatistics?.photoCount || 0 }}</span>
                        </div>
                        <div class="text-center mt-2 text-medium-emphasis">
                            <v-chip size="small" color="success" variant="flat" class="stat-chip">Yüklenen fotoğraf</v-chip>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="4" class="fade-in-item" style="animation-delay: 0.4s;">
                <v-card class="stat-card rounded-xl" elevation="3" hover height="200">
                    <v-card-text class="pa-6">
                        <div class="d-flex align-center mb-4">
                            <div class="icon-container mr-3" style="background: linear-gradient(135deg, #03A9F4, #0288D1);">
                                <v-icon color="white" size="32">mdi-calendar-multiple</v-icon>
                            </div>
                            <span class="text-h6 font-weight-bold">Toplam Etkinlik</span>
                        </div>
                        <div class="d-flex align-center justify-center mt-6">
                            <span class="text-h2 font-weight-bold counter-animation">{{ statisticStore.getStatistics?.eventCount || 0 }}</span>
                        </div>
                        <div class="text-center mt-2 text-medium-emphasis">
                            <v-chip size="small" color="info" variant="flat" class="stat-chip">Planlanan etkinlik</v-chip>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Grafik Kartları -->
        <v-row class="mt-8">
            <v-col cols="12" md="6" class="fade-in-item" style="animation-delay: 0.3s;">
                <v-card class="chart-card rounded-xl" elevation="3" hover>
                    <v-card-text class="pa-6">
                        <div class="d-flex align-center mb-6">
                            <div class="icon-container mr-3">
                                <v-icon color="white" size="24">mdi-chart-bar</v-icon>
                            </div>
                            <span class="text-h6 font-weight-bold">İçerik Dağılımı</span>
                        </div>
                        <v-sheet height="300" class="rounded-xl overflow-hidden pa-2">
                            <v-sparkline
                                :value="[statisticStore.getStatistics?.photoCount || 0, statisticStore.getStatistics?.eventCount || 0]"
                                :labels="['Fotoğraflar', 'Etkinlikler']" color="primary" type="bar" auto-draw
                                stroke-linecap="round" line-width="20" padding="16" show-labels label-size="14">
                            </v-sparkline>
                        </v-sheet>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="6" class="fade-in-item" style="animation-delay: 0.5s;">
                <v-card class="chart-card rounded-xl" elevation="3" hover>
                    <v-card-text class="pa-6">
                        <div class="d-flex align-center mb-6">
                            <div class="icon-container mr-3" style="background: linear-gradient(135deg, #4CAF50, #2E7D32);">
                                <v-icon color="white" size="24">mdi-chart-line</v-icon>
                            </div>
                            <span class="text-h6 font-weight-bold">Haftalık Ziyaretçi Grafiği</span>
                        </div>
                        <v-sheet height="300" class="rounded-xl overflow-hidden pa-2">
                            <v-sparkline :value="weeklyVisitorValues"
                                :labels="['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']" color="success" fill smooth
                                auto-draw stroke-linecap="round" line-width="3" padding="16" show-labels
                                label-size="14"></v-sparkline>
                        </v-sheet>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Son Güncelleme -->
        <v-row class="mt-8">
            <v-col cols="12" class="fade-in-item" style="animation-delay: 0.6s;">
                <v-card class="update-card rounded-xl" elevation="3" hover>
                    <v-card-text class="pa-6">
                        <div class="d-flex align-center justify-space-between">
                            <div class="d-flex align-center">
                                <div class="icon-container-small mr-3">
                                    <v-icon color="white" size="18">mdi-update</v-icon>
                                </div>
                                <div>
                                    <div class="text-subtitle-1 font-weight-medium">Son Güncelleme</div>
                                    <div class="text-body-1 font-weight-bold">
                                        {{ new Date(statisticStore.getStatistics?.lastUpdated).toLocaleString('tr-TR') }}
                                    </div>
                                </div>
                            </div>
                            <v-btn color="primary" variant="text" icon="mdi-refresh" class="refresh-btn"
                                @click="refreshStatistics"></v-btn>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import { useStatisticStore } from '@/stores/statistic'

const statisticStore = useStatisticStore()

// Haftalık ziyaretçi değerlerini hesapla
const weeklyVisitorValues = computed(() => {
    const visitors = statisticStore.getStatistics?.weeklyVisitors || {};
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return days.map(day => visitors[day] || 0);
});

// İstatistikleri yenile
const refreshStatistics = async () => {
    await statisticStore.fetchStatistics()
}

onMounted(() => {
    statisticStore.fetchStatistics()
})
</script>

<style scoped>
.stat-card, .chart-card, .update-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: none;
    overflow: hidden;
}

.stat-card:hover, .chart-card:hover, .update-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
}

.icon-container {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    background: linear-gradient(135deg, #09c256, #0b7231);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(9, 194, 86, 0.3);
}

.icon-container-small {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: linear-gradient(135deg, #09c256, #0b7231);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 8px rgba(9, 194, 86, 0.2);
}

.stat-chip {
    font-size: 0.70rem;
    height: 22px;
}

.refresh-btn {
    opacity: 0.7;
    transition: all 0.3s ease;
}

.refresh-btn:hover {
    opacity: 1;
    transform: rotate(180deg);
}

.counter-animation {
    animation: countUp 2s ease-out forwards;
    background: linear-gradient(135deg, #333, #666);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
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
</style>