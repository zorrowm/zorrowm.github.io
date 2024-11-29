<template>
    <div id="comparison-container">
        <div id="before" class="map"></div>
        <div id="after" class="map"></div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';
import MapTool,{TDTBaceMapType} from "./MapTool";
import { Map } from "mapbox-gl";
import Compare  from "mapbox-gl-compare";
import "mapbox-gl-compare/dist/mapbox-gl-compare.css";

let beforeMap:Map;
let afterMap:Map;
function Init() {
    const mapstyle =MapTool.GetTDTBaseStyle([116.383125473,39.9114357],TDTBaceMapType.TDT_Img);
    beforeMap = new Map({
        container: 'before',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: mapstyle,
        center: [116.383125473,39.9114357],
        zoom: 5,
        accessToken: MapTool.accessToken,
    });

    const mapstyle2 =MapTool.GetTDTBaseStyle([116.383125473,39.9114357],TDTBaceMapType.TDT_Vec);
    afterMap = new Map({
        container: 'after',
        style: mapstyle2,
        center: [116.383125473,39.9114357],
        zoom: 5,
        accessToken: MapTool.accessToken,
    });

    // A selector or reference to HTML element
    const container = '#comparison-container';

    const map = new Compare(beforeMap, afterMap, container, {
        // Set this to enable comparing two maps by mouse movement:
        // mousemove: true
        // orientation: 'vertical'
    });
}

onMounted(() => {
    //加载时处理
    Init();
})
onUnmounted(() => {
    //卸载时处理
    if (beforeMap) {
        beforeMap.remove();
        afterMap.remove();
    }
})
</script>
<style lang="scss" scoped>
.map {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
}
</style>