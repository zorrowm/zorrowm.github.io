const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./ChangePwd-CquoQekp.js","./vendor-DLGs6WCJ.js","./@vue-exp-Mkau1HGZ.js","./vendor-DVDLgBjF.css","./index-Dy2WIICa.js","./monaco-editor-exp-B01XOe8A.js","./monaco-editor-exp-B7uS4J0T.css","./xframelib-exp-BL-NWzRk.js","./axios-exp-C7rfqWEd.js","./@iconify/vue-exp-DwwUNauw.js","./xframelib-exp-254NBRTd.css","./vue-router-exp-LDq1UUA0.js","./index-C-qRGThU.css","./loginModal-2H7myVGs.js","./SystemsEvent-DUQCZw_Q.js"])))=>i.map(i=>d[i]);
import{an as N,af as j,am as W,ao as T,H as F,ap as V,a7 as H,K as g,a8 as h,_ as q,aq as U,ar as z}from"./vendor-DLGs6WCJ.js";import{O as E,e as O,d as b,W as C,_ as B,h as K}from"./index-Dy2WIICa.js";import{B as $}from"./xframelib-exp-BL-NWzRk.js";import{d as x,r as f,w as k,a as R,b as Q,D as S,P as m,Q as v,$ as c,c as r,Y as X,V as Y,a3 as G,E as p,aa as J,X as w,s as Z}from"./@vue-exp-Mkau1HGZ.js";import{_ as D}from"./monaco-editor-exp-B01XOe8A.js";import"./vue-router-exp-LDq1UUA0.js";import"./axios-exp-C7rfqWEd.js";import"./@iconify/vue-exp-DwwUNauw.js";const I=x({name:"ModalContainer",props:{width:N().def(400),visible:j().def(!1),content:W(),data:T([String,Number,Boolean,Array,Object]),extra:W()},setup(e){const a=f(e.visible),t=f(e.data);k(()=>e.visible,(d,n)=>{a.value=d,e.visible&&(t.value=e.data)}),k(()=>e.data,()=>{a.value&&(t.value=e.data)});const l=R(()=>e.extra?.title?e.extra?.title:e.content?e.content.title:"对话框"),i=R(()=>{if(e.extra?.footer)return e.extra?.footer}),s=d=>{const n=e.content;n&&(n.validateForm?n.validateForm().then(_=>{a.value=!1,b(n.name,!0)}).catch(_=>{$.Message.err("表单校验失败！")}):(a.value=!1,b(n.name,!0)))},o=d=>{a.value=!1,e.content&&b(e.content.name,!1)};function u(d){a.value=!1}Q(()=>{E(C.ModalContainerWidget_CloseModal,u)}),S(()=>{O(C.ModalContainerWidget_CloseModal,u)});const M=R(()=>`width: ${e.width}px; max-width: 80vw`);return{dataRef:t,visibleRef:a,handleOk:s,titleRef:l,footerRef:i,handleCancel:o,cardStyle:M}}}),ee={class:"text-h6"};function ae(e,a,t,l,i,s){return m(),v(z,{modelValue:e.visibleRef,"onUpdate:modelValue":a[0]||(a[0]=o=>e.visibleRef=o)},{default:c(()=>[r(F,{style:X(e.cardStyle)},{default:c(()=>[r(V,{class:"row items-center q-pb-none"},{default:c(()=>[Y("div",ee,G(e.titleRef),1),r(H),p(r(g,{icon:"close",flat:"",round:"",dense:""},null,512),[[h]])]),_:1}),r(V,null,{default:c(()=>[e.visibleRef?(m(),v(J(e.content),{key:0,extra:e.extra,data:e.dataRef},null,8,["extra","data"])):w("",!0)]),_:1}),e.footerRef?(m(),v(q,{key:0})):w("",!0),e.footerRef?(m(),v(U,{key:1,align:"right"},{default:c(()=>[p(r(g,{flat:"",label:"取消",color:"primary",onClick:e.handleCancel},null,8,["onClick"]),[[h]]),p(r(g,{flat:"",label:"确定",color:"primary",onClick:e.handleOk},null,8,["onClick"]),[[h]])]),_:1})):w("",!0)]),_:1},8,["style"])]),_:1},8,["modelValue"])}const P=B(I,[["render",ae],["__file","index.vue"]]),te=[],oe=[{id:"changeMyPWD",label:"修改自己的密码",component:()=>D(()=>import("./ChangePwd-CquoQekp.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11,12]),import.meta.url)},{id:"loginModal",label:"用户登录-对话框",component:()=>D(()=>import("./loginModal-2H7myVGs.js"),__vite__mapDeps([13,4,5,6,2,1,3,7,8,9,10,11,12,14]),import.meta.url)}],ne=Object.assign({"./standardTabModal.ts":te,"./systemModal.ts":oe}),le=K(ne,!1),y=new Map;async function ie(e){if(y.has(e))return y.get(e);const a=le.find(t=>t.id===e);if(a){const t=await a.component().catch(l=>{$.Message.warn("加载Modal模块失败："+a.id)});return t?(y.set(e,t.default),t.default):void 0}else{$.Message.warn(`Modal模块不存在：${e}`);return}}const se=x({name:"ModalContainerWidget",components:{ModalContainer:P},setup(e,a){const t=f(500),l=f(),i=f(),s=f(!1),o=Z();function u(M){const{modalID:d,extraData:n,rowData:_,width:A}=M;i.value=void 0,i.value=n,t.value=A??500,s.value=!1,d&&(l.value=_,ie(d).then(L=>{s.value=!0,o.value=L}))}return Q(()=>{E(C.ModalContainerWidget_LoadModal,u)}),S(()=>{O(C.ModalContainerWidget_LoadModal,u)}),{modalContentRef:o,modalVisibleRef:s,extraRef:i,recordData:l,modalWidthRef:t}}});function de(e,a,t,l,i,s){const o=P;return m(),v(o,{width:e.modalWidthRef,content:e.modalContentRef,visible:e.modalVisibleRef,extra:e.extraRef,data:e.recordData},null,8,["width","content","visible","extra","data"])}const _e=B(se,[["render",de],["__file","ModalContainerWidget.vue"]]);export{_e as default};