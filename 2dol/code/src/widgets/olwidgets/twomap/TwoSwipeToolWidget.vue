<template>
    <div class="swipeToolBar">
        <SwipeToolBar :xmap="mapRef"  v-if="mapRef"/>
    </div>
</template>

<script setup lang="ts">
import { SwipeToolBar,XMap } from 'xgis-ol';
import { onMounted,ref } from 'vue';
import { Global } from 'xframelib';
const mapRef=ref<XMap>();
onMounted(()=>{
  if(Global.XMap2)
  {
    const xmap=Global.XMap2 as XMap;
    //根据图层ID，进行修改
    // xmap.LayerManager.changeSwipeLayerByID('cva_w');
    //更加索引修改
    // xmap.LayerManager.changeSwipeLayerIndex(1);
    // console.log('4444444',xmap.LayerManager.SwipeLayerIndex);
    mapRef.value=xmap;

  }
})
</script>
<style lang="scss" scoped>
.swipeToolBar
{
  .tool-container 
  {
    height:100%;
    :deep(.iconify)
    {
      color:#000 !important;
    }
  }
}

</style>