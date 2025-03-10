import{j as p}from"./xframelib-exp-CPl8XRlL.js";import{b as u}from"./sichuan-CmrZM-K6.js";import{d as f,v as g}from"./@vue-exp-BA8o4xMK.js";import{_ as w}from"./index-CTmLOYTS.js";import"./axios-exp-BH40TtQM.js";import"./vendor-6kqmRazU.js";import"./@hprose-exp-BDOQuVAD.js";import"./vue-router-exp-BxGuMefC.js";const n=`uniform vec4 color;
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
}`,d=f({__name:"BorderGlowWidget",setup(l,{expose:a}){a();function o(){const e=p.CesiumViewer;Cesium.FeatureDetection.supportsImageRenderingPixelated()&&(e.resolutionScale=window.devicePixelRatio),e.scene.postProcessStages.fxaa.enabled=!0;for(const i of u.features){const s=i.geometry.coordinates;let r=new Cesium.PolylineGeometry({positions:Cesium.Cartesian3.fromDegreesArray(s.flat(2)),width:10});const m=new Cesium.GeometryInstance({geometry:r}),c=new Cesium.Primitive({geometryInstances:m,appearance:new Cesium.PolylineMaterialAppearance({material:new Cesium.Material({fabric:{type:"MyBorderColor",uniforms:{color:new Cesium.Color(.8,.2,.5,1),glowPower:.25,taperPower:1},source:n}})}),allowPicking:!1});e.scene.primitives.add(c),r=Cesium.PolylineGeometry.createGeometry(r),e.camera.flyToBoundingSphere(r.boundingSphere,{duration:0})}}g(()=>{o()});const t={glowEeffect:n,init:o};return Object.defineProperty(t,"__isScriptSetup",{enumerable:!1,value:!0}),t}});function _(l,a,o,t,e,i){return null}const z=w(d,[["render",_],["__file","BorderGlowWidget.vue"]]);export{z as default};
