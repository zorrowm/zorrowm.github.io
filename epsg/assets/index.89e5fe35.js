import{d as b,ak as I,ab as J,a as A,r as B,w as Q,E as R,o as l,b as w,k as c,l as d,g as S,D,al as X,am as P,an as Z,c as ee,t as x,F as V,x as N,v as m,C as E,j as $,ao as U,ap as L,aq as ne,S as te,U as oe,y as W,ar as ae,a1 as se,as as ue,at as ie,_ as le,au as re}from"./vendor.de069ad6.js";import{_ as M,O as ce,h as de}from"./index.f27a7adf.js";import{I as T}from"./@iconify/vue-exp.b199edd5.js";import{b as Y}from"./vue-router-exp.aee9d5fb.js";import{T as O}from"./TableEvent.69ad174d.js";import{C as pe,D as ge,a as me}from"./SpatialService.fe9450b1.js";import{d as _e}from"./WidgetsTool.ec924392.js";import{B as v}from"./xframelib-exp.e4d795a1.js";import{s as fe}from"./scrollRef.11fe2605.js";import"./lodash-es-exp.d3c3d62f.js";import"./axios-exp.cd5cf947.js";import"./WidgetsEvent.9f7b2658.js";const Ce=b({props:{pageindex:I(),pagesize:I(),totalCount:I(),isCard:J()},setup(e,{emit:n}){let u=A();e.isCard===!0?u=A(["8","16","24","32"]):u=A(["10","20","30","40"]);const i=B({totalCount:e.totalCount,pageSize:e.pagesize,current:e.pageindex}),p=r=>{n("pageChange",r)},f=(r,t)=>{n("sizeChange",t)};return Q(e,()=>{i.pageSize=e.pagesize,i.current=e.pageindex,i.totalCount=e.totalCount}),{onShowSizeChange:f,...R(i),onChange:p,pageSizeOptions:u}}}),he={style:{maring:"10px 0px"}};function ke(e,n,u,i,p,f){const r=X;return l(),w("div",he,[c(r,{"show-size-changer":"",current:e.current,"onUpdate:current":n[0]||(n[0]=t=>e.current=t),pageSize:e.pageSize,"onUpdate:pageSize":n[1]||(n[1]=t=>e.pageSize=t),"page-size-options":e.pageSizeOptions,total:e.totalCount,onShowSizeChange:e.onShowSizeChange,onChange:e.onChange},{buildOptionText:d(t=>[S("span",null,D(t.value)+"\u6761/\u9875",1)]),_:1},8,["current","pageSize","page-size-options","total","onShowSizeChange","onChange"])])}const q=M(Ce,[["render",ke]]),ye={props:["case"],setup(e,{slots:n}){return()=>{if(n[e.case])return n[e.case]();if(n.default)return n.default()}}},H=ye,we=b({components:{Icon:T},props:{defaultMenus:P().def([]),appendMenus:P().def([]),currentRow:Z().def(null)},setup(e,{emit:n}){const u=ee(()=>e.appendMenus.length>0);return{doClick:p=>{n("doActionClick",p,e.currentRow)},hasAppendMenus:u}}});const Fe={style:{width:"110px"}},ve=["onClick"];function $e(e,n,u,i,p,f){const r=x("Icon"),t=U,C=L,h=ne,k=te,y=oe;return l(),w("div",null,[(l(!0),w(V,null,N(e.defaultMenus,(o,g)=>(l(),m(C,{placement:"bottom",title:o.name,key:g},{default:d(()=>[o.isdelete?(l(),m(t,{key:0,title:"\u786E\u8BA4\u5220\u9664\uFF1F",onConfirm:F=>e.doClick(o.value)},{default:d(()=>[c(r,{icon:o.icon,class:"operationIcon"},null,8,["icon"])]),_:2},1032,["onConfirm"])):(l(),m(r,{key:1,icon:o.icon,class:"operationIcon",onClick:F=>e.doClick(o.value)},null,8,["icon","onClick"]))]),_:2},1032,["title"]))),128)),e.hasAppendMenus?(l(),m(y,{key:0,placement:"bottom"},{overlay:d(()=>[c(k,null,{default:d(()=>[(l(!0),w(V,null,N(e.appendMenus,(o,g)=>(l(),m(h,{command:g,key:g},{default:d(()=>[S("div",Fe,[o.isdelete||o.value==="delete"?(l(),m(t,{key:0,title:"\u786E\u8BA4\u5220\u9664\uFF1F",onConfirm:F=>e.doClick(o.value)},{default:d(()=>[c(r,{icon:o.icon,class:"operationIcon"},null,8,["icon"]),E(D(o.name),1)]),_:2},1032,["onConfirm"])):(l(),w("div",{key:1,onClick:F=>e.doClick(o.value)},[c(r,{icon:o.icon,class:"operationIcon"},null,8,["icon"]),E(" "+D(o.name),1)],8,ve))])]),_:2},1032,["command"]))),128))]),_:1})]),default:d(()=>[c(r,{icon:"ant-design:ellipsis-outlined",class:"operationIcon"})]),_:1})):$("",!0)])}const j=M(we,[["render",$e]]),Be=b({name:"topFunBar",props:{title:{type:String,default:""},ifTask:{type:Boolean,default:!0}},components:{Icon:T},setup(e,{emit:n}){Y();const u=B({searchValue:""}),i=p=>{p==="searchWord"?n("topBarClick",p,u.searchValue):n("topBarClick",p)};return W(()=>{}),{...R(u),doClick:i}}});const Se={class:"topBox"},De={class:"toptitle"},be={class:"topright"};function Me(e,n,u,i,p,f){const r=ae,t=x("Icon"),C=se,h=ue,k=U,y=L;return l(),w("div",Se,[S("span",De,D(e.title),1),S("span",be,[c(r,{value:e.searchValue,"onUpdate:value":n[0]||(n[0]=o=>e.searchValue=o),placeholder:"\u8BF7\u8F93\u5165\u5173\u952E\u5B57",style:{width:"200px","margin-right":"30px"},class:"rightBoxItem",onSearch:n[1]||(n[1]=o=>e.doClick("searchWord")),allowClear:!0},null,8,["value"]),e.ifTask?(l(),m(C,{key:0,type:"primary",class:"rightBoxItem",style:{"margin-right":"10px"},onClick:n[2]||(n[2]=o=>e.doClick("creatNew"))},{icon:d(()=>[c(t,{icon:"ant-design:plus-outlined"})]),default:d(()=>[E(" \u65B0\u5EFA ")]),_:1})):$("",!0),e.ifTask?(l(),m(h,{key:1,type:"vertical"})):$("",!0),e.ifTask?(l(),m(y,{key:2,placement:"bottom",title:"\u6279\u91CF\u5220\u9664"},{default:d(()=>[c(k,{title:"\u786E\u8BA4\u5220\u9664\uFF1F",onConfirm:n[3]||(n[3]=o=>e.doClick("batchDelete"))},{default:d(()=>[c(t,{icon:"ant-design:delete-outlined",style:{"margin-right":"20px"}})]),_:1})]),_:1})):$("",!0),c(y,{placement:"bottom",title:"\u5237\u65B0"},{default:d(()=>[c(t,{icon:"ant-design:sync-outlined",onClick:n[4]||(n[4]=o=>e.doClick("refresh"))})]),_:1})])])}const G=M(Be,[["render",Me],["__scopeId","data-v-58751a1a"]]),ze=[{value:"detail",name:"EPSG\u8BE6\u60C5",icon:"ant-design:info-circle-outlined"},{value:"edit",name:"\u7F16\u8F91",icon:"ant-design:form-outlined"},{value:"delete",name:"\u5220\u9664",icon:"ant-design:delete-outlined",isdelete:!0}],Ie=[];function Ae(){return ze}function Ee(e){return Ie}const Re=[{title:"\u7F16\u7801",align:"center",dataIndex:"code",width:100,fixed:"left"},{title:"\u540D\u79F0",dataIndex:"name",ellipsis:"true",width:180},{title:"\u7C7B\u578B",dataIndex:"kind",width:100},{title:"\u521B\u5EFA\u65F6\u95F4",width:100,dataIndex:"revision_date",customCell:(e,n,u)=>({innerHTML:ie(e.revision_date).format("YYYY-MM-DD")})},{title:"\u4F7F\u7528\u8303\u56F4",dataIndex:"area",ellipsis:"true"},{title:"\u64CD\u4F5C",align:"center",fixed:"right",width:100,key:"operation"}];function Te(e,n,u){const i=e.resolve({path:n,query:u});window.open(i.href,"_blank")}const Pe=b({name:"adminEPSG",components:{TopFunBar:G,Pagination:q,ActionMenu:j,Icon:T,VSwitch:H},props:{},setup(){const e=B({tableData:[],PageIndex:1,PageSize:10,totalCount:0,keyword:"",sortname:"",sortway:0}),n=B({rowData:{},deleteArr:[],recordData:{}}),u=(a,s)=>{switch(a){case"searchWord":y(s);break;case"creatNew":i("creatNew");break;case"batchDelete":g();break;case"refresh":t();break}};function i(a,s){let _="",z;switch(a){case"edit":_="AddEditCRS",z={title:"\u7F16\u8F91\u5750\u6807\u7CFB",isEdit:!0};break;case"creatNew":_="AddEditCRS",z={title:"\u65B0\u5EFA\u5750\u6807\u7CFB",isEdit:!1};break}_&&_e({modalID:_,extraData:z,rowData:s,width:700})}const p=(a,s)=>{switch(a){case"detail":r(s);break;case"edit":i(a,s.code);break;case"delete":o(s.code);break}n.rowData=s},f=Y(),r=a=>{Te(f,`/epsg/${a.code}`,{})},t=()=>{pe(e.keyword,e.PageIndex,e.PageSize).then(a=>{const s=a;s?(console.log(s.items,"\u6240\u6709\u7684\u6570\u636E\u8BB0\u5F55"),e.tableData=s.items,e.totalCount=s.totalCount):(e.tableData=[],e.totalCount=0)})},C={onChange:(a,s)=>{n.deleteArr=[];for(let _=0;_<s.length;_++)n.deleteArr.push(s[_].code)}},h=a=>{e.PageSize=a,t()},k=a=>{e.PageIndex=a,t()},y=a=>{e.keyword=a,e.PageIndex=1,t()},o=a=>{console.log("\u5F00\u59CB\u8FDB\u884C\u5220\u9664"),ge(a).then(s=>{console.log(a,"\u5220\u9664"),s?(v.Message?.msg("\u5220\u9664\u6210\u529F!"),t()):v.Message?.err("\u5220\u9664\u5931\u8D25!")})},g=()=>{n.deleteArr.length>0?me(n.deleteArr).then(a=>{a===!0?(v.Message?.msg("\u6279\u91CF\u5220\u9664\u6210\u529F!"),t()):v.Message?.err("\u6279\u91CF\u5220\u9664\u5931\u8D25!")}):v.Message?.err("\u8BF7\u9009\u62E9\u6570\u636E!")};W(()=>{ce(O.RefeshTable,t),t()}),le(()=>{de(O.RefeshTable,t)});function F(a){return[...Ae()]}function K(a){return Ee()}return{topBarClick:u,rowSelection:C,columns:Re,...R(e),initTable:t,sizeChange:h,pageChange:k,doActionClick:p,getRightDefaultMenus:F,getRightMoreMenus:K,scrollRef:fe}}});function Ve(e,n,u,i,p,f){const r=G,t=j,C=H,h=re,k=q;return l(),w("div",null,[c(r,{title:"\u81EA\u5B9A\u4E49\u5750\u6807\u7CFB",onTopBarClick:e.topBarClick},null,8,["onTopBarClick"]),c(h,{size:"small","row-selection":e.rowSelection,columns:e.columns,"data-source":e.tableData,pagination:!1,rowKey:"name",scroll:e.scrollRef},{bodyCell:d(({text:y,column:o,record:g})=>[o.key?(l(),m(C,{key:0,case:o.key},{operation:d(()=>[c(t,{currentRow:g,onDoActionClick:e.doActionClick,"default-menus":e.getRightDefaultMenus(g),"append-menus":e.getRightMoreMenus(g)},null,8,["currentRow","onDoActionClick","default-menus","append-menus"])]),_:2},1032,["case"])):$("",!0)]),_:1},8,["row-selection","columns","data-source","scroll"]),c(k,{style:{"text-align":"right","margin-top":"5px"},totalCount:e.totalCount,pagesize:e.PageSize,pageindex:e.PageIndex,onPageChange:e.pageChange,onSizeChange:e.sizeChange},null,8,["totalCount","pagesize","pageindex","onPageChange","onSizeChange"])])}const Qe=M(Pe,[["render",Ve]]);export{Qe as default};