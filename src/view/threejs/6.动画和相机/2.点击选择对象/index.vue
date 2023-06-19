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

  const boxGeometry = new THREE.BoxGeometry(2, 2, 2, 1, 1, 1)
  const sphereGeometry = new THREE.SphereGeometry(2, 10, 10)

  const lambert = new THREE.MeshLambertMaterial({ color: 0xff0000 })
  const basic = new THREE.MeshBasicMaterial({ wireframe: true })

  // 因为删除添加不是同一个 mesh 所以会有重叠现象，所以使用对象传递
  const cube = new THREE.Mesh(boxGeometry, lambert)
  cube.name = 'cube'
  cube.rotation.set(0.4, 0.4, 0)
  cube.position.x = -4

  const sphere = new THREE.Mesh(sphereGeometry, lambert)
  sphere.name = 'sphere'
  sphere.position.x = 4

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-10, 10, 90)

  // document.addEventListener('click', (e) => {
  //   // 获取浏览器 归一化 二维平面坐标
  //   const x = (e.clientX / window.innerWidth) * 2 - 1
  //   const y = (e.clientY / window.innerHeight) * 2 - 1
  //
  //   // 获取点击三维坐标
  //   const standVector = new THREE.Vector3(x, y, 0.5)
  //
  //   // 转化为世界坐标 (二维平面位置百分比，在相机中实际的坐标位置)
  //   const wordVector = standVector.unproject(camera)
  //
  //   // sub：wordVector 减去某个向量
  //   // normalize：将向量归一化为 1
  //   const ray = wordVector.sub(camera.position).normalize()
  //
  //   // 实现点击选中
  //   // 创建射线发射器，用来发射一条射线
  //   const rayCaster = new THREE.Raycaster(camera.position, ray)
  //
  //   // 返回射线碰撞到的物体
  //   const intersects = rayCaster.intersectObjects(scene.children, true)
  //
  //   let point3D = null
  //   if (intersects.length) {
  //     point3D = intersects[0]
  //   }
  //
  //   console.log(intersects, point3D?.object.name, point3D)
  // })

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()

  // 简化写法
  document.addEventListener('click', (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1

    // 通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera(pointer, camera)

    // 计算物体和射线的焦点
    const intersects = raycaster.intersectObjects(scene.children)

    console.log(intersects[0].object)
    intersects[0].object.material.color.set(0xffff00)
  })

  scene.add(axes)
  scene.add(cube)
  scene.add(sphere)
  scene.add(spotLight)

  const animation = () => {
    renderer.render(scene, camera)

    requestAnimationFrame(animation)
  }

  animation()
})
</script>

<style lang="scss" scoped></style>
