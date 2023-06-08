// 平移矩阵，矩阵与数学中的矩阵 对角线 相反
export const getTranslateMatrix = (x = 0, y = 0, z = 0) => {
  /* prettier-ignore */
  return new Float32Array([
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    x,   y,   z,   1
  ])
}

// 缩放矩阵
export const getScaleMatrix = (x = 1, y = 1, z = 1) => {
  /* prettier-ignore */
  return new Float32Array([
    x, 0.0, 0.0, 0.0,
    0.0, y, 0.0, 0.0,
    0.0, 0.0, z, 0.0,
    0.0, 0.0, 0.0, 1
  ])
}

// 旋转矩阵
export const getRotateMatrix = (deg = 0) => {
  /* prettier-ignore */
  return new Float32Array([
     Math.cos(deg), Math.sin(deg), 0.0, 0.0,
    -Math.sin(deg), Math.cos(deg), 0.0, 0.0,
    0.0,            0.0,           1.0, 0.0,
    0.0,            0.0,           0.0, 1,
  ])
}

// 矩阵复合函数 矩阵相乘
export const mixMatrix = (A, B) => {
  const arr = new Float32Array(16)

  for (let i = 0; i < 4; i++) {
    /* prettier-ignore */
    arr[i]      = A[i] * B[0]   +  A[i + 4] * B[1]  +   A[i + 8] * B[2]  +   A[i + 12] * B[3]
    /* prettier-ignore */
    arr[i + 4]  = A[i] * B[4]   +  A[i + 4] * B[5]  +   A[i + 8] * B[6]  +   A[i + 12] * B[7]
    /* prettier-ignore */
    arr[i + 8]  = A[i] * B[8]   +  A[i + 4] * B[9]  +   A[i + 8] * B[10] +   A[i + 12] * B[11]
    /* prettier-ignore */
    arr[i + 12] = A[i] * B[12]  +  A[i + 4] * B[13] +   A[i + 8] * B[14] +   A[i + 12] * B[15]
  }

  return arr
}

// 正射投影矩阵：将一个指定尺寸的盒子, 映射压缩成 [-1, 1] 范围的盒子，使其中的像素点全部可以绘制出来，之外的像素点则被抛弃
// 下方并且已经经过移动矩阵转化了
// left, right, top, bottom, near, far 为源物体大小
export const getOrthographic = (left, right, top, bottom, near, far) => {
  const width = right - left
  const height = top - bottom
  const depth = far - near

  /* prettier-ignore */
  return new Float32Array([
    2 / width,           0,                    0,                 0,
    0,                   2/height,             0,                 0,
    0,                   0,                    -2/depth,          0,
    -(right+left)/width, -(top+bottom)/height, -(far+near)/depth, 1
  ])
}

// 获取透视投影矩阵,已经经过了正射投影后的矩阵
export function getPerspective(fov, aspect, far, near) {
  fov = (fov * Math.PI) / 180
  /* prettier-ignore */
  return new Float32Array([
    1/(aspect*Math.tan(fov / 2)),     0,                          0,                        0,
    0,                                   1/(Math.tan(fov/2)),     0,                        0,
    0,                                   0,                          -(far+near)/(far-near),   -(2*far*near)/(far-near),
    0,                                   0,                          -1,                       0,
  ])
}
