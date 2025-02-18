// Vite 方式导入所有 SVG
const modules = import.meta.glob('./svg/*.svg', { eager: true })

export default modules 