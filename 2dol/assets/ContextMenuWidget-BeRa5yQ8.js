import{B as t}from"./xframelib-exp-CxzDUbp4.js";import{K as s}from"./xgis-ol-exp-DABivj7e.js";import{d as u,r as m,b as _,Y as l,a2 as d,X as f}from"./@vue-exp-DTehQd6t.js";import{_ as x}from"./index-jafnMoOd.js";import"./axios-exp-B_zfNCMU.js";import"./vendor-CcHNtcKJ.js";import"./@hprose-exp-CYjcO8Nw.js";import"./@iconify/vue-exp-Ct1khs4G.js";import"./ol-exp-DkhKL1MQ.js";import"./vue-router-exp-B0kidEOa.js";const M=u({__name:"ContextMenuWidget",setup(c,{expose:r}){r();const o=m(t.XMap),e=[{},{id:"other",label:"更多功能",icon:"ic:round-other-houses"},{id:"test",label:"测试功能",icon:"ic:twotone-10k"}],n=m("map");function a(p){t.Message.info("点击了"+p.label)}_(()=>{o.value=t.XMap,n.value=t.XMap.target});const i={xmapRef:o,menuList:e,contextTarget:n,doItemClick:a,get ContextMenu(){return s}};return Object.defineProperty(i,"__isScriptSetup",{enumerable:!1,value:!0}),i}});function g(c,r,o,e,n,a){return e.xmapRef?(f(),l(e.ContextMenu,{key:0,xmap:e.xmapRef,target:e.contextTarget,moreMenuList:e.menuList,onItemClicked:e.doItemClick},null,8,["xmap","target"])):d("",!0)}const W=x(M,[["render",g],["__file","ContextMenuWidget.vue"]]);export{W as default};