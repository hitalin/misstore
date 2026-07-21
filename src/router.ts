import { createRouter, createWebHistory } from 'vue-router'
import StorePage from '@/pages/StorePage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: StorePage },
    {
      path: '/plugins/:id',
      component: () => import('@/pages/PluginDetail.vue'),
    },
    {
      path: '/themes/:id',
      component: () => import('@/pages/ThemeDetail.vue'),
    },
    {
      path: '/widgets/:id',
      component: () => import('@/pages/WidgetDetail.vue'),
    },
    {
      path: '/skills/:id',
      component: () => import('@/pages/SkillDetail.vue'),
    },
    {
      path: '/queries/:id',
      component: () => import('@/pages/QueryDetail.vue'),
    },
  ],
})

export default router
