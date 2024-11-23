import{ao as u,aq as _,bz as c,bn as f,a6 as v,bA as b,at as g}from"./vendor-CDV5M84i.js";import{j as n}from"./xframelib-exp-CvTEfE5n.js";import{d as y,v as w,x as C}from"./@vue-exp-YaP0LnBg.js";import{_ as z}from"./index-DPO_t7vI.js";import"./@hprose-exp-DifMA6AO.js";import"./axios-exp-BH40TtQM.js";import"./vue-router-exp-BeFgxScw.js";const x=y({__name:"elec_ellipsoidWidget",setup(m,{expose:o}){o();let e,r,i;async function a(){i=new u("layer_build").addTo(e);let t=new _("http://resource.dvgis.cn/data/3dtiles/ljz/tileset.json",{skipLevels:!0}),d=new c({fragmentShaderText:`
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
      `});t.setCustomShader(d),i.addOverlay(t),r=new f("layer").addTo(e);let p=v.fromObject({lng:121.49536592256028,lat:31.241616722278213}),s=new b(p,{x:1e3,y:1e3,z:1e3});s.setStyle({color:g.GREEN}),r.addOverlay(s),e.flyToPosition("121.4941629,31.2091462,1859.56,0,-28.71")}w(()=>{n.CesiumViewer&&(e=n.CesiumViewer,a())}),C(()=>{e&&r&&(e.removeLayer(r),e.removeLayer(i))});const l={get viewer(){return e},set viewer(t){e=t},get layer(){return r},set layer(t){r=t},get layer_build(){return i},set layer_build(t){i=t},initLayer:a};return Object.defineProperty(l,"__isScriptSetup",{enumerable:!1,value:!0}),l}});function S(m,o,e,r,i,a){return null}const W=z(x,[["render",S],["__file","elec_ellipsoidWidget.vue"]]);export{W as default};
