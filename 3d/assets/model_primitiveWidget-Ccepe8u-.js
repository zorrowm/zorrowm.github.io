import{bn as u,bF as f,a6 as c}from"./vendor-CDV5M84i.js";import{j as m}from"./xframelib-exp-CvTEfE5n.js";import{d as y,v,x as g}from"./@vue-exp-YaP0LnBg.js";import{_ as w}from"./index-urNJi4nj.js";import"./@hprose-exp-DifMA6AO.js";import"./axios-exp-BH40TtQM.js";import"./vue-router-exp-BeFgxScw.js";const h=y({__name:"model_primitiveWidget",setup(p,{expose:s}){s();let e,t;function n(r){let o=[];for(let i=0;i<r;i++){let d=120.38105869+Math.random()*.5,_=31.10115627+Math.random()*.5;o.push(new c(d,_,1e3*Math.random(),3600*Math.random()))}return o}async function a(){t=new u("layer").addTo(e),n(1e3).forEach(o=>{let i=new f(o,"SampleData/data/Cesium_Air.glb");i.setStyle({scale:50}),t.addOverlay(i)}),e.flyToPosition("120.82005120445152,30.903795335982288,60975.10826917929,341.02,-50.29")}v(()=>{m.CesiumViewer&&(e=m.CesiumViewer,a())}),g(()=>{e&&t&&e.removeLayer(t)});const l={get viewer(){return e},set viewer(r){e=r},get layer(){return t},set layer(r){t=r},generatePosition:n,initLayer:a};return Object.defineProperty(l,"__isScriptSetup",{enumerable:!1,value:!0}),l}});function b(p,s,e,t,n,a){return null}const j=w(h,[["render",b],["__file","model_primitiveWidget.vue"]]);export{j as default};