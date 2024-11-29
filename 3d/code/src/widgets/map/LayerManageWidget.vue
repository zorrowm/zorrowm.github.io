<template>
    <q-card class="mainPanel q-pa-md">
        <q-input v-model="layerUrl" outlined dense label="图层地址" />
        图层类型:
        <q-radio v-model="shape" dense val="raster" label="影像" />
        <q-radio v-model="shape" dense val="vector" label="矢量" />
        <template v-if="shape == 'vector'">
            <br />
            <q-input v-model="vectorLayerName" outlined dense label="图层源名称" />
            矢量类型:
            <q-radio v-model="shapeType" dense val="polygon" label="面" />
            <q-radio v-model="shapeType" dense val="line" label="线" />
            <q-radio v-model="shapeType" dense val="point" label="点" />
        </template>
        <br />
        <q-btn color="primary" label="添加图层" @click="addLayer()" />
        <!-- <q-btn color="primary" label="添加样式" @click="UpdateStyle()" /> -->
        <q-btn color="primary" label="初始样式" @click="initStyle()" />
        <div class="layerPanel q-pt-md">
            <div class="titlePanel">
                图层列表
            </div>
            <div class="layerListPanel q-ma-md">
                <q-list bordered separator dense>
                    <q-item clickable v-ripple class="row items-center" v-for="(item, index) in layerList" :key="index">
                        <q-checkbox v-model="item.visible" @update:model-value="LayerSwitch(item)" />
                        {{ item.id }}
                    </q-item>
                </q-list>
            </div>
        </div>
    </q-card>
    <q-popup-proxy :model-value="visible" target="#clickFeaturePopup" transition-show="flip-up" transition-hide="flip-down"
        @hide="visible = false">
        <div style="max-width: 300px;max-height: 400px; overflow: auto;">
            <div class="q-pa-sm" v-for="(item, index) in featuresInfo" :key="index">
                <div>
                    图层名称:{{ item.id }}
                </div>
                <div v-for="(props, index2) in item.properties" :key="index2">
                    {{ props.key }}:{{ props.value }}
                </div>
            </div>
        </div>
    </q-popup-proxy>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Global, newGuid } from 'xframelib';
import MapTool from "./MapTool";
import { Map, SourceSpecification, LayerSpecification } from "mapbox-gl";

const shape = ref('raster');
const shapeType = ref('polygon');
const layerUrl = ref();
const vectorLayerName = ref();
let map: Map;
const layerList = ref<any[]>([]);

const featuresInfo = ref<any[]>([])

async function addLayer() {
    if (!layerUrl.value) {
        Global.Message.info('地址不可为空');
        return;
    }
    RemiveSourceLayer();

    if (shape.value == 'raster') {
        //判断是否影像服务
        if (layerUrl.value.indexOf('Capabilities') > -1 || layerUrl.value.indexOf('capabilities') > -1) {
            const xml = await (await fetch(layerUrl.value))?.text();
            if (!xml) {
                Global.Message.err('该地址获取Capabilities失败,请检查链接');
                return;
            }
            LoadCapabilities(xml);
        } else {
            //xyz格式模板数据
            addRasterSource('影像图层', layerUrl.value);
        }
    } else {
        //矢量瓦片服务
        if (layerUrl.value.indexOf('tile.json') > -1) {
            const json = await (await fetch(layerUrl.value))?.json();
            if (!json) {
                Global.Message.err('该地址获取tile.json失败,请检查链接');
                return;
            }
            LoadTileJson(json);

        } else if (layerUrl.value.indexOf('style.json') > -1) { //矢量配图服务
            UpdateStyle();
        } else {  //xyz矢量服务
            if (!shapeType.value || vectorLayerName.value) {
                Global.Message.info('xyz矢量服务需要填写数据类型以及图层源名称')
                return;
            }
            VectorLayerStyle('矢量图层', shapeType.value, layerUrl.value, vectorLayerName.value);
        }
    }
}

async function UpdateStyle() {

    const style = await (await fetch(layerUrl.value)).json().catch(ex => {
        Global.Message.info('地址存在问题')
        return;
    });
    if (style) {
        MapTool.UpdateStyleJson(Global.map, style);
        GetMapLayer(style);

        layerUrl.value = '';
        Global.Message.info('样式更新成功')
    }
}

async function initStyle() {
    const style = MapTool.GetTDTBaseStyle();
    if (style) {
        MapTool.UpdateStyleJson(Global.map, style);
        GetMapLayer(style);

        layerUrl.value = '';
        Global.Message.info('初始化成功')
    }
}

function GetMapLayer(mapStyle?) {
    if (!mapStyle) {
        mapStyle = Global.map.getStyle();
    }
    if (mapStyle && mapStyle.layers && mapStyle.layers.length > 0) {
        mapStyle.layers.forEach(item => {
            // console.log(`item`,item);
            layerList.value.push({
                id: item.id,
                name: item.id,
                visible: item.layout?.visibility == 'none' ? false : true,
                type: item.type,
                source: item.source.type
            })
        })
        console.log(`layerList`, layerList.value);
    }
}

function LayerSwitch(item) {
    MapTool.MapLayerVisible(Global.map, item.id, item.visible)
}

//矢量要素控制
const visible = ref(false);
function GetFeatureInfo(e) {

    var features = map.queryRenderedFeatures(e.point);
    if (features && features.length > 0) {
        featuresInfo.value.length = 0;
        features.forEach(item => {
            if (item.properties && Object.keys(item.properties).length > 0) {
                const props: any[] = [];
                for (var property in item.properties) {
                    props.push({
                        key: property,
                        value: item.properties[property]
                    })
                }
                featuresInfo.value.push({
                    id: item.layer.id,
                    properties: props
                })
            } else {
                featuresInfo.value.push({
                    id: item.layer.id,
                    properties: []
                })
            }
        });
        if (featuresInfo.value.length == 0) {
            Global.Message.info('点击要素暂无信息')
        } else {
            var menu = document.getElementById("clickFeaturePopup");
            if (menu) {
                menu.style.top = e.point.y + "px";
                menu.style.left = e.point.x + "px";
            }
            visible.value = !visible.value;
        }
    }
}

//加载矢量tile.json 文件到地图上
function LoadTileJson(info: any) {
    const source: SourceSpecification = {
        type: 'vector',
    }
    if (info.tiles) {
        source.tiles = info.tiles;
    }
    if (info.url) {
        source.url = info.url;
    }
    source.minzoom = info.minzoom;
    source.maxzoom = info.maxzoom;
    if (info.scheme) {
        source.scheme = info.scheme;
    }
    if (info.bounds) {
        source.bounds = info.bounds;
    }

    map.addSource(info.id, source)

    if (info.vector_layers) {
        info.vector_layers.forEach(element => {
            VectorLayerStyle(element.id, element.geometry_type, info.id, element.id);
        });
    }
}

//统一矢量样式格式
function VectorLayerStyle(id: string, geomType: string, source: string, sourceLayer: string) {
    const type = GetLayerTypeByGeom(geomType);
    const layer: LayerSpecification = {
        id: id,
        source: source,
        type: type,
        'source-layer': sourceLayer,
    }
    switch (type) {
        case 'fill':
            layer.layout = {
                visibility: 'visible',
            }
            layer.paint = {
                //设置线颜色
                'fill-outline-color': '#4CE600',
                'fill-opacity': 0.5,
            }
            break;
        case 'line':
            layer.layout = {
                visibility: 'visible',
                //线条末端样式
                'line-cap': 'round',
                //线条相交处样式
                'line-join': 'round'
            }
            layer.paint = {
                //设置线颜色
                'line-color': '#4CE600',
                //设置线宽度，像素单位
                'line-width': 2
            }
            break;
        case 'circle':
            layer.layout = {
                visibility: 'visible',
            }
            layer.paint = {
                //设置线颜色
                'circle-radius': 10, // 点的半径
                'circle-color': '#669933' // 点的颜色
            }
            break;

        default:
            break;
    }
    map.addLayer(layer);

    layerList.value.push({
        id: id,
        visible: true,
        source: source
    })
}
//通过空间类型获取图层类型
function GetLayerTypeByGeom(geom: string) {
    switch (geom) {
        case 'point':
        case 'Point':
        case 'MultiPoint':
        case 'multipoint':
            return 'circle';
        case 'line':
        case 'linestring':
        case 'LineString':
        case 'multiLine':
            return 'line';
        case 'polygon':
        case 'Polygon':
        case 'multipolygon':
        case 'MultiPolygon':
            return 'fill';

        default:
            return 'line';
    }
}

//加载Capabilities的影像数据
function LoadCapabilities(xmlString: string) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");
    var contents = xmlDoc.getElementsByTagName('Layer');
    if (contents) {
        for (let index = 0; index < contents.length; index++) {
            const content = contents.item(index);
            if (content) {
                const name = content.getElementsByTagName('ows:Identifier')[0].childNodes[0].nodeValue;
                // const name = content.getElementsByTagName('ows:Identifier')[0].textContent;
                // const format = content.getElementsByTagName('Format')[0].textContent;
                const style = content.getElementsByTagName('Style')[0]?.getElementsByTagName('ows:Identifier')[0].textContent;
                const tileMatrixSetLink = content.getElementsByTagName('TileMatrixSetLink')[0]?.getElementsByTagName('TileMatrixSet')[0].textContent;
                const LowerCorner = content.getElementsByTagName('ows:WGS84BoundingBox')[0]?.getElementsByTagName('ows:LowerCorner')[0].textContent;
                const UpperCorner = content.getElementsByTagName('ows:WGS84BoundingBox')[0]?.getElementsByTagName('ows:UpperCorner')[0].textContent;
                let resourceURL = content.getElementsByTagName('ResourceURL')[0].attributes.getNamedItem('template')?.value;
                if (resourceURL) {
                    if (style) {
                        resourceURL = resourceURL.replace('{Style}', style)
                    }
                    if (tileMatrixSetLink) {
                        resourceURL = resourceURL.replace('{TileMatrixSet}', tileMatrixSetLink)
                    }
                    resourceURL = resourceURL.replace('{TileMatrix}/{TileRow}/{TileCol}', '{z}/{y}/{x}');
                    let bounds;
                    if (LowerCorner && UpperCorner) {
                        const boundsStr = [...LowerCorner.split(' '), ...UpperCorner.split(' ')];
                        bounds = boundsStr.map(item => Number(item));
                    }
                    addRasterSource(name ?? newGuid(), resourceURL, bounds);
                }
            }
        }
    }
}
//添加影像raster数据源以及图层
function addRasterSource(id: string, url: string, bounds?: [number, number, number, number]) {
    map.addSource(id, {
        type: 'raster',
        tiles: [url],
        tileSize: 256,
        minzoom: 1,
        bounds: bounds
    });
    map.addLayer({
        id: id,
        type: 'raster',
        layout: { visibility: 'visible' },
        source: id
    });
    layerList.value.push({
        id: id,
        visible: true,
        source: id
    })
}

function RemiveSourceLayer() {
    if (layerList.value && layerList.value.length) {
        layerList.value.forEach(item => {
            const source = map.getSource(item.source);
            if (source) {
                map.removeSource(item.source);
            }
            map.removeLayer(item.id);
        })
        layerList.value.length = 0;
    }
}

onMounted(async () => {
    //加载时处理
    if (Global.map) {
        map = Global.map;
        // GetMapLayer();
        // const json = await (await fetch('https://vector.gis.digsur.com/vtile/admin/%E5%9B%BD%E9%81%93/tile.json?tk=00065a33-7951-4250-b1b2-ab7b871a4aa3')).json();
        // LoadTileJson(json);
        // const xml = await (await fetch('https://image.gis.digsur.com/IMGWMTS/%E5%8C%97%E4%BA%AC%E5%B1%B1%E4%BD%93%E9%98%B4%E5%BD%B1_100%E4%B8%87%E5%88%86%E4%B9%8B%E4%B8%80/Capabilities')).text();
        // LoadCapabilities(xml);
        map.on('click', GetFeatureInfo);
    }
})
onUnmounted(() => {
    //卸载时处理
    if (map) {
        map.off('click', GetFeatureInfo);
    }
})
</script>
<style lang="scss" scoped>
.mainPanel {
    position: absolute;
    left: 10px;
    top: 10%;
    height: 70%;
    min-width: 300px;
}

.layerPanel {
    height: 75%;

    .layerListPanel {
        height: 90%;

        overflow: auto;
    }
}
</style>