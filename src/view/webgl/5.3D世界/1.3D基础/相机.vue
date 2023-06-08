<template>
  <canvas id="canvas" width="400" height="400" ref="canvasRef"> 此浏览器不支持 canvas </canvas>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { getTranslateMatrix } from '@/utils/matrix.js'
import { getViewMatrix } from '@/utils/helper.js'
import { initWebGL } from '@/utils/program.js'
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

  const program = initWebGL(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE)
  const aPosition = gl.getAttribLocation(program, 'aPosition')
  const mat = gl.getUniformLocation(program, 'mat')

  /* prettier-ignore */
  const points = new Float32Array([
    -0.5, -0.5,
     0.5, -0.5,
     0.0,  0.5
  ])

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW)
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(aPosition)

  let eyeY = 0
  const animation = () => {
    eyeY += 0.01
    if (eyeY > 1) eyeY = 0

    const matrix = getViewMatrix(0, eyeY, 1.0, 0, 0, 0, 0, 1.0, 0)

    gl.uniformMatrix4fv(mat, false, matrix)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    // requestAnimationFrame(animation)
  }

  animation()
})
</script>

<style lang="scss" scoped>
#canvas {
  margin: 50px auto 0;
  background-color: yellow;
}
</style>
