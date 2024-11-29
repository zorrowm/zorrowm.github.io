<template>
    <div id="mapContent" style="width: 100vw; height: 100vh"></div>
</template>

<script lang="ts" setup>
import { ref,  onMounted, onUnmounted } from 'vue';
import { useRoute } from "vue-router";
import { Map } from "mapbox-gl";
const route = useRoute();

onMounted(() => {
    //加载时处理
    const style=route.query?.style;
    if (style) {
        console.log(`style`,style);
        const info = JSON.parse(style.toString());
        console.log(`info`,info);
        const map = new Map({
            container: 'mapContent',
            style: info.style, // stylesheet location
            center: info.center!, // starting position [lng, lat]
            zoom: info.zoom, // starting zoommapstyle.zoom
            attributionControl: false,
            accessToken: 'pk.eyJ1IjoiY2hyaXNuaW5nIiwiYSI6ImNrZzk3dmNveTA2cGUycXAyNXJ3bWNsOHMifQ._4oFj3iqj5yWWvbuONDYnw'
        });
    }
})
onUnmounted(() => {
    //卸载时处理

})
</script>
<style lang="scss" scoped>

</style>