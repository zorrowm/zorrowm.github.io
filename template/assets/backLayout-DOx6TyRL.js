import{cy as w}from"./vendor-DJm_4oaR.js";import{_ as C,d as v,b as x}from"./index-BQ7ovaqR.js";import{h as s,B as M,g as k}from"./xframelib-exp-CMLeiWD4.js";import{t as W}from"./tabMenu-CiBM6NVa.js";import{v as I,x as R}from"./quasar-exp-BsaNoQ7w.js";import{d as b,a0 as H,b as S,f as L,a4 as d,j as p,n as Q,r as y,w as $,o as B}from"./@vue-exp-Bws36Ke9.js";import"./lottie-web-exp-CIY4INm7.js";import"./monaco-editor-exp-BNK_u0iZ.js";import"./xgis-cesium-exp-Hv7oMXHX.js";import"./vue-router-exp-CO9L2VdX.js";import"./axios-exp-C7rfqWEd.js";import"./@iconify/vue-exp-Q9Q0SWJB.js";const F=b({name:"QLayoutMainContainer",__name:"index",setup(i,{expose:a}){a();const o={};return Object.defineProperty(o,"__isScriptSetup",{enumerable:!1,value:!0}),o}});function V(i,a,o,t,u,e){const n=H("router-view");return S(),L(R,{view:"hHh lpR fFf",class:"mainContainerQLayout"},{default:d(()=>[p(I,{class:"mainContainerPageContent"},{default:d(()=>[Q(i.$slots,"default",{},()=>[p(n)],!0)]),_:3})]),_:3})}const D=C(F,[["render",V],["__scopeId","data-v-a574d0a4"],["__file","index.vue"]]),P=b({name:"backLayout",__name:"backLayout",setup(i,{expose:a}){a();const o=y(v()),t=y("backLayout");function u(r){_(r.layoutManager)}const e=x(),{leftCollapsed:n}=w(e),f=W();f.SetTabBase("BackLayout"),$(()=>n.value,()=>{c()});function c(){const r=n.value?e.menuSetting?.minWidth:e.menuSetting?.menuWidth;s.setCssVar("--leftSideWidth",r+"px")}c();function _(r){e.showFooter&&(r.loadWidget("FooterCopyrightWidget"),s.setCssVar("--footer-height",e.footerHeight+"px"))}const h=e.headerSetting.show,m=h?e.headerSetting.height:0;s.setCssVar("--header-top-height",m+"px");const l=e.showTabMenu?e.TabMenuHeight:0;s.setCssVar("--back-tabmenu-height",l+"px"),B(()=>{M.Loading("end")});const g={configRef:o,layoutIDRef:t,loadedHandler:u,appState:e,leftCollapsed:n,tabMenuState:f,computeLeftMenuWidth:c,loadInitWidgets:_,isShowHeader:h,topheight:m,tabheight:l,get LayoutContainer(){return k},QLayoutMainContainer:D};return Object.defineProperty(g,"__isScriptSetup",{enumerable:!1,value:!0}),g}});function T(i,a,o,t,u,e){return S(),L(t.LayoutContainer,{widgetConfig:t.configRef,layoutID:t.layoutIDRef,onContainerLoaded:t.loadedHandler},{main:d(()=>[p(t.QLayoutMainContainer)]),_:1},8,["widgetConfig","layoutID"])}const Z=C(P,[["render",T],["__scopeId","data-v-a09c62fe"],["__file","backLayout.vue"]]);export{Z as default};