(function(){/*

Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
'use strict';var l,aa="undefined"!=typeof window&&window===this?this:"undefined"!=typeof global&&null!=global?global:this,m={};function n(){this.end=this.start=0;this.rules=this.parent=this.previous=null;this.cssText=this.parsedCssText="";this.atRule=!1;this.type=0;this.parsedSelector=this.selector=this.keyframesName=""}
function p(a){a=a.replace(ba,"").replace(ca,"");var b=da,c=a,e=new n;e.start=0;e.end=c.length;for(var d=e,f=0,h=c.length;f<h;f++)if("{"===c[f]){d.rules||(d.rules=[]);var g=d,k=g.rules[g.rules.length-1]||null;d=new n;d.start=f+1;d.parent=g;d.previous=k;g.rules.push(d)}else"}"===c[f]&&(d.end=f+1,d=d.parent||e);return b(e,a)}
function da(a,b){var c=b.substring(a.start,a.end-1);a.parsedCssText=a.cssText=c.trim();a.parent&&(c=b.substring(a.previous?a.previous.end:a.parent.start,a.start-1),c=ea(c),c=c.replace(fa," "),c=c.substring(c.lastIndexOf(";")+1),c=a.parsedSelector=a.selector=c.trim(),a.atRule=0===c.indexOf("@"),a.atRule?0===c.indexOf("@media")?a.type=ha:c.match(ia)&&(a.type=r,a.keyframesName=a.selector.split(fa).pop()):a.type=0===c.indexOf("--")?ja:ka);if(c=a.rules)for(var e=0,d=c.length,f;e<d&&(f=c[e]);e++)da(f,b);
return a}function ea(a){return a.replace(/\\([0-9a-f]{1,6})\s/gi,function(a,c){a=c;for(c=6-a.length;c--;)a="0"+a;return"\\"+a})}
function la(a,b,c){c=void 0===c?"":c;var e="";if(a.cssText||a.rules){var d=a.rules,f;if(f=d)f=d[0],f=!(f&&f.selector&&0===f.selector.indexOf("--"));if(f){f=0;for(var h=d.length,g;f<h&&(g=d[f]);f++)e=la(g,b,e)}else b?b=a.cssText:(b=a.cssText,b=b.replace(ma,"").replace(na,""),b=b.replace(oa,"").replace(pa,"")),(e=b.trim())&&(e="  "+e+"\n")}e&&(a.selector&&(c+=a.selector+" {\n"),c+=e,a.selector&&(c+="}\n\n"));return c}
var ka=1,r=7,ha=4,ja=1E3,ba=/\/\*[^*]*\*+([^/*][^*]*\*+)*\//gim,ca=/@import[^;]*;/gim,ma=/(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\n]|$)/gim,na=/(?:^[^;\-\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\n]|$)?/gim,oa=/@apply\s*\(?[^);]*\)?\s*(?:[;\n]|$)?/gim,pa=/[^;:]*?:[^;]*?var\([^;]*\)(?:[;\n]|$)?/gim,ia=/^@[^\s]*keyframes/,fa=/\s+/g;var qa=Promise.resolve();function ra(a){if(a=m[a])a._applyShimCurrentVersion=a._applyShimCurrentVersion||0,a._applyShimValidatingVersion=a._applyShimValidatingVersion||0,a._applyShimNextVersion=(a._applyShimNextVersion||0)+1}function sa(a){return a._applyShimCurrentVersion===a._applyShimNextVersion}function ta(a){a._applyShimValidatingVersion=a._applyShimNextVersion;a.b||(a.b=!0,qa.then(function(){a._applyShimCurrentVersion=a._applyShimNextVersion;a.b=!1}))};var t=!(window.ShadyDOM&&window.ShadyDOM.inUse),u;function ua(a){u=a&&a.shimcssproperties?!1:t||!(navigator.userAgent.match(/AppleWebKit\/601|Edge\/15/)||!window.CSS||!CSS.supports||!CSS.supports("box-shadow","0 0 0 var(--foo)"))}window.ShadyCSS&&void 0!==window.ShadyCSS.nativeCss?u=window.ShadyCSS.nativeCss:window.ShadyCSS?(ua(window.ShadyCSS),window.ShadyCSS=void 0):ua(window.WebComponents&&window.WebComponents.flags);var v=u;var w=/(?:^|[;\s{]\s*)(--[\w-]*?)\s*:\s*(?:((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};{])+)|\{([^}]*)\}(?:(?=[;\s}])|$))/gi,y=/(?:^|\W+)@apply\s*\(?([^);\n]*)\)?/gi,va=/(--[\w-]+)\s*([:,;)]|$)/gi,wa=/(animation\s*:)|(animation-name\s*:)/,xa=/@media\s(.*)/,ya=/\{[^}]*\}/g;var za=new Set;function z(a,b){if(!a)return"";"string"===typeof a&&(a=p(a));b&&A(a,b);return la(a,v)}function B(a){!a.__cssRules&&a.textContent&&(a.__cssRules=p(a.textContent));return a.__cssRules||null}function Aa(a){return!!a.parent&&a.parent.type===r}function A(a,b,c,e){if(a){var d=!1,f=a.type;if(e&&f===ha){var h=a.selector.match(xa);h&&(window.matchMedia(h[1]).matches||(d=!0))}f===ka?b(a):c&&f===r?c(a):f===ja&&(d=!0);if((a=a.rules)&&!d){d=0;f=a.length;for(var g;d<f&&(g=a[d]);d++)A(g,b,c,e)}}}
function C(a,b,c,e){var d=document.createElement("style");b&&d.setAttribute("scope",b);d.textContent=a;Ba(d,c,e);return d}var D=null;function Ba(a,b,c){b=b||document.head;b.insertBefore(a,c&&c.nextSibling||b.firstChild);D?a.compareDocumentPosition(D)===Node.DOCUMENT_POSITION_PRECEDING&&(D=a):D=a}
function Ca(a,b){var c=a.indexOf("var(");if(-1===c)return b(a,"","","");a:{var e=0;var d=c+3;for(var f=a.length;d<f;d++)if("("===a[d])e++;else if(")"===a[d]&&0===--e)break a;d=-1}e=a.substring(c+4,d);c=a.substring(0,c);a=Ca(a.substring(d+1),b);d=e.indexOf(",");return-1===d?b(c,e.trim(),"",a):b(c,e.substring(0,d).trim(),e.substring(d+1).trim(),a)}function E(a,b){t?a.setAttribute("class",b):window.ShadyDOM.nativeMethods.setAttribute.call(a,"class",b)}
function F(a){var b=a.localName,c="";b?-1<b.indexOf("-")||(c=b,b=a.getAttribute&&a.getAttribute("is")||""):(b=a.is,c=a.extends);return{is:b,u:c}};var G=null,Da=window.HTMLImports&&window.HTMLImports.whenReady||null,H;function Ea(a){requestAnimationFrame(function(){Da?Da(a):(G||(G=new Promise(function(a){H=a}),"complete"===document.readyState?H():document.addEventListener("readystatechange",function(){"complete"===document.readyState&&H()})),G.then(function(){a&&a()}))})};function I(){}function J(a,b,c){var e=K;a.__styleScoped?a.__styleScoped=null:Fa(e,a,b||"",c)}function Fa(a,b,c,e){b.nodeType===Node.ELEMENT_NODE&&Ga(b,c,e);if(b="template"===b.localName?(b.content||b.R).childNodes:b.children||b.childNodes)for(var d=0;d<b.length;d++)Fa(a,b[d],c,e)}
function Ga(a,b,c){if(b)if(a.classList)c?(a.classList.remove("style-scope"),a.classList.remove(b)):(a.classList.add("style-scope"),a.classList.add(b));else if(a.getAttribute){var e=a.getAttribute(Ha);c?e&&(b=e.replace("style-scope","").replace(b,""),E(a,b)):E(a,(e?e+" ":"")+"style-scope "+b)}}function L(a,b,c){var e=K,d=a.__cssBuild;t||"shady"===d?b=z(b,c):(a=F(a),b=Ia(e,b,a.is,a.u,c)+"\n\n");return b.trim()}
function Ia(a,b,c,e,d){var f=M(c,e);c=c?Ja+c:"";return z(b,function(b){b.c||(b.selector=b.g=Ka(a,b,a.b,c,f),b.c=!0);d&&d(b,c,f)})}function M(a,b){return b?"[is="+a+"]":a}function Ka(a,b,c,e,d){var f=b.selector.split(La);if(!Aa(b)){b=0;for(var h=f.length,g;b<h&&(g=f[b]);b++)f[b]=c.call(a,g,e,d)}return f.join(La)}function Ma(a){return a.replace(Na,function(a,c,e){-1<e.indexOf("+")?e=e.replace(/\+/g,"___"):-1<e.indexOf("___")&&(e=e.replace(/___/g,"+"));return":"+c+"("+e+")"})}
I.prototype.b=function(a,b,c){var e=!1;a=a.trim();var d=Na.test(a);d&&(a=a.replace(Na,function(a,b,c){return":"+b+"("+c.replace(/\s/g,"")+")"}),a=Ma(a));a=a.replace(Oa,Pa+" $1");a=a.replace(Qa,function(a,d,g){e||(a=Ra(g,d,b,c),e=e||a.stop,d=a.H,g=a.value);return d+g});d&&(a=Ma(a));return a};
function Ra(a,b,c,e){var d=a.indexOf(Sa);0<=a.indexOf(Pa)?a=Ta(a,e):0!==d&&(a=c?Ua(a,c):a);c=!1;0<=d&&(b="",c=!0);if(c){var f=!0;c&&(a=a.replace(Va,function(a,b){return" > "+b}))}a=a.replace(Wa,function(a,b,c){return'[dir="'+c+'"] '+b+", "+b+'[dir="'+c+'"]'});return{value:a,H:b,stop:f}}function Ua(a,b){a=a.split(Xa);a[0]+=b;return a.join(Xa)}
function Ta(a,b){var c=a.match(Ya);return(c=c&&c[2].trim()||"")?c[0].match(Za)?a.replace(Ya,function(a,c,f){return b+f}):c.split(Za)[0]===b?c:$a:a.replace(Pa,b)}function ab(a){a.selector===bb&&(a.selector="html")}I.prototype.c=function(a){return a.match(Sa)?this.b(a,cb):Ua(a.trim(),cb)};aa.Object.defineProperties(I.prototype,{a:{configurable:!0,enumerable:!0,get:function(){return"style-scope"}}});
var Na=/:(nth[-\w]+)\(([^)]+)\)/,cb=":not(.style-scope)",La=",",Qa=/(^|[\s>+~]+)((?:\[.+?\]|[^\s>+~=[])+)/g,Za=/[[.:#*]/,Pa=":host",bb=":root",Sa="::slotted",Oa=new RegExp("^("+Sa+")"),Ya=/(:host)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/,Va=/(?:::slotted)(?:\(((?:\([^)(]*\)|[^)(]*)+?)\))/,Wa=/(.*):dir\((?:(ltr|rtl))\)/,Ja=".",Xa=":",Ha="class",$a="should_not_match",K=new I;function db(){}
function eb(a){for(var b=0;b<a.length;b++){var c=a[b];if(c.target!==document.documentElement&&c.target!==document.head)for(var e=0;e<c.addedNodes.length;e++){var d=c.addedNodes[e];if(d.nodeType===Node.ELEMENT_NODE){var f=d.getRootNode();var h=d;var g=[];h.classList?g=Array.from(h.classList):h instanceof window.SVGElement&&h.hasAttribute("class")&&(g=h.getAttribute("class").split(/\s+/));h=g;g=h.indexOf(K.a);if((h=-1<g?h[g+1]:"")&&f===d.ownerDocument)J(d,h,!0);else if(f.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&(f=
f.host))if(f=F(f).is,h===f)for(d=window.ShadyDOM.nativeMethods.querySelectorAll.call(d,":not(."+K.a+")"),f=0;f<d.length;f++)Ga(d[f],h);else h&&J(d,h,!0),J(d,f)}}}}
if(!t){var fb=new MutationObserver(eb),gb=function(a){fb.observe(a,{childList:!0,subtree:!0})};if(window.customElements&&!window.customElements.polyfillWrapFlushCallback)gb(document);else{var hb=function(){gb(document.body)};window.HTMLImports?window.HTMLImports.whenReady(hb):requestAnimationFrame(function(){if("loading"===document.readyState){var a=function(){hb();document.removeEventListener("readystatechange",a)};document.addEventListener("readystatechange",a)}else hb()})}db=function(){eb(fb.takeRecords())}}
var ib=db;function N(a,b,c,e,d){this.j=a||null;this.b=b||null;this.B=c||[];this.s=null;this.u=d||"";this.a=this.h=this.m=null}function O(a){return a?a.__styleInfo:null}function jb(a,b){return a.__styleInfo=b}N.prototype.c=function(){return this.j};N.prototype._getStyleRules=N.prototype.c;var Q=window.Element.prototype,kb=Q.matches||Q.matchesSelector||Q.mozMatchesSelector||Q.msMatchesSelector||Q.oMatchesSelector||Q.webkitMatchesSelector,lb=navigator.userAgent.match("Trident");function mb(){}function nb(a){var b={},c=[],e=0;A(a,function(a){R(a);a.index=e++;a=a.f.cssText;for(var c;c=va.exec(a);){var d=c[1];":"!==c[2]&&(b[d]=!0)}},function(a){c.push(a)});a.b=c;a=[];for(var d in b)a.push(d);return a}
function R(a){if(!a.f){var b={},c={};S(a,c)&&(b.i=c,a.rules=null);b.cssText=a.parsedCssText.replace(ya,"").replace(w,"");a.f=b}}function S(a,b){var c=a.f;if(c){if(c.i)return Object.assign(b,c.i),!0}else{c=a.parsedCssText;for(var e;a=w.exec(c);){e=(a[2]||a[3]).trim();if("inherit"!==e||"unset"!==e)b[a[1].trim()]=e;e=!0}return e}}
function T(a,b,c){b&&(b=0<=b.indexOf(";")?ob(a,b,c):Ca(b,function(b,d,f,h){if(!d)return b+h;(d=T(a,c[d],c))&&"initial"!==d?"apply-shim-inherit"===d&&(d="inherit"):d=T(a,c[f]||f,c)||f;return b+(d||"")+h}));return b&&b.trim()||""}
function ob(a,b,c){b=b.split(";");for(var e=0,d,f;e<b.length;e++)if(d=b[e]){y.lastIndex=0;if(f=y.exec(d))d=T(a,c[f[1]],c);else if(f=d.indexOf(":"),-1!==f){var h=d.substring(f);h=h.trim();h=T(a,h,c)||h;d=d.substring(0,f)+h}b[e]=d&&d.lastIndexOf(";")===d.length-1?d.slice(0,-1):d||""}return b.join(";")}
function pb(a,b){var c={},e=[];A(a,function(a){a.f||R(a);var d=a.g||a.parsedSelector;b&&a.f.i&&d&&kb.call(b,d)&&(S(a,c),a=a.index,d=parseInt(a/32,10),e[d]=(e[d]||0)|1<<a%32)},null,!0);return{i:c,key:e}}
function qb(a,b,c,e,d){c.f||R(c);if(c.f.i){b=F(b);a=b.is;b=b.u;b=a?M(a,b):"html";var f=c.parsedSelector,h=":host > *"===f||"html"===f,g=0===f.indexOf(":host")&&!h;"shady"===e&&(h=f===b+" > *."+b||-1!==f.indexOf("html"),g=!h&&0===f.indexOf(b));"shadow"===e&&(h=":host > *"===f||"html"===f,g=g&&!h);if(h||g)e=b,g&&(t&&!c.g&&(c.g=Ka(K,c,K.b,a?Ja+a:"",b)),e=c.g||b),d({M:e,K:g,S:h})}}
function rb(a,b){var c={},e={},d=U,f=b&&b.__cssBuild;A(b,function(b){qb(d,a,b,f,function(d){kb.call(a.A||a,d.M)&&(d.K?S(b,c):S(b,e))})},null,!0);return{L:e,J:c}}
function sb(a,b,c,e){var d=F(b),f=M(d.is,d.u),h=new RegExp("(?:^|[^.#[:])"+(b.extends?"\\"+f.slice(0,-1)+"\\]":f)+"($|[.:[\\s>+~])");d=O(b).j;var g=tb(d,e);return L(b,d,function(b){var d="";b.f||R(b);b.f.cssText&&(d=ob(a,b.f.cssText,c));b.cssText=d;if(!t&&!Aa(b)&&b.cssText){var k=d=b.cssText;null==b.C&&(b.C=wa.test(d));if(b.C)if(null==b.w){b.w=[];for(var q in g)k=g[q],k=k(d),d!==k&&(d=k,b.w.push(q))}else{for(q=0;q<b.w.length;++q)k=g[b.w[q]],d=k(d);k=d}b.cssText=k;b.g=b.g||b.selector;d="."+e;q=b.g.split(",");
k=0;for(var zb=q.length,P;k<zb&&(P=q[k]);k++)q[k]=P.match(h)?P.replace(f,d):d+" "+P;b.selector=q.join(",")}})}function tb(a,b){a=a.b;var c={};if(!t&&a)for(var e=0,d=a[e];e<a.length;d=a[++e]){var f=d,h=b;f.l=new RegExp(f.keyframesName,"g");f.a=f.keyframesName+"-"+h;f.g=f.g||f.selector;f.selector=f.g.replace(f.keyframesName,f.a);c[d.keyframesName]=ub(d)}return c}function ub(a){return function(b){return b.replace(a.l,a.a)}}
function vb(a,b){var c=U,e=B(a);a.textContent=z(e,function(a){var d=a.cssText=a.parsedCssText;a.f&&a.f.cssText&&(d=d.replace(ma,"").replace(na,""),a.cssText=ob(c,d,b))})}aa.Object.defineProperties(mb.prototype,{a:{configurable:!0,enumerable:!0,get:function(){return"x-scope"}}});var U=new mb;var wb={},V=window.customElements;if(V&&!t){var xb=V.define;V.define=function(a,b,c){var e=document.createComment(" Shady DOM styles for "+a+" "),d=document.head;d.insertBefore(e,(D?D.nextSibling:null)||d.firstChild);D=e;wb[a]=e;return xb.call(V,a,b,c)}};var W=new function(){this.cache={};this.a=100};function X(){var a=this;this.A={};this.c=document.documentElement;var b=new n;b.rules=[];this.l=jb(this.c,new N(b));this.v=!1;this.b=this.a=null;Ea(function(){Y(a)})}l=X.prototype;l.F=function(){ib()};l.I=function(a){return B(a)};l.O=function(a){return z(a)};
l.prepareTemplate=function(a,b,c){if(!a.l){a.l=!0;a.name=b;a.extends=c;m[b]=a;var e=(e=a.content.querySelector("style"))?e.getAttribute("css-build")||"":"";var d=[];for(var f=a.content.querySelectorAll("style"),h=0;h<f.length;h++){var g=f[h];if(g.hasAttribute("shady-unscoped")){if(!t){var k=g.textContent;za.has(k)||(za.add(k),k=g.cloneNode(!0),document.head.appendChild(k));g.parentNode.removeChild(g)}}else d.push(g.textContent),g.parentNode.removeChild(g)}d=d.join("").trim();c={is:b,extends:c,P:e};
t||J(a.content,b);Y(this);f=y.test(d)||w.test(d);y.lastIndex=0;w.lastIndex=0;d=p(d);f&&v&&this.a&&this.a.transformRules(d,b);a._styleAst=d;a.v=e;e=[];v||(e=nb(a._styleAst));if(!e.length||v)d=t?a.content:null,b=wb[b],f=L(c,a._styleAst),b=f.length?C(f,c.is,d,b):void 0,a.a=b;a.c=e}};
function yb(a){!a.b&&window.ShadyCSS&&window.ShadyCSS.CustomStyleInterface&&(a.b=window.ShadyCSS.CustomStyleInterface,a.b.transformCallback=function(b){a.D(b)},a.b.validateCallback=function(){requestAnimationFrame(function(){(a.b.enqueued||a.v)&&a.o()})})}function Y(a){!a.a&&window.ShadyCSS&&window.ShadyCSS.ApplyShim&&(a.a=window.ShadyCSS.ApplyShim,a.a.invalidCallback=ra);yb(a)}
l.o=function(){Y(this);if(this.b){var a=this.b.processStyles();if(this.b.enqueued){if(v)for(var b=0;b<a.length;b++){var c=this.b.getStyleForCustomStyle(a[b]);if(c&&v&&this.a){var e=B(c);Y(this);this.a.transformRules(e);c.textContent=z(e)}}else for(Ab(this,this.c,this.l),b=0;b<a.length;b++)(c=this.b.getStyleForCustomStyle(a[b]))&&vb(c,this.l.m);this.b.enqueued=!1;this.v&&!v&&this.styleDocument()}}};
l.styleElement=function(a,b){var c=F(a).is,e=O(a);if(!e){var d=F(a);e=d.is;d=d.u;var f=wb[e];e=m[e];if(e){var h=e._styleAst;var g=e.c}e=jb(a,new N(h,f,g,0,d))}a!==this.c&&(this.v=!0);b&&(e.s=e.s||{},Object.assign(e.s,b));if(v){if(e.s){b=e.s;for(var k in b)null===k?a.style.removeProperty(k):a.style.setProperty(k,b[k])}if(((k=m[c])||a===this.c)&&k&&k.a&&!sa(k)){if(sa(k)||k._applyShimValidatingVersion!==k._applyShimNextVersion)Y(this),this.a&&this.a.transformRules(k._styleAst,c),k.a.textContent=L(a,
e.j),ta(k);t&&(c=a.shadowRoot)&&(c.querySelector("style").textContent=L(a,e.j));e.j=k._styleAst}}else if(Ab(this,a,e),e.B&&e.B.length){c=e;k=F(a).is;a:{if(b=W.cache[k])for(h=b.length-1;0<=h;h--){g=b[h];b:{e=c.B;for(d=0;d<e.length;d++)if(f=e[d],g.i[f]!==c.m[f]){e=!1;break b}e=!0}if(e){b=g;break a}}b=void 0}e=b?b.styleElement:null;h=c.h;(g=b&&b.h)||(g=this.A[k]=(this.A[k]||0)+1,g=k+"-"+g);c.h=g;g=c.h;d=U;d=e?e.textContent||"":sb(d,a,c.m,g);f=O(a);var x=f.a;x&&!t&&x!==e&&(x._useCount--,0>=x._useCount&&
x.parentNode&&x.parentNode.removeChild(x));t?f.a?(f.a.textContent=d,e=f.a):d&&(e=C(d,g,a.shadowRoot,f.b)):e?e.parentNode||(lb&&-1<d.indexOf("@media")&&(e.textContent=d),Ba(e,null,f.b)):d&&(e=C(d,g,null,f.b));e&&(e._useCount=e._useCount||0,f.a!=e&&e._useCount++,f.a=e);g=e;t||(e=c.h,f=d=a.getAttribute("class")||"",h&&(f=d.replace(new RegExp("\\s*x-scope\\s*"+h+"\\s*","g")," ")),f+=(f?" ":"")+"x-scope "+e,d!==f&&E(a,f));b||(a=W.cache[k]||[],a.push({i:c.m,styleElement:g,h:c.h}),a.length>W.a&&a.shift(),
W.cache[k]=a)}};function Bb(a,b){return(b=b.getRootNode().host)?O(b)?b:Bb(a,b):a.c}function Ab(a,b,c){a=Bb(a,b);var e=O(a);a=Object.create(e.m||null);var d=rb(b,c.j);b=pb(e.j,b).i;Object.assign(a,d.J,b,d.L);b=c.s;for(var f in b)if((d=b[f])||0===d)a[f]=d;f=U;b=Object.getOwnPropertyNames(a);for(d=0;d<b.length;d++)e=b[d],a[e]=T(f,a[e],a);c.m=a}l.styleDocument=function(a){this.styleSubtree(this.c,a)};
l.styleSubtree=function(a,b){var c=a.shadowRoot;(c||a===this.c)&&this.styleElement(a,b);if(b=c&&(c.children||c.childNodes))for(a=0;a<b.length;a++)this.styleSubtree(b[a]);else if(a=a.children||a.childNodes)for(b=0;b<a.length;b++)this.styleSubtree(a[b])};l.D=function(a){var b=this,c=B(a);A(c,function(a){if(t)ab(a);else{var c=K;a.selector=a.parsedSelector;ab(a);a.selector=a.g=Ka(c,a,c.c,void 0,void 0)}v&&(Y(b),b.a&&b.a.transformRule(a))});v?a.textContent=z(c):this.l.j.rules.push(c)};
l.getComputedStyleValue=function(a,b){var c;v||(c=(O(a)||O(Bb(this,a))).m[b]);return(c=c||window.getComputedStyle(a).getPropertyValue(b))?c.trim():""};l.N=function(a,b){var c=a.getRootNode();b=b?b.split(/\s/):[];c=c.host&&c.host.localName;if(!c){var e=a.getAttribute("class");if(e){e=e.split(/\s/);for(var d=0;d<e.length;d++)if(e[d]===K.a){c=e[d+1];break}}}c&&b.push(K.a,c);v||(c=O(a))&&c.h&&b.push(U.a,c.h);E(a,b.join(" "))};l.G=function(a){return O(a)};X.prototype.flush=X.prototype.F;
X.prototype.prepareTemplate=X.prototype.prepareTemplate;X.prototype.styleElement=X.prototype.styleElement;X.prototype.styleDocument=X.prototype.styleDocument;X.prototype.styleSubtree=X.prototype.styleSubtree;X.prototype.getComputedStyleValue=X.prototype.getComputedStyleValue;X.prototype.setElementClass=X.prototype.N;X.prototype._styleInfoForNode=X.prototype.G;X.prototype.transformCustomStyleForDocument=X.prototype.D;X.prototype.getStyleAst=X.prototype.I;X.prototype.styleAstToString=X.prototype.O;
X.prototype.flushCustomStyles=X.prototype.o;Object.defineProperties(X.prototype,{nativeShadow:{get:function(){return t}},nativeCss:{get:function(){return v}}});var Z=new X,Cb,Db;window.ShadyCSS&&(Cb=window.ShadyCSS.ApplyShim,Db=window.ShadyCSS.CustomStyleInterface);window.ShadyCSS={ScopingShim:Z,prepareTemplate:function(a,b,c){Z.o();Z.prepareTemplate(a,b,c)},styleSubtree:function(a,b){Z.o();Z.styleSubtree(a,b)},styleElement:function(a){Z.o();Z.styleElement(a)},styleDocument:function(a){Z.o();Z.styleDocument(a)},getComputedStyleValue:function(a,b){return Z.getComputedStyleValue(a,b)},nativeCss:v,nativeShadow:t};Cb&&(window.ShadyCSS.ApplyShim=Cb);
Db&&(window.ShadyCSS.CustomStyleInterface=Db);}).call(this);

//# sourceMappingURL=scoping-shim.min.js.map

var getBreakpoint = function () {
  return window.getComputedStyle(window.document.querySelector('body'), ':before').getPropertyValue('content').replace(/"/g, '');
};

function breakpoint(breakpoint, callback) {
  if (typeof callback === "function") {
    if (getBreakpoint() === breakpoint) {
      callback();
    }
    $(window).resize(function () {
      if (getBreakpoint() === breakpoint) {
        callback();
      }
    });
  } else {
    return getBreakpoint() === breakpoint;
  }
}

function desktop(callback) {
  return breakpoint("desktop", callback);
}

function tablet(callback) {
  return breakpoint("tablet", callback);
}

function phone(callback) {
  return breakpoint("phone", callback);
}

<!--
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
-->
<link rel="import" href="lib/legacy/legacy-element-mixin.html">
<link rel="import" href="lib/legacy/polymer-fn.html">
<!-- template elements -->
<link rel="import" href="lib/legacy/templatizer-behavior.html">
<link rel="import" href="lib/elements/dom-bind.html">
<link rel="import" href="lib/elements/dom-repeat.html">
<link rel="import" href="lib/elements/dom-if.html">
<link rel="import" href="lib/elements/array-selector.html">
<!-- custom-style -->
<link rel="import" href="lib/elements/custom-style.html">
<!-- bc behaviors -->
<link rel="import" href="lib/legacy/mutable-data-behavior.html">
<script>
  // bc
  Polymer.Base = Polymer.LegacyElementMixin(HTMLElement).prototype;
</script>
