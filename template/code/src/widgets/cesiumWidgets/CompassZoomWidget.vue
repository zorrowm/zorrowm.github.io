<template>
  <CompassControl :viewer="viewerRef"></CompassControl>
  <ZoomControl :viewer="viewerRef"></ZoomControl>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Global } from 'xframelib';
import { CompassControl,ZoomControl } from 'xgis-cesium';

const viewerRef = ref(Global.CesiumViewer);
onMounted(() => {
  viewerRef.value = Global.CesiumViewer;
})
</script>

<style scoped lang="scss"></style>