import { Color, CylinderGeometry, DoubleSide, Mesh, ShaderMaterial } from 'three'

import CircleWallVertexShader from './clrcle.vert?raw'
import CircleFragmentShader from './circle.frag?raw'

export default class Circle {
  scene = null

  color = 'blue'
  time = {
    value: 0,
  }

  radius = 50
  height = 1
  open = false
  opacity = 0.6

  position = {
    x: -200,
    y: 0,
    z: 0,
  }

  constructor({ scene }) {
    this.scene = scene

    this.createCircle()
  }

  createCircle() {
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
      vertexShader: CircleWallVertexShader,
      fragmentShader: CircleFragmentShader,
      side: DoubleSide,
      depthTest: false, // 是否不被遮挡
    })

    geometry.translate(0, this.height / 2, 0)

    const mesh = new Mesh(geometry, material)
    mesh.position.set(this.position.x, this.position.y, this.position.z)

    this.scene.add(mesh)
  }
}
