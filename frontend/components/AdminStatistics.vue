<template>
    <div>
        <!-- İstatistik Kartları -->
        <v-row>
            <v-col cols="12" md="4">
                <v-card class="mx-auto" elevation="2" height="200" hover>
                    <v-card-item>
                        <v-card-title class="text-primary d-flex align-center">
                            <v-icon size="32" color="primary" class="mr-2">mdi-account-group</v-icon>
                            Ziyaretçi Sayısı
                        </v-card-title>
                        <div class="d-flex align-center justify-center mt-4">
                            <span class="text-h2">{{ statisticStore.getStatistics?.visitorCount || 0 }}</span>
                        </div>
                        <div class="text-caption text-center mt-2 text-medium-emphasis">
                            Bu hafta
                        </div>
                    </v-card-item>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card class="mx-auto" elevation="2" height="200" hover>
                    <v-card-item>
                        <v-card-title class="text-success d-flex align-center">
                            <v-icon size="32" color="success" class="mr-2">mdi-image-multiple</v-icon>
                            Toplam Fotoğraf
                        </v-card-title>
                        <div class="d-flex align-center justify-center mt-4">
                            <span class="text-h2">{{ statisticStore.getStatistics?.photoCount || 0 }}</span>
                        </div>
                        <div class="text-caption text-center mt-2 text-medium-emphasis">
                            Yüklenen fotoğraf
                        </div>
                    </v-card-item>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card class="mx-auto" elevation="2" height="200" hover>
                    <v-card-item>
                        <v-card-title class="text-info d-flex align-center">
                            <v-icon size="32" color="info" class="mr-2">mdi-calendar-multiple</v-icon>
                            Toplam Etkinlik
                        </v-card-title>
                        <div class="d-flex align-center justify-center mt-4">
                            <span class="text-h2">{{ statisticStore.getStatistics?.eventCount || 0 }}</span>
                        </div>
                        <div class="text-caption text-center mt-2 text-medium-emphasis">
                            Planlanan etkinlik
                        </div>
                    </v-card-item>
                </v-card>
            </v-col>
        </v-row>

        <!-- Grafik Kartları -->
        <v-row class="mt-6">
            <v-col cols="12" md="6">
                <v-card elevation="2" hover>
                    <v-card-title class="d-flex align-center">
                        <v-icon size="24" color="primary" class="mr-2">mdi-chart-bar</v-icon>
                        İçerik Dağılımı
                    </v-card-title>
                    <v-card-text>
                        <v-sheet height="300">
                            <v-sparkline
                                :value="[statisticStore.getStatistics?.photoCount || 0, statisticStore.getStatistics?.eventCount || 0]"
                                :labels="['Fotoğraflar', 'Etkinlikler']" color="primary" type="bar" auto-draw
                                stroke-linecap="round" line-width="20" padding="16" show-labels label-size="14">
                            </v-sparkline>
                        </v-sheet>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <v-card elevation="2" hover>
                    <v-card-title class="d-flex align-center">
                        <v-icon size="24" color="success" class="mr-2">mdi-chart-line</v-icon>
                        Haftalık Ziyaretçi Grafiği
                    </v-card-title>
                    <v-card-text>
                        <v-sheet height="300">
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
        <v-card class="mt-6" elevation="2" hover>
            <v-card-text class="d-flex align-center justify-space-between">
                <div>
                    <div class="text-subtitle-1 text-medium-emphasis">Son Güncelleme</div>
                    <div class="text-body-1">
                        {{ new Date(statisticStore.getStatistics?.lastUpdated).toLocaleString('tr-TR') }}
                    </div>
                </div>
            </v-card-text>
        </v-card>
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

onMounted(() => {
    statisticStore.fetchStatistics()
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