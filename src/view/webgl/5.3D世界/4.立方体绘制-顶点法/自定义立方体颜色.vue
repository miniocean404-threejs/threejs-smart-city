<template>
  <canvas id="canvas" ref="canvasRef"> 此浏览器不支持 canvas </canvas>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getPerspective, getRotateMatrix, mixMatrix } from '@/utils/matrix.js'
import { getViewMatrix } from '@/utils/matrix.js'
import { initWebGL } from '@/utils/webgl-program.js'
const canvasRef = ref(null)

const VERTEX_SHADER_SOURCE = `
    attribute vec4 aPosition;
    attribute vec4 aColor;
    varying vec4 vColor;

    uniform mat4 mat;

    void main(){
      gl_Position = mat * aPosition;
      vColor = aColor;
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
  const aColor = gl.getAttribLocation(program, 'aColor')

  // 范围在 [-1,1] 的六面体顶点
  const v0 = [1, 1, 1]
  const v1 = [-1, 1, 1]
  const v2 = [-1, -1, 1]
  const v3 = [1, -1, 1]
  const v4 = [1, -1, -1]
  const v5 = [1, 1, -1]
  const v6 = [-1, 1, -1]
  const v7 = [-1, -1, -1]
  /* prettier-ignore */
  const points = new Float32Array([
    ...v0,...v1,...v2, ...v0,...v2, ...v3, // 前
    ...v0,...v3,...v4, ...v0,...v4, ...v5, // 右
    ...v0,...v5,...v6, ...v0,...v6, ...v1, // 上面
    ...v1,...v6,...v7, ...v1,...v7, ...v2, // 左
    ...v7,...v4,...v3, ...v7,...v3, ...v2, // 底
    ...v4,...v7,...v6, ...v4,...v6, ...v5, // 后
  ])

  const buffer = gl.createBuffer()
  const BYTES = points.BYTES_PER_ELEMENT

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW)

  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(aPosition)

  /* prettier-ignore */
  const color = new Float32Array([
    1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,
    0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,
    0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,
  ])

  const colorBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, color, gl.STATIC_DRAW)
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(aColor)

  let eyeX = 2
  let eyeY = 2
  let eyeZ = 2

  let deg = 0
  const draw = () => {
    deg += 0.01
    const rotate = getRotateMatrix(deg)

    const matrix = getViewMatrix(eyeX, eyeY, eyeZ, 0, 0, 0, 0, 1, 0)
    const perspective = getPerspective(30, canvas.width / canvas.height, 100, 2)
    gl.enable(gl.DEPTH_TEST)

    // todo 相机矩阵
    // 只使用透视只是在原点进行透视，而正方体的 xyz 范围在 [-1,1]
    // gl.uniformMatrix4fv(mat, false, perspective)
    // gl.uniformMatrix4fv(mat, false, matrix)
    // gl.uniformMatrix4fv(mat, false, mixMatrix(perspective, matrix))
    gl.uniformMatrix4fv(mat, false, mixMatrix(mixMatrix(perspective, matrix), rotate))

    gl.drawArrays(gl.TRIANGLES, 0, points.length / 3)

    requestAnimationFrame(draw)
  }

  draw()
})
</script>

<style lang="scss" scoped>
#canvas {
  background-color: color(srgb 1 1 1);
}
</style>
