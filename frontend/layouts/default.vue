<template>
    <div>
        <Navbar />
        <v-main>
            <slot />
        </v-main>
        <Footer />
    </div>
</template>

<script setup>
// Layout bileşenleri
import Footer from '~/components/Footer.vue'
</script>