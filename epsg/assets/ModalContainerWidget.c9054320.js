import{d as p,ak as $,ab as P,av as M,ax as j,a as d,w as f,c as k,o as v,v as b,l as x,G as B,P as S,a7 as c,s as W,y as T,_ as L}from"./vendor.de069ad6.js";import{O,S as V,E as m,_ as E,h as z}from"./index.f27a7adf.js";import{B as h}from"./xframelib-exp.e4d795a1.js";import{W as g}from"./WidgetsEvent.9f7b2658.js";import"./lodash-es-exp.d3c3d62f.js";import"./vue-router-exp.aee9d5fb.js";import"./axios-exp.cd5cf947.js";const H=p({name:"ModalContainer",props:{width:$().def(400),visible:P().def(!1),content:M(),data:j(),extra:M()},setup(e){const t=d(e.visible),a=d(e.data),o=d();f(()=>e.extra,()=>{e.extra&&(o.value=e.extra.footers)}),f(()=>e.visible,(r,n)=>{t.value=r,e.visible&&(a.value=e.data)}),f(()=>e.data,()=>{t.value&&(a.value=e.data)}),O(V.system_closeModal,()=>{t.value=!1});const l=k(()=>e.extra?.title?e.extra?.title:e.content?e.content.title:"\u5BF9\u8BDD\u6846");return{dataRef:a,visibleRef:t,handleOk:r=>{const n=e.content;n&&(n.validateForm?n.validateForm().then(u=>{t.value=!1,m(n.name,!0)}).catch(u=>{h.Message?.err("\u8868\u5355\u6821\u9A8C\u5931\u8D25\uFF01")}):(t.value=!1,m(n.name,!0)))},titleRef:l,handleCancel:r=>{t.value=!1,e.content&&m(e.content.name,!1)},isFooter:o}}});function G(e,t,a,o,l,s){const i=S;return v(),b(i,{width:e.width,visible:e.visibleRef,title:e.titleRef,onOk:e.handleOk,onCancel:e.handleCancel,footer:e.isFooter,destroyOnClose:!0},{default:x(()=>[(v(),b(B(e.content),{extra:e.extra,data:e.dataRef},null,8,["extra","data"]))]),_:1},8,["width","visible","title","onOk","onCancel","footer"])}const R=E(H,[["render",G]]),I=[{id:"AddEditCRS",label:"\u65B0\u5EFA/\u7F16\u8F91\u5750\u6807\u7CFB",component:()=>c(()=>import("./AddEditCRS.a1a22d84.js"),["./AddEditCRS.a1a22d84.js","./vendor.de069ad6.js","./lodash-es-exp.d3c3d62f.js","./vendor.aec3af5f.css","./xframelib-exp.e4d795a1.js","./axios-exp.cd5cf947.js","./xframelib-exp.d9c32ab5.css","./SpatialService.fe9450b1.js","./index.f27a7adf.js","./vue-router-exp.aee9d5fb.js","./TableEvent.69ad174d.js","./AddEditCRS.a8f1eb03.css"],import.meta.url)}],U=Object.freeze(Object.defineProperty({__proto__:null,default:I},Symbol.toStringTag,{value:"Module"})),q=[{id:"changeMyPWD",label:"\u4FEE\u6539\u81EA\u5DF1\u7684\u5BC6\u7801",component:()=>c(()=>import("./ChangePwd.e61ee5a3.js"),["./ChangePwd.e61ee5a3.js","./vendor.de069ad6.js","./lodash-es-exp.d3c3d62f.js","./vendor.aec3af5f.css","./index.f27a7adf.js","./xframelib-exp.e4d795a1.js","./axios-exp.cd5cf947.js","./xframelib-exp.d9c32ab5.css","./vue-router-exp.aee9d5fb.js"],import.meta.url)}],J=Object.freeze(Object.defineProperty({__proto__:null,default:q},Symbol.toStringTag,{value:"Module"})),K=[{id:"changeone",label:"\u5207\u6362",component:()=>c(()=>import("./Changeone.510a9497.js"),["./Changeone.510a9497.js","./vendor.de069ad6.js","./lodash-es-exp.d3c3d62f.js","./vendor.aec3af5f.css","./TabColumns.a3f2ad00.js","./SpatialService.fe9450b1.js","./xframelib-exp.e4d795a1.js","./axios-exp.cd5cf947.js","./xframelib-exp.d9c32ab5.css","./index.f27a7adf.js","./vue-router-exp.aee9d5fb.js"],import.meta.url)},{id:"changetwo",label:"\u5207\u6362",component:()=>c(()=>import("./Changetwo.80a92ea3.js"),["./Changetwo.80a92ea3.js","./vendor.de069ad6.js","./lodash-es-exp.d3c3d62f.js","./vendor.aec3af5f.css","./TabColumns.a3f2ad00.js","./SpatialService.fe9450b1.js","./xframelib-exp.e4d795a1.js","./axios-exp.cd5cf947.js","./xframelib-exp.d9c32ab5.css","./index.f27a7adf.js","./vue-router-exp.aee9d5fb.js"],import.meta.url)}],N=Object.freeze(Object.defineProperty({__proto__:null,default:K},Symbol.toStringTag,{value:"Module"})),F=[],C=Object.assign({"./homeModal.ts":U,"./systemModal.ts":J,"./transformModal.ts":N});Object.keys(C).forEach(e=>{const t=C[e];F.push(...t.default)});const _=new Map;async function Q(e){if(_.has(e))return _.get(e);const t=F.find(a=>a.id===e);if(t){const a=await t.component().catch(o=>{h.Message?.warn("\u52A0\u8F7DModal\u6A21\u5757\u5931\u8D25\uFF1A"+t.id)});return a?(_.set(e,a.default),a.default):void 0}else{h.Message?.warn(`Modal\u6A21\u5757\u4E0D\u5B58\u5728\uFF1A${e}`);return}}const X=p({name:"ModalContainerWidget",components:{ModalContainer:R},setup(e,t){const a=d(500),o=d(),l=d(),s=d(!1),i=W();function r(n){const{modalID:u,extraData:w,rowData:y,width:D}=n;l.value=void 0,l.value=w,a.value=D??500,s.value=!1,u&&(o.value=y,Q(u).then(A=>{s.value=!0,i.value=A}))}return T(()=>{O(g.ModalContainerWidget_LoadModal,r)}),L(()=>{z(g.ModalContainerWidget_LoadModal,r)}),{modalContentRef:i,modalVisibleRef:s,extraRef:l,recordData:o,modalWidthRef:a}}});function Y(e,t,a,o,l,s){const i=R;return v(),b(i,{width:e.modalWidthRef,content:e.modalContentRef,visible:e.modalVisibleRef,extra:e.extraRef,data:e.recordData},null,8,["width","content","visible","extra","data"])}const ie=E(X,[["render",Y]]);export{ie as default};