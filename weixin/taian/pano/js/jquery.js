(function anonymous(
) {
	/*! jQuery v3.3.1 | (c) JS Foundation and other contributors | jquery.org/license */
    var local = this;   

    var krpano = null;  
    var plugin = null;
	var krpano_parent;
	var file_path;
    var plugincanvas = null;        // optionally - a canvas object for graphic content
    var plugincanvascontext = null;
	var plugin_version = "VR全景软件 相册插件v2.0";
	var min = 786;
	var max = 9999999999;
	var random = "htmllightbox_" + Math.floor(Math.random() * (max - min + 1)) + min;
	var vr_support = false;
	var is_it_vr = false;
	var stop_autorotate = false;
	var stop_autorotate_timeout;
	var start_autorotate_timeout;
	var apply_blur = false;
	var blur_support = false;
	var tour_soundson = false;
	var info_box_style = "style_1";
	var info_box_style_float = false;
	var info_box_timeout;
	window.info_box_update_position;
	window.show_info_box_now;
	window.sleep_now = true;
	
	var plugin_font_name = false;
	var info_box_style_image_width = "";
	var info_box_style_font_name = "";
	var info_box_style_font_size = "";
	
	var info_box_style_title_color = "";
	var info_box_style_title_border_color = "";
	
	var info_box_style_bg_color = "";
	var info_box_style_bg_alpha = "";
	var info_box_style_text_color = "";
	
	var info_box_style_btn_bg_color = "";
	var info_box_style_btn_bg_alpha = "";
	var info_box_style_btn_text_color = "";
	var info_box_style_btn_text = false;

	function hexToRgb(hex) {
		// alert(hexToRgb("#0033ff").g);
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	}
	
	window.krpano_call = function(command_string){
		return krpano.call(command_string);
	}
	window.krpano_set = function(command_string,new_value){
		return krpano.set(command_string,new_value);
	}
	window.krpano_get = function(command_string){
		return krpano.get(command_string);
	}

    // registerplugin - startup point for the plugin (required)
    // - krpanointerface = krpano interface object
    // - pluginpath = string with the krpano path of the plugin (e.g. "plugin[pluginname]")
    // - pluginobject = the plugin object itself (the same as: pluginobject = krpano.get(pluginpath) )
    local.registerplugin = function(krpanointerface, pluginpath, pluginobject){
        krpano = krpanointerface;
        plugin = pluginobject;
		is_it_infobox = false;
		
		function set_enter_vr_status(){is_it_vr = true;}
		function set_exit_vr_status(){is_it_vr = false;}
		function onmousedown_call(){if(is_it_infobox == true){close_popup();}}
		// use the krpano onviewchanged event as render-frame callback (this event will be directly called after the krpano pano rendering)
		krpano.set("events[__easyhtmllightbox__].keep", true);
		krpano.set("events[__easyhtmllightbox__].webvr_onentervr", set_enter_vr_status);	// correct krpano view settings before the rendering
		krpano.set("events[__easyhtmllightbox__].webvr_onexitvr", set_exit_vr_status);
		krpano.set("events[__easyhtmllightbox__].webvr_onexitvr", set_exit_vr_status);
		krpano.set("events[__easyhtmllightbox__].onmousedown", onmousedown_call);
		krpano.set("events[__easyhtmllightbox__].onmousewheel", onmousedown_call);
		// krpano.set("events[__easyhtmllightbox__].onclick", onmousedown_call);

		
		if(parseInt(krpano.version.split(".")[1])>19)
			vr_support = true;
		if(krpano.get("plugin[EASY_HTML_LIGHTBOX___pp_blur]")==null)
			vr_support = false;
		
		if(plugin.include_jquery==null || plugin.include_jquery.toLowerCase()!="false" && !window.jQuery)
		{
			/*! jQuery v3.3.1 | (c) JS Foundation and other contributors | jquery.org/license */
			!function(e,t){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=e.document?t(e,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document");return t(e)}:t(e)}("undefined"!=typeof window?window:this,function(e,t){"use strict";var n=[],r=e.document,i=Object.getPrototypeOf,o=n.slice,a=n.concat,s=n.push,u=n.indexOf,l={},c=l.toString,f=l.hasOwnProperty,p=f.toString,d=p.call(Object),h={},g=function e(t){return"function"==typeof t&&"number"!=typeof t.nodeType},y=function e(t){return null!=t&&t===t.window},v={type:!0,src:!0,noModule:!0};function m(e,t,n){var i,o=(t=t||r).createElement("script");if(o.text=e,n)for(i in v)n[i]&&(o[i]=n[i]);t.head.appendChild(o).parentNode.removeChild(o)}function x(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?l[c.call(e)]||"object":typeof e}var b="3.3.1",w=function(e,t){return new w.fn.init(e,t)},T=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;w.fn=w.prototype={jquery:"3.3.1",constructor:w,length:0,toArray:function(){return o.call(this)},get:function(e){return null==e?o.call(this):e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=w.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return w.each(this,e)},map:function(e){return this.pushStack(w.map(this,function(t,n){return e.call(t,n,t)}))},slice:function(){return this.pushStack(o.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(e<0?t:0);return this.pushStack(n>=0&&n<t?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:s,sort:n.sort,splice:n.splice},w.extend=w.fn.extend=function(){var e,t,n,r,i,o,a=arguments[0]||{},s=1,u=arguments.length,l=!1;for("boolean"==typeof a&&(l=a,a=arguments[s]||{},s++),"object"==typeof a||g(a)||(a={}),s===u&&(a=this,s--);s<u;s++)if(null!=(e=arguments[s]))for(t in e)n=a[t],a!==(r=e[t])&&(l&&r&&(w.isPlainObject(r)||(i=Array.isArray(r)))?(i?(i=!1,o=n&&Array.isArray(n)?n:[]):o=n&&w.isPlainObject(n)?n:{},a[t]=w.extend(l,o,r)):void 0!==r&&(a[t]=r));return a},w.extend({expando:"jQuery"+("3.3.1"+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isPlainObject:function(e){var t,n;return!(!e||"[object Object]"!==c.call(e))&&(!(t=i(e))||"function"==typeof(n=f.call(t,"constructor")&&t.constructor)&&p.call(n)===d)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},globalEval:function(e){m(e)},each:function(e,t){var n,r=0;if(C(e)){for(n=e.length;r<n;r++)if(!1===t.call(e[r],r,e[r]))break}else for(r in e)if(!1===t.call(e[r],r,e[r]))break;return e},trim:function(e){return null==e?"":(e+"").replace(T,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(C(Object(e))?w.merge(n,"string"==typeof e?[e]:e):s.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:u.call(t,e,n)},merge:function(e,t){for(var n=+t.length,r=0,i=e.length;r<n;r++)e[i++]=t[r];return e.length=i,e},grep:function(e,t,n){for(var r,i=[],o=0,a=e.length,s=!n;o<a;o++)(r=!t(e[o],o))!==s&&i.push(e[o]);return i},map:function(e,t,n){var r,i,o=0,s=[];if(C(e))for(r=e.length;o<r;o++)null!=(i=t(e[o],o,n))&&s.push(i);else for(o in e)null!=(i=t(e[o],o,n))&&s.push(i);return a.apply([],s)},guid:1,support:h}),"function"==typeof Symbol&&(w.fn[Symbol.iterator]=n[Symbol.iterator]),w.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(e,t){l["[object "+t+"]"]=t.toLowerCase()});function C(e){var t=!!e&&"length"in e&&e.length,n=x(e);return!g(e)&&!y(e)&&("array"===n||0===t||"number"==typeof t&&t>0&&t-1 in e)}var E=function(e){var t,n,r,i,o,a,s,u,l,c,f,p,d,h,g,y,v,m,x,b="sizzle"+1*new Date,w=e.document,T=0,C=0,E=ae(),k=ae(),S=ae(),D=function(e,t){return e===t&&(f=!0),0},N={}.hasOwnProperty,A=[],j=A.pop,q=A.push,L=A.push,H=A.slice,O=function(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1},P="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",R="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",I="\\["+M+"*("+R+")(?:"+M+"*([*^$|!~]?=)"+M+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+R+"))|)"+M+"*\\]",W=":("+R+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+I+")*)|.*)\\)|)",$=new RegExp(M+"+","g"),B=new RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),F=new RegExp("^"+M+"*,"+M+"*"),_=new RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),z=new RegExp("="+M+"*([^\\]'\"]*?)"+M+"*\\]","g"),X=new RegExp(W),U=new RegExp("^"+R+"$"),V={ID:new RegExp("^#("+R+")"),CLASS:new RegExp("^\\.("+R+")"),TAG:new RegExp("^("+R+"|[*])"),ATTR:new RegExp("^"+I),PSEUDO:new RegExp("^"+W),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:new RegExp("^(?:"+P+")$","i"),needsContext:new RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},G=/^(?:input|select|textarea|button)$/i,Y=/^h\d$/i,Q=/^[^{]+\{\s*\[native \w/,J=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,K=/[+~]/,Z=new RegExp("\\\\([\\da-f]{1,6}"+M+"?|("+M+")|.)","ig"),ee=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:r<0?String.fromCharCode(r+65536):String.fromCharCode(r>>10|55296,1023&r|56320)},te=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ne=function(e,t){return t?"\0"===e?"\ufffd":e.slice(0,-1)+"\\"+e.charCodeAt(e.length-1).toString(16)+" ":"\\"+e},re=function(){p()},ie=me(function(e){return!0===e.disabled&&("form"in e||"label"in e)},{dir:"parentNode",next:"legend"});try{L.apply(A=H.call(w.childNodes),w.childNodes),A[w.childNodes.length].nodeType}catch(e){L={apply:A.length?function(e,t){q.apply(e,H.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function oe(e,t,r,i){var o,s,l,c,f,h,v,m=t&&t.ownerDocument,T=t?t.nodeType:9;if(r=r||[],"string"!=typeof e||!e||1!==T&&9!==T&&11!==T)return r;if(!i&&((t?t.ownerDocument||t:w)!==d&&p(t),t=t||d,g)){if(11!==T&&(f=J.exec(e)))if(o=f[1]){if(9===T){if(!(l=t.getElementById(o)))return r;if(l.id===o)return r.push(l),r}else if(m&&(l=m.getElementById(o))&&x(t,l)&&l.id===o)return r.push(l),r}else{if(f[2])return L.apply(r,t.getElementsByTagName(e)),r;if((o=f[3])&&n.getElementsByClassName&&t.getElementsByClassName)return L.apply(r,t.getElementsByClassName(o)),r}if(n.qsa&&!S[e+" "]&&(!y||!y.test(e))){if(1!==T)m=t,v=e;else if("object"!==t.nodeName.toLowerCase()){(c=t.getAttribute("id"))?c=c.replace(te,ne):t.setAttribute("id",c=b),s=(h=a(e)).length;while(s--)h[s]="#"+c+" "+ve(h[s]);v=h.join(","),m=K.test(e)&&ge(t.parentNode)||t}if(v)try{return L.apply(r,m.querySelectorAll(v)),r}catch(e){}finally{c===b&&t.removeAttribute("id")}}}return u(e.replace(B,"$1"),t,r,i)}function ae(){var e=[];function t(n,i){return e.push(n+" ")>r.cacheLength&&delete t[e.shift()],t[n+" "]=i}return t}function se(e){return e[b]=!0,e}function ue(e){var t=d.createElement("fieldset");try{return!!e(t)}catch(e){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function le(e,t){var n=e.split("|"),i=n.length;while(i--)r.attrHandle[n[i]]=t}function ce(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&e.sourceIndex-t.sourceIndex;if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function fe(e){return function(t){return"input"===t.nodeName.toLowerCase()&&t.type===e}}function pe(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function de(e){return function(t){return"form"in t?t.parentNode&&!1===t.disabled?"label"in t?"label"in t.parentNode?t.parentNode.disabled===e:t.disabled===e:t.isDisabled===e||t.isDisabled!==!e&&ie(t)===e:t.disabled===e:"label"in t&&t.disabled===e}}function he(e){return se(function(t){return t=+t,se(function(n,r){var i,o=e([],n.length,t),a=o.length;while(a--)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}function ge(e){return e&&"undefined"!=typeof e.getElementsByTagName&&e}n=oe.support={},o=oe.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return!!t&&"HTML"!==t.nodeName},p=oe.setDocument=function(e){var t,i,a=e?e.ownerDocument||e:w;return a!==d&&9===a.nodeType&&a.documentElement?(d=a,h=d.documentElement,g=!o(d),w!==d&&(i=d.defaultView)&&i.top!==i&&(i.addEventListener?i.addEventListener("unload",re,!1):i.attachEvent&&i.attachEvent("onunload",re)),n.attributes=ue(function(e){return e.className="i",!e.getAttribute("className")}),n.getElementsByTagName=ue(function(e){return e.appendChild(d.createComment("")),!e.getElementsByTagName("*").length}),n.getElementsByClassName=Q.test(d.getElementsByClassName),n.getById=ue(function(e){return h.appendChild(e).id=b,!d.getElementsByName||!d.getElementsByName(b).length}),n.getById?(r.filter.ID=function(e){var t=e.replace(Z,ee);return function(e){return e.getAttribute("id")===t}},r.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&g){var n=t.getElementById(e);return n?[n]:[]}}):(r.filter.ID=function(e){var t=e.replace(Z,ee);return function(e){var n="undefined"!=typeof e.getAttributeNode&&e.getAttributeNode("id");return n&&n.value===t}},r.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&g){var n,r,i,o=t.getElementById(e);if(o){if((n=o.getAttributeNode("id"))&&n.value===e)return[o];i=t.getElementsByName(e),r=0;while(o=i[r++])if((n=o.getAttributeNode("id"))&&n.value===e)return[o]}return[]}}),r.find.TAG=n.getElementsByTagName?function(e,t){return"undefined"!=typeof t.getElementsByTagName?t.getElementsByTagName(e):n.qsa?t.querySelectorAll(e):void 0}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},r.find.CLASS=n.getElementsByClassName&&function(e,t){if("undefined"!=typeof t.getElementsByClassName&&g)return t.getElementsByClassName(e)},v=[],y=[],(n.qsa=Q.test(d.querySelectorAll))&&(ue(function(e){h.appendChild(e).innerHTML="<a id='"+b+"'></a><select id='"+b+"-\r\\' msallowcapture=''><option selected=''></option></select>",e.querySelectorAll("[msallowcapture^='']").length&&y.push("[*^$]="+M+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||y.push("\\["+M+"*(?:value|"+P+")"),e.querySelectorAll("[id~="+b+"-]").length||y.push("~="),e.querySelectorAll(":checked").length||y.push(":checked"),e.querySelectorAll("a#"+b+"+*").length||y.push(".#.+[+~]")}),ue(function(e){e.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var t=d.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&y.push("name"+M+"*[*^$|!~]?="),2!==e.querySelectorAll(":enabled").length&&y.push(":enabled",":disabled"),h.appendChild(e).disabled=!0,2!==e.querySelectorAll(":disabled").length&&y.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),y.push(",.*:")})),(n.matchesSelector=Q.test(m=h.matches||h.webkitMatchesSelector||h.mozMatchesSelector||h.oMatchesSelector||h.msMatchesSelector))&&ue(function(e){n.disconnectedMatch=m.call(e,"*"),m.call(e,"[s!='']:x"),v.push("!=",W)}),y=y.length&&new RegExp(y.join("|")),v=v.length&&new RegExp(v.join("|")),t=Q.test(h.compareDocumentPosition),x=t||Q.test(h.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},D=t?function(e,t){if(e===t)return f=!0,0;var r=!e.compareDocumentPosition-!t.compareDocumentPosition;return r||(1&(r=(e.ownerDocument||e)===(t.ownerDocument||t)?e.compareDocumentPosition(t):1)||!n.sortDetached&&t.compareDocumentPosition(e)===r?e===d||e.ownerDocument===w&&x(w,e)?-1:t===d||t.ownerDocument===w&&x(w,t)?1:c?O(c,e)-O(c,t):0:4&r?-1:1)}:function(e,t){if(e===t)return f=!0,0;var n,r=0,i=e.parentNode,o=t.parentNode,a=[e],s=[t];if(!i||!o)return e===d?-1:t===d?1:i?-1:o?1:c?O(c,e)-O(c,t):0;if(i===o)return ce(e,t);n=e;while(n=n.parentNode)a.unshift(n);n=t;while(n=n.parentNode)s.unshift(n);while(a[r]===s[r])r++;return r?ce(a[r],s[r]):a[r]===w?-1:s[r]===w?1:0},d):d},oe.matches=function(e,t){return oe(e,null,null,t)},oe.matchesSelector=function(e,t){if((e.ownerDocument||e)!==d&&p(e),t=t.replace(z,"='$1']"),n.matchesSelector&&g&&!S[t+" "]&&(!v||!v.test(t))&&(!y||!y.test(t)))try{var r=m.call(e,t);if(r||n.disconnectedMatch||e.document&&11!==e.document.nodeType)return r}catch(e){}return oe(t,d,null,[e]).length>0},oe.contains=function(e,t){return(e.ownerDocument||e)!==d&&p(e),x(e,t)},oe.attr=function(e,t){(e.ownerDocument||e)!==d&&p(e);var i=r.attrHandle[t.toLowerCase()],o=i&&N.call(r.attrHandle,t.toLowerCase())?i(e,t,!g):void 0;return void 0!==o?o:n.attributes||!g?e.getAttribute(t):(o=e.getAttributeNode(t))&&o.specified?o.value:null},oe.escape=function(e){return(e+"").replace(te,ne)},oe.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},oe.uniqueSort=function(e){var t,r=[],i=0,o=0;if(f=!n.detectDuplicates,c=!n.sortStable&&e.slice(0),e.sort(D),f){while(t=e[o++])t===e[o]&&(i=r.push(o));while(i--)e.splice(r[i],1)}return c=null,e},i=oe.getText=function(e){var t,n="",r=0,o=e.nodeType;if(o){if(1===o||9===o||11===o){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=i(e)}else if(3===o||4===o)return e.nodeValue}else while(t=e[r++])n+=i(t);return n},(r=oe.selectors={cacheLength:50,createPseudo:se,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(Z,ee),e[3]=(e[3]||e[4]||e[5]||"").replace(Z,ee),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||oe.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&oe.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return V.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&X.test(n)&&(t=a(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(Z,ee).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=E[e+" "];return t||(t=new RegExp("(^|"+M+")"+e+"("+M+"|$)"))&&E(e,function(e){return t.test("string"==typeof e.className&&e.className||"undefined"!=typeof e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=oe.attr(r,e);return null==i?"!="===t:!t||(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i.replace($," ")+" ").indexOf(n)>-1:"|="===t&&(i===n||i.slice(0,n.length+1)===n+"-"))}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,u){var l,c,f,p,d,h,g=o!==a?"nextSibling":"previousSibling",y=t.parentNode,v=s&&t.nodeName.toLowerCase(),m=!u&&!s,x=!1;if(y){if(o){while(g){p=t;while(p=p[g])if(s?p.nodeName.toLowerCase()===v:1===p.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?y.firstChild:y.lastChild],a&&m){x=(d=(l=(c=(f=(p=y)[b]||(p[b]={}))[p.uniqueID]||(f[p.uniqueID]={}))[e]||[])[0]===T&&l[1])&&l[2],p=d&&y.childNodes[d];while(p=++d&&p&&p[g]||(x=d=0)||h.pop())if(1===p.nodeType&&++x&&p===t){c[e]=[T,d,x];break}}else if(m&&(x=d=(l=(c=(f=(p=t)[b]||(p[b]={}))[p.uniqueID]||(f[p.uniqueID]={}))[e]||[])[0]===T&&l[1]),!1===x)while(p=++d&&p&&p[g]||(x=d=0)||h.pop())if((s?p.nodeName.toLowerCase()===v:1===p.nodeType)&&++x&&(m&&((c=(f=p[b]||(p[b]={}))[p.uniqueID]||(f[p.uniqueID]={}))[e]=[T,x]),p===t))break;return(x-=i)===r||x%r==0&&x/r>=0}}},PSEUDO:function(e,t){var n,i=r.pseudos[e]||r.setFilters[e.toLowerCase()]||oe.error("unsupported pseudo: "+e);return i[b]?i(t):i.length>1?(n=[e,e,"",t],r.setFilters.hasOwnProperty(e.toLowerCase())?se(function(e,n){var r,o=i(e,t),a=o.length;while(a--)e[r=O(e,o[a])]=!(n[r]=o[a])}):function(e){return i(e,0,n)}):i}},pseudos:{not:se(function(e){var t=[],n=[],r=s(e.replace(B,"$1"));return r[b]?se(function(e,t,n,i){var o,a=r(e,null,i,[]),s=e.length;while(s--)(o=a[s])&&(e[s]=!(t[s]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),t[0]=null,!n.pop()}}),has:se(function(e){return function(t){return oe(e,t).length>0}}),contains:se(function(e){return e=e.replace(Z,ee),function(t){return(t.textContent||t.innerText||i(t)).indexOf(e)>-1}}),lang:se(function(e){return U.test(e||"")||oe.error("unsupported lang: "+e),e=e.replace(Z,ee).toLowerCase(),function(t){var n;do{if(n=g?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return(n=n.toLowerCase())===e||0===n.indexOf(e+"-")}while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===h},focus:function(e){return e===d.activeElement&&(!d.hasFocus||d.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:de(!1),disabled:de(!0),checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0},parent:function(e){return!r.pseudos.empty(e)},header:function(e){return Y.test(e.nodeName)},input:function(e){return G.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:he(function(){return[0]}),last:he(function(e,t){return[t-1]}),eq:he(function(e,t,n){return[n<0?n+t:n]}),even:he(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:he(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:he(function(e,t,n){for(var r=n<0?n+t:n;--r>=0;)e.push(r);return e}),gt:he(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}}).pseudos.nth=r.pseudos.eq;for(t in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})r.pseudos[t]=fe(t);for(t in{submit:!0,reset:!0})r.pseudos[t]=pe(t);function ye(){}ye.prototype=r.filters=r.pseudos,r.setFilters=new ye,a=oe.tokenize=function(e,t){var n,i,o,a,s,u,l,c=k[e+" "];if(c)return t?0:c.slice(0);s=e,u=[],l=r.preFilter;while(s){n&&!(i=F.exec(s))||(i&&(s=s.slice(i[0].length)||s),u.push(o=[])),n=!1,(i=_.exec(s))&&(n=i.shift(),o.push({value:n,type:i[0].replace(B," ")}),s=s.slice(n.length));for(a in r.filter)!(i=V[a].exec(s))||l[a]&&!(i=l[a](i))||(n=i.shift(),o.push({value:n,type:a,matches:i}),s=s.slice(n.length));if(!n)break}return t?s.length:s?oe.error(e):k(e,u).slice(0)};function ve(e){for(var t=0,n=e.length,r="";t<n;t++)r+=e[t].value;return r}function me(e,t,n){var r=t.dir,i=t.next,o=i||r,a=n&&"parentNode"===o,s=C++;return t.first?function(t,n,i){while(t=t[r])if(1===t.nodeType||a)return e(t,n,i);return!1}:function(t,n,u){var l,c,f,p=[T,s];if(u){while(t=t[r])if((1===t.nodeType||a)&&e(t,n,u))return!0}else while(t=t[r])if(1===t.nodeType||a)if(f=t[b]||(t[b]={}),c=f[t.uniqueID]||(f[t.uniqueID]={}),i&&i===t.nodeName.toLowerCase())t=t[r]||t;else{if((l=c[o])&&l[0]===T&&l[1]===s)return p[2]=l[2];if(c[o]=p,p[2]=e(t,n,u))return!0}return!1}}function xe(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function be(e,t,n){for(var r=0,i=t.length;r<i;r++)oe(e,t[r],n);return n}function we(e,t,n,r,i){for(var o,a=[],s=0,u=e.length,l=null!=t;s<u;s++)(o=e[s])&&(n&&!n(o,r,i)||(a.push(o),l&&t.push(s)));return a}function Te(e,t,n,r,i,o){return r&&!r[b]&&(r=Te(r)),i&&!i[b]&&(i=Te(i,o)),se(function(o,a,s,u){var l,c,f,p=[],d=[],h=a.length,g=o||be(t||"*",s.nodeType?[s]:s,[]),y=!e||!o&&t?g:we(g,p,e,s,u),v=n?i||(o?e:h||r)?[]:a:y;if(n&&n(y,v,s,u),r){l=we(v,d),r(l,[],s,u),c=l.length;while(c--)(f=l[c])&&(v[d[c]]=!(y[d[c]]=f))}if(o){if(i||e){if(i){l=[],c=v.length;while(c--)(f=v[c])&&l.push(y[c]=f);i(null,v=[],l,u)}c=v.length;while(c--)(f=v[c])&&(l=i?O(o,f):p[c])>-1&&(o[l]=!(a[l]=f))}}else v=we(v===a?v.splice(h,v.length):v),i?i(null,a,v,u):L.apply(a,v)})}function Ce(e){for(var t,n,i,o=e.length,a=r.relative[e[0].type],s=a||r.relative[" "],u=a?1:0,c=me(function(e){return e===t},s,!0),f=me(function(e){return O(t,e)>-1},s,!0),p=[function(e,n,r){var i=!a&&(r||n!==l)||((t=n).nodeType?c(e,n,r):f(e,n,r));return t=null,i}];u<o;u++)if(n=r.relative[e[u].type])p=[me(xe(p),n)];else{if((n=r.filter[e[u].type].apply(null,e[u].matches))[b]){for(i=++u;i<o;i++)if(r.relative[e[i].type])break;return Te(u>1&&xe(p),u>1&&ve(e.slice(0,u-1).concat({value:" "===e[u-2].type?"*":""})).replace(B,"$1"),n,u<i&&Ce(e.slice(u,i)),i<o&&Ce(e=e.slice(i)),i<o&&ve(e))}p.push(n)}return xe(p)}function Ee(e,t){var n=t.length>0,i=e.length>0,o=function(o,a,s,u,c){var f,h,y,v=0,m="0",x=o&&[],b=[],w=l,C=o||i&&r.find.TAG("*",c),E=T+=null==w?1:Math.random()||.1,k=C.length;for(c&&(l=a===d||a||c);m!==k&&null!=(f=C[m]);m++){if(i&&f){h=0,a||f.ownerDocument===d||(p(f),s=!g);while(y=e[h++])if(y(f,a||d,s)){u.push(f);break}c&&(T=E)}n&&((f=!y&&f)&&v--,o&&x.push(f))}if(v+=m,n&&m!==v){h=0;while(y=t[h++])y(x,b,a,s);if(o){if(v>0)while(m--)x[m]||b[m]||(b[m]=j.call(u));b=we(b)}L.apply(u,b),c&&!o&&b.length>0&&v+t.length>1&&oe.uniqueSort(u)}return c&&(T=E,l=w),x};return n?se(o):o}return s=oe.compile=function(e,t){var n,r=[],i=[],o=S[e+" "];if(!o){t||(t=a(e)),n=t.length;while(n--)(o=Ce(t[n]))[b]?r.push(o):i.push(o);(o=S(e,Ee(i,r))).selector=e}return o},u=oe.select=function(e,t,n,i){var o,u,l,c,f,p="function"==typeof e&&e,d=!i&&a(e=p.selector||e);if(n=n||[],1===d.length){if((u=d[0]=d[0].slice(0)).length>2&&"ID"===(l=u[0]).type&&9===t.nodeType&&g&&r.relative[u[1].type]){if(!(t=(r.find.ID(l.matches[0].replace(Z,ee),t)||[])[0]))return n;p&&(t=t.parentNode),e=e.slice(u.shift().value.length)}o=V.needsContext.test(e)?0:u.length;while(o--){if(l=u[o],r.relative[c=l.type])break;if((f=r.find[c])&&(i=f(l.matches[0].replace(Z,ee),K.test(u[0].type)&&ge(t.parentNode)||t))){if(u.splice(o,1),!(e=i.length&&ve(u)))return L.apply(n,i),n;break}}}return(p||s(e,d))(i,t,!g,n,!t||K.test(e)&&ge(t.parentNode)||t),n},n.sortStable=b.split("").sort(D).join("")===b,n.detectDuplicates=!!f,p(),n.sortDetached=ue(function(e){return 1&e.compareDocumentPosition(d.createElement("fieldset"))}),ue(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||le("type|href|height|width",function(e,t,n){if(!n)return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),n.attributes&&ue(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||le("value",function(e,t,n){if(!n&&"input"===e.nodeName.toLowerCase())return e.defaultValue}),ue(function(e){return null==e.getAttribute("disabled")})||le(P,function(e,t,n){var r;if(!n)return!0===e[t]?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null}),oe}(e);w.find=E,w.expr=E.selectors,w.expr[":"]=w.expr.pseudos,w.uniqueSort=w.unique=E.uniqueSort,w.text=E.getText,w.isXMLDoc=E.isXML,w.contains=E.contains,w.escapeSelector=E.escape;var k=function(e,t,n){var r=[],i=void 0!==n;while((e=e[t])&&9!==e.nodeType)if(1===e.nodeType){if(i&&w(e).is(n))break;r.push(e)}return r},S=function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n},D=w.expr.match.needsContext;function N(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()}var A=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;function j(e,t,n){return g(t)?w.grep(e,function(e,r){return!!t.call(e,r,e)!==n}):t.nodeType?w.grep(e,function(e){return e===t!==n}):"string"!=typeof t?w.grep(e,function(e){return u.call(t,e)>-1!==n}):w.filter(t,e,n)}w.filter=function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?w.find.matchesSelector(r,e)?[r]:[]:w.find.matches(e,w.grep(t,function(e){return 1===e.nodeType}))},w.fn.extend({find:function(e){var t,n,r=this.length,i=this;if("string"!=typeof e)return this.pushStack(w(e).filter(function(){for(t=0;t<r;t++)if(w.contains(i[t],this))return!0}));for(n=this.pushStack([]),t=0;t<r;t++)w.find(e,i[t],n);return r>1?w.uniqueSort(n):n},filter:function(e){return this.pushStack(j(this,e||[],!1))},not:function(e){return this.pushStack(j(this,e||[],!0))},is:function(e){return!!j(this,"string"==typeof e&&D.test(e)?w(e):e||[],!1).length}});var q,L=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(w.fn.init=function(e,t,n){var i,o;if(!e)return this;if(n=n||q,"string"==typeof e){if(!(i="<"===e[0]&&">"===e[e.length-1]&&e.length>=3?[null,e,null]:L.exec(e))||!i[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(i[1]){if(t=t instanceof w?t[0]:t,w.merge(this,w.parseHTML(i[1],t&&t.nodeType?t.ownerDocument||t:r,!0)),A.test(i[1])&&w.isPlainObject(t))for(i in t)g(this[i])?this[i](t[i]):this.attr(i,t[i]);return this}return(o=r.getElementById(i[2]))&&(this[0]=o,this.length=1),this}return e.nodeType?(this[0]=e,this.length=1,this):g(e)?void 0!==n.ready?n.ready(e):e(w):w.makeArray(e,this)}).prototype=w.fn,q=w(r);var H=/^(?:parents|prev(?:Until|All))/,O={children:!0,contents:!0,next:!0,prev:!0};w.fn.extend({has:function(e){var t=w(e,this),n=t.length;return this.filter(function(){for(var e=0;e<n;e++)if(w.contains(this,t[e]))return!0})},closest:function(e,t){var n,r=0,i=this.length,o=[],a="string"!=typeof e&&w(e);if(!D.test(e))for(;r<i;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(a?a.index(n)>-1:1===n.nodeType&&w.find.matchesSelector(n,e))){o.push(n);break}return this.pushStack(o.length>1?w.uniqueSort(o):o)},index:function(e){return e?"string"==typeof e?u.call(w(e),this[0]):u.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(w.uniqueSort(w.merge(this.get(),w(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}});function P(e,t){while((e=e[t])&&1!==e.nodeType);return e}w.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return k(e,"parentNode")},parentsUntil:function(e,t,n){return k(e,"parentNode",n)},next:function(e){return P(e,"nextSibling")},prev:function(e){return P(e,"previousSibling")},nextAll:function(e){return k(e,"nextSibling")},prevAll:function(e){return k(e,"previousSibling")},nextUntil:function(e,t,n){return k(e,"nextSibling",n)},prevUntil:function(e,t,n){return k(e,"previousSibling",n)},siblings:function(e){return S((e.parentNode||{}).firstChild,e)},children:function(e){return S(e.firstChild)},contents:function(e){return N(e,"iframe")?e.contentDocument:(N(e,"template")&&(e=e.content||e),w.merge([],e.childNodes))}},function(e,t){w.fn[e]=function(n,r){var i=w.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=w.filter(r,i)),this.length>1&&(O[e]||w.uniqueSort(i),H.test(e)&&i.reverse()),this.pushStack(i)}});var M=/[^\x20\t\r\n\f]+/g;function R(e){var t={};return w.each(e.match(M)||[],function(e,n){t[n]=!0}),t}w.Callbacks=function(e){e="string"==typeof e?R(e):w.extend({},e);var t,n,r,i,o=[],a=[],s=-1,u=function(){for(i=i||e.once,r=t=!0;a.length;s=-1){n=a.shift();while(++s<o.length)!1===o[s].apply(n[0],n[1])&&e.stopOnFalse&&(s=o.length,n=!1)}e.memory||(n=!1),t=!1,i&&(o=n?[]:"")},l={add:function(){return o&&(n&&!t&&(s=o.length-1,a.push(n)),function t(n){w.each(n,function(n,r){g(r)?e.unique&&l.has(r)||o.push(r):r&&r.length&&"string"!==x(r)&&t(r)})}(arguments),n&&!t&&u()),this},remove:function(){return w.each(arguments,function(e,t){var n;while((n=w.inArray(t,o,n))>-1)o.splice(n,1),n<=s&&s--}),this},has:function(e){return e?w.inArray(e,o)>-1:o.length>0},empty:function(){return o&&(o=[]),this},disable:function(){return i=a=[],o=n="",this},disabled:function(){return!o},lock:function(){return i=a=[],n||t||(o=n=""),this},locked:function(){return!!i},fireWith:function(e,n){return i||(n=[e,(n=n||[]).slice?n.slice():n],a.push(n),t||u()),this},fire:function(){return l.fireWith(this,arguments),this},fired:function(){return!!r}};return l};function I(e){return e}function W(e){throw e}function $(e,t,n,r){var i;try{e&&g(i=e.promise)?i.call(e).done(t).fail(n):e&&g(i=e.then)?i.call(e,t,n):t.apply(void 0,[e].slice(r))}catch(e){n.apply(void 0,[e])}}w.extend({Deferred:function(t){var n=[["notify","progress",w.Callbacks("memory"),w.Callbacks("memory"),2],["resolve","done",w.Callbacks("once memory"),w.Callbacks("once memory"),0,"resolved"],["reject","fail",w.Callbacks("once memory"),w.Callbacks("once memory"),1,"rejected"]],r="pending",i={state:function(){return r},always:function(){return o.done(arguments).fail(arguments),this},"catch":function(e){return i.then(null,e)},pipe:function(){var e=arguments;return w.Deferred(function(t){w.each(n,function(n,r){var i=g(e[r[4]])&&e[r[4]];o[r[1]](function(){var e=i&&i.apply(this,arguments);e&&g(e.promise)?e.promise().progress(t.notify).done(t.resolve).fail(t.reject):t[r[0]+"With"](this,i?[e]:arguments)})}),e=null}).promise()},then:function(t,r,i){var o=0;function a(t,n,r,i){return function(){var s=this,u=arguments,l=function(){var e,l;if(!(t<o)){if((e=r.apply(s,u))===n.promise())throw new TypeError("Thenable self-resolution");l=e&&("object"==typeof e||"function"==typeof e)&&e.then,g(l)?i?l.call(e,a(o,n,I,i),a(o,n,W,i)):(o++,l.call(e,a(o,n,I,i),a(o,n,W,i),a(o,n,I,n.notifyWith))):(r!==I&&(s=void 0,u=[e]),(i||n.resolveWith)(s,u))}},c=i?l:function(){try{l()}catch(e){w.Deferred.exceptionHook&&w.Deferred.exceptionHook(e,c.stackTrace),t+1>=o&&(r!==W&&(s=void 0,u=[e]),n.rejectWith(s,u))}};t?c():(w.Deferred.getStackHook&&(c.stackTrace=w.Deferred.getStackHook()),e.setTimeout(c))}}return w.Deferred(function(e){n[0][3].add(a(0,e,g(i)?i:I,e.notifyWith)),n[1][3].add(a(0,e,g(t)?t:I)),n[2][3].add(a(0,e,g(r)?r:W))}).promise()},promise:function(e){return null!=e?w.extend(e,i):i}},o={};return w.each(n,function(e,t){var a=t[2],s=t[5];i[t[1]]=a.add,s&&a.add(function(){r=s},n[3-e][2].disable,n[3-e][3].disable,n[0][2].lock,n[0][3].lock),a.add(t[3].fire),o[t[0]]=function(){return o[t[0]+"With"](this===o?void 0:this,arguments),this},o[t[0]+"With"]=a.fireWith}),i.promise(o),t&&t.call(o,o),o},when:function(e){var t=arguments.length,n=t,r=Array(n),i=o.call(arguments),a=w.Deferred(),s=function(e){return function(n){r[e]=this,i[e]=arguments.length>1?o.call(arguments):n,--t||a.resolveWith(r,i)}};if(t<=1&&($(e,a.done(s(n)).resolve,a.reject,!t),"pending"===a.state()||g(i[n]&&i[n].then)))return a.then();while(n--)$(i[n],s(n),a.reject);return a.promise()}});var B=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;w.Deferred.exceptionHook=function(t,n){e.console&&e.console.warn&&t&&B.test(t.name)&&e.console.warn("jQuery.Deferred exception: "+t.message,t.stack,n)},w.readyException=function(t){e.setTimeout(function(){throw t})};var F=w.Deferred();w.fn.ready=function(e){return F.then(e)["catch"](function(e){w.readyException(e)}),this},w.extend({isReady:!1,readyWait:1,ready:function(e){(!0===e?--w.readyWait:w.isReady)||(w.isReady=!0,!0!==e&&--w.readyWait>0||F.resolveWith(r,[w]))}}),w.ready.then=F.then;function _(){r.removeEventListener("DOMContentLoaded",_),e.removeEventListener("load",_),w.ready()}"complete"===r.readyState||"loading"!==r.readyState&&!r.documentElement.doScroll?e.setTimeout(w.ready):(r.addEventListener("DOMContentLoaded",_),e.addEventListener("load",_));var z=function(e,t,n,r,i,o,a){var s=0,u=e.length,l=null==n;if("object"===x(n)){i=!0;for(s in n)z(e,t,s,n[s],!0,o,a)}else if(void 0!==r&&(i=!0,g(r)||(a=!0),l&&(a?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(w(e),n)})),t))for(;s<u;s++)t(e[s],n,a?r:r.call(e[s],s,t(e[s],n)));return i?e:l?t.call(e):u?t(e[0],n):o},X=/^-ms-/,U=/-([a-z])/g;function V(e,t){return t.toUpperCase()}function G(e){return e.replace(X,"ms-").replace(U,V)}var Y=function(e){return 1===e.nodeType||9===e.nodeType||!+e.nodeType};function Q(){this.expando=w.expando+Q.uid++}Q.uid=1,Q.prototype={cache:function(e){var t=e[this.expando];return t||(t={},Y(e)&&(e.nodeType?e[this.expando]=t:Object.defineProperty(e,this.expando,{value:t,configurable:!0}))),t},set:function(e,t,n){var r,i=this.cache(e);if("string"==typeof t)i[G(t)]=n;else for(r in t)i[G(r)]=t[r];return i},get:function(e,t){return void 0===t?this.cache(e):e[this.expando]&&e[this.expando][G(t)]},access:function(e,t,n){return void 0===t||t&&"string"==typeof t&&void 0===n?this.get(e,t):(this.set(e,t,n),void 0!==n?n:t)},remove:function(e,t){var n,r=e[this.expando];if(void 0!==r){if(void 0!==t){n=(t=Array.isArray(t)?t.map(G):(t=G(t))in r?[t]:t.match(M)||[]).length;while(n--)delete r[t[n]]}(void 0===t||w.isEmptyObject(r))&&(e.nodeType?e[this.expando]=void 0:delete e[this.expando])}},hasData:function(e){var t=e[this.expando];return void 0!==t&&!w.isEmptyObject(t)}};var J=new Q,K=new Q,Z=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,ee=/[A-Z]/g;function te(e){return"true"===e||"false"!==e&&("null"===e?null:e===+e+""?+e:Z.test(e)?JSON.parse(e):e)}function ne(e,t,n){var r;if(void 0===n&&1===e.nodeType)if(r="data-"+t.replace(ee,"-$&").toLowerCase(),"string"==typeof(n=e.getAttribute(r))){try{n=te(n)}catch(e){}K.set(e,t,n)}else n=void 0;return n}w.extend({hasData:function(e){return K.hasData(e)||J.hasData(e)},data:function(e,t,n){return K.access(e,t,n)},removeData:function(e,t){K.remove(e,t)},_data:function(e,t,n){return J.access(e,t,n)},_removeData:function(e,t){J.remove(e,t)}}),w.fn.extend({data:function(e,t){var n,r,i,o=this[0],a=o&&o.attributes;if(void 0===e){if(this.length&&(i=K.get(o),1===o.nodeType&&!J.get(o,"hasDataAttrs"))){n=a.length;while(n--)a[n]&&0===(r=a[n].name).indexOf("data-")&&(r=G(r.slice(5)),ne(o,r,i[r]));J.set(o,"hasDataAttrs",!0)}return i}return"object"==typeof e?this.each(function(){K.set(this,e)}):z(this,function(t){var n;if(o&&void 0===t){if(void 0!==(n=K.get(o,e)))return n;if(void 0!==(n=ne(o,e)))return n}else this.each(function(){K.set(this,e,t)})},null,t,arguments.length>1,null,!0)},removeData:function(e){return this.each(function(){K.remove(this,e)})}}),w.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=J.get(e,t),n&&(!r||Array.isArray(n)?r=J.access(e,t,w.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=w.queue(e,t),r=n.length,i=n.shift(),o=w._queueHooks(e,t),a=function(){w.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return J.get(e,n)||J.access(e,n,{empty:w.Callbacks("once memory").add(function(){J.remove(e,[t+"queue",n])})})}}),w.fn.extend({queue:function(e,t){var n=2;return"string"!=typeof e&&(t=e,e="fx",n--),arguments.length<n?w.queue(this[0],e):void 0===t?this:this.each(function(){var n=w.queue(this,e,t);w._queueHooks(this,e),"fx"===e&&"inprogress"!==n[0]&&w.dequeue(this,e)})},dequeue:function(e){return this.each(function(){w.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=w.Deferred(),o=this,a=this.length,s=function(){--r||i.resolveWith(o,[o])};"string"!=typeof e&&(t=e,e=void 0),e=e||"fx";while(a--)(n=J.get(o[a],e+"queueHooks"))&&n.empty&&(r++,n.empty.add(s));return s(),i.promise(t)}});var re=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,ie=new RegExp("^(?:([+-])=|)("+re+")([a-z%]*)$","i"),oe=["Top","Right","Bottom","Left"],ae=function(e,t){return"none"===(e=t||e).style.display||""===e.style.display&&w.contains(e.ownerDocument,e)&&"none"===w.css(e,"display")},se=function(e,t,n,r){var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i};function ue(e,t,n,r){var i,o,a=20,s=r?function(){return r.cur()}:function(){return w.css(e,t,"")},u=s(),l=n&&n[3]||(w.cssNumber[t]?"":"px"),c=(w.cssNumber[t]||"px"!==l&&+u)&&ie.exec(w.css(e,t));if(c&&c[3]!==l){u/=2,l=l||c[3],c=+u||1;while(a--)w.style(e,t,c+l),(1-o)*(1-(o=s()/u||.5))<=0&&(a=0),c/=o;c*=2,w.style(e,t,c+l),n=n||[]}return n&&(c=+c||+u||0,i=n[1]?c+(n[1]+1)*n[2]:+n[2],r&&(r.unit=l,r.start=c,r.end=i)),i}var le={};function ce(e){var t,n=e.ownerDocument,r=e.nodeName,i=le[r];return i||(t=n.body.appendChild(n.createElement(r)),i=w.css(t,"display"),t.parentNode.removeChild(t),"none"===i&&(i="block"),le[r]=i,i)}function fe(e,t){for(var n,r,i=[],o=0,a=e.length;o<a;o++)(r=e[o]).style&&(n=r.style.display,t?("none"===n&&(i[o]=J.get(r,"display")||null,i[o]||(r.style.display="")),""===r.style.display&&ae(r)&&(i[o]=ce(r))):"none"!==n&&(i[o]="none",J.set(r,"display",n)));for(o=0;o<a;o++)null!=i[o]&&(e[o].style.display=i[o]);return e}w.fn.extend({show:function(){return fe(this,!0)},hide:function(){return fe(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){ae(this)?w(this).show():w(this).hide()})}});var pe=/^(?:checkbox|radio)$/i,de=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i,he=/^$|^module$|\/(?:java|ecma)script/i,ge={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ge.optgroup=ge.option,ge.tbody=ge.tfoot=ge.colgroup=ge.caption=ge.thead,ge.th=ge.td;function ye(e,t){var n;return n="undefined"!=typeof e.getElementsByTagName?e.getElementsByTagName(t||"*"):"undefined"!=typeof e.querySelectorAll?e.querySelectorAll(t||"*"):[],void 0===t||t&&N(e,t)?w.merge([e],n):n}function ve(e,t){for(var n=0,r=e.length;n<r;n++)J.set(e[n],"globalEval",!t||J.get(t[n],"globalEval"))}var me=/<|&#?\w+;/;function xe(e,t,n,r,i){for(var o,a,s,u,l,c,f=t.createDocumentFragment(),p=[],d=0,h=e.length;d<h;d++)if((o=e[d])||0===o)if("object"===x(o))w.merge(p,o.nodeType?[o]:o);else if(me.test(o)){a=a||f.appendChild(t.createElement("div")),s=(de.exec(o)||["",""])[1].toLowerCase(),u=ge[s]||ge._default,a.innerHTML=u[1]+w.htmlPrefilter(o)+u[2],c=u[0];while(c--)a=a.lastChild;w.merge(p,a.childNodes),(a=f.firstChild).textContent=""}else p.push(t.createTextNode(o));f.textContent="",d=0;while(o=p[d++])if(r&&w.inArray(o,r)>-1)i&&i.push(o);else if(l=w.contains(o.ownerDocument,o),a=ye(f.appendChild(o),"script"),l&&ve(a),n){c=0;while(o=a[c++])he.test(o.type||"")&&n.push(o)}return f}!function(){var e=r.createDocumentFragment().appendChild(r.createElement("div")),t=r.createElement("input");t.setAttribute("type","radio"),t.setAttribute("checked","checked"),t.setAttribute("name","t"),e.appendChild(t),h.checkClone=e.cloneNode(!0).cloneNode(!0).lastChild.checked,e.innerHTML="<textarea>x</textarea>",h.noCloneChecked=!!e.cloneNode(!0).lastChild.defaultValue}();var be=r.documentElement,we=/^key/,Te=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,Ce=/^([^.]*)(?:\.(.+)|)/;function Ee(){return!0}function ke(){return!1}function Se(){try{return r.activeElement}catch(e){}}function De(e,t,n,r,i,o){var a,s;if("object"==typeof t){"string"!=typeof n&&(r=r||n,n=void 0);for(s in t)De(e,s,n,r,t[s],o);return e}if(null==r&&null==i?(i=n,r=n=void 0):null==i&&("string"==typeof n?(i=r,r=void 0):(i=r,r=n,n=void 0)),!1===i)i=ke;else if(!i)return e;return 1===o&&(a=i,(i=function(e){return w().off(e),a.apply(this,arguments)}).guid=a.guid||(a.guid=w.guid++)),e.each(function(){w.event.add(this,t,i,r,n)})}w.event={global:{},add:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,y=J.get(e);if(y){n.handler&&(n=(o=n).handler,i=o.selector),i&&w.find.matchesSelector(be,i),n.guid||(n.guid=w.guid++),(u=y.events)||(u=y.events={}),(a=y.handle)||(a=y.handle=function(t){return"undefined"!=typeof w&&w.event.triggered!==t.type?w.event.dispatch.apply(e,arguments):void 0}),l=(t=(t||"").match(M)||[""]).length;while(l--)d=g=(s=Ce.exec(t[l])||[])[1],h=(s[2]||"").split(".").sort(),d&&(f=w.event.special[d]||{},d=(i?f.delegateType:f.bindType)||d,f=w.event.special[d]||{},c=w.extend({type:d,origType:g,data:r,handler:n,guid:n.guid,selector:i,needsContext:i&&w.expr.match.needsContext.test(i),namespace:h.join(".")},o),(p=u[d])||((p=u[d]=[]).delegateCount=0,f.setup&&!1!==f.setup.call(e,r,h,a)||e.addEventListener&&e.addEventListener(d,a)),f.add&&(f.add.call(e,c),c.handler.guid||(c.handler.guid=n.guid)),i?p.splice(p.delegateCount++,0,c):p.push(c),w.event.global[d]=!0)}},remove:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,y=J.hasData(e)&&J.get(e);if(y&&(u=y.events)){l=(t=(t||"").match(M)||[""]).length;while(l--)if(s=Ce.exec(t[l])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d){f=w.event.special[d]||{},p=u[d=(r?f.delegateType:f.bindType)||d]||[],s=s[2]&&new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),a=o=p.length;while(o--)c=p[o],!i&&g!==c.origType||n&&n.guid!==c.guid||s&&!s.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(p.splice(o,1),c.selector&&p.delegateCount--,f.remove&&f.remove.call(e,c));a&&!p.length&&(f.teardown&&!1!==f.teardown.call(e,h,y.handle)||w.removeEvent(e,d,y.handle),delete u[d])}else for(d in u)w.event.remove(e,d+t[l],n,r,!0);w.isEmptyObject(u)&&J.remove(e,"handle events")}},dispatch:function(e){var t=w.event.fix(e),n,r,i,o,a,s,u=new Array(arguments.length),l=(J.get(this,"events")||{})[t.type]||[],c=w.event.special[t.type]||{};for(u[0]=t,n=1;n<arguments.length;n++)u[n]=arguments[n];if(t.delegateTarget=this,!c.preDispatch||!1!==c.preDispatch.call(this,t)){s=w.event.handlers.call(this,t,l),n=0;while((o=s[n++])&&!t.isPropagationStopped()){t.currentTarget=o.elem,r=0;while((a=o.handlers[r++])&&!t.isImmediatePropagationStopped())t.rnamespace&&!t.rnamespace.test(a.namespace)||(t.handleObj=a,t.data=a.data,void 0!==(i=((w.event.special[a.origType]||{}).handle||a.handler).apply(o.elem,u))&&!1===(t.result=i)&&(t.preventDefault(),t.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,t),t.result}},handlers:function(e,t){var n,r,i,o,a,s=[],u=t.delegateCount,l=e.target;if(u&&l.nodeType&&!("click"===e.type&&e.button>=1))for(;l!==this;l=l.parentNode||this)if(1===l.nodeType&&("click"!==e.type||!0!==l.disabled)){for(o=[],a={},n=0;n<u;n++)void 0===a[i=(r=t[n]).selector+" "]&&(a[i]=r.needsContext?w(i,this).index(l)>-1:w.find(i,this,null,[l]).length),a[i]&&o.push(r);o.length&&s.push({elem:l,handlers:o})}return l=this,u<t.length&&s.push({elem:l,handlers:t.slice(u)}),s},addProp:function(e,t){Object.defineProperty(w.Event.prototype,e,{enumerable:!0,configurable:!0,get:g(t)?function(){if(this.originalEvent)return t(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[e]},set:function(t){Object.defineProperty(this,e,{enumerable:!0,configurable:!0,writable:!0,value:t})}})},fix:function(e){return e[w.expando]?e:new w.Event(e)},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==Se()&&this.focus)return this.focus(),!1},delegateType:"focusin"},blur:{trigger:function(){if(this===Se()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if("checkbox"===this.type&&this.click&&N(this,"input"))return this.click(),!1},_default:function(e){return N(e.target,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result)}}}},w.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n)},w.Event=function(e,t){if(!(this instanceof w.Event))return new w.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&!1===e.returnValue?Ee:ke,this.target=e.target&&3===e.target.nodeType?e.target.parentNode:e.target,this.currentTarget=e.currentTarget,this.relatedTarget=e.relatedTarget):this.type=e,t&&w.extend(this,t),this.timeStamp=e&&e.timeStamp||Date.now(),this[w.expando]=!0},w.Event.prototype={constructor:w.Event,isDefaultPrevented:ke,isPropagationStopped:ke,isImmediatePropagationStopped:ke,isSimulated:!1,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=Ee,e&&!this.isSimulated&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=Ee,e&&!this.isSimulated&&e.stopPropagation()},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=Ee,e&&!this.isSimulated&&e.stopImmediatePropagation(),this.stopPropagation()}},w.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(e){var t=e.button;return null==e.which&&we.test(e.type)?null!=e.charCode?e.charCode:e.keyCode:!e.which&&void 0!==t&&Te.test(e.type)?1&t?1:2&t?3:4&t?2:0:e.which}},w.event.addProp),w.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(e,t){w.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return i&&(i===r||w.contains(r,i))||(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),w.fn.extend({on:function(e,t,n,r){return De(this,e,t,n,r)},one:function(e,t,n,r){return De(this,e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,w(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(i in e)this.off(i,t,e[i]);return this}return!1!==t&&"function"!=typeof t||(n=t,t=void 0),!1===n&&(n=ke),this.each(function(){w.event.remove(this,e,n,t)})}});var Ne=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,Ae=/<script|<style|<link/i,je=/checked\s*(?:[^=]|=\s*.checked.)/i,qe=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function Le(e,t){return N(e,"table")&&N(11!==t.nodeType?t:t.firstChild,"tr")?w(e).children("tbody")[0]||e:e}function He(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function Oe(e){return"true/"===(e.type||"").slice(0,5)?e.type=e.type.slice(5):e.removeAttribute("type"),e}function Pe(e,t){var n,r,i,o,a,s,u,l;if(1===t.nodeType){if(J.hasData(e)&&(o=J.access(e),a=J.set(t,o),l=o.events)){delete a.handle,a.events={};for(i in l)for(n=0,r=l[i].length;n<r;n++)w.event.add(t,i,l[i][n])}K.hasData(e)&&(s=K.access(e),u=w.extend({},s),K.set(t,u))}}function Me(e,t){var n=t.nodeName.toLowerCase();"input"===n&&pe.test(e.type)?t.checked=e.checked:"input"!==n&&"textarea"!==n||(t.defaultValue=e.defaultValue)}function Re(e,t,n,r){t=a.apply([],t);var i,o,s,u,l,c,f=0,p=e.length,d=p-1,y=t[0],v=g(y);if(v||p>1&&"string"==typeof y&&!h.checkClone&&je.test(y))return e.each(function(i){var o=e.eq(i);v&&(t[0]=y.call(this,i,o.html())),Re(o,t,n,r)});if(p&&(i=xe(t,e[0].ownerDocument,!1,e,r),o=i.firstChild,1===i.childNodes.length&&(i=o),o||r)){for(u=(s=w.map(ye(i,"script"),He)).length;f<p;f++)l=i,f!==d&&(l=w.clone(l,!0,!0),u&&w.merge(s,ye(l,"script"))),n.call(e[f],l,f);if(u)for(c=s[s.length-1].ownerDocument,w.map(s,Oe),f=0;f<u;f++)l=s[f],he.test(l.type||"")&&!J.access(l,"globalEval")&&w.contains(c,l)&&(l.src&&"module"!==(l.type||"").toLowerCase()?w._evalUrl&&w._evalUrl(l.src):m(l.textContent.replace(qe,""),c,l))}return e}function Ie(e,t,n){for(var r,i=t?w.filter(t,e):e,o=0;null!=(r=i[o]);o++)n||1!==r.nodeType||w.cleanData(ye(r)),r.parentNode&&(n&&w.contains(r.ownerDocument,r)&&ve(ye(r,"script")),r.parentNode.removeChild(r));return e}w.extend({htmlPrefilter:function(e){return e.replace(Ne,"<$1></$2>")},clone:function(e,t,n){var r,i,o,a,s=e.cloneNode(!0),u=w.contains(e.ownerDocument,e);if(!(h.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||w.isXMLDoc(e)))for(a=ye(s),r=0,i=(o=ye(e)).length;r<i;r++)Me(o[r],a[r]);if(t)if(n)for(o=o||ye(e),a=a||ye(s),r=0,i=o.length;r<i;r++)Pe(o[r],a[r]);else Pe(e,s);return(a=ye(s,"script")).length>0&&ve(a,!u&&ye(e,"script")),s},cleanData:function(e){for(var t,n,r,i=w.event.special,o=0;void 0!==(n=e[o]);o++)if(Y(n)){if(t=n[J.expando]){if(t.events)for(r in t.events)i[r]?w.event.remove(n,r):w.removeEvent(n,r,t.handle);n[J.expando]=void 0}n[K.expando]&&(n[K.expando]=void 0)}}}),w.fn.extend({detach:function(e){return Ie(this,e,!0)},remove:function(e){return Ie(this,e)},text:function(e){return z(this,function(e){return void 0===e?w.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=e)})},null,e,arguments.length)},append:function(){return Re(this,arguments,function(e){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||Le(this,e).appendChild(e)})},prepend:function(){return Re(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Le(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return Re(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return Re(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},empty:function(){for(var e,t=0;null!=(e=this[t]);t++)1===e.nodeType&&(w.cleanData(ye(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null!=e&&e,t=null==t?e:t,this.map(function(){return w.clone(this,e,t)})},html:function(e){return z(this,function(e){var t=this[0]||{},n=0,r=this.length;if(void 0===e&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!Ae.test(e)&&!ge[(de.exec(e)||["",""])[1].toLowerCase()]){e=w.htmlPrefilter(e);try{for(;n<r;n++)1===(t=this[n]||{}).nodeType&&(w.cleanData(ye(t,!1)),t.innerHTML=e);t=0}catch(e){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=[];return Re(this,arguments,function(t){var n=this.parentNode;w.inArray(this,e)<0&&(w.cleanData(ye(this)),n&&n.replaceChild(t,this))},e)}}),w.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){w.fn[e]=function(e){for(var n,r=[],i=w(e),o=i.length-1,a=0;a<=o;a++)n=a===o?this:this.clone(!0),w(i[a])[t](n),s.apply(r,n.get());return this.pushStack(r)}});var We=new RegExp("^("+re+")(?!px)[a-z%]+$","i"),$e=function(t){var n=t.ownerDocument.defaultView;return n&&n.opener||(n=e),n.getComputedStyle(t)},Be=new RegExp(oe.join("|"),"i");!function(){function t(){if(c){l.style.cssText="position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",c.style.cssText="position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",be.appendChild(l).appendChild(c);var t=e.getComputedStyle(c);i="1%"!==t.top,u=12===n(t.marginLeft),c.style.right="60%",s=36===n(t.right),o=36===n(t.width),c.style.position="absolute",a=36===c.offsetWidth||"absolute",be.removeChild(l),c=null}}function n(e){return Math.round(parseFloat(e))}var i,o,a,s,u,l=r.createElement("div"),c=r.createElement("div");c.style&&(c.style.backgroundClip="content-box",c.cloneNode(!0).style.backgroundClip="",h.clearCloneStyle="content-box"===c.style.backgroundClip,w.extend(h,{boxSizingReliable:function(){return t(),o},pixelBoxStyles:function(){return t(),s},pixelPosition:function(){return t(),i},reliableMarginLeft:function(){return t(),u},scrollboxSize:function(){return t(),a}}))}();function Fe(e,t,n){var r,i,o,a,s=e.style;return(n=n||$e(e))&&(""!==(a=n.getPropertyValue(t)||n[t])||w.contains(e.ownerDocument,e)||(a=w.style(e,t)),!h.pixelBoxStyles()&&We.test(a)&&Be.test(t)&&(r=s.width,i=s.minWidth,o=s.maxWidth,s.minWidth=s.maxWidth=s.width=a,a=n.width,s.width=r,s.minWidth=i,s.maxWidth=o)),void 0!==a?a+"":a}function _e(e,t){return{get:function(){if(!e())return(this.get=t).apply(this,arguments);delete this.get}}}var ze=/^(none|table(?!-c[ea]).+)/,Xe=/^--/,Ue={position:"absolute",visibility:"hidden",display:"block"},Ve={letterSpacing:"0",fontWeight:"400"},Ge=["Webkit","Moz","ms"],Ye=r.createElement("div").style;function Qe(e){if(e in Ye)return e;var t=e[0].toUpperCase()+e.slice(1),n=Ge.length;while(n--)if((e=Ge[n]+t)in Ye)return e}function Je(e){var t=w.cssProps[e];return t||(t=w.cssProps[e]=Qe(e)||e),t}function Ke(e,t,n){var r=ie.exec(t);return r?Math.max(0,r[2]-(n||0))+(r[3]||"px"):t}function Ze(e,t,n,r,i,o){var a="width"===t?1:0,s=0,u=0;if(n===(r?"border":"content"))return 0;for(;a<4;a+=2)"margin"===n&&(u+=w.css(e,n+oe[a],!0,i)),r?("content"===n&&(u-=w.css(e,"padding"+oe[a],!0,i)),"margin"!==n&&(u-=w.css(e,"border"+oe[a]+"Width",!0,i))):(u+=w.css(e,"padding"+oe[a],!0,i),"padding"!==n?u+=w.css(e,"border"+oe[a]+"Width",!0,i):s+=w.css(e,"border"+oe[a]+"Width",!0,i));return!r&&o>=0&&(u+=Math.max(0,Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-o-u-s-.5))),u}function et(e,t,n){var r=$e(e),i=Fe(e,t,r),o="border-box"===w.css(e,"boxSizing",!1,r),a=o;if(We.test(i)){if(!n)return i;i="auto"}return a=a&&(h.boxSizingReliable()||i===e.style[t]),("auto"===i||!parseFloat(i)&&"inline"===w.css(e,"display",!1,r))&&(i=e["offset"+t[0].toUpperCase()+t.slice(1)],a=!0),(i=parseFloat(i)||0)+Ze(e,t,n||(o?"border":"content"),a,r,i)+"px"}w.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Fe(e,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,a,s=G(t),u=Xe.test(t),l=e.style;if(u||(t=Je(s)),a=w.cssHooks[t]||w.cssHooks[s],void 0===n)return a&&"get"in a&&void 0!==(i=a.get(e,!1,r))?i:l[t];"string"==(o=typeof n)&&(i=ie.exec(n))&&i[1]&&(n=ue(e,t,i),o="number"),null!=n&&n===n&&("number"===o&&(n+=i&&i[3]||(w.cssNumber[s]?"":"px")),h.clearCloneStyle||""!==n||0!==t.indexOf("background")||(l[t]="inherit"),a&&"set"in a&&void 0===(n=a.set(e,n,r))||(u?l.setProperty(t,n):l[t]=n))}},css:function(e,t,n,r){var i,o,a,s=G(t);return Xe.test(t)||(t=Je(s)),(a=w.cssHooks[t]||w.cssHooks[s])&&"get"in a&&(i=a.get(e,!0,n)),void 0===i&&(i=Fe(e,t,r)),"normal"===i&&t in Ve&&(i=Ve[t]),""===n||n?(o=parseFloat(i),!0===n||isFinite(o)?o||0:i):i}}),w.each(["height","width"],function(e,t){w.cssHooks[t]={get:function(e,n,r){if(n)return!ze.test(w.css(e,"display"))||e.getClientRects().length&&e.getBoundingClientRect().width?et(e,t,r):se(e,Ue,function(){return et(e,t,r)})},set:function(e,n,r){var i,o=$e(e),a="border-box"===w.css(e,"boxSizing",!1,o),s=r&&Ze(e,t,r,a,o);return a&&h.scrollboxSize()===o.position&&(s-=Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-parseFloat(o[t])-Ze(e,t,"border",!1,o)-.5)),s&&(i=ie.exec(n))&&"px"!==(i[3]||"px")&&(e.style[t]=n,n=w.css(e,t)),Ke(e,n,s)}}}),w.cssHooks.marginLeft=_e(h.reliableMarginLeft,function(e,t){if(t)return(parseFloat(Fe(e,"marginLeft"))||e.getBoundingClientRect().left-se(e,{marginLeft:0},function(){return e.getBoundingClientRect().left}))+"px"}),w.each({margin:"",padding:"",border:"Width"},function(e,t){w.cssHooks[e+t]={expand:function(n){for(var r=0,i={},o="string"==typeof n?n.split(" "):[n];r<4;r++)i[e+oe[r]+t]=o[r]||o[r-2]||o[0];return i}},"margin"!==e&&(w.cssHooks[e+t].set=Ke)}),w.fn.extend({css:function(e,t){return z(this,function(e,t,n){var r,i,o={},a=0;if(Array.isArray(t)){for(r=$e(e),i=t.length;a<i;a++)o[t[a]]=w.css(e,t[a],!1,r);return o}return void 0!==n?w.style(e,t,n):w.css(e,t)},e,t,arguments.length>1)}});function tt(e,t,n,r,i){return new tt.prototype.init(e,t,n,r,i)}w.Tween=tt,tt.prototype={constructor:tt,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||w.easing._default,this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(w.cssNumber[n]?"":"px")},cur:function(){var e=tt.propHooks[this.prop];return e&&e.get?e.get(this):tt.propHooks._default.get(this)},run:function(e){var t,n=tt.propHooks[this.prop];return this.options.duration?this.pos=t=w.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):tt.propHooks._default.set(this),this}},tt.prototype.init.prototype=tt.prototype,tt.propHooks={_default:{get:function(e){var t;return 1!==e.elem.nodeType||null!=e.elem[e.prop]&&null==e.elem.style[e.prop]?e.elem[e.prop]:(t=w.css(e.elem,e.prop,""))&&"auto"!==t?t:0},set:function(e){w.fx.step[e.prop]?w.fx.step[e.prop](e):1!==e.elem.nodeType||null==e.elem.style[w.cssProps[e.prop]]&&!w.cssHooks[e.prop]?e.elem[e.prop]=e.now:w.style(e.elem,e.prop,e.now+e.unit)}}},tt.propHooks.scrollTop=tt.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},w.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2},_default:"swing"},w.fx=tt.prototype.init,w.fx.step={};var nt,rt,it=/^(?:toggle|show|hide)$/,ot=/queueHooks$/;function at(){rt&&(!1===r.hidden&&e.requestAnimationFrame?e.requestAnimationFrame(at):e.setTimeout(at,w.fx.interval),w.fx.tick())}function st(){return e.setTimeout(function(){nt=void 0}),nt=Date.now()}function ut(e,t){var n,r=0,i={height:e};for(t=t?1:0;r<4;r+=2-t)i["margin"+(n=oe[r])]=i["padding"+n]=e;return t&&(i.opacity=i.width=e),i}function lt(e,t,n){for(var r,i=(pt.tweeners[t]||[]).concat(pt.tweeners["*"]),o=0,a=i.length;o<a;o++)if(r=i[o].call(n,t,e))return r}function ct(e,t,n){var r,i,o,a,s,u,l,c,f="width"in t||"height"in t,p=this,d={},h=e.style,g=e.nodeType&&ae(e),y=J.get(e,"fxshow");n.queue||(null==(a=w._queueHooks(e,"fx")).unqueued&&(a.unqueued=0,s=a.empty.fire,a.empty.fire=function(){a.unqueued||s()}),a.unqueued++,p.always(function(){p.always(function(){a.unqueued--,w.queue(e,"fx").length||a.empty.fire()})}));for(r in t)if(i=t[r],it.test(i)){if(delete t[r],o=o||"toggle"===i,i===(g?"hide":"show")){if("show"!==i||!y||void 0===y[r])continue;g=!0}d[r]=y&&y[r]||w.style(e,r)}if((u=!w.isEmptyObject(t))||!w.isEmptyObject(d)){f&&1===e.nodeType&&(n.overflow=[h.overflow,h.overflowX,h.overflowY],null==(l=y&&y.display)&&(l=J.get(e,"display")),"none"===(c=w.css(e,"display"))&&(l?c=l:(fe([e],!0),l=e.style.display||l,c=w.css(e,"display"),fe([e]))),("inline"===c||"inline-block"===c&&null!=l)&&"none"===w.css(e,"float")&&(u||(p.done(function(){h.display=l}),null==l&&(c=h.display,l="none"===c?"":c)),h.display="inline-block")),n.overflow&&(h.overflow="hidden",p.always(function(){h.overflow=n.overflow[0],h.overflowX=n.overflow[1],h.overflowY=n.overflow[2]})),u=!1;for(r in d)u||(y?"hidden"in y&&(g=y.hidden):y=J.access(e,"fxshow",{display:l}),o&&(y.hidden=!g),g&&fe([e],!0),p.done(function(){g||fe([e]),J.remove(e,"fxshow");for(r in d)w.style(e,r,d[r])})),u=lt(g?y[r]:0,r,p),r in y||(y[r]=u.start,g&&(u.end=u.start,u.start=0))}}function ft(e,t){var n,r,i,o,a;for(n in e)if(r=G(n),i=t[r],o=e[n],Array.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),(a=w.cssHooks[r])&&"expand"in a){o=a.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}function pt(e,t,n){var r,i,o=0,a=pt.prefilters.length,s=w.Deferred().always(function(){delete u.elem}),u=function(){if(i)return!1;for(var t=nt||st(),n=Math.max(0,l.startTime+l.duration-t),r=1-(n/l.duration||0),o=0,a=l.tweens.length;o<a;o++)l.tweens[o].run(r);return s.notifyWith(e,[l,r,n]),r<1&&a?n:(a||s.notifyWith(e,[l,1,0]),s.resolveWith(e,[l]),!1)},l=s.promise({elem:e,props:w.extend({},t),opts:w.extend(!0,{specialEasing:{},easing:w.easing._default},n),originalProperties:t,originalOptions:n,startTime:nt||st(),duration:n.duration,tweens:[],createTween:function(t,n){var r=w.Tween(e,l.opts,t,n,l.opts.specialEasing[t]||l.opts.easing);return l.tweens.push(r),r},stop:function(t){var n=0,r=t?l.tweens.length:0;if(i)return this;for(i=!0;n<r;n++)l.tweens[n].run(1);return t?(s.notifyWith(e,[l,1,0]),s.resolveWith(e,[l,t])):s.rejectWith(e,[l,t]),this}}),c=l.props;for(ft(c,l.opts.specialEasing);o<a;o++)if(r=pt.prefilters[o].call(l,e,c,l.opts))return g(r.stop)&&(w._queueHooks(l.elem,l.opts.queue).stop=r.stop.bind(r)),r;return w.map(c,lt,l),g(l.opts.start)&&l.opts.start.call(e,l),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always),w.fx.timer(w.extend(u,{elem:e,anim:l,queue:l.opts.queue})),l}w.Animation=w.extend(pt,{tweeners:{"*":[function(e,t){var n=this.createTween(e,t);return ue(n.elem,e,ie.exec(t),n),n}]},tweener:function(e,t){g(e)?(t=e,e=["*"]):e=e.match(M);for(var n,r=0,i=e.length;r<i;r++)n=e[r],pt.tweeners[n]=pt.tweeners[n]||[],pt.tweeners[n].unshift(t)},prefilters:[ct],prefilter:function(e,t){t?pt.prefilters.unshift(e):pt.prefilters.push(e)}}),w.speed=function(e,t,n){var r=e&&"object"==typeof e?w.extend({},e):{complete:n||!n&&t||g(e)&&e,duration:e,easing:n&&t||t&&!g(t)&&t};return w.fx.off?r.duration=0:"number"!=typeof r.duration&&(r.duration in w.fx.speeds?r.duration=w.fx.speeds[r.duration]:r.duration=w.fx.speeds._default),null!=r.queue&&!0!==r.queue||(r.queue="fx"),r.old=r.complete,r.complete=function(){g(r.old)&&r.old.call(this),r.queue&&w.dequeue(this,r.queue)},r},w.fn.extend({fadeTo:function(e,t,n,r){return this.filter(ae).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=w.isEmptyObject(e),o=w.speed(t,n,r),a=function(){var t=pt(this,w.extend({},e),o);(i||J.get(this,"finish"))&&t.stop(!0)};return a.finish=a,i||!1===o.queue?this.each(a):this.queue(o.queue,a)},stop:function(e,t,n){var r=function(e){var t=e.stop;delete e.stop,t(n)};return"string"!=typeof e&&(n=t,t=e,e=void 0),t&&!1!==e&&this.queue(e||"fx",[]),this.each(function(){var t=!0,i=null!=e&&e+"queueHooks",o=w.timers,a=J.get(this);if(i)a[i]&&a[i].stop&&r(a[i]);else for(i in a)a[i]&&a[i].stop&&ot.test(i)&&r(a[i]);for(i=o.length;i--;)o[i].elem!==this||null!=e&&o[i].queue!==e||(o[i].anim.stop(n),t=!1,o.splice(i,1));!t&&n||w.dequeue(this,e)})},finish:function(e){return!1!==e&&(e=e||"fx"),this.each(function(){var t,n=J.get(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=w.timers,a=r?r.length:0;for(n.finish=!0,w.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;t<a;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}}),w.each(["toggle","show","hide"],function(e,t){var n=w.fn[t];w.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(ut(t,!0),e,r,i)}}),w.each({slideDown:ut("show"),slideUp:ut("hide"),slideToggle:ut("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){w.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),w.timers=[],w.fx.tick=function(){var e,t=0,n=w.timers;for(nt=Date.now();t<n.length;t++)(e=n[t])()||n[t]!==e||n.splice(t--,1);n.length||w.fx.stop(),nt=void 0},w.fx.timer=function(e){w.timers.push(e),w.fx.start()},w.fx.interval=13,w.fx.start=function(){rt||(rt=!0,at())},w.fx.stop=function(){rt=null},w.fx.speeds={slow:600,fast:200,_default:400},w.fn.delay=function(t,n){return t=w.fx?w.fx.speeds[t]||t:t,n=n||"fx",this.queue(n,function(n,r){var i=e.setTimeout(n,t);r.stop=function(){e.clearTimeout(i)}})},function(){var e=r.createElement("input"),t=r.createElement("select").appendChild(r.createElement("option"));e.type="checkbox",h.checkOn=""!==e.value,h.optSelected=t.selected,(e=r.createElement("input")).value="t",e.type="radio",h.radioValue="t"===e.value}();var dt,ht=w.expr.attrHandle;w.fn.extend({attr:function(e,t){return z(this,w.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){w.removeAttr(this,e)})}}),w.extend({attr:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return"undefined"==typeof e.getAttribute?w.prop(e,t,n):(1===o&&w.isXMLDoc(e)||(i=w.attrHooks[t.toLowerCase()]||(w.expr.match.bool.test(t)?dt:void 0)),void 0!==n?null===n?void w.removeAttr(e,t):i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:(e.setAttribute(t,n+""),n):i&&"get"in i&&null!==(r=i.get(e,t))?r:null==(r=w.find.attr(e,t))?void 0:r)},attrHooks:{type:{set:function(e,t){if(!h.radioValue&&"radio"===t&&N(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},removeAttr:function(e,t){var n,r=0,i=t&&t.match(M);if(i&&1===e.nodeType)while(n=i[r++])e.removeAttribute(n)}}),dt={set:function(e,t,n){return!1===t?w.removeAttr(e,n):e.setAttribute(n,n),n}},w.each(w.expr.match.bool.source.match(/\w+/g),function(e,t){var n=ht[t]||w.find.attr;ht[t]=function(e,t,r){var i,o,a=t.toLowerCase();return r||(o=ht[a],ht[a]=i,i=null!=n(e,t,r)?a:null,ht[a]=o),i}});var gt=/^(?:input|select|textarea|button)$/i,yt=/^(?:a|area)$/i;w.fn.extend({prop:function(e,t){return z(this,w.prop,e,t,arguments.length>1)},removeProp:function(e){return this.each(function(){delete this[w.propFix[e]||e]})}}),w.extend({prop:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return 1===o&&w.isXMLDoc(e)||(t=w.propFix[t]||t,i=w.propHooks[t]),void 0!==n?i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){var t=w.find.attr(e,"tabindex");return t?parseInt(t,10):gt.test(e.nodeName)||yt.test(e.nodeName)&&e.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),h.optSelected||(w.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null},set:function(e){var t=e.parentNode;t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex)}}),w.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){w.propFix[this.toLowerCase()]=this});function vt(e){return(e.match(M)||[]).join(" ")}function mt(e){return e.getAttribute&&e.getAttribute("class")||""}function xt(e){return Array.isArray(e)?e:"string"==typeof e?e.match(M)||[]:[]}w.fn.extend({addClass:function(e){var t,n,r,i,o,a,s,u=0;if(g(e))return this.each(function(t){w(this).addClass(e.call(this,t,mt(this)))});if((t=xt(e)).length)while(n=this[u++])if(i=mt(n),r=1===n.nodeType&&" "+vt(i)+" "){a=0;while(o=t[a++])r.indexOf(" "+o+" ")<0&&(r+=o+" ");i!==(s=vt(r))&&n.setAttribute("class",s)}return this},removeClass:function(e){var t,n,r,i,o,a,s,u=0;if(g(e))return this.each(function(t){w(this).removeClass(e.call(this,t,mt(this)))});if(!arguments.length)return this.attr("class","");if((t=xt(e)).length)while(n=this[u++])if(i=mt(n),r=1===n.nodeType&&" "+vt(i)+" "){a=0;while(o=t[a++])while(r.indexOf(" "+o+" ")>-1)r=r.replace(" "+o+" "," ");i!==(s=vt(r))&&n.setAttribute("class",s)}return this},toggleClass:function(e,t){var n=typeof e,r="string"===n||Array.isArray(e);return"boolean"==typeof t&&r?t?this.addClass(e):this.removeClass(e):g(e)?this.each(function(n){w(this).toggleClass(e.call(this,n,mt(this),t),t)}):this.each(function(){var t,i,o,a;if(r){i=0,o=w(this),a=xt(e);while(t=a[i++])o.hasClass(t)?o.removeClass(t):o.addClass(t)}else void 0!==e&&"boolean"!==n||((t=mt(this))&&J.set(this,"__className__",t),this.setAttribute&&this.setAttribute("class",t||!1===e?"":J.get(this,"__className__")||""))})},hasClass:function(e){var t,n,r=0;t=" "+e+" ";while(n=this[r++])if(1===n.nodeType&&(" "+vt(mt(n))+" ").indexOf(t)>-1)return!0;return!1}});var bt=/\r/g;w.fn.extend({val:function(e){var t,n,r,i=this[0];{if(arguments.length)return r=g(e),this.each(function(n){var i;1===this.nodeType&&(null==(i=r?e.call(this,n,w(this).val()):e)?i="":"number"==typeof i?i+="":Array.isArray(i)&&(i=w.map(i,function(e){return null==e?"":e+""})),(t=w.valHooks[this.type]||w.valHooks[this.nodeName.toLowerCase()])&&"set"in t&&void 0!==t.set(this,i,"value")||(this.value=i))});if(i)return(t=w.valHooks[i.type]||w.valHooks[i.nodeName.toLowerCase()])&&"get"in t&&void 0!==(n=t.get(i,"value"))?n:"string"==typeof(n=i.value)?n.replace(bt,""):null==n?"":n}}}),w.extend({valHooks:{option:{get:function(e){var t=w.find.attr(e,"value");return null!=t?t:vt(w.text(e))}},select:{get:function(e){var t,n,r,i=e.options,o=e.selectedIndex,a="select-one"===e.type,s=a?null:[],u=a?o+1:i.length;for(r=o<0?u:a?o:0;r<u;r++)if(((n=i[r]).selected||r===o)&&!n.disabled&&(!n.parentNode.disabled||!N(n.parentNode,"optgroup"))){if(t=w(n).val(),a)return t;s.push(t)}return s},set:function(e,t){var n,r,i=e.options,o=w.makeArray(t),a=i.length;while(a--)((r=i[a]).selected=w.inArray(w.valHooks.option.get(r),o)>-1)&&(n=!0);return n||(e.selectedIndex=-1),o}}}}),w.each(["radio","checkbox"],function(){w.valHooks[this]={set:function(e,t){if(Array.isArray(t))return e.checked=w.inArray(w(e).val(),t)>-1}},h.checkOn||(w.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})}),h.focusin="onfocusin"in e;var wt=/^(?:focusinfocus|focusoutblur)$/,Tt=function(e){e.stopPropagation()};w.extend(w.event,{trigger:function(t,n,i,o){var a,s,u,l,c,p,d,h,v=[i||r],m=f.call(t,"type")?t.type:t,x=f.call(t,"namespace")?t.namespace.split("."):[];if(s=h=u=i=i||r,3!==i.nodeType&&8!==i.nodeType&&!wt.test(m+w.event.triggered)&&(m.indexOf(".")>-1&&(m=(x=m.split(".")).shift(),x.sort()),c=m.indexOf(":")<0&&"on"+m,t=t[w.expando]?t:new w.Event(m,"object"==typeof t&&t),t.isTrigger=o?2:3,t.namespace=x.join("."),t.rnamespace=t.namespace?new RegExp("(^|\\.)"+x.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,t.result=void 0,t.target||(t.target=i),n=null==n?[t]:w.makeArray(n,[t]),d=w.event.special[m]||{},o||!d.trigger||!1!==d.trigger.apply(i,n))){if(!o&&!d.noBubble&&!y(i)){for(l=d.delegateType||m,wt.test(l+m)||(s=s.parentNode);s;s=s.parentNode)v.push(s),u=s;u===(i.ownerDocument||r)&&v.push(u.defaultView||u.parentWindow||e)}a=0;while((s=v[a++])&&!t.isPropagationStopped())h=s,t.type=a>1?l:d.bindType||m,(p=(J.get(s,"events")||{})[t.type]&&J.get(s,"handle"))&&p.apply(s,n),(p=c&&s[c])&&p.apply&&Y(s)&&(t.result=p.apply(s,n),!1===t.result&&t.preventDefault());return t.type=m,o||t.isDefaultPrevented()||d._default&&!1!==d._default.apply(v.pop(),n)||!Y(i)||c&&g(i[m])&&!y(i)&&((u=i[c])&&(i[c]=null),w.event.triggered=m,t.isPropagationStopped()&&h.addEventListener(m,Tt),i[m](),t.isPropagationStopped()&&h.removeEventListener(m,Tt),w.event.triggered=void 0,u&&(i[c]=u)),t.result}},simulate:function(e,t,n){var r=w.extend(new w.Event,n,{type:e,isSimulated:!0});w.event.trigger(r,null,t)}}),w.fn.extend({trigger:function(e,t){return this.each(function(){w.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];if(n)return w.event.trigger(e,t,n,!0)}}),h.focusin||w.each({focus:"focusin",blur:"focusout"},function(e,t){var n=function(e){w.event.simulate(t,e.target,w.event.fix(e))};w.event.special[t]={setup:function(){var r=this.ownerDocument||this,i=J.access(r,t);i||r.addEventListener(e,n,!0),J.access(r,t,(i||0)+1)},teardown:function(){var r=this.ownerDocument||this,i=J.access(r,t)-1;i?J.access(r,t,i):(r.removeEventListener(e,n,!0),J.remove(r,t))}}});var Ct=e.location,Et=Date.now(),kt=/\?/;w.parseXML=function(t){var n;if(!t||"string"!=typeof t)return null;try{n=(new e.DOMParser).parseFromString(t,"text/xml")}catch(e){n=void 0}return n&&!n.getElementsByTagName("parsererror").length||w.error("Invalid XML: "+t),n};var St=/\[\]$/,Dt=/\r?\n/g,Nt=/^(?:submit|button|image|reset|file)$/i,At=/^(?:input|select|textarea|keygen)/i;function jt(e,t,n,r){var i;if(Array.isArray(t))w.each(t,function(t,i){n||St.test(e)?r(e,i):jt(e+"["+("object"==typeof i&&null!=i?t:"")+"]",i,n,r)});else if(n||"object"!==x(t))r(e,t);else for(i in t)jt(e+"["+i+"]",t[i],n,r)}w.param=function(e,t){var n,r=[],i=function(e,t){var n=g(t)?t():t;r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(null==n?"":n)};if(Array.isArray(e)||e.jquery&&!w.isPlainObject(e))w.each(e,function(){i(this.name,this.value)});else for(n in e)jt(n,e[n],t,i);return r.join("&")},w.fn.extend({serialize:function(){return w.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=w.prop(this,"elements");return e?w.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!w(this).is(":disabled")&&At.test(this.nodeName)&&!Nt.test(e)&&(this.checked||!pe.test(e))}).map(function(e,t){var n=w(this).val();return null==n?null:Array.isArray(n)?w.map(n,function(e){return{name:t.name,value:e.replace(Dt,"\r\n")}}):{name:t.name,value:n.replace(Dt,"\r\n")}}).get()}});var qt=/%20/g,Lt=/#.*$/,Ht=/([?&])_=[^&]*/,Ot=/^(.*?):[ \t]*([^\r\n]*)$/gm,Pt=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Mt=/^(?:GET|HEAD)$/,Rt=/^\/\//,It={},Wt={},$t="*/".concat("*"),Bt=r.createElement("a");Bt.href=Ct.href;function Ft(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(M)||[];if(g(n))while(r=o[i++])"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function _t(e,t,n,r){var i={},o=e===Wt;function a(s){var u;return i[s]=!0,w.each(e[s]||[],function(e,s){var l=s(t,n,r);return"string"!=typeof l||o||i[l]?o?!(u=l):void 0:(t.dataTypes.unshift(l),a(l),!1)}),u}return a(t.dataTypes[0])||!i["*"]&&a("*")}function zt(e,t){var n,r,i=w.ajaxSettings.flatOptions||{};for(n in t)void 0!==t[n]&&((i[n]?e:r||(r={}))[n]=t[n]);return r&&w.extend(!0,e,r),e}function Xt(e,t,n){var r,i,o,a,s=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),void 0===r&&(r=e.mimeType||t.getResponseHeader("Content-Type"));if(r)for(i in s)if(s[i]&&s[i].test(r)){u.unshift(i);break}if(u[0]in n)o=u[0];else{for(i in n){if(!u[0]||e.converters[i+" "+u[0]]){o=i;break}a||(a=i)}o=o||a}if(o)return o!==u[0]&&u.unshift(o),n[o]}function Ut(e,t,n,r){var i,o,a,s,u,l={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)l[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if("*"===o)o=u;else if("*"!==u&&u!==o){if(!(a=l[u+" "+o]||l["* "+o]))for(i in l)if((s=i.split(" "))[1]===o&&(a=l[u+" "+s[0]]||l["* "+s[0]])){!0===a?a=l[i]:!0!==l[i]&&(o=s[0],c.unshift(s[1]));break}if(!0!==a)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(e){return{state:"parsererror",error:a?e:"No conversion from "+u+" to "+o}}}return{state:"success",data:t}}w.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Ct.href,type:"GET",isLocal:Pt.test(Ct.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":$t,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":w.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?zt(zt(e,w.ajaxSettings),t):zt(w.ajaxSettings,e)},ajaxPrefilter:Ft(It),ajaxTransport:Ft(Wt),ajax:function(t,n){"object"==typeof t&&(n=t,t=void 0),n=n||{};var i,o,a,s,u,l,c,f,p,d,h=w.ajaxSetup({},n),g=h.context||h,y=h.context&&(g.nodeType||g.jquery)?w(g):w.event,v=w.Deferred(),m=w.Callbacks("once memory"),x=h.statusCode||{},b={},T={},C="canceled",E={readyState:0,getResponseHeader:function(e){var t;if(c){if(!s){s={};while(t=Ot.exec(a))s[t[1].toLowerCase()]=t[2]}t=s[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return c?a:null},setRequestHeader:function(e,t){return null==c&&(e=T[e.toLowerCase()]=T[e.toLowerCase()]||e,b[e]=t),this},overrideMimeType:function(e){return null==c&&(h.mimeType=e),this},statusCode:function(e){var t;if(e)if(c)E.always(e[E.status]);else for(t in e)x[t]=[x[t],e[t]];return this},abort:function(e){var t=e||C;return i&&i.abort(t),k(0,t),this}};if(v.promise(E),h.url=((t||h.url||Ct.href)+"").replace(Rt,Ct.protocol+"//"),h.type=n.method||n.type||h.method||h.type,h.dataTypes=(h.dataType||"*").toLowerCase().match(M)||[""],null==h.crossDomain){l=r.createElement("a");try{l.href=h.url,l.href=l.href,h.crossDomain=Bt.protocol+"//"+Bt.host!=l.protocol+"//"+l.host}catch(e){h.crossDomain=!0}}if(h.data&&h.processData&&"string"!=typeof h.data&&(h.data=w.param(h.data,h.traditional)),_t(It,h,n,E),c)return E;(f=w.event&&h.global)&&0==w.active++&&w.event.trigger("ajaxStart"),h.type=h.type.toUpperCase(),h.hasContent=!Mt.test(h.type),o=h.url.replace(Lt,""),h.hasContent?h.data&&h.processData&&0===(h.contentType||"").indexOf("application/x-www-form-urlencoded")&&(h.data=h.data.replace(qt,"+")):(d=h.url.slice(o.length),h.data&&(h.processData||"string"==typeof h.data)&&(o+=(kt.test(o)?"&":"?")+h.data,delete h.data),!1===h.cache&&(o=o.replace(Ht,"$1"),d=(kt.test(o)?"&":"?")+"_="+Et+++d),h.url=o+d),h.ifModified&&(w.lastModified[o]&&E.setRequestHeader("If-Modified-Since",w.lastModified[o]),w.etag[o]&&E.setRequestHeader("If-None-Match",w.etag[o])),(h.data&&h.hasContent&&!1!==h.contentType||n.contentType)&&E.setRequestHeader("Content-Type",h.contentType),E.setRequestHeader("Accept",h.dataTypes[0]&&h.accepts[h.dataTypes[0]]?h.accepts[h.dataTypes[0]]+("*"!==h.dataTypes[0]?", "+$t+"; q=0.01":""):h.accepts["*"]);for(p in h.headers)E.setRequestHeader(p,h.headers[p]);if(h.beforeSend&&(!1===h.beforeSend.call(g,E,h)||c))return E.abort();if(C="abort",m.add(h.complete),E.done(h.success),E.fail(h.error),i=_t(Wt,h,n,E)){if(E.readyState=1,f&&y.trigger("ajaxSend",[E,h]),c)return E;h.async&&h.timeout>0&&(u=e.setTimeout(function(){E.abort("timeout")},h.timeout));try{c=!1,i.send(b,k)}catch(e){if(c)throw e;k(-1,e)}}else k(-1,"No Transport");function k(t,n,r,s){var l,p,d,b,T,C=n;c||(c=!0,u&&e.clearTimeout(u),i=void 0,a=s||"",E.readyState=t>0?4:0,l=t>=200&&t<300||304===t,r&&(b=Xt(h,E,r)),b=Ut(h,b,E,l),l?(h.ifModified&&((T=E.getResponseHeader("Last-Modified"))&&(w.lastModified[o]=T),(T=E.getResponseHeader("etag"))&&(w.etag[o]=T)),204===t||"HEAD"===h.type?C="nocontent":304===t?C="notmodified":(C=b.state,p=b.data,l=!(d=b.error))):(d=C,!t&&C||(C="error",t<0&&(t=0))),E.status=t,E.statusText=(n||C)+"",l?v.resolveWith(g,[p,C,E]):v.rejectWith(g,[E,C,d]),E.statusCode(x),x=void 0,f&&y.trigger(l?"ajaxSuccess":"ajaxError",[E,h,l?p:d]),m.fireWith(g,[E,C]),f&&(y.trigger("ajaxComplete",[E,h]),--w.active||w.event.trigger("ajaxStop")))}return E},getJSON:function(e,t,n){return w.get(e,t,n,"json")},getScript:function(e,t){return w.get(e,void 0,t,"script")}}),w.each(["get","post"],function(e,t){w[t]=function(e,n,r,i){return g(n)&&(i=i||r,r=n,n=void 0),w.ajax(w.extend({url:e,type:t,dataType:i,data:n,success:r},w.isPlainObject(e)&&e))}}),w._evalUrl=function(e){return w.ajax({url:e,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,"throws":!0})},w.fn.extend({wrapAll:function(e){var t;return this[0]&&(g(e)&&(e=e.call(this[0])),t=w(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstElementChild)e=e.firstElementChild;return e}).append(this)),this},wrapInner:function(e){return g(e)?this.each(function(t){w(this).wrapInner(e.call(this,t))}):this.each(function(){var t=w(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=g(e);return this.each(function(n){w(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(e){return this.parent(e).not("body").each(function(){w(this).replaceWith(this.childNodes)}),this}}),w.expr.pseudos.hidden=function(e){return!w.expr.pseudos.visible(e)},w.expr.pseudos.visible=function(e){return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)},w.ajaxSettings.xhr=function(){try{return new e.XMLHttpRequest}catch(e){}};var Vt={0:200,1223:204},Gt=w.ajaxSettings.xhr();h.cors=!!Gt&&"withCredentials"in Gt,h.ajax=Gt=!!Gt,w.ajaxTransport(function(t){var n,r;if(h.cors||Gt&&!t.crossDomain)return{send:function(i,o){var a,s=t.xhr();if(s.open(t.type,t.url,t.async,t.username,t.password),t.xhrFields)for(a in t.xhrFields)s[a]=t.xhrFields[a];t.mimeType&&s.overrideMimeType&&s.overrideMimeType(t.mimeType),t.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest");for(a in i)s.setRequestHeader(a,i[a]);n=function(e){return function(){n&&(n=r=s.onload=s.onerror=s.onabort=s.ontimeout=s.onreadystatechange=null,"abort"===e?s.abort():"error"===e?"number"!=typeof s.status?o(0,"error"):o(s.status,s.statusText):o(Vt[s.status]||s.status,s.statusText,"text"!==(s.responseType||"text")||"string"!=typeof s.responseText?{binary:s.response}:{text:s.responseText},s.getAllResponseHeaders()))}},s.onload=n(),r=s.onerror=s.ontimeout=n("error"),void 0!==s.onabort?s.onabort=r:s.onreadystatechange=function(){4===s.readyState&&e.setTimeout(function(){n&&r()})},n=n("abort");try{s.send(t.hasContent&&t.data||null)}catch(e){if(n)throw e}},abort:function(){n&&n()}}}),w.ajaxPrefilter(function(e){e.crossDomain&&(e.contents.script=!1)}),w.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(e){return w.globalEval(e),e}}}),w.ajaxPrefilter("script",function(e){void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),w.ajaxTransport("script",function(e){if(e.crossDomain){var t,n;return{send:function(i,o){t=w("<script>").prop({charset:e.scriptCharset,src:e.url}).on("load error",n=function(e){t.remove(),n=null,e&&o("error"===e.type?404:200,e.type)}),r.head.appendChild(t[0])},abort:function(){n&&n()}}}});var Yt=[],Qt=/(=)\?(?=&|$)|\?\?/;w.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Yt.pop()||w.expando+"_"+Et++;return this[e]=!0,e}}),w.ajaxPrefilter("json jsonp",function(t,n,r){var i,o,a,s=!1!==t.jsonp&&(Qt.test(t.url)?"url":"string"==typeof t.data&&0===(t.contentType||"").indexOf("application/x-www-form-urlencoded")&&Qt.test(t.data)&&"data");if(s||"jsonp"===t.dataTypes[0])return i=t.jsonpCallback=g(t.jsonpCallback)?t.jsonpCallback():t.jsonpCallback,s?t[s]=t[s].replace(Qt,"$1"+i):!1!==t.jsonp&&(t.url+=(kt.test(t.url)?"&":"?")+t.jsonp+"="+i),t.converters["script json"]=function(){return a||w.error(i+" was not called"),a[0]},t.dataTypes[0]="json",o=e[i],e[i]=function(){a=arguments},r.always(function(){void 0===o?w(e).removeProp(i):e[i]=o,t[i]&&(t.jsonpCallback=n.jsonpCallback,Yt.push(i)),a&&g(o)&&o(a[0]),a=o=void 0}),"script"}),h.createHTMLDocument=function(){var e=r.implementation.createHTMLDocument("").body;return e.innerHTML="<form></form><form></form>",2===e.childNodes.length}(),w.parseHTML=function(e,t,n){if("string"!=typeof e)return[];"boolean"==typeof t&&(n=t,t=!1);var i,o,a;return t||(h.createHTMLDocument?((i=(t=r.implementation.createHTMLDocument("")).createElement("base")).href=r.location.href,t.head.appendChild(i)):t=r),o=A.exec(e),a=!n&&[],o?[t.createElement(o[1])]:(o=xe([e],t,a),a&&a.length&&w(a).remove(),w.merge([],o.childNodes))},w.fn.load=function(e,t,n){var r,i,o,a=this,s=e.indexOf(" ");return s>-1&&(r=vt(e.slice(s)),e=e.slice(0,s)),g(t)?(n=t,t=void 0):t&&"object"==typeof t&&(i="POST"),a.length>0&&w.ajax({url:e,type:i||"GET",dataType:"html",data:t}).done(function(e){o=arguments,a.html(r?w("<div>").append(w.parseHTML(e)).find(r):e)}).always(n&&function(e,t){a.each(function(){n.apply(this,o||[e.responseText,t,e])})}),this},w.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){w.fn[t]=function(e){return this.on(t,e)}}),w.expr.pseudos.animated=function(e){return w.grep(w.timers,function(t){return e===t.elem}).length},w.offset={setOffset:function(e,t,n){var r,i,o,a,s,u,l,c=w.css(e,"position"),f=w(e),p={};"static"===c&&(e.style.position="relative"),s=f.offset(),o=w.css(e,"top"),u=w.css(e,"left"),(l=("absolute"===c||"fixed"===c)&&(o+u).indexOf("auto")>-1)?(a=(r=f.position()).top,i=r.left):(a=parseFloat(o)||0,i=parseFloat(u)||0),g(t)&&(t=t.call(e,n,w.extend({},s))),null!=t.top&&(p.top=t.top-s.top+a),null!=t.left&&(p.left=t.left-s.left+i),"using"in t?t.using.call(e,p):f.css(p)}},w.fn.extend({offset:function(e){if(arguments.length)return void 0===e?this:this.each(function(t){w.offset.setOffset(this,e,t)});var t,n,r=this[0];if(r)return r.getClientRects().length?(t=r.getBoundingClientRect(),n=r.ownerDocument.defaultView,{top:t.top+n.pageYOffset,left:t.left+n.pageXOffset}):{top:0,left:0}},position:function(){if(this[0]){var e,t,n,r=this[0],i={top:0,left:0};if("fixed"===w.css(r,"position"))t=r.getBoundingClientRect();else{t=this.offset(),n=r.ownerDocument,e=r.offsetParent||n.documentElement;while(e&&(e===n.body||e===n.documentElement)&&"static"===w.css(e,"position"))e=e.parentNode;e&&e!==r&&1===e.nodeType&&((i=w(e).offset()).top+=w.css(e,"borderTopWidth",!0),i.left+=w.css(e,"borderLeftWidth",!0))}return{top:t.top-i.top-w.css(r,"marginTop",!0),left:t.left-i.left-w.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent;while(e&&"static"===w.css(e,"position"))e=e.offsetParent;return e||be})}}),w.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,t){var n="pageYOffset"===t;w.fn[e]=function(r){return z(this,function(e,r,i){var o;if(y(e)?o=e:9===e.nodeType&&(o=e.defaultView),void 0===i)return o?o[t]:e[r];o?o.scrollTo(n?o.pageXOffset:i,n?i:o.pageYOffset):e[r]=i},e,r,arguments.length)}}),w.each(["top","left"],function(e,t){w.cssHooks[t]=_e(h.pixelPosition,function(e,n){if(n)return n=Fe(e,t),We.test(n)?w(e).position()[t]+"px":n})}),w.each({Height:"height",Width:"width"},function(e,t){w.each({padding:"inner"+e,content:t,"":"outer"+e},function(n,r){w.fn[r]=function(i,o){var a=arguments.length&&(n||"boolean"!=typeof i),s=n||(!0===i||!0===o?"margin":"border");return z(this,function(t,n,i){var o;return y(t)?0===r.indexOf("outer")?t["inner"+e]:t.document.documentElement["client"+e]:9===t.nodeType?(o=t.documentElement,Math.max(t.body["scroll"+e],o["scroll"+e],t.body["offset"+e],o["offset"+e],o["client"+e])):void 0===i?w.css(t,n,s):w.style(t,n,i,s)},t,a?i:void 0,a)}})}),w.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(e,t){w.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),w.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),w.fn.extend({bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}}),w.proxy=function(e,t){var n,r,i;if("string"==typeof t&&(n=e[t],t=e,e=n),g(e))return r=o.call(arguments,2),i=function(){return e.apply(t||this,r.concat(o.call(arguments)))},i.guid=e.guid=e.guid||w.guid++,i},w.holdReady=function(e){e?w.readyWait++:w.ready(!0)},w.isArray=Array.isArray,w.parseJSON=JSON.parse,w.nodeName=N,w.isFunction=g,w.isWindow=y,w.camelCase=G,w.type=x,w.now=Date.now,w.isNumeric=function(e){var t=w.type(e);return("number"===t||"string"===t)&&!isNaN(e-parseFloat(e))},"function"==typeof define&&define.amd&&define("jquery",[],function(){return w});var Jt=e.jQuery,Kt=e.$;return w.noConflict=function(t){return e.$===w&&(e.$=Kt),t&&e.jQuery===w&&(e.jQuery=Jt),w},t||(e.jQuery=e.$=w),w});
		}
		
		if(plugin.include_htmllightbox==null || plugin.include_htmllightbox.toLowerCase()!="false")
		{
			!function(t,e,n,o){"use strict";function i(t,e){var o,i,a,s=[],r=0;t&&t.isDefaultPrevented()||(t.preventDefault(),e=e||{},t&&t.data&&(e=h(t.data.options,e)),o=e.$target||n(t.currentTarget).trigger("blur"),(a=n.htmllightbox.getInstance())&&a.$trigger&&a.$trigger.is(o)||(e.selector?s=n(e.selector):(i=o.attr("data-htmllightbox")||"",i?(s=t.data?t.data.items:[],s=s.length?s.filter('[data-htmllightbox="'+i+'"]'):n('[data-htmllightbox="'+i+'"]')):s=[o]),r=n(s).index(o),r<0&&(r=0),a=n.htmllightbox.open(s,e,r),a.$trigger=o))}if(t.console=t.console||{info:function(t){}},n){if(n.fn.htmllightbox)return void console.info("htmllightBox already initialized");var a={closeExisting:!1,loop:!1,gutter:50,keyboard:!0,preventCaptionOverlap:!0,arrows:!0,infobar:!0,smallBtn:"auto",toolbar:"auto",buttons:["zoom","slideShow","thumbs","close"],idleTime:3,protect:!1,modal:!1,image:{preload:!1},ajax:{settings:{data:{htmllightbox:!0}}},iframe:{tpl:'<iframe id="htmllightbox-frame{rnd}" name="htmllightbox-frame{rnd}" class="htmllightbox-iframe" allowfullscreen="allowfullscreen" allow="autoplay; fullscreen" src=""></iframe>',preload:!0,css:{},attr:{scrolling:"auto"}},video:{tpl:'<video class="htmllightbox-video" controls disablePictureInPicture controlsList="nodownload" poster="{{poster}}"><source src="{{src}}" type="{{format}}" />Sorry, your browser doesn\'t support embedded videos, <a href="{{src}}">download</a> and watch with your favorite video player!</video>',format:"",autoStart:!0},defaultType:"image",animationEffect:"zoom",animationDuration:366,zoomOpacity:"auto",transitionEffect:"fade",transitionDuration:366,slideClass:"",baseClass:"",baseTpl:'<div class="htmllightbox-container" role="dialog" tabindex="-1"><div class="htmllightbox-bg"></div><div class="htmllightbox-inner"><div class="htmllightbox-infobar"><span data-htmllightbox-index></span>&nbsp;/&nbsp;<span data-htmllightbox-count></span></div><div class="htmllightbox-toolbar">{{buttons}}</div><div class="htmllightbox-navigation">{{arrows}}</div><div class="htmllightbox-stage"></div><div class="htmllightbox-caption"><div class="htmllightbox-caption__body"></div></div></div></div>',spinnerTpl:'<div class="htmllightbox-loading"></div>',errorTpl:'<div class="htmllightbox-error"><p>{{ERROR}}</p></div>',btnTpl:{download:'<a download data-htmllightbox-download class="htmllightbox-button htmllightbox-button--download" title="{{DOWNLOAD}}" href="javascript:;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.62 17.09V19H5.38v-1.91zm-2.97-6.96L17 11.45l-5 4.87-5-4.87 1.36-1.32 2.68 2.64V5h1.92v7.77z"/></svg></a>',zoom:'<button data-htmllightbox-zoom class="htmllightbox-button htmllightbox-button--zoom" title="{{ZOOM}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.7 17.3l-3-3a5.9 5.9 0 0 0-.6-7.6 5.9 5.9 0 0 0-8.4 0 5.9 5.9 0 0 0 0 8.4 5.9 5.9 0 0 0 7.7.7l3 3a1 1 0 0 0 1.3 0c.4-.5.4-1 0-1.5zM8.1 13.8a4 4 0 0 1 0-5.7 4 4 0 0 1 5.7 0 4 4 0 0 1 0 5.7 4 4 0 0 1-5.7 0z"/></svg></button>',close:'<button data-htmllightbox-close class="htmllightbox-button htmllightbox-button--close" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 10.6L6.6 5.2 5.2 6.6l5.4 5.4-5.4 5.4 1.4 1.4 5.4-5.4 5.4 5.4 1.4-1.4-5.4-5.4 5.4-5.4-1.4-1.4-5.4 5.4z"/></svg></button>',arrowLeft:'<button data-htmllightbox-prev class="htmllightbox-button htmllightbox-button--arrow_left" title="{{PREV}}"><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.28 15.7l-1.34 1.37L5 12l4.94-5.07 1.34 1.38-2.68 2.72H19v1.94H8.6z"/></svg></div></button>',arrowRight:'<button data-htmllightbox-next class="htmllightbox-button htmllightbox-button--arrow_right" title="{{NEXT}}"><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.4 12.97l-2.68 2.72 1.34 1.38L19 12l-4.94-5.07-1.34 1.38 2.68 2.72H5v1.94z"/></svg></div></button>',smallBtn:'<button type="button" data-htmllightbox-close class="htmllightbox-button htmllightbox-close-small" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 24 24"><path d="M13 12l5-5-1-1-5 5-5-5-1 1 5 5-5 5 1 1 5-5 5 5 1-1z"/></svg></button>'},parentEl :"body",hideScrollbar:!0,autoFocus:!0,backFocus:!0,trapFocus:!0,fullScreen:{autoStart:!1},touch:{vertical:!0,momentum:!0},hash:null,media:{},slideShow:{autoStart:!1,speed:3e3},thumbs:{autoStart:!1,hideOnClose:!0,parentEl :".htmllightbox-container",axis:"y"},wheel:"auto",onInit:n.noop,beforeLoad:n.noop,afterLoad:n.noop,beforeShow:n.noop,afterShow:n.noop,beforeClose:n.noop,afterClose:n.noop,onActivate:n.noop,onDeactivate:n.noop,clickContent:function(t,e){return"image"===t.type&&"zoom"},clickSlide:"close",clickOutside:"close",dblclickContent:!1,dblclickSlide:!1,dblclickOutside:!1,mobile:{preventCaptionOverlap:!1,idleTime:!1,clickContent:function(t,e){return"image"===t.type&&"toggleControls"},clickSlide:function(t,e){return"image"===t.type?"toggleControls":"close"},dblclickContent:function(t,e){return"image"===t.type&&"zoom"},dblclickSlide:function(t,e){return"image"===t.type&&"zoom"}},lang:"en",i18n:{en:{CLOSE:"关闭",NEXT:"下一个",PREV:"上一个",ERROR:"您请求的内容错误！ <br/> 请稍后再试.",PLAY_START:"开始",PLAY_STOP:"暂停",FULL_SCREEN:"全屏",THUMBS:"Thumbnails缩略图",DOWNLOAD:"下载",SHARE:"分享",ZOOM:"放大"},de:{CLOSE:"Schlie&szlig;en",NEXT:"Weiter",PREV:"Zur&uuml;ck",ERROR:"Die angeforderten Daten konnten nicht geladen werden. <br/> Bitte versuchen Sie es sp&auml;ter nochmal.",PLAY_START:"Diaschau starten",PLAY_STOP:"Diaschau beenden",FULL_SCREEN:"Vollbild",THUMBS:"Vorschaubilder",DOWNLOAD:"Herunterladen",SHARE:"Teilen",ZOOM:"Vergr&ouml;&szlig;ern"}}},s=n(t),r=n(e),c=0,l=function(t){return t&&t.hasOwnProperty&&t instanceof n},d=function(){return t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.oRequestAnimationFrame||function(e){return t.setTimeout(e,1e3/60)}}(),u=function(){return t.cancelAnimationFrame||t.webkitCancelAnimationFrame||t.mozCancelAnimationFrame||t.oCancelAnimationFrame||function(e){t.clearTimeout(e)}}(),f=function(){var t,n=e.createElement("fakeelement"),o={transition:"transitionend",OTransition:"oTransitionEnd",MozTransition:"transitionend",WebkitTransition:"webkitTransitionEnd"};for(t in o)if(void 0!==n.style[t])return o[t];return"transitionend"}(),p=function(t){return t&&t.length&&t[0].offsetHeight},h=function(t,e){var o=n.extend(!0,{},t,e);return n.each(e,function(t,e){n.isArray(e)&&(o[t]=e)}),o},g=function(t){var o,i;return!(!t||t.ownerDocument!==e)&&(n(".htmllightbox-container").css("pointer-events","none"),o={x:t.getBoundingClientRect().left+t.offsetWidth/2,y:t.getBoundingClientRect().top+t.offsetHeight/2},i=e.elementFromPoint(o.x,o.y)===t,n(".htmllightbox-container").css("pointer-events",""),i)},b=function(t,e,o){var i=this;i.opts=h({index:o},n.htmllightbox.defaults),n.isPlainObject(e)&&(i.opts=h(i.opts,e)),n.htmllightbox.isMobile&&(i.opts=h(i.opts,i.opts.mobile)),i.id=i.opts.id||++c,i.currIndex=parseInt(i.opts.index,10)||0,i.prevIndex=null,i.prevPos=null,i.currPos=0,i.firstRun=!0,i.group=[],i.slides={},i.addContent(t),i.group.length&&i.init()};n.extend(b.prototype,{init:function(){var o,i,a=this,s=a.group[a.currIndex],r=s.opts;r.closeExisting&&n.htmllightbox.close(!0),n("body").addClass("htmllightbox-active"),!n.htmllightbox.getInstance()&&!1!==r.hideScrollbar&&!n.htmllightbox.isMobile&&e.body.scrollHeight>t.innerHeight&&(n("head").append('<style id="htmllightbox-style-noscroll" type="text/css">.compensate-for-scrollbar{margin-right:'+(t.innerWidth-e.documentElement.clientWidth)+"px;}</style>"),n("body").addClass("compensate-for-scrollbar")),i="",n.each(r.buttons,function(t,e){i+=r.btnTpl[e]||""}),o=n(a.translate(a,r.baseTpl.replace("{{buttons}}",i).replace("{{arrows}}",r.btnTpl.arrowLeft+r.btnTpl.arrowRight))).attr("id","htmllightbox-container-"+a.id).addClass(r.baseClass).data("HtmllightBox",a).appendTo(r.parentEl),a.$refs={container:o},["bg","inner","infobar","toolbar","stage","caption","navigation"].forEach(function(t){a.$refs[t]=o.find(".htmllightbox-"+t)}),a.trigger("onInit"),a.activate(),a.jumpTo(a.currIndex)},translate:function(t,e){var n=t.opts.i18n[t.opts.lang]||t.opts.i18n.en;return e.replace(/\{\{(\w+)\}\}/g,function(t,e){return void 0===n[e]?t:n[e]})},addContent:function(t){var e,o=this,i=n.makeArray(t);n.each(i,function(t,e){var i,a,s,r,c,l={},d={};n.isPlainObject(e)?(l=e,d=e.opts||e):"object"===n.type(e)&&n(e).length?(i=n(e),d=i.data()||{},d=n.extend(!0,{},d,d.options),d.$orig=i,l.src=o.opts.src||d.src||i.attr("href"),l.type||l.src||(l.type="inline",l.src=e)):l={type:"html",src:e+""},l.opts=n.extend(!0,{},o.opts,d),n.isArray(d.buttons)&&(l.opts.buttons=d.buttons),n.htmllightbox.isMobile&&l.opts.mobile&&(l.opts=h(l.opts,l.opts.mobile)),a=l.type||l.opts.type,r=l.src||"",!a&&r&&((s=r.match(/\.(mp4|mov|ogv|webm)((\?|#).*)?$/i))?(a="video",l.opts.video.format||(l.opts.video.format="video/"+("ogv"===s[1]?"ogg":s[1]))):r.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i)?a="image":r.match(/\.(pdf)((\?|#).*)?$/i)?(a="iframe",l=n.extend(!0,l,{contentType:"pdf",opts:{iframe:{preload:!1}}})):"#"===r.charAt(0)&&(a="inline")),a?l.type=a:o.trigger("objectNeedsType",l),l.contentType||(l.contentType=n.inArray(l.type,["html","inline","ajax"])>-1?"html":l.type),l.index=o.group.length,"auto"==l.opts.smallBtn&&(l.opts.smallBtn=n.inArray(l.type,["html","inline","ajax"])>-1),"auto"===l.opts.toolbar&&(l.opts.toolbar=!l.opts.smallBtn),l.$thumb=l.opts.$thumb||null,l.opts.$trigger&&l.index===o.opts.index&&(l.$thumb=l.opts.$trigger.find("img:first"),l.$thumb.length&&(l.opts.$orig=l.opts.$trigger)),l.$thumb&&l.$thumb.length||!l.opts.$orig||(l.$thumb=l.opts.$orig.find("img:first")),l.$thumb&&!l.$thumb.length&&(l.$thumb=null),l.thumb=l.opts.thumb||(l.$thumb?l.$thumb[0].src:null),"function"===n.type(l.opts.caption)&&(l.opts.caption=l.opts.caption.apply(e,[o,l])),"function"===n.type(o.opts.caption)&&(l.opts.caption=o.opts.caption.apply(e,[o,l])),l.opts.caption instanceof n||(l.opts.caption=void 0===l.opts.caption?"":l.opts.caption+""),"ajax"===l.type&&(c=r.split(/\s+/,2),c.length>1&&(l.src=c.shift(),l.opts.filter=c.shift())),l.opts.modal&&(l.opts=n.extend(!0,l.opts,{trapFocus:!0,infobar:0,toolbar:0,smallBtn:0,keyboard:0,slideShow:0,fullScreen:0,thumbs:0,touch:0,clickContent:!1,clickSlide:!1,clickOutside:!1,dblclickContent:!1,dblclickSlide:!1,dblclickOutside:!1})),o.group.push(l)}),Object.keys(o.slides).length&&(o.updateControls(),(e=o.Thumbs)&&e.isActive&&(e.create(),e.focus()))},addEvents:function(){var e=this;e.removeEvents(),e.$refs.container.on("click.fb-close","[data-htmllightbox-close]",function(t){t.stopPropagation(),t.preventDefault(),e.close(t)}).on("touchstart.fb-prev click.fb-prev","[data-htmllightbox-prev]",function(t){t.stopPropagation(),t.preventDefault(),e.previous()}).on("touchstart.fb-next click.fb-next","[data-htmllightbox-next]",function(t){t.stopPropagation(),t.preventDefault(),e.next()}).on("click.fb","[data-htmllightbox-zoom]",function(t){e[e.isScaledDown()?"scaleToActual":"scaleToFit"]()}),s.on("orientationchange.fb resize.fb",function(t){t&&t.originalEvent&&"resize"===t.originalEvent.type?(e.requestId&&u(e.requestId),e.requestId=d(function(){e.update(t)})):(e.current&&"iframe"===e.current.type&&e.$refs.stage.hide(),setTimeout(function(){e.$refs.stage.show(),e.update(t)},n.htmllightbox.isMobile?600:250))}),r.on("keydown.fb",function(t){var o=n.htmllightbox?n.htmllightbox.getInstance():null,i=o.current,a=t.keyCode||t.which;if(9==a)return void(i.opts.trapFocus&&e.focus(t));if(!(!i.opts.keyboard||t.ctrlKey||t.altKey||t.shiftKey||n(t.target).is("input,textarea,video,audio,select")))return 8===a||27===a?(t.preventDefault(),void e.close(t)):37===a||38===a?(t.preventDefault(),void e.previous()):39===a||40===a?(t.preventDefault(),void e.next()):void e.trigger("afterKeydown",t,a)}),e.group[e.currIndex].opts.idleTime&&(e.idleSecondsCounter=0,r.on("mousemove.fb-idle mouseleave.fb-idle mousedown.fb-idle touchstart.fb-idle touchmove.fb-idle scroll.fb-idle keydown.fb-idle",function(t){e.idleSecondsCounter=0,e.isIdle&&e.showControls(),e.isIdle=!1}),e.idleInterval=t.setInterval(function(){++e.idleSecondsCounter>=e.group[e.currIndex].opts.idleTime&&!e.isDragging&&(e.isIdle=!0,e.idleSecondsCounter=0,e.hideControls())},1e3))},removeEvents:function(){var e=this;s.off("orientationchange.fb resize.fb"),r.off("keydown.fb .fb-idle"),this.$refs.container.off(".fb-close .fb-prev .fb-next"),e.idleInterval&&(t.clearInterval(e.idleInterval),e.idleInterval=null)},previous:function(t){return this.jumpTo(this.currPos-1,t)},next:function(t){return this.jumpTo(this.currPos+1,t)},jumpTo:function(t,e){var o,i,a,s,r,c,l,d,u,f=this,h=f.group.length;if(!(f.isDragging||f.isClosing||f.isAnimating&&f.firstRun)){if(t=parseInt(t,10),!(a=f.current?f.current.opts.loop:f.opts.loop)&&(t<0||t>=h))return!1;if(o=f.firstRun=!Object.keys(f.slides).length,r=f.current,f.prevIndex=f.currIndex,f.prevPos=f.currPos,s=f.createSlide(t),h>1&&((a||s.index<h-1)&&f.createSlide(t+1),(a||s.index>0)&&f.createSlide(t-1)),f.current=s,f.currIndex=s.index,f.currPos=s.pos,f.trigger("beforeShow",o),f.updateControls(),s.forcedDuration=void 0,n.isNumeric(e)?s.forcedDuration=e:e=s.opts[o?"animationDuration":"transitionDuration"],e=parseInt(e,10),i=f.isMoved(s),s.$slide.addClass("htmllightbox-slide--current"),o)return s.opts.animationEffect&&e&&f.$refs.container.css("transition-duration",e+"ms"),f.$refs.container.addClass("htmllightbox-is-open").trigger("focus"),f.loadSlide(s),void f.preload("image");c=n.htmllightbox.getTranslate(r.$slide),l=n.htmllightbox.getTranslate(f.$refs.stage),n.each(f.slides,function(t,e){n.htmllightbox.stop(e.$slide,!0)}),r.pos!==s.pos&&(r.isComplete=!1),r.$slide.removeClass("htmllightbox-slide--complete htmllightbox-slide--current"),i?(u=c.left-(r.pos*c.width+r.pos*r.opts.gutter),n.each(f.slides,function(t,o){o.$slide.removeClass("htmllightbox-animated").removeClass(function(t,e){return(e.match(/(^|\s)htmllightbox-fx-\S+/g)||[]).join(" ")});var i=o.pos*c.width+o.pos*o.opts.gutter;n.htmllightbox.setTranslate(o.$slide,{top:0,left:i-l.left+u}),o.pos!==s.pos&&o.$slide.addClass("htmllightbox-slide--"+(o.pos>s.pos?"next":"previous")),p(o.$slide),n.htmllightbox.animate(o.$slide,{top:0,left:(o.pos-s.pos)*c.width+(o.pos-s.pos)*o.opts.gutter},e,function(){o.$slide.css({transform:"",opacity:""}).removeClass("htmllightbox-slide--next htmllightbox-slide--previous"),o.pos===f.currPos&&f.complete()})})):e&&s.opts.transitionEffect&&(d="htmllightbox-animated htmllightbox-fx-"+s.opts.transitionEffect,r.$slide.addClass("htmllightbox-slide--"+(r.pos>s.pos?"next":"previous")),n.htmllightbox.animate(r.$slide,d,e,function(){r.$slide.removeClass(d).removeClass("htmllightbox-slide--next htmllightbox-slide--previous")},!1)),s.isLoaded?f.revealContent(s):f.loadSlide(s),f.preload("image")}},createSlide:function(t){var e,o,i=this;return o=t%i.group.length,o=o<0?i.group.length+o:o,!i.slides[t]&&i.group[o]&&(e=n('<div class="htmllightbox-slide"></div>').appendTo(i.$refs.stage),i.slides[t]=n.extend(!0,{},i.group[o],{pos:t,$slide:e,isLoaded:!1}),i.updateSlide(i.slides[t])),i.slides[t]},scaleToActual:function(t,e,o){var i,a,s,r,c,l=this,d=l.current,u=d.$content,f=n.htmllightbox.getTranslate(d.$slide).width,p=n.htmllightbox.getTranslate(d.$slide).height,h=d.width,g=d.height;l.isAnimating||l.isMoved()||!u||"image"!=d.type||!d.isLoaded||d.hasError||(l.isAnimating=!0,n.htmllightbox.stop(u),t=void 0===t?.5*f:t,e=void 0===e?.5*p:e,i=n.htmllightbox.getTranslate(u),i.top-=n.htmllightbox.getTranslate(d.$slide).top,i.left-=n.htmllightbox.getTranslate(d.$slide).left,r=h/i.width,c=g/i.height,a=.5*f-.5*h,s=.5*p-.5*g,h>f&&(a=i.left*r-(t*r-t),a>0&&(a=0),a<f-h&&(a=f-h)),g>p&&(s=i.top*c-(e*c-e),s>0&&(s=0),s<p-g&&(s=p-g)),l.updateCursor(h,g),n.htmllightbox.animate(u,{top:s,left:a,scaleX:r,scaleY:c},o||366,function(){l.isAnimating=!1}),l.SlideShow&&l.SlideShow.isActive&&l.SlideShow.stop())},scaleToFit:function(t){var e,o=this,i=o.current,a=i.$content;o.isAnimating||o.isMoved()||!a||"image"!=i.type||!i.isLoaded||i.hasError||(o.isAnimating=!0,n.htmllightbox.stop(a),e=o.getFitPos(i),o.updateCursor(e.width,e.height),n.htmllightbox.animate(a,{top:e.top,left:e.left,scaleX:e.width/a.width(),scaleY:e.height/a.height()},t||366,function(){o.isAnimating=!1}))},getFitPos:function(t){var e,o,i,a,s=this,r=t.$content,c=t.$slide,l=t.width||t.opts.width,d=t.height||t.opts.height,u={};return!!(t.isLoaded&&r&&r.length)&&(e=n.htmllightbox.getTranslate(s.$refs.stage).width,o=n.htmllightbox.getTranslate(s.$refs.stage).height,e-=parseFloat(c.css("paddingLeft"))+parseFloat(c.css("paddingRight"))+parseFloat(r.css("marginLeft"))+parseFloat(r.css("marginRight")),o-=parseFloat(c.css("paddingTop"))+parseFloat(c.css("paddingBottom"))+parseFloat(r.css("marginTop"))+parseFloat(r.css("marginBottom")),l&&d||(l=e,d=o),i=Math.min(1,e/l,o/d),l*=i,d*=i,l>e-.5&&(l=e),d>o-.5&&(d=o),"image"===t.type?(u.top=Math.floor(.5*(o-d))+parseFloat(c.css("paddingTop")),u.left=Math.floor(.5*(e-l))+parseFloat(c.css("paddingLeft"))):"video"===t.contentType&&(a=t.opts.width&&t.opts.height?l/d:t.opts.ratio||16/9,d>l/a?d=l/a:l>d*a&&(l=d*a)),u.width=l,u.height=d,u)},update:function(t){var e=this;n.each(e.slides,function(n,o){e.updateSlide(o,t)})},updateSlide:function(t,e){var o=this,i=t&&t.$content,a=t.width||t.opts.width,s=t.height||t.opts.height,r=t.$slide;o.adjustCaption(t),i&&(a||s||"video"===t.contentType)&&!t.hasError&&(n.htmllightbox.stop(i),n.htmllightbox.setTranslate(i,o.getFitPos(t)),t.pos===o.currPos&&(o.isAnimating=!1,o.updateCursor())),o.adjustLayout(t),r.length&&(r.trigger("refresh"),t.pos===o.currPos&&o.$refs.toolbar.add(o.$refs.navigation.find(".htmllightbox-button--arrow_right")).toggleClass("compensate-for-scrollbar",r.get(0).scrollHeight>r.get(0).clientHeight)),o.trigger("onUpdate",t,e)},centerSlide:function(t){var e=this,o=e.current,i=o.$slide;!e.isClosing&&o&&(i.siblings().css({transform:"",opacity:""}),i.parent().children().removeClass("htmllightbox-slide--previous htmllightbox-slide--next"),n.htmllightbox.animate(i,{top:0,left:0,opacity:1},void 0===t?0:t,function(){i.css({transform:"",opacity:""}),o.isComplete||e.complete()},!1))},isMoved:function(t){var e,o,i=t||this.current;return!!i&&(o=n.htmllightbox.getTranslate(this.$refs.stage),e=n.htmllightbox.getTranslate(i.$slide),!i.$slide.hasClass("htmllightbox-animated")&&(Math.abs(e.top-o.top)>.5||Math.abs(e.left-o.left)>.5))},updateCursor:function(t,e){var o,i,a=this,s=a.current,r=a.$refs.container;s&&!a.isClosing&&a.Guestures&&(r.removeClass("htmllightbox-is-zoomable htmllightbox-can-zoomIn htmllightbox-can-zoomOut htmllightbox-can-swipe htmllightbox-can-pan"),o=a.canPan(t,e),i=!!o||a.isZoomable(),r.toggleClass("htmllightbox-is-zoomable",i),n("[data-htmllightbox-zoom]").prop("disabled",!i),o?r.addClass("htmllightbox-can-pan"):i&&("zoom"===s.opts.clickContent||n.isFunction(s.opts.clickContent)&&"zoom"==s.opts.clickContent(s))?r.addClass("htmllightbox-can-zoomIn"):s.opts.touch&&(s.opts.touch.vertical||a.group.length>1)&&"video"!==s.contentType&&r.addClass("htmllightbox-can-swipe"))},isZoomable:function(){var t,e=this,n=e.current;if(n&&!e.isClosing&&"image"===n.type&&!n.hasError){if(!n.isLoaded)return!0;if((t=e.getFitPos(n))&&(n.width>t.width||n.height>t.height))return!0}return!1},isScaledDown:function(t,e){var o=this,i=!1,a=o.current,s=a.$content;return void 0!==t&&void 0!==e?i=t<a.width&&e<a.height:s&&(i=n.htmllightbox.getTranslate(s),i=i.width<a.width&&i.height<a.height),i},canPan:function(t,e){var o=this,i=o.current,a=null,s=!1;return"image"===i.type&&(i.isComplete||t&&e)&&!i.hasError&&(s=o.getFitPos(i),void 0!==t&&void 0!==e?a={width:t,height:e}:i.isComplete&&(a=n.htmllightbox.getTranslate(i.$content)),a&&s&&(s=Math.abs(a.width-s.width)>1.5||Math.abs(a.height-s.height)>1.5)),s},loadSlide:function(t){var e,o,i,a=this;if(!t.isLoading&&!t.isLoaded){if(t.isLoading=!0,!1===a.trigger("beforeLoad",t))return t.isLoading=!1,!1;switch(e=t.type,o=t.$slide,o.off("refresh").trigger("onReset").addClass(t.opts.slideClass),e){case"image":a.setImage(t);break;case"iframe":a.setIframe(t);break;case"html":a.setContent(t,t.src||t.content);break;case"video":a.setContent(t,t.opts.video.tpl.replace(/\{\{src\}\}/gi,t.src).replace("{{format}}",t.opts.videoFormat||t.opts.video.format||"").replace("{{poster}}",t.thumb||""));break;case"inline":n(t.src).length?a.setContent(t,n(t.src)):a.setError(t);break;case"ajax":a.showLoading(t),i=n.ajax(n.extend({},t.opts.ajax.settings,{url:t.src,success:function(e,n){"success"===n&&a.setContent(t,e)},error:function(e,n){e&&"abort"!==n&&a.setError(t)}})),o.one("onReset",function(){i.abort()});break;default:a.setError(t)}return!0}},setImage:function(t){var o,i=this;setTimeout(function(){var e=t.$image;i.isClosing||!t.isLoading||e&&e.length&&e[0].complete||t.hasError||i.showLoading(t)},50),i.checkSrcset(t),t.$content=n('<div class="htmllightbox-content"></div>').addClass("htmllightbox-is-hidden").appendTo(t.$slide.addClass("htmllightbox-slide--image")),!1!==t.opts.preload&&t.opts.width&&t.opts.height&&t.thumb&&(t.width=t.opts.width,t.height=t.opts.height,o=e.createElement("img"),o.onerror=function(){n(this).remove(),t.$ghost=null},o.onload=function(){i.afterLoad(t)},t.$ghost=n(o).addClass("htmllightbox-image").appendTo(t.$content).attr("src",t.thumb)),i.setBigImage(t)},checkSrcset:function(e){var n,o,i,a,s=e.opts.srcset||e.opts.image.srcset;if(s){i=t.devicePixelRatio||1,a=t.innerWidth*i,o=s.split(",").map(function(t){var e={};return t.trim().split(/\s+/).forEach(function(t,n){var o=parseInt(t.substring(0,t.length-1),10);if(0===n)return e.url=t;o&&(e.value=o,e.postfix=t[t.length-1])}),e}),o.sort(function(t,e){return t.value-e.value});for(var r=0;r<o.length;r++){var c=o[r];if("w"===c.postfix&&c.value>=a||"x"===c.postfix&&c.value>=i){n=c;break}}!n&&o.length&&(n=o[o.length-1]),n&&(e.src=n.url,e.width&&e.height&&"w"==n.postfix&&(e.height=e.width/e.height*n.value,e.width=n.value),e.opts.srcset=s)}},setBigImage:function(t){var o=this,i=e.createElement("img"),a=n(i);t.$image=a.one("error",function(){o.setError(t)}).one("load",function(){var e;t.$ghost||(o.resolveImageSlideSize(t,this.naturalWidth,this.naturalHeight),o.afterLoad(t)),o.isClosing||(t.opts.srcset&&(e=t.opts.sizes,e&&"auto"!==e||(e=(t.width/t.height>1&&s.width()/s.height()>1?"100":Math.round(t.width/t.height*100))+"vw"),a.attr("sizes",e).attr("srcset",t.opts.srcset)),t.$ghost&&setTimeout(function(){t.$ghost&&!o.isClosing&&t.$ghost.hide()},Math.min(300,Math.max(1e3,t.height/1600))),o.hideLoading(t))}).addClass("htmllightbox-image").attr("src",t.src).appendTo(t.$content),(i.complete||"complete"==i.readyState)&&a.naturalWidth&&a.naturalHeight?a.trigger("load"):i.error&&a.trigger("error")},resolveImageSlideSize:function(t,e,n){var o=parseInt(t.opts.width,10),i=parseInt(t.opts.height,10);t.width=e,t.height=n,o>0&&(t.width=o,t.height=Math.floor(o*n/e)),i>0&&(t.width=Math.floor(i*e/n),t.height=i)},setIframe:function(t){var e,o=this,i=t.opts.iframe,a=t.$slide;t.$content=n('<div class="htmllightbox-content'+(i.preload?" htmllightbox-is-hidden":"")+'"></div>').css(i.css).appendTo(a),a.addClass("htmllightbox-slide--"+t.contentType),t.$iframe=e=n(i.tpl.replace(/\{rnd\}/g,(new Date).getTime())).attr(i.attr).appendTo(t.$content),i.preload?(o.showLoading(t),e.on("load.fb error.fb",function(e){this.isReady=1,t.$slide.trigger("refresh"),o.afterLoad(t)}),a.on("refresh.fb",function(){var n,o,s=t.$content,r=i.css.width,c=i.css.height;if(1===e[0].isReady){try{n=e.contents(),o=n.find("body")}catch(t){}o&&o.length&&o.children().length&&(a.css("overflow","visible"),s.css({width:"100%","max-width":"100%",height:"9999px"}),void 0===r&&(r=Math.ceil(Math.max(o[0].clientWidth,o.outerWidth(!0)))),s.css("width",r||"").css("max-width",""),void 0===c&&(c=Math.ceil(Math.max(o[0].clientHeight,o.outerHeight(!0)))),s.css("height",c||""),a.css("overflow","auto")),s.removeClass("htmllightbox-is-hidden")}})):o.afterLoad(t),e.attr("src",t.src),a.one("onReset",function(){try{n(this).find("iframe").hide().unbind().attr("src","//about:blank")}catch(t){}n(this).off("refresh.fb").empty(),t.isLoaded=!1,t.isRevealed=!1})},setContent:function(t,e){var o=this;o.isClosing||(o.hideLoading(t),t.$content&&n.htmllightbox.stop(t.$content),t.$slide.empty(),l(e)&&e.parent().length?((e.hasClass("htmllightbox-content")||e.parent().hasClass("htmllightbox-content"))&&e.parents(".htmllightbox-slide").trigger("onReset"),t.$placeholder=n("<div>").hide().insertAfter(e),e.css("display","inline-block")):t.hasError||("string"===n.type(e)&&(e=n("<div>").append(n.trim(e)).contents()),t.opts.filter&&(e=n("<div>").html(e).find(t.opts.filter))),t.$slide.one("onReset",function(){n(this).find("video,audio").trigger("pause"),t.$placeholder&&(t.$placeholder.after(e.removeClass("htmllightbox-content").hide()).remove(),t.$placeholder=null),t.$smallBtn&&(t.$smallBtn.remove(),t.$smallBtn=null),t.hasError||(n(this).empty(),t.isLoaded=!1,t.isRevealed=!1)}),n(e).appendTo(t.$slide),n(e).is("video,audio")&&(n(e).addClass("htmllightbox-video"),n(e).wrap("<div></div>"),t.contentType="video",t.opts.width=t.opts.width||n(e).attr("width"),t.opts.height=t.opts.height||n(e).attr("height")),t.$content=t.$slide.children().filter("div,form,main,video,audio,article,.htmllightbox-content").first(),t.$content.siblings().hide(),t.$content.length||(t.$content=t.$slide.wrapInner("<div></div>").children().first()),t.$content.addClass("htmllightbox-content"),t.$slide.addClass("htmllightbox-slide--"+t.contentType),o.afterLoad(t))},setError:function(t){t.hasError=!0,t.$slide.trigger("onReset").removeClass("htmllightbox-slide--"+t.contentType).addClass("htmllightbox-slide--error"),t.contentType="html",this.setContent(t,this.translate(t,t.opts.errorTpl)),t.pos===this.currPos&&(this.isAnimating=!1)},showLoading:function(t){var e=this;(t=t||e.current)&&!t.$spinner&&(t.$spinner=n(e.translate(e,e.opts.spinnerTpl)).appendTo(t.$slide).hide().fadeIn("fast"))},hideLoading:function(t){var e=this;(t=t||e.current)&&t.$spinner&&(t.$spinner.stop().remove(),delete t.$spinner)},afterLoad:function(t){var e=this;e.isClosing||(t.isLoading=!1,t.isLoaded=!0,e.trigger("afterLoad",t),e.hideLoading(t),!t.opts.smallBtn||t.$smallBtn&&t.$smallBtn.length||(t.$smallBtn=n(e.translate(t,t.opts.btnTpl.smallBtn)).appendTo(t.$content)),t.opts.protect&&t.$content&&!t.hasError&&(t.$content.on("contextmenu.fb",function(t){return 2==t.button&&t.preventDefault(),!0}),"image"===t.type&&n('<div class="htmllightbox-spaceball"></div>').appendTo(t.$content)),e.adjustCaption(t),e.adjustLayout(t),t.pos===e.currPos&&e.updateCursor(),e.revealContent(t))},adjustCaption:function(t){var e,n=this,o=t||n.current,i=o.opts.caption,a=o.opts.preventCaptionOverlap,s=n.$refs.caption,r=!1;s.toggleClass("htmllightbox-caption--separate",a),a&&i&&i.length&&(o.pos!==n.currPos?(e=s.clone().appendTo(s.parent()),e.children().eq(0).empty().html(i),r=e.outerHeight(!0),e.empty().remove()):n.$caption&&(r=n.$caption.outerHeight(!0)),o.$slide.css("padding-bottom",r||""))},adjustLayout:function(t){var e,n,o,i,a=this,s=t||a.current;s.isLoaded&&!0!==s.opts.disableLayoutFix&&(s.$content.css("margin-bottom",""),s.$content.outerHeight()>s.$slide.height()+.5&&(o=s.$slide[0].style["padding-bottom"],i=s.$slide.css("padding-bottom"),parseFloat(i)>0&&(e=s.$slide[0].scrollHeight,s.$slide.css("padding-bottom",0),Math.abs(e-s.$slide[0].scrollHeight)<1&&(n=i),s.$slide.css("padding-bottom",o))),s.$content.css("margin-bottom",n))},revealContent:function(t){var e,o,i,a,s=this,r=t.$slide,c=!1,l=!1,d=s.isMoved(t),u=t.isRevealed;return t.isRevealed=!0,e=t.opts[s.firstRun?"animationEffect":"transitionEffect"],i=t.opts[s.firstRun?"animationDuration":"transitionDuration"],i=parseInt(void 0===t.forcedDuration?i:t.forcedDuration,10),!d&&t.pos===s.currPos&&i||(e=!1),"zoom"===e&&(t.pos===s.currPos&&i&&"image"===t.type&&!t.hasError&&(l=s.getThumbPos(t))?c=s.getFitPos(t):e="fade"),"zoom"===e?(s.isAnimating=!0,c.scaleX=c.width/l.width,c.scaleY=c.height/l.height,a=t.opts.zoomOpacity,"auto"==a&&(a=Math.abs(t.width/t.height-l.width/l.height)>.1),a&&(l.opacity=.1,c.opacity=1),n.htmllightbox.setTranslate(t.$content.removeClass("htmllightbox-is-hidden"),l),p(t.$content),void n.htmllightbox.animate(t.$content,c,i,function(){s.isAnimating=!1,s.complete()})):(s.updateSlide(t),e?(n.htmllightbox.stop(r),o="htmllightbox-slide--"+(t.pos>=s.prevPos?"next":"previous")+" htmllightbox-animated htmllightbox-fx-"+e,r.addClass(o).removeClass("htmllightbox-slide--current"),t.$content.removeClass("htmllightbox-is-hidden"),p(r),"image"!==t.type&&t.$content.hide().show(0),void n.htmllightbox.animate(r,"htmllightbox-slide--current",i,function(){r.removeClass(o).css({transform:"",opacity:""}),t.pos===s.currPos&&s.complete()},!0)):(t.$content.removeClass("htmllightbox-is-hidden"),u||!d||"image"!==t.type||t.hasError||t.$content.hide().fadeIn("fast"),void(t.pos===s.currPos&&s.complete())))},getThumbPos:function(t){var e,o,i,a,s,r=!1,c=t.$thumb;return!(!c||!g(c[0]))&&(e=n.htmllightbox.getTranslate(c),o=parseFloat(c.css("border-top-width")||0),i=parseFloat(c.css("border-right-width")||0),a=parseFloat(c.css("border-bottom-width")||0),s=parseFloat(c.css("border-left-width")||0),r={top:e.top+o,left:e.left+s,width:e.width-i-s,height:e.height-o-a,scaleX:1,scaleY:1},e.width>0&&e.height>0&&r)},complete:function(){var t,e=this,o=e.current,i={};!e.isMoved()&&o.isLoaded&&(o.isComplete||(o.isComplete=!0,o.$slide.siblings().trigger("onReset"),e.preload("inline"),p(o.$slide),o.$slide.addClass("htmllightbox-slide--complete"),n.each(e.slides,function(t,o){o.pos>=e.currPos-1&&o.pos<=e.currPos+1?i[o.pos]=o:o&&(n.htmllightbox.stop(o.$slide),o.$slide.off().remove())}),e.slides=i),e.isAnimating=!1,e.updateCursor(),e.trigger("afterShow"),o.opts.video.autoStart&&o.$slide.find("video,audio").filter(":visible:first").trigger("play").one("ended",function(){Document.exitFullscreen?Document.exitFullscreen():this.webkitExitFullscreen&&this.webkitExitFullscreen(),e.next()}),o.opts.autoFocus&&"html"===o.contentType&&(t=o.$content.find("input[autofocus]:enabled:visible:first"),t.length?t.trigger("focus"):e.focus(null,!0)),o.$slide.scrollTop(0).scrollLeft(0))},preload:function(t){var e,n,o=this;o.group.length<2||(n=o.slides[o.currPos+1],e=o.slides[o.currPos-1],e&&e.type===t&&o.loadSlide(e),n&&n.type===t&&o.loadSlide(n))},focus:function(t,o){var i,a,s=this,r=["a[href]","area[href]",'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',"select:not([disabled]):not([aria-hidden])","textarea:not([disabled]):not([aria-hidden])","button:not([disabled]):not([aria-hidden])","iframe","object","embed","video","audio","[contenteditable]",'[tabindex]:not([tabindex^="-"])'].join(",");s.isClosing||(i=!t&&s.current&&s.current.isComplete?s.current.$slide.find("*:visible"+(o?":not(.htmllightbox-close-small)":"")):s.$refs.container.find("*:visible"),i=i.filter(r).filter(function(){return"hidden"!==n(this).css("visibility")&&!n(this).hasClass("disabled")}),i.length?(a=i.index(e.activeElement),t&&t.shiftKey?(a<0||0==a)&&(t.preventDefault(),i.eq(i.length-1).trigger("focus")):(a<0||a==i.length-1)&&(t&&t.preventDefault(),i.eq(0).trigger("focus"))):s.$refs.container.trigger("focus"))},activate:function(){var t=this;n(".htmllightbox-container").each(function(){var e=n(this).data("HtmllightBox");e&&e.id!==t.id&&!e.isClosing&&(e.trigger("onDeactivate"),e.removeEvents(),e.isVisible=!1)}),t.isVisible=!0,(t.current||t.isIdle)&&(t.update(),t.updateControls()),t.trigger("onActivate"),t.addEvents()},close:function(t,e){var o,i,a,s,r,c,l,u=this,f=u.current,h=function(){u.cleanUp(t)};closehotspotmusic();return!u.isClosing&&(u.isClosing=!0,!1===u.trigger("beforeClose",t)?(u.isClosing=!1,d(function(){u.update()}),!1):(u.removeEvents(),a=f.$content,o=f.opts.animationEffect,i=n.isNumeric(e)?e:o?f.opts.animationDuration:0,f.$slide.removeClass("htmllightbox-slide--complete htmllightbox-slide--next htmllightbox-slide--previous htmllightbox-animated"),!0!==t?n.htmllightbox.stop(f.$slide):o=!1,f.$slide.siblings().trigger("onReset").remove(),i&&u.$refs.container.removeClass("htmllightbox-is-open").addClass("htmllightbox-is-closing").css("transition-duration",i+"ms"),u.hideLoading(f),u.hideControls(!0),u.updateCursor(),"zoom"!==o||a&&i&&"image"===f.type&&!u.isMoved()&&!f.hasError&&(l=u.getThumbPos(f))||(o="fade"),"zoom"===o?(n.htmllightbox.stop(a),s=n.htmllightbox.getTranslate(a),c={top:s.top,left:s.left,scaleX:s.width/l.width,scaleY:s.height/l.height,width:l.width,height:l.height},r=f.opts.zoomOpacity,
			"auto"==r&&(r=Math.abs(f.width/f.height-l.width/l.height)>.1),r&&(l.opacity=0),n.htmllightbox.setTranslate(a,c),p(a),n.htmllightbox.animate(a,l,i,h),!0):(o&&i?n.htmllightbox.animate(f.$slide.addClass("htmllightbox-slide--previous").removeClass("htmllightbox-slide--current"),"htmllightbox-animated htmllightbox-fx-"+o,i,h):!0===t?setTimeout(h,i):h(),!0)))},cleanUp:function(e){var o,i,a,s=this,r=s.current.opts.$orig;s.current.$slide.trigger("onReset"),s.$refs.container.empty().remove(),s.trigger("afterClose",e),s.current.opts.backFocus&&(r&&r.length&&r.is(":visible")||(r=s.$trigger),r&&r.length&&(i=t.scrollX,a=t.scrollY,r.trigger("focus"),n("html, body").scrollTop(a).scrollLeft(i))),s.current=null,o=n.htmllightbox.getInstance(),o?o.activate():(n("body").removeClass("htmllightbox-active compensate-for-scrollbar"),n("#htmllightbox-style-noscroll").remove())},trigger:function(t,e){var o,i=Array.prototype.slice.call(arguments,1),a=this,s=e&&e.opts?e:a.current;if(s?i.unshift(s):s=a,i.unshift(a),n.isFunction(s.opts[t])&&(o=s.opts[t].apply(s,i)),!1===o)return o;"afterClose"!==t&&a.$refs?a.$refs.container.trigger(t+".fb",i):r.trigger(t+".fb",i)},updateControls:function(){var t=this,o=t.current,i=o.index,a=t.$refs.container,s=t.$refs.caption,r=o.opts.caption;o.$slide.trigger("refresh"),r&&r.length?(t.$caption=s,s.children().eq(0).html(r)):t.$caption=null,t.hasHiddenControls||t.isIdle||t.showControls(),a.find("[data-htmllightbox-count]").html(t.group.length),a.find("[data-htmllightbox-index]").html(i+1),a.find("[data-htmllightbox-prev]").prop("disabled",!o.opts.loop&&i<=0),a.find("[data-htmllightbox-next]").prop("disabled",!o.opts.loop&&i>=t.group.length-1),"image"===o.type?a.find("[data-htmllightbox-zoom]").show().end().find("[data-htmllightbox-download]").attr("href",o.opts.image.src||o.src).show():o.opts.toolbar&&a.find("[data-htmllightbox-download],[data-htmllightbox-zoom]").hide(),n(e.activeElement).is(":hidden,[disabled]")&&t.$refs.container.trigger("focus")},hideControls:function(t){var e=this,n=["infobar","toolbar","nav"];!t&&e.current.opts.preventCaptionOverlap||n.push("caption"),this.$refs.container.removeClass(n.map(function(t){return"htmllightbox-show-"+t}).join(" ")),this.hasHiddenControls=!0},showControls:function(){var t=this,e=t.current?t.current.opts:t.opts,n=t.$refs.container;t.hasHiddenControls=!1,t.idleSecondsCounter=0,n.toggleClass("htmllightbox-show-toolbar",!(!e.toolbar||!e.buttons)).toggleClass("htmllightbox-show-infobar",!!(e.infobar&&t.group.length>1)).toggleClass("htmllightbox-show-caption",!!t.$caption).toggleClass("htmllightbox-show-nav",!!(e.arrows&&t.group.length>1)).toggleClass("htmllightbox-is-modal",!!e.modal)},toggleControls:function(){this.hasHiddenControls?this.showControls():this.hideControls()}}),n.htmllightbox={version:"3.5.7",defaults:a,getInstance:function(t){var e=n('.htmllightbox-container:not(".htmllightbox-is-closing"):last').data("HtmllightBox"),o=Array.prototype.slice.call(arguments,1);return e instanceof b&&("string"===n.type(t)?e[t].apply(e,o):"function"===n.type(t)&&t.apply(e,o),e)},open:function(t,e,n){return new b(t,e,n)},close:function(t){var e=this.getInstance();e&&(e.close(),!0===t&&this.close(t))},destroy:function(){this.close(!0),r.add("body").off("click.fb-start","**")},isMobile:/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),use3d:function(){var n=e.createElement("div");return t.getComputedStyle&&t.getComputedStyle(n)&&t.getComputedStyle(n).getPropertyValue("transform")&&!(e.documentMode&&e.documentMode<11)}(),getTranslate:function(t){var e;return!(!t||!t.length)&&(e=t[0].getBoundingClientRect(),{top:e.top||0,left:e.left||0,width:e.width,height:e.height,opacity:parseFloat(t.css("opacity"))})},setTranslate:function(t,e){var n="",o={};if(t&&e)return void 0===e.left&&void 0===e.top||(n=(void 0===e.left?t.position().left:e.left)+"px, "+(void 0===e.top?t.position().top:e.top)+"px",n=this.use3d?"translate3d("+n+", 0px)":"translate("+n+")"),void 0!==e.scaleX&&void 0!==e.scaleY?n+=" scale("+e.scaleX+", "+e.scaleY+")":void 0!==e.scaleX&&(n+=" scaleX("+e.scaleX+")"),n.length&&(o.transform=n),void 0!==e.opacity&&(o.opacity=e.opacity),void 0!==e.width&&(o.width=e.width),void 0!==e.height&&(o.height=e.height),t.css(o)},animate:function(t,e,o,i,a){var s,r=this;n.isFunction(o)&&(i=o,o=null),r.stop(t),s=r.getTranslate(t),t.on(f,function(c){(!c||!c.originalEvent||t.is(c.originalEvent.target)&&"z-index"!=c.originalEvent.propertyName)&&(r.stop(t),n.isNumeric(o)&&t.css("transition-duration",""),n.isPlainObject(e)?void 0!==e.scaleX&&void 0!==e.scaleY&&r.setTranslate(t,{top:e.top,left:e.left,width:s.width*e.scaleX,height:s.height*e.scaleY,scaleX:1,scaleY:1}):!0!==a&&t.removeClass(e),n.isFunction(i)&&i(c))}),n.isNumeric(o)&&t.css("transition-duration",o+"ms"),n.isPlainObject(e)?(void 0!==e.scaleX&&void 0!==e.scaleY&&(delete e.width,delete e.height,t.parent().hasClass("htmllightbox-slide--image")&&t.parent().addClass("htmllightbox-is-scaling")),n.htmllightbox.setTranslate(t,e)):t.addClass(e),t.data("timer",setTimeout(function(){t.trigger(f)},o+33))},stop:function(t,e){t&&t.length&&(clearTimeout(t.data("timer")),e&&t.trigger(f),t.off(f).css("transition-duration",""),t.parent().removeClass("htmllightbox-is-scaling"))}},n.fn.htmllightbox=function(t){var e;return t=t||{},e=t.selector||!1,e?n("body").off("click.fb-start",e).on("click.fb-start",e,{options:t},i):this.off("click.fb-start").on("click.fb-start",{items:this,options:t},i),this},r.on("click.fb-start","[data-htmllightbox]",i),r.on("click.fb-start","[data-htmllightbox-trigger]",function(t){n('[data-htmllightbox="'+n(this).attr("data-htmllightbox-trigger")+'"]').eq(n(this).attr("data-htmllightbox-index")||0).trigger("click.fb-start",{$trigger:n(this)})}),function(){var t=null;r.on("mousedown mouseup focus blur",".htmllightbox-button",function(e){switch(e.type){case"mousedown":t=n(this);break;case"mouseup":t=null;break;case"focusin":n(".htmllightbox-button").removeClass("htmllightbox-focus"),n(this).is(t)||n(this).is("[disabled]")||n(this).addClass("htmllightbox-focus");break;case"focusout":n(".htmllightbox-button").removeClass("htmllightbox-focus")}})}()}}(window,document,jQuery),function(t){"use strict";var e={youtube:{matcher:/(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(watch\?(.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*))(.*)/i,params:{autoplay:1,autohide:1,fs:1,rel:0,hd:1,wmode:"transparent",enablejsapi:1,html5:1},paramPlace:8,type:"iframe",url:"https://www.youtube-nocookie.com/embed/$4",thumb:"https://img.youtube.com/vi/$4/hqdefault.jpg"},vimeo:{matcher:/^.+vimeo.com\/(.*\/)?([\d]+)(.*)?/,params:{autoplay:1,hd:1,show_title:1,show_byline:1,show_portrait:0,fullscreen:1},paramPlace:3,type:"iframe",url:"//player.vimeo.com/video/$2"},instagram:{matcher:/(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,type:"image",url:"//$1/p/$2/media/?size=l"},gmap_place:{matcher:/(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/i,type:"iframe",url:function(t){return"//maps.google."+t[2]+"/?ll="+(t[9]?t[9]+"&z="+Math.floor(t[10])+(t[12]?t[12].replace(/^\//,"&"):""):t[12]+"").replace(/\?/,"&")+"&output="+(t[12]&&t[12].indexOf("layer=c")>0?"svembed":"embed")}},gmap_search:{matcher:/(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(maps\/search\/)(.*)/i,type:"iframe",url:function(t){return"//maps.google."+t[2]+"/maps?q="+t[5].replace("query=","q=").replace("api=1","")+"&output=embed"}}},n=function(e,n,o){if(e)return o=o||"","object"===t.type(o)&&(o=t.param(o,!0)),t.each(n,function(t,n){e=e.replace("$"+t,n||"")}),o.length&&(e+=(e.indexOf("?")>0?"&":"?")+o),e};t(document).on("objectNeedsType.fb",function(o,i,a){var s,r,c,l,d,u,f,p=a.src||"",h=!1;s=t.extend(!0,{},e,a.opts.media),t.each(s,function(e,o){if(c=p.match(o.matcher)){if(h=o.type,f=e,u={},o.paramPlace&&c[o.paramPlace]){d=c[o.paramPlace],"?"==d[0]&&(d=d.substring(1)),d=d.split("&");for(var i=0;i<d.length;++i){var s=d[i].split("=",2);2==s.length&&(u[s[0]]=decodeURIComponent(s[1].replace(/\+/g," ")))}}return l=t.extend(!0,{},o.params,a.opts[e],u),p="function"===t.type(o.url)?o.url.call(this,c,l,a):n(o.url,c,l),r="function"===t.type(o.thumb)?o.thumb.call(this,c,l,a):n(o.thumb,c),"youtube"===e?p=p.replace(/&t=((\d+)m)?(\d+)s/,function(t,e,n,o){return"&start="+((n?60*parseInt(n,10):0)+parseInt(o,10))}):"vimeo"===e&&(p=p.replace("&%23","#")),!1}}),h?(a.opts.thumb||a.opts.$thumb&&a.opts.$thumb.length||(a.opts.thumb=r),"iframe"===h&&(a.opts=t.extend(!0,a.opts,{iframe:{preload:!1,attr:{scrolling:"no"}}})),t.extend(a,{type:h,src:p,origSrc:a.src,contentSource:f,contentType:"image"===h?"image":"gmap_place"==f||"gmap_search"==f?"map":"video"})):p&&(a.type=a.opts.defaultType)});var o={youtube:{src:"https://www.youtube.com/iframe_api",class:"YT",loading:!1,loaded:!1},vimeo:{src:"https://player.vimeo.com/api/player.js",class:"Vimeo",loading:!1,loaded:!1},load:function(t){var e,n=this;if(this[t].loaded)return void setTimeout(function(){n.done(t)});this[t].loading||(this[t].loading=!0,e=document.createElement("script"),e.type="text/javascript",e.src=this[t].src,"youtube"===t?window.onYouTubeIframeAPIReady=function(){n[t].loaded=!0,n.done(t)}:e.onload=function(){n[t].loaded=!0,n.done(t)},document.body.appendChild(e))},done:function(e){var n,o,i;"youtube"===e&&delete window.onYouTubeIframeAPIReady,(n=t.htmllightbox.getInstance())&&(o=n.current.$content.find("iframe"),"youtube"===e&&void 0!==YT&&YT?i=new YT.Player(o.attr("id"),{events:{onStateChange:function(t){0==t.data&&n.next()}}}):"vimeo"===e&&void 0!==Vimeo&&Vimeo&&(i=new Vimeo.Player(o),i.on("ended",function(){n.next()})))}};t(document).on({"afterShow.fb":function(t,e,n){e.group.length>1&&("youtube"===n.contentSource||"vimeo"===n.contentSource)&&o.load(n.contentSource)}})}(jQuery),function(t,e,n){"use strict";var o=function(){return t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.oRequestAnimationFrame||function(e){return t.setTimeout(e,1e3/60)}}(),i=function(){return t.cancelAnimationFrame||t.webkitCancelAnimationFrame||t.mozCancelAnimationFrame||t.oCancelAnimationFrame||function(e){t.clearTimeout(e)}}(),a=function(e){var n=[];e=e.originalEvent||e||t.e,e=e.touches&&e.touches.length?e.touches:e.changedTouches&&e.changedTouches.length?e.changedTouches:[e];for(var o in e)e[o].pageX?n.push({x:e[o].pageX,y:e[o].pageY}):e[o].clientX&&n.push({x:e[o].clientX,y:e[o].clientY});return n},s=function(t,e,n){return e&&t?"x"===n?t.x-e.x:"y"===n?t.y-e.y:Math.sqrt(Math.pow(t.x-e.x,2)+Math.pow(t.y-e.y,2)):0},r=function(t){if(t.is('a,area,button,[role="button"],input,label,select,summary,textarea,video,audio,iframe')||n.isFunction(t.get(0).onclick)||t.data("selectable"))return!0;for(var e=0,o=t[0].attributes,i=o.length;e<i;e++)if("data-htmllightbox-"===o[e].nodeName.substr(0,14))return!0;return!1},c=function(e){var n=t.getComputedStyle(e)["overflow-y"],o=t.getComputedStyle(e)["overflow-x"],i=("scroll"===n||"auto"===n)&&e.scrollHeight>e.clientHeight,a=("scroll"===o||"auto"===o)&&e.scrollWidth>e.clientWidth;return i||a},l=function(t){for(var e=!1;;){if(e=c(t.get(0)))break;if(t=t.parent(),!t.length||t.hasClass("htmllightbox-stage")||t.is("body"))break}return e},d=function(t){var e=this;e.instance=t,e.$bg=t.$refs.bg,e.$stage=t.$refs.stage,e.$container=t.$refs.container,e.destroy(),e.$container.on("touchstart.fb.touch mousedown.fb.touch",n.proxy(e,"ontouchstart"))};d.prototype.destroy=function(){var t=this;t.$container.off(".fb.touch"),n(e).off(".fb.touch"),t.requestId&&(i(t.requestId),t.requestId=null),t.tapped&&(clearTimeout(t.tapped),t.tapped=null)},d.prototype.ontouchstart=function(o){var i=this,c=n(o.target),d=i.instance,u=d.current,f=u.$slide,p=u.$content,h="touchstart"==o.type;if(h&&i.$container.off("mousedown.fb.touch"),(!o.originalEvent||2!=o.originalEvent.button)&&f.length&&c.length&&!r(c)&&!r(c.parent())&&(c.is("img")||!(o.originalEvent.clientX>c[0].clientWidth+c.offset().left))){if(!u||d.isAnimating||u.$slide.hasClass("htmllightbox-animated"))return o.stopPropagation(),void o.preventDefault();i.realPoints=i.startPoints=a(o),i.startPoints.length&&(u.touch&&o.stopPropagation(),i.startEvent=o,i.canTap=!0,i.$target=c,i.$content=p,i.opts=u.opts.touch,i.isPanning=!1,i.isSwiping=!1,i.isZooming=!1,i.isScrolling=!1,i.canPan=d.canPan(),i.startTime=(new Date).getTime(),i.distanceX=i.distanceY=i.distance=0,i.canvasWidth=Math.round(f[0].clientWidth),i.canvasHeight=Math.round(f[0].clientHeight),i.contentLastPos=null,i.contentStartPos=n.htmllightbox.getTranslate(i.$content)||{top:0,left:0},i.sliderStartPos=n.htmllightbox.getTranslate(f),i.stagePos=n.htmllightbox.getTranslate(d.$refs.stage),i.sliderStartPos.top-=i.stagePos.top,i.sliderStartPos.left-=i.stagePos.left,i.contentStartPos.top-=i.stagePos.top,i.contentStartPos.left-=i.stagePos.left,n(e).off(".fb.touch").on(h?"touchend.fb.touch touchcancel.fb.touch":"mouseup.fb.touch mouseleave.fb.touch",n.proxy(i,"ontouchend")).on(h?"touchmove.fb.touch":"mousemove.fb.touch",n.proxy(i,"ontouchmove")),n.htmllightbox.isMobile&&e.addEventListener("scroll",i.onscroll,!0),((i.opts||i.canPan)&&(c.is(i.$stage)||i.$stage.find(c).length)||(c.is(".htmllightbox-image")&&o.preventDefault(),n.htmllightbox.isMobile&&c.parents(".htmllightbox-caption").length))&&(i.isScrollable=l(c)||l(c.parent()),n.htmllightbox.isMobile&&i.isScrollable||o.preventDefault(),(1===i.startPoints.length||u.hasError)&&(i.canPan?(n.htmllightbox.stop(i.$content),i.isPanning=!0):i.isSwiping=!0,i.$container.addClass("htmllightbox-is-grabbing")),2===i.startPoints.length&&"image"===u.type&&(u.isLoaded||u.$ghost)&&(i.canTap=!1,i.isSwiping=!1,i.isPanning=!1,i.isZooming=!0,n.htmllightbox.stop(i.$content),i.centerPointStartX=.5*(i.startPoints[0].x+i.startPoints[1].x)-n(t).scrollLeft(),i.centerPointStartY=.5*(i.startPoints[0].y+i.startPoints[1].y)-n(t).scrollTop(),i.percentageOfImageAtPinchPointX=(i.centerPointStartX-i.contentStartPos.left)/i.contentStartPos.width,i.percentageOfImageAtPinchPointY=(i.centerPointStartY-i.contentStartPos.top)/i.contentStartPos.height,i.startDistanceBetweenFingers=s(i.startPoints[0],i.startPoints[1]))))}},d.prototype.onscroll=function(t){var n=this;n.isScrolling=!0,e.removeEventListener("scroll",n.onscroll,!0)},d.prototype.ontouchmove=function(t){var e=this;return void 0!==t.originalEvent.buttons&&0===t.originalEvent.buttons?void e.ontouchend(t):e.isScrolling?void(e.canTap=!1):(e.newPoints=a(t),void((e.opts||e.canPan)&&e.newPoints.length&&e.newPoints.length&&(e.isSwiping&&!0===e.isSwiping||t.preventDefault(),e.distanceX=s(e.newPoints[0],e.startPoints[0],"x"),e.distanceY=s(e.newPoints[0],e.startPoints[0],"y"),e.distance=s(e.newPoints[0],e.startPoints[0]),e.distance>0&&(e.isSwiping?e.onSwipe(t):e.isPanning?e.onPan():e.isZooming&&e.onZoom()))))},d.prototype.onSwipe=function(e){var a,s=this,r=s.instance,c=s.isSwiping,l=s.sliderStartPos.left||0;if(!0!==c)"x"==c&&(s.distanceX>0&&(s.instance.group.length<2||0===s.instance.current.index&&!s.instance.current.opts.loop)?l+=Math.pow(s.distanceX,.8):s.distanceX<0&&(s.instance.group.length<2||s.instance.current.index===s.instance.group.length-1&&!s.instance.current.opts.loop)?l-=Math.pow(-s.distanceX,.8):l+=s.distanceX),s.sliderLastPos={top:"x"==c?0:s.sliderStartPos.top+s.distanceY,left:l},s.requestId&&(i(s.requestId),s.requestId=null),s.requestId=o(function(){s.sliderLastPos&&(n.each(s.instance.slides,function(t,e){var o=e.pos-s.instance.currPos;n.htmllightbox.setTranslate(e.$slide,{top:s.sliderLastPos.top,left:s.sliderLastPos.left+o*s.canvasWidth+o*e.opts.gutter})}),s.$container.addClass("htmllightbox-is-sliding"))});else if(Math.abs(s.distance)>10){if(s.canTap=!1,r.group.length<2&&s.opts.vertical?s.isSwiping="y":r.isDragging||!1===s.opts.vertical||"auto"===s.opts.vertical&&n(t).width()>800?s.isSwiping="x":(a=Math.abs(180*Math.atan2(s.distanceY,s.distanceX)/Math.PI),s.isSwiping=a>45&&a<135?"y":"x"),"y"===s.isSwiping&&n.htmllightbox.isMobile&&s.isScrollable)return void(s.isScrolling=!0);r.isDragging=s.isSwiping,s.startPoints=s.newPoints,n.each(r.slides,function(t,e){var o,i;n.htmllightbox.stop(e.$slide),o=n.htmllightbox.getTranslate(e.$slide),i=n.htmllightbox.getTranslate(r.$refs.stage),e.$slide.css({transform:"",opacity:"","transition-duration":""}).removeClass("htmllightbox-animated").removeClass(function(t,e){return(e.match(/(^|\s)htmllightbox-fx-\S+/g)||[]).join(" ")}),e.pos===r.current.pos&&(s.sliderStartPos.top=o.top-i.top,s.sliderStartPos.left=o.left-i.left),n.htmllightbox.setTranslate(e.$slide,{top:o.top-i.top,left:o.left-i.left})}),r.SlideShow&&r.SlideShow.isActive&&r.SlideShow.stop()}},d.prototype.onPan=function(){var t=this;if(s(t.newPoints[0],t.realPoints[0])<(n.htmllightbox.isMobile?10:5))return void(t.startPoints=t.newPoints);t.canTap=!1,t.contentLastPos=t.limitMovement(),t.requestId&&i(t.requestId),t.requestId=o(function(){n.htmllightbox.setTranslate(t.$content,t.contentLastPos)})},d.prototype.limitMovement=function(){var t,e,n,o,i,a,s=this,r=s.canvasWidth,c=s.canvasHeight,l=s.distanceX,d=s.distanceY,u=s.contentStartPos,f=u.left,p=u.top,h=u.width,g=u.height;return i=h>r?f+l:f,a=p+d,t=Math.max(0,.5*r-.5*h),e=Math.max(0,.5*c-.5*g),n=Math.min(r-h,.5*r-.5*h),o=Math.min(c-g,.5*c-.5*g),l>0&&i>t&&(i=t-1+Math.pow(-t+f+l,.8)||0),l<0&&i<n&&(i=n+1-Math.pow(n-f-l,.8)||0),d>0&&a>e&&(a=e-1+Math.pow(-e+p+d,.8)||0),d<0&&a<o&&(a=o+1-Math.pow(o-p-d,.8)||0),{top:a,left:i}},d.prototype.limitPosition=function(t,e,n,o){var i=this,a=i.canvasWidth,s=i.canvasHeight;return n>a?(t=t>0?0:t,t=t<a-n?a-n:t):t=Math.max(0,a/2-n/2),o>s?(e=e>0?0:e,e=e<s-o?s-o:e):e=Math.max(0,s/2-o/2),{top:e,left:t}},d.prototype.onZoom=function(){var e=this,a=e.contentStartPos,r=a.width,c=a.height,l=a.left,d=a.top,u=s(e.newPoints[0],e.newPoints[1]),f=u/e.startDistanceBetweenFingers,p=Math.floor(r*f),h=Math.floor(c*f),g=(r-p)*e.percentageOfImageAtPinchPointX,b=(c-h)*e.percentageOfImageAtPinchPointY,m=(e.newPoints[0].x+e.newPoints[1].x)/2-n(t).scrollLeft(),v=(e.newPoints[0].y+e.newPoints[1].y)/2-n(t).scrollTop(),y=m-e.centerPointStartX,x=v-e.centerPointStartY,w=l+(g+y),$=d+(b+x),S={top:$,left:w,scaleX:f,scaleY:f};e.canTap=!1,e.newWidth=p,e.newHeight=h,e.contentLastPos=S,e.requestId&&i(e.requestId),e.requestId=o(function(){n.htmllightbox.setTranslate(e.$content,e.contentLastPos)})},d.prototype.ontouchend=function(t){var o=this,s=o.isSwiping,r=o.isPanning,c=o.isZooming,l=o.isScrolling;if(o.endPoints=a(t),o.dMs=Math.max((new Date).getTime()-o.startTime,1),o.$container.removeClass("htmllightbox-is-grabbing"),n(e).off(".fb.touch"),e.removeEventListener("scroll",o.onscroll,!0),o.requestId&&(i(o.requestId),o.requestId=null),o.isSwiping=!1,o.isPanning=!1,o.isZooming=!1,o.isScrolling=!1,o.instance.isDragging=!1,o.canTap)return o.onTap(t);o.speed=100,o.velocityX=o.distanceX/o.dMs*.5,o.velocityY=o.distanceY/o.dMs*.5,r?o.endPanning():c?o.endZooming():o.endSwiping(s,l)},d.prototype.endSwiping=function(t,e){var o=this,i=!1,a=o.instance.group.length,s=Math.abs(o.distanceX),r="x"==t&&a>1&&(o.dMs>130&&s>10||s>50);o.sliderLastPos=null,"y"==t&&!e&&Math.abs(o.distanceY)>50?(n.htmllightbox.animate(o.instance.current.$slide,{top:o.sliderStartPos.top+o.distanceY+150*o.velocityY,opacity:0},200),i=o.instance.close(!0,250)):r&&o.distanceX>0?i=o.instance.previous(300):r&&o.distanceX<0&&(i=o.instance.next(300)),!1!==i||"x"!=t&&"y"!=t||o.instance.centerSlide(200),o.$container.removeClass("htmllightbox-is-sliding")},d.prototype.endPanning=function(){var t,e,o,i=this;i.contentLastPos&&(!1===i.opts.momentum||i.dMs>350?(t=i.contentLastPos.left,e=i.contentLastPos.top):(t=i.contentLastPos.left+500*i.velocityX,e=i.contentLastPos.top+500*i.velocityY),o=i.limitPosition(t,e,i.contentStartPos.width,i.contentStartPos.height),o.width=i.contentStartPos.width,o.height=i.contentStartPos.height,n.htmllightbox.animate(i.$content,o,366))},d.prototype.endZooming=function(){var t,e,o,i,a=this,s=a.instance.current,r=a.newWidth,c=a.newHeight;a.contentLastPos&&(t=a.contentLastPos.left,e=a.contentLastPos.top,i={top:e,left:t,width:r,height:c,scaleX:1,scaleY:1},n.htmllightbox.setTranslate(a.$content,i),r<a.canvasWidth&&c<a.canvasHeight?a.instance.scaleToFit(150):r>s.width||c>s.height?a.instance.scaleToActual(a.centerPointStartX,a.centerPointStartY,150):(o=a.limitPosition(t,e,r,c),n.htmllightbox.animate(a.$content,o,150)))},d.prototype.onTap=function(e){var o,i=this,s=n(e.target),r=i.instance,c=r.current,l=e&&a(e)||i.startPoints,d=l[0]?l[0].x-n(t).scrollLeft()-i.stagePos.left:0,u=l[0]?l[0].y-n(t).scrollTop()-i.stagePos.top:0,f=function(t){var o=c.opts[t];if(n.isFunction(o)&&(o=o.apply(r,[c,e])),o)switch(o){case"close":r.close(i.startEvent);break;case"toggleControls":r.toggleControls();break;case"next":r.next();break;case"nextOrClose":r.group.length>1?r.next():r.close(i.startEvent);break;case"zoom":"image"==c.type&&(c.isLoaded||c.$ghost)&&(r.canPan()?r.scaleToFit():r.isScaledDown()?r.scaleToActual(d,u):r.group.length<2&&r.close(i.startEvent))}};if((!e.originalEvent||2!=e.originalEvent.button)&&(s.is("img")||!(d>s[0].clientWidth+s.offset().left))){if(s.is(".htmllightbox-bg,.htmllightbox-inner,.htmllightbox-outer,.htmllightbox-container"))o="Outside";else if(s.is(".htmllightbox-slide"))o="Slide";else{if(!r.current.$content||!r.current.$content.find(s).addBack().filter(s).length)return;o="Content"}if(i.tapped){if(clearTimeout(i.tapped),i.tapped=null,Math.abs(d-i.tapX)>50||Math.abs(u-i.tapY)>50)return this;f("dblclick"+o)}else i.tapX=d,i.tapY=u,c.opts["dblclick"+o]&&c.opts["dblclick"+o]!==c.opts["click"+o]?i.tapped=setTimeout(function(){i.tapped=null,r.isAnimating||f("click"+o)},500):f("click"+o);return this}},n(e).on("onActivate.fb",function(t,e){e&&!e.Guestures&&(e.Guestures=new d(e))}).on("beforeClose.fb",function(t,e){e&&e.Guestures&&e.Guestures.destroy()})}(window,document,jQuery),function(t,e){"use strict";e.extend(!0,e.htmllightbox.defaults,{btnTpl:{slideShow:'<button data-htmllightbox-play class="htmllightbox-button htmllightbox-button--play" title="{{PLAY_START}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.5 5.4v13.2l11-6.6z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8.33 5.75h2.2v12.5h-2.2V5.75zm5.15 0h2.2v12.5h-2.2V5.75z"/></svg></button>'},slideShow:{autoStart:!1,speed:3e3,progress:!0}});var n=function(t){this.instance=t,this.init()};e.extend(n.prototype,{timer:null,isActive:!1,$button:null,init:function(){var t=this,n=t.instance,o=n.group[n.currIndex].opts.slideShow;t.$button=n.$refs.toolbar.find("[data-htmllightbox-play]").on("click",function(){t.toggle()}),n.group.length<2||!o?t.$button.hide():o.progress&&(t.$progress=e('<div class="htmllightbox-progress"></div>').appendTo(n.$refs.inner))},set:function(t){var n=this,o=n.instance,i=o.current;i&&(!0===t||i.opts.loop||o.currIndex<o.group.length-1)?n.isActive&&"video"!==i.contentType&&(n.$progress&&e.htmllightbox.animate(n.$progress.show(),{scaleX:1},i.opts.slideShow.speed),n.timer=setTimeout(function(){o.current.opts.loop||o.current.index!=o.group.length-1?o.next():o.jumpTo(0)},i.opts.slideShow.speed)):(n.stop(),o.idleSecondsCounter=0,o.showControls())},clear:function(){var t=this;clearTimeout(t.timer),t.timer=null,t.$progress&&t.$progress.removeAttr("style").hide()},start:function(){var t=this,e=t.instance.current;e&&(t.$button.attr("title",(e.opts.i18n[e.opts.lang]||e.opts.i18n.en).PLAY_STOP).removeClass("htmllightbox-button--play").addClass("htmllightbox-button--pause"),t.isActive=!0,e.isComplete&&t.set(!0),t.instance.trigger("onSlideShowChange",!0))},stop:function(){var t=this,e=t.instance.current;t.clear(),t.$button.attr("title",(e.opts.i18n[e.opts.lang]||e.opts.i18n.en).PLAY_START).removeClass("htmllightbox-button--pause").addClass("htmllightbox-button--play"),t.isActive=!1,t.instance.trigger("onSlideShowChange",!1),t.$progress&&t.$progress.removeAttr("style").hide()},toggle:function(){var t=this;t.isActive?t.stop():t.start()}}),e(t).on({"onInit.fb":function(t,e){e&&!e.SlideShow&&(e.SlideShow=new n(e))},"beforeShow.fb":function(t,e,n,o){var i=e&&e.SlideShow;o?i&&n.opts.slideShow.autoStart&&i.start():i&&i.isActive&&i.clear()},"afterShow.fb":function(t,e,n){var o=e&&e.SlideShow;o&&o.isActive&&o.set()},"afterKeydown.fb":function(n,o,i,a,s){var r=o&&o.SlideShow;!r||!i.opts.slideShow||80!==s&&32!==s||e(t.activeElement).is("button,a,input")||(a.preventDefault(),r.toggle())},"beforeClose.fb onDeactivate.fb":function(t,e){var n=e&&e.SlideShow;n&&n.stop()}}),e(t).on("visibilitychange",function(){var n=e.htmllightbox.getInstance(),o=n&&n.SlideShow;o&&o.isActive&&(t.hidden?o.clear():o.set())})}(document,jQuery),function(t,e){"use strict";var n=function(){for(var e=[["requestFullscreen","exitFullscreen","fullscreenElement","fullscreenEnabled","fullscreenchange","fullscreenerror"],["webkitRequestFullscreen","webkitExitFullscreen","webkitFullscreenElement","webkitFullscreenEnabled","webkitfullscreenchange","webkitfullscreenerror"],["webkitRequestFullScreen","webkitCancelFullScreen","webkitCurrentFullScreenElement","webkitCancelFullScreen","webkitfullscreenchange","webkitfullscreenerror"],["mozRequestFullScreen","mozCancelFullScreen","mozFullScreenElement","mozFullScreenEnabled","mozfullscreenchange","mozfullscreenerror"],["msRequestFullscreen","msExitFullscreen","msFullscreenElement","msFullscreenEnabled","MSFullscreenChange","MSFullscreenError"]],n={},o=0;o<e.length;o++){var i=e[o];if(i&&i[1]in t){for(var a=0;a<i.length;a++)n[e[0][a]]=i[a];return n}}return!1}();if(n){var o={request:function(e){e=e||t.documentElement,e[n.requestFullscreen](e.ALLOW_KEYBOARD_INPUT)},exit:function(){t[n.exitFullscreen]()},toggle:function(e){e=e||t.documentElement,this.isFullscreen()?this.exit():this.request(e)},isFullscreen:function(){return Boolean(t[n.fullscreenElement])},enabled:function(){return Boolean(t[n.fullscreenEnabled])}};e.extend(!0,e.htmllightbox.defaults,{btnTpl:{fullScreen:'<button data-htmllightbox-fullscreen class="htmllightbox-button htmllightbox-button--fsenter" title="{{FULL_SCREEN}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5zm3-8H5v2h5V5H8zm6 11h2v-3h3v-2h-5zm2-11V5h-2v5h5V8z"/></svg></button>'},fullScreen:{autoStart:!1}}),e(t).on(n.fullscreenchange,function(){var t=o.isFullscreen(),n=e.htmllightbox.getInstance();n&&(n.current&&"image"===n.current.type&&n.isAnimating&&(n.isAnimating=!1,n.update(!0,!0,0),n.isComplete||n.complete()),n.trigger("onFullscreenChange",t),n.$refs.container.toggleClass("htmllightbox-is-fullscreen",t),n.$refs.toolbar.find("[data-htmllightbox-fullscreen]").toggleClass("htmllightbox-button--fsenter",!t).toggleClass("htmllightbox-button--fsexit",t))})}e(t).on({"onInit.fb":function(t,e){var i;if(!n)return void e.$refs.toolbar.find("[data-htmllightbox-fullscreen]").remove();e&&e.group[e.currIndex].opts.fullScreen?(i=e.$refs.container,i.on("click.fb-fullscreen","[data-htmllightbox-fullscreen]",function(t){t.stopPropagation(),t.preventDefault(),o.toggle()}),e.opts.fullScreen&&!0===e.opts.fullScreen.autoStart&&o.request(),e.FullScreen=o):e&&e.$refs.toolbar.find("[data-htmllightbox-fullscreen]").hide()},"afterKeydown.fb":function(t,e,n,o,i){e&&e.FullScreen&&70===i&&(o.preventDefault(),e.FullScreen.toggle())},"beforeClose.fb":function(t,e){e&&e.FullScreen&&e.$refs.container.hasClass("htmllightbox-is-fullscreen")&&o.exit()}})}(document,jQuery),function(t,e){"use strict";var n="htmllightbox-thumbs";e.htmllightbox.defaults=e.extend(!0,{btnTpl:{thumbs:'<button data-htmllightbox-thumbs class="htmllightbox-button htmllightbox-button--thumbs" title="{{THUMBS}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14.59 14.59h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76H5.65V5.65z"/></svg></button>'},thumbs:{autoStart:!1,hideOnClose:!0,parentEl :".htmllightbox-container",axis:"y"}},e.htmllightbox.defaults);var o=function(t){this.init(t)};e.extend(o.prototype,{$button:null,$grid:null,$list:null,isVisible:!1,isActive:!1,init:function(t){var e=this,n=t.group,o=0;e.instance=t,e.opts=n[t.currIndex].opts.thumbs,t.Thumbs=e,e.$button=t.$refs.toolbar.find("[data-htmllightbox-thumbs]");for(var i=0,a=n.length;i<a&&(n[i].thumb&&o++,!(o>1));i++);o>1&&e.opts?(e.$button.removeAttr("style").on("click",function(){e.toggle()}),e.isActive=!0):e.$button.hide()},create:function(){var t,o=this,i=o.instance,a=o.opts.parentEl,s=[];o.$grid||(o.$grid=e('<div class="'+n+" "+n+"-"+o.opts.axis+'"></div>').appendTo(i.$refs.container.find(a).addBack().filter(a)),o.$grid.on("click","a",function(){i.jumpTo(e(this).attr("data-index"))})),o.$list||(o.$list=e('<div class="'+n+'__list">').appendTo(o.$grid)),e.each(i.group,function(e,n){t=n.thumb,t||"image"!==n.type||(t=n.src),s.push('<a href="javascript:;" tabindex="0" data-index="'+e+'"'+(t&&t.length?' style="background-image:url('+t+')"':'class="htmllightbox-thumbs-missing"')+"></a>")}),o.$list[0].innerHTML=s.join(""),"x"===o.opts.axis&&o.$list.width(parseInt(o.$grid.css("padding-right"),10)+i.group.length*o.$list.children().eq(0).outerWidth(!0))},focus:function(t){var e,n,o=this,i=o.$list,a=o.$grid;o.instance.current&&(e=i.children().removeClass("htmllightbox-thumbs-active").filter('[data-index="'+o.instance.current.index+'"]').addClass("htmllightbox-thumbs-active"),n=e.position(),"y"===o.opts.axis&&(n.top<0||n.top>i.height()-e.outerHeight())?i.stop().animate({scrollTop:i.scrollTop()+n.top},t):"x"===o.opts.axis&&(n.left<a.scrollLeft()||n.left>a.scrollLeft()+(a.width()-e.outerWidth()))&&i.parent().stop().animate({scrollLeft:n.left},t))},update:function(){var t=this;t.instance.$refs.container.toggleClass("htmllightbox-show-thumbs",this.isVisible),t.isVisible?(t.$grid||t.create(),t.instance.trigger("onThumbsShow"),t.focus(0)):t.$grid&&t.instance.trigger("onThumbsHide"),t.instance.update()},hide:function(){this.isVisible=!1,this.update()},show:function(){this.isVisible=!0,this.update()},toggle:function(){this.isVisible=!this.isVisible,this.update()}}),e(t).on({"onInit.fb":function(t,e){var n;e&&!e.Thumbs&&(n=new o(e),n.isActive&&!0===n.opts.autoStart&&n.show())},"beforeShow.fb":function(t,e,n,o){var i=e&&e.Thumbs;i&&i.isVisible&&i.focus(o?0:250)},"afterKeydown.fb":function(t,e,n,o,i){var a=e&&e.Thumbs;a&&a.isActive&&71===i&&(o.preventDefault(),a.toggle())},"beforeClose.fb":function(t,e){var n=e&&e.Thumbs;n&&n.isVisible&&!1!==n.opts.hideOnClose&&n.$grid.hide()}})}(document,jQuery),function(t,e){"use strict";function n(t){var e={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"};return String(t).replace(/[&<>"'`=\/]/g,function(t){return e[t]})}e.extend(!0,e.htmllightbox.defaults,{btnTpl:{share:'<button data-htmllightbox-share class="htmllightbox-button htmllightbox-button--share" title="{{SHARE}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.55 19c1.4-8.4 9.1-9.8 11.9-9.8V5l7 7-7 6.3v-3.5c-2.8 0-10.5 2.1-11.9 4.2z"/></svg></button>'},share:{url:function(t,e){return!t.currentHash&&"inline"!==e.type&&"html"!==e.type&&(e.origSrc||e.src)||window.location},
			tpl:'<div class="htmllightbox-share"><h1>{{SHARE}}</h1><p><a class="htmllightbox-share__button htmllightbox-share__button--fb" href="https://www.facebook.com/sharer/sharer.php?u={{url}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m287 456v-299c0-21 6-35 35-35h38v-63c-7-1-29-3-55-3-54 0-91 33-91 94v306m143-254h-205v72h196" /></svg><span>Facebook</span></a><a class="htmllightbox-share__button htmllightbox-share__button--tw" href="https://twitter.com/intent/tweet?url={{url}}&text={{descr}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m456 133c-14 7-31 11-47 13 17-10 30-27 37-46-15 10-34 16-52 20-61-62-157-7-141 75-68-3-129-35-169-85-22 37-11 86 26 109-13 0-26-4-37-9 0 39 28 72 65 80-12 3-25 4-37 2 10 33 41 57 77 57-42 30-77 38-122 34 170 111 378-32 359-208 16-11 30-25 41-42z" /></svg><span>Twitter</span></a><a class="htmllightbox-share__button htmllightbox-share__button--pt" href="https://www.pinterest.com/pin/create/button/?url={{url}}&description={{descr}}&media={{media}}"><svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m265 56c-109 0-164 78-164 144 0 39 15 74 47 87 5 2 10 0 12-5l4-19c2-6 1-8-3-13-9-11-15-25-15-45 0-58 43-110 113-110 62 0 96 38 96 88 0 67-30 122-73 122-24 0-42-19-36-44 6-29 20-60 20-81 0-19-10-35-31-35-25 0-44 26-44 60 0 21 7 36 7 36l-30 125c-8 37-1 83 0 87 0 3 4 4 5 2 2-3 32-39 42-75l16-64c8 16 31 29 56 29 74 0 124-67 124-157 0-69-58-132-146-132z" fill="#fff"/></svg><span>Pinterest</span></a></p><p><input class="htmllightbox-share__input" type="text" value="{{url_raw}}" onclick="select()" /></p></div>'}}),e(t).on("click","[data-htmllightbox-share]",function(){var t,o,i=e.htmllightbox.getInstance(),a=i.current||null;a&&("function"===e.type(a.opts.share.url)&&(t=a.opts.share.url.apply(a,[i,a])),o=a.opts.share.tpl.replace(/\{\{media\}\}/g,"image"===a.type?encodeURIComponent(a.src):"").replace(/\{\{url\}\}/g,encodeURIComponent(t)).replace(/\{\{url_raw\}\}/g,n(t)).replace(/\{\{descr\}\}/g,i.$caption?encodeURIComponent(i.$caption.text()):""),e.htmllightbox.open({src:i.translate(i,o),type:"html",opts:{touch:!1,animationEffect:!1,afterLoad:function(t,e){i.$refs.container.one("beforeClose.fb",function(){t.close(null,0)}),e.$content.find(".htmllightbox-share__button").click(function(){return window.open(this.href,"Share","width=550, height=450"),!1})},mobile:{autoFocus:!1}}}))})}(document,jQuery),function(t,e,n){"use strict";function o(){var e=t.location.hash.substr(1),n=e.split("-"),o=n.length>1&&/^\+?\d+$/.test(n[n.length-1])?parseInt(n.pop(-1),10)||1:1,i=n.join("-");return{hash:e,index:o<1?1:o,gallery:i}}function i(t){""!==t.gallery&&n("[data-htmllightbox='"+n.escapeSelector(t.gallery)+"']").eq(t.index-1).focus().trigger("click.fb-start")}function a(t){var e,n;return!!t&&(e=t.current?t.current.opts:t.opts,""!==(n=e.hash||(e.$orig?e.$orig.data("htmllightbox")||e.$orig.data("htmllightbox-trigger"):""))&&n)}n.escapeSelector||(n.escapeSelector=function(t){return(t+"").replace(/([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g,function(t,e){return e?"\0"===t?"�":t.slice(0,-1)+"\\"+t.charCodeAt(t.length-1).toString(16)+" ":"\\"+t})}),n(function(){!1!==n.htmllightbox.defaults.hash&&(n(e).on({"onInit.fb":function(t,e){var n,i;!1!==e.group[e.currIndex].opts.hash&&(n=o(),(i=a(e))&&n.gallery&&i==n.gallery&&(e.currIndex=n.index-1))},"beforeShow.fb":function(n,o,i,s){var r;i&&!1!==i.opts.hash&&(r=a(o))&&(o.currentHash=r+(o.group.length>1?"-"+(i.index+1):""),t.location.hash!=="#"+o.currentHash&&(s&&!o.origHash&&(o.origHash=t.location.hash),o.hashTimer&&clearTimeout(o.hashTimer),o.hashTimer=setTimeout(function(){"replaceState"in t.history?(t.history[s?"pushState":"replaceState"]({},e.title,t.location.pathname+t.location.search+"#"+o.currentHash),s&&(o.hasCreatedHistory=!0)):t.location.hash=o.currentHash,o.hashTimer=null},300)))},"beforeClose.fb":function(n,o,i){i&&!1!==i.opts.hash&&(clearTimeout(o.hashTimer),o.currentHash&&o.hasCreatedHistory?t.history.back():o.currentHash&&("replaceState"in t.history?t.history.replaceState({},e.title,t.location.pathname+t.location.search+(o.origHash||"")):t.location.hash=o.origHash),o.currentHash=null)}}),n(t).on("hashchange.fb",function(){var t=o(),e=null;n.each(n(".htmllightbox-container").get().reverse(),function(t,o){var i=n(o).data("HtmllightBox");if(i&&i.currentHash)return e=i,!1}),e?e.currentHash===t.gallery+"-"+t.index||1===t.index&&e.currentHash==t.gallery||(e.currentHash=null,e.close()):""!==t.gallery&&i(t)}),setTimeout(function(){n.htmllightbox.getInstance()||i(o())},50))})}(window,document,jQuery),function(t,e){"use strict";var n=(new Date).getTime();e(t).on({"onInit.fb":function(t,e,o){e.$refs.stage.on("mousewheel DOMMouseScroll wheel MozMousePixelScroll",function(t){var o=e.current,i=(new Date).getTime();e.group.length<2||!1===o.opts.wheel||"auto"===o.opts.wheel&&"image"!==o.type||(t.preventDefault(),t.stopPropagation(),o.$slide.hasClass("htmllightbox-animated")||(t=t.originalEvent||t,i-n<250||(n=i,e[(-t.deltaY||-t.deltaX||t.wheelDelta||-t.detail)<0?"next":"previous"]())))})}})}(document,jQuery);
			
			
			/**
			 * Owl Carousel v1.3.2
			 * Copyright 2013-2018 David Deutsch
			 * Licensed under: SEE LICENSE IN https://github.com/OwlCarousel2/OwlCarousel2/blob/master/LICENSE
			 */
			eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('7(A 3c.3q!=="9"){3c.3q=9(e){9 t(){}t.5S=e;p 5R t}}(9(e,t,n){h r={1N:9(t,n){h r=c;r.$k=e(n);r.6=e.4M({},e.37.2B.6,r.$k.v(),t);r.2A=t;r.4L()},4L:9(){9 r(e){h n,r="";7(A t.6.33==="9"){t.6.33.R(c,[e])}l{1A(n 38 e.d){7(e.d.5M(n)){r+=e.d[n].1K}}t.$k.2y(r)}t.3t()}h t=c,n;7(A t.6.2H==="9"){t.6.2H.R(c,[t.$k])}7(A t.6.2O==="2Y"){n=t.6.2O;e.5K(n,r)}l{t.3t()}},3t:9(){h e=c;e.$k.v("d-4I",e.$k.2x("2w")).v("d-4F",e.$k.2x("H"));e.$k.z({2u:0});e.2t=e.6.q;e.4E();e.5v=0;e.1X=14;e.23()},23:9(){h e=c;7(e.$k.25().N===0){p b}e.1M();e.4C();e.$S=e.$k.25();e.E=e.$S.N;e.4B();e.$G=e.$k.17(".d-1K");e.$K=e.$k.17(".d-1p");e.3u="U";e.13=0;e.26=[0];e.m=0;e.4A();e.4z()},4z:9(){h e=c;e.2V();e.2W();e.4t();e.30();e.4r();e.4q();e.2p();e.4o();7(e.6.2o!==b){e.4n(e.6.2o)}7(e.6.O===j){e.6.O=4Q}e.19();e.$k.17(".d-1p").z("4i","4h");7(!e.$k.2m(":3n")){e.3o()}l{e.$k.z("2u",1)}e.5O=b;e.2l();7(A e.6.3s==="9"){e.6.3s.R(c,[e.$k])}},2l:9(){h e=c;7(e.6.1Z===j){e.1Z()}7(e.6.1B===j){e.1B()}e.4g();7(A e.6.3w==="9"){e.6.3w.R(c,[e.$k])}},3x:9(){h e=c;7(A e.6.3B==="9"){e.6.3B.R(c,[e.$k])}e.3o();e.2V();e.2W();e.4f();e.30();e.2l();7(A e.6.3D==="9"){e.6.3D.R(c,[e.$k])}},3F:9(){h e=c;t.1c(9(){e.3x()},0)},3o:9(){h e=c;7(e.$k.2m(":3n")===b){e.$k.z({2u:0});t.18(e.1C);t.18(e.1X)}l{p b}e.1X=t.4d(9(){7(e.$k.2m(":3n")){e.3F();e.$k.4b({2u:1},2M);t.18(e.1X)}},5x)},4B:9(){h e=c;e.$S.5n(\'<L H="d-1p">\').4a(\'<L H="d-1K"></L>\');e.$k.17(".d-1p").4a(\'<L H="d-1p-49">\');e.1H=e.$k.17(".d-1p-49");e.$k.z("4i","4h")},1M:9(){h e=c,t=e.$k.1I(e.6.1M),n=e.$k.1I(e.6.2i);7(!t){e.$k.I(e.6.1M)}7(!n){e.$k.I(e.6.2i)}},2V:9(){h t=c,n,r;7(t.6.2Z===b){p b}7(t.6.48===j){t.6.q=t.2t=1;t.6.1h=b;t.6.1s=b;t.6.1O=b;t.6.22=b;t.6.1Q=b;t.6.1R=b;p b}n=e(t.6.47).1f();7(n>(t.6.1s[0]||t.2t)){t.6.q=t.2t}7(t.6.1h!==b){t.6.1h.5g(9(e,t){p e[0]-t[0]});1A(r=0;r<t.6.1h.N;r+=1){7(t.6.1h[r][0]<=n){t.6.q=t.6.1h[r][1]}}}l{7(n<=t.6.1s[0]&&t.6.1s!==b){t.6.q=t.6.1s[1]}7(n<=t.6.1O[0]&&t.6.1O!==b){t.6.q=t.6.1O[1]}7(n<=t.6.22[0]&&t.6.22!==b){t.6.q=t.6.22[1]}7(n<=t.6.1Q[0]&&t.6.1Q!==b){t.6.q=t.6.1Q[1]}7(n<=t.6.1R[0]&&t.6.1R!==b){t.6.q=t.6.1R[1]}}7(t.6.q>t.E&&t.6.46===j){t.6.q=t.E}},4r:9(){h n=c,r,i;7(n.6.2Z!==j){p b}i=e(t).1f();n.3d=9(){7(e(t).1f()!==i){7(n.6.O!==b){t.18(n.1C)}t.5d(r);r=t.1c(9(){i=e(t).1f();n.3x()},n.6.45)}};e(t).44(n.3d)},4f:9(){h e=c;e.2g(e.m);7(e.6.O!==b){e.3j()}},43:9(){h t=c,n=0,r=t.E-t.6.q;t.$G.2f(9(i){h s=e(c);s.z({1f:t.M}).v("d-1K",3p(i));7(i%t.6.q===0||i===r){7(!(i>r)){n+=1}}s.v("d-24",n)})},42:9(){h e=c,t=e.$G.N*e.M;e.$K.z({1f:t*2,T:0});e.43()},2W:9(){h e=c;e.40();e.42();e.3Z();e.3v()},40:9(){h e=c;e.M=1F.4O(e.$k.1f()/e.6.q)},3v:9(){h e=c,t=(e.E*e.M-e.6.q*e.M)*-1;7(e.6.q>e.E){e.D=0;t=0;e.3z=0}l{e.D=e.E-e.6.q;e.3z=t}p t},3Y:9(){p 0},3Z:9(){h t=c,n=0,r=0,i,s,o;t.J=[0];t.3E=[];1A(i=0;i<t.E;i+=1){r+=t.M;t.J.2D(-r);7(t.6.12===j){s=e(t.$G[i]);o=s.v("d-24");7(o!==n){t.3E[n]=t.J[i];n=o}}}},4t:9(){h t=c;7(t.6.2a===j||t.6.1v===j){t.B=e(\'<L H="d-5A"/>\').5m("5l",!t.F.15).5c(t.$k)}7(t.6.1v===j){t.3T()}7(t.6.2a===j){t.3S()}},3S:9(){h t=c,n=e(\'<L H="d-4U"/>\');t.B.1o(n);t.1u=e("<L/>",{"H":"d-1n",2y:t.6.2U[0]||""});t.1q=e("<L/>",{"H":"d-U",2y:t.6.2U[1]||""});n.1o(t.1u).1o(t.1q);n.w("2X.B 21.B",\'L[H^="d"]\',9(e){e.1l()});n.w("2n.B 28.B",\'L[H^="d"]\',9(n){n.1l();7(e(c).1I("d-U")){t.U()}l{t.1n()}})},3T:9(){h t=c;t.1k=e(\'<L H="d-1v"/>\');t.B.1o(t.1k);t.1k.w("2n.B 28.B",".d-1j",9(n){n.1l();7(3p(e(c).v("d-1j"))!==t.m){t.1g(3p(e(c).v("d-1j")),j)}})},3P:9(){h t=c,n,r,i,s,o,u;7(t.6.1v===b){p b}t.1k.2y("");n=0;r=t.E-t.E%t.6.q;1A(s=0;s<t.E;s+=1){7(s%t.6.q===0){n+=1;7(r===s){i=t.E-t.6.q}o=e("<L/>",{"H":"d-1j"});u=e("<3N></3N>",{4R:t.6.39===j?n:"","H":t.6.39===j?"d-59":""});o.1o(u);o.v("d-1j",r===s?i:s);o.v("d-24",n);t.1k.1o(o)}}t.35()},35:9(){h t=c;7(t.6.1v===b){p b}t.1k.17(".d-1j").2f(9(){7(e(c).v("d-24")===e(t.$G[t.m]).v("d-24")){t.1k.17(".d-1j").Z("2d");e(c).I("2d")}})},3e:9(){h e=c;7(e.6.2a===b){p b}7(e.6.2e===b){7(e.m===0&&e.D===0){e.1u.I("1b");e.1q.I("1b")}l 7(e.m===0&&e.D!==0){e.1u.I("1b");e.1q.Z("1b")}l 7(e.m===e.D){e.1u.Z("1b");e.1q.I("1b")}l 7(e.m!==0&&e.m!==e.D){e.1u.Z("1b");e.1q.Z("1b")}}},30:9(){h e=c;e.3P();e.3e();7(e.B){7(e.6.q>=e.E){e.B.3K()}l{e.B.3J()}}},55:9(){h e=c;7(e.B){e.B.3k()}},U:9(e){h t=c;7(t.1E){p b}t.m+=t.6.12===j?t.6.q:1;7(t.m>t.D+(t.6.12===j?t.6.q-1:0)){7(t.6.2e===j){t.m=0;e="2k"}l{t.m=t.D;p b}}t.1g(t.m,e)},1n:9(e){h t=c;7(t.1E){p b}7(t.6.12===j&&t.m>0&&t.m<t.6.q){t.m=0}l{t.m-=t.6.12===j?t.6.q:1}7(t.m<0){7(t.6.2e===j){t.m=t.D;e="2k"}l{t.m=0;p b}}t.1g(t.m,e)},1g:9(e,n,r){h i=c,s;7(i.1E){p b}7(A i.6.1Y==="9"){i.6.1Y.R(c,[i.$k])}7(e>=i.D){e=i.D}l 7(e<=0){e=0}i.m=i.d.m=e;7(i.6.2o!==b&&r!=="4e"&&i.6.q===1&&i.F.1x===j){i.1t(0);7(i.F.1x===j){i.1L(i.J[e])}l{i.1r(i.J[e],1)}i.2r();i.4l();p b}s=i.J[e];7(i.F.1x===j){i.1T=b;7(n===j){i.1t("1w");t.1c(9(){i.1T=j},i.6.1w)}l 7(n==="2k"){i.1t(i.6.2v);t.1c(9(){i.1T=j},i.6.2v)}l{i.1t("1m");t.1c(9(){i.1T=j},i.6.1m)}i.1L(s)}l{7(n===j){i.1r(s,i.6.1w)}l 7(n==="2k"){i.1r(s,i.6.2v)}l{i.1r(s,i.6.1m)}}i.2r()},2g:9(e){h t=c;7(A t.6.1Y==="9"){t.6.1Y.R(c,[t.$k])}7(e>=t.D||e===-1){e=t.D}l 7(e<=0){e=0}t.1t(0);7(t.F.1x===j){t.1L(t.J[e])}l{t.1r(t.J[e],1)}t.m=t.d.m=e;t.2r()},2r:9(){h e=c;e.26.2D(e.m);e.13=e.d.13=e.26[e.26.N-2];e.26.5f(0);7(e.13!==e.m){e.35();e.3e();e.2l();7(e.6.O!==b){e.3j()}}7(A e.6.3y==="9"&&e.13!==e.m){e.6.3y.R(c,[e.$k])}},X:9(){h e=c;e.3A="X";t.18(e.1C)},3j:9(){h e=c;7(e.3A!=="X"){e.19()}},19:9(){h e=c;e.3A="19";7(e.6.O===b){p b}t.18(e.1C);e.1C=t.4d(9(){e.U(j)},e.6.O)},1t:9(e){h t=c;7(e==="1m"){t.$K.z(t.2z(t.6.1m))}l 7(e==="1w"){t.$K.z(t.2z(t.6.1w))}l 7(A e!=="2Y"){t.$K.z(t.2z(e))}},2z:9(e){p{"-1G-1a":"2C "+e+"1z 2s","-1W-1a":"2C "+e+"1z 2s","-o-1a":"2C "+e+"1z 2s",1a:"2C "+e+"1z 2s"}},3H:9(){p{"-1G-1a":"","-1W-1a":"","-o-1a":"",1a:""}},3I:9(e){p{"-1G-P":"1i("+e+"V, C, C)","-1W-P":"1i("+e+"V, C, C)","-o-P":"1i("+e+"V, C, C)","-1z-P":"1i("+e+"V, C, C)",P:"1i("+e+"V, C,C)"}},1L:9(e){h t=c;t.$K.z(t.3I(e))},3L:9(e){h t=c;t.$K.z({T:e})},1r:9(e,t){h n=c;n.29=b;n.$K.X(j,j).4b({T:e},{54:t||n.6.1m,3M:9(){n.29=j}})},4E:9(){h e=c,r="1i(C, C, C)",i=n.56("L"),s,o,u,a;i.2w.3O="  -1W-P:"+r+"; -1z-P:"+r+"; -o-P:"+r+"; -1G-P:"+r+"; P:"+r;s=/1i\\(C, C, C\\)/g;o=i.2w.3O.5i(s);u=o!==14&&o.N===1;a="5z"38 t||t.5Q.4P;e.F={1x:u,15:a}},4q:9(){h e=c;7(e.6.27!==b||e.6.1U!==b){e.3Q();e.3R()}},4C:9(){h e=c,t=["s","e","x"];e.16={};7(e.6.27===j&&e.6.1U===j){t=["2X.d 21.d","2N.d 3U.d","2n.d 3V.d 28.d"]}l 7(e.6.27===b&&e.6.1U===j){t=["2X.d","2N.d","2n.d 3V.d"]}l 7(e.6.27===j&&e.6.1U===b){t=["21.d","3U.d","28.d"]}e.16.3W=t[0];e.16.2K=t[1];e.16.2J=t[2]},3R:9(){h t=c;t.$k.w("5y.d",9(e){e.1l()});t.$k.w("21.3X",9(t){p e(t.1d).2m("5C, 5E, 5F, 5N")})},3Q:9(){9 s(e){7(e.2b!==W){p{x:e.2b[0].2c,y:e.2b[0].41}}7(e.2b===W){7(e.2c!==W){p{x:e.2c,y:e.41}}7(e.2c===W){p{x:e.52,y:e.53}}}}9 o(t){7(t==="w"){e(n).w(r.16.2K,a);e(n).w(r.16.2J,f)}l 7(t==="Q"){e(n).Q(r.16.2K);e(n).Q(r.16.2J)}}9 u(n){h u=n.3h||n||t.3g,a;7(u.5a===3){p b}7(r.E<=r.6.q){p}7(r.29===b&&!r.6.3f){p b}7(r.1T===b&&!r.6.3f){p b}7(r.6.O!==b){t.18(r.1C)}7(r.F.15!==j&&!r.$K.1I("3b")){r.$K.I("3b")}r.11=0;r.Y=0;e(c).z(r.3H());a=e(c).2h();i.2S=a.T;i.2R=s(u).x-a.T;i.2P=s(u).y-a.5o;o("w");i.2j=b;i.2L=u.1d||u.4c}9 a(o){h u=o.3h||o||t.3g,a,f;r.11=s(u).x-i.2R;r.2I=s(u).y-i.2P;r.Y=r.11-i.2S;7(A r.6.2E==="9"&&i.3C!==j&&r.Y!==0){i.3C=j;r.6.2E.R(r,[r.$k])}7((r.Y>8||r.Y<-8)&&r.F.15===j){7(u.1l!==W){u.1l()}l{u.5L=b}i.2j=j}7((r.2I>10||r.2I<-10)&&i.2j===b){e(n).Q("2N.d")}a=9(){p r.Y/5};f=9(){p r.3z+r.Y/5};r.11=1F.3v(1F.3Y(r.11,a()),f());7(r.F.1x===j){r.1L(r.11)}l{r.3L(r.11)}}9 f(n){h s=n.3h||n||t.3g,u,a,f;s.1d=s.1d||s.4c;i.3C=b;7(r.F.15!==j){r.$K.Z("3b")}7(r.Y<0){r.1y=r.d.1y="T"}l{r.1y=r.d.1y="3i"}7(r.Y!==0){u=r.4j();r.1g(u,b,"4e");7(i.2L===s.1d&&r.F.15!==j){e(s.1d).w("3a.4k",9(t){t.4S();t.4T();t.1l();e(t.1d).Q("3a.4k")});a=e.4N(s.1d,"4V").3a;f=a.4W();a.4X(0,0,f)}}o("Q")}h r=c,i={2R:0,2P:0,4Y:0,2S:0,2h:14,4Z:14,50:14,2j:14,51:14,2L:14};r.29=j;r.$k.w(r.16.3W,".d-1p",u)},4j:9(){h e=c,t=e.4m();7(t>e.D){e.m=e.D;t=e.D}l 7(e.11>=0){t=0;e.m=0}p t},4m:9(){h t=c,n=t.6.12===j?t.3E:t.J,r=t.11,i=14;e.2f(n,9(s,o){7(r-t.M/20>n[s+1]&&r-t.M/20<o&&t.34()==="T"){i=o;7(t.6.12===j){t.m=e.4p(i,t.J)}l{t.m=s}}l 7(r+t.M/20<o&&r+t.M/20>(n[s+1]||n[s]-t.M)&&t.34()==="3i"){7(t.6.12===j){i=n[s+1]||n[n.N-1];t.m=e.4p(i,t.J)}l{i=n[s+1];t.m=s+1}}});p t.m},34:9(){h e=c,t;7(e.Y<0){t="3i";e.3u="U"}l{t="T";e.3u="1n"}p t},4A:9(){h e=c;e.$k.w("d.U",9(){e.U()});e.$k.w("d.1n",9(){e.1n()});e.$k.w("d.19",9(t,n){e.6.O=n;e.19();e.32="19"});e.$k.w("d.X",9(){e.X();e.32="X"});e.$k.w("d.1g",9(t,n){e.1g(n)});e.$k.w("d.2g",9(t,n){e.2g(n)})},2p:9(){h e=c;7(e.6.2p===j&&e.F.15!==j&&e.6.O!==b){e.$k.w("57",9(){e.X()});e.$k.w("58",9(){7(e.32!=="X"){e.19()}})}},1Z:9(){h t=c,n,r,i,s,o;7(t.6.1Z===b){p b}1A(n=0;n<t.E;n+=1){r=e(t.$G[n]);7(r.v("d-1e")==="1e"){4s}i=r.v("d-1K");s=r.17(".5b");7(A s.v("1J")!=="2Y"){r.v("d-1e","1e");4s}7(r.v("d-1e")===W){s.3K();r.I("4u").v("d-1e","5e")}7(t.6.4v===j){o=i>=t.m}l{o=j}7(o&&i<t.m+t.6.q&&s.N){t.4w(r,s)}}},4w:9(e,n){9 o(){e.v("d-1e","1e").Z("4u");n.5h("v-1J");7(r.6.4x==="4y"){n.5j(5k)}l{n.3J()}7(A r.6.2T==="9"){r.6.2T.R(c,[r.$k])}}9 u(){i+=1;7(r.2Q(n.3l(0))||s===j){o()}l 7(i<=2q){t.1c(u,2q)}l{o()}}h r=c,i=0,s;7(n.5p("5q")==="5r"){n.z("5s-5t","5u("+n.v("1J")+")");s=j}l{n[0].1J=n.v("1J")}u()},1B:9(){9 s(){h r=e(n.$G[n.m]).2G();n.1H.z("2G",r+"V");7(!n.1H.1I("1B")){t.1c(9(){n.1H.I("1B")},0)}}9 o(){i+=1;7(n.2Q(r.3l(0))){s()}l 7(i<=2q){t.1c(o,2q)}l{n.1H.z("2G","")}}h n=c,r=e(n.$G[n.m]).17("5w"),i;7(r.3l(0)!==W){i=0;o()}l{s()}},2Q:9(e){h t;7(!e.3M){p b}t=A e.4D;7(t!=="W"&&e.4D===0){p b}p j},4g:9(){h t=c,n;7(t.6.2F===j){t.$G.Z("2d")}t.1D=[];1A(n=t.m;n<t.m+t.6.q;n+=1){t.1D.2D(n);7(t.6.2F===j){e(t.$G[n]).I("2d")}}t.d.1D=t.1D},4n:9(e){h t=c;t.4G="d-"+e+"-5B";t.4H="d-"+e+"-38"},4l:9(){9 a(e){p{2h:"5D",T:e+"V"}}h e=c,t=e.4G,n=e.4H,r=e.$G.1S(e.m),i=e.$G.1S(e.13),s=1F.4J(e.J[e.m])+e.J[e.13],o=1F.4J(e.J[e.m])+e.M/2,u="5G 5H 5I 5J";e.1E=j;e.$K.I("d-1P").z({"-1G-P-1P":o+"V","-1W-4K-1P":o+"V","4K-1P":o+"V"});i.z(a(s,10)).I(t).w(u,9(){e.3m=j;i.Q(u);e.31(i,t)});r.I(n).w(u,9(){e.36=j;r.Q(u);e.31(r,n)})},31:9(e,t){h n=c;e.z({2h:"",T:""}).Z(t);7(n.3m&&n.36){n.$K.Z("d-1P");n.3m=b;n.36=b;n.1E=b}},4o:9(){h e=c;e.d={2A:e.2A,5P:e.$k,S:e.$S,G:e.$G,m:e.m,13:e.13,1D:e.1D,15:e.F.15,F:e.F,1y:e.1y}},3G:9(){h r=c;r.$k.Q(".d d 21.3X");e(n).Q(".d d");e(t).Q("44",r.3d)},1V:9(){h e=c;7(e.$k.25().N!==0){e.$K.3r();e.$S.3r().3r();7(e.B){e.B.3k()}}e.3G();e.$k.2x("2w",e.$k.v("d-4I")||"").2x("H",e.$k.v("d-4F"))},5T:9(){h e=c;e.X();t.18(e.1X);e.1V();e.$k.5U()},5V:9(t){h n=c,r=e.4M({},n.2A,t);n.1V();n.1N(r,n.$k)},5W:9(e,t){h n=c,r;7(!e){p b}7(n.$k.25().N===0){n.$k.1o(e);n.23();p b}n.1V();7(t===W||t===-1){r=-1}l{r=t}7(r>=n.$S.N||r===-1){n.$S.1S(-1).5X(e)}l{n.$S.1S(r).5Y(e)}n.23()},5Z:9(e){h t=c,n;7(t.$k.25().N===0){p b}7(e===W||e===-1){n=-1}l{n=e}t.1V();t.$S.1S(n).3k();t.23()}};e.37.2B=9(t){p c.2f(9(){7(e(c).v("d-1N")===j){p b}e(c).v("d-1N",j);h n=3c.3q(r);n.1N(t,c);e.v(c,"2B",n)})};e.37.2B.6={q:5,1h:b,1s:[60,4],1O:[61,3],22:[62,2],1Q:b,1R:[63,1],48:b,46:b,1m:2M,1w:64,2v:65,O:b,2p:b,2a:b,2U:["1n","U"],2e:j,12:b,1v:j,39:b,2Z:j,45:2M,47:t,1M:"d-66",2i:"d-2i",1Z:b,4v:j,4x:"4y",1B:b,2O:b,33:b,3f:j,27:j,1U:j,2F:b,2o:b,3B:b,3D:b,2H:b,3s:b,1Y:b,3y:b,3w:b,2E:b,2T:b}})(67,68,69)',62,382,'||||||options|if||function||false|this|owl||||var||true|elem|else|currentItem|||return|items|||||data|on|||css|typeof|owlControls|0px|maximumItem|itemsAmount|browser|owlItems|class|addClass|positionsInArray|owlWrapper|div|itemWidth|length|autoPlay|transform|off|apply|userItems|left|next|px|undefined|stop|newRelativeX|removeClass||newPosX|scrollPerPage|prevItem|null|isTouch|ev_types|find|clearInterval|play|transition|disabled|setTimeout|target|loaded|width|goTo|itemsCustom|translate3d|page|paginationWrapper|preventDefault|slideSpeed|prev|append|wrapper|buttonNext|css2slide|itemsDesktop|swapSpeed|buttonPrev|pagination|paginationSpeed|support3d|dragDirection|ms|for|autoHeight|autoPlayInterval|visibleItems|isTransition|Math|webkit|wrapperOuter|hasClass|src|item|transition3d|baseClass|init|itemsDesktopSmall|origin|itemsTabletSmall|itemsMobile|eq|isCss3Finish|touchDrag|unWrap|moz|checkVisible|beforeMove|lazyLoad||mousedown|itemsTablet|setVars|roundPages|children|prevArr|mouseDrag|mouseup|isCssFinish|navigation|touches|pageX|active|rewindNav|each|jumpTo|position|theme|sliding|rewind|eachMoveUpdate|is|touchend|transitionStyle|stopOnHover|100|afterGo|ease|orignalItems|opacity|rewindSpeed|style|attr|html|addCssSpeed|userOptions|owlCarousel|all|push|startDragging|addClassActive|height|beforeInit|newPosY|end|move|targetElement|200|touchmove|jsonPath|offsetY|completeImg|offsetX|relativePos|afterLazyLoad|navigationText|updateItems|calculateAll|touchstart|string|responsive|updateControls|clearTransStyle|hoverStatus|jsonSuccess|moveDirection|checkPagination|endCurrent|fn|in|paginationNumbers|click|grabbing|Object|resizer|checkNavigation|dragBeforeAnimFinish|event|originalEvent|right|checkAp|remove|get|endPrev|visible|watchVisibility|Number|create|unwrap|afterInit|logIn|playDirection|max|afterAction|updateVars|afterMove|maximumPixels|apStatus|beforeUpdate|dragging|afterUpdate|pagesInArray|reload|clearEvents|removeTransition|doTranslate|show|hide|css2move|complete|span|cssText|updatePagination|gestures|disabledEvents|buildButtons|buildPagination|mousemove|touchcancel|start|disableTextSelect|min|loops|calculateWidth|pageY|appendWrapperSizes|appendItemsSizes|resize|responsiveRefreshRate|itemsScaleUp|responsiveBaseWidth|singleItem|outer|wrap|animate|srcElement|setInterval|drag|updatePosition|onVisibleItems|block|display|getNewPosition|disable|singleItemTransition|closestItem|transitionTypes|owlStatus|inArray|moveEvents|response|continue|buildControls|loading|lazyFollow|lazyPreload|lazyEffect|fade|onStartup|customEvents|wrapItems|eventTypes|naturalWidth|checkBrowser|originalClasses|outClass|inClass|originalStyles|abs|perspective|loadContent|extend|_data|round|msMaxTouchPoints|5e3|text|stopImmediatePropagation|stopPropagation|buttons|events|pop|splice|baseElWidth|minSwipe|maxSwipe|dargging|clientX|clientY|duration|destroyControls|createElement|mouseover|mouseout|numbers|which|lazyOwl|appendTo|clearTimeout|checked|shift|sort|removeAttr|match|fadeIn|400|clickable|toggleClass|wrapAll|top|prop|tagName|DIV|background|image|url|wrapperWidth|img|500|dragstart|ontouchstart|controls|out|input|relative|textarea|select|webkitAnimationEnd|oAnimationEnd|MSAnimationEnd|animationend|getJSON|returnValue|hasOwnProperty|option|onstartup|baseElement|navigator|new|prototype|destroy|removeData|reinit|addItem|after|before|removeItem|1199|979|768|479|800|1e3|carousel|jQuery|window|document'.split('|'),0,{}))

		}

// var expireDateStr = "07/15/2019";//mm/dd/yyyy
// var expireDateArr = expireDateStr.split("/");
// var expireDate = new Date(parseInt(expireDateArr[2]), parseInt(expireDateArr[0]-1), parseInt(expireDateArr[1]));
// var todayDate = new Date();
// if (todayDate > expireDate) {
   // $("body").html("the plugin trial version has been expired.");
	// return true;
// };
// if((location.hostname!="127.0.0.1" || document.domain!="127.0.0.1") && (location.hostname!="panotools.eu") && (location.hostname!="krpano.com" || document.domain!="krpano.com"))
// {
	// $("body").html("");
	// return true;
// }
		
		var theme = (plugin.theme==null || plugin.theme.toLowerCase()!="light"?false:true)
		
		
		// var background_color = (plugin.background_color==null || plugin.background_color=="#1e1e1e" || plugin.background_color=="0x1e1e1e" ?false:plugin.background_color);
		var background_color = (plugin.background_color==null || plugin.background_color=="" || plugin.background_color=="#1e1e1e" || plugin.background_color=="0x1e1e1e"?false:plugin.background_color.replace("0x", "").replace("0X", ""));
		var background_alpha = (plugin.background_alpha==null || plugin.background_alpha==""?"0.9":plugin.background_alpha);
		
		if(plugin.background_color=="#1e1e1e" && plugin.background_alpha!=null && plugin.background_alpha!="" ){var background_color = "1e1e1e";var hex = hexToRgb(background_color);if(hex==null){background_color="";}else{background_color="rgba(" + hex.r + "," + hex.g + "," + hex.b + "," + background_alpha + ")";}}
		else if(background_color!="" && background_color!=false){var hex = hexToRgb(background_color);if(hex==null){background_color="";}else{background_color="rgba(" + hex.r + "," + hex.g + "," + hex.b + "," + background_alpha + ")";}}
		
		var onInitialized = (plugin.oninitialized==null || plugin.oninitialized==""?false:plugin.oninitialized);
		file_path = (plugin.file_path==null || plugin.file_path==""?"":plugin.file_path);
		var krpano_id = (plugin.krpano_id==null || plugin.krpano_id==""?false:plugin.krpano_id);



		/* ------------------------------------------------------------------------------------------------------ */
		/* ------------------------------------------------------------------------------------------------------ */
		plugin_font_name = (plugin.plugin_font_name==null || plugin.plugin_font_name==""?"":"font-family:" + plugin.plugin_font_name + ";");
		info_box_style_font_name = (plugin.info_box_style_font_name==null || plugin.info_box_style_font_name==""?"":"font-family:" + plugin.info_box_style_font_name + ";");
		if(plugin.info_box_style_font_size==null || plugin.info_box_style_font_size=="")
			info_box_style_font_size = "";
		else if($.isNumeric(plugin.info_box_style_font_size))
			info_box_style_font_size = "font-size:" + plugin.info_box_style_font_size + "px;";
		else
			info_box_style_font_size = "font-size:" + plugin.info_box_style_font_size + ";";

		info_box_style_image_width = (plugin.info_box_style_image_width==null || plugin.info_box_style_image_width==""?"80px":plugin.info_box_style_image_width + "px");

		info_box_style_title_color = (plugin.info_box_style_title_color==null || plugin.info_box_style_title_color==""?"000000":plugin.info_box_style_title_color.replace("0x", "").replace("0X", ""));

		info_box_style_bg_color = (plugin.info_box_style_bg_color==null || plugin.info_box_style_bg_color==""?"ffffff":plugin.info_box_style_bg_color.replace("0x", "").replace("0X", ""));
		info_box_style_bg_alpha = (plugin.info_box_style_bg_alpha==null || plugin.info_box_style_bg_alpha==""?"1":plugin.info_box_style_bg_alpha);
		if(info_box_style_bg_color!=""){var hex = hexToRgb(info_box_style_bg_color);if(hex==null){info_box_style_bg_color="";}else{info_box_style_bg_color="rgba(" + hex.r + "," + hex.g + "," + hex.b + "," + info_box_style_bg_alpha + ")";}}

		info_box_style_text_color = (plugin.info_box_style_text_color==null || plugin.info_box_style_text_color==""?"000000":plugin.info_box_style_text_color.replace("0x", "").replace("0X", ""));
		info_box_style_title_border_color = info_box_style_text_color;
		if(info_box_style_title_border_color!=""){var hex = hexToRgb(info_box_style_title_border_color);if(hex==null){info_box_style_title_border_color="";}else{info_box_style_title_border_color="rgba(" + hex.r + "," + hex.g + "," + hex.b + ",0.5)";}}

		info_box_style_btn_bg_color = (plugin.info_box_style_btn_bg_color==null || plugin.info_box_style_btn_bg_color==""?"000000":plugin.info_box_style_btn_bg_color.replace("0x", "").replace("0X", ""));
		info_box_style_btn_bg_alpha = (plugin.info_box_style_btn_bg_alpha==null || plugin.info_box_style_btn_bg_alpha==""?"1":plugin.info_box_style_btn_bg_alpha);
		if(info_box_style_btn_bg_color!=""){var hex = hexToRgb(info_box_style_btn_bg_color);if(hex==null){info_box_style_btn_bg_color="";}else{info_box_style_btn_bg_color="rgba(" + hex.r + "," + hex.g + "," + hex.b + "," + info_box_style_btn_bg_alpha + ")";}}
		info_box_style_btn_text = (plugin.info_box_style_btn_text==null || plugin.info_box_style_btn_text==""?false:plugin.info_box_style_btn_text);
		
		info_box_style_btn_text_color = (plugin.info_box_style_btn_text_color==null || plugin.info_box_style_btn_text_color==""?"ffffff":plugin.info_box_style_btn_text_color.replace("0x", "").replace("0X", ""));
		/* ------------------------------------------------------------------------------------------------------ */
		/* ------------------------------------------------------------------------------------------------------ */


        apply_blur		= (plugin.apply_blur!=null && plugin.apply_blur.toLowerCase()=="true"?true:false);
        stop_autorotate	= (plugin.stop_autorotate!=null && plugin.stop_autorotate.toLowerCase()=="true"?true:false);
        //info_box_style	= (plugin.info_box_style!=null && (plugin.info_box_style.toLowerCase()=="style_2" || plugin.info_box_style.toLowerCase()=="style_3" || plugin.info_box_style.toLowerCase()=="style_4" || plugin.info_box_style.toLowerCase()=="style_5")?plugin.info_box_style.toLowerCase():"style_1");
		set_infobox_style(plugin.info_box_style);
		
		// console.log("apply_blur : " + apply_blur);
		// console.log("stop_autorotate : " + stop_autorotate);
		// console.log("stop_autorotate : " + plugin.stop_autorotate.toLowerCase());
		
		// say hello
		krpano.trace(1,plugin_version);
		
		krpano.call("addlayer(" + random + ")");
		krpano.call("set(layer[" + random + "].keep,true);");
		var plugin_element = krpano.get("plugin[" + random + "].sprite");
		$(plugin_element).addClass(random);
		if(krpano_id!=false && $('#' + krpano_id).length!=0)
			krpano_parent = $("." + random).closest('[id=' + krpano_id + ']');
		else if($("." + random).closest('[id^=krpanoSWFOb]').length!=0)
			krpano_parent = $("." + random).closest('[id^=krpanoSWFOb]');
		else
			krpano_parent = $("body");
		
		// if($("#krpanoSWFObject > div div:contains('old license')").length==0)
		// if(krpano_parent.find("div div:contains('Ali Husayni')").length==0)
		if(vr_support && krpano_parent.find("div div:contains('old license')").length==0)
		{
			//(old license)
			//console.log(krpano.get("plugin[EASY_HTML_LIGHTBOX___pp_blur].url2"));
			krpano.set("plugin[EASY_HTML_LIGHTBOX___pp_blur].url",krpano.get("plugin[EASY_HTML_LIGHTBOX___pp_blur].url2"));
			krpano.set("plugin[EASY_HTML_LIGHTBOX___pp_blur].enabled","true");
			//console.log(krpano.get("plugin[EASY_HTML_LIGHTBOX___pp_blur].url"));
			blur_support = true;
		}
		else
			blur_support = true;

		
		if(plugin.include_reset==null || plugin.include_reset.toLowerCase()!="false")
		{
			var style = "<style>";
			style 	 += "/*-------------- reset ------------------ */";
			// style 	 += "*{-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}input,textarea,select{-webkit-touch-callout:text;-webkit-user-select:text;-khtml-user-select:text;-moz-user-select:text;-ms-user-select:text;user-select:text}html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,font,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend{margin:0;padding:0;border:0;outline:0;vertical-align:baseline;background:transparent;box-sizing: border-box;}table,caption,tbody,tfoot,thead,tr,th,td{margin:0;outline:0;vertical-align:baseline;background:transparent}th,td{vertical-align:top}div{position:relative}h1,h2,h3,h4,h5,h6,th,td,caption{font-weight:normal}.rtl input,.rtl textarea,.rtl select{direction:rtl}a{text-decoration:none}input{-webkit-appearance:none;-moz-appearance:none;appearance:none}*{font-family:'Roboto',sans-serif}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}*::-moz-focus-inner,*::-o-focus-inner{border:0}";
			// style 	 += "@-ms-viewport { width:device-width; }.info_box_iframe {position: absolute;left: 0;top: 0;width: 100%;height: 100%;padding: 0;margin: 0;}html { height:100%; }body { height:100%; overflow:hidden; margin:0; padding:0;}";
			style 	 += "#pano{width:100%;height:100%;position:absolute;top:0;left:0;width:100%;height:100%;}";
			style 	 += ".htmllightbox-content {color: #000000;}";
			style 	 += ".htmllightbox-navigation {height: 100%;}";
			style 	 += "</style>";
			$('head').prepend(style);
		}
		if(plugin.include_htmllightbox==null || plugin.include_htmllightbox.toLowerCase()!="false")
		{
			style	  = "<style>";
			if(plugin_font_name)
				style 	 += '.htmllightbox-container *{' + plugin_font_name + '}';
			style 	 += "/*-------------- jquery.htmllightbox.min.css ------------------ */";
			style 	 += 'body.compensate-for-scrollbar{overflow:hidden}.htmllightbox-is-hidden{left:-9999px;margin:0;position:absolute!important;top:-9999px;visibility:hidden}.htmllightbox-container{-webkit-backface-visibility:hidden;height:100%;left:0;outline:none;position:fixed;-webkit-tap-highlight-color:transparent;top:0;-ms-touch-action:manipulation;touch-action:manipulation;transform:translateZ(0);width:100%;z-index:99992}.htmllightbox-container *{box-sizing:border-box}.htmllightbox-bg,.htmllightbox-inner,.htmllightbox-outer,.htmllightbox-stage{bottom:0;left:0;position:absolute;right:0;top:0}.htmllightbox-outer{-webkit-overflow-scrolling:touch;overflow-y:auto}.htmllightbox-bg{background:#1e1e1e;opacity:0;transition-duration:inherit;transition-property:opacity;transition-timing-function:cubic-bezier(.47,0,.74,.71)}.htmllightbox-is-open .htmllightbox-bg{opacity:.9;transition-timing-function:cubic-bezier(.22,.61,.36,1)}.htmllightbox-caption,.htmllightbox-infobar,.htmllightbox-navigation .htmllightbox-button,.htmllightbox-toolbar{direction:ltr;opacity:0;position:absolute;transition:opacity .25s ease,visibility 0s ease .25s;visibility:hidden;z-index:99997}.htmllightbox-show-caption .htmllightbox-caption,.htmllightbox-show-infobar .htmllightbox-infobar,.htmllightbox-show-nav .htmllightbox-navigation .htmllightbox-button,.htmllightbox-show-toolbar .htmllightbox-toolbar{opacity:1;transition:opacity .25s ease 0s,visibility 0s ease 0s;visibility:visible}.htmllightbox-infobar{color:#ccc;font-size:13px;-webkit-font-smoothing:subpixel-antialiased;height:44px;left:0;line-height:44px;min-width:44px;mix-blend-mode:difference;padding:0 10px;pointer-events:none;top:0;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.htmllightbox-toolbar{right:0;top:0}.htmllightbox-stage{direction:ltr;overflow:visible;transform:translateZ(0);z-index:99994}.htmllightbox-is-open .htmllightbox-stage{overflow:hidden}.htmllightbox-slide{-webkit-backface-visibility:hidden;display:none;height:100%;left:0;outline:none;overflow:auto;-webkit-overflow-scrolling:touch;padding:44px;position:absolute;text-align:center;top:0;transition-property:transform,opacity;white-space:normal;width:100%;z-index:99994}.htmllightbox-slide:before{content:"";display:inline-block;font-size:0;height:100%;vertical-align:middle;width:0}.htmllightbox-is-sliding .htmllightbox-slide,.htmllightbox-slide--current,.htmllightbox-slide--next,.htmllightbox-slide--previous{display:block}.htmllightbox-slide--image{overflow:hidden;padding:44px 0}.htmllightbox-slide--image:before{display:none}.htmllightbox-slide--html{padding:6px}.htmllightbox-content{background:#fff;display:inline-block;margin:0;max-width:100%;overflow:auto;-webkit-overflow-scrolling:touch;padding:44px;position:relative;text-align:left;vertical-align:middle}.htmllightbox-slide--image .htmllightbox-content{animation-timing-function:cubic-bezier(.5,0,.14,1);-webkit-backface-visibility:hidden;background:transparent;background-repeat:no-repeat;background-size:100% 100%;left:0;max-width:none;overflow:visible;padding:0;position:absolute;top:0;transform-origin:top left;transition-property:transform,opacity;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:99995}.htmllightbox-can-zoomOut .htmllightbox-content{cursor:zoom-out}.htmllightbox-can-zoomIn .htmllightbox-content{cursor:zoom-in}.htmllightbox-can-pan .htmllightbox-content,.htmllightbox-can-swipe .htmllightbox-content{cursor:grab}.htmllightbox-is-grabbing .htmllightbox-content{cursor:grabbing}.htmllightbox-container [data-selectable=true]{cursor:text}.htmllightbox-image,.htmllightbox-spaceball{background:transparent;border:0;height:100%;left:0;margin:0;max-height:none;max-width:none;padding:0;position:absolute;top:0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;width:100%}.htmllightbox-spaceball{z-index:1}.htmllightbox-slide--iframe .htmllightbox-content,.htmllightbox-slide--map .htmllightbox-content,.htmllightbox-slide--pdf .htmllightbox-content,.htmllightbox-slide--video .htmllightbox-content{height:100%;overflow:visible;padding:0;width:100%}.htmllightbox-slide--video .htmllightbox-content{background:#000}.htmllightbox-slide--map .htmllightbox-content{background:#e5e3df}';
			style 	 += '.htmllightbox-slide--iframe .htmllightbox-content{background:#ffffff}';
			style 	 += '.htmllightbox-iframe,.htmllightbox-video{background:transparent;border:0;display:block;height:100%;margin:0;overflow:hidden;padding:0;width:100%}.htmllightbox-iframe{left:0;position:absolute;top:0}.htmllightbox-error{background:#fff;cursor:default;max-width:400px;padding:40px;width:100%}.htmllightbox-error p{color:#444;font-size:16px;line-height:20px;margin:0;padding:0}.htmllightbox-button{background:rgba(30,30,30,.6);border:0;border-radius:0;box-shadow:none;cursor:pointer;display:inline-block;height:44px;margin:0;padding:10px;position:relative;transition:color .2s;vertical-align:top;visibility:inherit;width:44px}.htmllightbox-button,.htmllightbox-button:link,.htmllightbox-button:visited{color:#ccc}.htmllightbox-button:hover{color:#fff}.htmllightbox-button:focus{outline:none}.htmllightbox-button.htmllightbox-focus{outline:1px dotted}.htmllightbox-button[disabled],.htmllightbox-button[disabled]:hover{color:#888;cursor:default;outline:none}.htmllightbox-button div{height:100%}.htmllightbox-button svg{display:block;height:100%;overflow:visible;position:relative;width:100%;}.htmllightbox-button svg path{fill:currentColor;stroke-width:0}.htmllightbox-button--fsenter svg:nth-child(2),.htmllightbox-button--fsexit svg:first-child,.htmllightbox-button--pause svg:first-child,.htmllightbox-button--play svg:nth-child(2){display:none}.htmllightbox-progress{background:#ff5268;height:2px;left:0;position:absolute;right:0;top:0;transform:scaleX(0);transform-origin:0;transition-property:transform;transition-timing-function:linear;z-index:99998}.htmllightbox-close-small{background:transparent;border:0;border-radius:0;color:#ccc;cursor:pointer;opacity:.8;padding:8px;position:absolute;right:-12px;top:-44px;z-index:401}.htmllightbox-close-small:hover{color:#fff;opacity:1}.htmllightbox-slide--html .htmllightbox-close-small{color:currentColor;padding:10px;right:0;top:0;cursor:pointer !important;}.htmllightbox-slide--html .htmllightbox-close-small svg{cursor:pointer !important;}.htmllightbox-slide--image.htmllightbox-is-scaling .htmllightbox-content{overflow:hidden}.htmllightbox-is-scaling .htmllightbox-close-small,.htmllightbox-is-zoomable.htmllightbox-can-pan .htmllightbox-close-small{display:none}.htmllightbox-navigation .htmllightbox-button{background-clip:content-box;height:100px;opacity:0;position:absolute;top:calc(50% - 50px);width:70px}.htmllightbox-navigation .htmllightbox-button div{padding:7px}.htmllightbox-navigation .htmllightbox-button--arrow_left{left:0;left:env(safe-area-inset-left);padding:31px 26px 31px 6px}.htmllightbox-navigation .htmllightbox-button--arrow_right{padding:31px 6px 31px 26px;right:0;right:env(safe-area-inset-right)}.htmllightbox-caption{background:linear-gradient(0deg,rgba(0,0,0,.85) 0,rgba(0,0,0,.3) 50%,rgba(0,0,0,.15) 65%,rgba(0,0,0,.075) 75.5%,rgba(0,0,0,.037) 82.85%,rgba(0,0,0,.019) 88%,transparent);bottom:0;color:#eee;font-size:14px;font-weight:400;left:0;line-height:1.5;padding:75px 44px 25px;pointer-events:none;right:0;text-align:center;z-index:99996}@supports (padding:max(0px)){.htmllightbox-caption{padding:75px max(44px,env(safe-area-inset-right)) max(25px,env(safe-area-inset-bottom)) max(44px,env(safe-area-inset-left))}}.htmllightbox-caption--separate{margin-top:-50px}.htmllightbox-caption__body{max-height:50vh;overflow:auto;pointer-events:all}.htmllightbox-caption a,.htmllightbox-caption a:link,.htmllightbox-caption a:visited{color:#ccc;text-decoration:none}.htmllightbox-caption a:hover{color:#fff;text-decoration:underline}.htmllightbox-loading{animation:a 1s linear infinite;background:transparent;border:4px solid #888;border-bottom-color:#fff;border-radius:50%;height:50px;left:50%;margin:-25px 0 0 -25px;opacity:.7;padding:0;position:absolute;top:50%;width:50px;z-index:99999}@keyframes a{to{transform:rotate(1turn)}}.htmllightbox-animated{transition-timing-function:cubic-bezier(0,0,.25,1)}.htmllightbox-fx-slide.htmllightbox-slide--previous{opacity:0;transform:translate3d(-100%,0,0)}.htmllightbox-fx-slide.htmllightbox-slide--next{opacity:0;transform:translate3d(100%,0,0)}.htmllightbox-fx-slide.htmllightbox-slide--current{opacity:1;transform:translateZ(0)}.htmllightbox-fx-fade.htmllightbox-slide--next,.htmllightbox-fx-fade.htmllightbox-slide--previous{opacity:0;transition-timing-function:cubic-bezier(.19,1,.22,1)}.htmllightbox-fx-fade.htmllightbox-slide--current{opacity:1}.htmllightbox-fx-zoom-in-out.htmllightbox-slide--previous{opacity:0;transform:scale3d(1.5,1.5,1.5)}.htmllightbox-fx-zoom-in-out.htmllightbox-slide--next{opacity:0;transform:scale3d(.5,.5,.5)}.htmllightbox-fx-zoom-in-out.htmllightbox-slide--current{opacity:1;transform:scaleX(1)}.htmllightbox-fx-rotate.htmllightbox-slide--previous{opacity:0;transform:rotate(-1turn)}.htmllightbox-fx-rotate.htmllightbox-slide--next{opacity:0;transform:rotate(1turn)}.htmllightbox-fx-rotate.htmllightbox-slide--current{opacity:1;transform:rotate(0deg)}.htmllightbox-fx-circular.htmllightbox-slide--previous{opacity:0;transform:scale3d(0,0,0) translate3d(-100%,0,0)}.htmllightbox-fx-circular.htmllightbox-slide--next{opacity:0;transform:scale3d(0,0,0) translate3d(100%,0,0)}.htmllightbox-fx-circular.htmllightbox-slide--current{opacity:1;transform:scaleX(1) translateZ(0)}.htmllightbox-fx-tube.htmllightbox-slide--previous{transform:translate3d(-100%,0,0) scale(.1) skew(-10deg)}.htmllightbox-fx-tube.htmllightbox-slide--next{transform:translate3d(100%,0,0) scale(.1) skew(10deg)}.htmllightbox-fx-tube.htmllightbox-slide--current{transform:translateZ(0) scale(1)}@media (max-height:576px){.htmllightbox-slide{padding-left:6px;padding-right:6px}.htmllightbox-slide--image{padding:6px 0}.htmllightbox-close-small{right:-6px}.htmllightbox-slide--image .htmllightbox-close-small{background:#4e4e4e;color:#f2f4f6;height:36px;opacity:1;padding:6px;right:0;top:0;width:36px}.htmllightbox-caption{padding-left:12px;padding-right:12px}@supports (padding:max(0px)){.htmllightbox-caption{padding-left:max(12px,env(safe-area-inset-left));padding-right:max(12px,env(safe-area-inset-right))}}}.htmllightbox-share{background:#f4f4f4;border-radius:3px;max-width:90%;padding:30px;text-align:center}.htmllightbox-share h1{color:#222;font-size:35px;font-weight:700;margin:0 0 20px}.htmllightbox-share p{margin:0;padding:0}.htmllightbox-share__button{border:0;border-radius:3px;display:inline-block;font-size:14px;font-weight:700;line-height:40px;margin:0 5px 10px;min-width:130px;padding:0 15px;text-decoration:none;transition:all .2s;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;white-space:nowrap}.htmllightbox-share__button:link,.htmllightbox-share__button:visited{color:#fff}.htmllightbox-share__button:hover{text-decoration:none}.htmllightbox-share__button--fb{background:#3b5998}.htmllightbox-share__button--fb:hover{background:#344e86}.htmllightbox-share__button--pt{background:#bd081d}.htmllightbox-share__button--pt:hover{background:#aa0719}.htmllightbox-share__button--tw{background:#1da1f2}.htmllightbox-share__button--tw:hover{background:#0d95e8}.htmllightbox-share__button svg{height:25px;margin-right:7px;position:relative;top:-1px;vertical-align:middle;width:25px}.htmllightbox-share__button svg path{fill:#fff}.htmllightbox-share__input{background:transparent;border:0;border-bottom:1px solid #d7d7d7;border-radius:0;color:#5d5b5b;font-size:14px;margin:10px 0 0;outline:none;padding:10px 15px;width:100%}.htmllightbox-thumbs{background:#ddd;bottom:0;display:none;margin:0;-webkit-overflow-scrolling:touch;-ms-overflow-style:-ms-autohiding-scrollbar;padding:2px 2px 4px;position:absolute;right:0;-webkit-tap-highlight-color:rgba(0,0,0,0);top:0;width:212px;z-index:99995}.htmllightbox-thumbs-x{overflow-x:auto;overflow-y:hidden}.htmllightbox-show-thumbs .htmllightbox-thumbs{display:block}.htmllightbox-show-thumbs .htmllightbox-inner{right:212px}.htmllightbox-thumbs__list{font-size:0;height:100%;list-style:none;margin:0;overflow-x:hidden;overflow-y:auto;padding:0;position:absolute;position:relative;white-space:nowrap;width:100%}.htmllightbox-thumbs-x .htmllightbox-thumbs__list{overflow:hidden}.htmllightbox-thumbs-y .htmllightbox-thumbs__list::-webkit-scrollbar{width:7px}.htmllightbox-thumbs-y .htmllightbox-thumbs__list::-webkit-scrollbar-track{background:#fff;border-radius:10px;box-shadow:inset 0 0 6px rgba(0,0,0,.3)}.htmllightbox-thumbs-y .htmllightbox-thumbs__list::-webkit-scrollbar-thumb{background:#2a2a2a;border-radius:10px}.htmllightbox-thumbs__list a{-webkit-backface-visibility:hidden;backface-visibility:hidden;background-color:rgba(0,0,0,.1);background-position:50%;background-repeat:no-repeat;background-size:cover;cursor:pointer;float:left;height:75px;margin:2px;max-height:calc(100% - 8px);max-width:calc(50% - 4px);outline:none;overflow:hidden;padding:0;position:relative;-webkit-tap-highlight-color:transparent;width:100px}.htmllightbox-thumbs__list a:before{border:6px solid #ff5268;bottom:0;content:"";left:0;opacity:0;position:absolute;right:0;top:0;transition:all .2s cubic-bezier(.25,.46,.45,.94);z-index:99991}.htmllightbox-thumbs__list a:focus:before{opacity:.5}.htmllightbox-thumbs__list a.htmllightbox-thumbs-active:before{opacity:1}@media (max-width:576px){.htmllightbox-thumbs{width:110px}.htmllightbox-show-thumbs .htmllightbox-inner{right:110px}.htmllightbox-thumbs__list a{max-width:calc(100% - 10px)}}';
			style 	 += '.htmllightbox-close-small.htmllightbox-button svg{background-color: black;border-radius: 2px;}.htmllightbox-button svg path {fill: #ffffff;}';
			style 	 += '.htmllightbox-active{height: 100% !important;}';
			if(theme)
				style 	 += '.htmllightbox-bg{background:#e0e0e0;}';
			if(background_color)
			{
				style 	 += '.htmllightbox-bg{background:' + background_color + ';opacity:1 !important;}';
				style 	 += '.htmllightbox-slide--iframe .htmllightbox-content{background:' + background_color + '}';
			}
				
			style 	 += "</style>";
			$('head').append(style);
		}
		style	  = "<style id='Owl_Carousel'>";
		style 	 += "/*-------------- Owl Carousel v1.3.2 ------------------ */";
		style 	 += '.owl-carousel .owl-wrapper:after { content: "."; display: block; clear: both; visibility: hidden; line-height: 0; height: 0; } .owl-carousel{ display: none; position: relative; width: 100%; -ms-touch-action: pan-y; } .owl-carousel .owl-wrapper{ display: none; position: relative; -webkit-transform: translate3d(0px, 0px, 0px); } .owl-carousel .owl-wrapper-outer{ overflow: hidden; position: relative; width: 100%; } .owl-carousel .owl-wrapper-outer.autoHeight{ -webkit-transition: height 500ms ease-in-out; -moz-transition: height 500ms ease-in-out; -ms-transition: height 500ms ease-in-out; -o-transition: height 500ms ease-in-out; transition: height 500ms ease-in-out; }  .owl-carousel .owl-item{ float: left; } .owl-controls .owl-page, .owl-controls .owl-buttons div{ cursor: pointer; } .owl-controls { -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); }  .grabbing { cursor: ew-resize; }  .owl-carousel  .owl-wrapper, .owl-carousel  .owl-item{ -webkit-backface-visibility: hidden; -moz-backface-visibility:    hidden; -ms-backface-visibility:     hidden; -webkit-transform: translate3d(0,0,0); -moz-transform: translate3d(0,0,0); -ms-transform: translate3d(0,0,0); }    .owl-theme .owl-controls{ margin-top: 10px; text-align: center; }   .owl-theme .owl-controls .owl-buttons div{ color: #FFF; display: inline-block; zoom: 1; *display: inline; margin: 5px; padding: 3px 10px; font-size: 12px; -webkit-border-radius: 30px; -moz-border-radius: 30px; border-radius: 30px; background: #C0C0C0; filter: Alpha(Opacity=50); opacity: 0.5; } .owl-theme .owl-controls.clickable .owl-buttons div:hover{ filter: Alpha(Opacity=100); opacity: 1; text-decoration: none; }  .owl-theme .owl-controls .owl-page{ display: inline-block; zoom: 1; *display: inline; } .owl-theme .owl-controls .owl-page span{ display: block; width: 12px; height: 12px; margin: 5px 7px; filter: Alpha(Opacity=50); opacity: 0.5; -webkit-border-radius: 20px; -moz-border-radius: 20px; border-radius: 20px; background: #C0C0C0; }  .owl-theme .owl-controls .owl-page.active span, .owl-theme .owl-controls.clickable .owl-page:hover span{ filter: Alpha(Opacity=100); opacity: 1; }   .owl-theme .owl-controls .owl-page span.owl-numbers{ height: auto; width: auto; color: #FFF; padding: 2px 10px; font-size: 12px; -webkit-border-radius: 30px; -moz-border-radius: 30px; border-radius: 30px; }  .owl-item.loading{ min-height: 150px; background: url(AjaxLoader.gif) no-repeat center center }        .owl-origin { -webkit-perspective: 1200px; -webkit-perspective-origin-x : 50%; -webkit-perspective-origin-y : 50%; -moz-perspective : 1200px; -moz-perspective-origin-x : 50%; -moz-perspective-origin-y : 50%; perspective : 1200px; } .owl-fade-out { z-index: 10; -webkit-animation: fadeOut .7s both ease; -moz-animation: fadeOut .7s both ease; animation: fadeOut .7s both ease; } .owl-fade-in { -webkit-animation: fadeIn .7s both ease; -moz-animation: fadeIn .7s both ease; animation: fadeIn .7s both ease; } .owl-backSlide-out { -webkit-animation: backSlideOut 1s both ease; -moz-animation: backSlideOut 1s both ease; animation: backSlideOut 1s both ease; } .owl-backSlide-in { -webkit-animation: backSlideIn 1s both ease; -moz-animation: backSlideIn 1s both ease; animation: backSlideIn 1s both ease; } .owl-goDown-out { -webkit-animation: scaleToFade .7s ease both; -moz-animation: scaleToFade .7s ease both; animation: scaleToFade .7s ease both; } .owl-goDown-in { -webkit-animation: goDown .6s ease both; -moz-animation: goDown .6s ease both; animation: goDown .6s ease both; } .owl-fadeUp-in { -webkit-animation: scaleUpFrom .5s ease both; -moz-animation: scaleUpFrom .5s ease both; animation: scaleUpFrom .5s ease both; }  .owl-fadeUp-out { -webkit-animation: scaleUpTo .5s ease both; -moz-animation: scaleUpTo .5s ease both; animation: scaleUpTo .5s ease both; } @-webkit-keyframes empty { 0% {opacity: 1} } @-moz-keyframes empty { 0% {opacity: 1} } @keyframes empty { 0% {opacity: 1} } @-webkit-keyframes fadeIn { 0% { opacity:0; } 100% { opacity:1; } } @-moz-keyframes fadeIn { 0% { opacity:0; } 100% { opacity:1; } } @keyframes fadeIn { 0% { opacity:0; } 100% { opacity:1; } } @-webkit-keyframes fadeOut { 0% { opacity:1; } 100% { opacity:0; } } @-moz-keyframes fadeOut { 0% { opacity:1; } 100% { opacity:0; } } @keyframes fadeOut { 0% { opacity:1; } 100% { opacity:0; } } @-webkit-keyframes backSlideOut { 25% { opacity: .5; -webkit-transform: translateZ(-500px); } 75% { opacity: .5; -webkit-transform: translateZ(-500px) translateX(-200%); } 100% { opacity: .5; -webkit-transform: translateZ(-500px) translateX(-200%); } } @-moz-keyframes backSlideOut { 25% { opacity: .5; -moz-transform: translateZ(-500px); } 75% { opacity: .5; -moz-transform: translateZ(-500px) translateX(-200%); } 100% { opacity: .5; -moz-transform: translateZ(-500px) translateX(-200%); } } @keyframes backSlideOut { 25% { opacity: .5; transform: translateZ(-500px); } 75% { opacity: .5; transform: translateZ(-500px) translateX(-200%); } 100% { opacity: .5; transform: translateZ(-500px) translateX(-200%); } } @-webkit-keyframes backSlideIn { 0%, 25% { opacity: .5; -webkit-transform: translateZ(-500px) translateX(200%); } 75% { opacity: .5; -webkit-transform: translateZ(-500px); } 100% { opacity: 1; -webkit-transform: translateZ(0) translateX(0); } } @-moz-keyframes backSlideIn { 0%, 25% { opacity: .5; -moz-transform: translateZ(-500px) translateX(200%); } 75% { opacity: .5; -moz-transform: translateZ(-500px); } 100% { opacity: 1; -moz-transform: translateZ(0) translateX(0); } } @keyframes backSlideIn { 0%, 25% { opacity: .5; transform: translateZ(-500px) translateX(200%); } 75% { opacity: .5; transform: translateZ(-500px); } 100% { opacity: 1; transform: translateZ(0) translateX(0); } } @-webkit-keyframes scaleToFade { to { opacity: 0; -webkit-transform: scale(.8); } } @-moz-keyframes scaleToFade { to { opacity: 0; -moz-transform: scale(.8); } } @keyframes scaleToFade { to { opacity: 0; transform: scale(.8); } } @-webkit-keyframes goDown { from { -webkit-transform: translateY(-100%); } } @-moz-keyframes goDown { from { -moz-transform: translateY(-100%); } } @keyframes goDown { from { transform: translateY(-100%); } }  @-webkit-keyframes scaleUpFrom { from { opacity: 0; -webkit-transform: scale(1.5); } } @-moz-keyframes scaleUpFrom { from { opacity: 0; -moz-transform: scale(1.5); } } @keyframes scaleUpFrom { from { opacity: 0; transform: scale(1.5); } }  @-webkit-keyframes scaleUpTo { to { opacity: 0; -webkit-transform: scale(1.5); } } @-moz-keyframes scaleUpTo { to { opacity: 0; -moz-transform: scale(1.5); } } @keyframes scaleUpTo { to { opacity: 0; transform: scale(1.5); } }  ';
		style 	 += "</style>";
		style	 += "<style id='Viewer'>";
		style 	 += "/*-------------- Viewer.js v1.5.0 ------------------ */";
		style 	 += '.viewer-close:before,.viewer-flip-horizontal:before,.viewer-flip-vertical:before,.viewer-fullscreen-exit:before,.viewer-fullscreen:before,.viewer-next:before,.viewer-one-to-one:before,.viewer-play:before,.viewer-prev:before,.viewer-reset:before,.viewer-rotate-left:before,.viewer-rotate-right:before,.viewer-zoom-in:before,.viewer-zoom-out:before{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAAAUCAYAAABWOyJDAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAQPSURBVHic7Zs/iFxVFMa/0U2UaJGksUgnIVhYxVhpjDbZCBmLdAYECxsRFBTUamcXUiSNncgKQbSxsxH8gzAP3FU2jY0kKKJNiiiIghFlccnP4p3nPCdv3p9778vsLOcHB2bfveeb7955c3jvvNkBIMdxnD64a94GHMfZu3iBcRynN7zAOI7TG15gHCeeNUkr8zaxG2lbYDYsdgMbktBsP03jdQwljSXdtBhLOmtjowC9Mg9L+knSlcD8TNKpSA9lBpK2JF2VdDSR5n5J64m0qli399hNFMUlpshQii5jbXTbHGviB0nLNeNDSd9VO4A2UdB2fp+x0eCnaXxWXGA2X0au/3HgN9P4LFCjIANOJdrLr0zzZ+BEpNYDwKbpnQMeAw4m8HjQtM6Z9qa917zPQwFr3M5KgA6J5rTJCdFZJj9/lyvGhsDvwFNVuV2MhhjrK6b9bFiE+j1r87eBl4HDwCF7/U/k+ofAX5b/EXBv5JoLMuILzf3Ap6Z3EzgdqHMCuF7hcQf4HDgeoHnccncqdK/TvSDWffFXI/exICY/xZyqc6XLWF1UFZna4gJ7q8BsRvgd2/xXpo6P+D9dfT7PpECtA3cnWPM0GXGFZh/wgWltA+cDNC7X+AP4GzjZQe+k5dRxuYPeiuXU7e1qwLpDz7dFjXKRaSwuMLvAlG8zZlG+YmiK1HoFqT7wP2z+4Q45TfEGcMt01xLoNZEBTwRqD4BLpnMLeC1A41UmVxsXgXeBayV/Wx20rpTyrpnWRft7p6O/FdqzGrDukPNtkaMoMo3FBdBSQMOnYBCReyf05s126fU9ytfX98+mY54Kxnp7S9K3kj6U9KYdG0h6UdLbkh7poFXMfUnSOyVvL0h6VtIXHbS6nOP+s/Zm9mvyXW1uuC9ohZ72E9uDmXWLJOB1GxsH+DxPftsB8B6wlGDN02TAkxG6+4D3TWsbeC5CS8CDFce+AW500LhhOW2020TRjK3b21HEmgti9m0RonxbdMZeVzV+/4tF3cBpP7E9mKHNL5q8h5g0eYsCMQz0epq8gQrwMXAgcs0FGXGFRcB9wCemF9PkbYqM/Bas7fxLwNeJPdTdpo4itQti8lPMqTpXuozVRVXPpbHI3KkNTB1NfkL81j2mvhDp91HgV9MKuRIqrykj3WPq4rHyL+axj8/qGPmTqi6F9YDlHOvJU6oYcTsh/TYSzWmTE6JT19CtLTJt32D6CmHe0eQn1O8z5AXgT4sx4Vcu0/EQecMydB8z0hUWkTd2t4CrwNEePqMBcAR4mrBbwyXLPWJa8zrXmmLEhNBmfpkuY2102xxrih+pb+ieAb6vGhuA97UcJ5KR8gZ77K+99xxeYBzH6Q3/Z0fHcXrDC4zjOL3hBcZxnN74F+zlvXFWXF9PAAAAAElFTkSuQmCC");background-repeat:no-repeat;background-size:280px;color:transparent;display:block;font-size:0;height:20px;line-height:0;width:20px}.viewer-zoom-in:before{background-position:0 0;content:"Zoom In"}.viewer-zoom-out:before{background-position:-20px 0;content:"Zoom Out"}.viewer-one-to-one:before{background-position:-40px 0;content:"One to One"}.viewer-reset:before{background-position:-60px 0;content:"Reset"}.viewer-prev:before{background-position:-80px 0;content:"Previous"}.viewer-play:before{background-position:-100px 0;content:"Play"}.viewer-next:before{background-position:-120px 0;content:"Next"}.viewer-rotate-left:before{background-position:-140px 0;content:"Rotate Left"}.viewer-rotate-right:before{background-position:-160px 0;content:"Rotate Right"}.viewer-flip-horizontal:before{background-position:-180px 0;content:"Flip Horizontal"}.viewer-flip-vertical:before{background-position:-200px 0;content:"Flip Vertical"}.viewer-fullscreen:before{background-position:-220px 0;content:"Enter Full Screen"}.viewer-fullscreen-exit:before{background-position:-240px 0;content:"Exit Full Screen"}.viewer-close:before{background-position:-260px 0;content:"Close"}.viewer-container{bottom:0;direction:ltr;font-size:0;left:0;line-height:0;overflow:hidden;position:absolute;right:0;-webkit-tap-highlight-color:transparent;top:0;-ms-touch-action:none;touch-action:none;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.viewer-container::-moz-selection,.viewer-container ::-moz-selection{background-color:transparent}.viewer-container::selection,.viewer-container ::selection{background-color:transparent}.viewer-container img{display:block;height:auto;max-height:none!important;max-width:none!important;min-height:0!important;min-width:0!important;width:100%}.viewer-canvas{bottom:0;left:0;overflow:hidden;position:absolute;right:0;top:0}.viewer-canvas>img{height:auto;margin:15px auto;max-width:90%!important;width:auto}.viewer-footer{bottom:0;left:0;overflow:hidden;position:absolute;right:0;text-align:center}.viewer-navbar{background-color:rgba(0,0,0,.5);overflow:hidden}.viewer-list{-webkit-box-sizing:content-box;box-sizing:content-box;height:50px;margin:0;overflow:hidden;padding:1px 0}.viewer-list>li{color:transparent;cursor:pointer;float:left;font-size:0;height:50px;line-height:0;opacity:.5;overflow:hidden;-webkit-transition:opacity .15s;transition:opacity .15s;width:30px}.viewer-list>li:hover{opacity:.75}.viewer-list>li+li{margin-left:1px}.viewer-list>.viewer-loading{position:relative}.viewer-list>.viewer-loading:after{border-width:2px;height:20px;margin-left:-10px;margin-top:-10px;width:20px}.viewer-list>.viewer-active,.viewer-list>.viewer-active:hover{opacity:1}.viewer-player{background-color:#000;bottom:0;cursor:none;display:none;right:0}.viewer-player,.viewer-player>img{left:0;position:absolute;top:0}.viewer-toolbar>ul{display:inline-block;margin:0 auto 5px;overflow:hidden;padding:3px 0}.viewer-toolbar>ul>li{background-color:rgba(0,0,0,.5);border-radius:50%;cursor:pointer;float:left;height:24px;overflow:hidden;-webkit-transition:background-color .15s;transition:background-color .15s;width:24px}.viewer-toolbar>ul>li:hover{background-color:rgba(0,0,0,.8)}.viewer-toolbar>ul>li:before{margin:2px}.viewer-toolbar>ul>li+li{margin-left:1px}.viewer-toolbar>ul>.viewer-small{height:18px;margin-bottom:3px;margin-top:3px;width:18px}.viewer-toolbar>ul>.viewer-small:before{margin:-1px}.viewer-toolbar>ul>.viewer-large{height:30px;margin-bottom:-3px;margin-top:-3px;width:30px}.viewer-toolbar>ul>.viewer-large:before{margin:5px}.viewer-tooltip{background-color:rgba(0,0,0,.8);border-radius:10px;color:#fff;display:none;font-size:12px;height:20px;left:50%;line-height:20px;margin-left:-25px;margin-top:-10px;position:absolute;text-align:center;top:50%;width:50px}.viewer-title{color:#ccc;display:inline-block;font-size:12px;line-height:1;margin:0 5% 5px;max-width:90%;opacity:.8;overflow:hidden;text-overflow:ellipsis;-webkit-transition:opacity .15s;transition:opacity .15s;white-space:nowrap}.viewer-title:hover{opacity:1}.viewer-button{background-color:rgba(0,0,0,.5);border-radius:50%;cursor:pointer;height:80px;overflow:hidden;position:absolute;right:-40px;top:-40px;-webkit-transition:background-color .15s;transition:background-color .15s;width:80px}.viewer-button:focus,.viewer-button:hover{background-color:rgba(0,0,0,.8)}.viewer-button:before{bottom:15px;left:15px;position:absolute}.viewer-fixed{position:fixed}.viewer-open{overflow:hidden}.viewer-show{display:block}.viewer-hide{display:none}.viewer-backdrop{background-color:rgba(0,0,0,.5)}.viewer-invisible{visibility:hidden}.viewer-move{cursor:move;cursor:-webkit-grab;cursor:grab}.viewer-fade{opacity:0}.viewer-in{opacity:1}.viewer-transition{-webkit-transition:all .3s;transition:all .3s}@-webkit-keyframes viewer-spinner{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}@keyframes viewer-spinner{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}.viewer-loading:after{-webkit-animation:viewer-spinner 1s linear infinite;animation:viewer-spinner 1s linear infinite;border:4px solid hsla(0,0%,100%,.1);border-left-color:hsla(0,0%,100%,.5);border-radius:50%;content:"";display:inline-block;height:40px;left:50%;margin-left:-20px;margin-top:-20px;position:absolute;top:50%;width:40px;z-index:1}@media (max-width:767px){.viewer-hide-xs-down{display:none}}@media (max-width:991px){.viewer-hide-sm-down{display:none}}@media (max-width:1199px){.viewer-hide-md-down{display:none}}  ';
		style 	 += "</style>";
		$('head').append(style);
		
		//plugin[htmllightbox_integration].play_video('123')
		krpano.actions.set_infobox_style = set_infobox_style;
		krpano.actions.close_popup = close_popup;
		krpano.actions.play_video = play_video;
		krpano.actions.open_url = open_url;
		krpano.actions.open_image = open_image;
		krpano.actions.open_image_auto = open_image_auto;
		krpano.actions.open_inline = open_inline;
		krpano.actions.open_infobox_popup = open_infobox_popup;
		krpano.actions.open_zoomable_image = open_zoomable_image;
		
		plugin.set_infobox_style = set_infobox_style;
		plugin.close = close_popup;
		plugin.play_video = play_video;
		plugin.open_url = open_url;
		plugin.open_image = open_image;
		plugin.open_image_auto = open_image_auto;
		plugin.open_inline = open_inline;
		plugin.open_infobox_popup = open_infobox_popup;
		plugin.open_zoomable_image = open_zoomable_image;
		
		
		
		
		setTimeout(function(){
			if(onInitialized)
				krpano.call(onInitialized);			
		}, 50);
    }

    // unloadplugin - end point for the plugin (optionally)
    // - will be called from krpano when the plugin will be removed
    // - everything that was added by the plugin (objects,intervals,...) should be removed here
    local.unloadplugin = function(){
        plugin = null;
        krpano = null;
    }

    // onresize - the plugin was resized from xml krpano (optionally)
    // - width,height = the new size for the plugin
    // - when not defined then only the parent html element will be scaled
    local.onresize = function(width,height){
        // not used in this example
        return false;
    }


    function translate_language(word){
		active_language		= krpano.get("tour_language");
		var temp_word		= krpano.get("data[" + active_language + "_" + word + "].content");
		var temp_word_en	= krpano.get("data[en_" + word + "].content");
		// if(temp_word==null || temp_word==undefined || temp_word=="")
		if(temp_word==null || temp_word==undefined)
			temp_word = temp_word_en;
		if(temp_word==null || temp_word==undefined)
			temp_word = word;
		return temp_word;
	}
    function translate_path(path){
		// console.log(path);
		var network = krpano_get("global.network");
		path = path.replace(/\%BASEDIR\%/g, network.basepath);
		path = path.replace(/\%FIRSTXML\%/g, network.firstxmlpath);
		path = path.replace(/\%CURRENTXML\%/g, network.currentxmlpath);
		path = path.replace(/\%HTMLPATH\%/g, network.htmlpath);
		path = path.replace(/\%VIEWER\%/g, network.viewerpath);
		path = path.replace(/\%SWFPATH\%/g, network.viewerpath);
		path = path.replace(/\%ROOT\%/g, network.viewerpath);
		// path = path.replace(/http:\/\//g, "http:__").replace(/https:\/\//g, "https:__").replace(/\/\//g, "/").replace("http:__","http://").replace("https:__","https://");
		// console.log(path);
		// console.log(krpano);
		// BASEDIR
		// network.viewerpath
		// network.htmlpath
		// network.firstxmlpath
		// network.currentxmlpath

		// swfpath: "./"
		// viewerpath: "./"
		// firstxmlpath: ""
		// currentxmlpath: ""
		// htmlpath: ""
		// basepath: "%FIRSTXML%"

		// %VIEWER% or %ROOT% or %SWFPATH%
		// %HTMLPATH%
		// %FIRSTXML%
		// %CURRENTXML%
		// %BASEDIR%

		//.replace("%FIRSTXML%",krpano.Kloader.firstxmlpath)
		// console.log(krpano.Kloader.firstxmlpath);
		return path;
	}
	function trim_char (s, c) {
		if (c === "]") c = "\\]";
		if (c === "\\") c = "\\\\";
		return s.replace(new RegExp(
			"^[" + c + "]+|[" + c + "]+$", "g"
		), "");
	}
    function close_popup(){
		$.htmllightbox.close();
	}
    function set_infobox_style(info_box_style_temp,aplay_to_all){
		aplay_to_all = aplay_to_all || true;
		
		if(aplay_to_all==false){
			info_box_style_old = info_box_style;
			info_box_style_float_old = info_box_style_float;
			info_box_style_compact_old = info_box_style_compact;
			info_box_style_image_align_old = info_box_style_image_align;
		}
		//console.log("info_box_style_temp : " + info_box_style_temp);
		info_box_style_temp	= (info_box_style_temp!=null && (
														 info_box_style_temp.toLowerCase()=="style_1_fixed_expanded"	||
														 info_box_style_temp.toLowerCase()=="style_1_float_expanded"	||
														 info_box_style_temp.toLowerCase()=="style_2_fixed_expanded"	||
														 info_box_style_temp.toLowerCase()=="style_2_fixed_compact"		||
														 info_box_style_temp.toLowerCase()=="style_2_float_expanded"	||
														 info_box_style_temp.toLowerCase()=="style_2_float_compact"		||
														 info_box_style_temp.toLowerCase()=="style_3_fixed_expanded"	||
														 info_box_style_temp.toLowerCase()=="style_3_fixed_compact"		||
														 info_box_style_temp.toLowerCase()=="style_3_float_expanded"	||
														 info_box_style_temp.toLowerCase()=="style_3_float_compact"		||
														 info_box_style_temp.toLowerCase()=="style_4_fixed_expanded"	||
														 info_box_style_temp.toLowerCase()=="style_4_float_expanded"	||
														 info_box_style_temp.toLowerCase()=="style_5_fixed_expanded"	||
														 info_box_style_temp.toLowerCase()=="style_5_float_expanded"	||
														 info_box_style_temp.toLowerCase()=="style_24_float_left"		||
														 info_box_style_temp.toLowerCase()=="style_24_float_right"
						   )?info_box_style_temp.toLowerCase():"style_1_fixed_expanded");
		//console.log("info_box_style_temp : " + info_box_style_temp);
		info_box_style_temp = info_box_style_temp.split("_");
		info_box_style = info_box_style_temp[0] + "_" + info_box_style_temp[1];
		
		if(2 in info_box_style_temp && info_box_style_temp[2] == "float" && krpano.get("device.normal")==true )
			info_box_style_float = true;
		else
			info_box_style_float = false;
		
		if(3 in info_box_style_temp && info_box_style_temp[3] == "compact")
			info_box_style_compact = true;
		else
			info_box_style_compact = false;
		
		if(info_box_style_temp[1]==24)
		{
			if(3 in info_box_style_temp && info_box_style_temp[3] == "left")
				info_box_style_image_align = "left";
			else
				info_box_style_image_align = "right";
		}
		else
				info_box_style_image_align = "";
		// console.log("info_box_style : " + info_box_style);
		// console.log("info_box_style_float : " + info_box_style_float);
		
		if(aplay_to_all==false){
			setTimeout(function(){
				// console.log("I am here 1");
				info_box_style = info_box_style_old;
				info_box_style_float = info_box_style_float_old;
				info_box_style_compact = info_box_style_compact_old;
				info_box_style_image_align = info_box_style_image_align_old;
			}, 2400);
		}
		
		return true;
	}
    function play_video(){
		arguments[0] = translate_language(arguments[0]);
		arguments[0] = translate_path(arguments[0]);
		var afterClose_function = (5 in arguments && arguments[5] !="" && arguments[5] != null?arguments[5]:false);

		var caption_text = "";
		if(3 in arguments)
			caption_text = arguments[3];
		caption_text = translate_language(caption_text);
		
		if(vr_support && is_it_vr)
		{
			if(arguments[0].toLowerCase().indexOf("youtube.")!=-1 && arguments[0].toLowerCase().indexOf("vimeo.")!=-1 && arguments[0].toLowerCase().indexOf("instagram.")!=-1)
			{
				console.log("I can not play remote video in VR");
				return true;
			}
			if(arguments[0].indexOf("http")==-1)
				var file_path_temp=file_path;
			else
				var file_path_temp="";
			
			//console.log("I am here :))))");
			//console.log("open_single_video('" + file_path_temp + arguments[0] + "','" + caption_text + "');");
			//open_single_video('indexdata//spots/parametour2.mp4','');
			krpano.call("open_single_video('" + file_path_temp + arguments[0] + "','" + caption_text + "');");
			return true;
			console.log("I am here :))))");
		}

		if(apply_blur)
		{
			// krpano.call("EASY_HTML_LIGHTBOX___hide_all_hotspots();");
			// krpano.call("tween(plugin[EASY_HTML_LIGHTBOX___pp_blur].range,10.5,0.3);");
			// krpano_parent.find(">:first-child").css("transition","all 300ms ease-in-out");
			// krpano_parent.find(">:first-child").css("filter","blur(3px)");
			$(krpano_parent.find("> div:not([class])")[0]).css("transition","all 300ms ease-in-out");
			$(krpano_parent.find("> div:not([class])")[0]).css("filter","blur(3px)");
		}
		var autorotate_temp = false;
		if(stop_autorotate && krpano.get("autorotate.enabled") == true)
			autorotate_temp = true;
		if(stop_autorotate)
		{
			if(stop_autorotate_timeout!=null)
				clearInterval(stop_autorotate_timeout);
			if(start_autorotate_timeout!=null)
				clearTimeout(start_autorotate_timeout);
			
			krpano_set("autorotate.enabled",false);
			
			if(krpano.actions.pauseautorotation != null)
				krpano.call("pauseautorotation(forceplugin);");
			
			stop_autorotate_timeout= setInterval(function(){ krpano_set("autorotate.enabled",false);}, 500);
		}
		if(krpano.get("tour_soundson")==true || krpano.get("tour_soundson")=="true")
		{
			tour_soundson = true;
			krpano.call("stopTourSounds();");
		}
		
        // krpano.trace(1, "play_video() was called with " + arguments.length + " arguments:");
		// console.log(arguments);
		var popup_width = null;
		if(1 in arguments)
		{
			popup_width = arguments[1];
			if(popup_width.indexOf("%") >= 0)
			{
				// stagewidth	= parseInt(krpano.get("stagewidth"));
				stagewidth	= parseInt(krpano_parent.width());
				popup_width	= stagewidth * popup_width.replace("%","") / 100;
				popup_width	= popup_width + "";
			}
		}
		var popup_height = null;
		if(2 in arguments)
		{
			popup_height = arguments[2];
			if(popup_height.indexOf("%") >= 0)
			{
				// stageheight	= parseInt(krpano.get("stageheight"));
				stageheight		= parseInt(krpano_parent.height());
				popup_height	= stageheight * popup_height.replace("%","") / 100;
				popup_height	= popup_height + "";
			}
		}

		if(arguments[0].indexOf("http")==-1)
			var file_path_temp=file_path;
		else
			var file_path_temp="";
		
		$.htmllightbox.open({
			src: file_path_temp + arguments[0],
			caption  : caption_text,
			toolbar  : false,
			smallBtn : true,
			width	 : popup_width,
			height	 : popup_height,
			parentEl : krpano_parent,
			beforeClose : function() {
								if(apply_blur)
								{
									// krpano.call("EASY_HTML_LIGHTBOX___show_all_hotspots();");
									// krpano.call("tween(plugin[EASY_HTML_LIGHTBOX___pp_blur].range,0,0.3);");
									$(krpano_parent.find("> div:not([class])")[0]).css("filter","blur(0)");
								}
								if(autorotate_temp == true)
								{
										if(stop_autorotate_timeout!=null)
											clearInterval(stop_autorotate_timeout);
										if(start_autorotate_timeout!=null)
											clearTimeout(start_autorotate_timeout);
										
										autorotate_temp = false;
										if(krpano.actions.resumeautorotation != null)
											krpano.call("resumeautorotation(forceplugin);");
										krpano_set("autorotate.enabled",true);
										start_autorotate_timeout = setTimeout(function(){ krpano_set("autorotate.enabled",true); }, 500);
								}
								if(tour_soundson==true)
								{
									krpano.call("playTourSounds();");
								}
								tour_soundson = false;
						},
			afterClose : function() {
								if(afterClose_function)
									krpano.call(afterClose_function);
						}
		});
    }
    function open_url(){
		arguments[0] = translate_language(arguments[0]);
		arguments[0] = translate_path(arguments[0]);
		var afterClose_function = (11 in arguments && arguments[11] !="" && arguments[11] != null?arguments[11]:false);
		
		touch_temp = true;
		if(krpano.get("device.touch"))
			touch_temp = false;

		//$.htmllightbox.close();
		keyboard_temp = true;
		clickSlide_temp = "close";		

		if(5 in arguments && arguments[5] != "" && arguments[5] != "layer[]")
		{
			keyboard_temp = false;
			clickSlide_temp = "";
			var temp_parent = krpano.get(arguments[5] + ".sprite");
			// var temp_parent = krpano_parent;
			$(temp_parent).addClass("plugin_iframe_container");
			$(temp_parent).find("div#plugin_iframe_child").remove();
			$("#css_placeholder_plugin_iframe_container").remove();
			
			var top_padding		=	0;
			var right_padding	=	0;
			var bottom_padding	=	0;
			var left_padding	=	0;
			if(7 in arguments && arguments[7] != "" && arguments[7] != "0" && !isNaN(parseInt(arguments[7])))
			{
				top_padding = parseInt(arguments[7]);
			}
			if(8 in arguments && arguments[8] != "" && arguments[8] != "0" && !isNaN(parseInt(arguments[8])))
			{
				right_padding = parseInt(arguments[8]);
			}
			if(9 in arguments && arguments[9] != "" && arguments[9] != "0" && !isNaN(parseInt(arguments[9])))
			{
				//console.log(temp_parent);
				bottom_padding = parseInt(arguments[9]);
				var temp_height = arguments[2];
				if(!$.isNumeric(temp_height) && temp_height.indexOf("px") >= 0)
				{
					temp_height = temp_height.replace("px","");
					arguments[2] = temp_height - bottom_padding;
				}
				if(!$.isNumeric(temp_height) && temp_height.indexOf("%") >= 0)
				{
					//temp_height = parseInt($(temp_parent).height())*parseInt(temp_height.replace("%",""))/100;
					arguments[2] = "calc(" + temp_height + " - " + bottom_padding + "px)";
					// console.log(arguments[2]);
				}
				
				
				var style_temp = "<style>.plugin_iframe_container .htmllightbox-bg{background-color:transparent !important;}.plugin_iframe_container .htmllightbox-slide--iframe .htmllightbox-content{margin-bottom:" + bottom_padding + "px}</style>";
				$("body").append(style_temp);
			}
			if(10 in arguments && arguments[10] != "" && arguments[10] != "0" && !isNaN(parseInt(arguments[10])))
			{
				left_padding = parseInt(arguments[10]);
			}
			

			
			// var $target = $(temp_parent).children(),
				// $next = $target;
			// while( $next.length ) {
				// $target = $next;
				// $next = $next.children();
			// }
			// temp_parent = $target.parent()[0];
			// $(temp_parent).find("div").remove();
			
			
			
			var div = document.createElement("div");
			div.addEventListener("wheel", function(event){ event.stopPropagation(); }, true);
			div.addEventListener("mousewheel", function(event){ event.stopPropagation(); }, true);
			div.addEventListener("DOMMouseScroll", function(event){ event.stopPropagation(); }, true);
			div.addEventListener("touchstart", function(event){ if(krpano.device.ios && window.innerHeight == krpano.display.htmltarget.offsetHeight){ /* avoid the iOS 'overscrolling' for fullpage viewers */ var bs = document.body.parentNode.style; bs.position="fixed"; bs.top=0; bs.left=0; bs.right=0; bs.bottom=0; } krpano.control.preventTouchEvents = false; event.stopPropagation(); }, true);
			div.addEventListener("touchend", function(event){ krpano.control.preventTouchEvents = true; event.stopPropagation(); }, true);
			div.addEventListener("gesturestart", function(event){ event.preventDefault(); }, true);
			div.setAttribute("id", "plugin_iframe_child");
			temp_parent.appendChild(div);
			temp_parent = $(temp_parent).find("div#plugin_iframe_child");
			
			if(6 in arguments && arguments[6] == "false")// check for preload
				temp_parent.css("display","block");
			else
				temp_parent.css("display","none");
			
			var style_temp   = "<style id='css_placeholder_plugin_iframe_container'>";
			style_temp 		+= ".plugin_iframe_container div#plugin_iframe_child {position: absolute;width:100%;height:100%;}";
			style_temp 		+= ".plugin_iframe_container .htmllightbox-container {position: absolute !important;}";
			style_temp 		+= ".plugin_iframe_container .htmllightbox-slide {padding: 0;}";
			style_temp 		+= ".plugin_iframe_container .htmllightbox-slide {overflow-x: hidden;}";
			style_temp 		+= ".plugin_iframe_container .htmllightbox-toolbar {display: none;}";
			style_temp 		+= ".plugin_iframe_container .htmllightbox-infobar {display: none;}";
			style_temp 		+= ".plugin_iframe_container .htmllightbox-caption {display: none;}";
			style_temp 		+= ".plugin_iframe_container .htmllightbox-navigation {display: none;}";
			style_temp 		+= ".plugin_iframe_container .htmllightbox-slide--current{overflow-x: hidden !important;}";
			style_temp 		+= ".htmllightbox-active{height: 100% !important;}";
			style_temp 		+= "</style>";
			$("body").append(style_temp);
			// console.log(style_temp);
			// return true;
		}
		else
			var temp_parent = krpano_parent;
		
		if(apply_blur && temp_parent == krpano_parent)
		{
			// krpano.call("EASY_HTML_LIGHTBOX___hide_all_hotspots();");
			// krpano.call("tween(plugin[EASY_HTML_LIGHTBOX___pp_blur].range,10.5,0.3);");
			$(krpano_parent.find("> div:not([class])")[0]).css("transition","all 300ms ease-in-out");
			$(krpano_parent.find("> div:not([class])")[0]).css("filter","blur(3px)");
		}
		var autorotate_temp = false;
		if(stop_autorotate && krpano.get("autorotate.enabled") == true && temp_parent == krpano_parent)
			autorotate_temp = true;
		if(stop_autorotate && temp_parent == krpano_parent)
		{
			if(stop_autorotate_timeout!=null)
				clearInterval(stop_autorotate_timeout);
			if(start_autorotate_timeout!=null)
				clearTimeout(start_autorotate_timeout);
			
			krpano_set("autorotate.enabled",false);
			if(krpano.actions.pauseautorotation != null)
				krpano.call("pauseautorotation(forceplugin);");
			stop_autorotate_timeout= setInterval(function(){ krpano_set("autorotate.enabled",false);}, 500);
		}

		var caption_text = "";
		if(3 in arguments)
			caption_text = arguments[3];
		caption_text = translate_language(caption_text);

		var popup_width = null;
		if(1 in arguments)
		{
			popup_width = arguments[1];
			if(popup_width.indexOf("%") >= 0)
			{
				// stagewidth	= parseInt(krpano.get("stagewidth"));
				stagewidth	= parseInt(temp_parent.width());
				popup_width	= stagewidth * popup_width.replace("%","") / 100;
				popup_width	= popup_width + "";
			}
		}
		var popup_height = null;
		if(2 in arguments)
		{
			popup_height = arguments[2];
			if(popup_height.indexOf("%") >= 0)
			{
				// stageheight	= parseInt(krpano.get("stageheight"));
				stageheight		= parseInt(temp_parent.height());
				popup_height	= stageheight * popup_height.replace("%","") / 100;
				popup_height	= popup_height + "";
			}
		}
		
		if(arguments[0].indexOf(";")==-1)
		{

			if(arguments[0].indexOf("http")==-1)
				var file_path_temp=file_path;
			else
				var file_path_temp="";
// console.log("786");
// var min = 786;
// var max = 9999999999;
// var random = "htmllightbox_url_" + Math.floor(Math.random() * (max - min + 1)) + min;
// var temp_arguments = arguments;

			$.htmllightbox.open({
				src: file_path_temp + arguments[0],
				caption  : caption_text,
				type: 'iframe',
				toolbar  : false,
				smallBtn : true,
				fullScreen:false,
				iframe : {
						css:{
							width:popup_width,
							height:popup_height
						},
						preload : true
				},
				parentEl : temp_parent,
				touch:touch_temp,
				keyboard: keyboard_temp,
				clickSlide: clickSlide_temp,
				beforeLoad : function() {
								/*
								console.log("0");
								function error(){
									console.log("1");
									open_url(temp_arguments[0],temp_arguments[1],temp_arguments[2],temp_arguments[3],temp_arguments[4],temp_arguments[5],temp_arguments[6]);
								}
								eval("window.iframeError_" + random + " = setTimeout(error, 4000)");
								*/
							},
				afterLoad : function() {
								/*
								console.log("2");
								eval("clearTimeout(window.iframeError_" + random + ");");
								*/
							},
				afterShow : function() {
									temp_parent.css("display","block");
							},
				beforeClose : function() {
								if(apply_blur && temp_parent == krpano_parent)
								{
									// krpano.call("EASY_HTML_LIGHTBOX___show_all_hotspots();");
									// krpano.call("tween(plugin[EASY_HTML_LIGHTBOX___pp_blur].range,0,0.3);");
									$(krpano_parent.find("> div:not([class])")[0]).css("filter","blur(0)");
								}
								if(autorotate_temp == true)
								{
									if(stop_autorotate_timeout!=null)
										clearInterval(stop_autorotate_timeout);
									if(start_autorotate_timeout!=null)
										clearTimeout(start_autorotate_timeout);
									
									autorotate_temp = false;
									if(krpano.actions.resumeautorotation != null)
										krpano.call("resumeautorotation(forceplugin);");
									krpano_set("autorotate.enabled",true);
									start_autorotate_timeout = setTimeout(function(){ krpano_set("autorotate.enabled",true); }, 500);
								}
							},
				afterClose : function() {
									if(afterClose_function)
										krpano.call(afterClose_function);
							}
			});
		}
		else
		{
			var array_old = arguments[0].split(";");
			var array_new = [];
			if(array_old[0].indexOf("http")==-1)
				var file_path_temp=file_path;
			else
				var file_path_temp="";
			
			for (i = 0; i < array_old.length; ++i) {
				array_new.push({src:file_path_temp + array_old[i],type: 'iframe',opts : {caption : caption_text}});
			}
			
			$("#css_placeholder_plugin_iframe_container").remove();
			
			var style_temp   = "<style id='css_placeholder_plugin_iframe_multiple_site'>";
			style_temp 		+= ".htmllightbox-close-small {display: none;}";
			style_temp 		+= ".plugin_iframe_container .htmllightbox-slide--current{overflow: hidden !important;}";
			style_temp 		+= "</style>";
			$("body").append(style_temp);

			$.htmllightbox.open(array_new, {
				toolbar  : true,
				loop : false,
				smallBtn : true,
				fullScreen:false,
				iframe : {
						css:{
							width:popup_width,
							height:popup_height
						},
						preload : true
				},
				parentEl : temp_parent,
				touch:touch_temp,
				keyboard: keyboard_temp,
				clickSlide: clickSlide_temp,
				afterShow : function() {
									temp_parent.css("display","block");
							},
				beforeClose : function() {
								if(apply_blur && temp_parent == krpano_parent)
								{
									// krpano.call("EASY_HTML_LIGHTBOX___show_all_hotspots();");
									// krpano.call("tween(plugin[EASY_HTML_LIGHTBOX___pp_blur].range,0,0.3);");
									$(krpano_parent.find("> div:not([class])")[0]).css("filter","blur(0)");
								}
								if(autorotate_temp == true)
								{
									if(stop_autorotate_timeout!=null)
										clearInterval(stop_autorotate_timeout);
									if(start_autorotate_timeout!=null)
										clearTimeout(start_autorotate_timeout);
									
									autorotate_temp = false;
									if(krpano.actions.resumeautorotation != null)
										krpano.call("resumeautorotation(forceplugin);");
									krpano_set("autorotate.enabled",true);
									start_autorotate_timeout = setTimeout(function(){ krpano_set("autorotate.enabled",true); }, 500);
								}
							},
				afterClose : function() {
									if(afterClose_function)
										krpano.call(afterClose_function);
							}
			});
		}
    }
    function open_image(){
		arguments[0] = translate_language(arguments[0]);
		arguments[0] = translate_path(arguments[0]);
		var afterClose_function = (5 in arguments && arguments[5] !="" && arguments[5] != null?arguments[5]:false);
		
		var caption_text = "";
		if(3 in arguments)
			caption_text = arguments[3];
		caption_text = translate_language(caption_text);
		
		if(vr_support && is_it_vr)
		{
			if(arguments[0].toLowerCase().indexOf("instagram")!=-1)
			{
				console.log("I can not open remote image in VR");
				return true;
			}
			
			arguments[0] = arguments[0].split(";")[0];
			
			if(arguments[0].indexOf("http")==-1)
				var file_path_temp=file_path;
			else
				var file_path_temp="";
			
			krpano.call("open_single_image('" + file_path_temp + arguments[0] + "','" + caption_text + "');");
			console.log("I am here :))))");
			return true;
		}
		if(apply_blur)
		{
			// krpano.call("EASY_HTML_LIGHTBOX___hide_all_hotspots();");
			// krpano.call("tween(plugin[EASY_HTML_LIGHTBOX___pp_blur].range,10.5,0.3);");
			$(krpano_parent.find("> div:not([class])")[0]).css("transition","all 300ms ease-in-out");
			$(krpano_parent.find("> div:not([class])")[0]).css("filter","blur(3px)");
		}
		var autorotate_temp = false;
		if(stop_autorotate && krpano.get("autorotate.enabled") == true)
			autorotate_temp = true;
		if(stop_autorotate)
		{
			if(stop_autorotate_timeout!=null)
				clearInterval(stop_autorotate_timeout);
			if(start_autorotate_timeout!=null)
				clearTimeout(start_autorotate_timeout);
			
			krpano_set("autorotate.enabled",false);
			if(krpano.actions.pauseautorotation != null)
				krpano.call("pauseautorotation(forceplugin);");
			stop_autorotate_timeout= setInterval(function(){ krpano_set("autorotate.enabled",false);}, 500);
		}
	
		var popup_width = null;
		if(1 in arguments)
		{
			popup_width = arguments[1];
			if(popup_width.indexOf("%") >= 0)
			{
				// stagewidth	= parseInt(krpano.get("stagewidth"));
				stagewidth	= parseInt(krpano_parent.width());
				popup_width	= stagewidth * popup_width.replace("%","") / 100;
				popup_width	= popup_width + "";
			}
		}
		var popup_height = null;
		if(2 in arguments)
		{
			popup_height = arguments[2];
			if(popup_height.indexOf("%") >= 0)
			{
				// stageheight	= parseInt(krpano.get("stageheight"));
				stageheight		= parseInt(krpano_parent.height());
				popup_height	= stageheight * popup_height.replace("%","") / 100;
				popup_height	= popup_height + "";
			}
		}
		
		if(arguments[0].indexOf(";")==-1)
		{
			if(arguments[0].indexOf("http")==-1)
				var file_path_temp=file_path;
			else
				var file_path_temp="";
			
			$.htmllightbox.open({
				src: file_path_temp + arguments[0],
				caption  : caption_text,
				toolbar  : true,
				smallBtn : false,
				// clickContent    : 'close', // Edwin Baes Request
				width	 : popup_width,
				height	 : popup_height,
				parentEl : krpano_parent,
				beforeClose : function() {
								if(apply_blur)
								{
									// krpano.call("EASY_HTML_LIGHTBOX___show_all_hotspots();");
									// krpano.call("tween(plugin[EASY_HTML_LIGHTBOX___pp_blur].range,0,0.3);");
									$(krpano_parent.find("> div:not([class])")[0]).css("filter","blur(0)");
								}
								if(autorotate_temp == true)
								{
									if(stop_autorotate_timeout!=null)
										clearInterval(stop_autorotate_timeout);
									if(start_autorotate_timeout!=null)
										clearTimeout(start_autorotate_timeout);
									
									autorotate_temp = false;
									if(krpano.actions.resumeautorotation != null)
										krpano.call("resumeautorotation(forceplugin);");
									krpano_set("autorotate.enabled",true);
									start_autorotate_timeout = setTimeout(function(){ krpano_set("autorotate.enabled",true); }, 500);
								}
							},
				// afterShow: function () { // Edwin Baes Request
								 // $(".htmllightbox-image").on("click touchstart touch", function () {$.htmllightbox.close(true);});
							// },
				afterClose : function() {
									if(afterClose_function)
										krpano.call(afterClose_function);
							}
			});
		}
		else
		{
			var array_old = arguments[0].split(";");
			
			if(caption_text.indexOf(";")!=-1)
				caption_text = caption_text.split(";");
			
			if(array_old[0].indexOf("http")==-1)
				var file_path_temp=file_path;
			else
				var file_path_temp="";
			
			var array_new = [];
			for (i = 0; i < array_old.length; ++i) {
				if(array_old[i]!="" && !$.isArray(caption_text))
					array_new.push({src:file_path_temp + array_old[i].replace("%FIRSTXML%",krpano.Kloader.firstxmlpath),opts : {caption : caption_text}});
				else if(array_old[i]!="" && (i in caption_text))
					array_new.push({src:file_path_temp + array_old[i].replace("%FIRSTXML%",krpano.Kloader.firstxmlpath),opts : {caption : caption_text[i]}});
				else if(array_old[i]!="")
					array_new.push({src:file_path_temp + array_old[i].replace("%FIRSTXML%",krpano.Kloader.firstxmlpath),opts : {caption : ''}});
			}
			$.htmllightbox.open(array_new, {
				toolbar  : true,
				loop	 : false,
				// clickContent    : 'close', // Edwin Baes Request
				width	 : popup_width,
				height	 : popup_height,
				parentEl : krpano_parent,
				idleTime : false,
				beforeClose : function() {
								if(apply_blur)
								{
									// krpano.call("EASY_HTML_LIGHTBOX___show_all_hotspots();");
									// krpano.call("tween(plugin[EASY_HTML_LIGHTBOX___pp_blur].range,0,0.3);");
									$(krpano_parent.find("> div:not([class])")[0]).css("filter","blur(0)");
								}
								if(autorotate_temp == true)
								{
									if(stop_autorotate_timeout!=null)
										clearInterval(stop_autorotate_timeout);
									if(start_autorotate_timeout!=null)
										clearTimeout(start_autorotate_timeout);
									
									autorotate_temp = false;
									if(krpano.actions.resumeautorotation != null)
										krpano.call("resumeautorotation(forceplugin);");
									krpano_set("autorotate.enabled",true);
									start_autorotate_timeout = setTimeout(function(){ krpano_set("autorotate.enabled",true); }, 500);
								}
							},
				// afterShow: function () { // Edwin Baes Request
								 // $(".htmllightbox-image").on("click touchstart touch", function () {$.htmllightbox.close(true);});
							// },
				afterClose : function() {
									if(afterClose_function)
										krpano.call(afterClose_function);
							}
			});
		}
    }
    function open_image_auto(){
		arguments[0] = translate_language(arguments[0]);
		arguments[0] = translate_path(arguments[0]);
		var afterClose_function = (5 in arguments && arguments[5] !="" && arguments[5] != null?arguments[5]:false);

		if(apply_blur)
		{
			// krpano.call("EASY_HTML_LIGHTBOX___hide_all_hotspots();");
			// krpano.call("tween(plugin[EASY_HTML_LIGHTBOX___pp_blur].range,10.5,0.3);");
			$(krpano_parent.find("> div:not([class])")[0]).css("transition","all 300ms ease-in-out");
			$(krpano_parent.find("> div:not([class])")[0]).css("filter","blur(3px)");
		}
		var autorotate_temp = false;
		if(stop_autorotate && krpano.get("autorotate.enabled") == true)
			autorotate_temp = true;
		if(stop_autorotate)
		{
			if(stop_autorotate_timeout!=null)
				clearInterval(stop_autorotate_timeout);
			if(start_autorotate_timeout!=null)
				clearTimeout(start_autorotate_timeout);
			
			krpano_set("autorotate.enabled",false);
			if(krpano.actions.pauseautorotation != null)
				krpano.call("pauseautorotation(forceplugin);");
			stop_autorotate_timeout= setInterval(function(){ krpano_set("autorotate.enabled",false);}, 500);
		}

		var caption_text = "";
		if(3 in arguments)
			caption_text = arguments[3];
		caption_text = translate_language(caption_text);
		
		var popup_width = null;
		if(1 in arguments)
		{
			popup_width = arguments[1];
			if(popup_width.indexOf("%") >= 0)
			{
				stagewidth	= parseInt(krpano.get("stagewidth"));
				popup_width	= stagewidth * popup_width.replace("%","") / 100;
				popup_width	= popup_width + "";
			}
		}
		var popup_height = null;
		if(2 in arguments)
		{
			popup_height = arguments[2];
			if(popup_height.indexOf("%") >= 0)
			{
				stageheight		= parseInt(krpano.get("stageheight"));
				popup_height	= stageheight * popup_height.replace("%","") / 100;
				popup_height	= popup_height + "";
			}
		}

		if(arguments[0].indexOf(";")==-1)
		{
			if(arguments[0].indexOf("http")==-1)
				var file_path_temp=file_path;
			else
				var file_path_temp="";
			
			$.htmllightbox.open({
				src: file_path_temp + arguments[0],
				caption  : caption_text,
				toolbar  : true,
				smallBtn : false,
				width	 : popup_width,
				height	 : popup_height,
				parentEl : krpano_parent,
				beforeClose : function() {
								if(apply_blur)
								{
									// krpano.call("EASY_HTML_LIGHTBOX___show_all_hotspots();");
									// krpano.call("tween(plugin[EASY_HTML_LIGHTBOX___pp_blur].range,0,0.3);");
									$(krpano_parent.find("> div:not([class])")[0]).css("filter","blur(0)");
								}
								if(autorotate_temp == true)
								{
									if(stop_autorotate_timeout!=null)
										clearInterval(stop_autorotate_timeout);
									if(start_autorotate_timeout!=null)
										clearTimeout(start_autorotate_timeout);
									
									autorotate_temp = false;
									if(krpano.actions.resumeautorotation != null)
										krpano.call("resumeautorotation(forceplugin);");
									krpano_set("autorotate.enabled",true);
									start_autorotate_timeout = setTimeout(function(){ krpano_set("autorotate.enabled",true); }, 500);
								}
							},
				afterClose : function() {
									if(afterClose_function)
										krpano.call(afterClose_function);
							}
			});
		}
		else
		{
			var array_old = arguments[0].split(";");
			
			if(caption_text.indexOf(";")!=-1)
				caption_text = caption_text.split(";");
			
			if(array_old[0].indexOf("http")==-1)
				var file_path_temp=file_path;
			else
				var file_path_temp="";
			
			var array_new = [];
			for (i = 0; i < array_old.length; ++i) {
				if(array_old[i]!="" && !$.isArray(caption_text))
					array_new.push({src:file_path_temp + array_old[i].replace("%FIRSTXML%",krpano.Kloader.firstxmlpath),opts : {caption : caption_text}});
				else if(array_old[i]!="" && (i in caption_text))
					array_new.push({src:file_path_temp + array_old[i].replace("%FIRSTXML%",krpano.Kloader.firstxmlpath),opts : {caption : caption_text[i]}});
				else if(array_old[i]!="")
					array_new.push({src:file_path_temp + array_old[i].replace("%FIRSTXML%",krpano.Kloader.firstxmlpath),opts : {caption : ''}});
			}

			$.htmllightbox.open(array_new, {
				toolbar  : true,
				loop	 : false,
				width	 : popup_width,
				height	 : popup_height,
				parentEl : krpano_parent,
				slideShow : {
					autoStart : true,
					speed     : 4000
				},
				beforeClose : function() {
								if(apply_blur)
								{
									// krpano.call("EASY_HTML_LIGHTBOX___show_all_hotspots();");
									// krpano.call("tween(plugin[EASY_HTML_LIGHTBOX___pp_blur].range,0,0.3);");
									$(krpano_parent.find("> div:not([class])")[0]).css("filter","blur(0)");
								}
								if(autorotate_temp == true)
								{
									if(stop_autorotate_timeout!=null)
										clearInterval(stop_autorotate_timeout);
									if(start_autorotate_timeout!=null)
										clearTimeout(start_autorotate_timeout);
									
									autorotate_temp = false;
									if(krpano.actions.resumeautorotation != null)
										krpano.call("resumeautorotation(forceplugin);");
									krpano_set("autorotate.enabled",true);
									start_autorotate_timeout = setTimeout(function(){ krpano_set("autorotate.enabled",true); }, 500);
								}
							},
				afterClose : function() {
									if(afterClose_function)
										krpano.call(afterClose_function);
							}
			});
		}
    }
    function open_inline(){

		touch_temp = true;
		if(krpano.get("device.touch"))
			touch_temp = false;
		
		if(apply_blur)
		{
			// krpano.call("EASY_HTML_LIGHTBOX___hide_all_hotspots();");
			// krpano.call("tween(plugin[EASY_HTML_LIGHTBOX___pp_blur].range,10.5,0.3);");
			$(krpano_parent.find("> div:not([class])")[0]).css("transition","all 300ms ease-in-out");
			$(krpano_parent.find("> div:not([class])")[0]).css("filter","blur(3px)");
		}
		var autorotate_temp = false;
		if(stop_autorotate && krpano.get("autorotate.enabled") == true)
			autorotate_temp = true;
		if(stop_autorotate)
		{
			if(stop_autorotate_timeout!=null)
				clearInterval(stop_autorotate_timeout);
			if(start_autorotate_timeout!=null)
				clearTimeout(start_autorotate_timeout);
			
			krpano_set("autorotate.enabled",false);
			if(krpano.actions.pauseautorotation != null)
				krpano.call("pauseautorotation(forceplugin);");
			stop_autorotate_timeout= setInterval(function(){ krpano_set("autorotate.enabled",false);}, 500);
		}

		var caption_text = "";
		if(3 in arguments)
			caption_text = arguments[3];
		
		var targeted_element = arguments[0];

		var popup_width = null;
		if(1 in arguments)
		{
			popup_width = arguments[1];
			if(popup_width.indexOf("%") >= 0)
			{
				// stagewidth	= parseInt(krpano.get("stagewidth"));
				stagewidth	= parseInt(krpano_parent.width());
				popup_width	= stagewidth * popup_width.replace("%","") / 100;
				popup_width	= popup_width + "";
			}
		}
		var popup_height = null;
		if(2 in arguments)
		{
			popup_height = arguments[2];
			if(popup_height.indexOf("%") >= 0)
			{
				// stageheight	= parseInt(krpano.get("stageheight"));
				stageheight		= parseInt(krpano_parent.height());
				popup_height	= stageheight * popup_height.replace("%","") / 100;
				popup_height	= popup_height + "";
			}
		}

		$.htmllightbox.open({
			src: eval("$('#" + arguments[0] + "')"),
			caption  : caption_text,
			type: 'inline',
			toolbar  : false,
			fullScreen:false,
			smallBtn : true,
			width	 : popup_width,
			height	 : popup_height,
			parentEl : krpano_parent,
			touch	 : touch_temp,
			beforeClose : function() {
							if(apply_blur)
							{
								// krpano.call("EASY_HTML_LIGHTBOX___show_all_hotspots();");
								// krpano.call("tween(plugin[EASY_HTML_LIGHTBOX___pp_blur].range,0,0.3);");
								$(krpano_parent.find("> div:not([class])")[0]).css("filter","blur(0)");
							}
							if(autorotate_temp == true)
							{
								if(stop_autorotate_timeout!=null)
									clearInterval(stop_autorotate_timeout);
								if(start_autorotate_timeout!=null)
									clearTimeout(start_autorotate_timeout);
								
								autorotate_temp = false;
								if(krpano.actions.resumeautorotation != null)
									krpano.call("resumeautorotation(forceplugin);");
								krpano_set("autorotate.enabled",true);
								start_autorotate_timeout = setTimeout(function(){ krpano_set("autorotate.enabled",true); }, 500);
							}
			},
			afterLoad : function() {
							setTimeout(function(){
								document.getElementById(targeted_element).scrollTop = 0;
							}, 10);
							setTimeout(function(){
								document.getElementById(targeted_element).scrollTop = 0;
							}, 30);
							setTimeout(function(){
								document.getElementById(targeted_element).scrollTop = 0;
							}, 80);
			},
			afterShow : function() {
							setTimeout(function(){
								document.getElementById(targeted_element).scrollTop = 0;
							}, 10);
							setTimeout(function(){
								document.getElementById(targeted_element).scrollTop = 0;
							}, 30);
							setTimeout(function(){
								document.getElementById(targeted_element).scrollTop = 0;
							}, 50);
							setTimeout(function(){
								document.getElementById(targeted_element).scrollTop = 0;
							}, 100);
							setTimeout(function(){
								document.getElementById(targeted_element).scrollTop = 0;
							}, 150);
			}
		});
    }
    function open_infobox_popup(){
		//if($('#hide_bg_for_infobox').length==0)
		//	$('body').append("<style id='hide_bg_for_infobox'>.htmllightbox-bg{display:none !important;}</style>");
		$(".htmllightbox-bg").remove();
		krpano_actions_actioncaller = krpano.actions.actioncaller;
		//console.log("786");
		// console.log("info_box_style : " + info_box_style);
		// console.log("info_box_style_float : " + info_box_style_float);
		// console.log(arguments);
		//console.log(krpano.get("mouse"));
		//console.log(krpano.get("mouse.clickx"));
		// mouse.x / mouse.y
		// mouse.stagex / mouse.stagey
		// console.log(arguments[0]);
		// console.log(krpano);
		// console.log(name);
		// console.log(krpano.get("name"));
		// console.log(krpano.get("scope"));
		// console.log(krpano.get("scop"));
		// console.log(krpano.get("hotspot"));
		// console.log(krpano.get("caller"));
		// console.log(krpano.get("plugin"));
		var delay_time = 0;
		if(is_it_infobox == true){
			close_popup();
			function sleep(milliseconds) {
				const date = Date.now();
				let currentDate = null;
				do {
					currentDate = Date.now();
				} while (currentDate - date < milliseconds);
			}
			delay_time = 500;
		}
		var arguments_temp = arguments;
		clearTimeout(info_box_timeout);
		info_box_timeout = setTimeout(function(){
			function close_if_open_infobox(){if(is_it_infobox == true){close_popup();}}
			$(window).resize(close_if_open_infobox);
			
			
			arguments = arguments_temp;
			arguments[1] = translate_language(arguments[1]);
			arguments[1] = translate_path(arguments[1]);
			var afterClose_function = (8 in arguments && arguments[8] !="" && arguments[8] != null?arguments[8]:false);
			
			if(9 in arguments && arguments[9] !="" && arguments[9] != null)
				set_infobox_style(arguments[9],false);
			
			var info_box_style_btn_text = "";
			if(10 in arguments)
				info_box_style_btn_text = arguments[10];
			info_box_style_btn_text= translate_language(info_box_style_btn_text);
			
			//var btn_click_function = (9 in arguments && arguments[9] !="" && arguments[9] != null?arguments[9]:false);
			var btn_click_function = (11 in arguments && arguments[11] !="" && arguments[11] != null?arguments[11]:false);
			
			touch_temp = true;
			if(krpano.get("device.touch"))
				touch_temp = false;
			
			keyboard_temp = true;
			does_for_layer = false;
			layer_path = false;
			clickSlide_temp = "close";	
			if(6 in arguments && arguments[6] != "" && arguments[6] != "layer[]")
			{
				does_for_layer = true;
				touch_temp = false;
				keyboard_temp = false;
				clickSlide_temp = "";
				var temp_parent = krpano.get(arguments[6] + ".sprite");
				// var temp_parent = krpano_parent;
				$(temp_parent).addClass("plugin_iframe_container");
				$(temp_parent).find("div#plugin_iframe_child").remove();
				$("#css_placeholder_plugin_iframe_container").remove();

				
				var div = document.createElement("div");
				div.addEventListener("wheel", function(event){ event.stopPropagation(); }, true);
				div.addEventListener("mousewheel", function(event){ event.stopPropagation(); }, true);
				div.addEventListener("DOMMouseScroll", function(event){ event.stopPropagation(); }, true);
				div.addEventListener("touchstart", function(event){ if(krpano.device.ios && window.innerHeight == krpano.display.htmltarget.offsetHeight){ /* avoid the iOS 'overscrolling' for fullpage viewers */ var bs = document.body.parentNode.style; bs.position="fixed"; bs.top=0; bs.left=0; bs.right=0; bs.bottom=0; } krpano.control.preventTouchEvents = false; event.stopPropagation(); }, true);
				div.addEventListener("touchend", function(event){ krpano.control.preventTouchEvents = true; event.stopPropagation(); }, true);
				div.addEventListener("gesturestart", function(event){ event.preventDefault(); }, true);
				div.setAttribute("id", "plugin_iframe_child");
				temp_parent.appendChild(div);
				temp_parent = $(temp_parent).find("div#plugin_iframe_child");
				
				if(7 in arguments && arguments[7] == "false")// check for preload
					temp_parent.css("display","block");
				else
				{
					layer_path = arguments[6];
					krpano.set(layer_path + ".visible","false");
					temp_parent.css("display","none");
				}
				
				var style_temp   = "<style id='css_placeholder_plugin_iframe_container'>";
				style_temp 		+= ".plugin_iframe_container div#plugin_iframe_child {position: absolute;width:100%;height:100%;}";
				style_temp 		+= ".plugin_iframe_container .htmllightbox-container {position: absolute !important;}";
				style_temp 		+= ".plugin_iframe_container .htmllightbox-slide {padding: 0;}";
				style_temp 		+= ".plugin_iframe_container .htmllightbox-slide {overflow-x: hidden;}";
				style_temp 		+= ".plugin_iframe_container .htmllightbox-toolbar {display: none;}";
				style_temp 		+= ".plugin_iframe_container .htmllightbox-infobar {display: none;}";
				style_temp 		+= ".plugin_iframe_container .htmllightbox-caption {display: none;}";
				style_temp 		+= ".plugin_iframe_container .htmllightbox-navigation {display: none;}";
				style_temp 		+= ".plugin_iframe_container .htmllightbox-slide--current{overflow-x: hidden !important;}";
				style_temp 		+= ".htmllightbox-active{height: 100% !important;}";
				style_temp 		+= "</style>";
				$("body").append(style_temp);
				// console.log(style_temp);
				// return true;
			}
			else
				var temp_parent = krpano_parent;
			
			
			if(apply_blur && temp_parent == krpano_parent && info_box_style_float==false)
			{
				// krpano.call("EASY_HTML_LIGHTBOX___hide_all_hotspots();");
				// krpano.call("tween(plugin[EASY_HTML_LIGHTBOX___pp_blur].range,10.5,0.3);");
				$(krpano_parent.find("> div:not([class])")[0]).css("transition","all 300ms ease-in-out");
				$(krpano_parent.find("> div:not([class])")[0]).css("filter","blur(3px)");
			}
			var autorotate_temp = false;
			if((stop_autorotate || info_box_style_float==true) && krpano.get("autorotate.enabled") == true && temp_parent == krpano_parent)
				autorotate_temp = true;
			if((stop_autorotate || info_box_style_float==true) && temp_parent == krpano_parent)
			{
				if(stop_autorotate_timeout!=null)
					clearInterval(stop_autorotate_timeout);
				if(start_autorotate_timeout!=null)
					clearTimeout(start_autorotate_timeout);
				
				krpano_set("autorotate.enabled",false);
				if(krpano.actions.pauseautorotation != null)
					krpano.call("pauseautorotation(forceplugin);");
				stop_autorotate_timeout= setInterval(function(){ krpano_set("autorotate.enabled",false);}, 500);
			}

			
			$.htmllightbox.close();
			
			
			var title = "";
			if(0 in arguments)
				title = arguments[0];
			title = translate_language(title);
			
			var image_html = "";
			var image_type = "";
			if(1 in arguments && arguments[1]!="" && arguments[1]!=";")
			{
				image = arguments[1];
				if(image.substr(image.length - 1)==";")
					arguments[1] = image.substr(0,image.length - 1);
				if(arguments[1].indexOf(";")==-1)
				{
					var image = "";
					image_type = "single";
					image = arguments[1];
					image = image.replace("%FIRSTXML%",krpano.Kloader.firstxmlpath);
					image_html = '<img src="' + image + '" />';
				}
				else
				{
					image_type = "multiple";
					var image_array = arguments[1].split(";");
					image_html += '<div class="owl-carousel">';
					for (i = 0; i < image_array.length; ++i) {
						if(image_array[i]!="")
							image_html += '<img src="' + image_array[i].replace("%FIRSTXML%",krpano.Kloader.firstxmlpath) + '" />';
					}
					image_html += '</div>';
				}
			}
			var text = "";
			if(2 in arguments)
			{
				text = arguments[2];
				text = translate_language(text);
				// text = text.replace('&lt;','<').replace('&gt;', '>'); 
				text = text.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
				// console.log(text);
			}
			// width:arguments[1],
			// height:arguments[2]
			
			var width = "300px";
			if(3 in arguments && arguments[3]!="px")
				width = (arguments[3]+ "px").toLowerCase().replace("pxpx","px");	
			
			var height = "400px";
			if(4 in arguments && arguments[4]!="px")
				height = (arguments[4] + "px").toLowerCase().replace("pxpx","px");		
			
			var text_direction = "ltr";
			if(5 in arguments && arguments[5]=="rtl")
				text_direction = "rtl";
			
			if(info_box_style=="style_1"){
				/*
				var html_element = '';
				if(text!="")
					html_element += '<div id="popup-box" class="' + text_direction + '" style="display:none;" >';
				else
					html_element += '<div id="popup-box" class="image ' + text_direction + '" style="display:none;" >';
				if(title!="")
					html_element += '	<div id="popup-box-title" >' + title + '</div>';
					html_element += '	<div id="popup-box-content" >';
				// if(image!="" && image_html == "single")
					// html_element += '		<div id="popup-box-image"><img src="' + image + '" /></div>';
				// else if(image!="" && image_html != "single" && image_html!="")
					// html_element += '		<div id="popup-box-image">' + image_html + '</div>';
				if(image_html!="")
					html_element += '		<div id="popup-box-image">' + image_html + '</div>';
				if(text!="")
					html_element += '		<div id="popup-box-text" >' + text + '</div>';
					html_element += '	</div>';
					html_element += '</div>';
				*/
				var html_element = '';
				if(text!="")
					html_element += '<div id="popup-box" class="' + text_direction + '" style="display:none;" >';
				else
					html_element += '<div id="popup-box" class="image ' + text_direction + '" style="display:none;" >';
				if(title!="")
					html_element += '	<div id="popup-box-title" >' + title + '</div>';
				if(image_html!="")
					html_element += '	<div id="popup-box-image">' + image_html + '</div>';
				
					html_element += '	<div id="popup-box-text-warper" >';
					html_element += '		<div id="popup-box-content" >';
				if(text!="")
					html_element += '			<div id="popup-box-text" >' + text + '</div>';
					html_element += '		</div>';
					html_element += '	</div>';
					html_element += '</div>';
			}
			else if(info_box_style=="style_2"){
				var html_element = '';
				if(text!="")
					html_element += '<div id="popup-box" class="' + text_direction + '" style="display:none;" >';
				else
					html_element += '<div id="popup-box" class="image ' + text_direction + '" style="display:none;" >';
				if(image_html!="")
					html_element += '	<div id="popup-box-image">' + image_html + '</div>';
				
					html_element += '	<div id="popup-box-text-warper" >';
				if(title!="")
					html_element += '		<div id="popup-box-title" >' + title + '</div>';
					html_element += '		<div id="popup-box-content" >';
				if(text!="")
					html_element += '			<div id="popup-box-text" >' + text + '</div>';
					html_element += '		</div>';
					html_element += '	</div>';
					html_element += '</div>';
			}
			else if(info_box_style=="style_3"){
				var html_element = '';
				if(text!="")
					html_element += '<div id="popup-box" class="' + text_direction + '" style="display:none;" >';
				else
					html_element += '<div id="popup-box" class="image ' + text_direction + '" style="display:none;" >';
				if(image_html!="")
					html_element += '	<div id="popup-box-image">' + image_html + '</div>';
				
					html_element += '	<div id="popup-box-text-warper" >';
				if(title!="")
					html_element += '		<div id="popup-box-title" >' + title + '</div>';
					html_element += '		<div id="popup-box-content" >';
				if(text!="")
					html_element += '			<div id="popup-box-text" >' + text + '</div>';
					html_element += '		</div>';
					html_element += '	</div>';
					html_element += '</div>';
			}
			else if(info_box_style=="style_4"){			
				var html_element = '';
				if(text!="")
					html_element += '<div id="popup-box" class="' + text_direction + '" style="display:none;" >';
				else
					html_element += '<div id="popup-box" class="image ' + text_direction + '" style="display:none;" >';
				if(image_html!="")
					html_element += '	<div id="popup-box-image">' + image_html + '</div>';
				
					html_element += '	<div id="popup-box-text-warper" >';
				if(title!="")
					html_element += '		<div id="popup-box-title" >' + title + '</div>';
					html_element += '		<div id="popup-box-content" >';
				if(text!="")
					html_element += '			<div id="popup-box-text" >' + text + '</div>';
					html_element += '		</div>';
					html_element += '	</div>';
					html_element += '</div>';
			}
			else if(info_box_style=="style_5"){
				var html_element = '';
				if(text!="")
					html_element += '<div id="popup-box" class="' + text_direction + '" style="display:none;" >';
				else
					html_element += '<div id="popup-box" class="image ' + text_direction + '" style="display:none;" >';
				
					html_element += '	<div id="popup-box-text-warper" >';
				if(title!="")
					html_element += '		<div id="popup-box-title" >' + title + '</div>';
					html_element += '		<div id="popup-box-content" >';
				if(text!="")
					html_element += '			<div id="popup-box-text" >' + text + '</div>';
					html_element += '		</div>';
					html_element += '	</div>';
					
				if(image_html!="")
					html_element += '	<div id="popup-box-image">' + image_html + '</div>';
					
					html_element += '</div>';
			}
			else if(info_box_style=="style_24"){
				var html_element = '';
				if(text!="")
					html_element += '<div id="popup-box" class="' + text_direction + '" style="display:none;" >';
				else
					html_element += '<div id="popup-box" class="image ' + text_direction + '" style="display:none;" >';

				if(image_html!="" && info_box_style_image_align == "left")
					html_element += '	<div id="popup-box-image">' + image_html + '</div>';
				
					html_element += '	<div id="popup-box-text-warper" >';
				if(title!="")
					html_element += '		<div id="popup-box-title" >' + title + '</div>';
					html_element += '		<div id="popup-box-content" >';
				if(text!="")
					html_element += '			<div id="popup-box-text" >' + text + '</div>';
				if(info_box_style_btn_text && info_box_style_btn_text!="" && btn_click_function)
					html_element += '			<div id="popup-box-btn" onclick="krpano_call(\'close_popup();\');setTimeout(function(){krpano_call(\'' + btn_click_function + '\');}, 50);" >' + info_box_style_btn_text + '</div>';
					html_element += '		</div>';
					html_element += '	</div>';
				if(image_html!="" && info_box_style_image_align == "right")
					html_element += '	<div id="popup-box-image">' + image_html + '</div>';
					html_element += '</div>';
			}
			
			$('#popup-box').remove();
			$('#popup-box-style').remove();
			$('body').append(html_element);
			{
				style	  = "<style id='popup-box-style'>";
				style 	 += "/*-------------- solid popup box ------------------ */";
				style 	 += ".htmllightbox-slide{overflow:hidden;}";
				style 	 += "div#popup-box,div#popup-box * {box-sizing: border-box;outline: none;cursor: default;}";
				style 	 += "div#popup-box a {color: rgb(0, 0, 238);}";
				if(does_for_layer)
					style 	 += "div#popup-box { display:none;overflow: hidden; position: absolute; width: 100%; max-width: " + width + ";height: 100%;max-height: " + height + "; z-index: 9999999999; left: 0; right: 0; top: 0; bottom: 0; margin: auto; background-color:rgba(255,255,255,1); border-radius: 0px; padding: 0px;}";
				else
					style 	 += "div#popup-box { display:none;overflow: hidden; position: absolute; width: 80%; max-width: " + width + ";height: 80%;max-height: " + height + "; z-index: 9999999999; left: 0; right: 0; top: 0; bottom: 0; margin: auto; background-color:rgba(255,255,255,0.95); background-color:rgba(255,255,255,1); border-radius: 7px; padding: 0px; box-shadow: 0 2px 10px 0 rgba(0,0,0,.16), 0 2px 5px 0 rgba(0,0,0,.26);  }";
				if(does_for_layer)
					style 	 += "#popup-box button.htmllightbox-button.htmllightbox-close-small {display:none;}";
				
				if(does_for_layer)
					style 	 += "#popup-box div#popup-box-content {width: 100%; height: calc(100% - 59px); overflow: auto; padding: 0 20px 20px 20px;}";
				else
					style 	 += "#popup-box div#popup-box-content {width: 100%; height: calc(100% - 50px); overflow: auto; padding: 0 20px 20px 20px;}";

				style 	 += "#popup-box #popup-box-content{scrollbar-width: thin;}";
				style 	 += "#popup-box #popup-box-content::-webkit-scrollbar-track{-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0);background-color: rgba(255,255,255,0);cursor: pointer;}";
				style 	 += "#popup-box #popup-box-content::-webkit-scrollbar{width: 6px;background-color: rgba(255,255,255,0);cursor: pointer;}";
				style 	 += "#popup-box #popup-box-content::-webkit-scrollbar-thumb{background-color: rgba(0, 0, 0, 0.3);cursor: pointer;transition: all 300ms ease-in-out;border-radius: 900px;}";
				style 	 += "#popup-box #popup-box-content::-webkit-scrollbar-thumb:hover{background-color: #62dddb;}";
				
				// style 	 += "div#popup-box #popup-box-title{ line-height: 36px; padding: 11px 8px 9px 8px; font-weight: 300;font-size: 18px;font-family: inherit;white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }";
				style 	 += "div#popup-box #popup-box-title{ line-height: 36px;padding: 11px 20px 9px 20px;font-weight: bold;white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }";
				style 	 += "div#popup-box #popup-box-image { width: 100%; /*height: 100px;*/ background-repeat: no-repeat; background-size: cover; margin-bottom: 10px; border-radius: 4px;overflow:hidden; }";
				style 	 += "div#popup-box-image img { max-width: 100%;border-radius: 4px;display: block; }";
				style 	 += ".owl-wrapper-outer {border-radius: 4px;overflow:hidden;}";
				// style 	 += "div#popup-box #popup-box-text { line-height: 19px; font-size: 14px; font-weight: 400; text-align: justify; }";
				style 	 += "div#popup-box #popup-box-text { line-height: 19px; text-align: justify; }";
				style 	 += "#popup-box.image {height: unset;}";
				style 	 += "#popup-box.image #popup-box-content{height:auto;}";
				style 	 += "#popup-box.image #popup-box-image{margin-bottom: 0px;}";
				style 	 += "#popup-box.image {height: fit-content;}";
				style 	 += "#popup-box.image #popup-box-image img {border-radius: 4px;}";
				style 	 += "#popup-box.rtl,#popup-box.rtl * {direction:rtl;}";
				style 	 += "#popup-box.rtl #popup-box-title {text-align:right;}";
				style 	 += "#popup-box.rtl button.htmllightbox-button.htmllightbox-close-small {right: auto;left: 0;}";
				style 	 += "#popup-box.rtl #popup-box-image, #popup-box.rtl #popup-box-image * {direction: ltr !important;}";
				style 	 += "div#popup-box a.btn, div#popup-box a.btn:hover{ text-decoration:none; color:#ffffff; } div#popup-box .btn { display: inline-block; margin-bottom: 0; font-weight: 400; text-align: center; white-space: nowrap; vertical-align: middle; -ms-touch-action: manipulation; touch-action: manipulation; cursor: pointer; background-image: none; border: 1px solid transparent; padding: 6px 12px; font-size: 14px; line-height: 1.42857143; border-radius: 4px; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; font: inherit; margin: 0; overflow: visible; text-transform: none; } div#popup-box .btn-default { color: #333; background-color: #fff; border-color: #ccc; } div#popup-box .btn-primary { color: #fff; background-color: #337ab7; border-color: #2e6da4; } div#popup-box .btn-success { color: #fff; background-color: #5cb85c; border-color: #4cae4c; } div#popup-box .btn-info { color: #fff; background-color: #5bc0de; border-color: #46b8da; } div#popup-box .btn-warning { color: #fff; background-color: #f0ad4e; border-color: #eea236; } div#popup-box .btn-danger { color: #fff; background-color: #d9534f; border-color: #d43f3a; } div#popup-box .btn-link, div#popup-box .btn-link:active, div#popup-box .btn-link:focus, div#popup-box .btn-link:hover { border-color: transparent; } .btn.focus, .btn:focus, .btn:hover { color: #333; text-decoration: none; } div#popup-box .btn-default:hover { color: #333; background-color: #e6e6e6; border-color: #adadad; } div#popup-box .btn-primary:hover { color: #fff; background-color: #286090; border-color: #204d74; } div#popup-box .btn-success:hover { color: #fff; background-color: #449d44; border-color: #398439; } div#popup-box .btn-info:hover { color: #fff; background-color: #31b0d5; border-color: #269abc; } div#popup-box .btn-warning:hover { color: #fff; background-color: #ec971f; border-color: #d58512; } div#popup-box .btn-danger:hover { color: #fff; background-color: #c9302c; border-color: #ac2925; } div#popup-box .btn-link:focus, div#popup-box .btn-link:hover { color: #23527c; text-decoration: underline; background-color: transparent; }";
				if(does_for_layer)
					style 	 += ".htmllightbox-bg{opacity:0 !important;}";
				
				if(info_box_style_bg_color)
					style 	 += '#popup-box {background-color:' + info_box_style_bg_color + ' !important;}';
				if(info_box_style_text_color)
					style 	 += '#popup-box {color:#' + info_box_style_text_color + ' !important;}';
				if(info_box_style_title_color)
					style 	 += '#popup-box #popup-box-title{color:#' + info_box_style_title_color + ' !important;}';
				if(info_box_style_font_name)
					style 	 += '#popup-box *{' + info_box_style_font_name + '}';
				if(info_box_style_font_size)
					style 	 += '#popup-box *{' + info_box_style_font_size + '}';
				if(info_box_style_btn_text_color)
					style 	 += '#popup-box #popup-box-btn{color:#' + info_box_style_btn_text_color + ' !important;}';
				if(info_box_style_btn_bg_color)
					style 	 += '#popup-box #popup-box-btn{background-color:' + info_box_style_btn_bg_color + ' !important;}';
					style 	 += '#popup-box #popup-box-btn{cursor: pointer; border-radius: 2px; width: fit-content; padding: 4px 8px; font-size: 90%; font-weight: bold; margin: 10px auto -4px auto;-moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -ms-user-select: none; user-select: none;}';
				
				if(info_box_style=="style_1"){
					// style 	 += ".htmllightbox-slide--html .htmllightbox-close-small{display:none;}";
					style 	 += "#popup-box-image .owl-controls {margin-bottom: 0;margin-top: -30px;}";
					style 	 += ".owl-theme .owl-controls .owl-page.active span, .owl-theme .owl-controls.clickable .owl-page:hover span {filter: Alpha(Opacity=100);opacity: 0.9;background-color: #fdfdfd;}";
					
					style 	 += "div#popup-box {padding: 10px 20px;height:auto;max-height:unset;overflow: visible; display: block; position: relative; width: 100%; border-radius: 6px; color: rgba(0, 0, 0, 0.87); background: #fff; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12); }";
					style 	 += "div#popup-box #popup-box-text-warper {}";
					style 	 += "div#popup-box #popup-box-title{padding: 0px 0px 7px 0px;}";
					style 	 += "div#popup-box #popup-box-content{padding: 0 0px 10px 0px;}";
					style 	 += "div#popup-box #popup-box-image {width: 100%;position: relative;overflow: hidden;margin-left: 0;margin-right: 0;margin-top: 0;border-radius: 4px;margin-bottom:10;}";
					style 	 += "div#popup-box div#popup-box-image img {max-width: 100%;width: 100%;height: 100%;border: 6px;display: block;border-radius: 4px;}";
					
					if(info_box_style_compact == true){
						style 	 += "div#popup-box #popup-box-image {z-index:-1;}";
						style 	 += "div#popup-box #popup-box-title {background-color: rgba(0, 0, 0, 0.38); margin-top: -57px; margin-bottom: 12px; color: #ffffff; width: calc(100% + 48px); padding-left: 24px; margin-left: -24px; padding-top: 5px; box-sizing: border-box; height: 45px; }";
					}
				}
				if(info_box_style=="style_2"){
					style 	 += ".htmllightbox-slide--html .htmllightbox-close-small{display:none;}";
					style 	 += "#popup-box-image .owl-controls {margin-bottom: 0;margin-top: -30px;}";
					style 	 += ".owl-theme .owl-controls .owl-page.active span, .owl-theme .owl-controls.clickable .owl-page:hover span {filter: Alpha(Opacity=100);opacity: 0.9;background-color: #fdfdfd;}";
					
					style 	 += "div#popup-box {height:auto;max-height:unset;overflow: visible; display: block; position: relative; width: 100%; border-radius: 6px; color: rgba(0, 0, 0, 0.87); background: #fff; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12); }";
					style 	 += "div#popup-box #popup-box-text-warper {padding: 12px 24px;}";
					style 	 += "div#popup-box #popup-box-title{padding: 0px 0px 9px 0px;}";
					style 	 += "div#popup-box #popup-box-content{padding: 0 0px 10px 0px;}";
					style 	 += "div#popup-box #popup-box-image {width: 100%;position: relative;overflow: hidden;margin-left: 0;margin-right: 0;margin-top: 0;border-radius: 6px 6px 0 0;margin-bottom:0;}";
					style 	 += "div#popup-box div#popup-box-image img {max-width: 100%;width: 100%;height: 100%;border: 6px;display: block;border-radius: 6px 6px 0 0;}";
					
					if(info_box_style_compact == true){
						style 	 += "div#popup-box #popup-box-image {z-index:-1;}";
						style 	 += "div#popup-box #popup-box-title {background-color: rgba(0, 0, 0, 0.38); margin-top: -57px; margin-bottom: 12px; color: #ffffff; width: calc(100% + 48px); padding-left: 24px; margin-left: -24px; padding-top: 5px; box-sizing: border-box; height: 45px; }";
					}
				}
				if(info_box_style=="style_3"){
					style 	 += ".htmllightbox-slide--html .htmllightbox-close-small{display:none;}";
					style 	 += "#popup-box-image .owl-controls {margin-bottom: 0;margin-top: -30px;}";
					style 	 += ".owl-theme .owl-controls .owl-page.active span, .owl-theme .owl-controls.clickable .owl-page:hover span {filter: Alpha(Opacity=100);opacity: 0.9;background-color: #fdfdfd;}";
					
					style 	 += "div#popup-box {height:auto;max-height:unset;overflow: visible; display: block; position: relative; width: 100%; border-radius: 6px; color: rgba(0, 0, 0, 0.87); background: #fff; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12); }";
					style 	 += "div#popup-box #popup-box-text-warper {padding: 12px 24px;}";
					style 	 += "div#popup-box #popup-box-title{padding: 0px 0px 9px 0px;}";
					style 	 += "div#popup-box #popup-box-content{padding: 0 0px 10px 0px;}";
					style 	 += "div#popup-box #popup-box-image {width: calc(100% - 30px);position: relative;overflow: hidden;margin-left: 15px;margin-right: 15px;margin-top: -30px;border-radius: 6px;box-shadow: 0 16px 38px -12px rgba(0, 0, 0, 0.56), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);}";
					style 	 += "div#popup-box div#popup-box-image img {max-width: 100%;width: 100%;height: 100%;border: 6px;display: block;border-radius: 6px;}";
					
					if(info_box_style_compact == true){
						style 	 += "div#popup-box #popup-box-image {z-index:-1;}";
						style 	 += "div#popup-box #popup-box-title {background-color: rgba(0, 0, 0, 0.38);margin-top: -67px; margin-bottom: 20px; color: #ffffff; width: calc(100% + 18px); padding-left: 8px; margin-left: -9px; border-radius: 0 0 6px 6px; padding-top: 5px; box-sizing: border-box; height: 45px;}";
					}
				}
				if(info_box_style=="style_4"){
					// style 	 += "div#popup-box #popup-box-image {text-align: center;width: calc(100% - 20px) !important;margin: auto;border-radius: 13px;overflow: hidden;margin-top: -80px;}";
					
					style 	 += ".htmllightbox-slide--html .htmllightbox-close-small{display:none;}";
					style 	 += "#popup-box-image .owl-controls {margin-bottom: 0;margin-top: -30px;}";
					style 	 += ".owl-theme .owl-controls .owl-page.active span, .owl-theme .owl-controls.clickable .owl-page:hover span {filter: Alpha(Opacity=100);opacity: 0.9;background-color: #fdfdfd;}";
					style 	 += ".owl-wrapper-outer {border-radius: 50%;overflow:hidden;}";
					
					style 	 += "div#popup-box {height:auto;max-height:unset;overflow: visible; display: block; position: relative; width: 100%; border-radius: 6px; color: rgba(0, 0, 0, 0.87); background: #fff; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12); }";
					style 	 += "div#popup-box #popup-box-text-warper {padding: 0px 24px 12px 24px;}";
					style 	 += "div#popup-box #popup-box-title{padding: 0px 0px 2px 0px;}";
					style 	 += "div#popup-box #popup-box-content{padding: 0 0px 10px 0px;}";
					style 	 += "div#popup-box #popup-box-image {width: 150px;position: relative;overflow: hidden;margin-left: auto;margin-right: auto;margin-top: -75px;border-radius: 50%;box-shadow: 0 16px 38px -12px rgba(0, 0, 0, 0.56), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);}";

					style 	 += "div#popup-box #popup-box-image img {max-width: 100%;width: 150px;height: 150px;object-fit: cover;border-radius: 50%;display: block;}";

				}
				if(info_box_style=="style_5"){
					style 	 += ".htmllightbox-slide--html .htmllightbox-close-small{display:none;}";
					style 	 += "#popup-box-image .owl-controls {margin-bottom: 0;margin-top: -30px;}";
					style 	 += ".owl-theme .owl-controls .owl-page.active span, .owl-theme .owl-controls.clickable .owl-page:hover span {filter: Alpha(Opacity=100);opacity: 0.9;background-color: #fdfdfd;}";
					style 	 += ".owl-wrapper-outer {border-radius: 50%;overflow:hidden;}";
					
					style 	 += "div#popup-box {height:auto;max-height:unset;overflow: visible; display: block; position: relative; width: 100%; border-radius: 6px; color: rgba(0, 0, 0, 0.87); background: #fff; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12); }";
					style 	 += "div#popup-box #popup-box-text-warper {padding: 12px 24px 5px 24px;}";
					style 	 += "div#popup-box #popup-box-title{padding: 0px 0px 2px 0px;}";
					style 	 += "div#popup-box #popup-box-content{padding: 0 0px 10px 0px;}";
					style 	 += "div#popup-box #popup-box-image {width: 150px;position: relative;overflow: hidden;margin-left: auto;margin-right: auto;margin-bottom: -75px;border-radius: 50%;box-shadow: 0 16px 38px -12px rgba(0, 0, 0, 0.56), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2);}";

					style 	 += "div#popup-box #popup-box-image img {max-width: 100%;width: 150px;height: 150px;object-fit: cover;border-radius: 50%;display: block;}";
				}
				if(info_box_style=="style_24"){					
					style 	 += ".htmllightbox-slide--html .htmllightbox-close-small{display:none;}";
					style 	 += "#popup-box-image .owl-controls {margin-bottom: 0;margin-top: -30px;}";
					style 	 += ".owl-theme .owl-controls .owl-page.active span, .owl-theme .owl-controls.clickable .owl-page:hover span {filter: Alpha(Opacity=100);opacity: 0.9;background-color: #fdfdfd;}";
					style 	 += ".owl-carousel {height: 100%;}";
					style 	 += ".owl-carousel .owl-wrapper-outer {height: 100%;}";
					style 	 += ".owl-carousel .owl-wrapper, .owl-carousel .owl-item {height: 100%;}";
					style 	 += ".owl-wrapper-outer {border-radius: 0px 6px 6px 0;overflow:hidden;}";
					
					style 	 += "div#popup-box {height:auto;max-height:unset;min-height:" + height + ";overflow: visible; display: block; position: relative; width: 100%; border-radius: 6px; color: rgba(0, 0, 0, 0.87); background: #fff; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12); }";
					if(image_html=="")
					style 	 += "div#popup-box #popup-box-text-warper {padding: 6px 12px 6px 12px;min-height:" + height + ";width: calc(100% - 0);display: inline-block;}";
					else
					style 	 += "div#popup-box #popup-box-text-warper {padding: 6px 12px 6px 12px;min-height:" + height + ";width: calc(100% - " + info_box_style_image_width + ");display: inline-block;}";
					// style 	 += "div#popup-box #popup-box-text-warper {padding: 12px 12px;min-height:" + height + ";width: calc(100% - " + info_box_style_image_width + ");display: inline-block;}";
					// style 	 += "div#popup-box #popup-box-title{padding: 0px 0px 9px 0px;}";
					style 	 += "div#popup-box #popup-box-title{padding: 0;border-bottom: 2px solid " + info_box_style_title_border_color + ";margin-bottom: 10px;}";


 					style 	 += "div#popup-box #popup-box-content{padding: 0 0px 10px 0px;}";
					style 	 += "div#popup-box #popup-box-text{line-height: normal;text-align: unset;}";
					style 	 += "div#popup-box.rtl #popup-box-text{text-align: right;}";
					style 	 += "div#popup-box #popup-box-image {width: " + info_box_style_image_width + ";height: 100%;right: 0;position: absolute;overflow: hidden;margin: 0;border-radius: 0px 6px 6px 0;display: inline-block;}";
					style 	 += "div#popup-box div#popup-box-image img {max-width: 100%;width: 100%;object-fit: cover;height: 100%;border: 6px;display: block;border-radius: 0px 6px 6px 0;}";
					if(info_box_style_image_align == "left")
					{
					if(image_html=="")
					style 	 += "div#popup-box #popup-box-text-warper {margin-left: 0;}";
					else
					style 	 += "div#popup-box #popup-box-text-warper {margin-left: " + info_box_style_image_width + ";}";
					style 	 += "div#popup-box #popup-box-image {left: 0;right: auto;border-radius: 6px 0px 0px 6px;}";
					style 	 += "div#popup-box div#popup-box-image img {border-radius: 6px 0px 0px 6px;}";
					style 	 += ".owl-wrapper-outer {border-radius: 6px 0px 0px 6px;}";
					}
					
					// style 	 += '#popup-box {background-color:transparent !important;box-shadow: none !important;}';
					// style 	 += 'div#popup-box #popup-box-text-warper {border-radius: 6px;background-color:' + info_box_style_bg_color + ' !important;}';
					// style 	 += "div#popup-box #popup-box-image {height: calc(100% - 10px);border-radius: 0 6px 6px 0;margin-top: 5px;}";
				}
				// style 	 += "div#popup-box-image {position: absolute; width: calc(100% - 20px) !important; opacity: 1; top: -29px; border-radius: 12px !important; overflow: hidden; }";
				// style 	 += "div#popup-box {padding-top: 158px;}";
				// style 	 += "div#popup-box {overflow: visible;}";



				style 	 += "</style>";
				$('head').append(style);
			}

			window.show_info_box_now = function(){
				if(info_box_style_float==true && temp_parent == krpano_parent)
				{		
					if(krpano_actions_actioncaller._type=="hotspot")
					{
						mouse_stagex = krpano.spheretoscreen(krpano.get("hotspot[" + krpano_actions_actioncaller.name + "].ath"),krpano.get("hotspot[" + krpano_actions_actioncaller.name + "].atv")).x;
						mouse_stagey = krpano.spheretoscreen(krpano.get("hotspot[" + krpano_actions_actioncaller.name + "].ath"),krpano.get("hotspot[" + krpano_actions_actioncaller.name + "].atv")).y + 32;
						window.info_box_update_position = function(){
							mouse_stagex = krpano.spheretoscreen(krpano.get("hotspot[" + krpano_actions_actioncaller.name + "].ath"),krpano.get("hotspot[" + krpano_actions_actioncaller.name + "].atv")).x;
							mouse_stagey = krpano.spheretoscreen(krpano.get("hotspot[" + krpano_actions_actioncaller.name + "].ath"),krpano.get("hotspot[" + krpano_actions_actioncaller.name + "].atv")).y + 32;							
							style 	 = "div#popup-box {left:" + mouse_stagex + "px !important;top:" + mouse_stagey + "px !important;right:auto !important;bottom:auto !important;pointer-events: auto;position: absolute !important;}";
							$('#popup-box-style').append(style);
						};
						// krpano.set("events[__easyhtmllightbox__].onviewchange", info_box_update_position);
					}
					else
					{
						mouse_stagex = krpano.get("mouse.stagex");
						mouse_stagey = krpano.get("mouse.stagey");
					}
					style 	 = "";
					style 	 += "div#popup-box {left:" + mouse_stagex + "px !important;top:" + mouse_stagey + "px !important;right:auto !important;bottom:auto !important;pointer-events: auto;position: absolute !important;}";
					style 	 += ".htmllightbox-is-open .htmllightbox-bg{display:none !important;}";
					style 	 += ".htmllightbox-container {pointer-events: none;}";
					$('#popup-box-style').append(style);
					is_it_infobox = true;
				}
				
				$.htmllightbox.open({
					src: eval("$('#popup-box')"),
					caption  : '',
					type: 'inline',
					toolbar  : false,
					smallBtn : true,
					fullScreen:false,
					// parentEl : krpano_parent,
					parentEl : temp_parent,
					touch:touch_temp,
					keyboard: keyboard_temp,
					clickSlide: clickSlide_temp,
					afterShow : function() {
									if(info_box_style_float==true && temp_parent == krpano_parent)
										$(".htmllightbox-bg").remove();
									if(info_box_style_float==true && temp_parent == krpano_parent)
										$('.htmllightbox-is-open .htmllightbox-bg').remove();
									
									krpano.set(layer_path + ".visible","true");
									temp_parent.css("display","block");
									setTimeout(function(){
										document.getElementById('popup-box-content').scrollTop = 0;
									}, 10);
									setTimeout(function(){
										document.getElementById('popup-box-content').scrollTop = 0;
									}, 30);
									setTimeout(function(){
										document.getElementById('popup-box-content').scrollTop = 0;
									}, 50);
									setTimeout(function(){
										document.getElementById('popup-box-content').scrollTop = 0;
									}, 100);
									setTimeout(function(){
										document.getElementById('popup-box-content').scrollTop = 0;
									}, 150);
					},
					beforeClose : function() {
									krpano.set("events[__easyhtmllightbox__].onviewchange", function(){} );
					},
					afterClose : function() {
									if(info_box_style_float==true && temp_parent == krpano_parent)
										$(".htmllightbox-bg").remove();
									krpano.call("if( gyroWasEnabled EQ true,set(gyroWasEnabled,false);set(plugin[gyroscope].enabled, true););");
									
									$(document).unbind("resize", close_if_open_infobox);
									is_it_infobox = false;
									$('#popup-box').remove();
									$('#popup-box-style').remove();
									

									if(afterClose_function)
										krpano.call(afterClose_function);
									
									if(apply_blur && temp_parent == krpano_parent)
									{
										// krpano.call("EASY_HTML_LIGHTBOX___show_all_hotspots();");
										// krpano.call("tween(plugin[EASY_HTML_LIGHTBOX___pp_blur].range,0,0.3);");
										$(krpano_parent.find("> div:not([class])")[0]).css("filter","blur(0)");
									}
									if(autorotate_temp == true)
									{
										if(stop_autorotate_timeout!=null)
											clearInterval(stop_autorotate_timeout);
										if(start_autorotate_timeout!=null)
											clearTimeout(start_autorotate_timeout);
										
										autorotate_temp = false;
										if(krpano.actions.resumeautorotation != null)
											krpano.call("resumeautorotation(forceplugin);");
										krpano_set("autorotate.enabled",true);
										start_autorotate_timeout = setTimeout(function(){ krpano_set("autorotate.enabled",true); }, 500);
									}
					},
					afterLoad : function() {
									if(info_box_style_float==true && temp_parent == krpano_parent)
										$(".htmllightbox-bg").remove();
									if(info_box_style=="style_3"){
										$(".htmllightbox-slide--html").css("overflow","hidden");
									}
									$(".owl-carousel").owlCarousel({
										transitionStyle : "fade",
										singleItem:true,
										autoPlay: 3000
									});
									setTimeout(function(){
										document.getElementById('popup-box-content').scrollTop = 0;
									}, 10);
									setTimeout(function(){
										document.getElementById('popup-box-content').scrollTop = 0;
									}, 30);
									setTimeout(function(){
										document.getElementById('popup-box-content').scrollTop = 0;
									}, 80);
									
									// if(info_box_style_float==true && temp_parent == krpano_parent && krpano_actions_actioncaller._type!="hotspot")
									// if(info_box_style_float==true && temp_parent == krpano_parent)
									// if(info_box_style_float==true && temp_parent == krpano_parent && stagewidth>750)
									stagewidth	 = parseInt(krpano.get("stagewidth"));
									if(info_box_style_float==true && temp_parent == krpano_parent && krpano_actions_actioncaller._type!="hotspot" && stagewidth>750)
									{
										//console.log("BBBBBBBBBBBBBB");
										style		 = "";
										stagewidth	 = parseInt(krpano.get("stagewidth"));
										stageheight	 = parseInt(krpano.get("stageheight"));
										mouse_stagey = parseInt(krpano.get("mouse.stagey"));
										mouse_stagex = parseInt(krpano.get("mouse.stagex"));
										box_width	 = parseInt($("div#popup-box").width()) + 10;
										box_height	 = parseInt($("div#popup-box").height()) + 10;
										if(stagewidth-mouse_stagex<box_width)
										{
											mouse_stagex = stagewidth-mouse_stagex;
											style 	+= "div#popup-box {right:" + mouse_stagex + "px !important;left:auto !important;}";
										}
										if((stageheight-mouse_stagey<box_height) && (mouse_stagey - box_height>0))
										{
											// console.log("(stageheight-mouse_stagey<box_height) && (mouse_stagey - box_height>0)");
											mouse_stagey = stageheight-mouse_stagey;
											style 	+= "div#popup-box {bottom:" + mouse_stagey + "px !important;top:auto !important;}";
										}
										else if((stageheight-mouse_stagey<box_height) && (stageheight/2>mouse_stagey))
										{
											// console.log("stageheight/2>mouse_stagey");
											style 	+= "div#popup-box {bottom:10px !important;top:auto !important;}";
										}
										else if((stageheight-mouse_stagey<box_height) && (stageheight/2<mouse_stagey))
										{
											// console.log("stageheight/2>mouse_stagey");
											style 	+= "div#popup-box {top:10px !important;top:auto !important;}";
										}
										$('#popup-box-style').append(style);
									}
									// else if(info_box_style_float==true && temp_parent == krpano_parent && stagewidth<=750){
									else if(info_box_style_float==true && temp_parent == krpano_parent /* && krpano_actions_actioncaller._type=="hotspot" */ && stagewidth<=750){
										stagewidth	 = parseInt(krpano.get("stagewidth"));
										stageheight	 = parseInt(krpano.get("stageheight"));
										// mouse_stagey = parseInt(krpano.get("mouse.stagey"));
										// mouse_stagex = parseInt(krpano.get("mouse.stagex"));
										box_width	 = parseInt($("div#popup-box").width());
										box_height	 = parseInt($("div#popup-box").height());
										
										mouse_stagex = stagewidth/2 - box_width/2;
										if(krpano_actions_actioncaller._type=="hotspot")
											mouse_stagey = stageheight/2 + 20;
										else
											mouse_stagey = stageheight/2 - box_height/2;
										//console.log("AAAAAAAAAAAA");
										// console.log("mouse_stagex : " + mouse_stagex);
										// console.log("mouse_stagey : " + mouse_stagey);
										style 	 = "div#popup-box {left:" + mouse_stagex + "px !important;top:" + mouse_stagey + "px !important;right:auto !important;bottom:auto !important;}";
										$('#popup-box-style').append(style);
									}
									else if(info_box_style_float==true && temp_parent == krpano_parent && krpano_actions_actioncaller._type=="hotspot" && stagewidth>750){
										stagewidth	 = parseInt(krpano.get("stagewidth"));
										stageheight	 = parseInt(krpano.get("stageheight"));
										// mouse_stagey = parseInt(krpano.get("mouse.stagey"));
										// mouse_stagex = parseInt(krpano.get("mouse.stagex"));
										box_width	 = parseInt($("div#popup-box").width());
										box_height	 = parseInt($("div#popup-box").height());
										
										mouse_stagex = stagewidth/2 + 20;
										mouse_stagey = stageheight/2 - box_height/2;

										//console.log("AAAAAAAAAAAA");
										// console.log("mouse_stagex : " + mouse_stagex);
										// console.log("mouse_stagey : " + mouse_stagey);
										style 	 = "div#popup-box {left:" + mouse_stagex + "px !important;top:" + mouse_stagey + "px !important;right:auto !important;bottom:auto !important;}";
										$('#popup-box-style').append(style);
									}
					}
				});
			};
			if(info_box_style_float==true && temp_parent == krpano_parent)
			{
				krpano.call("if( plugin[gyroscope].enabled EQ true,set(gyroWasEnabled,true);set(plugin[gyroscope].enabled, false););");
				
				stagewidth	 = parseInt(krpano.get("stagewidth"));
				if(krpano_actions_actioncaller._type=="hotspot")
					krpano.call("lookto(" + krpano_actions_actioncaller.ath + "," + krpano_actions_actioncaller.atv + ",get(view.fov),tween(easeInOutQuad,0.4),true,true,js(show_info_box_now()));");
				else
					show_info_box_now();
				/*
				if(krpano_actions_actioncaller._type=="hotspot" && stagewidth<750)
					krpano.call("lookto(" + krpano_actions_actioncaller.ath + "," + krpano_actions_actioncaller.atv + ",get(view.fov),tween(easeInOutQuad,0.4),true,true,js(show_info_box_now()));");
				else
					show_info_box_now();
				*/
			}
			else
				show_info_box_now();
		}, delay_time);
    }
	function open_zoomable_image(){
		arguments[1] = translate_language(arguments[1]);
		arguments[1] = translate_path(arguments[1]);
		
		arguments[0] = translate_language(arguments[0]);
		
		arguments[0] = trim_char(arguments[0],";");
		arguments[1] = trim_char(arguments[1],";");
		
		var array_title = arguments[0].split(";");
		// console.log(array_title);
		var array_image = arguments[1].split(";");
		// console.log(array_image);
		var temp_id = "zoomable_image_" + random;
		$("#" + temp_id).remove();
		// var HTML  = '<div id="' + temp_id + '" style="width:0px;height:0px;z-index:-99999999;overflow:hidden;display:none;">';
		var HTML  = '<div id="' + temp_id + '" style="display:none;">';
		HTML	 += '<ul id="images">';
		for (i = 0; i < array_image.length; ++i) {
			if(i in array_title)
				HTML	 += '<li><img src="' + array_image[i] + '" alt="' + array_title[i] + '"></li>';
			else
				HTML	 += '<li><img src="' + array_image[i] + '" alt="' + array_title[0] + '"></li>';
		}
		HTML	 += '</ul>';
		HTML	 += '</div>';
		$("body").append(HTML);
		
		setTimeout(function(){
			// const Viewer = require('viewerjs');
			/*!
			 * Viewer.js v1.5.0
			 * https://fengyuanchen.github.io/viewerjs
			 *
			 * Copyright 2015-present Chen Fengyuan
			 * Released under the MIT license
			 *
			 * Date: 2019-11-23T05:10:26.193Z
			 */
			!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?module.exports=i():"function"==typeof define&&define.amd?define(i):(t=t||self).Viewer=i()}(this,function(){"use strict";function i(t){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function n(t,i){for(var e=0;e<i.length;e++){var n=i[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function e(i,t){var e=Object.keys(i);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(i);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(i,t).enumerable})),e.push.apply(e,n)}return e}function r(s){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?e(Object(o),!0).forEach(function(t){var i,e,n;i=s,n=o[e=t],e in i?Object.defineProperty(i,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):i[e]=n}):Object.getOwnPropertyDescriptors?Object.defineProperties(s,Object.getOwnPropertyDescriptors(o)):e(Object(o)).forEach(function(t){Object.defineProperty(s,t,Object.getOwnPropertyDescriptor(o,t))})}return s}var s={backdrop:!0,button:!0,navbar:!0,title:!0,toolbar:!0,className:"",container:"body",filter:null,fullscreen:!0,initialViewIndex:0,inline:!1,interval:5e3,keyboard:!0,loading:!0,loop:!0,minWidth:200,minHeight:100,movable:!0,rotatable:!0,scalable:!0,zoomable:!0,zoomOnTouch:!0,zoomOnWheel:!0,slideOnTouch:!0,toggleOnDblclick:!0,tooltip:!0,transition:!0,zIndex:2015,zIndexInline:0,zoomRatio:.1,minZoomRatio:.01,maxZoomRatio:100,url:"src",ready:null,show:null,shown:null,hide:null,hidden:null,view:null,viewed:null,zoom:null,zoomed:null},o="undefined"!=typeof window&&void 0!==window.document,a=o?window:{},h=o&&"ontouchstart"in a.document.documentElement,t=o&&"PointerEvent"in a,p="viewer",l="move",c="switch",u="zoom",f="".concat(p,"-active"),w="".concat(p,"-close"),b="".concat(p,"-fade"),y="".concat(p,"-fixed"),x="".concat(p,"-fullscreen"),d="".concat(p,"-fullscreen-exit"),k="".concat(p,"-hide"),m="".concat(p,"-hide-md-down"),g="".concat(p,"-hide-sm-down"),v="".concat(p,"-hide-xs-down"),z="".concat(p,"-in"),D="".concat(p,"-invisible"),T="".concat(p,"-loading"),E="".concat(p,"-move"),I="".concat(p,"-open"),O="".concat(p,"-show"),S="".concat(p,"-transition"),C="click",L="dblclick",N="dragstart",M="hidden",R="hide",Y="keydown",q="load",X=t?"pointerdown":h?"touchstart":"mousedown",F=t?"pointermove":h?"touchmove":"mousemove",W=t?"pointerup pointercancel":h?"touchend touchcancel":"mouseup",P="ready",A="resize",j="show",H="shown",V="transitionend",B="viewed",K="".concat(p,"Action"),U=/\s\s*/,Z=["zoom-in","zoom-out","one-to-one","reset","prev","play","next","rotate-left","rotate-right","flip-horizontal","flip-vertical"];function $(t){return"string"==typeof t}var _=Number.isNaN||a.isNaN;function G(t){return"number"==typeof t&&!_(t)}function J(t){return void 0===t}function Q(t){return"object"===i(t)&&null!==t}var tt=Object.prototype.hasOwnProperty;function it(t){if(!Q(t))return!1;try{var i=t.constructor,e=i.prototype;return i&&e&&tt.call(e,"isPrototypeOf")}catch(t){return!1}}function et(t){return"function"==typeof t}function nt(i,e){if(i&&et(e))if(Array.isArray(i)||G(i.length)){var t,n=i.length;for(t=0;t<n&&!1!==e.call(i,i[t],t,i);t+=1);}else Q(i)&&Object.keys(i).forEach(function(t){e.call(i,i[t],t,i)});return i}var st=Object.assign||function(e){for(var t=arguments.length,i=new Array(1<t?t-1:0),n=1;n<t;n++)i[n-1]=arguments[n];return Q(e)&&0<i.length&&i.forEach(function(i){Q(i)&&Object.keys(i).forEach(function(t){e[t]=i[t]})}),e},ot=/^(?:width|height|left|top|marginLeft|marginTop)$/;function at(t,i){var e=t.style;nt(i,function(t,i){ot.test(i)&&G(t)&&(t+="px"),e[i]=t})}function rt(t,i){return!(!t||!i)&&(t.classList?t.classList.contains(i):-1<t.className.indexOf(i))}function ht(t,i){if(t&&i)if(G(t.length))nt(t,function(t){ht(t,i)});else if(t.classList)t.classList.add(i);else{var e=t.className.trim();e?e.indexOf(i)<0&&(t.className="".concat(e," ").concat(i)):t.className=i}}function lt(t,i){t&&i&&(G(t.length)?nt(t,function(t){lt(t,i)}):t.classList?t.classList.remove(i):0<=t.className.indexOf(i)&&(t.className=t.className.replace(i,"")))}function ct(t,i,e){i&&(G(t.length)?nt(t,function(t){ct(t,i,e)}):e?ht(t,i):lt(t,i))}var ut=/([a-z\d])([A-Z])/g;function dt(t){return t.replace(ut,"$1-$2").toLowerCase()}function mt(t,i){return Q(t[i])?t[i]:t.dataset?t.dataset[i]:t.getAttribute("data-".concat(dt(i)))}function ft(t,i,e){Q(e)?t[i]=e:t.dataset?t.dataset[i]=e:t.setAttribute("data-".concat(dt(i)),e)}var gt=function(){var t=!1;if(o){var i=!1,e=function(){},n=Object.defineProperty({},"once",{get:function(){return t=!0,i},set:function(t){i=t}});a.addEventListener("test",e,n),a.removeEventListener("test",e,n)}return t}();function vt(e,t,n,i){var s=3<arguments.length&&void 0!==i?i:{},o=n;t.trim().split(U).forEach(function(t){if(!gt){var i=e.listeners;i&&i[t]&&i[t][n]&&(o=i[t][n],delete i[t][n],0===Object.keys(i[t]).length&&delete i[t],0===Object.keys(i).length&&delete e.listeners)}e.removeEventListener(t,o,s)})}function pt(o,t,a,i){var r=3<arguments.length&&void 0!==i?i:{},h=a;t.trim().split(U).forEach(function(n){if(r.once&&!gt){var t=o.listeners,s=void 0===t?{}:t;h=function(){delete s[n][a],o.removeEventListener(n,h,r);for(var t=arguments.length,i=new Array(t),e=0;e<t;e++)i[e]=arguments[e];a.apply(o,i)},s[n]||(s[n]={}),s[n][a]&&o.removeEventListener(n,s[n][a],r),s[n][a]=h,o.listeners=s}o.addEventListener(n,h,r)})}function wt(t,i,e){var n;return et(Event)&&et(CustomEvent)?n=new CustomEvent(i,{detail:e,bubbles:!0,cancelable:!0}):(n=document.createEvent("CustomEvent")).initCustomEvent(i,!0,!0,e),t.dispatchEvent(n)}function bt(t){var i=t.rotate,e=t.scaleX,n=t.scaleY,s=t.translateX,o=t.translateY,a=[];G(s)&&0!==s&&a.push("translateX(".concat(s,"px)")),G(o)&&0!==o&&a.push("translateY(".concat(o,"px)")),G(i)&&0!==i&&a.push("rotate(".concat(i,"deg)")),G(e)&&1!==e&&a.push("scaleX(".concat(e,")")),G(n)&&1!==n&&a.push("scaleY(".concat(n,")"));var r=a.length?a.join(" "):"none";return{WebkitTransform:r,msTransform:r,transform:r}}var yt=a.navigator&&/(Macintosh|iPhone|iPod|iPad).*AppleWebKit/i.test(a.navigator.userAgent);function xt(t,i){var e=document.createElement("img");if(t.naturalWidth&&!yt)return i(t.naturalWidth,t.naturalHeight),e;var n=document.body||document.documentElement;return e.onload=function(){i(e.width,e.height),yt||n.removeChild(e)},e.src=t.src,yt||(e.style.cssText="left:0;max-height:none!important;max-width:none!important;min-height:0!important;min-width:0!important;opacity:0;position:absolute;top:0;z-index:-1;",n.appendChild(e)),e}function kt(t){switch(t){case 2:return v;case 3:return g;case 4:return m;default:return""}}function zt(t,i){var e=t.pageX,n=t.pageY,s={endX:e,endY:n};return i?s:r({timeStamp:Date.now(),startX:e,startY:n},s)}var Dt={render:function(){this.initContainer(),this.initViewer(),this.initList(),this.renderViewer()},initContainer:function(){this.containerData={width:window.innerWidth,height:window.innerHeight}},initViewer:function(){var t,i=this.options,e=this.parent;i.inline&&(t={width:Math.max(e.offsetWidth,i.minWidth),height:Math.max(e.offsetHeight,i.minHeight)},this.parentData=t),!this.fulled&&t||(t=this.containerData),this.viewerData=st({},t)},renderViewer:function(){this.options.inline&&!this.fulled&&at(this.viewer,this.viewerData)},initList:function(){var r=this,t=this.element,h=this.options,l=this.list,c=[];l.innerHTML="",nt(this.images,function(t,i){var e=t.src,n=t.alt||function(t){return $(t)?decodeURIComponent(t.replace(/^.*\//,"").replace(/[?&#].*$/,"")):""}(e),s=h.url;if($(s)?s=t.getAttribute(s):et(s)&&(s=s.call(r,t)),e||s){var o=document.createElement("li"),a=document.createElement("img");a.src=e||s,a.alt=n,a.setAttribute("data-index",i),a.setAttribute("data-original-url",s||e),a.setAttribute("data-viewer-action","view"),a.setAttribute("role","button"),o.appendChild(a),l.appendChild(o),c.push(o)}}),nt(this.items=c,function(i){var t=i.firstElementChild;ft(t,"filled",!0),h.loading&&ht(i,T),pt(t,q,function(t){h.loading&&lt(i,T),r.loadImage(t)},{once:!0})}),h.transition&&pt(t,B,function(){ht(l,S)},{once:!0})},renderList:function(t){var i=t||this.index,e=this.items[i].offsetWidth||30,n=e+1;at(this.list,st({width:n*this.length},bt({translateX:(this.viewerData.width-e)/2-n*i})))},resetList:function(){var t=this.list;t.innerHTML="",lt(t,S),at(t,bt({translateX:0}))},initImage:function(r){var t,h=this,l=this.options,i=this.image,e=this.viewerData,n=this.footer.offsetHeight,c=e.width,u=Math.max(e.height-n,n),d=this.imageData||{};this.imageInitializing={abort:function(){t.onload=null}},t=xt(i,function(t,i){var e=t/i,n=c,s=u;h.imageInitializing=!1,c<u*e?s=c/e:n=u*e;var o={naturalWidth:t,naturalHeight:i,aspectRatio:e,ratio:(n=Math.min(.9*n,t))/t,width:n,height:s=Math.min(.9*s,i),left:(c-n)/2,top:(u-s)/2},a=st({},o);l.rotatable&&(o.rotate=d.rotate||0,a.rotate=0),l.scalable&&(o.scaleX=d.scaleX||1,o.scaleY=d.scaleY||1,a.scaleX=1,a.scaleY=1),h.imageData=o,h.initialImageData=a,r&&r()})},renderImage:function(t){var i=this,e=this.image,n=this.imageData;if(at(e,st({width:n.width,height:n.height,marginLeft:n.left,marginTop:n.top},bt(n))),t)if((this.viewing||this.zooming)&&this.options.transition){var s=function(){i.imageRendering=!1,t()};this.imageRendering={abort:function(){vt(e,V,s)}},pt(e,V,s,{once:!0})}else t()},resetImage:function(){if(this.viewing||this.viewed){var t=this.image;this.viewing&&this.viewing.abort(),t.parentNode.removeChild(t),this.image=null}}},Tt={bind:function(){var t=this.options,i=this.viewer,e=this.canvas,n=this.element.ownerDocument;pt(i,C,this.onClick=this.click.bind(this)),pt(i,N,this.onDragStart=this.dragstart.bind(this)),pt(e,X,this.onPointerDown=this.pointerdown.bind(this)),pt(n,F,this.onPointerMove=this.pointermove.bind(this)),pt(n,W,this.onPointerUp=this.pointerup.bind(this)),pt(n,Y,this.onKeyDown=this.keydown.bind(this)),pt(window,A,this.onResize=this.resize.bind(this)),t.zoomable&&t.zoomOnWheel&&pt(i,"wheel",this.onWheel=this.wheel.bind(this),{passive:!1,capture:!0}),t.toggleOnDblclick&&pt(e,L,this.onDblclick=this.dblclick.bind(this))},unbind:function(){var t=this.options,i=this.viewer,e=this.canvas,n=this.element.ownerDocument;vt(i,C,this.onClick),vt(i,N,this.onDragStart),vt(e,X,this.onPointerDown),vt(n,F,this.onPointerMove),vt(n,W,this.onPointerUp),vt(n,Y,this.onKeyDown),vt(window,A,this.onResize),t.zoomable&&t.zoomOnWheel&&vt(i,"wheel",this.onWheel,{passive:!1,capture:!0}),t.toggleOnDblclick&&vt(e,L,this.onDblclick)}},Et={click:function(t){var i=t.target,e=this.options,n=this.imageData,s=mt(i,K);switch(h&&t.isTrusted&&i===this.canvas&&clearTimeout(this.clickCanvasTimeout),s){case"mix":this.played?this.stop():e.inline?this.fulled?this.exit():this.full():this.hide();break;case"hide":this.hide();break;case"view":this.view(mt(i,"index"));break;case"zoom-in":this.zoom(.1,!0);break;case"zoom-out":this.zoom(-.1,!0);break;case"one-to-one":this.toggle();break;case"reset":this.reset();break;case"prev":this.prev(e.loop);break;case"play":this.play(e.fullscreen);break;case"next":this.next(e.loop);break;case"rotate-left":this.rotate(-90);break;case"rotate-right":this.rotate(90);break;case"flip-horizontal":this.scaleX(-n.scaleX||-1);break;case"flip-vertical":this.scaleY(-n.scaleY||-1);break;default:this.played&&this.stop()}},dblclick:function(t){t.preventDefault(),this.viewed&&t.target===this.image&&(h&&t.isTrusted&&clearTimeout(this.doubleClickImageTimeout),this.toggle())},load:function(){var t=this;this.timeout&&(clearTimeout(this.timeout),this.timeout=!1);var i=this.element,e=this.options,n=this.image,s=this.index,o=this.viewerData;lt(n,D),e.loading&&lt(this.canvas,T),n.style.cssText="height:0;"+"margin-left:".concat(o.width/2,"px;")+"margin-top:".concat(o.height/2,"px;")+"max-width:none!important;position:absolute;width:0;",this.initImage(function(){ct(n,E,e.movable),ct(n,S,e.transition),t.renderImage(function(){t.viewed=!0,t.viewing=!1,et(e.viewed)&&pt(i,B,e.viewed,{once:!0}),wt(i,B,{originalImage:t.images[s],index:s,image:n})})})},loadImage:function(t){var o=t.target,i=o.parentNode,a=i.offsetWidth||30,r=i.offsetHeight||50,h=!!mt(o,"filled");xt(o,function(t,i){var e=t/i,n=a,s=r;a<r*e?h?n=r*e:s=a/e:h?s=a/e:n=r*e,at(o,st({width:n,height:s},bt({translateX:(a-n)/2,translateY:(r-s)/2})))})},keydown:function(t){var i=this.options;if(this.fulled&&i.keyboard)switch(t.keyCode||t.which||t.charCode){case 27:this.played?this.stop():i.inline?this.fulled&&this.exit():this.hide();break;case 32:this.played&&this.stop();break;case 37:this.prev(i.loop);break;case 38:t.preventDefault(),this.zoom(i.zoomRatio,!0);break;case 39:this.next(i.loop);break;case 40:t.preventDefault(),this.zoom(-i.zoomRatio,!0);break;case 48:case 49:t.ctrlKey&&(t.preventDefault(),this.toggle())}},dragstart:function(t){"img"===t.target.tagName.toLowerCase()&&t.preventDefault()},pointerdown:function(t){var i=this.options,e=this.pointers,n=t.buttons,s=t.button;if(!(!this.viewed||this.showing||this.viewing||this.hiding||("mousedown"===t.type||"pointerdown"===t.type&&"mouse"===t.pointerType)&&(G(n)&&1!==n||G(s)&&0!==s||t.ctrlKey))){t.preventDefault(),t.changedTouches?nt(t.changedTouches,function(t){e[t.identifier]=zt(t)}):e[t.pointerId||0]=zt(t);var o=!!i.movable&&l;i.zoomOnTouch&&i.zoomable&&1<Object.keys(e).length?o=u:i.slideOnTouch&&("touch"===t.pointerType||"touchstart"===t.type)&&this.isSwitchable()&&(o=c),!i.transition||o!==l&&o!==u||lt(this.image,S),this.action=o}},pointermove:function(t){var i=this.pointers,e=this.action;this.viewed&&e&&(t.preventDefault(),t.changedTouches?nt(t.changedTouches,function(t){st(i[t.identifier]||{},zt(t,!0))}):st(i[t.pointerId||0]||{},zt(t,!0)),this.change(t))},pointerup:function(t){var i,e=this,n=this.options,s=this.action,o=this.pointers;t.changedTouches?nt(t.changedTouches,function(t){i=o[t.identifier],delete o[t.identifier]}):(i=o[t.pointerId||0],delete o[t.pointerId||0]),s&&(t.preventDefault(),!n.transition||s!==l&&s!==u||ht(this.image,S),this.action=!1,h&&s!==u&&i&&Date.now()-i.timeStamp<500&&(clearTimeout(this.clickCanvasTimeout),clearTimeout(this.doubleClickImageTimeout),n.toggleOnDblclick&&this.viewed&&t.target===this.image?this.imageClicked?(this.imageClicked=!1,this.doubleClickImageTimeout=setTimeout(function(){wt(e.image,L)},50)):(this.imageClicked=!0,this.doubleClickImageTimeout=setTimeout(function(){e.imageClicked=!1},500)):(this.imageClicked=!1,n.backdrop&&"static"!==n.backdrop&&t.target===this.canvas&&(this.clickCanvasTimeout=setTimeout(function(){wt(e.canvas,C)},50)))))},resize:function(){var i=this;if(this.isShown&&!this.hiding&&(this.initContainer(),this.initViewer(),this.renderViewer(),this.renderList(),this.viewed&&this.initImage(function(){i.renderImage()}),this.played)){if(this.options.fullscreen&&this.fulled&&!(document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullscreenElement))return void this.stop();nt(this.player.getElementsByTagName("img"),function(t){pt(t,q,i.loadImage.bind(i),{once:!0}),wt(t,q)})}},wheel:function(t){var i=this;if(this.viewed&&(t.preventDefault(),!this.wheeling)){this.wheeling=!0,setTimeout(function(){i.wheeling=!1},50);var e=Number(this.options.zoomRatio)||.1,n=1;t.deltaY?n=0<t.deltaY?1:-1:t.wheelDelta?n=-t.wheelDelta/120:t.detail&&(n=0<t.detail?1:-1),this.zoom(-n*e,!0,t)}}},It={show:function(t){var i=0<arguments.length&&void 0!==t&&t,e=this.element,n=this.options;if(n.inline||this.showing||this.isShown||this.showing)return this;if(!this.ready)return this.build(),this.ready&&this.show(i),this;if(et(n.show)&&pt(e,j,n.show,{once:!0}),!1===wt(e,j)||!this.ready)return this;this.hiding&&this.transitioning.abort(),this.showing=!0,this.open();var s=this.viewer;if(lt(s,k),n.transition&&!i){var o=this.shown.bind(this);this.transitioning={abort:function(){vt(s,V,o),lt(s,z)}},ht(s,S),s.initialOffsetWidth=s.offsetWidth,pt(s,V,o,{once:!0}),ht(s,z)}else ht(s,z),this.shown();return this},hide:function(){var t=0<arguments.length&&void 0!==arguments[0]&&arguments[0],i=this.element,e=this.options;if(e.inline||this.hiding||!this.isShown&&!this.showing)return this;if(et(e.hide)&&pt(i,R,e.hide,{once:!0}),!1===wt(i,R))return this;this.showing&&this.transitioning.abort(),this.hiding=!0,this.played?this.stop():this.viewing&&this.viewing.abort();var n=this.viewer;if(e.transition&&!t){var s=this.hidden.bind(this),o=function(){setTimeout(function(){pt(n,V,s,{once:!0}),lt(n,z)},0)};this.transitioning={abort:function(){this.viewed?vt(this.image,V,o):vt(n,V,s)}},this.viewed&&rt(this.image,S)?(pt(this.image,V,o,{once:!0}),this.zoomTo(0,!1,!1,!0)):o()}else lt(n,z),this.hidden();return this},view:function(t){var e=this,i=0<arguments.length&&void 0!==t?t:this.options.initialViewIndex;if(i=Number(i)||0,this.hiding||this.played||i<0||i>=this.length||this.viewed&&i===this.index)return this;if(!this.isShown)return this.index=i,this.show();this.viewing&&this.viewing.abort();var n=this.element,s=this.options,o=this.title,a=this.canvas,r=this.items[i],h=r.querySelector("img"),l=mt(h,"originalUrl"),c=h.getAttribute("alt"),u=document.createElement("img");if(u.src=l,u.alt=c,et(s.view)&&pt(n,"view",s.view,{once:!0}),!1===wt(n,"view",{originalImage:this.images[i],index:i,image:u})||!this.isShown||this.hiding||this.played)return this;this.image=u,lt(this.items[this.index],f),ht(r,f),this.viewed=!1,this.index=i,this.imageData={},ht(u,D),s.loading&&ht(a,T),a.innerHTML="",a.appendChild(u),this.renderList(),o.innerHTML="";function d(){var t=e.imageData,i=Array.isArray(s.title)?s.title[1]:s.title;o.innerHTML=function(t){return $(t)?t.replace(/&(?!amp;|quot;|#39;|lt;|gt;)/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):t}(et(i)?i.call(e,u,t):"".concat(c," (").concat(t.naturalWidth," × ").concat(t.naturalHeight,")"))}var m;return pt(n,B,d,{once:!0}),this.viewing={abort:function(){vt(n,B,d),u.complete?this.imageRendering?this.imageRendering.abort():this.imageInitializing&&this.imageInitializing.abort():(u.src="",vt(u,q,m),this.timeout&&clearTimeout(this.timeout))}},u.complete?this.load():(pt(u,q,m=this.load.bind(this),{once:!0}),this.timeout&&clearTimeout(this.timeout),this.timeout=setTimeout(function(){lt(u,D),e.timeout=!1},1e3)),this},prev:function(t){var i=0<arguments.length&&void 0!==t&&t,e=this.index-1;return e<0&&(e=i?this.length-1:0),this.view(e),this},next:function(t){var i=0<arguments.length&&void 0!==t&&t,e=this.length-1,n=this.index+1;return e<n&&(n=i?0:e),this.view(n),this},move:function(t,i){var e=this.imageData;return this.moveTo(J(t)?t:e.left+Number(t),J(i)?i:e.top+Number(i)),this},moveTo:function(t,i){var e=1<arguments.length&&void 0!==i?i:t,n=this.imageData;if(t=Number(t),e=Number(e),this.viewed&&!this.played&&this.options.movable){var s=!1;G(t)&&(n.left=t,s=!0),G(e)&&(n.top=e,s=!0),s&&this.renderImage()}return this},zoom:function(t,i,e){var n=1<arguments.length&&void 0!==i&&i,s=2<arguments.length&&void 0!==e?e:null,o=this.imageData;return t=(t=Number(t))<0?1/(1-t):1+t,this.zoomTo(o.width*t/o.naturalWidth,n,s),this},zoomTo:function(t,i,e,n){var s=this,o=1<arguments.length&&void 0!==i&&i,a=2<arguments.length&&void 0!==e?e:null,r=3<arguments.length&&void 0!==n&&n,h=this.element,l=this.options,c=this.pointers,u=this.imageData,d=u.width,m=u.height,f=u.left,g=u.top,v=u.naturalWidth,p=u.naturalHeight;if(G(t=Math.max(0,t))&&this.viewed&&!this.played&&(r||l.zoomable)){if(!r){var w=Math.max(.01,l.minZoomRatio),b=Math.min(100,l.maxZoomRatio);t=Math.min(Math.max(t,w),b)}a&&.95<t&&t<1.05&&(t=1);var y=v*t,x=p*t,k=y-d,z=x-m,D=d/v;if(et(l.zoom)&&pt(h,"zoom",l.zoom,{once:!0}),!1===wt(h,"zoom",{ratio:t,oldRatio:D,originalEvent:a}))return this;if(this.zooming=!0,a){var T=function(t){var i=t.getBoundingClientRect();return{left:i.left+(window.pageXOffset-document.documentElement.clientLeft),top:i.top+(window.pageYOffset-document.documentElement.clientTop)}}(this.viewer),E=c&&Object.keys(c).length?function(t){var n=0,s=0,o=0;return nt(t,function(t){var i=t.startX,e=t.startY;n+=i,s+=e,o+=1}),{pageX:n/=o,pageY:s/=o}}(c):{pageX:a.pageX,pageY:a.pageY};u.left-=k*((E.pageX-T.left-f)/d),u.top-=z*((E.pageY-T.top-g)/m)}else u.left-=k/2,u.top-=z/2;u.width=y,u.height=x,u.ratio=t,this.renderImage(function(){s.zooming=!1,et(l.zoomed)&&pt(h,"zoomed",l.zoomed,{once:!0}),wt(h,"zoomed",{ratio:t,oldRatio:D,originalEvent:a})}),o&&this.tooltip()}return this},rotate:function(t){return this.rotateTo((this.imageData.rotate||0)+Number(t)),this},rotateTo:function(t){var i=this.imageData;return G(t=Number(t))&&this.viewed&&!this.played&&this.options.rotatable&&(i.rotate=t,this.renderImage()),this},scaleX:function(t){return this.scale(t,this.imageData.scaleY),this},scaleY:function(t){return this.scale(this.imageData.scaleX,t),this},scale:function(t,i){var e=1<arguments.length&&void 0!==i?i:t,n=this.imageData;if(t=Number(t),e=Number(e),this.viewed&&!this.played&&this.options.scalable){var s=!1;G(t)&&(n.scaleX=t,s=!0),G(e)&&(n.scaleY=e,s=!0),s&&this.renderImage()}return this},play:function(){var i=this,t=0<arguments.length&&void 0!==arguments[0]&&arguments[0];if(!this.isShown||this.played)return this;var s=this.options,o=this.player,a=this.loadImage.bind(this),r=[],h=0,l=0;if(this.played=!0,this.onLoadWhenPlay=a,t&&this.requestFullscreen(),ht(o,O),nt(this.items,function(t,i){var e=t.querySelector("img"),n=document.createElement("img");n.src=mt(e,"originalUrl"),n.alt=e.getAttribute("alt"),h+=1,ht(n,b),ct(n,S,s.transition),rt(t,f)&&(ht(n,z),l=i),r.push(n),pt(n,q,a,{once:!0}),o.appendChild(n)}),G(s.interval)&&0<s.interval){var e=function t(){i.playing=setTimeout(function(){lt(r[l],z),ht(r[l=(l+=1)<h?l:0],z),t()},s.interval)};1<h&&e()}return this},stop:function(){var i=this;if(!this.played)return this;var t=this.player;return this.played=!1,clearTimeout(this.playing),nt(t.getElementsByTagName("img"),function(t){vt(t,q,i.onLoadWhenPlay)}),lt(t,O),t.innerHTML="",this.exitFullscreen(),this},full:function(){var t=this,i=this.options,e=this.viewer,n=this.image,s=this.list;return!this.isShown||this.played||this.fulled||!i.inline||(this.fulled=!0,this.open(),ht(this.button,d),i.transition&&(lt(s,S),this.viewed&&lt(n,S)),ht(e,y),e.setAttribute("style",""),at(e,{zIndex:i.zIndex}),this.initContainer(),this.viewerData=st({},this.containerData),this.renderList(),this.viewed&&this.initImage(function(){t.renderImage(function(){i.transition&&setTimeout(function(){ht(n,S),ht(s,S)},0)})})),this},exit:function(){var t=this,i=this.options,e=this.viewer,n=this.image,s=this.list;return this.isShown&&!this.played&&this.fulled&&i.inline&&(this.fulled=!1,this.close(),lt(this.button,d),i.transition&&(lt(s,S),this.viewed&&lt(n,S)),lt(e,y),at(e,{zIndex:i.zIndexInline}),this.viewerData=st({},this.parentData),this.renderViewer(),this.renderList(),this.viewed&&this.initImage(function(){t.renderImage(function(){i.transition&&setTimeout(function(){ht(n,S),ht(s,S)},0)})})),this},tooltip:function(){var t=this,i=this.options,e=this.tooltipBox,n=this.imageData;return this.viewed&&!this.played&&i.tooltip&&(e.textContent="".concat(Math.round(100*n.ratio),"%"),this.tooltipping?clearTimeout(this.tooltipping):i.transition?(this.fading&&wt(e,V),ht(e,O),ht(e,b),ht(e,S),e.initialOffsetWidth=e.offsetWidth,ht(e,z)):ht(e,O),this.tooltipping=setTimeout(function(){i.transition?(pt(e,V,function(){lt(e,O),lt(e,b),lt(e,S),t.fading=!1},{once:!0}),lt(e,z),t.fading=!0):lt(e,O),t.tooltipping=!1},1e3)),this},toggle:function(){return 1===this.imageData.ratio?this.zoomTo(this.initialImageData.ratio,!0):this.zoomTo(1,!0),this},reset:function(){return this.viewed&&!this.played&&(this.imageData=st({},this.initialImageData),this.renderImage()),this},update:function(){var t=this.element,i=this.options,e=this.isImg;if(e&&!t.parentNode)return this.destroy();var s=[];if(nt(e?[t]:t.querySelectorAll("img"),function(t){i.filter?i.filter(t)&&s.push(t):s.push(t)}),!s.length)return this;if(this.images=s,this.length=s.length,this.ready){var o=[];if(nt(this.items,function(t,i){var e=t.querySelector("img"),n=s[i];n&&e?n.src!==e.src&&o.push(i):o.push(i)}),at(this.list,{width:"auto"}),this.initList(),this.isShown)if(this.length){if(this.viewed){var n=o.indexOf(this.index);0<=n?(this.viewed=!1,this.view(Math.max(this.index-(n+1),0))):ht(this.items[this.index],f)}}else this.image=null,this.viewed=!1,this.index=0,this.imageData={},this.canvas.innerHTML="",this.title.innerHTML=""}else this.build();return this},destroy:function(){var t=this.element,i=this.options;return t[p]&&(this.destroyed=!0,this.ready?(this.played&&this.stop(),i.inline?(this.fulled&&this.exit(),this.unbind()):this.isShown?(this.viewing&&(this.imageRendering?this.imageRendering.abort():this.imageInitializing&&this.imageInitializing.abort()),this.hiding&&this.transitioning.abort(),this.hidden()):this.showing&&(this.transitioning.abort(),this.hidden()),this.ready=!1,this.viewer.parentNode.removeChild(this.viewer)):i.inline&&(this.delaying?this.delaying.abort():this.initializing&&this.initializing.abort()),i.inline||vt(t,C,this.onStart),t[p]=void 0),this}},Ot={open:function(){var t=this.body;ht(t,I),t.style.paddingRight="".concat(this.scrollbarWidth+(parseFloat(this.initialBodyPaddingRight)||0),"px")},close:function(){var t=this.body;lt(t,I),t.style.paddingRight=this.initialBodyPaddingRight},shown:function(){var t=this.element,i=this.options;this.fulled=!0,this.isShown=!0,this.render(),this.bind(),this.showing=!1,et(i.shown)&&pt(t,H,i.shown,{once:!0}),!1!==wt(t,H)&&this.ready&&this.isShown&&!this.hiding&&this.view(this.index)},hidden:function(){var t=this.element,i=this.options;this.fulled=!1,this.viewed=!1,this.isShown=!1,this.close(),this.unbind(),ht(this.viewer,k),this.resetList(),this.resetImage(),this.hiding=!1,this.destroyed||(et(i.hidden)&&pt(t,M,i.hidden,{once:!0}),wt(t,M))},requestFullscreen:function(){var t=this.element.ownerDocument;if(this.fulled&&!(t.fullscreenElement||t.webkitFullscreenElement||t.mozFullScreenElement||t.msFullscreenElement)){var i=t.documentElement;i.requestFullscreen?i.requestFullscreen():i.webkitRequestFullscreen?i.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT):i.mozRequestFullScreen?i.mozRequestFullScreen():i.msRequestFullscreen&&i.msRequestFullscreen()}},exitFullscreen:function(){var t=this.element.ownerDocument;this.fulled&&(t.fullscreenElement||t.webkitFullscreenElement||t.mozFullScreenElement||t.msFullscreenElement)&&(t.exitFullscreen?t.exitFullscreen():t.webkitExitFullscreen?t.webkitExitFullscreen():t.mozCancelFullScreen?t.mozCancelFullScreen():t.msExitFullscreen&&t.msExitFullscreen())},change:function(t){var i=this.options,e=this.pointers,n=e[Object.keys(e)[0]],s=n.endX-n.startX,o=n.endY-n.startY;switch(this.action){case l:this.move(s,o);break;case u:this.zoom(function(t){var i=r({},t),h=[];return nt(t,function(r,t){delete i[t],nt(i,function(t){var i=Math.abs(r.startX-t.startX),e=Math.abs(r.startY-t.startY),n=Math.abs(r.endX-t.endX),s=Math.abs(r.endY-t.endY),o=Math.sqrt(i*i+e*e),a=(Math.sqrt(n*n+s*s)-o)/o;h.push(a)})}),h.sort(function(t,i){return Math.abs(t)<Math.abs(i)}),h[0]}(e),!1,t);break;case c:this.action="switched";var a=Math.abs(s);1<a&&a>Math.abs(o)&&(this.pointers={},1<s?this.prev(i.loop):s<-1&&this.next(i.loop))}nt(e,function(t){t.startX=t.endX,t.startY=t.endY})},isSwitchable:function(){var t=this.imageData,i=this.viewerData;return 1<this.length&&0<=t.left&&0<=t.top&&t.width<=i.width&&t.height<=i.height}},St=a.Viewer,Ct=function(){function e(t){var i=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};if(!function(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}(this,e),!t||1!==t.nodeType)throw new Error("The first argument is required and must be an element.");this.element=t,this.options=st({},s,it(i)&&i),this.action=!1,this.fading=!1,this.fulled=!1,this.hiding=!1,this.imageClicked=!1,this.imageData={},this.index=this.options.initialViewIndex,this.isImg=!1,this.isShown=!1,this.length=0,this.played=!1,this.playing=!1,this.pointers={},this.ready=!1,this.showing=!1,this.timeout=!1,this.tooltipping=!1,this.viewed=!1,this.viewing=!1,this.wheeling=!1,this.zooming=!1,this.init()}return function(t,i,e){i&&n(t.prototype,i),e&&n(t,e)}(e,[{key:"init",value:function(){var e=this,t=this.element,n=this.options;if(!t[p]){t[p]=this;var i="img"===t.tagName.toLowerCase(),s=[];nt(i?[t]:t.querySelectorAll("img"),function(t){et(n.filter)?n.filter.call(e,t)&&s.push(t):s.push(t)}),this.isImg=i,this.length=s.length,this.images=s;var o=t.ownerDocument,a=o.body||o.documentElement;if(this.body=a,this.scrollbarWidth=window.innerWidth-o.documentElement.clientWidth,this.initialBodyPaddingRight=window.getComputedStyle(a).paddingRight,J(document.createElement(p).style.transition)&&(n.transition=!1),n.inline){var r=0,h=function(){var t;(r+=1)===e.length&&(e.initializing=!1,e.delaying={abort:function(){clearTimeout(t)}},t=setTimeout(function(){e.delaying=!1,e.build()},0))};this.initializing={abort:function(){nt(s,function(t){t.complete||vt(t,q,h)})}},nt(s,function(t){t.complete?h():pt(t,q,h,{once:!0})})}else pt(t,C,this.onStart=function(t){var i=t.target;"img"!==i.tagName.toLowerCase()||et(n.filter)&&!n.filter.call(e,i)||e.view(e.images.indexOf(i))})}}},{key:"build",value:function(){if(!this.ready){var t=this.element,h=this.options,i=t.parentNode,e=document.createElement("div");e.innerHTML='<div class="viewer-container" touch-action="none"><div class="viewer-canvas"></div><div class="viewer-footer"><div class="viewer-title"></div><div class="viewer-toolbar"></div><div class="viewer-navbar"><ul class="viewer-list"></ul></div></div><div class="viewer-tooltip"></div><div role="button" class="viewer-button" data-viewer-action="mix"></div><div class="viewer-player"></div></div>';var n=e.querySelector(".".concat(p,"-container")),s=n.querySelector(".".concat(p,"-title")),o=n.querySelector(".".concat(p,"-toolbar")),a=n.querySelector(".".concat(p,"-navbar")),r=n.querySelector(".".concat(p,"-button")),l=n.querySelector(".".concat(p,"-canvas"));if(this.parent=i,this.viewer=n,this.title=s,this.toolbar=o,this.navbar=a,this.button=r,this.canvas=l,this.footer=n.querySelector(".".concat(p,"-footer")),this.tooltipBox=n.querySelector(".".concat(p,"-tooltip")),this.player=n.querySelector(".".concat(p,"-player")),this.list=n.querySelector(".".concat(p,"-list")),ht(s,h.title?kt(Array.isArray(h.title)?h.title[0]:h.title):k),ht(a,h.navbar?kt(h.navbar):k),ct(r,k,!h.button),h.backdrop&&(ht(n,"".concat(p,"-backdrop")),h.inline||"static"===h.backdrop||ft(l,K,"hide")),$(h.className)&&h.className&&h.className.split(U).forEach(function(t){ht(n,t)}),h.toolbar){var c=document.createElement("ul"),u=it(h.toolbar),d=Z.slice(0,3),m=Z.slice(7,9),f=Z.slice(9);u||ht(o,kt(h.toolbar)),nt(u?h.toolbar:Z,function(t,i){var e=u&&it(t),n=u?dt(i):t,s=e&&!J(t.show)?t.show:t;if(s&&(h.zoomable||-1===d.indexOf(n))&&(h.rotatable||-1===m.indexOf(n))&&(h.scalable||-1===f.indexOf(n))){var o=e&&!J(t.size)?t.size:t,a=e&&!J(t.click)?t.click:t,r=document.createElement("li");r.setAttribute("role","button"),ht(r,"".concat(p,"-").concat(n)),et(a)||ft(r,K,n),G(s)&&ht(r,kt(s)),-1!==["small","large"].indexOf(o)?ht(r,"".concat(p,"-").concat(o)):"play"===n&&ht(r,"".concat(p,"-large")),et(a)&&pt(r,C,a),c.appendChild(r)}}),o.appendChild(c)}else ht(o,k);if(!h.rotatable){var g=o.querySelectorAll('li[class*="rotate"]');ht(g,D),nt(g,function(t){o.appendChild(t)})}if(h.inline)ht(r,x),at(n,{zIndex:h.zIndexInline}),"static"===window.getComputedStyle(i).position&&at(i,{position:"relative"}),i.insertBefore(n,t.nextSibling);else{ht(r,w),ht(n,y),ht(n,b),ht(n,k),at(n,{zIndex:h.zIndex});var v=h.container;$(v)&&(v=t.ownerDocument.querySelector(v)),(v=v||this.body).appendChild(n)}h.inline&&(this.render(),this.bind(),this.isShown=!0),this.ready=!0,et(h.ready)&&pt(t,P,h.ready,{once:!0}),!1!==wt(t,P)?this.ready&&h.inline&&this.view(this.index):this.ready=!1}}}],[{key:"noConflict",value:function(){return window.Viewer=St,e}},{key:"setDefaults",value:function(t){st(s,it(t)&&t)}}]),e}();return st(Ct.prototype,Dt,Tt,Et,It,Ot),Ct});

			
			// console.log(temp_id);
			/*
			var galley = document.getElementById(temp_id);
			var viewer = new Viewer(galley, {
				title: function (image) {
					return image.alt + ' (' + (this.index + 1) + '/' + this.length + ')';
				},
			});
			*/
			
			if(apply_blur)
			{
				// krpano.call("EASY_HTML_LIGHTBOX___hide_all_hotspots();");
				// krpano.call("tween(plugin[EASY_HTML_LIGHTBOX___pp_blur].range,10.5,0.3);");
				$(krpano_parent.find("> div:not([class])")[0]).css("transition","all 300ms ease-in-out");
				$(krpano_parent.find("> div:not([class])")[0]).css("filter","blur(3px)");
			}
			var autorotate_temp = false;
			if(stop_autorotate && krpano.get("autorotate.enabled") == true)
				autorotate_temp = true;
			if(stop_autorotate)
			{
				if(stop_autorotate_timeout!=null)
					clearInterval(stop_autorotate_timeout);
				if(start_autorotate_timeout!=null)
					clearTimeout(start_autorotate_timeout);
			
				krpano_set("autorotate.enabled",false);
				if(krpano.actions.pauseautorotation != null)
					krpano.call("pauseautorotation(forceplugin);");
				stop_autorotate_timeout= setInterval(function(){ krpano_set("autorotate.enabled",false);}, 500);
			}
			
			var viewer = new Viewer(document.getElementById(temp_id), {
				inline: false,
				backdrop: true,
				movable: true,
				zIndex: 999999999999,
				container: krpano_parent[0],
				title: function (image) {
					if(this.length>1)
						return image.alt + ' (' + (this.index + 1) + '/' + this.length + ')';
					else
						return image.alt;
				},
				toolbar: {
					zoomIn: 1,
					zoomOut: 1,
					oneToOne: 1,
					reset: 1,
					prev: 1,
					play: {
						show: 1,
						size: 'large',
					},
					next: 1,
					rotateLeft: 0,
					rotateRight: 0,
					flipHorizontal: 0,
					flipVertical: 0,
				},
				// toolbar: {
					// oneToOne: true,
					
					// prev: function() {
						// viewer.prev(true);
					// },

					// play: true,

					// next: function() {
						// viewer.next(true);
					// },
				// },
				hidden: function () {
					viewer.destroy();
					if(apply_blur)
					{
						// krpano.call("EASY_HTML_LIGHTBOX___show_all_hotspots();");
						// krpano.call("tween(plugin[EASY_HTML_LIGHTBOX___pp_blur].range,0,0.3);");
						$(krpano_parent.find("> div:not([class])")[0]).css("filter","blur(0)");
					}
					if(autorotate_temp == true)
					{
						if(stop_autorotate_timeout!=null)
							clearInterval(stop_autorotate_timeout);
						if(start_autorotate_timeout!=null)
							clearTimeout(start_autorotate_timeout);
						
						autorotate_temp = false;
						if(krpano.actions.resumeautorotation != null)
							krpano.call("resumeautorotation(forceplugin);");
						krpano_set("autorotate.enabled",true);
						start_autorotate_timeout = setTimeout(function(){ krpano_set("autorotate.enabled",true); }, 500);
					}
				}
			});
			
		}, 10);
		
		setTimeout(function(){
			$("#" + temp_id + " #images img").click();
		}, 20);
	}
})