!function(){function e(e,n,t,a,r,s,o){try{var c=e[s](o),i=c.value}catch(l){return void t(l)}c.done?n(i):Promise.resolve(i).then(a,r)}function n(n){return function(){var t=this,a=arguments;return new Promise((function(r,s){var o=n.apply(t,a);function c(n){e(o,r,s,c,i,"next",n)}function i(n){e(o,r,s,c,i,"throw",n)}c(void 0)}))}}System.register(["./ant-design-vue-exp-legacy.66cea81e.js","./@vue-exp-legacy.b493abed.js","./xframelib-exp-legacy.dacdec32.js","./index-legacy.a9f44632.js","./vendor-legacy.ecbffdeb.js","./lodash-es-exp-legacy.5e983146.js","./axios-exp-legacy.2267007d.js","./@hprose-exp-legacy.47b094bd.js"],(function(e){"use strict";var t,a,r,s,o,c,i,l,u,p,f,d,v,y,m;return{setters:[function(e){t=e.r},function(e){a=e.d,r=e.l,s=e.M,o=e.N,c=e.Q,i=e.q,l=e.a7,u=e.ab,p=e.f,f=e.V},function(e){d=e.M,v=e.h,y=e.j},function(e){m=e._},function(){},function(){},function(){},function(){}],execute:function(){var g=a({name:"",props:{},components:{},setup:function(e,t){t.attrs,t.slots,t.emit;var a=r(),s=r(),o=r("Global.Config.ServiceURL.DefaultWebAPI"),c=new Map,i=!0;function l(){return(l=n(regeneratorRuntime.mark((function e(){var n,t,r,l,p,b,x,I,w,R,q,j,O,A,U,S,k,$,T,L,M,B,W,G,C,J,V,K,E;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(o.value){e.next=3;break}return null===(r=d.Message)||void 0===r||r.warn("API路径配置不能为空"),e.abrupt("return");case 3:if(!a.value){e.next=7;break}l=JSON.parse(a.value),e.next=17;break;case 7:if(s.value){e.next=10;break}return null===(p=d.Message)||void 0===p||p.warn("空连接，无法开始下载"),e.abrupt("return");case 10:return e.next=12,v("",s.value);case 12:if(b=e.sent){e.next=16;break}return null===(x=d.Message)||void 0===x||x.warn("无法获取Swagger Json数据！"),e.abrupt("return");case 16:l=b.data;case 17:if(l){e.next=20;break}return null===(I=d.Message)||void 0===I||I.warn("Swagger Json为空对象，无法输出！"),e.abrupt("return");case 20:for(U in c.clear(),w=null!==(n=l.info.title)&&void 0!==n?n:"WebAPI",o.value&&0!==o.value.length||(o.value="Global.Config.ServiceURL.DefaultWebAPI"),i=P(),R="",i&&(R=",ResponseType"),q="\timport{Global,requestGet,requestPost,requestPostBody".concat(R,"} from 'xframelib'\n"),q+="\tconst baseURL:string= ".concat(o.value,"!;\n"),j="\tconst APIKey={\n\t",O="",A=l.paths)S=A[U],k=U.indexOf("{"),$=S.get,T=S.post,L=!!$,k>=0?(M=U.substring(0,k-1),B=M.lastIndexOf("/"),(W=M.substring(B+1))||(W="get"),G=u(W),j+="".concat(G,":'").concat(U,"',\n\t"),O+=L?f(G,$):g(G,T)):(C=U.lastIndexOf("/"),J=U.substring(C+1),V=u(J),j+="".concat(V,":'").concat(U,"',\n\t"),$?O+=m(V,$):T&&(O+=m(V,T,!1)));j+="}\n",(K=null===(t=l.components)||void 0===t?void 0:t.schemas)||(K=l.definitions),E=h(K),y(q+O+j+E,w+".ts");case 38:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function u(e){var n=e;if(c.has(e)){var t=c.get(e);null!=t&&(n+=++t,c.set(e,t))}else c.set(e,0);return n}function p(e){var n="any";switch(e){case"string":n="string";break;case"number":case"integer":n="number";break;case"boolean":n="boolean";break;case"array":n="[]";break;default:n="any"}return n}function f(e,n){var t="\t/**",a="\texport async function ".concat(e,"("),r="";if(n){var s;t+="\n\t* ".concat(n.summary,"\n");var o="",c="any",l="",u="",f=0,d=0,v="";n.parameters&&n.parameters.forEach((function(e){t+="\t* @param ".concat(e.name," ").concat(e.description,"\n");var n=e.schema;if(n?(!n.nullable&&e.required||(o="?"),c=p(n.type)):(e.requied||(o="?"),c=p(e.type)),f>0&&(l=","),d>0&&(u=","),null!=n&&n.items){var s=p(n.items.type);c=s+c}a+="".concat(l).concat(e.name).concat(o,":").concat(c),"query"===e.in?(v+="".concat(u).concat(e.name),d++):"path"===e.in&&(r+=".replace('{".concat(e.name,"}',").concat(e.name,")")),f++}));var y="";i&&(""===l&&f>0&&(l=","),a+="".concat(l,"headers?:any,responseType:ResponseType ='json',timeoutMS?: number"),y=",headers,responseType,undefined,timeoutMS");var m,g="any",h=null===(s=n.responses[200])||void 0===s?void 0:s.content;if(h)m=h["text/plain"].schema;else m=n.responses[200].schema;if(m){var x=m.$ref;if(x){var P=x.lastIndexOf("/");g=x.substring(P+1)}else g=b(m)}a+=i?"string"===g?"):Promise<{response:any,data:any|string}>{\n":"):Promise<{response:any,data:".concat(g,"}>{\n"):"):Promise<".concat(g,">{\n"),t+="\t*/\n";var I="\t\tlet realPath=APIKey.".concat(e).concat(r,"\n");return I+="\t\tconst response=await ".concat("requestGet","(realPath, baseURL,"),v.length>0?I+="{".concat(v,"}").concat(y,");\n"):I+="undefined".concat(y,");\n"),I+=i?"string"===g?"\t\treturn {response,data:response?.data as any};\n\t}\n":"\t\treturn {response,data:response?.data as ".concat(g,"};\n\t}\n"):"\t\treturn response?.data as ".concat(g,";\n\t}\n"),t+(a+=I)}return""}function m(e,n){var t,a=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],r=a?"requestGet":"requestPost",s="\t/**",o="\texport async function ".concat(e,"("),c=-1;if(!a){if(null!=n&&n.requestBody){var l,u=null===(l=n.requestBody)||void 0===l?void 0:l.content;if(u){var f=u["application/json"];f&&(c=0);var d=null==f?void 0:f.schema;if(d){var v=d.$ref;if(v){var y=null==v?void 0:v.lastIndexOf("/");y&&y>0&&(t=v.substring(y+1))}else{var m=d.type,g=p(m);if("array"===m){var h=d.items;if(h.type){var x=p(h.type);t=x+g}else{var P=h.$ref;if(P){var I=null==P?void 0:P.lastIndexOf("/");I&&I>0&&(t=P.substring(I+1),t+=g)}}}else t=g}}}}0===c&&(r="requestPostBody")}var w="\t\tconst response=await ".concat(r,"(APIKey.").concat(e,", baseURL,");if(n){var R;s+="\n\t* ".concat(n.summary,"\n");var q="",j="any",O="",A=0,U="",S="";n.parameters&&n.parameters.forEach((function(e){s+="\t* @param ".concat(e.name," ").concat(e.description,"\n");var n=e.schema;n?(!n.nullable&&e.required||(q="?"),j=p(n.type)):(e.requied||(q="?"),j=p(e.type)),A>0&&(O=","),o+="".concat(O).concat(e.name).concat(q,":").concat(j),U+="".concat(O).concat(e.name),A++}));var k="";if(!a){var $,T=null===($=n.requestBody)||void 0===$?void 0:$.content;if(T){var L=T["application/json"];if(L){c=0,k=n.requestBody.description;var M=L.schema;if(j=p(M.type),"array"===M.type){var B=M.items;if(B.type){var W=p(B.type);t=W+j}else{var G=B.$ref;if(G){var C=null==G?void 0:G.lastIndexOf("/");C&&C>0&&(t=G.substring(C+1),t+=j)}}}else if("object"===M.type){var J=M.additionalProperties;if(p(J.type),"array"===J.type){var V=J.items;if(V.type){var K=p(V.type);t="{[props: string]: Array<".concat(K,">}")}else{var E=V.$ref;if(E){var D=null==E?void 0:E.lastIndexOf("/");if(D&&D>0){var N=E.substring(D+1);t="{[props: string]: Array<".concat(N,">}")}}}}}}else{var Q,_=null===(Q=T["multipart/form-data"])||void 0===Q?void 0:Q.schema;if("object"===(null==_?void 0:_.type)){c=1;var z=_.properties;if(z){var F=0,H="";for(var X in z){var Y=z[X];if(s+="\t* @param ".concat(X," ").concat(Y.description,"\n"),Y.nullable&&(q="?"),j=p(Y.type),"object"===Y.type){var Z=Y.additionalProperties,ee=p(Z.type);if("array"===Z.type){var ne=Z.items;if(ne.type){var te=p(ne.type);j=te+ee}else{var ae=ne.$ref;if(ae){var re=null==ae?void 0:ae.lastIndexOf("/");if(re&&re>0){N=ae.substring(re+1);t="{[props: string]: Array<".concat(N,">}")}}}}}else if("array"===Y.type){var se=Y.items;if(se.type){var oe=p(se.type);j=oe+j}else{var ce=se.$ref;if(ce){var ie=null==ce?void 0:ce.lastIndexOf("/");ie&&ie>0&&(t=ce.substring(ie+1),t+=j)}}}A>0&&(O=","),o+="".concat(O).concat(X).concat(q,":").concat(j),F>0&&(H=","),S+="".concat(H).concat(X),F++,A++}}}}}}if(t||j){if(t){var le=t;j&&"any"===le&&(le=j),s+="\t* @param bodyParams ".concat(t,"  ").concat(k,"\n"),o.endsWith("(")?o+="bodyParams".concat(q,":").concat(le):o+=",bodyParams".concat(q,":").concat(le)}O=","}var ue="";i&&(""===O&&A>0&&(O=","),o.endsWith("(")&&(O=""),o+="".concat(O,"headers?:any,responseType:ResponseType='json',timeoutMS?:number"),ue=a?",headers,responseType,undefined,timeoutMS":",headers,responseType,timeoutMS");var pe,fe="any",de=null===(R=n.responses[200])||void 0===R?void 0:R.content;if(de){var ve=de["text/plain"];pe=ve.schema}else pe=n.responses[200].schema;if(pe){var ye=pe.$ref;if(ye){var me=ye.lastIndexOf("/");fe=ye.substring(me+1)}else fe=b(pe)}return o+=i?"string"===fe?"):Promise<{response:any,data:any|string}>{\n":"):Promise<{response:any,data:".concat(fe,"}>{\n"):"):Promise<".concat(fe,">{\n"),s+="\t*/\n",a?U.length>0?w+="{".concat(U,"}").concat(ue,");\n"):w+="undefined".concat(ue,");\n"):-1!=c?(0===c?w+="bodyParams":S.length>0?w+="{".concat(S,"}"):w+="undefined",U.length>0?w+=",{".concat(U,"}"):w+=",undefined",w+="".concat(ue,");\n")):U.length>0?w+="undefined,{".concat(U,"}").concat(ue,");\n"):w+="undefined,undefined".concat(ue,");\n"),w+=i?"string"===fe?"\t\treturn {response,data:response?.data as any};\n\t}\n":"\t\treturn {response,data:response?.data as ".concat(fe,"};\n\t}\n"):"\t\treturn response?.data as ".concat(fe,";\n\t}\n"),s+(o+=w)}return""}function g(e,n){var t="requestPost",a="\t/**",r="\texport async function ".concat(e,"("),s="";if(n){var o,c;a+="\n\t* ".concat(n.summary,"\n");var l,u="",f="any",d="",v="",y=0,m=0,g="";n.parameters&&n.parameters.forEach((function(e){a+="\t* @param ".concat(e.name," ").concat(e.description,"\n");var n=e.schema;if(n?(!n.nullable&&e.required||(u="?"),f=p(n.type)):(e.requied||(u="?"),f=p(e.type)),y>0&&(d=","),m>0&&(v=","),null!=n&&n.items){var t=p(n.items.type);f=t+f}r+="".concat(d).concat(e.name).concat(u,":").concat(f),"query"===e.in?(g+="".concat(v).concat(e.name),m++):"path"===e.in&&(s+=".replace('{".concat(e.name,"}',").concat(e.name,")")),y++}));var h=-1,x="";if(null!=n&&n.requestBody){var P,I=null===(P=n.requestBody)||void 0===P?void 0:P.content;if(I){var w=I["application/json"];if(w){x=n.requestBody.description,h=0;var R=null==w?void 0:w.schema;if(R){var q=R.$ref;if(q){var j=null==q?void 0:q.lastIndexOf("/");j&&j>0&&(l=q.substring(j+1))}else{var O=R.type,A=p(O);if("array"===O){var U=R.items;if(U.type){l=p(U.type)+A}else{var S=U.$ref;if(S){var k=null==S?void 0:S.lastIndexOf("/");k&&k>0&&(l=S.substring(k+1),l+=A)}}}else if("object"===O){var $=R.additionalProperties,T=p($.type);if("array"===$.type){var L=$.items;if(L.type){var M=p(L.type);l="{[props: string]: Array<".concat(M,">}")}else{var B=L.$ref;if(B){var W=null==B?void 0:B.lastIndexOf("/");if(W&&W>0){var G=B.substring(W+1);l="{[props: string]: Array<".concat(G,">}")}}}}else l="{[props: string]: ".concat(T,"}")}else l=A}}}}}0===h&&(t="requestPostBody");var C="\t\tlet realPath=APIKey.".concat(e).concat(s,"\n");C+="\t\tconst response=await ".concat(t,"(realPath, baseURL,");var J="",V=null===(o=n.requestBody)||void 0===o?void 0:o.content;if(V){var K,E=null===(K=V["multipart/form-data"])||void 0===K?void 0:K.schema;if("object"===(null==E?void 0:E.type)){h=1;var D=E.properties,N=0,Q="";if(D)for(var _ in D){var z=D[_];if(a+="\t* @param ".concat(_," ").concat(z.description,"\n"),z.nullable&&(u="?"),f=p(z.type),"object"===z.type){var F=z.additionalProperties,H=p(F.type);if("array"===F.type){var X=F.items;if(X.type){var Y=p(X.type);f=Y+H}else{var Z=X.$ref;if(Z){var ee=null==Z?void 0:Z.lastIndexOf("/");ee&&ee>0&&(l=Z.substring(ee+1),l+=H)}}}}else if("array"===z.type){var ne=z.items;if(ne.type){var te=p(ne.type);f=te+f}else{var ae=ne.$ref;if(ae){var re=null==ae?void 0:ae.lastIndexOf("/");re&&re>0&&(l=ae.substring(re+1),l+=f)}}}y>0&&(d=","),r+="".concat(d).concat(_).concat(u,":").concat(f),N>0&&(Q=","),J+="".concat(Q).concat(_),N++,y++}}}(l||f)&&(l&&(a+="\t* @param bodyParams ".concat(l," ").concat(x,"\n"),r.endsWith("(")?r+="bodyParams".concat(u,":").concat(l):r+=",bodyParams".concat(u,":").concat(l)),d=",");var se="";i&&(""===d&&y>0&&(d=","),r.endsWith("(")&&(d=""),r+="".concat(d,"headers?:any,responseType:ResponseType='json',timeoutMS?:number"),se=",headers,responseType,timeoutMS");var oe,ce="any",ie=null===(c=n.responses[200])||void 0===c?void 0:c.content;if(ie)oe=ie["text/plain"].schema;else oe=n.responses[200].schema;if(oe){var le=oe.$ref;if(le){var ue=le.lastIndexOf("/");ce=le.substring(ue+1)}else ce=b(oe)}return r+=i?"string"===ce?"):Promise<{response:any,data:any|string}>{\n":"):Promise<{response:any,data:".concat(ce,"}>{\n"):"):Promise<".concat(ce,">{\n"),a+="\t*/\n",-1!=h?(0===h?C+="bodyParams":J.length>0?C+="{".concat(J,"}"):C+="undefined",g.length>0?C+=",{".concat(g,"}"):C+=",undefined",C+="".concat(se,");\n")):g.length>0?C+="undefined,{".concat(g,"}").concat(se,");\n"):C+="undefined,undefined".concat(se,");\n"),C+=i?"string"===ce?"\t\treturn {response,data:response?.data as any};\n\t}\n":"\t\treturn {response,data:response?.data as ".concat(ce,"};\n\t}\n"):"\t\treturn response?.data as ".concat(ce,";\n\t}\n"),a+(r+=C)}return""}function b(e){var n=e.type,t=p(n);if("array"===n){var a=e.items;if(a.type){t=p(a.type)+t}else{var r=a.$ref;if(r){var s=null==r?void 0:r.lastIndexOf("/");if(s&&s>0)t=r.substring(s+1)+t}}}return t}function h(e){var n="";for(var t in e){var a=e[t];if(a.properties){var r="";for(var s in a.description&&(r="\t/**\n\t* ".concat(a.description,"\n\t*/\n")),r+="\texport interface ".concat(t,"{\n"),a.properties){var o=a.properties[s],c=o.nullable?"?":"",i="any";if(o.type){if(i=p(o.type),o.items)i=p(o.items.type)+i}else{var l=o.$ref;if(l){var u=l.lastIndexOf("/");i=l.substring(u+1)}}r+="\t\t".concat(s).concat(c,":").concat(i,",\n")}n+=r=r.substring(0,r.length-2)+"\n\t}\n"}}return n}var x=r("old");function P(){return"new"===x.value}return{swaggerURL:s,apiURLPath:o,exportAPI:function(){return l.apply(this,arguments)},checkRef:x,jsonTextRef:a}}}),b={style:{display:"flex","flex-direction":"column","align-items":"center"}},h=c("h2",null,"获取Swagger API接口TS方法",-1),x={style:{margin:"10px 0px"}},P=c("span",{style:{"margin-left":"10px"}},"Swagger Json URL路径：",-1),I=c("span",null,"SysConfig里API URL配置：",-1),w=f(" 旧方式，返回res.data "),R=f(" 新方式，返回res ");e("default",m(g,[["render",function(e,n,a,r,f,d){var v=t;return s(),o("div",b,[h,c("div",x,[P,i(c("input",{type:"text",name:"firstname",style:{width:"500px"},placeholder:"例如：http://192.168.1.18:7001/swagger/v1/swagger.json","onUpdate:modelValue":n[0]||(n[0]=function(n){return e.swaggerURL=n})},null,512),[[l,e.swaggerURL]])]),c("div",null,[I,i(c("input",{type:"text",name:"firstname",style:{width:"500px"},"onUpdate:modelValue":n[1]||(n[1]=function(n){return e.apiURLPath=n})},null,512),[[l,e.apiURLPath]])]),c("div",null,[i(c("input",{type:"radio",name:"group",value:"old","onUpdate:modelValue":n[2]||(n[2]=function(n){return e.checkRef=n})},null,512),[[u,e.checkRef]]),w,i(c("input",{type:"radio",name:"group",value:"new","onUpdate:modelValue":n[3]||(n[3]=function(n){return e.checkRef=n})},null,512),[[u,e.checkRef]]),R]),c("input",{type:"button",style:{"margin-top":"20px"},onClick:n[4]||(n[4]=function(){return e.exportAPI&&e.exportAPI.apply(e,arguments)}),value:"下载API文件(.ts)"}),p(v,{value:e.jsonTextRef,"onUpdate:value":n[5]||(n[5]=function(n){return e.jsonTextRef=n}),placeholder:"输入Swagger Json内容",rows:13,allowClear:!0},null,8,["value"])])}]]))}}}))}();