import{ax as k}from"./vendor-CDV5M84i.js";import{j as y}from"./xframelib-exp-CvTEfE5n.js";import{d as x,v as d,M as b,L as s,R as v}from"./@vue-exp-YaP0LnBg.js";import{_ as c}from"./index-DPO_t7vI.js";import"./@hprose-exp-DifMA6AO.js";import"./axios-exp-BH40TtQM.js";import"./vue-router-exp-BeFgxScw.js";const S=x({__name:"ground_sky_boxWidget",setup(m,{expose:t}){t();let o,a=[],i,p=0,n=4e4;function u(e){p=e}function r(){a.push(new GroundSkyBox({sources:{positiveX:"SampleData/images/sky-box/2/right.png",negativeX:"SampleData/images/sky-box/2/left.png",positiveY:"SampleData/images/sky-box/2/down.png",negativeY:"SampleData/images/sky-box/2/up.png",positiveZ:"SampleData/images/sky-box/2/back.png",negativeZ:"SampleData/images/sky-box/2/front.png"}}),new GroundSkyBox({sources:{positiveX:"SampleData/images/sky-box/5/right.png",negativeX:"SampleData/images/sky-box/5/left.png",positiveY:"SampleData/images/sky-box/5/down.png",negativeY:"SampleData/images/sky-box/5/up.png",positiveZ:"SampleData/images/sky-box/5/back.png",negativeZ:"SampleData/images/sky-box/5/front.png"}}),new Cesium.GroundSkyBox({sources:{positiveX:"SampleData/images/sky-box/6/right.jpg",negativeX:"SampleData/images/sky-box/6/left.jpg",positiveY:"SampleData/images/sky-box/6/down.jpg",negativeY:"SampleData/images/sky-box/6/up.jpg",positiveZ:"SampleData/images/sky-box/6/back.jpg",negativeZ:"SampleData/images/sky-box/6/front.jpg"}}),i)}function g(){o=y.CesiumViewer,i=o.scene.skyBox,r(),o.on(k.POST_RENDER,()=>{o.cameraPosition.alt<n?o.setOptions({showAtmosphere:!1,skyBox:a[p]}):o.setOptions({showAtmosphere:!0,skyBox:i})})}d(()=>{g()});const l={get viewer(){return o},set viewer(e){o=e},get skyBoxes(){return a},set skyBoxes(e){a=e},get defaultSkyBox(){return i},set defaultSkyBox(e){i=e},get selectedType(){return p},set selectedType(e){p=e},get distance(){return n},set distance(e){n=e},changeType:u,initSkyBox:r,initViewer:g};return Object.defineProperty(l,"__isScriptSetup",{enumerable:!1,value:!0}),l}}),f={class:"btn-box"};function _(m,t,o,a,i,p){return v(),b("div",f,[s("ul",null,[s("li",null,[s("button",{onClick:t[0]||(t[0]=n=>a.changeType(0))},"白天")]),s("li",null,[s("button",{onClick:t[1]||(t[1]=n=>a.changeType(1))},"黄昏")]),s("li",null,[s("button",{onClick:t[2]||(t[2]=n=>a.changeType(2))},"夜晚")]),s("li",null,[s("button",{onClick:t[3]||(t[3]=n=>a.changeType(3))},"默认")])])])}const X=c(S,[["render",_],["__file","ground_sky_boxWidget.vue"]]);export{X as default};