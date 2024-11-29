//概览图
<template>
    <div class="overviewContanier" >
        <div v-show="isShow" id="overview"></div>
        <!-- <q-icon class="btn" :name="iconName" @click="toggleShow"></q-icon> -->
    </div>
</template>
  
<script setup lang="ts">
import { Map } from 'mapbox-gl';
import { onMounted, onUnmounted, ref } from 'vue';
import { Global } from 'xframelib';


const mapid = 'overview';
let overviewMap: Map;

function onDragZoomHandler() {
    if (!overviewMap) return;
    const zoom = Global.map.getZoom();
    const zoom2 = overviewMap.getZoom();
    if (zoom2 != zoom - 3)
        overviewMap.setZoom(zoom - 3);

    const center = Global.map.getCenter();
    overviewMap.setCenter(center);
    changeExtent();
}

function init() {
    if (!Global.map) return;

    const MapStyle = Global.map.getStyle();
    overviewMap = new Map({
        container: mapid,
        style: MapStyle, // stylesheet location
        center: MapStyle.center!, // starting position [lng, lat]
        zoom: MapStyle.zoom - 3, // starting zoommapstyle.zoom
        attributionControl: false,
        accessToken:'pk.eyJ1IjoiY2hyaXNuaW5nIiwiYSI6ImNrZzk3dmNveTA2cGUycXAyNXJ3bWNsOHMifQ._4oFj3iqj5yWWvbuONDYnw'
    });
    Global.overviewMap = overviewMap;
}
async function initOverview() {
    if (!Global.map) return;
    const extent = Global.map.getBounds();

    const coor = [
        [
            [extent._sw.lng, extent._ne.lat],
            [extent._ne.lng, extent._ne.lat],
            [extent._ne.lng, extent._sw.lat],
            [extent._sw.lng, extent._sw.lat],
            [extent._sw.lng, extent._ne.lat]
        ]
    ];
    const polygon = await window.turfAsync.polygon(coor);
    overviewMap.addSource('mainExtent', {
        type: 'geojson',
        data: polygon
    });
    overviewMap.addLayer({
        id: 'mainExtent',
        type: 'fill',
        source: 'mainExtent',
        paint: {
            'fill-color': 'red',
            'fill-opacity': 0.3,
            'fill-outline-color': 'red'
        },
        layout: {
            visibility: 'visible'
        }
    });
    overviewMap.scrollZoom.disable();
    overviewMap.dragPan.disable();
    overviewMap.on('mousedown', 'mainExtent', function (e) {
        overviewMap.on('mousemove', onMove);
        overviewMap.once('mouseup', onUp);
    });
    overviewMap.on('touchstart', 'mainExtent', function (e) {
        overviewMap.on('touchmove', onMove);
        overviewMap.once('touchend', onUp);
    });
    Global.map.on('drag', onDragZoomHandler);
    Global.map.on('zoom', onDragZoomHandler);
}

async function changeExtent() {
    if (!Global.map) return;
    const extent = Global.map.getBounds();
    const coor = [
        [
            [extent._sw.lng, extent._ne.lat],
            [extent._ne.lng, extent._ne.lat],
            [extent._ne.lng, extent._sw.lat],
            [extent._sw.lng, extent._sw.lat],
            [extent._sw.lng, extent._ne.lat]
        ]
    ];
    const polygon = await window.turfAsync.polygon(coor);
    if (overviewMap) {
        const sourceObj = overviewMap.getSource('mainExtent');
        const geoJsonObj = {
            type: 'FeatureCollection',
            features: [polygon]
        };
        if (sourceObj) sourceObj.setData(geoJsonObj);
    }
}

function onMove(e) {
    changeExtent();
    var coords = e.lngLat;
    var canvas = Global.map.getCanvasContainer();
    canvas.style.cursor = 'grab';
    Global.map.setCenter(coords);
}
function onUp(e) {
    overviewMap.off('mousemove', onMove);
    overviewMap.off('touchmove', onMove);
}

function LoadMap() {
    init();
    setTimeout(() => {
      initOverview();
    }, 300);
}

onMounted(() => {
    LoadMap();
});

const isShow = ref(true);
let iconName = 'keyboard_double_arrow_left';
const toggleShow = () => {
    isShow.value = !isShow.value;
    if (isShow.value) iconName = 'keyboard_double_arrow_right';
    else iconName = 'keyboard_double_arrow_left';
};
onUnmounted(() => {
    if (Global.map) {
      Global.map.off('drag', onDragZoomHandler);
      Global.map.off('zoom', onDragZoomHandler);
    }
    if (overviewMap) {
        overviewMap.remove();
        overviewMap = undefined;
    }
});
</script>
  
<style lang="scss" scoped>
.overviewContanier {
    position: absolute;
    bottom:5%;
    left: 0;
    #overview {
        width: 20rem;
        height: 20rem;
        background-color: rgba(255, 255, 255, 0.6);
        pointer-events: auto;
        border: 1px solid #333;
    }

    .btn {
        position: absolute;
        top: 0;
        right: 0;
        font-size: 1.5rem;
        padding: 0;
        pointer-events: auto;
    }
}
</style>
  