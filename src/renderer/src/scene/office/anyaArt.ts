import { paintAnyaHead } from './anyaHeadArt';
/** Native pixel art, shared by the office sprite and the review page. */
export const ANYA_W = 64;
export const ANYA_H = 96;
export type AnyaDirection = 'down' | 'up' | 'right' | 'left';
export type AnyaAction = 'idle' | 'walk' | 'type' | 'read';
const P = {
  ink: '#624052', hair: '#f5a7b8', hairLight: '#ffccd3', hairShade: '#d87894',
  skin: '#fff0d9', skinShade: '#efc4ad', blush: '#f4b6ac',
  white: '#fff9eb', sleeveShade: '#dbd4c8', dress: '#426b80', dressLight: '#608ca0',
  dressShade: '#304d65', bow: '#d36b86', bowLight: '#f6a2b2',
  horn: '#53434b', gold: '#e9c783', eye: '#3e5539', green: '#77a657', lime: '#bad783',
  shoe: '#54424b', book: '#ad6884',
};

export function paintAnya(ctx: CanvasRenderingContext2D, direction: AnyaDirection, action: AnyaAction, frame = 0, seated = false): void {
  ctx.save(); ctx.clearRect(0, 0, ANYA_W, ANYA_H); ctx.scale(2, 2);
  if (direction === 'left') { ctx.translate(32, 0); ctx.scale(-1, 1); direction = 'right'; }
  const phase = frame % 4;
  const step = action === 'walk' ? [0, 1, 0, -1][phase] : 0;
  const bob = action === 'walk' && phase % 2 ? -1 : 0;
  const blink = action === 'idle' && phase === 3;
  const rect = (x: number, y: number, w: number, h: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  // Scan-converted polygons avoid antialiasing at the native resolution.
  const poly = (p: number[], c: string) => {
    for (let y = 0; y < 48; y++) {
      const xs: number[] = [];
      for (let i = 0; i < p.length; i += 2) {
        const j = (i + 2) % p.length;
        if ((p[i+1] <= y+.5 && p[j+1] > y+.5) || (p[j+1] <= y+.5 && p[i+1] > y+.5))
          xs.push(p[i] + (y+.5-p[i+1]) * (p[j]-p[i]) / (p[j+1]-p[i+1]));
      }
      xs.sort((a,b) => a-b);
      for (let i = 0; i+1 < xs.length; i += 2) {
        const x = Math.ceil(xs[i]-.5); rect(x,y,Math.ceil(xs[i+1]-.5)-x,1,c);
      }
    }
  };
  // Short legs, cream socks, rounded Mary Janes, all anchored above y=47.
  const legs = direction === 'right' ? [[16-step*2,0],[19+step*2,-Math.abs(step)]] : [[11,Math.min(0,step)],[18,Math.min(0,-step)]];
  for (const [x,dy] of legs) {
    rect(x,38+dy,4,7,P.ink); rect(x+1,39+dy,2,3,P.skin);
    rect(x+1,42+dy,2,2,P.white); rect(x-1,44+dy,6,3,P.ink);
    rect(x,44+dy,4,2,P.shoe); rect(x+1,44+dy,2,1,P.white);
  }
  ctx.save(); ctx.translate(0,bob);
  // Soft A-line pinafore: a narrow waist, curved hem and puff sleeves.
  if (direction === 'right') {
    poly([16,27,22,27,24,30,23,34,25,38,24,41,14,41,12,39,14,34],P.ink);
    poly([17,28,21,28,23,31,21,34,24,38,23,40,15,40,14,38,16,34],P.dress);
    rect(20,28,3,4,P.white); rect(22,29,2,2,P.bow);
    rect(15,36,2,3,P.dressLight); rect(22,37,1,3,P.dressShade);
  } else {
    poly([11,27,21,27,24,29,25,32,23,35,23,37,25,39,23,41,19,42,12,42,8,41,7,39,9,36,9,34,7,33,7,30],P.ink);
    poly([11,28,21,28,23,30,24,32,21,34,10,34,8,32,9,30],P.white);
    poly([11,28,13,28,13,33,19,33,19,28,21,28,21,35,23,39,21,40,12,41,9,39,11,35],P.dress);
    poly([12,35,14,35,13,39,11,39],P.dressLight);
    poly([19,35,20,35,22,39,20,40],P.dressShade);
    if (direction === 'down') {
      poly([13,29,16,30,19,29,19,32,16,31,13,32],P.bow);
      rect(15,30,2,2,P.bowLight);
    } else { rect(13,29,6,2,P.dressShade); }
  }
  // Head uses the finer native grid; body keeps the established chunky pixels.
  ctx.save(); ctx.scale(0.5, 0.5);
  paintAnyaHead(ctx, direction, blink);
  ctx.restore();
  // Hands remain above the existing desk mask; no furniture is baked into frames.
  if (direction === 'right') {
    rect(18,29,4,5,P.sleeveShade); rect(18,29,3,4,P.white);
    if (action === 'read') {
      rect(25,28,6,7,P.ink); rect(26,29,4,5,P.book); rect(26,29,3,1,P.white);
      rect(22,32,5,2,P.skin);
    } else if (action === 'type') {
      rect(21,31,6,3,P.white); rect(26,31+phase%2,3,2,P.skin);
    } else { rect(19,33-step,3,3,P.skin); }
  } else if (action === 'read' && direction === 'down') {
    const y = 29 + (phase === 2 ? 1 : 0);
    rect(11,y,11,7,P.ink); rect(12,y+1,9,5,P.book); rect(16,y+1,1,5,P.gold);
    rect(13,y+1,2,1,P.white); rect(18,y+1,2,1,P.white);
    rect(10,y+4,3,2,P.skin); rect(20,y+4,3,2,P.skin);
  } else if (action === 'type') {
    rect(8,29,5,3,P.white); rect(19,29,5,3,P.white);
    rect(11,31+phase%2,3,2,P.skin); rect(18,32-phase%2,3,2,P.skin);
  } else {
    poly([8,29-step,10,29-step,11,32-step,10,34-step,7,33-step,7,31-step],P.sleeveShade);
    rect(8,30-step,2,3,P.white); rect(8,33-step,2,2,P.skin);
    poly([22,29+step,24,30+step,25,33+step,22,34+step,21,32+step],P.sleeveShade);
    rect(22,30+step,2,3,P.white); rect(22,33+step,2,2,P.skin);
    if (action === 'read') { rect(25,30,3,5,P.book); rect(25,30,2,1,P.white); }
  }
  // The shared CharacterSprite mask crops the legs when seated.
  // Keep the painter signature aligned with the standing/seated frame factory.
  void seated;
  ctx.restore(); ctx.restore();
}
