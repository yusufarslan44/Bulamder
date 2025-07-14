import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    /**
     * API isteği için yardımcı fonksiyon
     * @param {string} endpoint - API endpoint'i
     * @param {Object} options - $fetch opsiyonları
     * @returns {Promise} API yanıtı
     */
    const api = async (endpoint: string, options: any = {}) => {
        const url = `${config.public.apiBaseUrl}${endpoint}`
        return $fetch(url, options)
    }

    return {
        provide: {
            api
        }
    }
}) 