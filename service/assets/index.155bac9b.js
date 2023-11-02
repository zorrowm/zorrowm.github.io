import{r as ae}from"./ant-design-vue-exp.fcd30b7a.js";import{d as le,l as K,M as pe,N as ue,Q as k,q as N,a7 as Y,ab as Z,f as fe,V as G}from"./@vue-exp.a4e706db.js";import{M as _,h as de,j as ye}from"./xframelib-exp.f18cc8b7.js";import{_ as ce}from"./index.e03b55a1.js";import"./vendor.d3cc975b.js";import"./lodash-es-exp.01017e5f.js";import"./axios-exp.e066e043.js";import"./@hprose-exp.37e63ca6.js";const me=le({name:"",props:{},components:{},setup(C,{attrs:j,slots:ee,emit:te}){const W=K(),J=K(),L=K("Global.Config.ServiceURL.DefaultWebAPI"),R=new Map;let E=!0;async function se(){if(!L.value){_.Message?.warn("API\u8DEF\u5F84\u914D\u7F6E\u4E0D\u80FD\u4E3A\u7A7A");return}let y;if(W.value)y=JSON.parse(W.value);else{if(!J.value){_.Message?.warn("\u7A7A\u8FDE\u63A5\uFF0C\u65E0\u6CD5\u5F00\u59CB\u4E0B\u8F7D");return}const f=await de("",J.value);if(!f){_.Message?.warn("\u65E0\u6CD5\u83B7\u53D6Swagger Json\u6570\u636E\uFF01");return}y=f.data}if(!y){_.Message?.warn("Swagger Json\u4E3A\u7A7A\u5BF9\u8C61\uFF0C\u65E0\u6CD5\u8F93\u51FA\uFF01");return}R.clear();const t=y.info.title??"WebAPI";(!L.value||L.value.length===0)&&(L.value="Global.Config.ServiceURL.DefaultWebAPI"),E=ie();let c="";E&&(c=",ResponseType");let m=`	import{Global,requestGet,requestPost,requestPostBody${c}} from 'xframelib'
`;m+=`	const baseURL:string= ${L.value}!;
`;let s=`	const APIKey={
	`,u="";const o=y.paths;for(let f in o){const l=o[f],b=f.indexOf("{"),T=l.get,e=l.post,A=!!T;if(b>=0){const F=f.substring(0,b-1),i=F.lastIndexOf("/");let r=F.substring(i+1);r||(r="get");let B=Q(r);s+=`${B}:'${f}',
	`,A?u+=ne(B,T):u+=re(B,e)}else{const F=f.lastIndexOf("/"),i=f.substring(F+1),r=Q(i);s+=`${r}:'${f}',
	`,T?u+=z(r,T):e&&(u+=z(r,e,!1))}}s+=`}
`;let $=y.components?.schemas;$||($=y.definitions);const n=oe($),h=m+u+s+n;ye(h,t+".ts")}function Q(y){let t=y;if(!R.has(y))R.set(y,0);else{let c=R.get(y);c!=null&&(c++,t+=c,R.set(y,c))}return t}function d(y){let t="any";switch(y){case"string":t="string";break;case"number":t="number";break;case"integer":t="number";break;case"boolean":t="boolean";break;case"array":t="[]";break;default:t="any";break}return t}function ne(y,t){let c="requestGet",m="	/**",s=`	export async function ${y}(`,u="";if(t){m+=`
	* ${t.summary}
`;let o="",$="any",n="",h="",f=0,l=0,b="";t.parameters&&t.parameters.forEach(r=>{m+=`	* @param ${r.name} ${r.description}
`;const B=r.schema;if(B?((B.nullable||!r.required)&&(o="?"),$=d(B.type)):(r.requied||(o="?"),$=d(r.type)),f>0&&(n=","),l>0&&(h=","),B?.items){const O=B.items.type;$=d(O)+$}s+=`${n}${r.name}${o}:${$}`,r.in==="query"?(b+=`${h}${r.name}`,l++):r.in==="path"&&(u+=`.replace('{${r.name}}',${r.name})`),f++});let T="";E&&(n===""&&f>0&&(n=","),s+=`${n}headers?:any,responseType:ResponseType ='json',timeoutMS?: number`,T=",headers,responseType,undefined,timeoutMS");let e="any",A=t.responses["200"]?.content,F;if(A?F=A["text/plain"].schema:F=t.responses["200"].schema,F){const r=F.$ref;if(r){const B=r.lastIndexOf("/");e=r.substring(B+1)}else e=H(F)}E?e==="string"?s+=`):Promise<{response:any,data:any|string}>{
`:s+=`):Promise<{response:any,data:${e}}>{
`:s+=`):Promise<${e}>{
`,m+=`	*/
`;let i=`		let realPath=APIKey.${y}${u}
`;return i+=`		const response=await ${c}(realPath, baseURL,`,b.length>0?i+=`{${b}}${T});
`:i+=`undefined${T});
`,E?e==="string"?i+=`		return {response,data:response?.data as any};
	}
`:i+=`		return {response,data:response?.data as ${e}};
	}
`:i+=`		return response?.data as ${e};
	}
`,s+=i,m+s}return""}function z(y,t,c=!0){let m=c?"requestGet":"requestPost",s="	/**",u=`	export async function ${y}(`,o,$=-1;if(!c){if(t?.requestBody){const f=t.requestBody?.content;if(f){const l=f["application/json"];l&&($=0);const b=l?.schema;if(b){const T=b.$ref;if(T){const e=T?.lastIndexOf("/");e&&e>0&&(o=T.substring(e+1))}else{const e=b.type;let A=d(e);if(e==="array"){const F=b.items;if(F.type)o=d(F.type)+A;else{const i=F.$ref;if(i){const r=i?.lastIndexOf("/");r&&r>0&&(o=i.substring(r+1),o=o+A)}}}else o=A}}}}$===0&&(m="requestPostBody")}let n=`		const response=await ${m}(APIKey.${y}, baseURL,`;if(t){s+=`
	* ${t.summary}
`;let f="",l="any",b="",T=0,e="",A="";t.parameters&&t.parameters.forEach(p=>{s+=`	* @param ${p.name} ${p.description}
`;const U=p.schema;U?((U.nullable||!p.required)&&(f="?"),l=d(U.type)):(p.requied||(f="?"),l=d(p.type)),T>0&&(b=","),u+=`${b}${p.name}${f}:${l}`,e+=`${b}${p.name}`,T++});let F="";if(!c){const p=t.requestBody?.content;if(p){const U=p["application/json"];if(U){$=0,F=t.requestBody.description;const v=U.schema;if(l=d(v.type),v.type==="array"){const a=v.items;if(a.type)o=d(a.type)+l;else{const g=a.$ref;if(g){const x=g?.lastIndexOf("/");x&&x>0&&(o=g.substring(x+1),o=o+l)}}}else if(v.type==="object"){const a=v.additionalProperties;if(d(a.type),a.type==="array"){const g=a.items;if(g.type)o=`{[props: string]: Array<${d(g.type)}>}`;else{const x=g.$ref;if(x){const M=x?.lastIndexOf("/");if(M&&M>0){var h=x.substring(M+1);o=`{[props: string]: Array<${h}>}`}}}}}}else{const v=p["multipart/form-data"]?.schema;if(v?.type==="object"){$=1;const a=v.properties;if(a){let g=0,x="";for(let M in a){const S=a[M];if(s+=`	* @param ${M} ${S.description}
`,S.nullable&&(f="?"),l=d(S.type),S.type==="object"){const w=S.additionalProperties;let I=d(w.type);if(w.type==="array"){const P=w.items;if(P.type)l=d(P.type)+I;else{const q=P.$ref;if(q){const D=q?.lastIndexOf("/");if(D&&D>0){var h=q.substring(D+1);o=`{[props: string]: Array<${h}>}`}}}}}else if(S.type==="array"){const w=S.items;if(w.type)l=d(w.type)+l;else{const I=w.$ref;if(I){const P=I?.lastIndexOf("/");P&&P>0&&(o=I.substring(P+1),o=o+l)}}}T>0&&(b=","),u+=`${b}${M}${f}:${l}`,g>0&&(x=","),A+=`${x}${M}`,g++,T++}}}}}}if(o||l){if(o||(l=l),o){let p=o;l&&p==="any"&&(p=l),s+=`	* @param bodyParams ${o}  ${F}
`,u.endsWith("(")?u+=`bodyParams${f}:${p}`:u+=`,bodyParams${f}:${p}`}b=","}let i="";E&&(b===""&&T>0&&(b=","),u.endsWith("(")&&(b=""),u+=`${b}headers?:any,responseType:ResponseType='json',timeoutMS?:number`,c?i=",headers,responseType,undefined,timeoutMS":i=",headers,responseType,timeoutMS");let r="any",B=t.responses["200"]?.content,O;if(B?O=B["text/plain"].schema:O=t.responses["200"].schema,O){const p=O.$ref;if(p){const U=p.lastIndexOf("/");r=p.substring(U+1)}else r=H(O)}return E?r==="string"?u+=`):Promise<{response:any,data:any|string}>{
`:u+=`):Promise<{response:any,data:${r}}>{
`:u+=`):Promise<${r}>{
`,s+=`	*/
`,c?e.length>0?n+=`{${e}}${i});
`:n+=`undefined${i});
`:$!=-1?($===0?n+="bodyParams":A.length>0?n+=`{${A}}`:n+="undefined",e.length>0?n+=`,{${e}}`:n+=",undefined",n+=`${i});
`):e.length>0?n+=`undefined,{${e}}${i});
`:n+=`undefined,undefined${i});
`,E?r==="string"?n+=`		return {response,data:response?.data as any};
	}
`:n+=`		return {response,data:response?.data as ${r}};
	}
`:n+=`		return response?.data as ${r};
	}
`,u+=n,s+u}return""}function re(y,t){let c="requestPost",m="	/**",s=`	export async function ${y}(`,u="";if(t){m+=`
	* ${t.summary}
`;let $="",n="any",h="",f="",l=0,b=0,T="";t.parameters&&t.parameters.forEach(a=>{m+=`	* @param ${a.name} ${a.description}
`;const g=a.schema;if(g?((g.nullable||!a.required)&&($="?"),n=d(g.type)):(a.requied||($="?"),n=d(a.type)),l>0&&(h=","),b>0&&(f=","),g?.items){const x=g.items.type;n=d(x)+n}s+=`${h}${a.name}${$}:${n}`,a.in==="query"?(T+=`${f}${a.name}`,b++):a.in==="path"&&(u+=`.replace('{${a.name}}',${a.name})`),l++});let e,A=-1,F="";if(t?.requestBody){const a=t.requestBody?.content;if(a){const g=a["application/json"];if(g){F=t.requestBody.description,A=0;const x=g?.schema;if(x){const M=x.$ref;if(M){const S=M?.lastIndexOf("/");S&&S>0&&(e=M.substring(S+1))}else{const S=x.type;let w=d(S);if(S==="array"){const I=x.items;if(I.type)e=d(I.type)+w;else{const P=I.$ref;if(P){const q=P?.lastIndexOf("/");q&&q>0&&(e=P.substring(q+1),e=e+w)}}}else if(S==="object"){const I=x.additionalProperties;let P=d(I.type);if(I.type==="array"){const q=I.items;if(q.type)e=`{[props: string]: Array<${d(q.type)}>}`;else{const D=q.$ref;if(D){const V=D?.lastIndexOf("/");if(V&&V>0){var o=D.substring(V+1);e=`{[props: string]: Array<${o}>}`}}}}else e=`{[props: string]: ${P}}`}else e=w}}}}}A===0&&(c="requestPostBody");let i=`		let realPath=APIKey.${y}${u}
`;i+=`		const response=await ${c}(realPath, baseURL,`;let r="";const B=t.requestBody?.content;if(B){const a=B["multipart/form-data"]?.schema;if(a?.type==="object"){A=1;const g=a.properties;let x=0,M="";if(g)for(let S in g){const w=g[S];if(m+=`	* @param ${S} ${w.description}
`,w.nullable&&($="?"),n=d(w.type),w.type==="object"){const I=w.additionalProperties;let P=d(I.type);if(I.type==="array"){const q=I.items;if(q.type)n=d(q.type)+P;else{const D=q.$ref;if(D){const V=D?.lastIndexOf("/");V&&V>0&&(e=D.substring(V+1),e=e+P)}}}}else if(w.type==="array"){const I=w.items;if(I.type)n=d(I.type)+n;else{const P=I.$ref;if(P){const q=P?.lastIndexOf("/");q&&q>0&&(e=P.substring(q+1),e=e+n)}}}l>0&&(h=","),s+=`${h}${S}${$}:${n}`,x>0&&(M=","),r+=`${M}${S}`,x++,l++}}}(e||n)&&(e||(n=n),e&&(m+=`	* @param bodyParams ${e} ${F}
`,s.endsWith("(")?s+=`bodyParams${$}:${e}`:s+=`,bodyParams${$}:${e}`),h=",");let O="";E&&(h===""&&l>0&&(h=","),s.endsWith("(")&&(h=""),s+=`${h}headers?:any,responseType:ResponseType='json',timeoutMS?:number`,O=",headers,responseType,timeoutMS");let p="any",U=t.responses["200"]?.content,v;if(U?v=U["text/plain"].schema:v=t.responses["200"].schema,v){const a=v.$ref;if(a){const g=a.lastIndexOf("/");p=a.substring(g+1)}else p=H(v)}return E?p==="string"?s+=`):Promise<{response:any,data:any|string}>{
`:s+=`):Promise<{response:any,data:${p}}>{
`:s+=`):Promise<${p}>{
`,m+=`	*/
`,A!=-1?(A===0?i+="bodyParams":r.length>0?i+=`{${r}}`:i+="undefined",T.length>0?i+=`,{${T}}`:i+=",undefined",i+=`${O});
`):T.length>0?i+=`undefined,{${T}}${O});
`:i+=`undefined,undefined${O});
`,E?p==="string"?i+=`		return {response,data:response?.data as any};
	}
`:i+=`		return {response,data:response?.data as ${p}};
	}
`:i+=`		return response?.data as ${p};
	}
`,s+=i,m+s}return""}function H(y){const t=y.type;let c=d(t);if(t==="array"){const m=y.items;if(m.type)c=d(m.type)+c;else{const s=m.$ref;if(s){const u=s?.lastIndexOf("/");u&&u>0&&(c=s.substring(u+1)+c)}}}return c}function oe(y){let t="";for(let c in y){const m=y[c];if(!m.properties)continue;let s="";m.description&&(s=`	/**
	* ${m.description}
	*/
`),s+=`	export interface ${c}{
`;for(let u in m.properties){const o=m.properties[u],$=o.nullable?"?":"";let n="any";if(o.type){if(n=d(o.type),o.items){const h=o.items.type;n=d(h)+n}}else{const h=o.$ref;if(h){const f=h.lastIndexOf("/");n=h.substring(f+1)}}s+=`		${u}${$}:${n},
`}s=s.substring(0,s.length-2)+`
	}
`,t+=s}return t}const X=K("old");function ie(){return X.value==="new"}return{swaggerURL:J,apiURLPath:L,exportAPI:se,checkRef:X,jsonTextRef:W}}}),$e={style:{display:"flex","flex-direction":"column","align-items":"center"}},ge=k("h2",null,"\u83B7\u53D6Swagger API\u63A5\u53E3TS\u65B9\u6CD5",-1),be={style:{margin:"10px 0px"}},he=k("span",{style:{"margin-left":"10px"}},"Swagger Json URL\u8DEF\u5F84\uFF1A",-1),Te=k("span",null,"SysConfig\u91CCAPI URL\u914D\u7F6E\uFF1A",-1),xe=G(" \u65E7\u65B9\u5F0F\uFF0C\u8FD4\u56DEres.data "),Ie=G(" \u65B0\u65B9\u5F0F\uFF0C\u8FD4\u56DEres ");function Pe(C,j,ee,te,W,J){const L=ae;return pe(),ue("div",$e,[ge,k("div",be,[he,N(k("input",{type:"text",name:"firstname",style:{width:"500px"},placeholder:"\u4F8B\u5982\uFF1Ahttp://192.168.1.18:7001/swagger/v1/swagger.json","onUpdate:modelValue":j[0]||(j[0]=R=>C.swaggerURL=R)},null,512),[[Y,C.swaggerURL]])]),k("div",null,[Te,N(k("input",{type:"text",name:"firstname",style:{width:"500px"},"onUpdate:modelValue":j[1]||(j[1]=R=>C.apiURLPath=R)},null,512),[[Y,C.apiURLPath]])]),k("div",null,[N(k("input",{type:"radio",name:"group",value:"old","onUpdate:modelValue":j[2]||(j[2]=R=>C.checkRef=R)},null,512),[[Z,C.checkRef]]),xe,N(k("input",{type:"radio",name:"group",value:"new","onUpdate:modelValue":j[3]||(j[3]=R=>C.checkRef=R)},null,512),[[Z,C.checkRef]]),Ie]),k("input",{type:"button",style:{"margin-top":"20px"},onClick:j[4]||(j[4]=(...R)=>C.exportAPI&&C.exportAPI(...R)),value:"\u4E0B\u8F7DAPI\u6587\u4EF6(.ts)"}),fe(L,{value:C.jsonTextRef,"onUpdate:value":j[5]||(j[5]=R=>C.jsonTextRef=R),placeholder:"\u8F93\u5165Swagger Json\u5185\u5BB9",rows:13,allowClear:!0},null,8,["value"])])}var ve=ce(me,[["render",Pe]]);export{ve as default};
