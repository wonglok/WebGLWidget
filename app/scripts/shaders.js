(function($templateCache){   'use strict';

  $templateCache.put('scripts/shaders/cube.sampler.fs',
    "precision mediump float;varying vec2 vTextureCoord;uniform float uTimer;uniform int uSReady;uniform sampler2D uSampler;float rand(vec2 co){return fract(sin(dot(co,vec2(32.45884,64.23432))*74.582974)*49.9478593);}void main(void){vec4 textureColor=texture2D(uSampler,vec2(vTextureCoord.s,vTextureCoord.t));float randomVal=rand(vec2(sin(uTimer)*cos(uTimer)-vTextureCoord.s,sin(uTimer)*cos(uTimer)-vTextureCoord.t));vec4 randomColor=vec4(sin(uTimer*vTextureCoord.s),cos(uTimer*vTextureCoord.t),sin(uTimer*randomVal),1.0);if(uSReady==1){gl_FragColor=(1.24-textureColor)*randomColor;}else{gl_FragColor=randomColor;}}"
  );


  $templateCache.put('scripts/shaders/cube.sampler.vs',
    "attribute vec3 aVertexPosition;attribute vec2 aTextureCoord;uniform mat4 uMVMatrix;uniform mat4 uPMatrix;varying vec2 vTextureCoord;void main(void){gl_Position=uPMatrix*uMVMatrix*vec4(aVertexPosition,1.0);vTextureCoord=aTextureCoord;}"
  );


  $templateCache.put('scripts/shaders/fan.fs',
    "precision mediump float;uniform sampler2D uSampler;uniform vec3 uColor;uniform int tReady;varying vec2 vTextureCoord;void main(void){vec4 textureColor=texture2D(uSampler,vec2(vTextureCoord.s,vTextureCoord.t));if(tReady==1){gl_FragColor=textureColor*vec4(uColor,1.0);}else{gl_FragColor=vec4(uColor,1.0);}}"
  );


  $templateCache.put('scripts/shaders/fan.vs',
    "attribute vec3 aVertexPosition;attribute vec2 aTextureCoord;uniform mat4 uMVMatrix;uniform mat4 uPMatrix;varying vec2 vTextureCoord;void main(void){gl_Position=uPMatrix*uMVMatrix*vec4(aVertexPosition,1.0);vTextureCoord=aTextureCoord;}"
  );


  $templateCache.put('scripts/shaders/particle.show.fs',
    "precision mediump float;uniform sampler2D uSampler;uniform float uTimer;float opacity=0.25;float rand(vec2 co){return fract(sin(dot(co,vec2(32.45884,64.23432))*74.582974)*49.9478593);}void main(void){float sinTime=sin(uTimer/100.0);float cosTime=cos(uTimer/100.0);float tanTime=tan(uTimer/100.0);float randomNum=rand(vec2(sinTime,cosTime));float randomNum2=rand(vec2(cosTime,tanTime));float randomNum3=rand(vec2(tanTime,sinTime));vec3 rgb=vec3(randomNum,randomNum2,randomNum3);gl_FragColor=vec4(rgb,opacity);}"
  );


  $templateCache.put('scripts/shaders/particle.show.vs',
    "attribute vec3 aVertexPosition;uniform mat4 uMVMatrix;uniform mat4 uPMatrix;uniform sampler2D uSampler;void main(void){vec2 oldPos=aVertexPosition.xy+vec2(0.5/200.0,0.5/200.0);vec3 newPos=texture2D(uSampler,oldPos).xyz*200.0-100.0;gl_Position=uPMatrix*uMVMatrix*vec4(newPos,1.0);}"
  );


  $templateCache.put('scripts/shaders/particle.simulate.fs',
    "precision highp float;uniform sampler2D uSampler;varying vec2 vTextureCoord;uniform float uTimer;float rand(vec2 co){return fract(sin(dot(co.xy,vec2(59.454233,72.223432))*0.32457)*2342.0);}uniform int uMode;void main(){int mode;if(uMode!=0){mode=uMode;}else{mode=1;}float opacity=0.05;vec4 nextPos=vec4(opacity);vec4 lastPos=texture2D(uSampler,vTextureCoord);float rVal=rand(vec2(vTextureCoord.x,vTextureCoord.y));float sinTime=sin(uTimer/500.0);float cosTime=cos(uTimer/500.0);float tanTime=tan(uTimer/500.0);vec4 fSpace=vec4(sinTime*sin(uTimer*rVal+vTextureCoord.s),cosTime*cos(uTimer*rVal+vTextureCoord.t),cosTime*sinTime*tan(uTimer*rVal),opacity);if(mode==1){nextPos=fSpace;}else if(mode==2){vec4 fEdge=vec4(sinTime*sin(uTimer*vTextureCoord.s/1000.0),cosTime*cos(uTimer*vTextureCoord.t/1000.0),sinTime*sin(uTimer*1.0/rVal),opacity);nextPos=fSpace;nextPos+=fEdge;}else if(mode==3){nextPos=vec4(sinTime*sin(uTimer*rVal+vTextureCoord.s),cosTime*cos(uTimer*rVal+vTextureCoord.t),tanTime*sinTime*sin(uTimer*rVal),opacity);}else if(mode==4){vec4 sEdge=vec4(sinTime*sin(uTimer*rVal+vTextureCoord.s),cosTime*sin(uTimer*rVal+vTextureCoord.t),cosTime*sin(uTimer*rVal),opacity);nextPos=sEdge;}else if(mode==5){vec4 eSignal=vec4(tanTime*sin(uTimer*rVal*cosTime*vTextureCoord.s),tanTime*sin(uTimer*rVal*sinTime*vTextureCoord.t),tanTime*sin(uTimer*rVal*cosTime),opacity);nextPos=eSignal;}nextPos+=lastPos;gl_FragColor=nextPos;}"
  );


  $templateCache.put('scripts/shaders/particle.simulate.vs',
    "attribute vec2 aVertexPosition;attribute vec2 aTextureCoord;varying vec2 vTextureCoord;void main(){vTextureCoord=vec2(aTextureCoord.x,1.0-aTextureCoord.y);gl_Position=vec4(aVertexPosition,0.0,1.0);}"
  );


  $templateCache.put('scripts/shaders/post.blur.fs',
    "precision mediump float;uniform sampler2D uSampler;varying vec2 vTextureCoord;varying vec2 vK[6];void main(){vec4 _c=vec4(0.0);_c+=texture2D(uSampler,vK[2])*0.0044299121055113265;_c+=texture2D(uSampler,vK[0])*0.00895781211794;_c+=texture2D(uSampler,vK[2])*0.0215963866053;_c+=texture2D(uSampler,vK[4])*0.0443683338718;_c+=texture2D(uSampler,vK[0])*0.0776744219933;_c+=texture2D(uSampler,vK[2])*0.115876621105;_c+=texture2D(uSampler,vK[4])*0.147308056121;_c+=texture2D(uSampler,vTextureCoord)*0.159576912161;_c+=texture2D(uSampler,vK[5])*0.147308056121;_c+=texture2D(uSampler,vK[3])*0.115876621105;_c+=texture2D(uSampler,vK[1])*0.0776744219933;_c+=texture2D(uSampler,vK[5])*0.0443683338718;_c+=texture2D(uSampler,vK[3])*0.0215963866053;_c+=texture2D(uSampler,vK[1])*0.00895781211794;_c+=texture2D(uSampler,vK[3])*0.0044299121055113265;gl_FragColor=_c;}"
  );


  $templateCache.put('scripts/shaders/post.blur.vs',
    "attribute vec2 aVertexPosition;attribute vec2 aTextureCoord;uniform float uVibrate;varying vec2 vTextureCoord;varying vec2 vK[6];void main(){vec2 vTC=aTextureCoord;float cv=uVibrate;vTC=aTextureCoord;gl_Position=vec4(aVertexPosition,0.0,1.0);vK[0]=vTC+vec2(cv*-0.024,cv*-0.02);vK[1]=vTC+vec2(cv*-0.016,cv*-0.01);vK[2]=vTC+vec2(cv*-0.008,cv*-0.00);vK[3]=vTC+vec2(cv*0.004,cv*0.00);vK[4]=vTC+vec2(cv*0.012,cv*0.01);vK[5]=vTC+vec2(cv*0.020,cv*0.02);vTextureCoord=vTC;}"
  );


  $templateCache.put('scripts/shaders/post.normal.fs',
    "precision mediump float;uniform sampler2D uSampler;varying vec2 vTextureCoord;void main(){vec4 frameColor=texture2D(uSampler,vTextureCoord);gl_FragColor=frameColor;}"
  );


  $templateCache.put('scripts/shaders/post.normal.vs',
    "attribute vec2 aVertexPosition;attribute vec2 aTextureCoord;varying vec2 vTextureCoord;void main(){vTextureCoord=vec2(aTextureCoord.x,aTextureCoord.y);gl_Position=vec4(aVertexPosition,0.0,1.0);}"
  );
 }({ put: window._di.val }));