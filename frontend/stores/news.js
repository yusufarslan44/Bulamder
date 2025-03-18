import axios from "axios";
import { defineStore } from "pinia";

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
      this.loading = true;
      this.error = null;
      try {
        const response = await $fetch("http://localhost:5000/api/news/");
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
      this.loading = true;
      this.error = null;
      try {
        const response = await $fetch(`http://localhost:5000/api/news/` + id);
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
      this.loading = true;
      this.error = null;
      try {
        const response = await $fetch(`http://localhost:5000/api/news/related/` + id);
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
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch("http://localhost:5000/api/news/upcoming");
        const data = await response.json();
        this.upcomingNews = data;
      } catch (error) {
        console.error("Yaklaşan etkinlikler yüklenirken hata:", error);
        this.error = "Yaklaşan etkinlikler yüklenirken bir hata oluştu";
      } finally {
        this.loading = false;
      }
    },

    // Yeni etkinlik oluştur
    async createNews(formData) {
      console.log("çalıştı pina");
      this.loading = true;
      this.error = null;
      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/news/",
          formData
        );
        console.log("response ", data);
        this.news = data;
        return this.news
      } catch (error) {
        console.error("Etkinlik oluşturulurken hata:", error);
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },

    // Etkinlik güncelle
    async updateNews(newsId, formData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(
          `http://localhost:5000/api/news/${newsId}`,
          {
            method: "PUT",
            body: formData,
          }
        );
        const data = await response.json();
        if (response.ok) {
          // Güncellenen etkinliği listede güncelle
          const index = this.news.findIndex((news) => news._id === newsId);
          if (index !== -1) {
            this.news[index] = data.news;
          }
          return { success: true, message: "Etkinlik başarıyla güncellendi" };
        } else {
          throw new Error(data.message);
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
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(
          `http://localhost:5000/api/news/${newsId}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          // Silinen etkinliği listeden kaldır
          this.news = this.news.filter((news) => news._id !== newsId);
          return { success: true, message: "Etkinlik başarıyla silindi" };
        } else {
          const data = await response.json();
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("Etkinlik silinirken hata:", error);
        this.error = "Etkinlik silinirken bir hata oluştu";
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    // Tüm etkinlikleri getir
    getNews: (state) => state.news,

    // Yaklaşan etkinlikleri getir
    getupcomingNews: (state) => state.upcomingNews,

    // Yükleniyor durumunu getir
    isLoading: (state) => state.loading,

    // Hata durumunu getir
    getError: (state) => state.error,
  },
});
