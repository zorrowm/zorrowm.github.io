import{d as Oe,h as te}from"../@vue-exp-Cbz_CXqa.js";const P=/^[a-z0-9]+(-[a-z0-9]+)*$/,N=(e,t,n,r="")=>{const o=e.split(":");if(e.slice(0,1)==="@"){if(o.length<2||o.length>3)return null;r=o.shift().slice(1)}if(o.length>3||!o.length)return null;if(o.length>1){const c=o.pop(),l=o.pop(),f={provider:o.length>0?o[0]:r,prefix:l,name:c};return t&&!F(f)?null:f}const i=o[0],s=i.split("-");if(s.length>1){const c={provider:r,prefix:s.shift(),name:s.join("-")};return t&&!F(c)?null:c}if(n&&r===""){const c={provider:r,prefix:"",name:i};return t&&!F(c,n)?null:c}return null},F=(e,t)=>e?!!((e.provider===""||e.provider.match(P))&&(t&&e.prefix===""||e.prefix.match(P))&&e.name.match(P)):!1,me=Object.freeze({left:0,top:0,width:16,height:16}),D=Object.freeze({rotate:0,vFlip:!1,hFlip:!1}),R=Object.freeze({...me,...D}),Q=Object.freeze({...R,body:"",hidden:!1});function Le(e,t){const n={};!e.hFlip!=!t.hFlip&&(n.hFlip=!0),!e.vFlip!=!t.vFlip&&(n.vFlip=!0);const r=((e.rotate||0)+(t.rotate||0))%4;return r&&(n.rotate=r),n}function ne(e,t){const n=Le(e,t);for(const r in Q)r in D?r in e&&!(r in n)&&(n[r]=D[r]):r in t?n[r]=t[r]:r in e&&(n[r]=e[r]);return n}function Fe(e,t){const n=e.icons,r=e.aliases||Object.create(null),o=Object.create(null);function i(s){if(n[s])return o[s]=[];if(!(s in o)){o[s]=null;const c=r[s]&&r[s].parent,l=c&&i(c);l&&(o[s]=[c].concat(l))}return o[s]}return Object.keys(n).concat(Object.keys(r)).forEach(i),o}function Ae(e,t,n){const r=e.icons,o=e.aliases||Object.create(null);let i={};function s(c){i=ne(r[c]||o[c],i)}return s(t),n.forEach(s),ne(e,i)}function ye(e,t){const n=[];if(typeof e!="object"||typeof e.icons!="object")return n;e.not_found instanceof Array&&e.not_found.forEach(o=>{t(o,null),n.push(o)});const r=Fe(e);for(const o in r){const i=r[o];i&&(t(o,Ae(e,o,i)),n.push(o))}return n}const _e={provider:"",aliases:{},not_found:{},...me};function z(e,t){for(const n in t)if(n in e&&typeof e[n]!=typeof t[n])return!1;return!0}function be(e){if(typeof e!="object"||e===null)return null;const t=e;if(typeof t.prefix!="string"||!e.icons||typeof e.icons!="object"||!z(e,_e))return null;const n=t.icons;for(const o in n){const i=n[o];if(!o.match(P)||typeof i.body!="string"||!z(i,Q))return null}const r=t.aliases||Object.create(null);for(const o in r){const i=r[o],s=i.parent;if(!o.match(P)||typeof s!="string"||!n[s]&&!r[s]||!z(i,Q))return null}return t}const oe=Object.create(null);function De(e,t){return{provider:e,prefix:t,icons:Object.create(null),missing:new Set}}function C(e,t){const n=oe[e]||(oe[e]=Object.create(null));return n[t]||(n[t]=De(e,t))}function J(e,t){return be(t)?ye(t,(n,r)=>{r?e.icons[n]=r:e.missing.add(n)}):[]}function Ne(e,t,n){try{if(typeof n.body=="string")return e.icons[t]={...n},!0}catch{}return!1}let E=!1;function we(e){return typeof e=="boolean"&&(E=e),E}function Re(e){const t=typeof e=="string"?N(e,!0,E):e;if(t){const n=C(t.provider,t.prefix),r=t.name;return n.icons[r]||(n.missing.has(r)?null:void 0)}}function Be(e,t){const n=N(e,!0,E);if(!n)return!1;const r=C(n.provider,n.prefix);return Ne(r,n.name,t)}function ze(e,t){if(typeof e!="object")return!1;if(typeof t!="string"&&(t=e.provider||""),E&&!t&&!e.prefix){let o=!1;return be(e)&&(e.prefix="",ye(e,(i,s)=>{s&&Be(i,s)&&(o=!0)})),o}const n=e.prefix;if(!F({provider:t,prefix:n,name:"a"}))return!1;const r=C(t,n);return!!J(r,e)}const xe=Object.freeze({width:null,height:null}),Ie=Object.freeze({...xe,...D}),Ve=/(-?[0-9.]*[0-9]+[0-9.]*)/g,Qe=/^-?[0-9.]*[0-9]+[0-9.]*$/g;function re(e,t,n){if(t===1)return e;if(n=n||100,typeof e=="number")return Math.ceil(e*t*n)/n;if(typeof e!="string")return e;const r=e.split(Ve);if(r===null||!r.length)return e;const o=[];let i=r.shift(),s=Qe.test(i);for(;;){if(s){const c=parseFloat(i);isNaN(c)?o.push(i):o.push(Math.ceil(c*t*n)/n)}else o.push(i);if(i=r.shift(),i===void 0)return o.join("");s=!s}}function $e(e,t="defs"){let n="";const r=e.indexOf("<"+t);for(;r>=0;){const o=e.indexOf(">",r),i=e.indexOf("</"+t);if(o===-1||i===-1)break;const s=e.indexOf(">",i);if(s===-1)break;n+=e.slice(o+1,i).trim(),e=e.slice(0,r).trim()+e.slice(s+1)}return{defs:n,content:e}}function qe(e,t){return e?"<defs>"+e+"</defs>"+t:t}function He(e,t,n){const r=$e(e);return qe(r.defs,t+r.content+n)}const Ue=e=>e==="unset"||e==="undefined"||e==="none";function Ge(e,t){const n={...R,...e},r={...Ie,...t},o={left:n.left,top:n.top,width:n.width,height:n.height};let i=n.body;[n,r].forEach(g=>{const u=[],k=g.hFlip,I=g.vFlip;let w=g.rotate;k?I?w+=2:(u.push("translate("+(o.width+o.left).toString()+" "+(0-o.top).toString()+")"),u.push("scale(-1 1)"),o.top=o.left=0):I&&(u.push("translate("+(0-o.left).toString()+" "+(o.height+o.top).toString()+")"),u.push("scale(1 -1)"),o.top=o.left=0);let y;switch(w<0&&(w-=Math.floor(w/4)*4),w=w%4,w){case 1:y=o.height/2+o.top,u.unshift("rotate(90 "+y.toString()+" "+y.toString()+")");break;case 2:u.unshift("rotate(180 "+(o.width/2+o.left).toString()+" "+(o.height/2+o.top).toString()+")");break;case 3:y=o.width/2+o.left,u.unshift("rotate(-90 "+y.toString()+" "+y.toString()+")");break}w%2===1&&(o.left!==o.top&&(y=o.left,o.left=o.top,o.top=y),o.width!==o.height&&(y=o.width,o.width=o.height,o.height=y)),u.length&&(i=He(i,'<g transform="'+u.join(" ")+'">',"</g>"))});const s=r.width,c=r.height,l=o.width,f=o.height;let a,d;s===null?(d=c===null?"1em":c==="auto"?f:c,a=re(d,l/f)):(a=s==="auto"?l:s,d=c===null?re(a,f/l):c==="auto"?f:c);const p={},m=(g,u)=>{Ue(u)||(p[g]=u.toString())};m("width",a),m("height",d);const x=[o.left,o.top,l,f];return p.viewBox=x.join(" "),{attributes:p,viewBox:x,body:i}}const Ke=/\sid="(\S+)"/g,Je="IconifyId"+Date.now().toString(16)+(Math.random()*16777216|0).toString(16);let We=0;function Xe(e,t=Je){const n=[];let r;for(;r=Ke.exec(e);)n.push(r[1]);if(!n.length)return e;const o="suffix"+(Math.random()*16777216|Date.now()).toString(16);return n.forEach(i=>{const s=typeof t=="function"?t(i):t+(We++).toString(),c=i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");e=e.replace(new RegExp('([#;"])('+c+')([")]|\\.[a-z])',"g"),"$1"+s+o+"$3")}),e=e.replace(new RegExp(o,"g"),""),e}const $=Object.create(null);function Ye(e,t){$[e]=t}function q(e){return $[e]||$[""]}function W(e){let t;if(typeof e.resources=="string")t=[e.resources];else if(t=e.resources,!(t instanceof Array)||!t.length)return null;return{resources:t,path:e.path||"/",maxURL:e.maxURL||500,rotate:e.rotate||750,timeout:e.timeout||5e3,random:e.random===!0,index:e.index||0,dataAfterTimeout:e.dataAfterTimeout!==!1}}const X=Object.create(null),j=["https://api.simplesvg.com","https://api.unisvg.com"],A=[];for(;j.length>0;)j.length===1||Math.random()>.5?A.push(j.shift()):A.push(j.pop());X[""]=W({resources:["https://api.iconify.design"].concat(A)});function Ze(e,t){const n=W(t);return n===null?!1:(X[e]=n,!0)}function Y(e){return X[e]}const et=()=>{let e;try{if(e=fetch,typeof e=="function")return e}catch{}};let ie=et();function tt(e,t){const n=Y(e);if(!n)return 0;let r;if(!n.maxURL)r=0;else{let o=0;n.resources.forEach(s=>{o=Math.max(o,s.length)});const i=t+".json?icons=";r=n.maxURL-o-n.path.length-i.length}return r}function nt(e){return e===404}const ot=(e,t,n)=>{const r=[],o=tt(e,t),i="icons";let s={type:i,provider:e,prefix:t,icons:[]},c=0;return n.forEach((l,f)=>{c+=l.length+1,c>=o&&f>0&&(r.push(s),s={type:i,provider:e,prefix:t,icons:[]},c=l.length),s.icons.push(l)}),r.push(s),r};function rt(e){if(typeof e=="string"){const t=Y(e);if(t)return t.path}return"/"}const it=(e,t,n)=>{if(!ie){n("abort",424);return}let r=rt(t.provider);switch(t.type){case"icons":{const i=t.prefix,c=t.icons.join(","),l=new URLSearchParams({icons:c});r+=i+".json?"+l.toString();break}case"custom":{const i=t.uri;r+=i.slice(0,1)==="/"?i.slice(1):i;break}default:n("abort",400);return}let o=503;ie(e+r).then(i=>{const s=i.status;if(s!==200){setTimeout(()=>{n(nt(s)?"abort":"next",s)});return}return o=501,i.json()}).then(i=>{if(typeof i!="object"||i===null){setTimeout(()=>{i===404?n("abort",i):n("next",o)});return}setTimeout(()=>{n("success",i)})}).catch(()=>{n("next",o)})},st={prepare:ot,send:it};function ct(e){const t={loaded:[],missing:[],pending:[]},n=Object.create(null);e.sort((o,i)=>o.provider!==i.provider?o.provider.localeCompare(i.provider):o.prefix!==i.prefix?o.prefix.localeCompare(i.prefix):o.name.localeCompare(i.name));let r={provider:"",prefix:"",name:""};return e.forEach(o=>{if(r.name===o.name&&r.prefix===o.prefix&&r.provider===o.provider)return;r=o;const i=o.provider,s=o.prefix,c=o.name,l=n[i]||(n[i]=Object.create(null)),f=l[s]||(l[s]=C(i,s));let a;c in f.icons?a=t.loaded:s===""||f.missing.has(c)?a=t.missing:a=t.pending;const d={provider:i,prefix:s,name:c};a.push(d)}),t}function Se(e,t){e.forEach(n=>{const r=n.loaderCallbacks;r&&(n.loaderCallbacks=r.filter(o=>o.id!==t))})}function lt(e){e.pendingCallbacksFlag||(e.pendingCallbacksFlag=!0,setTimeout(()=>{e.pendingCallbacksFlag=!1;const t=e.loaderCallbacks?e.loaderCallbacks.slice(0):[];if(!t.length)return;let n=!1;const r=e.provider,o=e.prefix;t.forEach(i=>{const s=i.icons,c=s.pending.length;s.pending=s.pending.filter(l=>{if(l.prefix!==o)return!0;const f=l.name;if(e.icons[f])s.loaded.push({provider:r,prefix:o,name:f});else if(e.missing.has(f))s.missing.push({provider:r,prefix:o,name:f});else return n=!0,!0;return!1}),s.pending.length!==c&&(n||Se([e],i.id),i.callback(s.loaded.slice(0),s.missing.slice(0),s.pending.slice(0),i.abort))})}))}let ft=0;function at(e,t,n){const r=ft++,o=Se.bind(null,n,r);if(!t.pending.length)return o;const i={id:r,icons:t,callback:e,abort:o};return n.forEach(s=>{(s.loaderCallbacks||(s.loaderCallbacks=[])).push(i)}),o}function ut(e,t=!0,n=!1){const r=[];return e.forEach(o=>{const i=typeof o=="string"?N(o,t,n):o;i&&r.push(i)}),r}var dt={resources:[],index:0,timeout:2e3,rotate:750,random:!1,dataAfterTimeout:!1};function ht(e,t,n,r){const o=e.resources.length,i=e.random?Math.floor(Math.random()*o):e.index;let s;if(e.random){let h=e.resources.slice(0);for(s=[];h.length>1;){const b=Math.floor(Math.random()*h.length);s.push(h[b]),h=h.slice(0,b).concat(h.slice(b+1))}s=s.concat(h)}else s=e.resources.slice(i).concat(e.resources.slice(0,i));const c=Date.now();let l="pending",f=0,a,d=null,p=[],m=[];typeof r=="function"&&m.push(r);function x(){d&&(clearTimeout(d),d=null)}function g(){l==="pending"&&(l="aborted"),x(),p.forEach(h=>{h.status==="pending"&&(h.status="aborted")}),p=[]}function u(h,b){b&&(m=[]),typeof h=="function"&&m.push(h)}function k(){return{startTime:c,payload:t,status:l,queriesSent:f,queriesPending:p.length,subscribe:u,abort:g}}function I(){l="failed",m.forEach(h=>{h(void 0,a)})}function w(){p.forEach(h=>{h.status==="pending"&&(h.status="aborted")}),p=[]}function y(h,b,T){const O=b!=="success";switch(p=p.filter(S=>S!==h),l){case"pending":break;case"failed":if(O||!e.dataAfterTimeout)return;break;default:return}if(b==="abort"){a=T,I();return}if(O){a=T,p.length||(s.length?B():I());return}if(x(),w(),!e.random){const S=e.resources.indexOf(h.resource);S!==-1&&S!==e.index&&(e.index=S)}l="completed",m.forEach(S=>{S(T)})}function B(){if(l!=="pending")return;x();const h=s.shift();if(h===void 0){if(p.length){d=setTimeout(()=>{x(),l==="pending"&&(w(),I())},e.timeout);return}I();return}const b={status:"pending",resource:h,callback:(T,O)=>{y(b,T,O)}};p.push(b),f++,d=setTimeout(B,e.rotate),n(h,t,b.callback)}return setTimeout(B),k}function ve(e){const t={...dt,...e};let n=[];function r(){n=n.filter(c=>c().status==="pending")}function o(c,l,f){const a=ht(t,c,l,(d,p)=>{r(),f&&f(d,p)});return n.push(a),a}function i(c){return n.find(l=>c(l))||null}return{query:o,find:i,setIndex:c=>{t.index=c},getIndex:()=>t.index,cleanup:r}}function se(){}const V=Object.create(null);function pt(e){if(!V[e]){const t=Y(e);if(!t)return;const n=ve(t),r={config:t,redundancy:n};V[e]=r}return V[e]}function gt(e,t,n){let r,o;if(typeof e=="string"){const i=q(e);if(!i)return n(void 0,424),se;o=i.send;const s=pt(e);s&&(r=s.redundancy)}else{const i=W(e);if(i){r=ve(i);const s=e.resources?e.resources[0]:"",c=q(s);c&&(o=c.send)}}return!r||!o?(n(void 0,424),se):r.query(t,o,n)().abort}const ce="iconify2",M="iconify",Ce=M+"-count",le=M+"-version",ke=36e5,mt=168,yt=50;function H(e,t){try{return e.getItem(t)}catch{}}function Z(e,t,n){try{return e.setItem(t,n),!0}catch{}}function fe(e,t){try{e.removeItem(t)}catch{}}function U(e,t){return Z(e,Ce,t.toString())}function G(e){return parseInt(H(e,Ce))||0}const v={local:!0,session:!0},Te={local:new Set,session:new Set};let ee=!1;function bt(e){ee=e}let L=typeof window>"u"?{}:window;function je(e){const t=e+"Storage";try{if(L&&L[t]&&typeof L[t].length=="number")return L[t]}catch{}v[e]=!1}function Pe(e,t){const n=je(e);if(!n)return;const r=H(n,le);if(r!==ce){if(r){const c=G(n);for(let l=0;l<c;l++)fe(n,M+l.toString())}Z(n,le,ce),U(n,0);return}const o=Math.floor(Date.now()/ke)-mt,i=c=>{const l=M+c.toString(),f=H(n,l);if(typeof f=="string"){try{const a=JSON.parse(f);if(typeof a=="object"&&typeof a.cached=="number"&&a.cached>o&&typeof a.provider=="string"&&typeof a.data=="object"&&typeof a.data.prefix=="string"&&t(a,c))return!0}catch{}fe(n,l)}};let s=G(n);for(let c=s-1;c>=0;c--)i(c)||(c===s-1?(s--,U(n,s)):Te[e].add(c))}function Ee(){if(!ee){bt(!0);for(const e in v)Pe(e,t=>{const n=t.data,r=t.provider,o=n.prefix,i=C(r,o);if(!J(i,n).length)return!1;const s=n.lastModified||-1;return i.lastModifiedCached=i.lastModifiedCached?Math.min(i.lastModifiedCached,s):s,!0})}}function wt(e,t){const n=e.lastModifiedCached;if(n&&n>=t)return n===t;if(e.lastModifiedCached=t,n)for(const r in v)Pe(r,o=>{const i=o.data;return o.provider!==e.provider||i.prefix!==e.prefix||i.lastModified===t});return!0}function xt(e,t){ee||Ee();function n(r){let o;if(!v[r]||!(o=je(r)))return;const i=Te[r];let s;if(i.size)i.delete(s=Array.from(i).shift());else if(s=G(o),s>=yt||!U(o,s+1))return;const c={cached:Math.floor(Date.now()/ke),provider:e.provider,data:t};return Z(o,M+s.toString(),JSON.stringify(c))}t.lastModified&&!wt(e,t.lastModified)||Object.keys(t.icons).length&&(t.not_found&&(t=Object.assign({},t),delete t.not_found),n("local")||n("session"))}function ae(){}function It(e){e.iconsLoaderFlag||(e.iconsLoaderFlag=!0,setTimeout(()=>{e.iconsLoaderFlag=!1,lt(e)}))}function St(e,t){e.iconsToLoad?e.iconsToLoad=e.iconsToLoad.concat(t).sort():e.iconsToLoad=t,e.iconsQueueFlag||(e.iconsQueueFlag=!0,setTimeout(()=>{e.iconsQueueFlag=!1;const{provider:n,prefix:r}=e,o=e.iconsToLoad;delete e.iconsToLoad;let i;if(!o||!(i=q(n)))return;i.prepare(n,r,o).forEach(c=>{gt(n,c,l=>{if(typeof l!="object")c.icons.forEach(f=>{e.missing.add(f)});else try{const f=J(e,l);if(!f.length)return;const a=e.pendingIcons;a&&f.forEach(d=>{a.delete(d)}),xt(e,l)}catch{}It(e)})})}))}const vt=(e,t)=>{const n=ut(e,!0,we()),r=ct(n);if(!r.pending.length){let l=!0;return t&&setTimeout(()=>{l&&t(r.loaded,r.missing,r.pending,ae)}),()=>{l=!1}}const o=Object.create(null),i=[];let s,c;return r.pending.forEach(l=>{const{provider:f,prefix:a}=l;if(a===c&&f===s)return;s=f,c=a,i.push(C(f,a));const d=o[f]||(o[f]=Object.create(null));d[a]||(d[a]=[])}),r.pending.forEach(l=>{const{provider:f,prefix:a,name:d}=l,p=C(f,a),m=p.pendingIcons||(p.pendingIcons=new Set);m.has(d)||(m.add(d),o[f][a].push(d))}),i.forEach(l=>{const{provider:f,prefix:a}=l;o[f][a].length&&St(l,o[f][a])}),t?at(t,r,i):ae};function Ct(e,t){switch(e){case"local":case"session":v[e]=t;break;case"all":for(const n in v)v[n]=t;break}}function kt(e,t){const n={...e};for(const r in t){const o=t[r],i=typeof o;r in xe?(o===null||o&&(i==="string"||i==="number"))&&(n[r]=o):i===typeof n[r]&&(n[r]=r==="rotate"?o%4:o)}return n}const Tt=/[\s,]+/;function jt(e,t){t.split(Tt).forEach(n=>{switch(n.trim()){case"horizontal":e.hFlip=!0;break;case"vertical":e.vFlip=!0;break}})}function Pt(e,t=0){const n=e.replace(/^-?[0-9.]*/,"");function r(o){for(;o<0;)o+=4;return o%4}if(n===""){const o=parseInt(e);return isNaN(o)?0:r(o)}else if(n!==e){let o=0;switch(n){case"%":o=25;break;case"deg":o=90}if(o){let i=parseFloat(e.slice(0,e.length-n.length));return isNaN(i)?0:(i=i/o,i%1===0?r(i):0)}}return t}function Et(e,t){let n=e.indexOf("xlink:")===-1?"":' xmlns:xlink="http://www.w3.org/1999/xlink"';for(const r in t)n+=" "+r+'="'+t[r]+'"';return'<svg xmlns="http://www.w3.org/2000/svg"'+n+">"+e+"</svg>"}function Mt(e){return e.replace(/"/g,"'").replace(/%/g,"%25").replace(/#/g,"%23").replace(/</g,"%3C").replace(/>/g,"%3E").replace(/\s+/g," ")}function Ot(e){return"data:image/svg+xml,"+Mt(e)}function Lt(e){return'url("'+Ot(e)+'")'}const ue={...Ie,inline:!1},Ft={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink","aria-hidden":!0,role:"img"},At={display:"inline-block"},K={backgroundColor:"currentColor"},Me={backgroundColor:"transparent"},de={Image:"var(--svg)",Repeat:"no-repeat",Size:"100% 100%"},he={webkitMask:K,mask:K,background:Me};for(const e in he){const t=he[e];for(const n in de)t[e+n]=de[n]}const _={};["horizontal","vertical"].forEach(e=>{const t=e.slice(0,1)+"Flip";_[e+"-flip"]=t,_[e.slice(0,1)+"-flip"]=t,_[e+"Flip"]=t});function pe(e){return e+(e.match(/^[-0-9.]+$/)?"px":"")}const ge=(e,t)=>{const n=kt(ue,t),r={...Ft},o=t.mode||"svg",i={},s=t.style,c=typeof s=="object"&&!(s instanceof Array)?s:{};for(let g in t){const u=t[g];if(u!==void 0)switch(g){case"icon":case"style":case"onLoad":case"mode":break;case"inline":case"hFlip":case"vFlip":n[g]=u===!0||u==="true"||u===1;break;case"flip":typeof u=="string"&&jt(n,u);break;case"color":i.color=u;break;case"rotate":typeof u=="string"?n[g]=Pt(u):typeof u=="number"&&(n[g]=u);break;case"ariaHidden":case"aria-hidden":u!==!0&&u!=="true"&&delete r["aria-hidden"];break;default:{const k=_[g];k?(u===!0||u==="true"||u===1)&&(n[k]=!0):ue[g]===void 0&&(r[g]=u)}}}const l=Ge(e,n),f=l.attributes;if(n.inline&&(i.verticalAlign="-0.125em"),o==="svg"){r.style={...i,...c},Object.assign(r,f);let g=0,u=t.id;return typeof u=="string"&&(u=u.replace(/-/g,"_")),r.innerHTML=Xe(l.body,u?()=>u+"ID"+g++:"iconifyVue"),te("svg",r)}const{body:a,width:d,height:p}=e,m=o==="mask"||(o==="bg"?!1:a.indexOf("currentColor")!==-1),x=Et(a,{...f,width:d+"",height:p+""});return r.style={...i,"--svg":Lt(x),width:pe(f.width),height:pe(f.height),...At,...m?K:Me,...c},te("span",r)};function Nt(e){Ct(e,!1)}we(!0);Ye("",st);if(typeof document<"u"&&typeof window<"u"){Ee();const e=window;if(e.IconifyPreload!==void 0){const t=e.IconifyPreload,n="Invalid IconifyPreload syntax.";typeof t=="object"&&t!==null&&(t instanceof Array?t:[t]).forEach(r=>{try{typeof r!="object"||r===null||r instanceof Array||typeof r.icons!="object"||typeof r.prefix!="string"||ze(r)}catch{}})}if(e.IconifyProviders!==void 0){const t=e.IconifyProviders;if(typeof t=="object"&&t!==null)for(let n in t){const r="IconifyProviders["+n+"] is invalid.";try{const o=t[n];if(typeof o!="object"||!o||o.resources===void 0)continue;Ze(n,o)}catch{}}}}const _t={...R,body:""},Rt=Oe({inheritAttrs:!1,data(){return{_name:"",_loadingIcon:null,iconMounted:!1,counter:0}},mounted(){this.iconMounted=!0},unmounted(){this.abortLoading()},methods:{abortLoading(){this._loadingIcon&&(this._loadingIcon.abort(),this._loadingIcon=null)},getIcon(e,t){if(typeof e=="object"&&e!==null&&typeof e.body=="string")return this._name="",this.abortLoading(),{data:e};let n;if(typeof e!="string"||(n=N(e,!1,!0))===null)return this.abortLoading(),null;const r=Re(n);if(!r)return(!this._loadingIcon||this._loadingIcon.name!==e)&&(this.abortLoading(),this._name="",r!==null&&(this._loadingIcon={name:e,abort:vt([n],()=>{this.counter++})})),null;this.abortLoading(),this._name!==e&&(this._name=e,t&&t(e));const o=["iconify"];return n.prefix!==""&&o.push("iconify--"+n.prefix),n.provider!==""&&o.push("iconify--"+n.provider),{data:r,classes:o}}},render(){this.counter;const e=this.$attrs,t=this.iconMounted||e.ssr?this.getIcon(e.icon,e.onLoad):null;if(!t)return ge(_t,e);let n=e;return t.classes&&(n={...e,class:(typeof e.class=="string"?e.class+" ":"")+t.classes.join(" ")}),ge({...R,...t.data},n)}});export{Rt as I,Ze as a,ze as b,Nt as d};