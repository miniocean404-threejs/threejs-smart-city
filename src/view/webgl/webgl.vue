<template>
  <canvas id="canvas" width="400" height="400" ref="canvasRef"> 此浏览器不支持 canvas </canvas>
</template>

<script setup>
import { onMounted, ref } from 'vue';
const canvasRef = ref(null);

onMounted(() => {
  const canvas = canvasRef.value;
  const gl = canvas.getContext('webgl');

  gl.clearColor(1.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
});
</script>

<style lang="scss" scoped></style>
