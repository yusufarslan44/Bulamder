function fixProto(o: any) {
  if (!o || typeof o !== 'object') return
  if (Object.getPrototypeOf(o) === null) Object.setPrototypeOf(o, Object.prototype)
  for (const k in o) fixProto(o[k])
}
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:rendered', () => {
    const st = (nuxtApp as any).payload?.state
    if (st) fixProto(st)
  })
})
