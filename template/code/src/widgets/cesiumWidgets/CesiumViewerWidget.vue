<template>
  <div id="cesiumContainer" style="width: 100vw; height: 100vh"></div>
</template>
<script lang="ts">
import * as Cesium from 'cesium';
import { EmitMsg } from 'src/events';
import SystemsEvent from 'src/events/modules/SystemsEvent';
import { defineComponent, onMounted } from 'vue';
import { Global } from 'xframelib';
import { XViewer,Position,TerrainFactory } from 'xgis-cesium';
export default defineComponent({
  setup() {
    Cesium.Camera.DEFAULT_VIEW_FACTOR = 0.4;
    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(108, 10, 116, 60);
    //(116.05, 36.2548, 116.493, 36.4362);//
    // Cesium.Ion.defaultAccessToken = Global.Config.MapKeys?.CesiumKey;

    //参考：https://github.com/zorrowm/CesiumOfflineCache
    if (Global.Config.Enables.CesiumOfflineCache) {
      (window as any).CesiumOfflineCache?.ruleList?.add('*');
    }
    //初始化地球
    function initCesiumViewer() {

      try {
        //https://cesium.com/learn/cesiumjs/ref-doc/Viewer.html#.ConstructorOptions
        const viewer = new XViewer('cesiumContainer', {
          animation: false, //是否创建动画小器件，左下角仪表
          baseLayerPicker: false, //是否显示图层选择器
          fullscreenButton: false, //是否显示全屏按钮
          geocoder: false, //是否显示geocoder小器件，右上角查询按钮
          homeButton: false, //是否显示home按钮
          infoBox: false, //是否显示信息框
          sceneModePicker: false, //是否显示3D/2D选择器
          selectionIndicator: false, //是否显示选取指示器组件 鼠标绿色框
          timeline: false, // 是否显示时间轴
          navigationHelpButton: false, // 是否显示右上角的帮助按钮
          vrButton: false, // 是否显示双屏
          scene3DOnly: true, // 如果设置为true,则所有几何图形以3d模式绘制以节约gpu资源
          fullscreenElement: document.body, //全屏时渲染的html元素
          navigationInstructionsInitiallyVisible: false,
          contextOptions: {
            // cesium状态下允许canvas转图片convertToImage
            webgl: {
              alpha: false,
              depth: false,
              stencil: true,
              antialias: true,
              premultipliedAlpha: true,
              preserveDrawingBuffer: true, //通过canvas.toDataURL()实现截图需要将该项设置为true
              failIfMajorPerformanceCaveat: false
            },
            //https://juejin.cn/post/7265042701065437220
            // requestWebgl1: false,
          },
          //https://cesium.com/learn/cesiumjs/ref-doc/CesiumWidget.html?classFilter=CesiumWidget
          //https://cesium.com/blog/2018/01/24/cesium-scene-rendering-performance/
          requestRenderMode: true,//优化性能，需要主动触发更新   scene.requestRender();
          targetFrameRate: 60,
          orderIndependentTranslucency: true,
          automaticallyTrackDataSourceClocks: false,
          dataSources: undefined,
          terrainShadows: Cesium.ShadowMode.DISABLED,
          //是正确的
          baseLayer: false,
          // terrainProvider: await Cesium.createWorldTerrainAsync({
          //      requestVertexNormals: true,
          //      requestWaterMask: true,     // 动态水流
          // }),
          //默认地形-无地形
          terrainProvider: new Cesium.EllipsoidTerrainProvider(),
        });
        //针对0.0.1初始版本
        viewer['delegate']=viewer;
        //统一进行Viewer配置
        viewer.setOptions({
          globe: {
            showGroundAtmosphere: false,  // 水雾特效
            depthTestAgainstTerrain: false,//是否开启地形深度检测
          },
          showAtmosphere: false,
          showMoon: false,
          showSun: false,
          showFog: false,
          enableFxaa: true,//抗锯齿
          skyBox: {
            show: false
          }
        });
        viewer.clock.currentTime = Cesium.JulianDate.fromDate(new Date());
        //取消版权图表
        viewer.cesiumWidget.creditContainer.style.display = 'none';

        //调整画面精细度
        //https://cesium.com/learn/cesiumjs/ref-doc/FeatureDetection.html?classFilter=FeatureDetection
        //已经不支持：Cesium.FeatureDetection.supportsImageRenderingPixelated()错误
        if (viewer.cesiumWidget._supportsImageRenderingPixelated) {
          //判断是否支持图像渲染像素化处理
          viewer.resolutionScale = window.devicePixelRatio;//默认值为1.0
        }
        return viewer;
      }
      catch (error) {
        Global.Message.err('Cesium Viewer初始化失败！');
        Global.Logger().error('Cesium Viewer初始化失败', error);
      }
      return undefined;
    }
    onMounted(() => {
      Global.CesiumViewer = initCesiumViewer();
      if (Global.CesiumViewer) {
        const xviewer = Global.CesiumViewer as XViewer;
        const terrain = TerrainFactory.createUrlTerrain({
      url: 'http://data.marsgis.cn/terrain'
      });
    
        //地形
        xviewer.setTerrain(terrain);
        //默认单张图片，作为底图
        xviewer.setBasicLayer('ARCGIS_IMG');
        // xviewer.flyToPosition(new Position(116.2698, 36.3475, 203,5.69,-26.2,360));
       
        xviewer.Weather.rain.enable=true;
        setTimeout(() => {
          xviewer.Weather.rain.destroy();
          xviewer.scene.requestRender();
        }, 5000);
      }
      //已经加载成功
      EmitMsg(SystemsEvent.CesiumWidgetLoaded, 'CesiumWidgetLoaded');
    });
  }
});
</script>
