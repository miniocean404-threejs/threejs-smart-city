<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import * as SceneUtils from 'three/addons/utils/SceneUtils.js'
import Stats from 'three/addons/libs/stats.module.js'
import { initControls } from '@/utils/gui-contrils/controls.js'

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

  const axes = new THREE.AxesHelper(10)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 20)

  const geometry = new THREE.BoxGeometry(5, 5, 5)

  // 创建纹理加载器
  const loader = new THREE.TextureLoader()

  const lambertBase = new THREE.MeshLambertMaterial({
    map: await loader.loadAsync(new URL(`../../../../assets/image/plaster.jpg`, import.meta.url).href),
  })

  const meshBase = new THREE.Mesh(geometry, lambertBase)
  meshBase.position.x = -4

  // 法相贴图纹理细节更好
  // 需要使用 Phong 金属材质，才能使用凹凸材质贴图
  const lambert = new THREE.MeshPhongMaterial({
    map: await loader.loadAsync(new URL(`../../../../assets/image/plaster.jpg`, import.meta.url).href),
    normalMap: await loader.loadAsync(new URL(`../../../../assets/image/plaster-normal.jpg`, import.meta.url).href),
  })

  const mesh = new THREE.Mesh(geometry, lambert)
  mesh.position.x = 4

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-10, 10, 90)

  scene.add(axes)
  scene.add(spotLight)
  scene.add(meshBase)
  scene.add(mesh)

  const animation = () => {
    if (mesh) {
      mesh.rotation.x += 0.01
      mesh.rotation.y += 0.01
      meshBase.rotation.x += 0.01
      meshBase.rotation.y += 0.01
    }
    stats.update()
    renderer.render(scene, camera)

    requestAnimationFrame(animation)
  }

  animation()
})
</script>

<style lang="scss" scoped></style>
