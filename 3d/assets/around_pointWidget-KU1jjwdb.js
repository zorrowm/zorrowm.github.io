import{bK as d,ap as f,ar as c,bA as _}from"./vendor-6kqmRazU.js";import{j as v}from"./xframelib-exp-CPl8XRlL.js";import{d as g,v as b,M as w,L as r,R as C}from"./@vue-exp-BA8o4xMK.js";import{_ as x}from"./index-CTmLOYTS.js";import"./@hprose-exp-BDOQuVAD.js";import"./axios-exp-BH40TtQM.js";import"./vue-router-exp-BxGuMefC.js";const z=g({__name:"around_pointWidget",setup(m,{expose:o}){o();let t,e;function s(){e.start()}function l(){e.stop()}function i(){t=v.CesiumViewer,e=new d(t,"121.48914778697578,31.21498411014459",{pitch:-41,range:2e3});let n=new f("layer").addTo(t),a=new c("//resource.dvgis.cn/data/3dtiles/ljz/tileset.json"),p=new _({fragmentShaderText:`
      void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
         vec4 position = czm_inverseModelView * vec4(fsInput.attributes.positionEC,1); // 位置
         float glowRange = 100.0; // 光环的移动范围(高度)
         vec4 temp = vec4(0.2,  0.5, 1.0, 1.0); // 颜色
         temp *= vec4(vec3(position.z / 100.0), 1.0);  // 渐变
         // 动态光环
         float time = fract(czm_frameNumber / 360.0);
         time = abs(time - 0.5) * 2.0;
         float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));
         material.diffuse = vec3(temp.rgb + temp.rgb * (1.0 - diff)) ;
       }
      `});a.setCustomShader(p),n.addOverlay(a),t.flyToTarget(a)}b(()=>{i()});const u={get viewer(){return t},set viewer(n){t=n},get aroundPoint(){return e},set aroundPoint(n){e=n},start:s,stop:l,initViewer:i};return Object.defineProperty(u,"__isScriptSetup",{enumerable:!1,value:!0}),u}}),M={class:"btn-box"};function S(m,o,t,e,s,l){return C(),w("div",M,[r("ul",null,[r("li",null,[r("button",{onClick:o[0]||(o[0]=i=>e.start())},"开始")]),r("li",null,[r("button",{onClick:o[1]||(o[1]=i=>e.stop())},"结束")])])])}const $=x(z,[["render",S],["__file","around_pointWidget.vue"]]);export{$ as default};
