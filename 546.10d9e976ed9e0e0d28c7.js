(()=>{"use strict";var s,m={4022:(s,u,i)=>{i.d(u,{U:()=>c});var v=i(4487);function c(o){return 0===o.length?v.y:1===o.length?o[0]:function(f){return o.reduce((b,p)=>p(b),f)}}},8511:(s,u,i)=>{var v=i(8239),l=i(8044),c=i(9412),o=i(826);class y extends o.w{constructor(e,t){super()}schedule(e,t=0){return this}}let b=(()=>{class h{constructor(t,r=h.now){this.SchedulerAction=t,this.now=r}schedule(t,r=0,a){return new this.SchedulerAction(this,t).schedule(a,r)}}return h.now=()=>Date.now(),h})();class p extends b{constructor(e,t=b.now){super(e,()=>p.delegate&&p.delegate!==this?p.delegate.now():t()),this.actions=[],this.active=!1,this.scheduled=void 0}schedule(e,t=0,r){return p.delegate&&p.delegate!==this?p.delegate.schedule(e,t,r):super.schedule(e,t,r)}flush(e){const{actions:t}=this;if(this.active)return void t.push(e);let r;this.active=!0;do{if(r=e.execute(e.state,e.delay))break}while(e=t.shift());if(this.active=!1,r){for(;e=t.shift();)e.unsubscribe();throw r}}}const _=new p(class extends y{constructor(e,t){super(e,t),this.scheduler=e,this.work=t,this.pending=!1}schedule(e,t=0){if(this.closed)return this;this.state=e;const r=this.id,a=this.scheduler;return null!=r&&(this.id=this.recycleAsyncId(a,r,t)),this.pending=!0,this.delay=t,this.id=this.id||this.requestAsyncId(a,this.id,t),this}requestAsyncId(e,t,r=0){return setInterval(e.flush.bind(e,this),r)}recycleAsyncId(e,t,r=0){if(null!==r&&this.delay===r&&!1===this.pending)return t;clearInterval(t)}execute(e,t){if(this.closed)return new Error("executing a cancelled action");this.pending=!1;const r=this._execute(e,t);if(r)return r;!1===this.pending&&null!=this.id&&(this.id=this.recycleAsyncId(this.scheduler,this.id,null))}_execute(e,t){let a,r=!1;try{this.work(e)}catch(d){r=!0,a=!!d&&d||new Error(d)}if(r)return this.unsubscribe(),a}_unsubscribe(){const e=this.id,t=this.scheduler,r=t.actions,a=r.indexOf(this);this.work=null,this.state=null,this.pending=!1,this.scheduler=null,-1!==a&&r.splice(a,1),null!=e&&(this.id=this.recycleAsyncId(t,e,null)),this.delay=null}});var w=i(7393),k=i(3098);class C{constructor(e,t){this.delay=e,this.scheduler=t}call(e,t){return t.subscribe(new g(e,this.delay,this.scheduler))}}class g extends w.L{constructor(e,t,r){super(e),this.delay=t,this.scheduler=r,this.queue=[],this.active=!1,this.errored=!1}static dispatch(e){const t=e.source,r=t.queue,a=e.scheduler,d=e.destination;for(;r.length>0&&r[0].time-a.now()<=0;)r.shift().notification.observe(d);if(r.length>0){const x=Math.max(0,r[0].time-a.now());this.schedule(e,x)}else this.unsubscribe(),t.active=!1}_schedule(e){this.active=!0,this.destination.add(e.schedule(g.dispatch,this.delay,{source:this,destination:this.destination,scheduler:e}))}scheduleNotification(e){if(!0===this.errored)return;const t=this.scheduler,r=new A(t.now()+this.delay,e);this.queue.push(r),!1===this.active&&this._schedule(t)}_next(e){this.scheduleNotification(k.P.createNext(e))}_error(e){this.errored=!0,this.queue=[],this.destination.error(e),this.unsubscribe()}_complete(){this.scheduleNotification(k.P.createComplete()),this.unsubscribe()}}class A{constructor(e,t){this.time=e,this.notification=t}}var D=i(8002),I=i(3190),N=i(4612),L=i(3810);(0,l.YX)(class{work(e){let t;return e.pipe((0,D.U)(r=>t=r),(0,I.w)(r=>(0,c.D)(r).pipe((0,N.b)(function(){var a=(0,v.Z)(function*(d){const x=d.url;return yield(0,L.O)(x)});return function(d){return a.apply(this,arguments)}}()),(0,D.U)((a,d)=>(console.log("--- axios --",a,d,t[d].category),{seriesId:d,url:t[d].url,blob:a.data,category:t[d].category})),function(h,e=_){const r=function(h){return h instanceof Date&&!isNaN(+h)}(h)?+h-e.now():Math.abs(h);return a=>a.lift(new C(r,e))}(400))))}})}},O={};function n(s){var u=O[s];if(void 0!==u)return u.exports;var i=O[s]={exports:{}};return m[s](i,i.exports,n),i.exports}n.m=m,n.x=()=>{var s=n.O(void 0,[810,900],()=>n(8511));return n.O(s)},s=[],n.O=(u,i,v,l)=>{if(!i){var o=1/0;for(c=0;c<s.length;c++){for(var[i,v,l]=s[c],y=!0,f=0;f<i.length;f++)(!1&l||o>=l)&&Object.keys(n.O).every(w=>n.O[w](i[f]))?i.splice(f--,1):(y=!1,l<o&&(o=l));if(y){s.splice(c--,1);var b=v();void 0!==b&&(u=b)}}return u}l=l||0;for(var c=s.length;c>0&&s[c-1][2]>l;c--)s[c]=s[c-1];s[c]=[i,v,l]},n.n=s=>{var u=s&&s.__esModule?()=>s.default:()=>s;return n.d(u,{a:u}),u},n.d=(s,u)=>{for(var i in u)n.o(u,i)&&!n.o(s,i)&&Object.defineProperty(s,i,{enumerable:!0,get:u[i]})},n.f={},n.e=s=>Promise.all(Object.keys(n.f).reduce((u,i)=>(n.f[i](s,u),u),[])),n.u=s=>s+"."+{810:"82e0de38a7067306d0ef",900:"8681ca03ab7eea3f6bdc"}[s]+".js",n.miniCssF=s=>{},n.o=(s,u)=>Object.prototype.hasOwnProperty.call(s,u),(()=>{var s;n.tu=u=>(void 0===s&&(s={createScriptURL:i=>i},"undefined"!=typeof trustedTypes&&trustedTypes.createPolicy&&(s=trustedTypes.createPolicy("angular#bundler",s))),s.createScriptURL(u))})(),n.p="",(()=>{var s={546:1};n.f.i=(l,c)=>{s[l]||importScripts(n.tu(n.p+n.u(l)))};var i=self.webpackChunksplit_window_spectator211009=self.webpackChunksplit_window_spectator211009||[],v=i.push.bind(i);i.push=l=>{var[c,o,y]=l;for(var f in o)n.o(o,f)&&(n.m[f]=o[f]);for(y&&y(n);c.length;)s[c.pop()]=1;v(l)}})(),(()=>{var s=n.x;n.x=()=>Promise.all([n.e(810),n.e(900)]).then(s)})(),n.x()})();