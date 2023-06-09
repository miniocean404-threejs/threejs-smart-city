<template>
  <canvas id="canvas" ref="canvasRef"> 此浏览器不支持 canvas </canvas>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { initWebGL } from '@/utils/program.js'
const canvasRef = ref(null)

onMounted(() => {
  const canvas = canvasRef.value
  canvas.width = document.body.offsetWidth
  canvas.height = document.body.offsetHeight

  const gl = canvas.getContext('webgl')

  const VERTEX_SHADER_SOURCE = `
    // main 函数必须存在
    void main(){
      // 点的坐标 vec4(x,y,z,w) w 是齐次坐标 意义:(x/w,y/w,z/w) 是三维坐标
      gl_Position = vec4(0.0,0.0,0.0,1.0);
      // 点的大小是多少, 尺寸以中心轴的点向外扩展
      gl_PointSize = 100.0;
    }
  `

  const FRAGMENT_SHADER_SOURCE = `
    precision lowp float;

    void main(){
      // 计算距离, 当前绘制的点 gl_PointCoord 和 自定义的位置 之间的距离
      // 通过计算距离来绘制圆形的点
      float dis = distance(gl_PointCoord,vec2(0.5,0.5));

      // 绘制圆形
      // if(dis > 0.5){
      //   // gl_FragColor = vec4(1.0,1.1,0.0,1.0);
      //   // 或者使用 discard; 放弃绘制
      //   discard;
      // }

      // // 绘制圆环
      // if(dis > 0.5 || dis < 0.4){
      //   discard;
      // }

      // 绘制双圆环
      if(dis > 0.5 || (dis < 0.4 && dis > 0.3) || dis < 0.2){
        discard;
      }

      gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    }
  `

  const program = initWebGL(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE)

  // 三角形至少三个点
  gl.drawArrays(gl.POINTS, 0, 1)
})
</script>

<style lang="scss" scoped>
#canvas {
  background-color: color(srgb 1 1 0);
}
</style>
