<template>
</template>

<script setup lang="ts">
import {XMap } from 'xgis-ol';
import { onMounted,ref,onUnmounted } from 'vue';
import { Global } from 'xframelib';

onMounted(()=>{
  if(Global.XMap)
  {
    const xmap=Global.XMap as XMap;
    xmap.addDefaultControl(      {
        "key":"target",
        "options":{
          "visible":true,
          "composit":"default"
        }
      })
  }
})
onUnmounted(()=>{
if(Global.XMap)
{
    const xmap=Global.XMap as XMap;
    xmap.removeControlExt('target');
  }
})
</script>