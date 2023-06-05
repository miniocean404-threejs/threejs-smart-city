export default [
  {
    path: '/webgl',
    children: [
      {
        path: 'simple-use',
        children: [
          {
            path: 'canvas',
            name: 'canvas',
            component: () => import('@/view/webgl/1.简单使用/1.入门/canvas.vue'),
          },
          {
            path: 'gl',
            name: 'gl',
            component: () => import('@/view/webgl/1.简单使用/1.入门/webgl.vue'),
          },
          {
            path: 'point',
            name: 'point',
            component: () => import('@/view/webgl/1.简单使用/2.绘制一个点/point.vue'),
          },
          {
            path: 'attribute',
            name: 'attribute',
            component: () => import('@/view/webgl/1.简单使用/3.修改位置的attribute/attribute.vue'),
          },
          {
            path: 'draw',
            name: 'draw',
            component: () => import('@/view/webgl/1.简单使用/4.鼠标控制绘制/draw.vue'),
          },
          {
            path: 'color',
            name: 'color',
            component: () => import('@/view/webgl/1.简单使用/5.修改颜色的uniform/color.vue'),
          },
        ],
      },
      {
        path: '/draw-and-animation',
        children: [
          {
            path: 'buffer',
            name: 'buffer',
            component: () => import('@/view/webgl/2.多图形绘制与动画/1.使用缓冲区/index.vue'),
          },
          {
            path: 'lot-buffer',
            name: 'lot-buffer',
            component: () => import('@/view/webgl/2.多图形绘制与动画/2.多缓冲区和数据偏移/index.vue'),
          },
          {
            path: 'graph',
            name: 'graph',
            component: () => import('@/view/webgl/2.多图形绘制与动画/3.多种图形绘制/index.vue'),
          },
        ],
      },
    ],
  },
]
