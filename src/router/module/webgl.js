export default [
  {
    path: "/canvas",
    name: "canvas",
    component: () => import("@/view/webgl/canvas.vue"),
  },
  {
    path: "/webgl",
    name: "webgl",
    component: () => import("@/view/webgl/webgl.vue"),
  },
];
