import{bZ as s,b_ as C,b$ as n,c0 as p,j as c}from"./vendor-CDV5M84i.js";import{B as b}from"./BaseTutorial-wDddOiQ2.js";import{j as m}from"./xframelib-exp-CvTEfE5n.js";import{d as _,v as f,x as g,M as v,L as u,Q as i,X as w,R as y}from"./@vue-exp-YaP0LnBg.js";import{_ as F}from"./index-DPO_t7vI.js";import"./@hprose-exp-DifMA6AO.js";import"./axios-exp-BH40TtQM.js";import"./vue-router-exp-BeFgxScw.js";const k=_({__name:"KeyboardControlWidget",setup(d,{expose:e}){e(),f(()=>{const r=m.CesiumViewer;s.init(r),s.bindModelEntity("/SampleData/models/CesiumAir/tb2.glb");const o=s.getEntity();C.init();const t=Cesium.Cartesian3.fromDegrees(120,30,2e3);o.position=t,r.changeCameraFocus(n.Follow),p.init()}),g(()=>{s.clearEntity()});function l(r){const o=m.CesiumViewer;switch(r){case 0:o.changeCameraFocus(n.God);break;case 1:o.changeCameraFocus(n.First);break;case 2:o.changeCameraFocus(n.Follow);break;case 3:o.changeCameraFocus(n.Free);break}}const a={changeCameraView:l,BaseTutorial:b};return Object.defineProperty(a,"__isScriptSetup",{enumerable:!1,value:!0}),a}}),V={class:"control"},B={class:"testGame"};function D(d,e,l,a,r,o){return y(),v(w,null,[u("div",V,[i(a.BaseTutorial)]),u("div",B,[i(c,{color:"primary",label:"上帝视角",onClick:e[0]||(e[0]=t=>a.changeCameraView(0))}),i(c,{color:"primary",label:"第一视角",onClick:e[1]||(e[1]=t=>a.changeCameraView(1))}),i(c,{color:"primary",label:"跟随视角",onClick:e[2]||(e[2]=t=>a.changeCameraView(2))}),i(c,{color:"primary",label:"自由",onClick:e[3]||(e[3]=t=>a.changeCameraView(3))})])],64)}const Q=F(k,[["render",D],["__scopeId","data-v-31ffea2b"],["__file","KeyboardControlWidget.vue"]]);export{Q as default};