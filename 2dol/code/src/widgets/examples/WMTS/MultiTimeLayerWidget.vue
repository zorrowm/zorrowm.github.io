<template>
    <div class="rightOptionList">
        <ul v-if="layerInfo.name" class="layer_info">
            <li> 图层名：{{ layerInfo.name }}</li> 切片方案： 坐标系：
            <li> 切片方案：{{ layerInfo.rule }}</li>
            <li> 坐标系：{{ layerInfo.projection }}</li>
        </ul>
        <q-option-group v-if="options.length > 0" class="radioOption" v-model="group" :options="options"
            color="primary" />
    </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, reactive, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Global, get } from 'xframelib';
import { XMap, } from 'xgis-ol';
import { MultiService } from "src/service/imageAdmin/MultiService";
import ServiceClients from "src/service/index";

const route = useRoute();
let xmap: XMap;
const layerInfo = reactive({
    name: '',
    rule: '',
    projection: ''
})
const options = ref([]);
const group = ref('');
watch(() => group.value, (newValue, oldValue) => {
    if (xmap) {
        if (newValue) {
            xmap.LayerManager.changeLayerVisible('s:' + newValue, true);
        }
        if (oldValue) {
            xmap.LayerManager.changeLayerVisible('s:' + oldValue, false);
        }
    }
})

function loadWMTSLayer(layer: string) {
    if (!layer || layer.length <= 2)
        return;
    if (layer[1] != ':')
        return;
    let metaData: any;
    //定义对象
    const multiService = new MultiService(ServiceClients.ImageAdminClient);
    get(Global.Config.ServiceURL.WMTSService + "/GetServiceBrowse", { layer }).then(res => {
        if (res.status === 200) {
            metaData = res.data;
            layerInfo.name = metaData.name;
            layerInfo.projection = metaData.prjInfo?.epsg ?? 'EPSG:3857';
            layerInfo.rule = metaData.tileSchema?.rule ?? 'W';

            //请求多时相服务——多图层
            if (layer.startsWith('m:')) {

                options.value.length = 0;
                group.value = "";
                const serviceID = layer.substring(2);
                //请求获取，多时相列表
                multiService.GetMultiServiceRelServiceList(serviceID, 0, 0)
                    .then((res) => {

                        const array: [] = res.arrayList;
                        let wmtsLayer: any;
                        array.forEach((item: any) => {
                            options.value.push({ label: item.servicealias ?? item.servicename, value: item.servicename });
                            const serviceLayer = 's:' + item.servicename;
                            const tmpMetaData = { ...metaData };
                            tmpMetaData.name = item.servicename;
                            wmtsLayer = xmap.WMTSTool.addWMTSLayerSelf(
                                tmpMetaData,
                                serviceLayer
                            );
                            // if(wmtsLayer)
                            // wmtsLayer.setVisible(false);
                            // xmap.LayerManager.changeLayerVisible(serviceLayer,false);
                        });
                        if (options.value.length > 0)
                            group.value = options.value[options.value.length - 1].value;
                        // xmap.LayerManager.changeLayerVisible("s:" + group.value, true);
                        //   if(wmtsLayer)
                        //   wmtsLayer.setVisible(true);
                    })
                    .catch((ex) => {
                        console.warn('多时相名称不能为空' + ex);
                    });

            }
            else {
                const wmtsLayer = xmap.WMTSTool.addWMTSLayerSelf(
                    metaData,
                    layer
                );
            }

            const bounds = metaData.bounds;
            if (bounds)
                xmap.zoomToExtent(bounds);
            else {
                xmap.zoomToCenter(metaData.center, metaData.level ?? 5);
            }

        }
    })
}


onMounted(() => {
    xmap = Global.XMap as XMap;
    const qlayer = 'm:GuLangYu';//route.query.layer as string;
    loadWMTSLayer(qlayer);

});

onUnmounted(() => {

})

</script>
<style lang="scss" scoped>
.rightOptionList {
    .layer_info {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 5px;
        background-color: #f9f9f9;

        li {
            text-decoration: none;
        }
    }
    .radioOption {
        position: absolute;
        right: 0;
        top: 20px;
    }
}
</style>
