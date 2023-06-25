<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import Stats from 'three/addons/libs/stats.module.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js'
import { Sprite } from 'three'
import Point from '@/view/webgl/1.简单使用/2.绘制一个点/point.vue'

onMounted(async () => {
  const app = document.querySelector('#app')
  const canvasDom = document.querySelector('#canvas')
  const stats = new Stats() // 开启性能检测

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  if (!canvasDom) {
    renderer.domElement.id = 'canvas'

    app.appendChild(renderer.domElement)
    app.appendChild(stats.dom)
  }

  const axes = new THREE.AxesHelper(1000)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 30, 100)
  camera.lookAt(new THREE.Vector3(0, 0, 0))

  // 轨道控件
  const controls = new OrbitControls(camera, renderer.domElement)
  // 设置鼠标可滚动距离
  controls.minDistance = 1
  controls.maxDistance = 200

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-10, 10, 90)

  const geometry = new THREE.BoxGeometry(10, 10, 10, 10, 10, 10)
  const material = new THREE.PointsMaterial({ size: 2, transparent: true, map: getSprite() })
  const point = new THREE.Points(geometry, material)

  scene.add(spotLight)
  scene.add(axes)
  scene.add(point)

  scene.background = new THREE.Color(0xffffff)

  const animation = () => {
    controls.update()
    stats.update()
    scene.rotation.y += 0.01
    renderer.render(scene, camera)

    requestAnimationFrame(animation)
  }

  animation()
})

const getSprite = (size = 2) => {
  const canvas = document.createElement('canvas')
  canvas.width = size * 2
  canvas.height = size * 2

  const ctx = canvas.getContext('2d')

  // 创建径向线性渐变
  const gradient = ctx.createRadialGradient(size, size, 0, size, size, size)
  gradient.addColorStop(0.1, 'rgba(0,255,255,1)')

  ctx.fillStyle = gradient
  ctx.arc(size, size, size / 2, 0, Math.PI * 2)
  ctx.fill()

  const texture = new THREE.Texture(canvas)
  texture.needsUpdate = true

  return texture
}
</script>

<style lang="scss" scoped></style>
