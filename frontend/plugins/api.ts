export default defineNuxtPlugin(() => {
  const cfg = useRuntimeConfig()
  const baseURL = String(process.client ? cfg.public.NUXT_PUBLIC_API_BASE : cfg.apiBase) || '/api'
  const api = $fetch.create({ baseURL })
  return { provide: { api } }
})
