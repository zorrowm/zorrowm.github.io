import{F as W,v as L,G as E,R as M,B as T}from"./vendor-CDV5M84i.js";import{f as B,_ as Q}from"./index-urNJi4nj.js";import{j as y,E as V,d as P}from"./xframelib-exp-CvTEfE5n.js";import{W as R}from"./WidgetsEvent-TR_R_5Fb.js";import{d as N,r as a,v as j,O as H,z as v,G as O,V as c,a1 as m,R as s,Q as f,L as g,Z as u,N as U,M as q}from"./@vue-exp-YaP0LnBg.js";import"./@hprose-exp-DifMA6AO.js";import"./vue-router-exp-BeFgxScw.js";import"./axios-exp-BH40TtQM.js";const A=N({__name:"LayerManageWidget",setup(k,{expose:i}){const _=a([]),t=a([]);let r=a(""),o="imageBaseLayerWidget",n="";function d(e){n=e.id}function p(e){o=e.pid,e.pid&&B(R.WidgetClosed,o)}const C=y.LayerManager.TreeDataRef,w=a([]);function b(e){return w.value.findIndex(S=>S===e.id)>=0}function D(e){}function I(e){acState.IsOnReady&&(e.visiblity=!e.visiblity,e.visiblity?__g.infoTree.show(e.iD):__g.infoTree.hide(e.iD))}j(()=>{let e=new Cesium.Cesium3DTileset({url:"http://192.168.1.37:9000/model/d6bb1c4015ea11ecbb512d76dd405e8c/Tileset.json"});y.CesiumViewer.scene.primitives.add(e)});const l=a(!0);function x(e=!1){l.value=e,n&&e&&P.openWindowPanel(n)}i({changeVisible:x,isShow:l});const h={selected:_,ticked:t,get itemSelected(){return r},set itemSelected(e){r=e},get widgetID(){return o},set widgetID(e){o=e},get windowID(){return n},set windowID(e){n=e},loadedHandle:d,doClosePanel:p,QuasarTreeData:C,expanded:w,isExpanded:b,doLocate:D,doChangeVisible:I,isShow:l,changeVisible:x,get XWindow(){return V}};return Object.defineProperty(h,"__isScriptSetup",{enumerable:!1,value:!0}),h}}),F={class:"q-pa-md q-gutter-sm treePanel"},G={class:"row no-wrap items-center rounded-borders",style:{width:"100%"}},X={class:"text-white"},z={key:1};function Z(k,i,_,t,r,o){const n=H("Icon");return v((s(),c(t.XWindow,{isDark:!0,top:"10px",left:"10px",nWidth:"330px",nHeight:"750px",title:"图层管理",icon:"img/basicimage/arcgis_img.png",pid:"LayerManageWidget",onLoaded:t.loadedHandle,onClose:t.doClosePanel},{default:m(()=>[f(T,{style:{height:"100%"}},{default:m(()=>[g("div",F,[f(W,{expanded:t.expanded,"onUpdate:expanded":i[0]||(i[0]=d=>t.expanded=d),nodes:t.QuasarTreeData,"tick-strategy":"leaf",selected:t.selected,"onUpdate:selected":i[1]||(i[1]=d=>t.selected=d),ticked:t.ticked,"onUpdate:ticked":i[2]||(i[2]=d=>t.ticked=d),"node-key":"id",dense:"","default-expand-all":"","no-connectors":""},{"default-header":m(d=>[g("div",G,[d.node.children?(s(),c(n,{key:0,icon:t.isExpanded(d.node)?"ant-design:folder-open-outlined":"ant-design:folder-outlined"},null,8,["icon"])):u("",!0),g("div",X,U(d.node.label),1),f(L),d.node.children?u("",!0):v((s(),q("div",z,[d.node.layers?u("",!0):(s(),c(E,{key:0,clickable:"",name:"my_location",color:"white",style:{width:"5px",height:"5px"},onClick:p=>t.doLocate(d.node)},null,8,["onClick"]))])),[[M]])])]),_:1},8,["expanded","nodes","selected","ticked"])])]),_:1})]),_:1},512)),[[O,t.isShow]])}const oe=Q(A,[["render",Z],["__scopeId","data-v-48a255d6"],["__file","LayerManageWidget.vue"]]);export{oe as default};