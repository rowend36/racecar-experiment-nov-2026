/**
 * Minimal canvas DOM for headless physics tests. The game never renders here —
 * only the procedural texture generators need a 2D context to exist.
 */
class FakeGradient {
  addColorStop(): void {}
}

class FakeContext {
  fillStyle: unknown = '';
  strokeStyle: unknown = '';
  lineWidth = 1;
  font = '';
  textAlign = '';
  globalAlpha = 1;
  createImageData(w: number, h: number): { data: Uint8ClampedArray; width: number; height: number } {
    return { data: new Uint8ClampedArray(w * h * 4), width: w, height: h };
  }
  getImageData(_x: number, _y: number, w: number, h: number): { data: Uint8ClampedArray; width: number; height: number } {
    return this.createImageData(w, h);
  }
  putImageData(): void {}
  createLinearGradient(): FakeGradient { return new FakeGradient(); }
  createRadialGradient(): FakeGradient { return new FakeGradient(); }
  fillRect(): void {}
  clearRect(): void {}
  beginPath(): void {}
  closePath(): void {}
  moveTo(): void {}
  lineTo(): void {}
  bezierCurveTo(): void {}
  arc(): void {}
  stroke(): void {}
  fill(): void {}
  fillText(): void {}
  save(): void {}
  restore(): void {}
}

class FakeCanvas {
  width = 1;
  height = 1;
  getContext(): FakeContext { return new FakeContext(); }
}

(globalThis as Record<string, unknown>)['HTMLCanvasElement'] = FakeCanvas;
(globalThis as Record<string, unknown>)['document'] = {
  createElement: (tag: string) => (tag === 'canvas' ? new FakeCanvas() : {}),
};
