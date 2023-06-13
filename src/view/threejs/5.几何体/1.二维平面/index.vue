<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import * as SceneUtils from 'three/addons/utils/SceneUtils.js'
import Stats from 'three/addons/libs/stats.module.js'
import { initControls } from '@/utils/controls.js'

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

  const axes = new THREE.AxesHelper(10)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 20)

  const geometry = new THREE.PlaneGeometry(
    10,
    10,
    // 宽度高度由几个平分的面组成一个最后完整的图形
    3,
    2,
  )
  const lambert = new THREE.MeshLambertMaterial({ color: 0xff0000 })
  const basic = new THREE.MeshBasicMaterial({ wireframe: true })

  const mesh = new SceneUtils.createMultiMaterialObject(geometry, [lambert, basic])

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-10, 10, 90)

  initControls(geometry, camera, mesh, scene)

  scene.add(axes)
  scene.add(mesh)
  scene.add(spotLight)

  const animation = () => {
    mesh.rotation.x += 0.01
    mesh.rotation.y += 0.01

    renderer.render(scene, camera)

    requestAnimationFrame(animation)
  }

  animation()
})
</script>

<style lang="scss" scoped></style>
