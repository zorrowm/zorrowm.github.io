<template>
  <XWindow :isDark="false" top="0px" left="10px" nWidth="650px" hHeight="500px" title="添加矢量切片服务"
    icon="img/basicimage/arcgis_img.png" @loaded="loadedHandle" @close="doClosePanel">
    <div style="width: 100%">
      <q-card>
        <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify"
          narrow-indicator>
          <q-tab name="mvtLayer" label="矢量瓦片TileJson" />
          <q-tab name="mvtMap" label="电子地图StyleJson" />
          <q-tab name="mvtTile" label="单个MVT瓦片[经纬度/墨卡托]" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="mvtLayer" style="height:300px;padding-left: 20px">
            <MVTLayerWidget />
          </q-tab-panel>

          <q-tab-panel name="mvtMap" style="height:300px;padding-left: 20px">
            <StyleJsonMapWidget />
          </q-tab-panel>

          <q-tab-panel name="mvtTile" style="height:300px;padding-left: 20px">
            <MVTDataWidget />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </XWindow>
</template>

<script setup lang="ts">
import { getCurrentInstance, ref } from 'vue'
import { Global, get, XWindow } from 'xframelib';
import Projection from 'ol/proj/Projection';
import MVTLayerWidget from './MVTLayerWidget.vue';
import StyleJsonMapWidget from './StyleJsonMapWidget.vue';
import MVTDataWidget from './MVTDataWidget.vue';

const tab = ref('mvtLayer');

const instance = getCurrentInstance();
let windowID = '';
function loadedHandle(panelData) {
  windowID = panelData.id;
}
function doClosePanel(panelData) {
  const wid = instance?.proxy?.$options.id;
  const layoutid = instance?.proxy?.$options.layoutID;
  if (wid) {
    Global.LayoutMap.get(layoutid)?.unloadWidget(wid);
  }
}
</script>

<style scoped></style>