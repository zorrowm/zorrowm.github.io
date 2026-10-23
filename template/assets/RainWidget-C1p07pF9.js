import{B as e,L as t,R as n,w as r,y as i}from"./litewindow-exp-CuLSh8Nm.js";import"./vendor-DKvr6yBw.js";import{it as a}from"./xframe-exp-D4DAeJPg.js";import{a as o,i as s}from"./events-Cf1xm7ve.js";import{t as c}from"./_plugin-vue_export-helper-BDNMzG2s.js";import{t as l}from"./SystemsEvent-Dkd_M66m.js";import{pt as u}from"./Cesium-cFXkltsB-C0QAqGQs.js";var d=r({name:`rainWidget`,components:{},setup(){let e,r=!1;function i(){return a.CesiumViewer&&(e||=a.CesiumViewer),e}let c=null,d=(e,t)=>{f();let n=new u.PostProcessStage({name:`hi_rain`,fragmentShader:`uniform sampler2D colorTexture;
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
 `,uniforms:{tiltAngle:.5,rainSize:.6,rainWidth:e,rainSpeed:t}}),r=i();r.scene.postProcessStages.add(n),r.scene.requestRender(),c=n},f=()=>{let e=i();c&&e.scene.postProcessStages.remove(c),c=null};function p(){i()&&d(20,60),r&&(r=!1,s(l.CesiumWidgetLoaded,p))}return t(()=>{i()?p():(r=!0,o(l.CesiumWidgetLoaded,p))}),n(()=>{f(),console.warn(`rainWidget组件卸载了`)}),{}}});function f(t,n,r,a,o,s){return e(),i(`span`)}var p=c(d,[[`render`,f]]);export{p as default};