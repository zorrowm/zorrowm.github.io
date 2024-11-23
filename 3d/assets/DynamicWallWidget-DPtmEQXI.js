import{j as I}from"./xframelib-exp-CvTEfE5n.js";import{d,v as y}from"./@vue-exp-YaP0LnBg.js";import{_ as b}from"./index-BTOrG-4i.js";import"./axios-exp-BH40TtQM.js";import"./vendor-CDV5M84i.js";import"./@hprose-exp-DifMA6AO.js";import"./vue-router-exp-BeFgxScw.js";const w=d({__name:"DynamicWallWidget",setup(f,{expose:s}){s();function m(){var e=I.CesiumViewer;e.scene.postProcessStages.fxaa.enabled=!0;var a=e.scene,c=new Cesium.GeometryInstance({geometry:Cesium.WallGeometry.fromConstantHeights({positions:Cesium.Cartesian3.fromDegreesArray([-115,44,-90,44]),maximumHeight:2e5,minimumHeight:1e5,vertexFormat:Cesium.VertexFormat.POSITION_AND_ST}),attributes:{color:Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED)}}),n=a.primitives.add(new Cesium.Primitive({geometryInstances:c,appearance:new Cesium.MaterialAppearance({material:new Cesium.Material({fabric:{uniforms:{color:new Cesium.Color(1,0,0),offset:0},source:`uniform vec4 color;                                   
 uniform float offset;                                   
 czm_material czm_getMaterial(czm_materialInput materialInput)                                   
 {                                       
 czm_material material = czm_getDefaultMaterial(materialInput);                                       
 vec2 st = materialInput.st;                                       
 material.diffuse = color.rgb;                                       
 material.alpha = fract(1.0 - st.t + offset);                                       
 material.emission=vec3(0.5);                                       
 return material;                                   
 }`}})})})),p=new Cesium.GeometryInstance({geometry:Cesium.WallGeometry.fromConstantHeights({positions:Cesium.Cartesian3.fromDegreesArray([-107,43,-97,43,-97,40,-107,40,-107,43]),maximumHeight:1e5,vertexFormat:Cesium.VertexFormat.POSITION_AND_ST}),attributes:{color:Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.GREEN)}}),l=a.primitives.add(new Cesium.Primitive({geometryInstances:p,appearance:new Cesium.MaterialAppearance({material:new Cesium.Material({fabric:{uniforms:{color:new Cesium.Color(0,1,0),offset:0},source:`
 uniform vec4 color;
 uniform float offset;
 czm_material czm_getMaterial(czm_materialInput materialInput)    
 {
 czm_material material = czm_getDefaultMaterial(materialInput); 
 vec2 st = materialInput.st;
 material.diffuse = color.rgb; 
 material.alpha = fract(1.0 - st.t + offset); 
 material.emission=vec3(0.5);
 return material;
 }`}})})})),C=Cesium.Cartesian3.fromDegreesArray([-115,50,-112.5,50,-110,50,-107.5,50,-105,50,-102.5,50,-100,50,-97.5,50,-95,50,-92.5,50,-90,50]),_=[1e5,2e5,1e5,2e5,1e5,2e5,1e5,2e5,1e5,2e5,1e5],v=[0,1e5,0,1e5,0,1e5,0,1e5,0,1e5,0],g=new Cesium.GeometryInstance({geometry:new Cesium.WallGeometry({positions:C,maximumHeights:_,minimumHeights:v,vertexFormat:Cesium.VertexFormat.POSITION_AND_ST}),attributes:{color:Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.BLUE)}}),u=a.primitives.add(new Cesium.Primitive({geometryInstances:g,appearance:new Cesium.MaterialAppearance({material:new Cesium.Material({fabric:{uniforms:{color:new Cesium.Color(0,0,1),offset:0},source:`
 uniform vec4 color;
 uniform float offset;
 czm_material czm_getMaterial(czm_materialInput materialInput)
 {                                       czm_material material = czm_getDefaultMaterial(materialInput);
 vec2 st = materialInput.st;
 material.diffuse = color.rgb;                                       
 material.alpha = fract(1.0 - st.t + offset);                                       
 material.emission=vec3(0.5);                                       
 return material;                                   
 }`}})})}));e.scene.preUpdate.addEventListener(function(){var r=n.appearance.material.uniforms.offset;r+=.01,r>1&&(r=0),n.appearance.material.uniforms.offset=r;var t=l.appearance.material.uniforms.offset;t+=.01,t>1&&(t=0),l.appearance.material.uniforms.offset=t;var i=u.appearance.material.uniforms.offset;i+=.01,i>1&&(i=0),u.appearance.material.uniforms.offset=i})}y(()=>{m()});const o={init:m};return Object.defineProperty(o,"__isScriptSetup",{enumerable:!1,value:!0}),o}});function z(f,s,m,o,e,a){return null}const S=b(w,[["render",z],["__file","DynamicWallWidget.vue"]]);export{S as default};
