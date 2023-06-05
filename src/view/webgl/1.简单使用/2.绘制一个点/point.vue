<template>
  <canvas id="canvas" width="400" height="400" ref="canvasRef"> 此浏览器不支持 canvas </canvas>
</template>

<script setup>
import { onMounted, ref } from 'vue'
const canvasRef = ref(null)

onMounted(() => {
  const canvas = canvasRef.value
  const gl = canvas.getContext('webgl')

  // 着色器 重要切难的知识点
  // 着色器：让开发者编写程序，代替固定渲染管线，来处理图像渲染
  // 顶点着色器：用来描述顶点的特性 -> 通过计算获取位置信息 (顶点是指二维、三围空间中的一个点，可以理解为一个坐标)
  // 片元着色器：进行逐片元处理程序 -> 通过计算获取位置信息 (片元可以理解为一个个像素)

  // 1. 创建着色器源码 注意分号
  // 顶点着色器
  const VERTEX_SHADER_SOURCE = `
    // main 函数必须存在
    void main(){
      // 点的坐标 vec4(x,y,z,w) w 是齐次坐标 意义:(x/w,y/w,z/w) 是三维坐标
      gl_Position = vec4(0.0,0.0,0.0,1.0);
      // 点的大小是多少, 尺寸以中心轴的点向外扩展
      gl_PointSize = 30.0;
    }
  `

  // 片元着色器
  const FRAGMENT_SHADER_SOURCE = `
    void main(){
      // 指定绘制 rgba 颜色
      gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    }
  `

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

  // 4. 执行绘制
  // 参数：要绘制的图形，从哪个开始，使用几个顶点
  gl.drawArrays(gl.POINTS, 0, 1)

  // 线段至少需要有两个点
  gl.drawArrays(gl.LINES, 0, 2)

  // 三角形至少三个点
  gl.drawArrays(gl.TRIANGLES, 0, 3)
})
</script>

<style lang="scss" scoped></style>
