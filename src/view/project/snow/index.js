import { loadAssetsFile } from '@/utils/assets-path'
import { BufferGeometry, Points, PointsMaterial, TextureLoader, Vector3 } from 'three'
import snowImage from '@/assets/image/project/snow.png'

export default class Snow {
  scene = null
  mesh = null
  points = []

  range = 1000
  count = 600

  constructor({ scene }) {
    this.scene = scene
    this.createSnow()
  }

  async createSnow() {
    const material = new PointsMaterial({
      size: 30,
      map: await new TextureLoader().loadAsync(loadAssetsFile(snowImage)),
      transparent: true,
      opacity: 0.8,
      depthTest: false,
    })

    const geometry = new BufferGeometry()

    // 给空的 BufferGeometry 添加顶点信息

    for (let i = 0; i < this.count; i++) {
      const position = new Vector3(
        Math.random() * this.range - this.range / 2,
        Math.random() * this.range,
        Math.random() * this.range - this.range / 2,
      )

      position.speedX = Math.random() - 0.5
      position.speedY = Math.random() + 0.4 // 下落速度 0.4 - 1
      position.speedZ = Math.random() - 0.5

      this.points.push(position)
    }

    geometry.setFromPoints(this.points)

    this.mesh = new Points(geometry, material)

    this.scene.add(this.mesh)
  }

  updateSnowPosition() {
    if (!this.mesh) return

    this.points.forEach((position, index) => {
      position.x -= position.speedX
      position.y -= position.speedY
      position.z -= position.speedZ

      if (position.y <= 0) {
        position.y = this.range / 2
      }
    })

    this.mesh.geometry.setFromPoints(this.points)
  }
}
