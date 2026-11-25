import type { Track } from '../world/Track';

// Pre-rendered circuit map + dots. Zero alloc per frame.
export class Minimap {
  private ctx: CanvasRenderingContext2D;
  private bg: HTMLCanvasElement;
  constructor(private track: Track) {
    const cv = document.getElementById('minimap') as HTMLCanvasElement;
    this.ctx = cv.getContext('2d')!;
    this.bg = document.createElement('canvas');
    this.bg.width = 336; this.bg.height = 336;
    this.renderBg();
  }

  private bounds() {
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (const p of this.track.centerPoints) {
      minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
      minZ = Math.min(minZ, p.z); maxZ = Math.max(maxZ, p.z);
    }
    return { minX, maxX, minZ, maxZ };
  }

  private project(x: number, z: number, W = 336, H = 336, pad = 26) {
    const { minX, maxX, minZ, maxZ } = this.bounds();
    const sx = (W - pad * 2) / (maxX - minX);
    const sz = (H - pad * 2) / (maxZ - minZ);
    const s = Math.min(sx, sz);
    const ox = (W - (maxX - minX) * s) / 2 - minX * s;
    const oz = (H - (maxZ - minZ) * s) / 2 - minZ * s;
    return [x * s + ox, z * s + oz];
  }

  private renderBg() {
    const g = this.bg.getContext('2d')!;
    g.clearRect(0, 0, 336, 336);
    g.lineJoin = 'round'; g.lineCap = 'round';
    // glow pass
    for (const [w, col] of [[13, 'rgba(0,229,255,0.25)'], [8, '#111a2b'], [5, '#e8eefc']] as Array<[number, string]>) {
      g.strokeStyle = col; g.lineWidth = w; g.beginPath();
      const pts = this.track.centerPoints;
      for (let i = 0; i <= pts.length; i++) {
        const p = pts[i % pts.length];
        const [x, y] = this.project(p.x, p.z);
        if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
      }
      g.closePath(); g.stroke();
    }
  }

  draw(positions: Array<{ x: number; z: number; color: string; player?: boolean }>) {
    const { ctx } = this;
    ctx.clearRect(0, 0, 336, 336);
    ctx.drawImage(this.bg, 0, 0);
    for (const p of positions) {
      const [x, y] = this.project(p.x, p.z);
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color; ctx.shadowBlur = p.player ? 14 : 6;
      ctx.arc(x, y, p.player ? 8 : 5, 0, Math.PI * 2);
      ctx.fill(); ctx.shadowBlur = 0;
      if (p.player) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke(); }
    }
  }
}
