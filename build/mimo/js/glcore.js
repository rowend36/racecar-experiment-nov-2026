/* MIMO VELOCITY — WebGL2 core wrapper
   Fixed attribute locations shared by every shader:
     0 aPosition (vec3)  1 aNormal (vec3)  2 aUv (vec2)
     3 aColor (vec4)     4 aExtra (vec4)
     5..8  aI0..aI3 (per-instance mat4 columns)
     9     aIExtra (per-instance vec4) */
window.MIMO = window.MIMO || {};
(function (M) {
'use strict';

const GLC = {};
M.gl = GLC;

// ---------------- Program ----------------
function Program(gl, vsSrc, fsSrc, name) {
  this.gl = gl; this.name = name || 'prog';
  const vs = compile(gl, gl.VERTEX_SHADER, vsSrc, this.name + '.vs');
  const fs = compile(gl, gl.FRAGMENT_SHADER, fsSrc, this.name + '.fs');
  const p = gl.createProgram();
  gl.attachShader(p, vs); gl.attachShader(p, fs);
  // bind fixed attribute locations before linking
  gl.bindAttribLocation(p, 0, 'aPosition');
  gl.bindAttribLocation(p, 1, 'aNormal');
  gl.bindAttribLocation(p, 2, 'aUv');
  gl.bindAttribLocation(p, 3, 'aColor');
  gl.bindAttribLocation(p, 4, 'aExtra');
  gl.bindAttribLocation(p, 5, 'aI0');
  gl.bindAttribLocation(p, 6, 'aI1');
  gl.bindAttribLocation(p, 7, 'aI2');
  gl.bindAttribLocation(p, 8, 'aI3');
  gl.bindAttribLocation(p, 9, 'aIExtra');
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    throw new Error('Link error [' + this.name + ']: ' + gl.getProgramInfoLog(p));
  }
  gl.deleteShader(vs); gl.deleteShader(fs);
  this.p = p;
  this._u = new Map();
}
function compile(gl, type, src, label) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s);
    const lines = src.split('\n').map((l, i) => (i + 1) + ': ' + l).join('\n');
    console.error('Shader compile failed [' + label + ']\n' + log + '\n--- source ---\n' + lines);
    throw new Error('Shader compile failed [' + label + ']: ' + log);
  }
  return s;
}
Program.prototype.use = function () { this.gl.useProgram(this.p); return this; };
Program.prototype.loc = function (n) {
  let l = this._u.get(n);
  if (l === undefined) { l = this.gl.getUniformLocation(this.p, n); this._u.set(n, l); }
  return l;
};
Program.prototype.i = function (n, v) { const l = this.loc(n); if (l) this.gl.uniform1i(l, v); return this; };
Program.prototype.f = function (n, v) { const l = this.loc(n); if (l) this.gl.uniform1f(l, v); return this; };
Program.prototype.v2 = function (n, x, y) { const l = this.loc(n); if (l) this.gl.uniform2f(l, x, y); return this; };
Program.prototype.v3 = function (n, x, y, z) { const l = this.loc(n); if (l) this.gl.uniform3f(l, x, y, z); return this; };
Program.prototype.v4 = function (n, x, y, z, w) { const l = this.loc(n); if (l) this.gl.uniform4f(l, x, y, z, w); return this; };
Program.prototype.m4 = function (n, m) { const l = this.loc(n); if (l) this.gl.uniformMatrix4fv(l, false, m); return this; };
Program.prototype.m3 = function (n, m) { const l = this.loc(n); if (l) this.gl.uniformMatrix3fv(l, false, m); return this; };
Program.prototype.fv = function (n, arr) { const l = this.loc(n); if (l) this.gl.uniform1fv(l, arr); return this; };
Program.prototype.v3a = function (n, arr) { const l = this.loc(n); if (l) this.gl.uniform3fv(l, arr); return this; };
Program.prototype.v4a = function (n, arr) { const l = this.loc(n); if (l) this.gl.uniform4fv(l, arr); return this; };
Program.prototype.tex = function (n, unit, tex) {
  const gl = this.gl, l = this.loc(n);
  if (!l) return this;
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.uniform1i(l, unit);
  return this;
};
Program.prototype.cube = function (n, unit, tex) {
  const gl = this.gl, l = this.loc(n);
  if (!l) return this;
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex);
  gl.uniform1i(l, unit);
  return this;
};

// ---------------- Mesh ----------------
function Mesh(gl, opts) {
  this.gl = gl;
  this.mode = opts.mode !== undefined ? opts.mode : gl.TRIANGLES;
  this.vao = gl.createVertexArray();
  gl.bindVertexArray(this.vao);
  let idxCount = 0, vertCount = 0;

  if (opts.positions) { attr(this, 0, opts.positions, 3); vertCount = opts.positions.length / 3; }
  if (opts.normals) attr(this, 1, opts.normals, 3);
  if (opts.uvs) attr(this, 2, opts.uvs, 2);
  if (opts.colors) attr(this, 3, opts.colors, 4);
  if (opts.extras) attr(this, 4, opts.extras, 4);

  this.instanceCount = 0;
  this.instAttribs = [];
  if (opts.instMatrices) {
    const data = opts.instMatrices; // Float32Array length = n*16, column-major per instance
    const n = data.length / 16;
    const gl2 = this.gl;
    for (let c = 0; c < 4; c++) {
      const buf = gl2.createBuffer();
      const view = new Float32Array(n * 4);
      for (let i = 0; i < n; i++) {
        view[i * 4 + 0] = data[i * 16 + c * 4 + 0];
        view[i * 4 + 1] = data[i * 16 + c * 4 + 1];
        view[i * 4 + 2] = data[i * 16 + c * 4 + 2];
        view[i * 4 + 3] = data[i * 16 + c * 4 + 3];
      }
      gl2.bindBuffer(gl2.ARRAY_BUFFER, buf);
      gl2.bufferData(gl2.ARRAY_BUFFER, view, gl2.STATIC_DRAW);
      gl2.enableVertexAttribArray(5 + c);
      gl2.vertexAttribPointer(5 + c, 4, gl2.FLOAT, false, 16, 0);
      gl2.vertexAttribDivisor(5 + c, 1);
      this.instAttribs.push({ buf, loc: 5 + c, size: 4 });
    }
    this.instanceCount = n;
    this._instStride = 16;
  }
  if (opts.instExtra) {
    const buf = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buf);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, opts.instExtra, this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(9);
    this.gl.vertexAttribPointer(9, 4, this.gl.FLOAT, false, 16, 0);
    this.gl.vertexAttribDivisor(9, 1);
    this.instAttribs.push({ buf, loc: 9, size: 4 });
    this.instanceCount = this.instanceCount || (opts.instExtra.length / 4);
  }

  if (opts.indices) {
    const ib = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ib);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, opts.indices, this.gl.STATIC_DRAW);
    this.indexType = (opts.indices instanceof Uint32Array) ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
    idxCount = opts.indices.length;
  }
  this.vertCount = vertCount;
  this.count = idxCount || vertCount;
  this.indexed = !!opts.indices;
  gl.bindVertexArray(null);
}
function attr(mesh, loc, data, size) {
  const gl = mesh.gl;
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
}
Mesh.prototype.draw = function () {
  const gl = this.gl;
  gl.bindVertexArray(this.vao);
  if (this.indexed) gl.drawElements(this.mode, this.count, this.indexType, 0);
  else gl.drawArrays(this.mode, 0, this.count);
};
Mesh.prototype.drawInstanced = function (n) {
  const gl = this.gl;
  gl.bindVertexArray(this.vao);
  const c = n === undefined ? this.instanceCount : n;
  if (this.indexed) gl.drawElementsInstanced(this.mode, this.count, this.indexType, 0, c);
  else gl.drawArraysInstanced(this.mode, 0, this.count, c);
};
Mesh.prototype.dispose = function () {
  const gl = this.gl;
  gl.deleteVertexArray(this.vao);
  this.instAttribs.forEach(a => gl.deleteBuffer(a.buf));
};

// upload helper: re-specify an attribute buffer with dynamic data
Mesh.prototype.upload = function (loc, data) {
  const gl = this.gl;
  gl.bindVertexArray(this.vao);
  if (!this._ubuf) this._ubuf = {};
  let b = this._ubuf[loc];
  if (!b) {
    b = gl.createBuffer(); this._ubuf[loc] = b;
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.enableVertexAttribArray(loc);
  } else gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
  const size = this._usize && this._usize[loc] || 4;
  gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
};
Mesh.prototype.setAttrSize = function (loc, size) {
  this._usize = this._usize || {}; this._usize[loc] = size;
};

// ---------------- Framebuffer ----------------
function Framebuffer(gl, w, h, opts) {
  this.gl = gl; this.opts = opts || {};
  this.fbo = gl.createFramebuffer();
  this.w = 0; this.h = 0;
  this.resize(w, h);
}
Framebuffer.prototype.resize = function (w, h) {
  const gl = this.gl;
  w = Math.max(1, w | 0); h = Math.max(1, h | 0);
  if (w === this.w && h === this.h) return;
  this.w = w; this.h = h;
  const o = this.opts;
  if (this.color) { gl.deleteTexture(this.color); this.color = null; }
  if (this.depth) { gl.deleteTexture(this.depth); this.depth = null; }
  if (this.rbo) { gl.deleteRenderbuffer(this.rbo); this.rbo = null; }

  gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
  // color
  const internal = o.float ? gl.RGBA16F : gl.RGBA8;
  const type = o.float ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE;
  this.color = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, this.color);
  gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, gl.RGBA, type, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, o.nearest ? gl.NEAREST : gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, o.nearest ? gl.NEAREST : gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.color, 0);

  // depth as texture (needed for soft particles / SSR / fog)
  if (o.depthTexture) {
    this.depth = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.depth);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT24, w, h, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depth, 0);
  } else if (o.depth) {
    this.rbo = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.rbo);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT24, w, h);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.rbo);
  }
  const st = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (st !== gl.FRAMEBUFFER_COMPLETE) console.error('FBO incomplete: 0x' + st.toString(16));
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};
Framebuffer.prototype.bind = function (clear) {
  const gl = this.gl;
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
  gl.viewport(0, 0, this.w, this.h);
  if (clear) { gl.clearColor(clear[0], clear[1], clear[2], clear[3]); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); }
};
Framebuffer.prototype.unbind = function () { this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null); };

// shadow depth FBO (depth texture, no color)
function ShadowFBO(gl, size) {
  this.gl = gl; this.size = size;
  this.fbo = gl.createFramebuffer();
  this.depth = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, this.depth);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT24, size, size, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depth, 0);
  gl.drawBuffers([gl.NONE]);
  gl.readBuffer(gl.NONE);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}
ShadowFBO.prototype.bind = function () {
  const gl = this.gl;
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
  gl.viewport(0, 0, this.size, this.size);
};

// ---------------- textures ----------------
GLC.makeTexture2D = function (gl, source, opts) {
  opts = opts || {};
  const t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  if (source) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, opts.flipY !== false);
    if (source instanceof Uint8Array) {
      gl.texImage2D(gl.TEXTURE_2D, 0, opts.internal || gl.RGBA, opts.w, opts.h, 0, gl.RGBA, gl.UNSIGNED_BYTE, source);
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, opts.internal || gl.RGBA, opts.internal || gl.RGBA, gl.UNSIGNED_BYTE, source);
    }
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  }
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, opts.repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, opts.repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE);
  const mip = opts.mips !== false && !opts.noMips;
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mip ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  if (opts.aniso) {
    const ext = gl.getExtension('EXT_texture_filter_anisotropic');
    if (ext) gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
  }
  if (source && mip) gl.generateMipmap(gl.TEXTURE_2D);
  return t;
};

GLC.fullscreen = null; // built lazily (triangle covering screen)
GLC.getFullscreen = function (gl) {
  if (GLC.fullscreen) return GLC.fullscreen;
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);
  GLC.fullscreen = { vao, draw: function () { gl.bindVertexArray(vao); gl.drawArrays(gl.TRIANGLES, 0, 3); } };
  return GLC.fullscreen;
};

GLC.init = function (canvas) {
  const gl = canvas.getContext('webgl2', {
    antialias: false, alpha: false, depth: true, stencil: false,
    powerPreference: 'high-performance', preserveDrawingBuffer: false
  });
  if (!gl) throw new Error('WebGL2 not supported by this browser.');
  gl.getExtension('EXT_color_buffer_float');
  gl.getExtension('OES_texture_float_linear');
  const aniso = gl.getExtension('EXT_texture_filter_anisotropic');
  gl.maxAniso = aniso ? gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 1;
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  gl.frontFace(gl.CCW);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  return gl;
};

GLC.Program = Program;
GLC.Mesh = Mesh;
GLC.Framebuffer = Framebuffer;
GLC.ShadowFBO = ShadowFBO;

})(window.MIMO);
