import{b$ as p,c0 as h,cy as z,cz as f}from"./vendor-B1f7FUIB.js";import{B as O}from"./BaseContent-YPVzmYb3.js";import{d as _,r as u,aj as k,c as R,w as P,a7 as Q,o as W,a as M,ak as G,b as $,e as I,a6 as H,f as J,a3 as o,l as t,j as i,ab as y}from"./@vue-exp-DMKPrOh0.js";import{I as K}from"./xframelib-exp-B9KgMBHw.js";import{_ as B}from"./index-CvUQtR9N.js";import{u as D}from"./useECharts-Bzp2qPxQ.js";import"./@hprose-exp-BEudjurc.js";import"./pdfjs-dist-exp-C7mOU4gj.js";import"./vue-router-exp-DWvvxSx9.js";import"./axios-exp-B_zfNCMU.js";import"./@iconify/vue-exp-5llPk3YT.js";import"./echarts-exp-eUzIILnE.js";const X=_({name:"CountTo"}),Y=_({...X,props:{startValue:{default:0},endValue:{default:2021},duration:{default:1500},autoplay:{type:Boolean,default:!0},decimals:{default:0},prefix:{default:""},suffix:{default:""},separator:{default:","},decimal:{default:"."},useEasing:{type:Boolean,default:!0},transition:{default:"linear"}},emits:["on-started","on-finished"],setup(d,{expose:a,emit:r}){a();const e=d,n=r,s=u(e.startValue);let l=k(s);const U=R(()=>E(l.value)),q=u(!1);function T(){l=k(s,{disabled:q,duration:e.duration,onStarted:()=>n("on-started"),onFinished:()=>n("on-finished"),...e.useEasing?{transition:G[e.transition]}:{}})}function v(){T(),s.value=e.endValue}function E(c){if(!c)return"";const{decimals:A,decimal:F,separator:b,suffix:L,prefix:N}=e;let x=Number(c).toFixed(A);x=String(x);const g=x.split(".");let m=g[0];const j=g.length>1?F+g[1]:"",C=/(\d+)(\d{3})/;if(b&&!K(b))for(;C.test(m);)m=m.replace(C,`$1${b}$2`);return N+m+j+L}const S=P([()=>e.startValue,()=>e.endValue],()=>{e.autoplay&&v()}),w=Q(()=>{s.value=e.startValue});W(()=>{e.autoplay&&v()}),M(()=>{S(),w()});const V={props:e,emit:n,source:s,get outputValue(){return l},set outputValue(c){l=c},value:U,disabled:q,run:T,start:v,formatNumber:E,stopWatch:S,stopWatchEffect:w};return Object.defineProperty(V,"__isScriptSetup",{enumerable:!1,value:!0}),V}});function Z(d,a,r,e,n,s){return $(),I("span",null,H(e.value),1)}const ee=B(Y,[["render",Z],["__file","CountTo.vue"]]),te=_({name:"Dashboard"}),ae=_({...te,setup(d,{expose:a}){a();const r=u(null),e=u({tooltip:{trigger:"axis",axisPointer:{type:"cross",label:{backgroundColor:"#6a7985"}}},legend:{data:["Email","Union Ads","Video Ads","Direct","Search Engine"]},grid:{left:"3%",right:"4%",bottom:"3%",containLabel:!0},xAxis:[{type:"category",boundaryGap:!1,data:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]}],yAxis:[{type:"value"}],series:[{name:"Email",type:"line",stack:"Total",areaStyle:{},emphasis:{focus:"series"},data:[120,132,101,134,90,230,210]},{name:"Union Ads",type:"line",stack:"Total",areaStyle:{},emphasis:{focus:"series"},data:[220,182,191,234,290,330,310]},{name:"Video Ads",type:"line",stack:"Total",areaStyle:{},emphasis:{focus:"series"},data:[150,232,201,154,190,330,410]},{name:"Direct",type:"line",stack:"Total",areaStyle:{},emphasis:{focus:"series"},data:[320,332,301,334,390,330,320]},{name:"Search Engine",type:"line",stack:"Total",label:{show:!0,position:"top"},areaStyle:{},emphasis:{focus:"series"},data:[820,932,901,934,1290,1330,1320]}]});D(r,e);const n=u(null),s=u({tooltip:{trigger:"item"},legend:{top:"5%",left:"center"},series:[{name:"Access From",type:"pie",radius:["40%","70%"],avoidLabelOverlap:!1,label:{show:!1,position:"center"},emphasis:{label:{show:!0,fontSize:"40",fontWeight:"bold"}},labelLine:{show:!1},data:[{value:1048,name:"Search Engine"},{value:735,name:"Direct"},{value:580,name:"Email"},{value:484,name:"Union Ads"}]}]});D(n,s);const l={stackRef:r,stackOption:e,pieRef:n,pieOption:s,BaseContent:O,CountTo:ee};return Object.defineProperty(l,"__isScriptSetup",{enumerable:!1,value:!0}),l}}),ie={class:"q-pl-sm q-pr-sm"},oe={class:"column q-gutter-y-sm"},se={class:"row col q-gutter-sm"},ne={class:"col-12 col-md-8"},le={class:"row"},re={class:"text-h5 text-weight-bold"},ue={class:"text-h5 text-weight-bold"},de={class:"text-h5 text-weight-bold"},ce={class:"col"},me={ref:"stackRef",style:{height:"400px"}},pe={class:"col-12 col-md"},fe={ref:"pieRef",style:{height:"430px"}},_e={class:"row q-gutter-x-sm"},ve={class:"col-12 col-md"},be={class:"q-px-lg q-pb-md"};function xe(d,a,r,e,n,s){return $(),J(e.BaseContent,{scrollable:""},{default:o(()=>[t("div",ie,[t("div",oe,[t("div",se,[t("div",ne,[i(p,{flat:"",bordered:"",class:"q-pa-md"},{default:o(()=>[t("div",le,[i(p,{flat:"",class:"col-4 col-md-2"},{default:o(()=>[i(h,null,{default:o(()=>[t("div",re,[i(e.CountTo,{"start-value":0,"end-value":7754})]),a[0]||(a[0]=t("div",{class:"text-caption text-grey",style:{"font-size":"15px"}},"Current User",-1))]),_:1}),i(h,null,{default:o(()=>[t("div",ue,[i(e.CountTo,{"start-value":0,"end-value":24593})]),a[1]||(a[1]=t("div",{class:"text-caption text-grey",style:{"font-size":"15px"}},"Monthly Register",-1))]),_:1}),i(h,null,{default:o(()=>[t("div",de,[i(e.CountTo,{"start-value":0,"end-value":1546})]),a[2]||(a[2]=t("div",{class:"text-caption text-grey",style:{"font-size":"15px"}},"Total Sales",-1))]),_:1})]),_:1}),t("div",ce,[t("div",me,null,512)])])]),_:1})]),t("div",pe,[i(p,{flat:"",bordered:""},{default:o(()=>[t("div",fe,null,512)]),_:1})])]),t("div",_e,[t("div",ve,[i(p,{flat:"",bordered:""},{default:o(()=>[t("div",be,[i(z,{layout:"comfortable",color:"secondary"},{default:o(()=>[i(f,{heading:""},{default:o(()=>a[3]||(a[3]=[y("November, 2017")])),_:1}),i(f,{title:"Event Title",subtitle:"February 22, 1986",avatar:"https://cdn.quasar.dev/img/avatar2.jpg"},{default:o(()=>a[4]||(a[4]=[t("div",null," Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ",-1)])),_:1}),i(f,{title:"Event Title",subtitle:"February 22, 1986"},{default:o(()=>a[5]||(a[5]=[t("div",null," Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ",-1)])),_:1}),i(f,{title:"Event Title",subtitle:"February 22, 1986",color:"orange",icon:"done_all"},{default:o(()=>a[6]||(a[6]=[t("div",null,[y(" Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. "),t("br"),y(" 222Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ")],-1)])),_:1})]),_:1})])]),_:1})])])])])]),_:1})}const $e=B(ae,[["render",xe],["__file","Dashboard.vue"]]);export{$e as default};