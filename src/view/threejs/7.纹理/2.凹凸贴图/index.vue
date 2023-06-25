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

  const geometry = new THREE.BoxGeometry(6, 6, 3)

  let mesh = null

  // 创建纹理加载器
  const loader = new THREE.TextureLoader()

  loader.load(
    new URL(`../../../../assets/image/wall.jpg`, import.meta.url).href,
    (texture) => {
      const lambert = new THREE.MeshLambertMaterial({ map: texture })

      mesh = new THREE.Mesh(geometry, lambert)
      mesh.position.x = -4

      scene.add(mesh)
    },
    () => {},
    () => {},
  )

  loader.load(
    new URL(`../../../../assets/image/wall.jpg`, import.meta.url).href,
    (texture) => {
      loader.load(
        new URL(`../../../../assets/image/wall-bump.jpg`, import.meta.url).href,
        (bumpTexture) => {
          // 需要使用 Phong 金属材质，才能使用凹凸材质贴图
          const lambert = new THREE.MeshPhongMaterial({ map: texture, bumpMap: bumpTexture, bumpScale: 0.3 })

          mesh = new THREE.Mesh(geometry, lambert)
          mesh.position.x = 4

          scene.add(mesh)
        },
        () => {},
        () => {},
      )
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
