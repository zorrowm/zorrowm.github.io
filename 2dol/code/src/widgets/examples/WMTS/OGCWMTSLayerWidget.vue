<template>
</template>

<script setup lang="ts">
import { SwipeToolBar,XMap } from 'xgis-ol';
import { onMounted,ref,onUnmounted } from 'vue';
import { Global,get } from 'xframelib';
import { useRoute } from 'vue-router';

const route = useRoute();
const mapRef=ref<XMap>();
let layer="s:test1";
let wmtsLayer:any;
onMounted(()=>{
  if(Global.XMap)
  {
    const xmap=Global.XMap as XMap;
    const qlayer=route.query.layer as string;
    if(qlayer)
    layer=qlayer;


    get(Global.Config.ServiceURL.WMTSService+"/GetServiceBrowse",{layer}).then(res=>{
        if(res.status===200)
        {
            const metaData=res.data;
            console.log('影像元数据为：',metaData);
            wmtsLayer= xmap.WMTSTool.addWMTSLayerSelf(
                  metaData,
                  layer
                );
             const bounds=metaData.bounds;
             xmap.zoomToExtent(bounds);

        }
    })
  }
});
onUnmounted(()=>{

    if(wmtsLayer)
    {
        const xmap=Global.XMap as XMap;
        xmap.map.removeLayer(wmtsLayer);
    }
})




</script>