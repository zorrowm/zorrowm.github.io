import{j as c}from"./xframelib-exp-CvTEfE5n.js";import{ao as f,aq as g,bz as v,bM as _}from"./vendor-CDV5M84i.js";import{d as b,v as w,M as y,L as n,a9 as h,R as k}from"./@vue-exp-YaP0LnBg.js";import{_ as C}from"./index-DPO_t7vI.js";import"./axios-exp-BH40TtQM.js";import"./@hprose-exp-DifMA6AO.js";import"./vue-router-exp-BeFgxScw.js";const x=b({__name:"flyingWidget",setup(p,{expose:t}){t();let i,e;function r(){let o=document.getElementsByName("check_loop")[0].checked;e=new _(i,{loop:o,dwellTime:3}),e.positions=[{lng:121.46748793889597,lat:31.22345700031846,alt:1082.6691622203975,heading:.9161118327237789,pitch:-38.63414039808751},{lng:121.49543157056694,lat:31.219611353179484,alt:663.5376240776116,heading:.9161124649627334,pitch:-38.63418986635751},{lng:121.53162234574106,lat:31.228003869427294,alt:1891.926162456467,heading:298.6565902579582,pitch:-33.67285705092492},{lng:121.54438164431083,lat:31.25201585389836,alt:1441.4625182144541,heading:298.65660919687264,pitch:-33.6728415156399}],e.start()}function s(){e.pause()}function l(){e.restore()}function u(){i=c.CesiumViewer;let o=new f("layer").addTo(i),a=new g("//resource.dvgis.cn/data/3dtiles/ljz/tileset.json"),d=new v({fragmentShaderText:`
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
      `});a.setCustomShader(d),o.addOverlay(a),i.flyTo(a)}w(()=>{u()});const m={get viewer(){return i},set viewer(o){i=o},get flying(){return e},set flying(o){e=o},start:r,pause:s,restore:l,initViewer:u};return Object.defineProperty(m,"__isScriptSetup",{enumerable:!1,value:!0}),m}}),z={class:"btn-box"};function E(p,t,i,e,r,s){return k(),y("div",z,[n("ul",null,[t[3]||(t[3]=n("li",null,[n("input",{type:"checkbox",name:"check_loop"}),h(" 是否循环 ")],-1)),n("li",null,[n("button",{onClick:t[0]||(t[0]=l=>e.start())},"开始")]),n("li",null,[n("button",{onClick:t[1]||(t[1]=l=>e.pause())},"暂停")]),n("li",null,[n("button",{onClick:t[2]||(t[2]=l=>e.restore())},"继续")])])])}const N=C(x,[["render",E],["__file","flyingWidget.vue"]]);export{N as default};
