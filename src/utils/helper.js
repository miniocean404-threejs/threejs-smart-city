// 将数组的范围归为 [-1,1] 之间
export function normalize(arr) {
  let num = 0

  for (let i = 0; i < arr.length; i++) {
    num += arr[i] * arr[i]
  }

  const middle = Math.sqrt(num)

  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i] / middle
  }

  return arr
}

// 叉积函数 获取法向量：
// 解释：https://blog.csdn.net/weixin_41479678/article/details/116699323
// 叉积在二维向量里，两个向量的叉积相当于两个向量围成的面积
// 三维中的叉积一般用来确定两个给定向量组成的二维平面的法向量，法向量的长度是给定向量围城的面积的大小
export function cross(a, b) {
  /* prettier-ignore */
  return new Float32Array([
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ])
}

// 点积函数 获取投影长度
export function dot(a, b) {
  /* prettier-ignore */
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

// 向量差
function minus(a, b) {
  /* prettier-ignore */
  return new Float32Array([
    a[0] - b[0],
    a[1] - b[1],
    a[2] - b[2],
  ])
}

// 平面转换：物体在原平面的点转化为 将物理进行 3D 位置旋转移动等操作后的位置 的新的坐标系的转换的函数
// 视图矩阵获取,
export function getViewMatrix(eyeX, eyeY, eyeZ, lookAtx, lookAty, lookAtz, upx, upy, upz) {
  // 视点
  const eye = new Float32Array([eyeX, eyeY, eyeZ])
  // 目标点
  const lookAt = new Float32Array([lookAtx, lookAty, lookAtz])
  // 上方向
  const up = new Float32Array([upx, upy, upz])

  normalize(up)

  // 确定z轴
  const z = normalize(minus(eye, lookAt))
  // 确定x轴
  const x = normalize(cross(z, up))
  // 确定y轴
  const y = cross(x, z)

  /* prettier-ignore */
  return new Float32Array([
    x[0],        y[0],        z[0],        0,
    x[1],        y[1],        z[1],        0,
    x[2],        y[2],        z[2],        0,
    -dot(x,eye), -dot(y,eye), -dot(z,eye), 1
  ])
}
