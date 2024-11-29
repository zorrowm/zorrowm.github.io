<template>
    <div id="mapcontent" style="width: 100vw; height: 100vh">
        <div id="clickMenuPopup">
        </div>
        <div id="clickFeaturePopup">
        </div>
    </div>
</template>
<script setup lang="ts">
import { Map, StyleSpecification } from 'mapbox-gl';
import { EmitMsg } from 'src/events';
import MapEvent from 'src/events/modules/MapEvent';
import { onMounted, onUnmounted } from 'vue';
import { Global } from 'xframelib';
import MapTool, { TDTBaceMapType } from "./MapTool";

import "mapbox-gl/dist/mapbox-gl.css";

const mapid = 'mapcontent';

function initMap(mapstyle: StyleSpecification) {
    if (!Global.map) {
        const map = new Map({
            container: mapid,
            style: mapstyle, // stylesheet location
            center: mapstyle.center!, // starting position [lng, lat]
            zoom: mapstyle.zoom, // starting zoommapstyle.zoom
            attributionControl: false,
            accessToken: 'pk.eyJ1IjoiY2hyaXNuaW5nIiwiYSI6ImNrZzk3dmNveTA2cGUycXAyNXJ3bWNsOHMifQ._4oFj3iqj5yWWvbuONDYnw'
        });
        Global.map = map;
        Global.MapStyle = mapstyle;
        //地图已经初始化构建了
        EmitMsg(MapEvent.MainMapWidgetLoaded, map);
        map._locale['ScaleControl.Meters'] = '米';
        map._locale['ScaleControl.Kilometers'] = '千米';

    } else {
        EmitMsg(MapEvent.MainMapWidgetLoaded, Global.map);
    }
}

//初始化加载地球
onMounted(async () => {
    console.log('加载地图widget……');
    const mapstyle =MapTool.GetTDTBaseStyle([116.383125473,39.9114357],TDTBaceMapType.TDT_Img);
    initMap(mapstyle);
});

onUnmounted(() => {
    //卸载相关组件(与首页地图相关的)
    if (Global.map) {
        Global.map.remove();
        Global.map = undefined;
    }
    console.log('触发map卸载事件');
});
</script>
<style lang="scss" scoped>
#clickMenuPopup{
    position: absolute;
}
#clickFeaturePopup{
    position: absolute;
}
</style>

<style>
.mapboxgl-ctrl-bottom-left .mapboxgl-ctrl .mapboxgl-ctrl-logo{
    display:none !important;
}
</style>
