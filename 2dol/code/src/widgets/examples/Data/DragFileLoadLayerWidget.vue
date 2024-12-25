<template>
  <div class="row justify-center">
    <span style="z-index: 100;">拖拽文件，添加对应图层到地图上</span>
    <q-btn color="primary" label="导出SHP" @click="handleExport" />

    <q-btn color="primary" label="导出矢量图层为json" @click="handleExport2" />
  </div>
</template>

<script setup lang="ts">

import GeoJSON from "ol/format/GeoJSON.js";
import { Vector as VectorLayer } from "ol/layer.js";
import { Vector as VectorSource } from "ol/source.js";
import { onMounted } from 'vue';
import { Global, H5Tool, ZipTool, get, isString,SaveAs } from 'xframelib';
import { import2DFiles, internal,saveDataset,saveDatasetFromGeojson,getProj,transformDataset } from 'xgis-data2d';
import { XMap } from 'xgis-ol';

const {
  importContent,
  exportDatasetAsGeoJSON,
  setDatasetCrsInfo,
  exportFileContent,
  importGeoJSON
} = internal

let  geojsonLayer:VectorLayer;
async function dragFileHandler(fileList: FileList) {
  if (!fileList || fileList.length === 0)
    return;
  {
    const len = fileList.length;
    console.log('文件个数为：', len);

    const files = Array.from(fileList) 
    const result = await import2DFiles(files);
    if (result && result.length > 0) {
      const xmap = Global.XMap as XMap;
      const prj=xmap.MapView.getProjection();
      result.forEach(it => {
        console.log('00000000数据集：',it.dataset);
        const content = exportDatasetAsGeoJSON(it.dataset, {})
        const data = new GeoJSON().readFeatures(content, { dataProjection: "EPSG:4326", featureProjection:prj})
        const vectorSource = new VectorSource({
          features: data
        });

       geojsonLayer = new VectorLayer({
          source: vectorSource,
        });
        console.log('00000000000加入图层：', it.layername);
        if (geojsonLayer) {

          xmap.map.addLayer(geojsonLayer as any);
        }
      })
    }
  }


}


async function pasteFileHandler(copyContent: string|File[]) {

  if(isString(copyContent))
  {
    Global.Message.info(copyContent as string);
  }
  else if(Array.isArray(copyContent)){

    const files = copyContent as File[]; 
    if(files.length===0)
    return;
    const result = await import2DFiles(files);
    if (result && result.length > 0) {
      result.forEach(it => {
        const content = exportDatasetAsGeoJSON(it.dataset, {})
        const data = new GeoJSON().readFeatures(content, { dataProjection: "EPSG:4326", featureProjection: "EPSG:3857" })
        const vectorSource = new VectorSource({
          features: data
        });

        const geojsonLayer = new VectorLayer({
          source: vectorSource,
        });
        console.log('00000000000加入图层：', it.layername);
        if (geojsonLayer) {
          const xmap = Global.XMap as XMap;
          xmap.map.addLayer(geojsonLayer as any);
        }


      })

    }

  }

}
//#region  导出相关的


async function handleExport2()
{
   if(!geojsonLayer)
   {
    console.log('空图层！')
    return;
   }
  const features= geojsonLayer.getSource()?.getFeatures();
  // const geoInfo= new GeoJSON().writeFeatures(features,{dataProjection:'EPSG:4326',featureProjection:'EPSG:3857'});
  // // const dataset=importGeoJSON(geoInfo,{});
  // // saveDataset(dataset,,'shapefile');
  // //直接导出——经纬度4326
  // saveDatasetFromGeojson(geoInfo,'shapefile');

  //dataset 为3857,先转投影再导出
  const geoInfo2= new GeoJSON().writeFeatures(features);
  const dataset2=importGeoJSON(geoInfo2,{});
  console.log('1111111111',dataset2);
  const ds=await transformDataset(dataset2,'EPSG:3857','EPSG:4326');
  console.log('22222222',ds);
  if(dataset2)
  saveDataset(dataset2,'shapefile',true,'4326.zip');
}

async function handleExport() {


  const p = await get('SampleData/china.json');

  const dataset = importContent({ json: { filename: 'china.json', content: JSON.stringify(p.data) } })

  // https://epsg.io/4326.esriwkt
  setDatasetCrsInfo(dataset, { prj: 'GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]]' })
  console.log(dataset, typeof dataset, 'dataset')

  saveDataset(dataset,'shapefile')
}

//#endregion

onMounted(() => {
  if (Global.XMap) {
    //拖拽文件加载
    H5Tool.bindDropFileHanlder("map",dragFileHandler);
    H5Tool.onPasteHandler(pasteFileHandler);
    // setTimeout(() => {
    //   H5Tool.offPasteHandler();
    //   console.log('移除了pastes处理事件');
    // }, 20000);
  }
})

</script>