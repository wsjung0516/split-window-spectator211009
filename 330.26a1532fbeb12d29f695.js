(()=>{var y={52:n=>{function u(o,r,a,s,e,_,t){try{var c=o[_](t),p=c.value}catch(d){return void a(d)}c.done?r(p):Promise.resolve(p).then(s,e)}n.exports=function(o){return function(){var r=this,a=arguments;return new Promise(function(s,e){var _=o.apply(r,a);function t(p){u(_,s,e,t,c,"next",p)}function c(p){u(_,s,e,t,c,"throw",p)}t(void 0)})}},n.exports.default=n.exports,n.exports.__esModule=!0}},f={};function l(n){var u=f[n];if(void 0!==u)return u.exports;var i=f[n]={exports:{}};return y[n](i,i.exports,l),i.exports}(()=>{"use strict";var n=l(52).default;const u=o=>new Promise(function(a,s){if(XMLHttpRequest){let e=new XMLHttpRequest;e.timeout=5e3,e.onreadystatechange=function(){4==e.readyState?200==e.status?a(e.response):""!=e.responseText&&s({readyState:e.response,status:this.status}):2==e.readyState&&(e.responseType=200==e.status?"blob":"text")},e.open("GET",o,!0),e.send()}});function i(o){return new Promise(r=>setTimeout(r,o))}addEventListener("message",function(){var o=n(function*({data:r}){let a,s;const e=r.body;if(e)for(let t=0;t<e.length;t++){try{a=yield u(e[t].url),s={imageId:t,url:e[t].url,blob:a,category:r.category}}catch(c){s={url:e[t].url,blob:c}}postMessage(s,r.origin),yield i(50)}});return function(r){return o.apply(this,arguments)}}())})()})();