// ============================================
//  BRANDIFY – Subtle WebGL Fluid Background
//  Website teal/dark palette only
//  Bg itself flows — no loud separate effect
// ============================================

(function () {
  'use strict';

  const canvas = document.createElement('canvas');
  canvas.id = 'fluid-canvas';
  canvas.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    pointer-events: none;
    z-index: 0;
    opacity: 0.50;
  `;
  document.body.insertBefore(canvas, document.body.firstChild);

  // ── Config — all tuned for subtlety ──────
  const config = {
    SIM_RESOLUTION:      128,
    DYE_RESOLUTION:      512,       // lower = softer, less sharp
    DENSITY_DISSIPATION: 0.992,     // high = color stays long (slow fade)
    VELOCITY_DISSIPATION: 0.995,    // high = flow keeps moving smoothly
    PRESSURE_ITERATIONS: 15,
    CURL:                12,        // low = gentle swirl, no wild vortex
    SPLAT_RADIUS:        0.45,      // large = wide soft blobs
    SPLAT_FORCE:         1800,      // low = slow gentle movement
  };

  // ── Website brand colors ONLY ─────────────
  // Teal palette: #060f0f dark, #0E7C7C mid, #1AACAC light, #4DD4D4 bright
  // All very dark/muted so they blend into the bg
  const BRAND_COLORS = [
    { r: 0.035, g: 0.20,  b: 0.20  },  // #0E7C7C very dark
    { r: 0.020, g: 0.27,  b: 0.27  },  // #1AACAC dark
    { r: 0.025, g: 0.15,  b: 0.15  },  // deep teal
    { r: 0.018, g: 0.22,  b: 0.22  },  // mid teal
    { r: 0.040, g: 0.32,  b: 0.30  },  // #4DD4D4 dark muted
    { r: 0.015, g: 0.18,  b: 0.18  },  // very subtle teal
  ];
  let colorIdx = 0;

  function getColor() {
    const c = BRAND_COLORS[colorIdx % BRAND_COLORS.length];
    colorIdx++;
    // Small random variation to keep it organic
    return {
      r: c.r + (Math.random() - 0.5) * 0.008,
      g: c.g + (Math.random() - 0.5) * 0.03,
      b: c.b + (Math.random() - 0.5) * 0.03,
    };
  }

  // ── WebGL init ───────────────────────────
  const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
  let gl = canvas.getContext('webgl2', params);
  const isWebGL2 = !!gl;
  if (!gl) gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);
  if (!gl) { canvas.remove(); return; }

  let halfFloat, supportLinearFiltering;
  if (isWebGL2) {
    gl.getExtension('EXT_color_buffer_float');
    supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
  } else {
    halfFloat = gl.getExtension('OES_texture_half_float');
    supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
  }

  gl.clearColor(0.024, 0.059, 0.059, 1); // #060f0f base
  const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : (halfFloat ? halfFloat.HALF_FLOAT_OES : gl.UNSIGNED_BYTE);

  function getSupportedFormat(gl, internalFormat, format, type) {
    if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
      switch (internalFormat) {
        case gl.R16F:  return getSupportedFormat(gl, gl.RG16F,   gl.RG,   type);
        case gl.RG16F: return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
        default: return null;
      }
    }
    return { internalFormat, format };
  }

  function supportRenderTextureFormat(gl, internalFormat, format, type) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
  }

  let rgba, rg, r;
  if (isWebGL2) {
    rgba = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
    rg   = getSupportedFormat(gl, gl.RG16F,   gl.RG,   halfFloatTexType);
    r    = getSupportedFormat(gl, gl.R16F,    gl.RED,  halfFloatTexType);
  } else {
    rgba = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    rg   = rgba; r = rgba;
  }

  // ── Shaders ──────────────────────────────
  const baseVS = `
    precision highp float;
    attribute vec2 aPosition;
    varying vec2 vUv;
    varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
    uniform vec2 texelSize;
    void main(){
      vUv = aPosition*0.5+0.5;
      vL = vUv-vec2(texelSize.x,0.); vR = vUv+vec2(texelSize.x,0.);
      vT = vUv+vec2(0.,texelSize.y); vB = vUv-vec2(0.,texelSize.y);
      gl_Position = vec4(aPosition,0.,1.);
    }`;

  const copyFS = `
    precision mediump float;
    varying vec2 vUv; uniform sampler2D uTexture;
    void main(){ gl_FragColor = texture2D(uTexture,vUv); }`;

  const clearFS = `
    precision mediump float;
    varying vec2 vUv; uniform sampler2D uTexture; uniform float value;
    void main(){ gl_FragColor = value*texture2D(uTexture,vUv); }`;

  // Display: add dark base color so fluid merges into bg
  const displayFS = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uTexture;
    void main(){
      vec3 C = texture2D(uTexture, vUv).rgb;
      // Mix fluid onto dark teal base — bg feel
      vec3 base = vec3(0.024, 0.059, 0.059);
      vec3 col = base + C;
      float a = max(C.r, max(C.g, C.b)) * 2.0;
      gl_FragColor = vec4(col, clamp(a + 0.92, 0.0, 1.0));
    }`;

  const splatFS = `
    precision highp float;
    varying vec2 vUv; uniform sampler2D uTarget;
    uniform float aspectRatio; uniform vec3 color;
    uniform vec2 point; uniform float radius;
    void main(){
      vec2 p = vUv-point.xy; p.x*=aspectRatio;
      vec3 splat = exp(-dot(p,p)/radius)*color;
      vec3 base  = texture2D(uTarget,vUv).xyz;
      gl_FragColor = vec4(base+splat,1.);
    }`;

  const advectionFS = `
    precision highp float;
    varying vec2 vUv; uniform sampler2D uVelocity,uSource;
    uniform vec2 texelSize,dyeTexelSize; uniform float dt,dissipation;
    vec4 bilerp(sampler2D s,vec2 uv,vec2 ts){
      vec2 st=uv/ts-0.5; vec2 i=floor(st); vec2 f=fract(st);
      vec4 a=texture2D(s,(i+vec2(.5,.5))*ts); vec4 b=texture2D(s,(i+vec2(1.5,.5))*ts);
      vec4 c=texture2D(s,(i+vec2(.5,1.5))*ts); vec4 d=texture2D(s,(i+vec2(1.5,1.5))*ts);
      return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
    }
    void main(){
      vec2 coord=vUv-dt*bilerp(uVelocity,vUv,texelSize).xy*texelSize;
      gl_FragColor = bilerp(uSource,coord,dyeTexelSize)/(1.+dissipation*dt);
    }`;

  const divergenceFS = `
    precision mediump float;
    varying vec2 vUv,vL,vR,vT,vB; uniform sampler2D uVelocity;
    void main(){
      float L=texture2D(uVelocity,vL).x, R=texture2D(uVelocity,vR).x;
      float T=texture2D(uVelocity,vT).y, B=texture2D(uVelocity,vB).y;
      vec2 C=texture2D(uVelocity,vUv).xy;
      if(vL.x<0.) L=-C.x; if(vR.x>1.) R=-C.x;
      if(vT.y>1.) T=-C.y; if(vB.y<0.) B=-C.y;
      gl_FragColor = vec4(.5*(R-L+T-B),0.,0.,1.);
    }`;

  const curlFS = `
    precision mediump float;
    varying vec2 vUv,vL,vR,vT,vB; uniform sampler2D uVelocity;
    void main(){
      float L=texture2D(uVelocity,vL).y, R=texture2D(uVelocity,vR).y;
      float T=texture2D(uVelocity,vT).x, B=texture2D(uVelocity,vB).x;
      gl_FragColor = vec4(.5*(R-L-T+B),0.,0.,1.);
    }`;

  const vorticityFS = `
    precision highp float;
    varying vec2 vUv,vL,vR,vT,vB;
    uniform sampler2D uVelocity,uCurl; uniform float curl,dt;
    void main(){
      float L=texture2D(uCurl,vL).x, R=texture2D(uCurl,vR).x;
      float T=texture2D(uCurl,vT).x, B=texture2D(uCurl,vB).x;
      float C=texture2D(uCurl,vUv).x;
      vec2 force=.5*vec2(abs(T)-abs(B),abs(R)-abs(L));
      force/=length(force)+.0001; force*=curl*C; force.y*=-1.;
      gl_FragColor=vec4(texture2D(uVelocity,vUv).xy+force*dt,0.,1.);
    }`;

  const pressureFS = `
    precision mediump float;
    varying vec2 vUv,vL,vR,vT,vB;
    uniform sampler2D uPressure,uDivergence;
    void main(){
      float L=texture2D(uPressure,vL).x, R=texture2D(uPressure,vR).x;
      float T=texture2D(uPressure,vT).x, B=texture2D(uPressure,vB).x;
      float div=texture2D(uDivergence,vUv).x;
      gl_FragColor=vec4((L+R+B+T-div)*.25,0.,0.,1.);
    }`;

  const gradSubFS = `
    precision mediump float;
    varying vec2 vUv,vL,vR,vT,vB;
    uniform sampler2D uPressure,uVelocity;
    void main(){
      float L=texture2D(uPressure,vL).x, R=texture2D(uPressure,vR).x;
      float T=texture2D(uPressure,vT).x, B=texture2D(uPressure,vB).x;
      vec2 v=texture2D(uVelocity,vUv).xy-vec2(R-L,T-B);
      gl_FragColor=vec4(v,0.,1.);
    }`;

  // ── GL helpers ───────────────────────────
  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    return s;
  }

  class Program {
    constructor(vs, fs) {
      this.id = gl.createProgram();
      gl.attachShader(this.id, compile(gl.VERTEX_SHADER, vs));
      gl.attachShader(this.id, compile(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(this.id);
      const n = gl.getProgramParameter(this.id, gl.ACTIVE_UNIFORMS);
      this.u = {};
      for (let i = 0; i < n; i++) {
        const info = gl.getActiveUniform(this.id, i);
        this.u[info.name] = gl.getUniformLocation(this.id, info.name);
      }
    }
    use() { gl.useProgram(this.id); }
  }

  const pCopy    = new Program(baseVS, copyFS);
  const pClear   = new Program(baseVS, clearFS);
  const pDisplay = new Program(baseVS, displayFS);
  const pSplat   = new Program(baseVS, splatFS);
  const pAdv     = new Program(baseVS, advectionFS);
  const pDiv     = new Program(baseVS, divergenceFS);
  const pCurl    = new Program(baseVS, curlFS);
  const pVort    = new Program(baseVS, vorticityFS);
  const pPres    = new Program(baseVS, pressureFS);
  const pGrad    = new Program(baseVS, gradSubFS);

  // ── Quad ─────────────────────────────────
  const vb = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vb);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,-1,1,1,1,1,-1]), gl.STATIC_DRAW);
  const ib = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2,0,2,3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
  gl.enableVertexAttribArray(0);

  function blit(target) {
    if (!target) {
      gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER,null);
    } else {
      gl.viewport(0,0,target.width,target.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER,target.fbo);
    }
    gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0);
  }

  // ── FBOs ─────────────────────────────────
  function makeFBO(w,h,intf,fmt,type,filter){
    gl.activeTexture(gl.TEXTURE0);
    const tex=gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D,tex);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,filter);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,filter);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D,0,intf,w,h,0,fmt,type,null);
    const fbo=gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tex,0);
    gl.viewport(0,0,w,h); gl.clear(gl.COLOR_BUFFER_BIT);
    return {texture:tex,fbo,width:w,height:h,
      texelSizeX:1/w,texelSizeY:1/h,
      attach(id){gl.activeTexture(gl.TEXTURE0+id);gl.bindTexture(gl.TEXTURE_2D,tex);return id;}};
  }

  function makeDoubleFBO(w,h,intf,fmt,type,filter){
    let a=makeFBO(w,h,intf,fmt,type,filter);
    let b=makeFBO(w,h,intf,fmt,type,filter);
    return {
      width:w,height:h,texelSizeX:a.texelSizeX,texelSizeY:a.texelSizeY,
      get read(){return a;}, get write(){return b;},
      swap(){[a,b]=[b,a];}
    };
  }

  let velocity, dye, divergence, curl, pressure;

  function getRes(r){
    const ar=gl.drawingBufferWidth/gl.drawingBufferHeight;
    const ratio=ar<1?1/ar:ar;
    return gl.drawingBufferWidth>gl.drawingBufferHeight
      ?{width:Math.round(r*ratio),height:Math.round(r)}
      :{width:Math.round(r),height:Math.round(r*ratio)};
  }

  function initFBOs(){
    const sim=getRes(config.SIM_RESOLUTION);
    const dye_=getRes(config.DYE_RESOLUTION);
    const f=supportLinearFiltering?gl.LINEAR:gl.NEAREST;
    velocity  =makeDoubleFBO(sim.width,sim.height,rg.internalFormat,rg.format,halfFloatTexType,f);
    dye       =makeDoubleFBO(dye_.width,dye_.height,rgba.internalFormat,rgba.format,halfFloatTexType,f);
    divergence=makeFBO(sim.width,sim.height,r.internalFormat,r.format,halfFloatTexType,gl.NEAREST);
    curl      =makeFBO(sim.width,sim.height,r.internalFormat,r.format,halfFloatTexType,gl.NEAREST);
    pressure  =makeDoubleFBO(sim.width,sim.height,r.internalFormat,r.format,halfFloatTexType,gl.NEAREST);
  }

  function resize(){
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    initFBOs();
  }
  resize();
  window.addEventListener('resize',resize);

  // ── Splat ─────────────────────────────────
  function correctRadius(rad){
    const ar=canvas.width/canvas.height;
    return ar>1?rad*ar:rad;
  }
  function correctDelta(d){
    const ar=canvas.width/canvas.height;
    return ar<1?d*ar:d;
  }

  function splat(x,y,dx,dy,col){
    pSplat.use();
    gl.uniform1i(pSplat.u.uTarget,velocity.read.attach(0));
    gl.uniform1f(pSplat.u.aspectRatio,canvas.width/canvas.height);
    gl.uniform2f(pSplat.u.point,x/canvas.width,1-y/canvas.height);
    gl.uniform3f(pSplat.u.color,dx,-dy,0);
    gl.uniform1f(pSplat.u.radius,correctRadius(config.SPLAT_RADIUS/100));
    blit(velocity.write); velocity.swap();

    gl.uniform1i(pSplat.u.uTarget,dye.read.attach(0));
    gl.uniform3f(pSplat.u.color,col.r,col.g,col.b);
    blit(dye.write); dye.swap();
  }

  // ── Pointer tracking ──────────────────────
  let px=window.innerWidth/2, py=window.innerHeight/2;
  let ppx=px, ppy=py;
  let isMoving=false, moveTimer=null;

  window.addEventListener('mousemove',e=>{
    ppx=px; ppy=py;
    px=e.clientX; py=e.clientY;
    isMoving=true;
    clearTimeout(moveTimer);
    moveTimer=setTimeout(()=>{isMoving=false;},150);
  });

  window.addEventListener('touchmove',e=>{
    ppx=px; ppy=py;
    px=e.touches[0].clientX; py=e.touches[0].clientY;
    isMoving=true;
    clearTimeout(moveTimer);
    moveTimer=setTimeout(()=>{isMoving=false;},150);
  },{passive:true});

  // ── Simulation ───────────────────────────
  let lastT=Date.now();

  function step(dt){
    gl.disable(gl.BLEND);

    pCurl.use();
    gl.uniform2f(pCurl.u.texelSize,velocity.texelSizeX,velocity.texelSizeY);
    gl.uniform1i(pCurl.u.uVelocity,velocity.read.attach(0));
    blit(curl);

    pVort.use();
    gl.uniform2f(pVort.u.texelSize,velocity.texelSizeX,velocity.texelSizeY);
    gl.uniform1i(pVort.u.uVelocity,velocity.read.attach(0));
    gl.uniform1i(pVort.u.uCurl,curl.attach(1));
    gl.uniform1f(pVort.u.curl,config.CURL);
    gl.uniform1f(pVort.u.dt,dt);
    blit(velocity.write); velocity.swap();

    pDiv.use();
    gl.uniform2f(pDiv.u.texelSize,velocity.texelSizeX,velocity.texelSizeY);
    gl.uniform1i(pDiv.u.uVelocity,velocity.read.attach(0));
    blit(divergence);

    pClear.use();
    gl.uniform1i(pClear.u.uTexture,pressure.read.attach(0));
    gl.uniform1f(pClear.u.value,0.8);
    blit(pressure.write); pressure.swap();

    pPres.use();
    gl.uniform2f(pPres.u.texelSize,velocity.texelSizeX,velocity.texelSizeY);
    gl.uniform1i(pPres.u.uDivergence,divergence.attach(0));
    for(let i=0;i<config.PRESSURE_ITERATIONS;i++){
      gl.uniform1i(pPres.u.uPressure,pressure.read.attach(1));
      blit(pressure.write); pressure.swap();
    }

    pGrad.use();
    gl.uniform2f(pGrad.u.texelSize,velocity.texelSizeX,velocity.texelSizeY);
    gl.uniform1i(pGrad.u.uPressure,pressure.read.attach(0));
    gl.uniform1i(pGrad.u.uVelocity,velocity.read.attach(1));
    blit(velocity.write); velocity.swap();

    pAdv.use();
    gl.uniform2f(pAdv.u.texelSize,velocity.texelSizeX,velocity.texelSizeY);
    gl.uniform2f(pAdv.u.dyeTexelSize,velocity.texelSizeX,velocity.texelSizeY);
    gl.uniform1i(pAdv.u.uVelocity,velocity.read.attach(0));
    gl.uniform1i(pAdv.u.uSource,velocity.read.attach(0));
    gl.uniform1f(pAdv.u.dt,dt);
    gl.uniform1f(pAdv.u.dissipation,config.VELOCITY_DISSIPATION);
    blit(velocity.write); velocity.swap();

    gl.uniform2f(pAdv.u.dyeTexelSize,dye.texelSizeX,dye.texelSizeY);
    gl.uniform1i(pAdv.u.uVelocity,velocity.read.attach(0));
    gl.uniform1i(pAdv.u.uSource,dye.read.attach(1));
    gl.uniform1f(pAdv.u.dissipation,config.DENSITY_DISSIPATION);
    blit(dye.write); dye.swap();
  }

  function render(){
    gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
    pDisplay.use();
    gl.uniform1i(pDisplay.u.uTexture,dye.read.attach(0));
    blit(null);
  }

  // ── Idle ambient flow ─────────────────────
  // Slow gentle waves even without cursor movement
  let idleTime=0;
  let idlePhase=0;

  function idleFlow(dt){
    idleTime+=dt;
    if(idleTime<1.8) return; // every ~1.8s
    idleTime=0;
    idlePhase+=0.7;

    // Pick a soft position across the screen
    const x = canvas.width  * (0.3 + 0.4*Math.sin(idlePhase*0.5));
    const y = canvas.height * (0.3 + 0.4*Math.cos(idlePhase*0.4));
    const dx = Math.cos(idlePhase)*120;
    const dy = Math.sin(idlePhase)*80;
    const col = getColor();
    splat(x, y, dx, dy, col);
  }

  // ── Gentle startup fill ───────────────────
  function startupFill(){
    const pts=[
      [0.25,0.25],[0.75,0.25],[0.5,0.5],[0.25,0.75],[0.75,0.75]
    ];
    pts.forEach(([nx,ny],i)=>{
      setTimeout(()=>{
        const col=getColor();
        splat(
          canvas.width*nx, canvas.height*ny,
          (Math.random()-.5)*300,
          (Math.random()-.5)*200,
          col
        );
      }, i*300);
    });
  }
  setTimeout(startupFill,100);

  // ── RAF loop ─────────────────────────────
  function loop(){
    const now=Date.now();
    const dt=Math.min((now-lastT)/1000,0.016);
    lastT=now;

    // Cursor-driven splat
    if(isMoving){
      const dx=correctDelta((px-ppx)/canvas.width)*config.SPLAT_FORCE;
      const dy=correctDelta((py-ppy)/canvas.height)*config.SPLAT_FORCE;
      const mag=Math.sqrt(dx*dx+dy*dy);
      if(mag>0.5){ // only splat if meaningful movement
        const col=getColor();
        splat(px,py,dx,dy,col);
      }
    } else {
      idleFlow(dt);
    }

    step(dt);
    render();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

})();