<template>
  <div>
    <canvas id="canvas" @mousedown="canvasMouseDown" @mousemove="canvasMouseMove" @mouseup="canvasMouseUp"
      >浏览器不支持，请切换浏览器重试</canvas
    >
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
import Radar from '@/view/project/radar/index.js'

let threeProp = reactive({})
const isClick = ref(false)

onMounted(async () => {
  const { scene, camera, controls, renderer, stats, clock } = initThreeJsWebGL({
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

  const city = new City({ scene })
  const radar = new Radar({ scene })
  new SkyFly({ scene })

  scene.add(directionLight)
  scene.add(ambientLight)

  tick({
    render() {
      city.scanHeight.value += 0.6

      if (city.scanHeight.value > 160) {
        city.scanHeight.value = 0
      }

      radar.time.value += clock.getDelta()

      city.scanTime.value += clock.getDelta() // clock.getDelta() 获得前后两次执行该方法的时间间隔

      TWEEN.update() // TWEEN 动画必须设置更新
    },
  })
})

const canvasMouseDown = () => {
  isClick.value = true
}

const canvasMouseMove = () => {
  isClick.value = false
}

const canvasMouseUp = (e) => {
  if (isClick.value) {
    changeCameraPosition(e)
  }
}

const changeCameraPosition = (e) => {
  const mousePoint = getClickPosition({ camera: threeProp.camera, scene: threeProp.scene, e })

  new TWEEN.Tween(threeProp.camera.position)
    .to({ x: mousePoint.point.x * 2, y: mousePoint.point.y * 2, z: mousePoint.point.z * 2 }, 1000)
    .start()
}
</script>

<style lang="scss" scoped></style>
