/** Hu Tao's native pixel animation. Integer rasterization, no image dependency. */
export const HUTAO_W = 64;
export const HUTAO_H = 96;
export type HutaoDirection = 'down' | 'up' | 'right' | 'left';
export type HutaoAction = 'idle' | 'walk' | 'type' | 'read';
const P = {
  ink: '#352532', hair: '#73505b', hairDark: '#513744', hairLight: '#ab7380',
  skin: '#ffe9d2', skinShade: '#edbea8', cheek: '#f3b1a5', cream: '#fff5df',
  coat: '#49353c', coatLight: '#63454a', hat: '#49323f', hatLight: '#63464c',
  red: '#d84643', redLight: '#ff7460', redDark: '#8e2c38',
  gold: '#e7c68a', goldShade: '#b68c63', purple: '#9470ad',
  eye: '#733545', iris: '#c9615b', amber: '#efaa7c', book: '#8a4147',
  hairSheen: '#916572', cheekSoft: '#f5cabb', mouth: '#ad6c72',
};

/** Matches the office's 4-action / 4-frame and seated-hair contracts. */
export function paintHutao(ctx: CanvasRenderingContext2D, direction: HutaoDirection, action: HutaoAction, frame = 0, seated = false): void {
  ctx.save(); ctx.clearRect(0, 0, HUTAO_W, HUTAO_H);
  if (direction === 'left') { ctx.translate(HUTAO_W, 0); ctx.scale(-1, 1); direction = 'right'; }
  const phase = ((frame % 4) + 4) % 4;
  const step = action === 'walk' ? [0, 2, 0, -2][phase] : 0;
  const bob = action === 'walk' && phase % 2 ? -1 : 0;
  const blink = action === 'idle' && phase === 3;
  const r = (x: number, y: number, w: number, h: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  const poly = (p: number[], c: string) => {
    for (let y = 0; y < HUTAO_H; y++) {
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
  const flower = (x: number, y: number, small = false) => {
    ctx.save(); ctx.translate(x,y);
    if (small) {
      poly([2,0,5,0,5,2,7,2,7,5,5,5,5,7,2,7,2,5,0,5,0,2,2,2],P.redDark);
      r(2,1,3,5,P.red); r(1,2,5,3,P.red); r(3,2,1,3,P.gold); r(2,3,3,1,P.gold);
    } else {
      poly([4,0,8,0,9,3,12,2,14,5,12,8,13,11,10,13,7,11,4,14,1,11,2,8,0,5,2,2,4,3],P.redDark);
      poly([5,1,8,1,8,4,11,3,12,5,10,8,11,10,9,11,7,9,4,12,2,10,4,7,1,5,3,4,5,5],P.red);
      r(5,2,2,3,P.redLight); r(2,5,3,1,P.redLight); r(8,9,2,1,P.redLight);
      r(6,4,1,6,P.gold); r(4,6,5,1,P.gold); r(5,5,3,3,P.gold); r(6,6,1,1,P.cream);
    }
    ctx.restore();
  };
  const eye = (x: number, y: number) => {
    const w = 9;
    if (blink) { r(x,y+4,2,1,P.eye); r(x+2,y+5,w-4,1,P.eye); r(x+w-2,y+4,2,1,P.eye); return; }
    // Short rounded eyes, an ivory margin and an off-centre catchlight.
    // A centred white cross at this size reads as a fixed, empty stare.
    r(x+2,y,w-4,1,P.eye); r(x+1,y+1,w-2,1,P.eye);
    r(x,y+2,w,5,P.cream); r(x+1,y+7,w-2,2,P.cream);
    r(x+2,y+2,w-4,5,P.eye); r(x+2,y+6,w-4,2,P.iris);
    r(x+3,y+8,Math.max(1,w-6),1,P.amber);
    r(x+3,y+2,1,2,P.cream);
  };
  // Feilen's side-eye proportions, doubled to this canvas: a narrow pupil
  // framed by ivory, with a short lower iris instead of a long vertical slit.
  const profileEye = (x: number, y: number) => {
    if (blink) {
      r(x,y+6,2,1,P.eye); r(x+2,y+7,4,1,P.eye); r(x+6,y+6,2,1,P.eye);
      return;
    }
    r(x,y,8,1,P.eye); r(x,y+1,8,7,P.cream);
    r(x+2,y+1,4,4,P.eye); r(x+2,y+5,4,2,P.iris);
    r(x+2,y+7,4,1,P.amber); r(x+2,y+1,1,1,P.cream);
  };
  // Small tucked fingers, with a stepped edge rather than a square fist.
  const hand = (x: number, y: number) => {
    r(x,y,3,2,P.skin); r(x+1,y+2,2,1,P.skinShade);
  };
  const sleeve = (x: number, y: number, mirror = false, showHand = true) => {
    ctx.save(); ctx.translate(x,y);
    if (mirror) { ctx.translate(9,0); ctx.scale(-1,1); }
    poly([4,0,8,1,8,6,7,11,6,15,1,15,0,12,1,7,2,3],P.ink);
    poly([4,2,6,2,6,7,5,12,2,13,2,9,3,5],P.coat);
    r(3,4,1,5,P.coatLight); r(2,12,4,1,P.goldShade);
    if (showHand) hand(3,14);
    ctx.restore();
  };
  const tail = (x: number, y: number, mirror: boolean) => {
    ctx.save(); ctx.translate(x,y); if (mirror) { ctx.translate(17,0); ctx.scale(-1,1); }
    poly([4,0,14,0,14,12,13,24,15,33,17,37,12,39,6,37,2,33,0,28,3,30,5,30,4,21,2,12],P.ink);
    poly([5,2,12,2,12,14,11,25,13,34,14,36,11,37,7,35,4,31,7,32,7,24,5,15],P.hair);
    poly([6,4,8,4,8,18,10,28,9,33,7,31,7,25,6,18],P.hairLight);
    poly([10,7,12,6,11,23,13,33,11,35,9,28],P.hairDark);
    ctx.restore();
  };
  // Knee socks and low loafers; the planted foot always shares the same baseline.
  const legs = direction === 'right' ? [[31-step*2,0],[37+step*2,-Math.abs(step)]] : [[23,Math.min(0,step)],[36,Math.min(0,-step)]];
  for (const [x,dy] of legs) {
    r(x,75+dy,7,15,P.ink); r(x+1,76+dy,5,6,P.skin); r(x+1,81+dy,5,8,P.cream);
    r(x+1,82+dy,5,2,P.redDark); r(x-1,89+dy,10,4,P.ink); r(x,89+dy,8,2,P.coatLight);
    r(x+2,89+dy,3,1,P.gold);
  }
  ctx.save(); ctx.translate(0,bob);
  ctx.save();
  if (seated && direction === 'down') { ctx.beginPath(); ctx.rect(0,0,HUTAO_W,66); ctx.clip(); }
  if (direction === 'right') {
    // One connected rear hair volume; separate tails left a bright hole.
    ctx.save(); ctx.translate(step/2,0);
    poly([19,35,34,36,38,47,36,61,34,72,31,77,24,78,17,75,12,70,11,65,15,68,15,57,13,47,15,39],P.ink);
    poly([20,38,32,38,35,48,33,62,31,72,28,75,23,75,18,72,16,69,18,70,18,57,16,47,18,40],P.hair);
    poly([19,43,22,42,21,52,23,64,24,72,21,71,19,62,18,52],P.hairSheen);
    poly([29,43,32,44,32,56,29,65,28,73,25,73,26,63,29,54],P.hairDark);
    ctx.restore();
  }
  else {
    tail(7+step/2,40,false); tail(40+step/2,40,true);
    r(18,47,9,27,P.hairDark); r(39,47,8,27,P.hairDark);
  }
  ctx.restore();

  if (direction === 'right') {
    poly([29,51,43,51,46,58,45,68,49,78,42,81,29,79,25,75,29,63],P.ink);
    poly([31,54,41,54,44,59,42,69,46,77,41,78,29,76,31,64],P.coat);
    r(41,54,3,5,P.redDark); r(41,60,2,2,P.gold); r(43,72,2,4,P.goldShade);
    // Rounded rear skull; the separate cheek follows Feilen's short-chin profile.
    poly([22,24,41,24,47,28,50,34,50,41,51,44,50,48,46,52,40,54,33,53,25,49,19,44,16,37,17,30],P.ink);
    poly([23,26,40,26,46,30,48,35,48,42,49,45,48,48,44,51,38,52,31,50,24,47,20,42,18,36,19,30],P.hair);
    poly([34,30,48,30,48,38,50,40,50,46,48,50,44,52,36,52,32,48,30,40],P.ink);
    poly([34,32,46,32,46,38,48,40,48,46,46,48,44,50,36,50,34,46],P.skin);
    // A single curved fringe replaces the zigzag wedge across the forehead.
    poly([22,27,39,26,46,29,48,35,45,35,42,32,39,32,41,36,38,35,34,31,32,36,31,43,33,48,29,50,25,46,22,40,20,33],P.hairDark);
    poly([23,28,38,28,44,30,46,33,43,32,39,30,33,29,30,34,29,42,30,46,27,45,24,40,22,33],P.hair);
    poly([23,30,26,29,25,34,25,39,27,43,25,42,23,38,22,34],P.hairSheen);
    // The ear is tucked behind a short sidelock; no exposed C-shaped ear.
    poly([30,34,34,32,35,39,34,48,32,53,29,51,31,44],P.hairDark);
    r(31,37,2,10,P.hair); r(31,42,1,6,P.hairSheen);
    profileEye(38,35); r(35,45,2,1,P.cheekSoft);
  } else {
    poly([22,52,43,52,46,60,45,69,49,77,44,81,34,78,31,74,27,80,19,79,17,76,21,65],P.ink);
    poly([23,55,41,55,43,61,42,70,46,76,42,78,34,75,31,70,26,77,20,76,24,65],P.coat);
    r(24,58,3,12,P.coatLight);
    if (direction === 'down') {
      poly([32,58,37,62,36,64,32,61,28,64,27,62],P.gold); r(31,61,2,5,P.gold);
      r(30,68,4,1,P.goldShade); r(31,71,2,1,P.goldShade); r(23,73,2,2,P.gold);
      r(40,70,2,5,P.goldShade); r(39,74,4,1,P.goldShade);
    }
    // The hair cap and face occupy a little over half of the whole silhouette.
    ctx.save();
    // Front back-hair stops at the jaw instead of forming a dark chin band.
    if (direction === 'down') { ctx.beginPath(); ctx.rect(0,0,HUTAO_W,53); ctx.clip(); }
    poly([18,22,44,22,50,28,53,40,51,49,45,55,20,55,13,48,11,38,13,28],P.ink);
    poly([19,24,43,24,48,29,51,40,49,47,44,52,20,52,15,46,13,38,15,29],P.hair);
    ctx.restore();
    if (direction === 'up') {
      // Staggered locks continue over the shoulders. No paired vertical
      // highlights or central red tie that could be mistaken for a second face.
      poly([16,28,47,28,50,39,48,48,45,54,42,59,38,64,34,62,31,66,27,63,22,64,21,57,17,52,14,43],P.hairDark);
      poly([18,29,45,29,47,39,45,48,42,52,40,58,37,61,34,59,31,63,28,59,24,61,23,54,19,49,17,41],P.hair);
      poly([20,30,24,30,22,36,22,42,25,48,25,54,23,51,20,44,19,37],P.hairSheen);
      poly([31,29,34,29,32,37,33,45,31,54,30,60,28,57,29,47,29,37],P.hairDark);
      poly([40,31,43,32,44,39,41,46,39,51,39,56,37,58,37,50,40,42,41,36],P.hairSheen);
    } else {
      // Neck and collar are in front of the rear hair, beneath a one-pixel jaw.
      poly([26,53,39,53,38,57,33,60,28,58],P.redDark);
      poly([28,54,37,54,36,57,33,58,29,56],P.red);
      r(30,53,7,3,P.skinShade);
      // Gradually turn the cheeks into a short chin instead of a straight bevel.
      poly([18,30,48,30,48,46,47,49,45,51,42,53,38,54,28,54,24,53,21,51,19,49,18,46],P.ink);
      poly([20,32,46,32,46,46,45,48,43,50,40,52,37,53,29,53,26,52,23,50,21,48,20,46],P.skin);
      r(20,47,4,2,P.cheek); r(42,47,3,2,P.cheek);
      r(30,49,1,1,P.mouth); r(31,50,3,1,P.mouth); r(34,49,1,1,P.mouth);
      // Three sweeping bangs keep the round eyes clear.
      poly([16,26,45,26,48,31,48,39,45,42,42,38,40,32,39,38,35,37,30,32,31,37,34,40,30,40,24,35,23,32,20,38,17,42,14,40],P.hairDark);
      poly([17,27,43,27,46,31,46,38,44,37,41,30,37,29,38,35,34,34,29,29,27,29,28,34,31,38,28,36,24,31,22,30,20,36,17,38],P.hair);
      poly([18,29,21,28,21,31,18,35,17,34],P.hairLight);
      poly([28,28,32,28,34,30,34,32,31,30],P.hairLight);
      // Cheek-hugging locks with outward tips, then a separate long strand.
      poly([14,35,18,35,18,44,22,50,18,52,14,49,11,46,14,46],P.hairDark);
      poly([47,35,51,34,51,46,54,47,49,51,45,51,46,47],P.hairDark);
      r(15,37,2,8,P.hairLight); r(48,37,2,8,P.hairLight);
      eye(20,37); eye(36,37);
    }
  }

  // Tall, gently rounded hat; the warm paper seal stays distinct from the hair.
  const side = direction === 'right';
  poly(side ? [19,9,39,8,47,12,49,23,54,26,54,29,45,31,19,28,12,26,12,23,17,21] : [15,10,21,7,42,7,48,10,50,22,56,25,56,29,49,31,15,31,8,28,8,25,13,22],P.ink);
  poly(side ? [20,11,39,10,45,13,47,23,21,23,19,21] : [17,11,22,9,41,9,46,12,48,22,16,22],P.hat);
  poly(side ? [37,11,43,13,45,22,36,22] : [36,10,41,10,45,13,47,21,36,21],P.hatLight);
  r(side?20:16,21,side?27:32,3,P.hairDark);
  poly(side ? [17,24,46,24,51,26,51,28,44,29,19,26] : [14,24,49,24,53,26,53,27,47,28,17,28,11,26],P.hatLight);
  if (direction !== 'up') {
    const sx = side ? 37 : 27;
    poly([sx,6,sx+7,6,sx+9,9,sx+8,23,sx-1,23,sx-2,10],P.goldShade);
    poly([sx+1,7,sx+6,7,sx+7,10,sx+6,22,sx,22,sx-1,11],P.gold);
    r(sx+3,9,1,4,P.ink); r(sx+1,12,5,1,P.ink); r(sx+2,13,1,2,P.ink);
    r(sx+4,14,1,2,P.ink); r(sx+1,15,4,1,P.ink); r(sx+3,16,1,4,P.ink);
  }
  // Plum branch and tassel are kept inside every frame, including walking bob.
  if (direction !== 'up') {
    ctx.save();
    // In profile the ornament attaches above the ear, behind the face.
    if (side) ctx.translate(-27,0);
    poly([48,18,49,9,53,7,55,2,57,2,56,8,52,12,52,19],P.ink);
    r(53,6,2,5,P.goldShade);
    flower(49,5,true); flower(44,15); flower(52,27,true);
    r(49,29,2,5,P.purple); r(50,32,6,2,P.purple); r(55,29,2,4,P.purple);
    r(53,34,1,6,P.ink); r(52,39,3,6,P.purple); r(51,44,5,2,P.hairDark);
    ctx.restore();
  } else { flower(9,18,true); r(11,25,2,7,P.purple); }

  // Rear view never reuses front-facing hands, including working poses.
  if (direction === 'up') {
    ctx.restore(); ctx.restore(); return;
  }
  // Sleeves hang from the shoulders; only tiny fingers emerge from the cuffs.
  if (side) {
    if (action === 'read') {
      r(44,56,14,14,P.ink); r(45,57,12,12,P.book); r(46,57,10,2,P.cream); r(50,61,4,1,P.gold);
      poly([36,58,40,59,43,64,47,65,46,69,40,69,36,65],P.ink);
      poly([37,60,39,61,42,66,45,66,44,68,40,67,37,64],P.coat);
      hand(46,65+phase%2);
    } else if (action === 'type') {
      poly([35,58,40,59,43,64,50,64,50,68,41,69,35,65],P.ink);
      poly([36,60,39,61,42,65,48,65,48,67,41,67,36,64],P.coat);
      hand(49,64+phase%2);
    } else {
      sleeve(33,57-step);
    }
  } else if (action === 'read') {
    sleeve(20,57,false,false); sleeve(38,57,true,false);
    poly([23,58,32,60,42,58,42,71,32,73,23,71],P.ink);
    poly([24,59,32,61,41,59,41,70,32,71,24,70],P.book);
    r(31,61,2,10,P.goldShade); r(25,60,5,1,P.cream); r(35,60,5,1,P.cream);
    hand(23,66+phase%2); hand(39,66+phase%2);
  } else if (action === 'type') {
    poly([22,57,25,58,26,63,29,65,28,68,23,67,20,62],P.ink);
    poly([23,59,24,60,24,64,27,65,26,66,23,65,22,62],P.coatLight);
    poly([41,57,38,58,37,63,34,65,35,68,40,67,43,62],P.ink);
    poly([40,59,39,60,39,64,36,65,37,66,40,65,41,62],P.coatLight);
    hand(27,65+phase%2); hand(34,66-phase%2);
  } else {
    sleeve(17,57-step); sleeve(39,57+step,true);
  }
  ctx.restore(); ctx.restore();
}
