import blueSky from '@/assets/image/project/white-bg.png'
import { DoubleSide, Mesh, MeshBasicMaterial, SphereGeometry, TextureLoader, Vector3 } from 'three'
import { loadAssetsFile } from '@/utils/assets-path.js'

export default class SkyFly {
  loader = new TextureLoader()
  scene = null

  constructor({ scene }) {
    this.scene = scene
    this.createSkyBoxMesh().then()
  }

  async createSkyBoxMesh() {
    // 创建球形天空盒, 如果球体过大，并且缩放过程中显示白色球体，需要吧相机的 far 设置的很大
    const geometry = new SphereGeometry(5000, 32, 32)
    const material = new MeshBasicMaterial({
      side: DoubleSide,
      map: await this.loader.loadAsync(loadAssetsFile(blueSky)),
    })

    const sphereMesh = new Mesh(geometry, material)

    sphereMesh.position.copy(new Vector3(0, 0, 0))
    sphereMesh.name = 'skybox'

    this.scene.add(sphereMesh)
  }
}
