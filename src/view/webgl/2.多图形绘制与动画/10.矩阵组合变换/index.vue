<template>
  <canvas id="canvas" width="400" height="400" ref="canvasRef"> 此浏览器不支持 canvas </canvas>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getRotateMatrix, getScaleMatrix, getTranslateMatrix } from '@/utils/matrix.js'
import { initWebGL } from '@/utils/webgl-program.js'
const canvasRef = ref(null)

const VERTEX_SHADER_SOURCE = `
    attribute vec4 aPosition;
    uniform mat4 translateMat;
    uniform mat4 scaleMat;
    uniform mat4 rotateMat;

    void main(){
      gl_Position = translateMat * scaleMat * rotateMat * aPosition;
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
  const translateMat = gl.getUniformLocation(program, 'translateMat')
  const scaleMat = gl.getUniformLocation(program, 'scaleMat')
  const rotateMat = gl.getUniformLocation(program, 'rotateMat')

  const points = new Float32Array([-0.5, -0.5, 0.5, -0.5, 0.0, 0.5])

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW)
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(aPosition)

  let deg = 0
  let translateX = -1
  let scaleXY = 0
  const animation = () => {
    deg += 0.01
    translateX += 0.01
    scaleXY += 0.01

    if (translateX > 1) translateX = -1
    if (scaleXY > 2) scaleXY = 0

    const translate = getTranslateMatrix(translateX)
    const scale = getScaleMatrix(scaleXY, scaleXY)
    const rotate = getRotateMatrix(deg)

    // uniformMatrix4fv 用于设置 uniform mat 变量值为矩阵值
    // uniformMatrix4fv 参数 2 在 webgl 中恒为 false
    gl.uniformMatrix4fv(translateMat, false, translate)
    gl.uniformMatrix4fv(scaleMat, false, scale)
    gl.uniformMatrix4fv(rotateMat, false, rotate)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    requestAnimationFrame(animation)
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
