# 基础
程序报错优先看有没有设置精度 -> 然后看分号 -> 然后看程序问题
不能以 gl_ webgl_ _webgl_ 作为开头，是系统内置的
数据转换 float() bool() int()

### 矢量
1. 浮点矢量数据 vec2、vec3、vec4 
2. 整型矢量数据 ivec2、ivec3、ivec4 
3. 可以通过 x、y、z、w 访问坐标分量,可以通过 xx.xy 获取 vec2(0.1,0.2) 、xx.yx 获取 vec2(0.1,0.2) 、xx.zyx 获取 vec3(0.1,0.2,0.1)
4. 可以通过 s、t、p、q 访问纹理坐标分量 
5. 布尔矢量数据 bvec2、bvec3、bvec4

### 矩阵
可以通过 mat2、mat3、mat4 获取 2*2,3*3,4*4 的浮点数元素矩阵，其矩阵参数是以列为主序的

### 取样器
1. sampler2D 二维纹理 和 samplerCube 立方体纹理，只能用 uniform 声明 
2. samplerCube 需要处理 6 个面，
   * texParameteri() 类型为 gl.TEXTURE_CUBE_MAP
   *  texImage2D() 需要处理 gl.TEXTURE_CUBE_MAP_NEGATIVE_XX 和 gl.TEXTURE_CUBE_MAP_POSITIVE_XX 共 6 个面，XX 为 XYZ

### 分支和循环
OpenGL 支持 if switch while 等语法，但是跳出循环多个 discard
   * discard: 只能在片元着色器中使用，表示放弃当前片元直接处理下一个片元

### 函数模板
```text
float getFloat(float x,int y){
  return 10.0;
}
```
使用：getFloat();

### 内置函数
1. 角度函数：radians 角度转换弧度 degress 弧度转角度 
2. 三角函数：sin cos tan asin acos atan 指数函数：pow 次方 exp 自然质数 log 对数 sqrt 开平方 inversesqrt 开平方的倒数
3. 通用函数：abs min max mod 取余数 sign 取符号 floor 向下取整 ceil 向上取整 clamp 限定范围 fract 获取小数部分 
4. 集合函数：length(x) 计算向量 x 的长度 distance(x,y) 计算 x y 的距离 dot(x,y) 计算 x y 点积 cross(x,y) 计算向量 xy 的差积 normalize(x) 返回方向同 x 长度为 1 的向量

### 存储限定词：当前声明的变量是什么变量
1. const 常量，定义后不能改变
2. attribute 只能在顶点着色器汇总，只能全局变量，表示逐顶点信息（单个顶点的信息） 
3. uniform 能在顶点着色器和片元着色器，只读变量，所有顶点使用这个变量的时候是同一个变量，用来存储影响所有顶点的数据，如：矩阵 
4. varying 从顶点着色器想片元着色器传递数据
#### 精度限定：提升效率，减少内存开支
* 可以单独对某个变量声明精度，mediump float f 劣势：会出现精度歧义，精度转换的过程中出现歧义等，不建议舒勇
* 可以通过 precision 声明着色器的默认精度 例：precision lowp float; 
* 精度分类：highp mediump lowp 
* 片元着色器中的float类型没有默认精度，所以如果需要在片元着色器中使用浮点型数据的时候，需要修改默认精度
