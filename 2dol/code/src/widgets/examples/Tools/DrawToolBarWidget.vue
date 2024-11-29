<template>
    <div class="drawToolBar">
        <DrawToolBar :xmap="mapRef" />
    </div>
</template>

<script setup lang="ts">
import { DrawToolBar,XMap } from 'xgis-ol';
import { onMounted,ref } from 'vue';
import { Global } from 'xframelib';
const mapRef=ref<XMap>();
onMounted(()=>{
  if(Global.XMap)
  {
    mapRef.value=Global.XMap as XMap;

  }
})
</script>