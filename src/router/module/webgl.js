export default [
  {
    path: '/webgl',
    children: [
      {
        path: 'canvas',
        name: 'canvas',
        component: () => import('@/view/webgl/入门/canvas.vue'),
      },
      {
        path: 'gl',
        name: 'gl',
        component: () => import('@/view/webgl/入门/webgl.vue'),
      },
      {
        path: 'point',
        name: 'point',
        component: () => import('@/view/webgl/绘制一个点/point.vue'),
      },
    ],
  },
]
