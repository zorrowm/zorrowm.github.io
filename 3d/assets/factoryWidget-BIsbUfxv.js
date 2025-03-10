import{au as a,ap as b,ar as l,aD as v,b2 as y,b3 as w,bo as g,by as C}from"./vendor-6kqmRazU.js";import{j as h}from"./xframelib-exp-CPl8XRlL.js";import{d as S,v as O}from"./@vue-exp-BA8o4xMK.js";import{_ as j}from"./index-CTmLOYTS.js";import"./@hprose-exp-BDOQuVAD.js";import"./axios-exp-BH40TtQM.js";import"./vue-router-exp-BxGuMefC.js";const z=S({__name:"factoryWidget",setup(f,{expose:n}){n();let e;function r(){e=h.CesiumViewer,e.setOptions({shadows:!0,globe:{baseColor:a.BLACK}});let t=new b("layer").addTo(e),i=`
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
      `,m=new l("//lab.earthsdk.com/model/27af3f70003311eaae02359b3e5d0653/tileset.json");m.setCustomShader(i);let d=new l("//lab.earthsdk.com/model/212bc470003311eaae02359b3e5d0653/tileset.json");d.setCustomShader(i);let c=new l("//lab.earthsdk.com/model/1b91bf10003311eaae02359b3e5d0653/tileset.json");c.setCustomShader(i),t.addOverlay(m).addOverlay(d).addOverlay(c);let p=new v("layer1");e.addLayer(p);let s=new y("116.38789554,39.89911368",500);s.setStyle({material:new w({image:"product/icon/circleScan.png",color:new a(0,1,1,.8),transparent:!0}),perPositionHeight:!0,outline:!0,outlineColor:new a(0,1,1,.8)}),s.rotateAmount=3,p.addOverlay(s);let _=new g("layer").addTo(e),u=new C("116.3994748,39.90784756",800);u.setStyle({color:new a(0,1,1,.5)}),_.addOverlay(u),e.flyToPosition("116.3904847,39.8773787,2807.38,0,-48.89")}O(()=>{r()});const o={get viewer(){return e},set viewer(t){e=t},initViewer:r};return Object.defineProperty(o,"__isScriptSetup",{enumerable:!1,value:!0}),o}});function M(f,n,e,r,o,t){return null}const W=j(z,[["render",M],["__file","factoryWidget.vue"]]);export{W as default};
