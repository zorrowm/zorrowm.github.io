<template>
    <div class="contentPanel">
        <q-btn-group push>
            <q-btn color="primary" push label="点" icon="mdi-map-marker " @click="BeginDraw(0)" />
            <q-btn color="primary" push label="线" icon="timeline" @click="BeginDraw(1)" />
            <q-btn color="primary" push label="面" icon="mdi-vector-polygon" @click="BeginDraw(2)" />
            <q-btn color="primary" push label="矩形" icon="mdi-vector-rectangle" @click="BeginDraw(3)" />
            <q-btn color="primary" push label="删除" icon="close" @click="DeleteSelectDraw()" />
            <q-btn color="primary" push label="下载" icon="close" @click="DownloadDrawData()" />
        </q-btn-group>
    </div>
    <q-popup-proxy :model-value="visible" target="#clickMenuPopup" transition-show="flip-up" transition-hide="flip-down" @hide="visible=false">
        <div style="width: 150px">
            <q-list bordered separator>
                <q-item clickable v-ripple @click="BeginDraw(0)">
                    点
                </q-item>
                <q-item clickable v-ripple @click="BeginDraw(1)">
                    线
                </q-item>
                <q-item clickable v-ripple @click="BeginDraw(2)">
                    面
                </q-item>
                <q-item clickable v-ripple @click="BeginDraw(3)">
                    矩形
                </q-item>
            </q-list>
        </div>
    </q-popup-proxy>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Global } from 'xframelib';

import MapDrawTool from "./MapDrawTool";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

let mapdraw: MapDrawTool;

function BeginDraw(type: number) {
    if (visible.value) {
        visible.value = false;
    }
    switch (type) {
        case 0:
            mapdraw.DrawPoint();
            break;
        case 1:
            mapdraw.DrawLine();
            break;
        case 2:
            mapdraw.DrawPolygon();
            break;
        case 3:
            mapdraw.DrawRectangle();
            break;

        default:
            break;
    }
}

function DeleteSelectDraw() {
    mapdraw?.RemoveCurrentDraw();
}

const visible = ref(false);

function RightClickMenu(e) {
    console.log(`e`, e);
    var menu = document.getElementById("clickMenuPopup");
    if (menu) {
        menu.style.top =e.point.y + "px";
        menu.style.left =e.point.x+ "px";
    }
    visible.value = !visible.value;
}

function DownloadDrawData() {
    if (mapdraw ) {
        const data =mapdraw.GetDrawResult();
        if (data && data.features&& data.features.length) {
            const content = JSON.stringify(data);

            var a=document.createElement('a');
            a.href = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
            a.download='draw.geojson';
            a.click();

        }
    }
}

onMounted(() => {
    //加载时处理
    console.log(`绘制widget`);
    if (Global.map) {
        mapdraw = new MapDrawTool(Global.map);
        mapdraw.AddDrawControl({
            displayControlsDefault: false,
            controls: {
                point: true,
                line_string: true,
                rectangle: true,
                polygon: true,
                trash: true
            },
            // defaultMode: 'draw_polygon'
        });

        Global.map.on('contextmenu', RightClickMenu);
    }
})
onUnmounted(() => {
    //卸载时处理
    if (mapdraw) {
        console.log(`卸载绘制组件!!!!!!!!!`);
        mapdraw.RemoveDrawControl();
        Global.map.off('contextmenu', RightClickMenu);
    }
})
</script>
<style lang="scss" scoped>
.contentPanel {
    position: absolute;
    top: 2%;
    right: 5%;
}
.menuContent{
    position: absolute;
    top: 50%;
    right: 10%;
    min-width: 150px;
    min-width: 150px;
}
</style>