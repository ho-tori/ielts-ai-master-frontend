import { defineStore } from 'pinia'

export type ThemeName = 'light' | 'ocean' | 'mono'

interface State {
  currentTheme: ThemeName
}

const THEME_STORAGE_KEY = 'app-theme'
const THEME_SEQUENCE: ThemeName[] = ['light', 'ocean', 'mono']

function isThemeName(value: string | null): value is ThemeName {
  return value === 'light' || value === 'ocean' || value === 'mono'
}

export const useThemeStore = defineStore('theme', {
  state: (): State => ({
    currentTheme: 'light'
  }),
  actions: {
    initTheme() {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
      this.applyTheme(isThemeName(savedTheme) ? savedTheme : 'light')
    },

    toggleTheme() {
      const currentIndex = THEME_SEQUENCE.indexOf(this.currentTheme)
      const nextTheme = THEME_SEQUENCE[(currentIndex + 1) % THEME_SEQUENCE.length] ?? 'light'
      this.applyTheme(nextTheme)
    },

    applyTheme(theme: ThemeName) {
      this.currentTheme = theme
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    }
  }
})
