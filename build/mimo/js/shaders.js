/* MIMO VELOCITY — GLSL shader library (WebGL2 / GLSL ES 3.00)
   Programs:
     sky, pbr, road, car, building, depth, particles, lightpool,
     bloomBright, bloomDown, bloomUp, streak, ssr, motionBlur, composite, fxaa, copy, irradiance */
window.MIMO = window.MIMO || {};
(function (M) {
'use strict';
const SH = {};
M.shaders = SH;

// ============ shared chunks ============
const HEAD = `#version 300 es
precision highp float;
precision highp int;
`;

const NOISE = `
float hash11(float p){ p=fract(p*.1031); p*=p+33.33; p*=p+p; return fract(p); }
float hash12(vec2 p){ vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
vec2  hash22(vec2 p){ vec3 p3=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973)); p3+=dot(p3,p3.yzx+33.33); return fract((p3.xx+p3.yz)*p3.zy); }
float hash13(vec3 p3){ p3=fract(p3*.1031); p3+=dot(p3,p3.zyx+31.32); return fract((p3.x+p3.y)*p3.z); }
float vnoise(vec2 p){
  vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  float a=hash12(i), b=hash12(i+vec2(1,0)), c=hash12(i+vec2(0,1)), d=hash12(i+vec2(1,1));
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
}
float vnoise3(vec3 p){
  vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  float n000=hash13(i), n100=hash13(i+vec3(1,0,0)), n010=hash13(i+vec3(0,1,0)), n110=hash13(i+vec3(1,1,0));
  float n001=hash13(i+vec3(0,0,1)), n101=hash13(i+vec3(1,0,1)), n011=hash13(i+vec3(0,1,1)), n111=hash13(i+vec3(1,1,1));
  return mix(mix(mix(n000,n100,f.x),mix(n010,n110,f.x),f.y), mix(mix(n001,n101,f.x),mix(n011,n111,f.x),f.y), f.z);
}
float fbm(vec2 p){
  float v=0., a=.5;
  for(int i=0;i<5;i++){ v+=a*vnoise(p); p=p*2.03+vec2(19.7,7.3); a*=.5; }
  return v;
}
float fbm3(vec3 p){
  float v=0., a=.5;
  for(int i=0;i<4;i++){ v+=a*vnoise3(p); p=p*2.02+vec3(13.1,7.7,3.7); a*=.5; }
  return v;
}
`;

// ============ SKY ============
SH.skyVS = HEAD + `
layout(location=0) in vec2 aPosition;
out vec2 vUv;
void main(){ vUv = aPosition; gl_Position = vec4(aPosition,0.,1.); }
`;
SH.skyFS = HEAD + NOISE + `
in vec2 vUv;
layout(location=0) out vec4 oColor;
layout(location=1) out vec4 oData;
uniform mat4 uInvViewProj;
uniform vec3 uCamPos;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform float uTime;
uniform float uNight;      // 0 day..1 night
uniform int uFace;         // -1 screen, 0..5 cubemap face
uniform mat4 uFaceProj;    // for cubemap rendering

vec3 skyRadiance(vec3 rd){
  float h = rd.y;
  // dusk gradient: deep indigo zenith -> cyan horizon -> warm sun side
  vec3 zenith  = mix(vec3(.012,.03,.10), vec3(.004,.008,.03), uNight);
  vec3 horizon = mix(vec3(.18,.42,.75),  vec3(.05,.07,.16),  uNight);
  vec3 warm    = mix(vec3(1.0,.55,.25),  vec3(.30,.12,.14),  uNight);
  float t = pow(clamp(1.-max(h,0.),0.,1.), 3.2);
  vec3 col = mix(zenith, horizon, t);
  // warm glow around the sun near horizon
  float sunAmt = pow(max(dot(rd, uSunDir), 0.), 3.0);
  float horiz = pow(clamp(1.-abs(h)*1.6,0.,1.), 2.0);
  col = mix(col, warm, sunAmt*horiz*.55);
  // sun disc + glow
  float cd = dot(rd, uSunDir);
  float disc = smoothstep(.9992,.99965,cd);
  float glow = pow(max(cd,0.), 42.0)*.55 + pow(max(cd,0.), 8.0)*.16;
  col += uSunColor * (disc*26.0 + glow);
  // stars
  if(uNight > .25 && h > 0.){
    vec2 sp = rd.xz/(abs(rd.y)+.35)*8.;
    vec2 cell = floor(sp*14.);
    float star = step(.9965, hash12(cell));
    float tw = .6+.4*sin(uTime*3.+hash12(cell+7.)*30.);
    col += star*tw*uNight*smoothstep(0.,.25,h)*vec3(.8,.9,1.)*1.4;
  }
  // clouds
  if(h > .02){
    vec2 cuv = rd.xz/(h+.18);
    float d = fbm(cuv*.55 + vec2(uTime*.006, 0.));
    float d2 = fbm(cuv*1.4 - vec2(uTime*.012, 3.));
    float cov = smoothstep(.52,.86, d*.75+d2*.35) * smoothstep(.02,.16,h);
    float lit = .35+.65*pow(max(dot(rd,uSunDir),0.),2.);
    vec3 cloudCol = mix(vec3(.10,.13,.22), vec3(1.,.72,.5), lit*(1.-uNight));
    cloudCol = mix(cloudCol, vec3(.06,.07,.13), uNight);
    col = mix(col, cloudCol*(0.45+0.6*lit), cov*.9);
  }
  // ground haze below horizon
  col = mix(col, mix(vec3(.05,.06,.10), vec3(.01,.012,.02), uNight), smoothstep(.0,-.14,h));
  return col;
}
void main(){
  vec3 rd;
  if(uFace >= 0){
    // reconstruct direction for cube face
    vec2 uv = vUv; // -1..1
    vec3 dirs[6] = vec3[6](vec3(1,-uv.y,-uv.x), vec3(-1,-uv.y,uv.x), vec3(uv.x,1,uv.y), vec3(uv.x,-1,-uv.y), vec3(uv.x,-uv.y,1), vec3(-uv.x,-uv.y,-1));
    rd = normalize(dirs[uFace]);
  } else {
    vec4 p = uInvViewProj * vec4(vUv, 1., 1.);
    rd = normalize(p.xyz/p.w - uCamPos);
  }
  vec3 col = skyRadiance(rd);
  oColor = vec4(col, 1.0);
  oData  = vec4(0.,0.,1., 1.0); // roughness=1 => no SSR on sky
}
`;

// ============ PBR core ============
const PBR_CORE = `
const float PI = 3.14159265359;
float D_GGX(float NoH, float a){ float a2=a*a; float d=NoH*NoH*(a2-1.)+1.; return a2/(PI*d*d+1e-7); }
float G1(float NoX, float r){ float r2=r*r; return 2.0*NoX/(NoX + sqrt(r2 + (1.-r2)*NoX*NoX)); }
float G_Smith(float NoV, float NoL, float r){ return G1(NoV,r)*G1(NoL,r); }
vec3 specClamp(vec3 s){ return min(s, vec3(60.)); }
vec3 F_Schlick(float VoH, vec3 F0){ return F0 + (1.-F0)*pow(clamp(1.-VoH,0.,1.),5.); }
vec3 F_SchlickR(float VoH, vec3 F0, float r){ return F0 + (max(vec3(1.-r),F0)-F0)*pow(clamp(1.-VoH,0.,1.),5.); }
vec2 envBRDF(float NoV, float rough){
  vec4 c0=vec4(-1.,-.0275,-.572,.022), c1=vec4(1.,.0425,1.04,-.04);
  vec4 r=rough*c0+c1; float a004=min(r.x*r.x, exp2(-9.28*NoV))*r.x+r.y;
  return vec2(-1.04,1.04)*a004+r.zw;
}
vec3 irradianceSH(vec3 N, vec3 sky, vec3 gnd, vec3 sunCol, vec3 sunDir){
  float up = N.y*.5+.5;
  vec3 amb = mix(gnd, sky, up);
  float ndl = max(dot(N, sunDir),0.);
  return amb + sunCol*ndl*.18;
}
`;

// common scene uniforms — declared once, before any chunk that uses them
const SCENE_UNIFORMS = `
uniform vec3 uCamPos;
uniform vec3 uSunDir; uniform vec3 uSunColor;
uniform vec3 uAmbSky; uniform vec3 uAmbGround;
uniform mat4 uShadowMat0; uniform mat4 uShadowMat1;
uniform lowp sampler2DShadow uShadow0; uniform lowp sampler2DShadow uShadow1;
uniform vec2 uShadowTexel;
uniform float uCascadeDist;
uniform vec3 uFogColor; uniform float uFogDensity;
uniform samplerCube uEnv; uniform samplerCube uIrr; uniform float uEnvMaxMip;
uniform int uSpotCount;
uniform vec4 uSpotPos[6];   // xyz + range
uniform vec4 uSpotDir[6];   // xyz + cosOuter
uniform float uSpotIn[6];   // cosInner
uniform vec3 uSpotCol[6];
`;

const SHADOW_CORE = `
float shadowSample(lowp sampler2DShadow sm, vec4 sp, float bias){
  vec3 p = sp.xyz/sp.w * .5 + .5;
  if(p.x<0.||p.x>1.||p.y<0.||p.y>1.||p.z>1.) return 1.;
  float s=0.;
  for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
    s += texture(sm, vec3(p.xy + vec2(x,y)*uShadowTexel, p.z - bias));
  }
  return s/9.;
}
float getShadow(vec3 wp, float ndl){
  vec4 sp0 = uShadowMat0 * vec4(wp,1.);
  float bias = clamp(.0012*(1.-ndl)+.0004, .0004, .003);
  float d0 = shadowSample(uShadow0, sp0, bias);
  if(length(wp - uCamPos) > uCascadeDist*.92){
    vec4 sp1 = uShadowMat1 * vec4(wp,1.);
    return shadowSample(uShadow1, sp1, bias*1.6);
  }
  return d0;
}
`;

const FOG_CORE = `
vec3 applyFog(vec3 col, vec3 wp){
  float d = distance(wp, uCamPos);
  float f = 1.-exp(-d*uFogDensity);
  vec3 vd = normalize(wp-uCamPos);
  float sunAmt = pow(max(dot(vd,uSunDir),0.), 6.);
  vec3 fog = uFogColor + vec3(1.,.5,.25)*sunAmt*.35;
  return mix(col, fog, clamp(f,0.,1.));
}
`;

const SPOT_CORE = `
vec3 spotLight(vec3 wp, vec3 N){
  vec3 acc = vec3(0.);
  for(int i=0;i<6;i++){
    if(i>=uSpotCount) break;
    vec3 dv = uSpotPos[i].xyz - wp;
    float dist = length(dv);
    if(dist > uSpotPos[i].w) continue;
    vec3 L = dv/dist;
    float cosA = dot(L, uSpotDir[i].xyz);
    float cosOuter = uSpotDir[i].w;
    float cone = smoothstep(cosOuter, uSpotIn[i], cosA);
    if(cone<=0.) continue;
    float att = 1./(1.+dist*dist*.06) * (1.-dist/uSpotPos[i].w);
    float ndl = max(dot(N,L),0.);
    acc += uSpotCol[i]*cone*att*ndl;
  }
  return acc;
}
`;

// ============ PBR (props, kerbs, ground, generic) ============
SH.pbrVS = (inst) => HEAD + (inst ? `
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec2 aUv;
layout(location=3) in vec4 aColor;
layout(location=4) in vec4 aExtra;
layout(location=5) in vec4 aI0;
layout(location=6) in vec4 aI1;
layout(location=7) in vec4 aI2;
layout(location=8) in vec4 aI3;
layout(location=9) in vec4 aIExtra;
uniform mat4 uProj; uniform mat4 uView;
out vec3 vWorld; out vec3 vNormal; out vec2 vUv; out vec4 vColor; out vec4 vExtra; out vec4 vIExtra;
void main(){
  mat4 model = mat4(aI0,aI1,aI2,aI3);
  vec4 wp = model * vec4(aPosition,1.);
  vWorld = wp.xyz;
  vNormal = normalize(mat3(model) * aNormal);
  vUv = aUv; vColor = aColor; vExtra = aExtra; vIExtra = aIExtra;
  gl_Position = uProj * uView * wp;
}
` : `
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec2 aUv;
layout(location=3) in vec4 aColor;
layout(location=4) in vec4 aExtra;
uniform mat4 uProj; uniform mat4 uView; uniform mat4 uModel; uniform mat3 uNormalMat;
out vec3 vWorld; out vec3 vNormal; out vec2 vUv; out vec4 vColor; out vec4 vExtra; out vec4 vIExtra;
void main(){
  vec4 wp = uModel * vec4(aPosition,1.);
  vWorld = wp.xyz;
  vNormal = normalize(uNormalMat * aNormal);
  vUv = aUv; vColor = aColor; vExtra = aExtra; vIExtra = vec4(0.);
  gl_Position = uProj * uView * wp;
}
`);

SH.pbrFS = HEAD + NOISE + PBR_CORE + SCENE_UNIFORMS + SHADOW_CORE + FOG_CORE + SPOT_CORE + `
in vec3 vWorld; in vec3 vNormal; in vec2 vUv; in vec4 vColor; in vec4 vExtra; in vec4 vIExtra;
layout(location=0) out vec4 oColor;
layout(location=1) out vec4 oData;
uniform sampler2D uAlbedo; uniform sampler2D uNormalTex; uniform float uUseTex;
uniform float uMetal; uniform float uRough; uniform vec3 uTint;
uniform float uEmissive;
void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(uCamPos - vWorld);
  float rough = uRough, metal = uMetal;
  vec3 albedo = uTint * vColor.rgb;
  vec3 emis = vec3(0.);
  if(uUseTex > .5){
    vec4 t = texture(uAlbedo, vUv);
    albedo *= t.rgb;
    vec3 nt = texture(uNormalTex, vUv).xyz*2.-1.;
    if(length(nt) > .01){
      vec3 T = normalize(cross(N, abs(N.y)>.99? vec3(1,0,0):vec3(0,1,0)));
      vec3 B = cross(N,T);
      N = normalize(T*nt.x + B*nt.y + N*nt.z);
    }
  }
  float ao = clamp(vColor.a, 0., 1.);
  float NoV = max(dot(N,V),0.02);
  float NoL = max(dot(N,uSunDir),0.);
  vec3 F0 = mix(vec3(.04), albedo, metal);
  float shadow = NoL>0.001 ? getShadow(vWorld, NoL) : 1.;
  vec3 H = normalize(V+uSunDir);
  float NoH = max(dot(N,H),0.), VoH = max(dot(V,H),0.);
  float a = max(rough*rough, .002);
  vec3 F = F_Schlick(VoH, F0);
  vec3 spec = specClamp(D_GGX(NoH,a)*G_Smith(NoV,NoL,rough)*F / (4.*NoV*NoL+1e-4) * NoL);
  vec3 kD = (1.-F)*(1.-metal);
  vec3 direct = (kD*albedo/PI + spec) * uSunColor * shadow;
  vec3 R = reflect(-V,N);
  vec3 pre = textureLod(uEnv, R, rough*uEnvMaxMip).rgb;
  vec3 ir  = texture(uIrr, N).rgb;
  vec2 ab = envBRDF(NoV, rough);
  vec3 amb = (ir*albedo*(1.-metal) + pre*(F*ab.x + ab.y)) * ao;
  vec3 spots = spotLight(vWorld, N) * albedo;
  vec3 col = direct + amb + spots + emis + uEmissive*albedo;
  col = applyFog(col, vWorld);
  oColor = vec4(col, rough);
  oData = vec4(N*.5+.5, rough);
}
`;

// ============ ROAD ============
SH.roadVS = HEAD + `
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec2 aUv;       // x = meters along, y = meters across (-halfW..halfW)
layout(location=3) in vec4 aColor;    // a = lane type / ao
layout(location=4) in vec4 aExtra;    // x = curvature, y = surfaceType(0 road,1 kerb)
uniform mat4 uProj; uniform mat4 uView;
out vec3 vWorld; out vec3 vNormal; out vec2 vUv; out vec4 vColor; out vec4 vExtra;
void main(){
  vWorld = aPosition; vNormal = aNormal; vUv = aUv; vColor = aColor; vExtra = aExtra;
  gl_Position = uProj * uView * vec4(aPosition,1.);
}
`;
SH.roadFS = HEAD + NOISE + PBR_CORE + SCENE_UNIFORMS + SHADOW_CORE + FOG_CORE + SPOT_CORE + `
in vec3 vWorld; in vec3 vNormal; in vec2 vUv; in vec4 vColor; in vec4 vExtra;
layout(location=0) out vec4 oColor;
layout(location=1) out vec4 oData;
uniform sampler2D uAsphalt; uniform sampler2D uAsphaltN;
uniform float uHalfWidth;
uniform float uWetness;
uniform float uTime;
void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(uCamPos - vWorld);
  float halfW = uHalfWidth;
  float across = vUv.y;              // -halfW..halfW
  float along  = vUv.x;              // meters

  // ---- asphalt detail ----
  vec2 auv = vec2(along*.35, across*.35);
  vec4 asph = texture(uAsphalt, auv);
  vec4 asph2 = texture(uAsphalt, auv*3.7+11.3);
  vec3 albedo = mix(asph.rgb, asph2.rgb, .35);
  vec3 anrm = texture(uAsphaltN, auv).xyz*2.-1.;
  vec3 T = normalize(cross(N, vec3(0.,1.,0.) + vec3(.001)));
  vec3 B = cross(N,T);
  N = normalize(T*anrm.x*0.6 + B*anrm.y*0.6 + N);

  // ---- lane markings ----
  float w = abs(across);
  float edge = smoothstep(halfW-.9, halfW-.7, w) * smoothstep(halfW-.15, halfW-.3, w);
  float centerA = smoothstep(.16,.10, abs(across-.0)) * step(.5, fract(along*.12)); // dashed center
  float lineMask = clamp(edge + centerA, 0., 1.);
  float wear = .75 + .25*vnoise(vec2(along*2.1, across*4.));
  vec3 lineCol = vec3(.85,.87,.9) * wear;
  albedo = mix(albedo, lineCol, lineMask*.92);

  // ---- racing line darkening + rubber ----
  float racing = smoothstep(3.4, 1.2, w) * .35;
  albedo *= (1.-racing*.5);

  // ---- wetness / puddles ----
  float wetMap = fbm(vec2(along*.06, across*.16));
  float wet = clamp(uWetness * smoothstep(.35,.75, wetMap+.25), 0., 1.);
  float puddle = smoothstep(.72,.8, wetMap+uWetness*.3) * uWetness;
  vec3 wetTint = albedo * mix(1., .45, wet);
  albedo = mix(albedo, wetTint, wet);
  float rough = mix(.78, .22, wet);
  rough = mix(rough, .07, puddle);
  // flatten normal in puddles
  N = normalize(mix(N, vNormal, puddle*.9));
  N = normalize(mix(vNormal, N, .75));

  float NoV = max(dot(N,V),0.02);
  float NoL = max(dot(N,uSunDir),0.);
  vec3 F0 = vec3(.045);
  float shadow = NoL>0.001 ? getShadow(vWorld, NoL) : 1.;
  vec3 H = normalize(V+uSunDir);
  float NoH = max(dot(N,H),0.), VoH = max(dot(V,H),0.);
  float a = max(rough*rough,.002);
  vec3 F = F_Schlick(VoH, F0);
  vec3 spec = specClamp(D_GGX(NoH,a)*G_Smith(NoV,NoL,rough)*F/(4.*NoV*NoL+1e-4)*NoL);
  vec3 kD = (1.-F);
  vec3 direct = (kD*albedo/PI + spec)*uSunColor*shadow;

  vec3 R = reflect(-V,N);
  vec3 pre = textureLod(uEnv, R, rough*uEnvMaxMip).rgb;
  vec3 ir = texture(uIrr, N).rgb;
  vec2 ab = envBRDF(NoV, rough);
  vec3 amb = ir*albedo + pre*(F*ab.x+ab.y);
  // wet surfaces reflect more environment
  amb *= (1.+wet*.6);

  vec3 spots = spotLight(vWorld, N) * albedo * (1.2);
  // headlight specular streak on wet road
  vec3 spotSpec = vec3(0.);
  for(int i=0;i<uSpotCount;i++){
    vec3 L = normalize(uSpotPos[i].xyz - vWorld);
    vec3 Hs = normalize(V+L);
    float sh = pow(max(dot(N,Hs),0.), mix(60., 400., wet)) * (0.3+wet*1.7);
    spotSpec += uSpotCol[i]*sh;
  }
  vec3 col = direct + amb + spots + spotSpec;
  col = applyFog(col, vWorld);
  oColor = vec4(col, rough);
  oData = vec4(N*.5+.5, rough);
}
`;

// ============ CAR ============
SH.carVS = HEAD + `
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec2 aUv;
layout(location=3) in vec4 aColor;   // rgb = paint, a = material id
layout(location=4) in vec4 aExtra;  // x = emissive boost slot
uniform mat4 uProj; uniform mat4 uView; uniform mat4 uModel; uniform mat3 uNormalMat;
out vec3 vWorld; out vec3 vNormal; out vec2 vUv; out vec4 vColor; out vec4 vExtra;
out vec3 vTangent;
void main(){
  vec4 wp = uModel * vec4(aPosition,1.);
  vWorld = wp.xyz;
  vNormal = normalize(uNormalMat * aNormal);
  vUv = aUv; vColor = aColor; vExtra = aExtra;
  vTangent = normalize(mat3(uNormalMat) * vec3(1.,0.,0.));
  gl_Position = uProj * uView * wp;
}
`;
SH.carFS = HEAD + NOISE + PBR_CORE + SCENE_UNIFORMS + SHADOW_CORE + FOG_CORE + SPOT_CORE + `
in vec3 vWorld; in vec3 vNormal; in vec2 vUv; in vec4 vColor; in vec4 vExtra; in vec3 vTangent;
layout(location=0) out vec4 oColor;
layout(location=1) out vec4 oData;
uniform float uBrake;       // 0..1 brake light intensity
uniform float uHeadlights;  // 0..1
uniform float uFlake;       // paint flake amount
uniform float uTime;
uniform vec3 uPaint;        // per-car paint color override (material 0)
void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(uCamPos - vWorld);
  float mid = vColor.a;
  float rough = .4, metal = 0.;
  vec3 albedo = vColor.rgb;
  vec3 emis = vec3(0.);
  float ao = 1.;

  if(mid < .5){ // ---- paint: clearcoat metallic ----
    albedo = uPaint;
    rough = .30; metal = .88;
    // flake sparkle
    vec3 wp = vWorld*46.;
    float fl = vnoise3(floor(wp) + floor(N*3.));
    float spark = smoothstep(.95,.995, fl) * uFlake;
    emis += spark * .14 * uSunColor * max(dot(N,uSunDir),0.);
    ao = .96;
  } else if(mid < 1.5){ // ---- glass ----
    albedo = vColor.rgb; rough = .13; metal = .0;
  } else if(mid < 2.5){ // ---- matte trim ----
    rough = .62; metal = .15;
  } else if(mid < 3.5){ // ---- tire ----
    rough = .92; metal = 0.;
    float t = vnoise(vUv*vec2(30.,8.));
    albedo *= (.8+.35*t);
  } else if(mid < 4.5){ // ---- rim ----
    rough = .22; metal = 1.;
  } else if(mid < 5.5){ // ---- headlight lens ----
    rough = .10; metal = .1;
    emis += vec3(.75,.85,1.) * uHeadlights * 2.0;
    emis += vec3(.25,.3,.4) * .3;
  } else if(mid < 6.5){ // ---- taillight ----
    rough = .12; metal = .1;
    float stripe = .6+.4*sin(vUv.x*40.);
    emis += vec3(1.,.05,.07) * (0.25 + uBrake*3.4) * stripe;
  } else { // ---- misc emissive (nitro etc) ----
    rough = .3; emis += vColor.rgb*2.4;
  }

  float NoV = max(dot(N,V),0.02);
  float NoL = max(dot(N,uSunDir),0.);
  vec3 F0 = mix(vec3(.04), albedo, metal);
  float shadow = NoL>0.001 ? getShadow(vWorld, NoL) : 1.;
  vec3 H = normalize(V+uSunDir);
  float NoH = max(dot(N,H),0.), VoH = max(dot(V,H),0.);
  float a = max(rough*rough,.002);
  vec3 F = F_Schlick(VoH, F0);
  vec3 spec = specClamp(D_GGX(NoH,a)*G_Smith(NoV,NoL,rough)*F/(4.*NoV*NoL+1e-4)*NoL);
  vec3 kD = (1.-F)*(1.-metal);
  vec3 direct = (kD*albedo/PI + spec)*uSunColor*shadow;

  vec3 R = reflect(-V,N);
  vec3 pre = textureLod(uEnv, R, rough*uEnvMaxMip).rgb;
  vec3 ir = texture(uIrr, N).rgb;
  vec2 ab = envBRDF(NoV, rough);
  vec3 ambient = ir*albedo*(1.-metal) + pre*(F*ab.x+ab.y);
  ambient *= ao;
  if (mid > .5 && mid < 1.5) ambient *= .5;   // tinted glass: dampen env

  // clearcoat layer (paint only)
  if(mid < .5){
    float ccR = .045;
    float aC = max(ccR*ccR,.002);
    vec3 Fc = F_Schlick(VoH, vec3(.04));
    float cc = D_GGX(NoH,aC)*G_Smith(NoV,NoL,ccR);
    vec3 clear = specClamp(Fc * cc / (4.*NoV*NoL+1e-4)) * uSunColor * shadow + Fc*.05*uSunColor*shadow;
    vec3 preC = textureLod(uEnv, R, ccR*uEnvMaxMip).rgb;
    ambient += (preC*F_Schlick(NoV, vec3(.04))*.35);
    direct += clear;
  }
  vec3 spots = spotLight(vWorld, N) * albedo;
  vec3 col = direct + ambient + spots + emis;
  col = applyFog(col, vWorld);
  oColor = vec4(col, rough);
  oData = vec4(N*.5+.5, rough);
}
`;

// ============ BUILDINGS (instanced) ============
SH.buildingVS = HEAD + `
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec2 aUv;
layout(location=5) in vec4 aI0;
layout(location=6) in vec4 aI1;
layout(location=7) in vec4 aI2;
layout(location=8) in vec4 aI3;
layout(location=9) in vec4 aIExtra; // x=seed, y=neonFlag, z=windowDensity, w=height
uniform mat4 uProj; uniform mat4 uView;
out vec3 vWorld; out vec3 vNormal; out vec3 vLocal; out vec4 vIExtra; out vec3 vScale;
void main(){
  mat4 model = mat4(aI0,aI1,aI2,aI3);
  vec4 wp = model * vec4(aPosition,1.);
  vWorld = wp.xyz;
  vNormal = normalize(mat3(model) * aNormal);
  vLocal = aPosition;
  vIExtra = aIExtra;
  vScale = vec3(length(aI0.xyz), length(aI1.xyz), length(aI2.xyz));
  gl_Position = uProj * uView * wp;
}
`;
SH.buildingFS = HEAD + NOISE + PBR_CORE + SCENE_UNIFORMS + SHADOW_CORE + FOG_CORE + `
in vec3 vWorld; in vec3 vNormal; in vec3 vLocal; in vec4 vIExtra; in vec3 vScale;
layout(location=0) out vec4 oColor;
layout(location=1) out vec4 oData;
uniform float uTime;
const vec3 NEON[5] = vec3[5](vec3(.1,.9,1.), vec3(1.,.15,.5), vec3(.6,.3,1.), vec3(1.,.7,.1), vec3(.1,1.,.5));
void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(uCamPos - vWorld);
  float seed = vIExtra.x;
  vec3 albedo = vec3(.05,.055,.07) * (.6+.8*hash11(seed*13.1));
  float rough = .78, metal = .1;
  vec3 emis = vec3(0.);
  bool isRoof = abs(N.y) > .6;

  if(!isRoof){
    // window grid in world space
    vec2 wuv;
    if(abs(N.x) > abs(N.z)) wuv = vec2(vWorld.z, vWorld.y);
    else                     wuv = vec2(vWorld.x, vWorld.y);
    vec2 cell = floor(wuv / vec2(3.0, 3.4));
    vec2 f = fract(wuv / vec2(3.0, 3.4));
    float win = step(.18,f.x)*step(f.x,.86)*step(.3,f.y)*step(f.y,.86);
    float r = hash12(cell + seed*17.3);
    float lit = step(1.-vIExtra.z, r);
    float flick = .85+.15*sin(uTime*(1.+r*3.)+r*40.);
    vec3 winCol = mix(vec3(1.,.78,.45), vec3(.6,.8,1.), step(.5,hash12(cell+seed*7.7)));
    if(hash12(cell+seed*3.1) > .93) winCol = NEON[int(hash12(cell+seed*5.5)*4.99)];
    emis += win * lit * winCol * flick * (0.75 + 1.05 * hash12(cell+seed*9.1));
    albedo = mix(albedo, vec3(.02,.025,.04), win*.9);
    rough = mix(.8, .15, win);
    metal = mix(.1, .6, win);
    // neon strip
    if(vIExtra.y > .5){
      float strip = smoothstep(.06,.0, abs(fract(vWorld.y*0.25+seed)-.5)-.44);
      vec3 nc = NEON[int(hash11(seed*3.3)*4.99)];
      emis += nc * strip * 3.2;
    }
    // storefront glow at base
    float base = smoothstep(6., 1.5, vWorld.y);
    emis += vec3(1.,.7,.4)*base*.35*step(.4,hash11(seed*5.));
  } else {
    // roof: vents
    float v = step(.7, vnoise(vWorld.xz*.5+seed));
    albedo = mix(albedo, vec3(.12,.13,.15), v*.5);
  }

  float NoV = max(dot(N,V),0.02);
  float NoL = max(dot(N,uSunDir),0.);
  vec3 F0 = mix(vec3(.04), albedo, metal);
  float shadow = NoL>0.001 ? getShadow(vWorld, NoL) : 1.;
  vec3 H = normalize(V+uSunDir);
  float NoH = max(dot(N,H),0.), VoH = max(dot(V,H),0.);
  float a = max(rough*rough,.002);
  vec3 F = F_Schlick(VoH, F0);
  vec3 spec = specClamp(D_GGX(NoH,a)*G_Smith(NoV,NoL,rough)*F/(4.*NoV*NoL+1e-4)*NoL);
  vec3 kD = (1.-F)*(1.-metal);
  vec3 direct = (kD*albedo/PI + spec)*uSunColor*shadow;
  vec3 R = reflect(-V,N);
  vec3 pre = textureLod(uEnv, R, rough*uEnvMaxMip).rgb;
  vec3 ir = texture(uIrr, N).rgb;
  vec2 ab = envBRDF(NoV, rough);
  vec3 ambient = ir*albedo*(1.-metal) + pre*(F*ab.x+ab.y);
  vec3 col = direct + ambient + emis;
  col = applyFog(col, vWorld);
  oColor = vec4(col, rough);
  oData = vec4(N*.5+.5, rough);
}
`;

// ============ DEPTH (shadow pass) ============
SH.depthVS = (inst) => HEAD + (inst ? `
layout(location=0) in vec3 aPosition;
layout(location=5) in vec4 aI0; layout(location=6) in vec4 aI1; layout(location=7) in vec4 aI2; layout(location=8) in vec4 aI3;
uniform mat4 uLightVP;
void main(){ mat4 m = mat4(aI0,aI1,aI2,aI3); gl_Position = uLightVP * m * vec4(aPosition,1.); }
` : `
layout(location=0) in vec3 aPosition;
uniform mat4 uLightVP; uniform mat4 uModel;
void main(){ gl_Position = uLightVP * uModel * vec4(aPosition,1.); }
`);
SH.depthFS = HEAD + `
out vec4 o;
void main(){ o = vec4(1.); }
`;

// ============ PARTICLES ============
SH.particleVS = HEAD + `
layout(location=0) in vec2 aPosition;      // quad corner (-1..1)
layout(location=5) in vec4 aI0;            // xyz = center, w = size
layout(location=6) in vec4 aI1;            // x = rotation, y = alpha, zw = uv scroll
layout(location=7) in vec4 aI2;            // rgba = color
layout(location=8) in vec4 aI3;            // x = stretch along vel, y = framesel, z = softness
uniform mat4 uProj; uniform mat4 uView; uniform vec2 uTileScale;
out vec2 vUv; out vec4 vColor; out vec4 vMisc; out float vViewZ;
void main(){
  float rot = aI1.x;
  float c = cos(rot), s = sin(rot);
  vec2 p = vec2(aPosition.x*c - aPosition.y*s, aPosition.x*s + aPosition.y*c);
  p.x *= (1. + aI3.x);
  vec4 vp = uView * vec4(aI0.xyz,1.);
  vp.xy += p * aI0.w;
  vUv = (aPosition*.5+.5)*uTileScale + aI1.zw;
  vColor = vec4(aI2.rgb, aI1.y);
  vMisc = vec4(aI3.y, aI3.z, 0., 0.);
  vViewZ = -vp.z;
  gl_Position = uProj * vp;
}
`;
SH.particleFS = HEAD + NOISE + `
in vec2 vUv; in vec4 vColor; in vec4 vMisc; in float vViewZ;
layout(location=0) out vec4 oColor;
layout(location=1) out vec4 oData;
uniform sampler2D uSprite;
uniform sampler2D uSceneDepth;
uniform vec2 uResolution;
uniform float uNear; uniform float uFar;
void main(){
  vec4 sprite = texture(uSprite, vUv);
  float alpha = sprite.a * vColor.a;
  if(alpha < .004) discard;
  // soft particles: fade against scene geometry
  float sceneD = texture(uSceneDepth, gl_FragCoord.xy/uResolution).x;
  float z = sceneD*2.-1.;
  float linScene = (2.*uNear*uFar)/(uFar+uNear - z*(uFar-uNear));
  float fade = clamp((linScene - vViewZ)/.6, 0., 1.);
  alpha *= mix(fade, 1., step(vMisc.y, .001));
  vec3 col = vColor.rgb * (sprite.rgb*.55+.45);
  oColor = vec4(col*alpha, alpha);        // premultiplied
  oData = vec4(0.,0.,1.,1.);
}
`;

// ============ LIGHT POOL (ground decals under lamps) ============
SH.poolVS = HEAD + `
layout(location=0) in vec3 aPosition;
layout(location=2) in vec2 aUv;
layout(location=3) in vec4 aColor;
uniform mat4 uProj; uniform mat4 uView;
out vec2 vUv; out vec3 vWorld; out vec4 vColor;
void main(){ vUv = aUv; vWorld = aPosition; vColor = aColor; gl_Position = uProj*uView*vec4(aPosition,1.); }
`;
SH.poolFS = HEAD + `
in vec2 vUv; in vec3 vWorld; in vec4 vColor;
layout(location=0) out vec4 oColor;
layout(location=1) out vec4 oData;
uniform float uIntensity;
void main(){
  float d = length(vUv-.5)*2.;
  float a = pow(max(1.-d,0.), 2.4) * uIntensity;
  oColor = vec4(vColor.rgb*a, a);
  oData = vec4(0.,0.,1.,1.);
}
`;

// ============ POST ============
const POST_QUAD_VS = HEAD + `
layout(location=0) in vec2 aPosition;
out vec2 vUv;
void main(){ vUv = aPosition*.5+.5; gl_Position = vec4(aPosition,0.,1.); }
`;
SH.postVS = POST_QUAD_VS;

SH.bloomBrightFS = HEAD + `
in vec2 vUv; out vec4 o;
uniform sampler2D uTex; uniform float uThreshold; uniform float uKnee;
void main(){
  vec3 c = texture(uTex, vUv).rgb;
  float br = max(c.r, max(c.g, c.b));
  float soft = clamp(br - uThreshold + uKnee, 0., 2.*uKnee);
  soft = soft*soft/(4.*uKnee+1e-4);
  float w = max(soft, br - uThreshold)/max(br,1e-4);
  o = vec4(c*w, 1.);
}
`;
SH.bloomDownFS = HEAD + `
in vec2 vUv; out vec4 o;
uniform sampler2D uTex; uniform vec2 uTexel;
void main(){
  vec2 t = uTexel;
  vec3 a = texture(uTex, vUv + t*vec2(-2., 2.)).rgb;
  vec3 b = texture(uTex, vUv + t*vec2( 0., 2.)).rgb;
  vec3 c = texture(uTex, vUv + t*vec2( 2., 2.)).rgb;
  vec3 d = texture(uTex, vUv + t*vec2(-1., 1.)).rgb;
  vec3 e = texture(uTex, vUv).rgb;
  vec3 f = texture(uTex, vUv + t*vec2( 1., 1.)).rgb;
  vec3 g = texture(uTex, vUv + t*vec2(-2., 0.)).rgb;
  vec3 h = texture(uTex, vUv + t*vec2( 2., 0.)).rgb;
  vec3 i = texture(uTex, vUv + t*vec2(-2.,-1.)).rgb;
  vec3 j = texture(uTex, vUv + t*vec2( 0.,-1.)).rgb;
  vec3 k = texture(uTex, vUv + t*vec2( 2.,-1.)).rgb;
  vec3 l = texture(uTex, vUv + t*vec2(-1.,-2.)).rgb;
  vec3 m = texture(uTex, vUv + t*vec2( 1.,-2.)).rgb;
  vec3 r = e*.125 + (a+c+g+h+l+m)*.03125 + (b+d+f+j)*.0625 + (i+k)*.03125;
  o = vec4(r,1.);
}
`;
SH.bloomUpFS = HEAD + `
in vec2 vUv; out vec4 o;
uniform sampler2D uTex; uniform vec2 uTexel; uniform float uRadius;
void main(){
  vec2 t = uTexel*uRadius;
  vec3 s = texture(uTex, vUv + t*vec2(-1., 1.)).rgb
         + texture(uTex, vUv + t*vec2( 0., 1.)).rgb*2.
         + texture(uTex, vUv + t*vec2( 1., 1.)).rgb
         + texture(uTex, vUv + t*vec2(-1., 0.)).rgb*2.
         + texture(uTex, vUv).rgb*4.
         + texture(uTex, vUv + t*vec2( 1., 0.)).rgb*2.
         + texture(uTex, vUv + t*vec2(-1.,-1.)).rgb
         + texture(uTex, vUv + t*vec2( 0.,-1.)).rgb*2.
         + texture(uTex, vUv + t*vec2( 1.,-1.)).rgb;
  o = vec4(s/16., 1.);
}
`;
SH.streakFS = HEAD + `
in vec2 vUv; out vec4 o;
uniform sampler2D uTex; uniform vec2 uDir; uniform float uAtt;
void main(){
  vec3 s = vec3(0.); float wsum = 0.;
  for(int i=-6;i<=6;i++){
    float w = 1.-abs(float(i))/7.;
    w *= w;
    s += texture(uTex, vUv + uDir*float(i)).rgb * w;
    wsum += w;
  }
  o = vec4(s/wsum*uAtt, 1.);
}
`;

SH.ssrFS = HEAD + NOISE + `
in vec2 vUv;
out vec4 o;
uniform sampler2D uScene;
uniform sampler2D uDepth;
uniform sampler2D uNormalRough;
uniform mat4 uInvProj; uniform mat4 uProj; uniform mat4 uView;
uniform vec2 uResolution; uniform float uNear; uniform float uFar;
uniform vec3 uCamPos; uniform float uIntensity;
vec3 viewPos(vec2 uv, float depth){
  vec4 c = vec4(uv*2.-1., depth*2.-1., 1.);
  vec4 v = uInvProj*c;
  return v.xyz/v.w;
}
void main(){
  float depth = texture(uDepth, vUv).x;
  if(depth >= .9999){ o = vec4(0.); return; }
  vec4 nr = texture(uNormalRough, vUv);
  float rough = nr.a;
  if(rough > .34){ o = vec4(0.); return; }
  vec3 N = normalize(nr.xyz*2.-1.);
  vec3 P = viewPos(vUv, depth);
  vec3 V = normalize(P);
  vec3 R = normalize(reflect(V, N));
  if(R.z > 0. && P.z > -0.1){ o = vec4(0.); return; } // don't march toward camera behind
  // ray march in view space
  float maxDist = 42.;
  float stepLen = maxDist/24.;
  vec3 hitP = P;
  bool hit = false;
  float t = stepLen * (.5 + hash12(gl_FragCoord.xy)*.9);
  for(int i=0;i<24;i++){
    vec3 sp = P + R*t;
    vec4 cp = uProj * vec4(sp,1.);
    vec2 suv = cp.xy/cp.w*.5+.5;
    if(suv.x<0.||suv.x>1.||suv.y<0.||suv.y>1.) break;
    float sd = texture(uDepth, suv).x;
    if(sd >= .9999){ t += stepLen; continue; }
    vec3 sceneP = viewPos(suv, sd);
    float diff = sceneP.z - sp.z;   // view z negative in front
    if(diff > 0. && diff < stepLen*2.5){
      // binary refine
      vec3 lo = P + R*(t-stepLen), hi = sp;
      for(int k=0;k<4;k++){
        vec3 mid = (lo+hi)*.5;
        vec4 cm = uProj*vec4(mid,1.);
        vec2 muv = cm.xy/cm.w*.5+.5;
        float md = texture(uDepth, muv).x;
        vec3 mp = viewPos(muv, md);
        if(mp.z - mid.z > 0.) hi = mid; else lo = mid;
      }
      hitP = hi; hit = true; break;
    }
    t += stepLen;
    if(t > maxDist) break;
  }
  if(!hit){ o = vec4(0.); return; }
  vec4 hp = uProj*vec4(hitP,1.);
  vec2 huv = hp.xy/hp.w*.5+.5;
  vec3 col = texture(uScene, huv).rgb;
  // fade by distance + screen edge + roughness
  float distFade = 1.-clamp(length(hitP-P)/maxDist, 0., 1.);
  float edge = smoothstep(0., .18, min(min(huv.x,1.-huv.x), min(huv.y,1.-huv.y)));
  float rfade = 1.-smoothstep(.12, .34, rough);
  float NoV = max(dot(normalize(nr.xyz*2.-1.), -V), 0.);
  float fres = .25 + .75*pow(1.-NoV, 3.);
  o = vec4(col * distFade * edge * rfade * uIntensity * fres, 1.);
}
`;

SH.motionBlurFS = HEAD + `
in vec2 vUv; out vec4 o;
uniform sampler2D uTex;
uniform vec2 uCenter;
uniform float uStrength;
void main(){
  vec2 dir = (vUv - uCenter) * uStrength;
  vec3 acc = vec3(0.);
  const int N = 10;
  float jit = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233)))*43758.5453);
  for(int i=0;i<N;i++){
    float t = (float(i)+jit)/float(N) - .5;
    acc += texture(uTex, vUv + dir*t).rgb;
  }
  o = vec4(acc/float(N), 1.);
}
`;

SH.copyFS = HEAD + `
in vec2 vUv; out vec4 o; uniform sampler2D uTex;
void main(){ o = texture(uTex, vUv); }
`;

SH.compositeFS = HEAD + NOISE + `
in vec2 vUv; out vec4 o;
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform sampler2D uStreak;
uniform vec2 uResolution;
uniform float uTime;
uniform float uBloomIntensity;
uniform float uExposure;
uniform float uSpeed;        // 0..1 normalized speed effect
uniform float uNitro;        // 0..1 nitro effect
uniform float uVignette;
uniform float uGrain;
uniform float uAberration;
uniform vec3 uGradeLift; uniform vec3 uGradeGain; uniform float uSaturation;

vec3 aces(vec3 x){
  const float a=2.51, b=.03, c=2.43, d=.59, e=.14;
  return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0., 1.);
}
vec3 toSRGB(vec3 c){ return pow(c, vec3(1./2.2)); }
float luma(vec3 c){ return dot(c, vec3(.2126,.7152,.0722)); }

void main(){
  vec2 uv = vUv;
  vec2 cen = uv - .5;
  float r2 = dot(cen,cen);

  // chromatic aberration (radial, speed-scaled)
  float ab = (uAberration + uSpeed*.006 + uNitro*.012) * r2;
  vec3 col;
  col.r = texture(uScene, uv + cen*ab).r;
  col.g = texture(uScene, uv).g;
  col.b = texture(uScene, uv - cen*ab).b;

  col += texture(uBloom, uv).rgb * uBloomIntensity;
  col += texture(uStreak, uv).rgb * uBloomIntensity * .7;

  // exposure + tonemap
  col *= uExposure;
  col = aces(col);

  // grade
  col = col*uGradeGain + uGradeLift;
  float l = luma(col);
  col = mix(vec3(l), col, uSaturation);
  // subtle split-tone: cool shadows, warm highlights
  col += (0.5-l)*vec3(-.012,.004,.02);

  // speed lines (radial streaks during nitro)
  if(uNitro > .003 || uSpeed > .55){
    float ang = atan(cen.y, cen.x);
    float n = vnoise(vec2(ang*9., r2*4. - uTime*7.));
    float streaks = smoothstep(.82,.99,n) * smoothstep(.05,.45,r2);
    float amt = uNitro*.8 + max(uSpeed-.55,0.)*.3;
    col += vec3(.35,.7,1.) * streaks * amt * .22;
  }

  // vignette
  float vig = 1. - uVignette*smoothstep(.18,.85,r2*1.6);
  col *= vig;

  // grain
  if(uGrain > 0.){
    float g = hash12(gl_FragCoord.xy + fract(uTime)*371.)-.5;
    col += g*uGrain;
  }
  o = vec4(toSRGB(col), 1.);
}
`;

SH.fxaaFS = HEAD + `
in vec2 vUv; out vec4 o;
uniform sampler2D uTex; uniform vec2 uTexel;
float luma(vec3 c){ return dot(c, vec3(.299,.587,.114)); }
void main(){
  vec3 rgbNW = texture(uTex, vUv + vec2(-1.,-1.)*uTexel).rgb;
  vec3 rgbNE = texture(uTex, vUv + vec2( 1.,-1.)*uTexel).rgb;
  vec3 rgbSW = texture(uTex, vUv + vec2(-1., 1.)*uTexel).rgb;
  vec3 rgbSE = texture(uTex, vUv + vec2( 1., 1.)*uTexel).rgb;
  vec3 rgbM  = texture(uTex, vUv).rgb;
  float lNW = luma(rgbNW), lNE = luma(rgbNE), lSW = luma(rgbSW), lSE = luma(rgbSE), lM = luma(rgbM);
  float lMin = min(lM, min(min(lNW,lNE), min(lSW,lSE)));
  float lMax = max(lM, max(max(lNW,lNE), max(lSW,lSE)));
  if(lMax - lMin < max(.0312, lMax*.125)){ o = vec4(rgbM,1.); return; }
  vec2 dir = vec2(-((lNW+lNE)-(lSW+lSE)), ((lNW+lSW)-(lNE+lSE)));
  float dirReduce = max((lNW+lNE+lSW+lSE)*.25*.125, 1./128.);
  float rcpDirMin = 1./(min(abs(dir.x),abs(dir.y)) + dirReduce);
  dir = clamp(dir*rcpDirMin, -8., 8.) * uTexel;
  vec3 rgbA = .5*(texture(uTex, vUv + dir*(1./3.-.5)).rgb + texture(uTex, vUv + dir*(2./3.-.5)).rgb);
  vec3 rgbB = rgbA*.5 + .25*(texture(uTex, vUv + dir*-.5).rgb + texture(uTex, vUv + dir*.5).rgb);
  float lB = luma(rgbB);
  o = vec4((lB < lMin || lB > lMax) ? rgbA : rgbB, 1.);
}
`;

// irradiance convolution (one-time, renders into small cubemap from env cube)
SH.irradianceFS = HEAD + `
in vec2 vUv;
out vec4 o;
uniform int uFace;
uniform samplerCube uEnv;
const float PI = 3.14159265359;
vec3 dirFor(vec2 uv, int face){
  vec3 dirs[6] = vec3[6](vec3(1,-uv.y,-uv.x), vec3(-1,-uv.y,uv.x), vec3(uv.x,1,uv.y), vec3(uv.x,-1,-uv.y), vec3(uv.x,-uv.y,1), vec3(-uv.x,-uv.y,-1));
  return normalize(dirs[face]);
}
void main(){
  vec3 N = dirFor(vUv*2.-1., uFace);
  vec3 up = abs(N.y) < .99 ? vec3(0,1,0) : vec3(1,0,0);
  vec3 right = normalize(cross(up, N));
  vec3 up2 = cross(N, right);
  vec3 acc = vec3(0.); float wsum = 0.;
  for(int i=0;i<16;i++){
    float fi = float(i);
    float phi = fi*2.39996;          // golden angle
    float cosT = 1. - (fi+.5)/16.;
    float sinT = sqrt(max(0.,1.-cosT*cosT));
    vec3 L = right*(cos(phi)*sinT) + up2*(sin(phi)*sinT) + N*cosT;
    float w = cosT;
    acc += texture(uEnv, L).rgb * w;
    wsum += w;
  }
  o = vec4(acc/max(wsum,1e-4), 1.);
}
`;

})(window.MIMO);
