<template>
</template>

<script setup lang="ts">
import { SwipeToolBar, XMap, PrjGridTool, IProjInfo } from 'xgis-ol';
import { onMounted, ref, onUnmounted } from 'vue';
import { Global, get } from 'xframelib';
import { useRoute } from 'vue-router';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import WMTS from 'ol/source/WMTS';
import { Projection, get as getProjection } from 'ol/proj';

const route = useRoute();
const mapRef = ref<XMap>();
let layer = "s:test1";
let wmtsLayer: any;



onMounted(async () => {
  if (Global.XMap) {
    const xmap = Global.XMap as XMap;
    const qlayer = route.query.layer as string;
    if (qlayer)
      layer = qlayer;

    const xmlObj = await PrjGridTool.getWMTSCapabilities(Global.Config.ServiceURL.WMTSService, layer);

    const xmlOptions = await PrjGridTool.getXMLOptionsFromCapabilities(xmlObj, true);
    if (xmlOptions) {
      xmap.WMTSTool.addWMTSLayerByXMLOptions(xmlOptions);
    }
  }
});
onUnmounted(() => {

  if (wmtsLayer) {
    const xmap = Global.XMap as XMap;
    xmap.map.removeLayer(wmtsLayer);
  }
})

</script>