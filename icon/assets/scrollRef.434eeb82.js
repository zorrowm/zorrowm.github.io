import{d as F,ag as m,ah as A,c as h,t as B,o as e,b as i,F as f,x as k,v as a,l as t,k as c,g as N,C,D as v,j as V,ai as b,aj as D,ak as E,al as L,am as R}from"./vendor.fba62f44.js";import{I as j}from"./@iconify/vue-exp.2703a4cd.js";import{_ as x}from"./index.a7a016cc.js";import{L as g}from"./layoutTool.5f32478f.js";const T=F({components:{Icon:j},props:{defaultMenus:m().def([]),appendMenus:m().def([]),currentRow:A().def(null)},setup(o,{emit:l}){const p=h(()=>o.appendMenus.length>0);return{doClick:_=>{l("doActionClick",_,o.currentRow)},hasAppendMenus:p}}});const H={style:{width:"110px"}},S=["onClick"];function W(o,l,p,y,_,q){const s=B("Icon"),d=b,I=D,M=E,$=L,w=R;return e(),i("div",null,[(e(!0),i(f,null,k(o.defaultMenus,(n,u)=>(e(),a(I,{placement:"bottom",title:n.name,key:u},{default:t(()=>[n.isdelete?(e(),a(d,{key:0,style:{width:"200px"},title:"\u786E\u8BA4\u5220\u9664\uFF1F",onConfirm:r=>o.doClick(n.value)},{default:t(()=>[c(s,{icon:n.icon,class:"operationIcon"},null,8,["icon"])]),_:2},1032,["onConfirm"])):(e(),a(s,{key:1,icon:n.icon,class:"operationIcon",onClick:r=>o.doClick(n.value)},null,8,["icon","onClick"]))]),_:2},1032,["title"]))),128)),o.hasAppendMenus?(e(),a(w,{key:0,placement:"bottom"},{overlay:t(()=>[c($,null,{default:t(()=>[(e(!0),i(f,null,k(o.appendMenus,(n,u)=>(e(),a(M,{command:u,key:u},{default:t(()=>[N("div",H,[n.isdelete||n.value==="delete"?(e(),a(d,{key:0,title:"\u786E\u8BA4\u5220\u9664\uFF1F",onConfirm:r=>o.doClick(n.value)},{default:t(()=>[c(s,{icon:n.icon,class:"operationIcon"},null,8,["icon"]),C(v(n.name),1)]),_:2},1032,["onConfirm"])):(e(),i("div",{key:1,onClick:r=>o.doClick(n.value)},[c(s,{icon:n.icon,class:"operationIcon"},null,8,["icon"]),C(" "+v(n.name),1)],8,S))])]),_:2},1032,["command"]))),128))]),_:1})]),default:t(()=>[c(s,{icon:"ant-design:ellipsis-outlined",class:"operationIcon"})]),_:1})):V("",!0)])}const O=x(T,[["render",W]]),P=h(()=>{const o=g.getContentWidth(20),l=g.getContentHeight(70);return{x:o,y:l}});export{O as _,P as s};