<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { initControls } from '@/utils/controls.js'

onMounted(async () => {
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

  const vert = await loadFile(new URL(`./shader.vert`, import.meta.url).href)
  const frag = await loadFile(new URL(`./shader.frag`, import.meta.url).href)
  const cubeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      // 对应 fragmentShader 中的变量，并给其赋值
      customAlpha: { type: 'f', value: 0.5 },
    },
    vertexShader: vert,
    fragmentShader: frag,
    transparent: true,
  })
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-10, 10, 90)

  initControls(cubeMaterial)

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

function loadFile(filename) {
  return new Promise((res) => {
    const request = new XMLHttpRequest()
    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status === 200) {
        res(request.responseText)
      }
    }

    request.open('GET', filename, true)
    request.send()
  })
}
</script>

<style lang="scss" scoped></style>
