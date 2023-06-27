<template>
  <canvas id="canvas" width="400" height="400" ref="canvasRef"> 此浏览器不支持 canvas </canvas>
</template>

<script setup>
import { onMounted, ref } from 'vue'
const canvasRef = ref(null)
import spongebob from '@/assets/image/spongebob.png'
import dog from '@/assets/image/dog.png'
import { initWebGL } from '@/utils/webgl/webgl-program.js'

const VERTEX_SHADER_SOURCE = `
    attribute vec4 aPosition;
    attribute vec4 aTex;
    varying vec2 vTex;

    void main(){
      vTex = vec2(aTex.x,aTex.y);
      gl_Position = aPosition;
    }
  `

// 五彩斑斓的黑色三角形，因为三角形每个点的坐标都是不一样的赋值过来的颜色也不一样
const FRAGMENT_SHADER_SOURCE = `
    precision lowp float;

    // sampler2D 2D 纹理类型 samplerCube 立方体纹理
    uniform sampler2D uSampler;
    uniform sampler2D uSampler1;

    varying vec2 vTex;

    void main(){
      vec4 c = texture2D(uSampler,vTex);
      vec4 c1 = texture2D(uSampler1,vTex);

      // texture2D(纹理，纹理坐标) 从图像获取数据赋给颜色值
      gl_FragColor = c * c1;
    }
  `

onMounted(async () => {
  const canvas = canvasRef.value
  const gl = canvas.getContext('webgl')

  const program = initWebGL(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE)
  const aPosition = gl.getAttribLocation(program, 'aPosition')
  const aTex = gl.getAttribLocation(program, 'aTex')
  const uSampler = gl.getUniformLocation(program, 'uSampler')
  const uSampler1 = gl.getUniformLocation(program, 'uSampler1')

  /* prettier-ignore */
  const points = new Float32Array([
      -0.5,  0.5, 0.0, 1.0,
      -0.5, -0.5, 0.0, 0.0,
      0.5,  0.5, 1.0, 1.0,
      0.5, -0.5, 1.0, 0.0,
    ],
  )

  const buffer = gl.createBuffer()
  const BYTES = points.BYTES_PER_ELEMENT

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW)
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, BYTES * 4, 0)
  gl.vertexAttribPointer(aTex, 2, gl.FLOAT, false, BYTES * 4, BYTES * 2)
  gl.enableVertexAttribArray(aPosition)
  gl.enableVertexAttribArray(aTex)

  await Promise.all([getImage(gl, spongebob, uSampler, 0), getImage(gl, dog, uSampler1, 1)])

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
})

const getImage = (gl, src, sampler, index) => {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      // 创建纹理对象，存储纹理图像的数据，也可使用 deleteTexture() 删除纹理对象
      const texture = gl.createTexture()

      // 开启纹理单元，webgl 通过纹理单元管理纹理对象，每个纹理单元管理一张纹理图像
      gl.activeTexture(gl[`TEXTURE${index}`])

      // 将纹理单元的数据采样给 location
      // 参数：
      //    location: samplerXX 类型的纹理对象
      //    x: 上方开启的纹理编号
      // xi 或者 xf -> i 代表整数 f 代表浮点数
      gl.uniform1i(sampler, index)

      // 绑定纹理对象
      // 参数：
      //     type: gl.TEXTURE_2D 2d 纹理  gl.TEXTURE_CUBE_MAP 立方体纹理
      //     texture: 创建的纹理对象
      gl.bindTexture(gl.TEXTURE_2D, texture)

      // 图像的坐标为 (0.0) 开始到 (1.-1) 纹理坐标为 (0.0) 开始到 (1.1)
      // 需要图像反转 Y 轴
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)

      // 处理图形放大缩小
      // 参数：
      //     type: gl.TEXTURE_2D 2d 纹理  gl.TEXTURE_CUBE_MAP 立方体纹理
      //     pname:
      //        gl.TEXTURE_MAG_FILTER 放大
      //        gl.TEXTURE_MIN_FILTER 缩小
      //        gl.TEXTURE_WRAP_S 横向填充
      //        gl.TEXTURE_WRAP_T 纵向填充
      //     param:
      //        赋值给 gl.TEXTURE_MAG_FILTER 和 gl.TEXTURE_MIN_FILTER -> gl.NEAREST(使用像素颜色值) 和 gl.LINEAR(使用四周加权平均值)
      //        赋值给 gl.TEXTURE_WRAP_S 和 gl.TEXTURE_WRAP_T -> gl.REPEAT(平铺重复) 和 gl.MIRRORED_REPEAT(镜像对称) 和 gl.CLAMP_TO_EDGE(边缘延伸)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

      // 处理横纵平铺的方式
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

      // 参数：
      //     type: gl.TEXTURE_2D 2d 纹理  gl.TEXTURE_CUBE_MAP 立方体纹理
      //     level: 0 即可
      //     internalformat 图像格式 : gl.RGB gl.RGBA gl.ALPHA gl.LUMINANCE(使用物理表面的红绿蓝分量的加权平均值来计算) gl.LUMINANCE_ALPHA
      //     format: 纹理内部格式，必须和 internalformat 相同
      //     dataType 纹理数据的数据类型:
      //          gl.UNSIGNED_BYTE 无符号整理，每个颜色分量占据一个字节
      //          gl.UNSIGNED_SHORT_5_6_5 RGB 分量，分别占据 5、6、5 比特
      //          gl.UNSIGNED_SHORT_4_4_4_4 RGBA 分量，分别占据 4、4、4、4 比特
      //          gl.UNSIGNED_SHORT_5_5_5_1 RGBA 分量，分别占据 5、5、5、1 比特
      //     image: 图片对象,最好尺寸是 2 的整数次幂，因为光栅化会对图片进行 2 的整数次幂处理，如果不是这样他也会先处理为 2 的整数次幂
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img)

      resolve()
    }

    img.src = src
  })
}
</script>

<style lang="scss" scoped>
#canvas {
  margin: 50px auto 0;
  background-color: yellow;
}
</style>
