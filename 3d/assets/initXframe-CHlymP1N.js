import{N as n,e as m,k as p}from"./vendor-CDV5M84i.js";import{I as l,a as f}from"./@iconify/vue-exp-2pvYVbr5.js";import{E as a,g,a as u}from"./index-DPO_t7vI.js";import{a as w,j as r}from"./xframelib-exp-CvTEfE5n.js";import"./@hprose-exp-DifMA6AO.js";import"./@vue-exp-YaP0LnBg.js";import"./vue-router-exp-BeFgxScw.js";import"./axios-exp-BH40TtQM.js";let s=[];async function y(o){const t=/<script.*src=["'](?<src>[^"']+)/gm,e=[];let i;for(;i=t.exec(o);)e.push(i.groups?.src??"");return e}async function h(){const o=await y(await fetch("/").then(t=>t.text()));if(!s.length)return s=o,!1;if(o.length!==s.length)return s=o,!0;for(let t=0;t<s.length;t++)if(s[t]!==o[t])return s=o,!0;return!1}const d=5e3,c=()=>{setTimeout(async()=>{await h()?confirm("页面有更新，点击确定刷新页面?")&&location.reload():c()},d)};class I{info(t,e=3){const i=e<=0?1e3:e*1e3;n.create({type:"info",message:t,timeout:i,position:"top"})}success(t,e=3){const i=e<=0?1e3:e*1e3;n.create({type:"positive",message:t,timeout:i,position:"top"})}warning(t,e=3){const i=e<=0?1e3:e*1e3;n.create({type:"warning",message:t,timeout:i,position:"top"})}warn(t,e=3){this.warning(t,e)}error(t,e=3){const i=e<=0?1e3:e*1e3;n.create({type:"negative",message:t,timeout:i,position:"top"})}}const S=new I;function v(){window.global===void 0&&(window.global=globalThis);const o=g(),t=u().name;w(S,o,t),r.Loading=a,r.Config.ServiceURL.IconServiceURL&&f("",{resources:[r.Config.ServiceURL.IconServiceURL]})}const T=m(({app:o})=>{a("XFramelib库"),v(),c(),o.component("Icon",l),o.component("VDropdown",p)});export{T as default};