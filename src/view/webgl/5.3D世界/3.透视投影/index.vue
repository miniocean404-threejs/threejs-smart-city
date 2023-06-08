<template>
  <canvas id="canvas" width="400" height="400" ref="canvasRef"> 此浏览器不支持 canvas </canvas>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { getOrthographic, getPerspective, getTranslateMatrix, mixMatrix } from '@/utils/matrix.js'
import { getViewMatrix } from '@/utils/helper.js'
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
  const gl = canvas.getContext('webgl')

  const program = initProgram(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE)
  const aPosition = gl.getAttribLocation(program, 'aPosition')
  const mat = gl.getUniformLocation(program, 'mat')
  const aColor = gl.getAttribLocation(program, 'aColor')

  /* prettier-ignore */
  const points = new Float32Array([
    0.75,  1.0, -0.6,     1.0,0.0,0.0,
    0.25, -1.0, -0.6,     1.0,0.0,0.0,
    1.0, - 1.0, -0.6,     1.0,0.0,0.0,

    0.75,  1.0, -0.5,     0.0,1.0,0.0,
    0.25, -1.0, -0.5,     0.0,1.0,0.0,
    1.0,  -1.0, -0.5,     0.0,1.0,0.0,

    0.75,  1.0, -0.4,     0.0,0.0,1.0,
    0.25, -1.0, -0.4,     0.0,0.0,1.0,
    1.0,  -1.0, -0.4,     0.0,0.0,1.0,

    -0.75, 1.0, -0.6,     1.0,0.0,0.0,
    -0.25,-1.0, -0.6,     1.0,0.0,0.0,
    -1.0, -1.0, -0.6,     1.0,0.0,0.0,

    -0.75, 1.0, -0.5,     0.0,1.0,0.0,
    -0.25,-1.0, -0.5,     0.0,1.0,0.0,
    -1.0, -1.0, -0.5,     0.0,1.0,0.0,

    -0.75, 1.0, -0.4,     0.0,0.0,1.0,
    -0.25,-1.0, -0.4,     0.0,0.0,1.0,
    -1.0, -1.0, -0.4,     0.0,0.0,1.0,
  ])

  const buffer = gl.createBuffer()
  const BYTES = points.BYTES_PER_ELEMENT

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW)

  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, BYTES * 6, 0)
  gl.enableVertexAttribArray(aPosition)

  gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, BYTES * 6, BYTES * 3)
  gl.enableVertexAttribArray(aColor)

  let eyex = 0
  let eyey = 0
  let eyez = 0.1

  const draw = () => {
    const matrix = getViewMatrix(eyex, eyey, eyez, 0.0, 0.0, 0.0, 0.0, 0.6, 0.0)
    const perspective = getPerspective(150, canvas.width / canvas.height, 100, 1)
    gl.enable(gl.DEPTH_TEST)

    gl.uniformMatrix4fv(mat, false, mixMatrix(matrix, perspective))

    gl.drawArrays(gl.TRIANGLES, 0, 3 * 6)
  }

  draw()

  document.onkeydown = function (e) {
    switch (e.code) {
      case 'ArrowRight':
        eyex += 0.01
        break
      case 'ArrowLeft':
        eyex -= 0.01
        break
      case 'ArrowUp':
        eyey += 0.01
        break
      case 'ArrowDown':
        eyey -= 0.01
        break
    }
    draw()
  }
})

const initProgram = (gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE) => {
  // 2. 创建着色器
  const vertexShader = gl.createShader(gl.VERTEX_SHADER)
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

  // 指定着色器源码
  gl.shaderSource(vertexShader, VERTEX_SHADER_SOURCE)
  gl.shaderSource(fragmentShader, FRAGMENT_SHADER_SOURCE)

  // 编译着色器
  gl.compileShader(vertexShader)
  gl.compileShader(fragmentShader)

  // 3. 创建一个程序对象，关联 js 与 着色器，后续操作通过 program 交互
  const program = gl.createProgram()

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)

  gl.linkProgram(program)
  gl.useProgram(program)

  return program
}
</script>

<style lang="scss" scoped>
#canvas {
  margin: 50px auto 0;
  background-color: yellow;
}
</style>
