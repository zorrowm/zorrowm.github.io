import{B as r}from"./xframelib-exp-Dokv845S.js";import{u as i,K as s}from"./xgis-ol-exp-CTawL6iO.js";import{T as p,O as m}from"./ol-exp-DuIEpEAh.js";import{d as c,y as d,z as _,$ as u,a0 as f,X as M}from"./@vue-exp-CxZKVZL7.js";import{_ as l}from"./index-3mXAM2d5.js";import"./axios-exp-B_zfNCMU.js";import"./vendor-Cm8vbQLD.js";import"./@hprose-exp-DksTqdcd.js";import"./@iconify/vue-exp-CNvCUaPp.js";import"./vue-router-exp-BoJcrdOF.js";const g="map",v="map",w=!0,y={zoom:5,center:[116.46229441189399,40.24876149],minZoom:1,maxZoom:22,projection:"EPSG:3857"},O=["vec_w","cva_w"],j={id:g,group:v,hasLayerManager:w,viewOptions:y,layers:O},x=c({__name:"MainMapWidget",setup(n,{expose:o}){o(),d(()=>{const e=j,a=new i(e.id,e.group,e.hasLayerManager);e.projInfo&&(e.viewOptions.Projection=s.getProjection(e.projInfo)),a.initMapView(e.viewOptions),a.map.addLayer(new p({source:new m})),r.XMap=a}),_(()=>{});const t={};return Object.defineProperty(t,"__isScriptSetup",{enumerable:!1,value:!0}),t}}),L={class:"MainMapWidget"};function $(n,o,t,e,a,B){return M(),u("div",L,o[0]||(o[0]=[f("div",{id:"map",class:"mapstyle"},null,-1)]))}const K=l(x,[["render",$],["__scopeId","data-v-45f9ca6a"],["__file","MainMapWidget.vue"]]);export{K as default};