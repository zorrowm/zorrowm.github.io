import{j as d}from"./xframelib-exp-CvTEfE5n.js";import{d as l,v as p,M as _,L as r,R as a}from"./@vue-exp-YaP0LnBg.js";import{_ as c}from"./index-urNJi4nj.js";import"./axios-exp-BH40TtQM.js";import"./vendor-CDV5M84i.js";import"./@hprose-exp-DifMA6AO.js";import"./vue-router-exp-BeFgxScw.js";const m=l({__name:"destroyWidget",setup(u,{expose:e}){e();let t;function o(){t=d.CesiumViewer}function s(){t.destroy()}p(()=>{o()});const n={get viewer(){return t},set viewer(i){t=i},create:o,destroy:s};return Object.defineProperty(n,"__isScriptSetup",{enumerable:!1,value:!0}),n}}),f={class:"btn-box"};function v(u,e,t,o,s,n){return a(),_("div",f,[r("ul",null,[r("li",null,[r("button",{onClick:e[0]||(e[0]=i=>o.destroy())},"销毁")]),r("li",null,[r("button",{onClick:e[1]||(e[1]=i=>o.create())},"创建")])])])}const w=c(m,[["render",v],["__file","destroyWidget.vue"]]);export{w as default};