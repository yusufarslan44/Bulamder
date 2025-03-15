import { defineNuxtPlugin } from '#app'
import { QuillEditor } from '@vueup/vue-quill'
import 'quill/dist/quill.snow.css'


export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('QuillEditor', QuillEditor)
})
