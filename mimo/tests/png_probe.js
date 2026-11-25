// Minimal PNG pixel probe (no deps): decode and sample points.
const fs = require('fs');
const zlib = require('zlib');

function decodePNG(path) {
  const buf = fs.readFileSync(path);
  if (buf.readUInt32BE(0) !== 0x89504E47) throw new Error('not png');
  let off = 8, w, h, bitDepth, colorType, interlace;
  const idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === 'IHDR') {
      w = data.readUInt32BE(0); h = data.readUInt32BE(4);
      bitDepth = data[8]; colorType = data[9]; interlace = data[12];
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    off += 12 + len;
  }
  if (bitDepth !== 8 || interlace !== 0) throw new Error('unsupported png ' + bitDepth + ' ' + interlace);
  const ch = colorType === 6 ? 4 : colorType === 2 ? 3 : null;
  if (!ch) throw new Error('colorType ' + colorType);
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = w * ch;
  const out = Buffer.alloc(h * stride);
  let pos = 0;
  for (let y = 0; y < h; y++) {
    const filter = raw[pos++];
    const line = raw.subarray(pos, pos + stride); pos += stride;
    const o = y * stride;
    const prev = y > 0 ? out.subarray(o - stride, o) : null;
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? out[o + x - ch] : 0;
      const b = prev ? prev[x] : 0;
      const c = (prev && x >= ch) ? prev[x - ch] : 0;
      let v = line[x];
      switch (filter) {
        case 0: break;
        case 1: v = (v + a) & 255; break;
        case 2: v = (v + b) & 255; break;
        case 3: v = (v + ((a + b) >> 1)) & 255; break;
        case 4: {
          const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
          v = (v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255; break;
        }
        default: throw new Error('filter ' + filter);
      }
      out[o + x] = v;
    }
  }
  return { w, h, ch, data: out };
}

const [path, ...pts] = process.argv.slice(2);
const img = decodePNG(path);
console.log(path, img.w + 'x' + img.h, 'channels=' + img.ch);
for (const p of pts) {
  const [x, y] = p.split(',').map(Number);
  const i = (y * img.w + x) * img.ch;
  console.log(`  (${x},${y}) = rgb(${img.data[i]},${img.data[i+1]},${img.data[i+2]})` +
    (img.ch === 4 ? ` a=${img.data[i+3]}` : ''));
}
