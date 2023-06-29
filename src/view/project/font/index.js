import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import chinaFont from '@/assets/font/china-font.json?url'
import { Color, Mesh, ShaderMaterial } from 'three'

export default class Font {
  scene = null

  fontArr = [
    {
      text: '最高的楼',
      size: 20,
      height: 2,
      position: { x: -10, y: 130, z: 410 },
      rotate: Math.PI / 1.3,
      color: '#ffffff',
    },
    {
      text: '第二高',
      size: 20,
      height: 2,
      position: { x: 180, y: 110, z: -70 },
      rotate: Math.PI / 2,
      color: '#ff00ff',
    },
  ]

  constructor({ scene }) {
    this.scene = scene
    this.init()
  }

  async init() {
    const font = await this.loadFontSync(chinaFont)

    this.fontArr.forEach((ele, index) => {
      const geometry = new TextGeometry(ele.text, { font, size: ele.size, height: ele.height })
      const material = new ShaderMaterial({
        uniforms: {
          u_color: {
            value: new Color(ele.color),
          },
        },
        vertexShader: `
        void main(){
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
        fragmentShader: `
        uniform vec3 u_color;

        void main() {
          gl_FragColor = vec4(u_color,1.0);
        }
      `,
      })

      const mesh = new Mesh(geometry, material)

      mesh.position.copy(ele.position)
      mesh.rotateY(ele.rotate)

      this.scene.add(mesh)
    })
  }

  loadFontSync(url) {
    const loader = new FontLoader()

    return new Promise((res, rej) => {
      loader.load(url, (font) => {
        res(font)
      })
    })
  }
}
