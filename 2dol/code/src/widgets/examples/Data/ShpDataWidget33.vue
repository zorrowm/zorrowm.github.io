<template>
  <div class="row flex-center">
    <q-file
      v-model="files"
      label="上传文件（或拖拽文件）ShapeFile的zip压缩包
      中文属性存在乱码问题
      "
      filled
      multiple
      @update:model-value="seletFilesHandle"
      style="width:400px;"
      input-style="height:150px"
    />
  </div>
</template>

<script setup lang="ts">
import GeoJSON from "ol/format/GeoJSON.js";
import { Vector as VectorLayer } from "ol/layer.js";
import { Vector as VectorSource } from "ol/source.js";
import { ref,onMounted, onUnmounted } from 'vue';
import { Global } from 'xframelib';
import { XMap } from "xgis-ol";
import {ShapefileLoader,DBFLoader} from '@loaders.gl/shapefile';
import {load} from '@loaders.gl/core';

// const data = await load(url, ShapefileLoader);


const files=ref(null);
let geojsonLayer:VectorLayer;
function seletFilesHandle(value)
{
    if(Array.isArray(value))
    {
        value.forEach(async it=>{
            console.log(typeof it,'变量类型',it)
            const filename=it.name as string;
            if(filename.endsWith('.shp'))
            {
                const data = await load(it, ShapefileLoader);
                console.log('shp的文件内容：',data);
                //加载图层
                const dbfName=filename.replace('.shp','.dbf');
                const dbfFile= value.find(p=>p.name===dbfName);
                if(dbfFile)
                {
                    const dataDBF = await load(dbfFile, ShapefileLoader);
                    console.log('dbf的文件内容：',dataDBF);
                }

            }
        })
    }
}




function seletFilesHandle222(value)
{
    if(Array.isArray(value))
    {
        if(value.length===1)
        {
            const firstFile=value[0];
            const filename=firstFile.name as string;
            if(filename.endsWith(".zip"))
            {
                const reader = new FileReader();
                //将文件以二进制形式读入页面
                reader.readAsArrayBuffer(firstFile);
                reader.onload = function () {
                    var fileData = this.result; //fileData就是读取到的文件的二进制数据
                    const xmap=Global.XMap as XMap;
                    const prj=xmap.MapView.getProjection();
                    shp(fileData).then(function (geojson) {
                        console.log(geojson);
                        const data=new GeoJSON().readFeatures(geojson,{dataProjection:"EPSG:4326",featureProjection:prj})
                            const  vectorSource = new VectorSource({
                                features:data
                        });

                    geojsonLayer= new VectorLayer({
                        source: vectorSource,
                    });
                    if(geojsonLayer)
                    xmap.map.addLayer(geojsonLayer as any);
                    });
                }

            }
        }
    }
}


// let geojsonLayer:VectorLayer;
// onMounted(()=>{
//     const xmap=Global.XMap as XMap;
     
//     const  vectorSource = new VectorSource({
//                 url: './SampleData/china.json',
//                 format: new GeoJSON(),
//             });

//           geojsonLayer= new VectorLayer({
//             source: vectorSource,
//           });
//           if(geojsonLayer)
//           xmap.map.addLayer(geojsonLayer as any);
// });

onUnmounted(()=>{

    if(geojsonLayer)
    {
        Global.XMap.map.removeLayer(geojsonLayer);
    }

});

</script>
