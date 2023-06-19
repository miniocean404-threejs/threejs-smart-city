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

// 轨迹球控件：鼠标滚轮控制缩放，平移，旋转
import { TrackballControls } from 'three/addons/controls/TrackballControls.js'
// 第一人称控件：第一人称视角观察场景
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js'
// 飞行控件：飞行模拟器控件，可以用键盘鼠标来控制转动
import { FlyControls } from 'three/addons/controls/FlyControls.js'

// 轨道控件：用于模拟轨道视角控件
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

  const axes = new THREE.AxesHelper(10)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 300, 400)
  camera.lookAt(0, 0, 0)
  const trackball = new TrackballControls(camera, renderer.domElement)

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
    trackball.update()
    renderer.render(scene, camera)

    requestAnimationFrame(animation)
  }

  animation()
})
</script>

<style lang="scss" scoped></style>
