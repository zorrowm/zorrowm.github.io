import{B as t,f as x}from"./xframelib-exp-Dmuc0LeW.js";import{e as d,J as g}from"./xgis-ol-exp-DQ1wUSVC.js";import{d as M,r as v,b as C,D as E,Y as L,a6 as w,X as y,c as T}from"./@vue-exp-DTehQd6t.js";import{_ as X}from"./index-DqWnk5Rr.js";import"./axios-exp-B_zfNCMU.js";import"./vendor-h8ZYNSbd.js";import"./@hprose-exp-CjxVQ5zB.js";import"./@iconify/vue-exp-Ct1khs4G.js";import"./ol-exp-DFAlSNM7.js";import"./monaco-editor-exp-B01XOe8A.js";import"./vue-router-exp-B0kidEOa.js";const B=M({__name:"LayerControlMenuWidget",setup(l,{expose:i}){i();let a="";function n(e){a=e.id}function p(e){}const s=[{},{name:"测试一下",icon:"gis:layer-up",value:"upMove2"},{name:"Test",icon:"gis:layer-down",value:"downMove2"}];function r(e){if(!o.value||e.mapID!=o.value.target)return;const{item:u,id:c,name:f,label:_}=e.data;t.Message.info(`右键菜单：${u.name},图层ID：${c},图层名：${f},图层Label:${_}`)}const o=v();C(()=>{if(t.XMap){const e=t.XMap;o.value=e,e.mapEventBus.eventOn(d.LAYER_TREE_CONTEXT_MENU,r)}}),E(()=>{t.XMap&&t.XMap.mapEventBus.eventOff(d.LAYER_TREE_CONTEXT_MENU,r)});const m={get windowID(){return a},set windowID(e){a=e},loadedHandle:n,doClosePanel:p,contextMenuList:s,contextMenuHandle:r,xmapRef:o,get XWindow(){return x},get LayerTree(){return g}};return Object.defineProperty(m,"__isScriptSetup",{enumerable:!1,value:!0}),m}});function D(l,i,a,n,p,s){return y(),L(n.XWindow,{isDark:!1,top:"30px",left:"10px",nWidth:"350px",hHeight:"400px",title:"图层管理",icon:"img/basicimage/arcgis_img.png",pid:"imageBaseLayerWidget",onLoaded:n.loadedHandle,onClose:n.doClosePanel},{default:w(()=>[T(n.LayerTree,{xmap:n.xmapRef,moreContextMenu:n.contextMenuList},null,8,["xmap"])]),_:1})}const U=X(B,[["render",D],["__file","LayerControlMenuWidget.vue"]]);export{U as default};