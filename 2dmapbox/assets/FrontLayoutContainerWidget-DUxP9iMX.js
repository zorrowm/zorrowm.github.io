import{ah as q,ai as A,x as O,w as X,K as Q,A as $}from"./vendor-qEPl7M71.js";import{_ as I,w as j}from"./index-XTFg7KW3.js";import{u as T,b as z}from"./vue-router-exp-U1sBIDGE.js";import{h as H,N as K,k as U,e as G,B as w,C as J,i as Y}from"./xframelib-exp-CBRV2soX.js";import{e as Z}from"./monaco-editor-exp-B01XOe8A.js";import{d as R,a as f,w as ee,L as P,M,N as i,W as F,a7 as B,o as te,D as W,K as oe,e as s,_ as y,a2 as ne,V as ie,ab as ae}from"./@vue-exp-Cbz_CXqa.js";import{F as se}from"./FullScreen-D3eNhRZh.js";import"./axios-exp-B_zfNCMU.js";import"./@iconify/vue-exp-BeT9ZUzB.js";const re=R({__name:"index",props:{leftWidth:q().def("0px")},setup(p,{expose:n}){n();const m=p,e=f(null);let d,r;ee(()=>m.leftWidth,o=>{o&&e.value&&(e.value.style.width=o)});const l=A(function(o){e.value&&(e.value.style.width=r+o.clientX-d+"px")},20),c=()=>{document.documentElement.style.userSelect="unset",document.documentElement.removeEventListener("mousemove",l),document.documentElement.removeEventListener("mouseup",c),H.dispatchWindowResize()},C={props:m,scalable:e,get startX(){return d},set startX(o){d=o},get startWidth(){return r},set startWidth(o){r=o},onDrag:l,dragEnd:c,startDrag:o=>{d=o.clientX,e.value&&(r=parseInt(window.getComputedStyle(e.value).width,10)),document.documentElement.style.userSelect="none",document.documentElement.addEventListener("mousemove",l),document.documentElement.addEventListener("mouseup",c)}};return Object.defineProperty(C,"__isScriptSetup",{enumerable:!1,value:!0}),C}}),le={class:"split-wrapper"},ue={ref:"scalable",class:"scalable"},de={class:"left-content"},ce={class:"right-content"};function fe(p,n,m,e,d,r){return P(),M("div",le,[i("div",ue,[i("div",de,[F(p.$slots,"left-content",{},()=>[n[0]||(n[0]=B("右边内容区"))],!0)]),i("div",{ref:"separator",class:"separator",onMousedown:e.startDrag},n[1]||(n[1]=[i("i",null,null,-1),i("i",null,null,-1)]),544)],512),i("div",ce,[F(p.$slots,"right-content",{},()=>[n[2]||(n[2]=B("右边内容区"))],!0)])])}const me=I(re,[["render",fe],["__scopeId","data-v-d3df8b51"],["__file","index.vue"]]),E="frontLayoutWidget",ge=R({__name:"FrontLayoutContainerWidget",setup(p,{expose:n}){const m=T(),e=z(),d=f(),r=j,l=f(r),c=f(E);let g;K("widgetsList.txt").then(t=>{t.data&&(g=U(t.data))});function C(){o.value=!1,v.value="0px",h.value="",w.gui&&(w.gui.destroy(),w.gui=void 0);const t=e.query?.wid;if(t){const a=w.LayoutMap.get(E);a&&(t=="MapViewerWidget"?a.unloadWidget(t.toString()):(a.unloadWidget(t.toString()),setTimeout(()=>{a.unloadWidget("MapViewerWidget")},500)))}m.push({query:void 0})}const o=f(!0);function x(t=!1){o.value=t}n({changeVisible:x,isShow:o});const v=f("0px"),_=f(""),h=f("");async function N(){if(v.value==="0px"?v.value="40%":v.value="0px",!h.value){const t=e.query?.wid?.toString();if(t&&g){const a=g.find(u=>u.layoutID==="frontLayoutWidget"&&u.id===t);if(a){_.value=a.path;const u="./code"+a.path;J(u,void 0,void 0,void 0,"text").then(D=>{h.value=D.data,h.value&&S()}).catch(D=>{})}}}}function V(){v.value="0px"}function L(t){const a=t.lastIndexOf("/")+1;let u=t.substring(a);return u=decodeURI(u.split("?")[0]),u}function k(){if(_.value){const t=L(_.value);Y(w.Axios,"code"+_.value,t)}}function S(){const t=document.getElementById("container");t&&(window.MonacoEnvironment={getWorkerUrl:function(a,u){return""}},Z.create(t,{value:h.value,language:"typescript",lineNumbers:"on",readOnly:!0,readOnlyMessage:{value:"不可以修改哦",supportThemeIcons:!0,supportHtml:!0},automaticLayout:!0,minimap:{enabled:!1},overviewRulerLanes:0,scrollbar:{horizontal:"hidden",handleMouseWheel:!0}}))}te(()=>{});const b={name:E,router:m,route:e,containerRef:d,widgetCofig:r,configRef:l,layoutIDRef:c,get widgetsList(){return g},set widgetsList(t){g=t},closeFrontLayoutWidget:C,isShow:o,changeVisible:x,leftPanelWidth:v,widgetFilePath:_,drawerContetn:h,SwitchDrawer:N,closeCodePanel:V,getFileName:L,downloadVue:k,InitMonaCoeditor:S,get LayoutContainer(){return G},SplitPanel:me,FullScreen:se};return Object.defineProperty(b,"__isScriptSetup",{enumerable:!1,value:!0}),b}}),pe={class:"frontcontainer"},ve={id:"container",ref:"containerRef",style:{height:"100%",width:"100%"}},he={class:"editorBar row justify-center items-middle"},_e={class:"q-mr-md q-gutter-md"},we={class:"rightBtn q-px-sm"};function ye(p,n,m,e,d,r){const l=ie("Icon"),c=ae("tooltip");return W((P(),M("div",pe,[s(O,{view:"hHh lpR fFf"},{default:y(()=>[s(X,null,{default:y(()=>[s(e.SplitPanel,{style:{height:"100vh",width:"100%"},leftWidth:e.leftPanelWidth},{"left-content":y(()=>[i("div",ve,[i("div",he,[i("div",null,ne(e.widgetFilePath),1),s(Q),i("div",_e,[W(s(l,{icon:"ant-design:download-outlined",onClick:e.downloadVue},null,512),[[c,"下载vue文件"]]),s(e.FullScreen,{target:e.containerRef},null,8,["target"]),W(s(l,{icon:"ant-design:close-circle-outlined",onClick:e.closeCodePanel},null,512),[[c,"关闭代码页"]])])])],512)]),"right-content":y(()=>[s(e.LayoutContainer,{widgetConfig:e.configRef,layoutID:e.layoutIDRef,enableRouterView:!1},{default:y(()=>[i("div",we,[i("span",{class:"cursor-pointer",title:"关闭",onClick:e.closeFrontLayoutWidget,style:{"margin-right":"10px"}},[s(l,{icon:"ant-design:close-circle-outlined",width:"32",style:{color:"white !important"}})]),s($,{flat:"",onClick:n[0]||(n[0]=g=>e.SwitchDrawer()),label:"查看代码",dense:"",icon:"menu"})])]),_:1},8,["widgetConfig","layoutID"])]),_:1},8,["leftWidth"])]),_:1})]),_:1})],512)),[[oe,e.isShow]])}const Be=I(ge,[["render",ye],["__scopeId","data-v-8041813b"],["__file","FrontLayoutContainerWidget.vue"]]);export{Be as default};