// gl.useProgram(program)
export function initWebGL(gl, vertexSource, fragmentSource) {
  // 设置清空颜色缓冲区时的颜色
  gl.clearColor(1.0, 1.0, 1.0, 1.0)
  // 清空颜色缓冲区
  // gl.clear(gl.COLOR_BUFFER_BIT) // 也会清除 background 设置的颜色

  // 根据源代码创建顶点着色器
  let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource)
  // 根据源代码创建片元着色器
  let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
  // 创建 WebGLProgram 程序
  return createProgram(gl, vertexShader, fragmentShader)
}

export function createShader(gl, type, source) {
  // 创建 shader 对象
  let shader = gl.createShader(type)
  // 往 shader 中传入源代码
  gl.shaderSource(shader, source)
  // 编译着色器
  gl.compileShader(shader)
  // 判断 shader 是否编译成功
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) {
    return shader
  }
  // 如果编译失败，则打印错误信息
  console.log(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
}

export function createProgram(gl, vertexShader, fragmentShader) {
  // 创建 program 对象
  let program = gl.createProgram()
  // 往 program 对象中传入 WebGLShader 对象，指定着色器源码
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)

  // 创建一个程序对象，关联 js 与 着色器，后续操作通过 program 交互
  gl.linkProgram(program)
  // 判断 program 是否链接成功
  let success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
    // 告诉WebGL使用我们刚刚初始化的这个程序
    gl.useProgram(program)
    gl.enable(gl.DEPTH_TEST)

    return program
  }
  // 如果 program 链接失败，则打印错误信息
  console.log(gl.getProgramInfoLog(program))
  gl.deleteProgram(program)
  return null
}
