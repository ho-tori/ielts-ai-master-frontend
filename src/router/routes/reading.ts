import ReadingView from '../../views/reading/ReadingView.vue'

export default [
  {
    path: 'reading',
    name: 'Reading',
    component: ReadingView,
    meta: { requiresAuth: true }
  }
]
