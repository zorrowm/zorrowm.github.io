<template>
  <PositionStatusControl :viewer="viewerRef"></PositionStatusControl>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Global } from 'xframelib';
import { PositionStatusControl } from 'xgis-cesium';

const viewerRef = ref(Global.CesiumViewer);
onMounted(() => {
  viewerRef.value = Global.CesiumViewer;
})
</script>

<style scoped lang="scss"></style>