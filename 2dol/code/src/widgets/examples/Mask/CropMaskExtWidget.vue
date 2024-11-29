<template>
    <div>
        <div class="options" >
    <ul><li>
      Filter:
      <div class="q-gutter-sm">
      <q-radio v-model="filterType" val="crop" label="Crop" />
      <q-radio v-model="filterType" val="mask" label="Mask" />
    </div>
    </li>
    <li>
    <div>
        <q-checkbox v-model="inner" label="inner内嵌式" />
      </div>
    </li>
    <li>
        <q-checkbox v-model="shadow" label="shaddow阴影" />
    </li>
    <li>
      Color of the mask:
      <div class="q-gutter-sm">
      <q-radio dense v-model="color" val="White" label="White白色" />
      <q-radio dense v-model="color" val="Transparent" label="Transparent透明" />
      <q-radio dense v-model="color" val="Red" label="Red" />
      <q-radio dense v-model="color" val="Green" label="Green" />
      <q-radio dense v-model="color" val="Blue" label="Blue" />
      <q-radio dense v-model="color" val="Yellow" label="Yellow" />
     </div>
      <!-- <select id="color" onchange="setFilter()">
        <option value="rgba(255,255,255,0.5)">White</option>
        <option value="transparent">Transparent</option>
        <option value="rgba(255,0,0,1)">Red</option>
        <option value="rgba(0,255,0,0.2)">Green</option>
        <option value="rgba(0,0,255,0.2)">Blue</option>
        <option value="rgba(255,255,0,0.2)">Yellow</option>
      </select> (mask only) -->
    </li></ul>
  </div>
    </div>
</template>

<script setup lang="ts">
import Crop from "ol-ext/filter/Crop.js";
import Mask from "ol-ext/filter/Mask";
import GeoJSON from "ol/format/GeoJSON.js";
import { Vector as VectorLayer } from "ol/layer.js";
import { Fill } from "ol/style.js";
import {OSM} from 'ol/source';
import {Tile} from 'ol/layer';
import { onMounted, ref, watch,onUnmounted } from 'vue';
import { Global } from "xframelib";
import { XMap } from "xgis-ol";
import testdata from './zhezhaotest.json';
//来源：https://blog.csdn.net/aaa_div/article/details/141193308

let xmap:XMap;
let crop:Crop;
let mask:Mask;


const filterType=ref('crop');
const inner=ref(false);
const shadow=ref(false);
const color=ref('White');
watch(()=>filterType.value,()=>setFilter());
watch(()=>inner.value,()=>setFilter());
watch(()=>shadow.value,()=>setFilter());
watch(()=>color.value,()=>setFilter());

function setFilter()
{
    crop.set('inner',inner.value); 
      crop.set('shadowWidth',shadow.value? 15 : 0);
      mask.set('inner', inner.value); 
      mask.set('shadowWidth', shadow.value? 15 : 0);
      let colorCss='transparent';
      switch(color.value)
      {
        case 'White':
            colorCss='rgba(255,255,255,0.5)';
            break;
            case 'Transparent':
            colorCss='transparent';
            break;
            case 'Red':
            colorCss='rgba(255,0,0,1)';
            break;
            case 'Green':
            colorCss='rgba(0,255,0,0.2)';
            break;
            case 'Blue':
            colorCss='rgba(0,0,255,0.2)';
            break;
            case 'Yellow':
            colorCss='rgba(255,255,0,0.2)';
            break;
      }
      mask.setFillColor(colorCss);

    mask.set('active', false); 
    crop.set('active', false); 
    switch(filterType.value)
    {
        case 'mask':
            mask.set('active',true);
            break;  
        default:
            crop.set('active',true);
            break; 
    }

}
 let base:Tile;
  onMounted(()=>{
    xmap=Global.XMap as XMap;
    // const group= xmap.map.getLayers().getArray();
    // const base =group[0] as any;
    base = new Tile({ source: new OSM() });
    xmap.map.addLayer(base);
    const prj=xmap.MapView.getProjection();
    const fts = new GeoJSON().readFeatures(testdata,{dataProjection:"EPSG:4326",featureProjection:prj});
    const maskFeature = fts[0];

    crop = new Crop({ 
      feature: maskFeature, 
      wrapX: true,
      inner: false
    });
    //@ts-ignore
    base.addFilter(crop);
    mask = new Mask({ 
      feature: maskFeature, 
      wrapX: true,
      inner: false, 
      fill: new Fill({ color:[255,255,255,0.8] }) 
    });
      //@ts-ignore
    base.addFilter(mask);
    setFilter();
  });
  onUnmounted(()=>{
    if(xmap&&base)
    {
        xmap.map.removeLayer(base);
    }
  });
  
</script>

<style scoped>
.options
{
    color:#000;
    position: absolute;
    width:300px;
    left:20px;
    top:20px;
    background-color: #eee;
}
</style>