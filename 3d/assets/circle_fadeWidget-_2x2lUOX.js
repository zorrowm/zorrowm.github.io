import{aC as p,b1 as f,b5 as u,at as y,a6 as w}from"./vendor-CDV5M84i.js";import{j as _}from"./xframelib-exp-CvTEfE5n.js";import{d as g,v,x as b}from"./@vue-exp-YaP0LnBg.js";import{_ as C}from"./index-DPO_t7vI.js";import"./@hprose-exp-DifMA6AO.js";import"./axios-exp-BH40TtQM.js";import"./vue-router-exp-BeFgxScw.js";const h=g({__name:"circle_fadeWidget",setup(c,{expose:s}){s();let t,e;function i(r){let o=[];for(let a=0;a<r;a++){let d=120.38105869+Math.random()*.5,m=31.10115627+Math.random()*.5;o.push(new w(d,m))}return o}async function n(){e=new p("layer"),t.addLayer(e),i(10).forEach(o=>{let a=new f(o,1e3);a.setStyle({material:new u({color:y.fromRandom(),speed:10})}),e.addOverlay(a)}),await t.flyTo(e.delegate)}v(()=>{_.CesiumViewer&&(t=_.CesiumViewer,n())}),b(()=>{t&&e&&t.removeLayer(e)});const l={get viewer(){return t},set viewer(r){t=r},get layer(){return e},set layer(r){e=r},generatePosition:i,initLayer:n};return Object.defineProperty(l,"__isScriptSetup",{enumerable:!1,value:!0}),l}});function x(c,s,t,e,i,n){return null}const O=C(h,[["render",x],["__file","circle_fadeWidget.vue"]]);export{O as default};