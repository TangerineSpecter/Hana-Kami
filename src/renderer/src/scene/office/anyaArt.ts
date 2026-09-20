import { paintAnyaHead } from './anyaHeadArt';
/** Code-drawn animation art. No reference image is loaded at runtime. */
export const ANYA_W = 32;
export const ANYA_H = 48;
export const ANYA_DESK_HAIRLINE = 33;
export type AnyaDirection = 'down' | 'up' | 'right' | 'left';
export type AnyaAction = 'idle' | 'walk' | 'type' | 'read';
const P = {
  ink: '#624052', hair: '#f5a7b8', darkHair: '#d87894', lightHair: '#ffccd3',
  skin: '#ffebcf', shade: '#e6bba4', blush: '#e7b0ab', white: '#fff7e9',
  coat: '#426b80', coatLight: '#608ca0', coatDark: '#304d65',
  shoe: '#54424b', pupil: '#3e5539', iris: '#77a657', irisLight: '#bad783',
  glint: '#fff6e4', mouth: '#876064', cheek: '#f2c5b6', book: '#ad6884', bow: '#d36b86', bowLight: '#f6a2b2',
};

/** Fixed foot baseline across all frames; integer coordinates keep pixels crisp. */
export function paintAnya(ctx: CanvasRenderingContext2D, direction: AnyaDirection, action: AnyaAction, frame = 0, seated = false): void {
  ctx.save();
  ctx.clearRect(0, 0, ANYA_W, ANYA_H);
  if (direction === 'left') { ctx.translate(ANYA_W, 0); ctx.scale(-1, 1); direction = 'right'; }
  const walking = action === 'walk';
  const phase = frame % 4;
  const step = walking ? [0, 1, 0, -1][phase] : 0;
  const bob = walking && phase % 2 === 1 ? -1 : 0;
  const work = action === 'type' || action === 'read';
  const rect = (x: number, y: number, w: number, h: number, color: string) => {
    ctx.fillStyle = color; ctx.fillRect(x, y, w, h);
  };
  const blink = action === 'idle' && phase === 3;
  if (direction === 'right') {
    // Profile has overlapping legs, a forward-facing toe, and a hair mass
    // behind the shoulder. It is intentionally not the frontal body rotated.
    for (const [x, dy, far] of [[18 - step * 2, 0, 1], [19 + step * 2, -Math.abs(step), 0]]) {
      rect(x,35+dy,5,9,P.ink);
      rect(x+1,36+dy,3,6,far ? P.shade : P.skin);
      rect(x+1,41+dy,3,3,P.white);
      rect(x-1,44+dy,8,3,P.ink); rect(x,44+dy,6,2,P.shoe);
    }
    ctx.save(); ctx.translate(0,bob);
    poly([17,23,23,23,25,28,25,36,23,38,14,38,13,35,15,29],P.ink);
    poly([18,25,22,25,23,29,23,36,15,36,16,30],P.coat);
    rect(22,24,2,5,P.white); rect(21,26,2,4,P.white); rect(22,25,2,1,P.bow);
    paintAnyaHead(ctx,direction,blink);
    if (action === 'type') {
      rect(19,28,4,5,P.white); rect(22,30,6,3,P.white);
      rect(27,29+phase%2,3,2,P.skin);
    } else if (action === 'read') {
      rect(24,24,7,8,P.ink); rect(25,25,5,6,P.book);
      rect(25,25,4,1,P.white); rect(22,29,4,3,P.white);
      rect(25,29+phase%2,3,2,P.skin);
    } else {
      rect(19,27-step,4,4,P.white); rect(20,30-step,3,5,P.skin);
    }
    ctx.restore(); ctx.restore(); return;
  }
  function poly(points: number[], color: string): void {
    // Rasterize to whole pixels instead of Canvas antialiased polygon edges.
    ctx.fillStyle = color;
    for (let y = 0; y < ANYA_H; y++) {
      const intersections: number[] = [];
      for (let i = 0; i < points.length; i += 2) {
        const j = (i + 2) % points.length;
        const x1 = points[i], y1 = points[i + 1], x2 = points[j], y2 = points[j + 1];
        if ((y1 <= y + 0.5 && y2 > y + 0.5) || (y2 <= y + 0.5 && y1 > y + 0.5)) {
          intersections.push(x1 + (y + 0.5 - y1) * (x2 - x1) / (y2 - y1));
        }
      }
      intersections.sort((a, b) => a - b);
      for (let i = 0; i + 1 < intersections.length; i += 2) {
        const start = Math.ceil(intersections[i] - 0.5);
        rect(start, y, Math.ceil(intersections[i + 1] - 0.5) - start, 1, color);
      }
    }
  };
  // Legs, white socks and low brown shoes. Alternating feet share a fixed floor.
  for (const [x, offset] of [[11, step], [18, -step]]) {
    rect(x, 35 + offset, 4, 8, P.ink);
    rect(x + 1, 36 + offset, 3, 5, P.skin);
    rect(x, 41 + offset, 4, 3, P.white);
    rect(x - 1, 44 + offset, 6, 3 - Math.max(0, offset), P.ink);
    rect(x, 44 + offset, 4, 2 - Math.max(0, offset), P.shoe);
  }
  ctx.save(); ctx.translate(0, bob);
  if (direction === 'up') {
    // Reveal the coat hem and sleeves below the hair so the body reads as a
    // separate volume rather than legs attached directly to a hair silhouette.
    poly([11,24,22,24,24,28,23,31,25,37,23,39,9,39,7,37,9,31,8,28],P.ink);
    rect(10,25,12,11,P.coat); rect(9,33,14,4,P.coat); rect(10,37,12,1,P.coatLight);
    rect(16,34,1,4,P.coatDark);
    rect(4,26-step,4,8,P.ink); rect(5,27-step,3,4,P.white);
    rect(5,32-step,3,3,P.skin);
    rect(25,26+step,4,8,P.ink); rect(25,27+step,3,4,P.white);
    rect(25,32+step,3,3,P.skin);
    paintAnyaHead(ctx,direction,blink);
    if (work) {
      rect(4,27 + phase % 2,3,3,P.skin);
      rect(27,28 - phase % 2,3,3,P.skin);
      if (action === 'read') { rect(28,25,3,5,P.book); rect(28,25,2,1,P.white); }
    }
    ctx.restore(); ctx.restore(); return;
  }
  // Blue pinafore and white blouse on Feilen's body proportions.
  poly([11,23,22,23,24,26,25,35,22,38,10,38,7,35,8,27],P.ink);
  poly([11,25,21,25,23,29,23,35,20,36,10,36,9,33,10,28],P.coat);
  rect(11,28,2,6,P.coatLight); rect(20,29,2,6,P.coatDark);
  poly([12,24,21,24,20,27,18,27,17,29,15,27,13,27],P.white);
  rect(12,26,2,4,P.coat); rect(20,26,2,4,P.coat);
  paintAnyaHead(ctx,direction,blink);
  rect(14,25,2,2,P.bow); rect(17,25,2,2,P.bow); rect(16,26,1,1,P.bowLight);
  // Work hands are drawn independently of the walking legs; no baked-in furniture.
  if (action === 'type') {
    const dy = phase % 2;
    rect(10,28,5,3,P.white);
    rect(11,28 + dy,4,2,P.skin);
    rect(19,31 - dy,4,2,P.skin);
  } else if (action === 'read') {
    const bx = 13, by = 26 + (phase === 2 ? 1 : 0);
    rect(bx-1,by-1,8,8,P.ink); rect(bx,by,6,6,P.book);
    rect(bx+3,by,1,6,P.lightHair); rect(bx+1,by+1,2,1,P.white);
    rect(bx-2,by+4,3,2,P.skin); rect(bx+5,by+4,2,2,P.skin);
  } else {
    const x = 8;
    rect(x,28-step,3,3,P.white); rect(x,31-step,3,5,P.skin);
    rect(22,28+step,3,3,P.white); rect(22,31+step,3,5,P.skin);
  }
  void seated; // CharacterSprite crops the legs; the bob ends above the desk.
  ctx.restore(); ctx.restore();
}
