/*
Bit Shadow Machine
Copyright (c) 2012 Your name
Your city, state zip, country
Your email
Your url

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
/* Version: 1.0.0 */
/* Build time: December 30, 2012 07:13:41 */

function BitShadowMachine(f,p){function l(a){this.options=a||{};this.name="element";this.id=this.name+f.System._getNewId();this.blur=0;return this}function c(a,b){this.x=a||0;this.y=b||0}function e(){this.name="system"}function n(a){var a=a||{},b=f.Utils.getWindowSize();this.gravity=a.gravity||new f.Vector(0,0);this.resolution=a.resolution||8;this.width=a.width/this.resolution||b.width/this.resolution;this.height=a.height/this.resolution||b.height/this.resolution;this.el=a.el?a.el:document.body;this.name=
"world";this.id=this.name+f.System._getNewId();this._pool=[]}var o=p||null;window.requestAnimFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,1E3/60)};f.Utils={extend:function(a,b){function d(){}d.prototype=b.prototype;a.prototype=new d;a.prototype.constructor=a},map:function(a,b,d,h,c){return(a-b)/(d-b)*(c-h)+h},getDataType:function(a){return"[object Array]"===
Object.prototype.toString.call(a)?"array":"[object NodeList]"===Object.prototype.toString.call(a)?"nodeList":typeof a},getWindowSize:function(){var a={width:!1,height:!1};"undefined"!==typeof window.innerWidth?a.width=window.innerWidth:"undefined"!==typeof document.documentElement&&"undefined"!==typeof document.documentElement.clientWidth?a.width=document.documentElement.clientWidth:"undefined"!==typeof document.body&&(a.width=document.body.clientWidth);"undefined"!==typeof window.innerHeight?a.height=
window.innerHeight:"undefined"!==typeof document.documentElement&&"undefined"!==typeof document.documentElement.clientHeight?a.height=document.documentElement.clientHeight:"undefined"!==typeof document.body&&(a.height=document.body.clientHeight);return a},getRandomNumber:function(a,b,d){return d?Math.random()*(b-(a-1))+a:Math.floor(Math.random()*(b-(a-1)))+a},addEvent:function(a,b,d){a.addEventListener?this.addEventHandler=function(a,b,d){a.addEventListener(b,d,!1)}:a.attachEvent&&(this.addEventHandler=
function(a,b,d){a.attachEvent("on"+b,d)});this.addEventHandler(a,b,d)}};l.prototype._init=function(){var a,b=this.options;if(!b.world||"object"!==f.Utils.getDataType(b.world))throw Error("Element: A valid instance of the World class is required for a new Element.");for(a in b)b.hasOwnProperty(a)&&(this[a]="function"===f.Utils.getDataType(b[a])?b[a]():b[a])};f.Element=l;c.VectorSub=function(a,b){return new c(a.x-b.x,a.y-b.y)};c.VectorAdd=function(a,b){return new c(a.x+b.x,a.y+b.y)};c.VectorMult=function(a,
b){return new c(a.x*b,a.y*b)};c.VectorDiv=function(a,b){return new c(a.x/b,a.y/b)};c.VectorDistance=function(a,b){return Math.sqrt(Math.pow(b.x-a.x,2)+Math.pow(b.y-a.y,2))};c.VectorMidPoint=function(a,b){return c.VectorAdd(a,b).div(2)};c.VectorAngleBetween=function(a,b){var d=a.dot(b);return Math.acos(d/(a.mag()*b.mag()))};c.prototype.name="Vector";c.prototype.clone=function(){function a(){}a.prototype=this;return new a};c.prototype.add=function(a){this.x+=a.x;this.y+=a.y;return this};c.prototype.sub=
function(a){this.x-=a.x;this.y-=a.y;return this};c.prototype.mult=function(a){this.x*=a;this.y*=a;return this};c.prototype.div=function(a){this.x/=a;this.y/=a;return this};c.prototype.mag=function(){return Math.sqrt(this.x*this.x+this.y*this.y)};c.prototype.limit=function(a){this.mag()>a&&(this.normalize(),this.mult(a));return this};c.prototype.normalize=function(){var a=this.mag();if(0!==a)return this.div(a)};c.prototype.distance=function(a){return Math.sqrt(Math.pow(a.x-this.x,2)+Math.pow(a.y-this.y,
2))};c.prototype.rotate=function(a){var b=Math.cos(a),a=Math.sin(a),d=this.x,h=this.y;this.x=d*b-h*a;this.y=d*a+h*b;return this};c.prototype.midpoint=function(a){return c.VectorAdd(this,a).div(2)};c.prototype.dot=function(a){return this.z&&a.z?this.x*a.x+this.y*a.y+this.z*a.z:this.x*a.x+this.y*a.y};f.Vector=c;e._records={lookup:{},list:[]};e._worldsCache={list:[],buffers:{}};e._idCount=0;e.mouse={location:new f.Vector};e._getNewId=function(){this._idCount++;return this._idCount};e._getIdCount=function(){return this._idCount};
e.create=function(a,b,d){var h,c=e._records.list,k=a||function(){},j,i=f.Utils,g=e._worldsCache.list,m=e._worldsCache.buffers;if(b)if("object"===i.getDataType(b))c[c.length]=new f.World(b),g[g.length]=c[c.length-1],m[g[g.length-1].id]="";else{if("array"===i.getDataType(b)&&b.length){a=0;for(h=b.length;a<h;a++)j=b[a],"object"===i.getDataType(j)&&(c[c.length]=new f.World(j),g[g.length]=c[c.length-1],m[g[g.length-1].id]="")}}else c[c.length]=new f.World,g[g.length]=c[c.length-1],m[g[g.length-1].id]=
"";"function"===i.getDataType(k)&&k.call(this);d||e._update();e.mouse.location=new f.Vector(i.getWindowSize().width/2/e._records.list[0].resolution,i.getWindowSize().height/2/e._records.list[0].resolution);i.addEvent(window,"mousemove",function(a){var b=e._records.list[0].resolution;a.pageX&&a.pageY?e.mouse.location=new f.Vector(a.pageX/b,a.pageY/b):a.clientX&&a.clientY&&(e.mouse.location=new f.Vector(a.clientX/b,a.clientY/b))})};e._update=function(){var a,b=this._records.list,d,c=this._worldsCache.list,
e=this._worldsCache.buffers,f="";for(a=c.length-1;0<=a;a-=1)e[c[a].id]="";for(a=b.length-1;0<=a;a-=1)d=b[a],d.step&&d.step();for(a=b.length-1;0<=a;a-=1)d=b[a],d.world&&(f=e[d.world.id],f=f+d.location.x*d.world.resolution+"px "+d.location.y*d.world.resolution+"px "+d.blur+"px "+d.world.resolution+"px rgba("+d.color[0]+","+d.color[1]+","+d.color[2]+","+d.opacity+"),",e[d.world.id]=f);for(a=c.length-1;0<=a;a-=1)b=e[c[a].id],c[a].el.style.boxShadow=b.substr(0,b.length-1);var j=this;window.requestAnimFrame(function(){j._update(j)})};
e._getWorld=function(a){for(var b=this._records.list,d=0,c=b.length;d<c;d++)if(b[d].el===a)return b[d];return null};e.add=function(a,b){var d=b||{},c=this._records.list,l=this._records.lookup,k=null;d.world=!d.world||"object"!==f.Utils.getDataType(d.world)?c[0]:e._getWorld(d.world);d.world._pool&&d.world._pool.length?(c[c.length]=d.world._pool.pop(),c[c.length-1].options=d):c[c.length]=o[a]?new o[a](d):new f[a](d);c[c.length-1]._init();c[c.length-1]._el&&(k=c[c.length-1]._el.parentNode);l[c[c.length-
1].id]=k};e.destroy=function(a){var b,c,e=this._records.list;b=0;for(c=e.length;b<c;b+=1)if(e[b].id===a.id){e[b].world._pool[e[b].world._pool.length]=e.splice(b,1)[0];break}};f.System=e;n.prototype.step=function(){};f.World=n};

