import{W as x,aa as oe,O as $,T as F,Z as le,$ as se,a0 as ie,J as W,H as R,ab as ce,G as ue,a9 as de,B as pe,ac as fe}from"./vendor-CcHNtcKJ.js";import{B as w,h as he,i as q}from"./xframelib-exp-CxzDUbp4.js";import{c as G,_ as M,d as _e,u as me,p as ve}from"./index-jafnMoOd.js";import{b as B,u as A}from"./vue-router-exp-B0kidEOa.js";import{d as Q,A as I,a as b,w as ge,b as Se,r as S,_ as U,X as u,Y as m,a6 as d,c as h,a3 as be,ae as V,aa as j,a1 as z,$ as k,F as y,ad as T,E as P,a4 as D,a2 as J,ag as ke,e as we,a0 as O,ah as ye}from"./@vue-exp-DTehQd6t.js";import{O as Ie}from"./urlUtils-dFpGY-z-.js";import{L as Me}from"./layoutTool-8OZw57qQ.js";import{W as Ce}from"./WidgetsEvent-e0lOKT5_.js";import"./@hprose-exp-CYjcO8Nw.js";import"./axios-exp-B_zfNCMU.js";import"./@iconify/vue-exp-Ct1khs4G.js";const Le=Q({__name:"ItemMultiple",props:{trueItem:{default:function(){return null},type:Object},initLevel:{type:Number,default:0}},setup(a,{expose:i}){i();const c=G(),e=B(),o=a,{trueItem:l,initLevel:t}=I(o),r=b(()=>c.leftCollapsed&&!c.overlayMenu?"margin-left:-16px":"");ge(e,()=>{v()}),Se(()=>{v()});const s=S(!1),v=()=>{for(let n of l.value.children)if(n.path===e.path||n.parent_code===e.name){s.value=!0;return}s.value=!1},g={appState:c,route:e,props:o,trueItem:l,initLevel:t,shortStyle:r,itemOpen:s,changeOpen:v};return Object.defineProperty(g,"__isScriptSetup",{enumerable:!1,value:!0}),g}});function xe(a,i,c,e,o,l){const t=U("Icon");return u(),m(oe,{modelValue:e.itemOpen,"onUpdate:modelValue":i[0]||(i[0]=r=>e.itemOpen=r),group:e.trueItem.name,"header-inset-level":e.initLevel},{header:d(()=>[h(x,{avatar:"",style:be(e.shortStyle)},{default:d(()=>[h(t,{icon:e.trueItem.meta?.icon},null,8,["icon"])]),_:1},8,["style"]),h(x,{style:{"margin-left":"-10px"}},{default:d(()=>[V(j(e.trueItem.meta?.title??e.trueItem.label),1)]),_:1})]),default:d(()=>[z(a.$slots,"default")]),_:3},8,["modelValue","group","header-inset-level"])}const N=M(Le,[["render",xe],["__file","ItemMultiple.vue"]]);var _=(a=>(a[a.Widget=0]="Widget",a[a.Route=1]="Route",a[a.URL=2]="URL",a[a.Action=3]="Action",a))(_||{});const Re=Q({__name:"PageMenu",props:{data:{type:Array,required:!0}},setup(a,{expose:i}){i();const c=a,e=S(c.data),o=A(),l=B();function t(n){if(n.children){let f=!1;if(n.children.forEach(p=>{if(p.name===l.name||p.path===l.path){f=!0;return}}),f)return" pagemenuActive"}else if(n.name==l.name||n.path===l.path)return"pagemenuActive";return""}const r=S();function s(n,f){const p=n.label;if(r.value)r.value.label!=p&&(r.value.state=!1),r.value=n,n.state=f;else{r.value=n,n.state=f;return}}function v(n){if(!(!n||n.children)&&(n.path||n.name))switch(n.kind){case void 0:case _.Route:n.blank?Ie(o,n.path,{}):n.name?o.push({name:n.name}):n.path&&o.push({path:n.path});break;case _.URL:window.open(n.path,"_blank");break;case _.Action:w.EventBus.emit("IPageMenu.Action",n);break;case _.Widget:w.EventBus.emit("LayoutLoadWidget",n);break}}const g={props:c,dataRef:e,router:o,route:l,getSelectedStyle:t,currentItem:r,setShowState:s,menuClickHandler:v};return Object.defineProperty(g,"__isScriptSetup",{enumerable:!1,value:!0}),g}}),Be={class:"row gt-xs q-py-md q-gutter-xs"};function Oe(a,i,c,e,o,l){return u(),k("div",Be,[(u(!0),k(y,null,T(e.dataRef,(t,r)=>(u(),k(y,{key:t.label},[t.children?(u(),m(ie,{key:0,"model-value":t.state,"onUpdate:modelValue":s=>t.state=s,"transition-show":"flip-right","transition-hide":"flip-left",flat:"",label:t.label,class:D([e.getSelectedStyle(t),"pageMenuItem"]),onMouseover:s=>e.setShowState(t,!0)},{default:d(()=>[h($,{style:{"min-width":"100px"},onMouseover:s=>e.setShowState(t,!0),onMouseleave:s=>e.setShowState(t,!1)},{default:d(()=>[(u(!0),k(y,null,T(t.children,(s,v)=>(u(),k(y,{key:s.label},[P((u(),m(F,{clickable:"",class:D([e.getSelectedStyle(s),"pageMenuItem"]),onClick:g=>e.menuClickHandler(s)},{default:d(()=>[h(x,null,{default:d(()=>[V(j(s.label),1)]),_:2},1024)]),_:2},1032,["class","onClick"])),[[le]]),h(se)],64))),128))]),_:2},1032,["onMouseover","onMouseleave"])]),_:2},1032,["model-value","onUpdate:modelValue","label","class","onMouseover"])):(u(),m(W,{key:1,flat:"",label:t.label,class:D([e.getSelectedStyle(t),"pageMenuItem"]),onClick:s=>e.menuClickHandler(t),onMouseover:s=>e.setShowState(t,!1)},null,8,["label","class","onClick","onMouseover"]))],64))),128))])}const De=M(Re,[["render",Oe],["__file","PageMenu.vue"]]),Ae={__name:"ItemSingle",props:{trueItem:{default:function(){return{}},type:Object},initLevel:{type:Number,default:0}},setup(a,{expose:i}){i();const c=R(),e=b(()=>c.dark.isActive?"bg-grey-10 text-white":"bg-primary text-white"),o=A(),l=B(),t=a,{trueItem:r,initLevel:s}=I(t),v=f=>{if(f.kind){const p=f;switch(p.kind){case _.Route:p.blank?OpenURL(o,p.path,{}):p.name?o.push({name:p.name}):p.path&&o.push({path:p.path});break;case _.URL:window.open(p.path,"_blank");break;case _.Action:Global.EventBus.emit("IPageMenu.Action",p);break;case _.Widget:Global.EventBus.emit("LayoutLoadWidget",p);break}}else f.path&&q(f.path)||f.link?window.open(f.path):o.push({name:f.name})},g=b(()=>l.name===r.value.name||l.path===r.value.path),n={$q:c,darkThemeSideBar:e,router:o,route:l,props:t,trueItem:r,initLevel:s,toPath:v,checkActive:g,computed:b,toRefs:I,get useRoute(){return B},get useRouter(){return A},get H5Tool(){return he},get isValidURL(){return q},get useQuasar(){return R},get EnumPageMenu(){return _}};return Object.defineProperty(n,"__isScriptSetup",{enumerable:!1,value:!0}),n}};function Te(a,i,c,e,o,l){const t=U("Icon");return P((u(),m(F,{clickable:"",exact:"","inset-level":e.initLevel,active:e.checkActive,"active-class":a.darkThemeSelect,onClick:i[0]||(i[0]=r=>e.toPath(e.trueItem))},{default:d(()=>[h(x,{avatar:""},{default:d(()=>[h(t,{icon:e.trueItem.meta?.icon??e.trueItem.icon},null,8,["icon"])]),_:1}),h(x,{style:{"margin-left":"-10px"}},{default:d(()=>[V(j(e.trueItem.meta?.title??e.trueItem.label),1)]),_:1})]),_:1},8,["inset-level","active","active-class"])),[[ce]])}const E=M(Ae,[["render",Te],["__scopeId","data-v-77886570"],["__file","ItemSingle.vue"]]),Pe={__name:"SideMenuBarItem",props:{childrenItem:{default:function(){return{}},type:Object},initLevel:{type:Number,default:0}},setup(a,{expose:i}){i();const c=a,{childrenItem:e,initLevel:o}=I(c),l=b(()=>e.value.children&&e.value.children.length!==0?N:E),t={props:c,childrenItem:e,initLevel:o,chooseComponent:l,computed:b,toRefs:I,ItemMultiple:N,ItemSingle:E};return Object.defineProperty(t,"__isScriptSetup",{enumerable:!1,value:!0}),t}};function Ue(a,i,c,e,o,l){const t=U("SideMenuBarItem",!0);return u(),m(ke(e.chooseComponent),{"true-item":e.childrenItem,"init-level":e.initLevel},{default:d(()=>[e.childrenItem.children&&e.childrenItem.children.length!==0?(u(!0),k(y,{key:0},T(e.childrenItem.children,r=>(u(),m(t,{key:r.path,"children-item":r,"init-level":e.initLevel+.3},null,8,["children-item","init-level"]))),128)):J("",!0)]),_:1},8,["true-item","init-level"])}const We=M(Pe,[["render",Ue],["__file","SideMenuBarItem.vue"]]),Qe={__name:"index",props:{topMenuChildren:{type:Object||Array,required:!1,default:()=>null}},setup(a,{expose:i}){i();const c=R(),e=b(()=>c.dark.isActive?"bg-grey-10 text-white":"bg-white text-dark"),o=a,{topMenuChildren:l}=I(o);w.Loading("SideMenuBar");const t={$q:c,darkThemeSideBar:e,props:o,topMenuChildren:l,computed:b,toRefs:I,get Global(){return w},get useQuasar(){return R},SideMenuBarItem:We};return Object.defineProperty(t,"__isScriptSetup",{enumerable:!1,value:!0}),t}};function Ve(a,i,c,e,o,l){return u(),m(ue,{style:{height:"calc(100%)"},class:D(e.darkThemeSideBar)},{default:d(()=>[z(a.$slots,"default",{},void 0,!0),h($,{class:"menu-list"},{default:d(()=>[(u(!0),k(y,null,T(e.topMenuChildren,(t,r)=>(u(),m(e.SideMenuBarItem,{key:r,"children-item":t,"init-level":0,style:{}},null,8,["children-item"]))),128))]),_:1})]),_:3},8,["class"])}const je=M(Qe,[["render",Ve],["__scopeId","data-v-4f4fae95"],["__file","index.vue"]]);function He(a){a&&_e(Ce.ModalContainerWidget_LoadModal,a)}const qe=Q({__name:"TopMenuWidget",setup(a,{expose:i}){i();const c=[{label:"首页",icon:"ant-design:home-outlined",kind:_.Route,path:"/index"},{label:"二维大屏",kind:_.Route,path:"/bigscreen"},{label:"API示例",kind:_.Route,path:"/apiexamples"},{label:"开发文档",kind:_.Route,path:"/mdHelp"}],e=S(!1),o=S(!1),l=R(),t=S(w.Config.UI?.SiteTitle),r=G(),s=me(),{leftCollapsed:v}=de(r),g=S(r.headerSetting.centerTitle),n=S(r.headerSetting.showFullScreen),f=S(r.headerSetting.showCollapseIcon);function p(){r.toggleCollapse()}const X=we({headerHeight:Me.getHeaderHeight()}),Y=S(window.document.documentElement),Z=B(),K=()=>{l.dialog({title:"退出",message:"您确定要退出登录吗？",cancel:!0}).onOk(()=>{s.clear(),w.Message.msg("成功退出登录"),window.open(window.location.pathname,"_self")}).onCancel(()=>{})},ee=b(()=>!w.Config.UI?.IsNoLogin);function te(){He({modalID:"changeMyPWD",extraData:{title:"修改密码"},width:500,rowData:void 0})}const C=A();function ne(L){switch(L){case"0":C.push("/index");break;case"2":C.push("/productPage");break;case"4":C.push("/apiexamples");break;case"5":C.push("/wsntest");break}}const ae=b(()=>{const L=ve.children;return L||(w.Message.warn("无法获取路由列表！"),[])});function re(){e.value=!e.value}const H={menuList:c,rightDrawerOpen:e,isShow:o,$q:l,siteTitle:t,appState:r,userState:s,leftCollapsed:v,iscenterTitle:g,showFullScreen:n,showCollapseIcon:f,toggleCollapse:p,state:X,fullScreenElem:Y,route:Z,doLogout:K,isNOLogin:ee,showUserModal:te,router:C,routerPush:ne,topMenuChildren:ae,toggleRightDrawer:re,SideMenuBar:je,get PageMenu(){return De}};return Object.defineProperty(H,"__isScriptSetup",{enumerable:!1,value:!0}),H}}),Ne={class:"row"},Ee={class:"col-11 row justify-end items-center"},$e={class:"col-1 justify-center q-py-md"},Fe={class:"q-gutter-sm row items-center no-wrap"};function Ge(a,i,c,e,o,l){const t=U("Icon"),r=ye("tooltip");return u(),k(y,null,[O("div",Ne,[O("div",Ee,[h(e.PageMenu,{data:e.menuList})]),O("div",$e,[O("div",Fe,[P((u(),m(W,{class:"lt-sm",dense:"",flat:"",size:"md",round:"",onClick:e.toggleRightDrawer},{default:d(()=>[h(t,{icon:"whh:dropmenu",width:"100",height:"100"})]),_:1})),[[r,"菜单列表"]])])])]),e.$q.screen.lt.sm?(u(),m(pe,{key:0,view:"hHH lpR fFf"},{default:d(()=>[h(fe,{modelValue:e.rightDrawerOpen,"onUpdate:modelValue":i[0]||(i[0]=s=>e.rightDrawerOpen=s),side:"right",bordered:""},{default:d(()=>[P((u(),m(W,{dense:"",flat:"",round:"",onClick:e.toggleRightDrawer},{default:d(()=>[h(t,{icon:"codicon:chrome-close"})]),_:1})),[[r,"菜单列表"]]),h(e.SideMenuBar,{"top-menu-children":e.menuList})]),_:1},8,["modelValue"])]),_:1})):J("",!0)],64)}const lt=M(qe,[["render",Ge],["__file","TopMenuWidget.vue"]]);export{lt as default};