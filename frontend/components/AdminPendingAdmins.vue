<!-- components/AdminPendingAdmins.vue -->
<template>
    <div>
        <v-card class="rounded-xl admin-card" elevation="3" hover>
            <v-card-title class="text-h5 px-6 pt-5 pb-2 d-flex align-center">
                <div class="icon-container mr-3">
                    <v-icon size="24" color="white">mdi-account-clock</v-icon>
                </div>
                <span class="font-weight-bold">Bekleyen Admin Başvuruları</span>
            </v-card-title>

            <v-card-text class="px-6 py-4">
                <v-alert v-if="adminStore.loading" type="info" class="mb-4 rounded-lg fade-in-item">
                    <div class="d-flex align-center">
                        <v-progress-circular indeterminate color="info" class="mr-3"></v-progress-circular>
                        <span>Başvurular yükleniyor...</span>
                    </div>
                </v-alert>

                <v-alert v-else-if="adminStore.error" type="error" class="mb-4 rounded-lg fade-in-item" variant="tonal" border="start">
                    <div class="d-flex align-center">
                        <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
                        {{ adminStore.error }}
                    </div>
                </v-alert>

                <v-alert v-else-if="pendingAdmins.length === 0" type="info" class="mb-4 rounded-lg fade-in-item" variant="tonal" border="start">
                    <div class="d-flex align-center">
                        <v-icon color="info" class="mr-2">mdi-information</v-icon>
                        Bekleyen admin başvurusu bulunmamaktadır.
                    </div>
                </v-alert>

                <v-table v-else class="rounded-lg table-container">
                    <thead>
                        <tr>
                            <th>Ad</th>
                            <th>Soyad</th>
                            <th>Email</th>
                            <th>Başvuru Nedeni</th>
                            <th>Tarih</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(admin, index) in pendingAdmins" :key="admin._id" class="table-row"
                            :class="{ 'fade-in-item': true }" :style="{ 'animation-delay': `${index * 0.05}s` }">
                            <td class="font-weight-medium">{{ admin.firstName }}</td>
                            <td>{{ admin.lastName }}</td>
                            <td>
                                <v-chip size="small" class="email-chip" variant="flat" color="primary">
                                    <v-icon size="x-small" start>mdi-email</v-icon>
                                    {{ admin.email }}
                                </v-chip>
                            </td>
                            <td>
                                <v-tooltip location="top">
                                    <template v-slot:activator="{ props }">
                                        <span class="reason-text" v-bind="props">
                                            {{ truncateReason(admin.reason) }}
                                        </span>
                                    </template>
                                    {{ admin.reason }}
                                </v-tooltip>
                            </td>
                            <td>{{ formatDate(admin.createdAt) }}</td>
                            <td>
                                <div class="d-flex">
                                    <v-btn color="success" variant="tonal" size="small" class="mr-2 action-btn" @click="handleApprove(admin._id)">
                                        <v-icon size="18" class="mr-1">mdi-check-circle</v-icon>
                                        Onayla
                                    </v-btn>
                                    <v-btn color="error" variant="tonal" size="small" class="action-btn" @click="handleReject(admin._id)">
                                        <v-icon size="18" class="mr-1">mdi-close-circle</v-icon>
                                        Reddet
                                    </v-btn>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card-text>
        </v-card>

        <!-- Onay/Red Dialog -->
        <v-dialog v-model="dialog" max-width="500px">
            <v-card class="rounded-xl" elevation="8">
                <v-card-title class="text-h5 px-6 pt-5 pb-2 d-flex align-center">
                    <v-icon :color="dialogAction === 'approve' ? 'success' : 'error'" size="large" class="mr-2">
                        {{ dialogAction === 'approve' ? 'mdi-check-circle' : 'mdi-close-circle' }}
                    </v-icon>
                    {{ dialogAction === 'approve' ? 'Admin Onaylama' : 'Admin Reddetme' }}
                </v-card-title>

                <v-card-text class="px-6 pt-4">
                    <v-alert :color="dialogAction === 'approve' ? 'success' : 'error'" variant="tonal" class="rounded-lg mb-4">
                        {{ dialogAction === 'approve' ? 'Bu admin başvurusunu onaylamak istediğinize emin misiniz? Onayladığınızda kullanıcı admin yetkilerine sahip olacaktır.' :
                        'Bu admin başvurusunu reddetmek istediğinize emin misiniz? Bu işlem geri alınamaz.' }}
                    </v-alert>
                </v-card-text>

                <v-card-actions class="px-6 pb-4">
                    <v-spacer></v-spacer>
                    <v-btn color="grey" variant="text" class="rounded-lg" @click="dialog = false">
                        İptal
                    </v-btn>
                    <v-btn :color="dialogAction === 'approve' ? 'success' : 'error'" class="rounded-lg submit-btn" @click="confirmAction">
                        <v-icon class="mr-2">{{ dialogAction === 'approve' ? 'mdi-check' : 'mdi-close' }}</v-icon>
                        {{ dialogAction === 'approve' ? 'Onayla' : 'Reddet' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useAdminPendingStore } from '~/stores/adminPending'

const authStore = useAuthStore()
const adminStore = useAdminPendingStore()
const dialog = ref(false)
const dialogAction = ref('approve')
const selectedAdminId = ref(null)

// Bekleyen adminleri store'dan al
const pendingAdmins = computed(() => adminStore.getPendingAdmins)

// Tarih formatlama fonksiyonu
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Başvuru nedenini kısaltma
const truncateReason = (reason) => {
    return reason.length > 30 ? reason.substring(0, 30) + '...' : reason
}

// Onaylama işlemi
const handleApprove = (adminId) => {
    selectedAdminId.value = adminId
    dialogAction.value = 'approve'
    dialog.value = true
}

// Reddetme işlemi
const handleReject = (adminId) => {
    selectedAdminId.value = adminId
    dialogAction.value = 'reject'
    dialog.value = true
}

// Onay/Red işlemini onayla
const confirmAction = async () => {
    try {
        const result = await adminStore.handleAdminAction(
            selectedAdminId.value, 
            dialogAction.value, 
            authStore.user?._id
        )
        
        dialog.value = false
    } catch (err) {
        console.error('İşlem hatası:', err)
    }
}

// Sayfa yüklendiğinde bekleyen adminleri getir
onMounted(() => {
    adminStore.fetchPendingAdmins()
})
</script>

<style scoped>
.admin-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: none;
    overflow: hidden;
}

.admin-card:hover {
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
    opacity: 0.8;
    transition: all 0.3s ease;
    text-transform: none;
}

.action-btn:hover {
    opacity: 1;
    transform: translateY(-2px);
}

.email-chip {
    font-size: 0.75rem;
    font-weight: 500;
}

.reason-text {
    display: inline-block;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
}

.submit-btn {
    transition: all 0.3s ease;
}

.submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2) !important;
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