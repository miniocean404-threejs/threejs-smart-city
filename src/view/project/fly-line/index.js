import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  QuadraticBezierCurve3,
  ShaderMaterial,
  Vector3,
  Points,
} from 'three'

import FlyLineVertexShader from './fly-line.vert?raw'
import FlyLineFragmentShader from './fly-line.frag?raw'

export default class FlyLine {
  scene = null

  time = {
    value: 0,
  }

  color = '#ffff00'

  source = {
    x: 300,
    y: 0,
    z: -200,
  }
  target = {
    x: -500,
    y: 0,
    z: -240,
  }
  height = 300 // 飞线中心点高度
  length = 100 // 飞线长度
  size = 6 // 飞线粗细

  constructor({ scene }) {
    this.scene = scene
    this.createFlyLine()
  }

  createFlyLine() {
    const source = new Vector3(this.source.x, this.source.y, this.source.z)
    const target = new Vector3(this.target.x, this.target.y, this.target.z)

    // 计算中心位置
    const center = target.clone().lerp(source, 0.5)
    // 设置中心位置的高度
    center.y += this.height

    // 计算起点到终点的距离
    const dis = parseInt(source.distanceTo(target))

    // 创建贝塞尔曲线运动
    const curve = new QuadraticBezierCurve3(source, center, target)

    const positions = []
    const aPositions = []

    // 获取起点到终点的粒子
    const points = curve.getPoints(dis)

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
        u_total: { value: dis },
        u_time: this.time,
      },
      transparent: true,
      vertexShader: FlyLineVertexShader,
      fragmentShader: FlyLineFragmentShader,
    })

    const mesh = new Points(geometry, material)

    this.scene.add(mesh)
  }
}
