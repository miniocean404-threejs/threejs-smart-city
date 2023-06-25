<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import * as SceneUtils from 'three/addons/utils/SceneUtils.js'
import Stats from 'three/addons/libs/stats.module.js'
import { initControls } from '@/utils/gui-contrils/controls.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

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

  // 轨道控件
  const controls = new OrbitControls(camera, renderer.domElement)
  // 设置鼠标可滚动距离
  controls.minDistance = 1
  controls.maxDistance = 50

  const geometry = new THREE.BoxGeometry(5, 5, 5)

  // 创建纹理加载器
  const loader = new THREE.TextureLoader()

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-10, 10, 90)

  // 创建虚拟场景
  // const images = [
  //   new URL(`../../../../assets/image/sky/right.jpg`, import.meta.url).href,
  //   new URL(`../../../../assets/image/sky/left.jpg`, import.meta.url).href,
  //   new URL(`../../../../assets/image/sky/top.jpg`, import.meta.url).href,
  //   new URL(`../../../../assets/image/sky/bottom.jpg`, import.meta.url).href,
  //   new URL(`../../../../assets/image/sky/front.jpg`, import.meta.url).href,
  //   new URL(`../../../../assets/image/sky/back.jpg`, import.meta.url).href,
  // ]
  //
  // const materials = []
  // images.map(async (url) => {
  //   const material = new THREE.MeshBasicMaterial({
  //     map: await loader.loadAsync(url),
  //     side: THREE.DoubleSide,
  //   })
  //
  //   materials.push(material)
  // })
  //
  // const skybox = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), materials)

  // 创建天空盒 CubeTextureLoader：三维纹理贴图
  const skybox = await new THREE.CubeTextureLoader()
    .setPath(new URL(`../../../../assets/image/sky/`, import.meta.url).href)
    .loadAsync([`/right.jpg`, `/left.jpg`, `/top.jpg`, `/bottom.jpg`, `/front.jpg`, `/back.jpg`])

  // 创建一个立方体，和环境保持一致
  const cubeGeometry = new THREE.BoxGeometry(5, 5, 5)
  const cubeMaterial = new THREE.MeshBasicMaterial({
    envMap: await new THREE.CubeTextureLoader()
      .setPath(new URL(`../../../../assets/image/sky/`, import.meta.url).href)
      .loadAsync([`/right.jpg`, `/left.jpg`, `/top.jpg`, `/bottom.jpg`, `/front.jpg`, `/back.jpg`]),
  })
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  cube.position.x = -5

  // 创建一个球体，跟随环境光
  const sphereGeometry = new THREE.SphereGeometry(4, 15, 15)
  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
  })
  const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget)
  const sphereMaterial = new THREE.MeshBasicMaterial({
    envMap: cubeCamera.renderTarget.texture,
  })
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere.position.x = 5

  scene.add(axes)
  scene.add(spotLight)

  scene.add(cubeCamera)
  scene.add(sphere)
  scene.add(cube)

  scene.background = skybox

  const animation = () => {
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    controls.update()
    stats.update()
    // 更新球体相机
    cubeCamera.update(renderer, scene)
    renderer.render(scene, camera)

    requestAnimationFrame(animation)
  }

  animation()
})
</script>

<style lang="scss" scoped></style>
