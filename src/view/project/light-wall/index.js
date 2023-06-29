import { Color, CylinderGeometry, DoubleSide, Mesh, ShaderMaterial } from 'three'

import LightWallVertexShader from './light-wall.vert?raw'
import LightWallFragmentShader from './light-wall.frag?raw'

export default class LightWall {
  scene = null

  color = '#fab73f'
  time = {
    value: 0,
  }

  radius = 50
  height = 50
  open = true
  opacity = 0.6

  constructor({ scene }) {
    this.scene = scene

    this.createWall()
  }

  createWall() {
    const geometry = new CylinderGeometry(this.radius, this.radius, this.height, 32, 1, this.open)
    const material = new ShaderMaterial({
      uniforms: {
        u_color: {
          value: new Color(this.color),
        },
        u_height: {
          value: this.height,
        },
        u_opacity: {
          value: this.opacity,
        },
        u_time: this.time,
      },
      transparent: true,
      vertexShader: LightWallVertexShader,
      fragmentShader: LightWallFragmentShader,
      side: DoubleSide,
      depthTest: false, // 是否不被遮挡
    })

    geometry.translate(0, this.height / 2, 0)

    const mesh = new Mesh(geometry, material)
    mesh.position.set(0, 0, 0)

    this.scene.add(mesh)
  }
}
