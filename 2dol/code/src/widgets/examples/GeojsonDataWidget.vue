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

let geojsonLayer:VectorLayer;
onMounted(()=>{
    const xmap=Global.XMap as XMap;
     
    const  vectorSource = new VectorSource({
                url: './SampleData/china.json',
                format: new GeoJSON(),
            });

          geojsonLayer= new VectorLayer({
            source: vectorSource,
          });
          if(geojsonLayer)
          xmap.map.addLayer(geojsonLayer as any);
});

onUnmounted(()=>{

    if(geojsonLayer)
    {
        Global.XMap.map.removeLayer(geojsonLayer);
    }

});

</script>
