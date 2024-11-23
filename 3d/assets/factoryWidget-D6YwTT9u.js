import{at as a,ao as b,aq as l,aC as v,b1 as w,b2 as y,bn as g,bx as C}from"./vendor-CDV5M84i.js";import{j as h}from"./xframelib-exp-CvTEfE5n.js";import{d as S,v as O}from"./@vue-exp-YaP0LnBg.js";import{_ as j}from"./index-BTOrG-4i.js";import"./@hprose-exp-DifMA6AO.js";import"./axios-exp-BH40TtQM.js";import"./vue-router-exp-BeFgxScw.js";const x=S({__name:"factoryWidget",setup(f,{expose:n}){n();let e;function o(){e=h.CesiumViewer,e.setOptions({shadows:!0,globe:{baseColor:a.BLACK}});let t=new b("layer").addTo(e),i=`
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
      `,m=new l("//lab.earthsdk.com/model/27af3f70003311eaae02359b3e5d0653/tileset.json");m.setCustomShader(i);let d=new l("//lab.earthsdk.com/model/212bc470003311eaae02359b3e5d0653/tileset.json");d.setCustomShader(i);let c=new l("//lab.earthsdk.com/model/1b91bf10003311eaae02359b3e5d0653/tileset.json");c.setCustomShader(i),t.addOverlay(m).addOverlay(d).addOverlay(c);let p=new v("layer1");e.addLayer(p);let s=new w("116.38789554,39.89911368",500);s.setStyle({material:new y({image:"product/icon/circleScan.png",color:new a(0,1,1,.8),transparent:!0}),perPositionHeight:!0,outline:!0,outlineColor:new a(0,1,1,.8)}),s.rotateAmount=3,p.addOverlay(s);let _=new g("layer").addTo(e),u=new C("116.3994748,39.90784756",800);u.setStyle({color:new a(0,1,1,.5)}),_.addOverlay(u),e.flyToPosition("116.3904847,39.8773787,2807.38,0,-48.89")}O(()=>{o()});const r={get viewer(){return e},set viewer(t){e=t},initViewer:o};return Object.defineProperty(r,"__isScriptSetup",{enumerable:!1,value:!0}),r}});function z(f,n,e,o,r,t){return null}const W=j(x,[["render",z],["__file","factoryWidget.vue"]]);export{W as default};
