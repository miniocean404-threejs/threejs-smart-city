import { Color, DoubleSide, PlaneGeometry, ShaderMaterial, Mesh } from 'three'

import RadarVertexShader from './radar.vert?raw'
import RadarFragmentShader from './radar.frag?raw'

export default class Radar {
  scene = null

  color = '#ff8800'
  radius = 50
  time = {
    value: 0,
  }

  constructor({ scene }) {
    this.scene = scene
    this.init()
  }

  init() {
    const geometry = new PlaneGeometry(this.radius * 2, this.radius * 2, 1, 1)
    const material = new ShaderMaterial({
      uniforms: {
        u_color: {
          value: new Color(this.color),
        },
        u_radius: {
          value: this.radius,
        },
        u_time: this.time,
      },
      transparent: true,
      side: DoubleSide,
      vertexShader: RadarVertexShader,
      fragmentShader: RadarFragmentShader,
    })

    const mesh = new Mesh(geometry, material)
    mesh.position.set(300, 50, 0)
    mesh.rotateX(Math.PI / 2)

    this.scene.add(mesh)
  }
}
