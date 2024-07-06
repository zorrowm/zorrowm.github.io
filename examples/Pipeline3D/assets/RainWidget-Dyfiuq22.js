import{k as d,l as p,d as g}from"./index-Bvhcfk1J.js";import{S as u}from"./SystemsEvent-CcMw5DLH.js";import{N as f}from"./xframelib-exp-BHnis-8Y.js";import{d as _,u as x,v as S,M as w,H as h}from"./@vue-exp-BMz8X7Pi.js";import"./vendor-09XKH5X6.js";import"./@hprose-exp-zVZHOVCF.js";import"./vue-router-exp-COsaUipG.js";import"./axios-exp-DvxIUWKU.js";const C="rainWidget",y=_({name:C,components:{},setup(){let n,i=!1;function e(){return f.CesiumViewer&&(n||(n=f.CesiumViewer)),n}let t=null;const a=`uniform sampler2D colorTexture;
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
 `,s=(o,v)=>{l();var c=new Cesium.PostProcessStage({name:"hi_rain",fragmentShader:a,uniforms:{tiltAngle:.5,rainSize:.6,rainWidth:o,rainSpeed:v}});const m=e();m.scene.postProcessStages.add(c),m.scene.requestRender(),t=c},l=()=>{const o=e();t&&o.scene.postProcessStages.remove(t),t=null};function r(){e()&&s(20,60),i&&(i=!1,p(u.CesiumWidgetLoaded,r))}return x(()=>{e()?r():(i=!0,d(u.CesiumWidgetLoaded,r))}),S(()=>{l()}),{}}});function W(n,i,e,t,a,s){return h(),w("span")}const k=g(y,[["render",W],["__file","RainWidget.vue"]]);export{k as default};
