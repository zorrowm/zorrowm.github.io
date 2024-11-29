<template>
    <div class="swipeMapWidget">
        <button @click="changeSwipeType">切换卷帘类型</button>
    </div>
</template>

<script setup lang="ts">
import { EnumSwipeType, RollSwipe, XMap } from 'xgis-ol';
import { ref, onMounted, onUnmounted } from 'vue';
import { Global } from 'xframelib';

let swipe: RollSwipe;
const swipetype = ref(EnumSwipeType.RollHorizonl);
function changeSwipeType(){
    const xmap = Global.XMap as XMap;
    const mapdiv = document.getElementById(xmap.target);
    if (swipetype.value === EnumSwipeType.RollHorizonl) {
        swipetype.value = EnumSwipeType.RollVertical;
        if(mapdiv)
        mapdiv.style.cursor = "n-resize";
        //   mapstyle.value = 'cursor: n-resize;' + defaultmap;
    } else {
        swipetype.value = EnumSwipeType.RollHorizonl;
        if(mapdiv)
        mapdiv.style.cursor = "w-resize";
        //   mapstyle.value = 'cursor: w-resize;' + defaultmap;
    }
    swipe.changeSwipeType(swipetype.value);
};
onMounted(() => {
    const xmap = Global.XMap as XMap;
    const wmtsTool =xmap.WMTSTool;
    wmtsTool.addTDTLayer('img_c', '影像');

    const mapdiv = document.getElementById(xmap.target);
    if (!swipe) swipe = new RollSwipe(mapdiv, Global.XMap);
    swipe.setSwipeLayer(2);
    swipe.changeSwipeType(swipetype.value, 100);
});
function unload() {
    swipe.unload();
}
function load() {
    swipe.load();
}
onUnmounted(() => {

    unload();
    const xmap = Global.XMap as XMap;
    const collection = xmap.map.getLayers().getArray();
    const layr = collection[2];
    xmap.map.removeLayer(layr);
});
</script>

<style scoped>
.swipeMapWidget
{
    position: absolute;
    left:50px;
    top:20px;
}
</style>