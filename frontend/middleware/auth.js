export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie('token') // veya localStorage kullanıyorsan onu kontrol et
  
    if (!token.value) {
      return navigateTo('/login') // token yoksa login sayfasına yönlendir
    }
  })