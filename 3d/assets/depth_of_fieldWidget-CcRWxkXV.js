import{an as l,am as _}from"./vendor-CDV5M84i.js";import{j as r}from"./xframelib-exp-CvTEfE5n.js";import{d as c,v as u,x as m}from"./@vue-exp-YaP0LnBg.js";import{_ as h}from"./index-urNJi4nj.js";import"./@hprose-exp-DifMA6AO.js";import"./axios-exp-BH40TtQM.js";import"./vue-router-exp-BeFgxScw.js";const g=c({__name:"depth_of_fieldWidget",setup(p,{expose:s}){s();let i,e;async function d(){e=new l(i),e.depthOfField.enable=!0,o()}function o(){let t={enable:!0,focalDistance:87,delta:1,sigma:3.8,stepSize:2.5},a=new _;r.gui=a,a.add(t,"enable").onChange(n=>{e.depthOfField.enable=n}),a.add(t,"focalDistance",0,1e3).step(1).onChange(n=>{e.depthOfField.focalDistance=n}),a.add(t,"delta",0,5).step(.1).onChange(n=>{e.depthOfField.delta=n}),a.add(t,"sigma",0,5).step(.1).onChange(n=>{e.depthOfField.sigma=n}),a.add(t,"stepSize",0,10).step(.1).onChange(n=>{e.depthOfField.stepSize=n})}u(()=>{r.CesiumViewer&&(i=r.CesiumViewer,d())}),m(()=>{i&&e&&(e.depthOfField.enable=!1,e=void 0)});const f={get viewer(){return i},set viewer(t){i=t},get effect(){return e},set effect(t){e=t},initScan:d,addGuiController:o};return Object.defineProperty(f,"__isScriptSetup",{enumerable:!1,value:!0}),f}});function C(p,s,i,e,d,o){return null}const $=h(g,[["render",C],["__file","depth_of_fieldWidget.vue"]]);export{$ as default};