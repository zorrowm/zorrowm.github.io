import{B as t}from"./xframelib-exp-CBRV2soX.js";import{d as i,a as _,o as c,C as d,M as f,N as m,a2 as r,L as g}from"./@vue-exp-Cbz_CXqa.js";import{_ as v}from"./index-8yyKnfk0.js";import"./axios-exp-B_zfNCMU.js";import"./vendor-qEPl7M71.js";import"./@iconify/vue-exp-BeT9ZUzB.js";import"./monaco-editor-exp-B01XOe8A.js";import"./vue-router-exp-U1sBIDGE.js";const S=i({__name:"MapStatusWidget",setup(l,{expose:p}){p();const o=_({lat:0,lon:0,zoom:0});function a(e){o.value.lon=e.lngLat.lng.toFixed(8),o.value.lat=e.lngLat.lat.toFixed(8)}function s(e){o.value.zoom=Math.floor(e.target.getZoom())}c(()=>{if(t.map){const{lng:e,lat:u}=t.map.getCenter();o.value.lat=u.toFixed(8),o.value.lon=e.toFixed(8),o.value.zoom=Math.floor(t.map.getZoom()),t.map.on("mousemove",a),t.map.on("zoom",s)}}),d(()=>{t.map&&(t.map.off("mousemove",a),t.map.off("zoom",s))});const n={mapStatus:o,moveChange:a,zoomChange:s};return Object.defineProperty(n,"__isScriptSetup",{enumerable:!1,value:!0}),n}}),h={class:"statusPanel"},x={class:"q-mr-md"},C={class:"q-mr-md"},z={class:"q-mr-md"};function M(l,p,o,a,s,n){return g(),f("div",h,[m("span",x," 经度: "+r(a.mapStatus.lon),1),m("span",C," 纬度:"+r(a.mapStatus.lat),1),m("span",z," 层级: "+r(a.mapStatus.zoom),1)])}const k=v(S,[["render",M],["__scopeId","data-v-37829f67"],["__file","MapStatusWidget.vue"]]);export{k as default};