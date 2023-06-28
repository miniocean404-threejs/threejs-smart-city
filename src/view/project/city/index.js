import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import beijing from '@/assets/models/beijing.fbx?url'
import vertexShader from './city.vert?raw'
import fragmentShader from './city.frag?raw'
import { loadAssetsFile } from '@/utils/assets-path.js'
import { Color, Mesh, ShaderMaterial } from 'three'

export default class City {
  fbxLoader = new FBXLoader()
  scene = null

  meshColor = `#1b3045`
  topColor = '#ffffff'

  constructor({ scene }) {
    this.scene = scene
    this.load().then()
  }

  async load() {
    const group = await this.fbxLoader.loadAsync(loadAssetsFile(beijing), (progress) => {})

    // 遍历加载的文件的所有对象
    group.traverse((child) => {
      if (child.isMesh) {
        // 计算盒子边界 和 球的边界
        child.geometry.computeBoundingBox()
        child.geometry.computeBoundingSphere()

        const { max, min } = child.geometry.boundingBox
        const size = max.z - min.z

        const material = new ShaderMaterial({
          uniforms: {
            u_city_color: {
              value: new Color(this.meshColor),
            },
            u_head_color: {
              value: new Color(this.topColor),
            },
            u_size: {
              value: size,
            },
          },
          vertexShader: vertexShader,
          fragmentShader: fragmentShader,
        })
        const mesh = new Mesh(child.geometry, material)

        // 让 mesh 继承 child 的旋转、缩放、平移
        mesh.position.copy(child.position)
        mesh.rotation.copy(child.rotation)
        mesh.scale.copy(child.scale)

        this.scene.add(mesh)
      }
    })
  }
}
