import{j as s}from"./xframelib-exp-CvTEfE5n.js";import{d as o,v as m}from"./@vue-exp-YaP0LnBg.js";import{_ as u}from"./index-urNJi4nj.js";import"./axios-exp-BH40TtQM.js";import"./vendor-CDV5M84i.js";import"./@hprose-exp-DifMA6AO.js";import"./vue-router-exp-BeFgxScw.js";const c=o({__name:"DynamicWaterWidget",setup(n,{expose:i}){i();function t(){var e=s.CesiumViewer;Cesium.FeatureDetection.supportsImageRenderingPixelated()&&(e.resolutionScale=window.devicePixelRatio),e.scene.postProcessStages.fxaa.enabled=!0,e.scene.globe.depthTestAgainstTerrain=!0,e.scene.primitives.add(new Cesium.Primitive({geometryInstances:new Cesium.GeometryInstance({geometry:new Cesium.RectangleGeometry({rectangle:Cesium.Rectangle.fromDegrees(103.3,29.25,103.45,29.35),height:530,vertexFormat:Cesium.VertexFormat.DEFAULT})}),appearance:new Cesium.EllipsoidSurfaceAppearance({material:new Cesium.Material({fabric:{type:"Water",uniforms:{baseWaterColor:new Cesium.Color(64/255,157/255,200/255,.5),normalMap:Cesium.buildModuleUrl("Assets/Textures/waterNormals.jpg"),frequency:1e3,animationSpeed:.1,amplitude:10,specularIntensity:10}}})})}));const a=Cesium.Cartesian3.fromDegrees(103.37,29.15);e.camera.lookAt(a,new Cesium.Cartesian3(0,-47900,39300)),e.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)}m(()=>{t()});const r={init:t};return Object.defineProperty(r,"__isScriptSetup",{enumerable:!1,value:!0}),r}});function p(n,i,t,r,e,a){return null}const x=u(c,[["render",p],["__file","DynamicWaterWidget.vue"]]);export{x as default};