<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import * as SceneUtils from 'three/addons/utils/SceneUtils.js'
import Stats from 'three/addons/libs/stats.module.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// 使用 @tweenjs/tween.js 库进行动画展示
onMounted(() => {
  const app = document.querySelector('#app')
  const canvasDom = document.querySelector('#canvas')

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  if (!canvasDom) {
    const stats = new Stats() // 开启性能检测
    renderer.domElement.id = 'canvas'

    app.appendChild(renderer.domElement)
    app.appendChild(stats.dom)
  }

  const axes = new THREE.AxesHelper(100)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(100, 100, 0)
  // lookAt 默认是 z 轴的负方向
  camera.lookAt(0, 0, 0)

  // 轨道控件
  const controls = new OrbitControls(camera, renderer.domElement)

  const geometry = new THREE.CylinderGeometry(2, 2, 40, 8, 2, false)
  const material = new THREE.MeshPhongMaterial()
  // 蒙皮 - 皮肤 , 将圆柱体作为皮肤画到骨骼动画上
  const mesh = new THREE.SkinnedMesh(geometry, material)
  // 骨骼辅助显示
  const skeletonHelper = new THREE.SkeletonHelper(mesh)

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(2000, 8000, 4000)

  // 创建骨骼动画一个起点
  let b1 = new THREE.Bone()
  b1.position.set(0, 20, 0)

  let b2 = new THREE.Bone()
  b2.position.set(0, 10, 0)

  let b3 = new THREE.Bone()
  b3.position.set(0, 10, 0)

  let b4 = new THREE.Bone()
  b4.position.set(0, 10, 0)

  let b5 = new THREE.Bone()
  b5.position.set(0, 10, 0)

  b1.add(b2)
  b2.add(b3)
  b3.add(b4)
  b4.add(b5)

  // 创建骨架
  const skeleton = new THREE.Skeleton([b1, b2, b3, b4, b5])
  mesh.add(skeleton.bones[0] || b1)
  mesh.bind(skeleton)

  scene.add(mesh)
  scene.add(spotLight)
  scene.add(axes)
  scene.add(skeletonHelper)

  let step = 0.1
  const animation = () => {
    controls.update()

    console.log(mesh.skeleton)

    renderer.render(scene, camera)
    requestAnimationFrame(animation)
  }

  animation()
})
</script>

<style lang="scss" scoped></style>
