import{d as v,C as F,o as b,$ as x,a as D,H as I,z as k,r as d,b as u,c as l,w as p,e as j,f as R,g as B,U as W,h as V,i as K,j as U,k as G,m as E,_ as z,l as q}from"./vendor.048272ea.js";import{a as J}from"./expansion-axios.5452c070.js";import"./expansion-moment.a491418d.js";const X=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function a(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerpolicy&&(r.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?r.credentials="include":o.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(o){if(o.ep)return;o.ep=!0;const r=a(o);fetch(o.href,r)}};X();const Q="modulepreload",w={},Y="./",f=function(t,a){return!a||a.length===0?t():Promise.all(a.map(s=>{if(s=`${Y}${s}`,s in w)return;w[s]=!0;const o=s.endsWith(".css"),r=o?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${s}"]${r}`))return;const n=document.createElement("link");if(n.rel=o?"stylesheet":Q,o||(n.as="script",n.crossOrigin=""),n.href=s,document.head.appendChild(n),o)return new Promise((i,c)=>{n.addEventListener("load",i),n.addEventListener("error",c)})})).then(()=>t())};var O=(e,t)=>{const a=e.__vccOpts||e;for(const[s,o]of t)a[s]=o;return a};const Z=v({name:"App",components:{ConfigProvider:F},setup(){return b(()=>{x()}),D(()=>{I()}),{zhCN:k}}});function M(e,t,a,s,o,r){const n=d("router-view"),i=d("config-provider");return u(),l(i,{locale:e.zhCN},{default:p(()=>[j(n,null,{default:p(({Component:c})=>[(u(),l(R(c)))]),_:1})]),_:1},8,["locale"])}var ee=O(Z,[["render",M]]);const te={showHeader:!0,showFooter:!0,showRight:!1},oe={SET_SHOWHEADER:(e,t)=>{e.showHeader=t},SET_SHOWFOOTER:(e,t)=>{e.showFooter=t},SET_SHOWRIGHT:(e,t)=>{e.showRight=t}},re={showHeader(e,t){e.commit("SET_SHOWHEADER",t)},showFooter(e,t){e.commit("SET_SHOWFOOTER",t)},showRight(e,t){e.commit("SET_SHOWRIGHT",t)}};var ne={namespaced:!0,state:te,mutations:oe,actions:re},m;(function(e){e.SIDEBAR="sidebar",e.MIX_SIDEBAR="mix-sidebar",e.MIX="mix",e.TOP_MENU="top-menu"})(m||(m={}));var h;(function(e){e.NONE="NONE",e.FOOTER="FOOTER",e.HEADER="HEADER"})(h||(h={}));var g;(function(e){e.VERTICAL="vertical",e.HORIZONTAL="horizontal",e.VERTICAL_RIGHT="vertical-right",e.INLINE="inline"})(g||(g={}));var C;(function(e){e[e.NONE=0]="NONE",e[e.TOP=1]="TOP",e[e.LEFT=2]="LEFT"})(C||(C={}));var A;(function(e){e.CENTER="center",e.START="start",e.END="end"})(A||(A={}));var _;(function(e){e.HOVER="hover",e.CLICK="click"})(_||(_={}));var T;(function(e){e[e.Widget=0]="Widget",e[e.Route=1]="Route",e[e.URL=2]="URL",e[e.Action=3]="Action"})(T||(T={}));const se={showSettingButton:!0,showDarkModeToggle:!0,themeColor:"#0960bd",grayMode:!1,colorWeak:!1,fullContent:!1,showLogo:!0,showFooter:!0,headerSetting:{bgColor:"#ffffff",fixed:!0,show:!0,useLockPage:!0,showFullScreen:!0,showDoc:!0,showNotice:!0,showSearch:!0},menuSetting:{bgColor:"#273352",fixed:!0,collapsed:!1,collapsedShowTitle:!1,canDrag:!0,hidden:!1,show:!0,minWidth:48,menuWidth:250,mode:g.INLINE,type:m.SIDEBAR,split:!1,topMenuAlign:"start",trigger:h.HEADER,accordion:!0,closeMixSidebarOnChange:!1,mixSideTrigger:_.CLICK,mixSideFixed:!1},multiTabsSetting:{cache:!1,show:!0,showQuick:!0,canDrag:!0,showRedo:!0,showFold:!0},transitionSetting:{enable:!0,openPageLoading:!0,openNProgress:!1},openKeepAlive:!0,lockTime:0,showBreadCrumb:!0,showBreadCrumbIcon:!1,useErrorHandle:!1,useOpenBackTop:!0,canEmbedIFramePage:!0,closeMessageOnSwitch:!0,removeAllHttpPending:!0},N="PROJ_SETTINGS",S=new B("",sessionStorage),y=S.get(N)||se,ae={projectConfig:y,get menuSetting(){return y.menuSetting}},H={setProjectConfig(e,t){e.projectConfig=W(e.projectConfig||{},t),S.set(N,e.projectConfig)},setMenuSetting(e,t){H.setProjectConfig(e,{menuSetting:t})},async resetAllState(e){S.clear()}},ie={setProjectConfig(e,t){e.commit("setProjectConfig",t)},setMenuSetting(e,t){e.commit("setMenuSetting",t)},async resetAllState(e){e.commit("resetAllState")}};var ce={namespaced:!0,state:ae,mutations:H,actions:ie},L;(function(e){e.AppState="appState"})(L||(L={}));const ue={appState:ce,layoutState:ne},le=V({modules:ue,getters:{appState:e=>e.appState,layoutState:e=>e.layoutState}}),de=le.getters,pe=v({name:"RouterTransition",components:{},props:{notNeedKey:{type:Boolean,default:!1},animate:{type:Boolean,default:!0}},setup(){return{keepAliveComponents:K(()=>de.asyncRoute?.keepAliveComponents)}}});function fe(e,t,a,s,o,r){const n=d("router-view");return u(),l(n,null,{default:p(({Component:i,route:c})=>[(u(),l(R(i)))]),_:1})}var me=O(pe,[["render",fe]]);const P="error",he={path:"/:pathMatch(.*)*",name:"NotFound",redirect:"/error/404",meta:{title:"\u4E0D\u5B58\u5728",hidden:!0,isSystem:!0},component:()=>f(()=>import("./404.bae451d7.js"),["assets/404.bae451d7.js","assets/404.c5de4f79.css","assets/vendor.048272ea.js","assets/vendor.13fc89ce.css","assets/expansion-moment.a491418d.js","assets/expansion-axios.5452c070.js"])},ge={path:"/error",name:P,redirect:"/error/404",component:me,meta:{title:"\u9519\u8BEF\u9875",hidden:!0,isSystem:!0},children:[{path:"404",name:`${P}-404`,meta:{title:"404",hidden:!0,isSystem:!0},component:()=>f(()=>import("./404.bae451d7.js"),["assets/404.bae451d7.js","assets/404.c5de4f79.css","assets/vendor.048272ea.js","assets/vendor.13fc89ce.css","assets/expansion-moment.a491418d.js","assets/expansion-axios.5452c070.js"])}]},_e=[he,ge,{path:"/",name:"code",meta:{title:"routes.home",icon:"iconfont icon-Home-Filled",isSystem:!0},component:()=>f(()=>import("./codeView.d777440d.js"),["assets/codeView.d777440d.js","assets/codeView.8517a98c.css","assets/vendor.048272ea.js","assets/vendor.13fc89ce.css","assets/expansion-moment.a491418d.js","assets/expansion-axios.5452c070.js"])}],Se=U({history:G(""),routes:_e});function ve(e){e.use(Se)}E.config({top:"100px",duration:1,maxCount:3});z(E,J);const $=q(ee);ve($);$.mount("#app");export{O as _};