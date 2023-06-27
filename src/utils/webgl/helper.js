// 转置矩阵，行列主序交换
export function transpose(matrix) {
  const n = matrix.length
  const m = matrix[0].length
  const result = []

  for (let j = 0; j < m; j++) {
    result[j] = []
    for (let i = 0; i < n; i++) {
      result[j][i] = matrix[i][j]
    }
  }

  return result
}

// 将数组的范围一个范围之间
export function normalize1(arr) {
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

// 真正在 [-1,1] 之间的归一化函数
export function normalize(target, min = -1, max = 1) {
  let arrMax = Math.max(...target)
  let arrMin = Math.min(...target)
  arrMax = arrMax > Math.abs(arrMin) ? arrMax : Math.abs(arrMin)
  arrMin = -arrMax

  return target.map((t) => {
    return ((max - min) * (t - arrMin)) / (arrMax - arrMin) + min
  })
}

// 叉积函数 获取法向量：
// 哔哩哔哩 线性代数： https://b23.tv/44HJiYQ
// 条件 向量 v(v1,v2,v3) 向量 w(w1,w2,w3) ijk 为基础向量长度为 1
// p1 = (v2w3-v3w2) p2 = (v3w1-v1w3) p3 = (v1w2-v2w1), 2D 也是上述公式，但是 z 为0 所以简化为 v1 * w2 - v2 * w1，也就是其平面面积
// 3D中：公式 法向量 = i * p1 + j * p2 + k * p3 就是法向量经过矩阵变换后的位置，[ijk]经过 [p1,p,p3] 矩阵变换后的向量，
//      也是 P 与 ijk 的向量点积,也就是向量 ijk 到 p 的投影的长度，那么向量 vw 组成的平面乘以这个长度就是 3维 向量的几何意义
// 经过右手定则确定位置：食指指向 v，中指指向 w，大拇指就是叉积方向
export function cross(a, b) {
  /* prettier-ignore */
  return new Float32Array([
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ])
}

// 点积函数(就是两个向量相乘) 获取投影长度
export function dot(a, b) {
  /* prettier-ignore */
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

// 向量差
export function minus(a, b) {
  /* prettier-ignore */
  return new Float32Array([
    a[0] - b[0],
    a[1] - b[1],
    a[2] - b[2],
  ])
}
