<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { initControls } from '@/utils/gui-contrils/controls.js'

onMounted(() => {
  const app = document.querySelector('#app')
  const canvasDom = document.querySelector('#canvas')

  const axes = new THREE.AxesHelper(10)

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  if (!canvasDom) {
    const stats = new Stats() // 开启性能检测
    renderer.domElement.id = 'canvas'
    app.appendChild(renderer.domElement)
    app.appendChild(stats.dom)
  }

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 5)

  // 会照亮场景里的全部物体（氛围灯），前提是物体是可以接受灯光的，这种灯是无方向的，即不会有阴影。
  const ambientLight = new THREE.AmbientLight(0xffff00, 1)

  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
  // 没有了 ambient 属性，直接通过 AmbientLight 进行设置
  const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 })
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

  initControls(cubeMaterial)

  scene.add(axes)
  scene.add(cube)
  scene.add(ambientLight)

  const animation = () => {
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    renderer.render(scene, camera)

    requestAnimationFrame(animation)
  }

  animation()
})
</script>

<style lang="scss" scoped></style>
