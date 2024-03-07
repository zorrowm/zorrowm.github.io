import{r as pe}from"./ant-design-vue-exp.fcd30b7a.js";import{d as de,l as K,M as ye,N as ce,Q as N,q as H,a7 as te,ab as se,f as me,V as ne}from"./@vue-exp.a4e706db.js";import{M as Q,h as $e,j as ge}from"./xframelib-exp.f18cc8b7.js";import{_ as be}from"./index.3a936ba0.js";import"./vendor.d3cc975b.js";import"./lodash-es-exp.01017e5f.js";import"./axios-exp.e066e043.js";import"./@hprose-exp.37e63ca6.js";const he=de({name:"",props:{},components:{},setup(M,{attrs:v,slots:ie,emit:re}){const J=K(),_=K(),V=K("Global.Config.ServiceURL.DefaultWebAPI"),w=new Map;let k=!0;async function oe(){if(!V.value){Q.Message?.warn("API\u8DEF\u5F84\u914D\u7F6E\u4E0D\u80FD\u4E3A\u7A7A");return}let r;if(J.value)r=JSON.parse(J.value);else{if(!_.value){Q.Message?.warn("\u7A7A\u8FDE\u63A5\uFF0C\u65E0\u6CD5\u5F00\u59CB\u4E0B\u8F7D");return}const y=await $e("",_.value);if(!y){Q.Message?.warn("\u65E0\u6CD5\u83B7\u53D6Swagger Json\u6570\u636E\uFF01");return}r=y.data}if(!r){Q.Message?.warn("Swagger Json\u4E3A\u7A7A\u5BF9\u8C61\uFF0C\u65E0\u6CD5\u8F93\u51FA\uFF01");return}w.clear();const e=r.info.title??"WebAPI";(!V.value||V.value.length===0)&&(V.value="Global.Config.ServiceURL.DefaultWebAPI"),k=ue();let l="";k&&(l=",ResponseType");let m=`	import{Global,requestGet,requestPost,requestPostBody${l}} from 'xframelib'
`;m+=`	const baseURL:string= ${V.value}!;
`;let s=`	const APIKey={
	`,p="";const o=r.paths;for(let y in o){const f=o[y],g=y.indexOf("{"),T=f.get,t=f.post,q=!!T;if(g>=0){const S=y.substring(0,g-1),a=S.lastIndexOf("/");let i=S.substring(a+1);i||(i="get");let R=Y(i);s+=`${R}:'${y}',
	`,q?p+=ae(R,T):p+=le(R,t)}else{const S=y.lastIndexOf("/"),a=y.substring(S+1),i=Y(a);s+=`${i}:'${y}',
	`,T?p+=Z(i,T):t&&(p+=Z(i,t,!1))}}s+=`}
`;let b=r.components?.schemas;b||(b=r.definitions);const n=fe(b),h=m+p+s+n;ge(h,e+".ts")}function Y(r){let e=r;if(!w.has(r))w.set(r,0);else{let l=w.get(r);l!=null&&(l++,e+=l,w.set(r,l))}return e}function c(r){let e="any";switch(r){case"string":e="string";break;case"number":e="number";break;case"integer":e="number";break;case"boolean":e="boolean";break;case"array":e="[]";break;default:e="any";break}return e}function ae(r,e){let l="requestGet",m="	/**",s=`	export async function ${r}(`,p="";if(e){m+=`
	* ${e.summary}
`;let o="",b="any",n="",h="",y=0,f=0,g="";e.parameters&&e.parameters.forEach(i=>{m+=`	* @param ${i.name} ${i.description}
`;const R=i.schema;if(R?((R.nullable||!i.required)&&(o="?"),b=c(R.type)):(i.requied||(o="?"),b=c(i.type)),y>0&&(n=","),f>0&&(h=","),R?.items){const D=R.items.type;b=c(D)+b}s+=`${n}${i.name}${o}:${b}`,i.in==="query"?(g+=`${h}${i.name}`,f++):i.in==="path"&&(p+=`.replace('{${i.name}}',${i.name})`),y++});let T="";k&&(n===""&&y>0&&(n=","),s+=`${n}headers?:any,responseType:ResponseType ='json',timeoutMS?: number`,T=",headers,responseType,undefined,timeoutMS");let t="any",q=e.responses["200"]?.content,S;if(q?S=q["text/plain"].schema:S=e.responses["200"].schema,S){const i=S.$ref;if(i){const R=i.lastIndexOf("/");t=i.substring(R+1)}else t=z(S)}k?t==="string"?s+=`):Promise<{response:any,data:any|string}>{
`:s+=`):Promise<{response:any,data:${t}}>{
`:s+=`):Promise<${t}>{
`,m+=`	*/
`;let a=`		let realPath=APIKey.${r}${p}
`;return a+=`		const response=await ${l}(realPath, baseURL,`,g.length>0?a+=`{${g}}${T});
`:a+=`undefined${T});
`,k?t==="string"?a+=`		return {response,data:response?.data as any};
	}
`:a+=`		return {response,data:response?.data as ${t}};
	}
`:a+=`		return response?.data as ${t};
	}
`,s+=a,m+s}return""}function Z(r,e,l=!0){let m=l?"requestGet":"requestPost",s="	/**",p=`	export async function ${r}(`,o,b=-1;if(!l){if(e?.requestBody){const y=e.requestBody?.content;if(y){const f=y["application/json"];f&&(b=0);const g=f?.schema;if(g){const T=g.$ref;if(T){const t=T?.lastIndexOf("/");t&&t>0&&(o=T.substring(t+1))}else{const t=g.type;let q=c(t);if(t==="array"){const S=g.items;if(S.type)o=c(S.type)+q;else{const a=S.$ref;if(a){const i=a?.lastIndexOf("/");i&&i>0&&(o=a.substring(i+1),o=o+q)}}}else o=q}}}}b===0&&(m="requestPostBody")}let n=`		const response=await ${m}(APIKey.${r}, baseURL,`;if(e){s+=`
	* ${e.summary}
`;let y="",f="any",g="",T=0,t="",q="";e.parameters&&e.parameters.forEach(d=>{s+=`	* @param ${d.name} ${d.description}
`;const U=d.schema;U?((U.nullable||!d.required)&&(y="?"),f=c(U.type)):(d.requied||(y="?"),f=c(d.type)),T>0&&(g=","),p+=`${g}${d.name}${y}:${f}`,t+=`${g}${d.name}`,T++});let S="";if(!l){const d=e.requestBody?.content;if(d){const U=d["application/json"];if(U){b=0,S=e.requestBody.description;const j=U.schema;if(f=c(j.type),j.type==="array"){const u=j.items;if(u.type)o=c(u.type)+f;else{const $=u.$ref;if($){const x=$?.lastIndexOf("/");x&&x>0&&(o=$.substring(x+1),o=o+f)}}}else if(j.type==="object"){const u=j.additionalProperties;if(c(u.type),u.type==="array"){const $=u.items;if($.type)o=`{[props: string]: Array<${c($.type)}>}`;else{const x=$.$ref;if(x){const C=x?.lastIndexOf("/");if(C&&C>0){var h=x.substring(C+1);o=`{[props: string]: Array<${h}>}`}}}}}}else{const j=d["multipart/form-data"]?.schema;if(j?.type==="object"){b=1;const u=j.properties;if(u){let $=0,x="";const C=Object.keys(u),O=G(C);let L=-1;for(let B in u){if(L++,O[0]>-1){if(O[0]===L){s+=`	* @param file \u6587\u4EF6
`,f="File",T>0&&(g=","),p+=`${g}file?:File`,$>0&&(x=","),q+=`${x}file`;continue}if(O[1]>=L)continue}const A=u[B];if(s+=`	* @param ${B} ${A.description}
`,A.nullable&&(y="?"),f=c(A.type),f==="string"&&A.format==="binary"&&(f="File"),A.type==="object"){const I=A.additionalProperties;let F=c(I.type);if(I.type==="array"){const P=I.items;if(P.type)f=c(P.type)+F;else{const E=P.$ref;if(E){const W=E?.lastIndexOf("/");if(W&&W>0){var h=E.substring(W+1);o=`{[props: string]: Array<${h}>}`}}}}}else if(A.type==="array"){const I=A.items;if(I.type){let F=c(I.type);F==="string"&&I.format==="binary"&&(F="File"),f=F+f}else{const F=I.$ref;if(F){const P=F?.lastIndexOf("/");P&&P>0&&(o=F.substring(P+1),o=o+f)}}}T>0&&(g=","),p+=`${g}${B}${y}:${f}`,$>0&&(x=","),q+=`${x}${B}`,$++,T++}}}}}}if(o||f){if(o||(f=f),o){let d=o;f&&d==="any"&&(d=f),s+=`	* @param bodyParams ${o}  ${S}
`,p.endsWith("(")?p+=`bodyParams${y}:${d}`:p+=`,bodyParams${y}:${d}`}g=","}let a="";k&&(g===""&&T>0&&(g=","),p.endsWith("(")&&(g=""),p+=`${g}headers?:any,responseType:ResponseType='json',timeoutMS?:number`,l?a=",headers,responseType,undefined,timeoutMS":a=",headers,responseType,timeoutMS");let i="any",R=e.responses["200"]?.content,D;if(R?D=R["text/plain"].schema:D=e.responses["200"].schema,D){const d=D.$ref;if(d){const U=d.lastIndexOf("/");i=d.substring(U+1)}else i=z(D)}return k?i==="string"?p+=`):Promise<{response:any,data:any|string}>{
`:p+=`):Promise<{response:any,data:${i}}>{
`:p+=`):Promise<${i}>{
`,s+=`	*/
`,l?t.length>0?n+=`{${t}}${a});
`:n+=`undefined${a});
`:b!=-1?(b===0?n+="bodyParams":q.length>0?n+=`{${q}}`:n+="undefined",t.length>0?n+=`,{${t}}`:n+=",undefined",n+=`${a});
`):t.length>0?n+=`undefined,{${t}}${a});
`:n+=`undefined,undefined${a});
`,k?i==="string"?n+=`		return {response,data:response?.data as any};
	}
`:n+=`		return {response,data:response?.data as ${i}};
	}
`:n+=`		return response?.data as ${i};
	}
`,p+=n,s+p}return""}function le(r,e){let l="requestPost",m="	/**",s=`	export async function ${r}(`,p="";if(e){m+=`
	* ${e.summary}
`;let b="",n="any",h="",y="",f=0,g=0,T="";e.parameters&&e.parameters.forEach(u=>{m+=`	* @param ${u.name} ${u.description}
`;const $=u.schema;if($?(($.nullable||!u.required)&&(b="?"),n=c($.type)):(u.requied||(b="?"),n=c(u.type)),f>0&&(h=","),g>0&&(y=","),$?.items){const x=$.items.type;n=c(x)+n}s+=`${h}${u.name}${b}:${n}`,u.in==="query"?(T+=`${y}${u.name}`,g++):u.in==="path"&&(p+=`.replace('{${u.name}}',${u.name})`),f++});let t,q=-1,S="";if(e?.requestBody){const u=e.requestBody?.content;if(u){const $=u["application/json"];if($){S=e.requestBody.description,q=0;const x=$?.schema;if(x){const C=x.$ref;if(C){const O=C?.lastIndexOf("/");O&&O>0&&(t=C.substring(O+1))}else{const O=x.type;let L=c(O);if(O==="array"){const B=x.items;if(B.type)t=c(B.type)+L;else{const A=B.$ref;if(A){const I=A?.lastIndexOf("/");I&&I>0&&(t=A.substring(I+1),t=t+L)}}}else if(O==="object"){const B=x.additionalProperties;let A=c(B.type);if(B.type==="array"){const I=B.items;if(I.type)t=`{[props: string]: Array<${c(I.type)}>}`;else{const F=I.$ref;if(F){const P=F?.lastIndexOf("/");if(P&&P>0){var o=F.substring(P+1);t=`{[props: string]: Array<${o}>}`}}}}else t=`{[props: string]: ${A}}`}else t=L}}}}}q===0&&(l="requestPostBody");let a=`		let realPath=APIKey.${r}${p}
`;a+=`		const response=await ${l}(realPath, baseURL,`;let i="";const R=e.requestBody?.content;if(R){const u=R["multipart/form-data"]?.schema;if(u?.type==="object"){q=1;const $=u.properties;let x=0,C="";if($){const O=Object.keys($),L=G(O);let B=-1;for(let A in $){if(B++,L[0]>-1){if(L[0]===B){m+=`	* @param file \u6587\u4EF6
`,n="File",f>0&&(h=","),s+=`${h}file?:File`,x>0&&(C=","),i+=`${C}file`;continue}if(L[1]>=B)continue}const I=$[A];if(m+=`	* @param ${A} ${I.description}
`,I.nullable&&(b="?"),n=c(I.type),n==="string"&&I.format==="binary"&&(n="File"),I.type==="object"){const F=I.additionalProperties;let P=c(F.type);if(F.type==="array"){const E=F.items;if(E.type)n=c(E.type)+P;else{const W=E.$ref;if(W){const X=W?.lastIndexOf("/");X&&X>0&&(t=W.substring(X+1),t=t+P)}}}}else if(I.type==="array"){const F=I.items;if(F.type){let P=c(F.type);P==="string"&&F.format==="binary"&&(P="File"),n=P+n}else{const P=F.$ref;if(P){const E=P?.lastIndexOf("/");E&&E>0&&(t=P.substring(E+1),t=t+n)}}}f>0&&(h=","),s+=`${h}${A}${b}:${n}`,x>0&&(C=","),i+=`${C}${A}`,x++,f++}}}}(t||n)&&(t||(n=n),t&&(m+=`	* @param bodyParams ${t} ${S}
`,s.endsWith("(")?s+=`bodyParams${b}:${t}`:s+=`,bodyParams${b}:${t}`),h=",");let D="";k&&(h===""&&f>0&&(h=","),s.endsWith("(")&&(h=""),s+=`${h}headers?:any,responseType:ResponseType='json',timeoutMS?:number`,D=",headers,responseType,timeoutMS");let d="any",U=e.responses["200"]?.content,j;if(U?j=U["text/plain"].schema:j=e.responses["200"].schema,j){const u=j.$ref;if(u){const $=u.lastIndexOf("/");d=u.substring($+1)}else d=z(j)}return k?d==="string"?s+=`):Promise<{response:any,data:any|string}>{
`:s+=`):Promise<{response:any,data:${d}}>{
`:s+=`):Promise<${d}>{
`,m+=`	*/
`,q!=-1?(q===0?a+="bodyParams":i.length>0?a+=`{${i}}`:a+="undefined",T.length>0?a+=`,{${T}}`:a+=",undefined",a+=`${D});
`):T.length>0?a+=`undefined,{${T}}${D});
`:a+=`undefined,undefined${D});
`,k?d==="string"?a+=`		return {response,data:response?.data as any};
	}
`:a+=`		return {response,data:response?.data as ${d}};
	}
`:a+=`		return response?.data as ${d};
	}
`,s+=a,m+s}return""}function z(r){const e=r.type;let l=c(e);if(e==="array"){const m=r.items;if(m.type)l=c(m.type)+l;else{const s=m.$ref;if(s){const p=s?.lastIndexOf("/");p&&p>0&&(l=s.substring(p+1)+l)}}}return l}function fe(r){let e="";for(let l in r){const m=r[l];if(!m.properties)continue;let s="";m.description&&(s=`	/**
	* ${m.description}
	*/
`),s+=`	export interface ${l}{
`;for(let p in m.properties){const o=m.properties[p],b=o.nullable?"?":"";let n="any";if(o.type){if(n=c(o.type),o.items){const h=o.items.type;n=c(h)+n}}else{const h=o.$ref;if(h){const y=h.lastIndexOf("/");n=h.substring(y+1)}}s+=`		${p}${b}:${n},
`}s=s.substring(0,s.length-2)+`
	}
`,e+=s}return e}function G(r){if(Array.isArray(r)){const e=r.findIndex((l,m,s)=>l==="ContentType");if(e>-1){let l=e;if(r[++l]==="ContentDisposition"&&r[++l]==="Headers"&&r[++l]==="Length"&&r[++l]==="Name"&&r[++l]==="FileName")return[e,l]}}return[-1,-1]}const ee=K("old");function ue(){return ee.value==="new"}return{swaggerURL:_,apiURLPath:V,exportAPI:oe,checkRef:ee,jsonTextRef:J}}}),Te={style:{display:"flex","flex-direction":"column","align-items":"center"}},xe=N("h2",null,"\u83B7\u53D6Swagger API\u63A5\u53E3TS\u65B9\u6CD5",-1),Ie={style:{margin:"10px 0px"}},Fe=N("span",{style:{"margin-left":"10px"}},"Swagger Json URL\u8DEF\u5F84\uFF1A",-1),Pe=N("span",null,"SysConfig\u91CCAPI URL\u914D\u7F6E\uFF1A",-1),Se=ne(" \u65E7\u65B9\u5F0F\uFF0C\u8FD4\u56DEres.data "),Ae=ne(" \u65B0\u65B9\u5F0F\uFF0C\u8FD4\u56DEres ");function qe(M,v,ie,re,J,_){const V=pe;return ye(),ce("div",Te,[xe,N("div",Ie,[Fe,H(N("input",{type:"text",name:"firstname",style:{width:"500px"},placeholder:"\u4F8B\u5982\uFF1Ahttp://192.168.1.18:7001/swagger/v1/swagger.json","onUpdate:modelValue":v[0]||(v[0]=w=>M.swaggerURL=w)},null,512),[[te,M.swaggerURL]])]),N("div",null,[Pe,H(N("input",{type:"text",name:"firstname",style:{width:"500px"},"onUpdate:modelValue":v[1]||(v[1]=w=>M.apiURLPath=w)},null,512),[[te,M.apiURLPath]])]),N("div",null,[H(N("input",{type:"radio",name:"group",value:"old","onUpdate:modelValue":v[2]||(v[2]=w=>M.checkRef=w)},null,512),[[se,M.checkRef]]),Se,H(N("input",{type:"radio",name:"group",value:"new","onUpdate:modelValue":v[3]||(v[3]=w=>M.checkRef=w)},null,512),[[se,M.checkRef]]),Ae]),N("input",{type:"button",style:{"margin-top":"20px"},onClick:v[4]||(v[4]=(...w)=>M.exportAPI&&M.exportAPI(...w)),value:"\u4E0B\u8F7DAPI\u6587\u4EF6(.ts)"}),me(V,{value:M.jsonTextRef,"onUpdate:value":v[5]||(v[5]=w=>M.jsonTextRef=w),placeholder:"\u8F93\u5165Swagger Json\u5185\u5BB9",rows:13,allowClear:!0},null,8,["value"])])}var De=be(he,[["render",qe]]);export{De as default};
