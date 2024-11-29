<template>
    <q-popup-proxy :model-value="visible" target="#clickMenuPopup" transition-show="flip-up" transition-hide="flip-down"
        @hide="visible = false">
        <div style="width: 150px">
            <q-list bordered separator dense>
                <q-item class="items-center" clickable v-ripple v-for="(item,index) in menuList" :key="index" @click="OperationAction(item.value)">
                    {{item.label}}
                </q-item>
            </q-list>
        </div>
    </q-popup-proxy>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Global } from 'xframelib';
import { Map } from "mapbox-gl";

const menuList=ref([
    {
        label:'查看此处坐标',
        value:-1
    },
    {
        label:'放大',
        value:0
    },
    {
        label:'缩小',
        value:1
    },{
        label:'全屏',
        value:2
    },
    {
        label:'复原',
        value:3
    }
])

const visible = ref(false);
let map: Map;

let isFull=false;
function OperationAction(type: number) {
    switch (type) {
        case -1:
            Global.Message.info(`当前点击坐标为:${clickPoint.lng},${clickPoint.lat}`,5);
            break;
        case 0:
            map.setZoom(map.getZoom() + 1);
            break;
        case 1:
            map.setZoom(map.getZoom() - 1);
            break;
        case 2:
            if (isFull) {
                document.exitFullscreen();
            }else{
                document.documentElement.requestFullscreen();   
            }
            isFull=!isFull;
            break;
        case 3:
            map.setPitch(0);
            map.setBearing(0);
            break;
        default:
            return;
    }
    visible.value = !visible.value;
}

let clickPoint;
function RightClickMenu(e) {
    var menu = document.getElementById("clickMenuPopup");
    if (menu) {
        menu.style.top =e.point.y + "px";
        menu.style.left =e.point.x+ "px";
    }
    clickPoint = e.lngLat;
    visible.value = !visible.value;
}

onMounted(() => {
    //加载时处理
    if (Global.map) {
        map = Global.map

        map.on('contextmenu', RightClickMenu);
    }
})
onUnmounted(() => {
    //卸载时处理
    if (map) {
        map.off('contextmenu', RightClickMenu);
    }
})
</script>
<style lang="scss" scoped></style>