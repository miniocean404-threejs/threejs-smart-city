<template>
  <div>
    <canvas id="canvas">浏览器不支持，请切换浏览器重试</canvas>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import { GUI } from 'dat.gui'
import { initThreeJsWebGL, tick } from '@/utils/threejs-template.js'
import City from '@/view/project/city/index.js'
import SkyFly from '@/view/project/sky-fly/index.js'

onMounted(async () => {
  const { scene, camera, controls, renderer, stats } = initThreeJsWebGL({
    canvasDom: '#canvas',
    backgroundColor: 0x000000,
    maxDistance: 500,
  })

  camera.position.set(1000, 500, 100)

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-10, 10, 90)

  const geometry = new THREE.BoxGeometry(10, 10, 10, 10, 10, 10)
  const material = new THREE.MeshLambertMaterial({ color: 0xff0000 })
  const mesh = new THREE.Mesh(geometry, material)

  scene.add(spotLight)
  scene.add(mesh)
  scene.background = new SkyFly().init()

  const city = new City({ scene })
  city.start()

  tick({
    render() {
      TWEEN.update() // TWEEN 动画必须设置更新
    },
  })
})
</script>

<style lang="scss" scoped>
#canvas {
}
</style>
