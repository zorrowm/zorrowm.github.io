<template>
    <div class="rightPanel">
        <q-input clearable v-model="styleJsonURL" label="StyleJson地址" stack-label :dense="false" />
        <div class="q-pa-md" style="max-width: 500px">
            <q-input clearable v-model="styleJsonContent" filled type="textarea" />
        </div>
        <q-btn color="primary" label="加载StyleJson" @click="doClick" />
        <div>
            <span>图层ID:{{ serviceID }}  服务名：{{serviceName}} 切片方案：{{ PrjValue }}</span>
        </div>

    </div>
</template>

<script setup lang="ts">
import { XMap, PrjGridTool, apply } from 'xgis-ol';
import { onMounted, ref, onUnmounted } from 'vue';
import { Global, get } from 'xframelib';

const PrjValue = ref<string>("");
const serviceID=ref('');
const serviceName=ref('');
let mvtLayer: any;

const styleJsonURL = ref('https://map.gis.digsur.com/Resource/styles/BJ_OSM_NEW/style.json?tk=undefined');
const styleJsonContent = ref('')


function loadMVTLayer(styleJson: any) {
    PrjValue.value = styleJson.tileSchema?.rule ?? 'W';
    serviceID.value=styleJson.id;
    serviceName.value=styleJson.name;
    // const defaultPrjObj = PrjGridTool.getProjection(styleJson.prjInfo);
    const xmap = Global.XMap as XMap;

    apply(xmap.map, styleJson).then((map: any) => {

        const targetPrj=xmap.MapView.getProjection();
        if (styleJson.zoom) xmap.MapView.setZoom(styleJson.zoom!);
        else xmap.MapView.setZoom(styleJson.zoom!);
    if (styleJson.center) {
        xmap.MapView.setCenter(
        PrjGridTool.fromLonLatCoordinate(styleJson.center!, targetPrj)
      );
    } else
       xmap.MapView.setCenter(
        PrjGridTool.fromLonLatCoordinate(styleJson.center!, targetPrj)
      );

  });
}

function doClick() {
    if (styleJsonContent.value) {
        const styleJsonObj = JSON.parse(styleJsonContent.value);
        loadMVTLayer(styleJsonObj);
    }
    else if (styleJsonURL.value) {
        get(styleJsonURL.value).then(p => {
            if (p.data) {
                loadMVTLayer(p.data)
            }
        })
    }





}

onUnmounted(() => {
        const xmap = Global.XMap as XMap;
    if (mvtLayer) {

        xmap.LayerManager.deleteLayer(mvtLayer);
    }
})

</script>
<style lang="scss" scoped>
.rightPanel {
    position: absolute;
    right: 20px;
    top: 10px;
    width: 600px;
    background-color: #ddd;
    padding: 10px;
}
</style>