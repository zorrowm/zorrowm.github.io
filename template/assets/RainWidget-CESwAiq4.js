import{i as d,j as p,_ as g}from"./index-DylLUN-r.js";import{S as u}from"./SystemsEvent-DUQCZw_Q.js";import{W as f}from"./xframelib-exp-uSJ3EBow.js";import{d as _,o as x,a as S,e as w,b as h}from"./@vue-exp-CzdoyapG.js";import"./monaco-editor-exp-BNK_u0iZ.js";import"./vendor-CSzZZ-de.js";import"./lottie-web-exp-CIY4INm7.js";import"./quasar-exp-B7YDMHDE.js";import"./xgis-cesium-exp-Cbv1lISI.js";import"./vue-router-exp-B23Vo4Jw.js";import"./axios-exp-C7rfqWEd.js";import"./@iconify/vue-exp-BLEeEXwl.js";const C="rainWidget",y=_({name:C,components:{},setup(){let r,i=!1;function e(){return f.CesiumViewer&&(r||(r=f.CesiumViewer)),r}let t=null;const a=`uniform sampler2D colorTexture;
        in vec2 v_textureCoordinates;
        uniform float tiltAngle;
        uniform float rainSize;
        uniform float rainWidth;
        uniform float rainSpeed;
        float hash(float x){
           return fract(sin(x*233.3)*13.13);
        }
        out vec4 vFragColor;
       void main(void){
         float time = czm_frameNumber / rainSpeed;
         vec2 resolution = czm_viewport.zw;
         vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);
         vec3 c=vec3(1.0,1.0,1.0);
         float a= tiltAngle;
         float si=sin(a),co=cos(a);
         uv*=mat2(co,-si,si,co);
         uv*=length(uv+vec2(0,4.9))*rainSize + 1.;
         float v = 1.0 - abs(sin(hash(floor(uv.x * rainWidth)) * 2.0));
         float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;
         c*=v*b;
         vFragColor = mix(texture(colorTexture, v_textureCoordinates), vec4(c,.3), .3);
       }
 `,s=(o,v)=>{m();var c=new Cesium.PostProcessStage({name:"hi_rain",fragmentShader:a,uniforms:{tiltAngle:.5,rainSize:.6,rainWidth:o,rainSpeed:v}});const l=e();l.scene.postProcessStages.add(c),l.scene.requestRender(),t=c},m=()=>{const o=e();t&&o.scene.postProcessStages.remove(t),t=null};function n(){e()&&s(20,60),i&&(i=!1,p(u.CesiumWidgetLoaded,n))}return x(()=>{e()?n():(i=!0,d(u.CesiumWidgetLoaded,n))}),S(()=>{m()}),{}}});function W(r,i,e,t,a,s){return h(),w("span")}const B=g(y,[["render",W]]);export{B as default};
