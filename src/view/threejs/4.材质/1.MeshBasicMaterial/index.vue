<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import { initControls } from '@/utils/controls.js'
import { ColorRepresentation } from 'three/src/math/Color.js'
import { Texture } from 'three/src/textures/Texture.js'
import { Combine } from 'three/src/constants.js'

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
  // color?: 材质颜色
  // fog?: 是否会受全局雾化的效果设置影响
  // wireframe?: 是否渲染为线框
  // wireframeLinewidth?: 线框的宽度
  // wireframeLinecap?: 线框间的端点如何显示
  // wireframeLinejoin?: 线段的连接点如何显示
  // shading 定义如何着色
  // vertexColors 为每个顶点定义不同的颜色
  const cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    // 是否以线框模式绘制
    wireframe: false,
    transparent: 1,
  })
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

  // castShadow 让物体产生阴影，球体、立方体，使用平面接收阴影
  cube.castShadow = true

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-10, 10, 20)
  // 灯光开启阴影效果
  spotLight.castShadow = true
  // 修改光源阴影模糊值，聚光灯也适用
  spotLight.shadow.mapSize.width = 4096
  spotLight.shadow.mapSize.height = 4096

  initControls(cubeMaterial)

  // 开启渲染器支持阴影
  renderer.shadowMap.enabled = true

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
