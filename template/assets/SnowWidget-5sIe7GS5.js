import{i as d,j as p,_ as w}from"./index-CvUQtR9N.js";import{S as l}from"./SystemsEvent-DUQCZw_Q.js";import{B as v}from"./xframelib-exp-B9KgMBHw.js";import{d as _,o as g,a as y,e as S,b as x}from"./@vue-exp-DMKPrOh0.js";import"./pdfjs-dist-exp-C7mOU4gj.js";import"./vendor-B1f7FUIB.js";import"./@hprose-exp-BEudjurc.js";import"./vue-router-exp-DWvvxSx9.js";import"./axios-exp-B_zfNCMU.js";import"./@iconify/vue-exp-5llPk3YT.js";const C="snowWidget",k=_({name:C,components:{},setup(){let n,r=!1;function e(){return v.CesiumViewer&&(n||(n=v.CesiumViewer)),n}let t=null;const i=`uniform sampler2D colorTexture;
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
 `,a=o=>{c();var m=new Cesium.PostProcessStage({name:"hi_snow",fragmentShader:i,uniforms:{rainSpeed:o}});const u=e();u.scene.postProcessStages.add(m),u.scene.requestRender(),t=m},c=()=>{const o=e();t&&o.scene.postProcessStages.remove(t),t=null};function s(){e()&&a(90),r&&(r=!1,p(l.CesiumWidgetLoaded,s))}g(()=>{e()?s():(r=!0,d(l.CesiumWidgetLoaded,s))});function f(){e()&&c()}return y(()=>{f()}),{}}});function h(n,r,e,t,i,a){return x(),S("span")}const b=w(k,[["render",h],["__file","SnowWidget.vue"]]);export{b as default};
