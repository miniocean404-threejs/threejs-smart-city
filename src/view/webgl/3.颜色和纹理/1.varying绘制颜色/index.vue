<template>
  <canvas id="canvas" width="400" height="400" ref="canvasRef"> 此浏览器不支持 canvas </canvas>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getRotateMatrix } from '@/utils/webgl/matrix.js'
import { initWebGL } from '@/utils/webgl/webgl-program.js'
const canvasRef = ref(null)

const VERTEX_SHADER_SOURCE = `
    attribute vec4 aPosition;
    // 用于在顶点着色器 及 片元着色器中共享数据
    varying vec4 vColor;

    void main(){
      vColor = aPosition;

      gl_Position = aPosition;
      gl_PointSize = 10.0;
    }
  `

// 五彩斑斓的黑色三角形，因为三角形每个点的坐标都是不一样的赋值过来的颜色也不一样
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

  const program = initWebGL(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE)
  const aPosition = gl.getAttribLocation(program, 'aPosition')

  const points = new Float32Array([-0.5, -0.5, 0.5, -0.5, 0.0, 0.5])

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW)
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(aPosition)

  gl.drawArrays(gl.TRIANGLES, 0, 3)
})
</script>

<style lang="scss" scoped>
#canvas {
  margin: 50px auto 0;
  background-color: yellow;
}
</style>
