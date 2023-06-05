<template>
  <canvas id="canvas" width="400" height="400" ref="canvasRef"> 此浏览器不支持 canvas </canvas>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
const canvasRef = ref(null)

onMounted(() => {
  const canvas = canvasRef.value
  const gl = canvas.getContext('webgl')

  const VERTEX_SHADER_SOURCE = `
    // 声明变量, 声明后有默认值 vec4(0.0,0.0,0.0,1.0);
    // attribute 存储限定符,只能在顶点着色器中使用 attribute
    // vec4 类型 4 个浮点数组成 的矢量
    attribute vec4 aPosition;
    attribute float aPointSize;

    // main 函数必须存在
    void main(){
      // 点的坐标 vec4(x,y,z,w) w 是齐次坐标 意义:(x/w,y/w,z/w) 是三维坐标
      gl_Position = aPosition;
      // 点的大小是多少, 尺寸以中心轴的点向外扩展
      gl_PointSize = aPointSize;
    }
  `

  const FRAGMENT_SHADER_SOURCE = `
    void main(){
      // 指定绘制 rgba 颜色
      gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    }
  `

  const program = initProgram(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE)
  const aPosition = gl.getAttribLocation(program, 'aPosition')
  const aPointSize = gl.getAttribLocation(program, 'aPointSize')
  gl.vertexAttrib1f(aPosition, 0.5)

  const points = new Float32Array([
    0.5, 0.5, 10.0, -0.5, 0.0, 20.0, 0.0, 0.5, 30.0, 0.3, 0.5, 10.0, 0.0, 0.0, 10.0, 0.8, 0.0, 10.0,
  ])
  const buffer = gl.createBuffer()
  // gl.ARRAY_BUFFER 是顶点的位置数据 gl.ELEMENT_ARRAY_BUFFER 是顶点数据的索引值
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  // 向 buffer 写入数据
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW)

  const BYTE_NUM = points.BYTES_PER_ELEMENT
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, BYTE_NUM * 3, 0)
  gl.enableVertexAttribArray(aPosition)
  gl.vertexAttribPointer(aPointSize, 1, gl.FLOAT, false, BYTE_NUM * 3, BYTE_NUM * 2)
  gl.enableVertexAttribArray(aPointSize)

  // gl.LINE_STRIP 绘制多个线段，但是并不会闭合
  // gl.LINE_LOOP 绘制多个线段，并且闭合
  // gl.TRIANGLES 绘制三角形，内部填充颜色,绘制多个三角形，顶点数量一定是 count 的倍数
  // gl.TRIANGLE_FAN 条状三角形，T = [n 第一个点 n-1]
  // gl.TRIANGLE_STRIP 扇形三角形，奇数:T = [n-1 n-2 n] 偶数:T = [n-2 n-1 n]
  gl.drawArrays(gl.TRIANGLES, 0, 6)
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 6)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6)
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
