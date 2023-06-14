import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import * as THREE from 'three'
import * as SceneUtils from 'three/addons/utils/SceneUtils.js'

const changePropGroup = {
  color: {
    method: 'addColor',
    getValue: (item) => item.color.getStyle(),
    setValue: (item, value) => item.color.setStyle(value),
  },
  groundColor: {
    method: 'addColor',
    extends: [0, Math.PI / 2],
    getValue: (item) => item.groundColor.getStyle(),
    setValue: (item, value) => item.groundColor.setStyle(value),
  },
  // 材料本身发出的颜色
  emissive: {
    method: 'addColor',
    getValue: (item) => item.emissive.getHex(),
    setValue: (item, value) => (item.emissive = new THREE.Color(value)),
  },
  // 镜面
  specular: {
    method: 'addColor',
    getValue: (item) => item.specular.getHex(),
    setValue: (item, value) => (item.specular = new THREE.Color(value)),
  },
  cameraNear: {
    extends: [0, 50],
    getValue: (item, camera) => camera.near,
    setValue: (item, value, camera) => {
      camera.near = value
      camera.updateProjectionMatrix()
    },
  },
  cameraFar: {
    extends: [50, 1000],
    getValue: (item, camera) => camera.far,
    setValue: (item, value, camera) => {
      camera.far = value
      camera.updateProjectionMatrix()
    },
  },
  // 光照强度
  intensity: {
    extends: [0, 10],
    getValue: (item) => item.intensity,
    setValue: (item, value) => (item.intensity = +value),
  },
  // 光源到光源结束的距离，不会随着距离衰减 默认 0
  distance: {
    extends: [0, 2],
    getValue: (item) => item.distance,
    setValue: (item, value) => (item.distance = +value),
  },
  // 光线散射角度 默认 Math.PI/3
  angle: {
    extends: [0, Math.PI / 2],
    getValue: (item) => item.angle,
    setValue: (item, value) => (item.angle = +value),
  },
  // 光照模糊度，用于照射到平面（地面）时使用，测试时可将 plane 的材质改为 MeshBasicMaterial
  penumbra: {
    extends: [0, Math.PI / 2],
    getValue: (item) => item.penumbra,
    setValue: (item, value) => (item.penumbra = +value),
  },
  // 衰变
  decay: {
    extends: [0, Math.PI / 2],
    getValue: (item) => item.decay,
    setValue: (item, value) => (item.decay = +value),
  },
  opacity: {
    extends: [0, 1],
    getValue: (item) => item.opacity,
    setValue: (item, value) => (item.opacity = +value),
  },
  transparent: {
    extends: [0, 1],
    getValue: (item) => item.transparent,
    setValue: (item, value) => (item.transparent = value),
  },
  wireframe: {
    extends: [0, 1],
    getValue: (item) => item.wireframe,
    setValue: (item, value) => (item.wireframe = value),
  },
  visible: {
    extends: [0, 1],
    getValue: (item) => item.visible,
    setValue: (item, value) => (item.visible = value),
  },
  shininess: {
    extends: [0, 100],
    getValue: (item) => item.shininess,
    setValue: (item, value) => (item.shininess = value),
  },
  alpha: {
    extends: [0, 1],
    getValue: (item) => item.uniforms.customAlpha.value,
    setValue: (item, value) => (item.uniforms.customAlpha.value = value),
  },
  dashSize: {
    extends: [0, 5],
    getValue: (item) => item.dashSize,
    setValue: (item, value, camera) => (item.dashSize = +value),
  },
  gapSize: {
    extends: [0, 5],
    getValue: (item) => item.gapSize,
    setValue: (item, value, camera) => (item.gapSize = +value),
  },
  side: {
    extends: [['front', 'back', 'double']],
    getValue: (item) => 'front',
    setValue: (item, value) => {
      switch (value) {
        case 'front':
          item.side = THREE.FrontSide
          break
        case 'back':
          item.side = THREE.BackSide
          break
        case 'double':
          item.side = THREE.DoubleSide
          break
      }
    },
  },
  width: {
    extends: [0, 20],
    getValue: (item, camera, mesh) => mesh.children[0].geometry.parameters.width,
    setValue: (item, value, camera, mesh, scene, controls) => removeAndAdd(item, value, camera, mesh, scene, controls),
  },
  height: {
    extends: [0, 20],
    getValue: (item, camera, mesh) => mesh.children[0].geometry.parameters.height,
    setValue: (item, value, camera, mesh, scene, controls) => removeAndAdd(item, value, camera, mesh, scene, controls),
  },
  widthSegments: {
    extends: [0, 20],
    getValue: (item, camera, mesh) => mesh.children[0].geometry.parameters.widthSegments,
    setValue: (item, value, camera, mesh, scene, controls) => removeAndAdd(item, value, camera, mesh, scene, controls),
  },
  heightSegments: {
    extends: [0, 20],
    getValue: (item, camera, mesh) => mesh.children[0].geometry.parameters.heightSegments,
    setValue: (item, value, camera, mesh, scene, controls) => removeAndAdd(item, value, camera, mesh, scene, controls),
  },
}

const lightType = {
  SpotLight: ['color', 'intensity', 'distance', 'angle', 'penumbra', 'decay'], // 聚光灯
  AmbientLight: ['color', 'intensity'], // 环境光
  PointLight: ['color', 'intensity', 'distance', 'decay'], // 点光源
  DirectionalLight: ['color', 'intensity'], // 平行光
  HemisphereLight: ['color', 'groundColor'], // 半球光，它没有 skyColor 方法

  MeshBasicMaterial: ['color', 'opacity', 'transparent', 'wireframe', 'visible'], // 基础材质
  MeshDepthMaterial: ['wireframe', 'cameraNear', 'cameraFar'], // 深度材质
  MeshLambertMaterial: ['opacity', 'transparent', 'wireframe', 'visible', 'side', 'emissive', 'color'], // 郎伯材质
  MeshPhongMaterial: [
    'opacity',
    'transparent',
    'wireframe',
    'visible',
    'side',
    'emissive',
    'color',
    'specular',
    'shininess',
  ], // Phong 材质
  ShaderMaterial: ['alpha'], // 着色器材质
  LineBasicMaterial: ['color'], // 实线
  LineDashedMaterial: ['dashSize', 'gapSize'], // 虚线
  PlaneGeometry: ['width', 'height', 'widthSegments', 'heightSegments'], // 二维平面
}

export const initControls = (element, camera, mesh, scene) => {
  const guiDom = document.querySelector('.lil-gui')
  if (guiDom) return

  const gui = new GUI()
  const types = lightType[element.type]
  const controls = {}

  if (!types?.length) return
  types.map((needPropName) => {
    const changeProp = changePropGroup[needPropName]
    if (changeProp) {
      // 获取默认属性
      controls[needPropName] = changeProp.getValue(element, camera, mesh.pointer, scene)
      const extendsProp = changeProp.extends || []

      gui[changeProp.method || 'add'](controls, needPropName, ...extendsProp).onChange((v) => {
        changeProp.setValue(element, v, camera, mesh, scene, controls)
      })
    }
  })

  // gui.addColor(controls, 'color').onChange((v) => {
  //   controls.color = v
  //   element.color.set(v)
  // })

  // const key = ''
  // gui.add(controls, key, '其他参数').onChange(() => {})
}

const removeAndAdd = (item, value, camera, mesh, scene, controls) => {
  const { x, y, z } = mesh.pointer.rotation
  scene.remove(mesh.pointer)

  const lambert = new THREE.MeshLambertMaterial({ color: 0xff0000 })
  const basic = new THREE.MeshBasicMaterial({ wireframe: true })

  const arg = []
  for (const [_, value] of Object.entries(controls)) {
    arg.push(value)
  }

  mesh.pointer = new SceneUtils.createMultiMaterialObject(new THREE[item.type](...arg), [lambert, basic])
  // 获取原来元素的现存旋转角度
  mesh.pointer.rotation.set(x, y, z)
  scene.add(mesh.pointer)
}
