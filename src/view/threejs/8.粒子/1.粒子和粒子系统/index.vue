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
  camera.position.set(0, 0, 200)
  camera.lookAt(new THREE.Vector3(0, 0, 0))

  // 轨道控件
  const controls = new OrbitControls(camera, renderer.domElement)
  // 设置鼠标可滚动距离
  controls.minDistance = 1
  controls.maxDistance = 200

  // 创建一个粒子: https://juejin.cn/post/7155278132806123557#heading-9
  // createBaseSprite(scene)
  createSpriteForSystem(scene)

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-10, 10, 90)

  scene.add(spotLight)
  scene.add(axes)

  scene.background = new THREE.Color(0xffffff)

  const animation = () => {
    controls.update()
    stats.update()
    renderer.render(scene, camera)

    requestAnimationFrame(animation)
  }

  animation()
})

// 使用 Point 创建粒子
const createSpriteForSystem = (scene) => {
  const geometry = new THREE.BufferGeometry()
  const material = new THREE.PointsMaterial({ size: 4, vertexColors: true })

  let verticesFloat32Array = []
  let verticesColors = []

  for (let i = -4; i < 5; i++) {
    for (let j = -4; j < 5; j++) {
      verticesFloat32Array.push(i * 10, j * 10, 0)
      const rgb = new THREE.Color(0xffffff * Math.random())
      verticesColors.push(rgb.r, rgb.g, rgb.b)
    }
  }

  const vertices = new THREE.Float32BufferAttribute(verticesFloat32Array, 3)
  const colors = new THREE.Float32BufferAttribute(verticesColors, 3)

  geometry.attributes.position = vertices
  geometry.attributes.color = colors

  const particle = new THREE.Points(geometry, material)

  scene.add(particle)
}

// 通过基础方式创建粒子
const createBaseSprite = (scene) => {
  for (let i = -4; i < 5; i++) {
    for (let j = -4; j < 5; j++) {
      const material = new THREE.SpriteMaterial({
        color: Math.random() * 0xffffff,
      })
      const sprite = new Sprite(material)
      sprite.scale.set(2, 2, 2)
      sprite.position.set(i * 10, j * 10, 0)
      scene.add(sprite)
    }
  }
}
</script>

<style lang="scss" scoped></style>
