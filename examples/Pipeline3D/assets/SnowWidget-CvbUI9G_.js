import{k as d,l as w,d as p}from"./index-qJxAkqGK.js";import{S as l}from"./SystemsEvent-CcMw5DLH.js";import{N as v}from"./xframelib-exp-BgfRSxAM.js";import{d as g,u as y,v as _,M as S,H as x}from"./@vue-exp-CDtNmxB2.js";import"./vendor-1Ijim4br.js";import"./@hprose-exp-CbqXUr-3.js";import"./vue-router-exp-Btxc1z5e.js";import"./axios-exp-DvxIUWKU.js";const C="snowWidget",k=g({name:C,components:{},setup(){let n,r=!1;function e(){return v.CesiumViewer&&(n||(n=v.CesiumViewer)),n}let t=null;const i=`uniform sampler2D colorTexture;
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
 `,a=o=>{c();var u=new Cesium.PostProcessStage({name:"hi_snow",fragmentShader:i,uniforms:{rainSpeed:o}});const m=e();m.scene.postProcessStages.add(u),m.scene.requestRender(),t=u},c=()=>{const o=e();t&&o.scene.postProcessStages.remove(t),t=null};function s(){e()&&a(90),r&&(r=!1,w(l.CesiumWidgetLoaded,s))}y(()=>{e()?s():(r=!0,d(l.CesiumWidgetLoaded,s))});function f(){e()&&c()}return _(()=>{f()}),{}}});function h(n,r,e,t,i,a){return x(),S("span")}const V=p(k,[["render",h],["__file","SnowWidget.vue"]]);export{V as default};
