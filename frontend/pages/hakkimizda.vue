<template>
    <v-container class="py-16">
        <!-- Başlık -->
        <v-row justify="center" class="mb-16">
            <v-col cols="12" md="8" class="text-center">
                <h1 class="text-h3 font-weight-bold mb-4">Hakkımızda</h1>
                <p class="text-body-1">
                    Yenilikçi çözümler ve profesyonel hizmet anlayışıyla müşterilerimizin yanındayız.
                </p>
            </v-col>
        </v-row>

        <!-- Vizyon & Misyon -->
        <v-row class="mb-16">
            <v-col cols="12" md="6">
                <v-card height="100%" class="pa-6" elevation="2">
                    <v-card-item>
                        <template v-slot:prepend>
                            <v-icon icon="mdi-eye" color="primary" size="x-large" class="mb-4"></v-icon>
                        </template>
                        <v-card-title class="text-h4 mb-4">Vizyonumuz</v-card-title>
                        <v-card-text class="text-body-1">
                            Dijital dünyada öncü ve yenilikçi çözümlerle, müşterilerimizin ihtiyaçlarını en iyi şekilde
                            karşılayan,
                            güvenilir ve tercih edilen bir teknoloji partneri olmak.
                        </v-card-text>
                    </v-card-item>
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <v-card height="100%" class="pa-6" elevation="2">
                    <v-card-item>
                        <template v-slot:prepend>
                            <v-icon icon="mdi-flag" color="primary" size="x-large" class="mb-4"></v-icon>
                        </template>
                        <v-card-title class="text-h4 mb-4">Misyonumuz</v-card-title>
                        <v-card-text class="text-body-1">
                            En son teknolojileri kullanarak, müşterilerimizin dijital dönüşüm süreçlerinde yanlarında
                            olmak ve
                            sürdürülebilir başarı hikayeleri yazmalarına katkıda bulunmak.
                        </v-card-text>
                    </v-card-item>
                </v-card>
            </v-col>
        </v-row>

        <!-- İstatistikler -->
        <v-row class="mb-16">
            <v-col cols="12">
                <v-card color="primary" class="pa-8">
                    <v-row>
                        <v-col v-for="(stat, index) in stats" :key="index" cols="6" md="3" class="text-center">
                            <h3 class="text-h3 font-weight-bold text-white mb-2">{{ stat.value }}</h3>
                            <p class="text-body-1 text-white">{{ stat.label }}</p>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <!-- Ekibimiz -->
        <v-row class="mb-8">
            <v-col cols="12" class="text-center">
                <h2 class="text-h4 font-weight-bold mb-4">Ekibimiz</h2>
                <p class="text-body-1 mb-8">
                    Profesyonel ve deneyimli ekibimizle hizmetinizdeyiz
                </p>
            </v-col>
        </v-row>

        <v-row>
            <v-col v-for="(member, index) in team" :key="index" cols="12" sm="6" md="3">
                <v-card class="text-center" elevation="2">
                    <v-img :src="member.image" height="300" cover>
                        <template v-slot:placeholder>
                            <v-row class="fill-height ma-0" align="center" justify="center">
                                <v-progress-circular indeterminate color="primary"></v-progress-circular>
                            </v-row>
                        </template>
                    </v-img>
                    <v-card-item>
                        <v-card-title class="text-h6 mb-1">{{ member.name }}</v-card-title>
                        <v-card-subtitle class="mb-2">{{ member.position }}</v-card-subtitle>
                        <v-card-text>{{ member.description }}</v-card-text>
                    </v-card-item>
                    <v-card-actions class="justify-center pa-4">
                        <v-btn v-for="(social, sIndex) in member.social" :key="sIndex" :icon="social.icon"
                            variant="text" color="primary"></v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
const stats = [
    { value: '10+', label: 'Yıllık Tecrübe' },
    { value: '500+', label: 'Mutlu Müşteri' },
    { value: '150+', label: 'Tamamlanan Proje' },
    { value: '24/7', label: 'Destek' }
]

const team = [
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
</script>

<style scoped>
.v-card {
    transition: transform 0.3s ease-in-out;
}

.v-card:hover {
    transform: translateY(-5px);
}
</style>