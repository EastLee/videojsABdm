/*!Copyright(c) CommentCoreLibrary (//github.com/jabbany/CommentCoreLibrary) - Licensed under the MIT License */function CommentFilter(){this.rulebook={all:[]},this.modifiers=[],this.runtime=null,this.allowTypes={1:!0,4:!0,5:!0,6:!0,7:!0,8:!0,17:!0},this.doModify=function(a){for(var b=0;b<this.modifiers.length;b++)a=this.modifiers[b](a);return a},this.isMatchRule=function(a,b){switch(b.operator){case"==":if(a[b.subject]==b.value)return!1;break;case">":if(a[b.subject]>b.value)return!1;break;case"<":if(a[b.subject]<b.value)return!1;break;case"range":if(a[b.subject]>b.value.min&&a[b.subject]<b.value.max)return!1;break;case"!=":if(a[b.subject]!=b.value)return!1;break;case"~":if(new RegExp(b.value).test(a[b[subject]]))return!1;break;case"!~":if(!new RegExp(b.value).test(a[b[subject]]))return!1}return!0},this.beforeSend=function(a){var b=a.data.mode;if(null!=this.rulebook[b]){for(var c=0;c<this.rulebook[b].length;c++)if("width"==this.rulebook[b][c].subject||"height"==this.rulebook[b][c].subject)if("width"==this.rulebook[b][c].subject)switch(this.rulebook[b][c].operator){case">":if(this.rulebook[b][c].value<a.offsetWidth)return!1;break;case"<":if(this.rulebook[b][c].value>a.offsetWidth)return!1;break;case"range":if(this.rulebook[b][c].value.max>a.offsetWidth&&this.rulebook[b][c].min<a.offsetWidth)return!1;break;case"==":if(this.rulebook[b][c].value==a.offsetWidth)return!1}else switch(this.rulebook[b][c].operator){case">":if(this.rulebook[b][c].value<a.offsetHeight)return!1;break;case"<":if(this.rulebook[b][c].value>a.offsetHeight)return!1;break;case"range":if(this.rulebook[b][c].value.max>a.offsetHeight&&this.rulebook[b][c].min<a.offsetHeight)return!1;break;case"==":if(this.rulebook[b][c].value==a.offsetHeight)return!1}return!0}return!0},this.doValidate=function(a){if(!this.allowTypes[a.mode])return!1;var b={text:a.text,mode:a.mode,color:a.color,size:a.size,stime:a.stime,hash:a.hash};if(null!=this.rulebook[a.mode]&&this.rulebook[a.mode].length>0)for(var c=0;c<this.rulebook[a.mode];c++)if(!this.isMatchRule(b,this.rulebook[a.mode][c]))return!1;for(var c=0;c<this.rulebook[a.mode];c++)if(!this.isMatchRule(b,this.rulebook[a.mode][c]))return!1;return!0},this.addRule=function(a){switch(null==this.rulebook[a.mode+""]&&(this.rulebook[a.mode+""]=[]),a.operator){case"eq":case"equals":case"=":a.operator="==";break;case"ineq":a.operator="!=";break;case"regex":case"matches":a.operator="~";break;case"notmatch":case"iregex":a.operator="!~"}return this.rulebook[a.mode].push(a),this.rulebook[a.mode].length-1},this.addModifier=function(a){this.modifiers.push(a)},this.runtimeFilter=function(a){return null==this.runtime?a:this.runtime(a)},this.setRuntimeFilter=function(a){this.runtime=a}}function CommentSpaceAllocator(a,b){this.width=a,this.height=b,this.dur=4e3,this.pools=[[]],this.pool=this.pools[0],this.setBounds=function(a,b){this.width=a,this.height=b},this.add=function(a){a.cindex=this.pools.indexOf(a.height>=this.height?this.pool:this.pool)},this.remove=function(a){var b=this.pools[a.cindex];b.remove(a)},this.validateCmt=function(a){return a.bottom=a.offsetTop+a.offsetHeight,a.y=a.offsetTop,a.x=a.offsetLeft,a.right=a.offsetLeft+a.offsetWidth,a.width&&a.height||(a.height=a.offsetHeight,a.width=a.offsetWidth),a.top=a.offsetTop,a.left=a.offsetLeft,a},this.setY=function(a,b){if(!b)var b=0;if(a=this.validateCmt(a),this.pools.length<=b&&this.pools.push([]),this.pool=this.pools[b],0==this.pool.length)return this.pool.push(a),0;if(this.vCheck(0,a))return this.pool.binsert(a,function(a,b){return a.bottom<b.bottom?-1:a.bottom==b.bottom?0:1}),a.y;for(var c=0,d=0;d<this.pool.length&&(c=this.pool[d].bottom+1,!(c+a.offsetHeight>this.height));d++)if(this.vCheck(c,a))return this.pool.binsert(a,function(a,b){return a.bottom<b.bottom?-1:a.bottom==b.bottom?0:1}),a.y;return this.setY(a,b+1)},this.vCheck=function(a,b){var c=a+b.height,d=b.x+b.width;this.validateCmt(b);for(var e=0;e<this.pool.length;e++)if(this.pool[e]=this.validateCmt(this.pool[e]),!(this.pool[e].y>c||this.pool[e].bottom<a)){if(this.pool[e].right<b.x||this.pool[e].x>d){if(this.getEnd(this.pool[e])<this.getMiddle(b))continue;return!1}return!1}return b.y=a,b.bottom=b.height+a,!0},this.getEnd=function(a){return a.stime+a.ttl},this.getMiddle=function(a){return a.stime+a.ttl/2}}function TopCommentSpaceAllocator(a,b){var c=new CommentSpaceAllocator(a,b);c.add=function(a){c.validateCmt(a),a.style.left=(c.width-a.width)/2+"px",a.height>=c.height?(a.cindex=c.pools.indexOf(c.pool),a.style.top="0px"):(a.cindex=c.pools.indexOf(c.pool),a.style.top=c.setY(a)+"px")},c.vCheck=function(a,b){for(var d=a+b.height,e=0;e<c.pool.length;e++){var f=c.validateCmt(c.pool[e]);if(!(f.y>d||f.bottom<a))return!1}return b.y=a,b.bottom=b.bottom+a,!0},this.setBounds=function(a,b){c.setBounds(a,b)},this.add=function(a){c.add(a)},this.remove=function(a){c.remove(a)}}function BottomCommentSpaceAllocator(a,b){var c=new CommentSpaceAllocator(a,b);c.add=function(a){a.style.top="",a.style.bottom="0px",c.validateCmt(a),a.style.left=(c.width-a.width)/2+"px",a.height>=c.height?(a.cindex=c.pools.indexOf(c.pool),a.style.bottom="0px"):(a.cindex=c.pools.indexOf(c.pool),a.style.bottom=c.setY(a)+"px")},c.validateCmt=function(a){return a.y=c.height-(a.offsetTop+a.offsetHeight),a.bottom=a.y+a.offsetHeight,a.x=a.offsetLeft,a.right=a.offsetLeft+a.offsetWidth,a.height=a.offsetHeight,a.width=a.offsetWidth,a.top=a.y,a.left=a.offsetLeft,a},c.vCheck=function(a,b){for(var d=a+b.height,e=0;e<c.pool.length;e++){var f=c.validateCmt(c.pool[e]);if(!(f.y>d||f.bottom<a))return!1}return b.y=a,b.bottom=b.bottom+a,!0},this.setBounds=function(a,b){c.setBounds(a,b)},this.add=function(a){c.add(a)},this.remove=function(a){c.remove(a)}}function ReverseCommentSpaceAllocator(a,b){var c=new CommentSpaceAllocator(a,b);c.vCheck=function(a,b){var c=a+b.height,d=b.x+b.width;this.validateCmt(b);for(var e=0;e<this.pool.length;e++){var f=this.validateCmt(this.pool[e]);if(!(f.y>c||f.bottom<a)){if(f.x>d||f.right<b.x){if(this.getEnd(f)<this.getMiddle(b))continue;return!1}return!1}}return b.y=a,b.bottom=b.height+a,!0},this.setBounds=function(a,b){c.setBounds(a,b)},this.add=function(a){c.add(a)},this.remove=function(a){c.remove(a)}}function BottomScrollCommentSpaceAllocator(a,b){var c=new CommentSpaceAllocator(a,b);c.validateCmt=function(a){return a.y=c.height-(a.offsetTop+a.offsetHeight),a.bottom=a.y+a.offsetHeight,a.x=a.offsetLeft,a.right=a.offsetLeft+a.offsetWidth,a.height=a.offsetHeight,a.width=a.offsetWidth,a.top=a.y,a.left=a.offsetLeft,a},c.add=function(a){a.style.top="",a.style.bottom="0px",c.validateCmt(a),a.style.left=c.width+"px",a.height>=c.height?(a.cindex=c.pools.indexOf(c.pool),a.style.bottom="0px"):(a.cindex=c.pools.indexOf(c.pool),a.style.bottom=c.setY(a)+"px")},this.setBounds=function(a,b){c.setBounds(a,b)},this.add=function(a){c.add(a)},this.remove=function(a){c.remove(a)}}function CommentManager(a){var b=0;this.stage=a,this.def={opacity:1,globalScale:1,scrollScale:1},this.timeline=[],this.runline=[],this.position=0,this.limiter=0,this.filter=null,this.csa={scroll:new CommentSpaceAllocator(0,0),top:new TopCommentSpaceAllocator(0,0),bottom:new BottomCommentSpaceAllocator(0,0),reverse:new ReverseCommentSpaceAllocator(0,0),scrollbtm:new BottomScrollCommentSpaceAllocator(0,0)},this.stage.width=this.stage.offsetWidth,this.stage.height=this.stage.offsetHeight,this.canvas=document.createElement("canvas"),this.canvas.width=this.stage.width,this.stage.height=this.stage.height,this.stage.appendChild(this.canvas),this.ctx=this.canvas.getContext("2d"),this.ctx.textBaseline="top",this.pcanvas=document.createElement("canvas"),this.pctx=this.pcanvas.getContext("2d"),this.pdivpool=[0],this.pdivheight=29,this.onplay=!1,requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame,_CMthis=this,this.initCmt=function(a,b){return a.className="cmt",a.stime=b.stime,a.mode=b.mode,a.data=b,17===a.mode||(a.appendChild(document.createTextNode(b.text)),a.innerText=b.text,a.style.fontSize=b.size+"px"),null!=b.font&&""!=b.font&&(a.style.fontFamily=b.font),b.shadow===!1&&(a.className="cmt noshadow"),"#000000"!=b.color||!b.shadow&&null!=b.shadow||(a.className+=" rshadow"),null!=b.margin&&(a.style.margin=b.margin),null!=b.color&&(a.style.color=b.color),1!=this.def.opacity&&1==b.mode&&(a.style.opacity=this.def.opacity),null!=b.alphaFrom&&(a.style.opacity=b.alphaFrom),b.border&&(a.style.border="1px solid #00ffff"),a.ttl=Math.round(4e3*this.def.globalScale),a.dur=a.ttl,(1===a.mode||6===a.mode||2===a.mode)&&(a.ttl*=this.def.scrollScale,a.dur=a.ttl),a},this.startTimer=function(){if(!(b>0)){this.onplay=!0;var a=(new Date).getTime(),c=this;b=window.setInterval(function(){var b=(new Date).getTime()-a;a=(new Date).getTime(),c.onTimerEvent(b,c)},10)}},this.stopTimer=function(){this.onplay=!1,window.clearInterval(b),b=0},this.onDraw=function(){if(_CMthis.onplay){for(_CMthis.pcanvas.width=_CMthis.canvas.width,_CMthis.pcanvas.height=_CMthis.canvas.height,_CMthis.ctx.clearRect(0,0,_CMthis.canvas.offsetWidth,_CMthis.canvas.offsetHeight),_CMthis.pctx.clearRect(0,0,_CMthis.canvas.offsetWidth,_CMthis.canvas.offsetHeight),i=0;i<_CMthis.runline.length;i++)cmt=_CMthis.runline[i],_CMthis.pctx.textBaseline="top",_CMthis.pctx.shadowBlur=2,_CMthis.pctx.shadowColor="black",_CMthis.pctx.font=cmt.ctxfont,_CMthis.pctx.fillStyle=cmt.color,cmt.border&&(_CMthis.pctx.lineWidth=2,_CMthis.pctx.strokeStyle="#000000",_CMthis.pctx.strokeText(cmt.text,cmt.left,cmt.totop)),_CMthis.pctx.fillText(cmt.text,cmt.left,cmt.totop);_CMthis.ctx.drawImage(_CMthis.pcanvas,0,0)}requestAnimationFrame(_CMthis.onDraw)},requestAnimationFrame(_CMthis.onDraw)}function AcfunParser(a){function b(a){for(;a.length<6;)a="0"+a;return a}var c=[];try{var d=JSON.parse(a)}catch(e){return console.log("Error: Could not parse json list!"),[]}for(var f=0;f<d.length;f++){var g={},h=d[f].c.split(",");if(h.length>0){if(g.stime=1e3*parseFloat(h[0]),g.color="#"+b(parseInt(h[1]).toString(16)),g.mode=parseInt(h[2]),g.size=parseInt(h[3]),g.hash=h[4],g.date=parseInt(h[5]),g.position="relative",7!=g.mode?(g.text=d[f].m.replace(/(\/n|\\n|\n|\r\n|\\r)/g,"\n"),g.text=g.text.replace(/\r/g,"\n"),g.text=g.text.replace(/\s/g," ")):g.text=d[f].m,7==g.mode){try{var i=JSON.parse(g.text)}catch(e){console.log("[Err] Error parsing internal data for comment"),console.log("[Dbg] "+g.text);continue}g.text=i.n,g.text=g.text.replace(/\ /g," "),console.log(g.text),null!=i.p?(g.x=i.p.x/1e3,g.y=i.p.y/1e3):(g.x=0,g.y=0),g.shadow=i.b,g.duration=4e3,null!=i.l&&(g.moveDelay=1e3*i.l),null!=i.z&&i.z.length>0&&(g.movable=!0,g.toX=i.z[0].x/1e3,g.toY=i.z[0].y/1e3,g.alphaTo=i.z[0].t,g.colorTo=i.z[0].c,g.moveDuration=null!=i.z[0].l?1e3*i.z[0].l:500,g.duration=g.moveDelay+g.moveDuration),null!=i.r&&null!=i.k&&(g.rX=i.r,g.rY=i.k),i.a&&(g.alphaFrom=i.a)}c.push(g)}}return c}function BilibiliParser(a,b,c){function d(a){for(;a.length<6;)a="0"+a;return a}function e(a){return a.replace(/\t/,"\\t")}if(null!==a)var f=a.getElementsByTagName("d");else{if(c){if(!confirm("XML Parse Error. \n Allow tag soup parsing?\n[WARNING: This is unsafe.]"))return[]}else b=b.replace(new RegExp("</([^d])","g"),"</disabled $1"),b=b.replace(new RegExp("</(S{2,})","g"),"</disabled $1"),b=b.replace(new RegExp("<([^d/]W*?)","g"),"<disabled $1"),b=b.replace(new RegExp("<([^/ ]{2,}W*?)","g"),"<disabled $1"),console.log(b);var g=document.createElement("div");g.innerHTML=b,console.log(g);var f=g.getElementsByTagName("d")}for(var h=[],i=0;i<f.length;i++)if(null!=f[i].getAttribute("p")){var j=f[i].getAttribute("p").split(",");if(!f[i].childNodes[0])continue;var b=f[i].childNodes[0].nodeValue,k={};if(k.stime=Math.round(parseFloat(1e3*j[0])),k.size=parseInt(j[2]),k.color="#"+d(parseInt(j[3]).toString(16)),k.mode=parseInt(j[1]),k.date=parseInt(j[4]),k.pool=parseInt(j[5]),k.position="absolute",null!=j[7]&&(k.dbid=parseInt(j[7])),k.hash=j[6],k.border=!1,k.mode<7)k.text=b.replace(/(\/n|\\n|\n|\r\n)/g,"\n");else if(7==k.mode)try{adv=JSON.parse(e(b)),k.shadow=!0,k.x=parseInt(adv[0]),k.y=parseInt(adv[1]),k.text=adv[4].replace(/(\/n|\\n|\n|\r\n)/g,"\n"),k.rZ=0,k.rY=0,adv.length>=7&&(k.rZ=parseInt(adv[5]),k.rY=parseInt(adv[6])),k.movable=!1,adv.length>=11&&(k.movable=!0,k.toX=adv[7],k.toY=adv[8],k.moveDuration=500,k.moveDelay=0,""!=adv[9]&&(k.moveDuration=adv[9]),""!=adv[10]&&(k.moveDelay=adv[10]),adv.length>11&&(k.shadow=adv[11],"true"===k.shadow&&(k.shadow=!0),"false"===k.shadow&&(k.shadow=!1),null!=adv[12]&&(k.font=adv[12]))),k.duration=2500,adv[3]<12&&(k.duration=1e3*adv[3]),k.alphaFrom=1,k.alphaTo=1;var g=adv[2].split("-");null!=g&&g.length>1&&(k.alphaFrom=parseFloat(g[0]),k.alphaTo=parseFloat(g[1]))}catch(l){console.log("[Err] Error occurred in JSON parsing"),console.log("[Dbg] "+b)}else 8==k.mode&&(k.code=b);null!=k.text&&(k.text=k.text.replace(/\u25a0/g,"█")),h.push(k)}return h}Array.prototype.remove=function(a){for(var b=0;b<this.length;b++)if(this[b]==a){this.splice(b,1);break}},Array.prototype.bsearch=function(a,b){if(0==this.length)return 0;if(b(a,this[0])<0)return 0;if(b(a,this[this.length-1])>=0)return this.length;for(var c=0,d=0,e=0,f=this.length-1;f>=c;){if(d=Math.floor((f+c+1)/2),e++,b(a,this[d-1])>=0&&b(a,this[d])<0)return d;b(a,this[d-1])<0?f=d-1:b(a,this[d])>=0?c=d:console.error("Program Error"),e>1500&&console.error("Too many run cycles.")}return-1},Array.prototype.binsert=function(a,b){this.splice(this.bsearch(a,b),0,a)},CommentManager.prototype.seek=function(a){this.position=this.timeline.bsearch(a,function(a,b){return a<b.stime?-1:a>b.stime?1:0})},CommentManager.prototype.validate=function(a){return null==a?!1:this.filter.doValidate(a)},CommentManager.prototype.load=function(a){this.timeline=a,this.timeline.sort(function(a,b){return a.stime>b.stime?2:a.stime<b.stime?-2:a.date>b.date?1:a.date<b.date?-1:null!=a.dbid&&null!=b.dbid?a.dbid>b.dbid?1:a.dbid<b.dbid?-1:0:0}),this.preload()},CommentManager.prototype.preload=function(){this.pdivpool=[-1e7];for(var a=0;a<this.timeline.length;a++)if(1===this.timeline[a].mode){cmt=this.timeline[a],cmt.ctxfont="bold "+cmt.size+"px SimHei",null!=cmt.font&&""!=cmt.font&&(cmt.ctxfont="bold "+cmt.size+"px "+cmt.font),this.ctx.font=cmt.ctxfont,text=cmt.text.split("\n"),cmt.height=Math.floor(text.length*cmt.size*1.15)+1,cmt.textlength=0;for(var b=0;b<text.length;b++)this.ctx.measureText(text[b]).width>cmt.textlength&&(cmt.textlength=this.ctx.measureText(text[b]).width);cmt.width=cmt.textlength,cmt.ttl=Math.round(4e3*this.def.globalScale),cmt.dur=cmt.ttl,(1===cmt.mode||6===cmt.mode||2===cmt.mode)&&(cmt.ttl*=this.def.scrollScale,cmt.dur=cmt.ttl),cmt.hold=0}},CommentManager.prototype.clear=function(){for(k=0;k<this.pdivpool.lenght;k++)this.pdivpool[k]=-1e7;for(var a=0;a<this.runline.length;a++)this.finish(this.runline[a]),1!==this.runline[a].mode&&this.stage.removeChild(this.runline[a]);this.runline=[]},CommentManager.prototype.setBounds=function(){for(var a in this.csa)this.csa[a].setBounds(this.stage.offsetWidth,this.stage.offsetHeight);this.stage.width=this.stage.offsetWidth,this.stage.height=this.stage.offsetHeight,this.stage.style.perspective=this.stage.width*Math.tan(40*Math.PI/180)/2+"px",this.stage.style.webkitPerspective=this.stage.width*Math.tan(40*Math.PI/180)/2+"px",this.canvas.width=this.stage.offsetWidth,this.canvas.height=this.stage.offsetHeight},CommentManager.prototype.init=function(){this.setBounds(),null==this.filter&&(this.filter=new CommentFilter)},CommentManager.prototype.time=function(a){if(a-=1,this.position>=this.timeline.length||Math.abs(this.lastPos-a)>=500){if(this.seek(a),this.lastPos=a,this.timeline.length<=this.position)return}else this.lastPos=a;for(;this.position<this.timeline.length&&!(this.limiter>0&&this.runline.length>this.limiter)&&(this.validate(this.timeline[this.position])&&this.timeline[this.position].stime<=a);this.position++)this.sendComment(this.timeline[this.position])},CommentManager.prototype.rescale=function(){for(var a=0;a<this.runline.length;a++)this.runline[a].dur=Math.round(this.runline[a].dur*this.def.globalScale),this.runline[a].ttl=Math.round(this.runline[a].ttl*this.def.globalScale)},CommentManager.prototype.sendComment=function(a){if(8===a.mode)return console.log(a),void(this.scripting&&console.log(this.scripting.eval(a.code)));if(1===a.mode){c=a;for(var b=0;b<=this.pdivpool.length;){if(b==this.pdivpool.length&&(this.pdivpool[b]=-1e7),c.stime-c.width/this.stage.width*4e3*this.def.globalScale/3>=this.pdivpool[b]){for(c.totop=b*this.pdivheight;c.totop+c.height>this.stage.height;)c.totop-=this.stage.height;for(c.totop<0&&(c.totop=0),c.totop=Math.round(c.totop/this.pdivheight)*this.pdivheight,endtime=c.stime+c.width/this.stage.width*4e3*this.def.globalScale,k=0;k*this.pdivheight<c.height;)this.pdivpool[b+k]=endtime,k++;break}b++}return void this.runline.push(a)}var c=document.createElement("div");if(null==this.filter||(a=this.filter.doModify(a),null!=a)){if(c=this.initCmt(c,a),this.stage.appendChild(c),c.width=c.offsetWidth,c.height=c.offsetHeight,c.style.left=this.stage.width+"px",null!=this.filter&&!this.filter.beforeSend(c))return this.stage.removeChild(c),void(c=null);switch(c.mode){default:case 1:break;case 2:this.csa.scrollbtm.add(c);break;case 4:this.csa.bottom.add(c);break;case 5:this.csa.top.add(c);break;case 6:this.csa.reverse.add(c);break;case 17:case 7:if("relative"!==c.data.position?(c.style.top=c.data.y+"px",c.style.left=c.data.x+"px"):(c.style.top=c.data.y*this.stage.height+"px",c.style.left=c.data.x*this.stage.width+"px"),c.ttl=Math.round(a.duration*this.def.globalScale),c.dur=Math.round(a.duration*this.def.globalScale),0!==a.rY||0!==a.rZ){var d=function(a,b){for(var c=Math.PI/180,d=a*c,e=b*c,f=Math.cos,g=Math.sin,h=[f(d)*f(e),f(d)*g(e),g(d),0,-g(e),f(e),0,0,-g(d)*f(e),-g(d)*g(e),f(d),0,0,0,0,1],i=0;i<h.length;i++)Math.abs(h[i])<1e-6&&(h[i]=0);return"matrix3d("+h.join(",")+")"};c.style.transformOrigin="0% 0%",c.style.webkitTransformOrigin="0% 0%",c.style.OTransformOrigin="0% 0%",c.style.MozTransformOrigin="0% 0%",c.style.MSTransformOrigin="0% 0%",c.style.transform=d(a.rY,a.rZ),c.style.webkitTransform=d(a.rY,a.rZ),c.style.OTransform=d(a.rY,a.rZ),c.style.MozTransform=d(a.rY,a.rZ),c.style.MSTransform=d(a.rY,a.rZ)}}this.runline.push(c)}},CommentManager.prototype.finish=function(a){switch(a.mode){default:case 1:break;case 2:this.csa.scrollbtm.remove(a);break;case 4:this.csa.bottom.remove(a);break;case 5:this.csa.top.remove(a);break;case 6:this.csa.reverse.remove(a);break;case 7:}},CommentManager.prototype.onTimerEvent=function(a,b){for(var c=0;c<b.runline.length;c++){var d=b.runline[c];if(!d.hold){if(d.ttl-=a,1==d.mode||2==d.mode)d.left=d.ttl/d.dur*(b.stage.width+d.width)-d.width;else if(6==d.mode)d.style.left=(1-d.ttl/d.dur)*(b.stage.width+d.width)-d.width+"px";else if((4==d.mode||5==d.mode||d.mode>=7)&&(null==d.dur&&(d.dur=4e3),null!=d.data.alphaFrom&&null!=d.data.alphaTo&&(d.style.opacity=(d.data.alphaFrom-d.data.alphaTo)*(d.ttl/d.dur)+d.data.alphaTo),7==d.mode&&d.data.movable)){var e=Math.min(Math.max(d.dur-d.data.moveDelay-d.ttl,0),d.data.moveDuration)/d.data.moveDuration;"relative"!==d.data.position?(d.style.top=(d.data.toY-d.data.y)*e+d.data.y+"px",d.style.left=(d.data.toX-d.data.x)*e+d.data.x+"px"):(d.style.top=((d.data.toY-d.data.y)*e+d.data.y)*b.stage.height+"px",d.style.left=((d.data.toX-d.data.x)*e+d.data.x)*b.stage.width+"px")}null!=b.filter&&(d=b.filter.runtimeFilter(d)),d.ttl<=0&&(1!==d.mode&&b.stage.removeChild(d),b.runline.splice(c,1),b.finish(d))}}};