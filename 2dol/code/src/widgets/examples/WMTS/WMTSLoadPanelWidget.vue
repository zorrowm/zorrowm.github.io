<template>
    <XWindow :isDark="false" top="0px" left="10px" nWidth="550px" hHeight="250px" title="添加WMTS服务"
        icon="img/basicimage/arcgis_img.png" @loaded="loadedHandle" @close="doClosePanel">
        <div class="q-gutter-y-md  loadWMTSPanel">
            <q-option-group v-model="panel" inline :options="[
                { label: '影像平台服务名', value: 'GetServiceBrowse' },
                { label: '通过GetCapabilities', value: 'getCapabilities' },
                { label: 'URL和参数', value: 'URL' }
            ]" />
            <q-tab-panels v-model="panel" animated class="shadow-2 rounded-borders">
                <q-tab-panel name="GetServiceBrowse">
                    <div class="info-title">只支持影像平台，输入发布的影像服务名</div>
                    <div>
                        <q-input filled v-model="serviceName" label="输入服务名" />
                        <q-input filled v-model="imageserver" label="影像平台服务地址（默认）" />
                        <q-btn color="primary" label="添加影像WMTS" @click="loadImageWMTS" />
                    </div>
                </q-tab-panel>

                <q-tab-panel name="getCapabilities">
                    <div class="info-title">通过OGC标准WMTS的GetCapabilitis元数据加载图层<br />
                        https://image.gis.digsur.com/IMGWMTS?layer=s:test1&Service=WMTS&Request=GetCapbilities
                    </div>
                    <div>
                        <q-input filled v-model="wmtsURL" label="影像平台服务地址（默认）" />
                        <q-input filled v-model="layerName" label="输入图层名" />
                        <q-btn color="primary" label="添加WMTS" @click="loadWMTSByXML" />
                    </div>
                </q-tab-panel>

                <q-tab-panel name="URL">
                    <div class="info-title">输入OGC WMTS参数，构建例如：<br />
                        https://image.gis.digsur.com/IMGWMTS?layer=s:test1&style=default&tilematrixset=C<br />&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/jpeg<br />&TileMatrix=10&TileCol=843&TileRow=142&threshold=100
                    </div>
                    <div>
                        <q-input filled v-model="wmtsURL" label="影像平台服务地址（默认Global.Config.ServiceURL.WMTSService）" />
                        <q-input filled v-model="layerName" label="图层名" />
                        <q-input filled v-model="tilematrix" label="瓦片矩阵集（例如：C/W）" />
                        <q-input filled v-model="style" label="样式名,默认为default" />
                        <q-input filled v-model="format" label="Format,默认为image/jpeg" />
                        <q-input v-model.number="minZoom" type="number" filled label="最小级别,默认为1" />
                        <q-input v-model.number="maxZoom" type="number" filled label="最大级别,默认为18" />
                        <q-btn color="primary" label="添加WMTS" @click="loadWMTSByURLParams" />
                    </div>
                </q-tab-panel>
            </q-tab-panels>
        </div>
    </XWindow>
</template>

<script lang="ts" setup>
import { getCurrentInstance, ref } from 'vue'
import { Global, get, XWindow } from 'xframelib';
import { XMap, PrjGridTool, IProjInfo, ITileGridSchema } from 'xgis-ol';
import Projection from 'ol/proj/Projection';
import {TileGridsetRuleService} from 'src/service/imageAdmin/TileGridsetRuleService';
import ServiceClients from "src/service/index";

const panel = ref('GetServiceBrowse');
const imageserver = ref(Global.Config.ServiceURL.WMTSService ?? 'https://gis-image.digsur.com/IMGWMTS')
const serviceName = ref('s:test1');
/**
 * 加载影像服务
 */
function loadImageWMTS() {
    if (!serviceName.value) {
        Global.Message.warn("影像服务名不能为空！")
        return;
    }
    if (Global.XMap) {
        const xmap = Global.XMap as XMap;
        const layer = serviceName.value;
        get(imageserver.value + "/GetServiceBrowse", { layer }).then(res => {
            if (res.status === 200) {
                const metaData = res.data;
                console.log('影像元数据为：', metaData);
                xmap.WMTSTool.addWMTSLayerSelf(
                    metaData,
                    layer
                );
                const bounds = metaData.bounds;
                xmap.zoomToExtent(bounds);
            }
        }).catch(ex => {
            Global.Message.warn(`请求服务${layer}元数据失败`, ex.Message);
        })
    }
}

const wmtsURL = ref(Global.Config.ServiceURL.WMTSService);
const layerName = ref('');
const tilematrix = ref('C');
const style = ref('default');
const format = ref('image/jpeg');
const minZoom = ref(1);
const maxZoom = ref(18);



/**
 * 通过URL和参数，添加WMTS标准地图服务
 */
function loadWMTSByURLParams() {

    if (!wmtsURL.value || !layerName.value || !tilematrix.value) {
        Global.Message.warn('图层名等参数不能为空！')
        return;
    }

    if (Global.XMap) {
        const xmap = Global.XMap as XMap;
        let wmtstileGrid: any;//WMTSTileGrid;
        let wmtsProj: Projection;
        const lowerMatrix = tilematrix.value.toLocaleLowerCase();
        if (lowerMatrix === 'c') {
            wmtstileGrid = PrjGridTool.getTDTTileGrid(false);
            wmtsProj = PrjGridTool.getProjection({ epsg: "EPSG:4490", prjExtent: [-180, -90, 180, 90] });
            const wmtsLayer = xmap.WMTSTool.addWMTSLayer(layerName.value, tilematrix.value, wmtsURL.value, wmtstileGrid,
                wmtsProj, style.value, "KVP", format.value);
        }
        else if (lowerMatrix === 'w') {
            wmtstileGrid = PrjGridTool.getTDTTileGrid(true);
            wmtsProj = PrjGridTool.getProjection({ epsg: 'EPSG:3857' });
            const wmtsLayer = xmap.WMTSTool.addWMTSLayer(layerName.value, tilematrix.value, wmtsURL.value, wmtstileGrid,
                wmtsProj, style.value, "KVP", format.value);
        }
        else {
            //定义对象
            const tilegridService=new TileGridsetRuleService(ServiceClients.ImageAdminClient);
            tilegridService.GetTileGridsetRuleByRuleid(tilematrix.value).then(async res => {

                if (!res || !res.rule) {
                    Global.Message.warn(`矩阵集名错误：${tilematrix.value}`);
                    return;
                }
                const epsg = res.tilerule.epsg;
                const boundingBoxMinX = res.tilerule.boundingBoxMinX;
                const boundingBoxMinY = res.tilerule.boundingBoxMinY;
                const boundingBoxMaxX = res.tilerule.boundingBoxMaxX;
                const boundingBoxMaxY = res.tilerule.boundingBoxMaxY;
                const tileheight = res.tilerule.tileheight;
                const tilewidth = res.tilerule.tilewidth;
                const resolutions = {};
                for (let index = 0; index < res.tilerulematrixs.length; index++) {
                    const level = res.tilerulematrixs[index].level as string;
                    const resolution1 = res.tilerulematrixs[index].resolutions as number;
                    resolutions[level] = resolution1;
                }
                const epsgInfo = await get('https://epsg.gis.digsur.com/#/epsg/' + epsg);
                const prjparam: IProjInfo = {
                    epsg: 'EPSG:' + epsg,
                    proj4: epsgInfo.proj4,
                    prjExtent: [boundingBoxMinX, boundingBoxMinY, boundingBoxMaxX, boundingBoxMaxY]
                };
                const projection = PrjGridTool.getProjection(prjparam);
                const tileSchema: ITileGridSchema = {
                    rule: tilematrix.value,
                    origin: [boundingBoxMinX, boundingBoxMaxY],
                    tileSize: [tilewidth, tileheight],
                    resolutions: resolutions
                }
                const tilegrid = PrjGridTool.createWMTSTileGrid(tileSchema);
                //加载图层
                xmap.WMTSTool.addWMTSLayer(layerName.value, tilematrix.value, wmtsURL.value, tilegrid,
                    projection, style.value, "KVP", format.value);

            });
        }

    }
}

/**
 * 通过WMTS的XML元数据加载图层
 */
async function loadWMTSByXML() {

    const xmlObj = await PrjGridTool.getWMTSCapabilities(wmtsURL.value, layerName.value);

    const xmlOptions = await PrjGridTool.getXMLOptionsFromCapabilities(xmlObj, true);
    if (xmlOptions) {
        const xmap = Global.XMap as XMap;
        xmap.WMTSTool.addWMTSLayerByXMLOptions(xmlOptions);
    }
}

const instance = getCurrentInstance();
let windowID = '';
function loadedHandle(panelData) {
    windowID = panelData.id;
    console.log(windowID, '8888888888')
}
function doClosePanel(panelData) {

    const wid = instance?.proxy?.$options.id;
    const layoutid = instance?.proxy?.$options.layoutID;
    if (wid) {
        Global.LayoutMap.get(layoutid)?.unloadWidget(wid);
    }

    //EmitMsg(WidgetsEvent.WidgetClosed, widgetid);
}
</script>
<style lang="scss" scoped>
.loadWMTSPanel {
    background-color: #eee;
    width: 100%;
}

.info-title {
    color: grey;
    font-size: 12px;
    text-wrap: wrap;
}
</style>