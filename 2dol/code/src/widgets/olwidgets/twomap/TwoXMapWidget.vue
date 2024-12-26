<template>
  <div v-if="mapRef" id="map2" class="mapstyle">
    <ZoomFullBar :xmap="mapRef" :hasLayerTree="hasLayerTree" class="q-gutter-y-xs xmap-zoombar" />
    <ContextMenu :xmap="mapRef" :target="'map2'" :moreMenuList="menuList" @itemClicked="doItemClick"></ContextMenu>
    <div class="rightOptionList" v-if="options.length > 0">
      <q-option-group v-model="group" :options="options" color="primary" />
    </div>
  </div>
  <div class="layerTreeContainer" v-show="isLayerTreeShow">
    <!-- :moreContextMenu="contextMenuList" -->
    <LayerTree v-if="mapRef" :xmap="mapRef" />
  </div>
</template>

<script lang="ts" setup>
import { Global, get, isValidURL } from 'xframelib';
import { computed, onMounted, ref, onUnmounted, watch } from 'vue';
import { XMap, ZoomFullBar, ContextMenu, IMapContextItem, LayerTree } from 'xgis-ol';
import { useQuasar } from 'quasar';
import 'xgis-ol/dist/index.css';
import { useRoute } from 'vue-router';
import { MultiService } from 'src/service/imageAdmin/MultiService';
import ServiceClients from 'src/service/index';

const mapRef = ref<XMap>();
const hasLayerTree = ref(true);
const $q = useQuasar();
const menuList: Array<IMapContextItem> = [
  {},
  {
    id: 'pasteLoad',
    label: '粘贴（加载图层）',
    icon: 'ic:round-content-paste-go'
  }
];

// const contextMenuList = [
//     {},

// ];
async function doItemClick(item) {
  if (item.id === 'pasteLoad') {
    $q.dialog({
      title: '粘贴确认',
      message: `<ul style="margin-left:10px;">
            <li>影像服务名（例如：m:GuLangYu、s:test1）;</li> 
          </ul> `,
      html: true,
      cancel: true,
      persistent: true
    })
      .onOk(async () => {
        //粘贴加载影像WMTS图层
        try {
          const text = await navigator.clipboard.readText();
          console.log('Pasted content: ', text);
          if (!text) return;
          if (text[1] === ':') {
            //是影像图层名
            loadWMTSLayer(text);
          } else if (isValidURL(text)) {
            console.log('是URL地址');
          }
        } catch (err) {
          Global.Message.err('读取拷贝数据错误', err);
        }
      })
      .onCancel(() => {
        // console.log('Cancel')
      })
      .onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
  }

  // Global.Message.info('点击了菜单：' + item.label);
}

const isLayerTreeShow = computed(() => mapRef.value?.mapMenuState.layerTree);
const route = useRoute();
let xmap: XMap;
let mapContainer: any;
let layer = ''; //m:GuLangYu
const options = ref([]);
const group = ref('');
watch(
  () => group.value,
  (newValue, oldValue) => {
    if (xmap) {
      if (newValue) {
        xmap.LayerManager.changeLayerVisible('s:' + newValue, true);
      }
      if (oldValue) {
        xmap.LayerManager.changeLayerVisible('s:' + oldValue, false);
      }
    }
  }
);
//定义对象
const multiService = new MultiService(ServiceClients.ImageAdminClient);
function loadWMTSLayer(layer: string) {
  if (!layer) return;
  let metaData: any;
  get(Global.Config.ServiceURL.WMTSService + '/GetServiceBrowse', { layer }).then((res) => {
    if (res.status === 200) {
      metaData = res.data;
      //请求多时相服务——多图层
      if (layer.startsWith('m:')) {
        options.value.length = 0;
        group.value = '';
        const serviceID = layer.substring(2);
        //请求获取，多时相列表
        multiService
          .GetMultiServiceRelServiceList(serviceID, 0, 0)
          .then((res) => {
            const array: [] = res.arrayList;
            let wmtsLayer: any;
            array.forEach((item: any) => {
              options.value.push({ label: item.servicealias ?? item.servicename, value: item.servicename });
              const serviceLayer = 's:' + item.servicename;
              const tmpMetaData = { ...metaData };
              tmpMetaData.name = item.servicename;
              wmtsLayer = xmap.WMTSTool.addWMTSLayerSelf(tmpMetaData, serviceLayer);
              // if(wmtsLayer)
              // wmtsLayer.setVisible(false);
              // xmap.LayerManager.changeLayerVisible(serviceLayer,false);
            });
            if (options.value.length > 0) group.value = options.value[options.value.length - 1].value;
            // xmap.LayerManager.changeLayerVisible("s:" + group.value, true);
            //   if(wmtsLayer)
            //   wmtsLayer.setVisible(true);
          })
          .catch((ex) => {
            console.warn('多时相名称不能为空' + ex);
          });
      } else {
        const wmtsLayer = xmap.WMTSTool.addWMTSLayerSelf(metaData, layer);
      }

      const bounds = metaData.bounds;
      if (bounds) xmap.zoomToExtent(bounds);
      else {
        xmap.zoomToCenter(metaData.center, metaData.level ?? 5);
      }
    }
  });
}

onMounted(() => {
  mapContainer = document.getElementById('map');
  mapContainer.style.left = '50%';
  mapContainer.style.width = '50%';

  //地图初始化
  xmap = new XMap('map2', 'map', true);

  xmap.initMapView({
    zoom: 5,
    center: [116.46229441189399, 40.24876149],
    minZoom: 1,
    maxZoom: 22,
    projection: 'EPSG:3857'
  });
  xmap.addOnlineLayer('vec_w');
  xmap.addOnlineLayer('cva_w');
  xmap.enableMapSyncView();
  mapRef.value = xmap;
  hasLayerTree.value = !!xmap.LayerManager;
  //全局绑定地图
  Global.XMap2 = xmap;

  const xmap0 = Global.XMap as XMap;
  xmap0.enableMapSyncView();

  const qlayer = route.query.layer as string;
  if (qlayer) layer = qlayer;

  loadWMTSLayer(layer);
});

onUnmounted(() => {
  if (mapContainer) {
    mapContainer.style.left = '0';
    mapContainer.style.width = '100%';
  }
  if (xmap) xmap.disableMapSyncView();
  const xmap0 = Global.XMap as XMap;
  if (xmap0) xmap0.disableMapSyncView();
});
</script>

<style scoped>
.mapstyle {
  background: #c3c3c3;
  width: 50%;
  height: 100%;
  border: 1px solid #c3c3c3;
  position: relative;

  .xmap-zoombar {
    position: absolute;
    left: 10px;
    bottom: 80px;
  }

  .rightOptionList {
    position: absolute;
    right: 40px;
    top: 10px;
    z-index: 10;
  }
}

.layerTreeContainer {
  position: absolute;
  left: 5px;
  top: 5px;
  width: 310px;
  height: 500px;
  background-color: #ddd;
  padding-right: 10px;
  padding-left: 5px;
  font-size: 14px;
}
</style>
