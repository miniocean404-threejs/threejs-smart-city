import blueSky from '@/assets/image/project/white-bg.png'
import { DoubleSide, Mesh, MeshBasicMaterial, SphereGeometry, TextureLoader } from 'three'
import { loadAssetsFile } from '@/utils/assets-path.js'

export default class SkyFly {
  loader = new TextureLoader()

  constructor() {
    this.init()
  }

  async init() {
    // 创建球形天空盒
    const geometry = new SphereGeometry(5000, 32, 32)
    const material = new MeshBasicMaterial({
      side: DoubleSide,
      map: await this.loader.loadAsync(loadAssetsFile(blueSky)),
    })

    const sphereMesh = new Mesh(geometry, material)

    sphereMesh.position.copy({ x: 0, y: 0, z: 0 })

    return sphereMesh
  }
}
