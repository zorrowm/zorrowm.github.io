import{c as C,u as X,V as Y,a0 as B,F as T,q as H,e as d,O as J,i as h,j as F,k as g,a1 as K,M as W,a2 as P,h as Z,G as _,m as $,a3 as ee,L as le,a4 as oe,A as ae}from"./quasar-exp-BsaNoQ7w.js";import{B as ne}from"./BaseContent-Bj_GXZNN.js";import"./xframelib-exp-CMLeiWD4.js";import{_ as j,b as te}from"./index-BQ7ovaqR.js";import{B as ie}from"./BtnDel-DMuq8vVt.js";import{d as I,b as f,e as M,j as o,a4 as a,ac as s,a7 as k,l as i,c as U,r as m,f as v,k as c,v as x,F as re,ab as se,a1 as ue}from"./@vue-exp-Bws36Ke9.js";import"./vue-router-exp-CO9L2VdX.js";import"./axios-exp-C7rfqWEd.js";import"./vendor-DJm_4oaR.js";import"./lottie-web-exp-CIY4INm7.js";import"./monaco-editor-exp-BNK_u0iZ.js";import"./@iconify/vue-exp-Q9Q0SWJB.js";import"./xgis-cesium-exp-Hv7oMXHX.js";const de=I({name:"EllipsisValue",__name:"EllipsisValue",props:{value:{type:String,required:!1},length:{type:Number,required:!1,default:25}},setup(w,{expose:l}){l();const p=w;function e(u,n=25){return u?u.length>n?`${u.slice(0,n)}...`:u:""}const b={props:p,ellipsis:e};return Object.defineProperty(b,"__isScriptSetup",{enumerable:!1,value:!0}),b}});function me(w,l,p,e,b,u){return f(),M("div",null,[o(C,{anchor:"bottom middle",self:"top middle"},{default:a(()=>[s(k(e.props.value),1)]),_:1}),i("span",null,k(e.ellipsis(e.props.value,e.props.length)),1)])}const ce=j(de,[["render",me],["__file","EllipsisValue.vue"]]),fe=I({name:"FitTable",__name:"FitTable",setup(w,{expose:l}){l();const p=X(),e=te(),b=U(()=>e.showTabMenu?"padding-bottom: 30px;":""),u=m({sortBy:"desc",descending:!1,page:1,rowsPerPage:100}),n=U(()=>Math.ceil(V.value.length/u.value.rowsPerPage)),r=m(""),y=m([]),Q=m([{name:"name",required:!0,label:"Dessert (100g serving)",align:"left",field:t=>t.name,format:t=>`${t}`,sortable:!0},{name:"calories",align:"center",label:"Calories",field:"calories",sortable:!0},{name:"fat",label:"Fat (g)",field:"fat",sortable:!0},{name:"carbs",label:"Carbs (g)",field:"carbs"},{name:"protein",label:"Protein ",field:"protein"},{name:"sodium",label:"Sodium (mg)",field:"sodium"},{name:"calcium",label:"Calcium (%)",field:"calcium",sortable:!0},{name:"iron",label:"Iron (%)",field:"iron",sortable:!0},{name:"opt",align:"center",label:"操作",field:"opt"}]),V=m([]);for(let t=0;t<500;t++)V.value.push({name:"Frozen Yogurt "+t,calories:Math.floor(Math.random()*100)+1,fat:6,carbs:24,protein:"免费的设计资料-包括图标,照片,UX 插画和视频配乐",sodium:87,calcium:"14%",iron:"1%"});const S=m([]),q=m("新建"),D=m({}),E=m(void 0);Q.value.forEach(({name:t})=>{S.value.push(t)});function z(){const t=`确认删除这 ${y.value.length} 条记录吗？`;p.dialog({title:"批量删除",message:t,cancel:!0,persistent:!0}).onOk(()=>{}).onOk(()=>{}).onCancel(()=>{}).onDismiss(()=>{})}function N(){}function O(t){}function L(t){q.value="编辑",D.value={...t.value},E.value&&E.value.show()}function R(t){}function G(){}const A={$q:p,appState:e,sizeStyle:b,pagination:u,pagesNumber:n,filter:r,selected:y,columns:Q,rows:V,group:S,editType:q,form:D,dialogRef:E,showConfirm:z,add:N,del:O,edit:L,design:R,submit:G,BaseContent:ne,BtnDel:ie,EllipsisValue:ce};return Object.defineProperty(A,"__isScriptSetup",{enumerable:!1,value:!0}),A}}),pe={class:"row no-wrap full-width"},be={class:"q-gutter-xs"},ge={class:"full-width row justify-center"},_e={class:"view_title justify-between q-px-md"},ve={class:"row q-col-gutter-x-md dialog_form q-pa-md"},Fe={class:"col-12"},we={class:"col-12"},ye={class:"row justify-center q-pa-md"};function Ce(w,l,p,e,b,u){return f(),v(e.BaseContent,{class:"q-pa-sm",style:ue(e.sizeStyle)},{default:a(()=>[o(Y,{class:"fit sticky-header-table",selection:"multiple",selected:e.selected,"onUpdate:selected":l[4]||(l[4]=n=>e.selected=n),dense:e.$q.screen.lt.md,separator:"cell",flat:"",bordered:"",rows:e.rows,filter:e.filter,columns:e.columns,"row-key":"name","visible-columns":e.group,pagination:e.pagination,"onUpdate:pagination":l[5]||(l[5]=n=>e.pagination=n)},{top:a(n=>[i("div",pe,[o(B,{clearable:"",outlined:"",dense:"",placeholder:"请输入关键字搜索",class:"on-left",debounce:"300",modelValue:e.filter,"onUpdate:modelValue":l[0]||(l[0]=r=>e.filter=r)},{append:a(()=>[o(T,{name:"search"})]),_:1},8,["modelValue"]),o(H),i("div",be,[o(d,{icon:"add","no-wrap":"",color:"primary",label:"新建",onClick:e.add}),c(o(d,{disable:e.selected.length===0,"no-wrap":"",color:"negative",label:"批量删除",onClick:l[1]||(l[1]=r=>e.showConfirm()),icon:"delete_outline"},null,8,["disable"]),[[x,e.$q.screen.gt.sm]]),c(o(d,{color:"primary",label:"切换全屏","no-wrap":"",onClick:n.toggleFullscreen,icon:n.inFullscreen?"fullscreen_exit":"fullscreen"},null,8,["onClick","icon"]),[[x,e.$q.screen.gt.sm]]),c(o(J,{color:"primary",label:"自选列",icon:"view_list","no-wrap":""},{default:a(()=>[o(h,null,{default:a(()=>[(f(!0),M(re,null,se(e.columns,r=>(f(),v(F,{tag:"label",key:r.name},{default:a(()=>[o(g,{avatar:""},{default:a(()=>[o(K,{modelValue:e.group,"onUpdate:modelValue":l[2]||(l[2]=y=>e.group=y),val:r.name},null,8,["modelValue","val"])]),_:2},1024),o(g,null,{default:a(()=>[o(W,null,{default:a(()=>[s(k(r.label),1)]),_:2},1024)]),_:2},1024)]),_:2},1024))),128))]),_:1})]),_:1},512),[[x,e.$q.screen.gt.sm]])])])]),"body-cell-protein":a(n=>[o(P,{key:"protein",props:n},{default:a(()=>[o(e.EllipsisValue,{value:n.row.protein,length:10},null,8,["value"])]),_:2},1032,["props"])]),"body-cell-opt":a(n=>[o(P,{props:n,"auto-width":!0},{default:a(()=>[o(d,{flat:"",round:"",dense:"",color:"primary",icon:"edit",onClick:r=>e.edit(n.row)},{default:a(()=>[o(C,null,{default:a(()=>l[8]||(l[8]=[s("编辑")])),_:1})]),_:2},1032,["onClick"]),o(d,{flat:"",round:"",dense:"",color:"primary",icon:"mdi-image-edit-outline",onClick:r=>e.design(n.row)},{default:a(()=>[o(C,null,{default:a(()=>l[9]||(l[9]=[s("视图设计")])),_:1})]),_:2},1032,["onClick"]),o(e.BtnDel,{label:"视图",onConfirm:r=>e.del(n.row)},null,8,["onConfirm"]),o(d,{flat:"",round:"",dense:"",color:"primary",icon:"mdi-more"},{default:a(()=>[o(C,null,{default:a(()=>l[10]||(l[10]=[s("更多")])),_:1}),o(Z,null,{default:a(()=>[o(h,{style:{"min-width":"100px"}},{default:a(()=>[c((f(),v(F,{clickable:""},{default:a(()=>[o(g,null,{default:a(()=>l[11]||(l[11]=[s("发布服务")])),_:1})]),_:1})),[[_]]),c((f(),v(F,{clickable:""},{default:a(()=>[o(g,null,{default:a(()=>l[12]||(l[12]=[s("新建索引")])),_:1})]),_:1})),[[_]]),o($),c((f(),v(F,{clickable:""},{default:a(()=>[o(g,null,{default:a(()=>l[13]||(l[13]=[s("清理缓存")])),_:1})]),_:1})),[[_]]),c((f(),v(F,{clickable:""},{default:a(()=>[o(g,null,{default:a(()=>l[14]||(l[14]=[s("新增数据")])),_:1})]),_:1})),[[_]])]),_:1})]),_:1})]),_:1})]),_:2},1032,["props"])]),bottom:a(()=>[i("div",ge,[o(ee,{modelValue:e.pagination.page,"onUpdate:modelValue":l[3]||(l[3]=n=>e.pagination.page=n),input:"",max:e.pagesNumber},null,8,["modelValue","max"])])]),_:1},8,["selected","dense","rows","filter","columns","visible-columns","pagination"]),o(le,{maximized:"",flat:"",persistent:"",ref:"dialogRef"},{default:a(()=>[o(oe,{onSubmit:e.submit,class:"dialog_card column"},{default:a(()=>[i("h5",_e,[s(k(e.editType)+"视图 ",1),c(o(d,{dense:"",outline:"",round:"",icon:"clear",size:"sm"},null,512),[[_]])]),o(ae,{class:"col"},{default:a(()=>[i("div",ve,[i("div",Fe,[i("h5",null,[o(T,{name:"star",color:"red"}),l[15]||(l[15]=s("名称： "))]),o(B,{outlined:"",dense:"",modelValue:e.form.name,"onUpdate:modelValue":l[6]||(l[6]=n=>e.form.name=n),type:"text"},null,8,["modelValue"])]),i("div",we,[l[16]||(l[16]=i("h5",null,"描述：",-1)),o(B,{outlined:"",dense:"",modelValue:e.form.protein,"onUpdate:modelValue":l[7]||(l[7]=n=>e.form.protein=n),type:"text"},null,8,["modelValue"])]),l[17]||(l[17]=i("div",{class:"col-12"},[i("h5",null,"目录编号：")],-1))])]),_:1}),i("div",ye,[c(o(d,{outline:"",color:"primary",icon:"mdi-close-thick",label:"关闭"},null,512),[[_]]),o(d,{class:"q-mx-sm",color:"primary",icon:"mdi-check-bold",label:"提交",type:"submit"})])]),_:1})]),_:1},512)]),_:1},8,["style"])}const Ue=j(fe,[["render",Ce],["__scopeId","data-v-45d18ab1"],["__file","FitTable.vue"]]);export{Ue as default};