<template>
    <div class="xgis_layercontrol_menu">
        <Icon icon = "bi:layers-half" width="24"  height="24" color="#fff" @click="changeBasePanel"/>
        <Icon icon = "gala:layer"  width="24"  height="24" color="#fff" @click="changeLayerPanel"/>
    </div>
</template>

<script setup lang="ts">
import { Global } from 'xframelib';

function changeBasePanel()
{
    Global.LayoutManager?.loadWidget('imageBaseLayerWidget');
}
function changeLayerPanel()
{

}

</script>

<style scoped lang="scss">
.xgis_layercontrol_menu
{
  display: flex;
  flex-direction: column;
  width: 32px;
  height: 50px;
  justify-items: center;
  justify-content:space-evenly;
  align-items: center;
  position: absolute;
  left: 10px;
  bottom: 55px;
//   background:#f00;
  svg:hover
  {
    background-color: #36f;
  }
}
</style>