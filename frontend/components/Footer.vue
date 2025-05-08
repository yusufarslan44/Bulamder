<template>
  <v-footer class="footer-container pa-0">
    <!-- Dalgalı üst kenar efekti - daha küçük -->
    <div class="footer-wave">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path fill="#2E7D32" d="M0,32L80,34.7C160,37,320,43,480,40C640,37,800,27,960,24C1120,21,1280,27,1360,29.3L1440,32L1440,60L1360,60C1280,60,1120,60,960,60C800,60,640,60,480,60C320,60,160,60,80,60L0,60Z"></path>
      </svg>
    </div>

    <!-- Ana footer içeriği - daha kompakt -->
    <div class="footer-content bg-gradient px-3 py-6 w-100">
      <v-container class="py-0">
        <v-row dense>
          <!-- Logo ve Hakkımızda Kısmı - daha kısa açıklama -->
          <v-col cols="12" sm="6" md="3" class="px-3">
            <div class="footer-logo mb-3 d-flex align-center">
              <v-icon color="white" size="28" class="me-2">mdi-pine-tree</v-icon>
              <h3 class="text-h6 font-weight-bold mb-0">BULAMDER</h3>
            </div>
            <p class="text-body-2 mb-3 footer-text">
              Bulanık Kültür ve Dayanışma Derneği, hemşehrilerimiz arasındaki 
              birlik ve beraberlik duygularını güçlendirmek amacıyla kurulmuştur.
            </p>
            <div class="d-flex">
              <v-btn 
                v-for="(icon, i) in socialIcons" 
                :key="i"
                :href="icon.link" 
                target="_blank" 
                variant="text" 
                color="white" 
                class="social-btn me-1 pa-1" 
                icon
                size="small"
              >
                <v-icon size="20">{{ icon.icon }}</v-icon>
              </v-btn>
            </div>
          </v-col>

          <!-- Hızlı Linkler - Responsive düzenlenmiş -->
          <v-col cols="12" sm="6" md="4" class="px-3 footer-links-col">
            <h3 class="text-h6 font-weight-bold mb-2 section-title">Hızlı Linkler</h3>
            <v-divider class="divider mb-3" color="rgba(255,255,255,0.2)" width="40"></v-divider>
            
            <!-- Mobil görünümde tek sütun, tablet ve üstünde iki sütun -->
            <div class="footer-links-container">
              <v-row>
                <!-- İlk 3 link (veya mobilde hepsi) -->
                <v-col cols="12" sm="6" class="py-0">
                  <v-list class="footer-links-list pa-0 bg-transparent" density="compact">
                    <v-list-item
                      v-for="(link, i) in quickLinks.slice(0, quickLinks.length/2)"
                      :key="i"
                      :to="link.to"
                      class="footer-list-item pa-0 mb-1"
                      active-color="white"
                      density="compact"
                      color="white"
                      min-height="32"
                    >
                      <template v-slot:prepend>
                        <v-icon size="small" color="white" class="me-2">{{ link.icon }}</v-icon>
                      </template>
                      <v-list-item-title class="text-body-2 white--text text-truncate">{{ link.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-col>
                
                <!-- Son 3 link (mobilde gizlenir) -->
                <v-col cols="12" sm="6" class="py-0">
                  <v-list class="footer-links-list pa-0 bg-transparent" density="compact">
                    <v-list-item
                      v-for="(link, i) in quickLinks.slice(quickLinks.length/2)"
                      :key="i"
                      :to="link.to"
                      class="footer-list-item pa-0 mb-1"
                      active-color="white"
                      density="compact" 
                      color="white"
                      min-height="32"
                    >
                      <template v-slot:prepend>
                        <v-icon size="small" color="white" class="me-2">{{ link.icon }}</v-icon>
                      </template>
                      <v-list-item-title class="text-body-2 white--text text-truncate">{{ link.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </div>
          </v-col>

          <!-- İletişim Bilgileri - daha kompakt -->
          <v-col cols="12" md="5" class="px-3 footer-contact-col">
            <h3 class="text-h6 font-weight-bold mb-2 section-title">İletişim</h3>
            <v-divider class="divider mb-2" color="rgba(255,255,255,0.2)" width="40"></v-divider>
            
            <v-row dense class="contact-card pa-3 ma-0">
              <v-col cols="12" sm="6" v-for="(contact, i) in contactInfo.slice(0, 2)" :key="i" class="pa-1">
                <div class="d-flex align-center contact-item mb-2">
                  <div class="icon-wrapper me-3">
                    <v-icon color="white" size="18">{{ contact.icon }}</v-icon>
                  </div>
                  <div>
                    <div class="contact-label">{{ contact.label }}</div>
                    <div class="contact-text" v-html="contact.value"></div>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" sm="6" v-for="(contact, i) in contactInfo.slice(2)" :key="i+2" class="pa-1">
                <div class="d-flex align-center contact-item mb-2">
                  <div class="icon-wrapper me-3">
                    <v-icon color="white" size="18">{{ contact.icon }}</v-icon>
                  </div>
                  <div>
                    <div class="contact-label">{{ contact.label }}</div>
                    <div class="contact-text" v-html="contact.value"></div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Alt footer - daha kompakt -->
    <div class="footer-bottom py-2 px-3 w-100">
      <v-container class="py-0">
        <v-row align="center" dense>
          <v-col cols="12" md="6" class="text-center text-md-start order-2 order-md-1 py-1">
            <div class="footer-copyright">
              &copy; {{ new Date().getFullYear() }} 
              <strong>Bulanık Kültür ve Dayanışma Derneği</strong>
            </div>
          </v-col>
          
          <v-col cols="12" md="6" class="text-center text-md-end order-1 order-md-2 py-1">
            <v-btn 
              v-for="(link, i) in bottomLinks" 
              :key="i" 
              :to="link.to" 
              size="small" 
              variant="text" 
              class="footer-bottom-link me-2 pa-1"
            >
              {{ link.title }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-footer>
</template>

<script setup>
const socialIcons = [
  { icon: 'mdi-facebook', link: 'https://facebook.com' },
  { icon: 'mdi-twitter', link: 'https://twitter.com' },
  { icon: 'mdi-instagram', link: 'https://instagram.com' },
  { icon: 'mdi-youtube', link: 'https://youtube.com' }
]

const quickLinks = [
  { title: 'Ana Sayfa', to: '/', icon: 'mdi-home' },
  { title: 'Hakkımızda', to: '/hakkimizda', icon: 'mdi-information' },
  { title: 'Etkinlikler', to: '/etkinlikler', icon: 'mdi-calendar' },
  { title: 'Galeri', to: '/galeri', icon: 'mdi-image-multiple' },
  { title: 'Gündem', to: '/gundem', icon: 'mdi-newspaper' },
  { title: 'İletişim', to: '/iletisim', icon: 'mdi-message-outline' }
]

const contactInfo = [
  { icon: 'mdi-map-marker', label: 'ADRES', value: 'Bulanık Mah. 123. Sok. No:45, Çelikhan' },
  { icon: 'mdi-phone', label: 'TELEFON', value: '+90 (555) 123 45 67' },
  { icon: 'mdi-email', label: 'E-POSTA', value: 'info@bulamder.org' },
  { icon: 'mdi-clock-outline', label: 'ÇALIŞMA SAATLERİ', value: 'Pazartesi - Cuma: 09:00 - 17:00' }
]

const bottomLinks = [
  { title: 'Gizlilik Politikası', to: '/gizlilik' },
  { title: 'Kullanım Şartları', to: '/kullanim-sartlari' },
  { title: 'SSS', to: '/sss' }
]
</script>

<style scoped>
.footer-container {
  position: relative;
  display: flex;
  flex-direction: column;
}

.footer-wave {
  position: relative;
  width: 100%;
  height: 30px;
  line-height: 0;
  transform: translateY(1px);
}

.footer-wave svg {
  height: 30px;
  width: 100%;
}

.bg-gradient {
  background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
}

.footer-content {
  color: white;
}

.footer-logo {
  display: flex;
  align-items: center;
}

.footer-text {
  opacity: 0.85;
  line-height: 1.5;
}

.social-btn {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.social-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-3px);
}

.section-title {
  position: relative;
  display: inline-block;
}

.divider {
  opacity: 0.3;
}

.footer-link {
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
  letter-spacing: 0.2px;
  opacity: 0.85;
  min-height: 0;
}

.footer-link:hover {
  opacity: 1;
  padding-left: 4px !important;
  background: rgba(255, 255, 255, 0.05);
}

.icon-wrapper {
  background: rgba(255, 255, 255, 0.1);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.contact-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  backdrop-filter: blur(5px);
}

.contact-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 0.5px;
  margin-bottom: 1px;
}

.contact-text {
  font-size: 13px;
  opacity: 0.9;
}

.footer-bottom {
  background-color: rgba(0, 0, 0, 0.15);
  color: rgba(255, 255, 255, 0.7);
}

.footer-copyright {
  font-size: 12px;
}

.footer-bottom-link {
  color: rgba(255, 255, 255, 0.7);
  text-transform: none;
  transition: all 0.3s ease;
  font-size: 12px;
}

.footer-bottom-link:hover {
  color: white;
  text-decoration: underline;
}

@media (max-width: 960px) {
  .footer-links-col, .footer-contact-col {
    margin-top: 10px;
  }
}

@media (max-width: 600px) {
  .footer-wave {
    height: 20px;
  }
  
  .footer-wave svg {
    height: 20px;
  }
  
  .contact-item {
    margin-bottom: 10px;
  }
  
  .footer-bottom {
    text-align: center;
  }
}
</style> 