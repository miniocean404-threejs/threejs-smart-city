<template>
  <div></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import * as SceneUtils from 'three/addons/utils/SceneUtils.js'
import Stats from 'three/addons/libs/stats.module.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const axes = new THREE.AxesHelper(100)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(100, 100, 0)
camera.lookAt(0, 0, 0) // lookAt 默认是 z 轴的负方向

const spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set(2000, 8000, 4000)

onMounted(() => {
  const app = document.querySelector('#app')
  const canvasDom = document.querySelector('#canvas')

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  const stats = new Stats() // 开启性能检测
  if (!canvasDom) {
    renderer.domElement.id = 'canvas'

    app.appendChild(renderer.domElement)
    app.appendChild(stats.dom)
  }

  // 轨道控件
  const controls = new OrbitControls(camera, renderer.domElement)

  // 获取骨骼数据
  const sizing = getSkeletonSizing(10, 4, 10)

  const geometry = new THREE.CylinderGeometry(
    4,
    4,
    sizing.height,
    8,
    // 数值越大越细腻，圆柱度 y 轴的分段数
    sizing.segmentCount,
    false,
  )

  geometry.translate(0, sizing.offsetY, 0)

  const material = new THREE.MeshNormalMaterial()
  // 蒙皮 - 皮肤 , 将圆柱体作为皮肤画到骨骼动画上
  const mesh = new THREE.SkinnedMesh(geometry, material)
  // mesh.position.y = 30 可以设置整体偏移量

  // 创建骨骼的起点高度
  let b1 = new THREE.Bone()
  b1.position.set(0, -sizing.halfHeight + sizing.offsetY, 0)

  let b2 = new THREE.Bone()
  b2.position.set(0, sizing.segmentHeight, 0)

  let b3 = new THREE.Bone()
  b3.position.set(0, sizing.segmentHeight, 0)

  let b4 = new THREE.Bone()
  b4.position.set(0, sizing.segmentHeight, 0)

  let b5 = new THREE.Bone()
  b5.position.set(0, sizing.segmentHeight, 0)

  b1.add(b2)
  b2.add(b3)
  b3.add(b4)
  b4.add(b5)

  const { index, weight } = videoSkeleton(geometry, sizing)
  // const { index, weight } = getOfficialSkeleton(geometry, sizing)

  // 必须设置，否则会报错：获取不到 getX
  // 参数 2 是每多少个为一组
  // 也可以使用：
  // geometry.skinIndices.push(new THREE.Vector4(0, 0, 0, 0));
  // geometry.skinWeights.push(new THREE.Vector4(0, 0, 0, 0));
  geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(index, 4))
  geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(weight, 4))

  // 创建骨架
  const skeleton = new THREE.Skeleton([b1, b2, b3, b4, b5])

  mesh.add(skeleton.bones[0] || b1)
  mesh.bind(skeleton)

  // 骨骼辅助显示，必须在绑定后调用才显示
  const skeletonHelper = new THREE.SkeletonHelper(mesh)

  scene.add(mesh)
  scene.add(spotLight)
  scene.add(axes)
  scene.add(skeletonHelper)

  let deg = 0.1
  const animation = () => {
    // 添加边界
    if (mesh.skeleton.bones[0].rotation.x > 0.3 || mesh.skeleton.bones[0].rotation.x < -0.3) {
      deg = -deg
    }

    for (let i = 0; i < mesh.skeleton.bones.length; i++) {
      // (deg * Math.PI) / 180 弧度计算公式
      mesh.skeleton.bones[i].rotation.x += (deg * Math.PI) / 180
    }

    controls.update()
    stats.update()
    renderer.render(scene, camera)
    requestAnimationFrame(animation)
  }

  animation()
})

// 获取视频写法数据
const videoSkeleton = (geometry, sizing) => {
  // 分段移动骨骼
  // 添加权重   设置的就是蒙皮的权重，  顶点的蒙皮索引
  const index = [] // 索引
  const weight = [] // 权重

  const arr = geometry.attributes.position.array
  const len = geometry.attributes.position.count || geometry.vertices.length

  // 每三个是一个 xyz 坐标
  for (let i = 0; i < arr.length; i += 3) {
    // 获取每一截的 y 的位置
    const y = arr[i + 1] + 10
    // 获取索引值
    const skinIndex = Math.floor(y / sizing.segmentHeight)

    const skinWeight = (y % sizing.segmentHeight) / sizing.segmentHeight

    // 添加的是 x,y,z,w 的坐标
    index.push(skinIndex, skinIndex + 1, 0, 0)
    weight.push(1 - skinWeight, skinWeight, 0, 0)
  }

  return {
    index,
    weight,
  }
}

// 获取官网写法数据
// https://blog.csdn.net/weixin_30696427/article/details/98372800
const getOfficialSkeleton = (geometry, sizing, offsetY) => {
  const index = [] // 索引
  const weight = [] // 权重

  const vertex = new THREE.Vector3()
  const position = geometry.attributes.position

  // 官网写法
  for (let i = 0; i < position.count; i++) {
    // 从 position 中取出每一组 xyz
    vertex.fromBufferAttribute(position, i)

    // 获取骨骼中心处的坐标
    const y = vertex.y + sizing.offsetY

    //  计算顶点索引值 `skinIndex` （受那个骨骼影响）
    //   先将原来 `vertex `顶点的 `y `坐标加上骨架的一半高度，
    //   相当于将原来在骨架顶部的 `y `轴坐标原点上移到骨骼 `y `轴的中心处
    //    |                                          |
    //    |                                          |
    //    |                +  sizing.halfHeight =    |. `y`坐标原点
    //    |                                          |
    //    |                                          |
    //    |. `y`坐标原点                                                                               |
    //
    //   然后除以骨骼数，然后向下取整便可取到索引值
    const skinIndex = Math.floor(y / sizing.segmentHeight)

    //  计算权重`skinWeight`受骨骼影响的比重
    //
    //   y % sizing.segmentHeight （这里的y是偏移过的也就是加了`sizing.halfHeight`）
    //
    //   这里取余可以求出相对一根骨骼底部的偏移量（因为索引值上面已经求出来了）
    //   再除以骨架的高度，便可以求出相对于权重
    const skinWeight = (y % sizing.segmentHeight) / sizing.segmentHeight

    index.push(skinIndex, skinIndex + 1, 0, 0)
    weight.push(1 - skinWeight, skinWeight, 0, 0)
  }

  return {
    index,
    weight,
  }
}

const getSkeletonSizing = (
  // 每段高度，这里指骨骼长度
  segmentHeight = 10,
  // 分段数量，这里指骨骼数量
  segmentCount = 4,
  // 骨架和圆柱体整体偏移数量
  offsetY,
) => {
  // 骨架总高度
  const height = segmentHeight * segmentCount

  // 骨架一半的高度
  const halfHeight = height / 2

  return {
    segmentHeight: segmentHeight,
    segmentCount: segmentCount,
    height: height,
    halfHeight: halfHeight,
    offsetY: offsetY || halfHeight,
  }
}
</script>

<style lang="scss" scoped></style>
