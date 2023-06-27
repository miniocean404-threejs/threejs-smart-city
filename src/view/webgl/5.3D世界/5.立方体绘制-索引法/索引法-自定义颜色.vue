<template>
  <canvas id="canvas" ref="canvasRef"> 此浏览器不支持 canvas </canvas>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getPerspective, getRotateMatrix, mixMatrix } from '@/utils/webgl/matrix.js'
import { getViewMatrix } from '@/utils/webgl/matrix.js'
import { initWebGL } from '@/utils/webgl/webgl-program.js'
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

  // 每三个为一组，是针对上方的每一个顶点(正方体绘制的 6 的顶点)的颜色
  /* prettier-ignore */
  const colors = new Float32Array([
    0.4,0.4,1.0,0.4,0.4,1.0,0.4,0.4,1.0,0.4,0.4,1.0,
    0.4,1.0,0.4,0.4,1.0,0.4,0.4,1.0,0.4,0.4,1.0,0.4,
    1.0,0.4,0.4,1.0,0.4,0.4,1.0,0.4,0.4,1.0,0.4,0.4,
    1.0,1.0,0.4,1.0,1.0,0.4,1.0,1.0,0.4,1.0,1.0,0.4,
    1.0,0.0,1.0,1.0,0.0,1.0,1.0,0.0,1.0,1.0,0.0,1.0,
    0.0,1.0,1.0,0.0,1.0,1.0,0.0,1.0,1.0,0.0,1.0,1.0,
  ])

  const BYTES = points.BYTES_PER_ELEMENT

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW)

  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(aPosition)

  const colorBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW)
  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(aColor)

  // 使用索引数据需要使用 gl.ELEMENT_ARRAY_BUFFER
  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index, gl.STATIC_DRAW)

  let eyeX = 1
  let eyeY = 1
  let eyeZ = 3

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

    requestAnimationFrame(draw)
  }

  draw()

  document.onkeydown = function (e) {
    let range = 0.01
    switch (e.code) {
      case 'ArrowRight':
        eyeX += range
        break
      case 'ArrowLeft':
        eyeX -= range
        break
      case 'ArrowUp':
        eyeY += range
        break
      case 'ArrowDown':
        eyeZ -= range
        break
    }
    draw()
  }
})
</script>

<style lang="scss" scoped>
#canvas {
  background-color: color(srgb 1 1 1);
}
</style>
