<!-- pages/register.vue -->
<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="6" lg="4">
                <v-card elevation="4" class="pa-4">
                    <v-card-title class="text-h5 text-center">
                        Admin Hesabı Başvurusu
                    </v-card-title>

                    <v-card-subtitle class="text-center">
                        Bilgilerinizi girerek admin başvurusunda bulunun
                    </v-card-subtitle>

                    <v-card-text>
                        <v-alert v-if="registrationSubmitted" type="success" variant="tonal" class="mb-4">
                            Başvurunuz alınmıştır. Sistem yöneticisi onayından sonra hesabınız aktifleştirilecektir.
                            Onay durumu email adresinize bildirilecektir.
                        </v-alert>

                        <v-form v-else ref="form" v-model="isFormValid" @submit.prevent="handleRegister">
                            <v-row>
                                <v-col cols="12" sm="6">
                                    <v-text-field v-model="firstName" :rules="nameRules" label="Ad"
                                        prepend-icon="mdi-account" variant="outlined" required></v-text-field>
                                </v-col>

                                <v-col cols="12" sm="6">
                                    <v-text-field v-model="lastName" :rules="nameRules" label="Soyad"
                                        prepend-icon="mdi-account" variant="outlined" required></v-text-field>
                                </v-col>
                            </v-row>

                            <v-text-field v-model="email" :rules="emailRules" label="Email" prepend-icon="mdi-email"
                                variant="outlined" required></v-text-field>

                            <v-text-field v-model="password" :rules="passwordRules"
                                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showPassword ? 'text' : 'password'" label="Şifre" prepend-icon="mdi-lock"
                                variant="outlined" required @click:append="showPassword = !showPassword"></v-text-field>

                            <v-text-field v-model="confirmPassword" :rules="confirmPasswordRules"
                                :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showConfirmPassword ? 'text' : 'password'" label="Şifre Tekrar"
                                prepend-icon="mdi-lock-check" variant="outlined" required
                                @click:append="showConfirmPassword = !showConfirmPassword"></v-text-field>

                            <v-textarea v-model="reason" :rules="reasonRules" label="Başvuru Nedeni"
                                prepend-icon="mdi-text-box" variant="outlined"
                                hint="Neden admin olmak istediğinizi kısaca açıklayın" rows="3" required></v-textarea>

                            <v-checkbox v-model="agreeTerms" :rules="agreeTermsRules"
                                label="Kullanım şartlarını ve gizlilik politikasını kabul ediyorum" color="primary"
                                required></v-checkbox>

                            <v-btn block color="primary" size="large" type="submit" :loading="isLoading"
                                :disabled="!isFormValid" class="mt-4">
                                Başvuruyu Gönder
                            </v-btn>

                            <div class="text-center mt-4">
                                <span class="text-body-2">Zaten hesabınız var mı? </span>
                                <v-btn variant="text" color="primary" class="text-caption" to="/login">
                                    Giriş Yap
                                </v-btn>
                            </div>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// Router
const router = useRouter()

// Form referansı
const form = ref(null)

// Form state
const isFormValid = ref(false)
const isLoading = ref(false)
const registrationSubmitted = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeTerms = ref(false)
const reason = ref('')


// Departman listesi
const departments = [
    'İnsan Kaynakları',
    'Finans',
    'Pazarlama',
    'Operasyon',
    'Bilgi Teknolojileri',
    'Müşteri Hizmetleri',
    'Diğer'
]

// Doğrulama kuralları
const nameRules = [
    v => !!v || 'Bu alan zorunludur',
    v => v.length >= 2 || 'En az 2 karakter gereklidir'
]

const emailRules = [
    v => !!v || 'Email alanı zorunludur',
    v => /.+@.+\..+/.test(v) || 'Geçerli bir email adresi girin'
]

const passwordRules = [
    v => !!v || 'Şifre alanı zorunludur',
    v => v.length >= 6 || 'Şifre en az 6 karakter olmalıdır',
    v => /\d/.test(v) || 'Şifre en az bir rakam içermelidir',
    v => /[A-Z]/.test(v) || 'Şifre en az bir büyük harf içermelidir'
]

const confirmPasswordRules = [
    v => !!v || 'Şifre tekrarı zorunludur',
    v => v === password.value || 'Şifreler eşleşmiyor'
]

const reasonRules = [
    v => !!v || 'Başvuru nedeni zorunludur',
    v => v.length >= 5 || 'Lütfen en az 5 karakter girin'
]



const agreeTermsRules = [
    v => !!v || 'Devam etmek için kullanım şartlarını kabul etmelisiniz'
]

// Kayıt işlemi
const handleRegister = async () => {
    // Form doğrulamasını kontrol et
    const { valid } = await form.value.validate()

    if (!valid) return

    // Yükleniyor durumunu aktifleştir
    isLoading.value = true

    try {
        // API'ye kayıt isteği gönder
        // Burada gerçek API entegrasyonunuzu yapabilirsiniz
        // Örnek: 
        // const response = await fetch('/api/admin/register', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     firstName: firstName.value,
        //     lastName: lastName.value,
        //     email: email.value,
        //     password: password.value,
        //     department: department.value,
        //     reason: reason.value,
        //     status: 'pending' // Önemli: Beklemede durumu
        //   })
        // })
        await useAuthStore().registerAuth(JSON.stringify({
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            password: password.value,
            reason: reason.value,
        }))


        console.log('Admin başvurusu:', {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            password: password.value,
            reason: reason.value,
            status: 'pending'
        })

        // Başarılı kayıt sonrası mesaj göster
        setTimeout(() => {
            isLoading.value = false
            registrationSubmitted.value = true
        }, 1000)

    } catch (error) {
        // Hata işleme
        console.error('Kayıt hatası:', error)
        isLoading.value = false
    }
}
</script>