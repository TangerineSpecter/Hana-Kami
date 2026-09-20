/** Klee design study. Native, hard-edged pixel art; no image dependency. */
export const KLEE_W = 64;
export const KLEE_H = 96;
export type KleeDirection = 'down' | 'up' | 'right' | 'left';
export type KleeAction = 'idle' | 'walk' | 'type' | 'read';
const P = {
  ink: '#59333b', red: '#d9473e', redLight: '#f16a51', redShade: '#ae3037',
  hair: '#f5dfaa', hairLight: '#fff2cd', hairShade: '#d9b681',
  skin: '#ffedda', skinShade: '#eebca8', cheek: '#f2b6a8',
  cream: '#fff5df', creamShade: '#e2d4ba', gold: '#efca87',
  brown: '#805745', brownLight: '#a77a57', dark: '#50383a',
  eye: '#822f39', iris: '#d35b43', amber: '#f6bd69', book: '#79997a',
};

/** Same foot anchor and action contract as the other office characters. */
export function paintKlee(ctx: CanvasRenderingContext2D, direction: KleeDirection, action: KleeAction, frame = 0, seated = false): void {
  ctx.save(); ctx.clearRect(0, 0, KLEE_W, KLEE_H);
  if (direction === 'left') { ctx.translate(KLEE_W, 0); ctx.scale(-1, 1); direction = 'right'; }
  const phase = ((frame % 4) + 4) % 4;
  const step = action === 'walk' ? [0, 2, 0, -2][phase] : 0;
  const bob = action === 'walk' && phase % 2 ? -2 : 0;
  const blink = action === 'idle' && phase === 3;
  const r = (x: number, y: number, w: number, h: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  // Scanline fill: even diagonal contours consist only of opaque whole pixels.
  const poly = (p: number[], c: string) => {
    for (let y = 0; y < KLEE_H; y++) {
      const xs: number[] = [];
      for (let i = 0; i < p.length; i += 2) {
        const j = (i + 2) % p.length;
        if ((p[i+1] <= y+.5 && p[j+1] > y+.5) || (p[j+1] <= y+.5 && p[i+1] > y+.5))
          xs.push(p[i] + (y+.5-p[i+1]) * (p[j]-p[i]) / (p[j+1]-p[i+1]));
      }
      xs.sort((a,b) => a-b);
      for (let i = 0; i+1 < xs.length; i += 2) {
        const x = Math.ceil(xs[i]-.5); r(x,y,Math.ceil(xs[i+1]-.5)-x,1,c);
      }
    }
  };
  const clover = (x: number, y: number, c: string) => {
    r(x+1,y,2,3,c); r(x,y+1,3,2,c); r(x+5,y,2,3,c); r(x+5,y+1,3,2,c);
    r(x,y+5,3,2,c); r(x+1,y+5,2,3,c); r(x+5,y+5,3,2,c); r(x+5,y+5,2,3,c);
  };
  const eye = (x: number, y: number, profile = false) => {
    const width = profile ? 8 : 9;
    if (blink) {
      r(x,y+5,2,1,P.eye); r(x+2,y+6,width-4,1,P.eye); r(x+width-2,y+5,2,1,P.eye);
      return;
    }
    // Round upper lashes and a tapered lower iris read as wide, bright eyes.
    r(x+2,y,width-4,1,P.ink); r(x,y+1,width,1,P.ink);
    r(x,y+2,width,6,P.cream); r(x+1,y+8,width-2,2,P.cream);
    r(x+1,y+2,width-2,6,P.eye); r(x+2,y+5,width-3,3,P.iris);
    r(x+3,y+8,width-5,2,P.amber); r(x+2,y+7,width-3,1,P.amber);
    r(x+3,y+3,2,2,P.cream); r(x+width-2,y+6,1,1,P.gold);
  };
  const pony = (x: number, y: number, mirrored: boolean) => {
    ctx.save(); ctx.translate(x,y); if (mirrored) { ctx.translate(15,0); ctx.scale(-1,1); }
    poly([7,0,13,1,15,7,14,15,11,20,8,19,6,21,3,17,1,17,0,11,2,5],P.ink);
    poly([7,2,12,3,13,8,12,14,9,18,8,16,6,18,4,14,2,14,2,10,4,5],P.hair);
    poly([7,3,10,3,9,9,6,14,4,12,5,7],P.hairLight);
    poly([11,7,13,7,12,14,9,18,8,16,10,12],P.hairShade);
    ctx.restore();
  };
  const dodoco = (x: number, y: number) => {
    poly([x+2,y+4,x+1,y,x+4,y+1,x+5,y+4,x+9,y+4,x+11,y+1,x+13,y,x+12,y+6,x+14,y+9,x+13,y+15,x+10,y+17,x+4,y+16,x+1,y+13,x,y+8],P.ink);
    poly([x+3,y+5,x+3,y+2,x+5,y+6,x+9,y+6,x+11,y+3,x+11,y+7,x+12,y+9,x+11,y+14,x+9,y+15,x+4,y+14,x+2,y+12,x+2,y+8],P.cream);
    r(x+3,y+12,8,2,P.gold); r(x+4,y+8,1,2,P.brown); r(x+9,y+8,1,2,P.brown);
    r(x+6,y+11,2,1,P.brown);
  };
  // Short legs, ivory socks and warm brown boots.
  const legs = direction === 'right' ? [[32-step*2,0],[38+step*2,-Math.abs(step)]] : [[22,Math.min(0,step)],[36,Math.min(0,-step)]];
  for (const [x,dy] of legs) {
    r(x,76+dy,8,13,P.ink); r(x+1,77+dy,6,7,P.skin); r(x+1,83+dy,6,5,P.cream);
    r(x-1,87+dy,10,5,P.ink); r(x,86+dy,8,5,P.brown); r(x,86+dy,8,2,P.brownLight);
    r(x+1,88+dy,2,1,P.gold);
  }
  ctx.save(); ctx.translate(0,bob);
  if (direction === 'right') {
    // Far shoulder and backpack establish the side silhouette.
    poly([15,51,28,49,32,55,31,72,27,77,14,73,12,57],P.ink);
    r(15,54,13,17,P.brown); r(16,55,11,3,P.brownLight); r(17,61,10,2,P.gold);
    poly([32,51,43,52,47,58,46,66,50,77,46,81,27,81,24,77,29,64],P.ink);
    poly([32,54,42,54,45,60,43,65,47,76,44,78,29,78,28,76],P.red);
    r(29,77,17,3,P.cream); r(30,61,3,12,P.redLight); r(40,55,3,9,P.brown);
    // The rear silhouette bows outward below the brim, then gathers at the tie.
    // Its widest point is behind the ear, not a vertical wall under the hat.
    poly([22,22,39,23,43,30,41,40,34,49,28,53,22,51,17,47,15,43,13,39,12,35,13,31,15,28,16,25,17,23],P.ink);
    poly([22,24,37,25,40,30,38,40,32,47,27,50,23,49,19,46,17,42,15,38,14,35,15,32,17,29,18,26],P.hair);
    poly([20,28,24,27,21,31,19,35,19,39,22,44,20,44,17,40,16,36,17,32],P.hairLight);
    poly([28,31,34,29,35,34,31,43,27,49,23,48,20,44,24,45,27,40],P.hairShade);
    pony(13,46+step/2,false); r(22,46,6,3,P.redShade);
    // Restore the narrower original profile; the added volume belongs to hair.
    poly([28,30,46,28,51,34,51,40,52,43,51,48,47,52,35,53,28,47],P.ink);
    poly([30,31,46,31,49,35,49,40,50,43,49,47,46,50,36,51,30,46],P.skin);
    // Compact curved sidelock: the old long diagonal wedge is gone.
    poly([25,23,42,22,48,26,50,31,47,35,43,34,39,31,35,34,33,39,32,45,34,49,37,50,33,53,29,51,27,47,27,40,28,33,25,29],P.hairShade);
    poly([27,24,41,24,46,27,47,31,45,33,42,31,38,29,34,32,31,38,30,44,31,48,34,50,31,50,29,46,29,39,31,32,27,29],P.hair);
    poly([29,25,36,25,34,29,31,32,29,30],P.hairLight);
    poly([31,35,33,33,32,38,31,44,32,48,30,46,30,40],P.hairLight);
    // The pointed ear peeks out between gathered back hair and the front curl.
    poly([22,39,29,38,31,42,28,44,24,42],P.ink);
    poly([24,40,28,39,29,42,27,42],P.skin); r(26,40,2,1,P.skinShade);
    eye(41,36,true); r(38,47,5,2,P.cheek);
    // Red beret, dark underbrim, cream feather and clover badge.
    poly([16,25,14,18,17,10,25,5,39,5,46,9,50,16,49,27,43,29,34,26,24,28],P.ink);
    poly([17,22,16,18,19,11,26,7,38,7,44,10,48,17,47,24,42,25,34,23,25,25],P.red);
    poly([20,13,26,8,37,8,42,11,27,10,23,14],P.redLight); r(20,18,2,4,P.gold);
    poly([16,24,25,22,35,22,44,25,47,24,47,28,42,28,34,25,25,26,18,28],P.dark);
    poly([19,17,17,11,18,3,21,6,23,1,25,7,25,12,23,18],P.ink);
    poly([20,15,19,10,20,6,22,9,23,5,24,9,23,14,22,17],P.cream); r(20,13,2,3,P.skinShade);
    r(17,18,9,9,P.ink); r(18,19,7,7,P.gold); r(19,20,5,5,P.brown); r(21,20,1,5,P.cream); r(19,22,5,1,P.cream);
    // Scarf and animated mitten.
    r(35,52,9,3,P.skinShade); r(40,54,5,4,P.cream);
    poly([34,57,40,56,44,60,43,67,37,68,33,64],P.ink);
    r(35,59,6,6,P.redLight); r(36,65,7,3,P.cream);
    if (action === 'read') {
      r(49,56,12,14,P.ink); r(50,57,10,11,P.book); r(51,58,8,2,P.cream);
      r(41,64,11,4,P.cream); r(49,64+(phase%2),4,3,P.brown);
    } else if (action === 'type') {
      r(41,62,12,5,P.red); r(49,63,5,4,P.cream); r(53,63+phase%2*2,5,3,P.brown);
    } else { r(37,68-step,6,4,P.brown); }
    dodoco(10,61);
  } else {
    // Back hair and fluffy low twin tails.
    poly([15,20,47,20,52,32,51,49,46,57,17,57,12,47,12,31],P.ink);
    poly([16,23,46,23,49,33,48,48,44,54,19,54,15,46,15,32],P.hair);
    pony(5,44+step/2,false); pony(44,44-step/2,true);
    r(12,45,7,3,P.redShade); r(45,45,7,3,P.redShade);
    // A-line coat with a scalloped ivory petticoat and short puff sleeves.
    poly([22,52,42,52,48,58,47,65,51,77,47,81,42,82,33,83,24,82,17,81,13,77,17,64,16,59],P.ink);
    poly([22,55,42,55,45,60,43,65,48,76,44,79,20,79,16,76,20,65,19,60],P.red);
    poly([17,74,23,76,32,78,42,76,47,74,48,78,44,80,39,79,33,81,26,79,21,80,16,78],P.cream);
    poly([23,57,26,57,24,72,21,75,19,74],P.redLight); r(42,62,2,11,P.redShade);
    if (direction === 'up') {
      // Backpack remains legible between the twin tails.
      r(21,53,3,19,P.dark); r(41,53,3,19,P.dark);
      poly([24,54,40,54,44,59,44,73,41,76,23,76,20,73,20,59],P.ink);
      r(22,58,20,15,P.brown); r(24,55,16,5,P.brownLight); r(23,62,18,2,P.gold);
      r(30,61,4,5,P.gold); r(31,62,2,2,P.brown); r(25,69,13,1,P.brownLight);
      dodoco(42,62);
      poly([16,30,47,30,49,39,46,49,41,54,36,53,32,55,27,53,22,54,17,48,14,40],P.hairShade);
      poly([17,30,46,30,47,39,44,48,41,51,37,49,32,52,28,50,23,51,19,46,16,39],P.hair);
      r(23,33,2,14,P.hairLight); r(37,32,3,15,P.hairLight); r(31,38,1,10,P.hairShade);
    } else {
      r(21,54,3,10,P.brown); r(41,54,3,10,P.brown);
      poly([25,53,32,56,40,53,42,57,37,61,27,61,22,57],P.skinShade);
      poly([27,57,37,57,36,63,32,66,28,63],P.cream);
      r(29,56,6,6,P.gold); r(30,56,4,5,P.cream);
      clover(28,68,P.gold);
      // Gently inset cheeks with the original eyes, hair, and head proportions.
      poly([18,27,44,27,48,33,49,40,48,46,44,50,38,53,27,53,21,50,17,46,15,40,16,33],P.ink);
      poly([19,29,43,29,46,34,47,40,46,45,42,49,37,51,28,51,23,48,19,45,17,40,18,34],P.skin);
      poly([7,38,18,36,20,44,15,45,7,41],P.ink);
      poly([9,39,17,38,18,42,15,43],P.skin); r(13,40,4,1,P.skinShade);
      poly([46,36,57,38,57,41,49,45,44,44],P.ink);
      poly([47,38,55,39,49,43,46,42],P.skin); r(47,40,4,1,P.skinShade);
      r(18,46,6,2,P.cheek); r(41,46,6,2,P.cheek);
      // A shallow closed smile, with one gently lifted corner instead of a U.
      r(31,48,3,1,'#b77878'); r(34,47,1,1,'#b77878');
      // Swept bangs frame the eyes; curled sidelocks leave the ears visible.
      poly([15,25,27,22,42,24,49,30,49,40,46,47,41,49,43,44,45,39,43,32,38,30,36,35,32,39,27,36,26,32,23,33,21,40,22,46,25,49,20,48,16,43,14,35],P.hairShade);
      poly([16,26,27,24,41,26,47,31,47,40,44,46,43,46,45,40,43,31,37,28,35,34,32,37,29,35,27,29,23,31,20,38,20,44,22,47,19,45,16,41,16,34],P.hair);
      poly([19,28,26,26,24,30,21,34,18,38,18,33],P.hairLight);
      poly([28,25,35,25,34,30,31,34,29,32],P.hairLight); r(43,31,2,7,P.hairLight);
      // Foreground eyes retain their tiny highlights beside the curled bangs.
      eye(19,36); eye(37,36);
    }
    // Broad soft red cap, cream piping and dark curved underbrim.
    poly([8,29,7,20,10,13,16,8,24,5,39,5,47,8,53,14,56,22,55,31,50,33,43,29,33,27,22,28,14,32],P.ink);
    poly([10,27,9,20,12,14,17,10,25,7,38,7,46,10,51,15,54,22,53,28,49,29,42,26,33,24,22,25,14,29],P.red);
    poly([11,21,14,15,19,11,26,8,38,8,44,11,26,10,20,13,16,17,13,23],P.redLight);
    poly([47,13,51,17,54,23,53,28,49,29,45,26,48,23],P.redShade);
    poly([10,28,16,26,23,24,33,23,43,25,50,29,54,28,54,32,49,32,42,28,33,26,23,27,15,31,10,31],P.dark);
    if (direction === 'down') {
      r(17,18,2,4,P.gold); r(19,15,3,2,P.gold); r(22,13,3,2,P.gold);
      r(40,13,3,2,P.gold); r(43,15,3,2,P.gold); r(46,18,2,4,P.gold); clover(29,11,P.gold);
      // A little curved ahoge lifts away from the left brim.
      poly([14,26,8,25,4,21,3,16,5,11,8,8,7,14,7,18,10,22,15,23],P.ink);
      poly([13,24,8,23,5,20,5,16,6,13,6,19,10,23,14,23],P.hairLight);
    } else { r(21,14,2,8,P.redLight); r(40,13,2,9,P.redShade); r(25,9,12,1,P.redLight); }
    // Feather and clover medallion are on the same anatomical side in back view.
    ctx.save(); if (direction === 'up') { ctx.translate(64,0); ctx.scale(-1,1); }
    poly([51,23,49,16,51,10,52,3,55,6,56,12,60,9,60,16,57,22],P.ink);
    poly([52,21,51,16,53,10,53,6,55,12,55,16,58,13,58,16,55,21],P.cream);
    r(52,17,2,5,P.skinShade);
    poly([49,21,55,21,58,25,57,31,53,34,48,31,47,26],P.ink);
    poly([50,23,54,23,56,26,55,30,53,32,49,30,49,26],P.gold);
    r(50,25,5,5,P.brown); r(52,25,1,5,P.cream); r(50,27,5,1,P.cream);
    ctx.restore();
    // Sleeves, cuffs and little brown mittens.
    if (action === 'read' && direction === 'down') {
      r(20,59,24,14,P.ink); r(21,60,22,11,P.book); r(31,60,2,12,P.gold);
      r(23,61,6,2,P.cream); r(35,61,6,2,P.cream); r(18,66,5,4,P.brown); r(41,66,5,4,P.brown);
    } else if (action === 'type') {
      r(15,58,10,7,P.redLight); r(39,58,10,7,P.red);
      r(22,62,6,5,P.cream); r(36,62,6,5,P.cream);
      r(24,65+phase%2*2,6,3,P.brown); r(34,67-phase%2*2,6,3,P.brown);
    } else {
      for (const [x,dy] of [[14,-step],[43,step]]) {
        poly([x+2,57+dy,x+6,57+dy,x+8,62+dy,x+7,68+dy,x+1,68+dy,x-1,64+dy],P.ink);
        r(x+1,59+dy,5,6,P.redLight); r(x+1,65+dy,6,3,P.cream); r(x+2,68+dy,4,3,P.brown);
      }
      if (action === 'read') { r(49,61,5,10,P.book); r(50,62,3,2,P.cream); }
    }
  }
  // Furniture and leg clipping belong to the office renderer, not the artwork.
  void seated;
  ctx.restore(); ctx.restore();
}
