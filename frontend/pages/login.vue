<!-- pages/login.vue -->
<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="6" lg="4">
                <v-card elevation="4" class="pa-4">
                    <v-card-title class="text-h5 text-center">
                        Hesabınıza Giriş Yapın
                    </v-card-title>

                    <v-card-subtitle class="text-center">
                        Hoş geldiniz! Lütfen bilgilerinizi girin
                    </v-card-subtitle>

                    <v-card-text>
                        <v-form ref="form" v-model="isFormValid" @submit.prevent="handleLogin">
                            <v-text-field v-model="email" :rules="emailRules" label="Email" prepend-icon="mdi-email"
                                variant="outlined" required></v-text-field>

                            <v-text-field v-model="password" :rules="passwordRules"
                                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showPassword ? 'text' : 'password'" label="Şifre" prepend-icon="mdi-lock"
                                variant="outlined" required @click:append="showPassword = !showPassword"></v-text-field>

                            <div class="d-flex justify-space-between align-center mb-4">
                                <v-checkbox v-model="rememberMe" label="Beni hatırla" color="primary"
                                    hide-details></v-checkbox>

                                <v-btn variant="text" color="primary" class="text-caption" to="/forgot-password">
                                    Şifrenizi mi unuttunuz?
                                </v-btn>
                            </div>

                            <v-btn block color="primary" size="large" type="submit" :loading="isLoading"
                                :disabled="!isFormValid">
                                Giriş Yap
                            </v-btn>

                            <div class="text-center mt-4">
                                <span class="text-body-2">Hesabınız yok mu? </span>
                                <v-btn variant="text" color="primary" class="text-caption" to="/register">
                                    Hesap Oluştur
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

// Router
const router = useRouter()

// Form referansı
const form = ref(null)

// Form state
const isFormValid = ref(false)
const isLoading = ref(false)
const showPassword = ref(false)
const email = ref('')
const password = ref('')
const rememberMe = ref(false)

// Doğrulama kuralları
const emailRules = [
    v => !!v || 'Email alanı zorunludur',
    v => /.+@.+\..+/.test(v) || 'Geçerli bir email adresi girin'
]

const passwordRules = [
    v => !!v || 'Şifre alanı zorunludur',
    v => v.length >= 6 || 'Şifre en az 6 karakter olmalıdır'
]

// Giriş işlemi
const handleLogin = async () => {
    // Form doğrulamasını kontrol et
    const { valid } = await form.value.validate()

    if (!valid) return

    // Yükleniyor durumunu aktifleştir
    isLoading.value = true

    try {
        // API'ye giriş isteği gönder
        // Burada gerçek API entegrasyonunuzu yapabilirsiniz
        // Örnek: 
        // const response = await fetch('/api/login', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     email: email.value,
        //     password: password.value,
        //     rememberMe: rememberMe.value
        //   })
        // })
        await useAuthStore().loginAuth(JSON.stringify({
            email: email.value,
            password: password.value
        }))


        console.log('Giriş denemesi:', {
            email: email.value,
            password: password.value,
            rememberMe: rememberMe.value
        })

        // Başarılı giriş sonrası yönlendirme
        // Gerçek uygulamada API'den token alındıktan sonra yönlendirme yapılmalı
        setTimeout(() => {
            isLoading.value = false
            router.push('/dashboard')
        }, 1000)

    } catch (error) {
        // Hata işleme
        console.error('Giriş hatası:', error)
        isLoading.value = false
    }
}
</script>