(()=>{"use strict";var e,b={4022:(e,n,t)=>{t.d(n,{U:()=>a});var p=t(4487);function a(u){return 0===u.length?p.y:1===u.length?u[0]:function(i){return u.reduce((f,_)=>_(f),i)}}},5452:(e,n,t)=>{var p=t(8239),s=t(8044),a=t(9412),u=t(8002),c=t(3190),i=t(4612);const f=y=>new Promise(function(v,l){if(XMLHttpRequest){let o=new XMLHttpRequest;o.timeout=5e3,o.onreadystatechange=function(){4==o.readyState?200==o.status?v(o.response):""!=o.responseText&&l({readyState:o.response,status:this.status}):2==o.readyState&&(o.responseType=200==o.status?"blob":"text")},o.open("GET",y+="?"+(new Date).getTime(),!0),o.send()}});(0,s.YX)(class{work(h){let v;return h.pipe((0,u.U)(l=>v=l),(0,c.w)(l=>(0,a.D)(l).pipe((0,i.b)(function(){var o=(0,p.Z)(function*(d){const w=d.url;return yield f(w)});return function(d){return o.apply(this,arguments)}}()),(0,u.U)((o,d)=>({seriesId:d,url:v[d].url,blob:o,category:v[d].category})))))}})}},m={};function r(e){var n=m[e];if(void 0!==n)return n.exports;var t=m[e]={exports:{}};return b[e](t,t.exports,r),t.exports}r.m=b,r.x=()=>{var e=r.O(void 0,[900,592],()=>r(5452));return r.O(e)},e=[],r.O=(n,t,p,s)=>{if(!t){var u=1/0;for(a=0;a<e.length;a++){for(var[t,p,s]=e[a],c=!0,i=0;i<t.length;i++)(!1&s||u>=s)&&Object.keys(r.O).every(l=>r.O[l](t[i]))?t.splice(i--,1):(c=!1,s<u&&(u=s));if(c){e.splice(a--,1);var f=p();void 0!==f&&(n=f)}}return n}s=s||0;for(var a=e.length;a>0&&e[a-1][2]>s;a--)e[a]=e[a-1];e[a]=[t,p,s]},r.d=(e,n)=>{for(var t in n)r.o(n,t)&&!r.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:n[t]})},r.f={},r.e=e=>Promise.all(Object.keys(r.f).reduce((n,t)=>(r.f[t](e,n),n),[])),r.u=e=>(592===e?"common":e)+"."+{592:"9c714172477762492100",900:"8681ca03ab7eea3f6bdc"}[e]+".js",r.miniCssF=e=>{},r.o=(e,n)=>Object.prototype.hasOwnProperty.call(e,n),(()=>{var e;r.tu=n=>(void 0===e&&(e={createScriptURL:t=>t},"undefined"!=typeof trustedTypes&&trustedTypes.createPolicy&&(e=trustedTypes.createPolicy("angular#bundler",e))),e.createScriptURL(n))})(),r.p="",(()=>{var e={480:1};r.f.i=(s,a)=>{e[s]||importScripts(r.tu(r.p+r.u(s)))};var t=self.webpackChunksplit_window_spectator211009=self.webpackChunksplit_window_spectator211009||[],p=t.push.bind(t);t.push=s=>{var[a,u,c]=s;for(var i in u)r.o(u,i)&&(r.m[i]=u[i]);for(c&&c(r);a.length;)e[a.pop()]=1;p(s)}})(),(()=>{var e=r.x;r.x=()=>Promise.all([r.e(900),r.e(592)]).then(e)})(),r.x()})();