const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./addEditForm-0eopejo9.js","./quasar-exp-BsaNoQ7w.js","./@vue-exp-Bws36Ke9.js","./quasar-exp-BmHBMRGp.css","./DBService-CSAZW8Q8.js","./xframelib-exp-CMLeiWD4.js","./axios-exp-C7rfqWEd.js","./vendor-DJm_4oaR.js","./lottie-web-exp-CIY4INm7.js","./monaco-editor-exp-BNK_u0iZ.js","./monaco-editor-exp-B7uS4J0T.css","./vendor-BGDqWjJk.css","./@iconify/vue-exp-Q9Q0SWJB.js","./xframelib-exp-254NBRTd.css","./index-BQ7ovaqR.js","./xgis-cesium-exp-Hv7oMXHX.js","./xgis-cesium-exp-BpJXcbkZ.css","./vue-router-exp-CO9L2VdX.js","./index-C-qRGThU.css","./TableEvent-Bxu_GHGl.js","./addEditForm-DBXKnc3w.css","./addEditForm-CrOMoZDt.js","./ApiExampleDemo-fezgN7i-.js","./addEditForm-D7TrrdA8.css","./addEditForm-D0IAms5W.js","./StudentService-DlLAObFe.js","./addEditForm-CtsFmrTi.css","./ChangePwd-CrE_lqDd.js","./loginModal-C5Jz3mHR.js","./SystemsEvent-DUQCZw_Q.js"])))=>i.map(i=>d[i]);
import{I as T,J as k,q as j,e as g,G as b,m as F,K as N,L as I}from"./quasar-exp-BsaNoQ7w.js";import{i as W,j as $,k as h,W as C,_ as B,l as q}from"./index-BQ7ovaqR.js";import{cz as z,cA as H,cB as D,cC as U}from"./vendor-DJm_4oaR.js";import{B as V}from"./xframelib-exp-CMLeiWD4.js";import{d as A,r as f,w as O,c as R,o as L,a as P,b as m,f as v,a4 as u,j as s,a1 as G,l as J,a7 as K,k as w,ae as X,g as E,s as Y}from"./@vue-exp-Bws36Ke9.js";import{_}from"./monaco-editor-exp-BNK_u0iZ.js";import"./xgis-cesium-exp-Hv7oMXHX.js";import"./vue-router-exp-CO9L2VdX.js";import"./lottie-web-exp-CIY4INm7.js";import"./axios-exp-C7rfqWEd.js";import"./@iconify/vue-exp-Q9Q0SWJB.js";const Z=A({name:"ModalContainer",props:{width:z().def(400),visible:H().def(!1),content:D(),data:U([String,Number,Boolean,Array,Object]),extra:D()},setup(e){const a=f(e.visible),t=f(e.data);O(()=>e.visible,(d,n)=>{a.value=d,e.visible&&(t.value=e.data)}),O(()=>e.data,()=>{a.value&&(t.value=e.data)});const l=R(()=>e.extra?.title?e.extra?.title:e.content?e.content.title:"对话框"),i=R(()=>{if(e.extra?.footer)return e.extra?.footer}),r=d=>{const n=e.content;n&&(n.validateForm?n.validateForm().then(M=>{a.value=!1,h(n.name,!0)}).catch(M=>{V.Message.err("表单校验失败！")}):(a.value=!1,h(n.name,!0)))},o=d=>{a.value=!1,e.content&&h(e.content.name,!1)};function c(d){a.value=!1}L(()=>{W(C.ModalContainerWidget_CloseModal,c)}),P(()=>{$(C.ModalContainerWidget_CloseModal,c)});const p=R(()=>`width: ${e.width}px; max-width: 80vw`);return{dataRef:t,visibleRef:a,handleOk:r,titleRef:l,footerRef:i,handleCancel:o,cardStyle:p}}}),ee={class:"text-h6"};function ae(e,a,t,l,i,r){return m(),v(I,{modelValue:e.visibleRef,"onUpdate:modelValue":a[0]||(a[0]=o=>e.visibleRef=o)},{default:u(()=>[s(T,{style:G(e.cardStyle)},{default:u(()=>[s(k,{class:"row items-center q-pb-none"},{default:u(()=>[J("div",ee,K(e.titleRef),1),s(j),w(s(g,{icon:"close",flat:"",round:"",dense:""},null,512),[[b]])]),_:1}),s(k,null,{default:u(()=>[e.visibleRef?(m(),v(X(e.content),{key:0,extra:e.extra,data:e.dataRef},null,8,["extra","data"])):E("",!0)]),_:1}),e.footerRef?(m(),v(F,{key:0})):E("",!0),e.footerRef?(m(),v(N,{key:1,align:"right"},{default:u(()=>[w(s(g,{flat:"",label:"取消",color:"primary",onClick:e.handleCancel},null,8,["onClick"]),[[b]]),w(s(g,{flat:"",label:"确定",color:"primary",onClick:e.handleOk},null,8,["onClick"]),[[b]])]),_:1})):E("",!0)]),_:1},8,["style"])]),_:1},8,["modelValue"])}const x=B(Z,[["render",ae],["__file","index.vue"]]),te=[{id:"addEditForm",label:"新建/编辑",component:()=>_(()=>import("./addEditForm-0eopejo9.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]),import.meta.url)},{id:"addEditForm2",label:"新建/编辑",component:()=>_(()=>import("./addEditForm-CrOMoZDt.js"),__vite__mapDeps([21,1,2,3,14,9,10,7,8,11,5,6,12,13,15,16,17,18,19,22,23]),import.meta.url)},{id:"addEditForm3",label:"新建/编辑",component:()=>_(()=>import("./addEditForm-D0IAms5W.js"),__vite__mapDeps([24,1,2,3,7,8,9,10,11,14,5,6,12,13,15,16,17,18,19,25,26]),import.meta.url)}],oe=[{id:"changeMyPWD",label:"修改自己的密码",component:()=>_(()=>import("./ChangePwd-CrE_lqDd.js"),__vite__mapDeps([27,1,2,3,14,9,10,7,8,11,5,6,12,13,15,16,17,18]),import.meta.url)},{id:"loginModal",label:"用户登录-对话框",component:()=>_(()=>import("./loginModal-C5Jz3mHR.js"),__vite__mapDeps([28,14,9,10,2,7,8,11,1,3,5,6,12,13,15,16,17,18,29]),import.meta.url)}],ne=Object.assign({"./standardTabModal.ts":te,"./systemModal.ts":oe}),le=q(ne,!1),y=new Map;async function ie(e){if(y.has(e))return y.get(e);const a=le.find(t=>t.id===e);if(a){const t=await a.component().catch(l=>{V.Message.warn("加载Modal模块失败："+a.id)});return t?(y.set(e,t.default),t.default):void 0}else{V.Message.warn(`Modal模块不存在：${e}`);return}}const re=A({name:"ModalContainerWidget",components:{ModalContainer:x},setup(e,a){const t=f(500),l=f(),i=f(),r=f(!1),o=Y();function c(p){const{modalID:d,extraData:n,rowData:M,width:S}=p;i.value=void 0,i.value=n,t.value=S??500,r.value=!1,d&&(l.value=M,ie(d).then(Q=>{r.value=!0,o.value=Q}))}return L(()=>{W(C.ModalContainerWidget_LoadModal,c)}),P(()=>{$(C.ModalContainerWidget_LoadModal,c)}),{modalContentRef:o,modalVisibleRef:r,extraRef:i,recordData:l,modalWidthRef:t}}});function de(e,a,t,l,i,r){const o=x;return m(),v(o,{width:e.modalWidthRef,content:e.modalContentRef,visible:e.modalVisibleRef,extra:e.extraRef,data:e.recordData},null,8,["width","content","visible","extra","data"])}const be=B(re,[["render",de],["__file","ModalContainerWidget.vue"]]);export{be as default};