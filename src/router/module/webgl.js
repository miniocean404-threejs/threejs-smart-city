export default [
  {
    path: '/webgl',
    children: [
      {
        path: 'canvas',
        name: 'canvas',
        component: () => import('@/view/webgl/1.入门/canvas.vue'),
      },
      {
        path: 'gl',
        name: 'gl',
        component: () => import('@/view/webgl/1.入门/webgl.vue'),
      },
      {
        path: 'point',
        name: 'point',
        component: () => import('@/view/webgl/2.绘制一个点/point.vue'),
      },
      {
        path: 'attribute',
        name: 'attribute',
        component: () => import('@/view/webgl/3.修改位置的attribute/attribute.vue'),
      },
      {
        path: 'draw',
        name: 'draw',
        component: () => import('@/view/webgl/4.鼠标控制绘制/draw.vue'),
      },
      {
        path: 'color',
        name: 'color',
        component: () => import('@/view/webgl/5.修改颜色的uniform/color.vue'),
      },
    ],
  },
]
