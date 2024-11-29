<template>
    <q-btn-group push>
      <q-btn push label="导航组件" />
      <q-btn push label="定位组件" />
      <q-btn push label="比例尺组件" />
      <q-btn push label="搜索组件" />
      <!-- <q-btn push label="鹰眼组件" /> -->
      <q-btn push label="全屏组件" />
    </q-btn-group>
</template>

<script lang="ts" setup>
import { ref,  onMounted, onUnmounted } from 'vue';
import { Global } from 'xframelib';
import MapTool from "./MapTool";

import {Map, NavigationControl,GeolocateControl,ScaleControl,FullscreenControl } from "mapbox-gl";

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

// import mapboxgl from "mapbox-gl";
// import Minimap from '@aesqe/mapboxgl-minimap';

let map:Map

let navigation;
let location;
let scaleControl;
let geocoder;
let fullscreen;
let minimap;

onMounted(() => {
    //加载时处理
    if (Global.map) {
        map =  Global.map;

        //导航组件
        navigation =new NavigationControl();
        map.addControl(navigation,'top-right')

        //定位组件
        // location=new GeolocateControl();
        // map.addControl(location,'top-right')

        //比例尺组件
        scaleControl = new ScaleControl({
            unit:'metric'
        });
        map.addControl(scaleControl, 'bottom-left');

        //地名搜索组件
        //mapbox-gl-geocoder
        geocoder = new MapboxGeocoder({
            accessToken: MapTool.accessToken
        });
        map.addControl(geocoder,'top-left');

        // ��眼组件
        //mapbox-minimap
        // minimap = new Minimap({
        //     mapboxApiAccessToken: MapTool.accessToken
        // });
        // map.addControl(minimap);

        // 全屏组件
        fullscreen = new FullscreenControl();
        map.addControl(fullscreen, 'top-right');
    }
})
onUnmounted(() => {
    //卸载时处理

})
</script>
<style lang="scss" scoped>

</style>