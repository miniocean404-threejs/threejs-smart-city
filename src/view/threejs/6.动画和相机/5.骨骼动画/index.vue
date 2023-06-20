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
  const sizing = getSkeletonSizing(18, 4, 0)

  const geometry = new THREE.CylinderGeometry(
    4,
    4,
    sizing.height,
    8,
    // 数值越大越细腻，圆柱度 y 轴的分段数
    sizing.segmentCount * 3,
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

  // const { index, weight } = videoSkeleton(geometry, sizing)
  const { index, weight } = getOfficialSkeleton(geometry, sizing)

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
    // if (mesh.skeleton.bones[0].rotation.x > 0.3 || mesh.skeleton.bones[0].rotation.x < -0.3) {
    //   deg = -deg
    // }
    //
    // for (let i = 0; i < mesh.skeleton.bones.length; i++) {
    //   // (deg * Math.PI) / 180 弧度计算公式
    //   mesh.skeleton.bones[i].rotation.x += (deg * Math.PI) / 180
    // }

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
    const y = arr[i + 1] + sizing.halfHeight - sizing.offsetY
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
const getOfficialSkeleton = (geometry, sizing) => {
  const index = [] // 索引
  const weight = [] // 权重

  const vertex = new THREE.Vector3()
  const position = geometry.attributes.position

  // 官网写法
  for (let i = 0; i < position.count; i++) {
    // 从 position 中取出每一组 xyz
    vertex.fromBufferAttribute(position, i)

    // 从圆柱体坐标(默认是圆柱体底部开始为起始坐标) -> 获取骨骼中心点的坐标
    const y = vertex.y + sizing.halfHeight - sizing.offsetY

    //  计算顶点索引值 `skinIndex` （受那个骨骼影响）
    //  先将原来 `vertex `顶点的 `y `坐标加上骨架的一半高度，是为了归一化，方便计算当前位置是第几个骨骼
    //  结果就是获取当前顶点对应的骨骼索引应该是第几个
    const skinIndex = Math.floor(y / sizing.segmentHeight)

    //  计算权重`skinWeight`受骨骼影响的比重
    //
    //   y % sizing.segmentHeight （这里的y是偏移过的也就是加了`sizing.halfHeight`）
    //
    //   这里取余可以求出相对一根骨骼底部的偏移量（因为索引值上面已经求出来了）
    //   再除以骨架的高度，便可以求出相对于权重
    const skinWeight = (y % sizing.segmentHeight) / sizing.segmentHeight

    // geometry.skinIndices[3] = new THREE.Vector4(1,2,3,0);
    // geometry.skinWeights[3] = new THREE.Vector4(0.6,0.3,0.1,0);
    // 上面的代码表示，geometry的第四个顶点受序号为 1,2,3 的三根骨骼控制，控制的比重分别是 0.6，0.3，0.1。序号为 0 的骨骼由于控制比重为 0，即这个点不受这根骨骼控制。

    // .skinIndices就像skinWeights属性一样，skinIndices的值对应于几何体的顶点. 每个顶点最多可以有4个与之关联的骨骼.
    // 因此，如果您查看第一个顶点和第一个皮肤骨骼索引skinIndex，它将告诉您与该顶点关联的骨骼.
    // 例如，第一个顶点坐标( 10.05, 30.10, 12.12 ). 第一个皮肤骨骼索引 skin index值是( 10, 2, 0, 0 ).
    // 第一个皮肤权重skin weight值是( 0.8, 0.2, 0, 0 ).
    // 这两个皮肤 骨骼索引 skin index 和 皮肤权重 skin weight 数据表达的意思是:
    // 骨骼 10 mesh.bones[10]对第一个顶点坐标影响权重80％. 骨骼 2 skeleton.bones[2]对第一个顶点的影响权重 20％.
    // 接下来的两个骨骼权重值的权重为0，因此对顶点坐标没有任何影响.
    index.push(skinIndex, skinIndex + 1, 0, 0)
    // .skinWeights表示的是几何体顶点权重数据，当使用骨骼动画网格模型SkinnedMesh的时候, 每个顶点最多可以有 4 个骨骼对象Bone影响它.
    // skinWeights 属性是一个权重值数组，对应于几何体中顶点的顺序. 因此，例如，第一个 skinWeight 将对应于几何体中的第一个顶点.
    // 由于每个顶点可以被4个骨骼Bone修改，因此Vector4用于表示该顶点的皮肤skin的权重weights.
    // 向量vector分量的值通常应在0和1之间. 例如，当设置为 0 时，骨骼变换bone transformation 将不起作用.
    // 设置为 0.5 时，将产生 50％ 的影响. 设置为 100％ 时，会产生 100％ 的影响.
    // 如果只有一个骨骼与顶点关联，那么您只需要考虑设置向量的第一个分量大小，其余的可以忽略并设置为 0.
    weight.push(1 - skinWeight, 0, 0, 0)
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
    offsetY: offsetY ?? halfHeight,
  }
}
</script>

<style lang="scss" scoped></style>
