import{E as d,a as _,G as f,b as g,H as v}from"./ol-exp-B7umSeRp.js";import{B as i}from"./xframelib-exp-BL-NWzRk.js";import{a as y}from"./xgis-ol-exp-CUkajMJM.js";import{d as L,b as P,D as w,U as S,P as b}from"./@vue-exp-Mkau1HGZ.js";import{_ as j}from"./index-Dy2WIICa.js";import"./vendor-DLGs6WCJ.js";import"./axios-exp-C7rfqWEd.js";import"./@iconify/vue-exp-DwwUNauw.js";import"./monaco-editor-exp-B01XOe8A.js";import"./vue-router-exp-LDq1UUA0.js";const x=L({__name:"PopupTooltipWidget",setup(m,{expose:a}){a();let t,r,o=new d;P(()=>{const e=i.XMap;e.map.addOverlay(o),o.setClosebox(!0),o.setPositioning("bottom-center");const u=new _({url:"SampleData/china.json",format:new f});t=new g({source:u}),t&&e.map.addLayer(t),r=new v,e.map.addInteraction(r),r.getFeatures().on(["add"],function(p){var s=p.element,c="";c+=s.get("name");const l=s.get("center");o.show(y.fromLonLat(l,e.MapView.getProjection()),c)}),r.getFeatures().on(["remove"],function(p){o.hide()})}),w(()=>{t&&i.XMap.map.removeLayer(t)});const n={get geojsonLayer(){return t},set geojsonLayer(e){t=e},get select(){return r},set select(e){r=e},get popup(){return o},set popup(e){o=e}};return Object.defineProperty(n,"__isScriptSetup",{enumerable:!1,value:!0}),n}});function h(m,a,t,r,o,n){return b(),S("div")}const E=j(x,[["render",h],["__file","PopupTooltipWidget.vue"]]);export{E as default};