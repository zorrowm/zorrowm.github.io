import{bT as _,a6 as d}from"./vendor-CDV5M84i.js";import{j as p}from"./xframelib-exp-CvTEfE5n.js";import{d as l,v as f,x as m,M as v,L as o,R as b}from"./@vue-exp-YaP0LnBg.js";import{_ as w}from"./index-urNJi4nj.js";import"./@hprose-exp-DifMA6AO.js";import"./axios-exp-BH40TtQM.js";import"./vue-router-exp-BeFgxScw.js";const x=l({__name:"radar_scanWidget",setup(c,{expose:n}){n();let t,e;async function r(){e=new _(t,"121.489206,31.241320",1e3,{speed:3}),t.flyToPosition(new d(121.491415,31.208443,1954.04,0,-28))}function a(){e.start()}function s(){e.stop()}f(()=>{p.CesiumViewer&&(t=p.CesiumViewer,r())}),m(()=>{t&&e&&(e.stop(),e=void 0)});const u={get viewer(){return t},set viewer(i){t=i},get scan(){return e},set scan(i){e=i},initScan:r,start:a,stop:s};return Object.defineProperty(u,"__isScriptSetup",{enumerable:!1,value:!0}),u}}),C={class:"btn-box"};function g(c,n,t,e,r,a){return b(),v("div",C,[o("ul",null,[o("li",null,[o("button",{onClick:n[0]||(n[0]=s=>e.start())},"开始")]),o("li",null,[o("button",{onClick:n[1]||(n[1]=s=>e.stop())},"结束")])])])}const j=w(x,[["render",g],["__scopeId","data-v-411913f1"],["__file","radar_scanWidget.vue"]]);export{j as default};