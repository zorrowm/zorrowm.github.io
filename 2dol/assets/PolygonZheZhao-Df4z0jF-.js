import{S as _,F as y,j as v,b as g,a as h,G as w,f as x,h as L,L as P,i as S}from"./ol-exp-B7umSeRp.js";import{B as f}from"./xframelib-exp-BL-NWzRk.js";import{t as j}from"./zhezhaotest-FsVvAOE7.js";import{d as F,b as M,D as Z}from"./@vue-exp-Mkau1HGZ.js";import{_ as b}from"./index-Dy2WIICa.js";import"./vendor-DLGs6WCJ.js";import"./axios-exp-C7rfqWEd.js";import"./@iconify/vue-exp-DwwUNauw.js";import"./monaco-editor-exp-B01XOe8A.js";import"./vue-router-exp-LDq1UUA0.js";const G=F({__name:"PolygonZheZhao",setup(m,{expose:l}){l();let r;function s(e){const t=e.MapView.getProjection();var o=new w().readFeatures(j,{dataProjection:"EPSG:4326",featureProjection:t}),a=o[0],p=i(a.getGeometry()),n=new x({geometry:p});r&&r.getSource().addFeature(n)}function i(e){var t=[-180,-90,180,90],o=L(t);let a=!1;e instanceof S&&(a=!0);var p=e.getCoordinates();return p.forEach(n=>{let u=n[0];a||(u=n);const d=new P(u);o.appendLinearRing(d)}),o}M(()=>{const e=f.XMap;var t=new _({fill:new y({color:"rgba(0,0,0, 0.6)"}),stroke:new v({color:"#BDBDBD",width:2}),zIndex:10});r=new g({source:new h,style:t,declutter:""}),e.map.addLayer(r),s(e)}),Z(()=>{const e=f.XMap;r&&e.map.removeLayer(r)});const c={get converLayer(){return r},set converLayer(e){r=e},loadJson:s,erase:i};return Object.defineProperty(c,"__isScriptSetup",{enumerable:!1,value:!0}),c}});function B(m,l,r,s,i,c){return null}const z=b(G,[["render",B],["__file","PolygonZheZhao.vue"]]);export{z as default};