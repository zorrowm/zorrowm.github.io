import{aK as d,aB as f,aL as g}from"./vendor-CDV5M84i.js";import{j as c}from"./xframelib-exp-CvTEfE5n.js";import{d as y,v as h,x as v}from"./@vue-exp-YaP0LnBg.js";import{_ as w}from"./index-DPO_t7vI.js";import"./@hprose-exp-DifMA6AO.js";import"./axios-exp-BH40TtQM.js";import"./vue-router-exp-BeFgxScw.js";const M=y({__name:"cluster_clustering_imageWidget",setup(m,{expose:o}){o();let t,e;function n(r){let s=[],u=["product/icon/camera.png","product/icon/camera_1.png","product/icon/camera_2.png"];for(let l=0;l<r;l++){let _=120.38105869+Math.random()*.5,p=31.10115627+Math.random()*.5;s.push({lng:_,lat:p,attr:{id:g.uuid(),style:{image:u[Math.floor(Math.random()*u.length)]}}})}return s}async function i(){e=new d("layer",{style:"cluster"}),e.setPoints(n(1e4)),t.addLayer(e),e.on(f.CLICK,r=>{}),t.flyToPosition("120.62244801448453,31.358576663788927,92653.79773798586,0,-90,0")}h(()=>{c.CesiumViewer&&(t=c.CesiumViewer,i())}),v(()=>{t&&e&&t.removeLayer(e)});const a={get viewer(){return t},set viewer(r){t=r},get layer(){return e},set layer(r){e=r},generatePosition:n,initLayer:i};return Object.defineProperty(a,"__isScriptSetup",{enumerable:!1,value:!0}),a}});function x(m,o,t,e,n,i){return null}const j=w(M,[["render",x],["__file","cluster_clustering_imageWidget.vue"]]);export{j as default};