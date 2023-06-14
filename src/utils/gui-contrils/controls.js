import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { lightType } from '@/utils/gui-contrils/type.js'
import { changePropGroup } from '@/utils/gui-contrils/method.js'

export const initControls = (element, camera, mesh, scene, font) => {
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
      controls[needPropName] = changeProp.getValue(element, camera, mesh.pointer, scene, needPropName)

      const extendsProp = changeProp.extends || []

      gui[changeProp.method || 'add'](controls, needPropName, ...extendsProp).onChange((v) => {
        changeProp.setValue(element, v, camera, mesh, scene, controls, font)
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
