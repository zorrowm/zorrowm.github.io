import{d as M,u as U,c as T,e as A,f as L,_ as $}from"./index.f27a7adf.js";import{B as i,E as B,M as V,c as q,F as P}from"./xframelib-exp.e4d795a1.js";import{b as K,u as W}from"./vue-router-exp.aee9d5fb.js";import{d as j,r as x,a as f,y as N,o as O,b as z,g as t,D as y,A as C,ai as k,aj as G}from"./vendor.de069ad6.js";import"./lodash-es-exp.d3c3d62f.js";import"./axios-exp.cd5cf947.js";const H=j({setup(){const e=x({username:"",password:""}),s=f(),p=f(),h=f("");h.value=i.Config.UI?.SiteTitle;const F=f("");F.value=i.Config.UI?.CopyRight;const n=K(),o=W();let u=decodeURIComponent(o.query?.redirect||"/");const D=B();let m;if(D){V(),n&&n.replace(u).then(v=>{o.name=="login"&&n.replace("/")});return}let l=!0;const S=async()=>{if(!l){i.Logger().debug("\u9891\u7E41\u70B9\u51FB\u767B\u5F55******");return}if(l=!1,e.username.trim()===""||e.password.trim()=="")return setTimeout(()=>{l=!0},2e3),i.Message?.warn("\u7528\u6237\u540D\u6216\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A\uFF01");let v={username:e.username.trim(),pwd:e.password.trim()};const r=await q(v).catch(a=>{i.Message?.warn(`\u767B\u5F55\u5931\u8D25:${a.message}!`),l=!0});if(r){const a=U();a.init(r),i.User=a.id;const b=T(),E=a.DefaultMaxRoleLevel===0;let _=!0;const I=await P(b,E).catch(c=>{_=!1,i.Message?.err("\u8BE5\u7CFB\u7EDF\u672A\u6CE8\u518C\uFF01")});if(l=!0,!_)return;if(I){const c=A();let g;c?.forEach(w=>{g||(g=w),n.addRoute(w)}),g&&L(n,g)}else{i.Message?.warn(e.username+"\u65E0\u7CFB\u7EDF\u6743\u9650\uFF0C\u65E0\u6CD5\u767B\u5F55\uFF01");return}const d=decodeURIComponent(o.query?.redirect||"/");if(n)if(i.Logger().debug(d,"toPath"),d.startsWith("http://")||d.startsWith("https://")){const c=B();window.open(d+"#/?tk="+c.token,"_self")}else n.replace(d).then(c=>{o.name=="login"&&n.replace("/")});i.Message?.msg("\u767B\u5F55\u6210\u529F")}};N(async()=>{if(m=void 0,u&&(m=o.query?.tk?.toString()),m&&await M(m)){const r=B();r&&(u?.indexOf("?")>0?u+="&tk="+r.token:u+="?tk="+r.token,n.replace(u).then(a=>{o.name=="login"&&n.replace("/")}))}});function R(){s.value&&(s.value.placeholder="\u8BF7\u8F93\u5165\u8D26\u53F7"),p.value&&(p.value.placeholder="\u8BF7\u8F93\u5165\u5BC6\u7801")}return{formState:e,systemTitle:h,handleSubmit:S,onblur:R,nameInput:s,pwdInput:p,copyRightInfo:F}}}),J=""+new URL("../img/logo.png",import.meta.url).href,Q=""+new URL("../img/login/name.png",import.meta.url).href,X=""+new URL("../img/login/password.png",import.meta.url).href,Y={class:"container"},Z={class:"login-logo"},ee=t("img",{src:J,alt:""},null,-1),te={class:"login-title"},se={class:"login"},oe=t("div",{class:"login-top"},"\u7528\u6237\u767B\u5F55",-1),ne={class:"login-center clearfix"},ie=t("div",{class:"login-center-img"},[t("img",{src:Q})],-1),ue={class:"login-center-input"},re=t("div",{class:"login-center-input-text"},"\u8D26\u53F7",-1),ae={class:"login-center clearfix"},le=t("div",{class:"login-center-img"},[t("img",{src:X})],-1),de={class:"login-center-input"},ce=t("div",{class:"login-center-input-text"},"\u5BC6\u7801",-1),pe={class:"login-copyright"};function me(e,s,p,h,F,n){return O(),z("div",Y,[t("div",Z,[ee,t("span",te,y(e.systemTitle),1)]),t("div",se,[oe,t("div",ne,[ie,t("div",ue,[C(t("input",{ref:"nameInput",type:"text",placeholder:"\u8BF7\u8F93\u5165\u8D26\u53F7",onfocus:"this.placeholder=''",onBlur:s[0]||(s[0]=o=>e.onblur()),"onUpdate:modelValue":s[1]||(s[1]=o=>e.formState.username=o)},null,544),[[k,e.formState.username]]),re])]),t("div",ae,[le,t("div",de,[C(t("input",{ref:"pwdInput",type:"password",placeholder:"\u8BF7\u8F93\u5165\u5BC6\u7801",onfocus:"this.placeholder=''",onBlur:s[2]||(s[2]=o=>e.onblur()),"onUpdate:modelValue":s[3]||(s[3]=o=>e.formState.password=o),onKeyup:s[4]||(s[4]=G((...o)=>e.handleSubmit&&e.handleSubmit(...o),["enter"]))},null,544),[[k,e.formState.password]]),ce])]),t("div",{class:"login-button",onClick:s[5]||(s[5]=(...o)=>e.handleSubmit&&e.handleSubmit(...o))}," \u767B\u5F55 ")]),t("div",pe,y(e.copyRightInfo),1)])}const _e=$(H,[["render",me]]);export{_e as default};