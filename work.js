var P={floor:-1,card:0,sheet:1,flipSide:1.5,flip:2,content:3,caption:3.25,title:4};var Je=`#version 300 es
in vec2 position; in vec2 uv; out vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position * 2.0, 0.0, 1.0); }`,et=()=>({alpha:1,white:0,shade:1,shadeS:1,sheetP:1,corner:0,scrim:0,hover:0,dent:0.1,border:0,reveal:1,clip:null,clipR:0,wash:[1,1,1],sheet:null,bulgeA:0,bulgeH:0,rotY:0});class Ae{gl;canvas;planes=new Set;ww=1;wh=1;dpr=1;aspect=1;proj=new Float32Array(16);view=new Float32Array(16);time=0;H=1;W=1;blank;floor={on:!1,alpha:0,pos:[0,0,0],scale:[1,1],run:1,gridF:[1,1],leanA:0,leanW:0,refl:0,reflLX:0,reflY:0,reflVP:new Float32Array(16)};hole={p:0,center:[0.5,0.5]};dim=1;progs={};geo={};fbo=null;rfbo=null;constructor(e){this.canvas=document.createElement("canvas");let t=this.canvas.getContext("webgl2",{antialias:!0,alpha:!0,powerPreference:"high-performance",premultipliedAlpha:!0});if(!t)throw Error("no webgl2");this.gl=t,e.appendChild(this.canvas),t.disable(t.DEPTH_TEST),t.enable(t.BLEND),t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),this.progs.image=this.program(`#version 300 es
precision highp float;
in vec2 position; in vec2 uv;
uniform mat4 u_proj, u_view; uniform vec3 u_pos; uniform vec2 u_res; uniform float u_rotY;
out vec2 vUv; out vec3 vFlat;

uniform float u_sheetW, u_sheetD, u_sheetT, u_sheetC, u_sheetP, u_sheetV;
uniform float u_leanA, u_leanW, u_bulgeA, u_bulgeH, u_hover, u_dent;
const float PI = 3.141592653589793;
float sheetQ(float wx) { return wx / max(u_sheetW, 0.0001) * u_sheetT - 0.2; }
float sheetShape(float q) { return mix(1.0 - q * q, sin(PI * q), u_sheetC) * exp(-q * q); }
float sheetShapeSlope(float q) {
  float g = exp(-q * q);
  float bowl = -2.0 * q * (1.0 + (1.0 - q * q));
  float ess = PI * cos(PI * q) - 2.0 * q * sin(PI * q);
  return mix(bowl, ess, u_sheetC) * g;
}
float sheetZ(float wx) { return -u_sheetD * sheetShape(sheetQ(wx)); }
float sheetRoll(float wx) {
  if (u_sheetW < 0.001) return 0.0;
  return -0.16 * sheetShapeSlope(sheetQ(wx)) / PI * u_sheetC * u_sheetP;
}
vec4 sheetWind(vec4 w) {
  float a = sheetRoll(w.x);
  if (u_sheetV > 0.001 && u_sheetW > 0.001 && u_sheetP > 0.001) {
    float qe = w.x / u_sheetW;
    a += 1.8 * u_sheetV * smoothstep(0.3, 0.9, abs(qe)) * sign(qe) * u_sheetP;
  }
  if (abs(a) < 0.0001) return w;
  float s = sin(a), c = cos(a);
  return vec4(w.x, w.y * c - w.z * s, w.y * s + w.z * c, w.w);
}
vec4 sheet(vec4 w) {
  w = sheetWind(w);
  w.z += sheetZ(w.x) * u_sheetP;
  if (u_sheetW > 0.001) {
    float qw = w.x / u_sheetW;
    w.y += 0.03 * w.x * u_sheetP;
    if (u_sheetV > 0.001) {
      float m = 1.0 - smoothstep(-1.0, 0.3, qw);
      w.y += 0.1 * u_sheetW * u_sheetV * m * u_sheetP;
      w.z += 0.2 * u_sheetW * u_sheetV * m * u_sheetP;
    }
  }
  return w;
}
float leanRamp(float s) { s = clamp(s, -1.0, 1.0); return s * (1.5 - 0.5 * s * s); }
float leanSlope(float s) { s = min(abs(s), 1.0); return 1.5 * (1.0 - s * s); }
vec4 lean(vec4 w, float k) {
  if (u_leanW > 0.001 && k > 0.001) w.z += u_leanA * leanRamp(w.x / u_leanW) * k;
  return w;
}
vec4 bulge(vec4 w) {
  if (u_bulgeH > 0.001) { float t = clamp(w.y / u_bulgeH, -1.0, 1.0); w.z += u_bulgeA * (1.0 - t * t); }
  return w;
}
float sheetDome(vec2 uv) { vec2 q = uv * 2.0 - 1.0; return (1.0 - q.x * q.x) * (1.0 - q.y * q.y); }
float roundedBox(vec2 p, vec2 mid, float r) {
  vec2 q = abs(p - mid) - (mid - r);
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vUv = uv;
  vec3 p = vec3(position * u_res, 0.0);
  float c = cos(u_rotY), s = sin(u_rotY);
  p = vec3(p.x * c, p.y, -p.x * s);
  vec4 w = vec4(p + u_pos, 1.0);
  vFlat = w.xyz;
  if (u_hover > 0.0001) w.z -= u_hover * u_dent * u_res.y * sheetDome(uv);
  w = sheet(w);
  w = lean(w, u_sheetP);
  w = bulge(w);
  gl_Position = u_proj * u_view * w;
}`,`#version 300 es
precision highp float;
in vec2 vUv; in vec3 vFlat; out vec4 o;
uniform sampler2D u_tex; uniform vec2 u_size, u_res; uniform vec3 u_cam;
uniform float u_alpha, u_shade, u_shadeS, u_corner, u_white, u_scrim, u_border, u_clipOn, u_clipR, u_reveal;
uniform vec3 u_wash, u_borderC; uniform vec4 u_clip;

uniform float u_sheetW, u_sheetD, u_sheetT, u_sheetC, u_sheetP, u_sheetV;
uniform float u_leanA, u_leanW, u_bulgeA, u_bulgeH, u_hover, u_dent;
const float PI = 3.141592653589793;
float sheetQ(float wx) { return wx / max(u_sheetW, 0.0001) * u_sheetT - 0.2; }
float sheetShape(float q) { return mix(1.0 - q * q, sin(PI * q), u_sheetC) * exp(-q * q); }
float sheetShapeSlope(float q) {
  float g = exp(-q * q);
  float bowl = -2.0 * q * (1.0 + (1.0 - q * q));
  float ess = PI * cos(PI * q) - 2.0 * q * sin(PI * q);
  return mix(bowl, ess, u_sheetC) * g;
}
float sheetZ(float wx) { return -u_sheetD * sheetShape(sheetQ(wx)); }
float sheetRoll(float wx) {
  if (u_sheetW < 0.001) return 0.0;
  return -0.16 * sheetShapeSlope(sheetQ(wx)) / PI * u_sheetC * u_sheetP;
}
vec4 sheetWind(vec4 w) {
  float a = sheetRoll(w.x);
  if (u_sheetV > 0.001 && u_sheetW > 0.001 && u_sheetP > 0.001) {
    float qe = w.x / u_sheetW;
    a += 1.8 * u_sheetV * smoothstep(0.3, 0.9, abs(qe)) * sign(qe) * u_sheetP;
  }
  if (abs(a) < 0.0001) return w;
  float s = sin(a), c = cos(a);
  return vec4(w.x, w.y * c - w.z * s, w.y * s + w.z * c, w.w);
}
vec4 sheet(vec4 w) {
  w = sheetWind(w);
  w.z += sheetZ(w.x) * u_sheetP;
  if (u_sheetW > 0.001) {
    float qw = w.x / u_sheetW;
    w.y += 0.03 * w.x * u_sheetP;
    if (u_sheetV > 0.001) {
      float m = 1.0 - smoothstep(-1.0, 0.3, qw);
      w.y += 0.1 * u_sheetW * u_sheetV * m * u_sheetP;
      w.z += 0.2 * u_sheetW * u_sheetV * m * u_sheetP;
    }
  }
  return w;
}
float leanRamp(float s) { s = clamp(s, -1.0, 1.0); return s * (1.5 - 0.5 * s * s); }
float leanSlope(float s) { s = min(abs(s), 1.0); return 1.5 * (1.0 - s * s); }
vec4 lean(vec4 w, float k) {
  if (u_leanW > 0.001 && k > 0.001) w.z += u_leanA * leanRamp(w.x / u_leanW) * k;
  return w;
}
vec4 bulge(vec4 w) {
  if (u_bulgeH > 0.001) { float t = clamp(w.y / u_bulgeH, -1.0, 1.0); w.z += u_bulgeA * (1.0 - t * t); }
  return w;
}
float sheetDome(vec2 uv) { vec2 q = uv * 2.0 - 1.0; return (1.0 - q.x * q.x) * (1.0 - q.y * q.y); }
float roundedBox(vec2 p, vec2 mid, float r) {
  vec2 q = abs(p - mid) - (mid - r);
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float sheetShade(float wx, vec2 uv, float resY) {
  if (u_sheetD < 0.001) return 0.0;
  float d = u_sheetW > 0.001 && u_sheetP > 0.001 ? clamp((u_sheetD - sheetZ(wx)) / (2.0 * u_sheetD), 0.0, 1.0) * u_sheetP : 0.0;
  if (u_hover > 0.0001) d += (u_hover * u_dent * resY * sheetDome(uv)) / (2.0 * u_sheetD);
  return clamp(d, 0.0, 1.0);
}
float sheetOffset(float wx, vec2 uv, float resY) {
  float z = 0.0;
  if (u_sheetW > 0.001 && u_sheetP > 0.001 && u_sheetD > 0.001) z += sheetZ(wx) * u_sheetP;
  if (u_leanW > 0.001) z += u_leanA * leanRamp(wx / u_leanW) * u_sheetP;
  if (u_hover > 0.0001) z -= u_hover * u_dent * resY * sheetDome(uv);
  return z;
}
vec3 sheetNormal(float wx, vec2 uv, vec2 res) {
  float dzdx = 0.0, dzdy = 0.0;
  if (u_sheetW > 0.001 && u_sheetP > 0.001 && u_sheetD > 0.001) dzdx += -u_sheetD * sheetShapeSlope(sheetQ(wx)) * u_sheetT / u_sheetW * u_sheetP;
  if (u_leanW > 0.001) dzdx += (u_leanA / u_leanW) * leanSlope(wx / u_leanW) * u_sheetP;
  if (u_hover > 0.0001) {
    vec2 q = uv * 2.0 - 1.0; float a = u_hover * u_dent;
    dzdx += 4.0 * a * res.y * q.x * (1.0 - q.y * q.y) / max(res.x, 0.0001);
    dzdy += 4.0 * a * q.y * (1.0 - q.x * q.x);
  }
  vec3 n = normalize(vec3(-dzdx, -dzdy, 1.0));
  float a = sheetRoll(wx);
  if (abs(a) > 0.0001) { float s = sin(a), c = cos(a); n = vec3(n.x, n.y * c - n.z * s, n.y * s + n.z * c); }
  return n;
}
vec3 sheetLit(vec3 col, vec3 n, vec3 v, float amt) {
  if (amt < 0.001) return col;
  vec3 L = normalize(vec3(-0.4, 0.5, 1.0));
  float d = dot(n, L) * 0.5 + 0.5;
  col *= 1.0 - 0.12 * amt * (1.0 - d);
  vec3 h = normalize(L + v);
  return col + pow(max(dot(n, h), 0.0), 48.0) * 0.35 * amt;
}
vec2 uvCover(vec2 plane, vec2 image, vec2 uv) {
  float pr = plane.x / plane.y, ir = image.x / image.y;
  vec2 ns = pr < ir ? vec2(image.x * (plane.y / image.y), plane.y) : vec2(plane.x, image.y * (plane.x / image.x));
  vec2 off = (pr < ir ? vec2((ns.x - plane.x) / 2.0, 0.0) : vec2(0.0, (ns.y - plane.y) / 2.0)) / ns;
  return uv * plane / ns + off;
}
void main() {
  vec2 cuv = uvCover(u_res, u_size, vUv);
  vec4 tex = texture(u_tex, cuv);
  if (u_shade > 0.001) {
    float depth = sheetShade(vFlat.x, vUv, u_res.y);
    tex.rgb = mix(tex.rgb, vec3(0.059), u_shade * 0.8 * pow(depth, u_shadeS));
    vec3 p = vFlat + vec3(0.0, 0.0, sheetOffset(vFlat.x, vUv, u_res.y));
    tex.rgb = sheetLit(tex.rgb, sheetNormal(vFlat.x, vUv, u_res), normalize(u_cam - p), u_shade);
  }
  // Full strength through the caption band, then a fade: white captions must hold on light cards at phone heights; work.css mirrors this curve.
  if (u_scrim > 0.001) { float g = 1.0 - smoothstep(0.08, 0.55, vUv.y); tex.rgb = mix(tex.rgb, vec3(0.0), u_scrim * 0.65 * g * g); }
  tex.rgb = mix(tex.rgb, u_wash, u_white);
  float alpha = u_alpha;
  vec2 sz = vec2(u_res.x / max(u_res.y, 0.0001), 1.0);
  vec2 mid = sz * 0.5;
  float d = roundedBox(vUv * sz, mid, min(u_corner, min(mid.x, mid.y)));
  float aa = max(fwidth(d), 0.0001);
  if (u_corner > 0.0001) alpha *= 1.0 - smoothstep(-aa, aa, d);
  if (u_border > 0.0001) tex.rgb = mix(tex.rgb, u_borderC, smoothstep(-u_border - aa, -u_border + aa, d));
  if (u_reveal < 0.9999) {
    // The rail thumbnail's wipe: a rounded box that grows from the centre.
    vec2 rm = mid * u_reveal;
    float rr = min(u_corner, min(rm.x, rm.y));
    vec2 q = abs(vUv * sz - mid) - (rm - rr);
    float rd = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - rr;
    alpha *= 1.0 - smoothstep(-aa, aa, rd);
  }
  if (u_clipOn > 0.5) {
    vec2 p = gl_FragCoord.xy - u_clip.xy;
    vec2 cm = u_clip.zw * 0.5;
    alpha *= 1.0 - smoothstep(-1.0, 1.0, roundedBox(p, cm, min(u_clipR, min(cm.x, cm.y))));
  }
  o = vec4(tex.rgb * alpha, alpha);
}`),this.progs.text=this.program(`#version 300 es
precision highp float;
in vec2 position; in vec2 uv;
uniform mat4 u_proj, u_view; uniform vec3 u_pos; uniform vec2 u_res; uniform float u_rotY;
out vec2 vUv; out vec3 vFlat;

uniform float u_sheetW, u_sheetD, u_sheetT, u_sheetC, u_sheetP, u_sheetV;
uniform float u_leanA, u_leanW, u_bulgeA, u_bulgeH, u_hover, u_dent;
const float PI = 3.141592653589793;
float sheetQ(float wx) { return wx / max(u_sheetW, 0.0001) * u_sheetT - 0.2; }
float sheetShape(float q) { return mix(1.0 - q * q, sin(PI * q), u_sheetC) * exp(-q * q); }
float sheetShapeSlope(float q) {
  float g = exp(-q * q);
  float bowl = -2.0 * q * (1.0 + (1.0 - q * q));
  float ess = PI * cos(PI * q) - 2.0 * q * sin(PI * q);
  return mix(bowl, ess, u_sheetC) * g;
}
float sheetZ(float wx) { return -u_sheetD * sheetShape(sheetQ(wx)); }
float sheetRoll(float wx) {
  if (u_sheetW < 0.001) return 0.0;
  return -0.16 * sheetShapeSlope(sheetQ(wx)) / PI * u_sheetC * u_sheetP;
}
vec4 sheetWind(vec4 w) {
  float a = sheetRoll(w.x);
  if (u_sheetV > 0.001 && u_sheetW > 0.001 && u_sheetP > 0.001) {
    float qe = w.x / u_sheetW;
    a += 1.8 * u_sheetV * smoothstep(0.3, 0.9, abs(qe)) * sign(qe) * u_sheetP;
  }
  if (abs(a) < 0.0001) return w;
  float s = sin(a), c = cos(a);
  return vec4(w.x, w.y * c - w.z * s, w.y * s + w.z * c, w.w);
}
vec4 sheet(vec4 w) {
  w = sheetWind(w);
  w.z += sheetZ(w.x) * u_sheetP;
  if (u_sheetW > 0.001) {
    float qw = w.x / u_sheetW;
    w.y += 0.03 * w.x * u_sheetP;
    if (u_sheetV > 0.001) {
      float m = 1.0 - smoothstep(-1.0, 0.3, qw);
      w.y += 0.1 * u_sheetW * u_sheetV * m * u_sheetP;
      w.z += 0.2 * u_sheetW * u_sheetV * m * u_sheetP;
    }
  }
  return w;
}
float leanRamp(float s) { s = clamp(s, -1.0, 1.0); return s * (1.5 - 0.5 * s * s); }
float leanSlope(float s) { s = min(abs(s), 1.0); return 1.5 * (1.0 - s * s); }
vec4 lean(vec4 w, float k) {
  if (u_leanW > 0.001 && k > 0.001) w.z += u_leanA * leanRamp(w.x / u_leanW) * k;
  return w;
}
vec4 bulge(vec4 w) {
  if (u_bulgeH > 0.001) { float t = clamp(w.y / u_bulgeH, -1.0, 1.0); w.z += u_bulgeA * (1.0 - t * t); }
  return w;
}
float sheetDome(vec2 uv) { vec2 q = uv * 2.0 - 1.0; return (1.0 - q.x * q.x) * (1.0 - q.y * q.y); }
float roundedBox(vec2 p, vec2 mid, float r) {
  vec2 q = abs(p - mid) - (mid - r);
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vUv = uv;
  vec3 p = vec3(position * u_res, 0.0);
  float c = cos(u_rotY), s = sin(u_rotY);
  p = vec3(p.x * c, p.y, -p.x * s);
  vec4 w = vec4(p + u_pos, 1.0);
  vFlat = w.xyz;
  if (u_hover > 0.0001) w.z -= u_hover * u_dent * u_res.y * sheetDome(uv);
  w = sheet(w);
  w = lean(w, u_sheetP);
  w = bulge(w);
  gl_Position = u_proj * u_view * w;
}`,`#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D u_tex; uniform float u_alpha, u_ink, u_inkOn, u_slide, u_clipOn, u_clipR; uniform vec3 u_c0, u_c1; uniform vec4 u_clip;
float roundedBox(vec2 p, vec2 mid, float r) { vec2 q = abs(p - mid) - (mid - r); return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
void main() {
  vec2 suv = vUv + vec2(0.0, u_slide);
  float win = step(0.0, suv.y) * (1.0 - step(1.0, suv.y));
  vec4 tex = texture(u_tex, suv);
  vec3 ink = mix(u_c0, u_c1, u_ink);
  float dark = 1.0 - clamp(dot(ink, vec3(0.2126, 0.7152, 0.0722)), 0.0, 1.0);
  float cov = pow(tex.a, mix(1.0, 1.35, dark * u_inkOn));
  vec3 col = mix(tex.rgb / max(tex.a, 0.0001), ink, u_inkOn);
  float alpha = cov * win * u_alpha;
  if (u_clipOn > 0.5) {
    vec2 p = gl_FragCoord.xy - u_clip.xy; vec2 cm = u_clip.zw * 0.5;
    alpha *= 1.0 - smoothstep(-1.0, 1.0, roundedBox(p, cm, min(u_clipR, min(cm.x, cm.y))));
  }
  o = vec4(col * alpha, alpha);
}`),this.progs.floor=this.program(`#version 300 es
precision highp float;
in vec2 position; in vec2 uv;
uniform mat4 u_proj, u_view; uniform vec3 u_pos; uniform vec2 u_scale; uniform float u_run;
out vec2 vUv; out vec3 vWorld; out float vFar;

uniform float u_sheetW, u_sheetD, u_sheetT, u_sheetC, u_sheetP, u_sheetV;
uniform float u_leanA, u_leanW, u_bulgeA, u_bulgeH, u_hover, u_dent;
const float PI = 3.141592653589793;
float sheetQ(float wx) { return wx / max(u_sheetW, 0.0001) * u_sheetT - 0.2; }
float sheetShape(float q) { return mix(1.0 - q * q, sin(PI * q), u_sheetC) * exp(-q * q); }
float sheetShapeSlope(float q) {
  float g = exp(-q * q);
  float bowl = -2.0 * q * (1.0 + (1.0 - q * q));
  float ess = PI * cos(PI * q) - 2.0 * q * sin(PI * q);
  return mix(bowl, ess, u_sheetC) * g;
}
float sheetZ(float wx) { return -u_sheetD * sheetShape(sheetQ(wx)); }
float sheetRoll(float wx) {
  if (u_sheetW < 0.001) return 0.0;
  return -0.16 * sheetShapeSlope(sheetQ(wx)) / PI * u_sheetC * u_sheetP;
}
vec4 sheetWind(vec4 w) {
  float a = sheetRoll(w.x);
  if (u_sheetV > 0.001 && u_sheetW > 0.001 && u_sheetP > 0.001) {
    float qe = w.x / u_sheetW;
    a += 1.8 * u_sheetV * smoothstep(0.3, 0.9, abs(qe)) * sign(qe) * u_sheetP;
  }
  if (abs(a) < 0.0001) return w;
  float s = sin(a), c = cos(a);
  return vec4(w.x, w.y * c - w.z * s, w.y * s + w.z * c, w.w);
}
vec4 sheet(vec4 w) {
  w = sheetWind(w);
  w.z += sheetZ(w.x) * u_sheetP;
  if (u_sheetW > 0.001) {
    float qw = w.x / u_sheetW;
    w.y += 0.03 * w.x * u_sheetP;
    if (u_sheetV > 0.001) {
      float m = 1.0 - smoothstep(-1.0, 0.3, qw);
      w.y += 0.1 * u_sheetW * u_sheetV * m * u_sheetP;
      w.z += 0.2 * u_sheetW * u_sheetV * m * u_sheetP;
    }
  }
  return w;
}
float leanRamp(float s) { s = clamp(s, -1.0, 1.0); return s * (1.5 - 0.5 * s * s); }
float leanSlope(float s) { s = min(abs(s), 1.0); return 1.5 * (1.0 - s * s); }
vec4 lean(vec4 w, float k) {
  if (u_leanW > 0.001 && k > 0.001) w.z += u_leanA * leanRamp(w.x / u_leanW) * k;
  return w;
}
vec4 bulge(vec4 w) {
  if (u_bulgeH > 0.001) { float t = clamp(w.y / u_bulgeH, -1.0, 1.0); w.z += u_bulgeA * (1.0 - t * t); }
  return w;
}
float sheetDome(vec2 uv) { vec2 q = uv * 2.0 - 1.0; return (1.0 - q.x * q.x) * (1.0 - q.y * q.y); }
float roundedBox(vec2 p, vec2 mid, float r) {
  vec2 q = abs(p - mid) - (mid - r);
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vUv = uv;
  vec4 w = vec4(position.x * u_scale.x + u_pos.x, u_pos.y, -position.y * u_scale.y + u_pos.z, 1.0);
  vFar = -w.z / max(u_run, 0.0001);
  w = lean(w, 1.0);
  vWorld = w.xyz;
  gl_Position = u_proj * u_view * w;
}`,`#version 300 es
precision highp float;
in vec2 vUv; in vec3 vWorld; in float vFar; out vec4 o;
uniform float u_alpha, u_grid, u_reflA, u_reflSpread, u_reflLX; uniform vec2 u_gridF; uniform sampler2D u_refl; uniform mat4 u_reflVP;
void main() {
  float fade = 1.0 - smoothstep(0.2, 0.95, vFar);
  float contact = exp(-abs(vFar) * 14.0);
  vec3 col = vec3(0.0);
  col *= 1.0 - contact * 0.55;
  vec2 g = vec2(vUv.x * u_gridF.x, vFar * u_gridF.y);
  vec2 gf = abs(fract(g) - 0.5);
  vec2 gw = fwidth(g) * 1.5;
  vec2 lines = vec2(1.0) - smoothstep(vec2(0.0), gw, gf);
  float line = max(lines.x, lines.y);
  col += line * u_grid * fade;
  if (u_reflA > 0.001) {
    vec3 wp = vWorld;
    wp.x -= (vWorld.x - u_reflLX) * u_reflSpread * abs(vFar);
    vec4 rp = u_reflVP * vec4(wp, 1.0);
    vec2 ruv = (rp.xy / max(rp.w, 0.0001)) * 0.5 + 0.5;
    vec2 soft = smoothstep(vec2(0.0), vec2(0.1), ruv) * (vec2(1.0) - smoothstep(vec2(0.9), vec2(1.0), ruv));
    float ok = soft.x * soft.y;
    vec3 refl = texture(u_refl, ruv).rgb;
    float fall = exp(-((vFar > 0.0) ? vFar * 6.0 : -vFar * 2.2));
    col += refl * line * u_reflA * fall * ok * fade;
  }
  float a = u_alpha * fade;
  o = vec4(col * a, a);
}`),this.geo.plane=this.grid(24,24),this.geo.quad=this.grid(1,1),this.geo.floor=this.grid(48,24),this.blank=this.texture(new Uint8Array([0,0,0,0]),1,1)}program(e,t){let n=this.gl,o=(s,c)=>{let u=n.createShader(s);if(n.shaderSource(u,c),n.compileShader(u),!n.getShaderParameter(u,n.COMPILE_STATUS))throw Error(n.getShaderInfoLog(u)||"shader");return u},r=n.createProgram();if(n.attachShader(r,o(n.VERTEX_SHADER,e)),n.attachShader(r,o(n.FRAGMENT_SHADER,t)),n.bindAttribLocation(r,0,"position"),n.bindAttribLocation(r,1,"uv"),n.linkProgram(r),!n.getProgramParameter(r,n.LINK_STATUS))throw Error(n.getProgramInfoLog(r)||"link");let a={},i=n.getProgramParameter(r,n.ACTIVE_UNIFORMS);for(let s=0;s<i;s++){let c=n.getActiveUniform(r,s);a[c.name]=n.getUniformLocation(r,c.name)}return{p:r,u:a}}grid(e,t){let n=this.gl,o=[],r=[];for(let c=0;c<=t;c++)for(let u=0;u<=e;u++)o.push(u/e-0.5,c/t-0.5,u/e,c/t);for(let c=0;c<t;c++)for(let u=0;u<e;u++){let g=c*(e+1)+u;r.push(g,g+1,g+e+1,g+1,g+e+2,g+e+1)}let a=n.createVertexArray();n.bindVertexArray(a);let i=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,i),n.bufferData(n.ARRAY_BUFFER,new Float32Array(o),n.STATIC_DRAW),n.enableVertexAttribArray(0),n.vertexAttribPointer(0,2,n.FLOAT,!1,16,0),n.enableVertexAttribArray(1),n.vertexAttribPointer(1,2,n.FLOAT,!1,16,8);let s=n.createBuffer();return n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,s),n.bufferData(n.ELEMENT_ARRAY_BUFFER,new Uint16Array(r),n.STATIC_DRAW),n.bindVertexArray(null),{vao:a,count:r.length}}texture(e,t,n){let o=this.gl,r=o.createTexture();if(o.bindTexture(o.TEXTURE_2D,r),o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,!0),t!==void 0)o.texImage2D(o.TEXTURE_2D,0,o.RGBA,t,n,0,o.RGBA,o.UNSIGNED_BYTE,e);else o.texImage2D(o.TEXTURE_2D,0,o.RGBA,o.RGBA,o.UNSIGNED_BYTE,e);return o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.LINEAR),r}upload(e,t){let n=this.gl;n.bindTexture(n.TEXTURE_2D,e),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!0),n.texImage2D(n.TEXTURE_2D,0,n.RGBA,n.RGBA,n.UNSIGNED_BYTE,t)}resize(e,t){let n=this.gl;this.ww=e,this.wh=t,this.dpr=Math.min(2,devicePixelRatio||1),this.canvas.width=Math.round(e*this.dpr),this.canvas.height=Math.round(t*this.dpr),this.canvas.style.width=e+"px",this.canvas.style.height=t+"px",this.aspect=e/t;let o=53.4*Math.PI/180;this.H=Math.tan(o/2)*41.18,this.W=this.H*this.aspect;let r=0.1,a=2000,i=1/Math.tan(o/2);if(this.proj.set([i/this.aspect,0,0,0,0,i,0,0,0,0,(a+r)/(r-a),-1,0,0,2*a*r/(r-a),0]),this.view.set([1,0,0,0,0,1,0,0,0,0,1,0,0,0,-41.18,1]),this.fbo)n.deleteFramebuffer(this.fbo.f),n.deleteTexture(this.fbo.t),this.fbo=null;if(this.rfbo)n.deleteFramebuffer(this.rfbo.f),n.deleteTexture(this.rfbo.t),this.rfbo=null}pose(e){let t=this.H*2,n=this.W*2,o=n*e.width/this.ww,r=t*e.height/this.wh;return{pos:[-n/2+o/2+e.left/this.ww*n,t/2-r/2-e.top/this.wh*t,0],scale:[o,r]}}screenRect(e){let t=this.H*2,n=this.W*2;return{left:(e.pos[0]-e.scale[0]/2+n/2)/n*this.ww,top:(t/2-e.pos[1]-e.scale[1]/2)/t*this.wh,width:e.scale[0]/n*this.ww,height:e.scale[1]/t*this.wh}}target(e){let t=this.gl,n=Math.max(1,Math.round(this.canvas.width*e)),o=Math.max(1,Math.round(this.canvas.height*e)),r=t.createTexture();t.bindTexture(t.TEXTURE_2D,r),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,n,o,0,t.RGBA,t.UNSIGNED_BYTE,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE);let a=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,a),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,r,0),t.bindFramebuffer(t.FRAMEBUFFER,null),{f:a,t:r,w:n,h:o}}setSheet(e,t,n){let o=this.gl;o.uniform1f(e.u_sheetW,t?t.W:0),o.uniform1f(e.u_sheetD,t?t.D:0),o.uniform1f(e.u_sheetT,t?t.T:1),o.uniform1f(e.u_sheetC,t?t.C:1),o.uniform1f(e.u_sheetV,t?t.V:0),o.uniform1f(e.u_leanA,t?t.A:0),o.uniform1f(e.u_leanW,t?t.W:0),o.uniform1f(e.u_sheetP,n.sheetP),o.uniform1f(e.u_bulgeA,n.bulgeA),o.uniform1f(e.u_bulgeH,n.bulgeH),o.uniform1f(e.u_hover,n.hover),o.uniform1f(e.u_dent,n.dent)}drawPlanes(e,t,n,o){let r=this.gl,a=null;for(let i of e){let s=this.progs[i.kind];if(s!==a){if(a=s,r.useProgram(s.p),r.bindVertexArray(this.geo.plane.vao),r.uniformMatrix4fv(s.u.u_proj,!1,this.proj),r.uniformMatrix4fv(s.u.u_view,!1,t),r.uniform1i(s.u.u_tex,0),s.u.u_cam)r.uniform3f(s.u.u_cam,0,0,41.18)}let c=s.u,u=i.u;if(r.activeTexture(r.TEXTURE0),r.bindTexture(r.TEXTURE_2D,i.tex),r.uniform3fv(c.u_pos,i.pos),r.uniform2fv(c.u_res,i.scale),r.uniform1f(c.u_rotY,u.rotY),this.setSheet(c,u.sheet,u),r.uniform1f(c.u_alpha,u.alpha*this.dim),r.uniform1f(c.u_clipOn,u.clip?1:0),u.clip){let g=n/this.ww;r.uniform4f(c.u_clip,u.clip[0]*g,o-(u.clip[1]+u.clip[3])*g,u.clip[2]*g,u.clip[3]*g),r.uniform1f(c.u_clipR,u.clipR*g)}if(i.kind==="image")r.uniform2fv(c.u_size,i.size),r.uniform1f(c.u_white,u.white),r.uniform1f(c.u_shade,u.shade),r.uniform1f(c.u_shadeS,u.shadeS),r.uniform1f(c.u_corner,u.corner),r.uniform1f(c.u_scrim,u.scrim),r.uniform1f(c.u_border,u.border),r.uniform1f(c.u_reveal,u.reveal),r.uniform3fv(c.u_wash,u.wash),r.uniform3f(c.u_borderC,0.851,0.851,0.851);else r.uniform3fv(c.u_c0,i.c0),r.uniform3fv(c.u_c1,i.c1),r.uniform1f(c.u_ink,i.ink),r.uniform1f(c.u_inkOn,i.inkOn),r.uniform1f(c.u_slide,i.slide);r.drawElements(r.TRIANGLES,this.geo.plane.count,r.UNSIGNED_SHORT,0)}}drawFloor(){let e=this.gl,t=this.floor,n=this.progs.floor,o=n.u;e.useProgram(n.p),e.bindVertexArray(this.geo.floor.vao),e.uniformMatrix4fv(o.u_proj,!1,this.proj),e.uniformMatrix4fv(o.u_view,!1,this.view),e.uniform3fv(o.u_pos,t.pos),e.uniform2fv(o.u_scale,t.scale),e.uniform1f(o.u_run,t.run),e.uniform1f(o.u_leanA,t.leanA),e.uniform1f(o.u_leanW,t.leanW),e.uniform1f(o.u_sheetW,0),e.uniform1f(o.u_bulgeH,0),e.uniform1f(o.u_alpha,t.alpha*this.dim),e.uniform1f(o.u_grid,0.08),e.uniform2fv(o.u_gridF,t.gridF),e.uniform1f(o.u_reflA,t.refl),e.uniform1f(o.u_reflSpread,0.35),e.uniform1f(o.u_reflLX,t.reflLX),e.uniformMatrix4fv(o.u_reflVP,!1,t.reflVP),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.rfbo?this.rfbo.t:this.blank),e.uniform1i(o.u_refl,0),e.drawElements(e.TRIANGLES,this.geo.floor.count,e.UNSIGNED_SHORT,0)}render(e){let t=this.gl;this.time+=e;let n=[...this.planes].filter((i)=>!i.hidden&&i.u.alpha>0.001).sort((i,s)=>i.order-s.order),o=this.canvas.width,r=this.canvas.height;if(this.floor.on&&this.floor.refl>0.001){if(!this.rfbo)this.rfbo=this.target(0.1);let i=this.rfbo;t.bindFramebuffer(t.FRAMEBUFFER,i.f),t.viewport(0,0,i.w,i.h),t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT);let s=new Float32Array(this.view);s[13]=-this.floor.reflY,this.drawPlanes(n.filter((c)=>c.reflect),s,i.w,i.h)}let a=this.hole.p>0.001&&!!this.progs.hole;if(a){if(!this.fbo)this.fbo=this.target(1);t.bindFramebuffer(t.FRAMEBUFFER,this.fbo.f)}else t.bindFramebuffer(t.FRAMEBUFFER,null);if(t.viewport(0,0,o,r),t.clearColor(0,0,0,a?1:0),t.clear(t.COLOR_BUFFER_BIT),this.floor.on&&this.floor.alpha*this.dim>0.001)this.drawFloor();if(this.drawPlanes(n,this.view,o,r),a){t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,o,r);let i=this.progs.hole,s=i.u;t.useProgram(i.p),t.bindVertexArray(this.geo.quad.vao),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.fbo.t),t.uniform1i(s.u_scene,0),t.uniform2f(s.u_aspect,this.aspect,1),t.uniform2fv(s.u_center,this.hole.center),t.uniform1f(s.u_time,this.time),t.uniform1f(s.u_p,this.hole.p),t.uniform1f(s.u_radius,0.2),t.uniform1f(s.u_lens,1.5),t.uniform1f(s.u_reach,0.16),t.uniform1f(s.u_orbit,0.35),t.uniform1f(s.u_wave,0.025),t.uniform1f(s.u_aberr,0.004),t.drawElements(t.TRIANGLES,this.geo.quad.count,t.UNSIGNED_SHORT,0)}}}var se=(e,t,n,o)=>{let r=getComputedStyle(t),a=Math.min(3,Math.max(2,e.dpr*1.5)),i=Math.max(1,Math.round(n.width*a)),s=Math.max(1,Math.round(n.height*a)),c=document.createElement("canvas");c.width=i,c.height=s;let u=c.getContext("2d");u.scale(a,a);let g=r.backgroundColor.match(/[\d.]+/g),d=!!g&&g.length>=3&&(g.length<4||+g[3]>0);if(d){u.fillStyle=r.backgroundColor,u.beginPath();let f=Math.min(parseFloat(r.borderRadius)||0,n.width/2,n.height/2);u.roundRect(0,0,n.width,n.height,f),u.fill()}let p=t.textContent?.trim()??"";u.font=`${r.fontStyle} ${r.fontWeight} ${r.fontSize} ${r.fontFamily}`,u.letterSpacing=r.letterSpacing==="normal"?"0px":r.letterSpacing,u.textBaseline="alphabetic",u.fillStyle=d?r.color:"#fff";let b=u.measureText(p),_=b.fontBoundingBoxAscent||parseFloat(r.fontSize)*0.95,h=b.fontBoundingBoxDescent||parseFloat(r.fontSize)*0.25,E=d||r.textAlign==="center"?(n.width-b.width)/2:0;u.fillText(p,E,(n.height-(_+h))/2+_);let L=o??e.texture(c);if(o)e.upload(o,c);return{tex:L,colour:d}},me=(e)=>{let t=e.match(/[\d.]+/g);return t&&t.length>=3?[+t[0]/255,+t[1]/255,+t[2]/255]:[1,1,1]};var tt=(e,t,n,o,r)=>{let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*o+e*e*e*r},yt=[[0,0,0.094,0.026,0.124,0.127,0.157,0.29],[0.157,0.29,0.197,0.486,0.254,0.8,0.348,0.884],[0.348,0.884,0.42,0.949,0.374,1,1,1]],Q=(e)=>{if(e<=0)return 0;if(e>=1)return 1;for(let[t,n,o,r,a,i,s,c]of yt){if(e>s)continue;let u=0,g=1;for(let d=0;d<20;d++){let p=(u+g)/2;if(tt(p,t,o,a,s)<e)u=p;else g=p}return tt((u+g)/2,n,r,i,c)}return e},ke=(e)=>e,z=(e)=>e>=1?1:1-Math.pow(2,-10*e),Tt=(e)=>e<=0?0:Math.pow(2,10*(e-1)),ot=(e)=>e<0.5?Tt(e*2)/2:0.5+z(e*2-1)/2,C=(e)=>1-(1-e),ve=(e)=>1-(1-e)*(1-e),He=1,rt=(e)=>He=e,K=[],Pe=new Set,nt=0,le=0,Se=(e)=>{le=requestAnimationFrame(Se);let t=Math.min((e-(nt||e))/1000,0.05);nt=e;let n=t*60;for(let o=0;o<K.length;o++){let r=K[o];if(r.done)continue;if(r.t+=t,r.t<r.delay)continue;let a=r.dur<=0?1:Math.min(1,(r.t-r.delay)/r.dur),i=r.ease(a);for(let s=0;s<r.keys.length;s++)r.target[r.keys[s]]=r.from[s]+(r.to[s]-r.from[s])*i;if(r.onUpdate?.(),a>=1)r.done=!0,r.onComplete?.()}for(let o=K.length-1;o>=0;o--)if(K[o].done)K.splice(o,1);for(let o of Pe)o(t,n)},Fe=(e)=>{if(Pe.add(e),!le)le=requestAnimationFrame(Se);return()=>Pe.delete(e)},Ce=(e,t,n)=>{let o=Object.keys(t);O(e,o);let r={target:e,keys:o,from:o.map((a)=>Number(e[a])||0),to:o.map((a)=>t[a]),t:0,dur:n.dur*He,delay:(n.delay??0)*He,ease:n.ease??z,onUpdate:n.onUpdate,onComplete:n.onComplete,done:!1};if(K.push(r),!le)le=requestAnimationFrame(Se);return r},ie=(e,t,n,o=0,r)=>{let a={v:0};return Ce(a,{v:1},{dur:e,ease:ke,delay:o,onUpdate:()=>n(t(a.v)),onComplete:r})},O=(e,t)=>{for(let n of K)if(n.target===e&&(!t||n.keys.some((o)=>t.includes(o))))n.done=!0},H=(e,t,n)=>e+(t-e)*n,q=(e,t,n)=>Math.min(n,Math.max(t,e)),Ue=(e,t,n)=>{let o=t-e;return((n-e)%o+o)%o+e},ge=(e,t,n,o)=>H(e,t,1-Math.pow(1-n,o));var at=`#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D u_scene; uniform vec2 u_aspect, u_center; uniform float u_time, u_p, u_radius, u_lens, u_reach, u_orbit, u_wave, u_aberr;
vec2 spin(vec2 v, float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c) * v; }
float lobes(float a) { return sin(a * 3.0 + u_time * 0.7) * 0.6 + sin(a * 5.0 - u_time * 0.45) * 0.4; }
vec4 grab(vec2 dir, float rad) {
  vec2 uv = (dir * rad * u_aspect.x) / u_aspect + u_center;
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return vec4(0.0, 0.0, 0.0, 1.0);
  return texture(u_scene, uv);
}
float pull(float t, float e, float fall) { return fall * (e * e) / max(t, 0.001); }
void main() {
  vec2 q = (vUv - u_center) * u_aspect;
  float t = length(q) / u_aspect.x;
  vec2 dir = length(q) > 0.00001 ? normalize(q) : vec2(1.0, 0.0);
  float n = lobes(atan(q.y, q.x)) * u_wave * sin(3.14159265 * clamp(u_p, 0.0, 1.0));
  float r = u_p * u_radius + n;
  float e = r * u_lens;
  float fall = 1.0 - smoothstep(r, r + u_reach, t);
  float draw = pull(t, e, fall);
  vec2 sdir = spin(dir, draw * u_orbit * min(u_time, 15.0));
  float split = e * u_aberr;
  vec4 cr = grab(sdir, t - pull(t, e + split, fall));
  vec4 cg = grab(sdir, t - draw);
  vec4 cb = grab(sdir, t - pull(t, e - split, fall));
  vec4 col = vec4(cr.r, cg.g, cb.b, 1.0);
  float d = t - r;
  float aa = max(fwidth(d), 0.0001);
  float inside = 1.0 - smoothstep(-aa, aa, d);
  o = mix(col, vec4(0.0, 0.0, 0.0, 1.0), inside);
}`;var Lt=(e)=>{let t=l.cards.find((o)=>o.el===e.card)?.vrect??w(e.card),n=e.off;return{left:t.left+n.dx,top:t.top+n.dy,width:n.w,height:n.h}},Ie=(e,t)=>{let n=l.texts.find((o)=>o.slug===e&&o.el.isConnected);if(!n&&t&&v)n=we(t,P.title),n.slug=e,t.style.opacity="0";if(!n)return;n.flightRect=n.el.isConnected?n.card?Lt(n):w(n.el):null,l.pendingTitle=n,l.texts=l.texts.filter((o)=>o!==n)},Mt=async(e,t)=>{if(l.titleHero)ne(l.titleHero,0.5);l.titleHero=null;let n=l.pendingTitle;if(l.pendingTitle=null,n&&n.slug===t&&(n.flightRect||n.el.isConnected))return Rt(n,e);if(n)ne(n,0.2);if(I.fonts.status!=="loaded")await I.fonts.ready;if(!e.isConnected)return;let o=we(e,P.title);o.sheet=l.hero,o.plane.u.alpha=0,l.titleHero=o,M(o.plane.u,{alpha:o.cssAlpha},0.6,C)},Rt=(e,t)=>{let n=e.flightRect??w(e.el),o=e.plane;se(v,t,w(t),o.tex),e.el=t,e.card=void 0,o.order=P.title,o.u.sheet=null,e.sheet=l.hero,o.c0=o.c0.map((r,a)=>H(o.c1[a],r,1-o.ink)),o.c1=me(getComputedStyle(t).color),o.ink=0,o.slide=0,e.progress=1,l.titleFly={t:e,from:n},ie(A.flight,Q,(r)=>{if(!t.isConnected)return;e.flightRect=ce(n,w(t),r),o.ink=r,o.u.alpha=1},0,()=>{e.flightRect=null,o.c0=o.c1,o.ink=0,l.titleFly=null,l.titleHero=e})},At=()=>{if(l.titleFly)ne(l.titleFly.t,0.25);if(l.titleFly=null,l.titleHero)O(l.titleHero.plane.u),ne(l.titleHero,0.5);l.titleHero=null},Ht=(e,t,n)=>{let o=De(e.dataset.src||"",+(e.dataset.w||1),+(e.dataset.h||1));o.order=P.content,o.u.shade=0,o.u.sheetP=0,o.u.border=n?0.0016:0;let r={plane:o,el:e,p:0,i:t,sheet:l.hero};l.content.push(r),M(r,{p:1},A.stack.dur,z,(l.bootChoreo?j.stack:A.stack.at)+t*A.stack.stagger)},Pt=()=>{for(let e of l.content)O(e),M(e.plane.u,{alpha:0},0.35,C,0,()=>{v.planes.delete(e.plane),l.content=l.content.filter((t)=>t!==e)})},W={p:0},B=null,J=0,kt=()=>{if(B)return O(W),!0;let e=l.hero;if(!e?.landed||!e.el.isConnected)return!1;let t=R('[data-gl="related"]',e.el.closest("main")),n=w(e.el),o=t.find((c)=>w(c).left<n.left),r=t.find((c)=>w(c).left>n.left);if(!o||!r)return!1;let a=l.reg.get(o.dataset.id),i=l.reg.get(r.dataset.id);if(!a?.landed||!i?.landed||a===i||a.el!==o||i.el!==r)return!1;for(let c of[e,a,i])O(c.plane.u,["alpha"]),c.landed=!1;a.plane.order=i.plane.order=P.flip;let s=(c)=>parseFloat(getComputedStyle(c).borderRadius)||0;return B={sheet:e,prev:a,next:i,sheetAlpha:te(e.el,ee.sheet).alpha,slotAlpha:te(o,ee.related).alpha,panelRad:s(e.el),slotRad:s(o)},!0},St=()=>{if(!B)return;M(W,{p:0},0.6,z,0,()=>{let e=B;if(!e)return;W.p=0,lt(1),B=null;for(let t of[e.sheet,e.prev,e.next])t.plane.order=P.sheet,t.landed=!0})},Oe=(e,t,n,o)=>{let r=v.pose(t),a=e.plane;a.pos=r.pos,a.scale=r.scale,a.u.sheet=null,a.u.alpha=n,a.u.corner=t.height?o/t.height:0,a.u.bulgeA=l.bulge+J,a.u.bulgeH=l.bulgeH},lt=(e)=>{let t=B;if(!t)return void(J+=-J*Math.min(1,0.1*e));let{H:n}=ue(),o=Math.tanh(Math.abs(W.p)*6);J+=(-(o*o)*0.65*n-J)*Math.min(1,0.25*e);let r=Math.min(Math.abs(W.p),1),a=W.p>=0,i=w(t.sheet.el),s=w(t.prev.el),c=w(t.next.el),u=(d,p)=>H(d,p,r);Oe(t.sheet,ce(i,a?s:c,r),u(t.sheetAlpha,t.slotAlpha),u(t.panelRad,t.slotRad)),Oe(a?t.next:t.prev,ce(a?c:s,i,r),u(t.slotAlpha,t.sheetAlpha),u(t.slotRad,t.panelRad));let g=a?t.prev:t.next;Oe(g,a?s:c,t.slotAlpha,t.slotRad),g.plane.pos[0]*=1+r,Ft(1-r)},Ft=(e)=>{if(l.titleHero)l.titleHero.plane.u.alpha=l.titleHero.cssAlpha*e;let t=y("[data-copy]");if(t)t.style.opacity=String(e)},Ct=(e,t)=>{if(B)return;let n=l.reg.get(e);if(n?.el.isConnected)M(n.plane.u,{alpha:t?1:te(n.el,ee.related).alpha},0.4,ve)},Ut=(e)=>{let t={p:0},n=Ve({axis:()=>"x",start:()=>!l.scrollLock&&kt()&&(l.navLock=!0),move:(o,r,a)=>{let i=-a/(Y()*0.8);if(t.p=q(0.4*i/(1+0.8*Math.abs(i)),-1,1),Math.abs(i)>0.25)return l.navLock=!1,e(i>0?1:-1),!0},end:()=>{l.navLock=!1,St()}});return l.scrubTick=(o)=>{if(B&&l.navLock)W.p+=(t.p-W.p)*Math.min(1,0.11*o);lt(o)},()=>{n(),l.scrubTick=null}},Ot=(e)=>{let t=w(e),n=e.cloneNode(!0);n.className+=" is-in",n.style.cssText=`position:fixed;left:${t.left}px;top:${t.top}px;width:${t.width}px;z-index:25;pointer-events:none;transition:opacity .35s;opacity:${e.style.opacity||1}`,document.body.append(n),requestAnimationFrame(()=>n.style.opacity="0"),setTimeout(()=>n.remove(),400)},It=(e)=>{let t=matchMedia("(prefers-reduced-motion: reduce)").matches,o=R("[data-compare]",e).map((f)=>({fig:f,vids:R("video",f),btn:y("[data-compare-toggle]",f),seen:!1,held:t})),r=(f)=>{let m=R("source[data-src]",f);if(!m.length)return;for(let T of m)T.src=T.dataset.src,delete T.dataset.src;f.preload="auto",f.load()},a=y("[data-theater]"),i=null,s=null,c=(f,m)=>{if(f.fig.toggleAttribute("data-playing",m),f.btn.setAttribute("aria-label",`${m?"Pause":"Play"} ${f.vids.length>1?"comparison":"demo"}`),f===i&&a)a.toggleAttribute("data-playing",m),y("[data-theater-toggle]",a).setAttribute("aria-label",m?"Pause":"Play");for(let T of f.vids)if(m)r(T),T.play().catch(()=>{});else T.pause()},u=(f)=>{let m=f.vids.at(-1),T=f.vids.slice(0,-1),U=()=>{for(let F of f.vids)F.currentTime=0;if(f.fig.hasAttribute("data-playing"))for(let F of f.vids)F.play().catch(()=>{})},S=()=>{for(let F of T)if(Math.abs(F.currentTime-m.currentTime)>0.15)F.currentTime=m.currentTime};return m.addEventListener("ended",U),m.addEventListener("timeupdate",S),()=>{m.removeEventListener("ended",U),m.removeEventListener("timeupdate",S)}},g=new IntersectionObserver((f)=>f.forEach((m)=>m.isIntersecting&&R("video",m.target).forEach(r)),{rootMargin:"50% 0px"}),d=new IntersectionObserver((f)=>f.forEach((m)=>{let T=o.find((U)=>U.fig===m.target);if(T.seen=m.isIntersecting,T!==i)c(T,T.seen&&!T.held)}),{threshold:0.35}),p=(f)=>{if(!a||i)return;let m=y("[data-compare-row]",f.fig);s=document.createElement("div"),s.style.height=`${m.offsetHeight}px`,m.replaceWith(s),m.toggleAttribute("data-stack-in-theater",f.fig.dataset.phone!=="1"),y("[data-theater-slot]",a).append(m),y("[data-theater-caption]",a).textContent=y("[data-compare-caption]",f.fig).textContent,i=f,a.showModal(),f.held=!1,c(f,!0)},b=()=>{let f=i;if(!f||!s||!a)return;let m=y("[data-compare-row]",a);m.removeAttribute("data-stack-in-theater"),s.replaceWith(m),s=null,i=null,a.removeAttribute("data-playing"),c(f,f.seen&&!f.held)},_=(f)=>f.stopPropagation(),h=["wheel","pointerdown","pointermove","pointerup","keydown"],E=(f)=>{let m=f.target;if(m.closest("[data-theater-close]")||m===a||m.matches("[data-theater-slot], [data-theater-slot] > [data-compare-row]"))a.close();else if(m.closest("[data-theater-toggle]")&&i)i.btn.click()};if(a){for(let f of h)a.addEventListener(f,_);a.addEventListener("click",E),a.addEventListener("close",b)}let L=o.map((f)=>{let m=u(f),T=()=>{f.held=f.fig.hasAttribute("data-playing"),c(f,!f.held)},U=y("[data-compare-theater]",f.fig),S=()=>p(f);return f.btn.addEventListener("click",T),U?.addEventListener("click",S),g.observe(f.fig),d.observe(f.fig),()=>{m(),f.btn.removeEventListener("click",T),U?.removeEventListener("click",S)}});return()=>{if(a){if(a.open)a.close();b();for(let f of h)a.removeEventListener(f,_);a.removeEventListener("click",E),a.removeEventListener("close",b)}g.disconnect(),d.disconnect(),L.forEach((f)=>f());for(let f of o)f.fig.style.transition="opacity .35s",f.fig.style.opacity="0",f.vids.forEach((m)=>m.pause())}},Dt=(e)=>{We(e);let t=w(e.el);ze(e,{...t,left:t.left+(t.left+t.width/2-Y()/2)})},it=(e)=>{getComputedStyle(e).opacity,e.classList.add("is-in")},ct=(e)=>{let t=y("main"),n=y("[data-panel]",t),o=y("[data-stack]",t),r=y("[data-copy]",t),a=y("[data-title-hero]",t),i=y("[data-ring]",t);if(Ne(()=>"y"),it(t),V()){let h=R('[data-gl="simple"]',o),E=h.length>=3?h.slice(1):h;for(let L=0;L<6&&E.length&&o.scrollHeight<n.clientHeight*1.15;L++)for(let f of E)o.append(f.cloneNode(!0))}let s=Be(o,n,{axis:()=>"y",lead:()=>k()?r:null,finite:()=>!V(),onVelocity:xe,onProgress:(h)=>i?.style.setProperty("--p",h.toFixed(4))});oe.add(s.vs),l.step=s.step;let c=It(o),u=(h)=>{if(l.pendingSlug)return;let E=R('[data-gl="related"]',t)[h>0?1:0]?.dataset.id;if(E)re(`/work/projects/${E}/`)},g=R('[data-gl="related"]',t).some((h)=>h.dataset.id)?Ut(u):()=>{},d=(h)=>{if(h.metaKey||h.ctrlKey||h.altKey||h.shiftKey||h.repeat||l.navLock)return;if(h.key==="ArrowRight")u(1);else if(h.key==="ArrowLeft")u(-1);else return;h.preventDefault()};window.addEventListener("keydown",d);let p=(h,E)=>{let L=h.target.closest("[data-lift]");if(L&&V())Ct(L.dataset.lift,E)},b=(h)=>p(h,!0),_=(h)=>p(h,!1);return t.addEventListener("pointerover",b),t.addEventListener("pointerout",_),(async()=>{await new Promise(requestAnimationFrame);for(let h of R('[data-gl="related"] a',t))Ee(new URL(h.href,location.href).pathname).then(be);if(v){l.hero=G(e,n),l.hero.plane.reflect=!1;for(let h of R('[data-gl="related"]',t)){if(!h.dataset.id)continue;if(l.reg.get(h.dataset.id))G(h.dataset.id,h);else Dt(G(h.dataset.id,h))}if(l.hero.landed)We(l.hero);Mt(a,e),R('[data-gl="simple"]',o).forEach((h,E)=>Ht(h,E,o.dataset.outlined==="1")),be()}s.measure(),_e()})(),window.addEventListener("resize",s.measure),{unmount:()=>{g(),c(),oe.delete(s.vs),l.step=null,window.removeEventListener("keydown",d),window.removeEventListener("resize",s.measure),t.removeEventListener("pointerover",b),t.removeEventListener("pointerout",_),l.lastSlug=e,At(),Pt(),Ot(r),r.style.opacity="",B=null,O(W),W.p=0,J=0}}},x={item:null,x:0,y:0,tx:0,ty:0,on:0,slug:null,panel:null,vx:0},Wt=(e)=>{if(!v||!x.panel)return;let t=e?.dataset.rail??null;if(e&&t&&t!==x.slug){let{src:n="",w:o="1",h:r="1"}=e.dataset;if(Object.assign(x.panel.dataset,{id:t,src:n,w:o,h:r}),x.panel.style.aspectRatio=`${o} / ${r}`,x.panel.style.width="auto",x.item){l.reg.delete(x.item.id);let i=x.item.plane;M(i.u,{alpha:0},0.25,C,0,()=>v.planes.delete(i))}let a=G(t,x.panel);Object.assign(a.plane.u,{shade:0,sheetP:0,reveal:0,corner:de(x.panel,w(x.panel))}),a.plane.order=P.content,a.landed=!1,x.item=a,x.slug=t}if(M(x,{on:t?1:0},t?0.7:0.4),!t)x.slug=null},zt=(e,t)=>{if(!x.panel?.isConnected||!x.item)return;let n=Math.min(1,0.12*t),o=x.x;x.x+=(x.tx-x.x)*n,x.y+=(x.ty-x.y)*n,x.vx=ge(x.vx,(x.x-o)/Math.max(e,0.008333333333333333),0.15,t);let r=w(x.panel),a={left:x.x-r.width/2,top:x.y-r.height/2,width:r.width,height:r.height},i=v.pose(a),s=x.item.plane;s.pos=i.pos,s.scale=i.scale,s.u.sheet=null,s.u.reveal=x.on,s.u.alpha=1,s.u.rotY=q(-x.vx/4000,-0.35,0.35),s.u.bulgeA=l.bulge,s.u.bulgeH=l.bulgeH,x.item.from=x.item.vrect=a,x.item.landed=!1},ut=()=>{let e=y("main"),t=R(".work-reveal",e);t.forEach((s,c)=>s.style.setProperty("--d",`${(0.4+Math.min(c*0.03,0.55)).toFixed(3)}s`)),it(e),l.hero=null,l.lastSlug=null,Object.assign(x,{panel:y("[data-rail-panel]",e),item:null,slug:null,on:0});let n=(s)=>{if(!V())return;if(x.tx=s.clientX,x.ty=s.clientY,!x.item)x.x=s.clientX,x.y=s.clientY},o=(s,c)=>{let u=s.target.closest("[data-rail]");if(u&&V())Wt(c?u:null)},r=(s)=>o(s,!0),a=(s)=>o(s,!1);e.addEventListener("pointermove",n),e.addEventListener("pointerover",r),e.addEventListener("pointerout",a),l.railTick=zt,qe(Math.min(t.length*0.03,0.55)),_e(),xe(0);let i=(s)=>{if(s.key!=="ArrowDown"&&s.key!=="ArrowUp"||s.metaKey||s.ctrlKey||s.altKey||l.navLock)return;let c=R("a[data-open]",e);if(!c.length)return;s.preventDefault();let u=c.indexOf(document.activeElement),g=u<0?s.key==="ArrowDown"?0:c.length-1:(u+(s.key==="ArrowDown"?1:-1)+c.length)%c.length;c[g].focus()};return window.addEventListener("keydown",i),{unmount:()=>{if(window.removeEventListener("keydown",i),e.removeEventListener("pointermove",n),e.removeEventListener("pointerover",r),e.removeEventListener("pointerout",a),l.railTick=null,x.item&&x.slug!==l.pendingSlug){let s=x.item.plane;l.reg.delete(x.item.id),M(s.u,{alpha:0},0.3,C,0,()=>v.planes.delete(s))}x.item=null,x.panel=null}}},D=null,X=(e,t=!1,n=!1)=>{qt();let o=D;if(D=t?e:D===e?null:e,o==="profile"&&D!=="profile")dispatchEvent(new Event("sh:profile-closed"));if(v&&!v.progs.hole)v.progs.hole=v.program(Je,at);for(let a of R("[data-overlay]")){let i=a.dataset.overlay===D;a.toggleAttribute("inert",!i),a.classList.toggle("is-in",i)}for(let a of R("[data-toggle]"))a.setAttribute("aria-expanded",String(a.dataset.toggle===D));if(v&&n)O(v.hole,["p"]),v.hole.p=D?1:0;else if(v)M(v.hole,{p:D?1:0},D?0.85:0.65,Q);let r=y("main");if(r)r.style.pointerEvents=D?"none":""},st=!1,qt=()=>{let e=y("[data-newsletter]");if(st||!e)return;st=!0,e.addEventListener("submit",(t)=>{t.preventDefault();let n=e.elements.namedItem("email"),o=y("[data-status]",e.parentElement);if(!n.validity.valid||!n.value)return void(o.textContent="That address does not look right.");location.href=`mailto:contact@blackbao.studio?subject=Newsletter&body=${encodeURIComponent(`Please add ${n.value} to the list.`)}`,o.textContent="Opening your mail app to finish the request."})};var I=document,N=I.documentElement;if(matchMedia("(prefers-reduced-motion: reduce)").matches)rt(0);var k=()=>N.clientWidth<=649,V=()=>matchMedia("(hover: hover) and (pointer: fine)").matches,Y=()=>N.clientWidth,pe=()=>N.clientHeight,w=(e)=>{let t=e.getBoundingClientRect();return{left:t.left,top:t.top,width:t.width,height:t.height}},y=(e,t=I)=>t.querySelector(e),R=(e,t=I)=>[...t.querySelectorAll(e)],ce=(e,t,n)=>({left:H(e.left,t.left,n),top:H(e.top,t.top,n),width:H(e.width,t.width,n),height:H(e.height,t.height,n)}),M=(e,t,n,o=z,r=0,a)=>Ce(e,t,{dur:n,ease:o,delay:r,onComplete:a}),A={flight:1,stack:{at:0.25,dur:1.25,stagger:0.1,rise:0.5},title:{dur:1.25,out:0.25},cards:{at:0.1,dur:1.25,stagger:0.05,from:0.5,hover:0.5},intro:{at:0.125,step:0.06},hud:0.7},j={title:0.75,cards:1.15,stack:0.9,ground:0.9,flight:1.5,stagger:0.05},Nt=0.3,ee={card:{white:0,alpha:1,shade:1,sheet:1,tilted:!0,order:P.card},sheet:{white:1,alpha:1,shade:0,sheet:0,tilted:!1,order:P.sheet},related:{white:1,alpha:Nt,shade:0,sheet:0,tilted:!1,order:P.sheet},bar:{white:1,alpha:1,shade:0,sheet:0,tilted:!1,order:P.sheet},rail:{white:0,alpha:1,shade:0,sheet:0,tilted:!1,order:P.content}},v=null;try{v=new Ae(y("[data-gl-root]")),N.classList.add("gl-on")}catch{v=null}var l={reg:new Map,cards:[],texts:[],pills:[],content:[],hero:null,titleHero:null,titleFly:null,pendingTitle:null,lastSlug:null,pendingSlug:null,vel:0,bulge:0,bulgeH:0,bootChoreo:!1,ground:{alpha:0},hudA:{v:0},navLock:!1,scrollLock:!1,swallow:!1,scrubTick:null,railTick:null,step:null,vrects:new Map},ye=document.querySelector('img[fetchpriority="high"]'),Vt=ye&&!ye.complete?new Promise((e)=>{ye.addEventListener("load",()=>e(),{once:!0}),ye.addEventListener("error",()=>e(),{once:!0})}):Promise.resolve(),Ye=new Map,ht=(e,t,n)=>{let o=Ye.get(e);if(o||!v)return o;let r=v,a=r.texture(new Uint8Array([0,0,0,0]),1,1),i=new Image,s={tex:a,size:[t,n],ready:new Promise((c)=>{i.onload=()=>{r.upload(a,i),s.size=[i.naturalWidth,i.naturalHeight],c()},i.onerror=()=>c()})};return Vt.then(()=>i.src=e.replace(/\.jpg$/,innerWidth*devicePixelRatio<=1100?"-800.webp":".webp")),Ye.set(e,o=s),o},be=(e=I)=>{for(let t of R("[data-gl][data-src]",e))if(t.dataset.src)ht(t.dataset.src,+(t.dataset.w||1),+(t.dataset.h||1))},ue=()=>({W:v.W,H:v.H}),Le=()=>{if(!v||k())return null;let{W:e,H:t}=ue(),n=Math.min(1,Math.abs(l.vel));return{W:e,H:t,D:e*0.2*(1+1.1*n),V:n,T:1.15,C:1,S:1,A:e*-0.12}},Gt=(e)=>{let t=Math.tanh(e/(k()?245:550));l.vel=t*Math.abs(t)},xe=(e)=>{if(!v)return;let t=Math.tanh(e/(k()?500:900));l.bulge=t*Math.abs(t)*0.22*v.H,l.bulgeH=v.H},te=(e,t)=>{let n=getComputedStyle(e),o={...t,wash:null},r=parseFloat(n.opacity);if(Number.isFinite(r))o.alpha=r;let a=n.backgroundColor.match(/[\d.]+/g);if(a&&a.length>=3&&(a.length<4||+a[3]>0))o.white=a.length>3?+a[3]:1,o.wash=[+a[0]/255,+a[1]/255,+a[2]/255];return o},de=(e,t)=>t.height?(parseFloat(getComputedStyle(e).borderRadius)||0)/t.height:0,Me=(e)=>e.dataset.gl||"card",$e=(e)=>ee[Me(e)]||ee.card,mt=(e,t,n)=>({kind:"image",tex:e,size:t,pos:[0,0,0],scale:[1,1],order:n,u:et(),c0:[1,1,1],c1:[1,1,1],ink:0,inkOn:1,slide:0,reflect:!1,hidden:!1}),De=(e,t,n)=>{let o=ht(e,t,n),r=mt(o.tex,o.size,P.card);return v.planes.add(r),o.ready.then(()=>r.size=o.size),r},Ze=(e,t,n)=>{let o=v.pose(t);e.plane.pos=[o.pos[0]+e.ox,o.pos[1],e.oz],e.plane.scale=o.scale,e.plane.u.sheet=n},We=(e)=>{let t=te(e.el,$e(e.el)),n=e.plane.u,o=w(e.el);if(t.wash)n.wash=t.wash;n.white=t.white,n.shade=t.shade,n.sheetP=t.sheet,n.corner=de(e.el,o),n.alpha=t.alpha,e.plane.order=t.order,Ze(e,o,t.tilted?Le():null)},ze=(e,t)=>{let{plane:n,el:o}=e,r=te(o,$e(o)),a=n.u;if(r.wash)a.wash=r.wash;O(a,["alpha"]),M(a,{hover:0},A.cards.hover),n.order=Me(o)==="related"?P.flipSide:P.flip;let i={white:a.white,alpha:a.alpha,shade:a.shade,sheetP:a.sheetP,pos:[...n.pos],scale:[...n.scale]},s=w(o),c=a.corner*(t.height||s.height),u=de(o,s)*s.height,g=A.flight,d=0,p=Q;if(e.boot!==void 0)g=j.flight,d=e.boot*j.stagger,p=ot,delete e.boot;e.landed=!1,ie(g,p,(b)=>{if(!o.isConnected)return;if(r.tilted){let _=v.pose(e.vrect??w(o));n.pos=[H(i.pos[0],_.pos[0]+e.ox,b),H(i.pos[1],_.pos[1],b),H(i.pos[2],e.oz,b)],n.scale=[H(i.scale[0],_.scale[0],b),H(i.scale[1],_.scale[1],b)],a.sheet=Le()}else{let _=v.pose(ce(t,w(o),b));n.pos=_.pos,n.scale=_.scale,a.sheet=null}a.white=H(i.white,r.white,Math.min(1,b*1.08)),a.alpha=H(i.alpha,r.alpha,b),a.shade=H(i.shade,r.shade,b),a.sheetP=H(i.sheetP,r.sheet,b),a.corner=H(c,u,b)/Math.max(H(t.height||s.height,s.height,b),1)},d,()=>{e.landed=!0,n.order=r.order})},Xt=(e)=>{l.reg.delete(e.id),l.cards=l.cards.filter((r)=>r!==e);let{plane:t}=e,n=()=>v.planes.delete(t);if(Me(e.el)!=="related")return void M(t.u,{alpha:0},0.5,C,0,n);let o=t.pos[0];ie(A.flight,Q,(r)=>t.pos[0]=o*(1+r),0,n)},G=(e,t,n=t)=>{let o=l.reg.get(e);if(!o){let r=De(n.dataset.src||"",+(n.dataset.w||1),+(n.dataset.h||1));o={id:e,el:t,plane:r,from:t.isConnected?w(t):null,landed:!0,ox:0,oz:0},l.reg.set(e,o)}else if(o.el!==t){let r=o.from;if(o.el=t,o.vrect=void 0,r)ze(o,r);else o.landed=!0}return o},Yt=()=>{for(let e of l.reg.values()){if(e.el.isConnected){if(e.landed)e.from=e.vrect??w(e.el);continue}let t=y(`[data-id="${CSS.escape(e.id)}"]`);if(t)G(e.id,t);else Xt(e)}},we=(e,t,n=w(e))=>{let{tex:o,colour:r}=se(v,e,n),a=mt(o,[n.width,n.height],t);a.kind="text",a.inkOn=r?0:1,a.c0=a.c1=me(getComputedStyle(e).color),v.planes.add(a);let i=v.pose(n);return a.pos=i.pos,a.scale=i.scale,{plane:a,el:e,progress:1,cssAlpha:parseFloat(getComputedStyle(e).opacity)||1}},ne=(e,t=A.title.out)=>M(e.plane.u,{alpha:0},t,C,0,()=>v.planes.delete(e.plane)),Ge=(e,t,n)=>{let o=v.pose(t);e.plane.pos=o.pos,e.plane.scale=o.scale,e.plane.u.sheet=n,e.plane.slide=1-z(e.progress)},vt=(e)=>{let t=w(e.el),n=w(e.card);e.off={dx:t.left-n.left,dy:t.top-n.top,w:t.width,h:t.height,cw:n.width}},qe=(e)=>M(l.hudA,{v:1},A.hud,C,e),_e=()=>l.bootChoreo=!1,Kt=async(e)=>{if(I.fonts.status!=="loaded")await I.fonts.ready;for(let a of e){if(!a.isConnected)continue;for(let[i,s,c]of[["[data-title]",l.texts,1],["[data-pill-arrow]",l.pills,V()?0:1]]){let u=we(y(i,a),P.caption);u.card=a,u.slug=a.dataset.id,vt(u),u.plane.u.alpha=c,s.push(u)}}let t=(a)=>a.card.getBoundingClientRect().left,n=l.texts.filter((a)=>a.el.isConnected).sort((a,i)=>t(a)-t(i)),o=Math.max(0,n.findIndex((a)=>t(a)>-1&&t(a)<Y())),r=l.bootChoreo?j.title:A.intro.at;n.forEach((a,i)=>{a.progress=0,M(a,{progress:1},A.title.dur,ke,r+Math.max(i-o,0)*A.intro.step)}),qe(r),_e()},gt=(e,t)=>M(l.ground,{alpha:e?0.9:0},e?1.1:0.45,e?ve:C,t??(e?0.15:0)),jt=(e)=>e.left<Y()&&e.left+e.width>0&&e.top<pe()&&e.top+e.height>0,$t=(e,t,n=A.cards.from)=>{let{W:o}=ue(),r=t?w(t.el).left:null,a=l.bootChoreo?j.cards:A.cards.at;e.filter((i)=>i.landed&&jt(w(i.el))).map((i)=>({c:i,d:r===null?0:w(i.el).left-r})).sort((i,s)=>Math.abs(i.d)-Math.abs(s.d)).forEach(({c:i,d:s},c)=>{O(i),i.ox=Math.sign(s||1)*o*n,i.plane.u.alpha=0,M(i,{ox:0},A.cards.dur,z,a+c*A.cards.stagger),M(i.plane.u,{alpha:1},A.cards.dur*0.5,C,a+c*A.cards.stagger)})},Zt=()=>{l.vel=0;for(let e of[...l.texts,...l.pills])if(e!==l.pendingTitle)ne(e);l.texts=[],l.pills=[];for(let e of l.cards)O(e);l.cards=[],gt(!1)},Qt=(e,t)=>{if(!V())return;let n=l.reg.get(e);if(n)M(n.plane.u,{hover:t?1:0},A.cards.hover);let o=l.pills.find((r)=>r.slug===e);if(o)M(o.plane.u,{alpha:t?1:0},t?1:0.75)},Jt=()=>{let e=v.floor,t=l.cards[0];if(e.on=!k()&&!!t?.el.isConnected,e.alpha=l.ground.alpha,!e.on)return;let n=Le(),o=v.pose(t.vrect??w(t.el));e.leanA=n.A,e.leanW=n.W;let r=o.pos[1]-o.scale[1]/2-n.H*0.06,a=n.H*6,i=41.18,s=Math.min(i*(1-Math.abs(r)/n.H)+n.H*0.2,i*0.8),c=n.W*8;e.scale=[c,s+a],e.pos=[0,r,(s-a)/2],e.run=a;let u=n.H*0.22;e.gridF=[c/u,a/u],e.refl=l.ground.alpha>0.01?0.5:0;let g=r-n.H*0.07;e.reflY=2*g,e.reflLX=-n.W*0.6;let d=v.proj,p=e.reflVP;p.set(d);for(let b=0;b<4;b++)p[12+b]=d[12+b]+d[4+b]*-2*g+d[8+b]*-i},Xe=(e)=>{if(!e)return null;let t=v.screenRect(e.plane);return{clip:new Float32Array([t.left,t.top,t.width,t.height]),r:e.plane.u.corner*t.height}},dt=(e,t)=>{l.step?.(t);let n=y("[data-hud]");if(n)n.style.opacity=String(l.hudA.v);if(!v)return;Yt();let o=Le();for(let s of l.reg.values()){if(!s.landed||!s.el.isConnected)continue;let c=Me(s.el);if(Ze(s,s.vrect??w(s.el),$e(s.el).tilted?o:null),s.plane.u.scrim=c==="card"?1:0,s.plane.reflect=c==="card",c==="sheet")s.plane.u.bulgeA=l.bulge,s.plane.u.bulgeH=l.bulgeH}l.scrubTick?.(t);let r=Xe(l.hero);for(let s of[...l.texts,...l.pills]){if(!s.card?.isConnected)continue;let c=l.cards.find((d)=>d.el===s.card),u=c?.vrect??w(s.card);if(s.off.cw!==u.width)vt(s),se(v,s.el,w(s.el),s.plane.tex);let g=s.off;if(Ge(s,{left:u.left+g.dx,top:u.top+g.dy,width:g.w,height:g.h},o),c)s.plane.pos[0]+=c.ox,s.plane.pos[2]=c.oz;s.plane.u.bulgeA=k()?l.bulge:0,s.plane.u.bulgeH=l.bulgeH}if(l.titleFly)Ge(l.titleFly.t,l.titleFly.t.flightRect??w(l.titleFly.t.el),null);let a=l.titleHero;if(a?.el.isConnected){Ge(a,w(a.el),null),a.plane.u.bulgeA=l.bulge,a.plane.u.bulgeH=l.bulgeH;let s=a.sheet?Xe(a.sheet):r;a.plane.u.clip=s?.clip??null,a.plane.u.clipR=s?.r??0}let{H:i}=ue();for(let s of l.content){let c=s.sheet&&s.sheet!==l.hero?Xe(s.sheet):r;if(s.plane.u.clip=c?.clip??null,s.plane.u.clipR=c?.r??0,!s.el.isConnected)continue;if(s.plane.hidden=!!s.el.dataset.parked,s.plane.hidden)continue;let u=v.pose(l.vrects.get(s.el)??w(s.el));s.plane.pos=[u.pos[0],u.pos[1]-(1-s.p)*i*A.stack.rise,0],s.plane.scale=u.scale,s.plane.u.alpha=s.p,s.plane.u.bulgeA=l.bulge,s.plane.u.bulgeH=l.bulgeH}l.railTick?.(e,t),Jt(),v.dim=1-0.6*v.hole.p,v.render(e)},oe=new Set,Re=(e)=>oe.forEach((t)=>t(e)),en=100,Be=(e,t,n)=>{let o={t:0,c:0},r=[],a=0,i=0,s=0,c=null,u=()=>n.axis()==="x",g=()=>{let h=n.lead?.()??null,E=[...h?[h]:[],...e.children];for(let S of E)S.style.transform="",delete S.dataset.parked;let L=w(t),f=u();s=f?L.width:L.height;let m=f?L.left:L.top;if(r=E.map((S)=>{let F=w(S),Qe=(f?F.left:F.top)-m;return{el:S,start:Qe-s,end:Qe+(f?F.width:F.height),base:F}}),!r.length)return;let T=getComputedStyle(e),U=parseFloat(f?T.columnGap:T.rowGap)||0;if(a=f?r[r.length-1].end+U-(r[0].start+s):e.scrollHeight+U+(h?w(e).top-w(h).top:0),i=Math.max(0,Math.max(...r.map((S)=>S.end))+(parseFloat(T.paddingBottom)||0)-s),n.finite?.())o.t=q(o.t,0,i),o.c=q(o.c,0,i);if(c!==null)_(c);else d(!0)},d=(h=!1)=>{if(a<=0)return;let E=u(),L=n.finite?.()||a<=s,f=s*(E?0.5:0.25);for(let m of r){let T=L?o.c:Ue(-(a-m.end),m.end,o.c),U=h||T>m.start-f&&T<m.end+f,S={left:m.base.left-(E?T:0),top:m.base.top-(E?0:T),width:m.base.width,height:m.base.height};if(m.el.style.transform=E?`translate3d(${-T}px,0,0)`:`translate3d(0,${-T}px,0)`,l.vrects.set(m.el,S),U)delete m.el.dataset.parked;else m.el.dataset.parked="1";let F=l.reg.get(m.el.dataset.id||"");if(F)F.vrect=S}},p=({dy:h,dx:E})=>{if(l.navLock||!n.finite?.()&&a<=s)return;if(n.finite?.())o.t=q(o.t+h,0,i);else if(u())o.t+=h+E,o.t=o.c+Math.tanh((o.t-o.c)/s)*s;else o.t+=h},b=(h)=>{o.c=Math.round(ge(o.c,o.t,0.1,Math.min(h,2))*100)/100,n.onVelocity(o.t-o.c),n.onProgress?.(n.finite?.()?i>0?q(o.c/i,0,1):0:a>0?Ue(0,a,o.c)/a:0),d()},_=(h)=>{let E=r[h+(n.lead?.()?1:0)];if(!E)return;let L=(E.start+E.end)/2-(u()?0:en/2);if(n.finite?.())L=q(L,0,i);c=h,o.t=o.c=L,d(!0)};return{measure:g,center:_,vs:p,step:b,idx:(h)=>r.findIndex((E)=>E.el.dataset.id===h)}},bt=()=>"x",he="x",Ne=(e)=>bt=e;window.addEventListener("wheel",(e)=>{if(e.ctrlKey)return;e.preventDefault();let t=e.deltaMode===1?16:e.deltaMode===2?pe():1;Re({dy:e.deltaY*t,dx:e.deltaX*t})},{passive:!1});var Ke=0,Z=0,xt=0,Te=!1;window.addEventListener("pointerdown",(e)=>{if(e.pointerType!=="touch")return;Te=!0,he=bt(),Ke=he==="y"?e.clientY:e.clientX,Z=0});window.addEventListener("pointermove",(e)=>{if(e.pointerType!=="touch"||!Te)return;let t=he==="y"?e.clientY:e.clientX;Z=(Ke-t)*1.5,Ke=t,xt=e.timeStamp,Re(he==="y"?{dy:Z,dx:0}:{dy:0,dx:Z})});var wt=(e)=>{if(e.pointerType!=="touch"||!Te)return;if(Te=!1,Z&&e.timeStamp-xt<100)Re(he==="y"?{dy:Z*12,dx:0}:{dy:0,dx:Z*12})};window.addEventListener("pointerup",wt);window.addEventListener("pointercancel",wt);window.addEventListener("click",(e)=>{if(!l.swallow)return;l.swallow=!1,e.preventDefault(),e.stopPropagation()},!0);var Ve=(e)=>{let t=0,n=0,o=0,r=!1,a=!1,i=(p)=>e.axis()==="x"?p.clientX:p.clientY,s=(p,b)=>{if(r=!1,a)a=!1,N.classList.remove("grabbing"),e.end(p,b);window.removeEventListener("pointermove",c),window.removeEventListener("pointerup",u),window.removeEventListener("pointercancel",g)},c=(p)=>{if(!a){let h=Math.abs(p.clientX-t),E=Math.abs(p.clientY-n),[L,f]=e.axis()==="x"?[h,E]:[E,h];if(L<=10||L<=f)return;if(!e.start())return s(p,!1);a=!0,N.classList.add("grabbing"),o=i(p)}p.preventDefault(),l.swallow=!0;let b=i(p),_=e.move(p,o-b,e.axis()==="x"?p.clientX-t:p.clientY-n);if(o=b,_)a=!1,N.classList.remove("grabbing"),s(p,!1)},u=(p)=>s(p,!0),g=(p)=>s(p,!1),d=(p)=>{if(r||p.button!==0||p.pointerType!=="mouse")return;t=p.clientX,n=p.clientY,r=!0,l.swallow=!1,window.addEventListener("pointermove",c,{passive:!1}),window.addEventListener("pointerup",u),window.addEventListener("pointercancel",g)};return window.addEventListener("pointerdown",d),N.classList.add("grabbable"),()=>{s(null,!1),window.removeEventListener("pointerdown",d),N.classList.remove("grabbable")}},tn=(e)=>{let t=0,n=0,o=(r)=>Re(e()==="x"?{dy:0,dx:r}:{dy:r,dx:0});return Ve({axis:e,start:()=>!l.navLock&&(l.scrollLock=!0),move:(r,a)=>{if(t=a*1.5,n=r.timeStamp,t)o(t)},end:(r,a)=>{if(l.scrollLock=!1,a&&t&&r&&r.timeStamp-n<100)o(t*12)}})};window.addEventListener("click",(e)=>{let t=e.target.closest("[data-toggle]");if(t)X(t.dataset.toggle)});window.addEventListener("keydown",(e)=>{if(e.key==="Escape")return X(null);let t=e.target;if(e.metaKey||e.ctrlKey||e.altKey||e.repeat||l.navLock||t.closest?.("input, textarea"))return;let n=e.key.toLowerCase();if(n==="n"&&!y('[data-toggle="newsletter"]')?.hidden)X("newsletter");else if(n==="f"&&ae?.view!=="project")re(ae?.view==="full"?"/work/":"/work/full/");else return;e.preventDefault()});window.addEventListener("sh:profile",(e)=>X(e.detail?"profile":null,!0));window.addEventListener("sh:leave",()=>X(null,!0,!0));var ae=null,fe=null,nn=()=>{let e=y("main"),t=y("[data-track]",e),n=R('[data-gl="card"]',t),o=l.hero?.id??l.lastSlug;l.lastSlug=null,l.hero=null,Ne(()=>k()?"y":"x");let r=(d,p)=>{let b=d.target.closest('[data-gl="card"]');if(b&&!b.contains(d.relatedTarget))Qt(b.dataset.id,p)},a=(d)=>r(d,!0),i=(d)=>r(d,!1);t.addEventListener("pointerover",a),t.addEventListener("pointerout",i);let s=Be(t,e,{axis:()=>k()?"y":"x",onVelocity:(d)=>k()?xe(d):Gt(d)});oe.add(s.vs),l.step=s.step;let c=n.length>1?tn(()=>k()?"y":"x"):()=>{};(async()=>{if(v){l.cards=n.map((d)=>G(d.dataset.id,d));for(let d of l.cards)d.ox=d.oz=0}if(s.measure(),s.center(Math.max(0,s.idx(o||""))),!v)return;$t(l.cards,l.cards.find((d)=>d.id===o)??null,k()?0:void 0),gt(!0,l.bootChoreo?j.ground:void 0),await Kt(n),be()})(),window.addEventListener("resize",s.measure);let u=()=>{let d=k()?pe()/2:Y()/2,p=null,b=1/0;for(let _ of n){let h=l.vrects.get(_)??w(_),E=k()?h.top+h.height/2:h.left+h.width/2;if(Math.abs(E-d)<b)b=Math.abs(E-d),p=_}return p},g=(d)=>{if(d.metaKey||d.ctrlKey||d.altKey||d.repeat||l.navLock)return;let p=d.key==="ArrowRight"||d.key==="ArrowDown",b=d.key==="ArrowLeft"||d.key==="ArrowUp",_=u();if(!_)return;if(p||b){let h=n.indexOf(_),E=n[(h+(p?1:-1)+n.length)%n.length],L=l.vrects.get(_)??w(_),f=l.vrects.get(E)??w(E),m=k()?f.top+f.height/2-(L.top+L.height/2):f.left+f.width/2-(L.left+L.width/2);s.vs(k()?{dy:m,dx:0}:{dy:0,dx:m})}else if(d.key==="Enter"&&!d.target.closest?.("a, button, input")){let h=_.dataset.id;Ie(h),re(`/work/projects/${h}/`)}else return;d.preventDefault()};return window.addEventListener("keydown",g),{unmount:()=>{c(),window.removeEventListener("keydown",g),oe.delete(s.vs),l.step=null,window.removeEventListener("resize",s.measure),t.removeEventListener("pointerover",a),t.removeEventListener("pointerout",i),Zt()}}},_t=(e)=>{let t=e.match(/^\/work\/projects\/([^/]+)\/?$/);if(t)return{view:"project",slug:t[1]};if(/^\/work\/full\/?$/.test(e))return{view:"full"};if(/^\/work\/newsletter\/?$/.test(e))return{view:"newsletter"};return{view:"featured"}},ft=new Map,Ee=(e)=>{let t=ft.get(e);if(!t)ft.set(e,t=fetch(e).then(async(n)=>new DOMParser().parseFromString(await n.text(),"text/html")));return t},on=(e)=>{let t=y("[data-hud]");t.toggleAttribute("inert",e==="project");for(let n of R("[data-view-link]",t)){let o=n.dataset.viewLink===(e==="full"?"full":"featured");n.classList.toggle("opacity-50",!o),n.classList.toggle("opacity-100",o),n.toggleAttribute("aria-current",o)}M(l.hudA,{v:e==="project"?0:1},0.3,C)},je=(e,t)=>{if(t){let n=t.querySelector("main");if(!n)return;y("main").replaceWith(I.importNode(n,!0)),I.title=t.title}if(e.view==="project")fe=ct(e.slug);else if(e.view==="full")fe=ut();else fe=nn();if(e.view==="newsletter")X("newsletter",!0);else if(e.view==="project")X(null);on(e.view),ae=e,l.pendingSlug=null},pt=0,re=async(e,t=!0)=>{let n=_t(e);if(ae&&ae.view===n.view&&ae.slug===n.slug)return;let o=++pt;if(l.pendingSlug=n.slug??null,t)history.pushState(null,"",e);let r=await Ee(e);if(o!==pt)return;fe?.unmount(),fe=null,je(n,r)};window.addEventListener("popstate",()=>re(location.pathname,!1));window.addEventListener("pointerover",(e)=>{let t=e.target.closest("a[href^='/work']");if(!t||t.target)return;Ee(new URL(t.href,location.href).pathname)});window.addEventListener("click",(e)=>{let t=e.target.closest("a[href]");if(!t||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||t.target==="_blank")return;let n=new URL(t.href,location.href);if(n.origin!==location.origin||!n.pathname.startsWith("/work"))return;if(e.preventDefault(),l.navLock)return;if(t.dataset.open)Ie(t.dataset.open,t.dataset.rail?t:void 0);re(n.pathname)});var Et=async()=>{let e=_t(location.pathname),t=y("[data-cover]"),n=y("[data-loader]");if(!v)return t.remove(),n.remove(),Fe(dt),je(e,null);let o=v,r=()=>o.resize(Y(),pe());r(),window.addEventListener("resize",r),Fe(dt),await new Promise(requestAnimationFrame);let a=R('[data-gl="bar"]',n),i=(k()?pe():Y())/2,s=R("[data-id][data-src]").filter((d)=>["card","sheet","related"].includes(d.dataset.gl||"")&&d.dataset.src).map((d)=>{let p=w(d);return{el:d,id:d.dataset.id,c:k()?p.top+p.height/2:p.left+p.width/2}}).filter((d,p,b)=>b.findIndex((_)=>_.id===d.id)===p).sort((d,p)=>Math.abs(d.c-i)-Math.abs(p.c-i)).slice(0,a.length).sort((d,p)=>d.c-p.c),c=s[Math.floor((s.length-1)/2)];if(c?.el.dataset.gl==="card")l.lastSlug=c.id;let u=s.map((d,p)=>{let b=G(d.id,a[p],d.el);b.boot=p;let _=b.plane.u;return _.corner=de(a[p],w(a[p])),_.shade=0,_.sheetP=0,_.white=1,_.alpha=0,Ze(b,w(a[p]),null),M(_,{alpha:1},0.4,C),Ye.get(d.el.dataset.src||"")?.ready});t.style.opacity="0";let g=performance.now();await Promise.race([Promise.all(u),new Promise((d)=>setTimeout(d,2500))]),await new Promise((d)=>setTimeout(d,Math.max(0,900-(performance.now()-g)))),t.remove(),l.bootChoreo=!0,je(e,null),setTimeout(()=>n.remove(),2000)};Et();
