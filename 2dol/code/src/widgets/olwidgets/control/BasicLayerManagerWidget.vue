<template>
    <XWindow v-show="isShow" :isDark="true" top="10px" left="10px" nWidth="280px" hHeight="350px" title="在线影像底图" icon="img/basicimage/arcgis_img.png"
        pid="imageBaseLayerWidget" @loaded="loadedHandle" @close="doClosePanel">
        <q-scroll-area style="height:100%;">
            <div class="row q-col-gutter-sm">
                <div class="col-4" v-for="item, index in BasicLayerList" :key="index">
                    <q-card class="cardContent" :class="getSelectedStyle(item)" @click="selectItem(item)">
                        <q-img :src="item.img" height="75px">
                        </q-img>
                        <div class="text-center textContent">
                            {{ item.label }}
                        </div>
                    </q-card>
                </div>
            </div>
        </q-scroll-area>
    </XWindow>
</template>

<script lang="ts" setup>

import { EmitMsg } from 'src/events';
import { onMounted, ref } from 'vue';
import { Global,XWindow, XWindowManager } from 'xframelib';
import { BasicLayerList } from "xgis-ol";
import { XMap } from 'xgis-ol';
import WidgetsEvent from 'src/events/modules/WidgetsEvent';


let itemSelected = ref('');
let widgetID = 'BasicLayerManagerWidget';
let windowID='';
function loadedHandle(panelData)
{
    windowID=panelData.id;
}
function doClosePanel(panelData) {
  widgetID = panelData.pid;
  if (panelData.pid) {
    EmitMsg(WidgetsEvent.WidgetClosed, widgetID);
  }
}

function getSelectedStyle(item) {
    let style = '';
    if (itemSelected.value && item.id === itemSelected.value) style = 'cardSelected';
    return style;
}

function selectItem(item) {

    const oldSelected= itemSelected.value;
    itemSelected.value = item.id;
    if (Global.XMap) {
        const xmap=Global.XMap as XMap;
        if(oldSelected)
        {
            const old= BasicLayerList.find(p=>p.id===oldSelected);
            if(old&&old.layers?.length>0)
            {
                old.layers.forEach(it=>{
                    xmap.LayerManager.deleteLayerByID(it);
                })
            }
            const newLayers=item.layers;
            newLayers.forEach(it=>{
               xmap.addOnlineLayer(it);
            })
        

        }

    }
}


onMounted(() => {
    //加载时处理
    if (Global.XMap) {
        itemSelected.value ='TDT_VEC';
    }

})
/**
 * 对外暴露接口
 */
 const isShow = ref(true);
function changeVisible(isVisible: boolean = false) {
  isShow.value = isVisible;
  if(windowID&&isVisible)
  XWindowManager.openWindowPanel(windowID);
}
defineExpose({ changeVisible, isShow });

</script>
<style lang="scss" scoped>
.cardContent {
    background-color: rgb(52, 65, 82);
    color: white;
    font-size: 12px;

    .textContent {
        padding: 3px 0 4px 0;
        border: 1px solid white !important;
        border-top-style: none !important;
    }
}

.cardSelected {
    border: 1px solid rgb(0, 140, 255) !important;
    background-color: rgb(0, 140, 255);

    .textContent {
        border-style: none !important;
    }
}
</style>