<template>
  <XWindow :isDark="false" top="30px" left="10px" nWidth="350px" hHeight="400px" title="图层管理"
    icon="img/basicimage/arcgis_img.png" pid="imageBaseLayerWidget" @loaded="loadedHandle" @close="doClosePanel">
    <LayerTree  :xmap="xmapRef" :moreContextMenu="contextMenuList"/>
  </XWindow>



</template>

<script setup lang="ts">
import { ref, onMounted,onUnmounted } from 'vue';
import { Global, XWindow } from 'xframelib';
import { XMap,LayerTree,MapEvent,MapEventArgs } from 'xgis-ol';


let windowID = '';
function loadedHandle(panelData) {
  windowID = panelData.id;
}
function doClosePanel(panelData) {
  //   widgetID = panelData.pid;
  //   if (panelData.pid) {
  //     EmitMsg(WidgetsEvent.WidgetClosed, widgetID);
  //   }
}


const contextMenuList = [
  {},
  {
    name: "测试一下",
    icon: "gis:layer-up",
    value: "upMove2",
  },
  {
    name: "Test",
    icon: "gis:layer-down",
    value: "downMove2",
  }

];

function contextMenuHandle(e: MapEventArgs)
{
  if(!xmapRef.value) return;
  if (e.mapID != xmapRef.value.target) return;
  const { item,id,name,label} = e.data;

  Global.Message.info(`右键菜单：${item.name},图层ID：${id},图层名：${name},图层Label:${label}`);

}
const xmapRef=ref();
onMounted(() => {
  if (Global.XMap) {
    const xmap = Global.XMap as XMap;
    xmapRef.value=xmap;
    xmap.mapEventBus.eventOn(MapEvent.LAYER_TREE_CONTEXT_MENU,contextMenuHandle)
  }
})
onUnmounted(()=>{
  if (Global.XMap) {
    const xmap = Global.XMap as XMap;
    xmap.mapEventBus.eventOff(MapEvent.LAYER_TREE_CONTEXT_MENU,contextMenuHandle)
  }

})

</script>

<style scoped></style>