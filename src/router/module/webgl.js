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
          {
            path: 'import',
            name: 'import',
            component: () => import('@/view/webgl/1.简单使用/6.引入glsl/index.vue'),
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
            path: 'camera',
            name: 'camera',
            component: () => import('@/view/webgl/5.3D世界/1.3D基础/相机.vue'),
          },
          {
            path: 'orthographic',
            name: 'orthographic',
            component: () => import('@/view/webgl/5.3D世界/2.正射投影/index.vue'),
          },
          {
            path: 'perspective',
            name: 'perspective',
            component: () => import('@/view/webgl/5.3D世界/3.透视投影/index.vue'),
          },
          {
            path: 'cube-vertex',
            name: 'cube-vertex',
            component: () => import('@/view/webgl/5.3D世界/4.立方体绘制-顶点法/彩色立方体.vue'),
          },
          {
            path: 'cube-vertex-custom',
            name: 'cube-vertex-custom',
            component: () => import('@/view/webgl/5.3D世界/4.立方体绘制-顶点法/自定义立方体颜色.vue'),
          },
          {
            path: 'cube-index',
            name: 'cube-index',
            component: () => import('@/view/webgl/5.3D世界/5.立方体绘制-索引法/索引法.vue'),
          },
          {
            path: 'cube-index-custom',
            name: 'cube-index-custom',
            component: () => import('@/view/webgl/5.3D世界/5.立方体绘制-索引法/索引法-自定义颜色.vue'),
          },
        ],
      },
      {
        path: 'light',
        children: [
          {
            path: 'use',
            name: 'use',
            component: () => import('@/view/webgl/6.光照/2.添加光源/顶点法添加光源.vue'),
          },
          {
            path: 'use-index',
            name: 'use-index',
            component: () => import('@/view/webgl/6.光照/2.添加光源/索引法添加光源.vue'),
          },
          {
            path: 'use-index-fa',
            name: 'use-index-fa',
            component: () => import('@/view/webgl/6.光照/2.添加光源/差积计算法向量.vue'),
          },
        ],
      },
      {
        path: 'advance',
        children: [
          {
            path: 'fog',
            name: 'fog',
            component: () => import('@/view/webgl/7.进阶/1.雾化/index.vue'),
          },
          {
            path: 'point',
            name: 'point',
            component: () => import('@/view/webgl/7.进阶/2.绘制圆形的点/index.vue'),
          },
          {
            path: 'rgb',
            name: 'rgb',
            component: () => import('@/view/webgl/7.进阶/3.绘制半透明物体/index.vue'),
          },
        ],
      },
    ],
  },
]
