import{a9 as u,a5 as p}from"./vendor-CDV5M84i.js";import{f as r}from"./xframelib-exp-CvTEfE5n.js";import{d as f,r as g,p as d,O as m,P as _,z as s,R as i,V as c}from"./@vue-exp-YaP0LnBg.js";import{_ as v}from"./index-urNJi4nj.js";const k=f({name:"FullScreen",props:{target:u(),color:p()},setup(e){function t(){o.value?(r.exitFullScreen(),o.value=!1):(r.requestFullScreen(e.target),o.value=!0)}const o=g(!1);return{getTitle:d(()=>o.value?"退出全屏":"全屏"),isFullscreen:o,toggle:t}}});function C(e,t,o,a,F,h){const l=m("Icon"),n=_("tooltip");return e.isFullscreen?s((i(),c(l,{key:1,icon:"ant-design:fullscreen-exit-outlined",color:e.color,onClick:e.toggle},null,8,["color","onClick"])),[[n,e.getTitle,void 0,{right:!0}]]):s((i(),c(l,{key:0,icon:"ant-design:fullscreen-outlined",color:e.color,onClick:e.toggle},null,8,["color","onClick"])),[[n,e.getTitle,void 0,{right:!0}]])}const y=v(k,[["render",C],["__scopeId","data-v-c8c965ee"],["__file","FullScreen.vue"]]);export{y as _};