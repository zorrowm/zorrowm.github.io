<template>
    <div :id="idRef" class="mapstyle"></div>
</template>

<script lang="ts" setup>

import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import { computed, onMounted, ref } from 'vue';
import { XMap } from 'xgis-ol';
import "xgis-ol/dist/index.css"

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    index: {
        type: Number,
        default: 0
    },
    layerName: {
        type: String,
        required: true
    },
    num: {
        type: Number,
        default: 1,
        required: true
    }
});
const idRef = ref(props.id);
// const isOneShow = ref(props.id === 'map1' && props.num === 1);
const isOneShow = computed(() => {
    return props.id === 'map1' && props.num === 1;
});
let xmap: XMap;

onMounted(()=>{

        //地图初始化
        xmap = new XMap(idRef.value,'map');
  
    xmap.initMapView({
        "zoom":5,
        "center":[116.46229441189399, 40.24876149],
        "minZoom":1,
        "maxZoom":22,
        "projection":"EPSG:3857"
     });
     if(idRef.value==='map2'||idRef.value==='map4')
        xmap.map.addLayer(new TileLayer({source:new OSM()}))
     else{
        xmap.addOnlineLayer("vec_w");
        xmap.addOnlineLayer("cva_w");
     }
     xmap.enableMapSyncView();
});


</script>

<style scoped>
.timeline {
    position: absolute;
    top: 150px;
    right: 30px;
    z-index: 10;
}

.mapstyle {
    background: #c3c3c3;
    width: 100%;
    height: 100%;
    border: 1px solid #c3c3c3;
}

.rightSelect {
    position: relative;
    float: right;
    top: 10px;
    right: 20px;
    width: 120px;
    background-color: yellow;
    z-index: 4;
}

.contentSelect {
    position: absolute;
    width: 120px;
    background-color: yellow;
}

.stateline {
    position: relative;
    float: left;
    align-items: center;
    height: 20px;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.2);
    bottom: 20px;
    font-size: 14px;
    color: #a7a5a5;
    padding-left: 20px;
    line-height: 20px;
    width: 100%;
}
</style>