<template>
  <canvas id="canvas" width="400" height="400" ref="canvasRef"> 此浏览器不支持 canvas </canvas>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { initWebGL } from '@/utils/webgl-program.js'
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

  // 片元着色器
  const FRAGMENT_SHADER_SOURCE = `
    void main(){
      // 指定绘制 rgba 颜色
      gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    }
  `

  const program = initWebGL(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE)
  // 获取 顶点着色器中的 attribute 变量,getAttribLocation 返回 变量地址信息
  const aPosition = gl.getAttribLocation(program, 'aPosition')
  const aPointSize = gl.getAttribLocation(program, 'aPointSize')
  // nf 几f代表设置几个变量参数，没设置的 xyz 为 0 , w 为 1
  gl.vertexAttrib1f(aPosition, 0.5)

  // 缓冲区对象是WbGL系统中的一块内存区域，可以一次性地向缓冲区对象中填充大量的顶点数据，然后将这些数据保存在其中，供顶点着色器使用。
  // 在webgl中，需要处理大量的相同类型数据,所以引入类型化数组，这样程序就可以预知到数组中的数据类型，提高性能。
  const points = new Float32Array([0.5, 0.5, 10.0, -0.5, 0.0, 20.0, 0.0, 0.5, 30.0])
  const buffer = gl.createBuffer()

  // gl.ARRAY_BUFFER 是顶点的位置数据 gl.ELEMENT_ARRAY_BUFFER 是顶点数据的索引值
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

  // 向 buffer 写入数据
  // 参数 3 type:
  //    gl.STATIC_DRAW 写入一次，多次绘制
  //    gl.STREAM_DRAW 写入一次，绘制若干次
  //    gl.DYNAMIC_DRAW 写入多次，绘制多次
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW)

  // points.BYTES_PER_ELEMENT 获取元素字节数,就是 Float32Array 每个索引元素所占据的字节数
  const BYTE_NUM = points.BYTES_PER_ELEMENT

  // 告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据
  // 参数：
  //   location : 变量的地址
  //   index : 指定每个顶点属性的组成数量，必须是 1，2，3 或 4
  //   type : 指定数组中每个元素的数据类型可能是
  //                  gl.FLOAT(浮点型)
  //                  gl.UNSIGNED_BYTE(无符号字节)
  //                  gl.INT(整型)
  //                  gl.UNSIGNED_INT(无符号整型)
  //                  gl.SHORT(短整型)
  //                  gl.UNSIGNED_SHORT(无符号短整型)
  //  normalized : 是否将值归一化为 true [0, 1] false [-1,1] 这个区间
  //  stride : 两个顶点之间的字节数是多少（就是多少字节为一组，0 为 points.BYTES_PER_ELEMENT 的值）
  //  offset : 指定顶点属性数组中第一部分的字节偏移量，必须是类型的字节长度的倍数,就是每一组数据每隔数据多少的字节数才是这个要赋值的数值开始的位置
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, BYTE_NUM * 3, 0)
  // 激活 vertexAttribPointer()、vertexAttrib*() 和 getVertexAttrib() 获取到的属性值
  gl.enableVertexAttribArray(aPosition) // disableVertexAttribArray() 禁用

  // 创建尺寸缓冲区，可以通过 vertexAttribPointer 进行简化，使用一个缓冲区进行位置偏移来操作
  // const size = new Float32Array([10.0, 20.0, 30.0])
  // const sizeBuffer = gl.createBuffer()
  // gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer)
  // gl.bufferData(gl.ARRAY_BUFFER, size, gl.STATIC_DRAW)

  gl.vertexAttribPointer(aPointSize, 1, gl.FLOAT, false, BYTE_NUM * 3, BYTE_NUM * 2)
  gl.enableVertexAttribArray(aPointSize)

  // 4. 执行绘制
  // 参数：要绘制的图形，从哪个开始，使用几个顶点
  gl.drawArrays(gl.POINTS, 0, 3)
})
</script>

<style lang="scss" scoped>
#canvas {
  margin: 50px auto 0;
  background-color: yellow;
}
</style>
