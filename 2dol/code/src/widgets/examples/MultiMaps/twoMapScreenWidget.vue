<template>
    <div id="map2" class="mapstyle"></div>
</template>

<script lang="ts" setup>
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import { onMounted, onUnmounted } from 'vue';
import { Global } from 'xframelib';
import { XMap } from 'xgis-ol';
import "xgis-ol/dist/index.css";


let xmap: XMap;
let mapContainer:any;
onMounted(()=>{
    console.log('加载了55555555')
     mapContainer=document.getElementById("map");
     mapContainer.style.left="50%"
     mapContainer.style.width="50%"
    // const layoutManager=Global.LayoutMap.get('bigScreenLayout');
    // layoutManager?.splitTwoContainer(false);

   //地图初始化
    xmap = new XMap('map2','map');
  
    xmap.initMapView({
        "zoom":5,
        "center":[116.46229441189399, 40.24876149],
        "minZoom":1,
        "maxZoom":22,
        "projection":"EPSG:3857"
     });
         //  if(idRef.value==='map2'||idRef.value==='map4')
         xmap.map.addLayer(new TileLayer({source:new OSM()}))
    //  else{
    //     xmap.addOnlineLayer("vec_w");
    //     xmap.addOnlineLayer("cva_w");
    //  }
     xmap.enableMapSyncView();

     const xmap0=Global.XMap as XMap;
     xmap0.enableMapSyncView();
});

onUnmounted(()=>{
    // const layoutManager=Global.LayoutMap.get('bigScreenLayout');
    // layoutManager?.splitTwoContainer(true);
    if(mapContainer)
    {
        mapContainer.style.left="0";
        mapContainer.style.width="100%"
    }
    if(xmap)
    xmap.disableMapSyncView();
    const xmap0=Global.XMap as XMap;
    if(xmap0)
    xmap0.disableMapSyncView();
})



</script>

<style scoped>
.mapstyle {
    background: #c3c3c3;
    width: 50%;
    height: 100%;
    border: 1px solid #c3c3c3;
}

</style>