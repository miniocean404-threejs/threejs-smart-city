<template>
  <canvas id="canvas" width="400" height="400" ref="canvasRef"> 此浏览器不支持 canvas </canvas>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { initWebGL } from '@/utils/webgl-program.js'
const canvasRef = ref(null)
let timer = null

onMounted(async () => {
  const canvas = canvasRef.value
  const gl = canvas.getContext('webgl')

  const res = await Promise.all([
    loadFile(new URL(`./vert.vert`, import.meta.url).href),
    loadFile(new URL(`./frag.frag`, import.meta.url).href),
  ])

  // 顶点着色器
  const VERTEX_SHADER_SOURCE = res[0]

  // 片元着色器
  const FRAGMENT_SHADER_SOURCE = res[1]

  const program = initWebGL(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE)

  // 获取 顶点着色器中的 attribute 变量,getAttribLocation 返回 变量地址信息
  const aPosition = gl.getAttribLocation(program, 'aPosition')
  // nf 几f代表设置几个变量参数，没设置的 xyz 为 0 , w 为 1
  gl.vertexAttrib1f(aPosition, 0.5)
  gl.vertexAttrib2f(aPosition, 0.5, 0.5)
  gl.vertexAttrib3f(aPosition, 0.5, 0.5, 0.5)
  gl.vertexAttrib4f(aPosition, 0.5, 0.5, 0.5, 1)

  gl.useProgram(program)

  // 4. 执行绘制
  // 参数：要绘制的图形，从哪个开始，使用几个顶点
  gl.drawArrays(gl.POINTS, 0, 1)

  let x = 0
  timer = setInterval(() => {
    x += 0.1
    if (x > 1) x = 0

    gl.vertexAttrib1f(aPosition, x)
    gl.drawArrays(gl.POINTS, 0, 1)
  }, 200)
})

onBeforeUnmount(() => {
  timer.cancel()
})

function loadFile(filename) {
  return new Promise((res) => {
    const request = new XMLHttpRequest()
    request.onreadystatechange = function () {
      if (request.readyState === 4 && request.status === 200) {
        res(request.responseText)
      }
    }

    request.open('GET', filename, true)
    request.send()
  })
}
</script>

<style lang="scss" scoped></style>
