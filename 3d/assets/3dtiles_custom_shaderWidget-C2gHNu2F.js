import{ao as d,aq as u,bz as p}from"./vendor-CDV5M84i.js";import{j as n}from"./xframelib-exp-CvTEfE5n.js";import{d as _,v as c,x as f}from"./@vue-exp-YaP0LnBg.js";import{_ as v}from"./index-DPO_t7vI.js";import"./@hprose-exp-DifMA6AO.js";import"./axios-exp-BH40TtQM.js";import"./vue-router-exp-BeFgxScw.js";const g=_({__name:"3dtiles_custom_shaderWidget",setup(m,{expose:o}){o();let e,r;async function a(){let t=new d("layer");e.addLayer(t);let s=new u("http://resource.dvgis.cn/data/3dtiles/ljz/tileset.json",{skipLevels:!0}),l=new p({fragmentShaderText:`
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
      `});s.setCustomShader(l),t.addOverlay(s),e.flyToTarget(s)}c(()=>{n.CesiumViewer&&(e=n.CesiumViewer,a())}),f(()=>{e&&r&&e.removeLayer(r)});const i={get viewer(){return e},set viewer(t){e=t},get layer(){return r},set layer(t){r=t},initLayer:a};return Object.defineProperty(i,"__isScriptSetup",{enumerable:!1,value:!0}),i}});function y(m,o,e,r,a,i){return null}const j=v(g,[["render",y],["__file","3dtiles_custom_shaderWidget.vue"]]);export{j as default};
