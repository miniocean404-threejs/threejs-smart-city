<template>
  <canvas id="canvas" width="400" height="400" ref="canvasRef"> 此浏览器不支持 canvas </canvas>
</template>

<script setup>
import { onMounted, ref } from 'vue'
const canvasRef = ref(null)

onMounted(() => {
  const canvas = canvasRef.value
  const gl = canvas.getContext('webgl')

  // clearColor 搭配 clear 使用
  gl.clearColor(1.0, 0.0, 0.0, 1.0) // rgba 颜色值
  // gl.COLOR_BUFFER_BIT 颜色缓冲区
  // gl.DEPTH_BUFFER_BIT 深度缓冲区
  // gl.STENCIL_BUFFER_BIT 模板缓冲区
  gl.clear(gl.COLOR_BUFFER_BIT) // 清空 canvas 颜色缓冲区
})
</script>

<style lang="scss" scoped></style>
