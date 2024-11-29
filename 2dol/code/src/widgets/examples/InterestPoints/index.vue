<template>
    <div id="map1" class="map"></div>
  </template>
  
  <script lang="ts">
    import { easeOut } from 'ol/easing';
    import Feature from 'ol/Feature';
    import Point from 'ol/geom/Point';
    import { fromLonLat } from 'ol/proj';
    import { getVectorContext } from 'ol/render';
    import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
    import { defineComponent, onMounted, ref } from 'vue';
    import {XMap,IProjInfo,PrjGridTool} from 'xgis-ol';
    import { data, geoCoordMap } from './data.js';
  import { View } from 'ol';
    // import { XMap, EnumSwipeType, RollSwipe } from '../../index';
    export default defineComponent({
      name: 'InterestPoint',
      props: {},
      components: {},
      setup(props) {
        const prj: IProjInfo = { Epsg: 'EPSG:4326' };
        const map1 = new XMap('map1');
  
        const poi = [];
        data.forEach((item, index) => {
          item.coord = geoCoordMap[item.name];
          // console.log(item.coord, item.name);
          poi.push(new Feature(new Point(item.coord)));
          poi[index].set('name', item.name);
          poi[index].set('value', item.value);
          var bdStyle = new Style({
            image: new CircleStyle({
              fill: new Fill({
                color: [128, 0, 128]
              }),
              radius: item.value / 20
            })
            // //文本样式
            // text: new Text({
            //   textAlign: 'center', //对齐方式
            //   textBaseline: 'middle', //文本基线
            //   font: 'normal 12px 微软雅黑', //字体样式
            //   text: item.value, //文本内容
            //   offsetY: -25, // Y轴偏置
            //   fill: new Fill({
            //     //填充样式
            //     color: '#000000'
            //   })
            // })
          });
          //poi[index].set("style",bdStyle)
          poi[index].setStyle(bdStyle);
        });
        poi.sort(function (a, b) {
          return b.get('value') - a.get('value');
        });
        const duration = 2000;
        const n = 3;
        const flashGeom = new Array(5 * n);
  
        function postRender(evt) {
          var vc = getVectorContext(evt);
          var frameState = evt.frameState;
          // console.log(poi.length,'poi长度')
          poi.forEach((item, index) => {
            //console.log('item',index)
            //vc.drawFeature(item, item.get('style'))
            vc.drawFeature(item, item.getStyle()); //
          });
          for (var i = 0; i < 5; i++) {
            for (var j = 0; j < n; j++) {
              if (flashGeom[j + i * n] == undefined) flashGeom[j + i * n] = poi[i].clone();
              if (flashGeom[j + i * n].get('start') == undefined)
                flashGeom[j + i * n].set('start', new Date().getTime() + 600 * j);
  
              var elapsed = frameState.time - flashGeom[j + i * n].get('start');
              if (elapsed >= duration) {
                flashGeom[j + i * n].set('start', flashGeom[j + i * n].get('start') + duration);
                elapsed = 0;
              }
  
              var elapsedRatio = elapsed / duration;
              elapsedRatio = elapsedRatio > 0 ? elapsedRatio : 0;
              elapsedRatio = elapsedRatio > 1 ? elapsedRatio - 1 : elapsedRatio;
  
              var radius = (easeOut(elapsedRatio) * flashGeom[j + i * n].get('value')) / 7;
              radius = radius > 0 ? radius : 0;
              var opacity = easeOut(1 - elapsedRatio * 1.3);
              var style = new Style({
                image: new CircleStyle({
                  radius: radius,
                  stroke: new Stroke({
                    color: 'rgba(128, 0, 128, ' + opacity + ')',
                    width: 0.1 + opacity
                  })
                })
              });
              vc.drawFeature(flashGeom[j + i * n], style);
            }
          }
          map1.map.render();
        }
  
        onMounted(() => {
        map1.initMapView({projection:'EPSG:4326',center:[116,40],zoom:5});
        const wmtsTool=map1.WMTSTool;
        const tileLayer=wmtsTool.addTDTLayer('vec_c', '矢量');
        tileLayer.on('postrender', postRender);
        setTimeout(()=>{
         const view=new View(
          {
            projection:'EPSG:3857',
            center:fromLonLat([116,40]),
            zoom:10
          }
         );
         console.log('切换投影坐标系统')
          map1.setView(view);
        },3000)
        });
  
        return {};
      }
    });
  </script>
  
  <style>
   
    .map {
      width: 100%;
      height: 100%;
    }
    .ol-popup {
      position: absolute;
      background-color: white;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
      padding: 15px;
      border-radius: 10px;
      border: 1px solid #cccccc;
      bottom: 12px;
      left: -50px;
      min-width: 50px;
    }
    .ol-popup:after,
    .ol-popup:before {
      top: 100%;
      border: solid transparent;
      content: ' ';
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
    }
    .ol-popup:after {
      border-top-color: white;
      border-width: 10px;
      left: 48px;
      margin-left: -10px;
    }
    .ol-popup:before {
      border-top-color: #cccccc;
      border-width: 11px;
      left: 48px;
      margin-left: -11px;
    }
    .ol-popup-closer {
      text-decoration: none;
      position: absolute;
      top: 2px;
      right: 8px;
    }
    .ol-popup-closer:after {
      content: '✖';
    }
  </style>
  