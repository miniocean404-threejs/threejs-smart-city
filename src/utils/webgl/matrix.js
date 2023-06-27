// 平移矩阵，矩阵与数学中的矩阵 对角线 相反
import { cross, dot, minus, normalize } from '@/utils/webgl/helper.js'

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

// 平面转换：物体在原平面的点转化为 将物理进行 3D 位置旋转移动等操作后的位置 的新的坐标系的转换的函数
// 视图矩阵：对于相机进行逆变换
// 设置相机位置的基向量
export function getViewMatrix(eyeX, eyeY, eyeZ, lookAtx, lookAty, lookAtz, upx, upy, upz) {
  // 视点
  const eye = new Float32Array([eyeX, eyeY, eyeZ])
  // 目标点
  const lookAt = new Float32Array([lookAtx, lookAty, lookAtz])
  // 上方向
  const up = new Float32Array([upx, upy, upz])

  normalize(up)

  // 确定 x y z 轴 组成的平面位置,z 轴为视线的方向
  const z = normalize(minus(eye, lookAt))
  const x = normalize(cross(z, up))
  const y = cross(x, z)

  /* prettier-ignore */
  return new Float32Array([
    x[0],        y[0],        z[0],        0,
    x[1],        y[1],        z[1],        0,
    x[2],        y[2],        z[2],        0,
    -dot(x,eye), -dot(y,eye), -dot(z,eye), 1
  ])
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
