<template>
    <div :style="mainContainStyle">
        <OLXMap mapid="map" :hasLayerManager="false" :defaultCenter="[108.95, 34.5]" :initTDTLayers="['vec_c', 'cva_c']"
            viewProjection='EPSG:4326' @mapInited="mapInitedHandler" v-if="showMap">
            <template #mapLeftPanel>
                <!-- 扩展弹框 -->
                <div class="leftPanel">
                    这是左侧扩展面板
                </div>
            </template>
  
        </OLXMap>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { H5Tool } from 'xframelib';
import {
    OLXMap, PrjGridTool, XMap
} from 'xgis-ol';
import 'xgis-ol/dist/index.css';

const showMap = ref(false);
const mainContainStyle = ref('');
function resizeMap() {
    const result = `position:relative;width:100%;height:100vh`;
    mainContainStyle.value = result;
};

//获取地图元数据加载地图
let xMap: XMap;
function mapInitedHandler(res) {
    xMap = res.xmap;
}
onMounted(() => {
    showMap.value = true;
    resizeMap();
    H5Tool.windowResizeHandler(() => {
        resizeMap();
    })
});
</script>
<style lang="scss" scoped>
.leftPanel {
    background-color: #eee;
    width: 200px;
    height: 200px;
}


</style>