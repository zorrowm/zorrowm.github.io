import{ae as B,W as m,K as A}from"./vendor-DLGs6WCJ.js";import{a as C}from"./xgis-ol-exp-CUkajMJM.js";import{B as p}from"./xframelib-exp-BL-NWzRk.js";import{d as R,r as i,b as h,U as P,V as t,c as a,$ as w,P as g,S as M}from"./@vue-exp-Mkau1HGZ.js";import{_ as F}from"./index-Dy2WIICa.js";import"./@iconify/vue-exp-DwwUNauw.js";import"./ol-exp-B7umSeRp.js";import"./axios-exp-C7rfqWEd.js";import"./monaco-editor-exp-B01XOe8A.js";import"./vue-router-exp-LDq1UUA0.js";const j=R({__name:"LocationWidget",setup(x,{expose:o}){o();const d=i(),e=i(!1);h(()=>{p.XMap&&(d.value=p.XMap)});const l=i(),s=i(),r=i();function n(){l.value!=null&&s.value!=null&&f(l.value,s.value,r.value)}function f(V,b,u){const v=p.XMap;if(v.map){const c=v.MapView,y=c.getProjection(),E=C.transformCoordinate([V,b],"EPSG:4326",y);c.setCenter(E),u&&u>=0&&c.setZoom(u)}}const _={mapRef:d,locationVisible:e,xRef:l,yRef:s,zRef:r,locatePostion:n,doLocation:f};return Object.defineProperty(_,"__isScriptSetup",{enumerable:!1,value:!0}),_}}),k={class:"location"},D={title:"定位"},L={class:"q-pa-sm"},S={class:"sjz"},U={class:"xcoor"},W={class:"ycoor"},I={style:{margin:"0 auto"}};function N(x,o,d,e,l,s){const r=M("Icon");return g(),P("div",k,[t("span",D,[a(r,{icon:"gis:position-o"})]),a(B,{"model-value":e.locationVisible,"transition-show":"flip-up","transition-hide":"flip-down"},{default:w(()=>[t("div",L,[o[3]||(o[3]=t("div",{class:"text-h6 text-center q-mb-md"},"坐标定位",-1)),t("div",S,[t("div",U,[a(m,{dense:"",style:{width:"200px"},modelValue:e.xRef,"onUpdate:modelValue":o[0]||(o[0]=n=>e.xRef=n),label:"经度:",placeholder:"经度十进制"},null,8,["modelValue"])]),t("div",W,[a(m,{dense:"",style:{width:"200px"},modelValue:e.yRef,"onUpdate:modelValue":o[1]||(o[1]=n=>e.yRef=n),label:"纬度:",placeholder:"纬度十进制"},null,8,["modelValue"])]),t("div",null,[a(m,{id:"inputNumber",label:"级别:",modelValue:e.zRef,"onUpdate:modelValue":o[2]||(o[2]=n=>e.zRef=n),modelModifiers:{number:!0},type:"number",dense:"",style:{"max-width":"200px"},min:1,max:22},null,8,["modelValue"])]),t("div",I,[a(A,{color:"primary","text-color":"black",label:"确定",onClick:e.locatePostion})])])])]),_:1},8,["model-value"])])}const T=F(j,[["render",N],["__file","LocationWidget.vue"]]);export{T as default};