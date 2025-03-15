<template>
    <v-container class="py-16">
        <h1 class="text-h3 mb-8 text-center">Etkinlikler</h1>

        <!-- Yaklaşan Etkinlik -->
        <v-card class="mb-8" elevation="2">
            <v-row>
                <v-col cols="12" md="6">
                    <v-img src="https://cdn.pixabay.com/photo/2016/11/22/19/15/countryside-1850177_1280.jpg"
                        height="300" cover></v-img>
                </v-col>
                <v-col cols="12" md="6" class="d-flex flex-column justify-center">
                    <v-card-title class="text-h4">Bahar Şenliği</v-card-title>
                    <v-card-subtitle>21 Nisan 2024, 10:00</v-card-subtitle>
                    <v-card-text>
                        <p class="text-body-1 mb-4">Geleneksel bahar şenliğimizde bir araya geliyoruz. Yöresel yemekler,
                            müzik ve eğlence sizleri bekliyor.</p>
                        <v-chip color="primary" class="mr-2">Eğlence</v-chip>
                        <v-chip color="secondary">Kültür</v-chip>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" @click="openEventDialog(upcomingEvent)">
                            Detayları Gör
                        </v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </v-card>
        <!-- Geçmiş Etkinlikler -->
        <h2 class="text-h4 mb-6">Geçmiş Etkinlikler</h2>
        <v-row>
            <v-col v-for="event in pastEvents" :key="event.id" cols="12" md="6" lg="4">
                <v-card height="100%" @click="openEventDialog(event)">
                    <v-img :src="event.imageUrl" height="200" cover></v-img>
                    <v-card-title>{{ event.title }}</v-card-title>
                    <v-card-subtitle>{{ event.date }}</v-card-subtitle>
                    <v-card-text>{{ event.description }}</v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Etkinlik Detay Modal -->
        <v-dialog v-model="dialog" max-width="800">
            <v-card v-if="selectedEvent">
                <v-img :src="selectedEvent.imageUrl" height="300" cover></v-img>
                <v-card-title class="text-h4">{{ selectedEvent.title }}</v-card-title>
                <v-card-subtitle>{{ selectedEvent.date }}</v-card-subtitle>
                <v-card-text>
                    <p class="text-body-1 mb-4">{{ selectedEvent.description }}</p>
                    <v-divider class="mb-4"></v-divider>
                    <h3 class="text-h6 mb-2">Etkinlik Programı</h3>
                    <v-timeline density="compact" align="start">
                        <v-timeline-item v-for="(activity, index) in selectedEvent.schedule" :key="index"
                            :dot-color="activity.color || 'primary'" size="small">
                            <template v-slot:opposite>
                                <div class="text-subtitle-2">{{ activity.time }}</div>
                            </template>
                            <div class="text-subtitle-1">{{ activity.title }}</div>
                            <div class="text-body-2">{{ activity.description }}</div>
                        </v-timeline-item>
                    </v-timeline>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="dialog = false">Kapat</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup>
const dialog = ref(false)
const selectedEvent = ref(null)

// const upcomingEvent = ref({
//     id: 1,
//     title: 'Bahar Şenliği',
//     date: '21 Nisan 2024, 10:00',
//     location: 'Köy Meydanı',
//     description: 'Geleneksel bahar şenliğimizde bir araya geliyoruz. Yöresel yemekler, müzik ve eğlence sizleri bekliyor.',
//     imageUrl: 'https://cdn.pixabay.com/photo/2025/01/03/06/55/cortina-dampezzo-9307295_1280.jpg',
//     schedule: [
//         { time: '10:00', title: 'Açılış Konuşması', description: 'Köy muhtarı açılış konuşması', color: 'primary' },
//         { time: '11:00', title: 'Yöresel Yemekler', description: 'Yöresel lezzetlerin sunumu', color: 'success' },
//         { time: '13:00', title: 'Halk Oyunları', description: 'Yerel halk oyunları gösterisi', color: 'info' },
//         { time: '15:00', title: 'Müzik Dinletisi', description: 'Yerel sanatçılardan türküler', color: 'warning' },
//         { time: '17:00', title: 'Kapanış', description: 'Etkinlik kapanışı ve vedalaşma', color: 'error' }
//     ]
// })

// const pastEvents = ref([
//     {
//         id: 2,
//         title: 'Hasat Şenliği',
//         date: '15 Ekim 2023',
//         location: 'Köy Tarlaları',
//         description: 'Geleneksel hasat şenliğimizde bereketli bir sezonun sevincini paylaştık.',
//         imageUrl: 'https://cdn.pixabay.com/photo/2016/11/19/15/03/field-1839510_1280.jpg',
//         schedule: [
//             { time: '09:00', title: 'Hasat Başlangıcı', description: 'Tarlalarda hasat çalışmaları' },
//             { time: '12:00', title: 'Öğle Yemeği', description: 'Geleneksel köy yemekleri' },
//             { time: '14:00', title: 'Eğlence', description: 'Müzik ve oyunlar' }
//         ]
//     },
//     {
//         id: 3,
//         title: 'Kış Festivali',
//         date: '20 Ocak 2024',
//         location: 'Köy Konağı',
//         description: 'Kış mevsiminin güzelliklerini kutladığımız festivalimiz.',
//         imageUrl: 'https://cdn.pixabay.com/photo/2016/11/19/15/03/buildings-1839726_1280.jpg',
//         schedule: [
//             { time: '11:00', title: 'Festival Açılışı', description: 'Açılış töreni' },
//             { time: '13:00', title: 'Kış Yemekleri', description: 'Geleneksel kış yemekleri' },
//             { time: '15:00', title: 'Kültür Etkinlikleri', description: 'Şiir ve müzik dinletisi' }
//         ]
//     }
// ])


const pastEvents = computed(() => useEventStore().getEvents)

const openEventDialog = (event) => {
    selectedEvent.value = event
    dialog.value = true
}

onMounted(async () => {
    await useEventStore().fetchEvents()
})
</script>

<style scoped>
.v-card {
    transition: transform 0.2s;
    cursor: pointer;
}

.v-card:hover {
    transform: translateY(-5px);
}
</style>