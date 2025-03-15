<template>
    <v-container class="pt-16">
        <v-row justify="center">
            <v-col cols="12">
                <h1 class="text-h3 text-center mb-6">İletişim</h1>
            </v-col>
        </v-row>

        <v-row justify="center">
            <v-col cols="12" md="10" lg="8">
                <v-row>
                    <!-- İletişim Formu -->
                    <v-col cols="12" md="6">
                        <v-card class="pa-4" elevation="2">
                            <v-card-title class="text-h5 mb-4">
                                Bize Ulaşın
                            </v-card-title>

                            <v-form @submit.prevent="handleSubmit">
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field v-model="form.name" label="Ad Soyad" variant="outlined" required
                                            :rules="[v => !!v || 'Ad Soyad gerekli']"></v-text-field>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-text-field v-model="form.email" label="E-posta" type="email"
                                            variant="outlined" required :rules="[
                                                v => !!v || 'E-posta gerekli',
                                                v => /.+@.+\..+/.test(v) || 'E-posta geçerli değil'
                                            ]"></v-text-field>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-text-field v-model="form.subject" label="Konu" variant="outlined" required
                                            :rules="[v => !!v || 'Konu gerekli']"></v-text-field>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-textarea v-model="form.message" label="Mesajınız" variant="outlined" required
                                            rows="4" :rules="[v => !!v || 'Mesaj gerekli']"></v-textarea>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-btn type="submit" color="primary" block size="large" elevation="2">
                                            Gönder
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card>
                    </v-col>

                    <!-- İletişim Bilgileri -->
                    <v-col cols="12" md="6">
                        <v-card class="pa-4 h-100" elevation="2">
                            <v-card-title class="text-h5 mb-4">
                                İletişim Bilgileri
                            </v-card-title>

                            <v-list>
                                <v-list-item v-for="(info, index) in contactInfo" :key="index" class="mb-4">
                                    <template v-slot:prepend>
                                        <v-icon :icon="info.icon" color="primary" size="large" class="mr-4"></v-icon>
                                    </template>

                                    <v-list-item-title class="font-weight-bold mb-1">
                                        {{ info.title }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                        {{ info.content }}
                                    </v-list-item-subtitle>
                                </v-list-item>
                            </v-list>

                            <v-divider class="my-4"></v-divider>

                            <v-card-title class="text-h6 mb-4">
                                Bizi Takip Edin
                            </v-card-title>

                            <div class="d-flex gap-2">
                                <v-btn v-for="(social, index) in socialMedia" :key="index" :href="social.link"
                                    target="_blank" icon color="primary" variant="tonal">
                                    <v-icon>{{ social.icon }}</v-icon>
                                </v-btn>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
const form = ref({
    name: '',
    email: '',
    subject: '',
    message: ''
})

const contactInfo = [
    {
        icon: 'mdi-map-marker',
        title: 'Adres',
        content: 'Örnek Mahallesi, Örnek Sokak No:123 İstanbul/Türkiye'
    },
    {
        icon: 'mdi-phone',
        title: 'Telefon',
        content: '+90 (555) 123 45 67'
    },
    {
        icon: 'mdi-email',
        title: 'E-posta',
        content: 'info@ornek.com'
    }
]

const socialMedia = [
    { icon: 'mdi-instagram', link: '#', name: 'Instagram' },
    { icon: 'mdi-twitter', link: '#', name: 'Twitter' },
    { icon: 'mdi-linkedin', link: '#', name: 'LinkedIn' },
    { icon: 'mdi-facebook', link: '#', name: 'Facebook' }
]

const handleSubmit = () => {
    console.log('Form gönderildi:', form.value)
}
</script>

<style scoped>
.v-container {
    min-height: 100vh;
    background-color: #f9fafb;
}

.h-100 {
    height: 100%;
}

.gap-2 {
    gap: 0.5rem;
}
</style>