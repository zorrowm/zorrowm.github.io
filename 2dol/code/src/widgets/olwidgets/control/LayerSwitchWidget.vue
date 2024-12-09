<template>
    <div class="LayerSwitch">
        <q-btn round color="secondary">
            <Icon icon="ion:layers" color="#fff" />
            <q-menu  cover anchor="center left" style="min-height:80px;overflow: hidden;">
                <q-list class="row no-wrap" style="min-height:80px;overflow: hidden;">

                    <q-item v-for="(item, index) in layersList" :key="item.name" clickable class="column  items-center"
                        :style="checkedList.indexOf(item.name) >= 0?'border: 1px solid #f00':''" @click="doClick(item)">
                        <q-item-section style="width:70px;height:100%">
                            <q-img :src="item.image">
                            </q-img>
                        </q-item-section>
                        <q-item-section> {{ item.name }}</q-item-section>
                    </q-item>
                </q-list>
            </q-menu>

        </q-btn>

    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { Global } from 'xframelib';
import { XMap } from 'xgis-ol';

const layersList = [
    {
        name: '影像',
        layers: ['img_w', 'cia_w'],
        image: 'img/img.jpg',
        isOnly: true,
    },
    {
        name: '矢量',
        layers: ['vec_w', 'cva_w'],
        image: 'img/vec.jpg',
        isOnly: true,
    },
    {
        name: '地形',
        layers: ['ter_w', 'cta_w'],
        image: 'img/ter.jpg',
        isOnly: true,
    },
    {
        name: 'OSM',
        layers: ['osm'],
        image: 'img/osm.png',
        isOnly: false,
    }
]

const checkedList = ref(['矢量'])

function getSelectedStyle(item) {
    // let isShow=false;
    const isShow = checkedList.value.indexOf(item.name) >= 0;
    // if(Global.XMap)
    // {
    //     const xmap=Global.XMap as XMap;
    //     const len=item.layers.length;
    //     for(let i=0;i<len;i++)
    //     {
    //         const layer=item.layers[i];
    //         const tmpLayer=  xmap.LayerManager.getLayer(layer);
    //         if(tmpLayer&&tmpLayer.getVisible())
    //         {
    //             isShow=true;
    //             break;
    //         }
    //     }
    // }
    return isShow ? 'border: 1px solid #f00' : '';

}
const selectedStyle = computed(() => {
    return getSelectedStyle;
});

function doClick(item) {
    const xmap = Global.XMap as XMap;
    if (!xmap)
        return;
    if (item.isOnly) {
        layersList.forEach(it => {
            if (it.isOnly === item.isOnly) {
                if (it.name != item.name) {
                    const idx = checkedList.value.indexOf(it.name);
                    if (idx >= 0) {
                        checkedList.value.splice(idx, 1);
                        const len = it.layers.length;
                        for (let i = 0; i < len; i++) {
                            const layer = it.layers[i];
                            const tmpLayer = xmap.LayerManager.getLayer(layer);
                            if (tmpLayer && tmpLayer.getVisible()) {
                                tmpLayer.setVisible(false);
                            }
                        }

                    }

                }
                else {
                    const idx2 = checkedList.value.indexOf(item.name);
                    if (idx2 >= 0) {
                        checkedList.value.splice(idx2, 1);
                    }
                    else {
                        checkedList.value.push(item.name);
                    }
                    const len2 = item.layers.length;
                    for (let i = 0; i < len2; i++) {
                        const layer2 = item.layers[i];
                        const tmpLayer = xmap.LayerManager.getLayer(layer2);
                        if (tmpLayer) {
                            tmpLayer.setVisible(!tmpLayer.getVisible());
                        }
                        else {
                            //加入图层
                            xmap.addOnlineLayer(layer2);
                        }
                    }
                }
            }
        })
    }
    else {
        const idx2 = checkedList.value.indexOf(item.name);
        if (idx2 >= 0) {
            checkedList.value.splice(idx2, 1);
        }
        else {
            checkedList.value.push(item.name);
        }

        const len2 = item.layers.length;
        for (let i = 0; i < len2; i++) {
            const layer2 = item.layers[i];
            const tmpLayer = xmap.LayerManager.getLayer(layer2);
            if (tmpLayer) {
                tmpLayer.setVisible(!tmpLayer.getVisible());
            }
            else {
                //加入图层
                xmap.addOnlineLayer(layer2);
            }
        }

    }
}

onMounted(() => {

    console.log('LayerSwitcher加载了00000000')
});

</script>

<style scoped>
.LayerSwitch {
    position: absolute;
    right: 10px;
    bottom: 20px;
    width:auto;

}

.img-caption {
    position: absolute;
    bottom: -20px;
    font-size: 14px;

}
</style>