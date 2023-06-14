export const lightType = {
  SpotLight: ['color', 'intensity', 'distance', 'angle', 'penumbra', 'decay'], // 聚光灯
  AmbientLight: ['color', 'intensity'], // 环境光
  PointLight: ['color', 'intensity', 'distance', 'decay'], // 点光源
  DirectionalLight: ['color', 'intensity'], // 平行光
  HemisphereLight: ['color', 'groundColor'], // 半球光，它没有 skyColor 方法

  MeshBasicMaterial: ['color', 'opacity', 'transparent', 'wireframe', 'visible'], // 基础材质
  MeshDepthMaterial: ['wireframe', 'cameraNear', 'cameraFar'], // 深度材质
  MeshLambertMaterial: ['opacity', 'transparent', 'wireframe', 'visible', 'side', 'emissive', 'color'], // 郎伯材质
  MeshPhongMaterial: [
    'opacity',
    'transparent',
    'wireframe',
    'visible',
    'side',
    'emissive',
    'color',
    'specular',
    'shininess',
  ], // Phong 材质
  ShaderMaterial: ['alpha'], // 着色器材质
  LineBasicMaterial: ['color'], // 实线
  LineDashedMaterial: ['dashSize', 'gapSize'], // 虚线
  PlaneGeometry: ['width', 'height', 'widthSegments', 'heightSegments'], // 二维平面
  PlaneBufferGeometry: ['width', 'height', 'widthSegments', 'heightSegments'], // 二维平面 性能更优
  CircleGeometry: ['radius', 'segments', 'thetaStart', 'thetaLength'], // 二维圆
  BoxGeometry: ['width', 'height', 'depth', 'widthSegments', 'heightSegments', 'depthSegments'], // 立方体
  SphereGeometry: ['radius', 'widthSegments', 'heightSegments', 'phiStart', 'phiLength', 'thetaStart', 'thetaLength'], // 球体
  CylinderGeometry: [
    'radiusTop',
    'radiusBottom',
    'height',
    'radialSegments',
    'heightSegments',
    'openEnded',
    'thetaStart',
    'thetaLength',
  ], // 圆柱体
  TorusGeometry: ['radius', 'tube', 'radialSegments', 'tubularSegments', 'arc'], // 圆环
  TorusKnotGeometry: ['radius', 'tube', 'radialSegments', 'tubularSegments', 'p', 'q'], // 扭结
  PolyhedronGeometry: ['radius', 'detail'], // 自定义多面体
  TetrahedronGeometry: ['radius', 'detail'], // 正四面体
  OctahedronGeometry: ['radius', 'detail'], // 正八面体
  IcosahedronGeometry: ['radius', 'detail'], // 正 20 面体
  TextGeometry: [
    'size',
    'weight',
    'font',
    'bevelThickness',
    'bevelSize',
    'bevelEnabled',
    'bevelSegments',
    'curveSegments',
    'steps',
  ], // 3D 字体
}
