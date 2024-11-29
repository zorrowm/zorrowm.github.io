<template>
    <XMapView
      :hasLayerTree="true"
      :viewHeight="layoutContentHeight"
      :viewProjection="viewProjectionRef"
      :viewWidth="layoutContentWidth"
      :initTDTLayers="['vec_c','cva_c']"
      @mapInited="mapInitedHandler"
      v-if="enableXMap"
    >
      <template #mapLeftPanelGroup>
        <div class="datapanel" v-show="dataPanelVisible">
          <slot name="dataPanel"></slot>
        </div>
      </template>
      <template #extendMenuGroup>
        <div style="position: relative">
          <SwipeToolBar :xmap="mapRef" />
        </div>
        <div style="position: relative; margin-top: 10px">
          <OtherTool
            :xmap="mapRef"
            @drag-box-feature="dragSearchHandler"
          ></OtherTool>
        </div>
      </template>
    </XMapView>
    <div class="prjSelectBar q-gutter-sm">
      <q-radio v-model="PrjValue" val="C" label="经纬度" @update:model-value="prjChageHandler"     />
      <q-radio v-model="PrjValue" val="W" label="墨卡托" @update:model-value="prjChageHandler"      />
    </div>
  </template>
  
  <script lang="ts">
  import {
    computed,
    defineComponent,
    onBeforeUnmount,
    onMounted,
    ref
} from "vue";
import { useRoute } from "vue-router";
import { Global, H5Tool } from "xframelib";
import {
    DrawFeatureTool,
    MapEvent,
    MapEventBus,
    SwipeToolBar,
    XMap,
    XMapView,
    mapMenuState
} from "xgis-ol";
import OtherTool from "./otherTool.vue";
import 'xgis-ol/dist/index.css';
  
  export default defineComponent({
    name: "xViewContainer",
    props: {},
    components: {
      SwipeToolBar,
      XMapView,
      OtherTool,
    },
    setup(props, { attrs, slots, emit }) {
      //当前图层的信息
      const layoutContentHeight = ref(document.body.clientHeight);
      const layoutContentWidth = ref(document.body.clientWidth);
      const currentRoute = useRoute();
      const viewProjectionRef = ref<string | any>();
      const prjOptions = [
        { label: "经纬度", value: "C" },
        { label: "墨卡托", value: "W" },
      ];
  
      const PrjValue = ref<string>("C");
      const enableXMap = ref(true);
      //获取路由参数
      const serviceID = currentRoute.query.id as string;
      const serviceType = currentRoute.query?.type?.toString();
      //必须要有
      const mapRef = ref();
      let wmtsRes: any;
      let xMap: XMap;
      function changeOpacity(val) {
        console.log(val, "rrrrrr");
      }
      function mapInitedHandler(res) {
        xMap = res.xmap;
        mapRef.value = xMap; //必须要有
        //全局存储
        Global.xMap = res.xmap;
  
        MapEventBus.eventOn(MapEvent.LAYER_OPACITY_CHANGED, changeOpacity);
  
        if (wmtsRes) {
          const layerName = serviceType + ":" + serviceID;
          const wmtsLayer = xMap.WMTSTool.addWMTSLayerSelf(wmtsRes, layerName);
          const debugLayer = xMap.WMTSTool.addWMTSDebugLayer(wmtsLayer);
          debugLayer.setVisible(false);
          //保存Debug图层
          Global.DebugLayer = debugLayer;
          //绘制图层
          Global.DrawFeatureTool = new DrawFeatureTool(xMap);
        }
      }
      function zoomToExtent(extent) {
        if (xMap) {
          xMap.zoomToExtent(extent);
        }
      }
      let defaultPrjValue: string = "C";
      let defaultPrjObj: Projection;

      onMounted(() => {
        H5Tool.windowResizeHandler(() => {
          layoutContentHeight.value = document.body.clientHeight;
          layoutContentWidth.value = document.body.clientWidth;
        });
      });
      //释放资源
      onBeforeUnmount(() => {
        let map = xMap?.map;
        if (map) {
          map.dispose();
        }
      });
  
      const dataPanelVisible = computed(() => {
        return mapMenuState.dataPanel;
      });

  
      //批量删除
      let SelectIds: string[] = [];
      let isFinished = ref<boolean>(false);
  
      const visibleBatchDelete = computed(() => {
        return SelectIds.length > 0;
      });
      /**
       * 切换投影
       * @param e
       */
      function prjChageHandler(e) {
        const prjValue = PrjValue.value;
        if (prjValue === defaultPrjValue) viewProjectionRef.value = defaultPrjObj;
        else if (prjValue === "W") {
          viewProjectionRef.value = "EPSG:3857";
        } else {
          viewProjectionRef.value = "EPSG:4326";
        }
      }
      /**
       * 拉框查询
       * @param geojson 要素JSON
       */
      function dragSearchHandler(geojson: any) {
        const tt = serviceType === "l" ? 0 : 1;
        let isGeo = 1;
        switch (PrjValue.value) {
          case "C":
            isGeo = 1;
            break;
          case "W":
            isGeo = 0;
            break;
          default:
            const isgeoprj = defaultPrjObj.getUnits() === "degrees";
            isGeo = isgeoprj ? 1 : 0;
            break;
        }

      }
      return {
        dataPanelVisible,
        visibleBatchDelete,
        isFinished,
        mapInitedHandler,
        layoutContentHeight,
        layoutContentWidth,
        mapRef,
        viewProjectionRef,
        enableXMap,
        PrjValue,
        prjOptions,
        prjChageHandler,
        dragSearchHandler,
      };
    },
  });
  </script>
  
  <style scoped lang="scss">
  :deep(.q-radio__label)
  {
    z-index: 20;
  }
  .layerTree {
    position: absolute;
    top: 35px;
    border: 1px solid #c3c3c3;
    width: 300px;
    border-radius: 4px;
    /* z-index: 10; */
    font-size: 14px;
  }
  
  .datapanel {
    position: absolute;
    top: 35px;
    width: 300px !important;
    min-height:300px;
    border-radius: 4px;
    border: 1px solid #c3c3c3;
    font-size: 14px;
    background-color: rgba(255, 255, 255, 1);

  }
  
  .serviceName {
    font-weight: 600;
    font-size: 16px;
    margin-right: 10px;
  }
  
  .btn {
    cursor: pointer;
  }
  
  
  :deep(.ol-zoom) {
    display: none;
  }
  .prjSelectBar {
    float: right;
    margin-top: -55px;
  }
  </style>
  