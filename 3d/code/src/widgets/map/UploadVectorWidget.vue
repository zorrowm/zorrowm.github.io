<template>
    <q-file class="filePanel" v-model="fileModel" filled accept=".geojson,.kml" label="选择矢量文件(.geojson,.kml)" @update:model-value="LoadVectorData"
         @rejected="onRejected" />
    <div class="mainPanel" @dragover.prevent="handleDragOver" @drop.prevent="handleDrop">
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useQuasar } from "quasar";
import { Map } from "mapbox-gl";
import { Global } from 'xframelib';
import { kml } from "@tmcw/togeojson";

const $q = useQuasar();
const fileModel = ref();
let map: Map
function LoadVectorData() {
    if (fileModel) {
        const reader = new FileReader();
        reader.onload = function (e) {
            if (reader.result) {
                if (fileModel.value.name.toString().indexOf('.kml') == -1) {
                    LoadDataSource(JSON.parse(reader.result.toString()));
                } else {
                    const content = new DOMParser().parseFromString(reader.result.toString(), "text/xml");
                    const geojson = kml(content);
                    LoadDataSource(geojson);
                }
            }
        };
        reader.readAsText(fileModel.value);
    }
}

function LoadDataSource(data: any) {
    if (!map) {
        return;
    }
    const source = map.getSource('UploadVectorData');
    if (!source) {
        map.addSource('UploadVectorData', {
            type: 'geojson',
            data: data
        });
        //面
        map.addLayer({
            id: 'UploadVectorDataLayerFill',
            type: 'fill',
            source: 'UploadVectorData',
            layout: {
                visibility: 'visible'
            },
            filter: ['==', '$type', 'Polygon'],
            paint: {
                'fill-color': '#ff0000',
                'fill-opacity': 0.5
            }
        });
        //线
        map.addLayer({
            id: 'UploadVectorDataLayerLine',
            type: 'line',
            source: 'UploadVectorData',
            layout: {
                visibility: 'visible'
            },
            'filter': ['==', '$type', 'LineString'],
            paint: {
                'line-color': '#ff0000',
                'line-opacity': 0.5,
                'line-width': 3
            }
        });
        //点
        map.addLayer({
            id: 'UploadVectorDataLayerPoint',
            type: 'circle',
            source: 'UploadVectorData',
            layout: {
                visibility: 'visible'
            },
            'filter': ['==', '$type', 'Point'],
            paint: {
                'circle-color': '#ff0000',
                'circle-opacity': 0.5
            }
        });
    } else {
        source.setData(data);
    }

}

function onRejected(rejectedEntries) {
    // Notify plugin needs to be installed
    // https://quasar.dev/quasar-plugins/notify#Installation
    $q.notify({
        type: 'negative',
        message: `${rejectedEntries.length} file(s) did not pass validation constraints`
    })
}

function handleDragOver(event) {
    console.log(`event`,event);
}
function handleDrop(event) {
    const files = event.dataTransfer.files;
    if(files && files.length > 0) {
        fileModel.value = files[0];
        LoadVectorData();
    }
}

onMounted(() => {
    //加载时处理
    if (Global.map) {
        map = Global.map;
    }
})
onUnmounted(() => {
    //卸载时处理
    if (map) {
        const source = map.getSource('UploadVectorData');
        if (source) {

            map.removeLayer('UploadVectorDataFull');
            map.removeLayer('UploadVectorDataLine');
            map.removeLayer('UploadVectorDataPoint');

            map.removeSource('UploadVectorData');
        }
    }
})
</script>
<style lang="scss" scoped>
.mainPanel {
    position: absolute;
    top: 10%;
    right: 10%;
    height: 80%;
    width: 80%;
}
.filePanel{
    position: absolute;
    top:2%;
    right: 2%;
    background-color: white;
    width: 300px;
}
</style>