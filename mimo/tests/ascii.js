// Downsample a PNG to an ASCII luminance grid for text-based visual verification.
const fs = require('fs');
const zlib = require('zlib');
function decodePNG(path) {
  const buf = fs.readFileSync(path);
  let off = 8, w, h, bitDepth, colorType, interlace;
  const idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); bitDepth = data[8]; colorType = data[9]; interlace = data[12]; }
    else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    off += 12 + len;
  }
  const ch = colorType === 6 ? 4 : 3;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = w * ch;
  const out = Buffer.alloc(h * stride);
  let pos = 0;
  for (let y = 0; y < h; y++) {
    const filter = raw[pos++];
    const line = raw.subarray(pos, pos + stride); pos += stride;
    const o = y * stride, prev = y > 0 ? out.subarray(o - stride, o) : null;
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? out[o + x - ch] : 0;
      const b = prev ? prev[x] : 0;
      const c = (prev && x >= ch) ? prev[x - ch] : 0;
      let v = line[x];
      if (filter === 1) v = (v + a) & 255;
      else if (filter === 2) v = (v + b) & 255;
      else if (filter === 3) v = (v + ((a + b) >> 1)) & 255;
      else if (filter === 4) {
        const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
        v = (v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
      }
      out[o + x] = v;
    }
  }
  return { w, h, ch, data: out };
}
const [path, colsArg] = process.argv.slice(2);
const img = decodePNG(path);
const COLS = parseInt(colsArg || '72', 10);
const ROWS = Math.round(COLS * img.h / img.w / 2.1); // char aspect ~2.1
const ramp = ' .:-=+*#%@';
console.log(path, img.w + 'x' + img.h, '->', COLS + 'x' + ROWS);
let out = '';
for (let ry = 0; ry < ROWS; ry++) {
  let line = '';
  for (let rx = 0; rx < COLS; rx++) {
    const x0 = Math.floor(rx * img.w / COLS), x1 = Math.floor((rx + 1) * img.w / COLS);
    const y0 = Math.floor(ry * img.h / ROWS), y1 = Math.floor((ry + 1) * img.h / ROWS);
    let sum = 0, n = 0, rsum = 0, bsum = 0;
    for (let y = y0; y < y1; y += 2) for (let x = x0; x < x1; x += 2) {
      const i = (y * img.w + x) * img.ch;
      const r = img.data[i], g = img.data[i + 1], b = img.data[i + 2];
      sum += .2126 * r + .7152 * g + .0722 * b; rsum += r; bsum += b; n++;
    }
    const lum = sum / n;
    const warm = (rsum - bsum) / n; // warm>0 = tan/sunlit, cool<0 = blue
    let idx = Math.min(ramp.length - 1, Math.floor(lum / 255 * (ramp.length - 1)));
    let ch2 = ramp[idx];
    if (warm > 18 && lum > 30) ch2 = ch2 === ' ' ? ',' : ch2.toLowerCase(); // mark warm areas with lowercase/comma
    line += ch2;
  }
  out += line + '\n';
}
console.log(out);
