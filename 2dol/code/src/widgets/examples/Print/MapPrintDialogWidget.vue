<template></template>

<script setup lang="ts">
import PrintDialog from 'ol-ext/control/PrintDialog';
import { onMounted, onUnmounted } from 'vue';
import { Global } from 'xframelib';
import { XMap, PrintTool } from 'xgis-ol';
let printTool: PrintTool;
onMounted(() => {
  const xmap = Global.XMap as XMap;
  const prj = xmap.MapView.getProjection();

  xmap.PrintTool.addPrintDialogControl();
});

onUnmounted(() => {
  if (Global.XMap) {
    const xmap = Global.XMap as XMap;
    xmap.PrintTool.removePrintDialogControl();
    // xmap.map.removeControl(printControl);
  }
});
</script>

<style lang="scss">
.ol-print {
  position: absolute;
  top: 320px !important;
  right: 55px !important;
  left: unset !important;
  &:hover {
    background-color: #f00;
  }
}
</style>
