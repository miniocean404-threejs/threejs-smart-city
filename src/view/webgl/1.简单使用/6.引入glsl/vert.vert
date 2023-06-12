// 1. 引入可以通过请求引入 vert.glsl、frag.glsl 文件,简写 vert、frag
// 2. 可以通过 webpack loader 引入，也是请求

attribute vec4 aPosition;

// main 函数必须存在
void main(){
   // 点的坐标 vec4(x,y,z,w) w 是齐次坐标 意义:(x/w,y/w,z/w) 是三维坐标
   gl_Position = aPosition;
   // 点的大小是多少, 尺寸以中心轴的点向外扩展
   gl_PointSize = 30.0;
}
