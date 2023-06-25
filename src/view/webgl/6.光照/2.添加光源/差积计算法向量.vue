<template>
  <canvas id="canvas" ref="canvasRef"> 此浏览器不支持 canvas </canvas>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getPerspective, getRotateMatrix, mixMatrix } from '@/utils/matrix.js'
import { getViewMatrix } from '@/utils/matrix.js'
import { initWebGL } from '@/utils/webgl-program.js'
import { cross } from '@/utils/helper.js'
const canvasRef = ref(null)

const VERTEX_SHADER_SOURCE = `
    attribute vec4 aPosition;
    attribute vec4 aNormal;
    varying vec4 vColor;
    uniform mat4 mat;

    void main(){
      // 顶点的世界坐标
      vec4 vertexPosition = mat * aPosition;
      // 物体表面的颜色
      vec4 aColor = vec4(1.0,0.0,0.0,1.0);

      // 定义点光源的颜色
      vec3 lightColor = vec3(1.0,1.0,1.0);
      // 定义点光源的位置
      vec3 lightPosition = vec3(-5.0,6.0,10.0);
      // 点光源的方向,并且将 顶点世界坐标的 vec4 转换为 vec3
      vec3 lightDirection = normalize(lightPosition - vec3(vertexPosition));


      // 环境光颜色
      vec3 uAmbientLightColor = vec3(0.2,0.2,0.2);
      // 环境反射
      vec3 ambient = uAmbientLightColor * vec3(aColor);


      // 计算入射角 -> 光线方向的发现向量的点积
      float dotDeg = dot(lightDirection, vec3(aNormal));
      // 漫反射光的颜色
      vec3 diffuseColor = lightColor * vec3(aColor) * dotDeg;

      gl_Position = vertexPosition;
      vColor = vec4(ambient + diffuseColor,aColor.a);
    }
  `

const FRAGMENT_SHADER_SOURCE = `
    precision lowp float;
    varying vec4 vColor;
    void main(){
      gl_FragColor = vColor;
    }
  `

onMounted(() => {
  const canvas = canvasRef.value
  canvas.width = document.body.offsetWidth
  canvas.height = document.body.offsetHeight

  const gl = canvas.getContext('webgl')
  const program = initWebGL(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE)

  const aPosition = gl.getAttribLocation(program, 'aPosition')
  const mat = gl.getUniformLocation(program, 'mat')
  const aNormal = gl.getAttribLocation(program, 'aNormal')

  // 每一组是四个面的顶点
  /* prettier-ignore */
  const points = new Float32Array([
    // 0123
    1, 1, 1,
    -1, 1, 1,
    -1,-1, 1,
    1,-1, 1,
    // 0345
    1, 1, 1,
    1,-1, 1,
    1,-1,-1,
    1, 1,-1,
    // 0156
    1, 1, 1,
    1, 1,-1,
    -1, 1,-1,
    -1, 1, 1,
    // 1267
    -1, 1, 1,
    -1, 1,-1,
    -1,-1,-1,
    -1,-1, 1,
    // 2347
    -1,-1, 1,
    1,-1, 1,
    1,-1,-1,
    -1,-1,-1,
    // 4567
    1,-1,-1,
    1, 1,-1,
    -1, 1,-1,
    -1,-1,-1,
  ])

  // 组成平面的两个三角形组成正方形的索引
  /* prettier-ignore */
  const index = new Int8Array([
    0,1,2,0,2,3,
    4,5,6,4,6,7,
    8,9,10,8,10,11,
    12,13,14,12,14,15,
    16,17,18,16,18,19,
    20,21,22,20,22,23,
  ])

  // 通过顶点来计算法向量
  const res = []
  for (let i = 0; i < points.length; i += 12) {
    const item = cross([points[i], points[i + 1], points[i + 2]], [points[i + 3], points[i + 4], points[i + 5]])
    for (let j = 0; j < 4; j++) {
      res.push(...item)
    }
  }

  // 法向量数据
  /* prettier-ignore */
  const normals = new Float32Array(res)

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW)
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(aPosition)

  // 使用索引数据需要使用 gl.ELEMENT_ARRAY_BUFFER
  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index, gl.STATIC_DRAW)

  const normalBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW)
  gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(aNormal)

  let eyeX = 3
  let eyeY = 3
  let eyeZ = 7

  let deg = 0
  const draw = () => {
    deg += 0.01
    const rotate = getRotateMatrix(deg)

    const matrix = getViewMatrix(eyeX, eyeY, eyeZ, 0, 0, 0, 0, 1, 0)
    const perspective = getPerspective(30, canvas.width / canvas.height, 100, 2)
    gl.enable(gl.DEPTH_TEST)

    gl.uniformMatrix4fv(mat, false, mixMatrix(mixMatrix(perspective, matrix), rotate))

    // 使用索引数据需要使用 drawElements 进行绘制
    gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_BYTE, 0)
  }

  draw()
})
</script>

<style lang="scss" scoped>
#canvas {
  background-color: color(srgb 1 1 1);
}
</style>
