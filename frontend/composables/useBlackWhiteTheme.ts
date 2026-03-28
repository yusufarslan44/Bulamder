import { useTheme } from 'vuetify'

let mediaQuery: MediaQueryList | null = null
let mediaQueryHandler: ((event: MediaQueryListEvent) => void) | null = null

export const useBlackWhiteTheme = () => {
  const isBlackWhite = useState<boolean>('is-black-white-theme', () => false)
  const theme = useTheme()

  const applyTheme = () => {
    theme.global.name.value = isBlackWhite.value ? 'monochrome' : 'light'

    if (import.meta.client) {
      document.documentElement.classList.toggle('bw-theme', isBlackWhite.value)
      document.body.classList.toggle('bw-theme', isBlackWhite.value)
    }
  }

  const initTheme = () => {
    if (import.meta.client) {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      isBlackWhite.value = mediaQuery.matches

      if (!mediaQueryHandler) {
        mediaQueryHandler = (event: MediaQueryListEvent) => {
          isBlackWhite.value = event.matches
          applyTheme()
        }
        mediaQuery.addEventListener('change', mediaQueryHandler)
      }
    }

    applyTheme()
  }

  const toggleTheme = () => {
    isBlackWhite.value = !isBlackWhite.value
    applyTheme()
  }

  return {
    isBlackWhite,
    initTheme,
    toggleTheme,
    applyTheme
  }
}
