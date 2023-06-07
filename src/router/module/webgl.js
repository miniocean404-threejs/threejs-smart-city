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
        path: 'draw-and-animation',
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
          {
            path: 'translate',
            name: 'translate',
            component: () => import('@/view/webgl/2.多图形绘制与动画/4.图形平移/index.vue'),
          },
          {
            path: 'scale',
            name: 'scale',
            component: () => import('@/view/webgl/2.多图形绘制与动画/5.缩放/index.vue'),
          },
          {
            path: 'rotate',
            name: 'rotate',
            component: () => import('@/view/webgl/2.多图形绘制与动画/6.旋转/index.vue'),
          },
          {
            path: 'matrix-translate',
            name: 'matrix-translate',
            component: () => import('@/view/webgl/2.多图形绘制与动画/7.平移矩阵/index.vue'),
          },
          {
            path: 'scale-translate',
            name: 'scale-translate',
            component: () => import('@/view/webgl/2.多图形绘制与动画/8.缩放矩阵/index.vue'),
          },
          {
            path: 'rotate-translate',
            name: 'rotate-translate',
            component: () => import('@/view/webgl/2.多图形绘制与动画/9.旋转矩阵/index.vue'),
          },
          {
            path: 'compose-translate',
            name: 'compose-translate',
            component: () => import('@/view/webgl/2.多图形绘制与动画/10.矩阵组合变换/index.vue'),
          },
          {
            path: 'tool-translate',
            name: 'tool-translate',
            component: () => import('@/view/webgl/2.多图形绘制与动画/10.矩阵组合变换/tool.vue'),
          },
        ],
      },
      {
        path: 'grain',
        children: [
          {
            path: 'varying',
            name: 'varying',
            component: () => import('@/view/webgl/3.颜色和纹理/1.varying绘制颜色/index.vue'),
          },
          {
            path: 'texture',
            name: 'texture',
            component: () => import('@/view/webgl/3.颜色和纹理/2.添加背景图-使用纹理/index.vue'),
          },
          {
            path: 'lot-texture',
            name: 'lot-texture',
            component: () => import('@/view/webgl/3.颜色和纹理/3.使用多重纹理/index.vue'),
          },
        ],
      },
      {
        path: '3d',
        children: [
          {
            path: 'base',
            name: 'base',
            component: () => import('@/view/webgl/5.3D世界/1.3D基础/index.vue'),
          },
        ],
      },
    ],
  },
]
