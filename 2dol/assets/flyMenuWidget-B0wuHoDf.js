import{C as l}from"./index-CFkva05I.js";import{m as f,_ as m}from"./index-3mXAM2d5.js";import{f as p}from"./WidgetUtils-DoRtXCKC.js";import{d as _,r as a,y as d,A as h,H as M,Y as y,X as g}from"./@vue-exp-CxZKVZL7.js";import"./xframelib-exp-Dokv845S.js";import"./axios-exp-B_zfNCMU.js";import"./vendor-Cm8vbQLD.js";import"./@hprose-exp-DksTqdcd.js";import"./@iconify/vue-exp-CNvCUaPp.js";import"./vue-router-exp-BoJcrdOF.js";const u="flyMenuWidget",v=_({__name:"flyMenuWidget",setup(c,{expose:i}){const o=a([]),e=a("bigScreenLayout");d(()=>{const n=p(f,u);n&&o.value.push(...n.children)});const t=a(!0);function r(n=!1){t.value=n}i({changeVisible:r,isShow:t});const s={childMenus:o,layoutIDRef:e,menuItemPath:u,isShow:t,changeVisible:r,ChildMenuBar:l};return Object.defineProperty(s,"__isScriptSetup",{enumerable:!1,value:!0}),s}});function C(c,i,o,e,t,r){return h((g(),y(e.ChildMenuBar,{menuData:e.childMenus,layoutID:e.layoutIDRef,class:"currentChildMenu"},null,8,["menuData","layoutID"])),[[M,e.isShow]])}const R=m(v,[["render",C],["__scopeId","data-v-a781791a"],["__file","flyMenuWidget.vue"]]);export{R as default};