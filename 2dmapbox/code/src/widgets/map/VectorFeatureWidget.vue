<template>
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
import { Map } from "mapbox-gl";
import { Global } from "xframelib";

let map: Map;
//加载矢量图层
function initMap(map: Map) {
    map.addSource('DemoSourcce', {
        type: 'vector',
        tiles: ['https://vector.gis.digsur.com/vtile/admin/%E5%9B%BD%E9%81%93/{z}/{x}/{y}.mvt?tk=00065a33-7951-4250-b1b2-ab7b871a4aa3'],
    });

    map.addLayer({
        id: 'DemoLayer',
        type: 'line',
        paint: {
            //设置线颜色
            'line-color': '#4CE600',
            //设置线宽度，像素单位
            'line-width': 2
        },
        layout: {
            visibility: 'visible',
            //线条末端样式
            'line-cap': 'round',
            //线条相交处样式
            'line-join': 'round'
        },
        source: 'DemoSourcce',
        'source-layer': '国道',
    });

    map.on('click', GetFeatureInfo);
}

const visible = ref(false);
const featuresInfo = ref<any[]>([])
function GetFeatureInfo(e) {

    var features = map.queryRenderedFeatures(e.point); //指定图层可增加参数{layers:[]};
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

onMounted(() => {
    //加载时处理
    if (Global.map) {
        map = Global.map;
        initMap(map);
    }
})
onUnmounted(() => {
    //卸载时处理
    if (map) {
        map.off('click', GetFeatureInfo);
    }
})
</script>
<style lang="scss" scoped></style>