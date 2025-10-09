export {}
declare module 'nuxt/schema' {
  interface RuntimeConfig { apiBase: string }
  interface PublicRuntimeConfig { NUXT_PUBLIC_API_BASE: string }
}
