import{f as l,W as f}from"./WidgetUtils-8luXHpZW.js";import{m as d,d as _}from"./index-Bvhcfk1J.js";import{d as m,r,u as p,y as h,a5 as M,I as y,H as g}from"./@vue-exp-BMz8X7Pi.js";import"./xframelib-exp-BHnis-8Y.js";import"./axios-exp-DvxIUWKU.js";import"./vendor-09XKH5X6.js";import"./@hprose-exp-zVZHOVCF.js";import"./vue-router-exp-COsaUipG.js";const u="flyMenuWidget",v=m({__name:"flyMenuWidget",setup(c,{expose:i}){const o=r([]),e=r("bigScreenLayout");p(()=>{const n=l(d,u);n&&o.value.push(...n.children)});const t=r(!0);function a(n=!1){t.value=n}i({changeVisible:a,isShow:t});const s={childMenus:o,layoutIDRef:e,menuItemPath:u,isShow:t,changeVisible:a,ChildMenuBar:f};return Object.defineProperty(s,"__isScriptSetup",{enumerable:!1,value:!0}),s}});function D(c,i,o,e,t,a){return h((g(),y(e.ChildMenuBar,{menuData:e.childMenus,layoutID:e.layoutIDRef,class:"currentChildMenu"},null,8,["menuData","layoutID"])),[[M,e.isShow]])}const k=_(v,[["render",D],["__scopeId","data-v-a781791a"],["__file","flyMenuWidget.vue"]]);export{k as default};