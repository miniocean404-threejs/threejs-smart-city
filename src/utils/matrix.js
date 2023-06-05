// 平移矩阵
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
