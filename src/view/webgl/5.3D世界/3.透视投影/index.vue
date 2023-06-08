<template>
  <canvas id="canvas" ref="canvasRef"> 此浏览器不支持 canvas </canvas>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getPerspective, mixMatrix } from '@/utils/matrix.js'
import { getViewMatrix } from '@/utils/helper.js'
import { initWebGL } from '@/utils/program.js'
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

  /* prettier-ignore */
  const points = new Float32Array([
    0.75,  1.0, -0.6,     1.0,0.0,0.0,
    0.25, -1.0, -0.6,     1.0,0.0,0.0,
    1.0,  -1.0, -0.6,     1.0,0.0,0.0,

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

  let eyeX = 0
  let eyeY = 0
  let eyeZ = -0.1

  const draw = () => {
    const matrix = getViewMatrix(eyeX, eyeY, eyeZ, 0, 0, 0, 0, 1, 0)
    const perspective = getPerspective(100, canvas.width / canvas.height, 100, 2)
    gl.enable(gl.DEPTH_TEST)

    gl.uniformMatrix4fv(mat, false, mixMatrix(matrix, perspective))

    gl.drawArrays(gl.TRIANGLES, 0, 3 * 6)
  }

  draw()

  document.onkeydown = function (e) {
    switch (e.code) {
      case 'ArrowRight':
        eyeX += 0.01
        break
      case 'ArrowLeft':
        eyeX -= 0.01
        break
      case 'ArrowUp':
        eyeY += 0.01
        break
      case 'ArrowDown':
        eyeZ -= 0.01
        break
    }
    draw()
  }
})
</script>

<style lang="scss" scoped>
#canvas {
  background-color: yellow;
}
</style>
