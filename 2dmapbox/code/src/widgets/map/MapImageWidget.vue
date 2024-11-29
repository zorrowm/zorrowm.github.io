<template></template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Map } from "mapbox-gl";
import { Global } from 'xframelib';

let map: Map;

let source;
function AddImageSource(url) {
    if (!map) {
        return;
    }
    if (!url) {
        url = ''
    }
    if (!source) {
        source = {
            type: 'image',
            url: url,
            coordinates: [
                [116.35877952135877, 39.90068646711006],
                [116.53160340927508, 39.900412707058734],
                [116.5312221498886, 39.796162259494395],
                [116.35896250008511, 39.796502647261065]
            ]
        }
        map.addSource('ImageTestSource', source);

        //也需要添加图层
        map.addLayer({
            id: 'image-layer',
            type: 'raster',
            source: 'ImageTestSource',
            paint: {},
            layout: {
                visibility: 'visible'
            }
        });

    }
}
onMounted(() => {
    //加载时处理
    if (Global.map) {
        map = Global.map;

        AddImageSource('img/global.jpg')
    }
})
onUnmounted(() => {
    //卸载时处理

})
</script>
<style lang="scss" scoped></style>