import{d as r,R as n,M as _,L as a,N as o,Y as v,V as f,a1 as b,X as m,a8 as h}from"./@vue-exp-YaP0LnBg.js";import{_ as c}from"./index-DPO_t7vI.js";const B=r({__name:"BasePanel",props:{title:{}},setup(s,{expose:t}){t();const e={props:s};return Object.defineProperty(e,"__isScriptSetup",{enumerable:!1,value:!0}),e}}),$={class:"base-panel"},S={class:"panel-header"},x={class:"panel-header-title"},P={class:"panel-content"};function C(s,t,l,e,i,u){return n(),_("div",$,[a("div",S,[a("span",x,o(l.title),1)]),a("div",P,[v(s.$slots,"default",{},void 0,!0)])])}const k=c(B,[["render",C],["__scopeId","data-v-342006ae"],["__file","BasePanel.vue"]]),y=r({__name:"BaseTutorial",setup(s,{expose:t}){t();const e={list:[{label:"W键",value:"升起"},{label:"S键",value:"俯冲"},{label:"A键",value:"左转"},{label:"D键",value:"右转"},{label:"Q键",value:"加速"},{label:"E键",value:"减速"},{label:"Z键",value:"左侧翻转"},{label:"C键",value:"右侧翻转"}],BasePanel:k};return Object.defineProperty(e,"__isScriptSetup",{enumerable:!1,value:!0}),e}}),D={class:"base-tutorial"},T={class:"params-item"},g={class:"label"},j={class:"value"};function E(s,t,l,e,i,u){return n(),f(e.BasePanel,{title:"操作指南"},{default:b(()=>[a("div",D,[(n(),_(m,null,h(e.list,({value:d,label:p})=>a("div",T,[a("span",g,o(p)+":",1),a("span",j,o(d),1)])),64))])]),_:1})}const L=c(y,[["render",E],["__scopeId","data-v-f5df72ed"],["__file","BaseTutorial.vue"]]);export{L as B};