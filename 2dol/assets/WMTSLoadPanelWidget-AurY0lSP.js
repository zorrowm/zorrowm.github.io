import{O as _,T as B,W as p,K as R,X as $}from"./vendor-DLGs6WCJ.js";import{k as ee,B as C,g as te,j as U}from"./xframelib-exp-BL-NWzRk.js";import{a as f}from"./xgis-ol-exp-CUkajMJM.js";import{d as le,r as c,C as oe,Q as ie,$ as v,P as ne,V as y,c as r,a8 as P}from"./@vue-exp-Mkau1HGZ.js";import{_ as ae}from"./index-Dy2WIICa.js";import"./axios-exp-C7rfqWEd.js";import"./@iconify/vue-exp-DwwUNauw.js";import"./ol-exp-B7umSeRp.js";import"./monaco-editor-exp-B01XOe8A.js";import"./vue-router-exp-LDq1UUA0.js";class re{hproseProxyClient;constructor(e){e===void 0?this.hproseProxyClient=ee.getDefaultClient():this.hproseProxyClient=e}async ExistTileGridsetRule(e,i,t){const o=await this.hproseProxyClient.getHproseProxy(),n=this.hproseProxyClient.getClientContext(i,t);return await o.ExistTileGridsetRule(e,n)}async AddTileGridsetRule(e,i,t,o){const n=await this.hproseProxyClient.getHproseProxy(),l=this.hproseProxyClient.getClientContext(t,o);return await n.AddTileGridsetRule(e,i,l)}async UpdateTileGridsetRule(e,i,t,o){const n=await this.hproseProxyClient.getHproseProxy(),l=this.hproseProxyClient.getClientContext(t,o);return await n.UpdateTileGridsetRule(e,i,l)}async DeleteTileGridsetRule(e,i,t){const o=await this.hproseProxyClient.getHproseProxy(),n=this.hproseProxyClient.getClientContext(i,t);return await o.DeleteTileGridsetRule(e,n)}async GetTileGridsetRuleList(e,i,t,o,n,l){const u=await this.hproseProxyClient.getHproseProxy(),a=this.hproseProxyClient.getClientContext(n,l);return await u.GetTileGridsetRuleList(e,i,t,o,a)}async GetTileGridsetRuleByRuleid(e,i,t){const o=await this.hproseProxyClient.getHproseProxy(),n=this.hproseProxyClient.getClientContext(i,t);return await o.GetTileGridsetRuleByRuleid(e,n)}async GetListOfMembersUsingRule(e,i,t,o,n,l){const u=await this.hproseProxyClient.getHproseProxy(),a=this.hproseProxyClient.getClientContext(n,l);return await u.GetListOfMembersUsingRule(e,i,t,o,a)}async GetListOfMembersUsingRuleToString(e,i,t,o,n,l){const u=await this.hproseProxyClient.getHproseProxy(),a=this.hproseProxyClient.getClientContext(n,l);return await u.GetListOfMembersUsingRuleToString(e,i,t,o,a)}async GetTileGridsetRuleByRuleId(e,i,t){const o=await this.hproseProxyClient.getHproseProxy(),n=this.hproseProxyClient.getClientContext(i,t);return await o.GetTileGridsetRuleByRuleId(e,n)}async GetRuleinfoByRuleID(e,i,t){const o=await this.hproseProxyClient.getHproseProxy(),n=this.hproseProxyClient.getClientContext(i,t);return await o.GetRuleinfoByRuleID(e,n)}async CalculateTilerulematrixByLevel(e,i,t,o,n,l,u,a,g,T,M){const F=await this.hproseProxyClient.getHproseProxy(),G=this.hproseProxyClient.getClientContext(T,M);return await F.CalculateTilerulematrixByLevel(e,i,t,o,n,l,u,a,g,G)}async CalculateTilerulematrixList(e,i,t,o,n,l,u,a,g,T){const M=await this.hproseProxyClient.getHproseProxy(),F=this.hproseProxyClient.getClientContext(g,T);return await M.CalculateTilerulematrixList(e,i,t,o,n,l,u,a,F)}async GetTilematrixListByRule(e,i,t){const o=await this.hproseProxyClient.getHproseProxy(),n=this.hproseProxyClient.getClientContext(i,t);return await o.GetTilematrixListByRule(e,n)}async GetBoundsbyEPSG(e,i,t){const o=await this.hproseProxyClient.getHproseProxy(),n=this.hproseProxyClient.getClientContext(i,t);return await o.GetBoundsbyEPSG(e,n)}async GetEpsgCodeList(e,i,t,o,n){const l=await this.hproseProxyClient.getHproseProxy(),u=this.hproseProxyClient.getClientContext(o,n);return await l.GetEpsgCodeList(e,i,t,u)}}const ue=new re,se=le({__name:"WMTSLoadPanelWidget",setup(V,{expose:e}){e();const i=c("GetServiceBrowse"),t=c(C.Config.ServiceURL.WMTSService??"https://gis-image.digsur.com/IMGWMTS"),o=c("s:test1");function n(){if(!o.value){C.Message.warn("影像服务名不能为空！");return}if(C.XMap){const m=C.XMap,s=o.value;U(t.value+"/GetServiceBrowse",{layer:s}).then(x=>{if(x.status===200){const w=x.data;m.WMTSTool.addWMTSLayerSelf(w,s);const d=w.bounds;m.zoomToExtent(d)}}).catch(x=>{C.Message.warn(`请求服务${s}元数据失败`,x.Message)})}}const l=c(C.Config.ServiceURL.WMTSService),u=c(""),a=c("C"),g=c("default"),T=c("image/jpeg"),M=c(1),F=c(18);function G(){if(!l.value||!u.value||!a.value){C.Message.warn("图层名等参数不能为空！");return}if(C.XMap){const m=C.XMap;let s,x;const w=a.value.toLocaleLowerCase();w==="c"?(s=f.getTDTTileGrid(!1),x=f.getProjection({epsg:"EPSG:4490",prjExtent:[-180,-90,180,90]}),m.WMTSTool.addWMTSLayer(u.value,a.value,l.value,s,x,g.value,"KVP",T.value)):w==="w"?(s=f.getTDTTileGrid(!0),x=f.getProjection({epsg:"EPSG:3857"}),m.WMTSTool.addWMTSLayer(u.value,a.value,l.value,s,x,g.value,"KVP",T.value)):ue.GetTileGridsetRuleByRuleid(a.value).then(async d=>{if(!d||!d.rule){C.Message.warn(`矩阵集名错误：${a.value}`);return}const L=d.tilerule.epsg,D=d.tilerule.boundingBoxMinX,X=d.tilerule.boundingBoxMinY,O=d.tilerule.boundingBoxMaxX,E=d.tilerule.boundingBoxMaxY,N=d.tilerule.tileheight,k=d.tilerule.tilewidth,A={};for(let S=0;S<d.tilerulematrixs.length;S++){const z=d.tilerulematrixs[S].level,J=d.tilerulematrixs[S].resolutions;A[z]=J}const Q=await U("https://epsg.gis.digsur.com/#/epsg/"+L),Z={epsg:"EPSG:"+L,proj4:Q.proj4,prjExtent:[D,X,O,E]},K=f.getProjection(Z),Y={rule:a.value,origin:[D,E],tileSize:[k,N],resolutions:A},q=f.createWMTSTileGrid(Y);m.WMTSTool.addWMTSLayer(u.value,a.value,l.value,q,K,g.value,"KVP",T.value)})}}async function H(){const m=await f.getWMTSCapabilities(l.value,u.value),s=await f.getXMLOptionsFromCapabilities(m,!0);s&&C.XMap.WMTSTool.addWMTSLayerByXMLOptions(s)}const b=oe();let h="";function I(m){h=m.id}function j(m){const s=b?.proxy?.$options.id,x=b?.proxy?.$options.layoutID;s&&C.LayoutMap.get(x)?.unloadWidget(s)}const W={panel:i,imageserver:t,serviceName:o,loadImageWMTS:n,wmtsURL:l,layerName:u,tilematrix:a,style:g,format:T,minZoom:M,maxZoom:F,loadWMTSByURLParams:G,loadWMTSByXML:H,instance:b,get windowID(){return h},set windowID(m){h=m},loadedHandle:I,doClosePanel:j,get XWindow(){return te}};return Object.defineProperty(W,"__isScriptSetup",{enumerable:!1,value:!0}),W}}),de={class:"q-gutter-y-md loadWMTSPanel"};function me(V,e,i,t,o,n){return ne(),ie(t.XWindow,{isDark:!1,top:"0px",left:"10px",nWidth:"550px",hHeight:"250px",title:"添加WMTS服务",icon:"img/basicimage/arcgis_img.png",onLoaded:t.loadedHandle,onClose:t.doClosePanel},{default:v(()=>[y("div",de,[r(_,{modelValue:t.panel,"onUpdate:modelValue":e[0]||(e[0]=l=>t.panel=l),inline:"",options:[{label:"影像平台服务名",value:"GetServiceBrowse"},{label:"通过GetCapabilities",value:"getCapabilities"},{label:"URL和参数",value:"URL"}]},null,8,["modelValue"]),r($,{modelValue:t.panel,"onUpdate:modelValue":e[12]||(e[12]=l=>t.panel=l),animated:"",class:"shadow-2 rounded-borders"},{default:v(()=>[r(B,{name:"GetServiceBrowse"},{default:v(()=>[e[13]||(e[13]=y("div",{class:"info-title"},"只支持影像平台，输入发布的影像服务名",-1)),y("div",null,[r(p,{filled:"",modelValue:t.serviceName,"onUpdate:modelValue":e[1]||(e[1]=l=>t.serviceName=l),label:"输入服务名"},null,8,["modelValue"]),r(p,{filled:"",modelValue:t.imageserver,"onUpdate:modelValue":e[2]||(e[2]=l=>t.imageserver=l),label:"影像平台服务地址（默认）"},null,8,["modelValue"]),r(R,{color:"primary",label:"添加影像WMTS",onClick:t.loadImageWMTS})])]),_:1}),r(B,{name:"getCapabilities"},{default:v(()=>[e[14]||(e[14]=y("div",{class:"info-title"},[P("通过OGC标准WMTS的GetCapabilitis元数据加载图层"),y("br"),P(" https://image.gis.digsur.com/IMGWMTS?layer=s:test1&Service=WMTS&Request=GetCapbilities ")],-1)),y("div",null,[r(p,{filled:"",modelValue:t.wmtsURL,"onUpdate:modelValue":e[3]||(e[3]=l=>t.wmtsURL=l),label:"影像平台服务地址（默认）"},null,8,["modelValue"]),r(p,{filled:"",modelValue:t.layerName,"onUpdate:modelValue":e[4]||(e[4]=l=>t.layerName=l),label:"输入图层名"},null,8,["modelValue"]),r(R,{color:"primary",label:"添加WMTS",onClick:t.loadWMTSByXML})])]),_:1}),r(B,{name:"URL"},{default:v(()=>[e[15]||(e[15]=y("div",{class:"info-title"},[P("输入OGC WMTS参数，构建例如："),y("br"),P(" https://image.gis.digsur.com/IMGWMTS?layer=s:test1&style=default&tilematrixset=C"),y("br"),P("&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/jpeg"),y("br"),P("&TileMatrix=10&TileCol=843&TileRow=142&threshold=100 ")],-1)),y("div",null,[r(p,{filled:"",modelValue:t.wmtsURL,"onUpdate:modelValue":e[5]||(e[5]=l=>t.wmtsURL=l),label:"影像平台服务地址（默认Global.Config.ServiceURL.WMTSService）"},null,8,["modelValue"]),r(p,{filled:"",modelValue:t.layerName,"onUpdate:modelValue":e[6]||(e[6]=l=>t.layerName=l),label:"图层名"},null,8,["modelValue"]),r(p,{filled:"",modelValue:t.tilematrix,"onUpdate:modelValue":e[7]||(e[7]=l=>t.tilematrix=l),label:"瓦片矩阵集（例如：C/W）"},null,8,["modelValue"]),r(p,{filled:"",modelValue:t.style,"onUpdate:modelValue":e[8]||(e[8]=l=>t.style=l),label:"样式名,默认为default"},null,8,["modelValue"]),r(p,{filled:"",modelValue:t.format,"onUpdate:modelValue":e[9]||(e[9]=l=>t.format=l),label:"Format,默认为image/jpeg"},null,8,["modelValue"]),r(p,{modelValue:t.minZoom,"onUpdate:modelValue":e[10]||(e[10]=l=>t.minZoom=l),modelModifiers:{number:!0},type:"number",filled:"",label:"最小级别,默认为1"},null,8,["modelValue"]),r(p,{modelValue:t.maxZoom,"onUpdate:modelValue":e[11]||(e[11]=l=>t.maxZoom=l),modelModifiers:{number:!0},type:"number",filled:"",label:"最大级别,默认为18"},null,8,["modelValue"]),r(R,{color:"primary",label:"添加WMTS",onClick:t.loadWMTSByURLParams})])]),_:1})]),_:1},8,["modelValue"])])]),_:1})}const Fe=ae(se,[["render",me],["__scopeId","data-v-55c99a57"],["__file","WMTSLoadPanelWidget.vue"]]);export{Fe as default};