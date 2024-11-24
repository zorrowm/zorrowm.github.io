import{j as m}from"./xframelib-exp-CvTEfE5n.js";import{d as l,v as c}from"./@vue-exp-YaP0LnBg.js";import{_ as u}from"./index-urNJi4nj.js";import"./axios-exp-BH40TtQM.js";import"./vendor-CDV5M84i.js";import"./@hprose-exp-DifMA6AO.js";import"./vue-router-exp-BeFgxScw.js";const d=l({__name:"RadarScanWidget",setup(s,{expose:t}){t();function a(){var e=m.CesiumViewer;Cesium.FeatureDetection.supportsImageRenderingPixelated()&&(e.resolutionScale=window.devicePixelRatio),e.scene.postProcessStages.fxaa.enabled=!0;var i=e.scene,n=new Cesium.CircleGeometry({center:Cesium.Cartesian3.fromDegrees(-74.02,40.69),radius:200,vertexFormat:Cesium.VertexFormat.POSITION_AND_ST}),o=new Cesium.GeometryInstance({geometry:n});i.primitives.add(new Cesium.GroundPrimitive({geometryInstances:o,appearance:new Cesium.MaterialAppearance({material:new Cesium.Material({translucent:!1,fabric:{uniforms:{color:new Cesium.Color(0,1,0),rotate:90,percent:.1},source:`                  
 uniform vec4 color;                 
 uniform float percent;                                    
 float get_angle(vec2 base,vec2 dir)                  
 {                    
 base = normalize(base);                    
 dir = normalize(dir);                    
 float angle = degrees(acos(abs(dot(dir,base))));                    
 if (dir.s > 0.0 && dir.t > 0.0){angle = angle;}                    
 else if (dir.s < 0.0 && dir.t > 0.0){angle = 180.0 - angle;}                    
 else if (dir.s < 0.0 && dir.t < 0.0){angle = 180.0 + angle;}                    
 else{angle = 360.0 - angle;}                    
 return angle;                  
 }                  
 czm_material czm_getMaterial(czm_materialInput materialInput)                  
 {                    
 czm_material material = czm_getDefaultMaterial(materialInput);                    
 material.diffuse = czm_gammaCorrect(color.rgb);                     
 vec2 st = materialInput.st;                    
 vec2 base = vec2(0.5,0.0);                    
 vec2 dir = st-vec2(0.5,0.5);                    
 float len = length(dir);                    
 if(len > 0.49){                      
 material.alpha = 1.0;                      
 material.diffuse = vec3(1.0,1.0,0.0);                     
 material.emission=vec3(0.2);                    
 }                    
 else{                     
 float angle = get_angle(base,dir);                      
 material.alpha = (mod(angle + (-czm_frameNumber),360.0)-(1.0-percent)*360.0)/(360.0*percent); 
 material.emission=vec3(0.5);                    
 }                    
 return material;                  
 } `}})})})),e.camera.flyToBoundingSphere(Cesium.CircleGeometry.createGeometry(n).boundingSphere)}c(()=>{a()});const r={init:a};return Object.defineProperty(r,"__isScriptSetup",{enumerable:!1,value:!0}),r}});function p(s,t,a,r,e,i){return null}const w=u(d,[["render",p],["__file","RadarScanWidget.vue"]]);export{w as default};
