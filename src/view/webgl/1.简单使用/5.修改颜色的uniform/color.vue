<template>
  <canvas id="canvas" width="400" height="400" ref="canvasRef"> 此浏览器不支持 canvas </canvas>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
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
    // 声明变量, 声明后有默认值 vec4(0.0,0.0,0.0,1.0);
    // attribute 存储限定符,只能在顶点着色器中使用 attribute,用来表示“逐顶点”信息,变量的类型智能是float、vec2、vec3、vec4、mat2、mat3和mat4
    // vec4 类型 4 个浮点数组成 的矢量
    // 顶点着色器不用设置精度，有默认的精度设置
    attribute vec4 aPosition;

    // uniform 可用于顶点着色器及片元着色器,
    // uniform 变量包含了“一致”(非 逐顶点/逐片元 的，各顶点或各片元共用)的数据，因为 attribute 是针对于每个顶点都是一样的值，但是 uniform 是针对所有的点都生效的值
    uniform vec4 bPosition;

    // main 函数必须存在
    void main(){
      // 点的坐标 vec4(x,y,z,w) w 是齐次坐标 意义:(x/w,y/w,z/w) 是三维坐标
      gl_Position = vec4(0.0,0.0,0.0,1.0 );
      // 点的大小是多少, 尺寸以中心轴的点向外扩展
      gl_PointSize = 30.0;
    }
  `

  // 片元着色器
  const FRAGMENT_SHADER_SOURCE = `
   // 片元着色器不用设置精度，必须设置 有 mediump、highp、lowp
   precision mediump float;
   uniform vec4 uColor;

   // 使用 uniform1f 因为并没有 vec1 及 vec 这种类型
   uniform float uColor1;

   // 使用 uniform2f
   uniform vec2 uColor2;

    void main(){
      // 指定绘制 rgba 颜色
      gl_FragColor = vec4(uColor1,0.0,0.0,1.0);
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

  // 获取片段着色器中的 uniform 变量,getUniformLocation 返回 变量地址信息
  const uColor = gl.getUniformLocation(program, 'uColor')
  const uColor1 = gl.getUniformLocation(program, 'uColor1')
  const uColor2 = gl.getUniformLocation(program, 'uColor2')
  // nf 几f代表设置几个变量参数，没设置的 rgba 为 (0.0,0.0,0.0,1.0)
  gl.uniform4f(uColor, 0.0, 0.0, 1.0, 1.0)
  gl.uniform2f(uColor, 0.0, 1.0)
  gl.uniform1f(uColor1, 1.0)

  // 4. 执行绘制
  // 参数：要绘制的图形，从哪个开始，使用几个顶点
  gl.drawArrays(gl.POINTS, 0, 1)
})

onBeforeUnmount(() => {})
</script>

<style lang="scss" scoped></style>
