import{C as l}from"./index-CFkva05I.js";import{m,_ as d}from"./index-3mXAM2d5.js";import{f}from"./WidgetUtils-DoRtXCKC.js";import{d as p,r,y as _,A as h,H as M,Y as g,X as v}from"./@vue-exp-CxZKVZL7.js";import"./xframelib-exp-Dokv845S.js";import"./axios-exp-B_zfNCMU.js";import"./vendor-Cm8vbQLD.js";import"./@hprose-exp-DksTqdcd.js";import"./@iconify/vue-exp-CNvCUaPp.js";import"./vue-router-exp-BoJcrdOF.js";const u="linkMenuWidget",y=p({__name:"linkMenuWidget",setup(c,{expose:a}){const o=r([]),e=r("bigScreenLayout");_(()=>{const n=f(m,u);n&&o.value.push(...n.children)});const t=r(!0);function i(n=!1){t.value=n}a({changeVisible:i,isShow:t});const s={childMenus:o,layoutIDRef:e,menuItemPath:u,isShow:t,changeVisible:i,ChildMenuBar:l};return Object.defineProperty(s,"__isScriptSetup",{enumerable:!1,value:!0}),s}});function C(c,a,o,e,t,i){return h((v(),g(e.ChildMenuBar,{menuData:e.childMenus,layoutID:e.layoutIDRef,class:"currentChildMenu"},null,8,["menuData","layoutID"])),[[M,e.isShow]])}const R=d(y,[["render",C],["__scopeId","data-v-c936611d"],["__file","linkMenuWidget.vue"]]);export{R as default};