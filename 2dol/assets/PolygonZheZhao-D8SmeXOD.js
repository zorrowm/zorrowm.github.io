import{d as _,e as y,h as v,b as g,V as h,G as w,F as x,f as L,L as S,M as F}from"./ol-exp-DuIEpEAh.js";import{B as m}from"./xframelib-exp-Dokv845S.js";import{t as M}from"./zhezhaotest-DjReuYCD.js";import{d as Z,y as P,z as b}from"./@vue-exp-CxZKVZL7.js";import{_ as B}from"./index-3mXAM2d5.js";import"./vendor-Cm8vbQLD.js";import"./@hprose-exp-DksTqdcd.js";import"./axios-exp-B_zfNCMU.js";import"./@iconify/vue-exp-CNvCUaPp.js";import"./vue-router-exp-BoJcrdOF.js";const G=Z({__name:"PolygonZheZhao",setup(u,{expose:p}){p();let r;function n(){var e=new w().readFeatures(M),t=e[0],o=s(t.getGeometry()),a=new x({geometry:o});r&&r.getSource().addFeature(a)}function s(e){var t=[-180,-90,180,90],o=L(t);let a=!1;e instanceof F&&(a=!0);var f=e.getCoordinates();return f.forEach(c=>{let l=c[0];a||(l=c);const d=new S(l);o.appendLinearRing(d)}),o}P(()=>{const e=m.XMap;var t=new _({fill:new y({color:"rgba(0,0,0, 0.6)"}),stroke:new v({color:"#BDBDBD",width:2}),zIndex:10});r=new g({source:new h,style:t,declutter:""}),e.map.addLayer(r),n()}),b(()=>{const e=m.XMap;r&&e.map.removeLayer(r)});const i={get converLayer(){return r},set converLayer(e){r=e},loadJson:n,erase:s};return Object.defineProperty(i,"__isScriptSetup",{enumerable:!1,value:!0}),i}});function R(u,p,r,n,s,i){return null}const j=B(G,[["render",R],["__file","PolygonZheZhao.vue"]]);export{j as default};