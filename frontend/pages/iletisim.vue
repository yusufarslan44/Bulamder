<template>
    <v-container class="pt-16 pb-16">
        <!-- Başlık -->
        <v-row justify="center" class="mb-12">
            <v-col cols="12" md="8" class="text-center">
                <span class="text-overline text-green-darken-2 font-weight-bold d-block mb-2">İLETİŞİM</span>
                <h1 class="text-h3 font-weight-bold mb-3">Bize Ulaşın</h1>
                <div class="section-divider mx-auto mb-4"></div>
                <p class="text-body-1">
                    Sorularınız, önerileriniz veya işbirliği talepleriniz için bizimle iletişime geçebilirsiniz
                </p>
            </v-col>
        </v-row>

        <v-row justify="center">
            <v-col cols="12" md="10" lg="10">
                <v-row>
                    <!-- İletişim Formu -->
                    <v-col cols="12" md="6" class="contact-form-col fade-in-item">
                        <v-card class="pa-6 rounded-xl contact-form-card" elevation="3">
                            <v-card-title class="text-h5 mb-4 font-weight-bold pb-2">
                                <div class="d-flex align-center">
                                    <v-icon icon="mdi-email-outline" color="primary" class="mr-2" size="large"></v-icon>
                                    <span>Mesaj Gönderin</span>
                                </div>
                            </v-card-title>

                            <v-form @submit.prevent="handleSubmit" class="mt-2">
                                <v-row>
                                    <v-col cols="12">
                                        <v-text-field v-model="form.name" label="Ad Soyad" variant="outlined" 
                                            prepend-inner-icon="mdi-account-outline"
                                            class="rounded-xl" density="comfortable"
                                            required :rules="[v => !!v || 'Ad Soyad gerekli']"></v-text-field>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-text-field v-model="form.email" label="E-posta" type="email"
                                            variant="outlined" prepend-inner-icon="mdi-email-outline"
                                            class="rounded-xl" density="comfortable"
                                            required :rules="[
                                                v => !!v || 'E-posta gerekli',
                                                v => /.+@.+\..+/.test(v) || 'E-posta geçerli değil'
                                            ]"></v-text-field>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-text-field v-model="form.subject" label="Konu" variant="outlined" 
                                            prepend-inner-icon="mdi-text-box-outline"
                                            class="rounded-xl" density="comfortable"
                                            required :rules="[v => !!v || 'Konu gerekli']"></v-text-field>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-textarea v-model="form.message" label="Mesajınız" variant="outlined" 
                                            prepend-inner-icon="mdi-message-text-outline" 
                                            class="rounded-xl" density="comfortable"
                                            required rows="4" :rules="[v => !!v || 'Mesaj gerekli']"></v-textarea>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-btn type="submit" color="primary" block size="large" class="rounded-xl submit-btn" elevation="2">
                                            <v-icon icon="mdi-send" class="mr-2"></v-icon>
                                            Gönder
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card>
                    </v-col>

                    <!-- İletişim Bilgileri -->
                    <v-col cols="12" md="6" class="contact-info-col fade-in-item" style="animation-delay: 0.2s;">
                        <v-card class="pa-6 h-100 rounded-xl contact-info-card" elevation="3">
                            <v-card-title class="text-h5 mb-4 font-weight-bold pb-2">
                                <div class="d-flex align-center">
                                    <v-icon icon="mdi-information-outline" color="primary" class="mr-2" size="large"></v-icon>
                                    <span>İletişim Bilgileri</span>
                                </div>
                            </v-card-title>

                            <v-list class="contact-list">
                                <v-list-item v-for="(info, index) in contactInfo" :key="index" class="mb-4 contact-list-item rounded-lg">
                                    <template v-slot:prepend>
                                        <div class="contact-icon-container">
                                            <v-icon :icon="info.icon" color="white" class="mx-auto"></v-icon>
                                        </div>
                                    </template>

                                    <v-list-item-title class="font-weight-bold mb-1">
                                        {{ info.title }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle class="text-body-2">
                                        {{ info.content }}
                                    </v-list-item-subtitle>
                                </v-list-item>
                            </v-list>

                            <v-divider class="my-6"></v-divider>

                            <v-card-title class="text-h6 mb-4 font-weight-bold">
                                <div class="d-flex align-center">
                                    <v-icon icon="mdi-share-variant" color="primary" class="mr-2"></v-icon>
                                    <span>Bizi Takip Edin</span>
                                </div>
                            </v-card-title>

                            <div class="d-flex flex-wrap social-media-container">
                                <v-btn v-for="(social, index) in socialMedia" :key="index" :href="social.link"
                                    target="_blank" class="social-btn-icon mr-2 mb-2" elevation="2">
                                    <v-icon>{{ social.icon }}</v-icon>
                                    <span class="ml-2 d-none d-sm-inline">{{ social.name }}</span>
                                </v-btn>
                            </div>
                            
                            <!-- Harita Görüntüsü -->
                            <div class="map-container mt-8 rounded-xl overflow-hidden">
                                <img src="https://maps.googleapis.com/maps/api/staticmap?center=Çelikhan,Adıyaman,Turkey&zoom=13&size=600x300&maptype=roadmap&markers=color:red%7CÇelikhan,Adıyaman,Turkey&key=YOUR_API_KEY" 
                                    alt="Harita" class="w-100 rounded-xl" style="height: 200px; object-fit: cover;">
                                <div class="map-overlay d-flex align-center justify-center">
                                    <v-btn color="primary" prepend-icon="mdi-map" class="rounded-pill" target="_blank"
                                        href="https://maps.google.com/?q=Çelikhan,Adıyaman,Turkey">
                                        Google Maps'te Görüntüle
                                    </v-btn>
                                </div>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <!-- SSS Bölümü -->
        <v-row justify="center" class="mt-16">
            <v-col cols="12" md="8" class="text-center">
                <span class="text-overline text-green-darken-2 font-weight-bold d-block mb-2">SSS</span>
                <h2 class="text-h4 font-weight-bold mb-3">Sık Sorulan Sorular</h2>
                <div class="section-divider mx-auto mb-4"></div>
            </v-col>
        </v-row>

        <v-row justify="center" class="mt-4">
            <v-col cols="12" md="10" lg="8">
                <v-expansion-panels class="faq-panels rounded-xl">
                    <v-expansion-panel v-for="(faq, index) in faqs" :key="index" class="mb-4 faq-panel rounded-xl" elevation="2">
                        <v-expansion-panel-title class="text-body-1 font-weight-medium py-4">
                            <div class="d-flex align-center">
                                <v-icon color="primary" class="mr-3">mdi-help-circle-outline</v-icon>
                                {{ faq.question }}
                            </div>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text class="text-body-2 py-4">
                            {{ faq.answer }}
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
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
    },
    {
        icon: 'mdi-clock-outline',
        title: 'Çalışma Saatleri',
        content: 'Hafta içi: 09:00 - 18:00, Hafta sonu: Kapalı'
    }
]

const socialMedia = [
    { icon: 'mdi-instagram', link: '#', name: 'Instagram' },
    { icon: 'mdi-twitter', link: '#', name: 'Twitter' },
    { icon: 'mdi-linkedin', link: '#', name: 'LinkedIn' },
    { icon: 'mdi-facebook', link: '#', name: 'Facebook' },
    { icon: 'mdi-youtube', link: '#', name: 'Youtube' }
]

const faqs = [
    {
        question: 'İletişim formundan mesaj gönderdikten sonra ne kadar sürede dönüş yapılır?',
        answer: 'İletişim formundan gönderilen mesajlara genellikle 24 saat içerisinde dönüş yapılmaktadır. Yoğunluk durumunda bu süre en fazla 48 saate kadar uzayabilir.'
    },
    {
        question: 'Ofisi ziyaret etmek için randevu almak gerekiyor mu?',
        answer: 'Evet, ofisimizi ziyaret etmek için önceden randevu almanız gerekmektedir. Randevu için telefon numaramızdan veya e-posta adresimizden bize ulaşabilirsiniz.'
    },
    {
        question: 'Hafta sonu hizmet veriyor musunuz?',
        answer: 'Ofisimiz hafta sonları kapalıdır, ancak acil durumlarda destek ekibimiz uzaktan hizmet vermektedir. Acil durumlar için iletişim bilgilerimizden bize ulaşabilirsiniz.'
    },
    {
        question: 'Online toplantı için hangi platformları kullanıyorsunuz?',
        answer: 'Online toplantılar için Zoom, Microsoft Teams ve Google Meet platformlarını kullanmaktayız. Tercih ettiğiniz platformu bize bildirebilirsiniz.'
    }
]

const handleSubmit = () => {
    console.log('Form gönderildi:', form.value)
    // Form gönderme işlemi burada gerçekleştirilecek
}
</script>

<style scoped>
.section-divider {
    height: 4px;
    width: 70px;
    background: linear-gradient(90deg, #09c256, #0b7231);
    border-radius: 2px;
}

.contact-form-card, .contact-info-card {
    height: 100%;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.contact-form-card:hover, .contact-info-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
}

.contact-icon-container {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #09c256, #0b7231);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    box-shadow: 0 4px 10px rgba(9, 194, 86, 0.3);
}

.contact-list {
    background-color: transparent;
}

.contact-list-item {
    transition: all 0.3s ease;
    padding: 10px;
    margin-bottom: 12px;
}

.contact-list-item:hover {
    background-color: rgba(9, 194, 86, 0.05);
    transform: translateX(5px);
}

.social-btn-icon {
    background: linear-gradient(135deg, #09c256, #0b7231);
    color: white;
    border-radius: 50px;
    padding: 0 16px;
    margin-right: 8px;
    transition: all 0.3s ease;
    height: 36px;
}

.social-btn-icon:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(9, 194, 86, 0.3);
    opacity: 0.9;
}

.submit-btn {
    background: linear-gradient(135deg, #09c256, #0b7231);
    transition: all 0.3s ease;
}

.submit-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(9, 194, 86, 0.3);
}

.map-container {
    position: relative;
    overflow: hidden;
}

.map-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.map-container:hover .map-overlay {
    opacity: 1;
}

.faq-panel {
    margin-bottom: 16px;
    transition: all 0.3s ease;
    overflow: hidden;
}

.faq-panel:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05) !important;
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

.v-container {
    background-color: #f9fafb;
    min-height: 100vh;
}

.h-100 {
    height: 100%;
}

.w-100 {
    width: 100%;
}

@media (max-width: 600px) {
    .contact-list-item .v-list-item__prepend {
        margin-right: 8px;
    }
    
    .contact-icon-container {
        width: 32px;
        height: 32px;
        margin-right: 8px;
    }
    
    .social-btn-icon {
        padding: 0;
        width: 36px;
        min-width: 36px;
    }
}
</style>