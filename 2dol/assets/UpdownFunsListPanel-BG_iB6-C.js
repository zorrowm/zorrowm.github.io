import{aj as u,ak as f}from"./vendor-Cm8vbQLD.js";import{d as p,p as g,X as c,Y as L,a6 as v,a0 as t,$ as m,J as x,ad as w,aa as l,I as y}from"./@vue-exp-CxZKVZL7.js";import{_}from"./index-3mXAM2d5.js";import"./@hprose-exp-DksTqdcd.js";import"./xframelib-exp-Dokv845S.js";import"./axios-exp-B_zfNCMU.js";import"./@iconify/vue-exp-CNvCUaPp.js";import"./vue-router-exp-BoJcrdOF.js";const h=p({__name:"UpdownLayoutList",props:{dataList:u().def([])},setup(n,{expose:e}){e();const s=n,o=g(()=>s.dataList.slice(0,5));function r(a){return"0"+(a+1)}const i={props:s,demoLastList:o,getNum:r};return Object.defineProperty(i,"__isScriptSetup",{enumerable:!1,value:!0}),i}}),S={class:"column justify-center q-my-md"},E={class:"row items-center justify-center"},$={class:"col-10 row justify-center"},b={class:"imgContent"},j=["src","alt"],I={class:"reasonNum"},U={class:"column q-my-md"},N={class:"itemTitle text-center"},k={class:"itemContent"};function q(n,e,s,o,r,i){return c(),L(f,{once:"",transition:"scale"},{default:v(()=>[t("div",S,[t("div",E,[t("div",$,[(c(!0),m(x,null,w(o.demoLastList,(a,d)=>(c(),m("div",{class:"col-md-2 col-lg-3 q-ma-md itemNode",key:d},[t("div",b,[t("img",{src:a.img,alt:a.title,class:"itemImg q-pa-sm"},null,8,j),t("div",I,l(o.getNum(d)),1)]),t("div",U,[t("div",N,l(a.title),1),t("div",k,l(a.desc),1)])]))),128))])])])]),_:1})}const B=_(h,[["render",q],["__scopeId","data-v-31119fae"],["__file","UpdownLayoutList.vue"]]),C=[{img:"apiExampleimg/xmapwidget.png",icon:"ant-design:aim-outlined",title:"二维GIS可视化",desc:"支持二维GIS的快速构建，一套代码多种风格。通过框架可以添加地图、各类矢量数据和模型到场景中，使场景更加贴近真实世界 "},{img:"apiExampleimg/zoom.png",title:"规范化基础地图的接入",desc:"支持天地图、Google、MapBox 等厂商的地图接入，对于国内部分地图可进行偏移处理 ",icon:"ant-design:appstore-add-outlined"},{img:"apiExampleimg/overview.png",title:"数据统一管理",desc:"进行地图图层的统一管理操作，控制图层顺序和可见性",icon:"ant-design:database-outlined"},{img:"apiExampleimg/water.gif",title:"数据动画和特效",desc:" 线、面、圆、模型等的材质效果和细节动画，让覆盖物的材质能够随着时间变化 ",icon:"ant-design:arrows-alt-outlined"}],P=p({__name:"UpdownFunsListPanel",setup(n,{expose:e}){e();const s={UpdownLayoutList:B,get dataDemoList(){return C}};return Object.defineProperty(s,"__isScriptSetup",{enumerable:!1,value:!0}),s}}),D={class:"scrollSection appendSize column justify-center"};function F(n,e,s,o,r,i){return c(),m("section",D,[e[0]||(e[0]=t("div",{class:"text-center text-h4 q-mb-md"}," 为什么选择 ",-1)),y(o.UpdownLayoutList,{"data-list":o.dataDemoList},null,8,["data-list"])])}const T=_(P,[["render",F],["__scopeId","data-v-31b67fdd"],["__file","UpdownFunsListPanel.vue"]]);export{T as default};