import{d as k,r as y,w,a9 as z,y as B,E as L,t as E,o as g,b as I,g as l,D as A,v as $,k as u,l as p,A as h,ab as C,j as N,aH as V,aI as S,a3 as H,a4 as U}from"./vendor.fba62f44.js";import{I as M}from"./@iconify/vue-exp.2703a4cd.js";import{i as O,_ as P}from"./index.a7a016cc.js";import{u as T,L as j}from"./xframelib-exp.abb6dc89.js";import"./lodash-es-exp.5cb72cd8.js";import"./vue-router-exp.aea90ceb.js";import"./axios-exp.a055fae1.js";const R=k({name:"IconConfig",components:{Icon:M},setup(e,o){const t=O(),i=y({inputCode:"",width:288,height:288,wh:"",rotate:"",horizontalFlip:"",verticalFlip:"",inline:"",color:""}),f=()=>{i.inputCode=`<Icon icon = "${t.editIconName}" />`},b=async r=>{try{await T.copyText(r),j.Message?.msg("\u590D\u5236\u6210\u529F")}catch(s){console.error(s)}},m=r=>{let s=document.getElementById("Horizontal"),n=document.getElementById("Vertical");r==="Horizontal"?(t.editData.horizontalFlip=!t.editData.horizontalFlip,t.editData.horizontalFlip?s?.setAttribute("class","chooseC"):s?.classList.remove("chooseC")):(t.editData.verticalFlip=!t.editData.verticalFlip,t.editData.verticalFlip?n?.setAttribute("class","chooseC"):n?.classList.remove("chooseC")),c()},d=r=>{let s=document.getElementById("r1"),n=document.getElementById("r0"),v=document.getElementById("r2"),D=document.getElementById("r3");switch(Number(r)){case 1:t.editData.rotate="1",s?.setAttribute("class","chooseC"),v?.classList.remove("chooseC"),D?.classList.remove("chooseC"),n?.classList.remove("chooseC");break;case 2:t.editData.rotate="2",v?.setAttribute("class","chooseC"),s?.classList.remove("chooseC"),D?.classList.remove("chooseC"),n?.classList.remove("chooseC");break;case 3:t.editData.rotate="3",D?.setAttribute("class","chooseC"),v?.classList.remove("chooseC"),s?.classList.remove("chooseC"),n?.classList.remove("chooseC");break;default:t.editData.rotate="0",n?.setAttribute("class","chooseC"),v?.classList.remove("chooseC"),s?.classList.remove("chooseC"),D?.classList.remove("chooseC");break}c()},F=r=>{let s=document.getElementById("block"),n=document.getElementById("inline");r==="block"?(t.editData.inline=!1,s?.setAttribute("class","chooseC"),n?.classList.remove("chooseC")):(t.editData.inline=!0,n?.setAttribute("class","chooseC"),s?.classList.remove("chooseC")),c()},a=r=>{t.editData.width=i.width,t.editData.height=i.height,c()};w(()=>t.editIconName,()=>{i.inputCode=`<Icon icon = "${t.editIconName}" />`,i.width=36,i.height=36}),w(()=>t.editData.iconColor,()=>{c()});const c=()=>{i.width!=36||i.height!=36?i.wh=`width="${t.editData.width}" height="${t.editData.height}"`:i.wh="",t.editData.rotate!="0"?i.rotate=`:rotate="${t.editData.rotate}"`:i.rotate="",t.editData.horizontalFlip===!0?i.horizontalFlip=`:horizontalFlip="${t.editData.horizontalFlip}"`:i.horizontalFlip="",t.editData.verticalFlip===!0?i.verticalFlip=`:verticalFlip="${t.editData.verticalFlip}"`:i.verticalFlip="",t.editData.inline===!0?i.inline=`:inline="${t.editData.inline}"`:i.inline="",!t.curPointSet.palette&&t.editData.iconColor&&(i.color=`color="${t.editData.iconColor}"`),i.inputCode=`<Icon icon = "${t.editIconName}" ${i.wh} ${i.rotate} ${i.horizontalFlip} ${i.verticalFlip} ${i.inline} ${i.color}/>`};return z(()=>{f(),i.inputCode=`<Icon icon = "${t.editIconName}" />`}),B(()=>{}),{...L(i),store:t,inputCodeChange:f,flip:m,rotateClick:d,mode:F,changewh:a,codeFun:c,copy:b,labelCol:{style:{width:"50px"}},wrapperCol:{span:24}}}});const q=e=>(H("data-v-77fd24e2"),e=e(),U(),e),G={class:"iconconfigOuter"},J={class:"top"},K={class:"center"},Q={class:"left"},W={class:"iconOuter"},X={key:1},Y={class:"right"},Z={class:"bottom"},_=q(()=>l("div",{class:"itemtitle"},"Vue3 \u4EE3\u7801",-1)),x={class:"code"};function ee(e,o,t,i,f,b){const m=E("Icon"),d=V,F=S;return g(),I("div",G,[l("div",J,"\u56FE\u6807\u5E93\u540D\uFF1A"+A(e.store.editIconName),1),l("div",K,[l("div",Q,[l("div",W,[e.store.editData.inline===!1?(g(),$(m,{key:0,icon:e.store.editIconName,color:e.store.editData.iconColor,width:e.store.editData.width,height:e.store.editData.height,rotate:e.store.editData.rotate,horizontalFlip:e.store.editData.horizontalFlip,verticalFlip:e.store.editData.verticalFlip,inline:e.store.editData.inline,class:"iconborder"},null,8,["icon","color","width","height","rotate","horizontalFlip","verticalFlip","inline"])):(g(),I("div",X,[u(m,{icon:e.store.editIconName,color:e.store.editData.iconColor,width:e.store.editData.width,height:e.store.editData.height,rotate:e.store.editData.rotate,horizontalFlip:e.store.editData.horizontalFlip,verticalFlip:e.store.editData.verticalFlip,inline:e.store.editData.inline,class:"iconborder"},null,8,["icon","color","width","height","rotate","horizontalFlip","verticalFlip","inline"])]))])]),l("div",Y,[u(F,{"label-col":e.labelCol,"wrapper-col":e.wrapperCol},{default:p(()=>[e.store.curPointSet.palette?N("",!0):(g(),$(d,{key:0,label:"\u989C\u8272",style:{display:"relative"}},{default:p(()=>[h(l("input",{"onUpdate:modelValue":o[0]||(o[0]=a=>e.store.editData.iconColor=a),type:"color",style:{position:"absolute",left:"200px",height:"100%",width:"50px"}},null,512),[[C,e.store.editData.iconColor]]),h(l("input",{"onUpdate:modelValue":o[1]||(o[1]=a=>e.store.editData.iconColor=a)},null,512),[[C,e.store.editData.iconColor]])]),_:1})),u(d,{label:"\u5BBD\u9AD8"},{default:p(()=>[h(l("input",{"onUpdate:modelValue":o[2]||(o[2]=a=>e.width=a),onChange:o[3]||(o[3]=a=>e.changewh("width"))},null,544),[[C,e.width]]),h(l("input",{"onUpdate:modelValue":o[4]||(o[4]=a=>e.height=a),onChange:o[5]||(o[5]=a=>e.changewh("height"))},null,544),[[C,e.height]])]),_:1}),u(d,{label:"\u7FFB\u8F6C"},{default:p(()=>[l("button",{onClick:o[6]||(o[6]=a=>e.flip("Horizontal")),id:"Horizontal"},"\u6C34\u5E73"),l("button",{onClick:o[7]||(o[7]=a=>e.flip("Vertical")),id:"Vertical"},"\u5782\u76F4")]),_:1}),u(d,{label:"\u65CB\u8F6C"},{default:p(()=>[l("button",{onClick:o[8]||(o[8]=a=>e.rotateClick(0)),id:"r0",class:"chooseC"},"0\xB0"),l("button",{onClick:o[9]||(o[9]=a=>e.rotateClick(1)),id:"r1"},"90\xB0"),l("button",{onClick:o[10]||(o[10]=a=>e.rotateClick(2)),id:"r2"},"180\xB0"),l("button",{onClick:o[11]||(o[11]=a=>e.rotateClick(3)),id:"r3"},"270\xB0")]),_:1}),u(d,{label:"\u6A21\u5F0F"},{default:p(()=>[l("button",{onClick:o[12]||(o[12]=a=>e.mode("block")),id:"block",class:"chooseC"}," \u5757\u7EA7 "),l("button",{onClick:o[13]||(o[13]=a=>e.mode("Inline")),id:"inline"},"\u884C\u5185")]),_:1})]),_:1},8,["label-col","wrapper-col"])])]),l("div",Z,[_,l("div",x,[l("button",{onClick:o[14]||(o[14]=a=>e.copy(e.inputCode)),class:"copy"},"\u590D\u5236"),h(l("textarea",{class:"codeINput",id:"inputCode",type:"textarea","onUpdate:modelValue":o[15]||(o[15]=a=>e.inputCode=a),onChange:o[16]||(o[16]=(...a)=>e.inputCodeChange&&e.inputCodeChange(...a)),disabled:""},null,544),[[C,e.inputCode]])])])])}const re=P(R,[["render",ee],["__scopeId","data-v-77fd24e2"]]);export{re as default};