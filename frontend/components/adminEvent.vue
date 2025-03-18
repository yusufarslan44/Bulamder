<template>
    <!-- Etkinlik Yönetimi -->
    <div>
        <!-- Etkinlik Oluşturma Formu -->
        <v-card class="mb-6" elevation="2" hover>
            <v-card-title class="d-flex align-center">
                <v-icon size="24" color="primary" class="mr-2">mdi-calendar-plus</v-icon>
                Yeni Etkinlik Oluştur
            </v-card-title>
            <v-card-text>
                <v-form @submit.prevent="handleEventCreate">
                    <v-text-field v-model="eventForm.title" label="Başlık" required></v-text-field>

                    <v-textarea v-model="eventForm.description" label="Açıklama" required></v-textarea>

                    <v-text-field v-model="eventForm.date" label="Tarih" type="date" required></v-text-field>

                    <v-text-field v-model="eventForm.endDate" label="Bitiş Tarihi" type="date" required></v-text-field>


                    <v-text-field v-model="eventForm.location" label="Konum" required></v-text-field>

                    <v-file-input v-model="eventForm.image" label="Etkinlik Görseli" accept="image/*"
                        required></v-file-input>

                    <v-btn type="submit" color="primary" :loading="eventStore.isLoading" block>
                        Oluştur
                    </v-btn>
                </v-form>
            </v-card-text>
        </v-card>

        <!-- Etkinlik Listesi -->
        <v-card elevation="2" hover>
            <v-card-title class="d-flex align-center">
                <v-icon size="24" color="primary" class="mr-2">mdi-calendar-multiple</v-icon>
                Mevcut Etkinlikler
            </v-card-title>
            <v-card-text>
                <v-table>
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
                        <tr v-for="event in eventStore.getEvents" :key="event._id">
                            <td>
                                <v-img :src="event.imageUrl" width="100" aspect-ratio="1" cover></v-img>
                            </td>
                            <td>{{ event.title }}</td>
                            <td>{{ new Date(event.date).toLocaleDateString('tr-TR') }}</td>
                            <td>{{ new Date(event.endDate).toLocaleDateString('tr-TR') }}</td>
                            <td>{{ event.location }}</td>
                            <td>
                                <v-btn icon="mdi-eye" color="info" variant="text" class="mr-2"
                                    @click="openEventDetails(event)"></v-btn>
                                <v-btn icon="mdi-pencil" color="warning" variant="text" class="mr-2"
                                    @click="openEventEdit(event)"></v-btn>
                                <v-btn icon="mdi-delete" color="error" variant="text"
                                    @click="handleEventDelete(event._id)" :loading="eventStore.isLoading"></v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-text>
        </v-card>

        <!-- Etkinlik Detay Modal -->
        <v-dialog v-model="eventDialog" max-width="600">
            <v-card v-if="selectedEvent">
                <v-img :src="selectedEvent.imageUrl" height="300" cover></v-img>
                <v-card-title>{{ selectedEvent.title }}</v-card-title>
                <v-card-text>
                    <p class="text-body-1">{{ selectedEvent.description }}</p>
                    <v-list>
                        <v-list-item>
                            <template v-slot:prepend>
                                <v-icon>mdi-calendar</v-icon>
                            </template>
                            <v-list-item-title>
                                {{ new Date(selectedEvent.date).toLocaleDateString('tr-TR') }}
                            </v-list-item-title>
                            <v-list-item-title>
                                {{ new Date(selectedEvent.endDate).toLocaleDateString('tr-TR') }}
                            </v-list-item-title>
                        </v-list-item>
                        <v-list-item>
                            <template v-slot:prepend>
                                <v-icon>mdi-map-marker</v-icon>
                            </template>
                            <v-list-item-title>
                                {{ selectedEvent.location }}
                            </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="text" @click="eventDialog = false">
                        Kapat
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Etkinlik Düzenleme Modal -->
        <v-dialog v-model="editEventDialog" max-width="600">
            <v-card v-if="selectedEvent">
                <v-card-title>Etkinliği Düzenle</v-card-title>
                <v-card-text>
                    <v-form @submit.prevent="handleEventUpdate">
                        <v-text-field v-model="editEventForm.title" label="Başlık" required></v-text-field>

                        <v-textarea v-model="editEventForm.description" label="Açıklama" required></v-textarea>

                        <v-text-field v-model="editEventForm.date" label="Tarih" type="date" required></v-text-field>
                        <v-text-field v-model="editEventForm.endDate" label="Bitiş Tarihi" type="date"
                            required></v-text-field>

                        <v-text-field v-model="editEventForm.location" label="Konum" required></v-text-field>

                        <v-file-input v-model="editEventForm.image" label="Yeni Görsel (İsteğe Bağlı)"
                            accept="image/*"></v-file-input>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="error" variant="text" @click="editEventDialog = false">
                                İptal
                            </v-btn>
                            <v-btn color="primary" type="submit" :loading="eventStore.isLoading">
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
    formData.append('image', eventForm.value.image[0] || eventForm.value.image);

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
    if (editEventForm.value.image) {
        formData.append('image', editEventForm.value.image[0] || editEventForm.value.image);
    }

    const result = await eventStore.updateEvent(selectedEvent.value._id, formData)
    if (result.success) {
        editEventDialog.value = false
    }
}

onMounted(() => {
    eventStore.fetchEvents()
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