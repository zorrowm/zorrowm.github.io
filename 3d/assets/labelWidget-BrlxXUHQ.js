import{bn as m,bv as d,at as c,a6 as y}from"./vendor-CDV5M84i.js";import{j as p}from"./xframelib-exp-CvTEfE5n.js";import{d as b,v,x as g}from"./@vue-exp-YaP0LnBg.js";import{_ as w}from"./index-urNJi4nj.js";import"./@hprose-exp-DifMA6AO.js";import"./axios-exp-BH40TtQM.js";import"./vue-router-exp-BeFgxScw.js";const x=b({__name:"labelWidget",setup(u,{expose:l}){l();let e,t;function a(r){let n=[];for(let o=0;o<r;o++){let _=120.38105869+Math.random()*.5,f=31.10115627+Math.random()*.5;n.push(new y(_,f))}return n}async function i(){t=new m("layer"),e.addLayer(t),a(20).forEach(n=>{let o=new d(n,"数字视觉");o.setStyle({fillColor:c.YELLOW,font:"12px"}),t.addOverlay(o)}),e.flyToPosition("120.8226729498609,31.268693185250438,114716.63624611919,0,-90")}v(()=>{p.CesiumViewer&&(e=p.CesiumViewer,i())}),g(()=>{e&&t&&e.removeLayer(t)});const s={get viewer(){return e},set viewer(r){e=r},get layer(){return t},set layer(r){t=r},generatePosition:a,initLayer:i};return Object.defineProperty(s,"__isScriptSetup",{enumerable:!1,value:!0}),s}});function C(u,l,e,t,a,i){return null}const S=w(x,[["render",C],["__file","labelWidget.vue"]]);export{S as default};