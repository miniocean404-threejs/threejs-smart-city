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
  camera.position.set(0, 0, 20)
  camera.lookAt(new THREE.Vector3(0, 0, 0))

  // 轨道控件
  const controls = new OrbitControls(camera, renderer.domElement)
  // 设置鼠标可滚动距离
  controls.minDistance = 1
  controls.maxDistance = 50

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-10, 10, 90)

  // 创建一个立方体，和环境保持一致
  const g1 = new THREE.BoxGeometry(5, 5, 5)
  const g2 = new THREE.BoxGeometry(5, 5, 5)
  const m1 = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
  })
  const m2 = new THREE.MeshBasicMaterial({
    color: 0xff0000,
  })
  const cube1 = new THREE.Mesh(g1, m1)
  const cube2 = new THREE.Mesh(g2, m2)
  cube1.position.x = -4
  cube2.position.x = 4

  // 实现辉光: https://threejs.org/examples/?q=unreal#webgl_postprocessing_unreal_bloom_selective

  // 创建渲染通道：这个通道会渲染场景但是不会展示到界面上
  const renderScreen = new RenderPass(scene, camera)
  // 参数：
  //   1. 分辨率
  //   2. 场景
  //   3. 相机
  //   4. 需要添加辉光效果的物体
  const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera, [cube2])
  outlinePass.renderToScreen = true // 是否渲染到屏幕上
  outlinePass.edgeStrength = 3 // 外围边框尺寸
  outlinePass.edgeGlow = 3 // 发光强度
  outlinePass.edgeThickness = 1 // 光晕的粗细，越大越细
  outlinePass.pulsePeriod = 1 // 闪烁的速度，越小越快
  outlinePass.visibleEdgeColor.set('yellow')

  // 添加渲染

  // 创建组合器对象，并将渲染通道、线框添加到组合器对象中
  // EffectComposer 需要放在 renderer.render 之后渲染
  const bloom = new EffectComposer(renderer)
  bloom.setSize(window.innerWidth, window.innerHeight)
  bloom.addPass(renderScreen)
  bloom.addPass(outlinePass)

  scene.add(axes)
  scene.add(spotLight)
  scene.add(cube1)
  scene.add(cube2)

  scene.background = new THREE.Color(0x000000)

  const animation = () => {
    cube1.rotation.x += 0.01
    cube1.rotation.y += 0.01
    cube2.rotation.x += 0.01
    cube2.rotation.y += 0.01

    controls.update()
    stats.update()
    renderer.render(scene, camera)
    bloom.render()

    requestAnimationFrame(animation)
  }

  animation()
})
</script>

<style lang="scss" scoped></style>
