import{A as k,F as V,a0 as U,T as I,aa as x,e as C,a4 as Q}from"./quasar-exp-BsaNoQ7w.js";import{cC as T,cB as O}from"./vendor-DJm_4oaR.js";import{i as j,j as q,k as E,_ as D}from"./index-BQ7ovaqR.js";import{T as A}from"./TableEvent-Bxu_GHGl.js";import{S as h}from"./StudentService-DlLAObFe.js";import{B as w,h as M}from"./xframelib-exp-CMLeiWD4.js";import{d as N,r as c,w as H,o as L,a as P,b as z,f as G,a4 as p,j as n,l,ac as B,k as J,v as K}from"./@vue-exp-Bws36Ke9.js";import"./lottie-web-exp-CIY4INm7.js";import"./monaco-editor-exp-BNK_u0iZ.js";import"./xgis-cesium-exp-Hv7oMXHX.js";import"./vue-router-exp-CO9L2VdX.js";import"./axios-exp-C7rfqWEd.js";import"./@iconify/vue-exp-Q9Q0SWJB.js";const v="addEditForm3",W=N({name:"addEditForm3",__name:"addEditForm",props:{data:T([Object]).def({}),extra:O().isRequired},setup(m,{expose:e}){e();const r=m,o=c({});H(()=>r.data,a=>{a?o.value={...a}:o.value={}},{immediate:!0,deep:!0});function u(a){a?F():o.value={}}L(()=>{j(v,u)}),P(()=>{q(v,u)});let s;const d=c(null),g=c(null);function R(){g.value?.pickFiles()}function S(a){const t=a[0],i=new FileReader;i.onload=function(f){o.value.picture=f.target.result},i.readAsDataURL(t)}function y(){d.value&&d.value.pickFiles()}async function b(a){const t=a[0],i=t.name,f=await M.readFileBytes(t);s={name:i,content:f}}async function F(){const a={...o.value};if(s){const t=s;a.profiles=[{name:t.name,file:t.content}]}r.extra.title==="新建"?(a.gradeid="1",h.SaveStudentInfoAsync(a).then(t=>{E(A.RefeshTable,void 0)})):await h.UpdateStudentInfoAsync(a).catch(i=>!1)?(w.Message.info("编辑成功！"),E(A.RefeshTable,void 0)):w.Message.info("编辑失败！")}const _={name:v,props:r,formRef:o,OkCancelHandler:u,get uploadFiles(){return s},set uploadFiles(a){s=a},profileUploader:d,imgUploader:g,doImageUpload:R,pictureUpload:S,doUpload:y,fileUpload:b,onSubmit:F};return Object.defineProperty(_,"__isScriptSetup",{enumerable:!1,value:!0}),_}}),X={class:"row q-col-gutter-x-md dialog_form q-pa-md"},Y={class:"col-6"},Z={class:"col-6"},$={class:"col-12"},ee={class:"col-12"};function oe(m,e,r,o,u,s){return z(),G(Q,{class:"modalContent column"},{default:p(()=>[n(k,{class:"col"},{default:p(()=>[l("div",X,[l("div",Y,[l("h5",null,[n(V,{name:"star",color:"red"}),e[2]||(e[2]=B("姓名： "))]),n(U,{outlined:"",dense:"",modelValue:o.formRef.name,"onUpdate:modelValue":e[0]||(e[0]=d=>o.formRef.name=d),type:"text"},null,8,["modelValue"])]),l("div",Z,[e[3]||(e[3]=l("h5",null,"年龄：",-1)),n(U,{outlined:"",dense:"",modelValue:o.formRef.age,"onUpdate:modelValue":e[1]||(e[1]=d=>o.formRef.age=d),type:"text"},null,8,["modelValue"])]),l("div",$,[e[4]||(e[4]=l("h5",null,"个人照片",-1)),n(I,{src:o.formRef.picture??"img/noimage.gif","spinner-color":"white",style:{height:"80px","max-width":"80px"},onClick:o.doImageUpload},null,8,["src"]),e[5]||(e[5]=B()),n(x,{ref:"imgUploader","max-files":1,class:"hidden",accept:"image/*","field-name":"file",onAdded:o.pictureUpload},null,512)]),l("div",ee,[e[6]||(e[6]=l("h5",null,"上传简历",-1)),J(n(C,{"no-wrap":"",label:"上传",icon:"mdi-cloud-upload-outline",color:"primary",onClick:o.doUpload},{default:p(()=>[n(x,{ref:"profileUploader","max-files":1,class:"hidden",accept:".doc, .docx, .pdf","field-name":"file",onAdded:o.fileUpload},null,512)]),_:1},512),[[K,m.$q.screen.gt.sm]])])])]),_:1})]),_:1})}const ve=D(W,[["render",oe],["__scopeId","data-v-2687e964"],["__file","addEditForm.vue"]]);export{ve as default};