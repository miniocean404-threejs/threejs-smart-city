import { Color, ConeGeometry, DoubleSide, Mesh, ShaderMaterial, MeshBasicMaterial } from 'three'

import ConeVertexShader from './cone.vert?raw'
import ConeFragmentShader from './cone.frag?raw'

export default class Cone {
  scene = null

  isTop = false

  color = '#a1ef06'
  height = {
    value: 5,
  }
  top = {
    value: 0.8,
  }

  position = {
    x: -100,
    y: 50,
    z: 0,
  }

  constructor({ scene }) {
    this.scene = scene

    this.createCone()
  }

  createCone() {
    const geometry = new ConeGeometry(5, 20, 4)

    const material = new ShaderMaterial({
      uniforms: {
        u_color: {
          value: new Color(this.color),
        },
        u_height: this.height,
        u_top: this.top,
      },
      transparent: true,
      vertexShader: ConeVertexShader,
      fragmentShader: ConeFragmentShader,
      side: DoubleSide,
      depthTest: false, // 是否不被遮挡
    })

    const mesh = new Mesh(geometry, material)
    mesh.position.set(this.position.x, this.position.y, this.position.z)
    mesh.rotateZ(Math.PI)

    this.scene.add(mesh)
  }
}
