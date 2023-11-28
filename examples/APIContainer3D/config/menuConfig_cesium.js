const menuConfig2D = [
  {
    name: '三维地形',
    icon: 'icon-a-Forcedtolight1',
    key: 'terrain',
    children: [
      {
        name: '地形图层',
        key: 'terrainLayer',
        children: [
          {
            name: '地形服务',
            icon: '../examples/img/terrainservice.png',
            path: '../examples/#/?path=TerrainService.html',
            info: '地形服务'
          },
          {
            name: '地形夸张',
            icon: '../examples/img/terrainexaggeration.png',
            path: '../examples/#/?path=TerrainExaggeration.html',
            info:'地形夸张'
          }
        ]
      },
      {
        name: '地形相关分析',
        key: 'terrainExplain',
        children: [
          {
            name: '地形着色(高程，坡度，坡向，等高线)',
            icon: '../examples/img/terraincolor.png',
            path: '../examples/#/?path=TerrainColor.html',
            info:'地形着色'
          },
          {
            name: '地形效果(显示地球，地形光照等)',
            icon: '../examples/img/terraineffect.png',
            path: '../examples/#/?path=TerrainEffect.html',
            info:'地形效果'
          },
        ]
      }
    ]
  },
  {
    name: '三维Enity实体',
    icon: 'icon-a-Forcedtolight1',
    key: 'terrain',
    children: [
      {
        name: '实体Demo',
        key: 'terrainLayer',
        children: [
          {
            name: 'box',
            icon: '../examples/img/enitybox.png',
            path: '../examples/#/?path=EnityBox.html',
            info:"box"
          },
          {
            name: 'corridor',
            icon: '../examples/img/enitycorridor.png',
            path: '../examples/#/?path=EnityCorridor.html',
            info:"corridor"
          },
          {
            name: 'culinder',
            icon: '../examples/img/enitycylinder.png',
            path: '../examples/#/?path=EnityCylinder.html',
            info:"culinder"
          },
          {
            name: 'ellipse',
            icon: '../examples/img/enityellipse.png',
            path: '../examples/#/?path=EnityEllipse.html',
            info:"ellipse"
          },
          {
            name: 'ellipsoid',
            icon: '../examples/img/enityellipsoid.png',
            path: '../examples/#/?path=EnityEllipsoid.html',
            info:"ellipsoid"
          },
          {
            name: 'model',
            icon: '../examples/img/enitymodel.png',
            path: '../examples/#/?path=EnityModel.html',
            info:"model"
          },
          {
            name: 'plane',
            icon: '../examples/img/enityplane.png',
            path: '../examples/#/?path=EnityPlane.html',
            info:"plane"
          },
          {
            name: 'point',
            icon: '../examples/img/enitypoint.png',
            path: '../examples/#/?path=EnityPoint.html',
            info:"point"
          },
          {
            name: 'polygon',
            icon: '../examples/img/enitypolygon.png',
            path: '../examples/#/?path=EnityPolygon.html',
            info:"polygon"
          },
          {
            name: 'polyline',
            icon: '../examples/img/enitypolyline.png',
            path: '../examples/#/?path=EnityPolyline.html',
            info:"polyline"
          },
          {
            name: 'polylinevolume',
            icon: '../examples/img/enitypolylinevolume.png',
            path: '../examples/#/?path=EnityPolylineVolume.html',
            info:"polylinevolume"
          },
          {
            name: 'reactangele',
            icon: '../examples/img/enityreactangele.png',
            path: '../examples/#/?path=EnityReactangele.html',
            info:"reactangele"
          },
          {
            name: 'wall',
            icon: '../examples/img/enitywall.png',
            path: '../examples/#/?path=EnityWall.html',
            info:"wall"
          },
          {
            name: 'cluster',
            icon: '../examples/img/enitycluster.png',
            path: '../examples/#/?path=EnityCluster.html',
            info:"cluster"
          },
     
   
        ]
      }
    ]
  },
  {
    name: '天气效果',
    icon: 'icon-a-Forcedtolight1',
    key: 'terrain',
    children: [
      {
        name: 'Demo',
        key: 'terrainLayer',
        children: [
          {
            name: '雪',
            icon: '../examples/img/snow.png',
            path: '../examples/#/?path=Snow.html',
            info:"雪"
          },
          {
            name: '雨',
            icon: '../examples/img/rain.png',
            path: '../examples/#/?path=Rain.html',
            info:"雨"
          },
          {
            name: '天气(太阳，大气，雾...)',
            icon: '../examples/img/weather.png',
            path: '../examples/#/?path=Weather.html',
            info:"天气"
          },
          {
            name: '地球特效(阴影，光照,黑白,夜视,马赛克...)',
            icon: '../examples/img/eartheffects.png',
            path: '../examples/#/?path=EarthEffects.html',
            info:"地球特效"
          },
        ]
      }
    ]
  },
  {
    name: '3DTiles三维模型',
    icon: 'icon-a-Forcedtolight1',
    key: '3DModels',
    children: [
      {
        name: '各类3dTiles模型',
        key: '3DTilesLayer',
        children: [
          {
            name: '布达拉宫',
            icon: '..../examples/img/cardimage/budala.png',
            path: '../examples/#/?path=budalagong.html',
            info: ''
          },
          {
            name: '未来科学城',
            icon: '..../examples/img/cardimage/sciencecity.png',
            path: '../examples/#/?path=future.html',
            info: ''
          },
          {
            name: '贺兰山',
            icon: '..../examples/img/cardimage/helanshan.png',
            path: '../examples/#/?path=helanshan.html',
            info: ''
          },
        ]
      }
    ]
  },
  {
    name:'地图底图',
    icon: 'icon-a-Forcedtolight1',
    key:'baseMapLayer',
    children:[
      {
        name:'在线地图服务',
        key:'onLineMapService',
        children:[
          {
            name:'单张图片(本地离线)',
            icon:'..../examples/img/cardimage/signalimg.png',
            path:'../examples/#/?path=signalPicture.html',
            info:'',
          },
          {
            name:'天地图',
            icon:'..../examples/img/cardimage/tdt.png',
            path:'../examples/#/?path=tdtImagery.html',
            info:'',
          },
          {
            name:'高德影像',
            icon:'..../examples/img/cardimage/gd.png',
            path:'../examples/#/?path=gdImagery.html',
            info:'',
          },
          {
            name:'Bing影像',
            icon:'..../examples/img/cardimage/bing.png',
            path:'../examples/#/?path=bingImagery.html',
            info:'',
          },
          {
            name:'Mapbox影像',
            icon:'..../examples/img/cardimage/mapbox.png',
            path:'../examples/#/?path=mapboxImagery.html',
            info:'',
          },
          {
            name:'OSM标准图层',
            icon:'..../examples/img/cardimage/osm.png',
            path:'../examples/#/?path=osmLayer.html',
            info:'',
          },
          {
            name:'ArcGis影像',
            icon:'..../examples/img/cardimage/arcgis.png',
            path:'../examples/#/?path=arcgisImagery.html',
            info:'',
          }
        ]  
      }
    ]
  }
];

// window.menus = menuConfig2D;
export default menuConfig2D;
