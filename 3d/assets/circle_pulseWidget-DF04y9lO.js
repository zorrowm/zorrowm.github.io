import{aC as c,a6 as p,b1 as _,b9 as u,at as m}from"./vendor-CDV5M84i.js";import{j as n}from"./xframelib-exp-CvTEfE5n.js";import{d as f,v as d,x as y}from"./@vue-exp-YaP0LnBg.js";import{_ as w}from"./index-DPO_t7vI.js";import"./@hprose-exp-DifMA6AO.js";import"./axios-exp-BH40TtQM.js";import"./vue-router-exp-BeFgxScw.js";const v=f({__name:"circle_pulseWidget",setup(l,{expose:a}){a();let e,r;async function i(){r=new c("layer").addTo(e);let t=p.fromObject({lng:121.49536592256028,lat:31.241616722278213}),s=new _(t,3e3);s.setStyle({classificationType:0,material:new u({color:m.YELLOW.withAlpha(.2),speed:5})}),r.addOverlay(s),e.flyToPosition("121.4941629,31.2091462,1859.56,0,-28.71")}d(()=>{n.CesiumViewer&&(e=n.CesiumViewer,i())}),y(()=>{e&&r&&e.removeLayer(r)});const o={get viewer(){return e},set viewer(t){e=t},get layer(){return r},set layer(t){r=t},initLayer:i};return Object.defineProperty(o,"__isScriptSetup",{enumerable:!1,value:!0}),o}});function b(l,a,e,r,i,o){return null}const h=w(v,[["render",b],["__file","circle_pulseWidget.vue"]]);export{h as default};