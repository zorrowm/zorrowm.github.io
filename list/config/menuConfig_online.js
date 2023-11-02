const menuConfig2D = [
  {
    name: '在线开发工具',
    icon: 'icon-Lab',
    key: 'onlineTool',
    children: [
      {
        name: '开发工具',
        key: 'devTool',
        children: [
          {
            name: 'Hprose在线测试与下载',
            icon: './img/menuConfig/hprosetest.png',
            path: 'https://zorrowm.github.io/service/#/hprose',
            info: '提供了Hprose后台服务在线测试和前端服务代码下载'
          },
          {
            name: 'WebAPI在线下载工具',
            icon: './img/menuConfig/swaggerAPI.png',
            path: 'https://zorrowm.github.io/service/#/webapi',
            info: '提供了Swagger WebAPI后台服务在线前端服务代码下载'
          }
        ]
      },
      {
        name: '在线图片工具',
        key: 'onlinePicture',
        children: [
          {
            name: '调整图片大小',
            icon: './img/menuConfig/resizeImage.png',
            path: 'https://www.iloveimg.com/zh-cn/resize-image',
            info: '在线好用的图片大小调整'
          },
          {
            name: '压缩图片',
            icon: './img/menuConfig/compressimage.png',
            path: 'https://www.iloveimg.com/zh-cn/compress-image',
            info: '在线好用的图片资源文件大小压缩'
          },
          {
            name: '图片背景透明',
            icon: './img/menuConfig/bgRemove.png',
            path: 'https://tools.kalvinbg.cn/image/bgRemover',
            info: '在线好用的图片背景透明处理'
          }
        ]
      },
      {
        name: '地图开发资源',
        key: 'onlineTileLayer',
        children: [
          {
            name: '天地图数据API',
            icon: './img/menuConfig/tdtapi.png',
            path: 'http://lbs.tianditu.gov.cn/server/MapService.html',
            info: '天地图地图服务资源列表'
          },
          {
            name: 'Cesium开发API',
            icon: './img/menuConfig/cesiumAPI.png',
            path: 'https://cesium.com/learn/cesiumjs/ref-doc/',
            info: 'Cesium官方API开发文档'
          },
          {
            name: 'Mapbox开发文档',
            icon: './img/menuConfig/mapboxapi.png',
            path: 'https://docs.mapbox.com/mapbox-gl-js/style-spec/',
            info: 'Mapbox官方API开发文档'
          },
          {
            name: 'OpenLayers开发API',
            icon: './img/menuConfig/openlayers.png',
            path: 'https://openlayers.org/en/latest/apidoc/',
            info: 'Mapbox官方API开发文档'
          }
        ]
      }
    ]
  },
  {
    name: '在线网站收集',
    icon: 'icon-a-online',
    key: 'tileLayers',
    children: [
      {
        name: '在线工具网站',
        key: 'onlineWebTool',
        children: [
          {
            name: '在线工具1',
            icon: './img/menuConfig/webonline.png',
            path: 'https://tools.kalvinbg.cn'
          },
          {
            name: 'IP138网站',
            icon: './img/menuConfig/ip138.png',
            path: 'https://ip138.com'
          }
        ]
      }
    ]
  }
];

// window.menus = menuConfig2D;
export default menuConfig2D;
