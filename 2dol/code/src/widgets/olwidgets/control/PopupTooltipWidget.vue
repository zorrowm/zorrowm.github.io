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
import { XMap,PrjGridTool } from "xgis-ol";
import {Select} from 'ol/interaction';
import Popup   from 'ol-ext/overlay/Popup';

let geojsonLayer:VectorLayer;
let select:Select;
let popup=new Popup();
onMounted(()=>{
  const xmap=Global.XMap as XMap;
  xmap.map.addOverlay(popup);
  popup.setClosebox(true);
  popup.setPositioning("bottom-center");
  
  const  vectorSource = new VectorSource({
              url: 'SampleData/china.json',
              // projection: 'EPSG:4326',
              format: new GeoJSON(),
          });

        geojsonLayer= new VectorLayer({
          source: vectorSource,
          
        });
        if(geojsonLayer)
        xmap.map.addLayer(geojsonLayer as any);



  // Control Select 
   select = new Select();
  xmap.map.addInteraction(select);

  // On selected => show/hide popup
  select.getFeatures().on(['add'], function(e) {
    var feature = e.element;
    var content = "";
    content += feature.get("name");
    const center= feature.get("center");
    popup.show(PrjGridTool.fromLonLat(center,xmap.MapView.getProjection()), content); 
  });
  select.getFeatures().on(['remove'], function(e) {
    popup.hide(); 
  })

});

onUnmounted(()=>{

  const xmap=Global.XMap as XMap;
  if(xmap&&geojsonLayer)
  {
      xmap.map.removeLayer(geojsonLayer);
      if(select)
      xmap.map.removeInteraction(select);
  }

});

</script>
