<template>
    <div class="mapboxgl-ctrl mapboxgl-ctrl-group" id="customMeasurePanel">
        <q-btn class="btnSize" color="white" icon="mdi-ruler" @click="StartMeasure(MapMeasureType.linestring)"/>
        <q-btn class="btnSize" color="white" icon="mdi-ruler-square" @click="StartMeasure(MapMeasureType.polygon)"/>
        <q-btn class="btnSize" color="white" icon="delete" @click="RemoveMeasure()"/>
    </div>
</template>
 
<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';
import { Global } from "xframelib";
import MapMeasureTool,{MapMeasureType  }from "src/widgets/map/MapMeasureTool";

let map;

let customList = [
    {
        id: 'customMeasurePanel',
        local: 'mapboxgl-ctrl-top-right'
    },
]

function customElementAppend() {
    if (customList && customList.length) {
        customList.forEach(item => {
            const element = document.getElementById(item.id);
            if (element) {
                element.parentElement?.removeChild(element);
                setTimeout(() => {
                    document.getElementsByClassName(item.local)[0].appendChild(element);
                }, 500);
            }
        })
    }
}

function StartMeasure(type:MapMeasureType){
    if (!map) {
        Global.Message.info('地图未初始化');
        return
    }
    MapMeasureTool.StartMeasure(map,type);
}
function RemoveMeasure(){
    if (!map) {
        Global.Message.info('地图未初始化');
        return
    }
    MapMeasureTool.RemoveMeasure(map);
}

onMounted(() => {
    //加载时处理
    if (Global.map) {
        map = Global.map;

        customElementAppend();
        // AddMeasureSource();
    }
})
onUnmounted(() => {
    //卸载时处理

})

</script>
<style lang="scss" scoped>

.btnSize {
    height: 29px;
    width: 29px;
    min-height: 0px;
    color: rgb(54, 54, 54) !important;
}
</style>