import{j as f,bU as g}from"./vendor-6kqmRazU.js";import{j as S}from"./xframelib-exp-CPl8XRlL.js";import{d as M,v as E,r as b,M as y,L as l,Q as u,a1 as c,R as z,a9 as w}from"./@vue-exp-BA8o4xMK.js";import{_ as A}from"./index-CTmLOYTS.js";import"./@hprose-exp-BDOQuVAD.js";import"./axios-exp-BH40TtQM.js";import"./vue-router-exp-BxGuMefC.js";const D=`
#version 300 es
// 是否使用立方体贴图阴影
  #define USE_CUBE_MAP_SHADOW true
  
  // 输入的纹理坐标
  in vec2 v_textureCoordinates;
  out vec4 out_color;
  // 颜色纹理采样器
  uniform sampler2D colorTexture;
  // 深度纹理采样器
  uniform sampler2D depthTexture;
  // 立方体贴图阴影纹理采样器
  uniform samplerCube shadowMap_textureCube;
  
  // 相机投影矩阵
  uniform mat4 camera_projection_matrix;
  // 相机视图矩阵
  uniform mat4 camera_view_matrix;
  
  // 阴影映射相关矩阵
  uniform mat4 shadowMap_matrix;
  
  // 阴影光源在眼坐标下的位置
  uniform vec4 shadowMap_lightPositionEC;
  // 包含阴影映射的一些参数，如法线偏移、缩放、距离、最大距离和暗度等
  uniform vec4 shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness;
  // 包含阴影映射的纹素大小、深度偏差、法线平滑等参数
  uniform vec4 shadowMap_texelSizeDepthBiasAndNormalShadingSmooth;
  
  // 可视距离相关参数
  uniform float helsing_viewDistance;
  // 可视区域颜色
  uniform vec4 helsing_visibleAreaColor;
  // 不可视区域颜色
  uniform vec4 helsing_invisibleAreaColor;
  
  // 定义阴影参数结构体
  struct zx_shadowParameters {
      vec3 texCoords;
      float depthBias;
      float depth;
      float nDotL;
      vec2 texelStepSize;
      float normalShadingSmooth;
      float darkness;
  };
  
  // 计算阴影可见性的函数
  float czm_shadowVisibility(samplerCube shadowMap, zx_shadowParameters shadowParameters) {
      float depthBias = shadowParameters.depthBias;
      float depth = shadowParameters.depth;
      float nDotL = shadowParameters.nDotL;
      float normalShadingSmooth = shadowParameters.normalShadingSmooth;
      float darkness = shadowParameters.darkness;
      vec3 uvw = shadowParameters.texCoords;
  
      depth -= depthBias;
      float visibility = czm_shadowDepthCompare(shadowMap, uvw, depth);
  
      return czm_private_shadowVisibility(visibility, nDotL, normalShadingSmooth, darkness);
  }
  
  // 获取在眼坐标下的位置
  vec4 getPositionEC() {
      return czm_windowToEyeCoordinates(gl_FragCoord);
  }
  
  // 获取在眼坐标下的法线（这里简单返回一个固定值，可能需要根据实际情况修改）
  vec3 getNormalEC() {
      return vec3(1.);
  }
  
  // 将纹理坐标和深度转换为在相机坐标下的位置
  vec4 toEye(in vec2 uv, in float depth) {
      vec2 xy = vec2((uv.x * 2. - 1.), (uv.y * 2. - 1.));
      vec4 posInCamera = czm_inverseProjection * vec4(xy, depth, 1.);
      posInCamera = posInCamera / posInCamera.w;
      return posInCamera;
  }
  
  // 将点投影到平面上的函数（这里可能需要根据具体平面参数进一步使用）
  vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point) {
      vec3 v01 = point - planeOrigin;
      float d = dot(planeNormal, v01);
      return (point - planeNormal * d);
  }
  
  // 获取深度值的函数
  float getDepth(in vec4 depth) {
      float z_window = czm_unpackDepth(depth);
      z_window = czm_reverseLogDepth(z_window);
      float n_range = czm_depthRange.near;
      float f_range = czm_depthRange.far;
      return (2. * z_window - n_range - f_range) / (f_range - n_range);
  }
  
  // 计算阴影的函数
  float shadow(in vec4 positionEC) {
      vec3 normalEC = getNormalEC();
      zx_shadowParameters shadowParameters;
  
      shadowParameters.texelStepSize = shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.xy;
      shadowParameters.depthBias = shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.z;
      shadowParameters.normalShadingSmooth = shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.w;
      shadowParameters.darkness = shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness.w;
  
      vec3 directionEC = positionEC.xyz - shadowMap_lightPositionEC.xyz;
      float distance = length(directionEC);
      directionEC = normalize(directionEC);
      float radius = shadowMap_lightPositionEC.w;
  
      if (distance > radius) {
          return 2.0;
      }
  
      vec3 directionWC = czm_inverseViewRotation * directionEC;
      shadowParameters.depth = distance / radius - 0.0003;
      shadowParameters.nDotL = clamp(dot(normalEC, -directionEC), 0., 1.);
      shadowParameters.texCoords = directionWC;
  
      float visibility = czm_shadowVisibility(shadowMap_textureCube, shadowParameters);
  
      return visibility;
  }
  
  // 判断是否可见的函数
  bool visible(in vec4 result) {
      result.x /= result.w;
      result.y /= result.w;
      result.z /= result.w;
      return result.x >= -1. && result.x <= 1.
          && result.y >= -1. && result.y <= 1.
          && result.z >= -1. && result.z <= 1.;
  }
  
  // 主函数，片段着色器的入口点
  void main() {
      // 从颜色纹理采样获取颜色
      out_color = texture(colorTexture, v_textureCoordinates);
      // gl_FragColor 是一个内置变量，无法声明为输出变量
      // gl_FragColor = texture(colorTexture, v_textureCoordinates);
  
      // 从深度纹理采样获取深度值
      float depth = getDepth(texture(depthTexture, v_textureCoordinates));
  
      // 将纹理坐标和深度转换为在相机坐标下的位置
      vec4 viewPos = toEye(v_textureCoordinates, depth);
  
      // 将相机坐标下的位置转换为世界坐标
      vec4 wordPos = czm_inverseView * viewPos;
  
      // 将世界坐标转换为虚拟相机中坐标
      vec4 vcPos = camera_view_matrix * wordPos;
  
      float near = 0.001 * helsing_viewDistance;
      float dis = length(vcPos.xyz);
  
      if (dis > near && dis < helsing_viewDistance) {
          // 进行透视投影
          vec4 posInEye = camera_projection_matrix * vcPos;
  
          if (visible(posInEye)) {
              float vis = shadow(viewPos);
  
              if (vis > 0.3) {
                out_color = mix(texture(colorTexture, v_textureCoordinates), helsing_visibleAreaColor, 0.5);
              } else {
                out_color = mix(texture(colorTexture, v_textureCoordinates), helsing_invisibleAreaColor, 0.5);
              }
          }
      }
  }`;class R{constructor(i,e){this.viewer=i,this.viewPosition=e.viewPosition,this.viewPositionEnd=e.viewPositionEnd,this.viewDistance=this.viewPositionEnd?Cesium.Cartesian3.distance(this.viewPosition,this.viewPositionEnd):e.viewDistance||100,this.viewHeading=this.viewPositionEnd?this.getHeading(this.viewPosition,this.viewPositionEnd):e.viewHeading||0,this.viewPitch=this.viewPositionEnd?this.getPitch(this.viewPosition,this.viewPositionEnd):e.viewPitch||0,this.horizontalViewAngle=e.horizontalViewAngle||90,this.verticalViewAngle=e.verticalViewAngle||60,this.visibleAreaColor=e.visibleAreaColor||Cesium.Color.GREEN,this.invisibleAreaColor=e.invisibleAreaColor||Cesium.Color.RED,this.enabled=typeof e.enabled=="boolean"?e.enabled:!0,this.softShadows=typeof e.softShadows=="boolean"?e.softShadows:!0,this.size=e.size||2048}add(){this.createLightCamera(),this.createShadowMap(),this.drawSketch(),this.createPostStage()}update(){this.clear(),this.add()}updatePosition(i){this.viewPositionEnd=i,this.viewDistance=Cesium.Cartesian3.distance(this.viewPosition,this.viewPositionEnd),this.viewHeading=this.getHeading(this.viewPosition,this.viewPositionEnd),this.viewPitch=this.getPitch(this.viewPosition,this.viewPositionEnd)}clear(){this.sketch&&(this.viewer.entities.remove(this.sketch),this.sketch=null),this.frustumOutline&&(this.viewer.scene.primitives.destroy(),this.frustumOutline=null),this.postStage&&(this.viewer.scene.postProcessStages.remove(this.postStage),this.postStage=null)}createLightCamera(){this.lightCamera=new Cesium.Camera(this.viewer.scene),this.lightCamera.position=this.viewPosition,this.lightCamera.frustum.near=this.viewDistance*.001,this.lightCamera.frustum.far=this.viewDistance;const i=Cesium.Math.toRadians(this.horizontalViewAngle),e=Cesium.Math.toRadians(this.verticalViewAngle),t=this.viewDistance*Math.tan(i/2)*2/(this.viewDistance*Math.tan(e/2)*2);this.lightCamera.frustum.aspectRatio=t,i>e?this.lightCamera.frustum.fov=i:this.lightCamera.frustum.fov=e,this.lightCamera.setView({destination:this.viewPosition,orientation:{heading:Cesium.Math.toRadians(this.viewHeading||0),pitch:Cesium.Math.toRadians(this.viewPitch||0),roll:0}})}createShadowMap(){this.shadowMap=new Cesium.ShadowMap({context:this.viewer.scene.context,lightCamera:this.lightCamera,enabled:this.enabled,isPointLight:!0,pointLightRadius:this.viewDistance,cascadesEnabled:!1,size:this.size,softShadows:this.softShadows,normalOffset:!1,fromLightSource:!1}),this.viewer.scene.shadowMap=this.shadowMap}createPostStage(){const i=D,e=new Cesium.PostProcessStage({fragmentShader:i,uniforms:{shadowMap_textureCube:()=>(this.shadowMap.update(Reflect.get(this.viewer.scene,"_frameState")),Reflect.get(this.shadowMap,"_shadowMapTexture")),shadowMap_matrix:()=>(this.shadowMap.update(Reflect.get(this.viewer.scene,"_frameState")),Reflect.get(this.shadowMap,"_shadowMapMatrix")),shadowMap_lightPositionEC:()=>(this.shadowMap.update(Reflect.get(this.viewer.scene,"_frameState")),Reflect.get(this.shadowMap,"_lightPositionEC")),shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness:()=>{this.shadowMap.update(Reflect.get(this.viewer.scene,"_frameState"));const t=this.shadowMap._pointBias;return Cesium.Cartesian4.fromElements(t.normalOffsetScale,this.shadowMap._distance,this.shadowMap.maximumDistance,0,new Cesium.Cartesian4)},shadowMap_texelSizeDepthBiasAndNormalShadingSmooth:()=>{this.shadowMap.update(Reflect.get(this.viewer.scene,"_frameState"));const t=this.shadowMap._pointBias,r=new Cesium.Cartesian2;return r.x=1/this.shadowMap._textureSize.x,r.y=1/this.shadowMap._textureSize.y,Cesium.Cartesian4.fromElements(r.x,r.y,t.depthBias,t.normalShadingSmooth,new Cesium.Cartesian4)},camera_projection_matrix:this.lightCamera.frustum.projectionMatrix,camera_view_matrix:this.lightCamera.viewMatrix,helsing_viewDistance:()=>this.viewDistance,helsing_visibleAreaColor:this.visibleAreaColor,helsing_invisibleAreaColor:this.invisibleAreaColor}});this.postStage=this.viewer.scene.postProcessStages.add(e)}drawFrustumOutline(){const i=new Cesium.Cartesian3,e=new Cesium.Matrix3,t=new Cesium.Quaternion;this.lightCamera.positionWC;const s=this.lightCamera.directionWC,r=this.lightCamera.upWC;let d=this.lightCamera.rightWC;d=Cesium.Cartesian3.negate(d,i);let o=e;Cesium.Matrix3.setColumn(o,0,d,o),Cesium.Matrix3.setColumn(o,1,r,o),Cesium.Matrix3.setColumn(o,2,s,o);let a=Cesium.Quaternion.fromRotationMatrix(o,t),n=new Cesium.GeometryInstance({geometry:new Cesium.FrustumOutlineGeometry({frustum:this.lightCamera.frustum,origin:this.viewPosition,orientation:a}),id:Math.random().toString(36).substr(2),attributes:{color:Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.YELLOWGREEN),show:new Cesium.ShowGeometryInstanceAttribute(!0)}});this.frustumOutline=this.viewer.scene.primitives.add(new Cesium.Primitive({geometryInstances:[n],appearance:new Cesium.PerInstanceColorAppearance({flat:!0,translucent:!1})}))}drawSketch(){this.sketch=this.viewer.entities.add({name:"sketch",position:this.viewPosition,orientation:new Cesium.CallbackProperty(()=>Cesium.Transforms.headingPitchRollQuaternion(this.viewPosition,Cesium.HeadingPitchRoll.fromDegrees(this.viewHeading-this.horizontalViewAngle,this.viewPitch,.5)),!1),ellipsoid:{radii:new Cesium.CallbackProperty(()=>new Cesium.Cartesian3(this.viewDistance,this.viewDistance,this.viewDistance),!1),innerRadii:new Cesium.Cartesian3(2,2,2),minimumClock:Cesium.Math.toRadians(-this.horizontalViewAngle/2),maximumClock:Cesium.Math.toRadians(this.horizontalViewAngle/2),minimumCone:Cesium.Math.toRadians(this.verticalViewAngle+7.75),maximumCone:Cesium.Math.toRadians(180-this.verticalViewAngle-7.75),fill:!1,outline:!0,subdivisions:256,stackPartitions:64,slicePartitions:64,outlineColor:Cesium.Color.YELLOWGREEN}})}getHeading(i,e){let t=new Cesium.Cartesian3,s=Cesium.Transforms.eastNorthUpToFixedFrame(i);return Cesium.Matrix4.inverse(s,s),Cesium.Matrix4.multiplyByPoint(s,e,t),Cesium.Cartesian3.normalize(t,t),Cesium.Math.toDegrees(Math.atan2(t.x,t.y))}getPitch(i,e){let t=new Cesium.Cartesian3,s=Cesium.Transforms.eastNorthUpToFixedFrame(i);return Cesium.Matrix4.inverse(s,s),Cesium.Matrix4.multiplyByPoint(s,e,t),Cesium.Cartesian3.normalize(t,t),Cesium.Math.toDegrees(Math.asin(t.z))}}const k=M({__name:"viewShedWidget",setup(C,{expose:i}){i();let e;E(async()=>{e=S.CesiumViewer;let a=await Cesium.Cesium3DTileset.fromUrl("http://mars3d.gis.digsur.com/3dtiles/bim-daxue/tileset.json");e.scene.primitives.add(a),e.flyToTarget(a)});let t=null,s=b(!0);const o={get viewer(){return e},set viewer(a){e=a},get viewShed(){return t},set viewShed(a){t=a},get enableAnalys(){return s},set enableAnalys(a){s=a},shootAreaAnalysis:a=>{let n=0,_=90,P=60,h=null,m=new Cesium.ScreenSpaceEventHandler(e.scene.canvas);m.setInputAction(p=>{if(n++,n===1){let v=e.scene.pickPosition(p.position);if(!v)return;t=new R(e,{viewPosition:v,viewPositionEnd:v,horizontalViewAngle:_,verticalViewAngle:P}),m.setInputAction(x=>{h=e.scene.pickPosition(x.endPosition),h&&(t.updatePosition(h),t.sketch||t.drawSketch())},Cesium.ScreenSpaceEventType.MOUSE_MOVE)}n===2&&(n=0,h=e.scene.pickPosition(p.position),t.updatePosition(h),t.update(),m&&m.destroy(),s.value=!1)},Cesium.ScreenSpaceEventType.LEFT_CLICK)},clear:()=>{t.clear(),s.value=!0}};return Object.defineProperty(o,"__isScriptSetup",{enumerable:!1,value:!0}),o}}),V={class:"container"},T={class:"q-mb-sm"};function B(C,i,e,t,s,r){return z(),y("div",V,[l("div",T,[u(f,{onClick:t.shootAreaAnalysis,color:"primary",class:"q-mr-sm",disable:!t.enableAnalys},{default:c(()=>i[0]||(i[0]=[w("开始分析")])),_:1},8,["disable"]),u(f,{onClick:t.clear,color:"primary",disable:t.enableAnalys},{default:c(()=>i[1]||(i[1]=[w("清除")])),_:1},8,["disable"])]),l("div",null,[l("div",null,[u(g,{color:"green",class:"text-green q-mr-sm"},{default:c(()=>i[2]||(i[2]=[w("可视范围")])),_:1}),i[3]||(i[3]=l("span",null,"可视范围",-1))]),l("div",null,[u(g,{color:"red",class:"text-red q-mr-sm"},{default:c(()=>i[4]||(i[4]=[w("可视范围")])),_:1}),i[5]||(i[5]=l("span",null,"不可视范围",-1))])])])}const j=A(k,[["render",B],["__scopeId","data-v-2633425c"],["__file","viewShedWidget.vue"]]);export{j as default};
