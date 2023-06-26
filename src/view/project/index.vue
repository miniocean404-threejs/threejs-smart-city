<template>
  <div>
    <canvas id="canvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { initThreeJsWebGL, tick } from '@/utils/threejs-template.js'

// 粒子转换为图形： https://juejin.cn/post/7236184868480057381
onMounted(async () => {
  const { scene, camera, controls, renderer, stats } = initThreeJsWebGL({
    canvasDom: '#canvas',
    backgroundColor: 0x000000,
  })

  camera.position.set(0, 30, 100)

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-10, 10, 90)
  scene.add(spotLight)

  const geometry = new THREE.BoxGeometry(10, 10, 10, 10, 10, 10)
  let mesh = null

  tick({
    render() {
      mesh.rotation.y += 0.01
      TWEEN.update() // TWEEN 动画必须设置更新
    },
  })
})
</script>

<style lang="scss" scoped></style>
