<template>
    <div class="fishEyeWidget">
        <span>切换半径:</span><input type="number" name="points" min="10" max="1000" v-model="radiusNum" @change="changeRadius()" />
        <button @click="unload">取消</button>
        <button @click="load">启用</button>
    </div>
</template>

<script setup lang="ts">
import { EnumSwipeType, RollSwipe, XMap, WMTSTool } from 'xgis-ol';
import { ref, onMounted, onUnmounted } from 'vue';
import { Global } from 'xframelib';

//获得投影
let swipe: RollSwipe;
const swipetype = ref(EnumSwipeType.FishEye);
const radiusNum = ref(100);
const changeRadius = () => {
   swipe.changeSwipeType(EnumSwipeType.FishEye, radiusNum.value);
};
let imgLayer:any;
onMounted(() => {
    const xmap = Global.XMap as XMap;
    const wmtsTool = xmap.WMTSTool;
    imgLayer= wmtsTool.addTDTLayer('img_c', '影像');

    const mapdiv = document.getElementById(xmap.target);
    if (!swipe) swipe = new RollSwipe(mapdiv, Global.XMap);
    swipe.setSwipeLayer(imgLayer);
    swipe.changeSwipeType(swipetype.value, 100);
});
function unload() {
    swipe.unload();
}
function load() {
    swipe.load();
}
onUnmounted(()=>{
    const xmap = Global.XMap as XMap;
    xmap.map.removeLayer(imgLayer);
});
</script>

<style lang="scss" scoped>
.fishEyeWidget
{
    position: absolute;
    top:10px;
    left:100px;
}
</style>