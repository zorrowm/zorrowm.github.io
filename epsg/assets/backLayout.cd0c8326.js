import{a as y,w as _,_ as C}from"./index.f27a7adf.js";import{f as L,r as f,B as n}from"./xframelib-exp.e4d795a1.js";import{d as S,a as s,af as w,w as k,y as W,t as b,o as I,b as v,k as B}from"./vendor.de069ad6.js";import"./vue-router-exp.aee9d5fb.js";import"./lodash-es-exp.d3c3d62f.js";import"./axios-exp.cd5cf947.js";const D=S({name:"",components:{LayoutContainer:L},setup(t,{attrs:l,slots:p,emit:g}){const i=s(_),r=s(),a=s("backLayout");function h(e){e.layoutID===a.value&&(n.Logger().debug(e,"loadedHandler"),n.BackLayoutManager=e.layoutManager,m(n.BackLayoutManager))}const o=y(),{leftCollapsed:d}=w(o);k(()=>d.value,()=>{c()});function c(){const e=d.value?o.menuSetting?.minWidth:o.menuSetting?.menuWidth;f.setCssVar("--leftSideWidth",e+"px")}function m(e){o.showFooter&&e.loadWidget("FooterCopyrightWidget")}return W(()=>{const u=o.headerSetting.show?o.headerSetting.height:0;f.setCssVar("--header-top-height",u+"px"),c()}),{configRef:i,layoutIDRef:a,loadedHandler:h,backLayoutContainer:r}}});const H={class:"container"};function M(t,l,p,g,i,r){const a=b("LayoutContainer");return I(),v("div",H,[B(a,{ref:"backLayoutContainer",class:"layoutContainerCSSVar",widgetConfig:t.configRef,layoutID:t.layoutIDRef,onContainerLoaded:t.loadedHandler},null,8,["widgetConfig","layoutID","onContainerLoaded"])])}const N=C(D,[["render",M],["__scopeId","data-v-ee4a3f4a"]]);export{N as default};