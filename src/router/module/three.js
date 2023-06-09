export default [
  {
    path: '/three',
    children: [
      {
        path: 'simple',
        children: [
          {
            path: '3d-object',
            name: '3d-object',
            component: () => import('@/view/threejs/1.简单实现隐形、雾化效果/1.渲染三维对象/index.vue'),
          },
        ],
      },
    ],
  },
]
