# Quasar App (vue-widget-quasar-clivite-template)

vue widget quasar template project

## 主要技术

vue3
quasar-cli
vite
@opentiny
widget

### 更改记录

- 202401009
  升级更新依赖库版本,更新public/cesium；
  增加dexie库支持本地数据库操作；
  增加vite-plugin-checker库进行单独线程深度ts、eslint检查;
  使用VITE_CJS_IGNORE_WARNING=true来忽略该错误"The CJS build of Vite's Node API is deprecated. See https://vitejs.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated for more details."

- 20240719
  升级xframelib后，能简化LayoutContainer的初始化
  

- 20240607
  增加引入comlink库；
  给SysConfig.js增加Enables对象，控制部分功能是否启用;
  引入turf-async异步多线程库；
  引入CesiumOfflineCache的js库

- 20240605
  增加PopoverPanel组件；
  升级依赖库
  更新public下cesium文件夹文件版本
  
- 20240529
  增加ImageViewer组件；
  增加vite-plugin-webworker-service插件支持线程；
  升级依赖库

- 20240221
  升级依赖库版本;
  升级@quasar/app-vite，依赖Vite 5版本;
  使用Prettier配置格式化代码
  修改相关配置
- 20231220
  引入workerpool库和修改相关配置；
  解决打包时tsx组件报错问题
- 20231219
  更新依赖库版本；
  调整部分组件位置

- 20230416
  初始版本：解决依赖 vite 插件和 build 问题
