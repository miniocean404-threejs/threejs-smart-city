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

  const shape = new THREE.Shape()
  // 将绘制点移动到某处
  shape.moveTo(0, 3)
  // 从起始位置开始绘图
  shape.lineTo(3, 3)
  shape.lineTo(3, 0)
  shape.lineTo(0, 0)

  // 二次曲线
  // shape.quadraticCurveTo()
  // 贝塞尔曲线
  // shape.bezierCurveTo()
  // 绘制圆
  // shape.arc()

  const geometry = new THREE.ShapeGeometry(shape)

  const lambert = new THREE.MeshLambertMaterial({ color: 0xff0000 })
  const basic = new THREE.MeshBasicMaterial({ wireframe: true })

  // 因为删除添加不是同一个 mesh 所以会有重叠现象，所以使用对象传递
  const mesh = { pointer: new SceneUtils.createMultiMaterialObject(geometry, [lambert, basic]) }

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-10, 10, 90)

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
