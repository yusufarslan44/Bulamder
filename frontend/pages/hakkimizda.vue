<template>
    <v-container class="py-16">
        <!-- Başlık -->
        <v-row justify="center" class="mb-12">
            <v-col cols="12" md="8" class="text-center">
                <span class="text-overline text-green-darken-2 font-weight-bold d-block mb-2">{{
                    aboutHeaderSection.subtitle }}</span>
                <h1 class="text-h3 font-weight-bold mb-3">{{ aboutHeaderSection.title }}</h1>
                <div class="section-divider mx-auto mb-4"></div>
                <p class="text-body-1">
                    {{ aboutHeaderSection.content }}
                </p>
            </v-col>
        </v-row>

        <!-- Vizyon & Misyon -->
        <v-row class="mb-16" justify="center">
            <v-col cols="12" md="10">
                <v-row>
                    <v-col cols="12" md="6" class="fade-in-item">
                        <v-card height="100%" class="pa-6 rounded-xl about-card" elevation="3">
                            <div class="card-icon-container mb-4">
                                <v-icon icon="mdi-eye" color="white" size="32"></v-icon>
                            </div>
                            <v-card-title class="text-h4 mb-4 font-weight-bold">{{ visionMissionSection.vision.title
                                }}</v-card-title>
                            <v-card-text class="text-body-1">
                                {{ visionMissionSection.vision.content }}
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col cols="12" md="6" class="fade-in-item" style="animation-delay: 0.2s;">
                        <v-card height="100%" class="pa-6 rounded-xl about-card" elevation="3">
                            <div class="card-icon-container mb-4">
                                <v-icon icon="mdi-flag" color="white" size="32"></v-icon>
                            </div>
                            <v-card-title class="text-h4 mb-4 font-weight-bold">{{ visionMissionSection.mission.title
                                }}</v-card-title>
                            <v-card-text class="text-body-1">
                                {{ visionMissionSection.mission.content }}
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <!-- İstatistikler -->
     <!-- <v-row class="mb-16" justify="center">
            <v-col cols="12" md="10">
                <v-card color="primary" class="pa-8 rounded-xl stats-card" elevation="5">
                    <v-row>
                        <v-col v-for="(stat, index) in stats" :key="index" cols="6" md="3"
                            class="text-center stat-item">
                            <div class="stat-value text-h2 font-weight-bold text-white mb-2 counter-animation">{{
                                stat.value }}</div>
                            <div class="stat-label text-body-1 text-white-darken-1">{{ stat.label }}</div>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        
--> 
        <!-- Ekibimiz -->
        <v-row justify="center" class="mb-8">
            <v-col cols="12" md="8" class="text-center">
                <span class="text-overline text-green-darken-2 font-weight-bold d-block mb-2">{{ teamSection.subtitle
                    }}</span>
                <h2 class="text-h4 font-weight-bold mb-3">{{ teamSection.title }}</h2>
                <div class="section-divider mx-auto mb-4"></div>
                <p class="text-body-1 mb-8">
                    {{ teamSection.content }}
                </p>
            </v-col>
        </v-row>

        <v-row justify="center">
            <v-col cols="12" md="10">
                <v-row>
                    <v-col v-for="(member, index) in team" :key="index" cols="12" sm="6" md="3" class="fade-in-item"
                        :style="{ 'animation-delay': `${index * 0.15}s` }">
                        <v-card class="team-card rounded-xl overflow-hidden" elevation="3">
                            <div class="image-container">
                                <v-img :src="member.image" height="300" cover class="team-image">
                                    <template v-slot:placeholder>
                                        <v-row class="fill-height ma-0" align="center" justify="center">
                                            <v-progress-circular indeterminate color="primary"></v-progress-circular>
                                        </v-row>
                                    </template>
                                    <div class="image-overlay-gradient"></div>
                                </v-img>
                            </div>
                            <v-card-item class="text-center pa-4">
                                <v-card-title class="text-h5 font-weight-bold mb-1">{{ member.name }}</v-card-title>
                                <v-chip color="primary" size="small" class="mb-3 position-chip">{{ member.position
                                    }}</v-chip>
                                <v-card-text class="text-body-2">{{ member.description }}</v-card-text>
                            </v-card-item>
                            <v-card-actions class="justify-center pa-4 social-actions">
                                <v-btn v-for="(social, sIndex) in member.social" :key="sIndex" :icon="social.icon"
                                    variant="text" color="primary" size="small" class="mx-1 social-btn"></v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <!-- Değerlerimiz -->
        <v-row justify="center" class="mt-16">
            <v-col cols="12" md="8" class="text-center">
                <span class="text-overline text-green-darken-2 font-weight-bold d-block mb-2">{{ valuesSection.subtitle
                    }}</span>
                <h2 class="text-h4 font-weight-bold mb-3">{{ valuesSection.title }}</h2>
                <div class="section-divider mx-auto mb-4"></div>
            </v-col>
        </v-row>

        <v-row justify="center" class="mb-16">
            <v-col cols="12" md="10">
                <v-row>
                    <v-col v-for="(value, index) in values" :key="index" cols="12" sm="6" md="3">
                        <v-card height="100%" class="value-card pa-5 rounded-xl" elevation="2">
                            <div class="d-flex justify-center mb-4">
                                <v-icon :icon="value.icon" color="primary" size="42"></v-icon>
                            </div>
                            <v-card-title class="text-h6 text-center font-weight-bold mb-3">{{ value.title
                                }}</v-card-title>
                            <v-card-text class="text-body-2 text-center">
                                {{ value.description }}
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { usePageContentStore } from '~/stores/pageContent'

// Sayfa içeriğini tutan reactive ref
const pageContent = ref(null)

// Sayfa içeriğini getir
onMounted(async () => {
    try {
        const content = await usePageContentStore().fetchPageContent('hakkimizda')
        if (content) {
            pageContent.value = content
        }
    } catch (error) {
        console.error('Sayfa içeriği yüklenirken hata:', error)
    }
})

// Bölüm içerik getirme fonksiyonu
const getSectionContent = (sectionName) => {
    if (!pageContent.value || !pageContent.value.sections) return null
    return pageContent.value.sections.find(section => section.sectionName === sectionName)
}

// Hakkımızda başlık bölümü
const aboutHeaderSection = computed(() => getSectionContent('header') || {
    title: 'Hakkımızda',
    subtitle: 'BİZ KİMİZ',
    content: 'Yenilikçi çözümler ve profesyonel hizmet anlayışıyla Çelikhan\'ın gelişimine katkı sağlıyoruz.'
})

// Vizyon & Misyon bölümü
const visionMissionSection = computed(() => {
    // Bu bölümleri ayrı ayrı getir
    const vision = getSectionContent('vision') || {
        title: 'Vizyonumuz',
        content: 'Dijital dünyada öncü ve yenilikçi çözümlerle, müşterilerimizin ihtiyaçlarını en iyi şekilde karşılayan, güvenilir ve tercih edilen bir teknoloji partneri olmak.'
    }

    const mission = getSectionContent('mission') || {
        title: 'Misyonumuz',
        content: 'En son teknolojileri kullanarak, müşterilerimizin dijital dönüşüm süreçlerinde yanlarında olmak ve sürdürülebilir başarı hikayeleri yazmalarına katkıda bulunmak.'
    }

    return { vision, mission }
})

// İstatistikler bölümü
const statsSection = computed(() => getSectionContent('stats') || {
    title: 'İstatistikler',
    subtitle: 'RAKAMLARLA BİZ',
    stats: [
        { value: '10+', label: 'Yıllık Tecrübe' },
        { value: '500+', label: 'Mutlu Müşteri' },
        { value: '150+', label: 'Tamamlanan Proje' },
        { value: '24/7', label: 'Destek' }
    ]
})

// Ekibimiz bölümü
const teamSection = computed(() => getSectionContent('team') || {
    title: 'Ekibimiz',
    subtitle: 'TAKIM',
    content: 'Profesyonel ve deneyimli ekibimizle hizmetinizdeyiz',
    members: [
        {
            image: 'https://cdn.pixabay.com/photo/2019/11/10/11/13/businessman-4615724_1280.jpg',
            name: 'Ahmet Yılmaz',
            position: 'CEO & Kurucu',
            description: '15 yıllık sektör tecrübesi ile şirketimizi yönetiyor.',
            social: [
                { icon: 'mdi-linkedin', link: '#' },
                { icon: 'mdi-twitter', link: '#' }
            ]
        },
        {
            image: 'https://cdn.pixabay.com/photo/2021/03/02/12/04/woman-6062804_1280.jpg',
            name: 'Ayşe Kaya',
            position: 'Teknoloji Direktörü',
            description: 'Yazılım geliştirme süreçlerini yönetiyor.',
            social: [
                { icon: 'mdi-linkedin', link: '#' },
                { icon: 'mdi-github', link: '#' }
            ]
        },
        {
            image: 'https://cdn.pixabay.com/photo/2019/11/10/11/13/businessman-4615723_1280.jpg',
            name: 'Mehmet Demir',
            position: 'Tasarım Lideri',
            description: 'Kullanıcı deneyimi ve arayüz tasarımından sorumlu.',
            social: [
                { icon: 'mdi-linkedin', link: '#' },
                { icon: 'mdi-dribbble', link: '#' }
            ]
        },
        {
            image: 'https://cdn.pixabay.com/photo/2021/03/02/12/03/woman-6062802_1280.jpg',
            name: 'Zeynep Şahin',
            position: 'Proje Yöneticisi',
            description: 'Müşteri ilişkileri ve proje yönetimini üstleniyor.',
            social: [
                { icon: 'mdi-linkedin', link: '#' },
                { icon: 'mdi-twitter', link: '#' }
            ]
        }
    ]
})

// Değerlerimiz bölümü
const valuesSection = computed(() => getSectionContent('values') || {
    title: 'Değerlerimiz',
    subtitle: 'PRENSİPLER',
    values: [
        {
            icon: 'mdi-shield-check',
            title: 'Güvenilirlik',
            description: 'Verdiğimiz sözleri tutarız, gizlilik ve güvenlik en önemli önceliklerimizdir.'
        },
        {
            icon: 'mdi-lightbulb',
            title: 'Yenilikçilik',
            description: 'Teknoloji ve trendleri yakından takip eder, sürekli gelişime önem veririz.'
        },
        {
            icon: 'mdi-handshake',
            title: 'İşbirliği',
            description: 'Müşterilerimizle güçlü ilişkiler kurar, takım ruhuyla hareket ederiz.'
        },
        {
            icon: 'mdi-heart',
            title: 'Tutku',
            description: 'İşimizi seviyoruz ve en iyisini sunmak için çalışıyoruz.'
        }
    ]
})

// Sayfa içeriği yoksa varsayılan değerleri kullan
const stats = computed(() => statsSection.value.stats)
const team = computed(() => teamSection.value.members)
const values = computed(() => valuesSection.value.values)
</script>

<style scoped>
.section-divider {
    height: 4px;
    width: 70px;
    background: linear-gradient(90deg, #09c256, #0b7231);
    border-radius: 2px;
}

.about-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
    position: relative;
    border-top: 4px solid #09c256;
}

.about-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
}

.card-icon-container {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #09c256, #0b7231);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(9, 194, 86, 0.3);
}

.stats-card {
    background: linear-gradient(135deg, #0b7231, #09c256);
    transition: transform 0.3s ease;
    overflow: hidden;
}

.stats-card:hover {
    transform: translateY(-5px);
}

.stat-item {
    position: relative;
    padding: 20px 0;
}

.stat-item:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 20%;
    right: 0;
    height: 60%;
    width: 1px;
    background-color: rgba(255, 255, 255, 0.2);
}

.counter-animation {
    animation: countUp 2s ease-out forwards;
}

.team-card {
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    overflow: hidden;
}

.team-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1) !important;
}

.image-container {
    position: relative;
    overflow: hidden;
}

.team-image {
    transition: transform 0.5s ease;
}

.team-card:hover .team-image {
    transform: scale(1.05);
}

.image-overlay-gradient {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7));
    z-index: 1;
}

.position-chip {
    font-size: 0.75rem;
    background: linear-gradient(90deg, #09c256, #0b7231) !important;
    color: white !important;
}

.social-btn {
    opacity: 0.7;
    transition: all 0.3s ease;
}

.social-btn:hover {
    opacity: 1;
    transform: translateY(-3px);
}

.value-card {
    transition: all 0.3s ease;
    height: 100%;
}

.value-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05) !important;
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

@keyframes countUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 600px) {
    .stat-item:nth-child(2n)::after {
        display: none;
    }

    .stat-item:not(:nth-child(2n))::after {
        content: '';
        position: absolute;
        top: 20%;
        right: 0;
        height: 60%;
        width: 1px;
        background-color: rgba(255, 255, 255, 0.2);
    }
}
</style>