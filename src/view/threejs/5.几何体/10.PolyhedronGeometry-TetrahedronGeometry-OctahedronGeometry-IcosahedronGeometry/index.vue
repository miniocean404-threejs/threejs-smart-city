<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import * as SceneUtils from 'three/addons/utils/SceneUtils.js'
import Stats from 'three/addons/libs/stats.module.js'
import { initControls } from '@/utils/gui-contrils/controls.js'
import { indices, vertices } from '@/utils/gui-contrils/constant.js'

onMounted(() => {
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

  const axes = new THREE.AxesHelper(10)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 20)

  // const geometry = new THREE.PolyhedronGeometry(
  //   // 构建多面体的顶点
  //   vertices,
  //   // 由哪些顶点创建出的面
  //   indices,
  //   // 面的大小
  //   4,
  //   // 处理多面体细节，越多越平滑（个人理解是 上面组成的面的多少倍）
  //   6,
  // )

  // 正四面体
  // const geometry = new THREE.TetrahedronGeometry(4, 6)

  // 正八面体
  // const geometry = new THREE.OctahedronGeometry(4, 6)

  // 正 20 面体
  const geometry = new THREE.IcosahedronGeometry(4, 6)

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
    stats.update()
    renderer.render(scene, camera)

    requestAnimationFrame(animation)
  }

  animation()
})
</script>

<style lang="scss" scoped></style>
