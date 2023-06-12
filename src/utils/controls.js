import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

const changePropGroup = {
  color: {
    method: 'addColor',
    getValue: (item) => item.color.getStyle(),
    setValue: (item, value) => item.color.setStyle(value),
  },
  intensity: {
    extends: [0, 10],
    getValue: (item) => item.intensity,
    setValue: (item, value) => (item.intensity = +value),
  },
  distance: {
    extends: [0, 2],
    getValue: (item) => item.distance,
    setValue: (item, value) => (item.distance = +value),
  },
  angle: {
    extends: [0, Math.PI / 2],
    getValue: (item) => item.angle,
    setValue: (item, value) => (item.angle = +value),
  },
  penumbra: {
    extends: [0, Math.PI / 2],
    getValue: (item) => item.penumbra,
    setValue: (item, value) => (item.penumbra = +value),
  },
  decay: {
    extends: [0, Math.PI / 2],
    getValue: (item) => item.decay,
    setValue: (item, value) => (item.decay = +value),
  },
}

const lightType = {
  SpotLight: ['color', 'intensity', 'distance', 'angle', 'penumbra', 'decay'],
}

export const initControls = (light) => {
  const gui = new GUI()
  const types = lightType[light.type]
  const controls = {
    color: 0xffffff, // 光照颜色
    intensity: 1, // 光照强度
    distance: 0, // 光源到光源结束的距离，不会随着距离衰减 默认 0
    angle: Math.PI / 3, // 光线散射角度 默认 Math.PI/3
    penumbra: 0, // 光照模糊度，用于照射到平面（地面）时使用，测试时可将 plane 的材质改为 MeshBasicMaterial
    decay: 2, // 衰变
  }

  if (!types.length) return
  types.map((needPropName) => {
    const changeProp = changePropGroup[needPropName]
    if (changeProp) {
      // 获取默认属性
      controls[needPropName] = changeProp.getValue(light)
      const extendsProp = changeProp.extends || []

      gui[changeProp.method || 'add'](controls, needPropName, ...extendsProp).onChange((v) => {
        changeProp.setValue(light, v)
      })
    }
  })

  // gui.addColor(controls, 'color').onChange((v) => {
  //   controls.color = v
  //   light.color.set(v)
  // })

  // const key = ''
  // gui.add(controls, key, '其他参数').onChange(() => {})
}
