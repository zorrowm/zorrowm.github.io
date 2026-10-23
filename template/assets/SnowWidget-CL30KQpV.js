import{B as e,L as t,R as n,w as r,y as i}from"./litewindow-exp-CuLSh8Nm.js";import"./vendor-DKvr6yBw.js";import{it as a}from"./xframe-exp-D4DAeJPg.js";import{a as o,i as s}from"./events-Cf1xm7ve.js";import{t as c}from"./_plugin-vue_export-helper-BDNMzG2s.js";import{t as l}from"./SystemsEvent-Dkd_M66m.js";import{pt as u}from"./Cesium-cFXkltsB-C0QAqGQs.js";var d=r({name:`snowWidget`,components:{},setup(){let e,r=!1;function i(){return a.CesiumViewer&&(e||=a.CesiumViewer),e}let c=null,d=e=>{f();let t=new u.PostProcessStage({name:`hi_snow`,fragmentShader:`uniform sampler2D colorTexture;
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
 `,uniforms:{rainSpeed:e}}),n=i();n.scene.postProcessStages.add(t),n.scene.requestRender(),c=t},f=()=>{let e=i();c&&e.scene.postProcessStages.remove(c),c=null};function p(){i()&&d(90),r&&(r=!1,s(l.CesiumWidgetLoaded,p))}t(()=>{i()?p():(r=!0,o(l.CesiumWidgetLoaded,p))});function m(){i()&&f()}return n(()=>{m(),console.warn(`snowWidget组件卸载了`)}),{}}});function f(t,n,r,a,o,s){return e(),i(`span`)}var p=c(d,[[`render`,f]]);export{p as default};