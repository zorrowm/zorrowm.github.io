function i(e,t){this._definitionChanged=new Cesium.Event,this.duration=e,this.image=t,this._time=performance.now()}Object.defineProperties(i.prototype,{isConstant:{get:function(){return!1}},definitionChanged:{get:function(){return this._definitionChanged}},color:Cesium.createPropertyDescriptor("color"),duration:Cesium.createPropertyDescriptor("duration")});i.prototype.getType=function(e){return"Spriteline1"};i.prototype.getValue=function(e,t){return Cesium.defined(t)||(t={}),t.image=this.image,t.time=(performance.now()-this._time)%this.duration/this.duration,t};i.prototype.equals=function(e){return this===e||e instanceof i&&this.duration===e.duration};Cesium.Material.Spriteline1Type="Spriteline1";Cesium.Material.Spriteline1Source=`
czm_material czm_getMaterial(czm_materialInput materialInput)
{
czm_material material = czm_getDefaultMaterial(materialInput);
vec2 st = materialInput.st;
vec4 colorImage = texture(image, vec2(fract(st.s - time), st.t));
material.alpha = colorImage.a;
material.diffuse = colorImage.rgb * 1.5 ;
return material;
}
`;Cesium.Material._materialCache.addMaterial(Cesium.Material.Spriteline1Type,{fabric:{type:Cesium.Material.Spriteline1Type,uniforms:{color:new Cesium.Color(1,0,0,.5),image:"",transparent:!0,time:20},source:Cesium.Material.Spriteline1Source},translucent:function(e){return!0}});export{i as S};
