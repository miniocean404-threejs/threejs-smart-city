import { Raycaster, Vector3 } from 'three'

export const getClickPosition = ({ camera, scene, e }) => {
  let point3D = null

  // 获取浏览器 归一化 二维平面坐标
  const x = (e.clientX / window.innerWidth) * 2 - 1
  const y = (e.clientY / window.innerHeight) * 2 - 1

  // 获取点击三维坐标
  const standVector = new Vector3(x, y, 0.5)

  // 转化为世界坐标 (二维平面位置百分比，在相机中实际的坐标位置)
  const wordVector = standVector.unproject(camera)

  // sub：wordVector 减去某个向量
  // normalize：将向量归一化为 1
  const ray = wordVector.sub(camera.position).normalize()

  // 实现点击选中
  // 创建射线发射器，用来发射一条射线
  const rayCaster = new Raycaster(camera.position, ray)

  // 返回射线碰撞到的物体
  const intersects = rayCaster.intersectObjects(scene.children, true)

  if (intersects.length) {
    point3D = intersects[0]
  }

  return point3D
}

// 跟随鼠标位置缩放
export const getMouseFollowScale = ({ camera, controls, e }) => {
  // 跟随鼠标位置缩放 需要禁用原来的缩放功能
  controls.enableZoom = false

  // 缩放系数
  const scaleFactor = 30

  // 获取浏览器 归一化 二维平面坐标
  const x = (e.clientX / window.innerWidth) * 2 - 1
  const y = (e.clientY / window.innerHeight) * 2 - 1

  // 获取滑轮三维坐标
  const standVector = new Vector3(x, y, 0.5)

  // 转化为世界坐标 (二维平面位置百分比，在相机中实际的坐标位置)
  const wordVector = standVector.unproject(camera)

  // sub：wordVector 减去某个向量
  // normalize：将向量归一化为 1
  const ray = wordVector.sub(camera.position).normalize()

  // wheel 事件： e.wheelDelta > 0 向前滚动 e.wheelDelta < 0 向后滚动
  if (e.wheelDelta > 0) {
    camera.position.x += standVector.x * scaleFactor
    camera.position.y += standVector.y * scaleFactor
    camera.position.z += standVector.z * scaleFactor

    controls.target.x += standVector.x * scaleFactor
    controls.target.y += standVector.y * scaleFactor
    controls.target.z += standVector.z * scaleFactor
  } else {
    camera.position.x -= standVector.x * scaleFactor
    camera.position.y -= standVector.y * scaleFactor
    camera.position.z -= standVector.z * scaleFactor

    controls.target.x -= standVector.x * scaleFactor
    controls.target.y -= standVector.y * scaleFactor
    controls.target.z -= standVector.z * scaleFactor
  }

  // controls.enableZoom = true
}
