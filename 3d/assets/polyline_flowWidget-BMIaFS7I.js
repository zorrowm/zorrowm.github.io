import{aC as y,aS as o,aY as l,at as a}from"./vendor-CDV5M84i.js";import{j as d}from"./xframelib-exp-CvTEfE5n.js";import{d as c,v as w,x as f}from"./@vue-exp-YaP0LnBg.js";import{_ as v}from"./index-urNJi4nj.js";import"./@hprose-exp-DifMA6AO.js";import"./axios-exp-BH40TtQM.js";import"./vue-router-exp-BeFgxScw.js";const g=c({__name:"polyline_flowWidget",setup(p,{expose:s}){s();let t,e;async function n(){e=new y("layer"),t.addLayer(e);let r=new o("-75, 35; -80, 35").setStyle({width:5,material:new l({color:a.RED,speed:5}),clampToGround:!0}),u=new o(" -75, 30;-75, 35").setStyle({width:5,material:new l({color:a.ORANGE,speed:5}),clampToGround:!0}),m=new o("-80, 35; -80, 30").setStyle({width:5,material:new l({color:a.YELLOW,speed:10}),clampToGround:!0}),_=new o("-80, 30; -75, 30").setStyle({width:5,material:new l({color:a.GREEN,speed:10}),clampToGround:!0});e.addOverlay(r).addOverlay(u).addOverlay(m).addOverlay(_),await t.flyTo(e.delegate)}w(()=>{d.CesiumViewer&&(t=d.CesiumViewer,n())}),f(()=>{t&&e&&t.removeLayer(e)});const i={get viewer(){return t},set viewer(r){t=r},get layer(){return e},set layer(r){e=r},initLayer:n};return Object.defineProperty(i,"__isScriptSetup",{enumerable:!1,value:!0}),i}});function O(p,s,t,e,n,i){return null}const T=v(g,[["render",O],["__file","polyline_flowWidget.vue"]]);export{T as default};