import{j as m}from"./xframelib-exp-CvTEfE5n.js";import{aC as u,bk as a,at as l}from"./vendor-CDV5M84i.js";import{d as c,v as w,x as f}from"./@vue-exp-YaP0LnBg.js";import{_ as v}from"./index-DPO_t7vI.js";import"./axios-exp-BH40TtQM.js";import"./@hprose-exp-DifMA6AO.js";import"./vue-router-exp-BeFgxScw.js";const h=c({__name:"cylinderWidget",setup(_,{expose:o}){o();let t,e;async function i(){e=new u("layer"),t.addLayer(e);let r=new a("120.1,32,10000",2e4,5e3,5e3);r.setStyle({material:l.RED.withAlpha(.5)});let s=new a("120.3, 32.0,10000",2e4,0,5e3);s.setStyle({material:l.GREEN.withAlpha(.5)});let d=new a("120.5, 32.0,10000",2e4,5e3,0);d.setStyle({material:l.BLUE.withAlpha(.5)});let y=new a("120.7,32.0,10000",2e4,0,5e3);y.setStyle({slices:4,material:l.YELLOW.withAlpha(.5)});let p=new a("120.9,32.0,2500,90,90",5e3,5e3,0);p.setStyle({slices:4,material:l.ORANGE.withAlpha(.5)}),e.addOverlay(r).addOverlay(s).addOverlay(d).addOverlay(y).addOverlay(p),await t.flyTo(e.delegate)}w(()=>{m.CesiumViewer&&(t=m.CesiumViewer,i())}),f(()=>{t&&e&&t.removeLayer(e)});const n={get viewer(){return t},set viewer(r){t=r},get layer(){return e},set layer(r){e=r},initLayer:i};return Object.defineProperty(n,"__isScriptSetup",{enumerable:!1,value:!0}),n}});function C(_,o,t,e,i,n){return null}const x=v(h,[["render",C],["__file","cylinderWidget.vue"]]);export{x as default};