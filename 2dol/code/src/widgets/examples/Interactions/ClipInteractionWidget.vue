<template>
    <div class="ClipInteractionWidget">
        <div>
            <span>半径大小：</span>  <q-slider v-model="radius" :min="50" :max="1000" color="green"/>
        </div>
        <div><span>是否启用：</span> <q-toggle v-model="enable" /></div>
    </div>
</template>

<script setup lang="ts">
import Clip from 'ol-ext/interaction/Clip';
import { onMounted,onUnmounted,ref,watch } from 'vue';
import { Global } from 'xframelib';
import { XMap } from 'xgis-ol';

const radius=ref(100);
const enable=ref(true);

watch(()=>radius.value,val=>{
    if(clip)
    clip.setRadius(val);
})
watch(()=>enable.value,val=>{
    if(clip)
    clip.setActive(val);
})
let clip:Clip;
onMounted(()=>{
    const xmap=Global.XMap as XMap;
    const layer1=xmap.map.getLayers().getArray();
     clip = new Clip({ radius: radius.value, layers:[...layer1 ] });
    xmap.map.addInteraction(clip);
    console.log('0000000类型：',(typeof clip),clip);
})

onUnmounted(()=>{
    if(clip)
    {
        const xmap=Global.XMap as XMap;
        xmap.map.removeInteraction(clip);
    }
})

</script>

<style lang="scss"scoped>
.ClipInteractionWidget
{
    width:200px;
    position: absolute;
    left:40px;
    top:40px;
}
</style>