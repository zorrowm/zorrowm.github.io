<template>
    <div class="MainMapWidget">
        <div id="map" class="mapstyle">
        <ZoomFullBar :xmap="mapRef" :hasLayerTree="hasLayerTree" class="q-gutter-y-xs  xmap-zoombar" />
        <ContextMenu :xmap="mapRef" :target="'map'" :moreMenuList="menuList" @itemClicked="doItemClick"></ContextMenu>
        </div>
        <div class="layerTreeContainer" v-show="isLayerTreeShow">
            <LayerTree  :xmap="mapRef" :moreContextMenu="contextMenuList" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed,onMounted, ref } from 'vue';
import { Global, requestGet } from 'xframelib';
import { PrjGridTool, XMap, ZoomFullBar,ContextMenu,IMapContextItem,LayerTree } from 'xgis-ol';
import 'xgis-ol/dist/index.css';

const mapRef=ref<XMap>();
const hasLayerTree=ref(false);

const menuList:Array<IMapContextItem> = [
{},
{

    id: 'other',
    label: '更多功能',
    icon: 'ic:round-other-houses'
},

{
    id: 'test',
    label: '测试功能',
    icon: 'ic:twotone-10k'
}
]

const contextMenuList = [
  {},
  {
    name: "测试一下",
    icon: "gis:layer-up",
    value: "upMove2",
  },
  {
    name: "Test",
    icon: "gis:layer-down",
    value: "downMove2",
  }

];
function doItemClick(item)
{
    Global.Message.info('点击了菜单：' + item.label);
}

const isLayerTreeShow=computed(()=>mapRef.value&&mapRef.value.mapMenuState.layerTree);

onMounted(async () => {
    const configResult = await requestGet('', 'DefaultMapConfig.json').catch(ex => {
        Global.Message.warn('加载地图初始化配置DefaultMapConfig.json失败！' + ex.Message);
    })
    //地图-初始化参数
    const mapConfig = configResult.data;
    if (mapConfig.projInfo) {
        mapConfig.viewOptions.Projection = PrjGridTool.getProjection(mapConfig.projInfo);
    }
    //地图初始化
    const xmap = XMap.initByMapConfig(mapConfig);
    mapRef.value=xmap;
    hasLayerTree.value=!!xmap.LayerManager;
    //全局绑定地图
    Global.XMap = xmap;
});
</script>

<style lang="scss" scoped>
.MainMapWidget {
    position: absolute;
    left: 0px;
    top: 0px;
    bottom: 0px;
    right: 0px;
}

#map {
    position: relative;
    width: 100%;
    height: 100%;
 .xmap-zoombar
 {
    position: absolute;
    left:10px;
    bottom:80px;
 }
}

:deep(.ol-scale-line)
{
    bottom:18px;
}

:deep(.ol-mouse-position) {
    position: absolute;
    top: unset;
    left: 8px;
    bottom: -2px;
    z-index: 10;
}
.layerTreeContainer
{
    position: absolute;
    left:5px;
    top:5px;
    width: 310px;
    height: 500px;
    background-color: #ddd;
    padding-right: 10px;
    padding-left: 5px;
    font-size: 14px;
}
</style>