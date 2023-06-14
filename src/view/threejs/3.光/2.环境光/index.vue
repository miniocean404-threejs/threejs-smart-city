<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import { initControls } from '@/utils/gui-contrils/controls.js'

// 基础光源
// THREE.AmbientLight 环境光:不需要设置位置，对整个场景的对象都生效
// THREE.PointLight 点光源
// THREE.SpotLight 聚光灯光源：灯光、手电、路灯，锥形效果，需要设置光源位置，可以生成阴影
// THREE.DirectionalLight 太阳光照射地球

// 特殊光源
// THREE.HemisphereLight // 半球光：可以参考夕阳日出，可以创建更加真实的户外效果
// AreaLight // 面光源：散发光线的平面，不是一个点

// 光源特殊效果
// LensFlare  // 镜面炫光，不是光源，但是可以为光源添加炫光效果

// 环境光
// 1. 不需要设置位置，对整个场景的对象都生效
// 2. 没有特定的来源，也不会影响阴影的形成
// 3. 不能作为场景内的位移光源，需要配合其他光源使用
// 4. 作用：减弱阴影，或者给物体添加一些颜色

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
  // castShadow 让物体产生阴影，球体、立方体，使用平面接收阴影
  cube.castShadow = true

  const sphereGeometry = new THREE.SphereGeometry(2, 10, 10)
  const sphere = new THREE.Mesh(sphereGeometry, cubeMaterial)
  sphere.position.x = 3
  sphere.position.y = 3
  sphere.castShadow = true

  // 创建一个平面，接收阴影
  const planeGeometry = new THREE.PlaneGeometry(20, 30)
  const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x999999 })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.rotateZ(0)
  plane.position.z = -10
  plane.position.x = 3
  // 接收阴影
  plane.receiveShadow = true

  const ambientLight = new THREE.AmbientLight(0x000000)

  // 创建灯光
  // 参数：
  //   color: '#ffffff', // 光源颜色 默认 无
  //   intensity: 1, // 光照强度 默认 1
  //   distance: 0, // 光源到光源结束的距离，不会随着距离衰减 默认 0
  //   angle: Math.PI / 3, // 光线散射角度 默认 Math.PI/3
  //   exponent: 10, // 沿着光照距离的衰退量 默认 10
  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-10, 10, 200)
  // 灯光开启阴影效果
  spotLight.castShadow = true

  initControls(ambientLight)

  // 开启渲染器支持阴影
  renderer.shadowMap.enabled = true

  scene.add(cube)
  scene.add(sphere)
  scene.add(plane)
  scene.add(spotLight)
  scene.add(ambientLight)

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
