const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./index--rQeSEXZ.js","./index-jafnMoOd.js","./vendor-CcHNtcKJ.js","./@hprose-exp-CYjcO8Nw.js","./@vue-exp-DTehQd6t.js","./vendor-BOfeNwJc.css","./xframelib-exp-CxzDUbp4.js","./axios-exp-B_zfNCMU.js","./@iconify/vue-exp-Ct1khs4G.js","./xframelib-exp-DEz_MDSr.css","./vue-router-exp-B0kidEOa.js","./index-C-qRGThU.css"])))=>i.map(i=>d[i]);
import{ai as W,C as Q,$ as q,ab as H,W as b,T as R,aa as V,O as j,G,ac as N,A as U,J as F,B as z,_ as J}from"./vendor-CcHNtcKJ.js";import{B as y,s as T}from"./xframelib-exp-CxzDUbp4.js";import{r as S,d as m,_ as w,X as d,$ as f,ad as B,F as k,a0 as C,ae as $,aa as h,a2 as I,c as u,a6 as _,b as D,D as X,E as Y,Y as v,a as K,a1 as Z,G as ee}from"./@vue-exp-DTehQd6t.js";import{_ as x,O as te,f as ne}from"./index-jafnMoOd.js";import{b as ae,u as re}from"./vue-router-exp-B0kidEOa.js";import"./@hprose-exp-CYjcO8Nw.js";import"./axios-exp-B_zfNCMU.js";import"./@iconify/vue-exp-Ct1khs4G.js";const O="scrollToExampleItem";function P(s){return!!(s.children&&s.children.length>0&&s.children[0].path===void 0)}const A=S(""),ie=m({__name:"ContentItem",props:{contentList:{type:Array,required:!1,default:()=>[]}},emits:["itemClicked"],setup(s,{expose:o,emit:r}){o();const e=r;function l(i){e("itemClicked",i)}const a={emit:e,doCardClick:l,get isMenuGroup(){return P}};return Object.defineProperty(a,"__isScriptSetup",{enumerable:!1,value:!0}),a}}),oe=["id"],le={key:0,class:"groupDescription shadow-2"},se={class:"row q-gutter-sm justify-start"},de=["src"],ue={class:"text-h6 text-weight-light q-pb-sm"},ce={key:0,class:"text-subtitle2 text-wrap",style:{"max-width":"300px","min-height":"50px"}},_e={class:"text-h4 text-weight-bold q-ma-md"},pe={key:0,class:"groupDescription shadow-2"};function fe(s,o,r,e,l,a){const i=w("content-item",!0);return d(!0),f(k,null,B(r.contentList,(t,n)=>(d(),f("div",{key:n},[e.isMenuGroup(t)?(d(),f(k,{key:1},[C("div",_e,[$(h(t.name)+" ",1),t.description?(d(),f("div",pe,h(t.description),1)):I("",!0)]),u(q,{size:"3px"}),u(i,{"content-list":t.children,onItemClicked:e.doCardClick},null,8,["content-list"])],64)):(d(),f(k,{key:0},[C("div",{id:t.name,class:"text-h5 text-weight-bold q-ma-lg"},[$(h(t.name)+" ",1),t.description?(d(),f("div",le,h(t.description),1)):I("",!0)],8,oe),C("div",se,[(d(!0),f(k,null,B(t.children,(p,L)=>(d(),f("div",{key:L},[u(Q,{onClick:M=>e.doCardClick(p)},{default:_(()=>[u(W,{style:{width:"300px","min-width":"300px",height:"200px"}},{default:_(()=>[C("img",{src:p.icon,style:{width:"100%",height:"100%","object-fit":"cover",margin:"auto"}},null,8,de)]),_:2},1024),u(W,null,{default:_(()=>[C("div",ue,h(p.name),1),p.description?(d(),f("div",ce,h(p.description),1)):I("",!0)]),_:2},1024)]),_:2},1032,["onClick"])]))),128))])],64))]))),128)}const me=x(ie,[["render",fe],["__file","ContentItem.vue"]]),he=m({__name:"ContentList",props:{data:{type:Array,required:!0}},emits:["contentItemClicked"],setup(s,{expose:o,emit:r}){o();const e=r,l=S();function a(n){A.value=n;const p=document.getElementById(n);l.value?.scrollTo({top:p?.offsetTop,behavior:"smooth"})}function i(n){e("contentItemClicked",n)}D(()=>{y.EventBus.on(O,a)}),X(()=>{y.EventBus.off(O,a)});const t={emit:e,contentExampleListContainerRef:l,scrollScreenTo:a,itemClickHandler:i,contentItem:me};return Object.defineProperty(t,"__isScriptSetup",{enumerable:!1,value:!0}),t}}),ve={ref:"contentExampleListContainerRef",class:"contentExampleListContainer"};function ge(s,o,r,e,l,a){return d(),f("div",ve,[u(e.contentItem,{"content-list":r.data,onItemClicked:e.itemClickHandler},null,8,["content-list"])],512)}const ye=x(he,[["render",ge],["__file","ContentList.vue"]]),xe=m({name:"BaseMenuItem"}),Ce=m({...xe,props:{menuList:{default:()=>[]},initLevel:{default:0},duration:{default:150}},setup(s,{expose:o}){o();const r=t=>{y.EventBus.emit(O,t.name)};function e(t){return t.name===A.value}function l(t){if(P(t)){let n=0;return t.children?.forEach(p=>{n+=l(p)}),n}else return t.children?t.children?.length:0}function a(t){const n=l(t);return`${t.name} (${n})`}const i={handleMenuClick:r,isActived:e,getMenuNum:l,getMenuLabel:a,get isMenuGroup(){return P}};return Object.defineProperty(i,"__isScriptSetup",{enumerable:!1,value:!0}),i}});function ke(s,o,r,e,l,a){const i=w("Icon"),t=w("BaseSideMenuItem",!0);return d(!0),f(k,null,B(r.menuList,(n,p)=>(d(),f("div",{key:p,class:"base-menu-item"},[n.path?I("",!0):(d(),f(k,{key:0},[e.isMenuGroup(n)?(d(),v(V,{key:1,duration:r.duration,"default-opened":!0,"header-inset-level":r.initLevel},{header:_(()=>[u(b,{avatar:""},{default:_(()=>[u(i,{icon:n.icon},null,8,["icon"])]),_:2},1024),u(b,null,{default:_(()=>[$(h(e.getMenuLabel(n)),1)]),_:2},1024)]),default:_(()=>[n.children?(d(),v(t,{key:0,menuList:n.children,"init-level":r.initLevel+.2,duration:r.duration},null,8,["menuList","init-level","duration"])):I("",!0)]),_:2},1032,["duration","header-inset-level"])):Y((d(),v(R,{key:0,active:e.isActived(n),clickable:"","inset-level":r.initLevel,"active-class":"baseItemActive",onClick:L=>e.handleMenuClick(n)},{default:_(()=>[u(b,{avatar:""},{default:_(()=>[u(i,{icon:n.icon},null,8,["icon"])]),_:2},1024),u(b,null,{default:_(()=>[C("span",null,h(e.getMenuLabel(n)),1)]),_:2},1024)]),_:2},1032,["active","inset-level","onClick"])),[[H]])],64))]))),128)}const Ie=x(Ce,[["render",ke],["__scopeId","data-v-3c2f59a3"],["__file","BaseSideMenuItem.vue"]]),Le=m({name:"ExampleSideMenu"}),be=m({...Le,props:{data:{type:Array,required:!1,default:()=>[]}},setup(s,{expose:o}){o();const e={thumbStyle:{right:"1px",borderRadius:"5px",backgroundColor:"#616161",width:"5px"},BaseSideMenuItem:Ie};return Object.defineProperty(e,"__isScriptSetup",{enumerable:!1,value:!0}),e}});function Se(s,o,r,e,l,a){return d(),v(G,{"thumb-style":e.thumbStyle},{default:_(()=>[u(j,null,{default:_(()=>[u(e.BaseSideMenuItem,{"menu-list":r.data},null,8,["menu-list"])]),_:1})]),_:1})}const Me=x(be,[["render",Se],["__file","index.vue"]]),Ee=m({__name:"index",props:{data:{type:Array,required:!0}},emits:["contentItemClicked"],setup(s,{expose:o,emit:r}){o();const e=r,l=S(!1),a=()=>{l.value=!l.value},i=K(()=>l.value?"menu_open":"menu");function t(p){e("contentItemClicked",p)}const n={emit:e,leftDrawerOpen:l,toggleLeftDrawer:a,getRightIcon:i,doItemClickHandler:t,ContentList:ye,ExampleSideMenu:Me};return Object.defineProperty(n,"__isScriptSetup",{enumerable:!1,value:!0}),n}});function we(s,o,r,e,l,a){return d(),v(z,{view:"hHh lpR fFf"},{default:_(()=>[u(N,{modelValue:e.leftDrawerOpen,"onUpdate:modelValue":o[0]||(o[0]=i=>e.leftDrawerOpen=i),"show-if-above":"",side:"left",bordered:""},{default:_(()=>[u(e.ExampleSideMenu,{data:r.data,style:{height:"calc(100% - 50px)"}},null,8,["data"])]),_:1},8,["modelValue"]),u(U,null,{default:_(()=>[u(F,{flat:"",dense:"",round:"","aria-label":"Menu",class:"menuBtn",icon:e.getRightIcon,onClick:o[1]||(o[1]=i=>e.toggleLeftDrawer())},null,8,["icon"]),u(e.ContentList,{data:r.data,onContentItemClicked:e.doItemClickHandler},null,8,["data"])]),_:1})]),_:1})}const Be=x(Ee,[["render",we],["__scopeId","data-v-70c1ebe8"],["__file","index.vue"]]),$e=m({name:"TransitionSlide",props:{enter:{type:String,default:"fadeIn"},leave:{type:String,default:"fadeOut"},duration:{type:Number,default:1e3},appear:{type:Boolean,default:!0}}});function Oe(s,o,r,e,l,a){return d(),v(ee,{mode:"out-in",name:"animate__slide",duration:s.duration,appear:s.appear,"enter-active-class":`animated ${s.enter}`,"leave-active-class":`animated ${s.leave}`},{default:_(()=>[Z(s.$slots,"default")]),_:3},8,["duration","appear","enter-active-class","leave-active-class"])}const Pe=x($e,[["render",Oe],["__file","TransitionSlide.vue"]]),g="frontLayoutWidget",We=m({__name:"index",setup(s,{expose:o}){o();const r=ae(),e=re(),l=S();J(()=>import("./index--rQeSEXZ.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10,11]),import.meta.url).then(c=>{l.value=c.default});let a,i;function t(c){y.LayoutMap.has(g)&&(i=y.LayoutMap.get(g),ne(T.LayoutContainerLoaded,t),n&&i.unloadWidget(n),a.single?i.loadWidget(a.path):p())}let n="";function p(c){i&&a?.path?(i.loadWidget(a.path),n=a.path):a.path}function L(c){a=c;const E=y.LayoutMap.get("productLayout");c.path&&r.query?.wid!=c.path&&!a.single&&e.push({query:{wid:c.path}}),E.isWidgetLoaded(g)?(i=y.LayoutMap.get(g),i&&(n&&i.unloadWidget(n),a.single,i.loadWidget(a.path)),E.getWidgetComponent(g).changeVisible(!0)):(te(T.LayoutContainerLoaded,t),E.loadWidget(g).then(()=>{}))}D(()=>{const c=r.query?.wid;c&&setTimeout(()=>{L({path:c})},500)});const M={route:r,router:e,apiExamplesList:l,get currentItem(){return a},set currentItem(c){a=c},get layoutManagerExamples(){return i},set layoutManagerExamples(c){i=c},layoutWidgetID:g,initHandler:t,get lastWidgetPath(){return n},set lastWidgetPath(c){n=c},mapLoadedHandler:p,doItemClickHandler:L,APIExamplePanel:Be,TransitionSlide:Pe};return Object.defineProperty(M,"__isScriptSetup",{enumerable:!1,value:!0}),M}});function Te(s,o,r,e,l,a){return d(),v(e.TransitionSlide,{enter:"fadeInUp",leave:"fadeOutUp"},{default:_(()=>[e.apiExamplesList?(d(),v(e.APIExamplePanel,{key:0,data:e.apiExamplesList,onContentItemClicked:e.doItemClickHandler},null,8,["data"])):I("",!0)]),_:1})}const Ge=x(We,[["render",Te],["__file","index.vue"]]);export{Ge as default};