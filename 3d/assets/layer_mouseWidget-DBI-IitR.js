import{j as m}from"./xframelib-exp-CvTEfE5n.js";import{ak as u,al as d,aC as f,aD as c,aB as y,a6 as g}from"./vendor-CDV5M84i.js";import{d as v,v as w}from"./@vue-exp-YaP0LnBg.js";import{_ as h}from"./index-DPO_t7vI.js";import"./axios-exp-BH40TtQM.js";import"./@hprose-exp-DifMA6AO.js";import"./vue-router-exp-BeFgxScw.js";const C=v({__name:"layer_mouseWidget",setup(_,{expose:p}){p();let e;function o(r){let t=[];for(let i=0;i<r;i++){let a=120.38105869+Math.random()*.5,l=31.10115627+Math.random()*.5;t.push(new g(a,l))}return t}function n(){e=m.CesiumViewer;let r=u.createImageryLayer(d.GAODE,{style:"img",crs:"WGS84"});e.addBaseLayer(r);let t=new f("layer");e.addLayer(t),o(10).forEach(a=>{let l=new c(a);t.addOverlay(l)}),t.on(y.CLICK,a=>{}),e.flyTo(t)}w(()=>{n()});const s={get viewer(){return e},set viewer(r){e=r},generatePosition:o,initViewer:n};return Object.defineProperty(s,"__isScriptSetup",{enumerable:!1,value:!0}),s}});function L(_,p,e,o,n,s){return null}const V=h(C,[["render",L],["__file","layer_mouseWidget.vue"]]);export{V as default};