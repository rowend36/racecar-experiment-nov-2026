var gc=Object.defineProperty;var _c=(s,t,e)=>t in s?gc(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var T=(s,t,e)=>_c(s,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Pa="170",vc=0,io=1,xc=2,Cl=1,Rl=2,_n=3,Bn=0,Re=1,Ue=2,yn=0,Nn=1,Zi=2,so=3,ro=4,Mc=5,Kn=100,yc=101,Sc=102,Ec=103,wc=104,bc=200,Tc=201,Ac=202,Cc=203,kr=204,Gr=205,Rc=206,Pc=207,Lc=208,Dc=209,Ic=210,Uc=211,Nc=212,Fc=213,Bc=214,Hr=0,Vr=1,Wr=2,wi=3,Xr=4,qr=5,Yr=6,$r=7,Pl=0,Oc=1,zc=2,Sn=0,kc=1,Gc=2,Hc=3,Vc=4,Wc=5,Xc=6,qc=7,Ll=300,bi=301,Ti=302,Kr=303,Zr=304,js=306,Xs=1e3,De=1001,jr=1002,We=1003,Yc=1004,as=1005,on=1006,er=1007,Jn=1008,wn=1009,Dl=1010,Il=1011,ji=1012,La=1013,ti=1014,ln=1015,cn=1016,Da=1017,Ia=1018,Ai=1020,Ul=35902,Nl=1021,Fl=1022,nn=1023,Bl=1024,Ol=1025,Si=1026,Ci=1027,Ua=1028,Na=1029,zl=1030,Fa=1031,Ba=1033,zs=33776,ks=33777,Gs=33778,Hs=33779,Jr=35840,Qr=35841,ta=35842,ea=35843,na=36196,ia=37492,sa=37496,ra=37808,aa=37809,oa=37810,la=37811,ca=37812,ha=37813,ua=37814,da=37815,fa=37816,pa=37817,ma=37818,ga=37819,_a=37820,va=37821,Vs=36492,xa=36494,Ma=36495,kl=36283,ya=36284,Sa=36285,Ea=36286,$c=3200,Kc=3201,Gl=0,Zc=1,xn="",Ie="srgb",Li="srgb-linear",Js="linear",ne="srgb",ri=7680,ao=519,jc=512,Jc=513,Qc=514,Hl=515,th=516,eh=517,nh=518,ih=519,oo=35044,lo="300 es",Mn=2e3,qs=2001;class Di{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const i=this._listeners[t];if(i!==void 0){const r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,t);t.target=null}}}const Ee=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let co=1234567;const $i=Math.PI/180,Ji=180/Math.PI;function Ii(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ee[s&255]+Ee[s>>8&255]+Ee[s>>16&255]+Ee[s>>24&255]+"-"+Ee[t&255]+Ee[t>>8&255]+"-"+Ee[t>>16&15|64]+Ee[t>>24&255]+"-"+Ee[e&63|128]+Ee[e>>8&255]+"-"+Ee[e>>16&255]+Ee[e>>24&255]+Ee[n&255]+Ee[n>>8&255]+Ee[n>>16&255]+Ee[n>>24&255]).toLowerCase()}function Me(s,t,e){return Math.max(t,Math.min(e,s))}function Oa(s,t){return(s%t+t)%t}function sh(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function rh(s,t,e){return s!==t?(e-s)/(t-s):0}function Ki(s,t,e){return(1-e)*s+e*t}function ah(s,t,e,n){return Ki(s,t,1-Math.exp(-e*n))}function oh(s,t=1){return t-Math.abs(Oa(s,t*2)-t)}function lh(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function ch(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function hh(s,t){return s+Math.floor(Math.random()*(t-s+1))}function uh(s,t){return s+Math.random()*(t-s)}function dh(s){return s*(.5-Math.random())}function fh(s){s!==void 0&&(co=s);let t=co+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function ph(s){return s*$i}function mh(s){return s*Ji}function gh(s){return(s&s-1)===0&&s!==0}function _h(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function vh(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function xh(s,t,e,n,i){const r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+n)/2),h=a((t+n)/2),u=r((t-n)/2),d=a((t-n)/2),f=r((n-t)/2),g=a((n-t)/2);switch(i){case"XYX":s.set(o*h,l*u,l*d,o*c);break;case"YZY":s.set(l*d,o*h,l*u,o*c);break;case"ZXZ":s.set(l*u,l*d,o*h,o*c);break;case"XZX":s.set(o*h,l*g,l*f,o*c);break;case"YXY":s.set(l*f,o*h,l*g,o*c);break;case"ZYZ":s.set(l*g,l*f,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Mi(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Ae(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const Mh={DEG2RAD:$i,RAD2DEG:Ji,generateUUID:Ii,clamp:Me,euclideanModulo:Oa,mapLinear:sh,inverseLerp:rh,lerp:Ki,damp:ah,pingpong:oh,smoothstep:lh,smootherstep:ch,randInt:hh,randFloat:uh,randFloatSpread:dh,seededRandom:fh,degToRad:ph,radToDeg:mh,isPowerOfTwo:gh,ceilPowerOfTwo:_h,floorPowerOfTwo:vh,setQuaternionFromProperEuler:xh,normalize:Ae,denormalize:Mi};class Mt{constructor(t=0,e=0){Mt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Me(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*i+t.x,this.y=r*i+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ot{constructor(t,e,n,i,r,a,o,l,c){Ot.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,l,c)}set(t,e,n,i,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=i,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],_=i[0],m=i[3],p=i[6],y=i[1],S=i[4],x=i[7],D=i[2],C=i[5],b=i[8];return r[0]=a*_+o*y+l*D,r[3]=a*m+o*S+l*C,r[6]=a*p+o*x+l*b,r[1]=c*_+h*y+u*D,r[4]=c*m+h*S+u*C,r[7]=c*p+h*x+u*b,r[2]=d*_+f*y+g*D,r[5]=d*m+f*S+g*C,r[8]=d*p+f*x+g*b,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+i*r*c-i*a*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=h*a-o*c,d=o*l-h*r,f=c*r-a*l,g=e*u+n*d+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(i*c-h*n)*_,t[2]=(o*n-i*a)*_,t[3]=d*_,t[4]=(h*e-i*l)*_,t[5]=(i*r-o*e)*_,t[6]=f*_,t[7]=(n*l-c*e)*_,t[8]=(a*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-i*c,i*l,-i*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(nr.makeScale(t,e)),this}rotate(t){return this.premultiply(nr.makeRotation(-t)),this}translate(t,e){return this.premultiply(nr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const nr=new Ot;function Vl(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function Ys(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function yh(){const s=Ys("canvas");return s.style.display="block",s}const ho={};function qi(s){s in ho||(ho[s]=!0,console.warn(s))}function Sh(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function Eh(s){const t=s.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function wh(s){const t=s.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Kt={enabled:!0,workingColorSpace:Li,spaces:{},convert:function(s,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===ne&&(s.r=En(s.r),s.g=En(s.g),s.b=En(s.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(s.applyMatrix3(this.spaces[t].toXYZ),s.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===ne&&(s.r=Ei(s.r),s.g=Ei(s.g),s.b=Ei(s.b))),s},fromWorkingColorSpace:function(s,t){return this.convert(s,this.workingColorSpace,t)},toWorkingColorSpace:function(s,t){return this.convert(s,t,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===xn?Js:this.spaces[s].transfer},getLuminanceCoefficients:function(s,t=this.workingColorSpace){return s.fromArray(this.spaces[t].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,t,e){return s.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}};function En(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Ei(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}const uo=[.64,.33,.3,.6,.15,.06],fo=[.2126,.7152,.0722],po=[.3127,.329],mo=new Ot().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),go=new Ot().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Kt.define({[Li]:{primaries:uo,whitePoint:po,transfer:Js,toXYZ:mo,fromXYZ:go,luminanceCoefficients:fo,workingColorSpaceConfig:{unpackColorSpace:Ie},outputColorSpaceConfig:{drawingBufferColorSpace:Ie}},[Ie]:{primaries:uo,whitePoint:po,transfer:ne,toXYZ:mo,fromXYZ:go,luminanceCoefficients:fo,outputColorSpaceConfig:{drawingBufferColorSpace:Ie}}});let ai;class bh{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ai===void 0&&(ai=Ys("canvas")),ai.width=t.width,ai.height=t.height;const n=ai.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=ai}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Ys("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=En(r[a]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(En(e[n]/255)*255):e[n]=En(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Th=0;class Wl{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Th++}),this.uuid=Ii(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(ir(i[a].image)):r.push(ir(i[a]))}else r=ir(i);n.url=r}return e||(t.images[this.uuid]=n),n}}function ir(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?bh.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Ah=0;class Te extends Di{constructor(t=Te.DEFAULT_IMAGE,e=Te.DEFAULT_MAPPING,n=De,i=De,r=on,a=Jn,o=nn,l=wn,c=Te.DEFAULT_ANISOTROPY,h=xn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ah++}),this.uuid=Ii(),this.name="",this.source=new Wl(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Mt(0,0),this.repeat=new Mt(1,1),this.center=new Mt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ot,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Ll)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Xs:t.x=t.x-Math.floor(t.x);break;case De:t.x=t.x<0?0:1;break;case jr:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Xs:t.y=t.y-Math.floor(t.y);break;case De:t.y=t.y<0?0:1;break;case jr:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Te.DEFAULT_IMAGE=null;Te.DEFAULT_MAPPING=Ll;Te.DEFAULT_ANISOTROPY=1;class ie{constructor(t=0,e=0,n=0,i=1){ie.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*i+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r;const l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const S=(c+1)/2,x=(f+1)/2,D=(p+1)/2,C=(h+d)/4,b=(u+_)/4,R=(g+m)/4;return S>x&&S>D?S<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(S),i=C/n,r=b/n):x>D?x<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(x),n=C/i,r=R/i):D<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(D),n=b/r,i=R/r),this.set(n,i,r,e),this}let y=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(y)<.001&&(y=1),this.x=(m-g)/y,this.y=(u-_)/y,this.z=(d-h)/y,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Ch extends Di{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ie(0,0,t,e),this.scissorTest=!1,this.viewport=new ie(0,0,t,e);const i={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:on,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Te(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,i=t.textures.length;n<i;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Wl(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ke extends Ch{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Xl extends Te{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=We,this.minFilter=We,this.wrapR=De,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Rh extends Te{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=We,this.minFilter=We,this.wrapR=De,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class sn{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3];const d=r[a+0],f=r[a+1],g=r[a+2],_=r[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u;return}if(o===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=_;return}if(u!==_||l!==d||c!==f||h!==g){let m=1-o;const p=l*d+c*f+h*g+u*_,y=p>=0?1:-1,S=1-p*p;if(S>Number.EPSILON){const D=Math.sqrt(S),C=Math.atan2(D,p*y);m=Math.sin(m*C)/D,o=Math.sin(o*C)/D}const x=o*y;if(l=l*m+d*x,c=c*m+f*x,h=h*m+g*x,u=u*m+_*x,m===1-o){const D=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=D,c*=D,h*=D,u*=D}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,r,a){const o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=r[a],d=r[a+1],f=r[a+2],g=r[a+3];return t[e]=o*g+h*u+l*f-c*d,t[e+1]=l*g+h*d+c*u-o*f,t[e+2]=c*g+h*f+o*d-l*u,t[e+3]=h*g-o*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),u=o(r/2),d=l(n/2),f=l(i/2),g=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=n+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-i)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(r+c)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(r-c)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-i)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Me(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+i*c-r*l,this._y=i*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,r=this._z,a=this._w;let o=a*t._w+n*t._x+i*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=i,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const f=1-e;return this._w=f*a+e*this._w,this._x=f*n+e*this._x,this._y=f*i+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-e)*h)/c,d=Math.sin(e*h)/c;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(t=0,e=0,n=0){P.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(_o.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(_o.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*i-o*n),h=2*(o*e-r*i),u=2*(r*n-a*e);return this.x=e+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=i+l*u+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=i*l-r*o,this.y=r*a-n*l,this.z=n*o-i*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return sr.copy(this).projectOnVector(t),this.sub(sr)}reflect(t){return this.sub(sr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Me(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const sr=new P,_o=new sn;class ei{constructor(t=new P(1/0,1/0,1/0),e=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Je.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Je.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Je.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Je):Je.fromBufferAttribute(r,a),Je.applyMatrix4(t.matrixWorld),this.expandByPoint(Je);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),os.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),os.copy(n.boundingBox)),os.applyMatrix4(t.matrixWorld),this.union(os)}const i=t.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Je),Je.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Bi),ls.subVectors(this.max,Bi),oi.subVectors(t.a,Bi),li.subVectors(t.b,Bi),ci.subVectors(t.c,Bi),An.subVectors(li,oi),Cn.subVectors(ci,li),kn.subVectors(oi,ci);let e=[0,-An.z,An.y,0,-Cn.z,Cn.y,0,-kn.z,kn.y,An.z,0,-An.x,Cn.z,0,-Cn.x,kn.z,0,-kn.x,-An.y,An.x,0,-Cn.y,Cn.x,0,-kn.y,kn.x,0];return!rr(e,oi,li,ci,ls)||(e=[1,0,0,0,1,0,0,0,1],!rr(e,oi,li,ci,ls))?!1:(cs.crossVectors(An,Cn),e=[cs.x,cs.y,cs.z],rr(e,oi,li,ci,ls))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Je).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Je).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(dn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),dn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),dn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),dn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),dn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),dn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),dn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),dn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(dn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const dn=[new P,new P,new P,new P,new P,new P,new P,new P],Je=new P,os=new ei,oi=new P,li=new P,ci=new P,An=new P,Cn=new P,kn=new P,Bi=new P,ls=new P,cs=new P,Gn=new P;function rr(s,t,e,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){Gn.fromArray(s,r);const o=i.x*Math.abs(Gn.x)+i.y*Math.abs(Gn.y)+i.z*Math.abs(Gn.z),l=t.dot(Gn),c=e.dot(Gn),h=n.dot(Gn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Ph=new ei,Oi=new P,ar=new P;class ni{constructor(t=new P,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Ph.setFromPoints(t).getCenter(n);let i=0;for(let r=0,a=t.length;r<a;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Oi.subVectors(t,this.center);const e=Oi.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Oi,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ar.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Oi.copy(t.center).add(ar)),this.expandByPoint(Oi.copy(t.center).sub(ar))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const fn=new P,or=new P,hs=new P,Rn=new P,lr=new P,us=new P,cr=new P;class za{constructor(t=new P,e=new P(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,fn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=fn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(fn.copy(this.origin).addScaledVector(this.direction,e),fn.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){or.copy(t).add(e).multiplyScalar(.5),hs.copy(e).sub(t).normalize(),Rn.copy(this.origin).sub(or);const r=t.distanceTo(e)*.5,a=-this.direction.dot(hs),o=Rn.dot(this.direction),l=-Rn.dot(hs),c=Rn.lengthSq(),h=Math.abs(1-a*a);let u,d,f,g;if(h>0)if(u=a*l-o,d=a*o-l,g=r*h,u>=0)if(d>=-g)if(d<=g){const _=1/h;u*=_,d*=_,f=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(or).addScaledVector(hs,d),f}intersectSphere(t,e){fn.subVectors(t.center,this.origin);const n=fn.dot(this.direction),i=fn.dot(fn)-n*n,r=t.radius*t.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,i=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,i=(t.min.x-d.x)*c),h>=0?(r=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),u>=0?(o=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,fn)!==null}intersectTriangle(t,e,n,i,r){lr.subVectors(e,t),us.subVectors(n,t),cr.crossVectors(lr,us);let a=this.direction.dot(cr),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Rn.subVectors(this.origin,t);const l=o*this.direction.dot(us.crossVectors(Rn,us));if(l<0)return null;const c=o*this.direction.dot(lr.cross(Rn));if(c<0||l+c>a)return null;const h=-o*Rn.dot(cr);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class zt{constructor(t,e,n,i,r,a,o,l,c,h,u,d,f,g,_,m){zt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,l,c,h,u,d,f,g,_,m)}set(t,e,n,i,r,a,o,l,c,h,u,d,f,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=i,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new zt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/hi.setFromMatrixColumn(t,0).length(),r=1/hi.setFromMatrixColumn(t,1).length(),a=1/hi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=a*h,f=a*u,g=o*h,_=o*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+g*c,e[5]=d-_*c,e[9]=-o*l,e[2]=_-d*c,e[6]=g+f*c,e[10]=a*l}else if(t.order==="YXZ"){const d=l*h,f=l*u,g=c*h,_=c*u;e[0]=d+_*o,e[4]=g*o-f,e[8]=a*c,e[1]=a*u,e[5]=a*h,e[9]=-o,e[2]=f*o-g,e[6]=_+d*o,e[10]=a*l}else if(t.order==="ZXY"){const d=l*h,f=l*u,g=c*h,_=c*u;e[0]=d-_*o,e[4]=-a*u,e[8]=g+f*o,e[1]=f+g*o,e[5]=a*h,e[9]=_-d*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const d=a*h,f=a*u,g=o*h,_=o*u;e[0]=l*h,e[4]=g*c-f,e[8]=d*c+_,e[1]=l*u,e[5]=_*c+d,e[9]=f*c-g,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const d=a*l,f=a*c,g=o*l,_=o*c;e[0]=l*h,e[4]=_-d*u,e[8]=g*u+f,e[1]=u,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=f*u+g,e[10]=d-_*u}else if(t.order==="XZY"){const d=a*l,f=a*c,g=o*l,_=o*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+_,e[5]=a*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=o*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Lh,t,Dh)}lookAt(t,e,n){const i=this.elements;return Oe.subVectors(t,e),Oe.lengthSq()===0&&(Oe.z=1),Oe.normalize(),Pn.crossVectors(n,Oe),Pn.lengthSq()===0&&(Math.abs(n.z)===1?Oe.x+=1e-4:Oe.z+=1e-4,Oe.normalize(),Pn.crossVectors(n,Oe)),Pn.normalize(),ds.crossVectors(Oe,Pn),i[0]=Pn.x,i[4]=ds.x,i[8]=Oe.x,i[1]=Pn.y,i[5]=ds.y,i[9]=Oe.y,i[2]=Pn.z,i[6]=ds.z,i[10]=Oe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],y=n[3],S=n[7],x=n[11],D=n[15],C=i[0],b=i[4],R=i[8],E=i[12],v=i[1],L=i[5],U=i[9],O=i[13],X=i[2],q=i[6],V=i[10],$=i[14],H=i[3],nt=i[7],it=i[11],lt=i[15];return r[0]=a*C+o*v+l*X+c*H,r[4]=a*b+o*L+l*q+c*nt,r[8]=a*R+o*U+l*V+c*it,r[12]=a*E+o*O+l*$+c*lt,r[1]=h*C+u*v+d*X+f*H,r[5]=h*b+u*L+d*q+f*nt,r[9]=h*R+u*U+d*V+f*it,r[13]=h*E+u*O+d*$+f*lt,r[2]=g*C+_*v+m*X+p*H,r[6]=g*b+_*L+m*q+p*nt,r[10]=g*R+_*U+m*V+p*it,r[14]=g*E+_*O+m*$+p*lt,r[3]=y*C+S*v+x*X+D*H,r[7]=y*b+S*L+x*q+D*nt,r[11]=y*R+S*U+x*V+D*it,r[15]=y*E+S*O+x*$+D*lt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+r*l*u-i*c*u-r*o*d+n*c*d+i*o*f-n*l*f)+_*(+e*l*f-e*c*d+r*a*d-i*a*f+i*c*h-r*l*h)+m*(+e*c*u-e*o*f-r*a*u+n*a*f+r*o*h-n*c*h)+p*(-i*o*h-e*l*u+e*o*d+i*a*u-n*a*d+n*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],_=t[13],m=t[14],p=t[15],y=u*m*c-_*d*c+_*l*f-o*m*f-u*l*p+o*d*p,S=g*d*c-h*m*c-g*l*f+a*m*f+h*l*p-a*d*p,x=h*_*c-g*u*c+g*o*f-a*_*f-h*o*p+a*u*p,D=g*u*l-h*_*l-g*o*d+a*_*d+h*o*m-a*u*m,C=e*y+n*S+i*x+r*D;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const b=1/C;return t[0]=y*b,t[1]=(_*d*r-u*m*r-_*i*f+n*m*f+u*i*p-n*d*p)*b,t[2]=(o*m*r-_*l*r+_*i*c-n*m*c-o*i*p+n*l*p)*b,t[3]=(u*l*r-o*d*r-u*i*c+n*d*c+o*i*f-n*l*f)*b,t[4]=S*b,t[5]=(h*m*r-g*d*r+g*i*f-e*m*f-h*i*p+e*d*p)*b,t[6]=(g*l*r-a*m*r-g*i*c+e*m*c+a*i*p-e*l*p)*b,t[7]=(a*d*r-h*l*r+h*i*c-e*d*c-a*i*f+e*l*f)*b,t[8]=x*b,t[9]=(g*u*r-h*_*r-g*n*f+e*_*f+h*n*p-e*u*p)*b,t[10]=(a*_*r-g*o*r+g*n*c-e*_*c-a*n*p+e*o*p)*b,t[11]=(h*o*r-a*u*r-h*n*c+e*u*c+a*n*f-e*o*f)*b,t[12]=D*b,t[13]=(h*_*i-g*u*i+g*n*d-e*_*d-h*n*m+e*u*m)*b,t[14]=(g*o*i-a*_*i-g*n*l+e*_*l+a*n*m-e*o*m)*b,t[15]=(a*u*i-h*o*i+h*n*l-e*u*l-a*n*d+e*o*d)*b,this}scale(t){const e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,a){return this.set(1,n,r,0,t,1,a,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,u=o+o,d=r*c,f=r*h,g=r*u,_=a*h,m=a*u,p=o*u,y=l*c,S=l*h,x=l*u,D=n.x,C=n.y,b=n.z;return i[0]=(1-(_+p))*D,i[1]=(f+x)*D,i[2]=(g-S)*D,i[3]=0,i[4]=(f-x)*C,i[5]=(1-(d+p))*C,i[6]=(m+y)*C,i[7]=0,i[8]=(g+S)*b,i[9]=(m-y)*b,i[10]=(1-(d+_))*b,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let r=hi.set(i[0],i[1],i[2]).length();const a=hi.set(i[4],i[5],i[6]).length(),o=hi.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),t.x=i[12],t.y=i[13],t.z=i[14],Qe.copy(this);const c=1/r,h=1/a,u=1/o;return Qe.elements[0]*=c,Qe.elements[1]*=c,Qe.elements[2]*=c,Qe.elements[4]*=h,Qe.elements[5]*=h,Qe.elements[6]*=h,Qe.elements[8]*=u,Qe.elements[9]*=u,Qe.elements[10]*=u,e.setFromRotationMatrix(Qe),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,i,r,a,o=Mn){const l=this.elements,c=2*r/(e-t),h=2*r/(n-i),u=(e+t)/(e-t),d=(n+i)/(n-i);let f,g;if(o===Mn)f=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===qs)f=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,i,r,a,o=Mn){const l=this.elements,c=1/(e-t),h=1/(n-i),u=1/(a-r),d=(e+t)*c,f=(n+i)*h;let g,_;if(o===Mn)g=(a+r)*u,_=-2*u;else if(o===qs)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const hi=new P,Qe=new zt,Lh=new P(0,0,0),Dh=new P(1,1,1),Pn=new P,ds=new P,Oe=new P,vo=new zt,xo=new sn;class Ne{constructor(t=0,e=0,n=0,i=Ne.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,r=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(Me(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Me(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Me(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Me(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Me(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Me(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return vo.makeRotationFromQuaternion(t),this.setFromRotationMatrix(vo,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return xo.setFromEuler(this),this.setFromQuaternion(xo,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ne.DEFAULT_ORDER="XYZ";class ql{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Ih=0;const Mo=new P,ui=new sn,pn=new zt,fs=new P,zi=new P,Uh=new P,Nh=new sn,yo=new P(1,0,0),So=new P(0,1,0),Eo=new P(0,0,1),wo={type:"added"},Fh={type:"removed"},di={type:"childadded",child:null},hr={type:"childremoved",child:null};class ge extends Di{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ih++}),this.uuid=Ii(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ge.DEFAULT_UP.clone();const t=new P,e=new Ne,n=new sn,i=new P(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new zt},normalMatrix:{value:new Ot}}),this.matrix=new zt,this.matrixWorld=new zt,this.matrixAutoUpdate=ge.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ge.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ql,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ui.setFromAxisAngle(t,e),this.quaternion.multiply(ui),this}rotateOnWorldAxis(t,e){return ui.setFromAxisAngle(t,e),this.quaternion.premultiply(ui),this}rotateX(t){return this.rotateOnAxis(yo,t)}rotateY(t){return this.rotateOnAxis(So,t)}rotateZ(t){return this.rotateOnAxis(Eo,t)}translateOnAxis(t,e){return Mo.copy(t).applyQuaternion(this.quaternion),this.position.add(Mo.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(yo,t)}translateY(t){return this.translateOnAxis(So,t)}translateZ(t){return this.translateOnAxis(Eo,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(pn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?fs.copy(t):fs.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),zi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?pn.lookAt(zi,fs,this.up):pn.lookAt(fs,zi,this.up),this.quaternion.setFromRotationMatrix(pn),i&&(pn.extractRotation(i.matrixWorld),ui.setFromRotationMatrix(pn),this.quaternion.premultiply(ui.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(wo),di.child=t,this.dispatchEvent(di),di.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Fh),hr.child=t,this.dispatchEvent(hr),hr.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),pn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),pn.multiply(t.parent.matrixWorld)),t.applyMatrix4(pn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(wo),di.child=t,this.dispatchEvent(di),di.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zi,t,Uh),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zi,Nh,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(t.shapes,u)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));i.material=o}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),f=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}ge.DEFAULT_UP=new P(0,1,0);ge.DEFAULT_MATRIX_AUTO_UPDATE=!0;ge.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const tn=new P,mn=new P,ur=new P,gn=new P,fi=new P,pi=new P,bo=new P,dr=new P,fr=new P,pr=new P,mr=new ie,gr=new ie,_r=new ie;class en{constructor(t=new P,e=new P,n=new P){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),tn.subVectors(t,e),i.cross(tn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){tn.subVectors(i,e),mn.subVectors(n,e),ur.subVectors(t,e);const a=tn.dot(tn),o=tn.dot(mn),l=tn.dot(ur),c=mn.dot(mn),h=mn.dot(ur),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(c*l-o*h)*d,g=(a*h-o*l)*d;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,gn)===null?!1:gn.x>=0&&gn.y>=0&&gn.x+gn.y<=1}static getInterpolation(t,e,n,i,r,a,o,l){return this.getBarycoord(t,e,n,i,gn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,gn.x),l.addScaledVector(a,gn.y),l.addScaledVector(o,gn.z),l)}static getInterpolatedAttribute(t,e,n,i,r,a){return mr.setScalar(0),gr.setScalar(0),_r.setScalar(0),mr.fromBufferAttribute(t,e),gr.fromBufferAttribute(t,n),_r.fromBufferAttribute(t,i),a.setScalar(0),a.addScaledVector(mr,r.x),a.addScaledVector(gr,r.y),a.addScaledVector(_r,r.z),a}static isFrontFacing(t,e,n,i){return tn.subVectors(n,e),mn.subVectors(t,e),tn.cross(mn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return tn.subVectors(this.c,this.b),mn.subVectors(this.a,this.b),tn.cross(mn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return en.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return en.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return en.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return en.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return en.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,r=this.c;let a,o;fi.subVectors(i,n),pi.subVectors(r,n),dr.subVectors(t,n);const l=fi.dot(dr),c=pi.dot(dr);if(l<=0&&c<=0)return e.copy(n);fr.subVectors(t,i);const h=fi.dot(fr),u=pi.dot(fr);if(h>=0&&u<=h)return e.copy(i);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(fi,a);pr.subVectors(t,r);const f=fi.dot(pr),g=pi.dot(pr);if(g>=0&&f<=g)return e.copy(r);const _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),e.copy(n).addScaledVector(pi,o);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return bo.subVectors(r,i),o=(u-h)/(u-h+(f-g)),e.copy(i).addScaledVector(bo,o);const p=1/(m+_+d);return a=_*p,o=d*p,e.copy(n).addScaledVector(fi,a).addScaledVector(pi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Yl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ln={h:0,s:0,l:0},ps={h:0,s:0,l:0};function vr(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class bt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ie){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Kt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=Kt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Kt.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=Kt.workingColorSpace){if(t=Oa(t,1),e=Me(e,0,1),n=Me(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=vr(a,r,t+1/3),this.g=vr(a,r,t),this.b=vr(a,r,t-1/3)}return Kt.toWorkingColorSpace(this,i),this}setStyle(t,e=Ie){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ie){const n=Yl[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=En(t.r),this.g=En(t.g),this.b=En(t.b),this}copyLinearToSRGB(t){return this.r=Ei(t.r),this.g=Ei(t.g),this.b=Ei(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ie){return Kt.fromWorkingColorSpace(we.copy(this),t),Math.round(Me(we.r*255,0,255))*65536+Math.round(Me(we.g*255,0,255))*256+Math.round(Me(we.b*255,0,255))}getHexString(t=Ie){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Kt.workingColorSpace){Kt.fromWorkingColorSpace(we.copy(this),e);const n=we.r,i=we.g,r=we.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(i-r)/u+(i<r?6:0);break;case i:l=(r-n)/u+2;break;case r:l=(n-i)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Kt.workingColorSpace){return Kt.fromWorkingColorSpace(we.copy(this),e),t.r=we.r,t.g=we.g,t.b=we.b,t}getStyle(t=Ie){Kt.fromWorkingColorSpace(we.copy(this),t);const e=we.r,n=we.g,i=we.b;return t!==Ie?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Ln),this.setHSL(Ln.h+t,Ln.s+e,Ln.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Ln),t.getHSL(ps);const n=Ki(Ln.h,ps.h,e),i=Ki(Ln.s,ps.s,e),r=Ki(Ln.l,ps.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const we=new bt;bt.NAMES=Yl;let Bh=0;class ii extends Di{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Bh++}),this.uuid=Ii(),this.name="",this.blending=Nn,this.side=Bn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=kr,this.blendDst=Gr,this.blendEquation=Kn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new bt(0,0,0),this.blendAlpha=0,this.depthFunc=wi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ao,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ri,this.stencilZFail=ri,this.stencilZPass=ri,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Nn&&(n.blending=this.blending),this.side!==Bn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==kr&&(n.blendSrc=this.blendSrc),this.blendDst!==Gr&&(n.blendDst=this.blendDst),this.blendEquation!==Kn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==wi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ao&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ri&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ri&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ri&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=i(t.textures),a=i(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Qi extends ii{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ne,this.combine=Pl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const me=new P,ms=new Mt;class se{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=oo,this.updateRanges=[],this.gpuType=ln,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ms.fromBufferAttribute(this,e),ms.applyMatrix3(t),this.setXY(e,ms.x,ms.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyMatrix3(t),this.setXYZ(e,me.x,me.y,me.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyMatrix4(t),this.setXYZ(e,me.x,me.y,me.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.applyNormalMatrix(t),this.setXYZ(e,me.x,me.y,me.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)me.fromBufferAttribute(this,e),me.transformDirection(t),this.setXYZ(e,me.x,me.y,me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Mi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ae(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Mi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ae(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Mi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ae(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Mi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ae(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Mi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ae(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ae(e,this.array),n=Ae(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Ae(e,this.array),n=Ae(n,this.array),i=Ae(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=Ae(e,this.array),n=Ae(n,this.array),i=Ae(i,this.array),r=Ae(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==oo&&(t.usage=this.usage),t}}class $l extends se{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Kl extends se{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class re extends se{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Oh=0;const qe=new zt,xr=new ge,mi=new P,ze=new ei,ki=new ei,xe=new P;class de extends Di{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Oh++}),this.uuid=Ii(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Vl(t)?Kl:$l)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ot().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return qe.makeRotationFromQuaternion(t),this.applyMatrix4(qe),this}rotateX(t){return qe.makeRotationX(t),this.applyMatrix4(qe),this}rotateY(t){return qe.makeRotationY(t),this.applyMatrix4(qe),this}rotateZ(t){return qe.makeRotationZ(t),this.applyMatrix4(qe),this}translate(t,e,n){return qe.makeTranslation(t,e,n),this.applyMatrix4(qe),this}scale(t,e,n){return qe.makeScale(t,e,n),this.applyMatrix4(qe),this}lookAt(t){return xr.lookAt(t),xr.updateMatrix(),this.applyMatrix4(xr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(mi).negate(),this.translate(mi.x,mi.y,mi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let i=0,r=t.length;i<r;i++){const a=t[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new re(n,3))}else{for(let n=0,i=e.count;n<i;n++){const r=t[n];e.setXYZ(n,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ei);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const r=e[n];ze.setFromBufferAttribute(r),this.morphTargetsRelative?(xe.addVectors(this.boundingBox.min,ze.min),this.boundingBox.expandByPoint(xe),xe.addVectors(this.boundingBox.max,ze.max),this.boundingBox.expandByPoint(xe)):(this.boundingBox.expandByPoint(ze.min),this.boundingBox.expandByPoint(ze.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ni);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(t){const n=this.boundingSphere.center;if(ze.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];ki.setFromBufferAttribute(o),this.morphTargetsRelative?(xe.addVectors(ze.min,ki.min),ze.expandByPoint(xe),xe.addVectors(ze.max,ki.max),ze.expandByPoint(xe)):(ze.expandByPoint(ki.min),ze.expandByPoint(ki.max))}ze.getCenter(n);let i=0;for(let r=0,a=t.count;r<a;r++)xe.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(xe));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)xe.fromBufferAttribute(o,c),l&&(mi.fromBufferAttribute(t,c),xe.add(mi)),i=Math.max(i,n.distanceToSquared(xe))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,i=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new se(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let R=0;R<n.count;R++)o[R]=new P,l[R]=new P;const c=new P,h=new P,u=new P,d=new Mt,f=new Mt,g=new Mt,_=new P,m=new P;function p(R,E,v){c.fromBufferAttribute(n,R),h.fromBufferAttribute(n,E),u.fromBufferAttribute(n,v),d.fromBufferAttribute(r,R),f.fromBufferAttribute(r,E),g.fromBufferAttribute(r,v),h.sub(c),u.sub(c),f.sub(d),g.sub(d);const L=1/(f.x*g.y-g.x*f.y);isFinite(L)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(L),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(L),o[R].add(_),o[E].add(_),o[v].add(_),l[R].add(m),l[E].add(m),l[v].add(m))}let y=this.groups;y.length===0&&(y=[{start:0,count:t.count}]);for(let R=0,E=y.length;R<E;++R){const v=y[R],L=v.start,U=v.count;for(let O=L,X=L+U;O<X;O+=3)p(t.getX(O+0),t.getX(O+1),t.getX(O+2))}const S=new P,x=new P,D=new P,C=new P;function b(R){D.fromBufferAttribute(i,R),C.copy(D);const E=o[R];S.copy(E),S.sub(D.multiplyScalar(D.dot(E))).normalize(),x.crossVectors(C,E);const L=x.dot(l[R])<0?-1:1;a.setXYZW(R,S.x,S.y,S.z,L)}for(let R=0,E=y.length;R<E;++R){const v=y[R],L=v.start,U=v.count;for(let O=L,X=L+U;O<X;O+=3)b(t.getX(O+0)),b(t.getX(O+1)),b(t.getX(O+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new se(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new P,r=new P,a=new P,o=new P,l=new P,c=new P,h=new P,u=new P;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);i.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)i.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)xe.fromBufferAttribute(t,e),xe.normalize(),t.setXYZ(e,xe.x,xe.y,xe.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h);let f=0,g=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?f=l[_]*o.data.stride+o.offset:f=l[_]*h;for(let p=0;p<h;p++)d[g++]=c[f++]}return new se(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new de,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=t(d,n);l.push(f)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(i[l]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const i=t.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const To=new zt,Hn=new za,gs=new ni,Ao=new P,_s=new P,vs=new P,xs=new P,Mr=new P,Ms=new P,Co=new P,ys=new P;class Ut extends ge{constructor(t=new de,e=new Qi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const o=this.morphTargetInfluences;if(r&&o){Ms.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(Mr.fromBufferAttribute(u,t),a?Ms.addScaledVector(Mr,h):Ms.addScaledVector(Mr.sub(e),h))}e.add(Ms)}return e}raycast(t,e){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),gs.copy(n.boundingSphere),gs.applyMatrix4(r),Hn.copy(t.ray).recast(t.near),!(gs.containsPoint(Hn.origin)===!1&&(Hn.intersectSphere(gs,Ao)===null||Hn.origin.distanceToSquared(Ao)>(t.far-t.near)**2))&&(To.copy(r).invert(),Hn.copy(t.ray).applyMatrix4(To),!(n.boundingBox!==null&&Hn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Hn)))}_computeIntersections(t,e,n){let i;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=a[m.materialIndex],y=Math.max(m.start,f.start),S=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let x=y,D=S;x<D;x+=3){const C=o.getX(x),b=o.getX(x+1),R=o.getX(x+2);i=Ss(this,p,t,n,c,h,u,C,b,R),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const g=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const y=o.getX(m),S=o.getX(m+1),x=o.getX(m+2);i=Ss(this,a,t,n,c,h,u,y,S,x),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=a[m.materialIndex],y=Math.max(m.start,f.start),S=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let x=y,D=S;x<D;x+=3){const C=x,b=x+1,R=x+2;i=Ss(this,p,t,n,c,h,u,C,b,R),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{const g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const y=m,S=m+1,x=m+2;i=Ss(this,a,t,n,c,h,u,y,S,x),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}}function zh(s,t,e,n,i,r,a,o){let l;if(t.side===Re?l=n.intersectTriangle(a,r,i,!0,o):l=n.intersectTriangle(i,r,a,t.side===Bn,o),l===null)return null;ys.copy(o),ys.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(ys);return c<e.near||c>e.far?null:{distance:c,point:ys.clone(),object:s}}function Ss(s,t,e,n,i,r,a,o,l,c){s.getVertexPosition(o,_s),s.getVertexPosition(l,vs),s.getVertexPosition(c,xs);const h=zh(s,t,e,n,_s,vs,xs,Co);if(h){const u=new P;en.getBarycoord(Co,_s,vs,xs,u),i&&(h.uv=en.getInterpolatedAttribute(i,o,l,c,u,new Mt)),r&&(h.uv1=en.getInterpolatedAttribute(r,o,l,c,u,new Mt)),a&&(h.normal=en.getInterpolatedAttribute(a,o,l,c,u,new P),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new P,materialIndex:0};en.getNormal(_s,vs,xs,d.normal),h.face=d,h.barycoord=u}return h}class Ct extends de{constructor(t=1,e=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,i,a,2),g("x","z","y",1,-1,t,n,-e,i,a,3),g("x","y","z",1,-1,t,e,n,i,r,4),g("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new re(c,3)),this.setAttribute("normal",new re(h,3)),this.setAttribute("uv",new re(u,2));function g(_,m,p,y,S,x,D,C,b,R,E){const v=x/b,L=D/R,U=x/2,O=D/2,X=C/2,q=b+1,V=R+1;let $=0,H=0;const nt=new P;for(let it=0;it<V;it++){const lt=it*L-O;for(let Rt=0;Rt<q;Rt++){const Wt=Rt*v-U;nt[_]=Wt*y,nt[m]=lt*S,nt[p]=X,c.push(nt.x,nt.y,nt.z),nt[_]=0,nt[m]=0,nt[p]=C>0?1:-1,h.push(nt.x,nt.y,nt.z),u.push(Rt/b),u.push(1-it/R),$+=1}}for(let it=0;it<R;it++)for(let lt=0;lt<b;lt++){const Rt=d+lt+q*it,Wt=d+lt+q*(it+1),Y=d+(lt+1)+q*(it+1),Q=d+(lt+1)+q*it;l.push(Rt,Wt,Q),l.push(Wt,Y,Q),H+=6}o.addGroup(f,H,E),f+=H,d+=$}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ct(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Ri(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function Ce(s){const t={};for(let e=0;e<s.length;e++){const n=Ri(s[e]);for(const i in n)t[i]=n[i]}return t}function kh(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function Zl(s){const t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Kt.workingColorSpace}const $s={clone:Ri,merge:Ce};var Gh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Hh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ye extends ii{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Gh,this.fragmentShader=Hh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ri(t.uniforms),this.uniformsGroups=kh(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?e.uniforms[i]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[i]={type:"m4",value:a.toArray()}:e.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class jl extends ge{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new zt,this.projectionMatrix=new zt,this.projectionMatrixInverse=new zt,this.coordinateSystem=Mn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Dn=new P,Ro=new Mt,Po=new Mt;class He extends jl{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ji*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan($i*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ji*2*Math.atan(Math.tan($i*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Dn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Dn.x,Dn.y).multiplyScalar(-t/Dn.z),Dn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Dn.x,Dn.y).multiplyScalar(-t/Dn.z)}getViewSize(t,e){return this.getViewBounds(t,Ro,Po),e.subVectors(Po,Ro)}setViewOffset(t,e,n,i,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan($i*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*i/l,e-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const gi=-90,_i=1;class Vh extends ge{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new He(gi,_i,t,e);i.layers=this.layers,this.add(i);const r=new He(gi,_i,t,e);r.layers=this.layers,this.add(r);const a=new He(gi,_i,t,e);a.layers=this.layers,this.add(a);const o=new He(gi,_i,t,e);o.layers=this.layers,this.add(o);const l=new He(gi,_i,t,e);l.layers=this.layers,this.add(l);const c=new He(gi,_i,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===Mn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===qs)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,r),t.setRenderTarget(n,1,i),t.render(e,a),t.setRenderTarget(n,2,i),t.render(e,o),t.setRenderTarget(n,3,i),t.render(e,l),t.setRenderTarget(n,4,i),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Jl extends Te{constructor(t,e,n,i,r,a,o,l,c,h){t=t!==void 0?t:[],e=e!==void 0?e:bi,super(t,e,n,i,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Wh extends Ke{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new Jl(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:on}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Ct(5,5,5),r=new ye({name:"CubemapFromEquirect",uniforms:Ri(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Re,blending:yn});r.uniforms.tEquirect.value=e;const a=new Ut(i,r),o=e.minFilter;return e.minFilter===Jn&&(e.minFilter=on),new Vh(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,i){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,i);t.setRenderTarget(r)}}const yr=new P,Xh=new P,qh=new Ot;class Yn{constructor(t=new P(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=yr.subVectors(n,e).cross(Xh.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(yr),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||qh.getNormalMatrix(t),i=this.coplanarPoint(yr).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Vn=new ni,Es=new P;class ka{constructor(t=new Yn,e=new Yn,n=new Yn,i=new Yn,r=new Yn,a=new Yn){this.planes=[t,e,n,i,r,a]}set(t,e,n,i,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Mn){const n=this.planes,i=t.elements,r=i[0],a=i[1],o=i[2],l=i[3],c=i[4],h=i[5],u=i[6],d=i[7],f=i[8],g=i[9],_=i[10],m=i[11],p=i[12],y=i[13],S=i[14],x=i[15];if(n[0].setComponents(l-r,d-c,m-f,x-p).normalize(),n[1].setComponents(l+r,d+c,m+f,x+p).normalize(),n[2].setComponents(l+a,d+h,m+g,x+y).normalize(),n[3].setComponents(l-a,d-h,m-g,x-y).normalize(),n[4].setComponents(l-o,d-u,m-_,x-S).normalize(),e===Mn)n[5].setComponents(l+o,d+u,m+_,x+S).normalize();else if(e===qs)n[5].setComponents(o,u,_,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Vn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Vn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Vn)}intersectsSprite(t){return Vn.center.set(0,0,0),Vn.radius=.7071067811865476,Vn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Vn)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(Es.x=i.normal.x>0?t.max.x:t.min.x,Es.y=i.normal.y>0?t.max.y:t.min.y,Es.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Es)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Ql(){let s=null,t=!1,e=null,n=null;function i(r,a){e(r,a),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function Yh(s){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,u=c.byteLength,d=s.createBuffer();s.bindBuffer(l,d),s.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const h=l.array,u=l.updateRanges;if(s.bindBuffer(c,o),u.length===0)s.bufferSubData(c,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){const g=u[d],_=u[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){const _=u[f];s.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(s.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:r,update:a}}class Ve extends de{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,u=t/o,d=e/l,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){const y=p*d-a;for(let S=0;S<c;S++){const x=S*u-r;g.push(x,-y,0),_.push(0,0,1),m.push(S/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let y=0;y<o;y++){const S=y+c*p,x=y+c*(p+1),D=y+1+c*(p+1),C=y+1+c*p;f.push(S,x,C),f.push(x,D,C)}this.setIndex(f),this.setAttribute("position",new re(g,3)),this.setAttribute("normal",new re(_,3)),this.setAttribute("uv",new re(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ve(t.width,t.height,t.widthSegments,t.heightSegments)}}var $h=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Kh=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Zh=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,jh=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Jh=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Qh=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,tu=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,eu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,nu=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,iu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,su=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ru=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,au=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,ou=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,lu=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,cu=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,hu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,uu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,du=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,fu=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,pu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,mu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,gu=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,_u=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,vu=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,xu=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Mu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,yu=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Su=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Eu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,wu="gl_FragColor = linearToOutputTexel( gl_FragColor );",bu=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Tu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Au=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Cu=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Ru=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Pu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Lu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Du=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Iu=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Uu=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Nu=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Fu=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Bu=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ou=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,zu=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,ku=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Gu=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Hu=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Vu=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Wu=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Xu=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,qu=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Yu=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,$u=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Ku=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Zu=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ju=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ju=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Qu=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,td=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,ed=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,nd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,id=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,sd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,rd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ad=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,od=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ld=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,cd=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,hd=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ud=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,dd=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,fd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,pd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,md=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,gd=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,_d=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,vd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,xd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Md=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,yd=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Sd=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Ed=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,wd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,bd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Td=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ad=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Cd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Rd=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Pd=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Ld=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Dd=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Id=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ud=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Nd=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Fd=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Bd=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Od=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,zd=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,kd=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Gd=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Hd=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Vd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Wd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Xd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,qd=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Yd=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,$d=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Kd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Zd=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Jd=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qd=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,tf=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,ef=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,nf=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,sf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,rf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,af=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,of=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,lf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,cf=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hf=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,uf=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,df=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,ff=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pf=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,mf=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,gf=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_f=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vf=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,xf=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Mf=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,yf=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Sf=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Ef=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,wf=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,bf=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Tf=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Af=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Gt={alphahash_fragment:$h,alphahash_pars_fragment:Kh,alphamap_fragment:Zh,alphamap_pars_fragment:jh,alphatest_fragment:Jh,alphatest_pars_fragment:Qh,aomap_fragment:tu,aomap_pars_fragment:eu,batching_pars_vertex:nu,batching_vertex:iu,begin_vertex:su,beginnormal_vertex:ru,bsdfs:au,iridescence_fragment:ou,bumpmap_pars_fragment:lu,clipping_planes_fragment:cu,clipping_planes_pars_fragment:hu,clipping_planes_pars_vertex:uu,clipping_planes_vertex:du,color_fragment:fu,color_pars_fragment:pu,color_pars_vertex:mu,color_vertex:gu,common:_u,cube_uv_reflection_fragment:vu,defaultnormal_vertex:xu,displacementmap_pars_vertex:Mu,displacementmap_vertex:yu,emissivemap_fragment:Su,emissivemap_pars_fragment:Eu,colorspace_fragment:wu,colorspace_pars_fragment:bu,envmap_fragment:Tu,envmap_common_pars_fragment:Au,envmap_pars_fragment:Cu,envmap_pars_vertex:Ru,envmap_physical_pars_fragment:ku,envmap_vertex:Pu,fog_vertex:Lu,fog_pars_vertex:Du,fog_fragment:Iu,fog_pars_fragment:Uu,gradientmap_pars_fragment:Nu,lightmap_pars_fragment:Fu,lights_lambert_fragment:Bu,lights_lambert_pars_fragment:Ou,lights_pars_begin:zu,lights_toon_fragment:Gu,lights_toon_pars_fragment:Hu,lights_phong_fragment:Vu,lights_phong_pars_fragment:Wu,lights_physical_fragment:Xu,lights_physical_pars_fragment:qu,lights_fragment_begin:Yu,lights_fragment_maps:$u,lights_fragment_end:Ku,logdepthbuf_fragment:Zu,logdepthbuf_pars_fragment:ju,logdepthbuf_pars_vertex:Ju,logdepthbuf_vertex:Qu,map_fragment:td,map_pars_fragment:ed,map_particle_fragment:nd,map_particle_pars_fragment:id,metalnessmap_fragment:sd,metalnessmap_pars_fragment:rd,morphinstance_vertex:ad,morphcolor_vertex:od,morphnormal_vertex:ld,morphtarget_pars_vertex:cd,morphtarget_vertex:hd,normal_fragment_begin:ud,normal_fragment_maps:dd,normal_pars_fragment:fd,normal_pars_vertex:pd,normal_vertex:md,normalmap_pars_fragment:gd,clearcoat_normal_fragment_begin:_d,clearcoat_normal_fragment_maps:vd,clearcoat_pars_fragment:xd,iridescence_pars_fragment:Md,opaque_fragment:yd,packing:Sd,premultiplied_alpha_fragment:Ed,project_vertex:wd,dithering_fragment:bd,dithering_pars_fragment:Td,roughnessmap_fragment:Ad,roughnessmap_pars_fragment:Cd,shadowmap_pars_fragment:Rd,shadowmap_pars_vertex:Pd,shadowmap_vertex:Ld,shadowmask_pars_fragment:Dd,skinbase_vertex:Id,skinning_pars_vertex:Ud,skinning_vertex:Nd,skinnormal_vertex:Fd,specularmap_fragment:Bd,specularmap_pars_fragment:Od,tonemapping_fragment:zd,tonemapping_pars_fragment:kd,transmission_fragment:Gd,transmission_pars_fragment:Hd,uv_pars_fragment:Vd,uv_pars_vertex:Wd,uv_vertex:Xd,worldpos_vertex:qd,background_vert:Yd,background_frag:$d,backgroundCube_vert:Kd,backgroundCube_frag:Zd,cube_vert:jd,cube_frag:Jd,depth_vert:Qd,depth_frag:tf,distanceRGBA_vert:ef,distanceRGBA_frag:nf,equirect_vert:sf,equirect_frag:rf,linedashed_vert:af,linedashed_frag:of,meshbasic_vert:lf,meshbasic_frag:cf,meshlambert_vert:hf,meshlambert_frag:uf,meshmatcap_vert:df,meshmatcap_frag:ff,meshnormal_vert:pf,meshnormal_frag:mf,meshphong_vert:gf,meshphong_frag:_f,meshphysical_vert:vf,meshphysical_frag:xf,meshtoon_vert:Mf,meshtoon_frag:yf,points_vert:Sf,points_frag:Ef,shadow_vert:wf,shadow_frag:bf,sprite_vert:Tf,sprite_frag:Af},st={common:{diffuse:{value:new bt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ot}},envmap:{envMap:{value:null},envMapRotation:{value:new Ot},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ot}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ot}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ot},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ot},normalScale:{value:new Mt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ot},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ot}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ot}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ot}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new bt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new bt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0},uvTransform:{value:new Ot}},sprite:{diffuse:{value:new bt(16777215)},opacity:{value:1},center:{value:new Mt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ot},alphaMap:{value:null},alphaMapTransform:{value:new Ot},alphaTest:{value:0}}},an={basic:{uniforms:Ce([st.common,st.specularmap,st.envmap,st.aomap,st.lightmap,st.fog]),vertexShader:Gt.meshbasic_vert,fragmentShader:Gt.meshbasic_frag},lambert:{uniforms:Ce([st.common,st.specularmap,st.envmap,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.fog,st.lights,{emissive:{value:new bt(0)}}]),vertexShader:Gt.meshlambert_vert,fragmentShader:Gt.meshlambert_frag},phong:{uniforms:Ce([st.common,st.specularmap,st.envmap,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.fog,st.lights,{emissive:{value:new bt(0)},specular:{value:new bt(1118481)},shininess:{value:30}}]),vertexShader:Gt.meshphong_vert,fragmentShader:Gt.meshphong_frag},standard:{uniforms:Ce([st.common,st.envmap,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.roughnessmap,st.metalnessmap,st.fog,st.lights,{emissive:{value:new bt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Gt.meshphysical_vert,fragmentShader:Gt.meshphysical_frag},toon:{uniforms:Ce([st.common,st.aomap,st.lightmap,st.emissivemap,st.bumpmap,st.normalmap,st.displacementmap,st.gradientmap,st.fog,st.lights,{emissive:{value:new bt(0)}}]),vertexShader:Gt.meshtoon_vert,fragmentShader:Gt.meshtoon_frag},matcap:{uniforms:Ce([st.common,st.bumpmap,st.normalmap,st.displacementmap,st.fog,{matcap:{value:null}}]),vertexShader:Gt.meshmatcap_vert,fragmentShader:Gt.meshmatcap_frag},points:{uniforms:Ce([st.points,st.fog]),vertexShader:Gt.points_vert,fragmentShader:Gt.points_frag},dashed:{uniforms:Ce([st.common,st.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Gt.linedashed_vert,fragmentShader:Gt.linedashed_frag},depth:{uniforms:Ce([st.common,st.displacementmap]),vertexShader:Gt.depth_vert,fragmentShader:Gt.depth_frag},normal:{uniforms:Ce([st.common,st.bumpmap,st.normalmap,st.displacementmap,{opacity:{value:1}}]),vertexShader:Gt.meshnormal_vert,fragmentShader:Gt.meshnormal_frag},sprite:{uniforms:Ce([st.sprite,st.fog]),vertexShader:Gt.sprite_vert,fragmentShader:Gt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ot},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Gt.background_vert,fragmentShader:Gt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ot}},vertexShader:Gt.backgroundCube_vert,fragmentShader:Gt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Gt.cube_vert,fragmentShader:Gt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Gt.equirect_vert,fragmentShader:Gt.equirect_frag},distanceRGBA:{uniforms:Ce([st.common,st.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Gt.distanceRGBA_vert,fragmentShader:Gt.distanceRGBA_frag},shadow:{uniforms:Ce([st.lights,st.fog,{color:{value:new bt(0)},opacity:{value:1}}]),vertexShader:Gt.shadow_vert,fragmentShader:Gt.shadow_frag}};an.physical={uniforms:Ce([an.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ot},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ot},clearcoatNormalScale:{value:new Mt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ot},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ot},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ot},sheen:{value:0},sheenColor:{value:new bt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ot},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ot},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ot},transmissionSamplerSize:{value:new Mt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ot},attenuationDistance:{value:0},attenuationColor:{value:new bt(0)},specularColor:{value:new bt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ot},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ot},anisotropyVector:{value:new Mt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ot}}]),vertexShader:Gt.meshphysical_vert,fragmentShader:Gt.meshphysical_frag};const ws={r:0,b:0,g:0},Wn=new Ne,Cf=new zt;function Rf(s,t,e,n,i,r,a){const o=new bt(0);let l=r===!0?0:1,c,h,u=null,d=0,f=null;function g(y){let S=y.isScene===!0?y.background:null;return S&&S.isTexture&&(S=(y.backgroundBlurriness>0?e:t).get(S)),S}function _(y){let S=!1;const x=g(y);x===null?p(o,l):x&&x.isColor&&(p(x,1),S=!0);const D=s.xr.getEnvironmentBlendMode();D==="additive"?n.buffers.color.setClear(0,0,0,1,a):D==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(s.autoClear||S)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function m(y,S){const x=g(S);x&&(x.isCubeTexture||x.mapping===js)?(h===void 0&&(h=new Ut(new Ct(1,1,1),new ye({name:"BackgroundCubeMaterial",uniforms:Ri(an.backgroundCube.uniforms),vertexShader:an.backgroundCube.vertexShader,fragmentShader:an.backgroundCube.fragmentShader,side:Re,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(D,C,b){this.matrixWorld.copyPosition(b.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),Wn.copy(S.backgroundRotation),Wn.x*=-1,Wn.y*=-1,Wn.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(Wn.y*=-1,Wn.z*=-1),h.material.uniforms.envMap.value=x,h.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Cf.makeRotationFromEuler(Wn)),h.material.toneMapped=Kt.getTransfer(x.colorSpace)!==ne,(u!==x||d!==x.version||f!==s.toneMapping)&&(h.material.needsUpdate=!0,u=x,d=x.version,f=s.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new Ut(new Ve(2,2),new ye({name:"BackgroundMaterial",uniforms:Ri(an.background.uniforms),vertexShader:an.background.vertexShader,fragmentShader:an.background.fragmentShader,side:Bn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.toneMapped=Kt.getTransfer(x.colorSpace)!==ne,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||d!==x.version||f!==s.toneMapping)&&(c.material.needsUpdate=!0,u=x,d=x.version,f=s.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function p(y,S){y.getRGB(ws,Zl(s)),n.buffers.color.setClear(ws.r,ws.g,ws.b,S,a)}return{getClearColor:function(){return o},setClearColor:function(y,S=1){o.set(y),l=S,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,p(o,l)},render:_,addToRenderList:m}}function Pf(s,t){const e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null);let r=i,a=!1;function o(v,L,U,O,X){let q=!1;const V=u(O,U,L);r!==V&&(r=V,c(r.object)),q=f(v,O,U,X),q&&g(v,O,U,X),X!==null&&t.update(X,s.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,x(v,L,U,O),X!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(X).buffer))}function l(){return s.createVertexArray()}function c(v){return s.bindVertexArray(v)}function h(v){return s.deleteVertexArray(v)}function u(v,L,U){const O=U.wireframe===!0;let X=n[v.id];X===void 0&&(X={},n[v.id]=X);let q=X[L.id];q===void 0&&(q={},X[L.id]=q);let V=q[O];return V===void 0&&(V=d(l()),q[O]=V),V}function d(v){const L=[],U=[],O=[];for(let X=0;X<e;X++)L[X]=0,U[X]=0,O[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:U,attributeDivisors:O,object:v,attributes:{},index:null}}function f(v,L,U,O){const X=r.attributes,q=L.attributes;let V=0;const $=U.getAttributes();for(const H in $)if($[H].location>=0){const it=X[H];let lt=q[H];if(lt===void 0&&(H==="instanceMatrix"&&v.instanceMatrix&&(lt=v.instanceMatrix),H==="instanceColor"&&v.instanceColor&&(lt=v.instanceColor)),it===void 0||it.attribute!==lt||lt&&it.data!==lt.data)return!0;V++}return r.attributesNum!==V||r.index!==O}function g(v,L,U,O){const X={},q=L.attributes;let V=0;const $=U.getAttributes();for(const H in $)if($[H].location>=0){let it=q[H];it===void 0&&(H==="instanceMatrix"&&v.instanceMatrix&&(it=v.instanceMatrix),H==="instanceColor"&&v.instanceColor&&(it=v.instanceColor));const lt={};lt.attribute=it,it&&it.data&&(lt.data=it.data),X[H]=lt,V++}r.attributes=X,r.attributesNum=V,r.index=O}function _(){const v=r.newAttributes;for(let L=0,U=v.length;L<U;L++)v[L]=0}function m(v){p(v,0)}function p(v,L){const U=r.newAttributes,O=r.enabledAttributes,X=r.attributeDivisors;U[v]=1,O[v]===0&&(s.enableVertexAttribArray(v),O[v]=1),X[v]!==L&&(s.vertexAttribDivisor(v,L),X[v]=L)}function y(){const v=r.newAttributes,L=r.enabledAttributes;for(let U=0,O=L.length;U<O;U++)L[U]!==v[U]&&(s.disableVertexAttribArray(U),L[U]=0)}function S(v,L,U,O,X,q,V){V===!0?s.vertexAttribIPointer(v,L,U,X,q):s.vertexAttribPointer(v,L,U,O,X,q)}function x(v,L,U,O){_();const X=O.attributes,q=U.getAttributes(),V=L.defaultAttributeValues;for(const $ in q){const H=q[$];if(H.location>=0){let nt=X[$];if(nt===void 0&&($==="instanceMatrix"&&v.instanceMatrix&&(nt=v.instanceMatrix),$==="instanceColor"&&v.instanceColor&&(nt=v.instanceColor)),nt!==void 0){const it=nt.normalized,lt=nt.itemSize,Rt=t.get(nt);if(Rt===void 0)continue;const Wt=Rt.buffer,Y=Rt.type,Q=Rt.bytesPerElement,ft=Y===s.INT||Y===s.UNSIGNED_INT||nt.gpuType===La;if(nt.isInterleavedBufferAttribute){const rt=nt.data,Tt=rt.stride,Lt=nt.offset;if(rt.isInstancedInterleavedBuffer){for(let Ht=0;Ht<H.locationSize;Ht++)p(H.location+Ht,rt.meshPerAttribute);v.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let Ht=0;Ht<H.locationSize;Ht++)m(H.location+Ht);s.bindBuffer(s.ARRAY_BUFFER,Wt);for(let Ht=0;Ht<H.locationSize;Ht++)S(H.location+Ht,lt/H.locationSize,Y,it,Tt*Q,(Lt+lt/H.locationSize*Ht)*Q,ft)}else{if(nt.isInstancedBufferAttribute){for(let rt=0;rt<H.locationSize;rt++)p(H.location+rt,nt.meshPerAttribute);v.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=nt.meshPerAttribute*nt.count)}else for(let rt=0;rt<H.locationSize;rt++)m(H.location+rt);s.bindBuffer(s.ARRAY_BUFFER,Wt);for(let rt=0;rt<H.locationSize;rt++)S(H.location+rt,lt/H.locationSize,Y,it,lt*Q,lt/H.locationSize*rt*Q,ft)}}else if(V!==void 0){const it=V[$];if(it!==void 0)switch(it.length){case 2:s.vertexAttrib2fv(H.location,it);break;case 3:s.vertexAttrib3fv(H.location,it);break;case 4:s.vertexAttrib4fv(H.location,it);break;default:s.vertexAttrib1fv(H.location,it)}}}}y()}function D(){R();for(const v in n){const L=n[v];for(const U in L){const O=L[U];for(const X in O)h(O[X].object),delete O[X];delete L[U]}delete n[v]}}function C(v){if(n[v.id]===void 0)return;const L=n[v.id];for(const U in L){const O=L[U];for(const X in O)h(O[X].object),delete O[X];delete L[U]}delete n[v.id]}function b(v){for(const L in n){const U=n[L];if(U[v.id]===void 0)continue;const O=U[v.id];for(const X in O)h(O[X].object),delete O[X];delete U[v.id]}}function R(){E(),a=!0,r!==i&&(r=i,c(r.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:R,resetDefaultState:E,dispose:D,releaseStatesOfGeometry:C,releaseStatesOfProgram:b,initAttributes:_,enableAttribute:m,disableUnusedAttributes:y}}function Lf(s,t,e){let n;function i(c){n=c}function r(c,h){s.drawArrays(n,c,h),e.update(h,n,1)}function a(c,h,u){u!==0&&(s.drawArraysInstanced(n,c,h,u),e.update(h,n,u))}function o(c,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];e.update(f,n,1)}function l(c,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)a(c[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,c,0,h,0,d,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*d[_];e.update(g,n,1)}}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Df(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const b=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(b.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(b){return!(b!==nn&&n.convert(b)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(b){const R=b===cn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(b!==wn&&n.convert(b)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&b!==ln&&!R)}function l(b){if(b==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";b="mediump"}return b==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),y=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),S=s.getParameter(s.MAX_VARYING_VECTORS),x=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),D=g>0,C=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:y,maxVaryings:S,maxFragmentUniforms:x,vertexTextures:D,maxSamples:C}}function If(s){const t=this;let e=null,n=0,i=!1,r=!1;const a=new Yn,o=new Ot,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=s.get(u);if(!i||g===null||g.length===0||r&&!m)r?h(null):c();else{const y=r?0:n,S=y*4;let x=p.clippingState||null;l.value=x,x=h(g,d,S,f);for(let D=0;D!==S;++D)x[D]=e[D];p.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const p=f+_*4,y=d.matrixWorldInverse;o.getNormalMatrix(y),(m===null||m.length<p)&&(m=new Float32Array(p));for(let S=0,x=f;S!==_;++S,x+=4)a.copy(u[S]).applyMatrix4(y,o),a.normal.toArray(m,x),m[x+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function Uf(s){let t=new WeakMap;function e(a,o){return o===Kr?a.mapping=bi:o===Zr&&(a.mapping=Ti),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Kr||o===Zr)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Wh(l.height);return c.fromEquirectangularTexture(s,a),t.set(a,c),a.addEventListener("dispose",i),e(c.texture,a.mapping)}else return null}}return a}function i(a){const o=a.target;o.removeEventListener("dispose",i);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class Ga extends jl{constructor(t=-1,e=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const yi=4,Lo=[.125,.215,.35,.446,.526,.582],Zn=20,Sr=new Ga,Do=new bt;let Er=null,wr=0,br=0,Tr=!1;const $n=(1+Math.sqrt(5))/2,vi=1/$n,Io=[new P(-$n,vi,0),new P($n,vi,0),new P(-vi,0,$n),new P(vi,0,$n),new P(0,$n,-vi),new P(0,$n,vi),new P(-1,1,-1),new P(1,1,-1),new P(-1,1,1),new P(1,1,1)];class wa{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){Er=this._renderer.getRenderTarget(),wr=this._renderer.getActiveCubeFace(),br=this._renderer.getActiveMipmapLevel(),Tr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,i,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Fo(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=No(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Er,wr,br),this._renderer.xr.enabled=Tr,t.scissorTest=!1,bs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===bi||t.mapping===Ti?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Er=this._renderer.getRenderTarget(),wr=this._renderer.getActiveCubeFace(),br=this._renderer.getActiveMipmapLevel(),Tr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:on,minFilter:on,generateMipmaps:!1,type:cn,format:nn,colorSpace:Li,depthBuffer:!1},i=Uo(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Uo(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Nf(r)),this._blurMaterial=Ff(r,t,e)}return i}_compileMaterial(t){const e=new Ut(this._lodPlanes[0],t);this._renderer.compile(e,Sr)}_sceneToCubeUV(t,e,n,i){const o=new He(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(Do),h.toneMapping=Sn,h.autoClear=!1;const f=new Qi({name:"PMREM.Background",side:Re,depthWrite:!1,depthTest:!1}),g=new Ut(new Ct,f);let _=!1;const m=t.background;m?m.isColor&&(f.color.copy(m),t.background=null,_=!0):(f.color.copy(Do),_=!0);for(let p=0;p<6;p++){const y=p%3;y===0?(o.up.set(0,l[p],0),o.lookAt(c[p],0,0)):y===1?(o.up.set(0,0,l[p]),o.lookAt(0,c[p],0)):(o.up.set(0,l[p],0),o.lookAt(0,0,c[p]));const S=this._cubeSize;bs(i,y*S,p>2?S:0,S,S),h.setRenderTarget(i),_&&h.render(g,o),h.render(t,o)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=m}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===bi||t.mapping===Ti;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Fo()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=No());const r=i?this._cubemapMaterial:this._equirectMaterial,a=new Ut(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;bs(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,Sr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Io[(i-r-1)%Io.length];this._blur(t,r-1,r,a,o)}e.autoClear=n}_blur(t,e,n,i,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,i,"latitudinal",r),this._halfBlur(a,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Ut(this._lodPlanes[i],c),d=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Zn-1),_=r/g,m=isFinite(r)?1+Math.floor(h*_):Zn;m>Zn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Zn}`);const p=[];let y=0;for(let b=0;b<Zn;++b){const R=b/_,E=Math.exp(-R*R/2);p.push(E),b===0?y+=E:b<m&&(y+=2*E)}for(let b=0;b<p.length;b++)p[b]=p[b]/y;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:S}=this;d.dTheta.value=g,d.mipInt.value=S-n;const x=this._sizeLods[i],D=3*x*(i>S-yi?i-S+yi:0),C=4*(this._cubeSize-x);bs(e,D,C,3*x,2*x),l.setRenderTarget(e),l.render(u,Sr)}}function Nf(s){const t=[],e=[],n=[];let i=s;const r=s-yi+1+Lo.length;for(let a=0;a<r;a++){const o=Math.pow(2,i);e.push(o);let l=1/o;a>s-yi?l=Lo[a-s+yi-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,_=3,m=2,p=1,y=new Float32Array(_*g*f),S=new Float32Array(m*g*f),x=new Float32Array(p*g*f);for(let C=0;C<f;C++){const b=C%3*2/3-1,R=C>2?0:-1,E=[b,R,0,b+2/3,R,0,b+2/3,R+1,0,b,R,0,b+2/3,R+1,0,b,R+1,0];y.set(E,_*g*C),S.set(d,m*g*C);const v=[C,C,C,C,C,C];x.set(v,p*g*C)}const D=new de;D.setAttribute("position",new se(y,_)),D.setAttribute("uv",new se(S,m)),D.setAttribute("faceIndex",new se(x,p)),t.push(D),i>yi&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Uo(s,t,e){const n=new Ke(s,t,e);return n.texture.mapping=js,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function bs(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function Ff(s,t,e){const n=new Float32Array(Zn),i=new P(0,1,0);return new ye({name:"SphericalGaussianBlur",defines:{n:Zn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Ha(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:yn,depthTest:!1,depthWrite:!1})}function No(){return new ye({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ha(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:yn,depthTest:!1,depthWrite:!1})}function Fo(){return new ye({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ha(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:yn,depthTest:!1,depthWrite:!1})}function Ha(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Bf(s){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===Kr||l===Zr,h=l===bi||l===Ti;if(c||h){let u=t.get(o);const d=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new wa(s)),u=c?e.fromEquirectangular(o,u):e.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),u.texture;if(u!==void 0)return u.texture;{const f=o.image;return c&&f&&f.height>0||h&&f&&i(f)?(e===null&&(e=new wa(s)),u=c?e.fromEquirectangular(o):e.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,t.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function i(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function Of(s){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const i=e(n);return i===null&&qi("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function zf(s,t,e,n){const i={},r=new WeakMap;function a(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);for(const g in d.morphAttributes){const _=d.morphAttributes[g];for(let m=0,p=_.length;m<p;m++)t.remove(_[m])}d.removeEventListener("dispose",a),delete i[d.id];const f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(u,d){return i[d.id]===!0||(d.addEventListener("dispose",a),i[d.id]=!0,e.memory.geometries++),d}function l(u){const d=u.attributes;for(const g in d)t.update(d[g],s.ARRAY_BUFFER);const f=u.morphAttributes;for(const g in f){const _=f[g];for(let m=0,p=_.length;m<p;m++)t.update(_[m],s.ARRAY_BUFFER)}}function c(u){const d=[],f=u.index,g=u.attributes.position;let _=0;if(f!==null){const y=f.array;_=f.version;for(let S=0,x=y.length;S<x;S+=3){const D=y[S+0],C=y[S+1],b=y[S+2];d.push(D,C,C,b,b,D)}}else if(g!==void 0){const y=g.array;_=g.version;for(let S=0,x=y.length/3-1;S<x;S+=3){const D=S+0,C=S+1,b=S+2;d.push(D,C,C,b,b,D)}}else return;const m=new(Vl(d)?Kl:$l)(d,1);m.version=_;const p=r.get(u);p&&t.remove(p),r.set(u,m)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function kf(s,t,e){let n;function i(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,f){s.drawElements(n,f,r,d*a),e.update(f,n,1)}function c(d,f,g){g!==0&&(s.drawElementsInstanced(n,f,r,d*a,g),e.update(f,n,g))}function h(d,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,n,1)}function u(d,f,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/a,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,_,0,g);let p=0;for(let y=0;y<g;y++)p+=f[y]*_[y];e.update(p,n,1)}}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Gf(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case s.TRIANGLES:e.triangles+=o*(r/3);break;case s.LINES:e.lines+=o*(r/2);break;case s.LINE_STRIP:e.lines+=o*(r-1);break;case s.LINE_LOOP:e.lines+=o*r;break;case s.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function Hf(s,t,e){const n=new WeakMap,i=new ie;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let v=function(){R.dispose(),n.delete(o),o.removeEventListener("dispose",v)};var f=v;d!==void 0&&d.texture.dispose();const g=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],y=o.morphAttributes.normal||[],S=o.morphAttributes.color||[];let x=0;g===!0&&(x=1),_===!0&&(x=2),m===!0&&(x=3);let D=o.attributes.position.count*x,C=1;D>t.maxTextureSize&&(C=Math.ceil(D/t.maxTextureSize),D=t.maxTextureSize);const b=new Float32Array(D*C*4*u),R=new Xl(b,D,C,u);R.type=ln,R.needsUpdate=!0;const E=x*4;for(let L=0;L<u;L++){const U=p[L],O=y[L],X=S[L],q=D*C*4*L;for(let V=0;V<U.count;V++){const $=V*E;g===!0&&(i.fromBufferAttribute(U,V),b[q+$+0]=i.x,b[q+$+1]=i.y,b[q+$+2]=i.z,b[q+$+3]=0),_===!0&&(i.fromBufferAttribute(O,V),b[q+$+4]=i.x,b[q+$+5]=i.y,b[q+$+6]=i.z,b[q+$+7]=0),m===!0&&(i.fromBufferAttribute(X,V),b[q+$+8]=i.x,b[q+$+9]=i.y,b[q+$+10]=i.z,b[q+$+11]=X.itemSize===4?i.w:1)}}d={count:u,texture:R,size:new Mt(D,C)},n.set(o,d),o.addEventListener("dispose",v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,e);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const _=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(s,"morphTargetBaseInfluence",_),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function Vf(s,t,e,n){let i=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,u=t.get(l,h);if(i.get(u)!==c&&(t.update(u),i.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),i.get(l)!==c&&(e.update(l.instanceMatrix,s.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,s.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;i.get(d)!==c&&(d.update(),i.set(d,c))}return u}function a(){i=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:a}}class tc extends Te{constructor(t,e,n,i,r,a,o,l,c,h=Si){if(h!==Si&&h!==Ci)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Si&&(n=ti),n===void 0&&h===Ci&&(n=Ai),super(null,i,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:We,this.minFilter=l!==void 0?l:We,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const ec=new Te,Bo=new tc(1,1),nc=new Xl,ic=new Rh,sc=new Jl,Oo=[],zo=[],ko=new Float32Array(16),Go=new Float32Array(9),Ho=new Float32Array(4);function Ui(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let r=Oo[i];if(r===void 0&&(r=new Float32Array(i),Oo[i]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,s[a].toArray(r,o)}return r}function _e(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function ve(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function Qs(s,t){let e=zo[t];e===void 0&&(e=new Int32Array(t),zo[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function Wf(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function Xf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;s.uniform2fv(this.addr,t),ve(e,t)}}function qf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(_e(e,t))return;s.uniform3fv(this.addr,t),ve(e,t)}}function Yf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;s.uniform4fv(this.addr,t),ve(e,t)}}function $f(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(_e(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),ve(e,t)}else{if(_e(e,n))return;Ho.set(n),s.uniformMatrix2fv(this.addr,!1,Ho),ve(e,n)}}function Kf(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(_e(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),ve(e,t)}else{if(_e(e,n))return;Go.set(n),s.uniformMatrix3fv(this.addr,!1,Go),ve(e,n)}}function Zf(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(_e(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),ve(e,t)}else{if(_e(e,n))return;ko.set(n),s.uniformMatrix4fv(this.addr,!1,ko),ve(e,n)}}function jf(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function Jf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;s.uniform2iv(this.addr,t),ve(e,t)}}function Qf(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(_e(e,t))return;s.uniform3iv(this.addr,t),ve(e,t)}}function tp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;s.uniform4iv(this.addr,t),ve(e,t)}}function ep(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function np(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;s.uniform2uiv(this.addr,t),ve(e,t)}}function ip(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(_e(e,t))return;s.uniform3uiv(this.addr,t),ve(e,t)}}function sp(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;s.uniform4uiv(this.addr,t),ve(e,t)}}function rp(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(Bo.compareFunction=Hl,r=Bo):r=ec,e.setTexture2D(t||r,i)}function ap(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||ic,i)}function op(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||sc,i)}function lp(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||nc,i)}function cp(s){switch(s){case 5126:return Wf;case 35664:return Xf;case 35665:return qf;case 35666:return Yf;case 35674:return $f;case 35675:return Kf;case 35676:return Zf;case 5124:case 35670:return jf;case 35667:case 35671:return Jf;case 35668:case 35672:return Qf;case 35669:case 35673:return tp;case 5125:return ep;case 36294:return np;case 36295:return ip;case 36296:return sp;case 35678:case 36198:case 36298:case 36306:case 35682:return rp;case 35679:case 36299:case 36307:return ap;case 35680:case 36300:case 36308:case 36293:return op;case 36289:case 36303:case 36311:case 36292:return lp}}function hp(s,t){s.uniform1fv(this.addr,t)}function up(s,t){const e=Ui(t,this.size,2);s.uniform2fv(this.addr,e)}function dp(s,t){const e=Ui(t,this.size,3);s.uniform3fv(this.addr,e)}function fp(s,t){const e=Ui(t,this.size,4);s.uniform4fv(this.addr,e)}function pp(s,t){const e=Ui(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function mp(s,t){const e=Ui(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function gp(s,t){const e=Ui(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function _p(s,t){s.uniform1iv(this.addr,t)}function vp(s,t){s.uniform2iv(this.addr,t)}function xp(s,t){s.uniform3iv(this.addr,t)}function Mp(s,t){s.uniform4iv(this.addr,t)}function yp(s,t){s.uniform1uiv(this.addr,t)}function Sp(s,t){s.uniform2uiv(this.addr,t)}function Ep(s,t){s.uniform3uiv(this.addr,t)}function wp(s,t){s.uniform4uiv(this.addr,t)}function bp(s,t,e){const n=this.cache,i=t.length,r=Qs(e,i);_e(n,r)||(s.uniform1iv(this.addr,r),ve(n,r));for(let a=0;a!==i;++a)e.setTexture2D(t[a]||ec,r[a])}function Tp(s,t,e){const n=this.cache,i=t.length,r=Qs(e,i);_e(n,r)||(s.uniform1iv(this.addr,r),ve(n,r));for(let a=0;a!==i;++a)e.setTexture3D(t[a]||ic,r[a])}function Ap(s,t,e){const n=this.cache,i=t.length,r=Qs(e,i);_e(n,r)||(s.uniform1iv(this.addr,r),ve(n,r));for(let a=0;a!==i;++a)e.setTextureCube(t[a]||sc,r[a])}function Cp(s,t,e){const n=this.cache,i=t.length,r=Qs(e,i);_e(n,r)||(s.uniform1iv(this.addr,r),ve(n,r));for(let a=0;a!==i;++a)e.setTexture2DArray(t[a]||nc,r[a])}function Rp(s){switch(s){case 5126:return hp;case 35664:return up;case 35665:return dp;case 35666:return fp;case 35674:return pp;case 35675:return mp;case 35676:return gp;case 5124:case 35670:return _p;case 35667:case 35671:return vp;case 35668:case 35672:return xp;case 35669:case 35673:return Mp;case 5125:return yp;case 36294:return Sp;case 36295:return Ep;case 36296:return wp;case 35678:case 36198:case 36298:case 36306:case 35682:return bp;case 35679:case 36299:case 36307:return Tp;case 35680:case 36300:case 36308:case 36293:return Ap;case 36289:case 36303:case 36311:case 36292:return Cp}}class Pp{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=cp(e.type)}}class Lp{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Rp(e.type)}}class Dp{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(t,e[o.id],n)}}}const Ar=/(\w+)(\])?(\[|\.)?/g;function Vo(s,t){s.seq.push(t),s.map[t.id]=t}function Ip(s,t,e){const n=s.name,i=n.length;for(Ar.lastIndex=0;;){const r=Ar.exec(n),a=Ar.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){Vo(e,c===void 0?new Pp(o,s,t):new Lp(o,s,t));break}else{let u=e.map[o];u===void 0&&(u=new Dp(o),Vo(e,u)),e=u}}}class Ws{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=t.getActiveUniform(e,i),a=t.getUniformLocation(e,r.name);Ip(r,a,this)}}setValue(t,e,n,i){const r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,r=t.length;i!==r;++i){const a=t[i];a.id in e&&n.push(a)}return n}}function Wo(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const Up=37297;let Np=0;function Fp(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const Xo=new Ot;function Bp(s){Kt._getMatrix(Xo,Kt.workingColorSpace,s);const t=`mat3( ${Xo.elements.map(e=>e.toFixed(4))} )`;switch(Kt.getTransfer(s)){case Js:return[t,"LinearTransferOETF"];case ne:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function qo(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),i=s.getShaderInfoLog(t).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const a=parseInt(r[1]);return e.toUpperCase()+`

`+i+`

`+Fp(s.getShaderSource(t),a)}else return i}function Op(s,t){const e=Bp(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function zp(s,t){let e;switch(t){case kc:e="Linear";break;case Gc:e="Reinhard";break;case Hc:e="Cineon";break;case Vc:e="ACESFilmic";break;case Xc:e="AgX";break;case qc:e="Neutral";break;case Wc:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ts=new P;function kp(){Kt.getLuminanceCoefficients(Ts);const s=Ts.x.toFixed(4),t=Ts.y.toFixed(4),e=Ts.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Gp(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Yi).join(`
`)}function Hp(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Vp(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(t,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:s.getAttribLocation(t,a),locationSize:o}}return e}function Yi(s){return s!==""}function Yo(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function $o(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Wp=/^[ \t]*#include +<([\w\d./]+)>/gm;function ba(s){return s.replace(Wp,qp)}const Xp=new Map;function qp(s,t){let e=Gt[t];if(e===void 0){const n=Xp.get(t);if(n!==void 0)e=Gt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return ba(e)}const Yp=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ko(s){return s.replace(Yp,$p)}function $p(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Zo(s){let t=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Kp(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===Cl?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===Rl?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===_n&&(t="SHADOWMAP_TYPE_VSM"),t}function Zp(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case bi:case Ti:t="ENVMAP_TYPE_CUBE";break;case js:t="ENVMAP_TYPE_CUBE_UV";break}return t}function jp(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Ti:t="ENVMAP_MODE_REFRACTION";break}return t}function Jp(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Pl:t="ENVMAP_BLENDING_MULTIPLY";break;case Oc:t="ENVMAP_BLENDING_MIX";break;case zc:t="ENVMAP_BLENDING_ADD";break}return t}function Qp(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function tm(s,t,e,n){const i=s.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=Kp(e),c=Zp(e),h=jp(e),u=Jp(e),d=Qp(e),f=Gp(e),g=Hp(r),_=i.createProgram();let m,p,y=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Yi).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Yi).join(`
`),p.length>0&&(p+=`
`)):(m=[Zo(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Yi).join(`
`),p=[Zo(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Sn?"#define TONE_MAPPING":"",e.toneMapping!==Sn?Gt.tonemapping_pars_fragment:"",e.toneMapping!==Sn?zp("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Gt.colorspace_pars_fragment,Op("linearToOutputTexel",e.outputColorSpace),kp(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Yi).join(`
`)),a=ba(a),a=Yo(a,e),a=$o(a,e),o=ba(o),o=Yo(o,e),o=$o(o,e),a=Ko(a),o=Ko(o),e.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===lo?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===lo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const S=y+m+a,x=y+p+o,D=Wo(i,i.VERTEX_SHADER,S),C=Wo(i,i.FRAGMENT_SHADER,x);i.attachShader(_,D),i.attachShader(_,C),e.index0AttributeName!==void 0?i.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function b(L){if(s.debug.checkShaderErrors){const U=i.getProgramInfoLog(_).trim(),O=i.getShaderInfoLog(D).trim(),X=i.getShaderInfoLog(C).trim();let q=!0,V=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(q=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,_,D,C);else{const $=qo(i,D,"vertex"),H=qo(i,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+U+`
`+$+`
`+H)}else U!==""?console.warn("THREE.WebGLProgram: Program Info Log:",U):(O===""||X==="")&&(V=!1);V&&(L.diagnostics={runnable:q,programLog:U,vertexShader:{log:O,prefix:m},fragmentShader:{log:X,prefix:p}})}i.deleteShader(D),i.deleteShader(C),R=new Ws(i,_),E=Vp(i,_)}let R;this.getUniforms=function(){return R===void 0&&b(this),R};let E;this.getAttributes=function(){return E===void 0&&b(this),E};let v=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=i.getProgramParameter(_,Up)),v},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Np++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=D,this.fragmentShader=C,this}let em=0;class nm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new im(t),e.set(t,n)),n}}class im{constructor(t){this.id=em++,this.code=t,this.usedTimes=0}}function sm(s,t,e,n,i,r,a){const o=new ql,l=new nm,c=new Set,h=[],u=i.logarithmicDepthBuffer,d=i.vertexTextures;let f=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(E){return c.add(E),E===0?"uv":`uv${E}`}function m(E,v,L,U,O){const X=U.fog,q=O.geometry,V=E.isMeshStandardMaterial?U.environment:null,$=(E.isMeshStandardMaterial?e:t).get(E.envMap||V),H=$&&$.mapping===js?$.image.height:null,nt=g[E.type];E.precision!==null&&(f=i.getMaxPrecision(E.precision),f!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",f,"instead."));const it=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,lt=it!==void 0?it.length:0;let Rt=0;q.morphAttributes.position!==void 0&&(Rt=1),q.morphAttributes.normal!==void 0&&(Rt=2),q.morphAttributes.color!==void 0&&(Rt=3);let Wt,Y,Q,ft;if(nt){const ee=an[nt];Wt=ee.vertexShader,Y=ee.fragmentShader}else Wt=E.vertexShader,Y=E.fragmentShader,l.update(E),Q=l.getVertexShaderID(E),ft=l.getFragmentShaderID(E);const rt=s.getRenderTarget(),Tt=s.state.buffers.depth.getReversed(),Lt=O.isInstancedMesh===!0,Ht=O.isBatchedMesh===!0,le=!!E.map,Xt=!!E.matcap,ue=!!$,B=!!E.aoMap,Yt=!!E.lightMap,It=!!E.bumpMap,Nt=!!E.normalMap,wt=!!E.displacementMap,Jt=!!E.emissiveMap,yt=!!E.metalnessMap,A=!!E.roughnessMap,M=E.anisotropy>0,z=E.clearcoat>0,Z=E.dispersion>0,J=E.iridescence>0,K=E.sheen>0,St=E.transmission>0,ot=M&&!!E.anisotropyMap,dt=z&&!!E.clearcoatMap,$t=z&&!!E.clearcoatNormalMap,tt=z&&!!E.clearcoatRoughnessMap,pt=J&&!!E.iridescenceMap,At=J&&!!E.iridescenceThicknessMap,Pt=K&&!!E.sheenColorMap,mt=K&&!!E.sheenRoughnessMap,qt=!!E.specularMap,kt=!!E.specularColorMap,ae=!!E.specularIntensityMap,I=St&&!!E.transmissionMap,at=St&&!!E.thicknessMap,W=!!E.gradientMap,j=!!E.alphaMap,ut=E.alphaTest>0,ct=!!E.alphaHash,Ft=!!E.extensions;let fe=Sn;E.toneMapped&&(rt===null||rt.isXRRenderTarget===!0)&&(fe=s.toneMapping);const Se={shaderID:nt,shaderType:E.type,shaderName:E.name,vertexShader:Wt,fragmentShader:Y,defines:E.defines,customVertexShaderID:Q,customFragmentShaderID:ft,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:f,batching:Ht,batchingColor:Ht&&O._colorsTexture!==null,instancing:Lt,instancingColor:Lt&&O.instanceColor!==null,instancingMorph:Lt&&O.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:rt===null?s.outputColorSpace:rt.isXRRenderTarget===!0?rt.texture.colorSpace:Li,alphaToCoverage:!!E.alphaToCoverage,map:le,matcap:Xt,envMap:ue,envMapMode:ue&&$.mapping,envMapCubeUVHeight:H,aoMap:B,lightMap:Yt,bumpMap:It,normalMap:Nt,displacementMap:d&&wt,emissiveMap:Jt,normalMapObjectSpace:Nt&&E.normalMapType===Zc,normalMapTangentSpace:Nt&&E.normalMapType===Gl,metalnessMap:yt,roughnessMap:A,anisotropy:M,anisotropyMap:ot,clearcoat:z,clearcoatMap:dt,clearcoatNormalMap:$t,clearcoatRoughnessMap:tt,dispersion:Z,iridescence:J,iridescenceMap:pt,iridescenceThicknessMap:At,sheen:K,sheenColorMap:Pt,sheenRoughnessMap:mt,specularMap:qt,specularColorMap:kt,specularIntensityMap:ae,transmission:St,transmissionMap:I,thicknessMap:at,gradientMap:W,opaque:E.transparent===!1&&E.blending===Nn&&E.alphaToCoverage===!1,alphaMap:j,alphaTest:ut,alphaHash:ct,combine:E.combine,mapUv:le&&_(E.map.channel),aoMapUv:B&&_(E.aoMap.channel),lightMapUv:Yt&&_(E.lightMap.channel),bumpMapUv:It&&_(E.bumpMap.channel),normalMapUv:Nt&&_(E.normalMap.channel),displacementMapUv:wt&&_(E.displacementMap.channel),emissiveMapUv:Jt&&_(E.emissiveMap.channel),metalnessMapUv:yt&&_(E.metalnessMap.channel),roughnessMapUv:A&&_(E.roughnessMap.channel),anisotropyMapUv:ot&&_(E.anisotropyMap.channel),clearcoatMapUv:dt&&_(E.clearcoatMap.channel),clearcoatNormalMapUv:$t&&_(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:tt&&_(E.clearcoatRoughnessMap.channel),iridescenceMapUv:pt&&_(E.iridescenceMap.channel),iridescenceThicknessMapUv:At&&_(E.iridescenceThicknessMap.channel),sheenColorMapUv:Pt&&_(E.sheenColorMap.channel),sheenRoughnessMapUv:mt&&_(E.sheenRoughnessMap.channel),specularMapUv:qt&&_(E.specularMap.channel),specularColorMapUv:kt&&_(E.specularColorMap.channel),specularIntensityMapUv:ae&&_(E.specularIntensityMap.channel),transmissionMapUv:I&&_(E.transmissionMap.channel),thicknessMapUv:at&&_(E.thicknessMap.channel),alphaMapUv:j&&_(E.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(Nt||M),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!q.attributes.uv&&(le||j),fog:!!X,useFog:E.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:Tt,skinning:O.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:lt,morphTextureStride:Rt,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:E.dithering,shadowMapEnabled:s.shadowMap.enabled&&L.length>0,shadowMapType:s.shadowMap.type,toneMapping:fe,decodeVideoTexture:le&&E.map.isVideoTexture===!0&&Kt.getTransfer(E.map.colorSpace)===ne,decodeVideoTextureEmissive:Jt&&E.emissiveMap.isVideoTexture===!0&&Kt.getTransfer(E.emissiveMap.colorSpace)===ne,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===Ue,flipSided:E.side===Re,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:Ft&&E.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ft&&E.extensions.multiDraw===!0||Ht)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return Se.vertexUv1s=c.has(1),Se.vertexUv2s=c.has(2),Se.vertexUv3s=c.has(3),c.clear(),Se}function p(E){const v=[];if(E.shaderID?v.push(E.shaderID):(v.push(E.customVertexShaderID),v.push(E.customFragmentShaderID)),E.defines!==void 0)for(const L in E.defines)v.push(L),v.push(E.defines[L]);return E.isRawShaderMaterial===!1&&(y(v,E),S(v,E),v.push(s.outputColorSpace)),v.push(E.customProgramCacheKey),v.join()}function y(E,v){E.push(v.precision),E.push(v.outputColorSpace),E.push(v.envMapMode),E.push(v.envMapCubeUVHeight),E.push(v.mapUv),E.push(v.alphaMapUv),E.push(v.lightMapUv),E.push(v.aoMapUv),E.push(v.bumpMapUv),E.push(v.normalMapUv),E.push(v.displacementMapUv),E.push(v.emissiveMapUv),E.push(v.metalnessMapUv),E.push(v.roughnessMapUv),E.push(v.anisotropyMapUv),E.push(v.clearcoatMapUv),E.push(v.clearcoatNormalMapUv),E.push(v.clearcoatRoughnessMapUv),E.push(v.iridescenceMapUv),E.push(v.iridescenceThicknessMapUv),E.push(v.sheenColorMapUv),E.push(v.sheenRoughnessMapUv),E.push(v.specularMapUv),E.push(v.specularColorMapUv),E.push(v.specularIntensityMapUv),E.push(v.transmissionMapUv),E.push(v.thicknessMapUv),E.push(v.combine),E.push(v.fogExp2),E.push(v.sizeAttenuation),E.push(v.morphTargetsCount),E.push(v.morphAttributeCount),E.push(v.numDirLights),E.push(v.numPointLights),E.push(v.numSpotLights),E.push(v.numSpotLightMaps),E.push(v.numHemiLights),E.push(v.numRectAreaLights),E.push(v.numDirLightShadows),E.push(v.numPointLightShadows),E.push(v.numSpotLightShadows),E.push(v.numSpotLightShadowsWithMaps),E.push(v.numLightProbes),E.push(v.shadowMapType),E.push(v.toneMapping),E.push(v.numClippingPlanes),E.push(v.numClipIntersection),E.push(v.depthPacking)}function S(E,v){o.disableAll(),v.supportsVertexTextures&&o.enable(0),v.instancing&&o.enable(1),v.instancingColor&&o.enable(2),v.instancingMorph&&o.enable(3),v.matcap&&o.enable(4),v.envMap&&o.enable(5),v.normalMapObjectSpace&&o.enable(6),v.normalMapTangentSpace&&o.enable(7),v.clearcoat&&o.enable(8),v.iridescence&&o.enable(9),v.alphaTest&&o.enable(10),v.vertexColors&&o.enable(11),v.vertexAlphas&&o.enable(12),v.vertexUv1s&&o.enable(13),v.vertexUv2s&&o.enable(14),v.vertexUv3s&&o.enable(15),v.vertexTangents&&o.enable(16),v.anisotropy&&o.enable(17),v.alphaHash&&o.enable(18),v.batching&&o.enable(19),v.dispersion&&o.enable(20),v.batchingColor&&o.enable(21),E.push(o.mask),o.disableAll(),v.fog&&o.enable(0),v.useFog&&o.enable(1),v.flatShading&&o.enable(2),v.logarithmicDepthBuffer&&o.enable(3),v.reverseDepthBuffer&&o.enable(4),v.skinning&&o.enable(5),v.morphTargets&&o.enable(6),v.morphNormals&&o.enable(7),v.morphColors&&o.enable(8),v.premultipliedAlpha&&o.enable(9),v.shadowMapEnabled&&o.enable(10),v.doubleSided&&o.enable(11),v.flipSided&&o.enable(12),v.useDepthPacking&&o.enable(13),v.dithering&&o.enable(14),v.transmission&&o.enable(15),v.sheen&&o.enable(16),v.opaque&&o.enable(17),v.pointsUvs&&o.enable(18),v.decodeVideoTexture&&o.enable(19),v.decodeVideoTextureEmissive&&o.enable(20),v.alphaToCoverage&&o.enable(21),E.push(o.mask)}function x(E){const v=g[E.type];let L;if(v){const U=an[v];L=$s.clone(U.uniforms)}else L=E.uniforms;return L}function D(E,v){let L;for(let U=0,O=h.length;U<O;U++){const X=h[U];if(X.cacheKey===v){L=X,++L.usedTimes;break}}return L===void 0&&(L=new tm(s,v,E,r),h.push(L)),L}function C(E){if(--E.usedTimes===0){const v=h.indexOf(E);h[v]=h[h.length-1],h.pop(),E.destroy()}}function b(E){l.remove(E)}function R(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:x,acquireProgram:D,releaseProgram:C,releaseShaderCache:b,programs:h,dispose:R}}function rm(){let s=new WeakMap;function t(a){return s.has(a)}function e(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function am(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function jo(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function Jo(){const s=[];let t=0;const e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function a(u,d,f,g,_,m){let p=s[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},s[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=_,p.group=m),t++,p}function o(u,d,f,g,_,m){const p=a(u,d,f,g,_,m);f.transmission>0?n.push(p):f.transparent===!0?i.push(p):e.push(p)}function l(u,d,f,g,_,m){const p=a(u,d,f,g,_,m);f.transmission>0?n.unshift(p):f.transparent===!0?i.unshift(p):e.unshift(p)}function c(u,d){e.length>1&&e.sort(u||am),n.length>1&&n.sort(d||jo),i.length>1&&i.sort(d||jo)}function h(){for(let u=t,d=s.length;u<d;u++){const f=s[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:o,unshift:l,finish:h,sort:c}}function om(){let s=new WeakMap;function t(n,i){const r=s.get(n);let a;return r===void 0?(a=new Jo,s.set(n,[a])):i>=r.length?(a=new Jo,r.push(a)):a=r[i],a}function e(){s=new WeakMap}return{get:t,dispose:e}}function lm(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new P,color:new bt};break;case"SpotLight":e={position:new P,direction:new P,color:new bt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new P,color:new bt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new P,skyColor:new bt,groundColor:new bt};break;case"RectAreaLight":e={color:new bt,position:new P,halfWidth:new P,halfHeight:new P};break}return s[t.id]=e,e}}}function cm(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Mt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Mt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Mt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let hm=0;function um(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function dm(s){const t=new lm,e=cm(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);const i=new P,r=new zt,a=new zt;function o(c){let h=0,u=0,d=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,y=0,S=0,x=0,D=0,C=0,b=0;c.sort(um);for(let E=0,v=c.length;E<v;E++){const L=c[E],U=L.color,O=L.intensity,X=L.distance,q=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)h+=U.r*O,u+=U.g*O,d+=U.b*O;else if(L.isLightProbe){for(let V=0;V<9;V++)n.probe[V].addScaledVector(L.sh.coefficients[V],O);b++}else if(L.isDirectionalLight){const V=t.get(L);if(V.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const $=L.shadow,H=e.get(L);H.shadowIntensity=$.intensity,H.shadowBias=$.bias,H.shadowNormalBias=$.normalBias,H.shadowRadius=$.radius,H.shadowMapSize=$.mapSize,n.directionalShadow[f]=H,n.directionalShadowMap[f]=q,n.directionalShadowMatrix[f]=L.shadow.matrix,y++}n.directional[f]=V,f++}else if(L.isSpotLight){const V=t.get(L);V.position.setFromMatrixPosition(L.matrixWorld),V.color.copy(U).multiplyScalar(O),V.distance=X,V.coneCos=Math.cos(L.angle),V.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),V.decay=L.decay,n.spot[_]=V;const $=L.shadow;if(L.map&&(n.spotLightMap[D]=L.map,D++,$.updateMatrices(L),L.castShadow&&C++),n.spotLightMatrix[_]=$.matrix,L.castShadow){const H=e.get(L);H.shadowIntensity=$.intensity,H.shadowBias=$.bias,H.shadowNormalBias=$.normalBias,H.shadowRadius=$.radius,H.shadowMapSize=$.mapSize,n.spotShadow[_]=H,n.spotShadowMap[_]=q,x++}_++}else if(L.isRectAreaLight){const V=t.get(L);V.color.copy(U).multiplyScalar(O),V.halfWidth.set(L.width*.5,0,0),V.halfHeight.set(0,L.height*.5,0),n.rectArea[m]=V,m++}else if(L.isPointLight){const V=t.get(L);if(V.color.copy(L.color).multiplyScalar(L.intensity),V.distance=L.distance,V.decay=L.decay,L.castShadow){const $=L.shadow,H=e.get(L);H.shadowIntensity=$.intensity,H.shadowBias=$.bias,H.shadowNormalBias=$.normalBias,H.shadowRadius=$.radius,H.shadowMapSize=$.mapSize,H.shadowCameraNear=$.camera.near,H.shadowCameraFar=$.camera.far,n.pointShadow[g]=H,n.pointShadowMap[g]=q,n.pointShadowMatrix[g]=L.shadow.matrix,S++}n.point[g]=V,g++}else if(L.isHemisphereLight){const V=t.get(L);V.skyColor.copy(L.color).multiplyScalar(O),V.groundColor.copy(L.groundColor).multiplyScalar(O),n.hemi[p]=V,p++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=st.LTC_FLOAT_1,n.rectAreaLTC2=st.LTC_FLOAT_2):(n.rectAreaLTC1=st.LTC_HALF_1,n.rectAreaLTC2=st.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const R=n.hash;(R.directionalLength!==f||R.pointLength!==g||R.spotLength!==_||R.rectAreaLength!==m||R.hemiLength!==p||R.numDirectionalShadows!==y||R.numPointShadows!==S||R.numSpotShadows!==x||R.numSpotMaps!==D||R.numLightProbes!==b)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=y,n.directionalShadowMap.length=y,n.pointShadow.length=S,n.pointShadowMap.length=S,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=y,n.pointShadowMatrix.length=S,n.spotLightMatrix.length=x+D-C,n.spotLightMap.length=D,n.numSpotLightShadowsWithMaps=C,n.numLightProbes=b,R.directionalLength=f,R.pointLength=g,R.spotLength=_,R.rectAreaLength=m,R.hemiLength=p,R.numDirectionalShadows=y,R.numPointShadows=S,R.numSpotShadows=x,R.numSpotMaps=D,R.numLightProbes=b,n.version=hm++)}function l(c,h){let u=0,d=0,f=0,g=0,_=0;const m=h.matrixWorldInverse;for(let p=0,y=c.length;p<y;p++){const S=c[p];if(S.isDirectionalLight){const x=n.directional[u];x.direction.setFromMatrixPosition(S.matrixWorld),i.setFromMatrixPosition(S.target.matrixWorld),x.direction.sub(i),x.direction.transformDirection(m),u++}else if(S.isSpotLight){const x=n.spot[f];x.position.setFromMatrixPosition(S.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(S.matrixWorld),i.setFromMatrixPosition(S.target.matrixWorld),x.direction.sub(i),x.direction.transformDirection(m),f++}else if(S.isRectAreaLight){const x=n.rectArea[g];x.position.setFromMatrixPosition(S.matrixWorld),x.position.applyMatrix4(m),a.identity(),r.copy(S.matrixWorld),r.premultiply(m),a.extractRotation(r),x.halfWidth.set(S.width*.5,0,0),x.halfHeight.set(0,S.height*.5,0),x.halfWidth.applyMatrix4(a),x.halfHeight.applyMatrix4(a),g++}else if(S.isPointLight){const x=n.point[d];x.position.setFromMatrixPosition(S.matrixWorld),x.position.applyMatrix4(m),d++}else if(S.isHemisphereLight){const x=n.hemi[_];x.direction.setFromMatrixPosition(S.matrixWorld),x.direction.transformDirection(m),_++}}}return{setup:o,setupView:l,state:n}}function Qo(s){const t=new dm(s),e=[],n=[];function i(h){c.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function a(h){n.push(h)}function o(){t.setup(e)}function l(h){t.setupView(e,h)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:i,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function fm(s){let t=new WeakMap;function e(i,r=0){const a=t.get(i);let o;return a===void 0?(o=new Qo(s),t.set(i,[o])):r>=a.length?(o=new Qo(s),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}class pm extends ii{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=$c,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class mm extends ii{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const gm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,_m=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function vm(s,t,e){let n=new ka;const i=new Mt,r=new Mt,a=new ie,o=new pm({depthPacking:Kc}),l=new mm,c={},h=e.maxTextureSize,u={[Bn]:Re,[Re]:Bn,[Ue]:Ue},d=new ye({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Mt},radius:{value:4}},vertexShader:gm,fragmentShader:_m}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new de;g.setAttribute("position",new se(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Ut(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Cl;let p=this.type;this.render=function(C,b,R){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||C.length===0)return;const E=s.getRenderTarget(),v=s.getActiveCubeFace(),L=s.getActiveMipmapLevel(),U=s.state;U.setBlending(yn),U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const O=p!==_n&&this.type===_n,X=p===_n&&this.type!==_n;for(let q=0,V=C.length;q<V;q++){const $=C[q],H=$.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;i.copy(H.mapSize);const nt=H.getFrameExtents();if(i.multiply(nt),r.copy(H.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/nt.x),i.x=r.x*nt.x,H.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/nt.y),i.y=r.y*nt.y,H.mapSize.y=r.y)),H.map===null||O===!0||X===!0){const lt=this.type!==_n?{minFilter:We,magFilter:We}:{};H.map!==null&&H.map.dispose(),H.map=new Ke(i.x,i.y,lt),H.map.texture.name=$.name+".shadowMap",H.camera.updateProjectionMatrix()}s.setRenderTarget(H.map),s.clear();const it=H.getViewportCount();for(let lt=0;lt<it;lt++){const Rt=H.getViewport(lt);a.set(r.x*Rt.x,r.y*Rt.y,r.x*Rt.z,r.y*Rt.w),U.viewport(a),H.updateMatrices($,lt),n=H.getFrustum(),x(b,R,H.camera,$,this.type)}H.isPointLightShadow!==!0&&this.type===_n&&y(H,R),H.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(E,v,L)};function y(C,b){const R=t.update(_);d.defines.VSM_SAMPLES!==C.blurSamples&&(d.defines.VSM_SAMPLES=C.blurSamples,f.defines.VSM_SAMPLES=C.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new Ke(i.x,i.y)),d.uniforms.shadow_pass.value=C.map.texture,d.uniforms.resolution.value=C.mapSize,d.uniforms.radius.value=C.radius,s.setRenderTarget(C.mapPass),s.clear(),s.renderBufferDirect(b,null,R,d,_,null),f.uniforms.shadow_pass.value=C.mapPass.texture,f.uniforms.resolution.value=C.mapSize,f.uniforms.radius.value=C.radius,s.setRenderTarget(C.map),s.clear(),s.renderBufferDirect(b,null,R,f,_,null)}function S(C,b,R,E){let v=null;const L=R.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(L!==void 0)v=L;else if(v=R.isPointLight===!0?l:o,s.localClippingEnabled&&b.clipShadows===!0&&Array.isArray(b.clippingPlanes)&&b.clippingPlanes.length!==0||b.displacementMap&&b.displacementScale!==0||b.alphaMap&&b.alphaTest>0||b.map&&b.alphaTest>0){const U=v.uuid,O=b.uuid;let X=c[U];X===void 0&&(X={},c[U]=X);let q=X[O];q===void 0&&(q=v.clone(),X[O]=q,b.addEventListener("dispose",D)),v=q}if(v.visible=b.visible,v.wireframe=b.wireframe,E===_n?v.side=b.shadowSide!==null?b.shadowSide:b.side:v.side=b.shadowSide!==null?b.shadowSide:u[b.side],v.alphaMap=b.alphaMap,v.alphaTest=b.alphaTest,v.map=b.map,v.clipShadows=b.clipShadows,v.clippingPlanes=b.clippingPlanes,v.clipIntersection=b.clipIntersection,v.displacementMap=b.displacementMap,v.displacementScale=b.displacementScale,v.displacementBias=b.displacementBias,v.wireframeLinewidth=b.wireframeLinewidth,v.linewidth=b.linewidth,R.isPointLight===!0&&v.isMeshDistanceMaterial===!0){const U=s.properties.get(v);U.light=R}return v}function x(C,b,R,E,v){if(C.visible===!1)return;if(C.layers.test(b.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&v===_n)&&(!C.frustumCulled||n.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,C.matrixWorld);const O=t.update(C),X=C.material;if(Array.isArray(X)){const q=O.groups;for(let V=0,$=q.length;V<$;V++){const H=q[V],nt=X[H.materialIndex];if(nt&&nt.visible){const it=S(C,nt,E,v);C.onBeforeShadow(s,C,b,R,O,it,H),s.renderBufferDirect(R,null,O,it,C,H),C.onAfterShadow(s,C,b,R,O,it,H)}}}else if(X.visible){const q=S(C,X,E,v);C.onBeforeShadow(s,C,b,R,O,q,null),s.renderBufferDirect(R,null,O,q,C,null),C.onAfterShadow(s,C,b,R,O,q,null)}}const U=C.children;for(let O=0,X=U.length;O<X;O++)x(U[O],b,R,E,v)}function D(C){C.target.removeEventListener("dispose",D);for(const R in c){const E=c[R],v=C.target.uuid;v in E&&(E[v].dispose(),delete E[v])}}}const xm={[Hr]:Vr,[Wr]:Yr,[Xr]:$r,[wi]:qr,[Vr]:Hr,[Yr]:Wr,[$r]:Xr,[qr]:wi};function Mm(s,t){function e(){let I=!1;const at=new ie;let W=null;const j=new ie(0,0,0,0);return{setMask:function(ut){W!==ut&&!I&&(s.colorMask(ut,ut,ut,ut),W=ut)},setLocked:function(ut){I=ut},setClear:function(ut,ct,Ft,fe,Se){Se===!0&&(ut*=fe,ct*=fe,Ft*=fe),at.set(ut,ct,Ft,fe),j.equals(at)===!1&&(s.clearColor(ut,ct,Ft,fe),j.copy(at))},reset:function(){I=!1,W=null,j.set(-1,0,0,0)}}}function n(){let I=!1,at=!1,W=null,j=null,ut=null;return{setReversed:function(ct){if(at!==ct){const Ft=t.get("EXT_clip_control");at?Ft.clipControlEXT(Ft.LOWER_LEFT_EXT,Ft.ZERO_TO_ONE_EXT):Ft.clipControlEXT(Ft.LOWER_LEFT_EXT,Ft.NEGATIVE_ONE_TO_ONE_EXT);const fe=ut;ut=null,this.setClear(fe)}at=ct},getReversed:function(){return at},setTest:function(ct){ct?rt(s.DEPTH_TEST):Tt(s.DEPTH_TEST)},setMask:function(ct){W!==ct&&!I&&(s.depthMask(ct),W=ct)},setFunc:function(ct){if(at&&(ct=xm[ct]),j!==ct){switch(ct){case Hr:s.depthFunc(s.NEVER);break;case Vr:s.depthFunc(s.ALWAYS);break;case Wr:s.depthFunc(s.LESS);break;case wi:s.depthFunc(s.LEQUAL);break;case Xr:s.depthFunc(s.EQUAL);break;case qr:s.depthFunc(s.GEQUAL);break;case Yr:s.depthFunc(s.GREATER);break;case $r:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}j=ct}},setLocked:function(ct){I=ct},setClear:function(ct){ut!==ct&&(at&&(ct=1-ct),s.clearDepth(ct),ut=ct)},reset:function(){I=!1,W=null,j=null,ut=null,at=!1}}}function i(){let I=!1,at=null,W=null,j=null,ut=null,ct=null,Ft=null,fe=null,Se=null;return{setTest:function(ee){I||(ee?rt(s.STENCIL_TEST):Tt(s.STENCIL_TEST))},setMask:function(ee){at!==ee&&!I&&(s.stencilMask(ee),at=ee)},setFunc:function(ee,Ze,hn){(W!==ee||j!==Ze||ut!==hn)&&(s.stencilFunc(ee,Ze,hn),W=ee,j=Ze,ut=hn)},setOp:function(ee,Ze,hn){(ct!==ee||Ft!==Ze||fe!==hn)&&(s.stencilOp(ee,Ze,hn),ct=ee,Ft=Ze,fe=hn)},setLocked:function(ee){I=ee},setClear:function(ee){Se!==ee&&(s.clearStencil(ee),Se=ee)},reset:function(){I=!1,at=null,W=null,j=null,ut=null,ct=null,Ft=null,fe=null,Se=null}}}const r=new e,a=new n,o=new i,l=new WeakMap,c=new WeakMap;let h={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,y=null,S=null,x=null,D=null,C=null,b=new bt(0,0,0),R=0,E=!1,v=null,L=null,U=null,O=null,X=null;const q=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let V=!1,$=0;const H=s.getParameter(s.VERSION);H.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(H)[1]),V=$>=1):H.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),V=$>=2);let nt=null,it={};const lt=s.getParameter(s.SCISSOR_BOX),Rt=s.getParameter(s.VIEWPORT),Wt=new ie().fromArray(lt),Y=new ie().fromArray(Rt);function Q(I,at,W,j){const ut=new Uint8Array(4),ct=s.createTexture();s.bindTexture(I,ct),s.texParameteri(I,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(I,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Ft=0;Ft<W;Ft++)I===s.TEXTURE_3D||I===s.TEXTURE_2D_ARRAY?s.texImage3D(at,0,s.RGBA,1,1,j,0,s.RGBA,s.UNSIGNED_BYTE,ut):s.texImage2D(at+Ft,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,ut);return ct}const ft={};ft[s.TEXTURE_2D]=Q(s.TEXTURE_2D,s.TEXTURE_2D,1),ft[s.TEXTURE_CUBE_MAP]=Q(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),ft[s.TEXTURE_2D_ARRAY]=Q(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),ft[s.TEXTURE_3D]=Q(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),rt(s.DEPTH_TEST),a.setFunc(wi),It(!1),Nt(io),rt(s.CULL_FACE),B(yn);function rt(I){h[I]!==!0&&(s.enable(I),h[I]=!0)}function Tt(I){h[I]!==!1&&(s.disable(I),h[I]=!1)}function Lt(I,at){return u[I]!==at?(s.bindFramebuffer(I,at),u[I]=at,I===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=at),I===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=at),!0):!1}function Ht(I,at){let W=f,j=!1;if(I){W=d.get(at),W===void 0&&(W=[],d.set(at,W));const ut=I.textures;if(W.length!==ut.length||W[0]!==s.COLOR_ATTACHMENT0){for(let ct=0,Ft=ut.length;ct<Ft;ct++)W[ct]=s.COLOR_ATTACHMENT0+ct;W.length=ut.length,j=!0}}else W[0]!==s.BACK&&(W[0]=s.BACK,j=!0);j&&s.drawBuffers(W)}function le(I){return g!==I?(s.useProgram(I),g=I,!0):!1}const Xt={[Kn]:s.FUNC_ADD,[yc]:s.FUNC_SUBTRACT,[Sc]:s.FUNC_REVERSE_SUBTRACT};Xt[Ec]=s.MIN,Xt[wc]=s.MAX;const ue={[bc]:s.ZERO,[Tc]:s.ONE,[Ac]:s.SRC_COLOR,[kr]:s.SRC_ALPHA,[Ic]:s.SRC_ALPHA_SATURATE,[Lc]:s.DST_COLOR,[Rc]:s.DST_ALPHA,[Cc]:s.ONE_MINUS_SRC_COLOR,[Gr]:s.ONE_MINUS_SRC_ALPHA,[Dc]:s.ONE_MINUS_DST_COLOR,[Pc]:s.ONE_MINUS_DST_ALPHA,[Uc]:s.CONSTANT_COLOR,[Nc]:s.ONE_MINUS_CONSTANT_COLOR,[Fc]:s.CONSTANT_ALPHA,[Bc]:s.ONE_MINUS_CONSTANT_ALPHA};function B(I,at,W,j,ut,ct,Ft,fe,Se,ee){if(I===yn){_===!0&&(Tt(s.BLEND),_=!1);return}if(_===!1&&(rt(s.BLEND),_=!0),I!==Mc){if(I!==m||ee!==E){if((p!==Kn||x!==Kn)&&(s.blendEquation(s.FUNC_ADD),p=Kn,x=Kn),ee)switch(I){case Nn:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Zi:s.blendFunc(s.ONE,s.ONE);break;case so:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case ro:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case Nn:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Zi:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case so:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case ro:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}y=null,S=null,D=null,C=null,b.set(0,0,0),R=0,m=I,E=ee}return}ut=ut||at,ct=ct||W,Ft=Ft||j,(at!==p||ut!==x)&&(s.blendEquationSeparate(Xt[at],Xt[ut]),p=at,x=ut),(W!==y||j!==S||ct!==D||Ft!==C)&&(s.blendFuncSeparate(ue[W],ue[j],ue[ct],ue[Ft]),y=W,S=j,D=ct,C=Ft),(fe.equals(b)===!1||Se!==R)&&(s.blendColor(fe.r,fe.g,fe.b,Se),b.copy(fe),R=Se),m=I,E=!1}function Yt(I,at){I.side===Ue?Tt(s.CULL_FACE):rt(s.CULL_FACE);let W=I.side===Re;at&&(W=!W),It(W),I.blending===Nn&&I.transparent===!1?B(yn):B(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),a.setFunc(I.depthFunc),a.setTest(I.depthTest),a.setMask(I.depthWrite),r.setMask(I.colorWrite);const j=I.stencilWrite;o.setTest(j),j&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),Jt(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?rt(s.SAMPLE_ALPHA_TO_COVERAGE):Tt(s.SAMPLE_ALPHA_TO_COVERAGE)}function It(I){v!==I&&(I?s.frontFace(s.CW):s.frontFace(s.CCW),v=I)}function Nt(I){I!==vc?(rt(s.CULL_FACE),I!==L&&(I===io?s.cullFace(s.BACK):I===xc?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Tt(s.CULL_FACE),L=I}function wt(I){I!==U&&(V&&s.lineWidth(I),U=I)}function Jt(I,at,W){I?(rt(s.POLYGON_OFFSET_FILL),(O!==at||X!==W)&&(s.polygonOffset(at,W),O=at,X=W)):Tt(s.POLYGON_OFFSET_FILL)}function yt(I){I?rt(s.SCISSOR_TEST):Tt(s.SCISSOR_TEST)}function A(I){I===void 0&&(I=s.TEXTURE0+q-1),nt!==I&&(s.activeTexture(I),nt=I)}function M(I,at,W){W===void 0&&(nt===null?W=s.TEXTURE0+q-1:W=nt);let j=it[W];j===void 0&&(j={type:void 0,texture:void 0},it[W]=j),(j.type!==I||j.texture!==at)&&(nt!==W&&(s.activeTexture(W),nt=W),s.bindTexture(I,at||ft[I]),j.type=I,j.texture=at)}function z(){const I=it[nt];I!==void 0&&I.type!==void 0&&(s.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function Z(){try{s.compressedTexImage2D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function J(){try{s.compressedTexImage3D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function K(){try{s.texSubImage2D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function St(){try{s.texSubImage3D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ot(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function dt(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function $t(){try{s.texStorage2D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function tt(){try{s.texStorage3D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function pt(){try{s.texImage2D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function At(){try{s.texImage3D.apply(s,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Pt(I){Wt.equals(I)===!1&&(s.scissor(I.x,I.y,I.z,I.w),Wt.copy(I))}function mt(I){Y.equals(I)===!1&&(s.viewport(I.x,I.y,I.z,I.w),Y.copy(I))}function qt(I,at){let W=c.get(at);W===void 0&&(W=new WeakMap,c.set(at,W));let j=W.get(I);j===void 0&&(j=s.getUniformBlockIndex(at,I.name),W.set(I,j))}function kt(I,at){const j=c.get(at).get(I);l.get(at)!==j&&(s.uniformBlockBinding(at,j,I.__bindingPointIndex),l.set(at,j))}function ae(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),h={},nt=null,it={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,y=null,S=null,x=null,D=null,C=null,b=new bt(0,0,0),R=0,E=!1,v=null,L=null,U=null,O=null,X=null,Wt.set(0,0,s.canvas.width,s.canvas.height),Y.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:rt,disable:Tt,bindFramebuffer:Lt,drawBuffers:Ht,useProgram:le,setBlending:B,setMaterial:Yt,setFlipSided:It,setCullFace:Nt,setLineWidth:wt,setPolygonOffset:Jt,setScissorTest:yt,activeTexture:A,bindTexture:M,unbindTexture:z,compressedTexImage2D:Z,compressedTexImage3D:J,texImage2D:pt,texImage3D:At,updateUBOMapping:qt,uniformBlockBinding:kt,texStorage2D:$t,texStorage3D:tt,texSubImage2D:K,texSubImage3D:St,compressedTexSubImage2D:ot,compressedTexSubImage3D:dt,scissor:Pt,viewport:mt,reset:ae}}function tl(s,t,e,n){const i=ym(n);switch(e){case Nl:return s*t;case Bl:return s*t;case Ol:return s*t*2;case Ua:return s*t/i.components*i.byteLength;case Na:return s*t/i.components*i.byteLength;case zl:return s*t*2/i.components*i.byteLength;case Fa:return s*t*2/i.components*i.byteLength;case Fl:return s*t*3/i.components*i.byteLength;case nn:return s*t*4/i.components*i.byteLength;case Ba:return s*t*4/i.components*i.byteLength;case zs:case ks:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Gs:case Hs:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Qr:case ea:return Math.max(s,16)*Math.max(t,8)/4;case Jr:case ta:return Math.max(s,8)*Math.max(t,8)/2;case na:case ia:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case sa:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case ra:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case aa:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case oa:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case la:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case ca:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case ha:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case ua:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case da:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case fa:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case pa:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case ma:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case ga:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case _a:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case va:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case Vs:case xa:case Ma:return Math.ceil(s/4)*Math.ceil(t/4)*16;case kl:case ya:return Math.ceil(s/4)*Math.ceil(t/4)*8;case Sa:case Ea:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function ym(s){switch(s){case wn:case Dl:return{byteLength:1,components:1};case ji:case Il:case cn:return{byteLength:2,components:1};case Da:case Ia:return{byteLength:2,components:4};case ti:case La:case ln:return{byteLength:4,components:1};case Ul:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}function Sm(s,t,e,n,i,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Mt,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,M){return f?new OffscreenCanvas(A,M):Ys("canvas")}function _(A,M,z){let Z=1;const J=yt(A);if((J.width>z||J.height>z)&&(Z=z/Math.max(J.width,J.height)),Z<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const K=Math.floor(Z*J.width),St=Math.floor(Z*J.height);u===void 0&&(u=g(K,St));const ot=M?g(K,St):u;return ot.width=K,ot.height=St,ot.getContext("2d").drawImage(A,0,0,K,St),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+J.width+"x"+J.height+") to ("+K+"x"+St+")."),ot}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+J.width+"x"+J.height+")."),A;return A}function m(A){return A.generateMipmaps}function p(A){s.generateMipmap(A)}function y(A){return A.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?s.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function S(A,M,z,Z,J=!1){if(A!==null){if(s[A]!==void 0)return s[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let K=M;if(M===s.RED&&(z===s.FLOAT&&(K=s.R32F),z===s.HALF_FLOAT&&(K=s.R16F),z===s.UNSIGNED_BYTE&&(K=s.R8)),M===s.RED_INTEGER&&(z===s.UNSIGNED_BYTE&&(K=s.R8UI),z===s.UNSIGNED_SHORT&&(K=s.R16UI),z===s.UNSIGNED_INT&&(K=s.R32UI),z===s.BYTE&&(K=s.R8I),z===s.SHORT&&(K=s.R16I),z===s.INT&&(K=s.R32I)),M===s.RG&&(z===s.FLOAT&&(K=s.RG32F),z===s.HALF_FLOAT&&(K=s.RG16F),z===s.UNSIGNED_BYTE&&(K=s.RG8)),M===s.RG_INTEGER&&(z===s.UNSIGNED_BYTE&&(K=s.RG8UI),z===s.UNSIGNED_SHORT&&(K=s.RG16UI),z===s.UNSIGNED_INT&&(K=s.RG32UI),z===s.BYTE&&(K=s.RG8I),z===s.SHORT&&(K=s.RG16I),z===s.INT&&(K=s.RG32I)),M===s.RGB_INTEGER&&(z===s.UNSIGNED_BYTE&&(K=s.RGB8UI),z===s.UNSIGNED_SHORT&&(K=s.RGB16UI),z===s.UNSIGNED_INT&&(K=s.RGB32UI),z===s.BYTE&&(K=s.RGB8I),z===s.SHORT&&(K=s.RGB16I),z===s.INT&&(K=s.RGB32I)),M===s.RGBA_INTEGER&&(z===s.UNSIGNED_BYTE&&(K=s.RGBA8UI),z===s.UNSIGNED_SHORT&&(K=s.RGBA16UI),z===s.UNSIGNED_INT&&(K=s.RGBA32UI),z===s.BYTE&&(K=s.RGBA8I),z===s.SHORT&&(K=s.RGBA16I),z===s.INT&&(K=s.RGBA32I)),M===s.RGB&&z===s.UNSIGNED_INT_5_9_9_9_REV&&(K=s.RGB9_E5),M===s.RGBA){const St=J?Js:Kt.getTransfer(Z);z===s.FLOAT&&(K=s.RGBA32F),z===s.HALF_FLOAT&&(K=s.RGBA16F),z===s.UNSIGNED_BYTE&&(K=St===ne?s.SRGB8_ALPHA8:s.RGBA8),z===s.UNSIGNED_SHORT_4_4_4_4&&(K=s.RGBA4),z===s.UNSIGNED_SHORT_5_5_5_1&&(K=s.RGB5_A1)}return(K===s.R16F||K===s.R32F||K===s.RG16F||K===s.RG32F||K===s.RGBA16F||K===s.RGBA32F)&&t.get("EXT_color_buffer_float"),K}function x(A,M){let z;return A?M===null||M===ti||M===Ai?z=s.DEPTH24_STENCIL8:M===ln?z=s.DEPTH32F_STENCIL8:M===ji&&(z=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===ti||M===Ai?z=s.DEPTH_COMPONENT24:M===ln?z=s.DEPTH_COMPONENT32F:M===ji&&(z=s.DEPTH_COMPONENT16),z}function D(A,M){return m(A)===!0||A.isFramebufferTexture&&A.minFilter!==We&&A.minFilter!==on?Math.log2(Math.max(M.width,M.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?M.mipmaps.length:1}function C(A){const M=A.target;M.removeEventListener("dispose",C),R(M),M.isVideoTexture&&h.delete(M)}function b(A){const M=A.target;M.removeEventListener("dispose",b),v(M)}function R(A){const M=n.get(A);if(M.__webglInit===void 0)return;const z=A.source,Z=d.get(z);if(Z){const J=Z[M.__cacheKey];J.usedTimes--,J.usedTimes===0&&E(A),Object.keys(Z).length===0&&d.delete(z)}n.remove(A)}function E(A){const M=n.get(A);s.deleteTexture(M.__webglTexture);const z=A.source,Z=d.get(z);delete Z[M.__cacheKey],a.memory.textures--}function v(A){const M=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(M.__webglFramebuffer[Z]))for(let J=0;J<M.__webglFramebuffer[Z].length;J++)s.deleteFramebuffer(M.__webglFramebuffer[Z][J]);else s.deleteFramebuffer(M.__webglFramebuffer[Z]);M.__webglDepthbuffer&&s.deleteRenderbuffer(M.__webglDepthbuffer[Z])}else{if(Array.isArray(M.__webglFramebuffer))for(let Z=0;Z<M.__webglFramebuffer.length;Z++)s.deleteFramebuffer(M.__webglFramebuffer[Z]);else s.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&s.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&s.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let Z=0;Z<M.__webglColorRenderbuffer.length;Z++)M.__webglColorRenderbuffer[Z]&&s.deleteRenderbuffer(M.__webglColorRenderbuffer[Z]);M.__webglDepthRenderbuffer&&s.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const z=A.textures;for(let Z=0,J=z.length;Z<J;Z++){const K=n.get(z[Z]);K.__webglTexture&&(s.deleteTexture(K.__webglTexture),a.memory.textures--),n.remove(z[Z])}n.remove(A)}let L=0;function U(){L=0}function O(){const A=L;return A>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+i.maxTextures),L+=1,A}function X(A){const M=[];return M.push(A.wrapS),M.push(A.wrapT),M.push(A.wrapR||0),M.push(A.magFilter),M.push(A.minFilter),M.push(A.anisotropy),M.push(A.internalFormat),M.push(A.format),M.push(A.type),M.push(A.generateMipmaps),M.push(A.premultiplyAlpha),M.push(A.flipY),M.push(A.unpackAlignment),M.push(A.colorSpace),M.join()}function q(A,M){const z=n.get(A);if(A.isVideoTexture&&wt(A),A.isRenderTargetTexture===!1&&A.version>0&&z.__version!==A.version){const Z=A.image;if(Z===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(z,A,M);return}}e.bindTexture(s.TEXTURE_2D,z.__webglTexture,s.TEXTURE0+M)}function V(A,M){const z=n.get(A);if(A.version>0&&z.__version!==A.version){Y(z,A,M);return}e.bindTexture(s.TEXTURE_2D_ARRAY,z.__webglTexture,s.TEXTURE0+M)}function $(A,M){const z=n.get(A);if(A.version>0&&z.__version!==A.version){Y(z,A,M);return}e.bindTexture(s.TEXTURE_3D,z.__webglTexture,s.TEXTURE0+M)}function H(A,M){const z=n.get(A);if(A.version>0&&z.__version!==A.version){Q(z,A,M);return}e.bindTexture(s.TEXTURE_CUBE_MAP,z.__webglTexture,s.TEXTURE0+M)}const nt={[Xs]:s.REPEAT,[De]:s.CLAMP_TO_EDGE,[jr]:s.MIRRORED_REPEAT},it={[We]:s.NEAREST,[Yc]:s.NEAREST_MIPMAP_NEAREST,[as]:s.NEAREST_MIPMAP_LINEAR,[on]:s.LINEAR,[er]:s.LINEAR_MIPMAP_NEAREST,[Jn]:s.LINEAR_MIPMAP_LINEAR},lt={[jc]:s.NEVER,[ih]:s.ALWAYS,[Jc]:s.LESS,[Hl]:s.LEQUAL,[Qc]:s.EQUAL,[nh]:s.GEQUAL,[th]:s.GREATER,[eh]:s.NOTEQUAL};function Rt(A,M){if(M.type===ln&&t.has("OES_texture_float_linear")===!1&&(M.magFilter===on||M.magFilter===er||M.magFilter===as||M.magFilter===Jn||M.minFilter===on||M.minFilter===er||M.minFilter===as||M.minFilter===Jn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(A,s.TEXTURE_WRAP_S,nt[M.wrapS]),s.texParameteri(A,s.TEXTURE_WRAP_T,nt[M.wrapT]),(A===s.TEXTURE_3D||A===s.TEXTURE_2D_ARRAY)&&s.texParameteri(A,s.TEXTURE_WRAP_R,nt[M.wrapR]),s.texParameteri(A,s.TEXTURE_MAG_FILTER,it[M.magFilter]),s.texParameteri(A,s.TEXTURE_MIN_FILTER,it[M.minFilter]),M.compareFunction&&(s.texParameteri(A,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(A,s.TEXTURE_COMPARE_FUNC,lt[M.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===We||M.minFilter!==as&&M.minFilter!==Jn||M.type===ln&&t.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){const z=t.get("EXT_texture_filter_anisotropic");s.texParameterf(A,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,i.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function Wt(A,M){let z=!1;A.__webglInit===void 0&&(A.__webglInit=!0,M.addEventListener("dispose",C));const Z=M.source;let J=d.get(Z);J===void 0&&(J={},d.set(Z,J));const K=X(M);if(K!==A.__cacheKey){J[K]===void 0&&(J[K]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,z=!0),J[K].usedTimes++;const St=J[A.__cacheKey];St!==void 0&&(J[A.__cacheKey].usedTimes--,St.usedTimes===0&&E(M)),A.__cacheKey=K,A.__webglTexture=J[K].texture}return z}function Y(A,M,z){let Z=s.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(Z=s.TEXTURE_2D_ARRAY),M.isData3DTexture&&(Z=s.TEXTURE_3D);const J=Wt(A,M),K=M.source;e.bindTexture(Z,A.__webglTexture,s.TEXTURE0+z);const St=n.get(K);if(K.version!==St.__version||J===!0){e.activeTexture(s.TEXTURE0+z);const ot=Kt.getPrimaries(Kt.workingColorSpace),dt=M.colorSpace===xn?null:Kt.getPrimaries(M.colorSpace),$t=M.colorSpace===xn||ot===dt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,M.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,M.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,$t);let tt=_(M.image,!1,i.maxTextureSize);tt=Jt(M,tt);const pt=r.convert(M.format,M.colorSpace),At=r.convert(M.type);let Pt=S(M.internalFormat,pt,At,M.colorSpace,M.isVideoTexture);Rt(Z,M);let mt;const qt=M.mipmaps,kt=M.isVideoTexture!==!0,ae=St.__version===void 0||J===!0,I=K.dataReady,at=D(M,tt);if(M.isDepthTexture)Pt=x(M.format===Ci,M.type),ae&&(kt?e.texStorage2D(s.TEXTURE_2D,1,Pt,tt.width,tt.height):e.texImage2D(s.TEXTURE_2D,0,Pt,tt.width,tt.height,0,pt,At,null));else if(M.isDataTexture)if(qt.length>0){kt&&ae&&e.texStorage2D(s.TEXTURE_2D,at,Pt,qt[0].width,qt[0].height);for(let W=0,j=qt.length;W<j;W++)mt=qt[W],kt?I&&e.texSubImage2D(s.TEXTURE_2D,W,0,0,mt.width,mt.height,pt,At,mt.data):e.texImage2D(s.TEXTURE_2D,W,Pt,mt.width,mt.height,0,pt,At,mt.data);M.generateMipmaps=!1}else kt?(ae&&e.texStorage2D(s.TEXTURE_2D,at,Pt,tt.width,tt.height),I&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,tt.width,tt.height,pt,At,tt.data)):e.texImage2D(s.TEXTURE_2D,0,Pt,tt.width,tt.height,0,pt,At,tt.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){kt&&ae&&e.texStorage3D(s.TEXTURE_2D_ARRAY,at,Pt,qt[0].width,qt[0].height,tt.depth);for(let W=0,j=qt.length;W<j;W++)if(mt=qt[W],M.format!==nn)if(pt!==null)if(kt){if(I)if(M.layerUpdates.size>0){const ut=tl(mt.width,mt.height,M.format,M.type);for(const ct of M.layerUpdates){const Ft=mt.data.subarray(ct*ut/mt.data.BYTES_PER_ELEMENT,(ct+1)*ut/mt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,W,0,0,ct,mt.width,mt.height,1,pt,Ft)}M.clearLayerUpdates()}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,W,0,0,0,mt.width,mt.height,tt.depth,pt,mt.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,W,Pt,mt.width,mt.height,tt.depth,0,mt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else kt?I&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,W,0,0,0,mt.width,mt.height,tt.depth,pt,At,mt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,W,Pt,mt.width,mt.height,tt.depth,0,pt,At,mt.data)}else{kt&&ae&&e.texStorage2D(s.TEXTURE_2D,at,Pt,qt[0].width,qt[0].height);for(let W=0,j=qt.length;W<j;W++)mt=qt[W],M.format!==nn?pt!==null?kt?I&&e.compressedTexSubImage2D(s.TEXTURE_2D,W,0,0,mt.width,mt.height,pt,mt.data):e.compressedTexImage2D(s.TEXTURE_2D,W,Pt,mt.width,mt.height,0,mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):kt?I&&e.texSubImage2D(s.TEXTURE_2D,W,0,0,mt.width,mt.height,pt,At,mt.data):e.texImage2D(s.TEXTURE_2D,W,Pt,mt.width,mt.height,0,pt,At,mt.data)}else if(M.isDataArrayTexture)if(kt){if(ae&&e.texStorage3D(s.TEXTURE_2D_ARRAY,at,Pt,tt.width,tt.height,tt.depth),I)if(M.layerUpdates.size>0){const W=tl(tt.width,tt.height,M.format,M.type);for(const j of M.layerUpdates){const ut=tt.data.subarray(j*W/tt.data.BYTES_PER_ELEMENT,(j+1)*W/tt.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,j,tt.width,tt.height,1,pt,At,ut)}M.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,tt.width,tt.height,tt.depth,pt,At,tt.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,Pt,tt.width,tt.height,tt.depth,0,pt,At,tt.data);else if(M.isData3DTexture)kt?(ae&&e.texStorage3D(s.TEXTURE_3D,at,Pt,tt.width,tt.height,tt.depth),I&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,tt.width,tt.height,tt.depth,pt,At,tt.data)):e.texImage3D(s.TEXTURE_3D,0,Pt,tt.width,tt.height,tt.depth,0,pt,At,tt.data);else if(M.isFramebufferTexture){if(ae)if(kt)e.texStorage2D(s.TEXTURE_2D,at,Pt,tt.width,tt.height);else{let W=tt.width,j=tt.height;for(let ut=0;ut<at;ut++)e.texImage2D(s.TEXTURE_2D,ut,Pt,W,j,0,pt,At,null),W>>=1,j>>=1}}else if(qt.length>0){if(kt&&ae){const W=yt(qt[0]);e.texStorage2D(s.TEXTURE_2D,at,Pt,W.width,W.height)}for(let W=0,j=qt.length;W<j;W++)mt=qt[W],kt?I&&e.texSubImage2D(s.TEXTURE_2D,W,0,0,pt,At,mt):e.texImage2D(s.TEXTURE_2D,W,Pt,pt,At,mt);M.generateMipmaps=!1}else if(kt){if(ae){const W=yt(tt);e.texStorage2D(s.TEXTURE_2D,at,Pt,W.width,W.height)}I&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,pt,At,tt)}else e.texImage2D(s.TEXTURE_2D,0,Pt,pt,At,tt);m(M)&&p(Z),St.__version=K.version,M.onUpdate&&M.onUpdate(M)}A.__version=M.version}function Q(A,M,z){if(M.image.length!==6)return;const Z=Wt(A,M),J=M.source;e.bindTexture(s.TEXTURE_CUBE_MAP,A.__webglTexture,s.TEXTURE0+z);const K=n.get(J);if(J.version!==K.__version||Z===!0){e.activeTexture(s.TEXTURE0+z);const St=Kt.getPrimaries(Kt.workingColorSpace),ot=M.colorSpace===xn?null:Kt.getPrimaries(M.colorSpace),dt=M.colorSpace===xn||St===ot?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,M.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,M.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,dt);const $t=M.isCompressedTexture||M.image[0].isCompressedTexture,tt=M.image[0]&&M.image[0].isDataTexture,pt=[];for(let j=0;j<6;j++)!$t&&!tt?pt[j]=_(M.image[j],!0,i.maxCubemapSize):pt[j]=tt?M.image[j].image:M.image[j],pt[j]=Jt(M,pt[j]);const At=pt[0],Pt=r.convert(M.format,M.colorSpace),mt=r.convert(M.type),qt=S(M.internalFormat,Pt,mt,M.colorSpace),kt=M.isVideoTexture!==!0,ae=K.__version===void 0||Z===!0,I=J.dataReady;let at=D(M,At);Rt(s.TEXTURE_CUBE_MAP,M);let W;if($t){kt&&ae&&e.texStorage2D(s.TEXTURE_CUBE_MAP,at,qt,At.width,At.height);for(let j=0;j<6;j++){W=pt[j].mipmaps;for(let ut=0;ut<W.length;ut++){const ct=W[ut];M.format!==nn?Pt!==null?kt?I&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,ut,0,0,ct.width,ct.height,Pt,ct.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,ut,qt,ct.width,ct.height,0,ct.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):kt?I&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,ut,0,0,ct.width,ct.height,Pt,mt,ct.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,ut,qt,ct.width,ct.height,0,Pt,mt,ct.data)}}}else{if(W=M.mipmaps,kt&&ae){W.length>0&&at++;const j=yt(pt[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,at,qt,j.width,j.height)}for(let j=0;j<6;j++)if(tt){kt?I&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,pt[j].width,pt[j].height,Pt,mt,pt[j].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,qt,pt[j].width,pt[j].height,0,Pt,mt,pt[j].data);for(let ut=0;ut<W.length;ut++){const Ft=W[ut].image[j].image;kt?I&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,ut+1,0,0,Ft.width,Ft.height,Pt,mt,Ft.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,ut+1,qt,Ft.width,Ft.height,0,Pt,mt,Ft.data)}}else{kt?I&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Pt,mt,pt[j]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,qt,Pt,mt,pt[j]);for(let ut=0;ut<W.length;ut++){const ct=W[ut];kt?I&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,ut+1,0,0,Pt,mt,ct.image[j]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,ut+1,qt,Pt,mt,ct.image[j])}}}m(M)&&p(s.TEXTURE_CUBE_MAP),K.__version=J.version,M.onUpdate&&M.onUpdate(M)}A.__version=M.version}function ft(A,M,z,Z,J,K){const St=r.convert(z.format,z.colorSpace),ot=r.convert(z.type),dt=S(z.internalFormat,St,ot,z.colorSpace),$t=n.get(M),tt=n.get(z);if(tt.__renderTarget=M,!$t.__hasExternalTextures){const pt=Math.max(1,M.width>>K),At=Math.max(1,M.height>>K);J===s.TEXTURE_3D||J===s.TEXTURE_2D_ARRAY?e.texImage3D(J,K,dt,pt,At,M.depth,0,St,ot,null):e.texImage2D(J,K,dt,pt,At,0,St,ot,null)}e.bindFramebuffer(s.FRAMEBUFFER,A),Nt(M)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,Z,J,tt.__webglTexture,0,It(M)):(J===s.TEXTURE_2D||J>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&J<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,Z,J,tt.__webglTexture,K),e.bindFramebuffer(s.FRAMEBUFFER,null)}function rt(A,M,z){if(s.bindRenderbuffer(s.RENDERBUFFER,A),M.depthBuffer){const Z=M.depthTexture,J=Z&&Z.isDepthTexture?Z.type:null,K=x(M.stencilBuffer,J),St=M.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ot=It(M);Nt(M)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ot,K,M.width,M.height):z?s.renderbufferStorageMultisample(s.RENDERBUFFER,ot,K,M.width,M.height):s.renderbufferStorage(s.RENDERBUFFER,K,M.width,M.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,St,s.RENDERBUFFER,A)}else{const Z=M.textures;for(let J=0;J<Z.length;J++){const K=Z[J],St=r.convert(K.format,K.colorSpace),ot=r.convert(K.type),dt=S(K.internalFormat,St,ot,K.colorSpace),$t=It(M);z&&Nt(M)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,$t,dt,M.width,M.height):Nt(M)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,$t,dt,M.width,M.height):s.renderbufferStorage(s.RENDERBUFFER,dt,M.width,M.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Tt(A,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,A),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Z=n.get(M.depthTexture);Z.__renderTarget=M,(!Z.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),q(M.depthTexture,0);const J=Z.__webglTexture,K=It(M);if(M.depthTexture.format===Si)Nt(M)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,J,0,K):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,J,0);else if(M.depthTexture.format===Ci)Nt(M)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,J,0,K):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function Lt(A){const M=n.get(A),z=A.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==A.depthTexture){const Z=A.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),Z){const J=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,Z.removeEventListener("dispose",J)};Z.addEventListener("dispose",J),M.__depthDisposeCallback=J}M.__boundDepthTexture=Z}if(A.depthTexture&&!M.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");Tt(M.__webglFramebuffer,A)}else if(z){M.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(e.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer[Z]),M.__webglDepthbuffer[Z]===void 0)M.__webglDepthbuffer[Z]=s.createRenderbuffer(),rt(M.__webglDepthbuffer[Z],A,!1);else{const J=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,K=M.__webglDepthbuffer[Z];s.bindRenderbuffer(s.RENDERBUFFER,K),s.framebufferRenderbuffer(s.FRAMEBUFFER,J,s.RENDERBUFFER,K)}}else if(e.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=s.createRenderbuffer(),rt(M.__webglDepthbuffer,A,!1);else{const Z=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,J=M.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,J),s.framebufferRenderbuffer(s.FRAMEBUFFER,Z,s.RENDERBUFFER,J)}e.bindFramebuffer(s.FRAMEBUFFER,null)}function Ht(A,M,z){const Z=n.get(A);M!==void 0&&ft(Z.__webglFramebuffer,A,A.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),z!==void 0&&Lt(A)}function le(A){const M=A.texture,z=n.get(A),Z=n.get(M);A.addEventListener("dispose",b);const J=A.textures,K=A.isWebGLCubeRenderTarget===!0,St=J.length>1;if(St||(Z.__webglTexture===void 0&&(Z.__webglTexture=s.createTexture()),Z.__version=M.version,a.memory.textures++),K){z.__webglFramebuffer=[];for(let ot=0;ot<6;ot++)if(M.mipmaps&&M.mipmaps.length>0){z.__webglFramebuffer[ot]=[];for(let dt=0;dt<M.mipmaps.length;dt++)z.__webglFramebuffer[ot][dt]=s.createFramebuffer()}else z.__webglFramebuffer[ot]=s.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){z.__webglFramebuffer=[];for(let ot=0;ot<M.mipmaps.length;ot++)z.__webglFramebuffer[ot]=s.createFramebuffer()}else z.__webglFramebuffer=s.createFramebuffer();if(St)for(let ot=0,dt=J.length;ot<dt;ot++){const $t=n.get(J[ot]);$t.__webglTexture===void 0&&($t.__webglTexture=s.createTexture(),a.memory.textures++)}if(A.samples>0&&Nt(A)===!1){z.__webglMultisampledFramebuffer=s.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let ot=0;ot<J.length;ot++){const dt=J[ot];z.__webglColorRenderbuffer[ot]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,z.__webglColorRenderbuffer[ot]);const $t=r.convert(dt.format,dt.colorSpace),tt=r.convert(dt.type),pt=S(dt.internalFormat,$t,tt,dt.colorSpace,A.isXRRenderTarget===!0),At=It(A);s.renderbufferStorageMultisample(s.RENDERBUFFER,At,pt,A.width,A.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ot,s.RENDERBUFFER,z.__webglColorRenderbuffer[ot])}s.bindRenderbuffer(s.RENDERBUFFER,null),A.depthBuffer&&(z.__webglDepthRenderbuffer=s.createRenderbuffer(),rt(z.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(K){e.bindTexture(s.TEXTURE_CUBE_MAP,Z.__webglTexture),Rt(s.TEXTURE_CUBE_MAP,M);for(let ot=0;ot<6;ot++)if(M.mipmaps&&M.mipmaps.length>0)for(let dt=0;dt<M.mipmaps.length;dt++)ft(z.__webglFramebuffer[ot][dt],A,M,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,dt);else ft(z.__webglFramebuffer[ot],A,M,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0);m(M)&&p(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(St){for(let ot=0,dt=J.length;ot<dt;ot++){const $t=J[ot],tt=n.get($t);e.bindTexture(s.TEXTURE_2D,tt.__webglTexture),Rt(s.TEXTURE_2D,$t),ft(z.__webglFramebuffer,A,$t,s.COLOR_ATTACHMENT0+ot,s.TEXTURE_2D,0),m($t)&&p(s.TEXTURE_2D)}e.unbindTexture()}else{let ot=s.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(ot=A.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(ot,Z.__webglTexture),Rt(ot,M),M.mipmaps&&M.mipmaps.length>0)for(let dt=0;dt<M.mipmaps.length;dt++)ft(z.__webglFramebuffer[dt],A,M,s.COLOR_ATTACHMENT0,ot,dt);else ft(z.__webglFramebuffer,A,M,s.COLOR_ATTACHMENT0,ot,0);m(M)&&p(ot),e.unbindTexture()}A.depthBuffer&&Lt(A)}function Xt(A){const M=A.textures;for(let z=0,Z=M.length;z<Z;z++){const J=M[z];if(m(J)){const K=y(A),St=n.get(J).__webglTexture;e.bindTexture(K,St),p(K),e.unbindTexture()}}}const ue=[],B=[];function Yt(A){if(A.samples>0){if(Nt(A)===!1){const M=A.textures,z=A.width,Z=A.height;let J=s.COLOR_BUFFER_BIT;const K=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,St=n.get(A),ot=M.length>1;if(ot)for(let dt=0;dt<M.length;dt++)e.bindFramebuffer(s.FRAMEBUFFER,St.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+dt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,St.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+dt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,St.__webglMultisampledFramebuffer),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,St.__webglFramebuffer);for(let dt=0;dt<M.length;dt++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(J|=s.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(J|=s.STENCIL_BUFFER_BIT)),ot){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,St.__webglColorRenderbuffer[dt]);const $t=n.get(M[dt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,$t,0)}s.blitFramebuffer(0,0,z,Z,0,0,z,Z,J,s.NEAREST),l===!0&&(ue.length=0,B.length=0,ue.push(s.COLOR_ATTACHMENT0+dt),A.depthBuffer&&A.resolveDepthBuffer===!1&&(ue.push(K),B.push(K),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,B)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,ue))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ot)for(let dt=0;dt<M.length;dt++){e.bindFramebuffer(s.FRAMEBUFFER,St.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+dt,s.RENDERBUFFER,St.__webglColorRenderbuffer[dt]);const $t=n.get(M[dt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,St.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+dt,s.TEXTURE_2D,$t,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,St.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){const M=A.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[M])}}}function It(A){return Math.min(i.maxSamples,A.samples)}function Nt(A){const M=n.get(A);return A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function wt(A){const M=a.render.frame;h.get(A)!==M&&(h.set(A,M),A.update())}function Jt(A,M){const z=A.colorSpace,Z=A.format,J=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||z!==Li&&z!==xn&&(Kt.getTransfer(z)===ne?(Z!==nn||J!==wn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),M}function yt(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=O,this.resetTextureUnits=U,this.setTexture2D=q,this.setTexture2DArray=V,this.setTexture3D=$,this.setTextureCube=H,this.rebindTextures=Ht,this.setupRenderTarget=le,this.updateRenderTargetMipmap=Xt,this.updateMultisampleRenderTarget=Yt,this.setupDepthRenderbuffer=Lt,this.setupFrameBufferTexture=ft,this.useMultisampledRTT=Nt}function Em(s,t){function e(n,i=xn){let r;const a=Kt.getTransfer(i);if(n===wn)return s.UNSIGNED_BYTE;if(n===Da)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Ia)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Ul)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Dl)return s.BYTE;if(n===Il)return s.SHORT;if(n===ji)return s.UNSIGNED_SHORT;if(n===La)return s.INT;if(n===ti)return s.UNSIGNED_INT;if(n===ln)return s.FLOAT;if(n===cn)return s.HALF_FLOAT;if(n===Nl)return s.ALPHA;if(n===Fl)return s.RGB;if(n===nn)return s.RGBA;if(n===Bl)return s.LUMINANCE;if(n===Ol)return s.LUMINANCE_ALPHA;if(n===Si)return s.DEPTH_COMPONENT;if(n===Ci)return s.DEPTH_STENCIL;if(n===Ua)return s.RED;if(n===Na)return s.RED_INTEGER;if(n===zl)return s.RG;if(n===Fa)return s.RG_INTEGER;if(n===Ba)return s.RGBA_INTEGER;if(n===zs||n===ks||n===Gs||n===Hs)if(a===ne)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===zs)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ks)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Gs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Hs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===zs)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ks)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Gs)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Hs)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Jr||n===Qr||n===ta||n===ea)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Jr)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Qr)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ta)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ea)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===na||n===ia||n===sa)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===na||n===ia)return a===ne?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===sa)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===ra||n===aa||n===oa||n===la||n===ca||n===ha||n===ua||n===da||n===fa||n===pa||n===ma||n===ga||n===_a||n===va)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===ra)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===aa)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===oa)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===la)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ca)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ha)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ua)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===da)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===fa)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===pa)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ma)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ga)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===_a)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===va)return a===ne?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Vs||n===xa||n===Ma)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Vs)return a===ne?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===xa)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ma)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===kl||n===ya||n===Sa||n===Ea)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Vs)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ya)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Sa)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ea)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ai?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}class wm extends He{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class $e extends ge{constructor(){super(),this.isGroup=!0,this.type="Group"}}const bm={type:"move"};class Cr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new $e,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new $e,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new $e,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(bm)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new $e;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Tm=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Am=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Cm{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const i=new Te,r=t.properties.get(i);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new ye({vertexShader:Tm,fragmentShader:Am,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Ut(new Ve(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Rm extends Di{constructor(t,e){super();const n=this;let i=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null;const _=new Cm,m=e.getContextAttributes();let p=null,y=null;const S=[],x=[],D=new Mt;let C=null;const b=new He;b.viewport=new ie;const R=new He;R.viewport=new ie;const E=[b,R],v=new wm;let L=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let Q=S[Y];return Q===void 0&&(Q=new Cr,S[Y]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(Y){let Q=S[Y];return Q===void 0&&(Q=new Cr,S[Y]=Q),Q.getGripSpace()},this.getHand=function(Y){let Q=S[Y];return Q===void 0&&(Q=new Cr,S[Y]=Q),Q.getHandSpace()};function O(Y){const Q=x.indexOf(Y.inputSource);if(Q===-1)return;const ft=S[Q];ft!==void 0&&(ft.update(Y.inputSource,Y.frame,c||a),ft.dispatchEvent({type:Y.type,data:Y.inputSource}))}function X(){i.removeEventListener("select",O),i.removeEventListener("selectstart",O),i.removeEventListener("selectend",O),i.removeEventListener("squeeze",O),i.removeEventListener("squeezestart",O),i.removeEventListener("squeezeend",O),i.removeEventListener("end",X),i.removeEventListener("inputsourceschange",q);for(let Y=0;Y<S.length;Y++){const Q=x[Y];Q!==null&&(x[Y]=null,S[Y].disconnect(Q))}L=null,U=null,_.reset(),t.setRenderTarget(p),f=null,d=null,u=null,i=null,y=null,Wt.stop(),n.isPresenting=!1,t.setPixelRatio(C),t.setSize(D.width,D.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(Y){if(i=Y,i!==null){if(p=t.getRenderTarget(),i.addEventListener("select",O),i.addEventListener("selectstart",O),i.addEventListener("selectend",O),i.addEventListener("squeeze",O),i.addEventListener("squeezestart",O),i.addEventListener("squeezeend",O),i.addEventListener("end",X),i.addEventListener("inputsourceschange",q),m.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(D),i.renderState.layers===void 0){const Q={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,e,Q),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Ke(f.framebufferWidth,f.framebufferHeight,{format:nn,type:wn,colorSpace:t.outputColorSpace,stencilBuffer:m.stencil})}else{let Q=null,ft=null,rt=null;m.depth&&(rt=m.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Q=m.stencil?Ci:Si,ft=m.stencil?Ai:ti);const Tt={colorFormat:e.RGBA8,depthFormat:rt,scaleFactor:r};u=new XRWebGLBinding(i,e),d=u.createProjectionLayer(Tt),i.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),y=new Ke(d.textureWidth,d.textureHeight,{format:nn,type:wn,depthTexture:new tc(d.textureWidth,d.textureHeight,ft,void 0,void 0,void 0,void 0,void 0,void 0,Q),stencilBuffer:m.stencil,colorSpace:t.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),Wt.setContext(i),Wt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function q(Y){for(let Q=0;Q<Y.removed.length;Q++){const ft=Y.removed[Q],rt=x.indexOf(ft);rt>=0&&(x[rt]=null,S[rt].disconnect(ft))}for(let Q=0;Q<Y.added.length;Q++){const ft=Y.added[Q];let rt=x.indexOf(ft);if(rt===-1){for(let Lt=0;Lt<S.length;Lt++)if(Lt>=x.length){x.push(ft),rt=Lt;break}else if(x[Lt]===null){x[Lt]=ft,rt=Lt;break}if(rt===-1)break}const Tt=S[rt];Tt&&Tt.connect(ft)}}const V=new P,$=new P;function H(Y,Q,ft){V.setFromMatrixPosition(Q.matrixWorld),$.setFromMatrixPosition(ft.matrixWorld);const rt=V.distanceTo($),Tt=Q.projectionMatrix.elements,Lt=ft.projectionMatrix.elements,Ht=Tt[14]/(Tt[10]-1),le=Tt[14]/(Tt[10]+1),Xt=(Tt[9]+1)/Tt[5],ue=(Tt[9]-1)/Tt[5],B=(Tt[8]-1)/Tt[0],Yt=(Lt[8]+1)/Lt[0],It=Ht*B,Nt=Ht*Yt,wt=rt/(-B+Yt),Jt=wt*-B;if(Q.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Jt),Y.translateZ(wt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Tt[10]===-1)Y.projectionMatrix.copy(Q.projectionMatrix),Y.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{const yt=Ht+wt,A=le+wt,M=It-Jt,z=Nt+(rt-Jt),Z=Xt*le/A*yt,J=ue*le/A*yt;Y.projectionMatrix.makePerspective(M,z,Z,J,yt,A),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function nt(Y,Q){Q===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(Q.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(i===null)return;let Q=Y.near,ft=Y.far;_.texture!==null&&(_.depthNear>0&&(Q=_.depthNear),_.depthFar>0&&(ft=_.depthFar)),v.near=R.near=b.near=Q,v.far=R.far=b.far=ft,(L!==v.near||U!==v.far)&&(i.updateRenderState({depthNear:v.near,depthFar:v.far}),L=v.near,U=v.far),b.layers.mask=Y.layers.mask|2,R.layers.mask=Y.layers.mask|4,v.layers.mask=b.layers.mask|R.layers.mask;const rt=Y.parent,Tt=v.cameras;nt(v,rt);for(let Lt=0;Lt<Tt.length;Lt++)nt(Tt[Lt],rt);Tt.length===2?H(v,b,R):v.projectionMatrix.copy(b.projectionMatrix),it(Y,v,rt)};function it(Y,Q,ft){ft===null?Y.matrix.copy(Q.matrixWorld):(Y.matrix.copy(ft.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(Q.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(Q.projectionMatrix),Y.projectionMatrixInverse.copy(Q.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Ji*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(Y){l=Y,d!==null&&(d.fixedFoveation=Y),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Y)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(v)};let lt=null;function Rt(Y,Q){if(h=Q.getViewerPose(c||a),g=Q,h!==null){const ft=h.views;f!==null&&(t.setRenderTargetFramebuffer(y,f.framebuffer),t.setRenderTarget(y));let rt=!1;ft.length!==v.cameras.length&&(v.cameras.length=0,rt=!0);for(let Lt=0;Lt<ft.length;Lt++){const Ht=ft[Lt];let le=null;if(f!==null)le=f.getViewport(Ht);else{const ue=u.getViewSubImage(d,Ht);le=ue.viewport,Lt===0&&(t.setRenderTargetTextures(y,ue.colorTexture,d.ignoreDepthValues?void 0:ue.depthStencilTexture),t.setRenderTarget(y))}let Xt=E[Lt];Xt===void 0&&(Xt=new He,Xt.layers.enable(Lt),Xt.viewport=new ie,E[Lt]=Xt),Xt.matrix.fromArray(Ht.transform.matrix),Xt.matrix.decompose(Xt.position,Xt.quaternion,Xt.scale),Xt.projectionMatrix.fromArray(Ht.projectionMatrix),Xt.projectionMatrixInverse.copy(Xt.projectionMatrix).invert(),Xt.viewport.set(le.x,le.y,le.width,le.height),Lt===0&&(v.matrix.copy(Xt.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),rt===!0&&v.cameras.push(Xt)}const Tt=i.enabledFeatures;if(Tt&&Tt.includes("depth-sensing")){const Lt=u.getDepthInformation(ft[0]);Lt&&Lt.isValid&&Lt.texture&&_.init(t,Lt,i.renderState)}}for(let ft=0;ft<S.length;ft++){const rt=x[ft],Tt=S[ft];rt!==null&&Tt!==void 0&&Tt.update(rt,Q,c||a)}lt&&lt(Y,Q),Q.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Q}),g=null}const Wt=new Ql;Wt.setAnimationLoop(Rt),this.setAnimationLoop=function(Y){lt=Y},this.dispose=function(){}}}const Xn=new Ne,Pm=new zt;function Lm(s,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Zl(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,y,S,x){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,x)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,y,S):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Re&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Re&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const y=t.get(p),S=y.envMap,x=y.envMapRotation;S&&(m.envMap.value=S,Xn.copy(x),Xn.x*=-1,Xn.y*=-1,Xn.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(Xn.y*=-1,Xn.z*=-1),m.envMapRotation.value.setFromMatrix4(Pm.makeRotationFromEuler(Xn)),m.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,y,S){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*y,m.scale.value=S*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,y){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Re&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=y.texture,m.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const y=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(y.matrixWorld),m.nearDistance.value=y.shadow.camera.near,m.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Dm(s,t,e,n){let i={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,S){const x=S.program;n.uniformBlockBinding(y,x)}function c(y,S){let x=i[y.id];x===void 0&&(g(y),x=h(y),i[y.id]=x,y.addEventListener("dispose",m));const D=S.program;n.updateUBOMapping(y,D);const C=t.render.frame;r[y.id]!==C&&(d(y),r[y.id]=C)}function h(y){const S=u();y.__bindingPointIndex=S;const x=s.createBuffer(),D=y.__size,C=y.usage;return s.bindBuffer(s.UNIFORM_BUFFER,x),s.bufferData(s.UNIFORM_BUFFER,D,C),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,S,x),x}function u(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){const S=i[y.id],x=y.uniforms,D=y.__cache;s.bindBuffer(s.UNIFORM_BUFFER,S);for(let C=0,b=x.length;C<b;C++){const R=Array.isArray(x[C])?x[C]:[x[C]];for(let E=0,v=R.length;E<v;E++){const L=R[E];if(f(L,C,E,D)===!0){const U=L.__offset,O=Array.isArray(L.value)?L.value:[L.value];let X=0;for(let q=0;q<O.length;q++){const V=O[q],$=_(V);typeof V=="number"||typeof V=="boolean"?(L.__data[0]=V,s.bufferSubData(s.UNIFORM_BUFFER,U+X,L.__data)):V.isMatrix3?(L.__data[0]=V.elements[0],L.__data[1]=V.elements[1],L.__data[2]=V.elements[2],L.__data[3]=0,L.__data[4]=V.elements[3],L.__data[5]=V.elements[4],L.__data[6]=V.elements[5],L.__data[7]=0,L.__data[8]=V.elements[6],L.__data[9]=V.elements[7],L.__data[10]=V.elements[8],L.__data[11]=0):(V.toArray(L.__data,X),X+=$.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,U,L.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(y,S,x,D){const C=y.value,b=S+"_"+x;if(D[b]===void 0)return typeof C=="number"||typeof C=="boolean"?D[b]=C:D[b]=C.clone(),!0;{const R=D[b];if(typeof C=="number"||typeof C=="boolean"){if(R!==C)return D[b]=C,!0}else if(R.equals(C)===!1)return R.copy(C),!0}return!1}function g(y){const S=y.uniforms;let x=0;const D=16;for(let b=0,R=S.length;b<R;b++){const E=Array.isArray(S[b])?S[b]:[S[b]];for(let v=0,L=E.length;v<L;v++){const U=E[v],O=Array.isArray(U.value)?U.value:[U.value];for(let X=0,q=O.length;X<q;X++){const V=O[X],$=_(V),H=x%D,nt=H%$.boundary,it=H+nt;x+=nt,it!==0&&D-it<$.storage&&(x+=D-it),U.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=x,x+=$.storage}}}const C=x%D;return C>0&&(x+=D-C),y.__size=x,y.__cache={},this}function _(y){const S={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(S.boundary=4,S.storage=4):y.isVector2?(S.boundary=8,S.storage=8):y.isVector3||y.isColor?(S.boundary=16,S.storage=12):y.isVector4?(S.boundary=16,S.storage=16):y.isMatrix3?(S.boundary=48,S.storage=48):y.isMatrix4?(S.boundary=64,S.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),S}function m(y){const S=y.target;S.removeEventListener("dispose",m);const x=a.indexOf(S.__bindingPointIndex);a.splice(x,1),s.deleteBuffer(i[S.id]),delete i[S.id],delete r[S.id]}function p(){for(const y in i)s.deleteBuffer(i[y]);a=[],i={},r={}}return{bind:l,update:c,dispose:p}}class Im{constructor(t={}){const{canvas:e=yh(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=a;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const y=[],S=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ie,this.toneMapping=Sn,this.toneMappingExposure=1;const x=this;let D=!1,C=0,b=0,R=null,E=-1,v=null;const L=new ie,U=new ie;let O=null;const X=new bt(0);let q=0,V=e.width,$=e.height,H=1,nt=null,it=null;const lt=new ie(0,0,V,$),Rt=new ie(0,0,V,$);let Wt=!1;const Y=new ka;let Q=!1,ft=!1;const rt=new zt,Tt=new zt,Lt=new P,Ht=new ie,le={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Xt=!1;function ue(){return R===null?H:1}let B=n;function Yt(w,N){return e.getContext(w,N)}try{const w={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Pa}`),e.addEventListener("webglcontextlost",j,!1),e.addEventListener("webglcontextrestored",ut,!1),e.addEventListener("webglcontextcreationerror",ct,!1),B===null){const N="webgl2";if(B=Yt(N,w),B===null)throw Yt(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let It,Nt,wt,Jt,yt,A,M,z,Z,J,K,St,ot,dt,$t,tt,pt,At,Pt,mt,qt,kt,ae,I;function at(){It=new Of(B),It.init(),kt=new Em(B,It),Nt=new Df(B,It,t,kt),wt=new Mm(B,It),Nt.reverseDepthBuffer&&d&&wt.buffers.depth.setReversed(!0),Jt=new Gf(B),yt=new rm,A=new Sm(B,It,wt,yt,Nt,kt,Jt),M=new Uf(x),z=new Bf(x),Z=new Yh(B),ae=new Pf(B,Z),J=new zf(B,Z,Jt,ae),K=new Vf(B,J,Z,Jt),Pt=new Hf(B,Nt,A),tt=new If(yt),St=new sm(x,M,z,It,Nt,ae,tt),ot=new Lm(x,yt),dt=new om,$t=new fm(It),At=new Rf(x,M,z,wt,K,f,l),pt=new vm(x,K,Nt),I=new Dm(B,Jt,Nt,wt),mt=new Lf(B,It,Jt),qt=new kf(B,It,Jt),Jt.programs=St.programs,x.capabilities=Nt,x.extensions=It,x.properties=yt,x.renderLists=dt,x.shadowMap=pt,x.state=wt,x.info=Jt}at();const W=new Rm(x,B);this.xr=W,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){const w=It.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=It.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(w){w!==void 0&&(H=w,this.setSize(V,$,!1))},this.getSize=function(w){return w.set(V,$)},this.setSize=function(w,N,k=!0){if(W.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}V=w,$=N,e.width=Math.floor(w*H),e.height=Math.floor(N*H),k===!0&&(e.style.width=w+"px",e.style.height=N+"px"),this.setViewport(0,0,w,N)},this.getDrawingBufferSize=function(w){return w.set(V*H,$*H).floor()},this.setDrawingBufferSize=function(w,N,k){V=w,$=N,H=k,e.width=Math.floor(w*k),e.height=Math.floor(N*k),this.setViewport(0,0,w,N)},this.getCurrentViewport=function(w){return w.copy(L)},this.getViewport=function(w){return w.copy(lt)},this.setViewport=function(w,N,k,G){w.isVector4?lt.set(w.x,w.y,w.z,w.w):lt.set(w,N,k,G),wt.viewport(L.copy(lt).multiplyScalar(H).round())},this.getScissor=function(w){return w.copy(Rt)},this.setScissor=function(w,N,k,G){w.isVector4?Rt.set(w.x,w.y,w.z,w.w):Rt.set(w,N,k,G),wt.scissor(U.copy(Rt).multiplyScalar(H).round())},this.getScissorTest=function(){return Wt},this.setScissorTest=function(w){wt.setScissorTest(Wt=w)},this.setOpaqueSort=function(w){nt=w},this.setTransparentSort=function(w){it=w},this.getClearColor=function(w){return w.copy(At.getClearColor())},this.setClearColor=function(){At.setClearColor.apply(At,arguments)},this.getClearAlpha=function(){return At.getClearAlpha()},this.setClearAlpha=function(){At.setClearAlpha.apply(At,arguments)},this.clear=function(w=!0,N=!0,k=!0){let G=0;if(w){let F=!1;if(R!==null){const et=R.texture.format;F=et===Ba||et===Fa||et===Na}if(F){const et=R.texture.type,ht=et===wn||et===ti||et===ji||et===Ai||et===Da||et===Ia,_t=At.getClearColor(),vt=At.getClearAlpha(),Dt=_t.r,Bt=_t.g,xt=_t.b;ht?(g[0]=Dt,g[1]=Bt,g[2]=xt,g[3]=vt,B.clearBufferuiv(B.COLOR,0,g)):(_[0]=Dt,_[1]=Bt,_[2]=xt,_[3]=vt,B.clearBufferiv(B.COLOR,0,_))}else G|=B.COLOR_BUFFER_BIT}N&&(G|=B.DEPTH_BUFFER_BIT),k&&(G|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",j,!1),e.removeEventListener("webglcontextrestored",ut,!1),e.removeEventListener("webglcontextcreationerror",ct,!1),dt.dispose(),$t.dispose(),yt.dispose(),M.dispose(),z.dispose(),K.dispose(),ae.dispose(),I.dispose(),St.dispose(),W.dispose(),W.removeEventListener("sessionstart",Ka),W.removeEventListener("sessionend",Za),zn.stop()};function j(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),D=!0}function ut(){console.log("THREE.WebGLRenderer: Context Restored."),D=!1;const w=Jt.autoReset,N=pt.enabled,k=pt.autoUpdate,G=pt.needsUpdate,F=pt.type;at(),Jt.autoReset=w,pt.enabled=N,pt.autoUpdate=k,pt.needsUpdate=G,pt.type=F}function ct(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Ft(w){const N=w.target;N.removeEventListener("dispose",Ft),fe(N)}function fe(w){Se(w),yt.remove(w)}function Se(w){const N=yt.get(w).programs;N!==void 0&&(N.forEach(function(k){St.releaseProgram(k)}),w.isShaderMaterial&&St.releaseShaderCache(w))}this.renderBufferDirect=function(w,N,k,G,F,et){N===null&&(N=le);const ht=F.isMesh&&F.matrixWorld.determinant()<0,_t=fc(w,N,k,G,F);wt.setMaterial(G,ht);let vt=k.index,Dt=1;if(G.wireframe===!0){if(vt=J.getWireframeAttribute(k),vt===void 0)return;Dt=2}const Bt=k.drawRange,xt=k.attributes.position;let Zt=Bt.start*Dt,oe=(Bt.start+Bt.count)*Dt;et!==null&&(Zt=Math.max(Zt,et.start*Dt),oe=Math.min(oe,(et.start+et.count)*Dt)),vt!==null?(Zt=Math.max(Zt,0),oe=Math.min(oe,vt.count)):xt!=null&&(Zt=Math.max(Zt,0),oe=Math.min(oe,xt.count));const ce=oe-Zt;if(ce<0||ce===1/0)return;ae.setup(F,G,_t,k,vt);let Pe,Qt=mt;if(vt!==null&&(Pe=Z.get(vt),Qt=qt,Qt.setIndex(Pe)),F.isMesh)G.wireframe===!0?(wt.setLineWidth(G.wireframeLinewidth*ue()),Qt.setMode(B.LINES)):Qt.setMode(B.TRIANGLES);else if(F.isLine){let Et=G.linewidth;Et===void 0&&(Et=1),wt.setLineWidth(Et*ue()),F.isLineSegments?Qt.setMode(B.LINES):F.isLineLoop?Qt.setMode(B.LINE_LOOP):Qt.setMode(B.LINE_STRIP)}else F.isPoints?Qt.setMode(B.POINTS):F.isSprite&&Qt.setMode(B.TRIANGLES);if(F.isBatchedMesh)if(F._multiDrawInstances!==null)Qt.renderMultiDrawInstances(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount,F._multiDrawInstances);else if(It.get("WEBGL_multi_draw"))Qt.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else{const Et=F._multiDrawStarts,un=F._multiDrawCounts,te=F._multiDrawCount,je=vt?Z.get(vt).bytesPerElement:1,si=yt.get(G).currentProgram.getUniforms();for(let Be=0;Be<te;Be++)si.setValue(B,"_gl_DrawID",Be),Qt.render(Et[Be]/je,un[Be])}else if(F.isInstancedMesh)Qt.renderInstances(Zt,ce,F.count);else if(k.isInstancedBufferGeometry){const Et=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,un=Math.min(k.instanceCount,Et);Qt.renderInstances(Zt,ce,un)}else Qt.render(Zt,ce)};function ee(w,N,k){w.transparent===!0&&w.side===Ue&&w.forceSinglePass===!1?(w.side=Re,w.needsUpdate=!0,rs(w,N,k),w.side=Bn,w.needsUpdate=!0,rs(w,N,k),w.side=Ue):rs(w,N,k)}this.compile=function(w,N,k=null){k===null&&(k=w),p=$t.get(k),p.init(N),S.push(p),k.traverseVisible(function(F){F.isLight&&F.layers.test(N.layers)&&(p.pushLight(F),F.castShadow&&p.pushShadow(F))}),w!==k&&w.traverseVisible(function(F){F.isLight&&F.layers.test(N.layers)&&(p.pushLight(F),F.castShadow&&p.pushShadow(F))}),p.setupLights();const G=new Set;return w.traverse(function(F){if(!(F.isMesh||F.isPoints||F.isLine||F.isSprite))return;const et=F.material;if(et)if(Array.isArray(et))for(let ht=0;ht<et.length;ht++){const _t=et[ht];ee(_t,k,F),G.add(_t)}else ee(et,k,F),G.add(et)}),S.pop(),p=null,G},this.compileAsync=function(w,N,k=null){const G=this.compile(w,N,k);return new Promise(F=>{function et(){if(G.forEach(function(ht){yt.get(ht).currentProgram.isReady()&&G.delete(ht)}),G.size===0){F(w);return}setTimeout(et,10)}It.get("KHR_parallel_shader_compile")!==null?et():setTimeout(et,10)})};let Ze=null;function hn(w){Ze&&Ze(w)}function Ka(){zn.stop()}function Za(){zn.start()}const zn=new Ql;zn.setAnimationLoop(hn),typeof self<"u"&&zn.setContext(self),this.setAnimationLoop=function(w){Ze=w,W.setAnimationLoop(w),w===null?zn.stop():zn.start()},W.addEventListener("sessionstart",Ka),W.addEventListener("sessionend",Za),this.render=function(w,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),W.enabled===!0&&W.isPresenting===!0&&(W.cameraAutoUpdate===!0&&W.updateCamera(N),N=W.getCamera()),w.isScene===!0&&w.onBeforeRender(x,w,N,R),p=$t.get(w,S.length),p.init(N),S.push(p),Tt.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),Y.setFromProjectionMatrix(Tt),ft=this.localClippingEnabled,Q=tt.init(this.clippingPlanes,ft),m=dt.get(w,y.length),m.init(),y.push(m),W.enabled===!0&&W.isPresenting===!0){const et=x.xr.getDepthSensingMesh();et!==null&&tr(et,N,-1/0,x.sortObjects)}tr(w,N,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(nt,it),Xt=W.enabled===!1||W.isPresenting===!1||W.hasDepthSensing()===!1,Xt&&At.addToRenderList(m,w),this.info.render.frame++,Q===!0&&tt.beginShadows();const k=p.state.shadowsArray;pt.render(k,w,N),Q===!0&&tt.endShadows(),this.info.autoReset===!0&&this.info.reset();const G=m.opaque,F=m.transmissive;if(p.setupLights(),N.isArrayCamera){const et=N.cameras;if(F.length>0)for(let ht=0,_t=et.length;ht<_t;ht++){const vt=et[ht];Ja(G,F,w,vt)}Xt&&At.render(w);for(let ht=0,_t=et.length;ht<_t;ht++){const vt=et[ht];ja(m,w,vt,vt.viewport)}}else F.length>0&&Ja(G,F,w,N),Xt&&At.render(w),ja(m,w,N);R!==null&&(A.updateMultisampleRenderTarget(R),A.updateRenderTargetMipmap(R)),w.isScene===!0&&w.onAfterRender(x,w,N),ae.resetDefaultState(),E=-1,v=null,S.pop(),S.length>0?(p=S[S.length-1],Q===!0&&tt.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,y.pop(),y.length>0?m=y[y.length-1]:m=null};function tr(w,N,k,G){if(w.visible===!1)return;if(w.layers.test(N.layers)){if(w.isGroup)k=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(N);else if(w.isLight)p.pushLight(w),w.castShadow&&p.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||Y.intersectsSprite(w)){G&&Ht.setFromMatrixPosition(w.matrixWorld).applyMatrix4(Tt);const ht=K.update(w),_t=w.material;_t.visible&&m.push(w,ht,_t,k,Ht.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||Y.intersectsObject(w))){const ht=K.update(w),_t=w.material;if(G&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Ht.copy(w.boundingSphere.center)):(ht.boundingSphere===null&&ht.computeBoundingSphere(),Ht.copy(ht.boundingSphere.center)),Ht.applyMatrix4(w.matrixWorld).applyMatrix4(Tt)),Array.isArray(_t)){const vt=ht.groups;for(let Dt=0,Bt=vt.length;Dt<Bt;Dt++){const xt=vt[Dt],Zt=_t[xt.materialIndex];Zt&&Zt.visible&&m.push(w,ht,Zt,k,Ht.z,xt)}}else _t.visible&&m.push(w,ht,_t,k,Ht.z,null)}}const et=w.children;for(let ht=0,_t=et.length;ht<_t;ht++)tr(et[ht],N,k,G)}function ja(w,N,k,G){const F=w.opaque,et=w.transmissive,ht=w.transparent;p.setupLightsView(k),Q===!0&&tt.setGlobalState(x.clippingPlanes,k),G&&wt.viewport(L.copy(G)),F.length>0&&ss(F,N,k),et.length>0&&ss(et,N,k),ht.length>0&&ss(ht,N,k),wt.buffers.depth.setTest(!0),wt.buffers.depth.setMask(!0),wt.buffers.color.setMask(!0),wt.setPolygonOffset(!1)}function Ja(w,N,k,G){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[G.id]===void 0&&(p.state.transmissionRenderTarget[G.id]=new Ke(1,1,{generateMipmaps:!0,type:It.has("EXT_color_buffer_half_float")||It.has("EXT_color_buffer_float")?cn:wn,minFilter:Jn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Kt.workingColorSpace}));const et=p.state.transmissionRenderTarget[G.id],ht=G.viewport||L;et.setSize(ht.z,ht.w);const _t=x.getRenderTarget();x.setRenderTarget(et),x.getClearColor(X),q=x.getClearAlpha(),q<1&&x.setClearColor(16777215,.5),x.clear(),Xt&&At.render(k);const vt=x.toneMapping;x.toneMapping=Sn;const Dt=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),p.setupLightsView(G),Q===!0&&tt.setGlobalState(x.clippingPlanes,G),ss(w,k,G),A.updateMultisampleRenderTarget(et),A.updateRenderTargetMipmap(et),It.has("WEBGL_multisampled_render_to_texture")===!1){let Bt=!1;for(let xt=0,Zt=N.length;xt<Zt;xt++){const oe=N[xt],ce=oe.object,Pe=oe.geometry,Qt=oe.material,Et=oe.group;if(Qt.side===Ue&&ce.layers.test(G.layers)){const un=Qt.side;Qt.side=Re,Qt.needsUpdate=!0,Qa(ce,k,G,Pe,Qt,Et),Qt.side=un,Qt.needsUpdate=!0,Bt=!0}}Bt===!0&&(A.updateMultisampleRenderTarget(et),A.updateRenderTargetMipmap(et))}x.setRenderTarget(_t),x.setClearColor(X,q),Dt!==void 0&&(G.viewport=Dt),x.toneMapping=vt}function ss(w,N,k){const G=N.isScene===!0?N.overrideMaterial:null;for(let F=0,et=w.length;F<et;F++){const ht=w[F],_t=ht.object,vt=ht.geometry,Dt=G===null?ht.material:G,Bt=ht.group;_t.layers.test(k.layers)&&Qa(_t,N,k,vt,Dt,Bt)}}function Qa(w,N,k,G,F,et){w.onBeforeRender(x,N,k,G,F,et),w.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),F.onBeforeRender(x,N,k,G,w,et),F.transparent===!0&&F.side===Ue&&F.forceSinglePass===!1?(F.side=Re,F.needsUpdate=!0,x.renderBufferDirect(k,N,G,F,w,et),F.side=Bn,F.needsUpdate=!0,x.renderBufferDirect(k,N,G,F,w,et),F.side=Ue):x.renderBufferDirect(k,N,G,F,w,et),w.onAfterRender(x,N,k,G,F,et)}function rs(w,N,k){N.isScene!==!0&&(N=le);const G=yt.get(w),F=p.state.lights,et=p.state.shadowsArray,ht=F.state.version,_t=St.getParameters(w,F.state,et,N,k),vt=St.getProgramCacheKey(_t);let Dt=G.programs;G.environment=w.isMeshStandardMaterial?N.environment:null,G.fog=N.fog,G.envMap=(w.isMeshStandardMaterial?z:M).get(w.envMap||G.environment),G.envMapRotation=G.environment!==null&&w.envMap===null?N.environmentRotation:w.envMapRotation,Dt===void 0&&(w.addEventListener("dispose",Ft),Dt=new Map,G.programs=Dt);let Bt=Dt.get(vt);if(Bt!==void 0){if(G.currentProgram===Bt&&G.lightsStateVersion===ht)return eo(w,_t),Bt}else _t.uniforms=St.getUniforms(w),w.onBeforeCompile(_t,x),Bt=St.acquireProgram(_t,vt),Dt.set(vt,Bt),G.uniforms=_t.uniforms;const xt=G.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(xt.clippingPlanes=tt.uniform),eo(w,_t),G.needsLights=mc(w),G.lightsStateVersion=ht,G.needsLights&&(xt.ambientLightColor.value=F.state.ambient,xt.lightProbe.value=F.state.probe,xt.directionalLights.value=F.state.directional,xt.directionalLightShadows.value=F.state.directionalShadow,xt.spotLights.value=F.state.spot,xt.spotLightShadows.value=F.state.spotShadow,xt.rectAreaLights.value=F.state.rectArea,xt.ltc_1.value=F.state.rectAreaLTC1,xt.ltc_2.value=F.state.rectAreaLTC2,xt.pointLights.value=F.state.point,xt.pointLightShadows.value=F.state.pointShadow,xt.hemisphereLights.value=F.state.hemi,xt.directionalShadowMap.value=F.state.directionalShadowMap,xt.directionalShadowMatrix.value=F.state.directionalShadowMatrix,xt.spotShadowMap.value=F.state.spotShadowMap,xt.spotLightMatrix.value=F.state.spotLightMatrix,xt.spotLightMap.value=F.state.spotLightMap,xt.pointShadowMap.value=F.state.pointShadowMap,xt.pointShadowMatrix.value=F.state.pointShadowMatrix),G.currentProgram=Bt,G.uniformsList=null,Bt}function to(w){if(w.uniformsList===null){const N=w.currentProgram.getUniforms();w.uniformsList=Ws.seqWithValue(N.seq,w.uniforms)}return w.uniformsList}function eo(w,N){const k=yt.get(w);k.outputColorSpace=N.outputColorSpace,k.batching=N.batching,k.batchingColor=N.batchingColor,k.instancing=N.instancing,k.instancingColor=N.instancingColor,k.instancingMorph=N.instancingMorph,k.skinning=N.skinning,k.morphTargets=N.morphTargets,k.morphNormals=N.morphNormals,k.morphColors=N.morphColors,k.morphTargetsCount=N.morphTargetsCount,k.numClippingPlanes=N.numClippingPlanes,k.numIntersection=N.numClipIntersection,k.vertexAlphas=N.vertexAlphas,k.vertexTangents=N.vertexTangents,k.toneMapping=N.toneMapping}function fc(w,N,k,G,F){N.isScene!==!0&&(N=le),A.resetTextureUnits();const et=N.fog,ht=G.isMeshStandardMaterial?N.environment:null,_t=R===null?x.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Li,vt=(G.isMeshStandardMaterial?z:M).get(G.envMap||ht),Dt=G.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Bt=!!k.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),xt=!!k.morphAttributes.position,Zt=!!k.morphAttributes.normal,oe=!!k.morphAttributes.color;let ce=Sn;G.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(ce=x.toneMapping);const Pe=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,Qt=Pe!==void 0?Pe.length:0,Et=yt.get(G),un=p.state.lights;if(Q===!0&&(ft===!0||w!==v)){const Xe=w===v&&G.id===E;tt.setState(G,w,Xe)}let te=!1;G.version===Et.__version?(Et.needsLights&&Et.lightsStateVersion!==un.state.version||Et.outputColorSpace!==_t||F.isBatchedMesh&&Et.batching===!1||!F.isBatchedMesh&&Et.batching===!0||F.isBatchedMesh&&Et.batchingColor===!0&&F.colorTexture===null||F.isBatchedMesh&&Et.batchingColor===!1&&F.colorTexture!==null||F.isInstancedMesh&&Et.instancing===!1||!F.isInstancedMesh&&Et.instancing===!0||F.isSkinnedMesh&&Et.skinning===!1||!F.isSkinnedMesh&&Et.skinning===!0||F.isInstancedMesh&&Et.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&Et.instancingColor===!1&&F.instanceColor!==null||F.isInstancedMesh&&Et.instancingMorph===!0&&F.morphTexture===null||F.isInstancedMesh&&Et.instancingMorph===!1&&F.morphTexture!==null||Et.envMap!==vt||G.fog===!0&&Et.fog!==et||Et.numClippingPlanes!==void 0&&(Et.numClippingPlanes!==tt.numPlanes||Et.numIntersection!==tt.numIntersection)||Et.vertexAlphas!==Dt||Et.vertexTangents!==Bt||Et.morphTargets!==xt||Et.morphNormals!==Zt||Et.morphColors!==oe||Et.toneMapping!==ce||Et.morphTargetsCount!==Qt)&&(te=!0):(te=!0,Et.__version=G.version);let je=Et.currentProgram;te===!0&&(je=rs(G,N,F));let si=!1,Be=!1,Ni=!1;const he=je.getUniforms(),rn=Et.uniforms;if(wt.useProgram(je.program)&&(si=!0,Be=!0,Ni=!0),G.id!==E&&(E=G.id,Be=!0),si||v!==w){wt.buffers.depth.getReversed()?(rt.copy(w.projectionMatrix),Eh(rt),wh(rt),he.setValue(B,"projectionMatrix",rt)):he.setValue(B,"projectionMatrix",w.projectionMatrix),he.setValue(B,"viewMatrix",w.matrixWorldInverse);const bn=he.map.cameraPosition;bn!==void 0&&bn.setValue(B,Lt.setFromMatrixPosition(w.matrixWorld)),Nt.logarithmicDepthBuffer&&he.setValue(B,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&he.setValue(B,"isOrthographic",w.isOrthographicCamera===!0),v!==w&&(v=w,Be=!0,Ni=!0)}if(F.isSkinnedMesh){he.setOptional(B,F,"bindMatrix"),he.setOptional(B,F,"bindMatrixInverse");const Xe=F.skeleton;Xe&&(Xe.boneTexture===null&&Xe.computeBoneTexture(),he.setValue(B,"boneTexture",Xe.boneTexture,A))}F.isBatchedMesh&&(he.setOptional(B,F,"batchingTexture"),he.setValue(B,"batchingTexture",F._matricesTexture,A),he.setOptional(B,F,"batchingIdTexture"),he.setValue(B,"batchingIdTexture",F._indirectTexture,A),he.setOptional(B,F,"batchingColorTexture"),F._colorsTexture!==null&&he.setValue(B,"batchingColorTexture",F._colorsTexture,A));const Fi=k.morphAttributes;if((Fi.position!==void 0||Fi.normal!==void 0||Fi.color!==void 0)&&Pt.update(F,k,je),(Be||Et.receiveShadow!==F.receiveShadow)&&(Et.receiveShadow=F.receiveShadow,he.setValue(B,"receiveShadow",F.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(rn.envMap.value=vt,rn.flipEnvMap.value=vt.isCubeTexture&&vt.isRenderTargetTexture===!1?-1:1),G.isMeshStandardMaterial&&G.envMap===null&&N.environment!==null&&(rn.envMapIntensity.value=N.environmentIntensity),Be&&(he.setValue(B,"toneMappingExposure",x.toneMappingExposure),Et.needsLights&&pc(rn,Ni),et&&G.fog===!0&&ot.refreshFogUniforms(rn,et),ot.refreshMaterialUniforms(rn,G,H,$,p.state.transmissionRenderTarget[w.id]),Ws.upload(B,to(Et),rn,A)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(Ws.upload(B,to(Et),rn,A),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&he.setValue(B,"center",F.center),he.setValue(B,"modelViewMatrix",F.modelViewMatrix),he.setValue(B,"normalMatrix",F.normalMatrix),he.setValue(B,"modelMatrix",F.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const Xe=G.uniformsGroups;for(let bn=0,Tn=Xe.length;bn<Tn;bn++){const no=Xe[bn];I.update(no,je),I.bind(no,je)}}return je}function pc(w,N){w.ambientLightColor.needsUpdate=N,w.lightProbe.needsUpdate=N,w.directionalLights.needsUpdate=N,w.directionalLightShadows.needsUpdate=N,w.pointLights.needsUpdate=N,w.pointLightShadows.needsUpdate=N,w.spotLights.needsUpdate=N,w.spotLightShadows.needsUpdate=N,w.rectAreaLights.needsUpdate=N,w.hemisphereLights.needsUpdate=N}function mc(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return b},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(w,N,k){yt.get(w.texture).__webglTexture=N,yt.get(w.depthTexture).__webglTexture=k;const G=yt.get(w);G.__hasExternalTextures=!0,G.__autoAllocateDepthBuffer=k===void 0,G.__autoAllocateDepthBuffer||It.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),G.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(w,N){const k=yt.get(w);k.__webglFramebuffer=N,k.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(w,N=0,k=0){R=w,C=N,b=k;let G=!0,F=null,et=!1,ht=!1;if(w){const vt=yt.get(w);if(vt.__useDefaultFramebuffer!==void 0)wt.bindFramebuffer(B.FRAMEBUFFER,null),G=!1;else if(vt.__webglFramebuffer===void 0)A.setupRenderTarget(w);else if(vt.__hasExternalTextures)A.rebindTextures(w,yt.get(w.texture).__webglTexture,yt.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){const xt=w.depthTexture;if(vt.__boundDepthTexture!==xt){if(xt!==null&&yt.has(xt)&&(w.width!==xt.image.width||w.height!==xt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");A.setupDepthRenderbuffer(w)}}const Dt=w.texture;(Dt.isData3DTexture||Dt.isDataArrayTexture||Dt.isCompressedArrayTexture)&&(ht=!0);const Bt=yt.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Bt[N])?F=Bt[N][k]:F=Bt[N],et=!0):w.samples>0&&A.useMultisampledRTT(w)===!1?F=yt.get(w).__webglMultisampledFramebuffer:Array.isArray(Bt)?F=Bt[k]:F=Bt,L.copy(w.viewport),U.copy(w.scissor),O=w.scissorTest}else L.copy(lt).multiplyScalar(H).floor(),U.copy(Rt).multiplyScalar(H).floor(),O=Wt;if(wt.bindFramebuffer(B.FRAMEBUFFER,F)&&G&&wt.drawBuffers(w,F),wt.viewport(L),wt.scissor(U),wt.setScissorTest(O),et){const vt=yt.get(w.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+N,vt.__webglTexture,k)}else if(ht){const vt=yt.get(w.texture),Dt=N||0;B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,vt.__webglTexture,k||0,Dt)}E=-1},this.readRenderTargetPixels=function(w,N,k,G,F,et,ht){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let _t=yt.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&ht!==void 0&&(_t=_t[ht]),_t){wt.bindFramebuffer(B.FRAMEBUFFER,_t);try{const vt=w.texture,Dt=vt.format,Bt=vt.type;if(!Nt.textureFormatReadable(Dt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Nt.textureTypeReadable(Bt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=w.width-G&&k>=0&&k<=w.height-F&&B.readPixels(N,k,G,F,kt.convert(Dt),kt.convert(Bt),et)}finally{const vt=R!==null?yt.get(R).__webglFramebuffer:null;wt.bindFramebuffer(B.FRAMEBUFFER,vt)}}},this.readRenderTargetPixelsAsync=async function(w,N,k,G,F,et,ht){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let _t=yt.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&ht!==void 0&&(_t=_t[ht]),_t){const vt=w.texture,Dt=vt.format,Bt=vt.type;if(!Nt.textureFormatReadable(Dt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Nt.textureTypeReadable(Bt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(N>=0&&N<=w.width-G&&k>=0&&k<=w.height-F){wt.bindFramebuffer(B.FRAMEBUFFER,_t);const xt=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,xt),B.bufferData(B.PIXEL_PACK_BUFFER,et.byteLength,B.STREAM_READ),B.readPixels(N,k,G,F,kt.convert(Dt),kt.convert(Bt),0);const Zt=R!==null?yt.get(R).__webglFramebuffer:null;wt.bindFramebuffer(B.FRAMEBUFFER,Zt);const oe=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await Sh(B,oe,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,xt),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,et),B.deleteBuffer(xt),B.deleteSync(oe),et}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(w,N=null,k=0){w.isTexture!==!0&&(qi("WebGLRenderer: copyFramebufferToTexture function signature has changed."),N=arguments[0]||null,w=arguments[1]);const G=Math.pow(2,-k),F=Math.floor(w.image.width*G),et=Math.floor(w.image.height*G),ht=N!==null?N.x:0,_t=N!==null?N.y:0;A.setTexture2D(w,0),B.copyTexSubImage2D(B.TEXTURE_2D,k,0,0,ht,_t,F,et),wt.unbindTexture()},this.copyTextureToTexture=function(w,N,k=null,G=null,F=0){w.isTexture!==!0&&(qi("WebGLRenderer: copyTextureToTexture function signature has changed."),G=arguments[0]||null,w=arguments[1],N=arguments[2],F=arguments[3]||0,k=null);let et,ht,_t,vt,Dt,Bt,xt,Zt,oe;const ce=w.isCompressedTexture?w.mipmaps[F]:w.image;k!==null?(et=k.max.x-k.min.x,ht=k.max.y-k.min.y,_t=k.isBox3?k.max.z-k.min.z:1,vt=k.min.x,Dt=k.min.y,Bt=k.isBox3?k.min.z:0):(et=ce.width,ht=ce.height,_t=ce.depth||1,vt=0,Dt=0,Bt=0),G!==null?(xt=G.x,Zt=G.y,oe=G.z):(xt=0,Zt=0,oe=0);const Pe=kt.convert(N.format),Qt=kt.convert(N.type);let Et;N.isData3DTexture?(A.setTexture3D(N,0),Et=B.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(A.setTexture2DArray(N,0),Et=B.TEXTURE_2D_ARRAY):(A.setTexture2D(N,0),Et=B.TEXTURE_2D),B.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,N.flipY),B.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),B.pixelStorei(B.UNPACK_ALIGNMENT,N.unpackAlignment);const un=B.getParameter(B.UNPACK_ROW_LENGTH),te=B.getParameter(B.UNPACK_IMAGE_HEIGHT),je=B.getParameter(B.UNPACK_SKIP_PIXELS),si=B.getParameter(B.UNPACK_SKIP_ROWS),Be=B.getParameter(B.UNPACK_SKIP_IMAGES);B.pixelStorei(B.UNPACK_ROW_LENGTH,ce.width),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,ce.height),B.pixelStorei(B.UNPACK_SKIP_PIXELS,vt),B.pixelStorei(B.UNPACK_SKIP_ROWS,Dt),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Bt);const Ni=w.isDataArrayTexture||w.isData3DTexture,he=N.isDataArrayTexture||N.isData3DTexture;if(w.isRenderTargetTexture||w.isDepthTexture){const rn=yt.get(w),Fi=yt.get(N),Xe=yt.get(rn.__renderTarget),bn=yt.get(Fi.__renderTarget);wt.bindFramebuffer(B.READ_FRAMEBUFFER,Xe.__webglFramebuffer),wt.bindFramebuffer(B.DRAW_FRAMEBUFFER,bn.__webglFramebuffer);for(let Tn=0;Tn<_t;Tn++)Ni&&B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,yt.get(w).__webglTexture,F,Bt+Tn),w.isDepthTexture?(he&&B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,yt.get(N).__webglTexture,F,oe+Tn),B.blitFramebuffer(vt,Dt,et,ht,xt,Zt,et,ht,B.DEPTH_BUFFER_BIT,B.NEAREST)):he?B.copyTexSubImage3D(Et,F,xt,Zt,oe+Tn,vt,Dt,et,ht):B.copyTexSubImage2D(Et,F,xt,Zt,oe+Tn,vt,Dt,et,ht);wt.bindFramebuffer(B.READ_FRAMEBUFFER,null),wt.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else he?w.isDataTexture||w.isData3DTexture?B.texSubImage3D(Et,F,xt,Zt,oe,et,ht,_t,Pe,Qt,ce.data):N.isCompressedArrayTexture?B.compressedTexSubImage3D(Et,F,xt,Zt,oe,et,ht,_t,Pe,ce.data):B.texSubImage3D(Et,F,xt,Zt,oe,et,ht,_t,Pe,Qt,ce):w.isDataTexture?B.texSubImage2D(B.TEXTURE_2D,F,xt,Zt,et,ht,Pe,Qt,ce.data):w.isCompressedTexture?B.compressedTexSubImage2D(B.TEXTURE_2D,F,xt,Zt,ce.width,ce.height,Pe,ce.data):B.texSubImage2D(B.TEXTURE_2D,F,xt,Zt,et,ht,Pe,Qt,ce);B.pixelStorei(B.UNPACK_ROW_LENGTH,un),B.pixelStorei(B.UNPACK_IMAGE_HEIGHT,te),B.pixelStorei(B.UNPACK_SKIP_PIXELS,je),B.pixelStorei(B.UNPACK_SKIP_ROWS,si),B.pixelStorei(B.UNPACK_SKIP_IMAGES,Be),F===0&&N.generateMipmaps&&B.generateMipmap(Et),wt.unbindTexture()},this.copyTextureToTexture3D=function(w,N,k=null,G=null,F=0){return w.isTexture!==!0&&(qi("WebGLRenderer: copyTextureToTexture3D function signature has changed."),k=arguments[0]||null,G=arguments[1]||null,w=arguments[2],N=arguments[3],F=arguments[4]||0),qi('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(w,N,k,G,F)},this.initRenderTarget=function(w){yt.get(w).__webglFramebuffer===void 0&&A.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?A.setTextureCube(w,0):w.isData3DTexture?A.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?A.setTexture2DArray(w,0):A.setTexture2D(w,0),wt.unbindTexture()},this.resetState=function(){C=0,b=0,R=null,wt.reset(),ae.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Mn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Kt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Kt._getUnpackColorSpace()}}class Va{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new bt(t),this.density=e}clone(){return new Va(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class rc extends ge{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ne,this.environmentIntensity=1,this.environmentRotation=new Ne,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Um extends Te{constructor(t=null,e=1,n=1,i,r,a,o,l,c=We,h=We,u,d){super(null,a,o,l,c,h,i,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class el extends se{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const xi=new zt,nl=new zt,As=[],il=new ei,Nm=new zt,Gi=new Ut,Hi=new ni;class In extends Ut{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new el(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Nm)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new ei),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,xi),il.copy(t.boundingBox).applyMatrix4(xi),this.boundingBox.union(il)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new ni),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,xi),Hi.copy(t.boundingSphere).applyMatrix4(xi),this.boundingSphere.union(Hi)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(t,e){const n=this.matrixWorld,i=this.count;if(Gi.geometry=this.geometry,Gi.material=this.material,Gi.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Hi.copy(this.boundingSphere),Hi.applyMatrix4(n),t.ray.intersectsSphere(Hi)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,xi),nl.multiplyMatrices(n,xi),Gi.matrixWorld=nl,Gi.raycast(t,As);for(let a=0,o=As.length;a<o;a++){const l=As[a];l.instanceId=r,l.object=this,e.push(l)}As.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new el(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Um(new Float32Array(i*this.count),i,this.count,Ua,ln));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=i*t;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class ac extends ii{static get type(){return"LineBasicMaterial"}constructor(t){super(),this.isLineBasicMaterial=!0,this.color=new bt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Ks=new P,Zs=new P,sl=new zt,Vi=new za,Cs=new ni,Rr=new P,rl=new P;class Fm extends ge{constructor(t=new de,e=new ac){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let i=1,r=e.count;i<r;i++)Ks.fromBufferAttribute(e,i-1),Zs.fromBufferAttribute(e,i),n[i]=n[i-1],n[i]+=Ks.distanceTo(Zs);t.setAttribute("lineDistance",new re(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Cs.copy(n.boundingSphere),Cs.applyMatrix4(i),Cs.radius+=r,t.ray.intersectsSphere(Cs)===!1)return;sl.copy(i).invert(),Vi.copy(t.ray).applyMatrix4(sl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const f=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let _=f,m=g-1;_<m;_+=c){const p=h.getX(_),y=h.getX(_+1),S=Rs(this,t,Vi,l,p,y);S&&e.push(S)}if(this.isLineLoop){const _=h.getX(g-1),m=h.getX(f),p=Rs(this,t,Vi,l,_,m);p&&e.push(p)}}else{const f=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let _=f,m=g-1;_<m;_+=c){const p=Rs(this,t,Vi,l,_,_+1);p&&e.push(p)}if(this.isLineLoop){const _=Rs(this,t,Vi,l,g-1,f);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Rs(s,t,e,n,i,r){const a=s.geometry.attributes.position;if(Ks.fromBufferAttribute(a,i),Zs.fromBufferAttribute(a,r),e.distanceSqToSegment(Ks,Zs,Rr,rl)>n)return;Rr.applyMatrix4(s.matrixWorld);const l=t.ray.origin.distanceTo(Rr);if(!(l<t.near||l>t.far))return{distance:l,point:rl.clone().applyMatrix4(s.matrixWorld),index:i,face:null,faceIndex:null,barycoord:null,object:s}}const al=new P,ol=new P;class Bm extends Fm{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let i=0,r=e.count;i<r;i+=2)al.fromBufferAttribute(e,i),ol.fromBufferAttribute(e,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+al.distanceTo(ol);t.setAttribute("lineDistance",new re(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Om extends ii{static get type(){return"PointsMaterial"}constructor(t){super(),this.isPointsMaterial=!0,this.color=new bt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const ll=new zt,Ta=new za,Ps=new ni,Ls=new P;class zm extends ge{constructor(t=new de,e=new Om){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ps.copy(n.boundingSphere),Ps.applyMatrix4(i),Ps.radius+=r,t.ray.intersectsSphere(Ps)===!1)return;ll.copy(i).invert(),Ta.copy(t.ray).applyMatrix4(ll);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,u=n.attributes.position;if(c!==null){const d=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let g=d,_=f;g<_;g++){const m=c.getX(g);Ls.fromBufferAttribute(u,m),cl(Ls,m,l,i,t,e,this)}}else{const d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let g=d,_=f;g<_;g++)Ls.fromBufferAttribute(u,g),cl(Ls,g,l,i,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function cl(s,t,e,n,i,r,a){const o=Ta.distanceSqToPoint(s);if(o<e){const l=new P;Ta.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class km extends Te{constructor(t,e,n,i,r,a,o,l,c){super(t,e,n,i,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Gm{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,i=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let i=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(i=Math.floor(o+(l-o)/2),c=n[i]-a,c<0)o=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===a)return i/(r-1);const h=n[i],d=n[i+1]-h,f=(a-h)/d;return(i+f)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);const a=this.getPoint(i),o=this.getPoint(r),l=e||(a.isVector2?new Mt:new P);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new P,i=[],r=[],a=[],o=new P,l=new zt;for(let f=0;f<=t;f++){const g=f/t;i[f]=this.getTangentAt(g,new P)}r[0]=new P,a[0]=new P;let c=Number.MAX_VALUE;const h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],o),a[0].crossVectors(i[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(i[f-1],i[f]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(Me(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,g))}a[f].crossVectors(i[f],r[f])}if(e===!0){let f=Math.acos(Me(r[0].dot(r[t]),-1,1));f/=t,i[0].dot(o.crossVectors(r[0],r[t]))>0&&(f=-f);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(i[g],f*g)),a[g].crossVectors(i[g],r[g])}return{tangents:i,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}function Wa(){let s=0,t=0,e=0,n=0;function i(r,a,o,l){s=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){i(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,u){let d=(a-r)/c-(o-r)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+u)+(l-o)/u;d*=h,f*=h,i(a,o,d,f)},calc:function(r){const a=r*r,o=a*r;return s+t*r+e*a+n*o}}}const Ds=new P,Pr=new Wa,Lr=new Wa,Dr=new Wa;class Hm extends Gm{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new P){const n=e,i=this.points,r=i.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=i[(o-1)%r]:(Ds.subVectors(i[0],i[1]).add(i[0]),c=Ds);const u=i[o%r],d=i[(o+1)%r];if(this.closed||o+2<r?h=i[(o+2)%r]:(Ds.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=Ds),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),Pr.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,g,_,m),Lr.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,g,_,m),Dr.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,g,_,m)}else this.curveType==="catmullrom"&&(Pr.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),Lr.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),Dr.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(Pr.calc(l),Lr.calc(l),Dr.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new P().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}class Fn extends de{constructor(t=1,e=1,n=1,i=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const h=[],u=[],d=[],f=[];let g=0;const _=[],m=n/2;let p=0;y(),a===!1&&(t>0&&S(!0),e>0&&S(!1)),this.setIndex(h),this.setAttribute("position",new re(u,3)),this.setAttribute("normal",new re(d,3)),this.setAttribute("uv",new re(f,2));function y(){const x=new P,D=new P;let C=0;const b=(e-t)/n;for(let R=0;R<=r;R++){const E=[],v=R/r,L=v*(e-t)+t;for(let U=0;U<=i;U++){const O=U/i,X=O*l+o,q=Math.sin(X),V=Math.cos(X);D.x=L*q,D.y=-v*n+m,D.z=L*V,u.push(D.x,D.y,D.z),x.set(q,b,V).normalize(),d.push(x.x,x.y,x.z),f.push(O,1-v),E.push(g++)}_.push(E)}for(let R=0;R<i;R++)for(let E=0;E<r;E++){const v=_[E][R],L=_[E+1][R],U=_[E+1][R+1],O=_[E][R+1];(t>0||E!==0)&&(h.push(v,L,O),C+=3),(e>0||E!==r-1)&&(h.push(L,U,O),C+=3)}c.addGroup(p,C,0),p+=C}function S(x){const D=g,C=new Mt,b=new P;let R=0;const E=x===!0?t:e,v=x===!0?1:-1;for(let U=1;U<=i;U++)u.push(0,m*v,0),d.push(0,v,0),f.push(.5,.5),g++;const L=g;for(let U=0;U<=i;U++){const X=U/i*l+o,q=Math.cos(X),V=Math.sin(X);b.x=E*V,b.y=m*v,b.z=E*q,u.push(b.x,b.y,b.z),d.push(0,v,0),C.x=q*.5+.5,C.y=V*.5*v+.5,f.push(C.x,C.y),g++}for(let U=0;U<i;U++){const O=D+U,X=L+U;x===!0?h.push(X,X+1,O):h.push(X+1,X,O),R+=3}c.addGroup(p,R,x===!0?1:2),p+=R}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fn(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Xa extends de{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};const r=[],a=[];o(i),c(n),h(),this.setAttribute("position",new re(r,3)),this.setAttribute("normal",new re(r.slice(),3)),this.setAttribute("uv",new re(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(y){const S=new P,x=new P,D=new P;for(let C=0;C<e.length;C+=3)f(e[C+0],S),f(e[C+1],x),f(e[C+2],D),l(S,x,D,y)}function l(y,S,x,D){const C=D+1,b=[];for(let R=0;R<=C;R++){b[R]=[];const E=y.clone().lerp(x,R/C),v=S.clone().lerp(x,R/C),L=C-R;for(let U=0;U<=L;U++)U===0&&R===C?b[R][U]=E:b[R][U]=E.clone().lerp(v,U/L)}for(let R=0;R<C;R++)for(let E=0;E<2*(C-R)-1;E++){const v=Math.floor(E/2);E%2===0?(d(b[R][v+1]),d(b[R+1][v]),d(b[R][v])):(d(b[R][v+1]),d(b[R+1][v+1]),d(b[R+1][v]))}}function c(y){const S=new P;for(let x=0;x<r.length;x+=3)S.x=r[x+0],S.y=r[x+1],S.z=r[x+2],S.normalize().multiplyScalar(y),r[x+0]=S.x,r[x+1]=S.y,r[x+2]=S.z}function h(){const y=new P;for(let S=0;S<r.length;S+=3){y.x=r[S+0],y.y=r[S+1],y.z=r[S+2];const x=m(y)/2/Math.PI+.5,D=p(y)/Math.PI+.5;a.push(x,1-D)}g(),u()}function u(){for(let y=0;y<a.length;y+=6){const S=a[y+0],x=a[y+2],D=a[y+4],C=Math.max(S,x,D),b=Math.min(S,x,D);C>.9&&b<.1&&(S<.2&&(a[y+0]+=1),x<.2&&(a[y+2]+=1),D<.2&&(a[y+4]+=1))}}function d(y){r.push(y.x,y.y,y.z)}function f(y,S){const x=y*3;S.x=t[x+0],S.y=t[x+1],S.z=t[x+2]}function g(){const y=new P,S=new P,x=new P,D=new P,C=new Mt,b=new Mt,R=new Mt;for(let E=0,v=0;E<r.length;E+=9,v+=6){y.set(r[E+0],r[E+1],r[E+2]),S.set(r[E+3],r[E+4],r[E+5]),x.set(r[E+6],r[E+7],r[E+8]),C.set(a[v+0],a[v+1]),b.set(a[v+2],a[v+3]),R.set(a[v+4],a[v+5]),D.copy(y).add(S).add(x).divideScalar(3);const L=m(D);_(C,v+0,y,L),_(b,v+2,S,L),_(R,v+4,x,L)}}function _(y,S,x,D){D<0&&y.x===1&&(a[S]=y.x-1),x.x===0&&x.z===0&&(a[S]=D/2/Math.PI+.5)}function m(y){return Math.atan2(y.z,-y.x)}function p(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xa(t.vertices,t.indices,t.radius,t.details)}}class qa extends Xa{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new qa(t.radius,t.detail)}}class ts extends de{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new P,d=new P,f=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){const y=[],S=p/n;let x=0;p===0&&a===0?x=.5/e:p===n&&l===Math.PI&&(x=-.5/e);for(let D=0;D<=e;D++){const C=D/e;u.x=-t*Math.cos(i+C*r)*Math.sin(a+S*o),u.y=t*Math.cos(a+S*o),u.z=t*Math.sin(i+C*r)*Math.sin(a+S*o),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(C+x,1-S),y.push(c++)}h.push(y)}for(let p=0;p<n;p++)for(let y=0;y<e;y++){const S=h[p][y+1],x=h[p][y],D=h[p+1][y],C=h[p+1][y+1];(p!==0||a>0)&&f.push(S,x,C),(p!==n-1||l<Math.PI)&&f.push(x,D,C)}this.setIndex(f),this.setAttribute("position",new re(g,3)),this.setAttribute("normal",new re(_,3)),this.setAttribute("uv",new re(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ts(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Ya extends de{constructor(t=1,e=.4,n=12,i=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:r},n=Math.floor(n),i=Math.floor(i);const a=[],o=[],l=[],c=[],h=new P,u=new P,d=new P;for(let f=0;f<=n;f++)for(let g=0;g<=i;g++){const _=g/i*r,m=f/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),o.push(u.x,u.y,u.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),d.subVectors(u,h).normalize(),l.push(d.x,d.y,d.z),c.push(g/i),c.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=i;g++){const _=(i+1)*f+g-1,m=(i+1)*(f-1)+g-1,p=(i+1)*(f-1)+g,y=(i+1)*f+g;a.push(_,m,y),a.push(m,p,y)}this.setIndex(a),this.setAttribute("position",new re(o,3)),this.setAttribute("normal",new re(l,3)),this.setAttribute("uv",new re(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ya(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Vt extends ii{static get type(){return"MeshStandardMaterial"}constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new bt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Gl,this.normalScale=new Mt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ne,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Aa extends Vt{static get type(){return"MeshPhysicalMaterial"}constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Mt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Me(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new bt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new bt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new bt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class $a extends ge{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new bt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class Vm extends $a{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ge.DEFAULT_UP),this.updateMatrix(),this.groundColor=new bt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Ir=new zt,hl=new P,ul=new P;class oc{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Mt(512,512),this.map=null,this.mapPass=null,this.matrix=new zt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ka,this._frameExtents=new Mt(1,1),this._viewportCount=1,this._viewports=[new ie(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;hl.setFromMatrixPosition(t.matrixWorld),e.position.copy(hl),ul.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(ul),e.updateMatrixWorld(),Ir.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ir),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Ir)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const dl=new zt,Wi=new P,Ur=new P;class Wm extends oc{constructor(){super(new He(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Mt(4,2),this._viewportCount=6,this._viewports=[new ie(2,1,1,1),new ie(0,1,1,1),new ie(3,1,1,1),new ie(1,1,1,1),new ie(3,0,1,1),new ie(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,i=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Wi.setFromMatrixPosition(t.matrixWorld),n.position.copy(Wi),Ur.copy(n.position),Ur.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(Ur),n.updateMatrixWorld(),i.makeTranslation(-Wi.x,-Wi.y,-Wi.z),dl.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(dl)}}class Xm extends $a{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Wm}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class qm extends oc{constructor(){super(new Ga(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class fl extends $a{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ge.DEFAULT_UP),this.updateMatrix(),this.target=new ge,this.shadow=new qm}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class lc{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=pl(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=pl();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function pl(){return performance.now()}const ml=new Mt;class Ym{constructor(t=new Mt(1/0,1/0),e=new Mt(-1/0,-1/0)){this.isBox2=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=ml.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(t){return this.isEmpty()?t.set(0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ml).distanceTo(t)}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Pa}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Pa);const cc={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class ns{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const $m=new Ga(-1,1,1,-1,0,1);class Km extends de{constructor(){super(),this.setAttribute("position",new re([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new re([0,2,0,0,2,0],2))}}const Zm=new Km;class hc{constructor(t){this._mesh=new Ut(Zm,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,$m)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class Ca extends ns{constructor(t,e){super(),this.textureID=e!==void 0?e:"tDiffuse",t instanceof ye?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=$s.clone(t.uniforms),this.material=new ye({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this.fsQuad=new hc(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this.fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this.fsQuad.render(t))}dispose(){this.material.dispose(),this.fsQuad.dispose()}}class gl extends ns{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const i=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}}class jm extends ns{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class Jm{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new Mt);this._width=n.width,this._height=n.height,e=new Ke(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:cn}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Ca(cc),this.copyPass.material.blending=yn,this.clock=new lc}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){t===void 0&&(t=this.clock.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let i=0,r=this.passes.length;i<r;i++){const a=this.passes[i];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),a.needsSwap){if(n){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}gl!==void 0&&(a instanceof gl?n=!0:a instanceof jm&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new Mt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,i)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Qm extends ns{constructor(t,e,n=null,i=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new bt}render(t,e,n){const i=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=i}}const t0={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new bt(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class Pi extends ns{constructor(t,e,n,i){super(),this.strength=e!==void 0?e:1,this.radius=n,this.threshold=i,this.resolution=t!==void 0?new Mt(t.x,t.y):new Mt(256,256),this.clearColor=new bt(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new Ke(r,a,{type:cn}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const d=new Ke(r,a,{type:cn});d.texture.name="UnrealBloomPass.h"+u,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);const f=new Ke(r,a,{type:cn});f.texture.name="UnrealBloomPass.v"+u,f.texture.generateMipmaps=!1,this.renderTargetsVertical.push(f),r=Math.round(r/2),a=Math.round(a/2)}const o=t0;this.highPassUniforms=$s.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new ye({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[3,5,7,9,11];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new Mt(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1),new P(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const h=cc;this.copyUniforms=$s.clone(h.uniforms),this.blendMaterial=new ye({uniforms:this.copyUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,blending:Zi,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new bt,this.oldClearAlpha=1,this.basic=new Qi,this.fsQuad=new hc(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),i=Math.round(e/2);this.renderTargetBright.setSize(n,i);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,i),this.renderTargetsVertical[r].setSize(n,i),this.separableBlurMaterials[r].uniforms.invSize.value=new Mt(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(t,e,n,i,r){t.getClearColor(this._oldClearColor),this.oldClearAlpha=t.getClearAlpha();const a=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=n.texture,t.setRenderTarget(null),t.clear(),this.fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this.fsQuad.render(t);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=Pi.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this.fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=Pi.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this.fsQuad.render(t),o=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this.fsQuad.render(t),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(n),this.fsQuad.render(t)),t.setClearColor(this._oldClearColor,this.oldClearAlpha),t.autoClear=a}getSeperableBlurMaterial(t){const e=[];for(let n=0;n<t;n++)e.push(.39894*Math.exp(-.5*n*n/(t*t))/t);return new ye({defines:{KERNEL_RADIUS:t},uniforms:{colorTexture:{value:null},invSize:{value:new Mt(.5,.5)},direction:{value:new Mt(.5,.5)},gaussianCoefficients:{value:e}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(t){return new ye({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}Pi.BlurDirectionX=new Mt(1,0);Pi.BlurDirectionY=new Mt(0,1);const e0={name:"FXAAShader",uniforms:{tDiffuse:{value:null},resolution:{value:new Mt(1/1024,1/512)}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		// FXAA algorithm from NVIDIA, C# implementation by Jasper Flick, GLSL port by Dave Hoskins
		// http://developer.download.nvidia.com/assets/gamedev/files/sdk/11/FXAA_WhitePaper.pdf
		// https://catlikecoding.com/unity/tutorials/advanced-rendering/fxaa/

		uniform sampler2D tDiffuse;
		uniform vec2 resolution;
		varying vec2 vUv;

		#define EDGE_STEP_COUNT 6
		#define EDGE_GUESS 8.0
		#define EDGE_STEPS 1.0, 1.5, 2.0, 2.0, 2.0, 4.0
		const float edgeSteps[EDGE_STEP_COUNT] = float[EDGE_STEP_COUNT]( EDGE_STEPS );

		float _ContrastThreshold = 0.0312;
		float _RelativeThreshold = 0.063;
		float _SubpixelBlending = 1.0;

		vec4 Sample( sampler2D  tex2D, vec2 uv ) {

			return texture( tex2D, uv );

		}

		float SampleLuminance( sampler2D tex2D, vec2 uv ) {

			return dot( Sample( tex2D, uv ).rgb, vec3( 0.3, 0.59, 0.11 ) );

		}

		float SampleLuminance( sampler2D tex2D, vec2 texSize, vec2 uv, float uOffset, float vOffset ) {

			uv += texSize * vec2(uOffset, vOffset);
			return SampleLuminance(tex2D, uv);

		}

		struct LuminanceData {

			float m, n, e, s, w;
			float ne, nw, se, sw;
			float highest, lowest, contrast;

		};

		LuminanceData SampleLuminanceNeighborhood( sampler2D tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData l;
			l.m = SampleLuminance( tex2D, uv );
			l.n = SampleLuminance( tex2D, texSize, uv,  0.0,  1.0 );
			l.e = SampleLuminance( tex2D, texSize, uv,  1.0,  0.0 );
			l.s = SampleLuminance( tex2D, texSize, uv,  0.0, -1.0 );
			l.w = SampleLuminance( tex2D, texSize, uv, -1.0,  0.0 );

			l.ne = SampleLuminance( tex2D, texSize, uv,  1.0,  1.0 );
			l.nw = SampleLuminance( tex2D, texSize, uv, -1.0,  1.0 );
			l.se = SampleLuminance( tex2D, texSize, uv,  1.0, -1.0 );
			l.sw = SampleLuminance( tex2D, texSize, uv, -1.0, -1.0 );

			l.highest = max( max( max( max( l.n, l.e ), l.s ), l.w ), l.m );
			l.lowest = min( min( min( min( l.n, l.e ), l.s ), l.w ), l.m );
			l.contrast = l.highest - l.lowest;
			return l;

		}

		bool ShouldSkipPixel( LuminanceData l ) {

			float threshold = max( _ContrastThreshold, _RelativeThreshold * l.highest );
			return l.contrast < threshold;

		}

		float DeterminePixelBlendFactor( LuminanceData l ) {

			float f = 2.0 * ( l.n + l.e + l.s + l.w );
			f += l.ne + l.nw + l.se + l.sw;
			f *= 1.0 / 12.0;
			f = abs( f - l.m );
			f = clamp( f / l.contrast, 0.0, 1.0 );

			float blendFactor = smoothstep( 0.0, 1.0, f );
			return blendFactor * blendFactor * _SubpixelBlending;

		}

		struct EdgeData {

			bool isHorizontal;
			float pixelStep;
			float oppositeLuminance, gradient;

		};

		EdgeData DetermineEdge( vec2 texSize, LuminanceData l ) {

			EdgeData e;
			float horizontal =
				abs( l.n + l.s - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.se - 2.0 * l.e ) +
				abs( l.nw + l.sw - 2.0 * l.w );
			float vertical =
				abs( l.e + l.w - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.nw - 2.0 * l.n ) +
				abs( l.se + l.sw - 2.0 * l.s );
			e.isHorizontal = horizontal >= vertical;

			float pLuminance = e.isHorizontal ? l.n : l.e;
			float nLuminance = e.isHorizontal ? l.s : l.w;
			float pGradient = abs( pLuminance - l.m );
			float nGradient = abs( nLuminance - l.m );

			e.pixelStep = e.isHorizontal ? texSize.y : texSize.x;
			
			if (pGradient < nGradient) {

				e.pixelStep = -e.pixelStep;
				e.oppositeLuminance = nLuminance;
				e.gradient = nGradient;

			} else {

				e.oppositeLuminance = pLuminance;
				e.gradient = pGradient;

			}

			return e;

		}

		float DetermineEdgeBlendFactor( sampler2D  tex2D, vec2 texSize, LuminanceData l, EdgeData e, vec2 uv ) {

			vec2 uvEdge = uv;
			vec2 edgeStep;
			if (e.isHorizontal) {

				uvEdge.y += e.pixelStep * 0.5;
				edgeStep = vec2( texSize.x, 0.0 );

			} else {

				uvEdge.x += e.pixelStep * 0.5;
				edgeStep = vec2( 0.0, texSize.y );

			}

			float edgeLuminance = ( l.m + e.oppositeLuminance ) * 0.5;
			float gradientThreshold = e.gradient * 0.25;

			vec2 puv = uvEdge + edgeStep * edgeSteps[0];
			float pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
			bool pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !pAtEnd; i++ ) {

				puv += edgeStep * edgeSteps[i];
				pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
				pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			}

			if ( !pAtEnd ) {

				puv += edgeStep * EDGE_GUESS;

			}

			vec2 nuv = uvEdge - edgeStep * edgeSteps[0];
			float nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
			bool nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !nAtEnd; i++ ) {

				nuv -= edgeStep * edgeSteps[i];
				nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
				nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			}

			if ( !nAtEnd ) {

				nuv -= edgeStep * EDGE_GUESS;

			}

			float pDistance, nDistance;
			if ( e.isHorizontal ) {

				pDistance = puv.x - uv.x;
				nDistance = uv.x - nuv.x;

			} else {
				
				pDistance = puv.y - uv.y;
				nDistance = uv.y - nuv.y;

			}

			float shortestDistance;
			bool deltaSign;
			if ( pDistance <= nDistance ) {

				shortestDistance = pDistance;
				deltaSign = pLuminanceDelta >= 0.0;

			} else {

				shortestDistance = nDistance;
				deltaSign = nLuminanceDelta >= 0.0;

			}

			if ( deltaSign == ( l.m - edgeLuminance >= 0.0 ) ) {

				return 0.0;

			}

			return 0.5 - shortestDistance / ( pDistance + nDistance );

		}

		vec4 ApplyFXAA( sampler2D  tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData luminance = SampleLuminanceNeighborhood( tex2D, texSize, uv );
			if ( ShouldSkipPixel( luminance ) ) {

				return Sample( tex2D, uv );

			}

			float pixelBlend = DeterminePixelBlendFactor( luminance );
			EdgeData edge = DetermineEdge( texSize, luminance );
			float edgeBlend = DetermineEdgeBlendFactor( tex2D, texSize, luminance, edge, uv );
			float finalBlend = max( pixelBlend, edgeBlend );

			if (edge.isHorizontal) {

				uv.y += edge.pixelStep * finalBlend;

			} else {

				uv.x += edge.pixelStep * finalBlend;

			}

			return Sample( tex2D, uv );

		}

		void main() {

			gl_FragColor = ApplyFXAA( tDiffuse, resolution.xy, vUv );
			
		}`},Ge=Math.PI*2,gt=(s,t,e)=>s<t?t:s>e?e:s,ke=(s,t,e)=>s+(t-s)*e,be=(s,t,e,n)=>t+(s-t)*Math.exp(-e*n),Is=(s,t,e)=>{const n=gt((e-s)/(t-s),0,1);return n*n*(3-2*n)},jt=(s=0,t=1)=>s+Math.random()*(t-s);function is(s){let t=s>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function Nr(s,t){let e=(t-s)%Ge;return e>Math.PI&&(e-=Ge),e<-Math.PI&&(e+=Ge),e}function jn(s){if(!Number.isFinite(s)||s<=0)return"--:--.---";const t=Math.floor(s/60),e=Math.floor(s%60),n=Math.floor(s%1*1e3);return`${t}:${e.toString().padStart(2,"0")}.${n.toString().padStart(3,"0")}`}const qn=()=>new Promise(s=>requestAnimationFrame(()=>s())),Us={ultra:{pixelCap:2,shadowMapSize:2048,bloom:!0,fxaa:!0,maxBloom:1},high:{pixelCap:1.5,shadowMapSize:1536,bloom:!0,fxaa:!0,maxBloom:.85},performance:{pixelCap:1.1,shadowMapSize:1024,bloom:!0,fxaa:!0,maxBloom:.65}},n0={uniforms:{tDiffuse:{value:null},uTime:{value:0},uSpeed:{value:0},uExposure:{value:.94},uGrain:{value:.022},uVignette:{value:.42},uChroma:{value:.0018},uFlash:{value:0},uSat:{value:1.06},uContrast:{value:1.035},uResolution:{value:new Mt(1,1)}},vertexShader:`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    precision highp float;
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uSpeed;
    uniform float uExposure;
    uniform float uGrain;
    uniform float uVignette;
    uniform float uChroma;
    uniform float uFlash;
    uniform float uSat;
    uniform float uContrast;
    uniform vec2 uResolution;
    varying vec2 vUv;

    vec3 aces(vec3 x) {
      return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
    }

    float rand(vec2 co) {
      return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv;
      vec2 c = uv - 0.5;
      float r2 = dot(c, c);

      // Radial speed blur, weighted toward the frame edges.
      float blur = uSpeed * 0.055 * (0.25 + r2 * 2.2);
      vec3 col = vec3(0.0);
      float total = 0.0;
      for (int i = 0; i < 6; i++) {
        float t = float(i) / 5.0;
        float w = 1.0 - t * 0.72;
        col += texture2D(tDiffuse, uv - c * t * blur).rgb * w;
        total += w;
      }
      col /= total;

      // Chromatic aberration.
      vec2 ca = c * (uChroma * (0.6 + r2 * 2.4));
      col.r = mix(col.r, texture2D(tDiffuse, uv + ca).r, 0.5);
      col.b = mix(col.b, texture2D(tDiffuse, uv - ca).b, 0.5);

      col = aces(col * uExposure);

      float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = mix(col, col * vec3(0.84, 0.97, 1.14), (1.0 - lum) * 0.34);       // cool shadows
      col = mix(col, col * vec3(1.10, 1.005, 0.89), smoothstep(0.32, 1.0, lum) * 0.36); // warm highs
      col = mix(vec3(lum), col, uSat);
      col = (col - 0.5) * uContrast + 0.5;

      col += vec3(0.55, 0.65, 0.95) * uFlash;

      float vig = smoothstep(1.02, 0.25, length(c) * 1.35);
      col *= mix(1.0, vig, uVignette);

      float g = rand(uv * uResolution + fract(uTime) * 137.0) - 0.5;
      col += g * uGrain;

      col = pow(max(col, 0.0), vec3(1.0 / 2.2));
      gl_FragColor = vec4(col, 1.0);
    }
  `};class i0{constructor(t){T(this,"renderer");T(this,"scene",new rc);T(this,"camera");T(this,"composer");T(this,"renderPass");T(this,"bloomPass");T(this,"gradePass");T(this,"fxaaPass");T(this,"width",1);T(this,"height",1);T(this,"quality","ultra");T(this,"pixelCap",2);T(this,"baseScale",1);T(this,"renderScale",1);T(this,"adaptTimer",0);T(this,"frameAccum",0);T(this,"frameCount",0);T(this,"fpsEMA",60);T(this,"upWindows",0);T(this,"elapsed",0);T(this,"targetBloom",.32);T(this,"targetExposure",1.05);T(this,"onResize",()=>{const{w:t,h:e}=this.measure();this.width=t,this.height=e,this.renderer.setPixelRatio(this.baseScale*this.renderScale),this.renderer.setSize(t,e,!1),this.composer.setPixelRatio(this.baseScale*this.renderScale),this.composer.setSize(t,e),this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.applyResolution()});this.renderer=new Im({canvas:t,antialias:!1,alpha:!1,stencil:!1,depth:!0,powerPreference:"high-performance"}),this.renderer.setClearColor(329484,1),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Rl,this.renderer.toneMapping=Sn,this.renderer.outputColorSpace=Ie,this.renderer.autoClear=!0,this.camera=new He(62,1,.25,5200);const e=this.measure();this.width=e.w,this.height=e.h;const n=window.devicePixelRatio||1;this.baseScale=Math.min(n,this.pixelCap),this.renderer.setPixelRatio(this.baseScale),this.renderer.setSize(this.width,this.height,!1);const i=new Ke(Math.max(2,Math.floor(this.width*this.baseScale)),Math.max(2,Math.floor(this.height*this.baseScale)),{type:cn,samples:0});this.composer=new Jm(this.renderer,i),this.composer.setPixelRatio(this.baseScale),this.composer.setSize(this.width,this.height),this.renderPass=new Qm(this.scene,this.camera),this.composer.addPass(this.renderPass),this.bloomPass=new Pi(new Mt(this.width,this.height),.36,.55,1.12),this.composer.addPass(this.bloomPass),this.gradePass=new Ca(n0),this.composer.addPass(this.gradePass),this.fxaaPass=new Ca(e0),this.composer.addPass(this.fxaaPass),this.applyResolution(),window.addEventListener("resize",this.onResize),this.onResize()}measure(){const t=this.renderer.domElement,e=t.clientWidth||window.innerWidth,n=t.clientHeight||window.innerHeight;return{w:Math.max(1,e),h:Math.max(1,n)}}applyResolution(){const t=this.baseScale*this.renderScale;this.fxaaPass.material.uniforms.resolution.value.set(1/(this.width*t),1/(this.height*t)),this.gradePass.uniforms.uResolution.value.set(this.width*t,this.height*t)}setQuality(t){this.quality=t,this.pixelCap=Us[t].pixelCap,this.upWindows=0;const e=window.devicePixelRatio||1;this.baseScale=Math.min(e,this.pixelCap),this.renderScale=1,this.fxaaPass.enabled=Us[t].fxaa,this.applyResolution(),this.onResize()}getQuality(){return this.quality}get shadowMapSize(){return Us[this.quality].shadowMapSize}setBloom(t){this.targetBloom=t*Us[this.quality].maxBloom}setExposure(t){this.targetExposure=t}setSpeedBlur(t){this.gradePass.uniforms.uSpeed.value=t}setFlash(t){this.gradePass.uniforms.uFlash.value=t}setVignette(t){this.gradePass.uniforms.uVignette.value=t}setChroma(t){this.gradePass.uniforms.uChroma.value=t}get fps(){return this.fpsEMA}adaptResolution(t){if(this.adaptTimer+=t,this.adaptTimer<.9)return;this.adaptTimer=0;const e=this.fpsEMA;e<49&&this.renderScale>.62?(this.renderScale=Math.max(.62,this.renderScale-.09),this.upWindows=0,this.onResize()):e>58?(this.upWindows++,this.upWindows>=3&&this.renderScale<1&&(this.renderScale=Math.min(1,this.renderScale+.06),this.upWindows=0,this.onResize())):this.upWindows=0}render(t,e=0){if(this.elapsed+=t,this.frameAccum+=t,this.frameCount++,this.frameAccum>.25){const r=this.frameCount/this.frameAccum;this.fpsEMA=be(this.fpsEMA,r,3,this.frameAccum),this.frameAccum=0,this.frameCount=0}this.adaptResolution(t),this.gradePass.uniforms.uTime.value=this.elapsed,this.gradePass.uniforms.uSpeed.value=e;const n=this.bloomPass.strength;this.bloomPass.strength=be(n,this.targetBloom,2.4,t);const i=this.gradePass.uniforms.uExposure.value;this.gradePass.uniforms.uExposure.value=be(i,this.targetExposure,2.4,t),this.composer.render(t)}get rendererInfo(){const t=this.renderer.info.render;return{calls:t.calls,triangles:t.triangles,textures:this.renderer.info.memory.textures}}setSpeedShake(t){return gt(t,0,1)}}function Fe(s,t){const e=document.createElement("canvas");e.width=s,e.height=t;const n=e.getContext("2d");if(!n)throw new Error("2D canvas context unavailable");return[e,n]}function Qn(s,t,e){let n=s*374761393+t*668265263+e*1442695041;return n=(n^n>>>13)*1274126177,n=n^n>>>16,(n>>>0)/4294967296}function s0(s,t,e,n){const i=Math.floor(s),r=Math.floor(t),a=s-i,o=t-r,l=a*a*(3-2*a),c=o*o*(3-2*o),h=_=>(_%e+e)%e,u=Qn(h(i),h(r),n),d=Qn(h(i+1),h(r),n),f=Qn(h(i),h(r+1),n),g=Qn(h(i+1),h(r+1),n);return u+(d-u)*l+(f-u)*c+(u-d-f+g)*l*c}function On(s,t,e,n,i){let r=0,a=.5,o=1,l=e;for(let c=0;c<n;c++)r+=s0(s*o,t*o,l,i+c*71)*a,a*=.5,o*=2,l*=2;return r}function pe(s,t=!1){const e=new km(s);return e.wrapS=e.wrapT=Xs,e.anisotropy=8,e.colorSpace=t?Ie:xn,e.needsUpdate=!0,e}function uc(s,t){const e=On(s*3,t*3,3,4,991),n=On(s*7,t*7,7,3,313);return e*.78+n*.22}function r0(s){const[t,e]=Fe(s,s),n=e.createImageData(s,s),i=n.data;for(let a=0;a<s;a++)for(let o=0;o<s;o++){const l=o/s,c=a/s,h=On(l*6,c*6,6,4,17),u=Qn(o,a,77),d=On(l*26,c*26,26,2,41);let f=56+h*30+d*14+(u-.5)*8;const g=uc(l,c);g>.57&&(f-=(g-.57)*22);const _=(a*s+o)*4;i[_]=f*.94,i[_+1]=f*.97,i[_+2]=f*1.05,i[_+3]=255}e.putImageData(n,0,0);const r=is(9001);e.strokeStyle="rgba(10,12,15,0.5)",e.lineWidth=1;for(let a=0;a<26;a++){let o=r()*s,l=r()*s;e.beginPath(),e.moveTo(o,l);for(let c=0;c<14;c++)o+=(r()-.5)*16,l+=r()*10,e.lineTo(o,l);e.stroke()}return t}function a0(s){const[t,e]=Fe(s,s),n=e.createImageData(s,s),i=n.data;for(let r=0;r<s;r++)for(let a=0;a<s;a++){const o=a/s,l=r/s,c=uc(o,l),h=Qn(a,r,91);let u=.82+(On(o*14,l*14,14,3,8)-.5)*.12;u+=(h-.5)*.04,u=u*(1-Math.min(1,Math.max(0,(c-.56)/.12)))+.55;const d=Math.max(0,Math.min(255,u*255)),f=(r*s+a)*4;i[f]=d,i[f+1]=d,i[f+2]=d,i[f+3]=255}return e.putImageData(n,0,0),t}function o0(s){const[t,e]=Fe(s,s),n=e.createImageData(s,s),i=n.data,r=(o,l)=>On(o*9,l*9,9,3,5)*.75+On(o*26,l*26,26,2,9)*.25,a=1/s;for(let o=0;o<s;o++)for(let l=0;l<s;l++){const c=l/s,h=o/s,u=r(c+a,h)-r(c-a,h),d=r(c,h+a)-r(c,h-a),f=-u*.7,g=-d*.7,_=1,m=Math.hypot(f,g,_),p=(o*s+l)*4;i[p]=(f/m*.5+.5)*255,i[p+1]=(g/m*.5+.5)*255,i[p+2]=(_/m*.5+.5)*255,i[p+3]=255}return e.putImageData(n,0,0),t}function l0(s){const[t,e]=Fe(s,s),n=e.createImageData(s,s),i=n.data,r=8;for(let a=0;a<s;a++)for(let o=0;o<s;o++){const l=Math.floor(o/r),c=Math.floor(a/r),h=(l+c)%2===0,u=h?o%r/r:a%r/r,d=.5+.5*Math.sin(u*Math.PI),g=(h?16:9)+d*(h?16:10),_=(a*s+o)*4;i[_]=g,i[_+1]=g*1.02,i[_+2]=g*1.08,i[_+3]=255}return e.putImageData(n,0,0),t}function c0(s){const[t,e]=Fe(s,s),n=e.createImageData(s,s),i=n.data,r=8;for(let a=0;a<s;a++)for(let o=0;o<s;o++){const l=Math.floor(o/r),c=Math.floor(a/r),h=(l+c)%2===0,u=h?o%r/r:a%r/r,d=Math.cos(u*Math.PI*2)*.5,f=h?0:d,g=h?d:0,_=Math.hypot(f,g,1),m=(a*s+o)*4;i[m]=(f/_*.5+.5)*255,i[m+1]=(g/_*.5+.5)*255,i[m+2]=(1/_*.5+.5)*255,i[m+3]=255}return e.putImageData(n,0,0),t}function _l(s,t,e){const[n,i]=Fe(s,t);i.fillStyle=e?"#000000":"#151a24",i.fillRect(0,0,s,t);const r=is(4242),a=13,o=30,l=s*.06,c=t*.04,h=(s-l*2)/a,u=(t-c*2)/o;for(let d=0;d<o;d++)for(let f=0;f<a;f++){const g=r()>(e?.58:.8),_=l+f*h+h*.14,m=c+d*u+u*.18,p=h*.68,y=u*.55;if(g){const S=r()>.35,x=e?1:.55;i.fillStyle=S?`rgba(${230+r()*25},${160+r()*50},${70+r()*60},${x})`:`rgba(${90+r()*40},${150+r()*60},220,${x})`}else i.fillStyle=e?"rgba(0,0,0,0)":"rgba(30,40,58,0.9)";i.fillRect(_,m,p,y),e||(i.fillStyle="rgba(255,255,255,0.04)",i.fillRect(_,m,p,y*.18))}return n}function h0(s,t){const[e,n]=Fe(s,t);n.fillStyle="#0b0d14",n.fillRect(0,0,s,t);const i=is(717),r=["#ffcf9e","#e8f0ff","#ff6b8a","#5fd4ff","#ffb347","#c1a2ff"];for(let a=0;a<900;a++){n.fillStyle=r[Math.floor(i()*r.length)],n.globalAlpha=.25+i()*.6;const o=i()*s,l=i()*t;n.fillRect(o,l,2+i()*2,2+i()*2)}return n.globalAlpha=1,e}function Xi(s,t,e){const[n,i]=Fe(s,s),r=i.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);return r.addColorStop(0,t),r.addColorStop(.35,t),r.addColorStop(1,e),i.fillStyle=r,i.fillRect(0,0,s,s),n}function u0(s,t){const[e,n]=Fe(s,t);n.clearRect(0,0,s,t),n.strokeStyle="#243c22",n.lineWidth=8,n.beginPath(),n.moveTo(0,t*.5),n.quadraticCurveTo(s*.5,t*.42,s,t*.5),n.stroke(),n.fillStyle="#1f3a20";for(let i=0;i<26;i++){const r=10+i/26*(s-20),a=.35+Math.sin(i/26*Math.PI)*.5,o=t*a;n.save(),n.translate(r,t*.5),n.rotate((i%2===0?-1:1)*.45),n.beginPath(),n.ellipse(0,-o*.45,4.5,o*.55,.15,0,Math.PI*2),n.fill(),n.restore()}return e}function d0(){const[s,t]=Fe(256,64),e=16,n=s.width/e;for(let i=0;i<2;i++)for(let r=0;r<e;r++)t.fillStyle=(r+i)%2===0?"#eceff5":"#0b0c10",t.fillRect(r*n,i*32,n,32);return s}function f0(){const[s,t]=Fe(32,128);t.fillStyle="#d9dce4",t.fillRect(0,0,32,128),t.fillStyle="#c8203a",t.fillRect(0,0,32,64);const e=t.createLinearGradient(0,0,32,0);return e.addColorStop(0,"rgba(0,0,0,0.0)"),e.addColorStop(.5,"rgba(0,0,0,0.12)"),e.addColorStop(1,"rgba(0,0,0,0.0)"),t.fillStyle=e,t.fillRect(0,0,32,128),s}function Ns(s,t,e){const[n,i]=Fe(512,256),r=i.createLinearGradient(0,0,512,256);return r.addColorStop(0,"#070a12"),r.addColorStop(1,"#141a2a"),i.fillStyle=r,i.fillRect(0,0,512,256),i.strokeStyle=e,i.lineWidth=6,i.strokeRect(10,10,492,236),i.fillStyle=e,i.fillRect(28,32,68,8),i.font='italic 900 78px "Arial Black", Arial, sans-serif',i.fillStyle="#f4f7ff",i.textAlign="left",i.textBaseline="middle",i.fillText(s,28,128),i.font="600 28px Arial, sans-serif",i.fillStyle=e,i.fillText(t,32,196),n}function p0(s,t){const[e,n]=Fe(1024,256);return n.clearRect(0,0,1024,256),n.font='italic 900 172px "Arial Black", Arial, sans-serif',n.textAlign="center",n.textBaseline="middle",n.fillStyle=t,n.fillText(s,512,132),e}function m0(s){const[t,e]=Fe(s,s),n=e.createImageData(s,s),i=n.data;for(let r=0;r<s;r++)for(let a=0;a<s;a++){const o=a/s,l=r/s,c=On(o*7,l*7,7,4,613),h=Qn(a,r,771),u=.72+c*.35,d=150+c*70+(h-.5)*24,f=(r*s+a)*4;i[f]=d*u*.92,i[f+1]=d,i[f+2]=d*u*.78,i[f+3]=255}return e.putImageData(n,0,0),t}function g0(s){const t=pe(r0(512),!0),e=pe(a0(512)),n=pe(o0(512)),i=pe(l0(256),!0),r=pe(c0(256)),a=pe(_l(256,512,!1),!0),o=pe(_l(256,512,!0),!0),l=pe(h0(128,128),!0),c=pe(Xi(128,"rgba(0,0,0,0.78)","rgba(0,0,0,0)"),!0),h=pe(m0(256),!0);h.repeat.set(70,70);const u=pe(Xi(128,"rgba(220,225,235,0.85)","rgba(220,225,235,0)"),!0),d=pe(Xi(64,"rgba(255,240,190,1)","rgba(255,120,20,0)"),!0),f=pe(Xi(128,"rgba(120,240,255,0.95)","rgba(40,180,255,0)"),!0),g=pe(Xi(128,"rgba(255,90,200,0.95)","rgba(120,20,160,0)"),!0),_=pe(u0(256,128),!0),m=pe(d0(),!0),p=pe(f0(),!0),y=[pe(Ns("VANTA","SYNTHETIC FUEL","#37e6ff"),!0),pe(Ns("NITRO","BOOST THE NIGHT","#ff2d73"),!0),pe(Ns("APEX","PRECISION TYRES","#ffb02e"),!0),pe(Ns("VOLT","HYPERCARS","#8d6bff"),!0)],S=pe(p0("VANTA GP","#f5f8ff"),!0),x=[t,e,n,i,r,a,o,l,h,c,u,d,f,g,_,m,p,S,...y];for(const D of x)D.anisotropy=Math.min(8,s),D.needsUpdate=!0;return t.repeat.set(1,1),l.wrapS=l.wrapT=De,c.wrapS=c.wrapT=De,u.wrapS=u.wrapT=De,d.wrapS=d.wrapT=De,f.wrapS=f.wrapT=De,g.wrapS=g.wrapT=De,S.wrapS=S.wrapT=De,{asphalt:t,asphaltRough:e,asphaltNormal:n,carbon:i,carbonNormal:r,windows:a,windowsLit:o,crowd:l,terrain:h,shadow:c,smoke:u,spark:d,glowCyan:f,glowMagenta:g,palmFrond:_,checker:m,curb:p,billboards:y,startSign:S}}class _0{constructor(){T(this,"ctx",null);T(this,"master",null);T(this,"sfxBus",null);T(this,"musicBus",null);T(this,"noiseBuffer",null);T(this,"engine",null);T(this,"tireGain",null);T(this,"windGain",null);T(this,"nitroGain",null);T(this,"rainGain",null);T(this,"musicTimer",null);T(this,"nextNote",0);T(this,"step",0);T(this,"musicOn",!1);T(this,"lastImpact",0);T(this,"muted",!1);T(this,"lastGear",0)}init(){if(this.ctx){this.ctx.state==="suspended"&&this.ctx.resume();return}const t=window.AudioContext??window.webkitAudioContext;if(!t)return;const e=new t;this.ctx=e,e.resume();const n=e.createGain();n.gain.value=this.muted?1e-4:.9;const i=e.createDynamicsCompressor();i.threshold.value=-16,i.knee.value=22,i.ratio.value=5,i.attack.value=.004,i.release.value=.22,n.connect(i).connect(e.destination),this.master=n,this.sfxBus=e.createGain(),this.sfxBus.gain.value=.85,this.sfxBus.connect(n),this.musicBus=e.createGain(),this.musicBus.gain.value=.33,this.musicBus.connect(n),this.noiseBuffer=this.makeNoise(e,2),this.buildEngine(),this.buildLoops()}makeNoise(t,e){const n=Math.floor(t.sampleRate*e),i=t.createBuffer(1,n,t.sampleRate),r=i.getChannelData(0);let a=0;for(let o=0;o<n;o++){const l=Math.random()*2-1;a=(a+.02*l)/1.02,r[o]=a*3.5}return i}noiseSource(t=!1){if(!this.ctx||!this.noiseBuffer)return null;const e=this.ctx.createBufferSource();return e.buffer=this.noiseBuffer,e.loop=t,e}buildEngine(){const t=this.ctx,e=this.sfxBus;if(!t||!e)return;const n=t.createOscillator();n.type="sawtooth";const i=t.createOscillator();i.type="sawtooth",i.detune.value=9;const r=t.createOscillator();r.type="square";const a=t.createGain();a.gain.value=.32;const o=t.createWaveShaper(),l=new Float32Array(1024);for(let m=0;m<1024;m++){const p=m/1023*2-1;l[m]=Math.tanh(p*2.6)}o.curve=l,o.oversample="2x";const c=t.createBiquadFilter();c.type="lowpass",c.frequency.value=900,c.Q.value=5.5;const h=t.createGain();h.gain.value=1e-4;const u=t.createOscillator();u.type="sine",u.frequency.value=6;const d=t.createGain();d.gain.value=90,u.connect(d).connect(c.frequency),n.connect(a),i.connect(a),r.connect(a),a.connect(o).connect(c).connect(h).connect(e);const f=this.noiseSource(!0),g=t.createBiquadFilter();g.type="bandpass",g.frequency.value=420,g.Q.value=1.1;const _=t.createGain();_.gain.value=1e-4,f&&f.connect(g).connect(_).connect(e),f?.start(),n.start(),i.start(),r.start(),u.start(),this.engine={osc1:n,osc2:i,sub:r,filter:c,gain:h,noiseGain:_,noiseFilter:g,lfo:u,lfoGain:d}}buildLoops(){const t=this.ctx,e=this.sfxBus;if(!t||!e)return;const n=(i,r,a)=>{const o=this.noiseSource(!0),l=t.createBiquadFilter();l.type=i,l.frequency.value=r,l.Q.value=a;const c=t.createGain();return c.gain.value=1e-4,o&&o.connect(l).connect(c).connect(e),o?.start(),c};this.tireGain=n("bandpass",1650,3.2),this.windGain=n("lowpass",620,.7),this.nitroGain=n("highpass",1100,.8),this.rainGain=n("lowpass",2400,.5)}updateEngine(t,e,n,i,r,a){const o=this.ctx,l=this.engine;if(!o||!l)return;const c=o.currentTime,h=26+t/8e3*146;l.osc1.frequency.setTargetAtTime(h,c,.04),l.osc2.frequency.setTargetAtTime(h*1.006,c,.04),l.sub.frequency.setTargetAtTime(h*.5,c,.04);const u=240+t/8e3*2400+e*900+(i?500:0);l.filter.frequency.setTargetAtTime(u,c,.05),l.lfo.frequency.setTargetAtTime(3.5+t/8e3*8,c,.1);const d=a?.045+e*.055+n*.025+(i?.02:0):1e-4;l.gain.gain.setTargetAtTime(d,c,.08),l.noiseFilter.frequency.setTargetAtTime(320+e*500+t/8e3*260,c,.06),l.noiseGain.gain.setTargetAtTime(a?.008+e*.018:1e-4,c,.09),r!==this.lastGear&&(a&&this.lastGear!==0&&this.shiftPop(),this.lastGear=r)}updateTyres(t,e){if(!this.ctx||!this.tireGain)return;const n=gt(t*.19+(t>.35?.03:0),0,.22)*gt(e*2.5,0,1);this.tireGain.gain.setTargetAtTime(n,this.ctx.currentTime,.08)}updateWind(t){if(!this.ctx||!this.windGain)return;const e=gt(t*t*.14,0,.13);this.windGain.gain.setTargetAtTime(e,this.ctx.currentTime,.2)}updateNitro(t){!this.ctx||!this.nitroGain||this.nitroGain.gain.setTargetAtTime(t?.085:1e-4,this.ctx.currentTime,.09)}setRain(t){!this.ctx||!this.rainGain||this.rainGain.gain.setTargetAtTime(t?.045:1e-4,this.ctx.currentTime,.5)}setMuted(t){this.muted=t,this.ctx&&this.master&&this.master.gain.setTargetAtTime(t?1e-4:.9,this.ctx.currentTime,.05)}get isMuted(){return this.muted}tone(t,e,n,i,r,a,o,l=.008){const c=this.ctx;if(!c)return;const h=c.createOscillator();h.type=i,h.frequency.value=t;const u=c.createGain();u.gain.setValueAtTime(1e-4,e),u.gain.exponentialRampToValueAtTime(Math.max(2e-4,r),e+l),u.gain.exponentialRampToValueAtTime(1e-4,e+n);let d=u;if(o){const f=c.createBiquadFilter();f.type="lowpass",f.frequency.value=o,f.Q.value=1.2,u.connect(f),d=f}h.connect(u),d.connect(a),h.start(e),h.stop(e+n+.05)}noiseBurst(t,e,n,i,r,a,o){const l=this.ctx;if(!l)return;const c=this.noiseSource(!1);if(!c)return;const h=l.createBiquadFilter();h.type=i,h.frequency.value=r,h.Q.value=a;const u=l.createGain();u.gain.setValueAtTime(Math.max(2e-4,n),t),u.gain.exponentialRampToValueAtTime(1e-4,t+e),c.connect(h).connect(u).connect(o),c.start(t),c.stop(t+e+.05)}kick(t){const e=this.ctx,n=this.musicBus;if(!e||!n)return;const i=e.createOscillator();i.type="sine",i.frequency.setValueAtTime(132,t),i.frequency.exponentialRampToValueAtTime(42,t+.16);const r=e.createGain();r.gain.setValueAtTime(.5,t),r.gain.exponentialRampToValueAtTime(1e-4,t+.26),i.connect(r).connect(n),i.start(t),i.stop(t+.3)}shiftPop(){if(!this.ctx||!this.sfxBus)return;const t=this.ctx.currentTime;this.noiseBurst(t,.07,.06,"bandpass",900,1.5,this.sfxBus),this.tone(90,t,.06,"square",.05,this.sfxBus,700)}impact(t){if(!this.ctx||!this.sfxBus)return;const e=performance.now();if(e-this.lastImpact<70)return;this.lastImpact=e;const n=this.ctx.currentTime,i=gt(t,.1,1);this.noiseBurst(n,.18+i*.16,.18*i,"lowpass",900,.8,this.sfxBus),this.tone(70-i*20,n,.22,"sine",.22*i,this.sfxBus,220)}scrape(t){if(!this.ctx||!this.sfxBus)return;const e=this.ctx.currentTime;this.noiseBurst(e,.1,.05*t,"bandpass",2600,2.4,this.sfxBus)}beep(t=660,e=.14,n=.18,i="square"){!this.ctx||!this.sfxBus||this.tone(t,this.ctx.currentTime+.01,e,i,n,this.sfxBus,1800,.01)}countdown(t){t>0?this.beep(520,.11,.16,"square"):this.beep(1180,.5,.2,"sawtooth")}thunder(){if(!this.ctx||!this.sfxBus)return;const t=this.ctx.currentTime;this.noiseBurst(t+.05,1.8,.2,"lowpass",160,.6,this.sfxBus)}startMusic(){!this.ctx||this.musicOn||(this.musicOn=!0,this.nextNote=this.ctx.currentTime+.12,this.step=0,this.musicTimer=window.setInterval(()=>this.scheduleMusic(),90),this.scheduleMusic())}stopMusic(){this.musicOn=!1,this.musicTimer!==null&&(window.clearInterval(this.musicTimer),this.musicTimer=null)}scheduleMusic(){const t=this.ctx,e=this.musicBus;if(!t||!e||!this.musicOn||t.state!=="running")return;this.nextNote<t.currentTime-.5&&(this.nextNote=t.currentTime+.05);const n=60/96/4,i=[[220,261.63,329.63],[174.61,220,261.63],[261.63,329.63,392],[196,246.94,293.66]],r=[55,43.65,65.41,49];for(;this.nextNote<t.currentTime+.28;){const a=this.nextNote,o=this.step%64,l=Math.floor(o/16)%4,c=o%16,h=i[l],u=r[l];if(c%4===0&&this.kick(a),(c===4||c===12)&&this.noiseBurst(a,.16,.14,"highpass",1400,.8,e),c%2===0&&this.noiseBurst(a+.02,.045,.035,"highpass",7200,.7,e),[0,3,6,8,11,14].includes(c)){const d=c===6?u*1.5:c===14?u*2:u;this.tone(d,a,n*1.8,"sawtooth",.085,e,380,.02)}if(c===0)for(let d=0;d<h.length;d++){const f=this.ctx.createOscillator();f.type="sawtooth",f.frequency.value=h[d]*.5,f.detune.value=(d-1)*7;const g=this.ctx.createBiquadFilter();g.type="lowpass",g.frequency.value=900;const _=this.ctx.createGain(),m=n*15;_.gain.setValueAtTime(1e-4,a),_.gain.linearRampToValueAtTime(.022,a+.45),_.gain.setValueAtTime(.022,a+m-.6),_.gain.linearRampToValueAtTime(1e-4,a+m),f.connect(g).connect(_).connect(e),f.start(a),f.stop(a+m+.1)}if(c%2===1){const d=h[Math.floor(o/2)%6%3]*2;this.tone(d,a,n*.9,"triangle",.036,e,2400,.005)}this.nextNote+=n,this.step++}}}class v0{constructor(){T(this,"throttle",0);T(this,"brake",0);T(this,"steer",0);T(this,"handbrake",!1);T(this,"nitro",!1);T(this,"keys",new Set);T(this,"actions",new Set);T(this,"touch",{left:!1,right:!1,gas:!1,brake:!1,drift:!1,nitro:!1});T(this,"padIndex",-1);T(this,"prevPadButtons",[]);T(this,"onKeyDown",t=>{const e=t.code;if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Tab"].includes(e)&&t.preventDefault(),t.repeat){this.keys.add(e);return}this.keys.add(e),(e==="Escape"||e==="KeyP")&&this.actions.add("pause"),e==="KeyC"&&this.actions.add("camera"),e==="KeyR"&&this.actions.add("reset"),e==="KeyM"&&this.actions.add("mute"),e==="Enter"&&this.actions.add("start")});T(this,"onKeyUp",t=>{this.keys.delete(t.code)});T(this,"onBlur",()=>{this.keys.clear(),this.touch.left=this.touch.right=this.touch.gas=this.touch.brake=!1,this.touch.drift=this.touch.nitro=!1});window.addEventListener("keydown",this.onKeyDown,{passive:!1}),window.addEventListener("keyup",this.onKeyUp),window.addEventListener("blur",this.onBlur),window.addEventListener("gamepadconnected",t=>{this.padIndex=t.gamepad.index}),window.addEventListener("gamepaddisconnected",()=>{this.padIndex=-1}),this.bindTouch()}bindTouch(){document.querySelectorAll("[data-touch]").forEach(t=>{const e=t.dataset.touch,n=r=>{r.preventDefault(),t.classList.add("pressed"),this.touch[e]=!0;try{t.setPointerCapture(r.pointerId)}catch{}},i=()=>{t.classList.remove("pressed"),this.touch[e]=!1};t.addEventListener("pointerdown",n),t.addEventListener("pointerup",i),t.addEventListener("pointercancel",i),t.addEventListener("lostpointercapture",i)}),document.querySelectorAll("[data-action]").forEach(t=>{t.addEventListener("click",()=>{this.actions.add(t.dataset.action)})})}update(){this.readKeyboard(),this.readGamepad()}readKeyboard(){const t=this.keys,e=t.has("KeyA")||t.has("ArrowLeft"),n=t.has("KeyD")||t.has("ArrowRight"),i=t.has("KeyW")||t.has("ArrowUp"),r=t.has("KeyS")||t.has("ArrowDown"),a=t.has("Space"),o=t.has("ShiftLeft")||t.has("ShiftRight");let l=0;e&&(l-=1),n&&(l+=1),this.touch.left&&(l-=1),this.touch.right&&(l+=1),this.steer=gt(l,-1,1),this.throttle=i||this.touch.gas?1:0,this.brake=r||this.touch.brake?1:0,this.handbrake=a||this.touch.drift,this.nitro=o||this.touch.nitro}readGamepad(){const t=navigator.getGamepads?navigator.getGamepads():[];let e=null;if(this.padIndex>=0&&(e=t[this.padIndex]??null),!e){for(const u of t)if(u&&u.connected){e=u;break}}if(!e)return;this.padIndex=e.index;const n=e.axes[0]??0;Math.abs(n)>.12&&(this.steer=gt(n,-1,1));const i=e.buttons[7]?.value??0,r=e.buttons[6]?.value??0,a=e.axes[5]!==void 0?(e.axes[5]+1)/2:0,o=e.axes[4]!==void 0?(e.axes[4]+1)/2:0,l=Math.max(i,a),c=Math.max(r,o);l>.08&&(this.throttle=l),c>.08&&(this.brake=c),e.buttons[0]?.pressed&&(this.handbrake=!0),(e.buttons[2]?.pressed||e.buttons[5]?.pressed)&&(this.nitro=!0);const h=(u,d)=>{const f=e.buttons[u]?.pressed??!1;f&&!this.prevPadButtons[u]&&this.actions.add(d),this.prevPadButtons[u]=f};h(3,"camera"),h(9,"pause"),h(8,"reset")}consume(t){return this.actions.has(t)?(this.actions.delete(t),!0):!1}clearActions(){this.actions.clear()}}function vn(s,t=!1){const e=s[0].index!==null,n=new Set(Object.keys(s[0].attributes)),i=new Set(Object.keys(s[0].morphAttributes)),r={},a={},o=s[0].morphTargetsRelative,l=new de;let c=0;for(let h=0;h<s.length;++h){const u=s[h];let d=0;if(e!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in u.morphAttributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(u.morphAttributes[f])}if(t){let f;if(e)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,h),c+=f}}if(e){let h=0;const u=[];for(let d=0;d<s.length;++d){const f=s[d].index;for(let g=0;g<f.count;++g)u.push(f.getX(g)+h);h+=s[d].attributes.position.count}l.setIndex(u)}for(const h in r){const u=vl(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(const h in a){const u=a[h][0].length;if(u===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){const f=[];for(let _=0;_<a[h].length;++_)f.push(a[h][_][d]);const g=vl(f);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}return l}function vl(s){let t,e,n,i=-1,r=0;for(let c=0;c<s.length;++c){const h=s[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=h.gpuType),i!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const a=new t(r),o=new se(a,e,n);let l=0;for(let c=0;c<s.length;++c){const h=s[c];if(h.isInterleavedBufferAttribute){const u=l/e;for(let d=0,f=h.count;d<f;d++)for(let g=0;g<e;g++){const _=h.getComponent(d,g);o.setComponent(d+u,g,_)}}else a.set(h.array,l);l+=h.count*e}return i!==void 0&&(o.gpuType=i),o}const Ye=[{id:"vxr",name:"VXR-01",tagline:"The all-round weapon",color:13766703,accent:3794687,accel:12.6,topSpeed:91,grip:1.35,brake:35,nitro:1,stats:{speed:84,accel:82,handling:84}},{id:"phantom",name:"PHANTOM X",tagline:"Straight-line ballistic",color:4925400,accent:16723322,accel:11.9,topSpeed:97,grip:1.22,brake:32,nitro:1.12,stats:{speed:97,accel:78,handling:70}},{id:"apex",name:"RS APEX",tagline:"Corner-carving prototype",color:15769608,accent:16769354,accel:13.5,topSpeed:87,grip:1.52,brake:38,nitro:.92,stats:{speed:77,accel:93,handling:98}}],Fr=[{name:"Inferno",color:13766703,accent:3794687},{name:"Azure",color:691926,accent:10417407},{name:"Violet",color:5975039,accent:16723322},{name:"Solar",color:15769608,accent:16773018},{name:"Frost",color:15199477,accent:3139839},{name:"Onyx",color:1316381,accent:16726606},{name:"Acid",color:2607467,accent:14221116},{name:"Magenta",color:16723821,accent:16761570}];function xl(s,t=18,e=3){const n=t,i=[],r=[],a=[],o=s[0].z,l=s[s.length-1].z;for(let u=0;u<s.length;u++){const d=s[u],f=(d.yb+d.yt)*.5,g=(d.yt-d.yb)*.5;for(let _=0;_<n;_++){const m=_/n*Math.PI*2,p=Math.cos(m),y=Math.sin(m),S=d.w*Math.sign(p)*Math.pow(Math.abs(p),2/e),x=f+g*Math.sign(y)*Math.pow(Math.abs(y),2/e);i.push(S,x,d.z),r.push(_/n,(o-d.z)/(o-l))}}for(let u=0;u<s.length-1;u++)for(let d=0;d<n;d++){const f=u*n+d,g=(u+1)*n+d,_=u*n+(d+1)%n,m=(u+1)*n+(d+1)%n;a.push(f,g,_,_,g,m)}const c=(u,d)=>{const f=(u.yb+u.yt)*.5,g=i.length/3;i.push(0,f,u.z),r.push(.5,.5);const _=(d?s.length-1:0)*n;for(let m=0;m<n;m++){const p=_+m,y=_+(m+1)%n;d?a.push(g,y,p):a.push(g,p,y)}};c(s[s.length-1],!0),c(s[0],!1);const h=new de;return h.setAttribute("position",new re(i,3)),h.setAttribute("uv",new re(r,2)),h.setIndex(a),h.computeVertexNormals(),h}let Fs=null;function x0(s){if(Fs)return Fs;const t=new Fn(s,s,.35,28,1);t.rotateZ(Math.PI/2);const e=[],n=new Fn(s*.67,s*.67,.33,24);n.rotateZ(Math.PI/2),e.push(n);const i=new Fn(s*.2,s*.2,.37,16);i.rotateZ(Math.PI/2),e.push(i);for(let c=0;c<5;c++){const h=new Ct(.36,.055,s*.58);h.translate(0,0,s*.3),h.rotateX(c/5*Math.PI*2),h.translate(0,0,.01),e.push(h)}const r=vn(e,!1);if(!r)throw new Error("wheel merge failed");const a=new Ct(.34,.16,.12);a.translate(0,s*.45,0);const o=new Vt({color:460810,roughness:.82,metalness:.05}),l=new Vt({color:11186879,roughness:.2,metalness:1,envMapIntensity:1.5});return Fs={tire:t,rim:r,caliper:a,tireMat:o,rimMat:l},Fs}class dc{constructor(t,e){T(this,"root",new $e);T(this,"bodyPivot",new $e);T(this,"wheels",[]);T(this,"steerPivots",[]);T(this,"tailMat");T(this,"accentMat");T(this,"glow");T(this,"paintMat");T(this,"brakeGlow",3);T(this,"ownedMaterials",[]);T(this,"ownedGeometries",[]);e.carbon.repeat.set(3,3),e.carbonNormal.repeat.set(3,3);const n=new Aa({color:t.color,metalness:.38,roughness:.3,clearcoat:.85,clearcoatRoughness:.05,envMapIntensity:1.05,iridescence:.06,iridescenceIOR:1.5});this.paintMat=n,this.ownedMaterials.push(n);const i=new Vt({color:10133674,map:e.carbon,normalMap:e.carbonNormal,roughness:.33,metalness:.55,envMapIntensity:1.2}),r=new Aa({color:659480,metalness:.55,roughness:.045,clearcoat:1,clearcoatRoughness:.03,envMapIntensity:2.4}),a=new Vt({color:14147048,metalness:1,roughness:.12,envMapIntensity:1.8}),o=new Vt({color:592397,roughness:.55,metalness:.4}),l=new Vt({color:658448,emissive:15004927,emissiveIntensity:2.9,roughness:.2});this.tailMat=new Vt({color:1703941,emissive:16714276,emissiveIntensity:2,roughness:.25}),this.accentMat=new Vt({color:329482,emissive:t.accent,emissiveIntensity:4,roughness:.3}),this.ownedMaterials.push(i,r,a,o,l,this.tailMat,this.accentMat);const c=new Map,h=(x,D,C=0,b=0,R=0,E=0,v=0,L=0)=>{const U=new zt().makeRotationFromEuler(new Ne(E,v,L));U.setPosition(C,b,R),x.applyMatrix4(U);const O=c.get(D)??[];O.push(x),c.set(D,O)},u=xl([{z:2.31,w:.6,yb:.4,yt:.54},{z:2.16,w:.8,yb:.33,yt:.62},{z:1.9,w:.93,yb:.28,yt:.71},{z:1.5,w:1,yb:.26,yt:.81},{z:1,w:1.025,yb:.25,yt:.89},{z:.55,w:1.035,yb:.25,yt:.925},{z:0,w:1.04,yb:.25,yt:.945},{z:-.6,w:1.04,yb:.25,yt:.965},{z:-1.15,w:1.03,yb:.26,yt:.975},{z:-1.6,w:1,yb:.27,yt:.985},{z:-1.98,w:.94,yb:.29,yt:.95},{z:-2.22,w:.82,yb:.34,yt:.86},{z:-2.34,w:.66,yb:.42,yt:.74}]);h(u,n);const d=xl([{z:.78,w:.66,yb:.9,yt:.96},{z:.3,w:.6,yb:.92,yt:1.235},{z:-.45,w:.585,yb:.94,yt:1.3},{z:-1.02,w:.62,yb:.94,yt:1.12},{z:-1.28,w:.6,yb:.94,yt:.99}],16,2.6);h(d,r),h(new Ct(.86,.035,.9),n,0,1.297,-.16),h(new Ct(1.94,.06,.54),i,0,.21,2.09),h(new Ct(1.55,.05,.3),i,0,.16,2.26);for(const x of[-1,1])h(new Ct(.16,.07,2.4),i,x*1,.28,-.1,0,0,x*.05),h(new Ct(.1,.03,1.9),i,x*1.055,.31,-.15,0,0,x*.12),h(new Ct(.28,.02,.22),i,x*.98,.36,1.95,0,0,x*.25),h(new Ct(.04,.2,.72),o,x*1.02,.68,-.72,0,0,x*.06);for(let x=0;x<5;x++)h(new Ct(.035,.2,.62),i,-.42+x*.21,.3,-2.22);h(new Ct(1.72,.045,.42),i,0,1.13,-2.03,-.08,0,0),h(new Ct(.075,.26,.32),i,-.62,1,-2.02),h(new Ct(.075,.26,.32),i,.62,1,-2.02),h(new Ct(.52,.02,.4),i,0,.905,1.02);for(let x=0;x<3;x++)h(new Ct(.72,.02,.08),i,0,.99,-1.35-x*.18);for(const x of[-1,1])h(new Ct(.2,.055,.11),n,x*1.03,.96,.54),h(new Ct(.06,.06,.16),i,x*.96,.92,.56);for(const x of[-1,1])for(const D of[1.48,-1.5]){const C=new Ya(.45,.045,6,18,Math.PI);h(C,i,x*1.015,.36,D,0,Math.PI/2,0)}for(const x of[-1,1]){const D=new Fn(.075,.085,.25,12);D.rotateX(Math.PI/2),h(D,a,x*.27,.37,-2.36)}h(new Ct(.4,.05,.08),l,-.62,.63,2.24,0,-.16,0),h(new Ct(.4,.05,.08),l,.62,.63,2.24,0,.16,0),h(new Ct(.05,.22,.08),l,-.9,.56,2.08,0,-.35,0),h(new Ct(.05,.22,.08),l,.9,.56,2.08,0,.35,0),h(new Ct(1.56,.055,.06),this.tailMat,0,.83,-2.35),h(new Ct(.05,.16,.06),this.tailMat,-.79,.75,-2.35),h(new Ct(.05,.16,.06),this.tailMat,.79,.75,-2.35);for(const x of[-1,1])h(new Ct(.012,.02,2.3),this.accentMat,x*1.06,.315,-.1);for(const[x,D]of c){const C=vn(D,!1);if(!C)continue;const b=new Ut(C,x);b.castShadow=!0,b.receiveShadow=!0,this.bodyPivot.add(b),this.ownedGeometries.push(C)}this.root.add(this.bodyPivot);const f=new Ve(3.2,5.7);f.rotateX(-Math.PI/2);const g=new Qi({map:e.shadow,transparent:!0,opacity:.78,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3,toneMapped:!1}),_=new Ut(f,g);_.position.y=.028,_.renderOrder=1,this.root.add(_),this.ownedGeometries.push(f),this.ownedMaterials.push(g);const m=x0(.36),p=new Vt({color:1316121,metalness:.7,roughness:.3,emissive:t.accent,emissiveIntensity:.7});this.ownedMaterials.push(p);for(let x=0;x<4;x++){const D=x<2,C=x%2===0?-1:1,b=D?1.5:-1.55,R=new $e;R.position.set(C*1.02,.36,b);const E=new $e,v=new Ut(m.tire,m.tireMat);v.castShadow=!0;const L=new Ut(m.rim,m.rimMat);L.castShadow=!0;const U=new Ut(m.caliper,p);E.add(v,L),R.add(E,U),this.root.add(R),this.wheels.push(E),this.steerPivots.push(R)}const y=new Ve(2.2,4);y.rotateX(-Math.PI/2);const S=new Qi({map:e.glowCyan,color:new bt(t.accent),transparent:!0,opacity:.12,blending:Zi,depthWrite:!1,toneMapped:!1});this.glow=new Ut(y,S),this.glow.position.y=.045,this.glow.renderOrder=3,this.root.add(this.glow),this.ownedGeometries.push(y),this.ownedMaterials.push(S)}setPaint(t,e){this.paintMat.color.setHex(t),this.accentMat.emissive.setHex(e),this.glow.material.color.setHex(e).multiplyScalar(1)}dispose(){this.root.removeFromParent();for(const t of this.ownedMaterials)t.dispose();for(const t of this.ownedGeometries)t.dispose();this.ownedMaterials.length=0,this.ownedGeometries.length=0}setBrake(t){this.brakeGlow=t?9:3}setGlow(t){this.glow.material.opacity=t?.24:.12}updateVisual(t,e,n,i,r){for(const a of this.wheels)a.rotation.x+=e/.36*t;for(let a=0;a<2;a++)this.steerPivots[a].rotation.y=-n*.4;this.tailMat.emissiveIntensity=Mh.damp(this.tailMat.emissiveIntensity,r?8.5:2.2,14,t),this.accentMat.emissiveIntensity=3.5+Math.sin(performance.now()*.004)*.8+i*2,this.glow.position.y=.045}setBodyTilt(t,e){this.bodyPivot.rotation.z=t,this.bodyPivot.rotation.x=e}}const Ml="vanta-gp-config-v1",yl="vanta-gp-best-v1",M0=`<svg class="car-svg" viewBox="0 0 240 74" aria-hidden="true">
  <path fill="currentColor" d="M14 54c1-7 5-11 13-12l20-2 18-15c5-4 12-6 21-6h40c12 0 21 3 28 9l11 10 41 4c9 1 15 5 19 12l3 6-8 3c-3-5-8-7-15-7-6 0-11 3-14 8H74c-3-5-8-8-15-8-6 0-11 3-14 8l-31-1z"/>
  <circle cx="59" cy="59" r="11" fill="#05070c"/><circle cx="59" cy="59" r="5.5" fill="#aebacd"/>
  <circle cx="186" cy="59" r="11" fill="#05070c"/><circle cx="186" cy="59" r="5.5" fill="#aebacd"/>
</svg>`;class y0{constructor(){T(this,"config");T(this,"onStart",null);T(this,"onResume",null);T(this,"onRestart",null);T(this,"onQuit",null);T(this,"onConfigChange",null);T(this,"onToggleSound",null);T(this,"menu",document.getElementById("menu"));T(this,"loading",document.getElementById("loading"));T(this,"loadingFill",document.getElementById("loading-fill"));T(this,"loadingLabel",document.getElementById("loading-label"));T(this,"pauseEl",document.getElementById("pause"));T(this,"resultsEl",document.getElementById("results"));T(this,"resultsBody",document.getElementById("results-body"));T(this,"resultsTitle",document.getElementById("results-title"));T(this,"resultsStats",document.getElementById("results-stats"));T(this,"resultsBadge",document.getElementById("results-badge"));T(this,"carList",document.getElementById("car-list"));T(this,"paintList",document.getElementById("paint-list"));T(this,"soundBtn",document.getElementById("sound-btn"));T(this,"menuBest",document.getElementById("menu-best"));T(this,"touch",document.getElementById("touch"));this.config=this.loadConfig(),this.buildCars(),this.buildPaints(),this.bind(),this.applySelection(),this.setSound(localStorage.getItem("vanta-gp-muted")==="1"),window.matchMedia("(pointer: coarse)").matches&&this.touch.classList.add("enabled")}loadConfig(){const t={carId:Ye[0].id,color:Ye[0].color,accent:Ye[0].accent,weather:"sunset",quality:window.matchMedia("(pointer: coarse)").matches?"high":"ultra"};try{const e=localStorage.getItem(Ml);if(!e)return t;const n=JSON.parse(e);return Ye.some(i=>i.id===n.carId)||(n.carId=t.carId),typeof n.color!="number"&&(n.color=t.color),typeof n.accent!="number"&&(n.accent=t.accent),n.weather!=="storm"&&n.weather!=="sunset"&&(n.weather="sunset"),["ultra","high","performance"].includes(n.quality??"")||(n.quality="ultra"),n}catch{return t}}saveConfig(){localStorage.setItem(Ml,JSON.stringify(this.config))}buildCars(){this.carList.innerHTML=Ye.map((t,e)=>`
      <button class="car-card" data-car="${t.id}" type="button">
        <div class="car-card-top"><span class="car-num">0${e+1}</span><span class="car-name">${t.name}</span></div>
        <div class="car-art" style="color:#${t.color.toString(16).padStart(6,"0")}">${M0}</div>
        <div class="car-tag">${t.tagline}</div>
        <div class="stat"><span>SPEED</span><i><b style="width:${t.stats.speed}%"></b></i><em>${t.stats.speed}</em></div>
        <div class="stat"><span>ACCEL</span><i><b style="width:${t.stats.accel}%"></b></i><em>${t.stats.accel}</em></div>
        <div class="stat"><span>GRIP</span><i><b style="width:${t.stats.handling}%"></b></i><em>${t.stats.handling}</em></div>
      </button>`).join(""),this.carList.querySelectorAll(".car-card").forEach(t=>{t.addEventListener("click",()=>{const e=t.dataset.car;if(!e||e===this.config.carId)return;this.config.carId=e;const n=Ye.find(i=>i.id===e);n&&(this.config.color=n.color,this.config.accent=n.accent),this.applySelection(),this.saveConfig(),this.onConfigChange?.(this.config)})})}buildPaints(){this.paintList.innerHTML=Fr.map((t,e)=>`<button class="paint" type="button" data-paint="${e}" title="${t.name}" style="--swatch:#${t.color.toString(16).padStart(6,"0")};--swatch-accent:#${t.accent.toString(16).padStart(6,"0")}"></button>`).join(""),this.paintList.querySelectorAll(".paint").forEach(t=>{t.addEventListener("click",()=>{const e=Number(t.dataset.paint),n=Fr[e];n&&(this.config.color=n.color,this.config.accent=n.accent,this.applySelection(),this.saveConfig(),this.onConfigChange?.(this.config))})})}bind(){document.getElementById("start-btn")?.addEventListener("click",()=>{this.onStart?.()}),document.getElementById("resume-btn")?.addEventListener("click",()=>{this.onResume?.()}),document.getElementById("restart-btn")?.addEventListener("click",()=>{this.onRestart?.()}),document.getElementById("quit-btn")?.addEventListener("click",()=>{this.onQuit?.()}),document.getElementById("again-btn")?.addEventListener("click",()=>{this.onRestart?.()}),document.getElementById("menu-btn")?.addEventListener("click",()=>{this.onQuit?.()}),this.soundBtn.addEventListener("click",()=>{this.onToggleSound?.()}),document.querySelectorAll(".seg[data-setting]").forEach(t=>{const e=t.dataset.setting;t.querySelectorAll("button").forEach(n=>{n.addEventListener("click",()=>{const i=n.dataset.value;i&&(e==="weather"?this.config.weather=i==="storm"?"storm":"sunset":this.config.quality=i,this.applySelection(),this.saveConfig(),this.onConfigChange?.(this.config))})})})}applySelection(){this.carList.querySelectorAll(".car-card").forEach(t=>{t.classList.toggle("selected",t.dataset.car===this.config.carId)}),this.paintList.querySelectorAll(".paint").forEach(t=>{const e=Fr[Number(t.dataset.paint)];t.classList.toggle("selected",e.color===this.config.color)}),document.querySelectorAll('.seg[data-setting="weather"] button').forEach(t=>{t.classList.toggle("active",t.dataset.value===this.config.weather)}),document.querySelectorAll('.seg[data-setting="quality"] button').forEach(t=>{t.classList.toggle("active",t.dataset.value===this.config.quality)})}setSound(t){localStorage.setItem("vanta-gp-muted",t?"1":"0"),this.soundBtn.textContent=t?"SOUND · OFF":"SOUND · ON",this.soundBtn.classList.toggle("off",t)}showMenu(t){this.menu.classList.add("visible"),this.menuBest.textContent=jn(t),this.pauseEl.classList.remove("visible"),this.resultsEl.classList.remove("visible")}hideMenu(){this.menu.classList.remove("visible")}showPause(){this.pauseEl.classList.add("visible")}hidePause(){this.pauseEl.classList.remove("visible")}showResults(t){this.resultsTitle.innerHTML=`<span class="pos-accent">P${t.position}</span> / ${t.totalCars}<small>RACE COMPLETE</small>`,this.resultsStats.innerHTML=`
      <div class="res-stat"><span>TOTAL TIME</span><strong>${jn(t.totalTime)}</strong></div>
      <div class="res-stat"><span>BEST LAP</span><strong>${jn(t.bestLap)}</strong></div>
      <div class="res-stat"><span>LAPS</span><strong>${t.laps.map(e=>jn(e)).join(" · ")}</strong></div>`,this.resultsBadge.textContent=t.newBest?"NEW PERSONAL BEST":"SUNSET CIRCUIT",this.resultsBadge.classList.toggle("gold",t.newBest),this.resultsBody.innerHTML=t.rows.map(e=>`<div class="res-row ${e.isPlayer?"player":""}">
          <span class="res-pos">${e.position}</span>
          <span class="res-driver">${e.driver}</span>
          <span class="res-car">${e.car}</span>
          <span class="res-time">${e.timeText}</span>
        </div>`).join(""),this.resultsEl.classList.add("visible")}hideResults(){this.resultsEl.classList.remove("visible")}setLoading(t,e){this.loadingLabel.textContent=t,this.loadingFill.style.width=`${Math.round(e*100)}%`}hideLoading(){this.loading.classList.add("done"),window.setTimeout(()=>{this.loading.style.display="none"},700)}bestLap(){const t=Number(localStorage.getItem(yl)??0);return Number.isFinite(t)?t:0}saveBestLap(t){const e=this.bestLap();return!t||e&&t>=e?!1:(localStorage.setItem(yl,String(t)),this.menuBest.textContent=jn(t),!0)}}const S0=`
varying vec3 vDir;
void main() {
  vDir = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,E0=`
precision highp float;
varying vec3 vDir;

uniform vec3 uSunDir;
uniform vec3 uZenith;
uniform vec3 uHorizon;
uniform vec3 uGround;
uniform vec3 uSunColor;
uniform vec3 uCloudColor;
uniform float uTime;
uniform float uClouds;
uniform float uFlash;
uniform float uStorm;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.1, 9.3);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec3 d = normalize(vDir);
  float y = d.y;
  float up = clamp(y, 0.0, 1.0);
  vec3 col = mix(uHorizon, uZenith, pow(up, 0.58));

  float sunAmt = max(dot(d, normalize(uSunDir)), 0.0);
  // Broad atmospheric scattering, tight forward glow and the disc.
  col += uSunColor * pow(sunAmt, 3.5) * 0.11;
  col += uSunColor * pow(sunAmt, 24.0) * 0.32;
  col += uSunColor * smoothstep(0.99925, 0.99985, sunAmt) * 2.6;

  // Warm band hugging the horizon towards the sun.
  vec2 dh = normalize(d.xz + vec2(0.0001));
  vec2 sh = normalize(uSunDir.xz + vec2(0.0001));
  float az = max(dot(dh, sh), 0.0);
  col += uSunColor * pow(1.0 - abs(y), 9.0) * pow(az, 3.0) * 0.34;

  // Stars, only high in the sky and when the sky is deep enough.
  float starField = hash21(floor(d.xz * 900.0 / (0.2 + abs(d.y))));
  col += vec3(0.8, 0.9, 1.0) * smoothstep(0.9985, 1.0, starField) * smoothstep(0.15, 0.55, y) * 0.7;

  // Clouds projected on the sky dome with slow drift.
  if (uClouds > 0.001 && y > -0.02) {
    vec2 uv = vec2(atan(d.z, d.x) * 1.55, asin(clamp(d.y, -1.0, 1.0)) * 2.4);
    vec2 drift = vec2(uTime * 0.0055, uTime * 0.0012);
    float n = fbm(uv * 1.35 + drift + fbm(uv * 2.4 - drift * 2.0) * 0.35);
    float mask = smoothstep(0.42, 0.66, n) * uClouds * smoothstep(-0.012, 0.22, y);
    vec3 cloud = uCloudColor;
    cloud += uSunColor * pow(sunAmt, 5.0) * 0.65;
    cloud *= 0.85 + n * 0.35;
    col = mix(col, cloud, mask * 0.92);
  }

  // Storm wall / lightning rim.
  if (uStorm > 0.5) {
    col += vec3(0.35, 0.45, 0.7) * uFlash * (0.4 + fbm(vec2(uTime * 3.0, 4.0)) * 0.8);
  }

  // Ground haze below the horizon.
  col = mix(uGround, col, smoothstep(-0.085, 0.005, y));

  gl_FragColor = vec4(col, 1.0);
}
`,es={zenith:1186363,horizon:16742981,ground:1708569,sun:16763024,cloud:6571344,fog:11038810,fogDensity:78e-5,light:16757629,lightIntensity:3.4,hemiSky:9414911,hemiGround:2759190,hemiIntensity:1.05,sunDir:new P(.985,.3,-.174).normalize(),clouds:.95,exposure:1.01,bloom:.34,envIntensity:.66},w0={zenith:461588,horizon:4805739,ground:658450,sun:11057880,cloud:1317155,fog:3949908,fogDensity:.0011,light:10466006,lightIntensity:1.35,hemiSky:7044774,hemiGround:1119517,hemiIntensity:1.05,sunDir:new P(-.42,.42,.68).normalize(),clouds:1,exposure:1.04,bloom:.55,envIntensity:.66};class b0{constructor(t){T(this,"mesh");T(this,"material");T(this,"envScene");T(this,"envMesh");T(this,"envTarget",null);T(this,"pmrem");T(this,"renderer");T(this,"palette",es);T(this,"storm",!1);this.renderer=t,this.pmrem=new wa(t),this.pmrem.compileEquirectangularShader();const e=new ts(1,48,32);this.material=new ye({vertexShader:S0,fragmentShader:E0,side:Re,depthWrite:!1,fog:!1,uniforms:{uSunDir:{value:this.palette.sunDir.clone()},uZenith:{value:new bt(this.palette.zenith)},uHorizon:{value:new bt(this.palette.horizon)},uGround:{value:new bt(this.palette.ground)},uSunColor:{value:new bt(this.palette.sun)},uCloudColor:{value:new bt(this.palette.cloud)},uTime:{value:0},uClouds:{value:this.palette.clouds},uFlash:{value:0},uStorm:{value:0}}}),this.mesh=new Ut(e,this.material),this.mesh.scale.setScalar(4200),this.mesh.frustumCulled=!1,this.mesh.renderOrder=-1e3,this.envScene=new rc,this.envMesh=new Ut(e,this.material),this.envMesh.scale.setScalar(40),this.envScene.add(this.envMesh)}setPalette(t,e){this.palette=t,this.storm=e;const n=this.material.uniforms;n.uZenith.value.set(t.zenith),n.uHorizon.value.set(t.horizon),n.uGround.value.set(t.ground),n.uSunColor.value.set(t.sun),n.uCloudColor.value.set(t.cloud),n.uSunDir.value.copy(t.sunDir),n.uClouds.value=t.clouds,n.uStorm.value=e?1:0,this.material.needsUpdate=!0,this.renderEnvironment()}renderEnvironment(){this.envTarget&&this.envTarget.dispose();const t=this.pmrem.fromScene(this.envScene,0,.1,100);return this.envTarget=t.texture,t.texture}get environment(){return this.envTarget}setFlash(t){this.material.uniforms.uFlash.value=t}update(t,e){this.material.uniforms.uTime.value+=t,this.mesh.position.copy(e)}dispose(){this.envTarget?.dispose(),this.pmrem.dispose(),this.material.dispose(),this.mesh.geometry.dispose()}}const Le=8.5,Bs=1.25,T0=2.6,Un=12.3,A0=1200,C0=new P(0,1,0);class R0{constructor(t){T(this,"group",new $e);T(this,"samples",[]);T(this,"length");T(this,"minimapPoints",[]);T(this,"minimapBounds",new Ym(new Mt(1/0,1/0),new Mt(-1/0,-1/0)));T(this,"startLine");T(this,"textures");T(this,"roadMat");T(this,"terrainSampler",null);this.textures=t,this.group.name="circuit";const n=[[-45,8,300],[140,7,300],[300,5,260],[402,3,158],[390,1.5,38],[298,2,-24],[248,5,-102],[300,8,-208],[220,10.5,-304],[82,10,-314],[8,7,-232],[42,4.5,-118],[-44,3.5,-70],[-162,4.5,-102],[-262,6.5,-30],[-304,5,102],[-242,6.5,212],[-142,8,262]].map(([c,h,u])=>new P(c,h,u)),r=new Hm(n,!0,"centripetal",.5).getSpacedPoints(A0);r.pop();const a=r.length;let o=0;for(let c=0;c<a;c++){const h=r[(c+1)%a],u=r[(c-1+a)%a],d=h.clone().sub(u).normalize(),f=d.clone().cross(C0).normalize();this.samples.push({pos:r[c].clone(),tangent:d,right:f,bank:0,curvature:0,s:o,segLen:r[c].distanceTo(h)}),o+=r[c].distanceTo(h)}this.length=o;const l=new Float32Array(a);for(let c=0;c<a;c++){const h=this.samples[c].tangent,u=this.samples[(c+1)%a].tangent,d=h.z*u.x-h.x*u.z,f=Math.max(.001,this.samples[c].segLen);l[c]=Math.asin(gt(d,-1,1))/f}for(let c=0;c<a;c++){let h=0,u=0;for(let f=-6;f<=6;f++){const g=1-Math.abs(f)/7;h+=l[(c+f+a)%a]*g,u+=g}const d=h/u;this.samples[c].curvature=d,this.samples[c].bank=gt(d*7.5,-.085,.085)}for(const c of this.samples)this.minimapBounds.expandByPoint(new Mt(c.pos.x,c.pos.z));for(let c=0;c<a;c+=5)this.minimapPoints.push(new Mt(this.samples[c].pos.x,this.samples[c].pos.z));this.roadMat=new Aa({map:t.asphalt,normalMap:t.asphaltNormal,roughnessMap:t.asphaltRough,normalScale:new Mt(.15,.15),roughness:1,metalness:.03,envMapIntensity:.5,specularIntensity:.28,specularColor:16777215,color:13818084,dithering:!0}),this.buildRoad(),this.buildCurbs(),this.buildRunoff(),this.buildBarriers(),this.buildStartLine(),this.buildMarkings(),this.buildTerrain(),this.buildOcean(),this.startLine=this.frameAt(0).pos.clone(),this.group.matrixAutoUpdate=!1,this.group.updateMatrixWorld(!0)}get totalLength(){return this.length}frameAt(t,e){const n=this.samples.length;let i=t%this.length;i<0&&(i+=this.length);const r=i/this.length*n,a=Math.floor(r)%n,o=(a+1)%n,l=r-Math.floor(r),c=this.samples[a],h=this.samples[o],u=new P().lerpVectors(c.pos,h.pos,l),d=new P().lerpVectors(c.tangent,h.tangent,l).normalize(),f=new P().lerpVectors(c.right,h.right,l).normalize(),g=ke(c.bank,h.bank,l),_=new P(0,1,0).addScaledVector(f,-Math.tan(g)).normalize();return e?(e.pos.copy(u),e.tangent.copy(d),e.right.copy(f),e.up.copy(_),e.bank=g,e.curvature=ke(c.curvature,h.curvature,l),e.s=i,e):{pos:u,tangent:d,right:f,up:_,bank:g,curvature:ke(c.curvature,h.curvature,l),s:i}}nearest(t,e=-1,n){const i=this.samples.length;let r=-1,a=1/0,o=0;if(e>=0){const x=e-12;for(let D=0;D<=24;D++){const C=((x+D)%i+i)%i,b=this.segmentDistance(t,C);b.d2<a&&(a=b.d2,r=C,o=b.t)}}else{for(let D=0;D<i;D+=4){const C=this.segmentDistance(t,D);C.d2<a&&(a=C.d2,r=D,o=C.t)}const x=r;for(let D=-5;D<=5;D++){const C=((x+D)%i+i)%i,b=this.segmentDistance(t,C);b.d2<a&&(a=b.d2,r=C,o=b.t)}}const l=this.samples[r],c=this.samples[(r+1)%i],h=ke(l.pos.x,c.pos.x,o),u=ke(l.pos.z,c.pos.z,o),d=ke(l.pos.y,c.pos.y,o),f=new P().lerpVectors(l.right,c.right,o).normalize(),g=new P().lerpVectors(l.tangent,c.tangent,o).normalize(),_=ke(l.bank,c.bank,o),m=(t.x-h)*f.x+(t.z-u)*f.z,p=d+m*Math.tan(_),y=(l.s+o*l.segLen+this.length)%this.length,S=n??{index:r,s:y,lateral:m,height:p,distSq:a,tangent:g,right:f,bank:_,onRoad:!0};return S.index=r,S.s=y,S.lateral=m,S.height=p,S.distSq=a,S.tangent.copy(g),S.right.copy(f),S.bank=_,S.onRoad=Math.abs(m)<=Le+Bs,S}segmentDistance(t,e){const n=this.samples.length,i=this.samples[e].pos,r=this.samples[(e+1)%n].pos,a=r.x-i.x,o=r.z-i.z,l=a*a+o*o;let c=0;l>1e-6&&(c=((t.x-i.x)*a+(t.z-i.z)*o)/l,c=gt(c,0,1));const h=t.x-(i.x+a*c),u=t.z-(i.z+o*c);return{d2:h*h+u*u,t:c}}surfaceHeight(t,e,n){return n+t*Math.tan(e)}terrainHeightAt(t,e){return this.terrainSampler?this.terrainSampler(t,e):0}setWet(t){this.roadMat.roughness=t?.7:1,this.roadMat.envMapIntensity=t?.9:.5,this.roadMat.normalScale.set(t?.4:.55,t?.4:.55)}basisAt(t){const e=new P(0,1,0).addScaledVector(t.right,-Math.tan(t.bank)).normalize(),n=t.tangent.clone().normalize(),i=new P().crossVectors(e,n).normalize(),r=new P().crossVectors(n,i).normalize();return{x:i,y:r,z:n}}gridSlot(t){const e=Math.floor(t/2),i=(t%2===0?-1:1)*2.55,r=(this.length-20-e*11+this.length)%this.length,a=this.frameAt(r),o=a.pos.y+i*Math.tan(a.bank);return{position:new P(a.pos.x+a.right.x*i,o+.02,a.pos.z+a.right.z*i),yaw:Math.atan2(a.tangent.x,a.tangent.z),s:r,lateral:i}}ribbon(t,e,n,i,r,a,o,l,c=!0){const h=this.samples.length,u=new Float32Array(h*2*3),d=new Float32Array(h*2*2),f=new Uint32Array(h*6);for(let m=0;m<h;m++){const p=this.samples[m],y=p.pos.y+p.bank*0,S=y+Math.tan(p.bank)*t+n,x=y+Math.tan(p.bank)*e+i,D=m*6;u[D]=p.pos.x+p.right.x*t,u[D+1]=S,u[D+2]=p.pos.z+p.right.z*t,u[D+3]=p.pos.x+p.right.x*e,u[D+4]=x,u[D+5]=p.pos.z+p.right.z*e;const C=m*4;d[C]=r,d[C+1]=p.s/o,d[C+2]=a,d[C+3]=p.s/o;const b=m*6,R=(m+1)%h;f[b]=m*2,f[b+1]=m*2+1,f[b+2]=R*2,f[b+3]=m*2+1,f[b+4]=R*2+1,f[b+5]=R*2}const g=new de;g.setAttribute("position",new se(u,3)),g.setAttribute("uv",new se(d,2)),g.setIndex(new se(f,1)),g.computeVertexNormals();const _=new Ut(g,l);return _.receiveShadow=c,_.matrixAutoUpdate=!1,_.updateMatrix(),this.group.add(_),_}buildRoad(){this.ribbon(-Le,Le,0,0,0,2,12,this.roadMat,!0);const t=new Vt({map:this.textures.asphalt,normalMap:this.textures.asphaltNormal,color:3159102,roughness:.55,metalness:.02,transparent:!0,opacity:.22,depthWrite:!1,envMapIntensity:1.2}),e=this.ribbon(-2.9,2.9,.006,.006,0,1,14,t,!1);e.renderOrder=1}buildCurbs(){const t=new Vt({map:this.textures.curb,roughness:.42,metalness:.02,envMapIntensity:.8});for(const e of[-1,1]){const n=e*Le,i=e*(Le+Bs);this.ribbon(n,i,.012,.085,0,1,4,t,!0)}}buildRunoff(){const t=new Vt({map:this.textures.asphalt,normalMap:this.textures.asphaltNormal,color:5922928,roughness:.78,metalness:0,envMapIntensity:.75});for(const e of[-1,1])this.ribbon(e*(Le+Bs),e*(Le+Bs+T0),.02,-.05,0,1,12,t,!0)}wall(t,e,n,i){const r=this.samples.length,a=new Float32Array(r*6),o=new Float32Array(r*4),l=new Uint32Array(r*6);for(let u=0;u<r;u++){const d=this.samples[u],f=d.pos.y+Math.tan(d.bank)*t,g=u*6;a[g]=d.pos.x+d.right.x*t,a[g+1]=f+e,a[g+2]=d.pos.z+d.right.z*t,a[g+3]=d.pos.x+d.right.x*t,a[g+4]=f+n,a[g+5]=d.pos.z+d.right.z*t,o[u*4]=d.s/8,o[u*4+1]=0,o[u*4+2]=d.s/8,o[u*4+3]=1;const _=(u+1)%r;l[u*6]=u*2,l[u*6+1]=u*2+1,l[u*6+2]=_*2,l[u*6+3]=u*2+1,l[u*6+4]=_*2+1,l[u*6+5]=_*2}const c=new de;c.setAttribute("position",new se(a,3)),c.setAttribute("uv",new se(o,2)),c.setIndex(new se(l,1)),c.computeVertexNormals();const h=new Ut(c,i);h.matrixAutoUpdate=!1,h.updateMatrix(),this.group.add(h)}buildBarriers(){const t=new Vt({color:1514276,roughness:.34,metalness:.8,side:Ue,envMapIntensity:1.3}),e=new Ct(.14,1.25,.14),n=new Vt({color:790035,roughness:.5,metalness:.7}),i=Math.ceil(this.samples.length/7)*2,r=new In(e,n,i);r.castShadow=!1,r.receiveShadow=!0;const a=new zt,o=new sn;let l=0;for(const c of[-1,1]){this.wall(c*Un,0,.95,t);const h=new Vt({color:329482,emissive:c===1?3139839:16722810,emissiveIntensity:4.2,roughness:.4});this.wall(c*(Un-.012),.58,.68,h);for(let u=0;u<this.samples.length;u+=7){const d=this.samples[u],f=d.pos.y+Math.tan(d.bank)*c*(Un+.18);a.compose(new P(d.pos.x+d.right.x*c*(Un+.18),f+.62,d.pos.z+d.right.z*c*(Un+.18)),o.identity(),new P(1,1,1)),r.setMatrixAt(l++,a)}}r.count=l,r.instanceMatrix.needsUpdate=!0,this.group.add(r)}buildStartLine(){const t=this.frameAt(0),e=new Ve(Le*2,2.6);e.rotateX(-Math.PI/2);const n=new Vt({map:this.textures.checker,roughness:.42,metalness:.05,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),i=new Ut(e,n),r=this.basisAt(t);i.position.copy(t.pos).addScaledVector(t.tangent,1.3).addScaledVector(r.y,.025);const a=new zt().makeBasis(r.x,r.y,r.z);i.quaternion.setFromRotationMatrix(a),i.receiveShadow=!0,this.group.add(i)}buildMarkings(){const t=new Vt({color:14542578,roughness:.52,metalness:0,envMapIntensity:.5,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2});for(const c of[-1,1]){const h=c*(Le-.58),u=c*(Le-.36);this.ribbon(Math.min(h,u),Math.max(h,u),.008,.008,0,1,8,t,!1)}const e=[],n=[];let i=0;const r=this.samples.length,a=Math.max(2,Math.round(7/(this.length/r)));for(let c=0;c<r;c+=a*2){const h=this.samples[c],u=this.samples[(c+a)%r];if(Math.abs(h.tangent.x-u.tangent.x)+Math.abs(h.tangent.z-u.tangent.z)>.9)continue;const d=.085,f=.008,g=h.pos.x,_=h.pos.z,m=u.pos.x,p=u.pos.z;e.push(g-h.right.x*d,h.pos.y+f,_-h.right.z*d,g+h.right.x*d,h.pos.y+f,_+h.right.z*d,m-h.right.x*d,u.pos.y+f,p-h.right.z*d,m+h.right.x*d,u.pos.y+f,p+h.right.z*d),n.push(i,i+1,i+2,i+2,i+1,i+3),i+=4}const o=new de;o.setAttribute("position",new re(e,3)),o.setIndex(n),o.computeVertexNormals();const l=new Ut(o,t);l.receiveShadow=!0,l.matrixAutoUpdate=!1,this.group.add(l)}buildTerrain(){const n=new Ve(2200,2200,196,196);n.rotateX(-Math.PI/2);const i=n.attributes.position,r=new Float32Array(i.count*3),a=40,o=new Map;for(let v=0;v<this.samples.length;v++){const L=this.samples[v].pos,U=`${Math.floor(L.x/a)},${Math.floor(L.z/a)}`;let O=o.get(U);O||(O=[],o.set(U,O)),O.push(v)}const l=is(2027),c=(v,L)=>{const U=Math.floor(v),O=Math.floor(L),X=v-U,q=L-O,V=X*X*(3-2*X),$=q*q*(3-2*q),H=(Wt,Y)=>{let Q=Math.sin(Wt*127.1+Y*311.7+19.3)*43758.5453;return Q=Q-Math.floor(Q),Q},nt=H(U,O),it=H(U+1,O),lt=H(U,O+1),Rt=H(U+1,O+1);return nt+(it-nt)*V+(lt-nt)*$+(nt-it-lt+Rt)*V*$},h=(v,L)=>{let U=0;return U+=c(v*.0032+11,L*.0032-7)*17,U+=c(v*.009-3,L*.009+9)*4.5,U+=c(v*.024,L*.024)*1.3,U-6},u=(v,L)=>{let U=1/0,O=0;const X=Math.floor(v/a),q=Math.floor(L/a);for(let V=-1;V<=1;V++)for(let $=-1;$<=1;$++){const H=o.get(`${X+$},${q+V}`);if(H)for(const nt of H){const it=this.samples[nt].pos,lt=it.x-v,Rt=it.z-L,Wt=lt*lt+Rt*Rt;Wt<U&&(U=Wt,O=it.y)}}if(U===1/0)for(let V=0;V<this.samples.length;V+=8){const $=this.samples[V].pos,H=$.x-v,nt=$.z-L,it=H*H+nt*nt;it<U&&(U=it,O=$.y)}return{d:Math.sqrt(U),y:O}},d=new Float32Array(i.count),f=(v,L)=>{const U=u(v,L),O=h(v,L),X=Is(16,130,U.d);let q=ke(U.y-1.1,O,X);U.d<18&&(q=Math.min(q,U.y-.65));const V=Math.hypot(v,L);return ke(q,-6,Is(760,1080,V))};this.terrainSampler=f;for(let v=0;v<i.count;v++){const L=i.getX(v),U=i.getZ(v),O=f(L,U);d[v]=O,i.setY(v,O)}n.computeVertexNormals();const g=n.attributes.normal,_=new bt(7043926),m=new bt(9140824),p=new bt(6843251),y=new bt;for(let v=0;v<i.count;v++){const L=i.getX(v),U=i.getZ(v),O=u(L,U),X=1-g.getY(v),q=c(L*.02,U*.02);y.copy(_).lerp(m,gt(q*.7+(1-Is(12,45,O.d))*.8,0,1)),y.lerp(p,Is(.16,.5,X)),y.multiplyScalar(.72+q*.38),r[v*3]=y.r,r[v*3+1]=y.g,r[v*3+2]=y.b}n.setAttribute("color",new se(r,3));const S=new Vt({map:this.textures.terrain,vertexColors:!0,roughness:.97,metalness:0,envMapIntensity:.55}),x=new Ut(n,S);x.receiveShadow=!0,x.matrixAutoUpdate=!1,this.group.add(x);const D=new qa(1,0),C=new Vt({color:3487291,roughness:.95}),b=new In(D,C,90),R=new zt;let E=0;for(;E<90;){const v=(l()-.5)*1400,L=(l()-.5)*1400;if(Math.hypot(v,L)>850||u(v,L).d<30)continue;const O=.8+l()*3.4;R.compose(new P(v,f(v,L)+O*.25,L),new sn().setFromEuler(new Ne(l()*.4,l()*Math.PI,l()*.4)),new P(O,O*(.5+l()*.7),O)),b.setMatrixAt(E++,R)}b.instanceMatrix.needsUpdate=!0,b.castShadow=!1,b.receiveShadow=!1,this.group.add(b)}buildOcean(){const t=new Ve(9e3,9e3);t.rotateX(-Math.PI/2);const e=new Vt({color:464935,roughness:.14,metalness:.65,envMapIntensity:1.7}),n=new Ut(t,e);n.position.y=-6.2,n.receiveShadow=!1,n.matrixAutoUpdate=!1,this.group.add(n)}}const P0=new P(0,1,0);class L0{constructor(t,e){T(this,"group",new $e);T(this,"startLights",[]);T(this,"track");T(this,"textures");T(this,"rng",is(9631));this.track=t,this.textures=e,this.group.name="scenery",this.buildCity(),this.buildMountains(),this.buildPalms(),this.buildStreetLights(),this.buildGrandstands(),this.buildBillboards(),this.buildGantry(),this.group.matrixAutoUpdate=!1,this.group.updateMatrixWorld(!0)}surfacePoint(t,e){const n=t.pos.y+Math.tan(t.bank)*e;return new P(t.pos.x+t.right.x*e,n,t.pos.z+t.right.z*e)}buildCity(){const t=new Ct(1,1,1);t.translate(0,.5,0);const e=new Vt({map:this.textures.windows,emissiveMap:this.textures.windowsLit,emissive:16777215,emissiveIntensity:1.35,roughness:.62,metalness:.32,envMapIntensity:.7,color:9147302}),n=175,i=new In(t,e,n),r=new zt,a=new sn,o=new P,l=new bt,c=[],h=[9412797,7241113,10653600,8293007,5859200];let u=0,d=0;const f=Math.atan2(es.sunDir.z,es.sunDir.x);for(;u<n&&d++<4e3;){const g=this.rng()*Ge,_=165+Math.pow(this.rng(),.68)*640,m=Math.cos(g)*_,p=Math.sin(g)*_,y=this.track.nearest(new P(m,0,p));if(Math.sqrt(y.distSq)<62||Math.hypot(m,p)>820)continue;const S=15+this.rng()*26,x=15+this.rng()*26;let D=16+Math.pow(this.rng(),1.5)*118,C=Math.atan2(p,m)-f;for(;C>Math.PI;)C-=Ge;for(;C<-Math.PI;)C+=Ge;Math.abs(C)<.3&&_<760&&(D=Math.min(D,22+this.rng()*14));const b=this.track.terrainHeightAt(m,p)-1.2;a.setFromEuler(new Ne(0,this.rng()*Ge,0)),o.set(S,D,x),r.compose(new P(m,b,p),a,o),i.setMatrixAt(u,r),l.setHex(h[Math.floor(this.rng()*h.length)]),i.setColorAt(u,l),D>70&&c.push(new P(m,b+D+.8,p)),u++}if(i.count=u,i.instanceMatrix.needsUpdate=!0,i.instanceColor&&(i.instanceColor.needsUpdate=!0),i.frustumCulled=!1,this.group.add(i),c.length>0){const g=new ts(.55,8,6),_=new Vt({color:2228224,emissive:16718394,emissiveIntensity:8,toneMapped:!0}),m=new In(g,_,c.length),p=new zt;for(let y=0;y<c.length;y++)p.makeTranslation(c[y].x,c[y].y,c[y].z),m.setMatrixAt(y,p);m.instanceMatrix.needsUpdate=!0,m.frustumCulled=!1,this.group.add(m)}}buildMountains(){const e=[{radius:1580,yScale:0},{radius:1380,yScale:.34},{radius:1240,yScale:.72},{radius:1150,yScale:1}],n=[];for(let h=0;h<=200;h++){const u=h/200*Ge,d=58+95*(.5+.5*Math.sin(u*3+1.7))+38*(.5+.5*Math.sin(u*7+.4))+18*(.5+.5*Math.sin(u*13+2.2));n.push(d)}n[200]=n[0];const i=[],r=[];for(let h=0;h<e.length;h++)for(let u=0;u<=200;u++){const d=u/200*Ge,f=n[u],g=e[h],_=1+Math.sin(d*17+h*2.1)*.035;i.push(Math.cos(d)*g.radius*_,-6+f*g.yScale+(h===e.length-1,0),Math.sin(d)*g.radius*_)}const a=201;for(let h=0;h<e.length-1;h++)for(let u=0;u<200;u++){const d=h*a+u,f=d+1,g=(h+1)*a+u,_=g+1;r.push(d,f,g,g,f,_)}const o=new de;o.setAttribute("position",new re(i,3)),o.setIndex(r),o.computeVertexNormals();const l=new Vt({color:1581102,roughness:1,metalness:0,flatShading:!0,side:Ue}),c=new Ut(o,l);c.frustumCulled=!1,this.group.add(c)}buildPalms(){const t=new Fn(.16,.34,7.4,6,1);t.translate(0,3.7,0);const e=new Vt({color:4996396,roughness:.92,flatShading:!0}),n=[],i=9;for(let f=0;f<i;f++){const g=new Ve(3.9,1.15,1,1);g.translate(1.95,0,0),g.rotateZ(-.42-this.rng()*.18),g.rotateY(f/i*Ge+this.rng()*.2),g.translate(0,7.25,0),n.push(g)}const r=vn(n,!1);if(!r)return;const a=new Vt({map:this.textures.palmFrond,alphaTest:.35,side:Ue,roughness:.85,color:12178343,envMapIntensity:.5}),o=[],l=this.track.samples.length;for(let f=0;f<l;f+=23){const g=Math.floor(f/23)%2===0?1:-1,_=this.track.frameAt(f/l*this.track.length),m=g*(Un+5+this.rng()*10),p=this.surfacePoint(_,m),y=this.track.nearest(p);Math.abs(y.lateral)<Un+2.5||(p.y=this.track.terrainHeightAt(p.x,p.z)-.2,o.push({p,yaw:this.rng()*Ge,s:.75+this.rng()*.5}))}const c=new In(t,e,o.length),h=new In(r,a,o.length),u=new zt,d=new sn;o.forEach((f,g)=>{d.setFromEuler(new Ne(0,f.yaw,0)),u.compose(f.p,d,new P(f.s,f.s,f.s)),c.setMatrixAt(g,u),h.setMatrixAt(g,u)}),c.instanceMatrix.needsUpdate=!0,h.instanceMatrix.needsUpdate=!0,c.castShadow=!0,h.castShadow=!1,this.group.add(c,h)}buildStreetLights(){const t=[],e=new Fn(.09,.13,7.6,6);e.translate(0,3.8,0),t.push(e);const n=new Ct(1.5,.1,.12);n.translate(.75,7.45,0),t.push(n);const i=vn(t,!1);if(!i)return;const r=new Vt({color:1580067,roughness:.42,metalness:.8}),a=new Ct(.82,.1,.3),o=new Vt({color:659476,emissive:14216447,emissiveIntensity:9}),l=[],c=this.track.samples.length;for(let S=0;S<c;S+=27){const x=Math.floor(S/27)%2===0?1:-1,D=this.track.frameAt(S/c*this.track.length),C=x*16.5,b=this.surfacePoint(D,C);b.y=this.track.terrainHeightAt(b.x,b.z)-.35;const R=D.right.clone().multiplyScalar(-x);l.push({p:b,basis:R,z:D.tangent.clone()})}const h=new In(i,r,l.length),u=new In(a,o,l.length),d=new zt,f=new P,g=new P,_=new P,m=new zt,p=new sn,y=new P(1,1,1);l.forEach((S,x)=>{f.copy(S.basis).normalize(),g.copy(P0),_.crossVectors(f,g).normalize(),g.crossVectors(_,f).normalize(),m.makeBasis(f,g,_),p.setFromRotationMatrix(m),d.compose(S.p,p,y),h.setMatrixAt(x,d);const D=S.p.clone().addScaledVector(f,1.42);D.y+=7.45,d.makeTranslation(D.x,D.y,D.z),u.setMatrixAt(x,d)}),h.instanceMatrix.needsUpdate=!0,u.instanceMatrix.needsUpdate=!0,h.castShadow=!1,this.group.add(h,u)}standGeometry(t,e){const n=this.track.frameAt(t),i=e*25,r=this.surfacePoint(n,i);r.y=this.track.terrainHeightAt(r.x,r.z)-.4;const a=n.right.clone().multiplyScalar(-e).normalize(),o=n.tangent.clone();o.addScaledVector(a,-o.dot(a)).normalize();const l=new P().crossVectors(a,o).normalize(),c=new zt().makeBasis(o,l,a);c.setPosition(r);const h=[],u=[],d=[],f=[],g=46,_=5;for(let C=0;C<_;C++){const b=new Ct(g,.9,2.7);b.translate(0,.45+C*.82,-C*2.55),h.push(b);const R=new Ve(g-1,.7);R.translate(0,.9+C*.82,-C*2.55+1.36),u.push(R)}const m=new Ct(g,7.5,.6);m.translate(0,3.75,-_*2.55-.3),h.push(m);for(const C of[-g/2+1,g/2-1]){const b=new Ct(.5,8.6,.5);b.translate(C,4.3,-_*2.55+1.2),h.push(b)}const p=new Ct(g+2,.35,13.6);p.translate(0,9.4,-5.9),d.push(p);const y=new Ct(g+2,.14,.2);y.translate(0,9.25,.85),d.push(y);const S=new Ct(g,.1,.1);S.translate(0,9.2,-12.6),d.push(S);const x=new Ct(g+2,.09,.09);x.translate(0,9.2,-.82),f.push(x);const D=C=>{const b=C.map(E=>(E.applyMatrix4(c),E)),R=vn(b,!1);if(!R)throw new Error("stand merge failed");return R};return{structure:D(h),crowd:D(u),roof:D(d),glow:D(f)}}buildGrandstands(){const t=new Vt({color:3159100,roughness:.85,metalness:.1}),e=new Vt({map:this.textures.crowd,emissiveMap:this.textures.crowd,emissive:16777215,emissiveIntensity:1.15,roughness:.9}),n=new Vt({color:1777704,roughness:.55,metalness:.5}),i=[this.standGeometry(this.track.length*.012,1),this.standGeometry(this.track.length*.32,-1),this.standGeometry(this.track.length*.63,1),this.standGeometry(this.track.length*.81,-1)],r=vn(i.map(c=>c.structure),!1),a=vn(i.map(c=>c.crowd),!1),o=vn(i.map(c=>c.roof),!1),l=vn(i.map(c=>c.glow),!1);if(r&&this.group.add(new Ut(r,t)),a&&this.group.add(new Ut(a,e)),o&&this.group.add(new Ut(o,n)),l){const c=new Vt({color:329482,emissive:3532543,emissiveIntensity:3.2,roughness:.4});this.group.add(new Ut(l,c))}}buildBillboards(){const t=new Vt({color:856087,roughness:.4,metalness:.85});[.085,.19,.28,.4,.52,.61,.72,.86].forEach((n,i)=>{const r=i%2===0?1:-1,a=this.track.frameAt(this.track.length*n),o=r*26,l=this.surfacePoint(a,o);l.y=this.track.terrainHeightAt(l.x,l.z);const c=this.textures.billboards[i%this.textures.billboards.length],h=new $e,u=new Vt({map:c,emissiveMap:c,emissive:16777215,emissiveIntensity:1.55,roughness:.5,metalness:.1,side:Ue}),d=new Ut(new Ve(9.6,4.8),u);d.position.y=6.8,h.add(d);const f=new Ut(new Ct(10.1,5.3,.22),t);f.position.set(0,6.8,-.14),h.add(f);for(const _ of[-3.2,3.2]){const m=new Ut(new Ct(.32,6.8,.32),t);m.position.set(_,3.4,-.25),h.add(m)}h.position.copy(l);const g=a.pos.clone();g.y=l.y+5.5,h.lookAt(g),this.group.add(h)})}buildGantry(){const e=this.track.frameAt(8),n=this.track.basisAt(e),i=new $e,r=new zt().makeBasis(n.x,n.y,n.z);i.quaternion.setFromRotationMatrix(r),i.position.copy(e.pos).addScaledVector(n.y,.02);const a=new Vt({color:1514533,roughness:.34,metalness:.82}),o=new Vt({color:329482,emissive:3139839,emissiveIntensity:5}),l=10.6;for(const d of[-l,l]){const f=new Ut(new Ct(.75,7.2,.75),a);f.position.set(d,3.6,0),i.add(f);const g=new Ut(new Ct(.08,6.2,.82),o);g.position.set(d,3.4,0),i.add(g)}const c=new Ut(new Ct(22,1.15,.95),a);c.position.y=6.7,i.add(c);const h=new Vt({map:this.textures.startSign,emissiveMap:this.textures.startSign,emissive:16777215,emissiveIntensity:3,transparent:!0,side:Ue,roughness:.4}),u=new Vt({color:526604,roughness:.5,metalness:.4});for(const d of[-.5,.5]){const f=new Ut(new Ct(12.1,2.65,.12),u);f.position.set(0,6.72,d*.86),i.add(f);const g=new Ut(new Ve(11.5,2.2),h);g.position.set(0,6.72,d),d<0&&(g.rotation.y=Math.PI),i.add(g)}for(let d=0;d<5;d++){const f=-3.6+d*1.8,g=new Ut(new Ct(.55,.55,.5),u);g.position.set(f,5.72,0),i.add(g);const _=new Vt({color:2097152,emissive:2424836,emissiveIntensity:2,roughness:.3}),m=new Ut(new ts(.2,12,8),_);m.position.set(f,5.72,.27),i.add(m),this.startLights.push(_)}this.group.add(i)}setStartLights(t,e){this.startLights.forEach((n,i)=>{e?(n.emissive.setHex(2293640),n.emissiveIntensity=9):i<t?(n.emissive.setHex(16718382),n.emissiveIntensity=9):(n.emissive.setHex(2424836),n.emissiveIntensity=1.5)})}}const Ra=()=>({throttle:0,brake:0,steer:0,handbrake:!1,nitro:!1}),D0=2.98,Sl=1.12;class Br{constructor(t,e,n,i,r){T(this,"spec");T(this,"model");T(this,"track");T(this,"isPlayer");T(this,"pos",new P);T(this,"yaw",0);T(this,"vx",0);T(this,"vz",0);T(this,"yawRate",0);T(this,"steerAngle",0);T(this,"speed",0);T(this,"speedAbs",0);T(this,"slip",0);T(this,"drift",0);T(this,"drifting",!1);T(this,"nitro",1);T(this,"nitroActive",!1);T(this,"gear",1);T(this,"rpm",1400);T(this,"lap",0);T(this,"s",0);T(this,"lateral",0);T(this,"progress",0);T(this,"lapStart",0);T(this,"bestLap",0);T(this,"lastLap",0);T(this,"lapTimes",[]);T(this,"finished",!1);T(this,"finishTime",0);T(this,"position",1);T(this,"wallHit",0);T(this,"carHit",0);T(this,"offRoad",!1);T(this,"onRoad",!0);T(this,"hint",-1);T(this,"ai",null);T(this,"hit");T(this,"frame");T(this,"baseY",0);T(this,"prevSpeed",0);T(this,"roll",0);T(this,"pitch",0);T(this,"steerInput",0);T(this,"driverName","");T(this,"elapsed",0);this.spec=n,this.track=e,this.isPlayer=r,this.model=new dc(n,i),this.hit=e.nearest(new P,-1),this.frame=e.frameAt(0),t.add(this.model.root)}reset(t,e){const n=this.track.gridSlot(t);this.pos.copy(n.position),this.yaw=n.yaw,this.s=n.s,this.hint=-1,this.hit=this.track.nearest(this.pos,-1),this.hint=this.hit.index,this.baseY=this.hit.height,this.vx=0,this.vz=0,this.yawRate=0,this.steerAngle=0,this.speed=0,this.speedAbs=0,this.slip=0,this.drift=0,this.drifting=!1,this.nitro=1,this.nitroActive=!1,this.lap=0,this.progress=this.hit.s,this.lapStart=e,this.bestLap=0,this.lastLap=0,this.lapTimes=[],this.finished=!1,this.finishTime=0,this.wallHit=0,this.carHit=0,this.offRoad=!1,this.onRoad=!0,this.prevSpeed=0,this.model.root.position.set(this.pos.x,this.baseY+.02,this.pos.z),this.model.root.rotation.set(0,this.yaw,0),this.model.setBodyTilt(0,0)}get forwardX(){return Math.sin(this.yaw)}get forwardZ(){return Math.cos(this.yaw)}get speedKmh(){return this.speedAbs*3.6}get midY(){return this.baseY+.55}get groundY(){return this.baseY}update(t,e){this.elapsed+=t;const n=!0,i=Math.sin(this.yaw),r=Math.cos(this.yaw),a=-r,o=i;let l=this.vx*i+this.vz*r,c=this.vx*a+this.vz*o;const h=e.handbrake&&n,u=Math.abs(this.lateral)<Le+.7;this.onRoad=u;const d=u?1:.6,f=this.spec.topSpeed*(this.nitroActive?1.12:1)*(u?1:.55),g=e.nitro&&this.nitro>.01&&l>3&&e.throttle>.05;this.nitroActive=g,g?this.nitro=Math.max(0,this.nitro-t*(.155/this.spec.nitro)):this.nitro=Math.min(1,this.nitro+t*(.028+this.drift*.09));const _=gt(e.throttle-e.brake,-1,1),m=gt(Math.max(0,l)/Math.max(1,f),0,1.2),p=u?1:.55;if(_>.02){let Yt=_*this.spec.accel*(1-.64*m*m)*p;g&&(Yt+=8.5),l<0&&(Yt+=_*this.spec.brake*.55),l+=Yt*t}else if(_<-.02){const Yt=-_;if(l>.4)l-=Yt*this.spec.brake*t;else{const It=7.6*(u?1:.6);l-=Yt*It*t,l<-13&&(l=-13)}}if(e.handbrake){const Yt=6.5*t;l-=Math.sign(l)*Math.min(Math.abs(l),Yt)}if(Math.abs(_)<.02){const Yt=1.1+45e-5*l*l;l-=Math.sign(l)*Math.min(Math.abs(l),Yt*t)}u||(l-=Math.sign(l)*Math.min(Math.abs(l),2.2*t)),l>f&&(l=be(l,f,4,t)),l<-13&&(l=-13),Math.abs(l)<.015&&Math.abs(_)<.02&&(l=0);const y=gt(Math.abs(l)/28,0,1),S=ke(16,22,y);this.steerInput=be(this.steerInput,e.steer,S,t);const x=gt(Math.abs(l)/Math.max(8,this.spec.topSpeed),0,1),D=ke(.6,.2,x),C=this.steerInput*D,b=ke(17,22,y);this.steerAngle=be(this.steerAngle,C,b,t);const E=9.81*this.spec.grip*(h?1.25:1.42)*d/Math.max(6,Math.abs(l));let v=-(l/D0)*Math.tan(this.steerAngle);v=gt(v,-E,E),h&&Math.abs(l)>8&&(v*=1.28);const U=(this.isPlayer?.5:.22)*gt((Math.abs(l)-4)/40,0,1)*Math.sign(l||1);v+=-this.steerInput*U;const O=gt(1.55+(Math.abs(l)-4)*.035,1.55,3.2);v=gt(v,-O,O);const X=h?4.2:ke(9,11.5,y);this.yawRate=be(this.yawRate,v,X,t),this.yaw+=this.yawRate*t,this.yaw>Math.PI&&(this.yaw-=Ge),this.yaw<-Math.PI&&(this.yaw+=Ge);const q=(u?1:.45)*(h?.2:1),V=(7.6+this.spec.grip*2.6)*q;c*=Math.exp(-V*t),c=gt(c,-24,24),Math.abs(l)<.25&&Math.abs(_)<.02&&(l*=.85);const $=Math.sin(this.yaw),H=Math.cos(this.yaw),nt=-H,it=$;this.vx=$*l+nt*c,this.vz=H*l+it*c,this.pos.x+=this.vx*t,this.pos.z+=this.vz*t;const lt=this.track.nearest(this.pos,this.hint,this.hit);this.hint=lt.index,this.s=lt.s,this.lateral=lt.lateral;const Rt=Un-.95;if(Math.abs(this.lateral)>Rt){const Yt=Math.sign(this.lateral),It=Math.abs(this.lateral)-Rt,Nt=lt.right.x,wt=lt.right.z;this.pos.x-=Nt*It*Yt,this.pos.z-=wt*It*Yt;const Jt=this.vx*Nt+this.vz*wt,yt=Jt*Yt;if(yt>0){this.vx-=Nt*Jt*1.08,this.vz-=wt*Jt*1.08;const M=this.vx*lt.tangent.x+this.vz*lt.tangent.z,z=gt(yt*.012,0,.18);this.vx-=lt.tangent.x*M*z,this.vz-=lt.tangent.z*M*z,this.wallHit=Math.max(this.wallHit,gt(yt/12,.15,1))}l=this.vx*$+this.vz*H,this.lateral=Yt*Rt;const A=this.track.nearest(this.pos,this.hint,this.hit);this.hint=A.index,this.s=A.s,this.lateral=A.lateral}this.offRoad=Math.abs(this.lateral)>Le+1.25;const Wt=this.track.frameAt(this.s,this.frame),Y=Wt.pos.y+lt.lateral*Math.tan(Wt.bank);if(this.baseY=be(this.baseY,Y,16,t),this.speed=l,this.speedAbs=Math.hypot(this.vx,this.vz),this.slip=Math.abs(Math.atan2(c,Math.max(2,Math.abs(l)))),this.drifting=this.slip>.12&&this.speedAbs>8,this.drift=be(this.drift,this.drifting?gt(this.slip*1.6,0,1):0,4,t),l<-.3){this.gear=1;const Yt=gt(Math.abs(l)/13,0,1);this.rpm=be(this.rpm,1500+Yt*2400,9,t)}else{const Yt=gt(Math.abs(l)/Math.max(4,this.spec.topSpeed),0,1.05);this.gear=gt(1+Math.floor(Yt*6.4),1,7);const It=6.4,Nt=(this.gear-1)/It,wt=this.gear/It,yt=1600+gt((Yt-Nt)/Math.max(.01,wt-Nt),0,1)*6400+(this.nitroActive?400:0);this.rpm=be(this.rpm,yt,8,t)}this.progress=this.lap*this.track.length+this.s;const Q=new P(0,1,0).addScaledVector(Wt.right,-Math.tan(Wt.bank)).normalize(),ft=new P($,0,H);ft.addScaledVector(Q,-ft.dot(Q)).normalize();const rt=new P().crossVectors(Q,ft).normalize(),Tt=new P().crossVectors(ft,rt).normalize(),Lt=new zt().makeBasis(rt,Tt,ft),Ht=new sn().setFromRotationMatrix(Lt);this.model.root.quaternion.slerp(Ht,1-Math.exp(-18*t)),this.model.root.position.set(this.pos.x,this.baseY+.01,this.pos.z);const le=gt((l-this.prevSpeed)/Math.max(t,1e-4),-40,40);this.prevSpeed=l;const Xt=this.yawRate*l,ue=gt(Xt*.0038,-.07,.07),B=gt(le*.0035,-.055,.055);this.roll=be(this.roll,ue,7,t),this.pitch=be(this.pitch,B,5,t),this.model.setBodyTilt(this.roll,this.pitch),this.model.updateVisual(t,l,this.steerInput,this.slip,e.brake>.15||h)}static resolveCollision(t,e){const n=e.pos.x-t.pos.x,i=e.pos.z-t.pos.z,r=Math.hypot(n,i),a=Sl*2;if(r>a||r<1e-4||Math.abs(t.baseY-e.baseY)>2.2)return;const o=n/r,l=i/r,c=a-r;t.pos.x-=o*c*.5,t.pos.z-=l*c*.5,e.pos.x+=o*c*.5,e.pos.z+=l*c*.5;const h=(e.vx-t.vx)*o+(e.vz-t.vz)*l;if(h<0){const u=h*.45;t.vx+=o*u,t.vz+=l*u,e.vx-=o*u,e.vz-=l*u,t.carHit=Math.max(t.carHit,gt(Math.abs(h)/10,.1,1)),e.carHit=Math.max(e.carHit,gt(Math.abs(h)/10,.1,1))}}get collisionRadius(){return Sl}get forward(){return new P(this.forwardX,0,this.forwardZ)}}class El{constructor(t,e,n,i,r){T(this,"vehicle");T(this,"track");T(this,"player");T(this,"input",Ra());T(this,"laneBias");T(this,"lanePhase");T(this,"stuckFor",0);T(this,"skill");T(this,"pace",1);this.vehicle=t,this.track=e,this.player=n,this.skill=i,this.laneBias=(r%3-1)*.45,this.lanePhase=r*1.7}think(t){const e=this.vehicle,n=this.input;n.throttle=0,n.brake=0,n.steer=0,n.handbrake=!1,n.nitro=!1;const i=Math.max(0,e.speed);this.track.length;const r=e.s,a=9.81*e.spec.grip*.9*this.skill,o=e.spec.brake*.86;let l=e.spec.topSpeed*this.pace*(.8+this.skill*.1);const c=[0,12,28,50,78,112,150,195];let h=0;for(const R of c){const E=this.track.frameAt(r+R),v=Math.abs(E.curvature);h=Math.max(h,v);const L=Math.sqrt(a/Math.max(v,5e-4))*(.82+this.skill*.1),U=Math.sqrt(L*L+2*o*R)*.94;l=Math.min(l,U)}l=gt(l,12,e.spec.topSpeed*1.03);const u=Math.abs(e.lateral)>6.2,d=Math.abs(e.lateral)>Le+1;u&&(l=Math.min(l,24)),d&&(l=Math.min(l,13)),i<l-1.5?n.throttle=1:i>l+2?n.brake=gt((i-l)/7,.25,1):n.throttle=.35;const f=gt(12+i*.4,14,42),g=this.track.frameAt(r+f),_=-Math.sign(g.curvature)*gt(Math.abs(g.curvature)*60,0,1.8),m=Math.sin(r*.011+this.lanePhase)*.25;let p=gt(_+this.laneBias+m,-2.6,2.6);u&&(p=gt(p-Math.sign(e.lateral)*1.2,-3,3));const y=g.pos.x+g.right.x*p,S=g.pos.z+g.right.z*p,x=Math.atan2(y-e.pos.x,S-e.pos.z),D=gt(e.lateral*.008,-.12,.12),C=Nr(e.yaw,x+D);if(n.steer=gt(-C*1.15+e.yawRate*.32,-1,1),this.player){const R=this.player.pos.x-e.pos.x,E=this.player.pos.z-e.pos.z;if(Math.hypot(R,E)<12&&R*e.forwardX+E*e.forwardZ>0){const U=Math.sign(R*-e.forwardZ+E*e.forwardX);n.steer=gt(n.steer-U*.35,-1,1)}}if(d&&i<30){const R=this.track.frameAt(r+8),E=Math.atan2(R.pos.x-e.pos.x,R.pos.z-e.pos.z);n.steer=gt(-Nr(e.yaw,E)*3.2,-1,1),n.throttle=.45,n.brake=0}if(h>.04&&i>20&&i>l*1.15&&(n.handbrake=!0,n.brake=.3),this.player){const R=this.player.progress-e.progress;R>60?this.pace=Math.min(1.07,1+R*5e-4):R<-60?this.pace=Math.max(.94,1+R*35e-5):this.pace=1}if(Math.abs(this.track.frameAt(r+75).curvature)<.006&&e.nitro>.32&&i>24&&(h<.012||i<l-10)&&(n.nitro=!0,n.throttle=1),Math.abs(e.lateral)>Le+1&&i<10&&(n.steer=gt(-Nr(e.yaw,Math.atan2(e.forwardX,e.forwardZ))*.1,-.4,.4)),i<2&&n.throttle>.2){if(this.stuckFor+=t,this.stuckFor>1.6){const R=this.track.frameAt(e.s);e.pos.set(R.pos.x+R.right.x*gt(e.lateral,-3,3),e.pos.y,R.pos.z+R.right.z*gt(e.lateral,-3,3)),e.yaw=Math.atan2(R.tangent.x,R.tangent.z),e.vx=0,e.vz=0,e.hint=-1,this.stuckFor=0}}else this.stuckFor=0;return n}}class Or{constructor(t,e,n){T(this,"points");T(this,"particles",[]);T(this,"positions");T(this,"sizes");T(this,"alphas");T(this,"colors");T(this,"cursor",0);T(this,"geometry");T(this,"capacity");this.capacity=t,this.positions=new Float32Array(t*3),this.sizes=new Float32Array(t),this.alphas=new Float32Array(t),this.colors=new Float32Array(t*3);for(let a=0;a<t;a++)this.particles.push({x:0,y:-9999,z:0,vx:0,vy:0,vz:0,life:0,maxLife:1,size:0,grow:0,alpha:0,r:1,g:1,b:1,drag:1,buoy:0});const i=new de;i.setAttribute("position",new se(this.positions,3)),i.setAttribute("aSize",new se(this.sizes,1)),i.setAttribute("aAlpha",new se(this.alphas,1)),i.setAttribute("aColor",new se(this.colors,3)),this.geometry=i;const r=new ye({uniforms:{uMap:{value:e}},vertexShader:`
        attribute float aSize;
        attribute float aAlpha;
        attribute vec3 aColor;
        varying float vAlpha;
        varying vec3 vColor;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = clamp(aSize * (420.0 / max(1.0, -mv.z)), 1.0, 220.0);
          gl_Position = projectionMatrix * mv;
          vAlpha = aAlpha;
          vColor = aColor;
        }
      `,fragmentShader:`
        uniform sampler2D uMap;
        varying float vAlpha;
        varying vec3 vColor;
        void main() {
          vec4 tex = texture2D(uMap, gl_PointCoord);
          gl_FragColor = vec4(vColor * tex.rgb, tex.a * vAlpha);
        }
      `,transparent:!0,depthWrite:!1,blending:n?Zi:Nn});this.points=new zm(i,r),this.points.frustumCulled=!1,this.points.renderOrder=5}spawn(t){const e=this.cursor;this.cursor=(this.cursor+1)%this.capacity;const n=this.particles[e];n.x=t.x,n.y=t.y,n.z=t.z,n.vx=t.vx??0,n.vy=t.vy??0,n.vz=t.vz??0,n.maxLife=t.maxLife??1,n.life=n.maxLife,n.size=t.size??1,n.grow=t.grow??0,n.alpha=t.alpha??.5,n.r=t.r??1,n.g=t.g??1,n.b=t.b??1,n.drag=t.drag??1,n.buoy=t.buoy??0}update(t){for(let e=0;e<this.capacity;e++){const n=this.particles[e],i=e*3;if(n.life<=0){this.alphas[e]=0,this.sizes[e]=0,this.positions[i+1]=-9999;continue}n.life-=t;const r=Math.exp(-n.drag*t);n.vx*=r,n.vz*=r,n.vy=n.vy*r+n.buoy*t,n.x+=n.vx*t,n.y+=n.vy*t,n.z+=n.vz*t,n.size+=n.grow*t;const a=gt(n.life/n.maxLife,0,1);this.positions[i]=n.x,this.positions[i+1]=n.y,this.positions[i+2]=n.z,this.sizes[e]=n.size,this.alphas[e]=n.alpha*a*a,this.colors[i]=n.r,this.colors[i+1]=n.g,this.colors[i+2]=n.b}this.geometry.attributes.position.needsUpdate=!0,this.geometry.attributes.aSize.needsUpdate=!0,this.geometry.attributes.aAlpha.needsUpdate=!0,this.geometry.attributes.aColor.needsUpdate=!0}clear(){for(const t of this.particles)t.life=0;this.update(.016)}}class I0{constructor(t,e){T(this,"smoke");T(this,"sparks");T(this,"flames");T(this,"rain");T(this,"rainVel");T(this,"rainCount",1100);T(this,"storm",!1);T(this,"skidMesh");T(this,"skidPositions");T(this,"skidAlphas");T(this,"skidGeo");T(this,"skidCursor",0);T(this,"skidMax",1500);T(this,"lastSkid",new WeakMap);T(this,"lastFlame",new WeakMap);T(this,"rainPositions");this.smoke=new Or(360,e.smoke,!1),this.sparks=new Or(220,e.spark,!0),this.flames=new Or(140,e.spark,!0),t.add(this.smoke.points,this.sparks.points,this.flames.points),this.skidPositions=new Float32Array(this.skidMax*4*3),this.skidAlphas=new Float32Array(this.skidMax*4);const n=new Uint32Array(this.skidMax*6);for(let o=0;o<this.skidMax;o++){const l=o*4,c=o*6;n[c]=l,n[c+1]=l+1,n[c+2]=l+2,n[c+3]=l+2,n[c+4]=l+1,n[c+5]=l+3}this.skidGeo=new de,this.skidGeo.setAttribute("position",new se(this.skidPositions,3)),this.skidGeo.setAttribute("aAlpha",new se(this.skidAlphas,1)),this.skidGeo.setIndex(new se(n,1));const i=new ye({vertexShader:`
        attribute float aAlpha;
        varying float vAlpha;
        void main() {
          vAlpha = aAlpha;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        varying float vAlpha;
        void main() {
          gl_FragColor = vec4(0.015, 0.016, 0.02, vAlpha);
        }
      `,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-4});this.skidMesh=new Ut(this.skidGeo,i),this.skidMesh.frustumCulled=!1,this.skidMesh.renderOrder=2,t.add(this.skidMesh),this.rainPositions=new Float32Array(this.rainCount*6),this.rainVel=new Float32Array(this.rainCount);const r=new de;r.setAttribute("position",new se(this.rainPositions,3));const a=new ac({color:11192575,transparent:!0,opacity:.26,depthWrite:!1,blending:Nn});this.rain=new Bm(r,a),this.rain.frustumCulled=!1,this.rain.visible=!1,t.add(this.rain);for(let o=0;o<this.rainCount;o++)this.rainVel[o]=32+Math.random()*26,this.rainPositions[o*6]=(Math.random()-.5)*90,this.rainPositions[o*6+1]=Math.random()*40,this.rainPositions[o*6+2]=(Math.random()-.5)*90}setStorm(t){this.storm=t,this.rain.visible=t}tireSmoke(t,e){const n=t.drifting?gt(t.slip*1.8,.15,1):t.offRoad&&t.speedAbs>6?.4:0;if(n<=.05)return;const i=Math.random()<n*e*28?2:0,r=t.offRoad,a=Math.sin(t.yaw),o=Math.cos(t.yaw),l=-o,c=a;for(let h=0;h<i;h++){const u=Math.random()>.5?1:-1,d=t.pos.x-a*1.5+l*u*.92,f=t.pos.z-o*1.5+c*u*.92,g=r?.72+Math.random()*.15:.52+Math.random()*.2;this.smoke.spawn({x:d+jt(-.15,.15),y:t.groundY+.25,z:f+jt(-.15,.15),vx:-a*jt(.5,2.5)+jt(-.8,.8),vy:jt(.4,1.3),vz:-o*jt(.5,2.5)+jt(-.8,.8),maxLife:r?jt(.8,1.6):jt(.7,1.4),size:jt(.9,2.1),grow:jt(2.2,4.5),alpha:.11+n*.1,r:g,g:g*(r?.9:.97),b:g,drag:1.1,buoy:.75})}t.speedAbs>4&&Math.random()<n*e*34&&this.laySkid(t,e)}laySkid(t,e){const n=this.lastSkid.get(t)??0,i=performance.now()/1e3;if(i-n<.035)return;this.lastSkid.set(t,i);const r=Math.sin(t.yaw),a=Math.cos(t.yaw),o=-a,l=r,c=gt(t.speedAbs*e*.7,.12,.55),h=.13,u=t.groundY+.035;for(const d of[-1,1]){const f=t.pos.x-r*1.5+o*d*.92,g=t.pos.z-a*1.5+l*d*.92,_=this.skidCursor;this.skidCursor=(this.skidCursor+1)%this.skidMax;const m=_*12,p=[[f-r*c-o*h,g-a*c-l*h],[f-r*c+o*h,g-a*c+l*h],[f+r*c-o*h,g+a*c-l*h],[f+r*c+o*h,g+a*c+l*h]];for(let y=0;y<4;y++)this.skidPositions[m+y*3]=p[y][0],this.skidPositions[m+y*3+1]=u,this.skidPositions[m+y*3+2]=p[y][1],this.skidAlphas[_*4+y]=gt(t.slip*.55,.12,.42)}this.skidGeo.attributes.position.needsUpdate=!0,this.skidGeo.attributes.aAlpha.needsUpdate=!0}sparkBurst(t,e,n,i){const r=Math.floor(6+i*22);for(let a=0;a<r;a++)this.sparks.spawn({x:t,y:e,z:n,vx:jt(-7,7)*(.5+i),vy:jt(1,8)*(.4+i),vz:jt(-7,7)*(.5+i),maxLife:jt(.25,.7),size:jt(.13,.36),grow:-.05,alpha:.95,r:1,g:.55+Math.random()*.3,b:.15,drag:.6,buoy:-13})}flame(t){if(!t.nitroActive)return;const e=performance.now()/1e3;if(e-(this.lastFlame.get(t)??0)<.045)return;this.lastFlame.set(t,e);const n=Math.sin(t.yaw),i=Math.cos(t.yaw),r=-i,a=n;for(const o of[-1,1])this.flames.spawn({x:t.pos.x-n*2.4+r*o*.27,y:t.groundY+.4,z:t.pos.z-i*2.4+a*o*.27,vx:-n*jt(5,12)+jt(-.6,.6),vy:jt(.1,.8),vz:-i*jt(5,12)+jt(-.6,.6),maxLife:jt(.04,.1),size:jt(.25,.5),grow:-1.4,alpha:.32,r:.3,g:.6,b:1.4,drag:1.5,buoy:0})}update(t,e,n){if(this.smoke.update(t),this.sparks.update(t),this.flames.update(t),this.rain.visible){const i=this.rain.geometry.attributes.position,r=i.array,a=e.position.x,o=e.position.y,l=e.position.z;for(let c=0;c<this.rainCount;c++){const h=c*6;r[h+1]-=this.rainVel[c]*t,r[h]+=t*5.5,(r[h+1]<o-16||Math.abs(r[h]-a)>48||Math.abs(r[h+2]-l)>48)&&(r[h]=a+(Math.random()-.5)*80,r[h+1]=o+12+Math.random()*16,r[h+2]=l+(Math.random()-.5)*80),r[h+3]=r[h]-.09,r[h+4]=r[h+1]+.75,r[h+5]=r[h+2]}i.needsUpdate=!0}if(n>.7&&Math.random()<.3){const i=new P;e.getWorldDirection(i);const r=e.position.x+i.x*8+jt(-20,20),a=e.position.y+jt(-4,5),o=e.position.z+i.z*8+jt(-20,20);this.smoke.spawn({x:r,y:a,z:o,vx:-i.x*30,vy:0,vz:-i.z*30,maxLife:.25,size:.25,grow:-.2,alpha:.22,r:.7,g:.85,b:1,drag:.2,buoy:0})}}clear(){this.smoke.clear(),this.sparks.clear(),this.flames.clear(),this.skidAlphas.fill(0),this.skidGeo.attributes.aAlpha.needsUpdate=!0}}const wl=16/9;class U0{constructor(t){T(this,"camera");T(this,"mode","chase");T(this,"smoothPos",new P);T(this,"smoothLook",new P);T(this,"initialized",!1);T(this,"trauma",0);T(this,"fov",62);T(this,"orbit",-.55);T(this,"orbitTime",0);T(this,"shakeSeed",Math.random()*1e3);T(this,"roll",0);T(this,"lastCarPos",new P);T(this,"hasLast",!1);this.camera=t}setMode(t){this.mode=t,this.initialized=!1}cycleMode(){const t=["chase","hood","wide"],e=t.indexOf(this.mode);this.setMode(t[(e+1)%t.length])}addShake(t){this.trauma=gt(this.trauma+t,0,1)}fovForAspect(t){const e=this.camera.aspect;if(e<=wl)return t;const n=2*Math.atan(Math.tan(t*Math.PI/360)*wl),i=2*Math.atan(Math.tan(n/2)/e)*180/Math.PI;return gt(i,30,80)}orbitCamera(t,e,n){this.orbitTime+=e,this.hasLast=!1;const i=t?t.pos:new P(0,0,0),r=t?t.groundY:0;this.orbit+=e*(n?.07:.045);const a=9.4+Math.sin(this.orbitTime*.23)*.55,o=this.orbit+(t?t.yaw:0)+Math.PI+.55,l=i.x+Math.sin(o)*a,c=i.z+Math.cos(o)*a,h=r+2.5+Math.sin(this.orbitTime*.15)*.3;this.smoothPos.set(l,h,c);const u=new P(Math.cos(o),0,-Math.sin(o)),d=new P(i.x,r+.72,i.z);d.addScaledVector(u,-2.2),this.smoothLook.copy(d),this.camera.position.copy(this.smoothPos),this.camera.up.set(0,1,0),this.camera.lookAt(this.smoothLook),this.camera.rotateZ(Math.sin(this.orbitTime*.2)*.004),this.fov=be(this.fov,this.fovForAspect(41),3,e),this.camera.fov=this.fov,this.camera.updateProjectionMatrix()}update(t,e,n,i,r){if(i||r){this.orbitCamera(e,t,r);return}const a=Math.sin(e.yaw),o=Math.cos(e.yaw),l=-o,c=a,h=e.speedAbs,u=e.steerInput,d=gt(e.slip*2.2,0,1.2)*Math.sign(u),f=Math.pow(this.trauma,1.6);if(this.hasLast){const b=e.pos.x-this.lastCarPos.x,R=e.pos.z-this.lastCarPos.z;this.smoothPos.x+=b,this.smoothPos.z+=R,this.smoothLook.x+=b,this.smoothLook.z+=R}this.lastCarPos.copy(e.pos),this.hasLast=!0;let g=new P,_=new P,m=62,p=7;if(this.mode==="hood"){const b=.008+f*.045+n*.003;g.set(e.pos.x+a*.95+l*.02,e.groundY+1.16,e.pos.z+o*.95+c*.02),_.set(e.pos.x+a*30+l*u*1.4,e.groundY+1.02,e.pos.z+o*30+c*u*1.4),g.x+=jt(-b,b),g.y+=jt(-b,b),m=70+n*10,p=40}else if(this.mode==="wide"){const b=13.5+n*3.5,R=5.2+n*1.2;g.set(e.pos.x-a*b-l*u*2.5,e.groundY+R,e.pos.z-o*b-c*u*2.5),_.set(e.pos.x+a*8,e.groundY+1.1,e.pos.z+o*8),m=52+n*8,p=3.2}else{const b=6.95+n*1.1,R=2.45+n*.35,E=-u*.8-d*1,v=gt(e.steerInput,-1,1);g.set(e.pos.x-a*b+l*E,e.groundY+R,e.pos.z-o*b+c*E),_.set(e.pos.x+a*(7.5+h*.07)+l*v*1.2,e.groundY+1.15,e.pos.z+o*(7.5+h*.07)+c*v*1.2),m=58+n*8+(e.nitroActive?4:0),p=6.5+n*2.5}if(!this.initialized)this.smoothPos.copy(g),this.smoothLook.copy(_),this.initialized=!0;else{const b=1-Math.exp(-p*t),R=1-Math.exp(-(p+4)*t);this.smoothPos.lerp(g,b),this.smoothLook.lerp(_,R)}this.fov=be(this.fov,m,4,t);const y=-u*.018*(this.mode==="hood"?.4:1)-d*.008;this.roll=be(this.roll,y,5,t);const S=f*.55,x=performance.now()*.001+this.shakeSeed,D=(Math.sin(x*61.7)+Math.sin(x*37.1))*.5*S,C=(Math.sin(x*53.3)+Math.sin(x*29.7))*.5*S;this.camera.position.set(this.smoothPos.x+D,this.smoothPos.y+C+Math.sin(x*7.3)*n*.012,this.smoothPos.z+D*.5),this.camera.up.set(0,1,0),this.camera.lookAt(this.smoothLook),this.camera.rotateZ(this.roll+C*.01),this.camera.fov=this.fovForAspect(this.fov),this.camera.updateProjectionMatrix(),this.trauma=Math.max(0,this.trauma-t*1.7)}snap(t){this.initialized=!1,this.lastCarPos.copy(t.pos),this.hasLast=!0;const e=Math.sin(t.yaw),n=Math.cos(t.yaw);this.smoothPos.set(t.pos.x-e*7,t.groundY+2.1,t.pos.z-n*7),this.smoothLook.set(t.pos.x,t.groundY+1.1,t.pos.z),this.camera.position.copy(this.smoothPos),this.camera.lookAt(this.smoothLook)}}const bl=340,Tl=135,Al=270;class N0{constructor(t){T(this,"root",document.getElementById("hud"));T(this,"speedEl",document.getElementById("hud-speed"));T(this,"gearEl",document.getElementById("hud-gear"));T(this,"nitroEl",document.getElementById("hud-nitro"));T(this,"lapEl",document.getElementById("hud-lap"));T(this,"posEl",document.getElementById("hud-pos"));T(this,"posTotalEl",document.getElementById("hud-pos-total"));T(this,"timeEl",document.getElementById("hud-time"));T(this,"bestEl",document.getElementById("hud-best"));T(this,"carEl",document.getElementById("hud-car"));T(this,"driftEl",document.getElementById("hud-drift"));T(this,"driftWrap",document.getElementById("hud-drift-wrap"));T(this,"wrongEl",document.getElementById("wrongway"));T(this,"countdownEl",document.getElementById("countdown"));T(this,"messageEl",document.getElementById("hud-message"));T(this,"fpsEl",document.getElementById("hud-fps"));T(this,"needle");T(this,"arc");T(this,"arcLength",0);T(this,"minimap");T(this,"mapCtx");T(this,"mapCache");T(this,"mapScale",1);T(this,"mapCx",0);T(this,"mapCy",0);T(this,"mapW",210);T(this,"mapH",150);T(this,"last",{speed:-1,gear:"",lap:"",pos:-1,time:"",best:"",nitro:-1,drift:-1,fps:-1});T(this,"messageTimer",0);T(this,"mapAccum",0);T(this,"track");this.track=t,this.buildGauge(),this.minimap=document.getElementById("minimap");const e=this.minimap.getContext("2d");if(!e)throw new Error("minimap ctx");this.mapCtx=e,this.mapCache=document.createElement("canvas"),this.resizeMinimap(),window.addEventListener("resize",()=>this.resizeMinimap()),this.showCountdown("")}buildGauge(){const t=document.getElementById("speedo"),e=t.querySelector("#gauge-ticks"),n="http://www.w3.org/2000/svg",i=140,r=140,a=(o,l)=>{const c=o*Math.PI/180;return[i+Math.cos(c)*l,r+Math.sin(c)*l]};for(let o=0;o<=17;o++){const l=o/17,c=Tl+l*Al,h=o%2===0,[u,d]=a(c,h?104:108),[f,g]=a(c,116),_=document.createElementNS(n,"line");if(_.setAttribute("x1",u.toFixed(1)),_.setAttribute("y1",d.toFixed(1)),_.setAttribute("x2",f.toFixed(1)),_.setAttribute("y2",g.toFixed(1)),_.setAttribute("stroke",h?"rgba(235,245,255,0.82)":"rgba(160,185,215,0.35)"),_.setAttribute("stroke-width",h?"2.2":"1"),e.appendChild(_),o%2===0){const m=Math.round(o/17*bl);if(m%40===0){const[p,y]=a(c,84),S=document.createElementNS(n,"text");S.setAttribute("x",p.toFixed(1)),S.setAttribute("y",(y+3).toFixed(1)),S.setAttribute("text-anchor","middle"),S.setAttribute("fill","rgba(190,205,225,0.55)"),S.setAttribute("font-size","10"),S.setAttribute("font-family","Helvetica Neue, Arial, sans-serif"),S.setAttribute("font-weight","600"),S.textContent=String(m),e.appendChild(S)}}}this.needle=t.querySelector("#gauge-needle"),this.arc=t.querySelector("#gauge-arc");try{this.arcLength=this.arc.getTotalLength()}catch{this.arcLength=500}this.arc.style.strokeDasharray=`${this.arcLength}`,this.arc.style.strokeDashoffset=`${this.arcLength}`}resizeMinimap(){const t=Math.min(window.devicePixelRatio||1,2),e=this.minimap.clientWidth||210,n=this.minimap.clientHeight||150;this.mapW=e,this.mapH=n,this.minimap.width=Math.round(e*t),this.minimap.height=Math.round(n*t),this.mapCtx.setTransform(t,0,0,t,0,0),this.mapCache.width=this.minimap.width,this.mapCache.height=this.minimap.height,this.buildMinimapCache(t)}buildMinimapCache(t){const e=this.mapCache.getContext("2d");if(!e)return;e.setTransform(t,0,0,t,0,0),e.clearRect(0,0,this.mapW,this.mapH);const n=this.track.minimapBounds,i=16,r=n.max.x-n.min.x,a=n.max.y-n.min.y,o=Math.min((this.mapW-i*2)/r,(this.mapH-i*2)/a);this.mapScale=o,this.mapCx=this.mapW/2-(n.min.x+n.max.x)/2*o,this.mapCy=this.mapH/2-(n.min.y+n.max.y)/2*o,e.lineJoin="round",e.lineCap="round",e.beginPath(),this.track.minimapPoints.forEach((u,d)=>{const f=u.x*o+this.mapCx,g=u.y*o+this.mapCy;d===0?e.moveTo(f,g):e.lineTo(f,g)}),e.closePath(),e.strokeStyle="rgba(10,14,22,0.9)",e.lineWidth=7,e.stroke(),e.strokeStyle="rgba(120,225,255,0.5)",e.lineWidth=1.6,e.stroke();const l=this.track.minimapPoints[0],c=l.x*o+this.mapCx,h=l.y*o+this.mapCy;e.strokeStyle="#f4f7ff",e.lineWidth=2,e.beginPath(),e.moveTo(c-4,h-4),e.lineTo(c+4,h+4),e.stroke()}setVisible(t){this.root.classList.toggle("visible",t)}setCarName(t){this.carEl.textContent=t}update(t,e){const n=Math.round(e.speedKmh);n!==this.last.speed&&(this.speedEl.textContent=String(n),this.last.speed=n);const i=gt(e.speedKmh/bl,0,1);this.needle.setAttribute("transform",`rotate(${(Tl+i*Al).toFixed(2)} 140 140)`),this.arc.style.strokeDashoffset=`${this.arcLength*(1-i)}`;const r=e.reverse?"R":String(e.gear);r!==this.last.gear&&(this.gearEl.textContent=r,this.last.gear=r);const a=`${Math.min(e.lap,e.totalLaps)}/${e.totalLaps}`;a!==this.last.lap&&(this.lapEl.textContent=a,this.last.lap=a),e.position!==this.last.pos&&(this.posEl.textContent=String(e.position),this.posTotalEl.textContent=`/${e.totalCars}`,this.last.pos=e.position);const o=jn(e.lapTime);o!==this.last.time&&(this.timeEl.textContent=o,this.last.time=o);const l=jn(e.bestLap);l!==this.last.best&&(this.bestEl.textContent=l,this.last.best=l),Math.abs(e.nitro-this.last.nitro)>.004&&(this.nitroEl.style.transform=`scaleX(${gt(e.nitro,0,1)})`,this.last.nitro=e.nitro);const c=Math.round(e.drift*100)/100;Math.abs(c-this.last.drift)>.02&&(this.driftEl.style.transform=`scaleX(${gt(c,0,1)})`,this.driftWrap.classList.toggle("active",c>.15),this.last.drift=c),this.wrongEl.classList.toggle("visible",e.wrongWay),this.mapAccum+=t,this.mapAccum>.06&&(this.mapAccum=0,this.drawMinimap(e.cars))}drawMinimap(t){const e=this.mapCtx;e.clearRect(0,0,this.mapW,this.mapH),e.drawImage(this.mapCache,0,0,this.mapCache.width,this.mapCache.height,0,0,this.mapW,this.mapH);for(const n of t){const i=n.x*this.mapScale+this.mapCx,r=n.z*this.mapScale+this.mapCy;n.isPlayer?(e.save(),e.translate(i,r),e.rotate(-n.yaw+Math.PI),e.beginPath(),e.moveTo(0,-5),e.lineTo(3.4,4),e.lineTo(-3.4,4),e.closePath(),e.fillStyle="#f6fbff",e.shadowColor="#49e8ff",e.shadowBlur=7,e.fill(),e.restore()):(e.beginPath(),e.arc(i,r,2,0,Math.PI*2),e.fillStyle=`#${n.color.toString(16).padStart(6,"0")}`,e.fill())}}showMessage(t,e="cyan",n=2.2){this.messageEl.textContent=t,this.messageEl.className=`message show ${e}`,window.clearTimeout(this.messageTimer),this.messageTimer=window.setTimeout(()=>{this.messageEl.classList.remove("show")},n*1e3)}showCountdown(t){if(!t){this.countdownEl.classList.remove("show"),this.countdownEl.textContent="";return}this.countdownEl.textContent=t,this.countdownEl.classList.remove("show"),this.countdownEl.offsetWidth,this.countdownEl.classList.add("show"),t==="GO"?this.countdownEl.classList.add("go"):this.countdownEl.classList.remove("go")}setFps(t){const e=Math.round(t);e!==this.last.fps&&(this.fpsEl.textContent=String(e),this.last.fps=e)}setDriftActive(t){this.driftWrap.classList.toggle("active",t)}}const Os=3,zr=1/120,F0=[{driver:"K. VOSS",car:1,color:757464,accent:10417407,skill:.995,slot:0},{driver:"M. REYES",car:2,color:16032768,accent:16769354,skill:.975,slot:1},{driver:"A. LINDQVIST",car:0,color:16723821,accent:16761570,skill:.985,slot:2},{driver:"D. OKAFOR",car:1,color:2607467,accent:14221116,skill:.955,slot:3},{driver:"S. TANAKA",car:2,color:8019199,accent:14272767,skill:.965,slot:5}],B0=4;class O0{constructor(t,e,n,i,r){T(this,"engine");T(this,"textures");T(this,"audio");T(this,"input");T(this,"hud");T(this,"state","menu");T(this,"track");T(this,"scenery");T(this,"sky");T(this,"sun");T(this,"hemi");T(this,"fill");T(this,"carFill");T(this,"effects");T(this,"cameraRig");T(this,"preview",null);T(this,"previewTarget",null);T(this,"player");T(this,"playerAI",null);T(this,"debugAutopilot",!1);T(this,"cars",[]);T(this,"aiDrivers",[]);T(this,"onFinish",null);T(this,"onPauseChanged",null);T(this,"config");T(this,"weather","sunset");T(this,"quality","ultra");T(this,"sunDir",es.sunDir.clone());T(this,"driveInput",Ra());T(this,"aiInputs",[]);T(this,"aiTimers",[]);T(this,"prevS",[]);T(this,"accumulator",0);T(this,"countdownT",0);T(this,"lastCountdown","");T(this,"raceTime",0);T(this,"lastPlayerPosition",6);T(this,"overtakeCooldown",0);T(this,"wrongWay",!1);T(this,"speedBlur",0);T(this,"resultsSent",!1);T(this,"flash",0);T(this,"lightningTimer",jt(6,14));T(this,"lightsOffTimer",0);this.engine=t,this.textures=e,this.audio=n,this.input=i,this.config={...r},this.cameraRig=new U0(t.camera)}async init(t){t("FORGING THE CIRCUIT",.16),await qn(),this.track=new R0(this.textures),this.scene.add(this.track.group),t("BAKING TERRAIN AND SKYLINE",.4),await qn(),this.scenery=new L0(this.track,this.textures),this.scene.add(this.scenery.group),t("RAISING THE SUNSET",.58),await qn(),this.sky=new b0(this.engine.renderer),this.scene.add(this.sky.mesh),this.setupLights(),this.effects=new I0(this.scene,this.textures),t("ASSEMBLING THE MACHINE",.72),await qn(),this.applyQuality(this.config.quality,!0),this.applyWeather(this.config.weather,!0),this.buildPreview(),t("CALIBRATING TELEMETRY",.86),await qn(),this.hud=new N0(this.track),t("COMPILING SHADERS",.94),await qn();try{this.engine.renderer.compile(this.scene,this.engine.camera)}catch{}t("READY",1),await qn(),this.state="menu"}get scene(){return this.engine.scene}setupLights(){const t=new fl(16757629,3.2);t.castShadow=!0,t.shadow.mapSize.set(this.engine.shadowMapSize,this.engine.shadowMapSize);const e=t.shadow.camera;e.left=-78,e.right=78,e.top=78,e.bottom=-78,e.near=1,e.far=620,e.updateProjectionMatrix(),t.shadow.bias=-25e-5,t.shadow.normalBias=.035,this.scene.add(t,t.target),this.sun=t,this.hemi=new Vm(9414911,2759190,.5),this.scene.add(this.hemi),this.fill=new fl(9419007,.55),this.fill.position.set(-120,80,140),this.scene.add(this.fill),this.carFill=new Xm(12572927,220,45,2),this.scene.add(this.carFill)}applyQuality(t,e=!1){if((t!==this.quality||e)&&(this.engine.setQuality(t),this.quality=t),this.sun){const n=this.engine.shadowMapSize;this.sun.shadow.mapSize.x!==n&&(this.sun.shadow.mapSize.set(n,n),this.sun.shadow.map?.dispose(),this.sun.shadow.map=null)}}applyWeather(t,e=!1){if(!e&&t===this.weather)return;this.weather=t;const n=t==="storm",i=n?w0:es;this.sunDir.copy(i.sunDir),this.sky.setPalette(i,n),this.scene.environment=this.sky.environment,this.scene.environmentIntensity=i.envIntensity,this.scene.fog=new Va(i.fog,i.fogDensity),this.engine.renderer.setClearColor(i.fog,1),this.sun.color.setHex(i.light),this.sun.intensity=i.lightIntensity,this.hemi.color.setHex(i.hemiSky),this.hemi.groundColor.setHex(i.hemiGround),this.hemi.intensity=i.hemiIntensity,this.fill.color.setHex(i.hemiSky),this.fill.intensity=n?.65:.5,this.carFill.intensity=n?190:260,this.engine.setExposure(i.exposure),this.engine.setBloom(i.bloom),this.track?.setWet(n),this.effects?.setStorm(n),this.audio.setRain(n),this.lightningTimer=jt(5,12),this.flash=0}buildPreview(){this.preview&&this.preview.dispose();const e={...Ye.find(r=>r.id===this.config.carId)??Ye[0],color:this.config.color,accent:this.config.accent},n=new dc(e,this.textures),i=this.track.gridSlot(2);n.root.position.copy(i.position).add(new P(0,.01,0)),n.root.rotation.y=i.yaw,this.scene.add(n.root),this.preview=n,this.previewTarget={pos:n.root.position,yaw:i.yaw,speedAbs:0,groundY:i.position.y,steerInput:0,slip:0,nitroActive:!1}}applyConfig(t){const e=t.weather!==this.config.weather,n=t.quality!==this.config.quality;this.config={...t},e&&this.applyWeather(t.weather),n&&this.applyQuality(t.quality),this.preview&&this.preview.setPaint(t.color,t.accent),this.state!=="menu"&&this.player&&this.player.model.setPaint(t.color,t.accent)}startRace(){this.teardownCars(),this.preview&&(this.preview.root.visible=!1);const e={...Ye.find(r=>r.id===this.config.carId)??Ye[0],color:this.config.color,accent:this.config.accent};this.player=new Br(this.scene,this.track,e,this.textures,!0),this.player.driverName="YOU",this.player.reset(B0,0);const n=[this.player],i=[];F0.forEach((r,a)=>{const o=Ye[r.car%Ye.length],l={...o,name:o.name,color:r.color,accent:r.accent},c=new Br(this.scene,this.track,l,this.textures,!1);c.driverName=r.driver,c.reset(r.slot,0),n.push(c),i.push(new El(c,this.track,this.player,r.skill,a+1))}),this.cars=n,this.aiDrivers=i,this.playerAI=new El(this.player,this.track,null,1,9),this.aiInputs=i.map(()=>Ra()),this.aiTimers=i.map(()=>0),this.prevS=n.map(r=>r.s),this.state="countdown",this.countdownT=3.9,this.lastCountdown="",this.raceTime=0,this.accumulator=0,this.resultsSent=!1,this.wrongWay=!1,this.speedBlur=0,this.lightsOffTimer=0,this.overtakeCooldown=0,this.flash=0,this.lightningTimer=jt(4,10),this.hud.setVisible(!0),this.hud.setCarName(e.name),this.hud.showCountdown(""),this.scenery.setStartLights(0,!1),this.effects.clear(),this.cameraRig.setMode("chase"),this.cameraRig.snap(this.player),this.updatePositions(),this.lastPlayerPosition=this.player.position}teardownCars(){for(const t of this.cars)t.model.dispose();this.cars=[],this.aiDrivers=[],this.aiInputs=[],this.aiTimers=[],this.prevS=[]}quitToMenu(){this.teardownCars(),this.state="menu",this.hud.setVisible(!1),this.hud.showCountdown(""),this.scenery.setStartLights(0,!1),this.effects.clear(),this.cameraRig.setMode("chase"),this.preview&&(this.preview.root.visible=!0),this.onPauseChanged?.(!1),this.speedBlur=0}togglePause(){this.state==="racing"?(this.state="paused",this.onPauseChanged?.(!0),this.audio.updateEngine(0,0,0,!1,1,!1)):this.state==="paused"&&(this.state="racing",this.accumulator=0,this.onPauseChanged?.(!1))}resetPlayer(){if(this.state!=="racing")return;const t=this.track.frameAt(this.player.s);this.player.pos.set(t.pos.x,t.pos.y,t.pos.z),this.player.yaw=Math.atan2(t.tangent.x,t.tangent.z),this.player.vx=0,this.player.vz=0,this.player.yawRate=0,this.player.hint=-1,this.cameraRig.snap(this.player),this.hud.showMessage("RESET","cyan",1.1)}updatePositions(){this.cars.slice().sort((e,n)=>e.finished&&n.finished?e.finishTime-n.finishTime:e.finished?-1:n.finished?1:n.progress-e.progress).forEach((e,n)=>{e.position=n+1})}handleLap(t,e){if(t.finished)return;const n=this.track.length,i=this.prevS[e]??t.s;if(i>n*.72&&t.s<n*.28){if(t.lap++,t.lap===1)t.lapStart=this.raceTime;else if(t.lapStart>=0){const r=Math.max(.001,this.raceTime-t.lapStart);t.lastLap=r,t.lapTimes.push(r),(!t.bestLap||r<t.bestLap)&&(t.bestLap=r),t.lapStart=this.raceTime,t.isPlayer&&(t.lap===3?this.hud.showMessage("FINAL LAP","amber",2):t.lap<4&&this.hud.showMessage(`LAP ${t.lap}`,"cyan",1.3))}t.lap>Os&&this.finishCar(t),t.progress=t.lap*n+t.s}else i<n*.28&&t.s>n*.72&&(t.lap=Math.max(0,t.lap-1));this.prevS[e]=t.s}finishCar(t){t.finished||(t.finished=!0,t.finishTime=this.raceTime,t.progress=t.lap*this.track.length+t.s,t.isPlayer&&this.finishPlayer())}finishPlayer(){if(this.resultsSent)return;this.resultsSent=!0,this.state="finished",this.hud.setVisible(!1),this.hud.showCountdown(""),this.speedBlur=0,this.updatePositions();const t=this.buildResults();this.onFinish?.(t)}buildResults(){const t=this.cars.slice().sort((i,r)=>i.finished&&r.finished?i.finishTime-r.finishTime:i.finished?-1:r.finished?1:r.progress-i.progress),e=t.indexOf(this.player),n=t.map((i,r)=>{let a="—";if(i.finished)a=this.formatTime(i.finishTime);else if(this.state==="finished"||this.player.finishTime>0){const o=Math.max(0,this.player.progress-i.progress),l=Math.floor(o/this.track.length);a=l>=1?`+${l} LAP${l>1?"S":""}`:`+${(o/42).toFixed(1)}s`}return{position:r+1,driver:i.driverName||(i.isPlayer?"YOU":"RIVAL"),car:i.spec.name,timeText:a,isPlayer:i.isPlayer,finished:i.finished}});return{position:e+1,totalCars:this.cars.length,totalTime:this.player.finishTime,bestLap:this.player.bestLap,laps:this.player.lapTimes.slice(0,Os),rows:n,newBest:!1}}formatTime(t){const e=Math.floor(t/60),n=Math.floor(t%60),i=Math.floor(t%1*1e3);return`${e}:${n.toString().padStart(2,"0")}.${i.toString().padStart(3,"0")}`}fixedStep(t){if(this.raceTime+=t,this.debugAutopilot&&this.playerAI){const e=this.playerAI.think(t);this.driveInput.throttle=e.throttle,this.driveInput.brake=e.brake,this.driveInput.steer=e.steer,this.driveInput.handbrake=e.handbrake,this.driveInput.nitro=e.nitro}else this.zeroInput(this.driveInput),this.driveInput.throttle=this.input.throttle,this.driveInput.brake=this.input.brake,this.driveInput.steer=this.input.steer,this.driveInput.handbrake=this.input.handbrake,this.driveInput.nitro=this.input.nitro;this.player.update(t,this.driveInput);for(let e=0;e<this.aiDrivers.length;e++){const n=this.aiDrivers[e].vehicle;n.finished?this.zeroInput(this.aiInputs[e]):(this.aiTimers[e]-=t,this.aiTimers[e]<=0&&(this.aiInputs[e]=this.aiDrivers[e].think(.05),this.aiTimers[e]=.05)),n.update(t,this.aiInputs[e])}for(let e=0;e<this.cars.length;e++)for(let n=e+1;n<this.cars.length;n++)Br.resolveCollision(this.cars[e],this.cars[n]);for(let e=0;e<this.cars.length;e++)this.handleLap(this.cars[e],e);this.updatePositions()}zeroInput(t){t.throttle=0,t.brake=0,t.steer=0,t.handbrake=!1,t.nitro=!1}update(t){const e=Math.min(t,.05);this.handleGlobalInput(),this.state!=="paused"&&(this.updateLightning(e),this.lightsOffTimer=Math.max(0,this.lightsOffTimer-e),this.lightsOffTimer===0&&this.state==="racing"&&this.scenery.setStartLights(0,!1));let n=0;switch(this.player&&(n=gt(this.player.speedAbs/Math.max(10,this.player.spec.topSpeed),0,1)),this.state){case"menu":this.updateMenu(e),this.updateCamera(e,0);break;case"countdown":this.updateCountdown(e),this.updateCamera(e,0),this.updateHud(e);break;case"racing":this.updateRacing(e),n=gt(this.player.speedAbs/Math.max(10,this.player.spec.topSpeed),0,1),this.updateCamera(e,n),this.updateHud(e),this.updateFeedback(e);break;case"paused":break;case"finished":this.updateCamera(e,0);break}this.speedBlur=this.state==="racing"&&this.player?gt((this.player.speedAbs-28)/82,0,1)*.9+(this.player.nitroActive?.12:0):0,this.engine.setSpeedBlur(this.speedBlur),this.engine.setVignette(.4+this.speedBlur*.09),this.updateAudio(n),this.effects.update(e,this.engine.camera,this.state==="racing"?n:0),this.updateSun(),this.sky.update(e,this.engine.camera.position),this.engine.setFlash(this.flash*.45)}updateMenu(t){if(!this.preview)return;const e=performance.now()*.001;this.preview.updateVisual(t,0,Math.sin(e*.6)*.35,0,!1),this.preview.setBodyTilt(Math.sin(e*.5)*.004,0)}updateCountdown(t){this.countdownT-=t;const e=this.countdownT;let n="";if(e>2.9?n="3":e>1.9?n="2":e>.9?n="1":e>.12&&(n="GO"),n!==this.lastCountdown&&(this.lastCountdown=n,n))if(this.hud.showCountdown(n),n==="GO")this.scenery.setStartLights(0,!0),this.audio.countdown(0),this.lightsOffTimer=1.6;else{const i=Number(n);this.scenery.setStartLights(4-i,!1),this.audio.countdown(i)}e<=0&&(this.state="racing",this.raceTime=0,this.accumulator=0,this.hud.showCountdown(""),this.prevS=this.cars.map(i=>i.s))}updateRacing(t){this.accumulator+=t;let e=0;for(;this.accumulator>=zr&&e<8&&(this.fixedStep(zr),this.accumulator-=zr,e++,this.state==="racing"););e>=8&&(this.accumulator=0),this.overtakeCooldown>0&&(this.overtakeCooldown-=t),this.state==="racing"&&this.overtakeCooldown<=0&&(this.raceTime>5&&this.player.speedKmh>25&&this.player.position<this.lastPlayerPosition&&(this.hud.showMessage("OVERTAKE","cyan",1.4),this.overtakeCooldown=1.6),this.lastPlayerPosition=this.player.position)}updateHud(t){if(!this.player)return;const e=this.track.frameAt(this.player.s),n=this.player.vx*e.tangent.x+this.player.vz*e.tangent.z;this.wrongWay=this.state==="racing"&&this.player.speedAbs>7&&n<-4;const i=this.cars.map(a=>({x:a.pos.x,z:a.pos.z,yaw:a.yaw,isPlayer:a.isPlayer,color:a.spec.color})),r=this.state==="racing"&&this.player.lap>0?Math.max(0,this.raceTime-this.player.lapStart):this.state==="racing"?this.raceTime:0;this.hud.update(t,{speedKmh:this.player.speedKmh,gear:this.player.gear,reverse:this.player.speed<-.5,nitro:this.player.nitro,lap:Math.max(1,Math.min(this.player.lap,Os)),totalLaps:Os,position:this.player.position,totalCars:this.cars.length,lapTime:r,bestLap:this.player.bestLap,drift:this.player.drift,wrongWay:this.wrongWay,cars:i})}updateFeedback(t){for(const e of this.cars){if(e.wallHit>.05){const n=this.track.frameAt(e.s),i=Math.sign(e.lateral)||1,r=e.pos.x+n.right.x*i*1.05,a=e.pos.z+n.right.z*i*1.05;this.effects.sparkBurst(r,e.groundY+.5,a,e.wallHit),e.isPlayer&&(this.cameraRig.addShake(e.wallHit*.55),this.audio.impact(e.wallHit),e.wallHit>.3&&this.audio.scrape(e.wallHit)),e.wallHit=0}e.carHit>.08&&(this.effects.sparkBurst(e.pos.x,e.groundY+.6,e.pos.z,e.carHit*.8),e.isPlayer&&(this.cameraRig.addShake(e.carHit*.4),this.audio.impact(e.carHit*.7)),e.carHit=0),this.effects.tireSmoke(e,t),this.effects.flame(e)}}updateCamera(t,e){if(this.state==="menu"){this.previewTarget&&this.cameraRig.update(t,this.previewTarget,0,!0,!1);return}if(this.player){if(this.state==="finished"){this.cameraRig.update(t,this.player,0,!1,!0);return}this.cameraRig.update(t,this.player,e,!1,!1)}}updateAudio(t){if(!this.player||this.cars.length===0){this.audio&&this.audio.updateEngine(0,0,0,!1,1,!1);return}const e=this.state==="racing"||this.state==="countdown",n=e?this.input.throttle:0;this.audio.updateEngine(this.player.rpm,n,e?t:0,e&&this.player.nitroActive,this.player.gear,e),this.audio.updateTyres(e?this.player.slip:0,e?t:0),this.audio.updateWind(e?t:0),this.audio.updateNitro(e&&this.player.nitroActive)}updateSun(){const t=this.state==="menu"&&this.preview?this.preview.root.position:this.player?.pos;if(!t)return;this.sun.position.copy(t).addScaledVector(this.sunDir,280),this.sun.target.position.copy(t),this.sun.target.updateMatrixWorld();const n=this.engine.camera.position.clone().sub(t);n.y=Math.abs(n.y)+3.5,n.normalize(),this.carFill.position.copy(t).addScaledVector(n,4).add(new P(0,2.3,0))}updateLightning(t){if(this.weather!=="storm"){this.flash=0,this.sky?.setFlash(0);return}this.flash=Math.max(0,this.flash-t*2.2),this.lightningTimer-=t,this.lightningTimer<=0?(this.lightningTimer=jt(5,13),this.flash=1,this.audio.thunder(),this.sky?.setFlash(1)):this.sky?.setFlash(this.flash)}handleGlobalInput(){this.input.consume("pause")&&this.togglePause(),this.input.consume("camera")&&(this.state==="racing"||this.state==="countdown")&&this.cameraRig.cycleMode(),this.input.consume("reset")&&this.state==="racing"&&this.resetPlayer()}getSpeedBlur(){return this.speedBlur}get isStorm(){return this.weather==="storm"}}async function z0(){const s=document.getElementById("scene"),t=new y0,e=new _0;e.setMuted(localStorage.getItem("vanta-gp-muted")==="1"),t.setSound(e.isMuted);let n;try{n=new i0(s)}catch(d){t.setLoading("WEBGL2 IS REQUIRED",0);const f=document.getElementById("loading-label");f&&(f.textContent=`WEBGL2 UNAVAILABLE — ${String(d).slice(0,80)}`),console.error(d);return}const i=g0(n.renderer.capabilities.getMaxAnisotropy()),r=new v0,a=new O0(n,i,e,r,t.config);window.__vanta={game:a,engine:n,ui:t,audio:e,input:r};const o=()=>{e.init(),e.startMusic(),t.hideMenu(),t.hidePause(),t.hideResults(),a.startRace(),document.body.classList.add("in-race")},l=()=>{a.quitToMenu(),t.hideResults(),t.hidePause(),t.showMenu(t.bestLap()),document.body.classList.remove("in-race")};t.onStart=o,t.onRestart=o,t.onResume=()=>a.togglePause(),t.onQuit=l,t.onConfigChange=d=>a.applyConfig(d),t.onToggleSound=()=>{e.init(),e.setMuted(!e.isMuted),t.setSound(e.isMuted)},a.onPauseChanged=d=>{d?(t.showPause(),document.body.classList.remove("in-race")):(t.hidePause(),(a.state==="racing"||a.state==="countdown")&&document.body.classList.add("in-race"))},a.onFinish=d=>{const f=t.saveBestLap(d.bestLap);t.showResults({...d,newBest:f}),document.body.classList.remove("in-race")};const c=()=>{e.init(),e.startMusic(),document.removeEventListener("pointerdown",c),document.removeEventListener("keydown",c)};document.addEventListener("pointerdown",c,{once:!1}),document.addEventListener("keydown",c,{once:!1});try{await a.init((d,f)=>t.setLoading(d,f))}catch(d){console.error(d),t.setLoading("FAILED TO BUILD THE CIRCUIT",0);const f=document.getElementById("loading-label");f&&(f.textContent=`BOOT ERROR — ${String(d).slice(0,120)}`);return}t.hideLoading(),window.setTimeout(()=>{a.state==="menu"&&t.showMenu(t.bestLap())},250);const h=new lc,u=()=>{requestAnimationFrame(u);const d=Math.min(h.getDelta(),.05);r.update(),r.consume("mute")&&(e.init(),e.setMuted(!e.isMuted),t.setSound(e.isMuted)),r.consume("start")&&(a.state==="menu"||a.state==="finished")&&o(),a.update(d),n.render(d,a.getSpeedBlur()),a.hud&&a.hud.setFps(n.fps)};requestAnimationFrame(u),document.addEventListener("visibilitychange",()=>{document.hidden&&a.state==="racing"&&a.togglePause()})}z0();
