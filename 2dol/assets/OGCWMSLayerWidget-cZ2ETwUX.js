import{B as o}from"./xframelib-exp-BL-NWzRk.js";import{u}from"./vue-router-exp-LDq1UUA0.js";import{W as _,x as c}from"./ol-exp-B7umSeRp.js";import{d as f,r as l,b as y,D as d}from"./@vue-exp-Mkau1HGZ.js";import{_ as L}from"./index-Dy2WIICa.js";import"./axios-exp-C7rfqWEd.js";import"./vendor-DLGs6WCJ.js";import"./@iconify/vue-exp-DwwUNauw.js";import"./monaco-editor-exp-B01XOe8A.js";const x=f({__name:"OGCWMSLayerWidget",setup(i,{expose:s}){s();const a=u(),p=l();let t="s:test1",e;y(()=>{if(o.XMap){const r=o.XMap,m=a.query.layer;m&&(t=m),e=new _({extent:[-13884991,2870341,-7455066,6338219],source:new c({url:"https://ahocevar.com/geoserver/wms",params:{LAYERS:"topp:states",TILED:!0},serverType:"geoserver",transition:0})}),r.map.addLayer(e),r.MapView.setCenter([-10997148,4569099])}}),d(()=>{e&&o.XMap.map.removeLayer(e)});const n={route:a,mapRef:p,get layer(){return t},set layer(r){t=r},get wmsLayer(){return e},set wmsLayer(r){e=r}};return Object.defineProperty(n,"__isScriptSetup",{enumerable:!1,value:!0}),n}});function M(i,s,a,p,t,e){return null}const T=L(x,[["render",M],["__file","OGCWMSLayerWidget.vue"]]);export{T as default};