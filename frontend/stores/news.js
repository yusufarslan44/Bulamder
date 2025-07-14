import { defineStore } from "pinia";
import { useAuthStore } from './auth';
import { useNuxtApp } from '#app'

export const useNewsStore = defineStore("news", {
  state: () => ({
    news: [],
    detailNews: [],
    upcomingNews: [],
    relatedNews: [],
    loading: false,
    error: null,
  }),

  actions: {
    // Tüm etkinlikleri getir
    async fetchNews() {
      const { $api } = useNuxtApp()
      this.loading = true;
      this.error = null;
      try {
        const response = await $api("/news/");
        console.log("fecht news response", response);
        this.news = response.news;
        console.log("news", this.news);
      } catch (error) {
        console.error("Etkinlikler yüklenirken hata:", error);
        this.error = "Etkinlikler yüklenirken bir hata oluştu";
      } finally {
        this.loading = false;
      }
    },

    async fetchNewsById(id) {
      const { $api } = useNuxtApp()
      this.loading = true;
      this.error = null;
      try {
        const response = await $api(`/news/` + id);
        console.log("fecht news detail response", response);
        this.detailNews = response.news;
        return this.detailNews;
      } catch (error) {
        console.error("Etkinlik yüklenirken hata:", error);
        this.error = "Etkinlik yüklenirken bir hata oluştu";
      } finally {
        this.loading = false;
      }
    },
    async fetchRelatedNews(id) {
      const { $api } = useNuxtApp()
      this.loading = true;
      this.error = null;
      try {
        const response = await $api(`/news/related/` + id);
        console.log("fecht related response", response);
        this.relatedNews = response.relatedNews;
        console.log("relatedNews", this.relatedNews);
        return this.relatedNews;
      } catch (error) {
        console.error("Etkinlikler yüklenirken hata:", error);
        this.error = "Etkinlikler yüklenirken bir hata oluştu";
      } finally {
        this.loading = false;
      }
    },

    // Yaklaşan etkinlikleri getir
    async fetchUpcomingNews() {
      const { $api } = useNuxtApp()
      this.loading = true;
      this.error = null;
      try {
        const response = await $api("/news/upcoming");
        this.upcomingNews = response;
      } catch (error) {
        console.error("Yaklaşan etkinlikler yüklenirken hata:", error);
        this.error = "Yaklaşan etkinlikler yüklenirken bir hata oluştu";
      } finally {
        this.loading = false;
      }
    },

    // Yeni etkinlik oluştur
    async createNews(formData) {
      const { $api } = useNuxtApp()
      console.log("çalıştı pina");
      this.loading = true;
      this.error = null;

      // Auth store'dan token'ı al
      const authStore = useAuthStore();
      if (!authStore.token) {
        authStore.getTokenFromCookie();
      }

      if (!authStore.token) {
        this.error = "Yetkilendirme hatası: Oturum açmanız gerekiyor";
        return { success: false, message: this.error };
      }

      try {
        const response = await $api("/news/", {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        });
        console.log("response ", response);
        this.news = response;
        return this.news
      } catch (error) {
        console.error("Etkinlik oluşturulurken hata:", error);
        this.error = error.response?.data?.message || "Etkinlik oluşturulurken bir hata oluştu";
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    // Etkinlik güncelle
    async updateNews(newsId, formData) {
      const { $api } = useNuxtApp()
      this.loading = true;
      this.error = null;

      // Auth store'dan token'ı al
      const authStore = useAuthStore();
      if (!authStore.token) {
        authStore.getTokenFromCookie();
      }

      if (!authStore.token) {
        this.error = "Yetkilendirme hatası: Oturum açmanız gerekiyor";
        return { success: false, message: this.error };
      }

      try {
        const response = await $api(
          `/news/${newsId}`,
          {
            method: "PUT",
            headers: {
              'Authorization': `Bearer ${authStore.token}`
            },
            body: formData,
          }
        );
        if (response.success) {
          // Güncellenen etkinliği listede güncelle
          const index = this.news.findIndex((news) => news._id === newsId);
          if (index !== -1) {
            this.news[index] = response.news;
          }
          return { success: true, message: "Etkinlik başarıyla güncellendi" };
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error("Etkinlik güncellenirken hata:", error);
        this.error = "Etkinlik güncellenirken bir hata oluştu";
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    // Etkinlik sil
    async deleteNews(newsId) {
      const { $api } = useNuxtApp()
      this.loading = true;
      this.error = null;

      // Auth store'dan token'ı al
      const authStore = useAuthStore();
      if (!authStore.token) {
        authStore.getTokenFromCookie();
      }

      if (!authStore.token) {
        this.error = "Yetkilendirme hatası: Oturum açmanız gerekiyor";
        return { success: false, message: this.error };
      }

      try {
        const response = await $api(
          `/news/${newsId}`,
          {
            method: "DELETE",
            headers: {
              'Authorization': `Bearer ${authStore.token}`
            }
          }
        );
        if (response.success) {
          // Silinen etkinliği listeden kaldır
          this.news = this.news.filter((news) => news._id !== newsId);
          return { success: true, message: "Etkinlik başarıyla silindi" };
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        console.error("Etkinlik silinirken hata:", error);
        this.error = "Etkinlik silinirken bir hata oluştu";
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    }
  },

  getters: {
    getNews: (state) => state.news,
    getUpcomingNews: (state) => state.upcomingNews,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    getNewsById: (state) => (id) => state.news.find((news) => news._id === id),
    getDetailNews: (state) => state.detailNews,
    getRelatedNews: (state) => state.relatedNews
  },
});
