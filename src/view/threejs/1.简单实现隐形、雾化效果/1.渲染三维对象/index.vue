<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'

onMounted(() => {
  const app = document.querySelector('#app')
  const canvasDom = document.querySelector('#canvas')

  // 创建一个场景
  const scene = new THREE.Scene()

  // 创建相机，视点，设置相机位置
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.set(0, 0, 20)

  // 创建一个渲染器
  const renderer = new THREE.WebGLRenderer()

  // 设置渲染尺寸
  renderer.setSize(window.innerWidth, window.innerHeight)

  if (!canvasDom) {
    renderer.domElement.id = 'canvas'
    app.appendChild(renderer.domElement)
  }

  // 创建立方体
  const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)

  // 创建材质
  const cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    // 是否以线框模式绘制
    wireframe: false,
  })
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

  const sphereGeometry = new THREE.SphereGeometry(1, 10, 10)
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    // 是否以线框模式绘制
    wireframe: false,
  })
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere.position.x = 3
  sphere.position.y = 3

  // 添加到场景
  scene.add(cube)
  scene.add(sphere)

  const animation = () => {
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    sphere.rotation.x += 0.01
    sphere.rotation.y += 0.01

    // 渲染
    renderer.render(scene, camera)

    requestAnimationFrame(animation)
  }

  animation()
})
</script>

<style lang="scss" scoped></style>
