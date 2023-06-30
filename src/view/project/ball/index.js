import { Color, DoubleSide, Mesh, ShaderMaterial, SphereGeometry } from 'three'

import BallVertexShader from './ball.vert?raw'
import BallFragmentShader from './ball.frag?raw'

export default class Ball {
  scene = null

  color = '#fab73f'
  time = {
    value: 0,
  }

  radius = 50
  segments = 32
  height = 50
  open = true
  opacity = 0.6

  position = {
    x: 100,
    y: 0,
    z: 0,
  }

  constructor({ scene }) {
    this.scene = scene

    this.createBall()
  }

  createBall() {
    const geometry = new SphereGeometry(
      this.radius,
      this.segments,
      this.segments,
      Math.PI / 2,
      Math.PI * 2,
      0,
      Math.PI / 2,
    )

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
      vertexShader: BallVertexShader,
      fragmentShader: BallFragmentShader,
      side: DoubleSide,
      depthTest: false, // 是否不被遮挡
    })

    geometry.translate(0, this.height / 2, 0)

    const mesh = new Mesh(geometry, material)
    mesh.position.set(this.position.x, this.position.y, this.position.z)

    this.scene.add(mesh)
  }
}
