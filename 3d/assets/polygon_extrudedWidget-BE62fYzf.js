import{aC as l,b0 as _,at as d}from"./vendor-CDV5M84i.js";import{j as i}from"./xframelib-exp-CvTEfE5n.js";import{d as p,v as u,x as m}from"./@vue-exp-YaP0LnBg.js";import{_ as f}from"./index-DPO_t7vI.js";import"./@hprose-exp-DifMA6AO.js";import"./axios-exp-BH40TtQM.js";import"./vue-router-exp-BeFgxScw.js";const c=p({__name:"polygon_extrudedWidget",setup(s,{expose:n}){n();let t,e;async function o(){e=new l("layer"),t.addLayer(e);let r=new _("-108.0, 42.0; -100.0, 42.0;-104.0, 40.0");r.setStyle({extrudedHeight:5e5,material:d.RED,closeTop:!1,closeBottom:!1}),e.addOverlay(r),await t.flyTo(e.delegate)}u(()=>{i.CesiumViewer&&(t=i.CesiumViewer,o())}),m(()=>{t&&e&&t.removeLayer(e)});const a={get viewer(){return t},set viewer(r){t=r},get layer(){return e},set layer(r){e=r},initLayer:o};return Object.defineProperty(a,"__isScriptSetup",{enumerable:!1,value:!0}),a}});function y(s,n,t,e,o,a){return null}const L=f(c,[["render",y],["__file","polygon_extrudedWidget.vue"]]);export{L as default};