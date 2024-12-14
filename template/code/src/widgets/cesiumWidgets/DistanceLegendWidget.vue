<template>
    <DistanceLegendControl :viewer="viewerRef"></DistanceLegendControl>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Global } from 'xframelib';
import { DistanceLegendControl } from 'xgis-cesium';

const viewerRef = ref(Global.CesiumViewer);
onMounted(() => {
    viewerRef.value = Global.CesiumViewer;
})
</script>

<style scoped lang="scss"></style>