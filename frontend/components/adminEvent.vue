<template>
    <!-- Etkinlik Yönetimi -->
    <div>
        <!-- Etkinlik Oluşturma Formu -->
        <v-card class="mb-6 form-card rounded-xl" elevation="3" hover>
            <v-card-title class="d-flex align-center px-6 pt-5 pb-2">
                <div class="icon-container mr-3">
                    <v-icon size="24" color="white">mdi-calendar-plus</v-icon>
                </div>
                <span class="text-h5 font-weight-bold">Yeni Etkinlik Oluştur</span>
            </v-card-title>
            <v-card-text class="px-6 py-4">
                <v-form @submit.prevent="handleEventCreate" class="fade-in-item">
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="eventForm.title" label="Başlık" variant="outlined" 
                                density="comfortable" class="rounded-lg" prepend-inner-icon="mdi-format-title" required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="eventForm.location" label="Konum" variant="outlined" 
                                density="comfortable" class="rounded-lg" prepend-inner-icon="mdi-map-marker" required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="eventForm.date" label="Başlangıç Tarihi" type="date" variant="outlined" 
                                density="comfortable" class="rounded-lg" prepend-inner-icon="mdi-calendar-start" required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="eventForm.endDate" label="Bitiş Tarihi" type="date" variant="outlined" 
                                density="comfortable" class="rounded-lg" prepend-inner-icon="mdi-calendar-end" required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea v-model="eventForm.description" label="Açıklama" variant="outlined" 
                                density="comfortable" class="rounded-lg" prepend-inner-icon="mdi-text-box" auto-grow rows="4" required></v-textarea>
                        </v-col>
                        <v-col cols="12">
                            <v-file-input v-model="eventForm.image" label="Etkinlik Görselleri" accept="image/*"
                                variant="outlined" density="comfortable" class="rounded-lg" prepend-icon="mdi-image" 
                                multiple chips show-size counter required></v-file-input>
                        </v-col>
                        <v-col cols="12">
                            <v-btn type="submit" color="primary" size="large" :loading="eventStore.isLoading" block class="rounded-lg submit-btn">
                                <v-icon class="mr-2">mdi-plus-circle</v-icon>
                                Etkinlik Oluştur
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>

        <!-- Etkinlik Listesi -->
        <v-card class="rounded-xl list-card" elevation="3" hover>
            <v-card-title class="d-flex align-center px-6 pt-5 pb-2">
                <div class="icon-container mr-3">
                    <v-icon size="24" color="white">mdi-calendar-multiple</v-icon>
                </div>
                <span class="text-h5 font-weight-bold">Mevcut Etkinlikler</span>
            </v-card-title>
            <v-card-text class="px-6 py-4">
                <v-table class="rounded-lg table-container">
                    <thead>
                        <tr>
                            <th>Görsel</th>
                            <th>Başlık</th>
                            <th>Tarih</th>
                            <th>Bitiş Tarihi</th>
                            <th>Konum</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(event, index) in eventStore.getEvents" :key="event._id" class="table-row"
                            :class="{ 'fade-in-item': true }" :style="{ 'animation-delay': `${index * 0.05}s` }">
                            <td>
                                <v-img :src="event.imageUrl" width="80" height="60" class="rounded-lg" cover></v-img>
                            </td>
                            <td class="font-weight-medium">{{ event.title }}</td>
                            <td>{{ new Date(event.date).toLocaleDateString('tr-TR') }}</td>
                            <td>{{ new Date(event.endDate).toLocaleDateString('tr-TR') }}</td>
                            <td>{{ event.location }}</td>
                            <td>
                                <div class="d-flex">
                                    <v-btn icon color="info" variant="tonal" size="small" class="mr-1 action-btn"
                                        @click="openEventDetails(event)">
                                        <v-icon size="20">mdi-eye</v-icon>
                                        <v-tooltip activator="parent" location="top">Görüntüle</v-tooltip>
                                    </v-btn>
                                    <v-btn icon color="warning" variant="tonal" size="small" class="mr-1 action-btn"
                                        @click="openEventEdit(event)">
                                        <v-icon size="20">mdi-pencil</v-icon>
                                        <v-tooltip activator="parent" location="top">Düzenle</v-tooltip>
                                    </v-btn>
                                    <v-btn icon color="error" variant="tonal" size="small" class="action-btn"
                                        @click="handleEventDelete(event._id)" :loading="eventStore.isLoading">
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

        <!-- Etkinlik Detay Modal -->
        <v-dialog v-model="eventDialog" max-width="600">
            <v-card v-if="selectedEvent" class="rounded-xl detail-card" elevation="8">
                <v-img :src="selectedEvent.imageUrl" height="250" cover class="detail-image">
                    <template v-slot:placeholder>
                        <v-row class="fill-height ma-0" align="center" justify="center">
                            <v-progress-circular indeterminate color="primary"></v-progress-circular>
                        </v-row>
                    </template>
                    <div class="image-overlay-gradient"></div>
                </v-img>
                <v-card-title class="text-h4 pt-5 px-6">{{ selectedEvent.title }}</v-card-title>
                <v-card-text class="px-6">
                    <p class="text-body-1 mb-4">{{ selectedEvent.description }}</p>
                    <v-list class="detail-list rounded-lg pa-0">
                        <v-list-item>
                            <template v-slot:prepend>
                                <div class="list-icon-container">
                                    <v-icon color="white">mdi-calendar</v-icon>
                                </div>
                            </template>
                            <v-list-item-title class="font-weight-medium">
                                Başlangıç: {{ new Date(selectedEvent.date).toLocaleDateString('tr-TR') }}
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <template v-slot:prepend>
                                <div class="list-icon-container">
                                    <v-icon color="white">mdi-calendar-end</v-icon>
                                </div>
                            </template>
                            <v-list-item-title class="font-weight-medium">
                                Bitiş: {{ new Date(selectedEvent.endDate).toLocaleDateString('tr-TR') }}
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <template v-slot:prepend>
                                <div class="list-icon-container">
                                    <v-icon color="white">mdi-map-marker</v-icon>
                                </div>
                            </template>
                            <v-list-item-title class="font-weight-medium">
                                {{ selectedEvent.location }}
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-card-text>
                <v-card-actions class="px-6 pb-4">
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="text" class="rounded-lg px-6" @click="eventDialog = false">
                        Kapat
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Etkinlik Düzenleme Modal -->
        <v-dialog v-model="editEventDialog" max-width="650">
            <v-card v-if="selectedEvent" class="rounded-xl edit-card" elevation="8">
                <v-card-title class="text-h5 px-6 pt-5 pb-2 d-flex align-center">
                    <div class="icon-container mr-3">
                        <v-icon size="24" color="white">mdi-pencil</v-icon>
                    </div>
                    <span>Etkinliği Düzenle</span>
                </v-card-title>
                <v-card-text class="px-6 py-4">
                    <v-form @submit.prevent="handleEventUpdate">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="editEventForm.title" label="Başlık" variant="outlined" 
                                    density="comfortable" class="rounded-lg" prepend-inner-icon="mdi-format-title" required></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="editEventForm.location" label="Konum" variant="outlined" 
                                    density="comfortable" class="rounded-lg" prepend-inner-icon="mdi-map-marker" required></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="editEventForm.date" label="Başlangıç Tarihi" type="date" variant="outlined" 
                                    density="comfortable" class="rounded-lg" prepend-inner-icon="mdi-calendar-start" required></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="editEventForm.endDate" label="Bitiş Tarihi" type="date" variant="outlined" 
                                    density="comfortable" class="rounded-lg" prepend-inner-icon="mdi-calendar-end" required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea v-model="editEventForm.description" label="Açıklama" variant="outlined" 
                                    density="comfortable" class="rounded-lg" prepend-inner-icon="mdi-text-box" auto-grow rows="4" required></v-textarea>
                            </v-col>
                            <v-col cols="12">
                                <v-file-input v-model="editEventForm.image" label="Yeni Görseller (İsteğe Bağlı)" accept="image/*"
                                    variant="outlined" density="comfortable" class="rounded-lg" prepend-icon="mdi-image"
                                    multiple chips show-size counter></v-file-input>
                            </v-col>
                        </v-row>
                        <v-card-actions class="px-0 pt-4 pb-0">
                            <v-spacer></v-spacer>
                            <v-btn color="error" variant="text" class="rounded-lg mr-2" @click="editEventDialog = false">
                                İptal
                            </v-btn>
                            <v-btn color="primary" type="submit" class="rounded-lg px-6 submit-btn" :loading="eventStore.isLoading">
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
import { useEventStore } from '@/stores/event'

const eventStore = useEventStore()
const eventDialog = ref(false)
const editEventDialog = ref(false)
const selectedEvent = ref(null)

const eventForm = ref({
    title: '',
    description: '',
    date: '',
    endDate: '',
    location: '',
    image: null
})

const editEventForm = ref({
    title: '',
    description: '',
    date: '',
    endDate: '',
    location: '',
    image: null
})

const handleEventCreate = async () => {
    const formData = new FormData()
    formData.append('title', eventForm.value.title)
    formData.append('description', eventForm.value.description)
    formData.append('date', eventForm.value.date)
    formData.append('endDate', eventForm.value.endDate)
    formData.append('location', eventForm.value.location)
    
    // Birden fazla görsel için döngü ile ekle
    if (eventForm.value.image && eventForm.value.image.length) {
        for (let i = 0; i < eventForm.value.image.length; i++) {
            formData.append('images', eventForm.value.image[i]);
        }
    }

    const result = await eventStore.createEvent(formData)
    if (result.success) {
        // Form'u temizle
        eventForm.value = {
            title: '',
            description: '',
            date: '',
            endDate: '',
            location: '',
            image: null
        }
    }
}

const handleEventDelete = async (eventId) => {
    if (confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) {
        await eventStore.deleteEvent(eventId)
    }
}

const openEventDetails = (event) => {
    selectedEvent.value = event
    eventDialog.value = true
}

const openEventEdit = (event) => {
    selectedEvent.value = event
    editEventForm.value = {
        title: event.title,
        description: event.description,
        date: new Date(event.date).toISOString().split('T')[0],
        endDate: new Date(event.endDate).toISOString().split('T')[0],
        location: event.location,
        image: null
    }
    editEventDialog.value = true
}


const handleEventUpdate = async () => {
    const formData = new FormData()
    formData.append('title', editEventForm.value.title)
    formData.append('description', editEventForm.value.description)
    formData.append('date', editEventForm.value.date)
    formData.append('endDate', editEventForm.value.endDate)
    formData.append('location', editEventForm.value.location)

    // Birden fazla görsel için döngü ile ekle
    if (editEventForm.value.image && editEventForm.value.image.length) {
        for (let i = 0; i < editEventForm.value.image.length; i++) {
            formData.append('images', editEventForm.value.image[i]);
        }
    }

    const result = await eventStore.updateEvent(selectedEvent.value._id, formData)
    if (result.success) {
        eventForm.value = {
            title: '',
            description: '',
            date: '',
            endDate: '',
            location: '',
            image: null
        }
        editEventDialog.value = false
    }
}

onMounted(() => {
    eventStore.fetchEvents()
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

.list-icon-container {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #09c256, #0b7231);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
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

.detail-list {
    background-color: #f8f9fa;
    border-radius: 12px;
    overflow: hidden;
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