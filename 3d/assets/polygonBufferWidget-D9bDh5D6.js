import{aC as u,b0 as l,at as s}from"./vendor-CDV5M84i.js";import{j as p}from"./xframelib-exp-CvTEfE5n.js";import{G as m}from"./GeoTools-BThIyIfl.js";import{d,v as y}from"./@vue-exp-YaP0LnBg.js";import{_ as c}from"./index-urNJi4nj.js";import"./@hprose-exp-DifMA6AO.js";import"./axios-exp-BH40TtQM.js";import"./vue-router-exp-BeFgxScw.js";const g=d({__name:"polygonBufferWidget",setup(f,{expose:a}){a();let r;async function t(){if(p.CesiumViewer){r=p.CesiumViewer;let e=new u("layer");r.addLayer(e);let i=new l("120.71259021075333,31.22148081085083;120.71611354431036,31.221447256684566;120.7140691869497,31.21875584696343");i.setStyle({zIndex:1,material:s.YELLOW}),e.addOverlay(i);let _=await m.polygonBuffer("120.71259021075333,31.22148081085083;120.71611354431036,31.221447256684566;120.7140691869497,31.21875584696343",1e3),n=new l(_);n.setStyle({material:s.RED.withAlpha(.4)}),e.addOverlay(n),r.flyTo(e.delegate)}}y(()=>{t()});const o={get viewer(){return r},set viewer(e){r=e},initViewer:t};return Object.defineProperty(o,"__isScriptSetup",{enumerable:!1,value:!0}),o}});function w(f,a,r,t,o,e){return null}const $=c(g,[["render",w],["__file","polygonBufferWidget.vue"]]);export{$ as default};