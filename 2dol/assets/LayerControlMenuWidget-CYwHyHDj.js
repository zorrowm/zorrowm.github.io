import{B as t,g}from"./xframelib-exp-BL-NWzRk.js";import{T as c,k as M}from"./xgis-ol-exp-CUkajMJM.js";import{d as C,r as v,b as y,D as E,C as w,Q as L,$ as T,P as D,c as X}from"./@vue-exp-Mkau1HGZ.js";import{_ as B}from"./index-Dy2WIICa.js";import"./axios-exp-C7rfqWEd.js";import"./vendor-DLGs6WCJ.js";import"./@iconify/vue-exp-DwwUNauw.js";import"./ol-exp-B7umSeRp.js";import"./monaco-editor-exp-B01XOe8A.js";import"./vue-router-exp-LDq1UUA0.js";const I=C({__name:"LayerControlMenuWidget",setup(m,{expose:p}){p();const o=w();let n="";function u(e){n=e.id}function d(e){const r=o?.proxy?.$options.id,s=o?.proxy?.$options.layoutID;r&&t.LayoutMap.get(s)?.unloadWidget(r)}const f=[{},{name:"测试一下",icon:"gis:layer-up",value:"upMove2"},{name:"Test",icon:"gis:layer-down",value:"downMove2"}];function i(e){if(!a.value||e.mapID!=a.value.target)return;const{item:r,id:s,name:_,label:x}=e.data;t.Message.info(`右键菜单：${r.name},图层ID：${s},图层名：${_},图层Label:${x}`)}const a=v();y(()=>{if(t.XMap){const e=t.XMap;a.value=e,e.mapEventBus.eventOn(c.LAYER_TREE_CONTEXT_MENU,i)}}),E(()=>{t.XMap&&t.XMap.mapEventBus.eventOff(c.LAYER_TREE_CONTEXT_MENU,i)});const l={instance:o,get windowID(){return n},set windowID(e){n=e},loadedHandle:u,doClosePanel:d,contextMenuList:f,contextMenuHandle:i,xmapRef:a,get XWindow(){return g},get LayerTree(){return M}};return Object.defineProperty(l,"__isScriptSetup",{enumerable:!1,value:!0}),l}});function W(m,p,o,n,u,d){return D(),L(n.XWindow,{isDark:!1,top:"30px",left:"10px",nWidth:"350px",hHeight:"400px",title:"图层管理",icon:"img/basicimage/arcgis_img.png",onLoaded:n.loadedHandle,onClose:n.doClosePanel},{default:T(()=>[X(n.LayerTree,{xmap:n.xmapRef,moreContextMenu:n.contextMenuList},null,8,["xmap"])]),_:1})}const S=B(I,[["render",W],["__file","LayerControlMenuWidget.vue"]]);export{S as default};