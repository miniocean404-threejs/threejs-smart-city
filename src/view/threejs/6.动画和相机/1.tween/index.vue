<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import * as SceneUtils from 'three/addons/utils/SceneUtils.js'
import Stats from 'three/addons/libs/stats.module.js'
import { initControls } from '@/utils/gui-contrils/controls.js'
import TWEEN from '@tweenjs/tween.js'

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

  const axes = new THREE.AxesHelper(10)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 20)

  const geometry = new THREE.BoxGeometry(3, 3, 3, 1, 1, 1)

  const lambert = new THREE.MeshLambertMaterial({ color: 0xff0000 })
  const basic = new THREE.MeshBasicMaterial({ wireframe: true })

  // 因为删除添加不是同一个 mesh 所以会有重叠现象，所以使用对象传递
  const cube = new SceneUtils.createMultiMaterialObject(geometry, [lambert, basic])

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-10, 10, 90)

  scene.add(axes)
  scene.add(cube)
  scene.add(spotLight)

  new TWEEN.Tween(cube.rotation)
    .to(
      {
        x: cube.rotation.x + 2,
        y: cube.rotation.y + 2,
        z: cube.rotation.z + 2,
      },
      2000,
    )
    .start()
    .repeat(Infinity)

  const animation = () => {
    TWEEN.update()
    renderer.render(scene, camera)

    requestAnimationFrame(animation)
  }

  animation()
})
</script>

<style lang="scss" scoped></style>
