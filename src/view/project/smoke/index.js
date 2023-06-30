import smokeImage from '@/assets/image/project/smoke.png'
import { loadAssetsFile } from '@/utils/assets-path'
import { BufferGeometry, Float32BufferAttribute, Points, PointsMaterial, TextureLoader, Vector3 } from 'three'

export default class Smoke {
  scene = null
  point = null

  smokes = []

  constructor({ scene }) {
    this.scene = scene

    this.init()
  }

  async init() {
    const material = new PointsMaterial({
      size: 50,
      map: await new TextureLoader().loadAsync(loadAssetsFile(smokeImage)),
      transparent: true,
      depthTest: false,
    })

    material.onBeforeCompile = (shader) => {
      // 编译前修改顶点着色器
      const vertex1 = `
      attribute float a_opacity;
      attribute float a_size;
      attribute float a_scale;
      varying float v_opacity;

      void main() {
        v_opacity = a_opacity;
    `

      const glPosition = `
      gl_PointSize = a_size * a_scale;
    `
      shader.vertexShader = shader.vertexShader.replace('void main() {', vertex1)
      shader.vertexShader = shader.vertexShader.replace('gl_PointSize = size', glPosition)

      // 编译前修改片元着色器
      const fragment1 = `
      varying float v_opacity;

      void main() {
    `
      const fragment2 = `
      gl_FragColor = vec4(outgoingLight, diffuseColor.a * v_opacity);
    `

      shader.fragmentShader = shader.fragmentShader.replace('void main() {', fragment1)
      shader.fragmentShader = shader.fragmentShader.replace(
        'gl_FragColor = vec4(outgoingLight, diffuseColor.a);',
        fragment2,
      )
    }

    // 空的缓冲区几何体，需要设置坐标信息、纹理信息、变量信息
    const geometry = new BufferGeometry()

    this.point = new Points(geometry, material)

    this.scene.add(this.point)

    this.update()
  }

  update() {
    if (!this.point) return

    this.smokes.push({
      size: 15,
      opacity: 1,
      scale: 1,

      position: { x: 300, y: 100, z: 100 },

      speed: {
        x: Math.random(),
        y: Math.random() + 0.4,
        z: Math.random(),
      },
    })

    // 更新粒子位置
    const positions = []
    const scales = []
    const sizes = []
    const opacitys = []
    // 抛弃消失的粒子
    this.smokes = this.smokes.filter((info) => {
      if (info.opacity < 0) return false

      info.opacity -= 0.01

      info.position.x = info.position.x + info.speed.x
      info.position.y = info.position.y + info.speed.y
      info.position.z = info.position.z + info.speed.z

      positions.push(info.position.x, info.position.y, info.position.z)
      scales.push(info.scale)
      sizes.push(info.size)
      opacitys.push(info.opacity)

      return true
    })

    this.point.geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    this.point.geometry.setAttribute('a_size', new Float32BufferAttribute(sizes, 1))
    this.point.geometry.setAttribute('a_opacity', new Float32BufferAttribute(opacitys, 1))
    this.point.geometry.setAttribute('a_scale', new Float32BufferAttribute(sizes, 1))
  }
}
