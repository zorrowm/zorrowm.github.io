import{a6 as v,J as C}from"./vendor-CcHNtcKJ.js";import{c as g,s as y}from"./xgis-ol-exp-DABivj7e.js";import{B as V,N as S}from"./xframelib-exp-CxzDUbp4.js";import{d as b,r as l,D as x,$ as D,c as u,a0 as d,aa as p,X as N}from"./@vue-exp-DTehQd6t.js";import{_ as j}from"./index-XkDzdRfP.js";import"./@hprose-exp-CYjcO8Nw.js";import"./@iconify/vue-exp-Ct1khs4G.js";import"./ol-exp-DkhKL1MQ.js";import"./axios-exp-B_zfNCMU.js";import"./vue-router-exp-B0kidEOa.js";const k=b({__name:"StyleJsonMapWidget",setup(L,{expose:o}){o();const s=l(""),a=l(""),i=l("");let r;const t=l("https://map.gis.digsur.com/Resource/styles/BJ_OSM_NEW/style.json?tk=undefined"),m=l("");function c(e){s.value=e.tileSchema?.rule??"W",a.value=e.id,i.value=e.name;const n=V.XMap;g(n.map,e).then(J=>{const _=n.MapView.getProjection();e.zoom,n.MapView.setZoom(e.zoom),e.center?n.MapView.setCenter(y.fromLonLatCoordinate(e.center,_)):n.MapView.setCenter(y.fromLonLatCoordinate(e.center,_))})}function M(){if(m.value){const e=JSON.parse(m.value);c(e)}else t.value&&S(t.value).then(e=>{e.data&&c(e.data)})}x(()=>{const e=V.XMap;r&&e.LayerManager.deleteLayer(r)});const f={PrjValue:s,serviceID:a,serviceName:i,get mvtLayer(){return r},set mvtLayer(e){r=e},styleJsonURL:t,styleJsonContent:m,loadMVTLayer:c,doClick:M};return Object.defineProperty(f,"__isScriptSetup",{enumerable:!1,value:!0}),f}}),B={class:"rightPanel"},w={class:"q-pa-md",style:{"max-width":"500px"}};function F(L,o,s,a,i,r){return N(),D("div",B,[u(v,{clearable:"",modelValue:a.styleJsonURL,"onUpdate:modelValue":o[0]||(o[0]=t=>a.styleJsonURL=t),label:"StyleJson地址","stack-label":"",dense:!1},null,8,["modelValue"]),d("div",w,[u(v,{clearable:"",modelValue:a.styleJsonContent,"onUpdate:modelValue":o[1]||(o[1]=t=>a.styleJsonContent=t),filled:"",type:"textarea"},null,8,["modelValue"])]),u(C,{color:"primary",label:"加载StyleJson",onClick:a.doClick}),d("div",null,[d("span",null,"图层ID:"+p(a.serviceID)+" 服务名："+p(a.serviceName)+" 切片方案："+p(a.PrjValue),1)])])}const X=j(k,[["render",F],["__scopeId","data-v-cffa1b11"],["__file","StyleJsonMapWidget.vue"]]);export{X as default};