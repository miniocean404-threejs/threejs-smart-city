<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { initControls } from '@/utils/gui-contrils/controls.js'
// 文章：https://zhuanlan.zhihu.com/p/487445697?utm_id=0
onMounted(async () => {
  const app = document.querySelector('#app')
  const canvasDom = document.querySelector('#canvas')
  const stats = new Stats() // 开启性能检测

  const axes = new THREE.AxesHelper(10)

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  if (!canvasDom) {
    renderer.domElement.id = 'canvas'
    app.appendChild(renderer.domElement)
    app.appendChild(stats.dom)
  }

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 30)

  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)

  // 添加直线和虚线
  // lines.vertices = [new THREE.Vector3(0, 2, 5), new THREE.Vector3(0, -2, 5)]
  // // 计算 点到线起始点的累积长度
  // lines.computeLineDistances()

  const geometry = new THREE.BufferGeometry()
  const points = []
  points.push(new THREE.Vector3(10, 10, 0))
  points.push(new THREE.Vector3(10, -10, 0))
  points.push(new THREE.Vector3(-10, -10, 0))
  points.push(new THREE.Vector3(-10, 10, 0))
  // 绑定顶点到空几何体
  geometry.setFromPoints(points)

  const cubeMaterial = new THREE.LineBasicMaterial({
    color: 0xff0000,
    // linewidth: 10,
  })

  // const cubeMaterial = new THREE.LineDashedMaterial({
  //   color: 0x00ff00,
  //   scale: 1,
  //   dashSize: 3, // 短划线的长度
  //   gapSize: 1, // 间隔的长度
  // })

  const line = new THREE.Line(geometry, cubeMaterial)
  // 计算LineDashedMaterial所需的距离的值的数组。
  line.computeLineDistances()

  initControls(cubeMaterial, camera)

  scene.add(axes)
  scene.add(line)

  const animation = () => {
    renderer.render(scene, camera)
    stats.update()
    requestAnimationFrame(animation)
  }

  animation()
})
</script>

<style lang="scss" scoped></style>
