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

  const cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0xffff00,
    // 是否以线框模式绘制
    wireframe: false,
  })
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

  const sphereGeometry = new THREE.SphereGeometry(2, 10, 10)
  const sphere = new THREE.Mesh(sphereGeometry, cubeMaterial)
  sphere.position.x = 3
  sphere.position.y = 3

  // castShadow 让物体产生阴影，球体、立方体，使用平面接收阴影
  cube.castShadow = true
  sphere.castShadow = true

  // 创建一个平面，接收阴影
  const planeGeometry = new THREE.PlaneGeometry(20, 30)
  const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x999999 })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.rotateZ(0)
  plane.position.z = -10
  plane.position.x = 3

  // 接收阴影
  plane.receiveShadow = true

  // 创建灯光
  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-10, 10, 20)
  // 灯光开启阴影效果
  spotLight.castShadow = true

  // 开启渲染器支持
  renderer.shadowMap.enabled = true

  scene.add(cube)
  scene.add(sphere)
  scene.add(plane)
  scene.add(spotLight)

  const animation = () => {
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    sphere.rotation.x += 0.01
    sphere.rotation.y += 0.01

    renderer.render(scene, camera)

    requestAnimationFrame(animation)
  }

  animation()
})
</script>

<style lang="scss" scoped></style>
