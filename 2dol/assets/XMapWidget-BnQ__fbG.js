import{C as u,B as n}from"./xframelib-exp-Dmuc0LeW.js";import{s as _,S as g,v as M,K as x}from"./xgis-ol-exp-B8mY6ifK.js";import{d as C,r as m,b as h,$ as v,a0 as y,c as l,X as L}from"./@vue-exp-DTehQd6t.js";import{_ as b}from"./index-CQjc0PZC.js";import"./axios-exp-B_zfNCMU.js";import"./vendor-h8ZYNSbd.js";import"./@hprose-exp-CjxVQ5zB.js";import"./@iconify/vue-exp-Ct1khs4G.js";import"./ol-exp-DFAlSNM7.js";import"./monaco-editor-exp-B01XOe8A.js";import"./vue-router-exp-B0kidEOa.js";const j=C({__name:"XMapWidget",setup(f,{expose:r}){r();const o=m(),e=m(!1),s=[{},{id:"other",label:"更多功能",icon:"ic:round-other-houses"},{id:"test",label:"测试功能",icon:"ic:twotone-10k"}];function i(p){n.Message.info("点击了菜单："+p.label)}h(async()=>{const a=(await u("","DefaultMapConfig.json").catch(d=>{n.Message.warn("加载地图初始化配置DefaultMapConfig.json失败！"+d.Message)})).data;a.projInfo&&(a.viewOptions.Projection=_.getProjection(a.projInfo));const t=g.initByMapConfig(a);o.value=t,e.value=!!t.LayerManager,n.XMap=t});const c={mapRef:o,hasLayerTree:e,menuList:s,doItemClick:i,get ZoomFullBar(){return M},get ContextMenu(){return x}};return Object.defineProperty(c,"__isScriptSetup",{enumerable:!1,value:!0}),c}}),B={class:"MainMapWidget"},k={id:"map",class:"mapstyle"};function I(f,r,o,e,s,i){return L(),v("div",B,[y("div",k,[l(e.ZoomFullBar,{xmap:e.mapRef,hasLayerTree:e.hasLayerTree,class:"q-gutter-y-xs xmap-zoombar"},null,8,["xmap","hasLayerTree"]),l(e.ContextMenu,{xmap:e.mapRef,target:"map",moreMenuList:e.menuList,onItemClicked:e.doItemClick},null,8,["xmap"])])])}const O=b(j,[["render",I],["__scopeId","data-v-269efe73"],["__file","XMapWidget.vue"]]);export{O as default};