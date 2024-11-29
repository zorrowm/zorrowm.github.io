<template>
  <div class="GeoImageLayer">
这是 ImageStatic图层使用示例
  </div>
</template>

<script setup lang="ts">
import {ref,onMounted,onUnmounted} from 'vue';
import {Global} from 'xframelib';
import { XMap } from 'xgis-ol';
import ImageStatic from 'ol/source/ImageStatic';
import {Image as ImageLayer} from 'ol/layer';

//参考官方示例：https://openlayers.org/en/latest/examples/reprojection-image.html
let imageLayer:ImageLayer;
onMounted(()=>{
 const xmap=Global.XMap as XMap;
  const imageExtent = [273137.343,6243935.64,276392.16,6245428.14];
  imageLayer = new ImageLayer({source:new ImageStatic({
    url:'./SampleData/IGNF_PVA_1-0__1976-03-24_pt.jpg',
    crossOrigin: '',
    projection: 'EPSG:3857',
    imageExtent: imageExtent,
    interpolate: false,
  })});
  xmap.map.addLayer(imageLayer);
});

onUnmounted(()=>{
  if(imageLayer)
  {
      const xmap=Global.XMap as XMap;
      xmap.map.removeLayer(imageLayer);
  }

});

</script>

<style scoped>
.GeoImageLayer
{
  position: absolute;
  left:30px;
  top:30px;
  font-weight: 600;
  background-color: #eee;
}

</style>