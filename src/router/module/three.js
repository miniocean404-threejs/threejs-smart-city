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
      {
        path: 'light',
        children: [
          {
            path: 'spot',
            name: 'spot',
            component: () => import('@/view/threejs/3.光/1.聚光灯光源/index.vue'),
          },
          {
            path: 'env',
            name: 'env',
            component: () => import('@/view/threejs/3.光/2.环境光/index.vue'),
          },
          {
            path: 'point',
            name: 'point',
            component: () => import('@/view/threejs/3.光/3.点光源/index.vue'),
          },
          {
            path: 'parallel',
            name: 'parallel',
            component: () => import('@/view/threejs/3.光/4.平行光/index.vue'),
          },
          {
            path: 'ball',
            name: 'ball',
            component: () => import('@/view/threejs/3.光/5.半球光/index.vue'),
          },
        ],
      },
    ],
  },
]