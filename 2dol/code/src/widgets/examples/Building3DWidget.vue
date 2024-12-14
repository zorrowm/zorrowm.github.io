<template>
    <div>

    </div>
</template>

<script setup lang="ts">
import GeoJSON from "ol/format/GeoJSON.js";
import { Vector as VectorLayer } from "ol/layer.js";
import { Vector as VectorSource } from "ol/source.js";
import { onMounted, onUnmounted } from 'vue';
import { Global } from 'xframelib';
import { XMap } from "xgis-ol";
import render3D from 'ol-ext/layer/Render3D';

let geojsonLayer:VectorLayer;
onMounted(()=>{
    const xmap=Global.XMap as XMap;
     
    const  vectorSource = new VectorSource({
                url: 'SampleData/ignf.json',
               format: new GeoJSON({dataProjection:"EPSG:3857"}),
            });

          geojsonLayer= new VectorLayer({
            source: vectorSource,
            maxResolution:2
          });
   const r3D = new render3D({
    /** /
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'blue',
        width: 2
      }),
      fill: new ol.style.Fill({ color: 'red' })
    }),
    /**/
    // ghost: true,
    height:5, 
    maxResolution:0.6, 
    defaultHeight:3.5 
  });
  //@ts-ignore
  geojsonLayer.setRender3D(r3D);
          if(geojsonLayer)
          xmap.map.addLayer(geojsonLayer as any);
          xmap.MapView.setCenter([-245406, 5986536]);
          xmap.MapView.setZoom(18);
});

onUnmounted(()=>{

    if(geojsonLayer)
    {
        Global.XMap.map.removeLayer(geojsonLayer);
    }

});

</script>
