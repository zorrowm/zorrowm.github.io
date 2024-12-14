import{i as d,j as p,_ as w}from"./index-BQ7ovaqR.js";import{S as l}from"./SystemsEvent-DUQCZw_Q.js";import{B as v}from"./xframelib-exp-CMLeiWD4.js";import{d as _,o as g,a as y,e as S,b as x}from"./@vue-exp-Bws36Ke9.js";import"./monaco-editor-exp-BNK_u0iZ.js";import"./vendor-DJm_4oaR.js";import"./lottie-web-exp-CIY4INm7.js";import"./quasar-exp-BsaNoQ7w.js";import"./xgis-cesium-exp-Hv7oMXHX.js";import"./vue-router-exp-CO9L2VdX.js";import"./axios-exp-C7rfqWEd.js";import"./@iconify/vue-exp-Q9Q0SWJB.js";const C="snowWidget",k=_({name:C,components:{},setup(){let n,r=!1;function e(){return v.CesiumViewer&&(n||(n=v.CesiumViewer)),n}let t=null;const i=`uniform sampler2D colorTexture;
     in vec2 v_textureCoordinates;
     uniform float rainSpeed;
     float snow(vec2 uv,float scale){
         float time = czm_frameNumber / rainSpeed;
         float w=smoothstep(1.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;
         uv+=time/scale;uv.y+=time*2./scale;uv.x+=sin(uv.y+time*.5)/scale;
         uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;
         p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);
         k=smoothstep(0.,k,sin(f.x+f.y)*0.01);
         return k*w;
     }
     out vec4 vFragColor;
     void main(void){
         vec2 resolution = czm_viewport.zw;
         vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);
         vec3 finalColor=vec3(0);
         float c = 0.0;
         c+=snow(uv,50.)*.0;
         c+=snow(uv,30.)*.0;
         c+=snow(uv,10.)*.0;
         c+=snow(uv,5.);
         c+=snow(uv,4.);
         c+=snow(uv,3.);
         c+=snow(uv,2.);
         finalColor=(vec3(c));
         vFragColor = mix(texture(colorTexture, v_textureCoordinates), vec4(finalColor,1), 0.3);
     }
 `,a=o=>{c();var m=new Cesium.PostProcessStage({name:"hi_snow",fragmentShader:i,uniforms:{rainSpeed:o}});const u=e();u.scene.postProcessStages.add(m),u.scene.requestRender(),t=m},c=()=>{const o=e();t&&o.scene.postProcessStages.remove(t),t=null};function s(){e()&&a(90),r&&(r=!1,p(l.CesiumWidgetLoaded,s))}g(()=>{e()?s():(r=!0,d(l.CesiumWidgetLoaded,s))});function f(){e()&&c()}return y(()=>{f()}),{}}});function h(n,r,e,t,i,a){return x(),S("span")}const T=w(k,[["render",h],["__file","SnowWidget.vue"]]);export{T as default};
