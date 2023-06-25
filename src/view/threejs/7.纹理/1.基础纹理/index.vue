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

  const geometry = new THREE.PlaneGeometry(
    10,
    10,
    // 宽度高度由几个平分的面组成一个最后完整的图形
    3,
    2,
  )

  // 性能更优
  // const geometry = new THREE.PlaneBufferGeometry(
  //   10,
  //   10,
  //   // 宽度高度由几个平分的面组成一个最后完整的图形
  //   2,
  //   2,
  // )

  let mesh = null

  // 创建纹理加载器
  const loader = new THREE.TextureLoader()
  loader.load(
    new URL(`../../../../assets/image/dog.png`, import.meta.url).href,
    (texture) => {
      const lambert = new THREE.MeshLambertMaterial({ map: texture })

      mesh = new THREE.Mesh(geometry, lambert)

      scene.add(mesh)
    },
    () => {},
    () => {},
  )

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-10, 10, 90)

  scene.add(axes)
  scene.add(spotLight)

  const animation = () => {
    if (mesh) {
      mesh.rotation.x += 0.01
      mesh.rotation.y += 0.01
    }
    stats.update()
    renderer.render(scene, camera)

    requestAnimationFrame(animation)
  }

  animation()
})
</script>

<style lang="scss" scoped></style>
