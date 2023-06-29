// 接收 geometry.setAttribute 设置的 a_position 的索引
attribute float a_position;

uniform float u_time;
uniform float u_length;
uniform float u_size;
uniform float u_total;

varying float v_opacity;

void main(){
    // 重新赋值变量是因为 uniform 不能直接修改变量
    float size = u_size;
    // 当前进度渲染的粒子总数
    float totalNumber = u_total * mod(u_time , 1.0);

    // 遍历 a_position 每个索引
    //       1、找到 (0,u_length) 长度的粒子后，因为 u_length 总会大于 totalNumber，满足第二个条件，所以只寻找 totalNumber > a_position 条件下的粒子
    //       2、超过 (0,u_length) 长度的粒子后 范围变成了 (u_length,totalNumber - u_length)
    //          totalNumber > a_position > totalNumber - u_length
    //       3. 超过 totalNumber 后 (totalNumber - u_length,total)
    if(totalNumber > a_position && totalNumber < a_position + u_length){
        float percentage = (a_position + u_length - totalNumber) / u_length;
        size *= percentage;

        v_opacity = 1.0;
    }else{
         v_opacity = 0.0;
    }


    // 这里的 position 使用的是 geometry.setAttribute 设置的新的值
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    gl_PointSize = size;
}
