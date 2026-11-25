/* MIMO VELOCITY — procedural sky + image-based lighting (env cube & irradiance) */
window.MIMO = window.MIMO || {};
(function (M) {
'use strict';

// environment constants: dusk / neon night
const env = {
  sunDir: null,          // vec3 (normalized)
  sunColor: [1.9, 1.05, 0.52],
  ambSky: [0.29, 0.37, 0.60],
  ambGround: [0.05, 0.055, 0.085],
  fogColor: [0.06, 0.08, 0.15],
  fogDensity: 0.0026,
  night: 0.55,
  exposure: 1.02
};
env.sunDir = (function () {
  const v = [0.18, 0.145, 0.97];
  const l = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / l, v[1] / l, v[2] / l];
})();
M.env = env;

const SKY = {};
M.sky = SKY;

const CUBE = 256;
const IRR = 64;

SKY.build = function (gl, skyProg, irrProg) {
  // ---- HDR env cubemap ----
  const envTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, envTex);
  for (let i = 0; i < 6; i++) {
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA16F, CUBE, CUBE, 0, gl.RGBA, gl.HALF_FLOAT, null);
  }
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.viewport(0, 0, CUBE, CUBE);
  gl.disable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);
  skyProg.use();
  skyProg.i('uFace', 0).f('uTime', 0).f('uNight', env.night);
  skyProg.v3('uSunDir', env.sunDir[0], env.sunDir[1], env.sunDir[2]);
  skyProg.v3('uSunColor', env.sunColor[0], env.sunColor[1], env.sunColor[2]);
  skyProg.m4('uInvViewProj', M.mat4.make()); // unused for faces
  skyProg.v3('uCamPos', 0, 0, 0);
  for (let i = 0; i < 6; i++) {
    skyProg.i('uFace', i);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, envTex, 0);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    M.gl.getFullscreen(gl).draw();
  }
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, envTex);
  gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

  // ---- irradiance cube ----
  const irrTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, irrTex);
  for (let i = 0; i < 6; i++) {
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA16F, IRR, IRR, 0, gl.RGBA, gl.HALF_FLOAT, null);
  }
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  irrProg.use();
  gl.viewport(0, 0, IRR, IRR);
  for (let i = 0; i < 6; i++) {
    irrProg.i('uFace', i);
    irrProg.cube('uEnv', 0, envTex);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, irrTex, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    M.gl.getFullscreen(gl).draw();
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);

  let maxMip = 0;
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, envTex);
  maxMip = Math.log2(CUBE);

  return { env: envTex, irr: irrTex, maxMip };
};

})(window.MIMO);
