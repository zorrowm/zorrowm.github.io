import{ao as d,aq as _,ap as p,bz as u}from"./vendor-CDV5M84i.js";import{j as n}from"./xframelib-exp-CvTEfE5n.js";import{d as f,v as g,x as c}from"./@vue-exp-YaP0LnBg.js";import{_ as b}from"./index-BTOrG-4i.js";import"./@hprose-exp-DifMA6AO.js";import"./axios-exp-BH40TtQM.js";import"./vue-router-exp-BeFgxScw.js";const v=f({__name:"3dtiles_style_and_shaderWidget",setup(l,{expose:s}){s();let e,t;async function i(){t=new d("layer"),e.addLayer(t);let r=new _("//resource.dvgis.cn/data/3dtiles/ljz/tileset.json"),o=new p;o.color={conditions:[["${Height} >= 300","rgba(45, 0, 75, 0.5)"],["${Height} >= 200","rgb(102, 71, 151)"],["${Height} >= 100","rgb(170, 162, 204)"],["${Height} >= 50","rgb(224, 226, 238)"],["${Height} >= 25","rgb(252, 230, 200)"],["${Height} >= 10","rgb(248, 176, 87)"],["${Height} >= 5","rgb(198, 106, 11)"],["true","rgb(127, 59, 8)"]]},r.setStyle(o);let m=new u({fragmentShaderText:`
      void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
         vec4 position = czm_inverseModelView * vec4(fsInput.attributes.positionEC,1); // 位置
         float glowRange = 100.0; // 光环的移动范围(高度)
         vec4 temp = vec4(material.diffuse,material.alpha); // 颜色
         temp *= vec4(vec3(position.z / 100.0), 1.0);  // 渐变
         // 动态光环
         float time = fract(czm_frameNumber / 360.0);
         time = abs(time - 0.5) * 2.0;
         float diff = step(0.005, abs( clamp(position.z / glowRange, 0.0, 1.0) - time));
         material.diffuse = vec3(temp.rgb + temp.rgb * (1.0 - diff)) ;
       }
      `});r.setCustomShader(m),t.addOverlay(r),e.flyToTarget(r)}g(()=>{n.CesiumViewer&&(e=n.CesiumViewer,i())}),c(()=>{e&&t&&e.removeLayer(t)});const a={get viewer(){return e},set viewer(r){e=r},get layer(){return t},set layer(r){t=r},initLayer:i};return Object.defineProperty(a,"__isScriptSetup",{enumerable:!1,value:!0}),a}});function y(l,s,e,t,i,a){return null}const x=b(v,[["render",y],["__file","3dtiles_style_and_shaderWidget.vue"]]);export{x as default};
