import{d as m,r as g,v as f,O as h,R as t,M as o,L as s,X as l,a8 as d,N as _,Q as i,Z as y,_ as v}from"./@vue-exp-YaP0LnBg.js";import{_ as x}from"./index-DPO_t7vI.js";import"./vendor-CDV5M84i.js";import"./@hprose-exp-DifMA6AO.js";import"./xframelib-exp-CvTEfE5n.js";import"./axios-exp-BH40TtQM.js";import"./vue-router-exp-BeFgxScw.js";const S=m({__name:"PageFooter",setup(p,{expose:c}){c();const n=g({});f(async()=>{n.value=await(await fetch("/config/companyInfoConfig.json")).json()});const e={pageStatus:n};return Object.defineProperty(e,"__isScriptSetup",{enumerable:!1,value:!0}),e}}),b={class:"flex justify-center q-pa-lg",style:{width:"100%",height:"100%"}},w={class:"row justify-center items-start",style:{width:"100%"}},j={class:"col flex flex-center",style:{height:"100%"}},k=["src"],q={class:"col column text-grey-1"},C={class:"text-h6 text-bold q-pb-sm"},F={style:{cursor:"pointer","margin-bottom":"5px"}},I={key:0,style:{cursor:"pointer"}};function N(p,c,n,e,P,B){const a=h("Icon");return t(),o("div",{class:"scrollSection appendSize",style:v({background:`url(${e.pageStatus.img})`})},[s("div",b,[s("div",w,[s("div",j,[s("img",{src:e.pageStatus.logo},null,8,k)]),(t(!0),o(l,null,d(e.pageStatus.children,r=>(t(),o("div",q,[s("div",C,_(r.name),1),(t(!0),o(l,null,d(r.children,u=>(t(),o("div",F,_(u.name),1))),256)),r.id===3?(t(),o("div",I,[i(a,{icon:"ant-design:wechat-outlined"}),i(a,{icon:"ant-design:qq-outlined"}),i(a,{icon:"ant-design:github-filled"})])):y("",!0)]))),256))])])],4)}const E=x(S,[["render",N],["__scopeId","data-v-b5dc758f"],["__file","PageFooter.vue"]]);export{E as default};