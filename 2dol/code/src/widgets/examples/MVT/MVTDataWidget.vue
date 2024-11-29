<template>
    <div class="rightPanel">
        <h4>拖拽MVT瓦片预览（支持EPSG:4326 或 EPSG:3857的MVT瓦片数据）</h4>
        <span>{{infoContent}}</span>
        <!-- <q-btn color="primary" label="加载/移除网格层"  @click="doClick"/> -->
    </div>

   </template>
   
   <script setup lang="ts">
   import { GPX, GeoJSON, IGC, KML, MVT, TopoJSON } from 'ol/format';
import {
    DragAndDrop
} from 'ol/interaction';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { onMounted, onUnmounted, ref } from 'vue';
import { Global } from 'xframelib';
import { XMap,PrjGridTool } from 'xgis-ol';
   const infoContent=ref('')

   let mvtLayer:any;

const dragAndDropInteraction = new DragAndDrop({
  formatConstructors: [MVT, GPX, GeoJSON, IGC, KML, TopoJSON],
});


const displayFeatureInfo = function (pixel) {
  const features = [];
  const xmap=Global.XMap as XMap;
  xmap.map.forEachFeatureAtPixel(pixel, function (feature) {
    features.push(feature);
  });
  if (features.length > 0) {
    const info = [];
    let i, ii;
    for (i = 0, ii = features.length; i < ii; ++i) {
      const description =
       JSON.stringify(features[i].getProperties()) ;
      if (description) {
        info.push(description);
      }
    }
    infoContent.value= info.join(', ') || '&nbsp';
  } else {
    infoContent.value= '&nbsp;';
  }
};

   onMounted(()=>{
     if(Global.XMap)
     {
       const xmap=Global.XMap as XMap;
       xmap.map.addInteraction(dragAndDropInteraction);
       dragAndDropInteraction.on('addfeatures', function (event) {
        // console.log('要素列表：',event.features[0].getProperties());
        const vectorSource = new VectorSource({
            features: event.features//feaList,
        });
        if(mvtLayer)
        {
            xmap.map.removeLayer(mvtLayer);
        }
        mvtLayer= xmap.map.addLayer(
            new VectorLayer({
            source: vectorSource,
            }),
        );
        xmap.map.getView().fit(vectorSource.getExtent());
        });
        xmap.map.on('click', function (evt) {
        displayFeatureInfo(evt.pixel);
        });
     }
   });
   
   

   onUnmounted(()=>{
   
       if(mvtLayer)
       {
           const xmap=Global.XMap as XMap;
           xmap.map.removeLayer(mvtLayer);
       }
   })
   
   </script>
   <style lang="scss" scoped>
  .rightPanel{
    position:absolute;
    right:10px;
    top:20px;

  }
  </style>