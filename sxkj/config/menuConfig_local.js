const menuConfig2D = [
  {
    name: '本地开发资源',
    icon: 'icon-Lab',
    key: 'onlineTool',
    children: [
      {
        name: 'GIS开发库资源',
        key: 'onlineTileLayer',
        children: [
		 {
            name: 'OpenLayers开发API',
            icon: '/img/menuConfig/openlayers.png',
            path: 'http://openlayers.ysgis.com',
            info: 'Mapbox官方API开发文档'
          },
		   {
            name: 'Mapbox开发文档',
            icon: '/img/menuConfig/mapboxapi.png',
            path: 'https://docs.mapbox.com/mapbox-gl-js/style-spec/',
            info: 'Mapbox官方API开发文档'
          },
          {
            name: '天地图数据API',
            icon: '/img/menuConfig/tdtapi.png',
            path: 'http://lbs.tianditu.gov.cn/server/MapService.html',
            info: '天地图地图服务资源列表'
          },
          {
            name: 'Cesium开发API',
            icon: '/img/menuConfig/cesiumAPI.png',
            path: 'https://cesium.com/learn/cesiumjs/ref-doc/',
            info: 'Cesium官方API开发文档'
          },

        ]
      }
    ]
  }
];

// window.menus = menuConfig2D;
export default menuConfig2D;
