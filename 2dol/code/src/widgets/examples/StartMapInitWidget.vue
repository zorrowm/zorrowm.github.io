<template>
    <div id="map"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { XMap } from 'xgis-ol';
import 'xgis-ol/dist/index.css';
import {Tile} from 'ol/layer';
import {OSM} from 'ol/source';
onMounted(() => {
    const xmap = new XMap('map', 'mapGroupName');
    xmap.initMapView({
        zoom: 5,
        center: [116.46229441189399, 40.24876149],
        minZoom: 1,
        maxZoom: 22,
        projection: "EPSG:4326",
    });
    xmap.map.addLayer(new Tile({source:new OSM()}))
});
</script>
<style scoped>
#map {
    width: 100%;
    height: 100vh;
}
</style>