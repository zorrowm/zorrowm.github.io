import{ao as f,aq as p,ak as m,al as g,ap as y,am as S}from"./vendor-CDV5M84i.js";import{j as a}from"./xframelib-exp-CvTEfE5n.js";import{d as v,v as w,x as b,r as h}from"./@vue-exp-YaP0LnBg.js";import{_ as C}from"./index-DPO_t7vI.js";import"./@hprose-exp-DifMA6AO.js";import"./axios-exp-BH40TtQM.js";import"./vue-router-exp-BeFgxScw.js";const x=v({__name:"scene_splitWidget",setup(_,{expose:l}){let e;function c(t){e.mapSplit.enable=!!t}function s(){e=a.CesiumViewer;let t=new f("layer").addTo(e),i=new p("//resource.dvgis.cn/data/3dtiles/dayanta/tileset.json");i.setHeight(-420),i.setSplitDirection(-1),t.addOverlay(i),e.sceneSplit.enable=!0,e.sceneSplit.addBaseLayer(m.createImageryLayer(g.GAODE,{crs:"WGS84"}));let n=new p("//resource.dvgis.cn/data/3dtiles/dayanta/tileset.json");n.setStyle(new y({color:{conditions:[["true","rgba(255,255,0,0.8)"]]}})),n.setHeight(-420),n.setSplitDirection(1),e.sceneSplit.addTileset(n),r(),e.flyToTarget(i)}function r(){let t={enable:!0},i=new S;a.gui=i,i.add(t,"enable").onChange(n=>{e.sceneSplit.enable=n})}w(()=>{a.CesiumViewer&&s()}),b(()=>{e&&a.gui&&a.gui.destroy()});const o=h(!0);function d(t=!1){o.value=t,t&&r()}l({changeVisible:d,isShow:o});const u={get viewer(){return e},set viewer(t){e=t},changeEnable:c,initViewer:s,addGuiController:r,isShow:o,changeVisible:d};return Object.defineProperty(u,"__isScriptSetup",{enumerable:!1,value:!0}),u}});function T(_,l,e,c,s,r){return null}const k=C(x,[["render",T],["__file","scene_splitWidget.vue"]]);export{k as default};