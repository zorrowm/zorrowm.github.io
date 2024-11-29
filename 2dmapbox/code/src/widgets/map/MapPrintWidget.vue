<template>
    <div class="mainPanel">
        <q-btn color="primary" label="打印" @click="PrintMap()" />
    </div>
</template>

<script lang="ts" setup>
import { ref,  onMounted, onUnmounted } from 'vue';
import { Global } from 'xframelib';
import MapTool from "./MapTool";

let map;
//地图打印
function PrintMap() {
    if (map) {
        MapTool.GetMapPrintData(map);
    }
}
onMounted(() => {
    //加载时处理
    if(Global.map){
        map = Global.map;
    }
})
onUnmounted(() => {
    //卸载时处理

})
</script>
<style lang="scss" scoped>
.mainPanel{
    position: absolute;
    right: 1%;
    top: 1%;
}
</style>