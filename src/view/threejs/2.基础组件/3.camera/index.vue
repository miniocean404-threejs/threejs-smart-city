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

  // const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  const camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 1, 1000)
  camera.position.set(0, 0, 20)
  // 透视投影及正射投影都可以单独设置相机中的参数
  camera.far = 1000

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  if (!canvasDom) {
    renderer.domElement.id = 'canvas'
    app.appendChild(renderer.domElement)
  }

  const cubeGeometry = new THREE.BoxGeometry(10, 10, 10)
  const cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    // 是否以线框模式绘制
    wireframe: true,
  })
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

  scene.add(cube)

  renderer.render(scene, camera)

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
