import{j as n}from"./xframelib-exp-CvTEfE5n.js";import{ak as s,al as _,ax as p}from"./vendor-CDV5M84i.js";import{d as c,v as m}from"./@vue-exp-YaP0LnBg.js";import{_ as u}from"./index-DPO_t7vI.js";import"./axios-exp-BH40TtQM.js";import"./@hprose-exp-DifMA6AO.js";import"./vue-router-exp-BeFgxScw.js";const d=c({__name:"clockWidget",setup(a,{expose:i}){i();let e;function t(){e=n.CesiumViewer;let r=s.createImageryLayer(_.GAODE,{style:"img"});e.addBaseLayer(r),e.on(p.CLOCK_TICK,l=>{})}m(()=>{t()});const o={get viewer(){return e},set viewer(r){e=r},initViewer:t};return Object.defineProperty(o,"__isScriptSetup",{enumerable:!1,value:!0}),o}});function f(a,i,e,t,o,r){return null}const L=u(d,[["render",f],["__file","clockWidget.vue"]]);export{L as default};