import{G as _,b as S,a as C,S as b,F as w,g as v,f as F,h as E,L,i as P}from"./ol-exp-B7umSeRp.js";import{B as O}from"./xframelib-exp-BL-NWzRk.js";import{t as x}from"./zhezhaotest-FsVvAOE7.js";import{d as h,b as j,D as G}from"./@vue-exp-Mkau1HGZ.js";import{_ as M}from"./index-Dy2WIICa.js";import"./vendor-DLGs6WCJ.js";import"./axios-exp-C7rfqWEd.js";import"./@iconify/vue-exp-DwwUNauw.js";import"./monaco-editor-exp-B01XOe8A.js";import"./vue-router-exp-LDq1UUA0.js";const R=h({__name:"ClipPolygon",setup(y,{expose:m}){m();let s;function d(){var e=new _().readFeatures(x),a=e[0],o=u(a.getGeometry()),r=new F({geometry:o});s&&s.getSource().addFeature(r)}function u(e){var a=[-180,-90,180,90],o=E(a);let r=!1;e instanceof P&&(r=!0);var l=e.getCoordinates();return l.forEach(i=>{let t=i[0];r||(t=i);const c=new L(t);o.appendLinearRing(c)}),o}j(()=>{const e=O.XMap,a=e.map.getLayers().getArray(),o=a[0],r=a[1],l=e.MapView.getProjection();var i=new _().readFeatures(x,{dataProjection:"EPSG:4326",featureProjection:l});const t=new S({style:null,source:new C({features:i})});t.getSource().on("addfeature",function(){o.setExtent(t.getSource().getExtent()),r.setExtent(t.getSource().getExtent())});const c=new b({fill:new w({color:"black"})});o.on("postrender",function(n){const f=v(n);n.context.globalCompositeOperation="destination-in",t.getSource().forEachFeature(function(g){f.drawFeature(g,c)}),n.context.globalCompositeOperation="source-over"}),r.on("postrender",function(n){const f=v(n);n.context.globalCompositeOperation="destination-in",t.getSource().forEachFeature(function(g){f.drawFeature(g,c)}),n.context.globalCompositeOperation="source-over"})}),G(()=>{});const p={get converLayer(){return s},set converLayer(e){s=e},loadJson:d,erase:u};return Object.defineProperty(p,"__isScriptSetup",{enumerable:!1,value:!0}),p}});function V(y,m,s,d,u,p){return null}const z=M(R,[["render",V],["__file","ClipPolygon.vue"]]);export{z as default};