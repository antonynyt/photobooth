import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/optin',
    name: 'optin',
    component: () => import('../views/OptinView.vue')
  },
  {
    path: '/camera',
    name: 'camera',
    component: () => import('../views/CameraView.vue')
  },
  {
    path: '/results',
    name: 'results',
    component: () => import('../views/ResultsView.vue')
  },
  {
    path: '/email',
    name: 'email',
    component: () => import('../views/EmailView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
