import { createRouter, createWebHistory } from 'vue-router'

import baseRouters from '@/router/module/base'
import webglRouters from '@/router/module/webgl.js'
import threeJsRouters from '@/router/module/three'
import projectRouters from '@/router/module/project'

const routes = [...baseRouters, ...webglRouters, ...threeJsRouters, ...projectRouters]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return {
      el: '#app',
      top: 0,
      behavior: 'smooth',
    }
  },
})

export default router
