// 静态资源处理：https://cn.vitejs.dev/guide/assets.html

// import xx from '@/assets/image/dog.png' 会导入一个绝对地址字符串 配合 new URL(xx, import.meta.url).href 就是文件正确地址
// 未被包含在内部列表或 assetsInclude 中的资源，可以使用 '@/assets/image/dog.png?url' 后缀显式导入为一个 URL
export const loadAssetsFile = (url) => {
  return new URL(url, import.meta.url).href
}

export const loadPublicFile = (url) => {
  return `/${url}`
}
