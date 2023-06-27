<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import * as SceneUtils from 'three/addons/utils/SceneUtils.js'
import Stats from 'three/addons/libs/stats.module.js'
import { initControls } from '@/utils/gui-contrils/controls.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
onMounted(() => {
  const app = document.querySelector('#app')
  const canvasDom = document.querySelector('#canvas')
  const stats = new Stats() // 开启性能检测

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  if (!canvasDom) {
    renderer.domElement.id = 'canvas'

    app.appendChild(renderer.domElement)
    app.appendChild(stats.dom)
  }

  const axes = new THREE.AxesHelper(10)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 20)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true // 是否开启鼠标拖拽时的缓冲阻尼
  controls.minDistance = true // 设置鼠标可滚动距离
  controls.maxDistance = 1000
  controls.enableZoom = true // 是否开启缩放
  controls.enablePan = true // 是否开启右键拖动

  const geometry = new THREE.SphereGeometry(
    2,
    20,
    20,
    // 从 x 轴什么位置开始绘制
    Math.PI * 2,
    // x 绘制多少
    Math.PI * 2,
    // 从 y 轴什么位置开始绘制
    Math.PI * 2,
    // y 绘制多少
    Math.PI * 2,
  )

  const lambert = new THREE.MeshLambertMaterial({ color: 0xff0000 })
  const basic = new THREE.MeshBasicMaterial({ wireframe: true, side: THREE.DoubleSide })

  // 因为删除添加不是同一个 mesh 所以会有重叠现象，所以使用对象传递
  const mesh = { pointer: new SceneUtils.createMultiMaterialObject(geometry, [lambert, basic]) }

  const ambientLight = new THREE.AmbientLight(0xffffff)
  ambientLight.position.set(-10, 10, 90)

  initControls(geometry, camera, mesh, scene)

  scene.add(axes)
  scene.add(mesh.pointer)
  scene.add(ambientLight)

  const animation = () => {
    // mesh.pointer.rotation.x += 0.01
    // mesh.pointer.rotation.y += 0.01
    stats.update()
    controls.update()
    renderer.render(scene, camera)

    requestAnimationFrame(animation)
  }

  animation()
})
</script>

<style lang="scss" scoped></style>
