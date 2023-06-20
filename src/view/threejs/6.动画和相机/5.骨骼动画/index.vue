<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import * as SceneUtils from 'three/addons/utils/SceneUtils.js'
import Stats from 'three/addons/libs/stats.module.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// 使用 @tweenjs/tween.js 库进行动画展示
onMounted(() => {
  const app = document.querySelector('#app')
  const canvasDom = document.querySelector('#canvas')

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  if (!canvasDom) {
    const stats = new Stats() // 开启性能检测
    renderer.domElement.id = 'canvas'

    app.appendChild(renderer.domElement)
    app.appendChild(stats.dom)
  }

  const axes = new THREE.AxesHelper(100)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(100, 100, 0)
  // lookAt 默认是 z 轴的负方向
  camera.lookAt(0, 0, 0)

  // 轨道控件
  const controls = new OrbitControls(camera, renderer.domElement)

  const geometry = new THREE.CylinderGeometry(2, 2, 40, 8, 2, false)
  const material = new THREE.MeshPhongMaterial()
  const mesh = new THREE.Mesh(geometry, material)

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(2000, 8000, 4000)

  scene.add(mesh)
  scene.add(axes)
  scene.add(spotLight)

  const animation = () => {
    controls.update()
    renderer.render(scene, camera)

    requestAnimationFrame(animation)
  }

  animation()
})
</script>

<style lang="scss" scoped></style>
