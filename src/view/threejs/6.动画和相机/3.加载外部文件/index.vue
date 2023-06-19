<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import * as SceneUtils from 'three/addons/utils/SceneUtils.js'
import Stats from 'three/addons/libs/stats.module.js'
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'

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
  camera.position.set(0, 300, 400)
  camera.lookAt(0, 0, 0)

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(2000, 8000, 4000)

  console.log(new URL(`../../../../assets/models/`, import.meta.url).href)
  const mtlLoader = new MTLLoader()
  mtlLoader.setPath(new URL(`../../../../assets/models/`, import.meta.url).href)
  mtlLoader.load('/city.mtl', function (materials) {
    materials.preload()

    const objLoader = new OBJLoader()
    objLoader.setMaterials(materials)
    objLoader.setPath(new URL(`../../../../assets/models/`, import.meta.url).href)
    objLoader.load(
      '/city.obj',
      function (mesh) {
        mesh.position.y = -0.5
        scene.add(mesh)
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          const percentComplete = (xhr.loaded / xhr.total) * 100
          console.log(`已经加载: ${Math.round(percentComplete)}`)
        }
      },
      () => {},
    )
  })

  scene.add(axes)
  scene.add(spotLight)

  const animation = () => {
    renderer.render(scene, camera)

    requestAnimationFrame(animation)
  }

  animation()
})
</script>

<style lang="scss" scoped></style>
