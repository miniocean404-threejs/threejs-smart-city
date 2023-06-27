import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import beijing from '@/assets/models/beijing.fbx?url'
import vertexShader from './city.vert?raw'
import fragmentShader from './city.frag?raw'
import { loadAssetsFile } from '@/utils/assets-path.js'
import { Color, Mesh, ShaderMaterial } from 'three'

export default class City {
  fbxLoader = new FBXLoader()
  scene = null

  constructor({ scene }) {
    this.scene = scene
    this.load().then()
  }

  async load() {
    const group = await this.fbxLoader.loadAsync(loadAssetsFile(beijing), (progress) => {})

    // 遍历加载的文件的所有对象
    group.traverse((child) => {
      if (child.isMesh) {
        const material = new ShaderMaterial({
          uniforms: {
            city_color: {
              value: new Color('#1b3045'),
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
