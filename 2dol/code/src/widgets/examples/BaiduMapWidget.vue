<template>
    <div class="BaiduMapWidget">
        <div id="map" class="mapstyle">
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { createBaiduMap } from 'xgis-ol';
import 'xgis-ol/dist/index.css';



onMounted( () => {

   const baiduMap= createBaiduMap('map');
//    baiduMap.setTarget('map')

});
</script>

<style lang="scss" scoped>
.BaiduMapWidget {
    position: absolute;
    left: 0px;
    top: 0px;
    bottom: 0px;
    right: 0px;
}

#map {
    position: relative;
    width: 100%;
    height: 100%;

}

</style>