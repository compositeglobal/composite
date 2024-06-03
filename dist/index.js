(()=>{var Kt=Object.create;var vt=Object.defineProperty;var Qt=Object.getOwnPropertyDescriptor;var Zt=Object.getOwnPropertyNames;var te=Object.getPrototypeOf,ee=Object.prototype.hasOwnProperty;var wt=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var ie=(e,t,i,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of Zt(t))!ee.call(e,r)&&r!==i&&vt(e,r,{get:()=>t[r],enumerable:!(n=Qt(t,r))||n.enumerable});return e};var ne=(e,t,i)=>(i=e!=null?Kt(te(e)):{},ie(t||!e||!e.__esModule?vt(i,"default",{value:e,enumerable:!0}):i,e));var Ut=wt(($t,rt)=>{(function(e,t){typeof rt=="object"&&rt.exports?rt.exports=t():e.EvEmitter=t()})(typeof window<"u"?window:$t,function(){function e(){}let t=e.prototype;return t.on=function(i,n){if(!i||!n)return this;let r=this._events=this._events||{},s=r[i]=r[i]||[];return s.includes(n)||s.push(n),this},t.once=function(i,n){if(!i||!n)return this;this.on(i,n);let r=this._onceEvents=this._onceEvents||{},s=r[i]=r[i]||{};return s[n]=!0,this},t.off=function(i,n){let r=this._events&&this._events[i];if(!r||!r.length)return this;let s=r.indexOf(n);return s!=-1&&r.splice(s,1),this},t.emitEvent=function(i,n){let r=this._events&&this._events[i];if(!r||!r.length)return this;r=r.slice(0),n=n||[];let s=this._onceEvents&&this._onceEvents[i];for(let c of r)s&&s[c]&&(this.off(i,c),delete s[c]),c.apply(this,n);return this},t.allOff=function(){return delete this._events,delete this._onceEvents,this},e})});var Gt=wt((Ft,ot)=>{(function(e,t){typeof ot=="object"&&ot.exports?ot.exports=t(e,Ut()):e.imagesLoaded=t(e,e.EvEmitter)})(typeof window<"u"?window:Ft,function(t,i){let n=t.jQuery,r=t.console;function s(a){return Array.isArray(a)?a:typeof a=="object"&&typeof a.length=="number"?[...a]:[a]}function c(a,o,l){if(!(this instanceof c))return new c(a,o,l);let h=a;if(typeof a=="string"&&(h=document.querySelectorAll(a)),!h){r.error(`Bad element for imagesLoaded ${h||a}`);return}this.elements=s(h),this.options={},typeof o=="function"?l=o:Object.assign(this.options,o),l&&this.on("always",l),this.getImages(),n&&(this.jqDeferred=new n.Deferred),setTimeout(this.check.bind(this))}c.prototype=Object.create(i.prototype),c.prototype.getImages=function(){this.images=[],this.elements.forEach(this.addElementImages,this)};let p=[1,9,11];c.prototype.addElementImages=function(a){a.nodeName==="IMG"&&this.addImage(a),this.options.background===!0&&this.addElementBackgroundImages(a);let{nodeType:o}=a;if(!o||!p.includes(o))return;let l=a.querySelectorAll("img");for(let h of l)this.addImage(h);if(typeof this.options.background=="string"){let h=a.querySelectorAll(this.options.background);for(let y of h)this.addElementBackgroundImages(y)}};let f=/url\((['"])?(.*?)\1\)/gi;c.prototype.addElementBackgroundImages=function(a){let o=getComputedStyle(a);if(!o)return;let l=f.exec(o.backgroundImage);for(;l!==null;){let h=l&&l[2];h&&this.addBackground(h,a),l=f.exec(o.backgroundImage)}},c.prototype.addImage=function(a){let o=new m(a);this.images.push(o)},c.prototype.addBackground=function(a,o){let l=new S(a,o);this.images.push(l)},c.prototype.check=function(){if(this.progressedCount=0,this.hasAnyBroken=!1,!this.images.length){this.complete();return}let a=(o,l,h)=>{setTimeout(()=>{this.progress(o,l,h)})};this.images.forEach(function(o){o.once("progress",a),o.check()})},c.prototype.progress=function(a,o,l){this.progressedCount++,this.hasAnyBroken=this.hasAnyBroken||!a.isLoaded,this.emitEvent("progress",[this,a,o]),this.jqDeferred&&this.jqDeferred.notify&&this.jqDeferred.notify(this,a),this.progressedCount===this.images.length&&this.complete(),this.options.debug&&r&&r.log(`progress: ${l}`,a,o)},c.prototype.complete=function(){let a=this.hasAnyBroken?"fail":"done";if(this.isComplete=!0,this.emitEvent(a,[this]),this.emitEvent("always",[this]),this.jqDeferred){let o=this.hasAnyBroken?"reject":"resolve";this.jqDeferred[o](this)}};function m(a){this.img=a}m.prototype=Object.create(i.prototype),m.prototype.check=function(){if(this.getIsImageComplete()){this.confirm(this.img.naturalWidth!==0,"naturalWidth");return}this.proxyImage=new Image,this.img.crossOrigin&&(this.proxyImage.crossOrigin=this.img.crossOrigin),this.proxyImage.addEventListener("load",this),this.proxyImage.addEventListener("error",this),this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.proxyImage.src=this.img.currentSrc||this.img.src},m.prototype.getIsImageComplete=function(){return this.img.complete&&this.img.naturalWidth},m.prototype.confirm=function(a,o){this.isLoaded=a;let{parentNode:l}=this.img,h=l.nodeName==="PICTURE"?l:this.img;this.emitEvent("progress",[this,h,o])},m.prototype.handleEvent=function(a){let o="on"+a.type;this[o]&&this[o](a)},m.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindEvents()},m.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindEvents()},m.prototype.unbindEvents=function(){this.proxyImage.removeEventListener("load",this),this.proxyImage.removeEventListener("error",this),this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)};function S(a,o){this.url=a,this.element=o,this.img=new Image}return S.prototype=Object.create(m.prototype),S.prototype.check=function(){this.img.addEventListener("load",this),this.img.addEventListener("error",this),this.img.src=this.url,this.getIsImageComplete()&&(this.confirm(this.img.naturalWidth!==0,"naturalWidth"),this.unbindEvents())},S.prototype.unbindEvents=function(){this.img.removeEventListener("load",this),this.img.removeEventListener("error",this)},S.prototype.confirm=function(a,o){this.isLoaded=a,this.emitEvent("progress",[this,this.element,o])},c.makeJQueryPlugin=function(a){a=a||t.jQuery,a&&(n=a,n.fn.imagesLoaded=function(o,l){return new c(this,o,l).jqDeferred.promise(n(this))})},c.makeJQueryPlugin(),c})});(function(){function e(){for(var n=arguments.length,r=0;r<n;r++){var s=r<0||arguments.length<=r?void 0:arguments[r];s.nodeType===1||s.nodeType===11?this.appendChild(s):this.appendChild(document.createTextNode(String(s)))}}function t(){for(;this.lastChild;)this.removeChild(this.lastChild);arguments.length&&this.append.apply(this,arguments)}function i(){for(var n=this.parentNode,r=arguments.length,s=new Array(r),c=0;c<r;c++)s[c]=arguments[c];var p=s.length;if(!!n)for(p||n.removeChild(this);p--;){var f=s[p];typeof f!="object"?f=this.ownerDocument.createTextNode(f):f.parentNode&&f.parentNode.removeChild(f),p?n.insertBefore(this.previousSibling,f):n.replaceChild(f,this)}}typeof Element<"u"&&(Element.prototype.append||(Element.prototype.append=e,DocumentFragment.prototype.append=e),Element.prototype.replaceChildren||(Element.prototype.replaceChildren=t,DocumentFragment.prototype.replaceChildren=t),Element.prototype.replaceWith||(Element.prototype.replaceWith=i,DocumentFragment.prototype.replaceWith=i))})();function re(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function St(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function bt(e,t,i){return t&&St(e.prototype,t),i&&St(e,i),e}function oe(e,t,i){return t in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}function Et(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),i.push.apply(i,n)}return i}function Tt(e){for(var t=1;t<arguments.length;t++){var i=arguments[t]!=null?arguments[t]:{};t%2?Et(Object(i),!0).forEach(function(n){oe(e,n,i[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):Et(Object(i)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(i,n))})}return e}function _t(e,t){return ae(e)||ce(e,t)||At(e,t)||ue()}function R(e){return se(e)||le(e)||At(e)||he()}function se(e){if(Array.isArray(e))return at(e)}function ae(e){if(Array.isArray(e))return e}function le(e){if(typeof Symbol<"u"&&Symbol.iterator in Object(e))return Array.from(e)}function ce(e,t){if(!(typeof Symbol>"u"||!(Symbol.iterator in Object(e)))){var i=[],n=!0,r=!1,s=void 0;try{for(var c=e[Symbol.iterator](),p;!(n=(p=c.next()).done)&&(i.push(p.value),!(t&&i.length===t));n=!0);}catch(f){r=!0,s=f}finally{try{!n&&c.return!=null&&c.return()}finally{if(r)throw s}}return i}}function At(e,t){if(!!e){if(typeof e=="string")return at(e,t);var i=Object.prototype.toString.call(e).slice(8,-1);if(i==="Object"&&e.constructor&&(i=e.constructor.name),i==="Map"||i==="Set")return Array.from(e);if(i==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i))return at(e,t)}}function at(e,t){(t==null||t>e.length)&&(t=e.length);for(var i=0,n=new Array(t);i<t;i++)n[i]=e[i];return n}function he(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function ue(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function F(e,t){return Object.getOwnPropertyNames(Object(e)).reduce(function(i,n){var r=Object.getOwnPropertyDescriptor(Object(e),n),s=Object.getOwnPropertyDescriptor(Object(t),n);return Object.defineProperty(i,n,s||r)},{})}function Q(e){return typeof e=="string"}function ut(e){return Array.isArray(e)}function Z(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},t=F(e),i;return t.types!==void 0?i=t.types:t.split!==void 0&&(i=t.split),i!==void 0&&(t.types=(Q(i)||ut(i)?String(i):"").split(",").map(function(n){return String(n).trim()}).filter(function(n){return/((line)|(word)|(char))/i.test(n)})),(t.absolute||t.position)&&(t.absolute=t.absolute||/absolute/.test(e.position)),t}function dt(e){var t=Q(e)||ut(e)?String(e):"";return{none:!t,lines:/line/i.test(t),words:/word/i.test(t),chars:/char/i.test(t)}}function et(e){return e!==null&&typeof e=="object"}function de(e){return et(e)&&/^(1|3|11)$/.test(e.nodeType)}function pe(e){return typeof e=="number"&&e>-1&&e%1===0}function fe(e){return et(e)&&pe(e.length)}function X(e){return ut(e)?e:e==null?[]:fe(e)?Array.prototype.slice.call(e):[e]}function Lt(e){var t=e;return Q(e)&&(/^(#[a-z]\w+)$/.test(e.trim())?t=document.getElementById(e.trim().slice(1)):t=document.querySelectorAll(e)),X(t).reduce(function(i,n){return[].concat(R(i),R(X(n).filter(de)))},[])}var ge=Object.entries,tt="_splittype",z={},me=0;function j(e,t,i){if(!et(e))return console.warn("[data.set] owner is not an object"),null;var n=e[tt]||(e[tt]=++me),r=z[n]||(z[n]={});return i===void 0?!!t&&Object.getPrototypeOf(t)===Object.prototype&&(z[n]=Tt(Tt({},r),t)):t!==void 0&&(r[t]=i),i}function G(e,t){var i=et(e)?e[tt]:null,n=i&&z[i]||{};return t===void 0?n:n[t]}function Ot(e){var t=e&&e[tt];t&&(delete e[t],delete z[t])}function ye(){Object.keys(z).forEach(function(e){delete z[e]})}function ve(){ge(z).forEach(function(e){var t=_t(e,2),i=t[0],n=t[1],r=n.isRoot,s=n.isSplit;(!r||!s)&&(z[i]=null,delete z[i])})}function we(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:" ",i=e?String(e):"";return i.trim().replace(/\s+/g," ").split(t)}var pt="\\ud800-\\udfff",xt="\\u0300-\\u036f\\ufe20-\\ufe23",Ct="\\u20d0-\\u20f0",It="\\ufe0e\\ufe0f",Se="[".concat(pt,"]"),lt="[".concat(xt).concat(Ct,"]"),ct="\\ud83c[\\udffb-\\udfff]",be="(?:".concat(lt,"|").concat(ct,")"),kt="[^".concat(pt,"]"),Rt="(?:\\ud83c[\\udde6-\\uddff]){2}",Mt="[\\ud800-\\udbff][\\udc00-\\udfff]",Nt="\\u200d",Wt="".concat(be,"?"),Dt="[".concat(It,"]?"),Ee="(?:"+Nt+"(?:"+[kt,Rt,Mt].join("|")+")"+Dt+Wt+")*",Te=Dt+Wt+Ee,Le="(?:".concat(["".concat(kt).concat(lt,"?"),lt,Rt,Mt,Se].join("|"),`
)`),_e=RegExp("".concat(ct,"(?=").concat(ct,")|").concat(Le).concat(Te),"g"),Ae=[Nt,pt,xt,Ct,It],Oe=RegExp("[".concat(Ae.join(""),"]"));function xe(e){return e.split("")}function zt(e){return Oe.test(e)}function Ce(e){return e.match(_e)||[]}function Ie(e){return zt(e)?Ce(e):xe(e)}function ke(e){return e==null?"":String(e)}function Re(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"";return e=ke(e),e&&Q(e)&&!t&&zt(e)?Ie(e):e.split(t)}function ht(e,t){var i=document.createElement(e);return t&&Object.keys(t).forEach(function(n){var r=t[n],s=Q(r)?r.trim():r;s===null||s===""||(n==="children"?i.append.apply(i,R(X(s))):i.setAttribute(n,s))}),i}var ft={splitClass:"",lineClass:"line",wordClass:"word",charClass:"char",types:["lines","words","chars"],absolute:!1,tagName:"div"};function Me(e,t){t=F(ft,t);var i=dt(t.types),n=t.tagName,r=e.nodeValue,s=document.createDocumentFragment(),c=[],p=[];return/^\s/.test(r)&&s.append(" "),c=we(r).reduce(function(f,m,S,a){var o,l;return i.chars&&(l=Re(m).map(function(h){var y=ht(n,{class:"".concat(t.splitClass," ").concat(t.charClass),style:"display: inline-block;",children:h});return j(y,"isChar",!0),p=[].concat(R(p),[y]),y})),i.words||i.lines?(o=ht(n,{class:"".concat(t.wordClass," ").concat(t.splitClass),style:"display: inline-block; ".concat(i.words&&t.absolute?"position: relative;":""),children:i.chars?l:m}),j(o,{isWord:!0,isWordStart:!0,isWordEnd:!0}),s.appendChild(o)):l.forEach(function(h){s.appendChild(h)}),S<a.length-1&&s.append(" "),i.words?f.concat(o):f},[]),/\s$/.test(r)&&s.append(" "),e.replaceWith(s),{words:c,chars:p}}function Pt(e,t){var i=e.nodeType,n={words:[],chars:[]};if(!/(1|3|11)/.test(i))return n;if(i===3&&/\S/.test(e.nodeValue))return Me(e,t);var r=X(e.childNodes);if(r.length&&(j(e,"isSplit",!0),!G(e).isRoot)){e.style.display="inline-block",e.style.position="relative";var s=e.nextSibling,c=e.previousSibling,p=e.textContent||"",f=s?s.textContent:" ",m=c?c.textContent:" ";j(e,{isWordEnd:/\s$/.test(p)||/^\s/.test(f),isWordStart:/^\s/.test(p)||/\s$/.test(m)})}return r.reduce(function(S,a){var o=Pt(a,t),l=o.words,h=o.chars;return{words:[].concat(R(S.words),R(l)),chars:[].concat(R(S.chars),R(h))}},n)}function Ne(e,t,i,n){if(!i.absolute)return{top:t?e.offsetTop:null};var r=e.offsetParent,s=_t(n,2),c=s[0],p=s[1],f=0,m=0;if(r&&r!==document.body){var S=r.getBoundingClientRect();f=S.x+c,m=S.y+p}var a=e.getBoundingClientRect(),o=a.width,l=a.height,h=a.x,y=a.y,x=y+p-m,C=h+c-f;return{width:o,height:l,top:x,left:C}}function jt(e){G(e).isWord?(Ot(e),e.replaceWith.apply(e,R(e.childNodes))):X(e.children).forEach(function(t){return jt(t)})}var We=function(){return document.createDocumentFragment()};function De(e,t,i){var n=dt(t.types),r=t.tagName,s=e.getElementsByTagName("*"),c=[],p=[],f=null,m,S,a,o=[],l=e.parentElement,h=e.nextElementSibling,y=We(),x=window.getComputedStyle(e),C=x.textAlign,U=parseFloat(x.fontSize),W=U*.2;return t.absolute&&(a={left:e.offsetLeft,top:e.offsetTop,width:e.offsetWidth},S=e.offsetWidth,m=e.offsetHeight,j(e,{cssWidth:e.style.width,cssHeight:e.style.height})),X(s).forEach(function(v){var E=v.parentElement===e,w=Ne(v,E,t,i),O=w.width,D=w.height,L=w.top,_=w.left;/^br$/i.test(v.nodeName)||(n.lines&&E&&((f===null||L-f>=W)&&(f=L,c.push(p=[])),p.push(v)),t.absolute&&j(v,{top:L,left:_,width:O,height:D}))}),l&&l.removeChild(e),n.lines&&(o=c.map(function(v){var E=ht(r,{class:"".concat(t.splitClass," ").concat(t.lineClass),style:"display: block; text-align: ".concat(C,"; width: 100%;")});j(E,"isLine",!0);var w={height:0,top:1e4};return y.appendChild(E),v.forEach(function(O,D,L){var _=G(O),I=_.isWordEnd,g=_.top,T=_.height,N=L[D+1];w.height=Math.max(w.height,T),w.top=Math.min(w.top,g),E.appendChild(O),I&&G(N).isWordStart&&E.append(" ")}),t.absolute&&j(E,{height:w.height,top:w.top}),E}),n.words||jt(y),e.replaceChildren(y)),t.absolute&&(e.style.width="".concat(e.style.width||S,"px"),e.style.height="".concat(m,"px"),X(s).forEach(function(v){var E=G(v),w=E.isLine,O=E.top,D=E.left,L=E.width,_=E.height,I=G(v.parentElement),g=!w&&I.isLine;v.style.top="".concat(g?O-I.top:O,"px"),v.style.left=w?"".concat(a.left,"px"):"".concat(D-(g?a.left:0),"px"),v.style.height="".concat(_,"px"),v.style.width=w?"".concat(a.width,"px"):"".concat(L,"px"),v.style.position="absolute"})),l&&(h?l.insertBefore(e,h):l.appendChild(e)),o}var Y=F(ft,{}),Ht=function(){bt(e,null,[{key:"clearData",value:function(){ye()}},{key:"setDefaults",value:function(i){return Y=F(Y,Z(i)),ft}},{key:"revert",value:function(i){Lt(i).forEach(function(n){var r=G(n),s=r.isSplit,c=r.html,p=r.cssWidth,f=r.cssHeight;s&&(n.innerHTML=c,n.style.width=p||"",n.style.height=f||"",Ot(n))})}},{key:"create",value:function(i,n){return new e(i,n)}},{key:"data",get:function(){return z}},{key:"defaults",get:function(){return Y},set:function(i){Y=F(Y,Z(i))}}]);function e(t,i){re(this,e),this.isSplit=!1,this.settings=F(Y,Z(i)),this.elements=Lt(t),this.split()}return bt(e,[{key:"split",value:function(i){var n=this;this.revert(),this.elements.forEach(function(c){j(c,"html",c.innerHTML)}),this.lines=[],this.words=[],this.chars=[];var r=[window.pageXOffset,window.pageYOffset];i!==void 0&&(this.settings=F(this.settings,Z(i)));var s=dt(this.settings.types);s.none||(this.elements.forEach(function(c){j(c,"isRoot",!0);var p=Pt(c,n.settings),f=p.words,m=p.chars;n.words=[].concat(R(n.words),R(f)),n.chars=[].concat(R(n.chars),R(m))}),this.elements.forEach(function(c){if(s.lines||n.settings.absolute){var p=De(c,n.settings,r);n.lines=[].concat(R(n.lines),R(p))}}),this.isSplit=!0,window.scrollTo(r[0],r[1]),ve())}},{key:"revert",value:function(){this.isSplit&&(this.lines=null,this.words=null,this.chars=null,this.isSplit=!1),e.revert(this.elements)}}]),e}();function Bt(e,t,i){return Math.max(e,Math.min(t,i))}var gt=class{advance(t){if(!this.isRunning)return;let i=!1;if(this.lerp)this.value=function(r,s,c,p){return function(m,S,a){return(1-a)*m+a*S}(r,s,1-Math.exp(-c*p))}(this.value,this.to,60*this.lerp,t),Math.round(this.value)===this.to&&(this.value=this.to,i=!0);else{this.currentTime+=t;let n=Bt(0,this.currentTime/this.duration,1);i=n>=1;let r=i?1:this.easing(n);this.value=this.from+(this.to-this.from)*r}i&&this.stop(),this.onUpdate?.(this.value,i)}stop(){this.isRunning=!1}fromTo(t,i,{lerp:n=.1,duration:r=1,easing:s=f=>f,onStart:c,onUpdate:p}){this.from=this.value=t,this.to=i,this.lerp=n,this.duration=r,this.easing=s,this.currentTime=0,this.isRunning=!0,c?.(),this.onUpdate=p}},mt=class{constructor({wrapper:t,content:i,autoResize:n=!0,debounce:r=250}={}){this.wrapper=t,this.content=i,n&&(this.debouncedResize=function(c,p){let f;return function(){let m=arguments,S=this;clearTimeout(f),f=setTimeout(function(){c.apply(S,m)},p)}}(this.resize,r),this.wrapper===window?window.addEventListener("resize",this.debouncedResize,!1):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}destroy(){this.wrapperResizeObserver?.disconnect(),this.contentResizeObserver?.disconnect(),window.removeEventListener("resize",this.debouncedResize,!1)}resize=()=>{this.onWrapperResize(),this.onContentResize()};onWrapperResize=()=>{this.wrapper===window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)};onContentResize=()=>{this.wrapper===window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)};get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}},it=class{constructor(){this.events={}}emit(t,...i){let n=this.events[t]||[];for(let r=0,s=n.length;r<s;r++)n[r](...i)}on(t,i){return this.events[t]?.push(i)||(this.events[t]=[i]),()=>{this.events[t]=this.events[t]?.filter(n=>i!==n)}}off(t,i){this.events[t]=this.events[t]?.filter(n=>i!==n)}destroy(){this.events={}}},qt=100/6,yt=class{constructor(t,{wheelMultiplier:i=1,touchMultiplier:n=1}){this.element=t,this.wheelMultiplier=i,this.touchMultiplier=n,this.touchStart={x:null,y:null},this.emitter=new it,window.addEventListener("resize",this.onWindowResize,!1),this.onWindowResize(),this.element.addEventListener("wheel",this.onWheel,{passive:!1}),this.element.addEventListener("touchstart",this.onTouchStart,{passive:!1}),this.element.addEventListener("touchmove",this.onTouchMove,{passive:!1}),this.element.addEventListener("touchend",this.onTouchEnd,{passive:!1})}on(t,i){return this.emitter.on(t,i)}destroy(){this.emitter.destroy(),window.removeEventListener("resize",this.onWindowResize,!1),this.element.removeEventListener("wheel",this.onWheel,{passive:!1}),this.element.removeEventListener("touchstart",this.onTouchStart,{passive:!1}),this.element.removeEventListener("touchmove",this.onTouchMove,{passive:!1}),this.element.removeEventListener("touchend",this.onTouchEnd,{passive:!1})}onTouchStart=t=>{let{clientX:i,clientY:n}=t.targetTouches?t.targetTouches[0]:t;this.touchStart.x=i,this.touchStart.y=n,this.lastDelta={x:0,y:0},this.emitter.emit("scroll",{deltaX:0,deltaY:0,event:t})};onTouchMove=t=>{let{clientX:i,clientY:n}=t.targetTouches?t.targetTouches[0]:t,r=-(i-this.touchStart.x)*this.touchMultiplier,s=-(n-this.touchStart.y)*this.touchMultiplier;this.touchStart.x=i,this.touchStart.y=n,this.lastDelta={x:r,y:s},this.emitter.emit("scroll",{deltaX:r,deltaY:s,event:t})};onTouchEnd=t=>{this.emitter.emit("scroll",{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:t})};onWheel=t=>{let{deltaX:i,deltaY:n,deltaMode:r}=t;i*=r===1?qt:r===2?this.windowWidth:1,n*=r===1?qt:r===2?this.windowHeight:1,i*=this.wheelMultiplier,n*=this.wheelMultiplier,this.emitter.emit("scroll",{deltaX:i,deltaY:n,event:t})};onWindowResize=()=>{this.windowWidth=window.innerWidth,this.windowHeight=window.innerHeight}},nt=class{constructor({wrapper:t=window,content:i=document.documentElement,wheelEventsTarget:n=t,eventsTarget:r=n,smoothWheel:s=!0,syncTouch:c=!1,syncTouchLerp:p=.075,touchInertiaMultiplier:f=35,duration:m,easing:S=v=>Math.min(1,1.001-Math.pow(2,-10*v)),lerp:a=!m&&.1,infinite:o=!1,orientation:l="vertical",gestureOrientation:h="vertical",touchMultiplier:y=1,wheelMultiplier:x=1,autoResize:C=!0,prevent:U=!1,__experimental__naiveDimensions:W=!1}={}){this.__isScrolling=!1,this.__isStopped=!1,this.__isLocked=!1,this.onVirtualScroll=({deltaX:v,deltaY:E,event:w})=>{if(w.ctrlKey)return;let O=w.type.includes("touch"),D=w.type.includes("wheel");if(this.isTouching=w.type==="touchstart"||w.type==="touchmove",this.options.syncTouch&&O&&w.type==="touchstart"&&!this.isStopped&&!this.isLocked)return void this.reset();let L=v===0&&E===0,_=this.options.gestureOrientation==="vertical"&&E===0||this.options.gestureOrientation==="horizontal"&&v===0;if(L||_)return;let I=w.composedPath();I=I.slice(0,I.indexOf(this.rootElement));let g=this.options.prevent;if(I.find(A=>{var H,P,V,J,K;return(typeof g=="function"?g?.(A):g)||((H=A.hasAttribute)===null||H===void 0?void 0:H.call(A,"data-lenis-prevent"))||O&&((P=A.hasAttribute)===null||P===void 0?void 0:P.call(A,"data-lenis-prevent-touch"))||D&&((V=A.hasAttribute)===null||V===void 0?void 0:V.call(A,"data-lenis-prevent-wheel"))||((J=A.classList)===null||J===void 0?void 0:J.contains("lenis"))&&!(!((K=A.classList)===null||K===void 0)&&K.contains("lenis-stopped"))}))return;if(this.isStopped||this.isLocked)return void w.preventDefault();if(!(this.options.syncTouch&&O||this.options.smoothWheel&&D))return this.isScrolling="native",void this.animate.stop();w.preventDefault();let T=E;this.options.gestureOrientation==="both"?T=Math.abs(E)>Math.abs(v)?E:v:this.options.gestureOrientation==="horizontal"&&(T=v);let N=O&&this.options.syncTouch,M=O&&w.type==="touchend"&&Math.abs(T)>5;M&&(T=this.velocity*this.options.touchInertiaMultiplier),this.scrollTo(this.targetScroll+T,Object.assign({programmatic:!1},N?{lerp:M?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}))},this.onNativeScroll=()=>{if(clearTimeout(this.__resetVelocityTimeout),delete this.__resetVelocityTimeout,this.__preventNextNativeScrollEvent)delete this.__preventNextNativeScrollEvent;else if(this.isScrolling===!1||this.isScrolling==="native"){let v=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-v,this.direction=Math.sign(this.animatedScroll-v),this.isScrolling=!!this.hasScrolled&&"native",this.emit(),this.velocity!==0&&(this.__resetVelocityTimeout=setTimeout(()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()},400))}},window.lenisVersion="1.1.1",t!==document.documentElement&&t!==document.body||(t=window),this.options={wrapper:t,content:i,wheelEventsTarget:n,eventsTarget:r,smoothWheel:s,syncTouch:c,syncTouchLerp:p,touchInertiaMultiplier:f,duration:m,easing:S,lerp:a,infinite:o,gestureOrientation:h,orientation:l,touchMultiplier:y,wheelMultiplier:x,autoResize:C,prevent:U,__experimental__naiveDimensions:W},this.animate=new gt,this.emitter=new it,this.dimensions=new mt({wrapper:t,content:i,autoResize:C}),this.updateClassName(),this.userData={},this.time=0,this.velocity=this.lastVelocity=0,this.isLocked=!1,this.isStopped=!1,this.isScrolling=!1,this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener("scroll",this.onNativeScroll,!1),this.virtualScroll=new yt(r,{touchMultiplier:y,wheelMultiplier:x}),this.virtualScroll.on("scroll",this.onVirtualScroll)}destroy(){this.emitter.destroy(),this.options.wrapper.removeEventListener("scroll",this.onNativeScroll,!1),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName()}on(t,i){return this.emitter.on(t,i)}off(t,i){return this.emitter.off(t,i)}setScroll(t){this.isHorizontal?this.rootElement.scrollLeft=t:this.rootElement.scrollTop=t}resize(){this.dimensions.resize()}emit({userData:t={}}={}){this.userData=t,this.emitter.emit("scroll",this),this.userData={}}reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){this.isStopped&&(this.isStopped=!1,this.reset())}stop(){this.isStopped||(this.isStopped=!0,this.animate.stop(),this.reset())}raf(t){let i=t-(this.time||t);this.time=t,this.animate.advance(.001*i)}scrollTo(t,{offset:i=0,immediate:n=!1,lock:r=!1,duration:s=this.options.duration,easing:c=this.options.easing,lerp:p=!s&&this.options.lerp,onStart:f,onComplete:m,force:S=!1,programmatic:a=!0,userData:o={}}={}){if(!this.isStopped&&!this.isLocked||S){if(["top","left","start"].includes(t))t=0;else if(["bottom","right","end"].includes(t))t=this.limit;else{let l;if(typeof t=="string"?l=document.querySelector(t):t?.nodeType&&(l=t),l){if(this.options.wrapper!==window){let y=this.options.wrapper.getBoundingClientRect();i-=this.isHorizontal?y.left:y.top}let h=l.getBoundingClientRect();t=(this.isHorizontal?h.left:h.top)+this.animatedScroll}}if(typeof t=="number"){if(t+=i,t=Math.round(t),this.options.infinite?a&&(this.targetScroll=this.animatedScroll=this.scroll):t=Bt(0,t,this.limit),n)return this.animatedScroll=this.targetScroll=t,this.setScroll(this.scroll),this.reset(),void(m==null||m(this));t!==this.targetScroll&&(a||(this.targetScroll=t),this.animate.fromTo(this.animatedScroll,t,{duration:s,easing:c,lerp:p,onStart:()=>{r&&(this.isLocked=!0),this.isScrolling="smooth",f?.(this)},onUpdate:(l,h)=>{this.isScrolling="smooth",this.lastVelocity=this.velocity,this.velocity=l-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=l,this.setScroll(this.scroll),a&&(this.targetScroll=l),h||this.emit({userData:o}),h&&(this.reset(),this.emit({userData:o}),m?.(this),this.__preventNextNativeScrollEvent=!0)}}))}}}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.__experimental__naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?"x":"y"]}get isHorizontal(){return this.options.orientation==="horizontal"}get actualScroll(){return this.isHorizontal?this.rootElement.scrollLeft:this.rootElement.scrollTop}get scroll(){return this.options.infinite?function(i,n){return(i%n+n)%n}(this.animatedScroll,this.limit):this.animatedScroll}get progress(){return this.limit===0?1:this.scroll/this.limit}get isScrolling(){return this.__isScrolling}set isScrolling(t){this.__isScrolling!==t&&(this.__isScrolling=t,this.updateClassName())}get isStopped(){return this.__isStopped}set isStopped(t){this.__isStopped!==t&&(this.__isStopped=t,this.updateClassName())}get isLocked(){return this.__isLocked}set isLocked(t){this.__isLocked!==t&&(this.__isLocked=t,this.updateClassName())}get isSmooth(){return this.isScrolling==="smooth"}get className(){let t="lenis";return this.isStopped&&(t+=" lenis-stopped"),this.isLocked&&(t+=" lenis-locked"),this.isScrolling&&(t+=" lenis-scrolling"),this.isScrolling==="smooth"&&(t+=" lenis-smooth"),t}updateClassName(){this.cleanUpClassName(),this.rootElement.className=`${this.rootElement.className} ${this.className}`.trim()}cleanUpClassName(){this.rootElement.className=this.rootElement.className.replace(/lenis(-\w+)?/g,"").trim()}};var Vt=ne(Gt(),1);var q=function(e,t){let i=typeof e;return typeof t!="string"||t.trim()===""?e:t==="true"&&i==="boolean"?!0:t==="false"&&i==="boolean"?!1:isNaN(t)&&i==="string"?t:!isNaN(t)&&i==="number"?+t:e},st=function(e,t="lines, words"){if(!!e)return typeSplit=new Ht(e,{types:t}),typeSplit},Xt=function(e,t,i){if(!e||!t||!i){console.error(`GSAP checkBreakpoints Error in ${t}`);return}let{isMobile:n,isTablet:r,isDesktop:s,reduceMotion:c}=i.conditions;if(n===void 0||r===void 0||s===void 0){console.error("GSAP Match Media Conditions Not Defined");return}let p=`data-ix-${t}-desktop`,f=`data-ix-${t}-tablet`,m=`data-ix-${t}-mobile`;return runMobile=q(!0,e.getAttribute(m)),runTablet=q(!0,e.getAttribute(f)),runDesktop=q(!0,e.getAttribute(p)),!(runMobile===!1&&n||runTablet===!1&&r||runDesktop===!1&&s)};var ze=function(){let e="data-load",t="title",i="item",n=document.querySelectorAll(`[${e}="${i}"]`),r=document.querySelector(`[${e}="${t}"]`);if(!r||n.length===0)return;let s=st(r,"lines, words, chars");if(!s)return;let c=gsap.timeline({paused:!0,defaults:{ease:"power1.out",duration:.6}});return c.set(r,{opacity:1}),c.fromTo(s.words,{opacity:0},{opacity:1,stagger:{each:.1,from:"random"}}),c.fromTo(n,{opacity:0,y:"2rem"},{opacity:1,y:"0rem",stagger:{each:.2,from:"start"}},"<.3"),c},Yt=ze(),Pe=function(){let e="page-visited",t='[data-page-load="wrap"]',i='[data-page-load="logo-front"]',n='[data-page-load="logo-wrap"]',r='[data-page-load="background"]',s='[data-page-transition="wrap"]',c='[data-page-transition="background"]',p='[data-page-transition="cloud-1"]',f='[data-page-transition="cloud-2"]',m=".main-wrapper",S='[data-page="nav"]',a="data-transition",o=document.querySelector(t),l=document.querySelector(i),h=document.querySelector(n),y=document.querySelector(r),x=document.querySelector("body"),C=document.querySelector(m),U=document.querySelector(S);if(!o||!l||!h||!y||!C)return;let W=document.querySelector(s),v=document.querySelector(c),E=document.querySelector(p),w=document.querySelector(f);if(!W||!v||!E||!w)return;(function(){let L=function(){let g=gsap.timeline({defaults:{ease:"power1.inOut"}});g.set(E,{opacity:0}),g.set(w,{opacity:0}),g.to(v,{opacity:0,duration:.8}),g.set(W,{display:"none"}),g.set("body",{overflow:"visible"}),g.eventCallback("onStart",()=>{let T=(g.duration()-.2)*1e3;setTimeout(()=>{Yt.play()},T)})},_=function(g){let T=gsap.timeline({paused:!1,defaults:{ease:"power2.inOut"},onComplete:()=>setTimeout(()=>{window.location.href=g},100)});return T.set(W,{display:"flex"}),T.fromTo(E,{xPercent:-10,scale:2,opacity:0},{xPercent:0,scale:1,opacity:1,duration:1.2}),T.fromTo(w,{xPercent:10,scale:2,opacity:0},{xPercent:0,scale:1,opacity:1,duration:1.2},"<"),T.fromTo(v,{opacity:0},{opacity:1,duration:.8},"-=.8"),T};sessionStorage.getItem(e)!==null&&L();let I=function(g){if(!g||g.tagName!=="A")return!1;let T=g.hostname,N=g.target,M=g.getAttribute("href"),A=q(!0,g.getAttribute(a));return!(!T||T!==window.location.hostname||N&&N==="_blank"||!M||M.includes("#")||!A)};document.querySelectorAll("a").forEach(g=>{let T=g.getAttribute("href");I(g)&&g.addEventListener("click",function(M){M.preventDefault(),_(T)})}),window.onpageshow=function(g){g.persisted&&window.location.reload()}})(),function(){if(x.style.overflow="hidden",sessionStorage.getItem(e)===null)sessionStorage.setItem(e,"true"),W.style.display="none";else{o.style.display="none",W.style.display="flex";return}let L=gsap.timeline({paused:!0});L.set(o,{display:"flex"}),L.set(h,{display:"flex"}),L.set(y,{display:"flex"}),L.set(l,{opacity:1}),L.fromTo(l,{clipPath:"polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"},{clipPath:"polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",ease:"linear",duration:1});let _=gsap.timeline({paused:!0,delay:.1,onComplete:()=>Yt.play()});_.set(y,{display:"none"}),_.fromTo(h,{opacity:1},{opacity:0,duration:.4}),_.fromTo(C,{y:"100vh",scale:.8,borderRadius:"40vw 40vw 0vw 0vw"},{y:"0vh",scale:1,borderRadius:"0vw 0vw 0vw 0vw",ease:"power1.inOut",duration:1},"<"),_.fromTo(U,{opacity:0,y:"-50%"},{opacity:1,y:"0%",ease:"power2.out",duration:.4},"-=.4"),_.set(o,{display:"none"}),_.set("body",{overflow:"visible"});let I=performance.now(),g=new Vt.default("body",{background:!0},N),T=g.images.length;g.on("progress",function(M,A){var H=A.isLoaded?"loaded":"broken";let P=M.progressedCount/T;L.progress(P)});function N(){let M=performance.now(),A=800,H=M-I,P=Math.max(A-H,0);setTimeout(()=>{_.play()},P)}}()};Pe();document.addEventListener("DOMContentLoaded",function(){gsap.ScrollTrigger!==void 0&&gsap.registerPlugin(ScrollTrigger),gsap.Flip!==void 0&&gsap.registerPlugin(Flip);let e=new nt({lerp:.1,wheelMultiplier:.7,gestureOrientation:"vertical",normalizeWheel:!1,smoothTouch:!1});function t(o){e.raf(o),requestAnimationFrame(t)}requestAnimationFrame(t);function i(){let o=document.querySelectorAll("[scroll-to]");o!=null&&o.forEach(l=>{let h=l.getAttribute("scroll-to"),y=document.getElementById(h);!y||l.addEventListener("click",x=>{e.scrollTo(y,{duration:0})})})}i();function n(){let o=document.querySelectorAll("[data-lenis-stop]");o!=null&&o.forEach(l=>{l.addEventListener("click",h=>{e.stop()})})}n();function r(){let o=document.querySelectorAll("[data-lenis-start]");o!=null&&o.forEach(l=>{l.addEventListener("click",h=>{e.start()})})}r();function s(){let o=document.querySelectorAll("[data-lenis-toggle]");o!=null&&o.forEach(l=>{let h=!1;l.addEventListener("click",y=>{h=!h,h?e.stop():e.start()})})}s(),e.on("scroll",()=>{!ScrollTrigger||ScrollTrigger.update()}),gsap.ticker.add(o=>{e.raf(o*1e3)}),gsap.ticker.lagSmoothing(0),function(){let o=document.querySelectorAll(".image-container .high-res");o.length!==0&&o.forEach(l=>{let h=l.previousElementSibling,y=()=>{setTimeout(()=>{l.style.opacity=1,h.style.opacity=0},300)};l.complete&&l.naturalHeight!==0?y():l.onload=y})}(),function(){$(".nav-link, .nav-contact, .modal-trigger-button").hover(function(){let o=$(this).find(".button-text-move").eq(0).text();$(this).find(".button-text-move.is-second").text(o)}),$(".button").hover(function(){let o=$(this).find(".button-text-move").eq(0).text();$(this).find(".button-text-move.is-second").text(o)})}(),function(){let o=gsap.timeline({paused:!0});o.set(".contact-modal",{display:"block"}).from(".contact-modal_bg",{opacity:0,duration:.5},0).from(".contact-modal_card",{y:"10rem",scale:.9,opacity:0,duration:.5,ease:"power1.out"},0).addPause().to(".contact-modal_bg",{opacity:0,duration:.5},"+=0").to(".contact-modal_card",{y:"10rem",scale:.9,opacity:0,duration:.5,ease:"power1.in"},"-=0.5").set(".contact-modal",{display:"none"}),document.querySelectorAll("[data-contact-open]").forEach(l=>{l.addEventListener("click",()=>{e&&e.stop(),o.play(0)})}),document.querySelectorAll("[data-contact-close]").forEach(l=>{l.addEventListener("click",()=>{e&&e.start(),o.reverse()})})}();let m=function(o){let l="scrollin",h="data-scrollin",y="heading",x="subheading",C="item",U="container",W="stagger",v="rich-text",E="image-wrap",w="image",O="line",D="data-scrollin-start",L="data-scrollin-end",_="data-scrollin-stagger-x",I="data-scrollin-direction",g=function(u,b={}){let d={start:"top 90%",end:"top 60%"};return b.scrub!==!0?d.toggleActions="play none none none":d.scrub=!0,d.start=q(d.start,u.getAttribute(D)),d.end=q(d.end,u.getAttribute(L)),gsap.timeline({defaults:{duration:.6,ease:"power1.out"},scrollTrigger:{trigger:u,start:d.start,end:d.end,toggleActions:d.toggleActions,scrub:d.scrub}})},T=function(u,b,d={}){let k={opacity:0,y:"2rem"},B={opacity:1,y:"0rem"};return d.stagger===!0&&(B.stagger={each:.1,from:"start"}),b.fromTo(u,k,B)},N=function(u){let b=st(u,"lines, words, chars");if(!b)return;let d=g(u);d.fromTo(b.chars,{opacity:0},{opacity:1,ease:"power1.out",stagger:{amount:.4,from:"random"}}),d.eventCallback("onComplete",()=>{})},M=function(u){let b=st(u);if(!b)return;g(u,{scrub:!0}).fromTo(b.words,{opacity:.2},{opacity:1,ease:"power1.out",stagger:{each:.4}})},A=function(u){if(!u)return;let b=g(u),d=T(u,b)},H=function(u){let b="top",d,k=q(b,u.getAttribute(I)),B={left:"polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",right:"polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",top:"polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",bottom:"polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"};return k==="left"&&(d=B.left),k==="right"&&(d=B.right),k==="top"&&(d=B.top),k==="bottom"&&(d=B.bottom),d},P=function(u){if(!u)return;let b=H(u),d="polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";g(u).fromTo(u,{clipPath:b},{clipPath:d,duration:1})},V=function(u){if(!u)return;let b=H(u),d="polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";g(u).fromTo(u,{clipPath:b},{clipPath:d})},J=function(u){if(!u)return;let b=gsap.utils.toArray(u.children);b.length!==0&&b.forEach(d=>{let k=g(d),B=T(d,k)})},K=function(u){if(!u)return;let b=gsap.utils.toArray(u.children);if(b.length===0)return;let d=g(u),k=T(b,d,{stagger:!0})},Jt=function(u){if(!u)return;let b=gsap.utils.toArray(u.children);b.length!==0&&b.forEach(d=>{let k=d.tagName;["H1","H2","H3","H4","H5","H6"].includes(k)&&N(d),k==="FIGURE"?P(d):A(d)})};gsap.utils.toArray(`[${h}]`).forEach(u=>{if(!u||Xt(u,l,o)===!1)return;let d=u.getAttribute(h);d===y&&N(u),d===x&&M(u),d===C&&A(u),d===w&&P(u),d===O&&V(u),d===U&&J(u),d===W&&K(u),d===v&&Jt(u)})};(function(){gsap.matchMedia().add({isMobile:"(max-width: 767px)",isTablet:"(min-width: 768px)  and (max-width: 991px)",isDesktop:"(min-width: 992px)",reduceMotion:"(prefers-reduced-motion: reduce)"},l=>{let{isMobile:h,isTablet:y,isDesktop:x,reduceMotion:C}=l.conditions;!C&&x&&m(l)})})(),function(){let o="[data-ix-reset]",l="data-ix-reset-time";document.querySelectorAll(o).forEach(function(y){y.addEventListener("click",function(x){if(ScrollTrigger.refresh(),y.hasAttribute(l)){let C=q(1e3,y.getAttribute(l));setTimeout(()=>{ScrollTrigger.refresh()},C)}})})}()});})();
/*!
 * imagesLoaded v5.0.0
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */
