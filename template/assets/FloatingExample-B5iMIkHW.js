import{d as b,r as a,a0 as e,ag as w,b as m,e as F,l as o,k as v,ac as E,j as n,a4 as u,ai as V,a7 as A}from"./@vue-exp-Bws36Ke9.js";import{_ as T}from"./index-BQ7ovaqR.js";import"./monaco-editor-exp-BNK_u0iZ.js";import"./vendor-DJm_4oaR.js";import"./lottie-web-exp-CIY4INm7.js";import"./quasar-exp-BsaNoQ7w.js";import"./xframelib-exp-CMLeiWD4.js";import"./axios-exp-C7rfqWEd.js";import"./@iconify/vue-exp-Q9Q0SWJB.js";import"./xgis-cesium-exp-Hv7oMXHX.js";import"./vue-router-exp-CO9L2VdX.js";const _=b({__name:"FloatingExample",setup(g,{expose:t}){t();const d=a(!1),i=a(""),s={isMenuShown:d,msg:i};return Object.defineProperty(s,"__isScriptSetup",{enumerable:!1,value:!0}),s}}),M={class:"exampleContent"},k={style:{"margin-top":"20px",width:"200px"}},y={style:{margin:"0 auto",width:"100px"}},B={class:"moreMenu"},S={class:"chidMenuPanel"},N={class:"childMenuLeft"},j={style:{width:"60px"}},z=["onClick"];function I(g,t,d,i,s,H){const f=e("FVTooltip"),l=e("Icon"),p=e("FVMenu"),C=e("FVDropdown"),x=w("tooltip");return m(),F("div",M,[t[20]||(t[20]=o("div",{style:{"font-weight":"700","font-size":"20px"}},"这是展示FloatingVue的相关组件使用的页面",-1)),o("div",null,[o("div",null,[v((m(),F("button",null,t[1]||(t[1]=[E("ToolTip组件：v-tooltip指令使用")]))),[[x,"这是ToolTip组件的展示",void 0,{bottom:!0}]]),o("div",k,[n(f,null,{popper:u(()=>t[2]||(t[2]=[o("div",{style:{width:"400px",height:"300px","background-color":"#333"}}," 这是ToolTip浮动面板 ",-1)])),default:u(()=>[t[3]||(t[3]=o("button",null,"FVTooltip浮动提示面板",-1))]),_:1})])])]),o("div",null,[t[8]||(t[8]=o("div",{style:{"font-weight":"700","font-size":"18px","margin-bottom":"20px"}},"这是浮动菜单HoverMenu",-1)),o("div",y,[n(p,{placement:"bottom-start",shown:i.isMenuShown},{popper:u(()=>[o("div",B,[o("div",null,[n(l,{icon:"ant-design:account-book-outlined"}),t[5]||(t[5]=o("span",null,"关于我们",-1))]),o("div",null,[n(l,{icon:"ant-design:user-add-outlined"}),t[6]||(t[6]=o("span",null,"加入我们",-1))]),o("div",null,[n(l,{icon:"ant-design:phone-filled"}),t[7]||(t[7]=o("span",null,"联系我们",-1))])])]),default:u(()=>[o("div",null,[n(l,{icon:"ic:baseline-more-horiz"}),t[4]||(t[4]=E("更多功能 "))])]),_:1},8,["shown"])])]),o("div",null,[o("ul",null,[t[15]||(t[15]=o("li",null,[o("a",{class:"active",href:"#home"},"Home")],-1)),t[16]||(t[16]=o("li",null,[o("a",{href:"#news"},"News")],-1)),o("li",null,[n(p,{placement:"bottom-start"},{popper:u(()=>[o("div",S,[o("div",N,[o("div",null,[n(l,{icon:"ant-design:account-book-outlined"}),t[9]||(t[9]=o("span",null,"关于我们",-1))]),o("div",null,[n(l,{icon:"ant-design:user-add-outlined"}),t[10]||(t[10]=o("span",null,"加入我们",-1))]),o("div",null,[n(l,{icon:"ant-design:phone-filled"}),t[11]||(t[11]=o("span",null,"联系我们",-1))])]),t[12]||(t[12]=o("div",{style:{width:"2px","background-color":"#666",margin:"5px 0"}},null,-1)),t[13]||(t[13]=o("div",{class:"childMenuRight"},[o("div",null,[o("img",{src:"/SampleData/product.jpg",alt:""})]),o("div",null,"产品下载")],-1))])]),default:u(()=>[t[14]||(t[14]=o("a",{href:"#about"},"About",-1))]),_:1})])])]),o("div",null,[t[19]||(t[19]=o("div",null,"FVDropdown组件使用",-1)),o("div",j,[n(C,{placement:"bottom"},{popper:u(({hide:D})=>[t[17]||(t[17]=o("div",null,"这是VDropdown",-1)),v(o("input",{class:"tooltip-content","onUpdate:modelValue":t[0]||(t[0]=r=>i.msg=r),placeholder:"Tooltip content"},null,512),[[V,i.msg]]),o("p",null,A(i.msg),1),o("button",{onClick:r=>D()},"Close",8,z)]),default:u(()=>[t[18]||(t[18]=o("button",null,"点击我",-1))]),_:1})])])])}const W=T(_,[["render",I],["__scopeId","data-v-ddc86c34"],["__file","FloatingExample.vue"]]);export{W as default};