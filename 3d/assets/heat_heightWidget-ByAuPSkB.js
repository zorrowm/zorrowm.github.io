import{bU as f,a6 as d}from"./vendor-CDV5M84i.js";import{j as u}from"./xframelib-exp-CvTEfE5n.js";import{d as c,v as h,x as g}from"./@vue-exp-YaP0LnBg.js";import{_ as y}from"./index-urNJi4nj.js";import"./@hprose-exp-DifMA6AO.js";import"./axios-exp-BH40TtQM.js";import"./vue-router-exp-BeFgxScw.js";const v=c({__name:"heat_heightWidget",setup(p,{expose:o}){o();let e,t;function i(r){let s=[];for(let _=0;_<r;_++){let l=120.38105869+Math.random()*.5,m=31.10115627+Math.random()*.5;s.push(new d(l,m,1e3))}return s}async function n(){t=new f("layer",{height:4e3}),t.setPoints(i(1e3)),e.addLayer(t),e.flyToPosition("120.670183527,31.348282115,109658.22,0,-90")}h(()=>{u.CesiumViewer&&(e=u.CesiumViewer,n())}),g(()=>{e&&t&&e.removeLayer(t)});const a={get viewer(){return e},set viewer(r){e=r},get layer(){return t},set layer(r){t=r},generatePosition:i,initLayer:n};return Object.defineProperty(a,"__isScriptSetup",{enumerable:!1,value:!0}),a}});function w(p,o,e,t,i,n){return null}const M=y(v,[["render",w],["__file","heat_heightWidget.vue"]]);export{M as default};