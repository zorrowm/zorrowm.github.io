import{_ as d}from"./index.93c0bcf5.js";import{d as C,r as f,w as h,y as k,E as y,o as p,b as P,k as g,l as u,v as b,g as z,D as S,j as w,ad as x}from"./vendor.fba62f44.js";import{_}from"./VSwitch.433f46f5.js";import{b as D}from"./IconService.68577bd3.js";import{j as I,_ as v}from"./index.a7a016cc.js";import{l as $}from"./TabColumns.a669dbcd.js";import{b as B}from"./vue-router-exp.aea90ceb.js";import{O as V}from"./urlUtils.9fcd62bb.js";import"./lodash-es-exp.5cb72cd8.js";import"./xframelib-exp.abb6dc89.js";import"./axios-exp.a055fae1.js";import"./@iconify/vue-exp.2703a4cd.js";const j=C({name:"",components:{Pagination:d,VSwitch:_},props:{data:{type:Object,default:{}},extra:{}},setup(e){const a=f({tableData:[],PageIndex:1,PageSize:10,totalCount:0,keyword:"",sortname:"",sortway:0}),c=I();function o(t,s){D(t,s,c.status,a.PageIndex,a.PageSize).then(n=>{a.totalCount=n.totalCount,a.tableData=n.items})}h(()=>e.data.name,()=>{a.PageIndex=1,o("",e.data.name)});const l=t=>{a.PageSize=t,o("",e.data.name)},m=t=>{a.PageIndex=t,o("",e.data.name)};k(()=>{o("",e.data.name)});const i=B();function r(t){V(i,"/detail",{prefix:t})}return{columns:$,...y(a),sizeChange:l,pageChange:m,prefixClick:r}}}),N=["onClick"];function O(e,a,c,o,l,m){const i=_,r=x,t=d;return p(),P("div",null,[g(r,{size:"small",columns:e.columns,"data-source":e.tableData,pagination:!1,rowKey:"name"},{bodyCell:u(({text:s,column:n,record:R})=>[n.key?(p(),b(i,{key:0,case:n.key},{prefix:u(()=>[z("span",{onClick:E=>e.prefixClick(s),style:{color:"blue",cursor:"pointer"}},S(s),9,N)]),_:2},1032,["case"])):w("",!0)]),_:1},8,["columns","data-source"]),g(t,{style:{"text-align":"right","margin-top":"5px"},totalCount:e.totalCount,pagesize:e.PageSize,pageindex:e.PageIndex,onPageChange:e.pageChange,onSizeChange:e.sizeChange},null,8,["totalCount","pagesize","pageindex","onPageChange","onSizeChange"])])}const W=v(j,[["render",O]]);export{W as default};