import{G as _,a as S,b as C,S as b,F as w,g as v,c as F,f as E,L,M as P}from"./ol-exp-64kmBCi6.js";import{B as M}from"./xframelib-exp-Dh6eGY1k.js";import{t as x}from"./zhezhaotest-FsVvAOE7.js";import{d as O,b as j,D as G}from"./@vue-exp-Mkau1HGZ.js";import{_ as h}from"./index-Cl6kQhfR.js";import"./vendor-71nkuPi7.js";import"./@hprose-exp-B7dHRfib.js";import"./axios-exp-C7rfqWEd.js";import"./@iconify/vue-exp-DwwUNauw.js";import"./monaco-editor-exp-B01XOe8A.js";import"./vue-router-exp-ButTbbfG.js";const R=O({__name:"ClipPolygon",setup(y,{expose:m}){m();let s;function d(){var e=new _().readFeatures(x),a=e[0],o=u(a.getGeometry()),r=new F({geometry:o});s&&s.getSource().addFeature(r)}function u(e){var a=[-180,-90,180,90],o=E(a);let r=!1;e instanceof P&&(r=!0);var l=e.getCoordinates();return l.forEach(i=>{let t=i[0];r||(t=i);const c=new L(t);o.appendLinearRing(c)}),o}j(()=>{const e=M.XMap,a=e.map.getLayers().getArray(),o=a[0],r=a[1],l=e.MapView.getProjection();var i=new _().readFeatures(x,{dataProjection:"EPSG:4326",featureProjection:l});const t=new S({style:null,source:new C({features:i})});t.getSource().on("addfeature",function(){o.setExtent(t.getSource().getExtent()),r.setExtent(t.getSource().getExtent())});const c=new b({fill:new w({color:"black"})});o.on("postrender",function(n){const f=v(n);n.context.globalCompositeOperation="destination-in",t.getSource().forEachFeature(function(g){f.drawFeature(g,c)}),n.context.globalCompositeOperation="source-over"}),r.on("postrender",function(n){const f=v(n);n.context.globalCompositeOperation="destination-in",t.getSource().forEachFeature(function(g){f.drawFeature(g,c)}),n.context.globalCompositeOperation="source-over"})}),G(()=>{});const p={get converLayer(){return s},set converLayer(e){s=e},loadJson:d,erase:u};return Object.defineProperty(p,"__isScriptSetup",{enumerable:!1,value:!0}),p}});function V(y,m,s,d,u,p){return null}const H=h(R,[["render",V],["__file","ClipPolygon.vue"]]);export{H as default};