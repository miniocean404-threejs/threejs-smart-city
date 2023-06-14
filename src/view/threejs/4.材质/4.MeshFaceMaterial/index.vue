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

  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
  const cube = new THREE.Mesh(cubeGeometry, [
    new THREE.MeshBasicMaterial({
      color: 0x009e60,
      // 设置双面，因为你身处在盒子的内部，所以一定要设置双面或者镜像翻转
      side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
      color: 0x0051ba,
      // 设置双面，因为你身处在盒子的内部，所以一定要设置双面或者镜像翻转
      side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
      color: 0xffb500,
      // 设置双面，因为你身处在盒子的内部，所以一定要设置双面或者镜像翻转
      side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
      color: 0xff5800,
      // 设置双面，因为你身处在盒子的内部，所以一定要设置双面或者镜像翻转
      side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
      color: 0xc41e3a,
      // 设置双面，因为你身处在盒子的内部，所以一定要设置双面或者镜像翻转
      side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
      color: 0xffff00,
      // 设置双面，因为你身处在盒子的内部，所以一定要设置双面或者镜像翻转
      side: THREE.DoubleSide,
    }),
  ])

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-10, 10, 90)

  // initControls(cubeMaterial)

  scene.add(axes)
  scene.add(cube)
  scene.add(spotLight)

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
