import{r as ue}from"./ant-design-vue-exp.02cd2247.js";import{d as de,l as H,N as ye,O as ce,R as N,q as z,a6 as te,aa as se,W as ne,f as me}from"./@vue-exp.68261671.js";import{M as Q,h as $e,j as ge}from"./xframelib-exp.1d985117.js";import{_ as be}from"./index.97eef6e0.js";import"./vendor.4f9d2ea7.js";import"./lodash-es-exp.25ba1615.js";import"./axios-exp.844f7d48.js";import"./@hprose-exp.7cd60ff0.js";const xe=de({name:"",props:{},components:{},setup(v,{attrs:P,slots:ie,emit:re}){const V=H(),K=H(),W=H("Global.Config.ServiceURL.DefaultWebAPI"),R=new Map;let U=!0;async function oe(){if(!W.value){Q.Message?.warn("API\u8DEF\u5F84\u914D\u7F6E\u4E0D\u80FD\u4E3A\u7A7A");return}let a;if(V.value)a=JSON.parse(V.value);else{if(!K.value){Q.Message?.warn("\u7A7A\u8FDE\u63A5\uFF0C\u65E0\u6CD5\u5F00\u59CB\u4E0B\u8F7D");return}const p=await $e("",K.value);if(!p){Q.Message?.warn("\u65E0\u6CD5\u83B7\u53D6Swagger Json\u6570\u636E\uFF01");return}a=p.data}if(!a){Q.Message?.warn("Swagger Json\u4E3A\u7A7A\u5BF9\u8C61\uFF0C\u65E0\u6CD5\u8F93\u51FA\uFF01");return}R.clear();const e=a.info.title??"WebAPI";(!W.value||W.value.length===0)&&(W.value="Global.Config.ServiceURL.DefaultWebAPI"),U=pe();let d="";U&&(d=",ResponseType");let $=`	import{Global,requestGet,requestPost,requestPostBody${d}} from 'xframelib'
`;$+=`	const baseURL:string= ${W.value}!;
`;let n=`	const APIKey={
	`,y="";const r=a.paths;for(let p in r){const l=r[p],g=p.indexOf("{"),I=l.get,s=l.post,q=!!I;if(g>=0){const A=p.substring(0,g-1),f=A.lastIndexOf("/");let i=A.substring(f+1);i||(i="get");let O=Z(i);n+=`${O}:'${p}',
	`,q?y+=ae(O,I):y+=le(O,s)}else{const A=p.lastIndexOf("/"),f=p.substring(A+1),i=Z(f);n+=`${i}:'${p}',
	`,I?y+=G(i,I):s&&(y+=G(i,s,!1))}}n+=`}
`;let x=a.components?.schemas;x||(x=a.definitions);const t=fe(x),c=$+y+n+t;ge(c,e+".ts")}function Z(a){let e=a;if(!R.has(a))R.set(a,0);else{let d=R.get(a);d!=null&&(d++,e+=d,R.set(a,d))}return e}function m(a){let e="any";switch(a){case"string":e="string";break;case"number":e="number";break;case"integer":e="number";break;case"boolean":e="boolean";break;case"array":e="[]";break;default:e="any";break}return e}function ae(a,e){let d="requestGet",$="	/**",n=`	export async function ${a}(`,y="";if(e){$+=`
	* ${e.summary}
`;let r="",x="any",t="",c="",p=0,l=0,g="";e.parameters&&e.parameters.forEach(i=>{$+=`	* @param ${i.name} ${i.description}
`;const O=i.schema;if(O?((O.nullable||!i.required)&&(r="?"),x=m(O.type)):(i.requied||(r="?"),x=m(i.type)),p>0&&(t=","),l>0&&(c=","),O?.items){const M=O.items.type;x=m(M)+x}n+=`${t}${i.name}${r}:${x}`,i.in==="query"?(g+=`${c}${i.name}`,l++):i.in==="path"&&(y+=`.replace('{${i.name}}',${i.name})`),p++});let I="";U&&(t===""&&p>0&&(t=","),n+=`${t}headers?:any,responseType:ResponseType ='json',timeoutMS?: number`,I=",headers,responseType,undefined,timeoutMS");let s="any",q=e.responses["200"]?.content,A;if(!q)A=e.responses["200"].schema;else{let i=q["text/plain"];i?A=i.schema:(i=q["application/json"],i&&(A=i.schema))}if(A){const i=A.$ref;if(i){const O=i.lastIndexOf("/");s=i.substring(O+1)}else s=X(A)}U?s==="string"?n+=`):Promise<{response:any,data:any|string}>{
`:n+=`):Promise<{response:any,data:${s}}>{
`:n+=`):Promise<${s}>{
`,$+=`	*/
`;let f=`		let realPath=APIKey.${a}${y}
`;return f+=`		const response=await ${d}(realPath, baseURL,`,g.length>0?f+=`{${g}}${I});
`:f+=`undefined${I});
`,U?s==="string"?f+=`		return {response,data:response?.data as any};
	}
`:f+=`		return {response,data:response?.data as ${s}};
	}
`:f+=`		return response?.data as ${s};
	}
`,n+=f,$+n}return""}function G(a,e,d=!0){let $=d?"requestGet":"requestPost",n="	/**",y=`	export async function ${a}(`,r,x=-1;if(!d){if(e?.requestBody){const p=e.requestBody?.content;if(p){const l=p["application/json"];l&&(x=0);const g=l?.schema;if(g){const I=g.$ref;if(I){const s=I?.lastIndexOf("/");s&&s>0&&(r=I.substring(s+1))}else{const s=g.type;let q=m(s);if(s==="array"){const A=g.items;if(A.type)r=m(A.type)+q;else{const f=A.$ref;if(f){const i=f?.lastIndexOf("/");i&&i>0&&(r=f.substring(i+1),r=r+q)}}}else r=q}}}}x===0&&($="requestPostBody")}let t=`		const response=await ${$}(APIKey.${a}, baseURL,`;if(e){n+=`
	* ${e.summary}
`;let p="",l="any",g="",I=0,s="",q="";e.parameters&&e.parameters.forEach(u=>{n+=`	* @param ${u.name} ${u.description}
`;const E=u.schema;E?((E.nullable||!u.required)&&(p="?"),l=m(E.type)):(u.requied||(p="?"),l=m(u.type)),I>0&&(g=","),y+=`${g}${u.name}${p}:${l}`,s+=`${g}${u.name}`,I++});let A="";if(!d){const u=e.requestBody?.content;if(u){const E=u["application/json"];if(E){x=0,A=e.requestBody.description;const w=E.schema;if(l=m(w.type),w.type==="array"){const o=w.items;if(o.type)r=m(o.type)+l;else{const b=o.$ref;if(b){const T=b?.lastIndexOf("/");T&&T>0&&(r=b.substring(T+1),r=r+l)}}}else if(w.type==="object"){const o=w.additionalProperties||w.properties;if(m(o.type),o.type==="array"){const b=o.items;if(b.type)r=`{[props: string]: Array<${m(b.type)}>}`;else{const T=b.$ref;if(T){const C=T?.lastIndexOf("/");if(C&&C>0){var c=T.substring(C+1);r=`{[props: string]: Array<${c}>}`}}}}}}else{const w=u["multipart/form-data"]?.schema;if(w?.type==="object"){x=1;const o=w.properties;if(o){let b=0,T="";const C=Object.keys(o),D=_(C);let L=-1;for(let B in o){if(L++,D[0]>-1){if(D[0]===L){n+=`	* @param file \u6587\u4EF6
`,l="File",I>0&&(g=","),y+=`${g}file?:File`,b>0&&(T=","),q+=`${T}file`;continue}if(D[1]>=L)continue}const j=o[B];if(n+=`	* @param ${B} ${j.description}
`,j.nullable&&(p="?"),l=m(j.type),l==="string"&&j.format==="binary"&&(l="File"),j.type==="object"){const h=j.additionalProperties||j.properties;let F=m(h.type);if(h.type==="array"){const S=h.items;if(S.type)l=m(S.type)+F;else{const k=S.$ref;if(k){const J=k?.lastIndexOf("/");if(J&&J>0){var c=k.substring(J+1);r=`{[props: string]: Array<${c}>}`}}}}}else if(j.type==="array"){const h=j.items;if(h.type){let F=m(h.type);F==="string"&&h.format==="binary"&&(F="File"),l=F+l}else{const F=h.$ref;if(F){const S=F?.lastIndexOf("/");S&&S>0&&(r=F.substring(S+1),r=r+l)}}}I>0&&(g=","),y+=`${g}${B}${p}:${l}`,b>0&&(T=","),q+=`${T}${B}`,b++,I++}}}}}}if(r||l){if(r||(l=l),r){let u=r;l&&u==="any"&&(u=l),n+=`	* @param bodyParams ${r}  ${A}
`,y.endsWith("(")?y+=`bodyParams${p}:${u}`:y+=`,bodyParams${p}:${u}`}g=","}let f="";U&&(g===""&&I>0&&(g=","),y.endsWith("(")&&(g=""),y+=`${g}headers?:any,responseType:ResponseType='json',timeoutMS?:number`,d?f=",headers,responseType,undefined,timeoutMS":f=",headers,responseType,timeoutMS");let i="any",O=e.responses["200"]?.content,M;if(!O)M=e.responses["200"].schema;else{let u=O["text/plain"];u?M=u.schema:(u=O["application/json"],u&&(M=u.schema))}if(M){const u=M.$ref;if(u){const E=u.lastIndexOf("/");i=u.substring(E+1)}else i=X(M)}return U?i==="string"?y+=`):Promise<{response:any,data:any|string}>{
`:y+=`):Promise<{response:any,data:${i}}>{
`:y+=`):Promise<${i}>{
`,n+=`	*/
`,d?s.length>0?t+=`{${s}}${f});
`:t+=`undefined${f});
`:x!=-1?(x===0?t+="bodyParams":q.length>0?t+=`{${q}}`:t+="undefined",s.length>0?t+=`,{${s}}`:t+=",undefined",t+=`${f});
`):s.length>0?t+=`undefined,{${s}}${f});
`:t+=`undefined,undefined${f});
`,U?i==="string"?t+=`		return {response,data:response?.data as any};
	}
`:t+=`		return {response,data:response?.data as ${i}};
	}
`:t+=`		return response?.data as ${i};
	}
`,y+=t,n+y}return""}function le(a,e){let d="requestPost",$="	/**",n=`	export async function ${a}(`,y="";if(e){$+=`
	* ${e.summary}
`;let x="",t="any",c="",p="",l=0,g=0,I="";e.parameters&&e.parameters.forEach(o=>{$+=`	* @param ${o.name} ${o.description}
`;const b=o.schema;if(b?((b.nullable||!o.required)&&(x="?"),t=m(b.type)):(o.requied||(x="?"),t=m(o.type)),l>0&&(c=","),g>0&&(p=","),b?.items){const T=b.items.type;t=m(T)+t}n+=`${c}${o.name}${x}:${t}`,o.in==="query"?(I+=`${p}${o.name}`,g++):o.in==="path"&&(y+=`.replace('{${o.name}}',${o.name})`),l++});let s,q=-1,A="";if(e?.requestBody){const o=e.requestBody?.content;if(o){const b=o["application/json"];if(b){A=e.requestBody.description,q=0;const T=b?.schema;if(T){const C=T.$ref;if(C){const D=C?.lastIndexOf("/");D&&D>0&&(s=C.substring(D+1))}else{const D=T.type;let L=m(D);if(D==="array"){const B=T.items;if(B.type)s=m(B.type)+L;else{const j=B.$ref;if(j){const h=j?.lastIndexOf("/");h&&h>0&&(s=j.substring(h+1),s=s+L)}}}else if(D==="object"){const B=T.additionalProperties||T.properties;let j=m(B.type);if(B.type==="array"){const h=B.items;if(h.type)s=`{[props: string]: Array<${m(h.type)}>}`;else{const F=h.$ref;if(F){const S=F?.lastIndexOf("/");if(S&&S>0){var r=F.substring(S+1);s=`{[props: string]: Array<${r}>}`}}}}else s=`{[props: string]: ${j}}`}else s=L}}}}}q===0&&(d="requestPostBody");let f=`		let realPath=APIKey.${a}${y}
`;f+=`		const response=await ${d}(realPath, baseURL,`;let i="";const O=e.requestBody?.content;if(O){const o=O["multipart/form-data"]?.schema;if(o?.type==="object"){q=1;const b=o.properties;let T=0,C="";if(b){const D=Object.keys(b),L=_(D);let B=-1;for(let j in b){if(B++,L[0]>-1){if(L[0]===B){$+=`	* @param file \u6587\u4EF6
`,t="File",l>0&&(c=","),n+=`${c}file?:File`,T>0&&(C=","),i+=`${C}file`;continue}if(L[1]>=B)continue}const h=b[j];if($+=`	* @param ${j} ${h.description}
`,h.nullable&&(x="?"),t=m(h.type),t==="string"&&h.format==="binary"&&(t="File"),h.type==="object"){const F=h.additionalProperties||h.properties;let S=m(F.type);if(F.type==="array"){const k=F.items;if(k.type)t=m(k.type)+S;else{const J=k.$ref;if(J){const Y=J?.lastIndexOf("/");Y&&Y>0&&(s=J.substring(Y+1),s=s+S)}}}}else if(h.type==="array"){const F=h.items;if(F.type){let S=m(F.type);S==="string"&&F.format==="binary"&&(S="File"),t=S+t}else{const S=F.$ref;if(S){const k=S?.lastIndexOf("/");k&&k>0&&(s=S.substring(k+1),s=s+t)}}}l>0&&(c=","),n+=`${c}${j}${x}:${t}`,T>0&&(C=","),i+=`${C}${j}`,T++,l++}}}}(s||t)&&(s||(t=t),s&&($+=`	* @param bodyParams ${s} ${A}
`,n.endsWith("(")?n+=`bodyParams${x}:${s}`:n+=`,bodyParams${x}:${s}`),c=",");let M="";U&&(c===""&&l>0&&(c=","),n.endsWith("(")&&(c=""),n+=`${c}headers?:any,responseType:ResponseType='json',timeoutMS?:number`,M=",headers,responseType,timeoutMS");let u="any",E=e.responses["200"]?.content,w;if(!E)w=e.responses["200"].schema;else{let o=E["text/plain"];o?w=o.schema:(o=E["application/json"],o&&(w=o.schema))}if(w){const o=w.$ref;if(o){const b=o.lastIndexOf("/");u=o.substring(b+1)}else u=X(w)}return U?u==="string"?n+=`):Promise<{response:any,data:any|string}>{
`:n+=`):Promise<{response:any,data:${u}}>{
`:n+=`):Promise<${u}>{
`,$+=`	*/
`,q!=-1?(q===0?f+="bodyParams":i.length>0?f+=`{${i}}`:f+="undefined",I.length>0?f+=`,{${I}}`:f+=",undefined",f+=`${M});
`):I.length>0?f+=`undefined,{${I}}${M});
`:f+=`undefined,undefined${M});
`,U?u==="string"?f+=`		return {response,data:response?.data as any};
	}
`:f+=`		return {response,data:response?.data as ${u}};
	}
`:f+=`		return response?.data as ${u};
	}
`,n+=f,$+n}return""}function X(a){const e=a.type;let d=m(e);if(e==="array"){const $=a.items;if($.type)d=m($.type)+d;else{const n=$.$ref;if(n){const y=n?.lastIndexOf("/");y&&y>0&&(d=n.substring(y+1)+d)}}}return d}function fe(a){let e="";for(let d in a){const $=a[d];if(!$.properties)continue;let n="";$.description&&(n=`	/**
	* ${$.description}
	*/
`),n+=`	export interface ${d}{
`;for(let y in $.properties){const r=$.properties[y],x=r.nullable?"?":"";let t="any";if(r.type)if(t=m(r.type),r.items){const c=r.items.type;if(c)t=m(c)+t;else{const p=r.items.$ref;if(p){const l=p.lastIndexOf("/");t=p.substring(l+1)+t}}}else{let c=r.$ref;if(c){const p=c.lastIndexOf("/");t=c.substring(p+1)}}else{const c=r.$ref||r.additionalProperties?.$ref;if(c){const p=c.lastIndexOf("/");t=c.substring(p+1)}}n+=`		${y}${x}:${t},
`}n=n.substring(0,n.length-2)+`
	}
`,e+=n}return e}function _(a){if(Array.isArray(a)){const e=a.findIndex((d,$,n)=>d==="ContentType");if(e>-1){let d=e;if(a[++d]==="ContentDisposition"&&a[++d]==="Headers"&&a[++d]==="Length"&&a[++d]==="Name"&&a[++d]==="FileName")return[e,d]}}return[-1,-1]}const ee=H("old");function pe(){return ee.value==="new"}return{swaggerURL:K,apiURLPath:W,exportAPI:oe,checkRef:ee,jsonTextRef:V}}}),Te={style:{display:"flex","flex-direction":"column","align-items":"center"}},he={style:{margin:"10px 0px"}};function Ie(v,P,ie,re,V,K){const W=ue;return ye(),ce("div",Te,[P[10]||(P[10]=N("h2",null,"\u83B7\u53D6Swagger API\u63A5\u53E3TS\u65B9\u6CD5",-1)),N("div",he,[P[6]||(P[6]=N("span",{style:{"margin-left":"10px"}},"Swagger Json URL\u8DEF\u5F84\uFF1A",-1)),z(N("input",{type:"text",name:"firstname",style:{width:"500px"},placeholder:"\u4F8B\u5982\uFF1Ahttp://192.168.1.18:7001/swagger/v1/swagger.json","onUpdate:modelValue":P[0]||(P[0]=R=>v.swaggerURL=R)},null,512),[[te,v.swaggerURL]])]),N("div",null,[P[7]||(P[7]=N("span",null,"SysConfig\u91CCAPI URL\u914D\u7F6E\uFF1A",-1)),z(N("input",{type:"text",name:"firstname",style:{width:"500px"},"onUpdate:modelValue":P[1]||(P[1]=R=>v.apiURLPath=R)},null,512),[[te,v.apiURLPath]])]),N("div",null,[z(N("input",{type:"radio",name:"group",value:"old","onUpdate:modelValue":P[2]||(P[2]=R=>v.checkRef=R)},null,512),[[se,v.checkRef]]),P[8]||(P[8]=ne(" \u65E7\u65B9\u5F0F\uFF0C\u8FD4\u56DEres.data ",-1)),z(N("input",{type:"radio",name:"group",value:"new","onUpdate:modelValue":P[3]||(P[3]=R=>v.checkRef=R)},null,512),[[se,v.checkRef]]),P[9]||(P[9]=ne(" \u65B0\u65B9\u5F0F\uFF0C\u8FD4\u56DEres ",-1))]),N("input",{type:"button",style:{"margin-top":"20px"},onClick:P[4]||(P[4]=(...R)=>v.exportAPI&&v.exportAPI(...R)),value:"\u4E0B\u8F7DAPI\u6587\u4EF6(.ts)"}),me(W,{value:v.jsonTextRef,"onUpdate:value":P[5]||(P[5]=R=>v.jsonTextRef=R),placeholder:"\u8F93\u5165Swagger Json\u5185\u5BB9",rows:13,allowClear:!0},null,8,["value"])])}var we=be(xe,[["render",Ie]]);export{we as default};
