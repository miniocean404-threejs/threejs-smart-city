import { createRouter, createWebHistory } from "vue-router";

import baseRouters from "@/router/module/base";
import webglRouters from "@/router/module/webgl.js";

const routes = [...baseRouters,...webglRouters];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return {
      el: "#app",
      top: 0,
      behavior: "smooth",
    };
  },
});

export default router;
