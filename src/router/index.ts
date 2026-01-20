import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import ReadingView from '../views/reading/ReadingView.vue'
import AccountView from '../views/account/AccountView.vue'
import DashboardView from '../views/dashboard/DashboardView.vue'
import PracticeView from '../views/practice/PracticeView.vue'
import authRoutes from './routes/auth'
import { getToken } from '../utils/storage'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...authRoutes,
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: DashboardView,
          meta: { requiresAuth: true }
        },
        {
          path: 'reading',
          name: 'Reading',
          component: ReadingView,
          meta: { requiresAuth: true }
        },
        {
          path: 'practice',
          name: 'Practice',
          component: PracticeView,
          meta: { requiresAuth: true }
        },
        {
          path: 'account',
          name: 'Account',
          component: AccountView,
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})

router.beforeEach((to) => {
  const token = getToken()
  const needsAuth = to.matched.some(r => (r.meta as any)?.requiresAuth !== false)
  if (needsAuth && to.path !== '/login' && !token) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  if (to.path === '/login' && token) {
    return { path: '/' }
  }
})

export default router