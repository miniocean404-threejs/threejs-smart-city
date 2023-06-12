<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'

onMounted(() => {
  const app = document.querySelector('#app')
  const canvasDom = document.querySelector('#canvas')

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 20)

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  if (!canvasDom) {
    renderer.domElement.id = 'canvas'
    app.appendChild(renderer.domElement)
  }

  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
  const cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    // 是否以线框模式绘制
    wireframe: false,
  })
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

  // js 中可直接赋值
  // cube.position = new THREE.Vector3(0, 0, 0)
  // cube.rotation = new THREE.Vector3(0.5 * Math.PI, 0, 0)
  // cube.scale = new THREE.Vector3(2, 0, 0)

  // 单个赋值
  cube.position.x = 0
  cube.rotation.x = 0.5 * Math.PI
  cube.scale.x = 2

  // 方法赋值
  cube.position.set(0, 0, 0)
  cube.rotation.set(0.5 * Math.PI, 0, 0)
  cube.scale.set(2, 2, 2)
  scene.add(cube)

  renderer.render(scene, camera)
})
</script>

<style lang="scss" scoped></style>
