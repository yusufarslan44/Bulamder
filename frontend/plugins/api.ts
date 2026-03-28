export default defineNuxtPlugin(() => {
  const cfg = useRuntimeConfig()
  const normalizeBase = (value: unknown) =>
    String(value || '')
      .trim()
      .replace(/\/+$/, '')

  const resolveServerBase = () => {
    const configured = normalizeBase(cfg.apiBase)
    if (configured) return configured

    if (import.meta.dev) {
      return 'http://127.0.0.1:5001/api'
    }

    const reqUrl = useRequestURL()
    return `${reqUrl.origin}/api`
  }

  const resolveClientBase = () => {
    const configured = normalizeBase(cfg.public.NUXT_PUBLIC_API_BASE)
    if (configured) return configured

    if (import.meta.dev) {
      return 'http://127.0.0.1:5001/api'
    }

    return '/api'
  }

  const baseURL = import.meta.client ? resolveClientBase() : resolveServerBase()
  const api = $fetch.create({ baseURL })
  return { provide: { api } }
})
