(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{43:function(t,i,r){"use strict";function n(t,i,r,n){if(isNaN(i)||isNaN(r))return t;var e,s,h,o,a,u,l,_,f,c=t._root,x={data:n},y=t._x0,v=t._y0,d=t._x1,p=t._y1;if(!c)return t._root=x,t;for(;c.length;)if((u=i>=(s=(y+d)/2))?y=s:d=s,(l=r>=(h=(v+p)/2))?v=h:p=h,e=c,!(c=c[_=l<<1|u]))return e[_]=x,t;if(o=+t._x.call(null,c.data),a=+t._y.call(null,c.data),i===o&&r===a)return x.next=c,e?e[_]=x:t._root=x,t;do{e=e?e[_]=new Array(4):t._root=new Array(4),(u=i>=(s=(y+d)/2))?y=s:d=s,(l=r>=(h=(v+p)/2))?v=h:p=h}while((_=l<<1|u)==(f=(a>=h)<<1|o>=s));return e[f]=c,e[_]=x,t}var e=function(t,i,r,n,e){this.node=t,this.x0=i,this.y0=r,this.x1=n,this.y1=e};function s(t){return t[0]}function h(t){return t[1]}function o(t,i,r){var n=new a(null==i?s:i,null==r?h:r,NaN,NaN,NaN,NaN);return null==t?n:n.addAll(t)}function a(t,i,r,n,e,s){this._x=t,this._y=i,this._x0=r,this._y0=n,this._x1=e,this._y1=s,this._root=void 0}function u(t){for(var i={data:t.data},r=i;t=t.next;)r=r.next={data:t.data};return i}var l=o.prototype=a.prototype;l.copy=function(){var t,i,r=new a(this._x,this._y,this._x0,this._y0,this._x1,this._y1),n=this._root;if(!n)return r;if(!n.length)return r._root=u(n),r;for(t=[{source:n,target:r._root=new Array(4)}];n=t.pop();)for(var e=0;e<4;++e)(i=n.source[e])&&(i.length?t.push({source:i,target:n.target[e]=new Array(4)}):n.target[e]=u(i));return r},l.add=function(t){var i=+this._x.call(null,t),r=+this._y.call(null,t);return n(this.cover(i,r),i,r,t)},l.addAll=function(t){var i,r,e,s,h=t.length,o=new Array(h),a=new Array(h),u=1/0,l=1/0,_=-1/0,f=-1/0;for(r=0;r<h;++r)isNaN(e=+this._x.call(null,i=t[r]))||isNaN(s=+this._y.call(null,i))||(o[r]=e,a[r]=s,e<u&&(u=e),e>_&&(_=e),s<l&&(l=s),s>f&&(f=s));if(u>_||l>f)return this;for(this.cover(u,l).cover(_,f),r=0;r<h;++r)n(this,o[r],a[r],t[r]);return this},l.cover=function(t,i){if(isNaN(t=+t)||isNaN(i=+i))return this;var r=this._x0,n=this._y0,e=this._x1,s=this._y1;if(isNaN(r))e=(r=Math.floor(t))+1,s=(n=Math.floor(i))+1;else{for(var h,o,a=e-r,u=this._root;r>t||t>=e||n>i||i>=s;)switch(o=(i<n)<<1|t<r,(h=new Array(4))[o]=u,u=h,a*=2,o){case 0:e=r+a,s=n+a;break;case 1:r=e-a,s=n+a;break;case 2:e=r+a,n=s-a;break;case 3:r=e-a,n=s-a}this._root&&this._root.length&&(this._root=u)}return this._x0=r,this._y0=n,this._x1=e,this._y1=s,this},l.data=function(){var t=[];return this.visit(function(i){if(!i.length)do{t.push(i.data)}while(i=i.next)}),t},l.extent=function(t){return arguments.length?this.cover(+t[0][0],+t[0][1]).cover(+t[1][0],+t[1][1]):isNaN(this._x0)?void 0:[[this._x0,this._y0],[this._x1,this._y1]]},l.find=function(t,i,r){var n,s,h,o,a,u,l,_=this._x0,f=this._y0,c=this._x1,x=this._y1,y=[],v=this._root;for(v&&y.push(new e(v,_,f,c,x)),null==r?r=1/0:(_=t-r,f=i-r,c=t+r,x=i+r,r*=r);u=y.pop();)if(!(!(v=u.node)||(s=u.x0)>c||(h=u.y0)>x||(o=u.x1)<_||(a=u.y1)<f))if(v.length){var d=(s+o)/2,p=(h+a)/2;y.push(new e(v[3],d,p,o,a),new e(v[2],s,p,d,a),new e(v[1],d,h,o,p),new e(v[0],s,h,d,p)),(l=(i>=p)<<1|t>=d)&&(u=y[y.length-1],y[y.length-1]=y[y.length-1-l],y[y.length-1-l]=u)}else{var w=t-+this._x.call(null,v.data),N=i-+this._y.call(null,v.data),g=w*w+N*N;if(g<r){var A=Math.sqrt(r=g);_=t-A,f=i-A,c=t+A,x=i+A,n=v.data}}return n},l.remove=function(t){if(isNaN(s=+this._x.call(null,t))||isNaN(h=+this._y.call(null,t)))return this;var i,r,n,e,s,h,o,a,u,l,_,f,c=this._root,x=this._x0,y=this._y0,v=this._x1,d=this._y1;if(!c)return this;if(c.length)for(;;){if((u=s>=(o=(x+v)/2))?x=o:v=o,(l=h>=(a=(y+d)/2))?y=a:d=a,i=c,!(c=c[_=l<<1|u]))return this;if(!c.length)break;(i[_+1&3]||i[_+2&3]||i[_+3&3])&&(r=i,f=_)}for(;c.data!==t;)if(n=c,!(c=c.next))return this;return(e=c.next)&&delete c.next,n?(e?n.next=e:delete n.next,this):i?(e?i[_]=e:delete i[_],(c=i[0]||i[1]||i[2]||i[3])&&c===(i[3]||i[2]||i[1]||i[0])&&!c.length&&(r?r[f]=c:this._root=c),this):(this._root=e,this)},l.removeAll=function(t){for(var i=0,r=t.length;i<r;++i)this.remove(t[i]);return this},l.root=function(){return this._root},l.size=function(){var t=0;return this.visit(function(i){if(!i.length)do{++t}while(i=i.next)}),t},l.visit=function(t){var i,r,n,s,h,o,a=[],u=this._root;for(u&&a.push(new e(u,this._x0,this._y0,this._x1,this._y1));i=a.pop();)if(!t(u=i.node,n=i.x0,s=i.y0,h=i.x1,o=i.y1)&&u.length){var l=(n+h)/2,_=(s+o)/2;(r=u[3])&&a.push(new e(r,l,_,h,o)),(r=u[2])&&a.push(new e(r,n,_,l,o)),(r=u[1])&&a.push(new e(r,l,s,h,_)),(r=u[0])&&a.push(new e(r,n,s,l,_))}return this},l.visitAfter=function(t){var i,r=[],n=[];for(this._root&&r.push(new e(this._root,this._x0,this._y0,this._x1,this._y1));i=r.pop();){var s=i.node;if(s.length){var h,o=i.x0,a=i.y0,u=i.x1,l=i.y1,_=(o+u)/2,f=(a+l)/2;(h=s[0])&&r.push(new e(h,o,a,_,f)),(h=s[1])&&r.push(new e(h,_,a,u,f)),(h=s[2])&&r.push(new e(h,o,f,_,l)),(h=s[3])&&r.push(new e(h,_,f,u,l))}n.push(i)}for(;i=n.pop();)t(i.node,i.x0,i.y0,i.x1,i.y1);return this},l.x=function(t){return arguments.length?(this._x=t,this):this._x},l.y=function(t){return arguments.length?(this._y=t,this):this._y},r.d(i,"a",function(){return o})}}]);