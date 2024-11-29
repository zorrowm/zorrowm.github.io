<template>
    <div class="statusPanel">
        <span class="q-mr-md">
            经度: {{ mapStatus.lon }}
        </span>
        <span class="q-mr-md">
            纬度:{{ mapStatus.lat }}
        </span>
        <span class="q-mr-md">
            层级: {{ mapStatus.zoom }}
        </span>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Global } from 'xframelib';

const mapStatus = ref({
    lat: 0,
    lon: 0,
    zoom: 0
})

function moveChange(e) {
    mapStatus.value.lon = e.lngLat.lng.toFixed(8);
    mapStatus.value.lat = e.lngLat.lat.toFixed(8);
}

function zoomChange(e) {
    mapStatus.value.zoom = Math.floor(e.target.getZoom());
}

onMounted(() => {
    //加载时处理
    if (Global.map) {
        const {lng, lat} = Global.map.getCenter();
        mapStatus.value.lat = lat.toFixed(8);
        mapStatus.value.lon = lng.toFixed(8);
        mapStatus.value.zoom =Math.floor(Global.map.getZoom());

        Global.map.on('mousemove',moveChange)
        Global.map.on('zoom',zoomChange)
    }
})
onUnmounted(() => {
    //卸载时处理
    if (Global.map) {
        Global.map.off('mousemove',moveChange)
        Global.map.off('zoom',zoomChange)
    }
})
</script>
<style lang="scss" scoped>
.statusPanel {
    position: absolute;
    bottom: 0%;
    background-color: rgba($color: #ffffff, $alpha: 0.5);
    color: black;
    width: 100%;
    text-align: center;
    font-size: 14px;
}
</style>