import{C as l}from"./index-B7jHKITI.js";import{m as f,_ as m}from"./index-Cl6kQhfR.js";import{f as p}from"./WidgetUtils-CTZsXSsy.js";import{d as _,r as a,b as d,E as h,L as M,Q as y,P as g}from"./@vue-exp-Mkau1HGZ.js";import"./xframelib-exp-Dh6eGY1k.js";import"./axios-exp-C7rfqWEd.js";import"./vendor-71nkuPi7.js";import"./@hprose-exp-B7dHRfib.js";import"./@iconify/vue-exp-DwwUNauw.js";import"./vue-router-exp-ButTbbfG.js";import"./monaco-editor-exp-B01XOe8A.js";const u="flyMenuWidget",v=_({__name:"flyMenuWidget",setup(c,{expose:i}){const n=a([]),e=a("bigScreenLayout");d(()=>{const o=p(f,u);o&&n.value.push(...o.children)});const t=a(!0);function r(o=!1){t.value=o}i({changeVisible:r,isShow:t});const s={childMenus:n,layoutIDRef:e,menuItemPath:u,isShow:t,changeVisible:r,ChildMenuBar:l};return Object.defineProperty(s,"__isScriptSetup",{enumerable:!1,value:!0}),s}});function C(c,i,n,e,t,r){return h((g(),y(e.ChildMenuBar,{menuData:e.childMenus,layoutID:e.layoutIDRef,class:"currentChildMenu"},null,8,["menuData","layoutID"])),[[M,e.isShow]])}const R=m(v,[["render",C],["__scopeId","data-v-a781791a"],["__file","flyMenuWidget.vue"]]);export{R as default};