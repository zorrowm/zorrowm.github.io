import{r as ue}from"./ant-design-vue-exp.440801d1.js";import{d as de,l as K,M as ye,N as ce,Q as N,q as H,a7 as te,ab as se,f as me,V as ne}from"./@vue-exp.a4e706db.js";import{M as Q,h as $e,j as ge}from"./xframelib-exp.54ed976b.js";import{_ as be}from"./index.ce64818b.js";import"./vendor.d3cc975b.js";import"./lodash-es-exp.01017e5f.js";import"./axios-exp.e066e043.js";import"./@hprose-exp.37e63ca6.js";const he=de({name:"",props:{},components:{},setup(C,{attrs:M,slots:ie,emit:re}){const J=K(),_=K(),V=K("Global.Config.ServiceURL.DefaultWebAPI"),O=new Map;let U=!0;async function oe(){if(!V.value){Q.Message?.warn("API\u8DEF\u5F84\u914D\u7F6E\u4E0D\u80FD\u4E3A\u7A7A");return}let a;if(J.value)a=JSON.parse(J.value);else{if(!_.value){Q.Message?.warn("\u7A7A\u8FDE\u63A5\uFF0C\u65E0\u6CD5\u5F00\u59CB\u4E0B\u8F7D");return}const p=await $e("",_.value);if(!p){Q.Message?.warn("\u65E0\u6CD5\u83B7\u53D6Swagger Json\u6570\u636E\uFF01");return}a=p.data}if(!a){Q.Message?.warn("Swagger Json\u4E3A\u7A7A\u5BF9\u8C61\uFF0C\u65E0\u6CD5\u8F93\u51FA\uFF01");return}O.clear();const e=a.info.title??"WebAPI";(!V.value||V.value.length===0)&&(V.value="Global.Config.ServiceURL.DefaultWebAPI"),U=pe();let d="";U&&(d=",ResponseType");let $=`	import{Global,requestGet,requestPost,requestPostBody${d}} from 'xframelib'
`;$+=`	const baseURL:string= ${V.value}!;
`;let n=`	const APIKey={
	`,y="";const r=a.paths;for(let p in r){const l=r[p],g=p.indexOf("{"),I=l.get,s=l.post,j=!!I;if(g>=0){const S=p.substring(0,g-1),f=S.lastIndexOf("/");let i=S.substring(f+1);i||(i="get");let q=Y(i);n+=`${q}:'${p}',
	`,j?y+=ae(q,I):y+=le(q,s)}else{const S=p.lastIndexOf("/"),f=p.substring(S+1),i=Y(f);n+=`${i}:'${p}',
	`,I?y+=Z(i,I):s&&(y+=Z(i,s,!1))}}n+=`}
`;let h=a.components?.schemas;h||(h=a.definitions);const t=fe(h),c=$+y+n+t;ge(c,e+".ts")}function Y(a){let e=a;if(!O.has(a))O.set(a,0);else{let d=O.get(a);d!=null&&(d++,e+=d,O.set(a,d))}return e}function m(a){let e="any";switch(a){case"string":e="string";break;case"number":e="number";break;case"integer":e="number";break;case"boolean":e="boolean";break;case"array":e="[]";break;default:e="any";break}return e}function ae(a,e){let d="requestGet",$="	/**",n=`	export async function ${a}(`,y="";if(e){$+=`
	* ${e.summary}
`;let r="",h="any",t="",c="",p=0,l=0,g="";e.parameters&&e.parameters.forEach(i=>{$+=`	* @param ${i.name} ${i.description}
`;const q=i.schema;if(q?((q.nullable||!i.required)&&(r="?"),h=m(q.type)):(i.requied||(r="?"),h=m(i.type)),p>0&&(t=","),l>0&&(c=","),q?.items){const v=q.items.type;h=m(v)+h}n+=`${t}${i.name}${r}:${h}`,i.in==="query"?(g+=`${c}${i.name}`,l++):i.in==="path"&&(y+=`.replace('{${i.name}}',${i.name})`),p++});let I="";U&&(t===""&&p>0&&(t=","),n+=`${t}headers?:any,responseType:ResponseType ='json',timeoutMS?: number`,I=",headers,responseType,undefined,timeoutMS");let s="any",j=e.responses["200"]?.content,S;if(!j)S=e.responses["200"].schema;else{let i=j["text/plain"];i?S=i.schema:(i=j["application/json"],i&&(S=i.schema))}if(S){const i=S.$ref;if(i){const q=i.lastIndexOf("/");s=i.substring(q+1)}else s=z(S)}U?s==="string"?n+=`):Promise<{response:any,data:any|string}>{
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
`,n+=f,$+n}return""}function Z(a,e,d=!0){let $=d?"requestGet":"requestPost",n="	/**",y=`	export async function ${a}(`,r,h=-1;if(!d){if(e?.requestBody){const p=e.requestBody?.content;if(p){const l=p["application/json"];l&&(h=0);const g=l?.schema;if(g){const I=g.$ref;if(I){const s=I?.lastIndexOf("/");s&&s>0&&(r=I.substring(s+1))}else{const s=g.type;let j=m(s);if(s==="array"){const S=g.items;if(S.type)r=m(S.type)+j;else{const f=S.$ref;if(f){const i=f?.lastIndexOf("/");i&&i>0&&(r=f.substring(i+1),r=r+j)}}}else r=j}}}}h===0&&($="requestPostBody")}let t=`		const response=await ${$}(APIKey.${a}, baseURL,`;if(e){n+=`
	* ${e.summary}
`;let p="",l="any",g="",I=0,s="",j="";e.parameters&&e.parameters.forEach(u=>{n+=`	* @param ${u.name} ${u.description}
`;const E=u.schema;E?((E.nullable||!u.required)&&(p="?"),l=m(E.type)):(u.requied||(p="?"),l=m(u.type)),I>0&&(g=","),y+=`${g}${u.name}${p}:${l}`,s+=`${g}${u.name}`,I++});let S="";if(!d){const u=e.requestBody?.content;if(u){const E=u["application/json"];if(E){h=0,S=e.requestBody.description;const R=E.schema;if(l=m(R.type),R.type==="array"){const o=R.items;if(o.type)r=m(o.type)+l;else{const b=o.$ref;if(b){const x=b?.lastIndexOf("/");x&&x>0&&(r=b.substring(x+1),r=r+l)}}}else if(R.type==="object"){const o=R.additionalProperties||R.properties;if(m(o.type),o.type==="array"){const b=o.items;if(b.type)r=`{[props: string]: Array<${m(b.type)}>}`;else{const x=b.$ref;if(x){const B=x?.lastIndexOf("/");if(B&&B>0){var c=x.substring(B+1);r=`{[props: string]: Array<${c}>}`}}}}}}else{const R=u["multipart/form-data"]?.schema;if(R?.type==="object"){h=1;const o=R.properties;if(o){let b=0,x="";const B=Object.keys(o),D=G(B);let L=-1;for(let w in o){if(L++,D[0]>-1){if(D[0]===L){n+=`	* @param file \u6587\u4EF6
`,l="File",I>0&&(g=","),y+=`${g}file?:File`,b>0&&(x=","),j+=`${x}file`;continue}if(D[1]>=L)continue}const A=o[w];if(n+=`	* @param ${w} ${A.description}
`,A.nullable&&(p="?"),l=m(A.type),l==="string"&&A.format==="binary"&&(l="File"),A.type==="object"){const T=A.additionalProperties||A.properties;let P=m(T.type);if(T.type==="array"){const F=T.items;if(F.type)l=m(F.type)+P;else{const k=F.$ref;if(k){const W=k?.lastIndexOf("/");if(W&&W>0){var c=k.substring(W+1);r=`{[props: string]: Array<${c}>}`}}}}}else if(A.type==="array"){const T=A.items;if(T.type){let P=m(T.type);P==="string"&&T.format==="binary"&&(P="File"),l=P+l}else{const P=T.$ref;if(P){const F=P?.lastIndexOf("/");F&&F>0&&(r=P.substring(F+1),r=r+l)}}}I>0&&(g=","),y+=`${g}${w}${p}:${l}`,b>0&&(x=","),j+=`${x}${w}`,b++,I++}}}}}}if(r||l){if(r||(l=l),r){let u=r;l&&u==="any"&&(u=l),n+=`	* @param bodyParams ${r}  ${S}
`,y.endsWith("(")?y+=`bodyParams${p}:${u}`:y+=`,bodyParams${p}:${u}`}g=","}let f="";U&&(g===""&&I>0&&(g=","),y.endsWith("(")&&(g=""),y+=`${g}headers?:any,responseType:ResponseType='json',timeoutMS?:number`,d?f=",headers,responseType,undefined,timeoutMS":f=",headers,responseType,timeoutMS");let i="any",q=e.responses["200"]?.content,v;if(!q)v=e.responses["200"].schema;else{let u=q["text/plain"];u?v=u.schema:(u=q["application/json"],u&&(v=u.schema))}if(v){const u=v.$ref;if(u){const E=u.lastIndexOf("/");i=u.substring(E+1)}else i=z(v)}return U?i==="string"?y+=`):Promise<{response:any,data:any|string}>{
`:y+=`):Promise<{response:any,data:${i}}>{
`:y+=`):Promise<${i}>{
`,n+=`	*/
`,d?s.length>0?t+=`{${s}}${f});
`:t+=`undefined${f});
`:h!=-1?(h===0?t+="bodyParams":j.length>0?t+=`{${j}}`:t+="undefined",s.length>0?t+=`,{${s}}`:t+=",undefined",t+=`${f});
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
`;let h="",t="any",c="",p="",l=0,g=0,I="";e.parameters&&e.parameters.forEach(o=>{$+=`	* @param ${o.name} ${o.description}
`;const b=o.schema;if(b?((b.nullable||!o.required)&&(h="?"),t=m(b.type)):(o.requied||(h="?"),t=m(o.type)),l>0&&(c=","),g>0&&(p=","),b?.items){const x=b.items.type;t=m(x)+t}n+=`${c}${o.name}${h}:${t}`,o.in==="query"?(I+=`${p}${o.name}`,g++):o.in==="path"&&(y+=`.replace('{${o.name}}',${o.name})`),l++});let s,j=-1,S="";if(e?.requestBody){const o=e.requestBody?.content;if(o){const b=o["application/json"];if(b){S=e.requestBody.description,j=0;const x=b?.schema;if(x){const B=x.$ref;if(B){const D=B?.lastIndexOf("/");D&&D>0&&(s=B.substring(D+1))}else{const D=x.type;let L=m(D);if(D==="array"){const w=x.items;if(w.type)s=m(w.type)+L;else{const A=w.$ref;if(A){const T=A?.lastIndexOf("/");T&&T>0&&(s=A.substring(T+1),s=s+L)}}}else if(D==="object"){const w=x.additionalProperties||x.properties;let A=m(w.type);if(w.type==="array"){const T=w.items;if(T.type)s=`{[props: string]: Array<${m(T.type)}>}`;else{const P=T.$ref;if(P){const F=P?.lastIndexOf("/");if(F&&F>0){var r=P.substring(F+1);s=`{[props: string]: Array<${r}>}`}}}}else s=`{[props: string]: ${A}}`}else s=L}}}}}j===0&&(d="requestPostBody");let f=`		let realPath=APIKey.${a}${y}
`;f+=`		const response=await ${d}(realPath, baseURL,`;let i="";const q=e.requestBody?.content;if(q){const o=q["multipart/form-data"]?.schema;if(o?.type==="object"){j=1;const b=o.properties;let x=0,B="";if(b){const D=Object.keys(b),L=G(D);let w=-1;for(let A in b){if(w++,L[0]>-1){if(L[0]===w){$+=`	* @param file \u6587\u4EF6
`,t="File",l>0&&(c=","),n+=`${c}file?:File`,x>0&&(B=","),i+=`${B}file`;continue}if(L[1]>=w)continue}const T=b[A];if($+=`	* @param ${A} ${T.description}
`,T.nullable&&(h="?"),t=m(T.type),t==="string"&&T.format==="binary"&&(t="File"),T.type==="object"){const P=T.additionalProperties||T.properties;let F=m(P.type);if(P.type==="array"){const k=P.items;if(k.type)t=m(k.type)+F;else{const W=k.$ref;if(W){const X=W?.lastIndexOf("/");X&&X>0&&(s=W.substring(X+1),s=s+F)}}}}else if(T.type==="array"){const P=T.items;if(P.type){let F=m(P.type);F==="string"&&P.format==="binary"&&(F="File"),t=F+t}else{const F=P.$ref;if(F){const k=F?.lastIndexOf("/");k&&k>0&&(s=F.substring(k+1),s=s+t)}}}l>0&&(c=","),n+=`${c}${A}${h}:${t}`,x>0&&(B=","),i+=`${B}${A}`,x++,l++}}}}(s||t)&&(s||(t=t),s&&($+=`	* @param bodyParams ${s} ${S}
`,n.endsWith("(")?n+=`bodyParams${h}:${s}`:n+=`,bodyParams${h}:${s}`),c=",");let v="";U&&(c===""&&l>0&&(c=","),n.endsWith("(")&&(c=""),n+=`${c}headers?:any,responseType:ResponseType='json',timeoutMS?:number`,v=",headers,responseType,timeoutMS");let u="any",E=e.responses["200"]?.content,R;if(!E)R=e.responses["200"].schema;else{let o=E["text/plain"];o?R=o.schema:(o=E["application/json"],o&&(R=o.schema))}if(R){const o=R.$ref;if(o){const b=o.lastIndexOf("/");u=o.substring(b+1)}else u=z(R)}return U?u==="string"?n+=`):Promise<{response:any,data:any|string}>{
`:n+=`):Promise<{response:any,data:${u}}>{
`:n+=`):Promise<${u}>{
`,$+=`	*/
`,j!=-1?(j===0?f+="bodyParams":i.length>0?f+=`{${i}}`:f+="undefined",I.length>0?f+=`,{${I}}`:f+=",undefined",f+=`${v});
`):I.length>0?f+=`undefined,{${I}}${v});
`:f+=`undefined,undefined${v});
`,U?u==="string"?f+=`		return {response,data:response?.data as any};
	}
`:f+=`		return {response,data:response?.data as ${u}};
	}
`:f+=`		return response?.data as ${u};
	}
`,n+=f,$+n}return""}function z(a){const e=a.type;let d=m(e);if(e==="array"){const $=a.items;if($.type)d=m($.type)+d;else{const n=$.$ref;if(n){const y=n?.lastIndexOf("/");y&&y>0&&(d=n.substring(y+1)+d)}}}return d}function fe(a){let e="";for(let d in a){const $=a[d];if(!$.properties)continue;let n="";$.description&&(n=`	/**
	* ${$.description}
	*/
`),n+=`	export interface ${d}{
`;for(let y in $.properties){const r=$.properties[y],h=r.nullable?"?":"";let t="any";if(r.type)if(t=m(r.type),r.items){const c=r.items.type;if(c)t=m(c)+t;else{const p=r.items.$ref;if(p){const l=p.lastIndexOf("/");t=p.substring(l+1)+t}}}else{let c=r.$ref;if(c){const p=c.lastIndexOf("/");t=c.substring(p+1)}}else{const c=r.$ref||r.additionalProperties.$ref;if(c){const p=c.lastIndexOf("/");t=c.substring(p+1)}}n+=`		${y}${h}:${t},
`}n=n.substring(0,n.length-2)+`
	}
`,e+=n}return e}function G(a){if(Array.isArray(a)){const e=a.findIndex((d,$,n)=>d==="ContentType");if(e>-1){let d=e;if(a[++d]==="ContentDisposition"&&a[++d]==="Headers"&&a[++d]==="Length"&&a[++d]==="Name"&&a[++d]==="FileName")return[e,d]}}return[-1,-1]}const ee=K("old");function pe(){return ee.value==="new"}return{swaggerURL:_,apiURLPath:V,exportAPI:oe,checkRef:ee,jsonTextRef:J}}}),xe={style:{display:"flex","flex-direction":"column","align-items":"center"}},Te=N("h2",null,"\u83B7\u53D6Swagger API\u63A5\u53E3TS\u65B9\u6CD5",-1),Ie={style:{margin:"10px 0px"}},Pe=N("span",{style:{"margin-left":"10px"}},"Swagger Json URL\u8DEF\u5F84\uFF1A",-1),Fe=N("span",null,"SysConfig\u91CCAPI URL\u914D\u7F6E\uFF1A",-1),Se=ne(" \u65E7\u65B9\u5F0F\uFF0C\u8FD4\u56DEres.data "),Ae=ne(" \u65B0\u65B9\u5F0F\uFF0C\u8FD4\u56DEres ");function je(C,M,ie,re,J,_){const V=ue;return ye(),ce("div",xe,[Te,N("div",Ie,[Pe,H(N("input",{type:"text",name:"firstname",style:{width:"500px"},placeholder:"\u4F8B\u5982\uFF1Ahttp://192.168.1.18:7001/swagger/v1/swagger.json","onUpdate:modelValue":M[0]||(M[0]=O=>C.swaggerURL=O)},null,512),[[te,C.swaggerURL]])]),N("div",null,[Fe,H(N("input",{type:"text",name:"firstname",style:{width:"500px"},"onUpdate:modelValue":M[1]||(M[1]=O=>C.apiURLPath=O)},null,512),[[te,C.apiURLPath]])]),N("div",null,[H(N("input",{type:"radio",name:"group",value:"old","onUpdate:modelValue":M[2]||(M[2]=O=>C.checkRef=O)},null,512),[[se,C.checkRef]]),Se,H(N("input",{type:"radio",name:"group",value:"new","onUpdate:modelValue":M[3]||(M[3]=O=>C.checkRef=O)},null,512),[[se,C.checkRef]]),Ae]),N("input",{type:"button",style:{"margin-top":"20px"},onClick:M[4]||(M[4]=(...O)=>C.exportAPI&&C.exportAPI(...O)),value:"\u4E0B\u8F7DAPI\u6587\u4EF6(.ts)"}),me(V,{value:C.jsonTextRef,"onUpdate:value":M[5]||(M[5]=O=>C.jsonTextRef=O),placeholder:"\u8F93\u5165Swagger Json\u5185\u5BB9",rows:13,allowClear:!0},null,8,["value"])])}var De=be(he,[["render",je]]);export{De as default};
