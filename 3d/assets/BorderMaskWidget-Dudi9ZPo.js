import{j as f}from"./xframelib-exp-CPl8XRlL.js";import{b as g}from"./sichuan-CmrZM-K6.js";import{d as w,v as C}from"./@vue-exp-BA8o4xMK.js";import{_ as d}from"./index-CTmLOYTS.js";import"./axios-exp-BH40TtQM.js";import"./vendor-6kqmRazU.js";import"./@hprose-exp-BDOQuVAD.js";import"./vue-router-exp-BxGuMefC.js";const n=`uniform vec4 color;
uniform float glowPower;
uniform float taperPower;
czm_material czm_getMaterial(czm_materialInput materialInput)
{
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = materialInput.st;
    float glow = glowPower / abs(st.t - 0.5) - (glowPower / 0.5);
    if (taperPower <= 0.99999) 
    {
        glow *= min(1.0, taperPower / (0.5 - st.s * 0.5) - (taperPower / 0.5));
    }
    vec4 fragColor;
    fragColor.rgb = max(vec3(glow - 1.0 + color.rgb), color.rgb);
    fragColor.a = clamp(0.0, 1.0, glow) * color.a;
    fragColor = czm_gammaCorrect(fragColor);
    material.emission = fragColor.rgb;material.alpha = fragColor.a;
    return material;
}`,y=w({__name:"BorderMaskWidget",setup(s,{expose:a}){a();function r(){const e=f.CesiumViewer;Cesium.FeatureDetection.supportsImageRenderingPixelated()&&(e.resolutionScale=window.devicePixelRatio),e.scene.postProcessStages.fxaa.enabled=!0;const t=g.features[0].geometry.coordinates;let i=new Cesium.PolylineGeometry({positions:Cesium.Cartesian3.fromDegreesArray(t.flat(2)),width:10});const l=new Cesium.GeometryInstance({geometry:i}),c=new Cesium.Primitive({geometryInstances:l,appearance:new Cesium.PolylineMaterialAppearance({material:new Cesium.Material({fabric:{type:"MyBorderColor",uniforms:{color:new Cesium.Color(.2,.2,.8,1),glowPower:.25,taperPower:1},source:n}})}),allowPicking:!1}),u=new Cesium.GeometryInstance({geometry:new Cesium.PolygonGeometry({polygonHierarchy:new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray([45,10,45,60,145,60,145,10]),[new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(t.flat(2)))])})}),p=new Cesium.GroundPrimitive({geometryInstances:u,appearance:new Cesium.MaterialAppearance({material:new Cesium.Material({fabric:{type:"Color",uniforms:{color:Cesium.Color.BLACK.withAlpha(.7)}}})}),allowPicking:!1});e.scene.primitives.add(c),e.scene.primitives.add(p),e.camera.flyToBoundingSphere(Cesium.PolylineGeometry.createGeometry(i).boundingSphere,{duration:0})}C(()=>{r()});const o={glowEeffect:n,init:r};return Object.defineProperty(o,"__isScriptSetup",{enumerable:!1,value:!0}),o}});function _(s,a,r,o,e,m){return null}const k=d(y,[["render",_],["__file","BorderMaskWidget.vue"]]);export{k as default};
