<template>
 <q-btn color="primary" label="加载/移除网格层"  @click="doClick"/>
</template>

<script setup lang="ts">
import { XMap,PrjGridTool } from 'xgis-ol';
import { onMounted,ref,onUnmounted } from 'vue';
import { Global,get } from 'xframelib';
import { useRoute } from 'vue-router';

const route = useRoute();
const mapRef=ref<XMap>();
let layer="s:test1";
let wmtsLayer:any;
let debugLayer:any;
onMounted(()=>{
  if(Global.XMap)
  {
    const xmap=Global.XMap as XMap;
    const qlayer=route.query.layer as string;
    if(qlayer)
    layer=qlayer;
    //https://image.gis.digsur.com/IMGWMTS?layer=s:test1&style=default&tilematrixset=C&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/jpeg&TileMatrix=10&TileCol=843&TileRow=142&threshold=100
    //xmap.WMTSTool.addWMTSLayer()
    const wmtstileGrid=  PrjGridTool.getTDTTileGrid(false);
    wmtsLayer=xmap.WMTSTool.addWMTSLayer(layer,"C",Global.Config.ServiceURL.WMTSService,wmtstileGrid,
    PrjGridTool.getProjection({epsg:"EPSG:4326",prjExtent:[-180,-90,180,90]}),'default',"KVP",'image/jpeg');
  }
});


function doClick()
{   
    if(wmtsLayer)
    {
        const xmap=Global.XMap as XMap;
        if(!debugLayer)
        {
            //加载调试网格图层
            debugLayer= xmap.WMTSTool.addWMTSDebugLayer(wmtsLayer);
        }
        else
        {
            xmap.map.removeLayer(debugLayer);
            debugLayer=undefined;
        }

    }

}
onUnmounted(()=>{

    if(wmtsLayer)
    {
        const xmap=Global.XMap as XMap;
        xmap.LayerManager.deleteLayer(wmtsLayer);
        if(debugLayer)
        {
            xmap.map.removeLayer(debugLayer);
            debugLayer=undefined;
        }

    }
})




</script>