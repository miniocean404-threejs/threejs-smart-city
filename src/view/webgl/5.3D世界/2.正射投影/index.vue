<template>
  <canvas id="canvas" width="400" height="400" ref="canvasRef"> 此浏览器不支持 canvas </canvas>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { getOrthographic, getTranslateMatrix, mixMatrix } from '@/utils/matrix.js'
import { getViewMatrix } from '@/utils/helper.js'
const canvasRef = ref(null)

const VERTEX_SHADER_SOURCE = `
    attribute vec4 aPosition;
    uniform mat4 mat;

    void main(){
      gl_Position = mat * aPosition;
      gl_PointSize = 10.0;
    }
  `

const FRAGMENT_SHADER_SOURCE = `
    void main(){
      gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    }
  `

onMounted(() => {
  const canvas = canvasRef.value
  const gl = canvas.getContext('webgl')

  const program = initProgram(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE)
  const aPosition = gl.getAttribLocation(program, 'aPosition')
  const mat = gl.getUniformLocation(program, 'mat')

  /* prettier-ignore */
  const points = new Float32Array([
    -1,  -1,
     1,  -1,
     0,   1
  ])

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW)
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(aPosition)

  let eye = 0.2
  const animation = () => {
    eye += 0.01
    if (eye > 1) eye = 0

    const matrix = getViewMatrix(0, eye, 0.2, 0, 0, 0, 0, 0.6, 0)
    const orthographicMatrix = getOrthographic(-1, 1, 1, -1, 0, 20)

    gl.uniformMatrix4fv(mat, false, orthographicMatrix)

    gl.drawArrays(gl.TRIANGLES, 0, 3)
    requestAnimationFrame(animation)
  }

  animation()
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
