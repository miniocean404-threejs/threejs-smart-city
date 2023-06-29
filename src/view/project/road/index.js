import { BufferGeometry, Color, Float32BufferAttribute, ShaderMaterial, Vector3, Points, CatmullRomCurve3 } from 'three'

import RoadVertexShader from './road.vert?raw'
import RoadFragmentShader from './road.frag?raw'

export default class Road {
  scene = null

  pointNum = 400
  time = {
    value: 0,
  }

  color = '#ffff00'

  height = 300 // 飞线中心点高度
  length = 300 // 飞线长度
  size = 6 // 飞线粗细

  constructor({ scene }) {
    this.scene = scene
    this.createRoad()
  }

  createRoad() {
    // 创建贝塞尔曲线运动
    const curve = new CatmullRomCurve3([
      new Vector3(-320, 0, 160),
      new Vector3(-150, 0, -40),
      new Vector3(-10, 0, -35),
      new Vector3(40, 0, 40),
      new Vector3(30, -100, 150),
      new Vector3(-100, 300, 310),
    ])

    const positions = []
    const aPositions = []

    // 获取路径运动 起点到终点 所需要的粒子数
    const points = curve.getPoints(this.pointNum)

    points.forEach((ele, index) => {
      positions.push(ele.x, ele.y, ele.z)
      aPositions.push(index)
    })

    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    geometry.setAttribute('a_position', new Float32BufferAttribute(aPositions, 1))

    const material = new ShaderMaterial({
      uniforms: {
        u_color: {
          value: new Color(this.color),
        },
        u_length: {
          value: this.length,
        },
        u_size: {
          value: this.size,
        },
        u_total: { value: this.pointNum },
        u_time: this.time,
      },
      transparent: true,
      vertexShader: RoadVertexShader,
      fragmentShader: RoadFragmentShader,
    })

    const mesh = new Points(geometry, material)
    mesh.position.copy({ x: mesh.position.x, y: 200, z: mesh.position.z })

    this.scene.add(mesh)
  }
}
