<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import * as SceneUtils from 'three/addons/utils/SceneUtils.js'
import Stats from 'three/addons/libs/stats.module.js'
import { initControls } from '@/utils/gui-contrils/controls.js'

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

  const axes = new THREE.AxesHelper(10)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 20)

  const geometry = new THREE.CircleGeometry(
    // 半径
    4,
    // 指定创建圆的面的数量，最少三个
    10,
    // 起始角度，从哪里开始绘制，逆时针 范围 [0,Math.PI * 2]
    30,
    // 角度，定义圆要画多大,半圆还是 30 deg 的圆 还是整个圆形
    Math.PI * 2,
  )

  const lambert = new THREE.MeshLambertMaterial({ color: 0xff0000 })
  const basic = new THREE.MeshBasicMaterial({ wireframe: true })

  // 因为删除添加不是同一个 mesh 所以会有重叠现象，所以使用对象传递
  const mesh = { pointer: new SceneUtils.createMultiMaterialObject(geometry, [lambert, basic]) }

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-10, 10, 90)

  initControls(geometry, camera, mesh, scene)

  scene.add(axes)
  scene.add(mesh.pointer)
  scene.add(spotLight)

  const animation = () => {
    mesh.pointer.rotation.x += 0.01
    mesh.pointer.rotation.y += 0.01

    renderer.render(scene, camera)

    requestAnimationFrame(animation)
  }

  animation()
})
</script>

<style lang="scss" scoped></style>
