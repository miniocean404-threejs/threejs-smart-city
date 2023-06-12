<template>
  <canvas id="canvas" ref="canvasRef"> 此浏览器不支持 canvas </canvas>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getPerspective, getRotateMatrix, mixMatrix } from '@/utils/matrix.js'
import { getViewMatrix } from '@/utils/matrix.js'
import { initWebGL } from '@/utils/program.js'

const canvasRef = ref(null)

const VERTEX_SHADER_SOURCE = `
    attribute vec4 aPosition;
    attribute vec4 aNormal;
    varying vec4 vColor;
    uniform mat4 mat;

    void main(){
      // 顶点的世界坐标
      vec4 vertexPosition = mat * aPosition;
      // 物体表面的颜色
      vec4 aColor = vec4(1.0,0.0,0.0,1.0);

      // 定义点光源的颜色
      vec3 lightColor = vec3(1.0,1.0,1.0);
      // 定义点光源的位置
      vec3 lightPosition = vec3(-5.0,6.0,10.0);
      // 点光源的方向,并且将 顶点世界坐标的 vec4 转换为 vec3
      vec3 lightDirection = normalize(lightPosition - vec3(vertexPosition));


      // 环境光颜色
      vec3 uAmbientLightColor = vec3(0.2,0.2,0.2);
      // 环境反射
      vec3 ambient = uAmbientLightColor * vec3(aColor);


      // 计算入射角 -> 光线方向的发现向量的点积
      float dotDeg = dot(lightDirection, vec3(aNormal));
      // 漫反射光的颜色
      vec3 diffuseColor = lightColor * vec3(aColor) * dotDeg;

      gl_Position = vertexPosition;
      vColor = vec4(ambient + diffuseColor,0.5);
    }
  `

const FRAGMENT_SHADER_SOURCE = `
    precision lowp float;
    varying vec4 vColor;
    void main(){
      gl_FragColor = vColor;
    }
  `

onMounted(() => {
  const canvas = canvasRef.value
  canvas.width = document.body.offsetWidth
  canvas.height = document.body.offsetHeight

  const gl = canvas.getContext('webgl')
  const program = initWebGL(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE)

  const aPosition = gl.getAttribLocation(program, 'aPosition')
  const mat = gl.getUniformLocation(program, 'mat')
  const aNormal = gl.getAttribLocation(program, 'aNormal')

  // 范围在 [-1,1] 的六面体顶点
  const v0 = [1, 1, 1]
  const v1 = [-1, 1, 1]
  const v2 = [-1, -1, 1]
  const v3 = [1, -1, 1]
  const v4 = [1, -1, -1]
  const v5 = [1, 1, -1]
  const v6 = [-1, 1, -1]
  const v7 = [-1, -1, -1]

  /* prettier-ignore */
  const points = new Float32Array([
    ...v0,...v1,...v2, ...v0,...v2, ...v3, // 前
    ...v0,...v3,...v4, ...v0,...v4, ...v5, // 右
    ...v0,...v5,...v6, ...v0,...v6, ...v1, // 上面
    ...v1,...v6,...v7, ...v1,...v7, ...v2, // 左
    ...v7,...v4,...v3, ...v7,...v3, ...v2, // 底
    ...v4,...v7,...v6, ...v4,...v6, ...v5, // 后
  ])

  // 法向量数据
  /* prettier-ignore */
  const normals = new Float32Array([
    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,
    0.0, 0.0,-1.0,   0.0, 0.0,-1.0,    0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,
    -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,   -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,   1.0, 0.0, 0.0,    1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,
    0.0, 1.0, 0.0,   0.0, 1.0, 0.0,    0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,
    0.0,-1.0, 0.0,   0.0,-1.0, 0.0,    0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,
  ])

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW)
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(aPosition)

  const normalBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW)
  gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(aNormal)

  let eyeX = 3
  let eyeY = 3
  let eyeZ = 7

  let deg = 0
  const draw = () => {
    deg += 0.01

    // 1. 开启半透明混合 2.设置片元着色器中 vColor 中 aColor.a 为 0.5
    gl.enable(gl.BLEND)
    // blendFunc() 用于混合像素算法的函数
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    const rotate = getRotateMatrix(deg)
    const matrix = getViewMatrix(eyeX, eyeY, eyeZ, 0, 0, 0, 0, 1, 0)
    const perspective = getPerspective(30, canvas.width / canvas.height, 100, 2)
    gl.uniformMatrix4fv(mat, false, mixMatrix(mixMatrix(perspective, matrix), rotate))

    gl.drawArrays(gl.TRIANGLES, 0, points.length / 3)

    requestAnimationFrame(draw)
  }

  draw()
})
</script>

<style lang="scss" scoped>
#canvas {
  background-color: color(srgb 1 1 0);
}
</style>
