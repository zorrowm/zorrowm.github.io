import{B as p}from"./xframelib-exp-Dmuc0LeW.js";import{r as g,s as v,t as x,G as M,u as y,K as D,v as S,b as V,a as E}from"./ol-exp-DFAlSNM7.js";import{d as F,r as L,b as h,D as P,$ as T,a0 as l,aa as b,X as C}from"./@vue-exp-DTehQd6t.js";import{_ as G}from"./index-CQjc0PZC.js";import"./axios-exp-B_zfNCMU.js";import"./vendor-h8ZYNSbd.js";import"./@hprose-exp-CjxVQ5zB.js";import"./@iconify/vue-exp-Ct1khs4G.js";import"./monaco-editor-exp-B01XOe8A.js";import"./vue-router-exp-B0kidEOa.js";const X=F({__name:"MVTDataWidget",setup(_,{expose:o}){o();const n=L("");let t;const r=new g({formatConstructors:[v,x,M,y,D,S]}),u=function(e){const a=[];if(p.XMap.map.forEachFeatureAtPixel(e,function(s){a.push(s)}),a.length>0){const s=[];let i,f;for(i=0,f=a.length;i<f;++i){const d=JSON.stringify(a[i].getProperties());d&&s.push(d)}n.value=s.join(", ")||"&nbsp"}else n.value="&nbsp;"};h(()=>{if(p.XMap){const e=p.XMap;e.map.addInteraction(r),r.on("addfeatures",function(a){const c=new V({features:a.features});t&&e.map.removeLayer(t),t=e.map.addLayer(new E({source:c})),e.map.getView().fit(c.getExtent())}),e.map.on("click",function(a){u(a.pixel)})}}),P(()=>{t&&p.XMap.map.removeLayer(t)});const m={infoContent:n,get mvtLayer(){return t},set mvtLayer(e){t=e},dragAndDropInteraction:r,displayFeatureInfo:u};return Object.defineProperty(m,"__isScriptSetup",{enumerable:!1,value:!0}),m}}),I={class:"rightPanel"};function w(_,o,n,t,r,u){return C(),T("div",I,[o[0]||(o[0]=l("h4",null,"拖拽MVT瓦片预览（支持EPSG:4326 或 EPSG:3857的MVT瓦片数据）",-1)),l("span",null,b(t.infoContent),1)])}const U=G(X,[["render",w],["__scopeId","data-v-aaa56dea"],["__file","MVTDataWidget.vue"]]);export{U as default};