!function(){function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(){"use strict";/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */e=function(){return n};var n={},r=Object.prototype,o=r.hasOwnProperty,i="function"==typeof Symbol?Symbol:{},a=i.iterator||"@@iterator",c=i.asyncIterator||"@@asyncIterator",l=i.toStringTag||"@@toStringTag";function u(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{u({},"")}catch(T){u=function(t,e,n){return t[e]=n}}function s(t,e,n,r){var o=e&&e.prototype instanceof p?e:p,i=Object.create(o.prototype),a=new E(r||[]);return i._invoke=function(t,e,n){var r="suspendedStart";return function(o,i){if("executing"===r)throw new Error("Generator is already running");if("completed"===r){if("throw"===o)throw i;return j()}for(n.method=o,n.arg=i;;){var a=n.delegate;if(a){var c=L(a,n);if(c){if(c===h)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if("suspendedStart"===r)throw r="completed",n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r="executing";var l=f(t,e,n);if("normal"===l.type){if(r=n.done?"completed":"suspendedYield",l.arg===h)continue;return{value:l.arg,done:n.done}}"throw"===l.type&&(r="completed",n.method="throw",n.arg=l.arg)}}}(t,n,a),i}function f(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(T){return{type:"throw",arg:T}}}n.wrap=s;var h={};function p(){}function d(){}function v(){}var g={};u(g,a,(function(){return this}));var y=Object.getPrototypeOf,m=y&&y(y(_([])));m&&m!==r&&o.call(m,a)&&(g=m);var w=v.prototype=p.prototype=Object.create(g);function b(t){["next","throw","return"].forEach((function(e){u(t,e,(function(t){return this._invoke(e,t)}))}))}function x(e,n){function r(i,a,c,l){var u=f(e[i],e,a);if("throw"!==u.type){var s=u.arg,h=s.value;return h&&"object"==t(h)&&o.call(h,"__await")?n.resolve(h.__await).then((function(t){r("next",t,c,l)}),(function(t){r("throw",t,c,l)})):n.resolve(h).then((function(t){s.value=t,c(s)}),(function(t){return r("throw",t,c,l)}))}l(u.arg)}var i;this._invoke=function(t,e){function o(){return new n((function(n,o){r(t,e,n,o)}))}return i=i?i.then(o,o):o()}}function L(t,e){var n=t.iterator[e.method];if(void 0===n){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=void 0,L(t,e),"throw"===e.method))return h;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return h}var r=f(n,t.iterator,e.arg);if("throw"===r.type)return e.method="throw",e.arg=r.arg,e.delegate=null,h;var o=r.arg;return o?o.done?(e[t.resultName]=o.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,h):o:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,h)}function S(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function k(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function E(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(S,this),this.reset(!0)}function _(t){if(t){var e=t[a];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var n=-1,r=function e(){for(;++n<t.length;)if(o.call(t,n))return e.value=t[n],e.done=!1,e;return e.value=void 0,e.done=!0,e};return r.next=r}}return{next:j}}function j(){return{value:void 0,done:!0}}return d.prototype=v,u(w,"constructor",v),u(v,"constructor",d),d.displayName=u(v,l,"GeneratorFunction"),n.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===d||"GeneratorFunction"===(e.displayName||e.name))},n.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,v):(t.__proto__=v,u(t,l,"GeneratorFunction")),t.prototype=Object.create(w),t},n.awrap=function(t){return{__await:t}},b(x.prototype),u(x.prototype,c,(function(){return this})),n.AsyncIterator=x,n.async=function(t,e,r,o,i){void 0===i&&(i=Promise);var a=new x(s(t,e,r,o),i);return n.isGeneratorFunction(e)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},b(w),u(w,l,"Generator"),u(w,a,(function(){return this})),u(w,"toString",(function(){return"[object Generator]"})),n.keys=function(t){var e=[];for(var n in t)e.push(n);return e.reverse(),function n(){for(;e.length;){var r=e.pop();if(r in t)return n.value=r,n.done=!1,n}return n.done=!0,n}},n.values=_,E.prototype={constructor:E,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(k),!t)for(var e in this)"t"===e.charAt(0)&&o.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(n,r){return a.type="throw",a.arg=t,e.next=n,r&&(e.method="next",e.arg=void 0),!!r}for(var r=this.tryEntries.length-1;r>=0;--r){var i=this.tryEntries[r],a=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var c=o.call(i,"catchLoc"),l=o.call(i,"finallyLoc");if(c&&l){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var r=this.tryEntries[n];if(r.tryLoc<=this.prev&&o.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var i=r;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,h):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),h},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),k(n),h}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;k(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:_(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=void 0),h}},n}function n(t,e,n,r,o,i,a){try{var c=t[i](a),l=c.value}catch(u){return void n(u)}c.done?e(l):Promise.resolve(l).then(r,o)}function r(t){return function(){var e=this,r=arguments;return new Promise((function(o,i){var a=t.apply(e,r);function c(t){n(a,o,i,c,l,"next",t)}function l(t){n(a,o,i,c,l,"throw",t)}c(void 0)}))}}System.register(["./vendor-legacy.67310d82.js","./logo-legacy.a90bbcca.js","./index-legacy.1eae71e3.js","./expansion-moment-legacy.9abe8b33.js","./expansion-axios-legacy.08657a3d.js"],(function(t){"use strict";var n,o,i,a,c,l,u,s,f,h,p,d,v,g,y,m,w,b,x,L,S,k;return{setters:[function(t){n=t.d,o=t.I,i=t.r,a=t.B,c=t.J,l=t.L,u=t.u,s=t.V,f=t.f,h=t.Y,p=t.q,d=t.n,v=t.b,g=t.M,y=t.N,m=t.t,w=t.P,b=t.Q,x=t.R,L=t.X},function(t){S=t._},function(t){k=t._},function(){},function(){}],execute:function(){var E=n({setup:function(){var t,n,v,g=a.t,y=o({username:"",password:""}),m=i(),w=i(),b=i(null===(t=a.Config.UI)||void 0===t?void 0:t.SiteTitle),S=c(),k=l(),E=decodeURIComponent((null===(n=k.query)||void 0===n?void 0:n.redirect)||"/"),_=u();if(_)return s(_),void(S&&S.replace(E).then((function(t){"login"==k.name&&S.replace("/")})));var j=function(){var t=r(e().mark((function t(){var n,r,o,i,c,l,s,f,h;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(""!==y.username.trim()&&""!=y.password.trim()){t.next=2;break}return t.abrupt("return",null===(n=a.Message)||void 0===n?void 0:n.warn(g("sys.login.loginEmtyWarnInfo")));case 2:return r={username:y.username.trim(),pwd:x.MD5(y.password)},t.next=5,L(r);case 5:if(o=t.sent){t.next=9;break}return null===(i=a.Message)||void 0===i||i.warn(g("sys.login.loginFailTitle")),t.abrupt("return");case 9:o.isSuccess?(s=decodeURIComponent((null===(c=k.query)||void 0===c?void 0:c.redirect)||"/"),S&&(s.startsWith("http://")||s.startsWith("https://")?(f=u(),window.open(s+"#/?tk="+f.token,"_self")):S.replace(s).then((function(t){"login"==k.name&&S.replace("/")}))),null===(l=a.Message)||void 0===l||l.msg(g("sys.login.loginSuccessTitle"))):null===(h=a.Message)||void 0===h||h.warn(o.ResultDescription||g("sys.login.loginFailTitle"));case 10:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return f(r(e().mark((function t(){var n,r,o,i,c,l,s,f;return e().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(E&&(v=null===(n=k.query)||void 0===n||null===(r=n.tk)||void 0===r?void 0:r.toString()),!v){t.next=8;break}return t.next=4,h(v);case 4:o=t.sent,(i=null==o?void 0:o.data)&&(i.isSuccess?(p(i.resultValue),d(i.resultValue.doubleToken),null===(c=a.Message)||void 0===c||c.msg(g("sys.login.loginSuccessTitle")),(l=u())&&((null===(s=E)||void 0===s?void 0:s.indexOf("?"))>0?E+="&tk="+l.token:E+="?tk="+l.token,S.replace(E).then((function(t){"login"==k.name&&S.replace("/")})))):null===(f=a.Message)||void 0===f||f.warn(g("sys.login.loginTokenFailInfo")));case 8:case"end":return t.stop()}}),t)})))),{formState:y,systemTitle:b,handleSubmit:j,t:g,onblur:function(){m.value&&(m.value.placeholder=g("sys.login.accountPlaceholder")),w.value&&(w.value.placeholder=g("sys.login.passwordPlaceholder"))},nameInput:m,pwdInput:w}}}),_={class:"container"},j={class:"login-logo"},T=y("img",{src:S,alt:""},null,-1),I={class:"login-title"},O={class:"login"},P={class:"login-top"},N={class:"login-center clearfix"},F=y("div",{class:"login-center-img"},[y("img",{src:"./img/login/name.png"})],-1),G={class:"login-center-input"},M=["placeholder"],U={class:"login-center-input-text"},V={class:"login-center clearfix"},q=y("div",{class:"login-center-img"},[y("img",{src:"./img/login/password.png"})],-1),B={class:"login-center-input"},C=["placeholder"],R={class:"login-center-input-text"};t("default",k(E,[["render",function(t,e,n,r,o,i){return v(),g("div",_,[y("div",j,[T,y("span",I,m(t.systemTitle),1)]),y("div",O,[y("div",P,m(t.t("sys.login.signInFormTitle")),1),y("div",N,[F,y("div",G,[w(y("input",{ref:"nameInput",type:"text",placeholder:t.t("sys.login.accountPlaceholder"),onfocus:"this.placeholder=''",onBlur:e[0]||(e[0]=function(e){return t.onblur()}),"onUpdate:modelValue":e[1]||(e[1]=function(e){return t.formState.username=e})},null,40,M),[[b,t.formState.username]]),y("div",U,m(t.t("sys.login.userName")),1)])]),y("div",V,[q,y("div",B,[w(y("input",{ref:"pwdInput",type:"password",placeholder:t.t("sys.login.passwordPlaceholder"),onfocus:"this.placeholder=''",onBlur:e[2]||(e[2]=function(e){return t.onblur()}),"onUpdate:modelValue":e[3]||(e[3]=function(e){return t.formState.password=e})},null,40,C),[[b,t.formState.password]]),y("div",R,m(t.t("sys.login.password")),1)])]),y("div",{class:"login-button",onClick:e[4]||(e[4]=function(){return t.handleSubmit&&t.handleSubmit.apply(t,arguments)})},m(t.t("sys.login.loginButton")),1)])])}]]))}}}))}();