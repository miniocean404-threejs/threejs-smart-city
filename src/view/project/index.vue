<template>
  <div>
    <canvas
      id="canvas"
      @mousedown="canvasMouseDown"
      @mousemove="canvasMouseMove"
      @mouseup="canvasMouseUp"
      @wheel="canvasMouseWheel"
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
import { getClickPosition, getMouseFollowScale } from '@/utils/click.js'
import Radar from '@/view/project/radar/index.js'
import LightWall from '@/view/project/light-wall/index.js'
import Circle from '@/view/project/circle/index.js'
import Ball from '@/view/project/ball/index.js'
import Cone from '@/view/project/cone/index.js'
import FlyLine from '@/view/project/fly-line/index.js'
import Road from '@/view/project/road/index'
import Font from '@/view/project/font/index'
import Snow from '@/view/project/snow/index'
import Rain from '@/view/project/rain/index'
import Smoke from '@/view/project/smoke/index'

const threeProp = reactive({})
const isClick = ref(false)
const tweenPositionRef = ref()

onMounted(async () => {
  const { scene, camera, controls, renderer, stats, clock } = initThreeJsWebGL({
    canvasDom: '#canvas',
    backgroundColor: 0x000000,
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
  const lightWall = new LightWall({ scene })
  const circle = new Circle({ scene })
  const ball = new Ball({ scene })
  const cone = new Cone({ scene })
  const flyLine = new FlyLine({ scene })
  const road = new Road({ scene })
  const rain = new Rain({ scene })
  // const snow = new Snow({ scene })
  const smoke = new Smoke({ scene })

  new Font({ scene })
  // new SkyFly({ scene })

  // scene.add(directionLight)
  // scene.add(ambientLight)

  tick({
    render() {
      city.scanHeight.value += 0.6

      if (city.scanHeight.value > 160) {
        city.scanHeight.value = 0
      }

      // clock.getDelta() 获得前后两次执行该方法的时间间隔,目前是屏幕间隔时间
      const delta = clock.getDelta()
      radar.time.value += delta
      city.scanTime.value += delta
      city.time.value += delta
      lightWall.time.value += delta
      circle.time.value += delta
      ball.time.value += delta
      flyLine.time.value += delta
      road.time.value += delta
      // snow.updateSnowPosition()
      rain.updateRainPosition()
      smoke.update()

      // 旋转四棱锥的旋转计算
      cone.rotation.value += 0.4
      if (cone.rotation.value > 160) {
        cone.rotation.value = 5
      }

      // 上下活动高度计算
      if (cone.top.value > 15 || cone.top.value < 0) {
        cone.isTop = !cone.isTop
      }
      cone.top.value += cone.isTop ? -0.8 : 0.8

      // if (tweenPositionRef.value) {
      //   tweenPositionRef.value.update()
      // }

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

const canvasMouseWheel = (e) => {
  getMouseFollowScale({ e, camera: threeProp.camera, controls: threeProp.controls })
}

const changeCameraPosition = (e) => {
  const mousePoint = getClickPosition({ camera: threeProp.camera, scene: threeProp.scene, e })
  if (!mousePoint) return

  tweenPositionRef.value = new TWEEN.Tween(threeProp.camera.position)
    .to({ x: mousePoint.point.x * 3, y: mousePoint.point.y * 3, z: mousePoint.point.z * 3 }, 1000)
    .start()
}
</script>

<style lang="scss" scoped></style>
