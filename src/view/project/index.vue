<template>
  <div>
    <canvas id="canvas" @click="changeCameraPosition">浏览器不支持，请切换浏览器重试</canvas>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import { GUI } from 'dat.gui'
import { initThreeJsWebGL, tick } from '@/utils/threejs-template.js'
import City from '@/view/project/city/index.js'
import SkyFly from '@/view/project/sky-fly/index.js'
import { getClickPosition } from '@/utils/click.js'

let threeProp = reactive({})

onMounted(async () => {
  const { scene, camera, controls, renderer, stats } = initThreeJsWebGL({
    canvasDom: '#canvas',
    backgroundColor: 0xffffff,
    maxDistance: 2000,
    near: 1,
    far: 100000,
  })

  // reactive 需要使用 assign 进行对象赋值
  Object.assign(threeProp, { scene, camera, controls, renderer, stats })

  camera.position.set(1000, 500, 100)

  // 添加灯光
  const ambientLight = new THREE.AmbientLight(0xadadad)
  const directionLight = new THREE.DirectionalLight(0xffffff)
  directionLight.position.set(0, 0, 0)

  new City({ scene })
  new SkyFly({ scene })

  scene.add(directionLight)
  scene.add(ambientLight)

  tick({
    render() {
      TWEEN.update() // TWEEN 动画必须设置更新
    },
  })
})

const changeCameraPosition = (e) => {
  const mousePoint = getClickPosition({ camera: threeProp.camera, scene: threeProp.scene, e })

  const tween = new TWEEN.Tween(threeProp.camera.position)
    .to({ x: mousePoint.x, y: mousePoint.y, z: mousePoint.z }, 2000)
    .start()
}
</script>

<style lang="scss" scoped>
#canvas {
}
</style>
