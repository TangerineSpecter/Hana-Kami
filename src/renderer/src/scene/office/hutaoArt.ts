/** Hu Tao with Feilen-based four-direction proportions and native pixel details. */
export const HUTAO_W = 32;
export const HUTAO_H = 48;
export const HUTAO_DESK_HAIRLINE = 33;
export type HutaoDirection = 'down' | 'up' | 'right' | 'left';
export type HutaoAction = 'idle' | 'walk' | 'type' | 'read';
const P = {
  ink: '#352532', hair: '#73505b', darkHair: '#513744', lightHair: '#ab7380',
  skin: '#ffebcf', shade: '#e6bba4', blush: '#e7b0ab', white: '#fff7e9',
  coat: '#49353c', coatLight: '#63454a', coatDark: '#352532',
  shoe: '#49353c', pupil: '#733545', iris: '#c9615b', irisLight: '#efaa7c',
  glint: '#fff6e4', mouth: '#ad6c72', cheek: '#f2c5b6', book: '#8a4147',
  red: '#d84643', redDark: '#8e2c38', gold: '#e7c68a', goldShade: '#b68c63', purple: '#9470ad',
};

/** Fixed foot baseline across all frames; integer coordinates keep pixels crisp. */
export function paintHutao(ctx: CanvasRenderingContext2D, direction: HutaoDirection, action: HutaoAction, frame = 0, seated = false): void {
  ctx.save();
  ctx.clearRect(0, 0, HUTAO_W, HUTAO_H);
  if (direction === 'left') { ctx.translate(HUTAO_W, 0); ctx.scale(-1, 1); direction = 'right'; }
  const walking = action === 'walk';
  const phase = frame % 4;
  const step = walking ? [0, 1, 0, -1][phase] : 0;
  const bob = walking && phase % 2 === 1 ? -1 : 0;
  const work = action === 'type' || action === 'read';
  const rect = (x: number, y: number, w: number, h: number, color: string) => {
    ctx.fillStyle = color; ctx.fillRect(x, y, w, h);
  };
  // A dark upper pupil, muted lower iris, ivory sclera and a tiny warm glint.
  // Keep the same palette in profile instead of borrowing purple hair colors.
  const eye = (x: number, y: number, blink: boolean) => {
    if (blink) {
      rect(x, y + 2, 1, 1, P.pupil);
      rect(x + 1, y + 3, 2, 1, P.pupil);
      rect(x + 3, y + 2, 1, 1, P.pupil);
      return;
    }
    rect(x, y, 4, 1, P.pupil);
    rect(x, y + 1, 4, 4, P.white);
    rect(x + 1, y + 1, 3, 2, P.pupil);
    rect(x + 1, y + 3, 3, 1, P.iris);
    rect(x + 1, y + 4, 2, 1, P.irisLight);
    rect(x + 1, y + 1, 1, 1, P.glint);
  };
  const hat = (side = false, back = false) => {
    // A tall cylindrical crown: shallow oval top, upright walls, separate band.
    // The lower brim follows the forehead but still clears the eye line.
    poly(side ? [10,2,13,1,22,1,25,2,26,10,10,10]
      : [7,3,10,1,22,1,25,3,26,11,6,11],P.ink);
    poly(side ? [11,3,14,2,21,2,24,3,25,9,11,9]
      : [8,4,11,2,21,2,24,4,25,10,7,10],P.coat);
    poly(side ? [21,3,23,3,24,8,22,9]
      : [21,3,23,4,24,9,21,9],P.coatLight);
    rect(side ? 13 : 10,2,10,1,P.coatLight);
    rect(side ? 11 : 7,8,side ? 14 : 18,2,P.coatDark);
    poly(side ? [7,10,11,8,20,9,26,10,29,12,26,13,21,12,11,11,7,12]
      : [3,12,6,10,11,9,21,9,26,10,29,12,28,14,24,13,20,12,12,12,8,13,4,14],P.ink);
    poly(side ? [9,10,12,9,20,10,25,11,27,12,23,11,12,10]
      : [5,12,9,11,13,10,20,10,25,11,27,12,24,12,20,11,13,11,8,12,5,13],P.coatLight);
    if (!back) {
      const x = side ? 20 : 14;
      poly([x+1,1,x+4,1,x+5,3,x+5,9,x,9,x,3],P.goldShade);
      rect(x+1,2,3,6,P.gold);
      rect(x+2,3,1,1,P.ink); rect(x+1,4,3,1,P.ink);
      rect(x+2,5,1,3,P.ink);
    }
    const blossom = (x: number,y: number) => {
      ctx.save(); ctx.translate(x,y);
      // Separate petals and indented corners avoid a red square silhouette.
      poly([2,0,4,0,4,2,6,1,7,3,5,4,6,6,4,7,3,5,1,6,0,4,2,3,0,2],P.redDark);
      rect(2,1,2,2,P.red); rect(4,2,2,2,P.red);
      rect(4,4,1,2,P.red); rect(1,4,2,1,P.red); rect(1,2,2,1,P.red);
      rect(3,3,1,2,P.gold); rect(2,3,3,1,P.gold);
      ctx.restore();
    };
    if (back) { blossom(3,5); rect(6,12,1,2,P.purple); }
    else {
      const x = side ? 8 : 23;
      poly([x+4,6,x+4,4,x+6,2,x+6,1,x+7,1,x+7,3,x+5,5,x+5,7],P.darkHair);
      rect(x+5,2,1,3,P.redDark); rect(x+4,3,3,1,P.red);
      blossom(x,5);
      rect(x+3,12,1,3,P.purple); rect(x+2,14,3,1,P.purple);
    }
  };
  const hairTail = (x: number, mirror = false) => {
    ctx.save(); ctx.translate(x + step,0);
    if (mirror) { ctx.translate(9,0); ctx.scale(-1,1); }
    poly([2,19,8,20,7,25,7,30,9,35,7,38,3,37,0,34,2,34,1,29,1,24],P.ink);
    poly([3,21,6,21,5,27,5,31,7,35,6,36,3,35,3,31,2,26],P.hair);
    poly([3,23,4,23,4,30,5,34,4,34,3,30],P.lightHair);
    ctx.restore();
  };
  if (direction === 'right') {
    // Profile has overlapping legs, a forward-facing toe, and a hair mass
    // behind the shoulder. It is intentionally not the frontal body rotated.
    for (const [x, dy, far] of [[18 - step * 2, 0, 1], [19 + step * 2, -Math.abs(step), 0]]) {
      rect(x,35+dy,5,9,P.ink);
      rect(x+1,36+dy,3,6,far ? P.shade : P.skin);
      rect(x+1,41+dy,3,3,P.white); rect(x+1,41+dy,3,1,P.redDark);
      rect(x-1,44+dy,8,3,P.ink); rect(x,44+dy,6,2,P.shoe);
    }
    ctx.save(); ctx.translate(0,bob);
    poly([10,1,20,1,20,2,24,2,24,4,27,4,27,7,28,7,28,12,26,12,25,21,24,28,22,34,18,37,12,37,12,36,7,36,7,34,3,34,3,31,2,31,2,27,4,27,4,19,5,19,5,7,7,7,7,4,10,4],P.ink);
    poly([11,3,21,3,21,4,24,4,24,7,26,7,26,11,23,11,23,24,21,32,18,35,12,35,12,34,7,34,7,31,4,31,4,28,6,28,6,19,7,19,7,7,9,7,9,4,11,4],P.hair);
    rect(11,3,10,1,P.lightHair); rect(8,6,2,5,P.lightHair);
    poly([8,18,10,18,10,25,8,25,8,31,6,31,6,27,8,27],P.lightHair);
    poly([12,22,14,22,14,29,12,29,12,35,10,35,10,30,12,30],P.darkHair);
    poly([17,23,23,23,25,28,25,36,23,38,14,38,13,35,15,29],P.ink);
    poly([18,25,22,25,23,29,23,36,15,36,16,30],P.coat);
    rect(22,24,2,4,P.redDark); rect(21,26,2,3,P.red);
    rect(22,30,1,1,P.gold); rect(22,34,1,2,P.goldShade);
    // A wider cheek and shorter chin keep the profile's chibi proportions.
    // The cheek is a single rounded volume, without a separate nose or mouth.
    poly([19,11,26,11,26,15,27,16,27,19,26,21,24,22,20,22,18,20,17,16],P.ink);
    poly([19,12,25,12,25,15,26,16,26,19,25,20,24,21,20,21,19,19],P.skin);
    // Ear sits behind the front lock; the eye stays on the visible cheek.
    rect(14,15,4,5,P.ink); rect(15,16,3,3,P.skin);
    poly([18,9,21,9,21,14,20,14,20,25,19,30,16,29,17,23,17,13],P.darkHair);
    rect(18,13,2,14,P.hair); rect(18,19,1,8,P.lightHair);
    poly([19,7,26,7,26,13,24,13,23,11,21,12,19,11],P.hair);
    rect(22,7,1,4,P.darkHair);
    // The profile needs a lighter, narrower pupil than the front-view eye;
    // leave an ivory margin on both sides rather than a solid dark block.
    if (action === 'idle' && phase === 3) {
      rect(21,16,1,1,P.pupil); rect(22,17,2,1,P.pupil);
      rect(24,16,1,1,P.pupil);
    } else {
      rect(21,13,4,1,P.pupil);
      rect(21,14,4,4,P.white);
      rect(22,14,2,2,P.pupil);
      rect(22,16,2,1,P.iris);
      rect(22,17,2,1,P.irisLight);
      rect(22,14,1,1,P.glint);
    }
    // Keep a skin row below the eye and place the faint blush toward the hair,
    // away from the face outline so it cannot read as a mouth or nose shadow.
    rect(21,19,2,1,P.cheek);
    if (action === 'type') {
      rect(19,28,4,5,P.coatLight); rect(22,30,6,3,P.coat);
      rect(27,29+phase%2,3,2,P.skin);
    } else if (action === 'read') {
      rect(24,24,7,8,P.ink); rect(25,25,5,6,P.book);
      rect(25,25,4,1,P.white); rect(22,29,4,3,P.coatLight);
      rect(25,29+phase%2,3,2,P.skin);
    } else {
      rect(19,27-step,4,7,P.coatLight); rect(20,33-step,3,3,P.skin);
    }
    hat(true);
    ctx.restore(); ctx.restore(); return;
  }
  function poly(points: number[], color: string): void {
    // Rasterize to whole pixels instead of Canvas antialiased polygon edges.
    ctx.fillStyle = color;
    for (let y = 0; y < HUTAO_H; y++) {
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
    rect(x, 41 + offset, 4, 3, P.white); rect(x+1,41+offset,2,1,P.redDark);
    rect(x - 1, 44 + offset, 6, 3 - Math.max(0, offset), P.ink);
    rect(x, 44 + offset, 4, 2 - Math.max(0, offset), P.shoe);
  }
  ctx.save(); ctx.translate(0, bob);
  ctx.save();
  // The front desk hides the hanging back hair, while hands and torso remain
  // visible over the tabletop. Standing/walking hair keeps its full length.
  if (seated && direction === 'down') {
    ctx.beginPath(); ctx.rect(0, 0, HUTAO_W, HUTAO_DESK_HAIRLINE); ctx.clip();
  }
  // Feilen's skull width, with two separate long tails behind the shoulders.
  hairTail(2); hairTail(22,true);
  poly([11,1,21,1,21,2,25,2,25,4,27,4,27,7,29,7,29,21,27,24,23,25,9,25,5,23,4,20,4,7,6,7,6,4,8,4,8,2,11,2],P.ink);
  poly([11,3,22,3,22,4,25,4,25,7,27,7,27,20,25,22,22,23,10,23,7,21,6,19,6,7,8,7,8,4,11,4],P.hair);
  rect(7,9,2,10,P.lightHair); rect(25,9,2,11,P.darkHair);
  ctx.restore();
  if (direction === 'up') {
    // Arms sit beside the torso. Working forearms reach forward and are
    // occluded by the back, rather than adding another pair of visible hands.
    for (const [x, swing, color] of [[6, -step, P.coatLight], [23, step, P.coat]] as const) {
      const dy = work ? (action === 'type' ? phase % 2 : 0) : swing;
      rect(x,26+dy,4,work ? 7 : 10,P.ink);
      rect(x+1,27+dy,2,work ? 5 : 6,color);
      if (!work) {
        rect(x+1,33+dy,2,1,P.coatDark);
      }
    }
    // Reveal the coat hem and sleeves below the hair so the body reads as a
    // separate volume rather than legs attached directly to a hair silhouette.
    poly([11,24,22,24,25,29,25,37,23,39,9,39,7,37,8,29],P.ink);
    rect(9,26,14,11,P.coat); rect(10,37,12,1,P.coatLight);
    rect(16,34,1,4,P.coatDark);
    if (!work) {
      rect(7,34-step,2,2,P.skin);
      rect(24,34+step,2,2,P.skin);
    }
    poly([8,17,25,17,25,23,23,26,20,27,18,26,16,28,13,27,11,28,8,24],P.darkHair);
    poly([9,17,24,17,23,23,20,25,18,24,16,26,13,25,11,26,10,23],P.hair);
    rect(10,13,1,9,P.lightHair); rect(21,13,1,10,P.lightHair);
    rect(15,18,1,7,P.darkHair); rect(16,34,1,3,P.goldShade);
    hat(false,true);
    ctx.restore(); ctx.restore(); return;
  }
  // Coat and white buttoned collar.
  poly([11,23,22,23,24,26,25,35,22,38,10,38,7,35,8,27],P.ink);
  poly([11,25,21,25,23,29,23,35,20,36,10,36,9,33,10,28],P.coat);
  rect(11,28,2,6,P.coatLight); rect(20,29,2,6,P.coatDark);
  poly([12,24,21,24,20,27,18,27,17,29,15,27,13,27],P.redDark);
  rect(15,25,4,1,P.red);
  rect(16,28,1,2,P.gold); rect(15,29,3,1,P.gold);
  rect(17,32,1,1,P.goldShade); rect(17,35,1,1,P.goldShade); rect(22,35,1,2,P.gold);
  // Keep the tapered jaw in a skin shadow; a hair-colored rim reads as a beard.
  poly([10,11,24,11,24,20,21,23,13,23,10,20],P.shade);
  poly([11,12,23,12,23,20,20,22,14,22,11,20],P.skin);
  rect(11,19,2,1,P.cheek); rect(21,19,2,1,P.cheek);
  rect(12,20,1,1,P.blush); rect(21,20,1,1,P.blush);
  const blink = action === 'idle' && phase === 3;
  for (const x of [11,19]) {
    eye(x,14,blink);
  }
  // Preserve Hu Tao's front-only smile.
  rect(15,20,1,1,P.mouth); rect(16,21,2,1,P.mouth); rect(18,20,1,1,P.mouth);
  // Fringe with three distinct blunt locks, plus long front sidelocks.
  poly([8,7,25,7,25,13,23,14,21,13,20,10,20,14,16,14,15,10,15,14,11,14,10,12,8,13],P.hair);
  rect(11,7,1,6,P.darkHair); rect(18,6,1,7,P.darkHair); rect(23,8,1,4,P.darkHair);
  for (const x of [8,24]) { rect(x,13,3,15,P.darkHair); rect(x,14,2,13,P.hair); rect(x,18,1,8,P.lightHair); }
  hat();
  // Work hands are drawn independently of the walking legs; no baked-in furniture.
  if (action === 'type') {
    const dy = phase % 2;
    rect(10,28,5,3,P.coatLight);
    rect(11,28 + dy,4,2,P.skin);
    rect(19,31 - dy,4,2,P.skin);
  } else if (action === 'read') {
    const bx = 13, by = 26 + (phase === 2 ? 1 : 0);
    rect(bx-1,by-1,8,8,P.ink); rect(bx,by,6,6,P.book);
    rect(bx+3,by,1,6,P.lightHair); rect(bx+1,by+1,2,1,P.white);
    rect(bx-2,by+4,3,2,P.skin); rect(bx+5,by+4,2,2,P.skin);
  } else {
    const x = 8;
    rect(x,28-step,3,6,P.coatLight); rect(x,33-step,3,3,P.skin);
    rect(22,28+step,3,6,P.coat); rect(22,33+step,3,3,P.skin);
  }
  ctx.restore(); ctx.restore();
}
