<template>
  <canvas id="canvas" ref="canvasRef"> 此浏览器不支持 canvas </canvas>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getPerspective, getRotateMatrix, mixMatrix } from '@/utils/webgl/matrix.js'
import { getViewMatrix } from '@/utils/webgl/matrix.js'
import { initWebGL } from '@/utils/webgl/webgl-program.js'
const canvasRef = ref(null)

const VERTEX_SHADER_SOURCE = `
    attribute vec4 aPosition;
    attribute vec4 aNormal;
    varying vec4 vColor;
    uniform mat4 mat;

    // 雾化
    varying float vDist;

    void main(){
      // 顶点的世界坐标
      vec4 vertexPosition = mat * aPosition;
      // 物体表面的颜色
      vec4 aColor = vec4(1.0,0.0,0.0,1.0);

      // 定义点光源的颜色
      vec3 lightColor = vec3(1.0,1.0,1.0);
      // 定义点光源的位置
      vec3 lightPosition = vec3(-5.2,5.6,10.0);
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
      vColor = vec4(ambient + diffuseColor,aColor.a);
      vDist = gl_Position.w;
    }
  `

const FRAGMENT_SHADER_SOURCE = `
    precision lowp float;
    varying vec4 vColor;

    // 雾化
    varying float vDist;

    // 雾化颜色
    uniform vec3 uFogColor;
    // 起点到终点的距离：参数两个点，参数1：起点 参数2：终点
    uniform vec2 uFogDist;

    void main(){
      // 计算雾化因子
      float fogFactor = (uFogDist.y - vDist) / (uFogDist.y - uFogDist.x);

      // 计算看到的颜色
      // mix函数符合：颜色 = 物体颜色 * 雾化因子 + 雾化颜色 *（1 - 雾化因子)
      // mix 是线性混合计算 mix(x,y,a) => { x * (1 - a) + y * a}
      vec3 color = mix(uFogColor,vec3(vColor),fogFactor);
      gl_FragColor = vec4(color,vColor.a);
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

  const uFogColor = gl.getUniformLocation(program, 'uFogColor')
  const uFogDist = gl.getUniformLocation(program, 'uFogDist')

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

  const start = 0
  const end = 200
  const fogColor = new Float32Array([0, 0, 0])
  const fogDist = new Float32Array([start, end])
  gl.uniform3fv(uFogColor, fogColor)

  let eyeX = 3
  let eyeY = 3
  let eyeZ = 7

  let deg = 0
  let isAdd = false

  const draw = () => {
    // 清空背景颜色
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.enable(gl.DEPTH_TEST)

    // 雾化动画
    if (fogDist[1] < start) {
      isAdd = true
    } else if (fogDist[1] > end) {
      isAdd = false
    }

    if (isAdd === false) {
      fogDist[1] -= 1
    } else {
      fogDist[1] += 1
    }

    gl.uniform2fv(uFogDist, fogDist)

    deg += 0.01
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
  background-color: color(srgb 1 1 1);
}
</style>
