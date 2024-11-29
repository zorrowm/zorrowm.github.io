<template>
</template>

<script setup lang="ts">
import { Global } from 'xframelib';
import { XMap } from 'xgis-ol';
import Overview from 'ol-ext/control/Overview';
import {ref,onMounted} from 'vue';
import {Tile} from 'ol/layer';
import {OSM} from 'ol/source'

var layers2 = [
      new Tile({	source: new OSM()	})
    ];

onMounted(()=>{
    const xmap=Global.XMap as XMap;
    const prj=xmap.MapView.getProjection();
    var ov = new Overview({
      layers: layers2,
      minZoom: 1,
      maxZoom: 12,
      rotation: true,
      align: 'right',
      projection:prj

    });
    xmap.map.addControl(ov);

})


</script>

<style scoped>

</style>