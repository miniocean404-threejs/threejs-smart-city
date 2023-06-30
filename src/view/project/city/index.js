import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { Color, EdgesGeometry, LineBasicMaterial, LineSegments, Mesh, ShaderMaterial } from 'three'
import * as THREE from 'three'

import { loadAssetsFile } from '@/utils/assets-path.js'

import beijing from '@/assets/models/beijing.fbx?url'
import CityVertexShader from './city.vert?raw'
import CityFragmentShader from './city.frag?raw'
import LineVertexShader from './line.vert?raw'
import LineFragmentShader from './line.frag?raw'

export default class City {
  fbxLoader = new FBXLoader()
  scene = null

  // 必须使用对象引用改变其值，否则 render 修改时候不生效
  scanHeight = { value: 0 }
  scanTime = { value: 0 }

  time = { value: 0 }

  meshColor = `#3e566f`
  topColor = '#ffffff'
  scanColor = '#5588aa'

  lineColor = '#4f90bb'
  rowScanColor = '#ffffff'

  constructor({ scene }) {
    this.scene = scene
    this.load().then()
  }

  async load() {
    const group = await this.fbxLoader.loadAsync('/src/assets/models/beijing.fbx' || beijing, (progress) => {})

    // 遍历加载的文件的所有对象
    group.traverse((child) => {
      if (child.isMesh) {
        this.createMesh(child)

        // this.createLineBox(child)
      }
    })
  }

  createMesh(child) {
    // 计算盒子边界 和 球的边界
    child.geometry.computeBoundingBox()
    child.geometry.computeBoundingSphere()

    const { max, min } = child.geometry.boundingBox
    const size = max.z - min.z

    // 使用 glsl 给建筑物设置渐变的颜色
    const material = new ShaderMaterial({
      uniforms: {
        // 创建上升扫描线
        u_height: this.scanHeight,
        u_up_color: { value: new Color(this.scanColor) },

        // 创建线框渐变色
        u_city_color: {
          value: new Color(this.meshColor),
        },
        u_head_color: {
          value: new Color(this.topColor),
        },
        u_size: {
          value: size,
        },

        // 建筑物生长参数
        u_time: this.time,
      },
      vertexShader: CityVertexShader,
      fragmentShader: CityFragmentShader,
    })

    const mesh = new Mesh(child.geometry, material)

    // 让 mesh 继承 child 的旋转、缩放、平移
    mesh.position.copy(child.position)
    mesh.scale.copy(child.scale)
    mesh.rotation.copy(child.rotation)

    this.scene.add(mesh)
  }

  createLineBox(child) {
    // 创建建筑物外围
    const geometry = new EdgesGeometry(child.geometry)
    // api 创建素材
    // const material = new LineBasicMaterial({ color: this.lineColor })
    const { max, min } = child.geometry.boundingBox

    // glsl 创建
    const material = new ShaderMaterial({
      uniforms: {
        u_max: { value: max },
        u_min: { value: min },
        u_time: this.scanTime,
        u_live_color: {
          value: new Color(this.rowScanColor),
        },

        line_color: { value: new Color(this.lineColor) },
      },
      vertexShader: LineVertexShader,
      fragmentShader: LineFragmentShader,
    })

    // 创建线条 mesh
    const mesh = new LineSegments(geometry, material)

    // 继承建筑物偏移量、旋转、缩放
    mesh.scale.copy(child.scale)
    mesh.position.copy(child.position)
    mesh.rotation.copy(child.rotation)

    this.scene.add(mesh)
  }
}
