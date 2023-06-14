import * as THREE from 'three'
import * as SceneUtils from 'three/addons/utils/SceneUtils.js'
import { indices, textOptions, vertices } from '@/utils/gui-contrils/constant.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'

export const changePropGroup = {
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
  radius: {
    extends: [1, 20],
    getValue: (item, camera, mesh) => mesh.children[0].geometry.parameters.radius,
    setValue: (item, value, camera, mesh, scene, controls) => removeAndAdd(item, value, camera, mesh, scene, controls),
  },
  segments: {
    extends: [3, 80],
    getValue: (item, camera, mesh) => mesh.children[0].geometry.parameters.segments,
    setValue: (item, value, camera, mesh, scene, controls) => removeAndAdd(item, value, camera, mesh, scene, controls),
  },
  thetaStart: {
    extends: [0, Math.PI * 2],
    getValue: (item, camera, mesh) => mesh.children[0].geometry.parameters.thetaStart,
    setValue: (item, value, camera, mesh, scene, controls) => removeAndAdd(item, value, camera, mesh, scene, controls),
  },
  thetaLength: {
    extends: [0, Math.PI * 2],
    getValue: (item, camera, mesh) => mesh.children[0].geometry.parameters.thetaLength,
    setValue: (item, value, camera, mesh, scene, controls) => removeAndAdd(item, value, camera, mesh, scene, controls),
  },
  depth: {
    extends: [0, 20],
    getValue: (item, camera, mesh) => mesh.children[0].geometry.parameters.depth,
    setValue: (item, value, camera, mesh, scene, controls) => removeAndAdd(item, value, camera, mesh, scene, controls),
  },
  depthSegments: {
    extends: [0, 20],
    getValue: (item, camera, mesh) => mesh.children[0].geometry.parameters.depthSegments,
    setValue: (item, value, camera, mesh, scene, controls) => removeAndAdd(item, value, camera, mesh, scene, controls),
  },
  phiStart: {
    extends: [0, Math.PI * 2],
    getValue: (item, camera, mesh) => mesh.children[0].geometry.parameters.phiStart,
    setValue: (item, value, camera, mesh, scene, controls) => removeAndAdd(item, value, camera, mesh, scene, controls),
  },
  phiLength: {
    extends: [0, Math.PI * 2],
    getValue: (item, camera, mesh) => mesh.children[0].geometry.parameters.phiLength,
    setValue: (item, value, camera, mesh, scene, controls) => removeAndAdd(item, value, camera, mesh, scene, controls),
  },
  radiusTop: {
    extends: [-20, 20],
    getValue: (item, camera, mesh) => mesh.children[0].geometry.parameters.radiusTop,
    setValue: (item, value, camera, mesh, scene, controls) => removeAndAdd(item, value, camera, mesh, scene, controls),
  },
  radiusBottom: {
    extends: [-20, 20],
    getValue: (item, camera, mesh) => mesh.children[0].geometry.parameters.radiusBottom,
    setValue: (item, value, camera, mesh, scene, controls) => removeAndAdd(item, value, camera, mesh, scene, controls),
  },
  radialSegments: {
    extends: [1, 60],
    getValue: (item, camera, mesh) => mesh.children[0].geometry.parameters.radialSegments,
    setValue: (item, value, camera, mesh, scene, controls) => removeAndAdd(item, value, camera, mesh, scene, controls),
  },
  openEnded: {
    extends: [], // bool 所以用空数组
    getValue: (item, camera, mesh) => mesh.children[0].geometry.parameters.openEnded,
    setValue: (item, value, camera, mesh, scene, controls) => removeAndAdd(item, value, camera, mesh, scene, controls),
  },
  tube: {
    extends: [1, 6],
    getValue: (item, camera, mesh) => mesh.children[0].geometry.parameters.tube,
    setValue: (item, value, camera, mesh, scene, controls) => removeAndAdd(item, value, camera, mesh, scene, controls),
  },
  tubularSegments: {
    extends: [1, 20],
    getValue: (item, camera, mesh) => mesh.children[0].geometry.parameters.tubularSegments,
    setValue: (item, value, camera, mesh, scene, controls) => removeAndAdd(item, value, camera, mesh, scene, controls),
  },
  arc: {
    extends: [0, Math.PI * 2],
    getValue: (item, camera, mesh) => mesh.children[0].geometry.parameters.arc,
    setValue: (item, value, camera, mesh, scene, controls) => removeAndAdd(item, value, camera, mesh, scene, controls),
  },
  p: {
    extends: [1, 10],
    getValue: (item, camera, mesh) => mesh.children[0].geometry.parameters.p,
    setValue: (item, value, camera, mesh, scene, controls) => removeAndAdd(item, value, camera, mesh, scene, controls),
  },
  q: {
    extends: [1, 10],
    getValue: (item, camera, mesh) => mesh.children[0].geometry.parameters.q,
    setValue: (item, value, camera, mesh, scene, controls) => removeAndAdd(item, value, camera, mesh, scene, controls),
  },
  detail: {
    extends: [0, 20],
    getValue: (item, camera, mesh, scene, name) => {
      if (item.type === 'TextGeometry') {
        return textOptions[name]
      }
    },
    setValue: (item, value, camera, mesh, scene, controls) => removeAndAdd(item, value, camera, mesh, scene, controls),
  },
  size: {
    extends: [0, 10],
    getValue: (item, camera, mesh, scene, name) => {
      if (item.type === 'TextGeometry') {
        return textOptions[name]
      }
    },
    setValue: (item, value, camera, mesh, scene, controls, font) =>
      removeAndAdd(item, value, camera, mesh, scene, controls, font),
  },
  weight: {
    extends: [0, 30],
    getValue: (item, camera, mesh, scene, name) => {
      if (item.type === 'TextGeometry') {
        return textOptions[name]
      }
    },
    setValue: (item, value, camera, mesh, scene, controls, font) =>
      removeAndAdd(item, value, camera, mesh, scene, controls, font),
  },
  bevelThickness: {
    extends: [1, 30],
    getValue: (item, camera, mesh, scene, name) => {
      if (item.type === 'TextGeometry') {
        return textOptions[name]
      }
    },
    setValue: (item, value, camera, mesh, scene, controls, font) =>
      removeAndAdd(item, value, camera, mesh, scene, controls, font),
  },
  bevelSize: {
    extends: [1, 30],
    getValue: (item, camera, mesh, scene, name) => {
      if (item.type === 'TextGeometry') {
        return textOptions[name]
      }
    },
    setValue: (item, value, camera, mesh, scene, controls, font) =>
      removeAndAdd(item, value, camera, mesh, scene, controls, font),
  },
  bevelEnabled: {
    extends: [],
    getValue: (item, camera, mesh, scene, name) => {
      if (item.type === 'TextGeometry') {
        return textOptions[name]
      }
    },
    setValue: (item, value, camera, mesh, scene, controls, font) =>
      removeAndAdd(item, value, camera, mesh, scene, controls, font),
  },
  bevelSegments: {
    extends: [1, 30],
    getValue: (item, camera, mesh, scene, name) => {
      if (item.type === 'TextGeometry') {
        return textOptions[name]
      }
    },
    setValue: (item, value, camera, mesh, scene, controls, font) =>
      removeAndAdd(item, value, camera, mesh, scene, controls, font),
  },
  curveSegments: {
    extends: [1, 10],
    getValue: (item, camera, mesh, scene, name) => {
      if (item.type === 'TextGeometry') {
        return textOptions[name]
      }
    },
    setValue: (item, value, camera, mesh, scene, controls, font) =>
      removeAndAdd(item, value, camera, mesh, scene, controls, font),
  },
  steps: {
    extends: [1, 10],
    getValue: (item, camera, mesh, scene, name) => {
      if (item.type === 'TextGeometry') {
        return textOptions[name]
      }
    },
    setValue: (item, value, camera, mesh, scene, controls, font) =>
      removeAndAdd(item, value, camera, mesh, scene, controls, font),
  },
}

let a = 6

const removeAndAdd = (item, value, camera, mesh, scene, controls, font) => {
  const { x, y, z } = mesh.pointer.rotation
  scene.remove(mesh.pointer)

  const lambert = new THREE.MeshLambertMaterial({ color: 0xff0000 })
  const basic = new THREE.MeshBasicMaterial({ wireframe: true })

  const arg = []
  for (const [_, value] of Object.entries(controls)) {
    arg.push(value)
  }

  if (item.type === 'PolyhedronGeometry') {
    arg.unshift(vertices, indices)
  }

  if (
    item.type === 'PolyhedronGeometry' ||
    item.type === 'TetrahedronGeometry' ||
    item.type === 'OctahedronGeometry' ||
    item.type === 'IcosahedronGeometry'
  ) {
    arg[arg.length - 1] = Math.round(arg[arg.length - 1])
  }

  let ele

  if (item.type === 'TextGeometry') {
    ele = new TextGeometry(
      'three',
      Object.assign(textOptions, controls, {
        font,
        bevelSegments: Math.round(controls.bevelSegments),
        curveSegments: Math.round(controls.curveSegments),
        steps: Math.round(controls.steps),
      }),
    )
  } else {
    ele = new THREE[item.type](...arg)
  }

  mesh.pointer = new SceneUtils.createMultiMaterialObject(ele, [lambert, basic])
  // 获取原来元素的现存旋转角度
  mesh.pointer.rotation.set(x, y, z)
  scene.add(mesh.pointer)
}
