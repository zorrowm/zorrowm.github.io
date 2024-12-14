<template>
</template>

<script setup lang="ts">
import Print from 'ol-ext/control/Print';
import { onMounted, onUnmounted } from 'vue';
import { Global,SaveAs } from 'xframelib';
import { XMap } from 'xgis-ol';
let printControl:any;
onMounted(()=>{
    const xmap=Global.XMap as XMap;
    const prj=xmap.MapView.getProjection();
    xmap.PrintTool.addPrintControl();
    // printControl = new Print();
    // if(printControl)
    // xmap.map.addControl(printControl);

    // printControl.on(['print', 'error'], function(e) {
    //   // Print success
    //   if (e.image) {
    //     e.canvas.toBlob(function(blob) {
    //         SaveAs(blob, 'map.png');
    //         }, 'image/png');
    //   } else {
    //     console.warn('No canvas to export');
    //   }
    // });



})

onUnmounted(()=>{
    if(Global.XMap)
    {
        const xmap=Global.XMap as XMap;
        xmap.PrintTool.removePrintControl();
        
    }
});


</script>

<style>
.ol-print
{
    right:10px !important;
    left :unset !important;
}
</style>