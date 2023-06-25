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
  camera.position.set(0, 50, 200)
  camera.lookAt(new THREE.Vector3(0, 0, 0))

  // 轨道控件
  const controls = new OrbitControls(camera, renderer.domElement)
  // 设置鼠标可滚动距离
  controls.minDistance = 1
  controls.maxDistance = 200

  const total = 20 // 粒子数
  const speed = 0.1 // 波浪速度
  const height = 5 // 波浪高度
  const step = 0.3 // 波浪幅度

  let status = 0

  // 创建一个粒子: https://juejin.cn/post/7155278132806123557#heading-9
  const sprites = createBaseSprite(scene, total)

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-10, 10, 90)

  scene.add(spotLight)
  scene.add(axes)

  scene.background = new THREE.Color(0xffffff)

  const animation = () => {
    controls.update()
    stats.update()
    renderer.render(scene, camera)

    let index = -1
    for (let x = 0; x < total * 2 - 1; x++) {
      for (let y = 0; y < total * 2 - 1; y++) {
        index++
        sprites[index].position.y = Math.sin(x + status) * step * height + Math.sin(y + status) * step * height

        const scale = Math.sin(x + status) * step
        sprites[index].scale.set(scale, scale, scale)
      }
    }

    status += speed

    requestAnimationFrame(animation)
  }

  animation()
})

// 通过基础方式创建粒子
const createBaseSprite = (scene, total = 20) => {
  const material = new THREE.SpriteMaterial({
    color: 0x008800,
    map: getSprite(),
  })

  const sprites = []
  for (let i = -total + 1; i < total; i++) {
    for (let j = -total + 1; j < total; j++) {
      const sprite = new Sprite(material)
      sprite.position.set(i * 10, 0, j * 10)
      sprites.push(sprite)
      scene.add(sprite)
    }
  }

  return sprites
}

// 使用 canvas 贴图实现原型
const getSprite = (size = 16) => {
  const canvas = document.createElement('canvas')
  canvas.width = size * 2
  canvas.height = size * 2

  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#00ff00'
  ctx.arc(size, size, size, 0, Math.PI * 2)
  ctx.fill()

  const texture = new THREE.Texture(canvas)
  texture.needsUpdate = true

  return texture
}
</script>

<style lang="scss" scoped></style>
