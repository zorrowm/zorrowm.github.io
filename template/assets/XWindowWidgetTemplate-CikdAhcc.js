import{B as p,i as m,j as g}from"./xframelib-exp-CMLeiWD4.js";import{d as w,r as s,o as c,k as f,v as _,f as W,a4 as x,b as v,l as h}from"./@vue-exp-Bws36Ke9.js";import{_ as B}from"./index-BQ7ovaqR.js";import"./axios-exp-C7rfqWEd.js";import"./vendor-DJm_4oaR.js";import"./lottie-web-exp-CIY4INm7.js";import"./monaco-editor-exp-BNK_u0iZ.js";import"./@iconify/vue-exp-Q9Q0SWJB.js";import"./quasar-exp-BsaNoQ7w.js";import"./xgis-cesium-exp-Hv7oMXHX.js";import"./vue-router-exp-CO9L2VdX.js";const X=w({__name:"XWindowWidgetTemplate",setup(l,{expose:i}){const o=s("xwindowWidgetTemplate");let e="";function a(t){e=t.id}function d(t){o.value=t.pid,t.pid&&p.LayoutManager?.unloadWidget(o.value)}c(()=>{setTimeout(()=>{p.getLayoutManager(o.value)?.changeWidgetVisible(o.value,!0)},8e3)});const n=s(!0);function r(t=!1){n.value=t,e&&t&&g.openWindowPanel(e)}i({changeVisible:r,isShow:n});const u={widgetID:o,get windowID(){return e},set windowID(t){e=t},loadedHandle:a,doClosePanel:d,isShow:n,changeVisible:r,get XWindow(){return m}};return Object.defineProperty(u,"__isScriptSetup",{enumerable:!1,value:!0}),u}});function C(l,i,o,e,a,d){return f((v(),W(e.XWindow,{top:"10px",left:"10px",nWidth:"300px",nHeight:"400px",title:"XWindowWidget模版",icon:"img/logo.png",hasMax:!0,pid:"widgetID",onLoaded:e.loadedHandle,onClose:e.doClosePanel},{default:x(()=>i[0]||(i[0]=[h("span",null,"这是XWindowWidget模版，窗体的内容示例",-1)])),_:1},512)),[[_,e.isShow]])}const k=B(X,[["render",C],["__file","XWindowWidgetTemplate.vue"]]);export{k as default};
