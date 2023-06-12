<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'

onMounted(() => {
  const app = document.querySelector('#app')
  const canvasDom = document.querySelector('#canvas')

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 20)

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  if (!canvasDom) {
    renderer.domElement.id = 'canvas'
    app.appendChild(renderer.domElement)
  }

  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
  const cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    // 是否以线框模式绘制
    wireframe: false,
  })
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

  // 设置 name 以便于 scene.getObjectByName 获取
  cube.name = 'cube'

  // 添加一个 mesh 对象
  scene.add(cube)
  // 移除一个 mesh 对象
  // scene.remove(cube)

  // 获取 mesh(网格) 对象
  const cubeObject = scene.getObjectByName('cube')
  cubeObject.scale.set(2, 2, 2)

  // 获取场景下所有 mesh 的列表
  console.log(scene.children)

  // 实现雾化效果
  scene.fog = new THREE.Fog(0xffffff, 0.1, 50)

  // 强制场景中的所有 mesh 使用相同材质
  scene.overrideMaterial = new THREE.MeshLambertMaterial({
    color: 0xffff00,
    // 是否以线框模式绘制
    wireframe: false,
  })

  renderer.render(scene, camera)
})
</script>

<style lang="scss" scoped></style>
