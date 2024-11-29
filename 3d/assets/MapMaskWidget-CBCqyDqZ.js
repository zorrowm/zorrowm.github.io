import{B as i}from"./xframelib-exp-CBRV2soX.js";import{d as s,o as p,C as d}from"./@vue-exp-Cbz_CXqa.js";import{_ as m}from"./index-D2kwV854.js";import"./axios-exp-B_zfNCMU.js";import"./vendor-qEPl7M71.js";import"./@iconify/vue-exp-BeT9ZUzB.js";import"./monaco-editor-exp-B01XOe8A.js";import"./vue-router-exp-U1sBIDGE.js";const u=s({__name:"MapMaskWidget",setup(a,{expose:r}){r();let e;function t(){e=document.createElement("div"),e.className="maskDiv",document.body.appendChild(e),e.style.cssText=`
    position: absolute;
    top:0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index:199;
    background-image: radial-gradient(rgba(139, 138, 138, 0.219) 50%,
    rgba(65, 57, 57, 0.658) 70%,
    rgba(17, 16, 16, 1) 90%);`}p(()=>{i.map&&t()}),d(()=>{e&&document.removeChild(e)});const o={get maskDiv(){return e},set maskDiv(n){e=n},AddMask:t};return Object.defineProperty(o,"__isScriptSetup",{enumerable:!1,value:!0}),o}});function _(a,r,e,t,o,n){return null}const h=m(u,[["render",_],["__file","MapMaskWidget.vue"]]);export{h as default};
