import{r as ue}from"./ant-design-vue-exp.fcd30b7a.js";import{d as de,l as K,M as ye,N as ce,Q as N,q as H,a7 as te,ab as se,f as me,V as ne}from"./@vue-exp.a4e706db.js";import{M as Q,h as $e,j as ge}from"./xframelib-exp.54ed976b.js";import{_ as be}from"./index.e6271ee2.js";import"./vendor.d3cc975b.js";import"./lodash-es-exp.01017e5f.js";import"./axios-exp.e066e043.js";import"./@hprose-exp.37e63ca6.js";const he=de({name:"",props:{},components:{},setup(M,{attrs:v,slots:ie,emit:re}){const J=K(),_=K(),V=K("Global.Config.ServiceURL.DefaultWebAPI"),R=new Map;let U=!0;async function oe(){if(!V.value){Q.Message?.warn("API\u8DEF\u5F84\u914D\u7F6E\u4E0D\u80FD\u4E3A\u7A7A");return}let o;if(J.value)o=JSON.parse(J.value);else{if(!_.value){Q.Message?.warn("\u7A7A\u8FDE\u63A5\uFF0C\u65E0\u6CD5\u5F00\u59CB\u4E0B\u8F7D");return}const y=await $e("",_.value);if(!y){Q.Message?.warn("\u65E0\u6CD5\u83B7\u53D6Swagger Json\u6570\u636E\uFF01");return}o=y.data}if(!o){Q.Message?.warn("Swagger Json\u4E3A\u7A7A\u5BF9\u8C61\uFF0C\u65E0\u6CD5\u8F93\u51FA\uFF01");return}R.clear();const e=o.info.title??"WebAPI";(!V.value||V.value.length===0)&&(V.value="Global.Config.ServiceURL.DefaultWebAPI"),U=pe();let p="";U&&(p=",ResponseType");let m=`	import{Global,requestGet,requestPost,requestPostBody${p}} from 'xframelib'
`;m+=`	const baseURL:string= ${V.value}!;
`;let s=`	const APIKey={
	`,d="";const a=o.paths;for(let y in a){const u=a[y],g=y.indexOf("{"),I=u.get,t=u.post,q=!!I;if(g>=0){const S=y.substring(0,g-1),l=S.lastIndexOf("/");let n=S.substring(l+1);n||(n="get");let j=Y(n);s+=`${j}:'${y}',
	`,q?d+=ae(j,I):d+=le(j,t)}else{const S=y.lastIndexOf("/"),l=y.substring(S+1),n=Y(l);s+=`${n}:'${y}',
	`,I?d+=Z(n,I):t&&(d+=Z(n,t,!1))}}s+=`}
`;let b=o.components?.schemas;b||(b=o.definitions);const i=fe(b),h=m+d+s+i;ge(h,e+".ts")}function Y(o){let e=o;if(!R.has(o))R.set(o,0);else{let p=R.get(o);p!=null&&(p++,e+=p,R.set(o,p))}return e}function c(o){let e="any";switch(o){case"string":e="string";break;case"number":e="number";break;case"integer":e="number";break;case"boolean":e="boolean";break;case"array":e="[]";break;default:e="any";break}return e}function ae(o,e){let p="requestGet",m="	/**",s=`	export async function ${o}(`,d="";if(e){m+=`
	* ${e.summary}
`;let a="",b="any",i="",h="",y=0,u=0,g="";e.parameters&&e.parameters.forEach(n=>{m+=`	* @param ${n.name} ${n.description}
`;const j=n.schema;if(j?((j.nullable||!n.required)&&(a="?"),b=c(j.type)):(n.requied||(a="?"),b=c(n.type)),y>0&&(i=","),u>0&&(h=","),j?.items){const O=j.items.type;b=c(O)+b}s+=`${i}${n.name}${a}:${b}`,n.in==="query"?(g+=`${h}${n.name}`,u++):n.in==="path"&&(d+=`.replace('{${n.name}}',${n.name})`),y++});let I="";U&&(i===""&&y>0&&(i=","),s+=`${i}headers?:any,responseType:ResponseType ='json',timeoutMS?: number`,I=",headers,responseType,undefined,timeoutMS");let t="any",q=e.responses["200"]?.content,S;if(!q)S=e.responses["200"]?.schema;else{let n=q["text/plain"];n?S=n.schema:(n=q["application/json"],n&&(S=n.schema))}if(S){const n=S.$ref;if(n){const j=n.lastIndexOf("/");t=n.substring(j+1)}else t=z(S)}U?t==="string"?s+=`):Promise<{response:any,data:any|string}>{
`:s+=`):Promise<{response:any,data:${t}}>{
`:s+=`):Promise<${t}>{
`,m+=`	*/
`;let l=`		let realPath=APIKey.${o}${d}
`;return l+=`		const response=await ${p}(realPath, baseURL,`,g.length>0?l+=`{${g}}${I});
`:l+=`undefined${I});
`,U?t==="string"?l+=`		return {response,data:response?.data as any};
	}
`:l+=`		return {response,data:response?.data as ${t}};
	}
`:l+=`		return response?.data as ${t};
	}
`,s+=l,m+s}return""}function Z(o,e,p=!0){let m=p?"requestGet":"requestPost",s="	/**",d=`	export async function ${o}(`,a,b=-1;if(!p){if(e?.requestBody){const y=e.requestBody?.content;if(y){const u=y["application/json"];u&&(b=0);const g=u?.schema;if(g){const I=g.$ref;if(I){const t=I?.lastIndexOf("/");t&&t>0&&(a=I.substring(t+1))}else{const t=g.type;let q=c(t);if(t==="array"){const S=g.items;if(S.type)a=c(S.type)+q;else{const l=S.$ref;if(l){const n=l?.lastIndexOf("/");n&&n>0&&(a=l.substring(n+1),a=a+q)}}}else a=q}}}}b===0&&(m="requestPostBody")}let i=`		const response=await ${m}(APIKey.${o}, baseURL,`;if(e){s+=`
	* ${e.summary}
`;let y="",u="any",g="",I=0,t="",q="";e.parameters&&e.parameters.forEach(f=>{s+=`	* @param ${f.name} ${f.description}
`;const E=f.schema;E?((E.nullable||!f.required)&&(y="?"),u=c(E.type)):(f.requied||(y="?"),u=c(f.type)),I>0&&(g=","),d+=`${g}${f.name}${y}:${u}`,t+=`${g}${f.name}`,I++});let S="";if(!p){const f=e.requestBody?.content;if(f){const E=f["application/json"];if(E){b=0,S=e.requestBody.description;const w=E.schema;if(u=c(w.type),w.type==="array"){const r=w.items;if(r.type)a=c(r.type)+u;else{const $=r.$ref;if($){const T=$?.lastIndexOf("/");T&&T>0&&(a=$.substring(T+1),a=a+u)}}}else if(w.type==="object"){const r=w.additionalProperties||w.properties;if(c(r.type),r.type==="array"){const $=r.items;if($.type)a=`{[props: string]: Array<${c($.type)}>}`;else{const T=$.$ref;if(T){const C=T?.lastIndexOf("/");if(C&&C>0){var h=T.substring(C+1);a=`{[props: string]: Array<${h}>}`}}}}}}else{const w=f["multipart/form-data"]?.schema;if(w?.type==="object"){b=1;const r=w.properties;if(r){let $=0,T="";const C=Object.keys(r),D=G(C);let L=-1;for(let B in r){if(L++,D[0]>-1){if(D[0]===L){s+=`	* @param file \u6587\u4EF6
`,u="File",I>0&&(g=","),d+=`${g}file?:File`,$>0&&(T=","),q+=`${T}file`;continue}if(D[1]>=L)continue}const A=r[B];if(s+=`	* @param ${B} ${A.description}
`,A.nullable&&(y="?"),u=c(A.type),u==="string"&&A.format==="binary"&&(u="File"),A.type==="object"){const x=A.additionalProperties||A.properties;let F=c(x.type);if(x.type==="array"){const P=x.items;if(P.type)u=c(P.type)+F;else{const k=P.$ref;if(k){const W=k?.lastIndexOf("/");if(W&&W>0){var h=k.substring(W+1);a=`{[props: string]: Array<${h}>}`}}}}}else if(A.type==="array"){const x=A.items;if(x.type){let F=c(x.type);F==="string"&&x.format==="binary"&&(F="File"),u=F+u}else{const F=x.$ref;if(F){const P=F?.lastIndexOf("/");P&&P>0&&(a=F.substring(P+1),a=a+u)}}}I>0&&(g=","),d+=`${g}${B}${y}:${u}`,$>0&&(T=","),q+=`${T}${B}`,$++,I++}}}}}}if(a||u){if(a||(u=u),a){let f=a;u&&f==="any"&&(f=u),s+=`	* @param bodyParams ${a}  ${S}
`,d.endsWith("(")?d+=`bodyParams${y}:${f}`:d+=`,bodyParams${y}:${f}`}g=","}let l="";U&&(g===""&&I>0&&(g=","),d.endsWith("(")&&(g=""),d+=`${g}headers?:any,responseType:ResponseType='json',timeoutMS?:number`,p?l=",headers,responseType,undefined,timeoutMS":l=",headers,responseType,timeoutMS");let n="any",j=e.responses["200"]?.content,O;if(!j)O=e.responses["200"]?.schema;else{let f=j["text/plain"];f?O=f.schema:(f=j["application/json"],f&&(O=f.schema))}if(O){const f=O.$ref;if(f){const E=f.lastIndexOf("/");n=f.substring(E+1)}else n=z(O)}return U?n==="string"?d+=`):Promise<{response:any,data:any|string}>{
`:d+=`):Promise<{response:any,data:${n}}>{
`:d+=`):Promise<${n}>{
`,s+=`	*/
`,p?t.length>0?i+=`{${t}}${l});
`:i+=`undefined${l});
`:b!=-1?(b===0?i+="bodyParams":q.length>0?i+=`{${q}}`:i+="undefined",t.length>0?i+=`,{${t}}`:i+=",undefined",i+=`${l});
`):t.length>0?i+=`undefined,{${t}}${l});
`:i+=`undefined,undefined${l});
`,U?n==="string"?i+=`		return {response,data:response?.data as any};
	}
`:i+=`		return {response,data:response?.data as ${n}};
	}
`:i+=`		return response?.data as ${n};
	}
`,d+=i,s+d}return""}function le(o,e){let p="requestPost",m="	/**",s=`	export async function ${o}(`,d="";if(e){m+=`
	* ${e.summary}
`;let b="",i="any",h="",y="",u=0,g=0,I="";e.parameters&&e.parameters.forEach(r=>{m+=`	* @param ${r.name} ${r.description}
`;const $=r.schema;if($?(($.nullable||!r.required)&&(b="?"),i=c($.type)):(r.requied||(b="?"),i=c(r.type)),u>0&&(h=","),g>0&&(y=","),$?.items){const T=$.items.type;i=c(T)+i}s+=`${h}${r.name}${b}:${i}`,r.in==="query"?(I+=`${y}${r.name}`,g++):r.in==="path"&&(d+=`.replace('{${r.name}}',${r.name})`),u++});let t,q=-1,S="";if(e?.requestBody){const r=e.requestBody?.content;if(r){const $=r["application/json"];if($){S=e.requestBody.description,q=0;const T=$?.schema;if(T){const C=T.$ref;if(C){const D=C?.lastIndexOf("/");D&&D>0&&(t=C.substring(D+1))}else{const D=T.type;let L=c(D);if(D==="array"){const B=T.items;if(B.type)t=c(B.type)+L;else{const A=B.$ref;if(A){const x=A?.lastIndexOf("/");x&&x>0&&(t=A.substring(x+1),t=t+L)}}}else if(D==="object"){const B=T.additionalProperties||T.properties;let A=c(B.type);if(B.type==="array"){const x=B.items;if(x.type)t=`{[props: string]: Array<${c(x.type)}>}`;else{const F=x.$ref;if(F){const P=F?.lastIndexOf("/");if(P&&P>0){var a=F.substring(P+1);t=`{[props: string]: Array<${a}>}`}}}}else t=`{[props: string]: ${A}}`}else t=L}}}}}q===0&&(p="requestPostBody");let l=`		let realPath=APIKey.${o}${d}
`;l+=`		const response=await ${p}(realPath, baseURL,`;let n="";const j=e.requestBody?.content;if(j){const r=j["multipart/form-data"]?.schema;if(r?.type==="object"){q=1;const $=r.properties;let T=0,C="";if($){const D=Object.keys($),L=G(D);let B=-1;for(let A in $){if(B++,L[0]>-1){if(L[0]===B){m+=`	* @param file \u6587\u4EF6
`,i="File",u>0&&(h=","),s+=`${h}file?:File`,T>0&&(C=","),n+=`${C}file`;continue}if(L[1]>=B)continue}const x=$[A];if(m+=`	* @param ${A} ${x.description}
`,x.nullable&&(b="?"),i=c(x.type),i==="string"&&x.format==="binary"&&(i="File"),x.type==="object"){const F=x.additionalProperties||x.properties;let P=c(F.type);if(F.type==="array"){const k=F.items;if(k.type)i=c(k.type)+P;else{const W=k.$ref;if(W){const X=W?.lastIndexOf("/");X&&X>0&&(t=W.substring(X+1),t=t+P)}}}}else if(x.type==="array"){const F=x.items;if(F.type){let P=c(F.type);P==="string"&&F.format==="binary"&&(P="File"),i=P+i}else{const P=F.$ref;if(P){const k=P?.lastIndexOf("/");k&&k>0&&(t=P.substring(k+1),t=t+i)}}}u>0&&(h=","),s+=`${h}${A}${b}:${i}`,T>0&&(C=","),n+=`${C}${A}`,T++,u++}}}}(t||i)&&(t||(i=i),t&&(m+=`	* @param bodyParams ${t} ${S}
`,s.endsWith("(")?s+=`bodyParams${b}:${t}`:s+=`,bodyParams${b}:${t}`),h=",");let O="";U&&(h===""&&u>0&&(h=","),s.endsWith("(")&&(h=""),s+=`${h}headers?:any,responseType:ResponseType='json',timeoutMS?:number`,O=",headers,responseType,timeoutMS");let f="any",E=e.responses["200"]?.content,w;if(!E)w=e.responses["200"]?.schema;else{let r=E["text/plain"];r?w=r.schema:(r=E["application/json"],r&&(w=r.schema))}if(w){const r=w.$ref;if(r){const $=r.lastIndexOf("/");f=r.substring($+1)}else f=z(w)}return U?f==="string"?s+=`):Promise<{response:any,data:any|string}>{
`:s+=`):Promise<{response:any,data:${f}}>{
`:s+=`):Promise<${f}>{
`,m+=`	*/
`,q!=-1?(q===0?l+="bodyParams":n.length>0?l+=`{${n}}`:l+="undefined",I.length>0?l+=`,{${I}}`:l+=",undefined",l+=`${O});
`):I.length>0?l+=`undefined,{${I}}${O});
`:l+=`undefined,undefined${O});
`,U?f==="string"?l+=`		return {response,data:response?.data as any};
	}
`:l+=`		return {response,data:response?.data as ${f}};
	}
`:l+=`		return response?.data as ${f};
	}
`,s+=l,m+s}return""}function z(o){const e=o.type;let p=c(e);if(e==="array"){const m=o.items;if(m.type)p=c(m.type)+p;else{const s=m.$ref;if(s){const d=s?.lastIndexOf("/");d&&d>0&&(p=s.substring(d+1)+p)}}}return p}function fe(o){let e="";for(let p in o){const m=o[p];if(!m.properties)continue;let s="";m.description&&(s=`	/**
	* ${m.description}
	*/
`),s+=`	export interface ${p}{
`;for(let d in m.properties){const a=m.properties[d],b=a.nullable?"?":"";let i="any";if(a.type){if(i=c(a.type),a.items){const h=a.items.type;i=c(h)+i}}else{const h=a.$ref;if(h){const y=h.lastIndexOf("/");i=h.substring(y+1)}}s+=`		${d}${b}:${i},
`}s=s.substring(0,s.length-2)+`
	}
`,e+=s}return e}function G(o){if(Array.isArray(o)){const e=o.findIndex((p,m,s)=>p==="ContentType");if(e>-1){let p=e;if(o[++p]==="ContentDisposition"&&o[++p]==="Headers"&&o[++p]==="Length"&&o[++p]==="Name"&&o[++p]==="FileName")return[e,p]}}return[-1,-1]}const ee=K("old");function pe(){return ee.value==="new"}return{swaggerURL:_,apiURLPath:V,exportAPI:oe,checkRef:ee,jsonTextRef:J}}}),Te={style:{display:"flex","flex-direction":"column","align-items":"center"}},xe=N("h2",null,"\u83B7\u53D6Swagger API\u63A5\u53E3TS\u65B9\u6CD5",-1),Ie={style:{margin:"10px 0px"}},Fe=N("span",{style:{"margin-left":"10px"}},"Swagger Json URL\u8DEF\u5F84\uFF1A",-1),Pe=N("span",null,"SysConfig\u91CCAPI URL\u914D\u7F6E\uFF1A",-1),Se=ne(" \u65E7\u65B9\u5F0F\uFF0C\u8FD4\u56DEres.data "),Ae=ne(" \u65B0\u65B9\u5F0F\uFF0C\u8FD4\u56DEres ");function qe(M,v,ie,re,J,_){const V=ue;return ye(),ce("div",Te,[xe,N("div",Ie,[Fe,H(N("input",{type:"text",name:"firstname",style:{width:"500px"},placeholder:"\u4F8B\u5982\uFF1Ahttp://192.168.1.18:7001/swagger/v1/swagger.json","onUpdate:modelValue":v[0]||(v[0]=R=>M.swaggerURL=R)},null,512),[[te,M.swaggerURL]])]),N("div",null,[Pe,H(N("input",{type:"text",name:"firstname",style:{width:"500px"},"onUpdate:modelValue":v[1]||(v[1]=R=>M.apiURLPath=R)},null,512),[[te,M.apiURLPath]])]),N("div",null,[H(N("input",{type:"radio",name:"group",value:"old","onUpdate:modelValue":v[2]||(v[2]=R=>M.checkRef=R)},null,512),[[se,M.checkRef]]),Se,H(N("input",{type:"radio",name:"group",value:"new","onUpdate:modelValue":v[3]||(v[3]=R=>M.checkRef=R)},null,512),[[se,M.checkRef]]),Ae]),N("input",{type:"button",style:{"margin-top":"20px"},onClick:v[4]||(v[4]=(...R)=>M.exportAPI&&M.exportAPI(...R)),value:"\u4E0B\u8F7DAPI\u6587\u4EF6(.ts)"}),me(V,{value:M.jsonTextRef,"onUpdate:value":v[5]||(v[5]=R=>M.jsonTextRef=R),placeholder:"\u8F93\u5165Swagger Json\u5185\u5BB9",rows:13,allowClear:!0},null,8,["value"])])}var De=be(he,[["render",qe]]);export{De as default};
