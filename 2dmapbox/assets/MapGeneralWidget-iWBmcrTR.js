import{A as n}from"./vendor-qEPl7M71.js";import{B as i}from"./xframelib-exp-CBRV2soX.js";import{M as f,a as d}from"./MapMeasureTool-OMVPGK-b.js";import{d as _,o as b,C as v,M as x,N as c,e as s,F as S,L as y}from"./@vue-exp-Cbz_CXqa.js";import{_ as C}from"./index-8yyKnfk0.js";import"./axios-exp-B_zfNCMU.js";import"./@iconify/vue-exp-BeT9ZUzB.js";import"./monaco-editor-exp-B01XOe8A.js";import"./vue-router-exp-U1sBIDGE.js";const h=_({__name:"MapGeneralWidget",setup(g,{expose:r}){r();let e,t=[{id:"customHomePanel",local:"mapboxgl-ctrl-top-right"},{id:"customLoaclPanel",local:"mapboxgl-ctrl-top-right"},{id:"customMeasurePanel",local:"mapboxgl-ctrl-top-right"}];function p(){if(e){const o=e.getStyle();e.setCenter(o.center),e.setZoom(o.zoom)}}function m(){t&&t.length&&t.forEach(o=>{const l=document.getElementById(o.id);l&&(l.parentElement?.removeChild(l),setTimeout(()=>{document.getElementsByClassName(o.local)[0].appendChild(l)},500))})}function a(o){if(!e){i.Message.info("地图未初始化");return}d.StartMeasure(e,o)}function M(){if(!e){i.Message.info("地图未初始化");return}d.RemoveMeasure(e)}b(()=>{i.map&&(e=i.map,m())}),v(()=>{});const u={get map(){return e},set map(o){e=o},get customList(){return t},set customList(o){t=o},HomeMap:p,customElementAppend:m,StartMeasure:a,RemoveMeasure:M,get MapMeasureType(){return f}};return Object.defineProperty(u,"__isScriptSetup",{enumerable:!1,value:!0}),u}}),k={class:"mapboxgl-ctrl mapboxgl-ctrl-group",id:"customHomePanel"},B={class:"mapboxgl-ctrl mapboxgl-ctrl-group",id:"customLoaclPanel"},P={class:"mapboxgl-ctrl mapboxgl-ctrl-group",id:"customMeasurePanel"};function z(g,r,e,t,p,m){return y(),x(S,null,[c("div",k,[s(n,{class:"btnSize",color:"white",icon:"mdi-home",onClick:r[0]||(r[0]=a=>t.HomeMap())})]),c("div",B,[s(n,{class:"btnSize",color:"white",icon:"mdi-map-marker"})]),c("div",P,[s(n,{class:"btnSize",color:"white",icon:"mdi-ruler",onClick:r[1]||(r[1]=a=>t.StartMeasure(t.MapMeasureType.linestring))}),s(n,{class:"btnSize",color:"white",icon:"mdi-ruler-square",onClick:r[2]||(r[2]=a=>t.StartMeasure(t.MapMeasureType.polygon))}),s(n,{class:"btnSize",color:"white",icon:"delete",onClick:r[3]||(r[3]=a=>t.RemoveMeasure())})])],64)}const A=C(h,[["render",z],["__scopeId","data-v-7b1e1be0"],["__file","MapGeneralWidget.vue"]]);export{A as default};