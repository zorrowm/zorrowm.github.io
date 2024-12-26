<template>
    <div class="rightPanel">
        <q-input clearable v-model="tileJsonURL" label="tileJson地址" stack-label :dense="false" />
        <div class="q-pa-md" style="max-width: 500px">
            <q-input clearable v-model="tileJsonContent" filled type="textarea" />
        </div>
        <q-btn color="primary" label="加载TileJson" @click="doClick" />
        <q-btn color="primary" label="加载/移除网格" @click="loadGridLayer" />
        <div>
            <span>图层ID:{{ serviceID }}  服务名：{{serviceName}} 切片方案：{{ PrjValue }}</span>
        </div>

    </div>
</template>

<script setup lang="ts">
import { XMap, PrjGridTool, VTLayerTool } from 'xgis-ol';
import { onMounted, ref, onUnmounted } from 'vue';
import { Global, get } from 'xframelib';
import { useRoute } from 'vue-router';

const route = useRoute();
const PrjValue = ref<string>("");
const serviceID=ref('');
const serviceName=ref('');
let mvtLayer: any;
let debugLayer: any;
let vtTool: VTLayerTool;

const tileJsonURL = ref('https://vector.gis.digsur.com/vtile/admin/test1113/tile.json?tk=00065a33-7951-4250-b1b2-ab7b871a4aa3');
const tileJsonContent = ref('')


function loadMVTLayer(tileJson: any) {
    PrjValue.value = tileJson.tileSchema?.rule ?? 'W';
    serviceID.value=tileJson.id;
    serviceName.value=tileJson.name;
    const defaultPrjObj = PrjGridTool.getProjection(tileJson.prjInfo);
    const xmap = Global.XMap as XMap;
    if (!vtTool)
        vtTool = new VTLayerTool(xmap);
    if (mvtLayer)
        xmap.LayerManager.deleteLayer(mvtLayer);
    //加矢量图层
    mvtLayer = vtTool.addVTLayer(tileJson)

    xmap.MapView.setZoom(tileJson.center[2]);
    let center = PrjGridTool.fromLonLatCoordinate(
        [tileJson.center[0], tileJson.center[1]],
        defaultPrjObj
    );
    xmap.MapView.setCenter(center);
}

function doClick() {
    if (tileJsonContent.value) {
        const tileJsonObj = JSON.parse(tileJsonContent.value);
        loadMVTLayer(tileJsonObj);
    }
    else if (tileJsonURL.value) {
        get(tileJsonURL.value).then(p => {
            if (p.data) {
                loadMVTLayer(p.data)
            }
        })
    }
}
function loadGridLayer() {
    if (mvtLayer) {
        const xmap = Global.XMap as XMap;
        if (!debugLayer) {
            //加载调试网格图层
            debugLayer = xmap.WMTSTool.addWMTSDebugLayer(mvtLayer);
        }
        else {
            xmap.map.removeLayer(debugLayer);
            debugLayer = undefined;
        }

    }
}
onUnmounted(() => {
        const xmap = Global.XMap as XMap;
    if (mvtLayer) {

        xmap.LayerManager.deleteLayer(mvtLayer);
    }
    if (debugLayer) {
        xmap.map.removeLayer(debugLayer);
        debugLayer = undefined;
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