import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { AxesHelper, WebGLRenderer } from 'three'
import Stats from 'three/addons/libs/stats.module.js'
import * as THREE from 'three'

export const initThreeJsWebGL = ({
  canvasDom = '',
  sizes = { width: window.innerWidth, height: window.innerHeight },
  isStats = true,
  isAxes = true,
  axesSize = 3000,
  enableDamping = false,
  minDistance = 1,
  maxDistance = 300,
  backgroundColor = 0xffffff,
}) => {
  // 初始化渲染器
  const app = document.querySelector('#app')
  const canvas = canvasDom && document.querySelector(canvasDom)
  const renderer = new WebGLRenderer({ canvas: canvas ? canvas : undefined })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

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

  // 初始化相机
  const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
  camera.position.z = 120
  camera.lookAt(new THREE.Vector3(0, 0, 0))

  // 镜头控制器
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = enableDamping // 是否开启阻尼
  controls.minDistance = minDistance // 设置鼠标可滚动距离
  controls.maxDistance = maxDistance

  // 场景添加
  scene.add(camera)
  scene.add(axes)

  // 页面缩放事件监听
  window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    // 设置渲染器的像素比
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // 更新相机
    camera.aspect = sizes.width / sizes.height // 更新摄像头
    camera.updateProjectionMatrix() // 更新摄像头投影矩阵
  })

  return {
    scene,
    camera,
    controls,
    renderer,
    stats,
  }
}

// 页面重绘动画
export const tick = (option) => {
  const { scene, camera, controls, renderer, stats, render } = option

  controls && controls.update()
  stats && stats.update()
  render && render()
  // 更新渲染器
  renderer.render(scene, camera)

  // 页面重绘时调用自身
  requestAnimationFrame(tick.bind(this, option))
}
