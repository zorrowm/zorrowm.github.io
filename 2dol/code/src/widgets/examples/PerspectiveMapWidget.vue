<template>
    <div>
        <div id="map">
        </div>
        <div class="bar">
            <span>角度：</span>  <q-slider v-model="angleRef" :min="0" :max="30" color="green"/>
        </div>
    </div>

</template>

<script setup lang="ts">
import {ref, onMounted,onUnmounted,watch } from 'vue';
import {Tile} from 'ol/layer';
import {OSM} from 'ol/source';
import PerspectiveMap from 'ol-ext/map/PerspectiveMap';
import 'ol-ext/map/PerspectiveMap.css';
import 'ol/ol.css';
import View from 'ol/View';
import {
  DragRotateAndZoom,
  defaults as defaultInteractions,
} from 'ol/interaction.js';

//参考：https://viglino.github.io/ol-ext/examples/map/map.perspective.html
const angleRef=ref(0);
let map:PerspectiveMap;
watch(()=>angleRef.value,val=>{
    if(map)
    map.setPerspective(val);
})
onMounted(()=>{
  var layer = new Tile({ name:"OSM", source: new OSM() });
  
  // The map
   map = new PerspectiveMap({
    interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
    target: 'map',
    view: new View ({
      zoom: 18,
      center: [-245406, 5986536]// [-245575, 5986863], //[-244777, 5989809]
    }),
    layers: [ layer ]
  });

  map.on('change:perspective', function(e) {
    // if (!e.animating) $('#angle').val(e.angle);
    console.log('角度：',e.angle);
  })

});

</script>

<style >
    #map {
      width: 800px;
      height: 500px;
      z-index: 0;
    }
.bar {
      width:200px;
    }
</style>