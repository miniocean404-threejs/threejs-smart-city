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
  const prop = initThreeJsWebGL({
    canvasDom: '#canvas',
    backgroundColor: 0x000000,
  })
  const { scene, camera, controls, renderer, stats } = prop

  camera.position.set(0, 30, 100)

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-10, 10, 90)
  scene.add(spotLight)

  const geometry = new THREE.BoxGeometry(10, 10, 10, 10, 10, 10)
  let mesh = null

  const guiControls = {
    polymeric: false, // 是否要组合成立方体
    completeMesh: false, // 组合之后是否要显示立方体
    showMesh: false, // 是否要现在显示立方体
  }

  // 获取原点以便于 tween 恢复原位
  const originPosition = geometry.attributes.position.clone()

  mesh = createRandomPointMesh(geometry)
  scene.add(mesh)

  const gui = new GUI()
  for (const key in guiControls) {
    gui
      .add(guiControls, key)
      .step(0.01)
      .name(key)
      .onChange(() => {
        // 删除之前保留的 mesh
        scene.remove(mesh)

        mesh = guiControls.showMesh ? createCubeMesh() : createRandomPointMesh(geometry)
        scene.add(mesh)

        if (guiControls.polymeric) {
          setTween({
            geometry,
            originPosition,
            onFinish() {
              if (guiControls.completeMesh) {
                scene.remove(mesh)
                mesh = createCubeMesh()
                scene.add(mesh)
              }
            },
          })
        }
      })
  }

  tick({
    ...prop,
    render() {
      mesh.rotation.y += 0.01
      TWEEN.update() // TWEEN 动画必须设置更新
    },
  })
})

const createRandomPointMesh = (geometry, range = 100) => {
  const position = geometry.attributes.position
  let newPosition = []

  for (let i = 0; i < position.count; i++) {
    // 设置粒子随机点
    newPosition.push(
      Math.random() * range - range / 2,
      Math.random() * range - range / 2,
      Math.random() * range - range / 2,
    )
  }

  const points = new THREE.Float32BufferAttribute(newPosition, 3)

  // 可以通过这个或者下方的方式设置位置属性
  geometry.setAttribute('position', points)

  // for (let i = 0; i < points.count; i++) {
  //   geometry.attributes.position.setXYZ(
  //     i,
  //     Math.random() * range - range / 2,
  //     Math.random() * range - range / 2,
  //     Math.random() * range - range / 2,
  //   )
  // }

  const material = new THREE.PointsMaterial({
    size: 1,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    map: getSprite(),
  })

  return new THREE.Points(geometry, material)
}

function createCubeMesh() {
  return new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10, 10, 10, 10), new THREE.MeshNormalMaterial())
}

const getSprite = (size = 2) => {
  const canvas = document.createElement('canvas')
  canvas.width = size * 2
  canvas.height = size * 2

  const ctx = canvas.getContext('2d')

  // 可以使用 Canvas 的渐变方法 createRadialGradient 创建出一种类似发光特效来作为粒子的纹理
  const gradient = ctx.createRadialGradient(size, size, 0, size, size, size)
  gradient.addColorStop(0.1, 'rgba(0,255,255,1)')

  // 注释掉下方就是一个完整的矩形
  // gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  // gradient.addColorStop(0.2, 'rgba(0, 255, 0, 1)')
  // gradient.addColorStop(0.4, 'rgba(0, 120, 20, 1)')
  // gradient.addColorStop(1, 'rgba(0, 0, 0, 1)')

  ctx.fillStyle = gradient
  ctx.arc(size, size, size, 0, Math.PI * 2)
  ctx.fill()

  const texture = new THREE.Texture(canvas)
  texture.needsUpdate = true

  return texture
}

const setTween = ({ geometry, originPosition, onFinish }) => {
  let listen = false
  const position = geometry.attributes.position
  const oldPoints = new THREE.Float32BufferAttribute(originPosition.array, 3)
  const newPoints = new THREE.Float32BufferAttribute(position.array, 3)

  for (let i = 0; i < position.count; i++) {
    const randomPoint = {
      x: newPoints.getX(i),
      y: newPoints.getY(i),
      z: newPoints.getZ(i),
    }
    const originPoint = {
      x: oldPoints.getX(i),
      y: oldPoints.getY(i),
      z: oldPoints.getZ(i),
    }

    new TWEEN.Tween(randomPoint)
      .to(originPoint, 1000)
      .easing(TWEEN.Easing.Quadratic.InOut) // 使用缓动函数使动画流畅。
      .start()
      .onUpdate(() => {
        // onUpdate 会更新 .to 前面的值进行更新
        geometry.attributes.position.setXYZ(i, randomPoint.x, randomPoint.y, randomPoint.z)
        // geometry 及相关需要设置 webgl 的 attributes 属性的都需要设置 needsUpdate
        geometry.attributes.position.needsUpdate = true
      })
      .onComplete(() => {
        if (!listen) {
          listen = true

          onFinish && onFinish()
        }
      })
  }
}
</script>

<style lang="scss" scoped></style>
