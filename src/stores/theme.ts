import { defineStore } from 'pinia'

export type ThemeName = 'light' | 'ocean'

interface State {
  currentTheme: ThemeName
}

const THEME_STORAGE_KEY = 'app-theme'

export const useThemeStore = defineStore('theme', {
  state: (): State => ({
    currentTheme: 'light'
  }),
  actions: {
    initTheme() {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null
      const nextTheme: ThemeName = savedTheme === 'ocean' ? 'ocean' : 'light'
      this.applyTheme(nextTheme)
    },

    toggleTheme() {
      const nextTheme: ThemeName = this.currentTheme === 'light' ? 'ocean' : 'light'
      this.applyTheme(nextTheme)
    },

    applyTheme(theme: ThemeName) {
      this.currentTheme = theme
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    }
  }
})
