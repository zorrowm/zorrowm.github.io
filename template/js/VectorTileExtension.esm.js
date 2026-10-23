// 导入前应将当前 Viewer 使用的 Cesium 设置到 globalThis.Cesium。
import "./VectorTileExtension-min.js";

const extension = globalThis.VectorTileExtension;

if (!extension?.VectorTilePrimitive || !extension?.TerrainRGBProvider) {
  throw new Error("矢量切片扩展初始化失败，请先设置 globalThis.Cesium");
}

export const { VectorTilePrimitive, TerrainRGBProvider } = extension;
export default extension;
