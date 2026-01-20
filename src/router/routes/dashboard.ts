import DashboardView from '../../views/dashboard/DashboardView.vue'

export default [
  {
    path: 'dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  }
]
