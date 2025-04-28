<!-- pages/login.vue -->
<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="6" lg="4">
                <v-card elevation="4" class="pa-4">
                    <v-card-title class="text-h5 text-center">
                        Admin Girişi
                    </v-card-title>

                    <v-card-subtitle class="text-center">
                        Yönetici hesabınızla giriş yapın
                    </v-card-subtitle>

                    <v-card-text>
                        <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
                            {{ error }}
                        </v-alert>

                        <v-form ref="form" v-model="isFormValid" @submit.prevent="handleLogin">
                            <v-text-field v-model="email" :rules="emailRules" label="Email" prepend-icon="mdi-email"
                                variant="outlined" required></v-text-field>

                            <v-text-field v-model="password" :rules="passwordRules"
                                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showPassword ? 'text' : 'password'" label="Şifre" prepend-icon="mdi-lock"
                                variant="outlined" required @click:append="showPassword = !showPassword"></v-text-field>

                            <v-btn block color="primary" size="large" type="submit" :loading="isLoading"
                                :disabled="!isFormValid" class="mt-4">
                                Giriş Yap
                            </v-btn>

                            <div class="text-center mt-4">
                                <span class="text-body-2">Hesabınız yok mu? </span>
                                <v-btn variant="text" color="primary" class="text-caption" to="/register">
                                    Başvuru Yap
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Form referansı
const form = ref(null)

// Form state
const isFormValid = ref(false)
const isLoading = ref(false)
const error = ref(null)
const showPassword = ref(false)
const email = ref('')
const password = ref('')

// Doğrulama kuralları
const emailRules = [
    v => !!v || 'Email alanı zorunludur',
    v => /.+@.+\..+/.test(v) || 'Geçerli bir email adresi girin'
]

const passwordRules = [
    v => !!v || 'Şifre alanı zorunludur',
    v => v.length >= 6 || 'Şifre en az 6 karakter olmalıdır'
]

// Login işlemi
const handleLogin = async () => {
    // Form doğrulamasını kontrol et
    const { valid } = await form.value.validate()

    if (!valid) return

    // Yükleniyor durumunu aktifleştir
    isLoading.value = true
    error.value = null

    try {
        // API'ye login isteği gönder
        const result = await authStore.loginAuth({
            email: email.value,
            password: password.value
        })

        if (result) {
            // Başarılı giriş sonrası admin paneline yönlendir
            router.push('/admin')
        }
    } catch (err) {
        error.value = err.message || 'Giriş yapılırken bir hata oluştu'
    } finally {
        isLoading.value = false
    }
}
</script>