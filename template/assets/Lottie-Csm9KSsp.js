import{a7 as F,f as O,a8 as V,a9 as j,e as h,c as y}from"./quasar-exp-BsaNoQ7w.js";import{l as w}from"./lottie-web-exp-CIY4INm7.js";import{d as C,r as u,w as Q,o as D,a as W,b as v,e as I,f as B,a4 as n,l as b,g as N,j as a,ac as m,a7 as E}from"./@vue-exp-Bws36Ke9.js";import{_ as k}from"./index-BQ7ovaqR.js";import{B as A}from"./BaseContent-Bj_GXZNN.js";import"./monaco-editor-exp-BNK_u0iZ.js";import"./vendor-DJm_4oaR.js";import"./xframelib-exp-CMLeiWD4.js";import"./axios-exp-C7rfqWEd.js";import"./@iconify/vue-exp-Q9Q0SWJB.js";import"./xgis-cesium-exp-Hv7oMXHX.js";import"./vue-router-exp-CO9L2VdX.js";const P=C({name:"LottieWeb",__name:"LottieWeb",props:{animationData:{},path:{},loop:{type:Boolean,default:!0},animationSpeed:{default:1}},emits:["isLottieFinish"],setup(d,{expose:e,emit:i}){const t=d,s=i,l=u(null);let o=u(null);const f=()=>{o.value=w.loadAnimation({container:l.value,renderer:"svg",loop:t.loop,path:t.path,animationData:t.animationData}),o.value.addEventListener("data_ready",x)},_=()=>{o.value?.stop()},r=()=>{o.value?.play()},c=()=>{o.value?.pause()},L=p=>{o.value?.setSpeed(p)},x=()=>{s("isLottieFinish",!0)},S=Q(()=>t.animationSpeed,(p,q)=>{L(p)});D(()=>{f()}),W(()=>{o.value?.destroy(),o.value=null,S()}),e({play:r,stop:_,pause:c});const g={props:t,emit:s,lottieBox:l,get lottieInstance(){return o},set lottieInstance(p){o=p},initLottie:f,stop:_,play:r,pause:c,onSpeedChange:L,isLottieFinish:x,stopHandle:S};return Object.defineProperty(g,"__isScriptSetup",{enumerable:!1,value:!0}),g}}),R={ref:"lottieBox"};function T(d,e,i,t,s,l){return v(),I("div",R,null,512)}const U=k(P,[["render",T],["__file","LottieWeb.vue"]]),z=C({name:"Lottie",__name:"Lottie",setup(d,{expose:e}){e();const i=u(null),t=u(!1),s=u({path:"https://assets1.lottiefiles.com/packages/lf20_gzl797gs.json",loop:!0,animationSpeed:1}),r={lottieRef:i,isLottieFinished:t,defaultOptions:s,play:()=>{i.value?.play()},stop:()=>{i.value?.stop()},pause:()=>{i.value?.pause()},handleLottieFinish:c=>{t.value=c},LottieWeb:U,BaseContent:A};return Object.defineProperty(r,"__isScriptSetup",{enumerable:!1,value:!0}),r}}),G={style:{margin:"0 auto","max-width":"700px"}},H={class:"row justify-center",style:{"margin-left":"10px","margin-right":"10px"}};function M(d,e,i,t,s,l){return v(),B(t.BaseContent,null,{default:n(()=>[b("div",G,[t.isLottieFinished?N("",!0):(v(),B(F,{key:0,type:"text",height:"150px"})),a(t.LottieWeb,{ref:"lottieRef",path:t.defaultOptions.path,loop:t.defaultOptions.loop,"animation-speed":t.defaultOptions.animationSpeed,onIsLottieFinish:t.handleLottieFinish},null,8,["path","loop","animation-speed"]),b("div",H,[a(O,{color:"secondary",class:"justify-start"},{default:n(()=>[m(" Speed: "+E(t.defaultOptions.animationSpeed),1)]),_:1}),a(V,{modelValue:t.defaultOptions.animationSpeed,"onUpdate:modelValue":e[0]||(e[0]=o=>t.defaultOptions.animationSpeed=o),min:0,max:3,step:.5,label:""},null,8,["modelValue"]),a(j,null,{default:n(()=>[a(h,{color:"primary",icon:"play_arrow",onClick:t.play},{default:n(()=>[a(y,null,{default:n(()=>e[1]||(e[1]=[m("播放")])),_:1})]),_:1}),a(h,{color:"primary",icon:"pause",onClick:t.pause},{default:n(()=>[a(y,null,{default:n(()=>e[2]||(e[2]=[m("暂停")])),_:1})]),_:1}),a(h,{color:"primary",icon:"stop",onClick:t.stop},{default:n(()=>[a(y,null,{default:n(()=>e[3]||(e[3]=[m("停止")])),_:1})]),_:1})]),_:1})])])]),_:1})}const st=k(z,[["render",M],["__file","Lottie.vue"]]);export{st as default};