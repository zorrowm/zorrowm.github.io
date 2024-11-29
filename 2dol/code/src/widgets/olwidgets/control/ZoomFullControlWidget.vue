<template>
    <div>
        <ZoomFullBar :xmap="mapRef" :hasLayerTree="hasLayerTree" :hasFullScreen="false" class="q-gutter-y-sm" />
    </div>
</template>

<script setup lang="ts">
import { ZoomFullBar,XMap } from 'xgis-ol';
import { onMounted,ref } from 'vue';
import { Global } from 'xframelib';
const mapRef=ref<XMap>();
const hasLayerTree=ref(false);
onMounted(()=>{
  if(Global.XMap)
  {
    mapRef.value=Global.XMap as XMap;
    hasLayerTree.value=!!mapRef.value.LayerManager;
  }
})
</script>