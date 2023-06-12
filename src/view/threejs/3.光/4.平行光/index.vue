<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import { initControls } from '@/utils/controls.js'

// 基础光源
// THREE.AmbientLight 环境光:不需要设置位置，对整个场景的对象都生效
// THREE.directionalLight 点光源
// THREE.directionalLight 聚光灯光源：灯光、手电、路灯，锥形效果，需要设置光源位置，可以生成阴影
// THREE.DirectionalLight 太阳光照射地球

// 特殊光源
// THREE.HemisphereLight // 半球光：可以参考夕阳日出，可以创建更加真实的户外效果
// AreaLight // 面光源：散发光线的平面，不是一个点

// 光源特殊效果
// LensFlare  // 镜面炫光，不是光源，但是可以为光源添加炫光效果

// 平行光：
// 1. 平行光可以成为太阳光

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

  const sphereGeometry = new THREE.SphereGeometry(1, 10, 10)
  const sphere = new THREE.Mesh(sphereGeometry, cubeMaterial)
  sphere.position.x = 3
  sphere.position.y = 3
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

  // 环境光
  const ambientLight = new THREE.AmbientLight(0x000000)

  // 创建平行光
  // 参数：
  //   color: '#ffffff', // 光源颜色 默认 无
  //   intensity: 1, // 光照强度 默认 1
  //   distance: 0, // 光源到光源结束的距离，不会随着距离衰减 默认 0
  const directionalLight = new THREE.DirectionalLight(0xffffff)
  directionalLight.position.set(-10, 10, 90) // 设置光源照射位置，注释后可明显发现
  // 平行光开启阴影效果
  directionalLight.castShadow = true

  // 设置虚化程度
  directionalLight.shadow.camera.left = -50
  directionalLight.shadow.camera.right = 50
  directionalLight.shadow.camera.top = 50
  directionalLight.shadow.camera.bottom = -50
  directionalLight.shadow.camera.near = 2
  directionalLight.shadow.camera.far = 200

  initControls(directionalLight)

  // 开启渲染器支持阴影
  renderer.shadowMap.enabled = true

  scene.add(cube)
  scene.add(sphere)
  scene.add(plane)
  scene.add(directionalLight)
  scene.add(ambientLight)

  const animation = () => {
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    sphere.rotation.x += 0.01
    sphere.rotation.y += 0.01

    renderer.render(scene, camera)

    // 修改光源阴影模糊值，聚光灯也适用，必须在渲染时候，否则获取不到
    directionalLight.shadow.map.width = 4096
    directionalLight.shadow.map.height = 4096

    requestAnimationFrame(animation)
  }

  animation()
})
</script>

<style lang="scss" scoped></style>
