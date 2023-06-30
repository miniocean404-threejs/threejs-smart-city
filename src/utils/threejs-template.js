import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { AxesHelper, Clock, WebGLRenderer } from 'three'
import Stats from 'three/addons/libs/stats.module.js'
import * as THREE from 'three'

let threeJsProp = null

export const initThreeJsWebGL = ({
  canvasDom = '',
  sizes = { width: window.innerWidth, height: window.innerHeight },
  isStats = true,
  isAxes = true,
  axesSize = 3000,
  enableDamping = true,
  minDistance = 1,
  maxDistance = 300,
  backgroundColor = 0xffffff,
  near = 0.1,
  far = 1000,
}) => {
  // 初始化渲染器
  const app = document.querySelector('#app')
  const canvas = canvasDom && document.querySelector(canvasDom)
  const renderer = new WebGLRenderer({ canvas: canvas ? canvas : undefined })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.debug.checkShaderErrors = true // 打开 glsl 错误监控

  // 初始化性能检测器
  const stats = isStats && new Stats() // 开启性能检测
  const axes = isAxes && new AxesHelper(axesSize) // 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.

  if (!canvasDom) {
    renderer.domElement.id = 'template-canvas'

    const oldCanvas = document.querySelector('#template-canvas')
    oldCanvas && app.removeChild(oldCanvas)
    app.appendChild(renderer.domElement)
  }

  if (isStats) {
    stats.dom.id = 'template-stats'
    const oldStats = document.querySelector('#template-stats')
    oldStats && app.removeChild(oldStats)
    app.appendChild(stats.dom)
  }

  // 初始化场景
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(backgroundColor) // 设置背景颜色
  // renderer.setClearColor(new Color(backgroundColor), 1) // 可以使用渲染器设置颜色

  // 初始化相机
  const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, near, far)
  camera.position.z = 120
  camera.lookAt(new THREE.Vector3(0, 0, 0))

  // 镜头控制器
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = enableDamping // 是否开启鼠标拖拽时的缓冲阻尼
  controls.minDistance = minDistance // 设置鼠标可滚动距离
  controls.maxDistance = maxDistance
  controls.enableZoom = true // 是否开启缩放
  controls.enablePan = true // 是否开启右键拖动
  // 垂直旋转角度限制 范围 0 到 Math.P
  controls.minPolarAngle = 1
  controls.maxPolarAngle = Math.PI / 2
  // 水平旋转角度限制 你能够水平旋转的角度下限。如果设置，其有效值范围为[-2 * Math.PI，2 * Math.PI]，且旋转角度的上限和下限差值小于2 * Math.PI。默认值为无穷大
  controls.minAzimuthAngle = -Math.PI
  controls.maxAzimuthAngle = Math.PI

  // 场景添加
  scene.add(camera)
  scene.add(axes)

  // 页面缩放事件监听
  window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // 设置渲染器的像素比,适配设备的像素实际应该使用的尺寸
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    camera.aspect = sizes.width / sizes.height // 更新相机的宽高比
    camera.updateProjectionMatrix() // 更新摄像头投影矩阵
  })

  const clock = new Clock()

  threeJsProp = {
    scene,
    camera,
    controls,
    renderer,
    stats,
    clock,
  }

  return threeJsProp
}

// 页面重绘动画
export const tick = (option) => {
  const { scene, camera, controls, renderer, stats } = threeJsProp
  const { render } = option

  controls && controls.update()
  stats && stats.update()
  render && render()
  // 更新渲染器
  renderer.render(scene, camera)

  // 页面重绘时调用自身
  requestAnimationFrame(tick.bind(this, option))
}
