import{a3 as u,a4 as k}from"./vendor-CcHNtcKJ.js";import{T as F,O as x,G as C,e as T,h as U,F as y}from"./ol-exp-DkhKL1MQ.js";import{B as M}from"./xframelib-exp-CxzDUbp4.js";import{t as W}from"./zhezhaotest-DjReuYCD.js";import{d as _,r as f,w as V,b as B,D as E,$ as G,a0 as n,ae as w,c as t,X as j}from"./@vue-exp-DTehQd6t.js";import{_ as P}from"./index-XkDzdRfP.js";import"./@hprose-exp-CYjcO8Nw.js";import"./axios-exp-B_zfNCMU.js";import"./@iconify/vue-exp-Ct1khs4G.js";import"./vue-router-exp-B0kidEOa.js";const S=_({__name:"CropMaskExtWidget",setup(g,{expose:l}){l();let s,e,r;const m=f("crop"),a=f(!1),p=f(!1),v=f("White");V(()=>m.value,()=>i()),V(()=>a.value,()=>i()),V(()=>p.value,()=>i()),V(()=>v.value,()=>i());function i(){e.set("inner",a.value),e.set("shadowWidth",p.value?15:0),r.set("inner",a.value),r.set("shadowWidth",p.value?15:0);let o="transparent";switch(v.value){case"White":o="rgba(255,255,255,0.5)";break;case"Transparent":o="transparent";break;case"Red":o="rgba(255,0,0,1)";break;case"Green":o="rgba(0,255,0,0.2)";break;case"Blue":o="rgba(0,0,255,0.2)";break;case"Yellow":o="rgba(255,255,0,0.2)";break}switch(r.setFillColor(o),r.set("active",!1),e.set("active",!1),m.value){case"mask":r.set("active",!0);break;default:e.set("active",!0);break}}let d;B(()=>{s=M.XMap,d=new F({source:new x}),s.map.addLayer(d);const o=s.MapView.getProjection(),c=new C().readFeatures(W,{dataProjection:"EPSG:4326",featureProjection:o})[0];e=new T({feature:c,wrapX:!0,inner:!1}),d.addFilter(e),r=new U({feature:c,wrapX:!0,inner:!1,fill:new y({color:[255,255,255,.8]})}),d.addFilter(r),i()}),E(()=>{s&&d&&s.map.removeLayer(d)});const b={get xmap(){return s},set xmap(o){s=o},get crop(){return e},set crop(o){e=o},get mask(){return r},set mask(o){r=o},filterType:m,inner:a,shadow:p,color:v,setFilter:i,get base(){return d},set base(o){d=o}};return Object.defineProperty(b,"__isScriptSetup",{enumerable:!1,value:!0}),b}}),N={class:"options"},O={class:"q-gutter-sm"},R={class:"q-gutter-sm"};function X(g,l,s,e,r,m){return j(),G("div",null,[n("div",N,[n("ul",null,[n("li",null,[l[10]||(l[10]=w(" Filter: ")),n("div",O,[t(u,{modelValue:e.filterType,"onUpdate:modelValue":l[0]||(l[0]=a=>e.filterType=a),val:"crop",label:"Crop"},null,8,["modelValue"]),t(u,{modelValue:e.filterType,"onUpdate:modelValue":l[1]||(l[1]=a=>e.filterType=a),val:"mask",label:"Mask"},null,8,["modelValue"])])]),n("li",null,[n("div",null,[t(k,{modelValue:e.inner,"onUpdate:modelValue":l[2]||(l[2]=a=>e.inner=a),label:"inner内嵌式"},null,8,["modelValue"])])]),n("li",null,[t(k,{modelValue:e.shadow,"onUpdate:modelValue":l[3]||(l[3]=a=>e.shadow=a),label:"shaddow阴影"},null,8,["modelValue"])]),n("li",null,[l[11]||(l[11]=w(" Color of the mask: ")),n("div",R,[t(u,{dense:"",modelValue:e.color,"onUpdate:modelValue":l[4]||(l[4]=a=>e.color=a),val:"White",label:"White白色"},null,8,["modelValue"]),t(u,{dense:"",modelValue:e.color,"onUpdate:modelValue":l[5]||(l[5]=a=>e.color=a),val:"Transparent",label:"Transparent透明"},null,8,["modelValue"]),t(u,{dense:"",modelValue:e.color,"onUpdate:modelValue":l[6]||(l[6]=a=>e.color=a),val:"Red",label:"Red"},null,8,["modelValue"]),t(u,{dense:"",modelValue:e.color,"onUpdate:modelValue":l[7]||(l[7]=a=>e.color=a),val:"Green",label:"Green"},null,8,["modelValue"]),t(u,{dense:"",modelValue:e.color,"onUpdate:modelValue":l[8]||(l[8]=a=>e.color=a),val:"Blue",label:"Blue"},null,8,["modelValue"]),t(u,{dense:"",modelValue:e.color,"onUpdate:modelValue":l[9]||(l[9]=a=>e.color=a),val:"Yellow",label:"Yellow"},null,8,["modelValue"])])])])])])}const Z=P(S,[["render",X],["__scopeId","data-v-124873af"],["__file","CropMaskExtWidget.vue"]]);export{Z as default};