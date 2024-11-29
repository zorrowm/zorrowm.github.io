<template>
    <div class="MainMapWidget">
        <div id="map" class="mapstyle">
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted,onUnmounted } from 'vue';
import MainMapConfig from './MainMapConfig.json';
import { Global } from 'xframelib';
import { XMap, IProjInfo, PrjGridTool, WMTSTool, MapEvent, MapEventArgs } from 'xgis-ol';
import 'xgis-ol/dist/index.css';
import { IMapConfig } from 'src/models/IMapConfig';
import {OSM} from 'ol/source';
import TileLayer from 'ol/layer/Tile';
onMounted(() => {
    //地图-初始化参数
    const mapConfig = MainMapConfig as IMapConfig;
    //地图初始化
    const xmap = new XMap(mapConfig.id, mapConfig.group, mapConfig.hasLayerManager);
    if (mapConfig.projInfo) {
        mapConfig.viewOptions.Projection = PrjGridTool.getProjection(mapConfig.projInfo);
    }
    xmap.initMapView(mapConfig.viewOptions);

    if (mapConfig.layers) {
      if (mapConfig.isInternet === false) xmap.isInternet = false;
      mapConfig.layers.forEach((layerID) => {
        if (xmap.isInternet) xmap.addOnlineLayer(layerID);
        else
          xmap.addOnlineLayer(
            layerID,
            mapConfig.tdtXYZLocalURL??""
          );
      });
    }
    // xmap.map.addLayer(new TileLayer({source:new OSM()}))
    //全局绑定地图
    Global.XMap = xmap;
});
onUnmounted(()=>{
});

</script>

<style lang="scss" scoped>
.MainMapWidget
{
    position:absolute;
    left:0px;
    top:0px;
    bottom: 0px;
    right:0px;
}
#map {
    position: relative;
    width: 100%;
    height: 100%;
}
:deep(.xmap-position) {
    left:calc(50% - 250px);
    text-align: center;
}
</style>