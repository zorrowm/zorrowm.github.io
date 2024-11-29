<template>
    <div>

    </div>
</template>

<script setup lang="ts">
import GeoJSON from "ol/format/GeoJSON.js";
import Map from "ol/Map.js";
import View from "ol/View.js";
import { OSM, Vector as VectorSource, XYZ } from "ol/source.js";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import { Fill, Stroke, Text, Style } from "ol/style.js";
import { LineString, MultiPolygon, Point, Polygon } from "ol/geom.js";
import Mask from "ol-ext/filter/Mask";
import Crop from "ol-ext/filter/Crop.js";
import { Global,requestGet } from "xframelib";
import {ref,onMounted,onUnmounted} from 'vue';
import { XMap } from "xgis-ol";
//来源：https://blog.csdn.net/aaa_div/article/details/141193308

let xmap:XMap;
let vectorLayer:VectorLayer;
function addShadowByExt() {
    requestGet("","https://geo.datav.aliyun.com/areas_v3/bound/110000.json")
        .then((res) => {
          // 将 GeoJSON 数据解析为 ol.Feature 对象
          const features = new GeoJSON().readFeatures(res.data);
          const source = new VectorSource({
            features: features,
          });
          let layer = new VectorLayer({
            source: source,
          });
          this.map.addLayer(layer);
          //内发光
          let mask = this.addMask({
            fillColor: "#CC92E6",
            shadowColor: "#ff0",
            feature: features[0],
            inner: true,
          });
          //设置裁切
          this.setLayerFilterCrop(layer, features[0]);
          layer.addFilter(mask);
        });
    }
    //添加Mask
  function  addMask(options) {
      return new Mask({
        feature: options.feature,
        wrapX: false,
        inner: options.inner || false,
        fill: new Fill({ color: options.fillColor }),
        shadowColor: options.shadowColor || "rgba(0,0,0,0.5)",
        shadowWidth: options.shadowWidth || 10,
        // shadowMapUnits:true,
      });
    }
    function setLayerFilterCrop(layer, feature) {
      /**
       * 设置图层裁切
       */
      const crop = new Crop({
        feature: feature,
        inner: false,
        active: true,
        wrapX: true,
        shadowWidth: 10,
        shadowColor: "#000",
      });
      layer.addFilter(crop);
    }
    function addRegionLayer() {
    //   let _this = this;
      const source = new VectorSource({
        url: "https://geo.datav.aliyun.com/areas_v3/bound/110000.json",
        format: new GeoJSON(),
      });
      vectorLayer = new VectorLayer({
        source: source,
        style: new Style({
          renderer(coordinate, state) {
            let arr = coordinate[0][0];
            const ctx = state.context;
            addOutlineShadow(ctx, {
              fillStyle: "rgba(30, 60, 95,1)",
              shadowOffsetY: 30,
              shadowOffsetX: 2,
              shadowColor: "rgba(30, 60, 95,1)",
              strokeStyle: "rgba(30, 60, 95,1)",
              coodArr: arr,
            });
            addOutlineShadow(ctx, {
              fillStyle: "transparent",
              shadowOffsetY: 20,
              shadowOffsetX: 2,
              shadowColor: "rgba( 56, 113, 139,1)",
              strokeStyle: "rgba(30, 60, 95,1)",
              coodArr: arr,
            });
            addOutlineShadow(ctx, {
              fillStyle: "transparent",
              shadowOffsetY: 15,
              shadowOffsetX: 2,
              shadowColor: "rgba(255,255,255,1)",
              strokeStyle: "rgba(30, 60, 95,1)",
              shadowBlur: 10,
              coodArr: arr,
            });
           addOutlineShadow(ctx, {
              fillStyle: "transparent",
              shadowOffsetY: 10,
              shadowOffsetX: 2,
              shadowColor: "rgba(83, 173, 214,1)",
              strokeStyle: "rgba(83, 173, 214,1)",
              coodArr: arr,
            });
            addOutlineShadow(ctx, {
              fillStyle: "transparent",
              shadowOffsetY: 8,
              shadowOffsetX: 2,
              shadowColor: "rgba(255,255,255,1)",
              strokeStyle: "rgba(255,255,255,1)",
              shadowBlur: 10,
              coodArr: arr,
            });
           addOutlineShadow(ctx, {
              fillStyle: "#fff",
              shadowOffsetY: 5,
              shadowOffsetX: 2,
              shadowColor: "rgba(70, 133, 171,1)",
              strokeStyle: "rgba(70, 133, 171,1)",
              shadowBlur: 10,
              coodArr: arr,
            });
            //白色
            addOutlineShadow(ctx, {
              fillStyle: "rgba(70, 133, 171,1)",
              shadowOffsetY: 5,
              shadowOffsetX: 10,
              shadowColor: "rgba(255,255,255,1)",
              strokeStyle: "#50e3ff",
              shadowBlur: 15,
              coodArr: arr,
              lineWidth: 2,
            });
          },
        }),
      });
      if(vectorLayer)
      xmap.map.addLayer(vectorLayer);
    }

    function addOutlineShadow(ctx, option) {
      // 设置属性控制图形的外观
      ctx.fillStyle = option.fillStyle || "transparent";
      ctx.strokeStyle = option.strokeStyle || "transparent";
      ctx.lineWidth = option.lineWidth || 1;
 
      //  设置Y轴偏移量
      ctx.shadowOffsetY = option.shadowOffsetY || 20;
      //  设置X轴偏移量
      ctx.shadowOffsetX = option.shadowOffsetX || 2;
      //  设置模糊度
      ctx.shadowBlur = option.shadowBlur || 2;
      //  设置阴影颜色
      ctx.shadowColor = option.shadowColor || "#000";
      ctx.beginPath();
      let arr = option.coodArr || [];
      for (let i = 0; i < arr.length; i++) {
        const data = arr[i];
        if (i === 0) {
          ctx.moveTo(data[0], data[1]);
        } else {
          ctx.lineTo(data[0], data[1]);
        }
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

  onMounted(()=>{
    xmap=Global.XMap as XMap;
    // addRegionLayer();
    addShadowByExt();
  })
</script>

<style scoped>

</style>