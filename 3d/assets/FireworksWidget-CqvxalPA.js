import{c3 as x,c4 as I,c5 as R,c6 as T,c7 as w,c8 as p,c9 as y}from"./vendor-CDV5M84i.js";import{d as P,v as W,M as E,L as F,R as A}from"./@vue-exp-YaP0LnBg.js";import{_ as C}from"./index-BTOrG-4i.js";import"./@hprose-exp-DifMA6AO.js";import"./xframelib-exp-CvTEfE5n.js";import"./axios-exp-BH40TtQM.js";import"./vue-router-exp-BeFgxScw.js";const b=P({__name:"FireworksWidget",setup(u,{expose:o}){o();function r(){const l=new x,e=document.querySelector("#c"),i=new I({canvas:e});i.setSize(e.innerWidth,e.innerHeight),i.setPixelRatio(window.devicePixelRatio);const a=new R(60,e.clientWidth/e.clientHeight,1,1e3);a.position.z=4;const S=`
          out vec2 st;
          void main() {
            st =uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          }
          `,k=`
          #define SPARKS 30
          #define FIREWORKS 8.
          #define BASE_PAUSE FIREWORKS / 30.
          #define PI 3.14
          #define PI2 6.28
          uniform vec2 iResolution;
          uniform float iTime;
  
          float n21(vec2 n) {
              return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
          }
  
          vec2 randomSpark(float noise) {
              vec2 v0 = vec2((noise - .5) * 13., (fract(noise * 123.) - .5) * 15.);
              return v0;
          }
  
          vec2 circularSpark(float i, float noiseId, float noiseSpark) {
              noiseId = fract(noiseId * 7897654.45);
              float a = (PI2 / float(SPARKS)) * i;
              float speed = 10.*clamp(noiseId, .7, 1.);
              float x = sin(a + iTime*((noiseId-.5)*3.));
              float y = cos(a + iTime*(fract(noiseId*4567.332) - .5)*2.);
              vec2 v0 = vec2(x, y) * speed;
              return v0;
          }
  
  
          vec2 rocket(vec2 start, float t) {
              float y = t;
              float x = sin(y*10.+cos(t*3.))*.1;
              vec2 p = start + vec2(x, y * 8.);
              return p;
          }
  
          vec3 firework(vec2 uv, float index, float pauseTime) {
              vec3 col = vec3(0.);
  
  
              float timeScale = 1.;
              vec2 gravity = vec2(0., -9.8);
  
              float explodeTime = .9;
              float rocketTime = 1.1;
              float episodeTime = rocketTime + explodeTime + pauseTime;
  
              float ratio = iResolution.x / iResolution.y;
  
              float timeScaled = (iTime - pauseTime) / timeScale;
  
              float id = floor(timeScaled / episodeTime);
              float et = mod(timeScaled, episodeTime);
  
              float noiseId = n21(vec2(id+1., index+1.));
  
              float scale = clamp(fract(noiseId*567.53)*30., 10., 30.);
              uv *= scale;
  
              rocketTime -= (fract(noiseId*1234.543) * .5);
  
              vec2 pRocket = rocket(vec2(0. + ((noiseId - .5)*scale*ratio), 0. - scale/2.), clamp(et, 0., rocketTime));
  
              if (et < rocketTime) {
                  float rd = length(uv - pRocket);
                  col += pow(.05/rd , 1.9) * vec3(0.9, .3, .0);
              }
  
  
              if (et > rocketTime && et < (rocketTime + explodeTime)) {
                  float burst = sign(fract(noiseId*44432.22) - .6);
                  for(int i = 0 ; i < SPARKS ; i++) {
                          vec2 center = pRocket;
                          float fi = float(i);
                          float noiseSpark = fract(n21(vec2(id*10.+index*20., float(i+1))) * 332.44);
                          float t = et - rocketTime;
                          vec2 v0;
  
                          if (fract(noiseId*3532.33) > .5) {
                              v0 = randomSpark(noiseSpark);
                              t -= noiseSpark * (fract(noiseId*543.) * .2);
                          } else {
                              v0 = circularSpark(fi, noiseId, noiseSpark);
  
                              if ( (fract(noiseId*973.22) - .5) > 0.) {
                                  float re = mod(fi, 4. + 10. * noiseId);
                                  t -= floor(re/2.) * burst * .1;
                              } else {
                                  t -= mod(fi, 2.) == 0. ? 0. : burst * .5*clamp(noiseId, .3, 1.);
                              }
                          }
  
                          vec2 s = v0*t + (gravity * t * t) / 2.;
  
                          vec2 p = center + s;
  
                          float d = length(uv - p);
  
                          if (t > 0.) {
                              float fade = clamp((1. - t/explodeTime), 0., 1.);
                              vec3 sparkColor = vec3(noiseId*.9, .5*fract(noiseId *456.33), .5*fract(noiseId *1456.33));
                              vec3 c = (.05 / d) * sparkColor;
                              col += c * fade;
                          }
                      }
              }
  
              return col;
          }
  
          void main() {
            vec4 fragCoords = gl_FragCoord;
  
            vec2 uv = fragCoords.xy / iResolution.xy;
            uv -= .5;
            uv.x *= iResolution.x / iResolution.y;
  
            vec3 col = vec3(0.);
  
            for (float i = 0. ; i < FIREWORKS ; i += 1.) {
                col += firework(uv, i + 1., (i * BASE_PAUSE));
            }
  
            gl_FragColor = vec4(col, 1.);
          }
          `,h=new T(1,1),_=new w({uniforms:{iResolution:{value:new p(e.clientWidth,e.clientHeight)},iTime:{value:0}},vertexShader:S,fragmentShader:k});let n=new y(h,_);l.add(n),d();function d(){if(g(i)){const t=i.domElement;a.aspect=t.clientWidth/t.clientHeight,a.updateProjectionMatrix()}let c=requestAnimationFrame(d);n.scale.set(4.61*e.clientWidth/e.clientHeight,4.61,1),n.material.uniforms.iTime={value:c/100},n.material.uniforms.iResolution={value:new p(e.clientWidth,e.clientHeight)},i.render(l,a)}function g(c){const t=c.domElement,f=t.clientWidth,m=t.clientHeight,v=t.width!==f||t.height!==m;return v&&c.setSize(f,m,!1),v}}W(()=>{r()});const s={init:r};return Object.defineProperty(s,"__isScriptSetup",{enumerable:!1,value:!0}),s}}),H={class:"container"};function M(u,o,r,s,l,e){return A(),E("div",H,o[0]||(o[0]=[F("canvas",{id:"c"},null,-1)]))}const q=C(b,[["render",M],["__scopeId","data-v-64b75c37"],["__file","FireworksWidget.vue"]]);export{q as default};
