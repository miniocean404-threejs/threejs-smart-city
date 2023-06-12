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

  // 创建一个相机 视点
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  // 设置相机的位置
  camera.position.set(0, 0, 20)

  // 创建一个渲染器
  const renderer = new THREE.WebGLRenderer()
  // 设置渲染器尺寸
  renderer.setSize(window.innerWidth, window.innerHeight)

  if (!canvasDom) {
    renderer.domElement.id = 'canvas'
    app.appendChild(renderer.domElement)
  }

  // 添加一个立方体
  const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)
  // 灯光所需要的材质 Lambert
  const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000, wireframe: false })
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

  // 添加一个球体
  const sphereGeometry = new THREE.SphereGeometry(1, 10, 10)
  const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00, wireframe: false })
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

  sphere.position.x = 3
  sphere.position.y = 1

  // 添加灯光
  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-10, 10, 10)
  scene.add(spotLight)

  scene.add(cube)
  scene.add(sphere)

  const animation = () => {
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    // 渲染
    renderer.render(scene, camera)

    requestAnimationFrame(animation)
  }
  animation()
})
</script>

<style lang="scss" scoped></style>
