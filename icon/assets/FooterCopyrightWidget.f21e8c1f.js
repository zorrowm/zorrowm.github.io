import{a as m,n as _,_ as y}from"./index.a7a016cc.js";import{L as h}from"./xframelib-exp.abb6dc89.js";import{d as S,a as n,c as a,o as F,b as H,g as i,D as p,f as c}from"./vendor.fba62f44.js";import"./@iconify/vue-exp.2703a4cd.js";import"./vue-router-exp.aea90ceb.js";import"./lodash-es-exp.5cb72cd8.js";import"./axios-exp.a055fae1.js";const v=S({name:"FooterCopyrightWidget",components:{},setup(t,{attrs:f,slots:g,emit:u}){const e=m(),s=n(h.Config.UI.CopyRight),r=n("\u63D0\u793A\uFF1A\u6B63\u5728\u52A0\u8F7D\u4E2D\u2026\u2026"),l=a(()=>{const o=e.footerHeight+"px";return{height:o,lineHeight:o}}),d=a(()=>({marginTop:`-${e.footerHeight+"px"}`}));return _(o=>{r.value="\u63D0\u793A\uFF1A"+o}),{copyinfo:s,statusInfo:r,getWrapStyle:l,getMsginfoStyle:d}}});const C={class:"footerWidget"};function D(t,f,g,u,e,s){return F(),H("div",C,[i("div",{class:"copyright",style:c(t.getWrapStyle)},p(t.copyinfo),5),i("span",{class:"fl msginfo",style:c(t.getMsginfoStyle)},p(t.statusInfo),5)])}const E=y(v,[["render",D],["__scopeId","data-v-75e04f71"]]);export{E as default};