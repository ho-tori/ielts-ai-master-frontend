import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import './styles/globals.css'
import { useUserStore } from './stores/user'
import { useThemeStore } from './stores/theme'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

async function bootstrap() {
	const themeStore = useThemeStore(pinia)
	themeStore.initTheme()

	const userStore = useUserStore(pinia)
	if (userStore.token) {
		await userStore.fetchProfile()
	}
	app.mount('#app')
}

bootstrap()