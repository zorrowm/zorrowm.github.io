import{b$ as S,c6 as v,bQ as B}from"./vendor-B1f7FUIB.js";import{k as L,_ as I}from"./index-CvUQtR9N.js";import{S as x}from"./SystemsEvent-DUQCZw_Q.js";import{B as s,f as W,n as k}from"./xframelib-exp-B9KgMBHw.js";import{c as D}from"./xgis-cesium-exp-BxTEbf-R.js";import{d as b,r as w,o as V,k as E,v as M,f as F,a3 as d,b as l,j as c,l as y,e as C,aa as P,a1 as Q,a6 as H,V as j}from"./@vue-exp-DMKPrOh0.js";import"./@hprose-exp-BEudjurc.js";import"./pdfjs-dist-exp-C7mOU4gj.js";import"./vue-router-exp-DWvvxSx9.js";import"./axios-exp-B_zfNCMU.js";import"./@iconify/vue-exp-5llPk3YT.js";const N=b({__name:"ImageBaseLayerWidget",setup(h,{expose:u}){let a=w(""),t="imageBaseLayerWidget",i="";function m(e){i=e.id}function r(e){t=e.pid,e.pid&&(L(x.WidgetClosed,t),s.LayoutManager?.unloadWidget(t))}function o(e){let _="";return a.value&&e.id===a.value&&(_="cardSelected"),_}function g(e){a.value=e.id,s.CesiumViewer&&s.CesiumViewer.setBasicLayer(e.id)}V(()=>{s.CesiumViewer&&(a.value=s.CesiumViewer.CurrentBasicID),setTimeout(()=>{s.getLayoutManager(t)?.changeWidgetVisible(t,!0)},8e3)});const n=w(!0);function f(e=!1){n.value=e,i&&e&&k.openWindowPanel(i)}u({changeVisible:f,isShow:n});const p={get itemSelected(){return a},set itemSelected(e){a=e},get widgetID(){return t},set widgetID(e){t=e},get windowID(){return i},set windowID(e){i=e},loadedHandle:m,doClosePanel:r,getSelectedStyle:o,selectItem:g,isShow:n,changeVisible:f,get XWindow(){return W},get BasicLayerList(){return D}};return Object.defineProperty(p,"__isScriptSetup",{enumerable:!1,value:!0}),p}}),X={class:"row q-col-gutter-sm"},q={class:"text-center textContent"};function z(h,u,a,t,i,m){return E((l(),F(t.XWindow,{isDark:!0,top:"10px",left:"10px",nWidth:"280px",hHeight:"350px",title:"在线影像底图",icon:"img/basicimage/arcgis_img.png",pid:"imageBaseLayerWidget",onLoaded:t.loadedHandle,onClose:t.doClosePanel},{default:d(()=>[c(B,{style:{height:"100%"}},{default:d(()=>[y("div",X,[(l(!0),C(j,null,P(t.BasicLayerList,(r,o)=>(l(),C("div",{class:"col-4",key:o},[c(S,{class:Q(["cardContent",t.getSelectedStyle(r)]),onClick:g=>t.selectItem(r)},{default:d(()=>[c(v,{src:r.img,height:"75px"},null,8,["src"]),y("div",q,H(r.label),1)]),_:2},1032,["class","onClick"])]))),128))])]),_:1})]),_:1},512)),[[M,t.isShow]])}const ee=I(N,[["render",z],["__scopeId","data-v-58ad607e"],["__file","ImageBaseLayerWidget.vue"]]);export{ee as default};