import{I as T,g as C,h as M,B,F}from"./ant-design-vue-exp.fcd30b7a.js";import{P,Q as R}from"./vendor.d3cc975b.js";import{M as i,f as V,G as D,l as I,b as w,a as O,u as U}from"./xframelib-exp.f18cc8b7.js";import{_ as E}from"./logo.3da8610b.js";import{_ as $}from"./index.aafe4c8d.js";import{d as A,r as L,l as y,o as N,W as v,M as W,N as Q,f as l,S as u,Q as b,Z as S,V as G}from"./@vue-exp.a4e706db.js";import"./lodash-es-exp.01017e5f.js";import"./axios-exp.e066e043.js";import"./@hprose-exp.37e63ca6.js";const q=A({setup(){const e=i.t,s=L({username:"",password:""}),d=y(),f=y(),k=y("\u7EDF\u4E00\u7528\u6237\u9A8C\u8BC1\u670D\u52A1"),c=P(),p=R();let t=m();console.log(t,"011111111111");let r;function m(){let n=document.URL.indexOf("redirect=");if(n>0)return document.URL.substring(n+9)}const g=async()=>{if(s.username.trim()===""||s.password.trim()=="")return i.Message?.warn(e("sys.login.loginEmtyWarnInfo"));let n={username:s.username.trim(),pwd:O.MD5(s.password)};const o=await U(n);if(!o){i.Message?.warn(e("sys.login.loginFailTitle"));return}if(o.isSuccess){const a=m()||"/";if(c)if(console.log(a,"toPath"),a.startsWith("http://")||a.startsWith("https://")){const h=w();window.open(a+"?tk="+h.token,"_self")}else c.replace(a).then(h=>{p.name=="login"&&c.replace("/")});i.Message?.msg(e("sys.login.loginSuccessTitle"))}else i.Message?.warn(o.ResultDescription||e("sys.login.loginFailTitle"))};N(async()=>{if(t=m(),console.log(t,"11111111111"),t&&(r=p.query?.tk?.toString()),r){console.log("\u8FDB\u884C\u9A8C\u8BC1token!!!");const n=await V(r);console.log(n,"\u8F93\u51FAcheckToken\u7684\u7ED3\u679C00");const o=n?.data;if(o)if(o.isSuccess){D(o.resultValue),I(o.resultValue.doubleToken),i.Message?.msg(e("sys.login.loginSuccessTitle"));const a=w();a&&(t?.indexOf("?")>0?t+="&tk="+a.token:t+="?tk="+a.token,c.replace(t).then(h=>{p.name=="login"&&c.replace("/")}))}else i.Message?.warn(e("sys.login.loginTokenFailInfo"))}});function _(){d.value&&(d.value.placeholder=e("sys.login.accountPlaceholder")),f.value&&(f.value.placeholder=e("sys.login.passwordPlaceholder"))}return{t:e,formState:s,onblur:_,nameInput:d,pwdInput:f,systemTitle:k,handleSubmit:g}}}),x={class:"bgc-image"},Z=b("img",{src:E,alt:"",class:"logo"},null,-1),j={style:{"text-align":"center"}};function z(e,s,d,f,k,c){const p=v("UserOutlined"),t=T,r=C,m=v("LockOutlined"),g=M,_=B,n=F;return W(),Q("div",x,[Z,l(n,{class:"login-view",ref:"formRef",model:e.formState,rules:e.rules},{default:u(()=>[b("p",j,S(e.systemTitle),1),l(r,{name:"username",ref:"name"},{default:u(()=>[l(t,{placeholder:e.t("sys.login.accountPlaceholder"),class:"login-input",value:e.formState.username,"onUpdate:value":s[0]||(s[0]=o=>e.formState.username=o)},{prefix:u(()=>[l(p,{style:{color:"rgba(0, 0, 0, 0.5)"}})]),_:1},8,["placeholder","value"])]),_:1},512),l(r,{name:"password"},{default:u(()=>[l(g,{placeholder:e.t("sys.login.passwordPlaceholder"),class:"login-input",value:e.formState.password,"onUpdate:value":s[1]||(s[1]=o=>e.formState.password=o)},{prefix:u(()=>[l(m,{style:{color:"rgba(0, 0, 0, 0.5)"}})]),_:1},8,["placeholder","value"])]),_:1}),l(r,null,{default:u(()=>[l(_,{onClick:e.handleSubmit,class:"login-button"},{default:u(()=>[G(S(e.t("sys.login.loginButton")),1)]),_:1},8,["onClick"])]),_:1})]),_:1},8,["model","rules"])])}var ne=$(q,[["render",z]]);export{ne as default};