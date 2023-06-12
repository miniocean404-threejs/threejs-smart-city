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
          {
            path: 'light',
            name: 'light',
            component: () => import('@/view/threejs/1.简单实现隐形、雾化效果/2.添加灯光/index.vue'),
          },
          {
            path: 'shade',
            name: 'shade',
            component: () => import('@/view/threejs/1.简单实现隐形、雾化效果/3.添加阴影/index.vue'),
          },
          {
            path: 'fog',
            name: 'fog',
            component: () => import('@/view/threejs/1.简单实现隐形、雾化效果/4.雾化/index.vue'),
          },
        ],
      },
      {
        path: 'base',
        children: [
          {
            path: 'scene',
            name: 'scene',
            component: () => import('@/view/threejs/2.基础组件/1.scene/index.vue'),
          },
          {
            path: 'geometry',
            name: 'geometry',
            component: () => import('@/view/threejs/2.基础组件/2.geometry/index.vue'),
          },
          {
            path: 'camera',
            name: 'camera',
            component: () => import('@/view/threejs/2.基础组件/3.camera/index.vue'),
          },
        ],
      },
    ],
  },
]
