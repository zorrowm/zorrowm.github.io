<template>
</template>

<script setup lang="ts">
import { SwipeToolBar,XMap } from 'xgis-ol';
import { onMounted,ref,onUnmounted } from 'vue';
import { Global,get } from 'xframelib';
import { useRoute } from 'vue-router';
import TileLayer from 'ol/layer/WebGLTile';
import TileWMS from 'ol/source/TileWMS';

const route = useRoute();
const mapRef=ref<XMap>();
let layer="s:test1";
let wmsLayer:any;

onMounted(()=>{
  if(Global.XMap)
  {
    const xmap=Global.XMap as XMap;
    const qlayer=route.query.layer as string;
    if(qlayer)
    layer=qlayer;

    wmsLayer=  new TileLayer({
    extent: [-13884991, 2870341, -7455066, 6338219],
    source: new TileWMS({
      url: 'https://ahocevar.com/geoserver/wms',
      params: {'LAYERS': 'topp:states', 'TILED': true},
      serverType: 'geoserver',
      // Countries have transparency, so do not fade tiles:
      transition: 0,
    })
    });
    xmap.map.addLayer(wmsLayer);
    xmap.MapView.setCenter([-10997148, 4569099]);

  }
});
onUnmounted(()=>{

    if(wmsLayer)
    {
        const xmap=Global.XMap as XMap;
        xmap.map.removeLayer(wmsLayer);
    }
})




</script>