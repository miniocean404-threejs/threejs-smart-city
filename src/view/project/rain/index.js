import { loadAssetsFile } from '@/utils/assets-path'
import { BufferGeometry, Points, PointsMaterial, TextureLoader, Vector3 } from 'three'
import rainImage from '@/assets/image/project/rain.png'

export default class Rain {
  scene = null
  mesh = null
  points = []

  range = 1000
  count = 800

  constructor({ scene }) {
    this.scene = scene
    this.createRain()
  }

  async createRain() {
    const material = new PointsMaterial({
      size: 10,
      map: await new TextureLoader().loadAsync(loadAssetsFile(rainImage)),
      transparent: true,
      opacity: 0.4,
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

      // 下落速度，雨滴下落太快，左右偏移可忽略
      // 每个雨滴下落速度随机 + 5 模拟真实下雨
      position.speedY = Math.random() + 5

      this.points.push(position)
    }

    geometry.setFromPoints(this.points)

    this.mesh = new Points(geometry, material)

    this.scene.add(this.mesh)
  }

  updateRainPosition() {
    if (!this.mesh) return

    this.points.forEach((position, index) => {
      position.y -= position.speedY

      if (position.y <= 0) {
        position.y = this.range / 2
      }
    })

    this.mesh.geometry.setFromPoints(this.points)
  }
}
