<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import * as SceneUtils from 'three/addons/utils/SceneUtils.js'
import Stats from 'three/addons/libs/stats.module.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { initControls } from '@/utils/gui-contrils/controls.js'
import { textOptions } from '@/utils/gui-contrils/constant.js'

onMounted(async () => {
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
  camera.position.set(0, 0, 60)

  const font = await loadFont('../../../../assets/font/gentilis_bold.typeface.json')
  // 字体文件需要使用 Facetype.js 生成 json 字体
  // 第二个参数：
  //   size: 字体大小
  //   height: 拉伸长度
  //   weight: 字重
  //   font: FontLoader 加载的字体
  //   style: 字体样式，常规体斜体
  //   bevelEnabled: 是否使用斜角
  //   bevelThickness: 斜角深度
  //   bevelSize: 斜角尺寸
  //   bevelSegments: 斜角分段数量,必须是整数
  //   curveSegments：曲线分段数量,必须是整数
  //   steps: 拉伸段数,必须是整数
  const geometry = new TextGeometry('three', { font: font, ...textOptions })

  const lambert = new THREE.MeshLambertMaterial({ color: 0xff0000 })
  const basic = new THREE.MeshBasicMaterial({ wireframe: true })

  // 因为删除添加不是同一个 mesh 所以会有重叠现象，所以使用对象传递
  const mesh = { pointer: new SceneUtils.createMultiMaterialObject(geometry, [lambert, basic]) }

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-10, 10, 90)

  initControls(geometry, camera, mesh, scene, font)

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

const loadFont = (path) => {
  return new Promise((resolve, reject) => {
    const loader = new FontLoader()
    loader.load(new URL(path, import.meta.url).href, (font) => {
      resolve(font)
    })
  })
}
</script>

<style lang="scss" scoped></style>
