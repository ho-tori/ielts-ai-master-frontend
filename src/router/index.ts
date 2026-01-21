import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
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
          component: () => import('../views/dashboard/DashboardView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'reading',
          name: 'Reading',
          component: () => import('../views/reading/ReadingView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'practice',
          name: 'Practice',
          component: () => import('../views/practice/PracticeView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'account',
          name: 'Account',
          component: () => import('../views/account/AccountView.vue'),
          meta: { requiresAuth: true }
        }
      ]
    },
    // 404 页面 - 需要放在最后
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/notfound/NotFoundView.vue')
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