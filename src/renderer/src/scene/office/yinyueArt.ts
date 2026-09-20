/** Feilen-based proportions and facial geometry, with Yinyue-specific hair and dress. */
export const YINYUE_W = 32;
export const YINYUE_H = 48;
export const YINYUE_DESK_HAIRLINE = 33;
export type YinyueDirection = 'down' | 'up' | 'right' | 'left';
export type YinyueAction = 'idle' | 'walk' | 'type' | 'read';
const P = {
  ink: '#4a3d56', hair: '#dcdde9', darkHair: '#abaac5', lightHair: '#fffaf4',
  skin: '#ffebcf', shade: '#e6bba4', blush: '#e7b0ab', white: '#fff7e9',
  coat: '#d0d6e2', coatLight: '#f0edf0', coatDark: '#8f91a9',
  shoe: '#737083', pupil: '#383b55', iris: '#8095b1', irisLight: '#b7d1df',
  glint: '#fff6e4', mouth: '#876064', cheek: '#f2c5b6', book: '#6f899f', red: '#b85e73', redLight: '#e49aa7', ear: '#e6aeb5',
};

/** Fixed foot baseline across all frames; integer coordinates keep pixels crisp. */
export function paintYinyue(ctx: CanvasRenderingContext2D, direction: YinyueDirection, action: YinyueAction, frame = 0, seated = false): void {
  ctx.save();
  ctx.clearRect(0, 0, YINYUE_W, YINYUE_H);
  if (direction === 'left') { ctx.translate(YINYUE_W, 0); ctx.scale(-1, 1); direction = 'right'; }
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
  const ears = (profile = false, back = false) => {
    // An inset tip and broad root read as a furry triangle, not an outer horn.
    // Roots use hair colours rather than a dark horizontal outline.
    const ear = (x: number, flip: boolean) => {
      ctx.save(); ctx.translate(x,0); if (flip) { ctx.translate(8,0); ctx.scale(-1,1); }
      poly([3,1,4,1,5,3,7,5,8,8,0,8,0,6,1,4,2,3,2,2],P.ink);
      poly([3,3,4,3,6,6,7,8,1,8,1,6,2,5],P.lightHair);
      if (back) {
        poly([3,4,4,4,6,7,6,8,2,8,2,6],P.hair);
        rect(5,7,2,1,P.darkHair);
      } else {
        poly([3,4,5,6,5,7,2,7,2,6],P.ear);
        rect(3,6,1,1,P.white);
      }
      rect(1,8,6,1,P.hair); rect(2,7,1,1,P.lightHair);
      ctx.restore();
    };
    if (profile) {
      // The far ear is mostly hidden by the near ear and crown, without pink.
      poly([15,2,16,2,18,5,19,7,14,7,14,4],P.darkHair);
      rect(15,4,1,3,P.hair);
      ear(17,false);
    } else { ear(5,false); ear(20,true); }
  };
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
    poly([10,3,20,3,20,4,24,4,24,4,27,4,27,7,28,7,28,12,26,12,25,21,24,28,22,34,18,37,12,37,12,36,7,36,7,34,3,34,3,31,2,31,2,27,4,27,4,19,5,19,5,7,7,7,7,4,10,4],P.ink);
    poly([11,4,21,4,21,5,24,5,24,7,26,7,26,11,23,11,23,24,21,32,18,35,12,35,12,34,7,34,7,31,4,31,4,28,6,28,6,19,7,19,7,7,9,7,9,4,11,4],P.hair);
    rect(11,4,10,1,P.lightHair); rect(8,6,2,5,P.lightHair);
    poly([8,18,10,18,10,25,8,25,8,31,6,31,6,27,8,27],P.lightHair);
    poly([12,22,14,22,14,29,12,29,12,35,10,35,10,30,12,30],P.darkHair);
    ears(true);
    poly([17,23,23,23,25,28,25,36,23,38,14,38,13,35,15,29],P.ink);
    poly([18,25,22,25,23,29,23,36,15,36,16,30],P.coat);
    rect(22,24,2,5,P.white); rect(21,26,2,5,P.white);
    rect(15,31,9,2,P.red); rect(16,31,7,1,P.redLight); rect(16,33,2,4,P.red);
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
    ctx.restore(); ctx.restore(); return;
  }
  function poly(points: number[], color: string): void {
    // Rasterize to whole pixels instead of Canvas antialiased polygon edges.
    ctx.fillStyle = color;
    for (let y = 0; y < YINYUE_H; y++) {
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
  ctx.save();
  // The front desk hides the hanging back hair, while hands and torso remain
  // visible over the tabletop. Standing/walking hair keeps its full length.
  if (seated && direction === 'down') {
    ctx.beginPath(); ctx.rect(0, 0, YINYUE_W, YINYUE_DESK_HAIRLINE); ctx.clip();
  }
  // Lower the crown cap two pixels so the ear tips rise above it; face and
  // long-hair proportions below the ear roots stay unchanged.
  poly([11,3,21,3,21,4,25,4,25,4,27,4,27,7,29,7,29,21,30,21,30,27,31,27,31,32,29,32,29,35,25,35,25,37,21,37,21,36,11,36,11,37,7,37,7,35,3,35,3,31,1,31,1,27,3,27,3,20,4,20,4,7,6,7,6,4,8,4,8,4,11,4], P.ink);
  poly([11,4,22,4,22,5,25,5,25,7,27,7,27,23,28,23,28,29,29,29,29,32,26,32,26,35,22,35,22,34,9,34,9,35,5,35,5,31,3,31,3,28,5,28,5,20,6,20,6,7,8,7,8,4,11,4], P.hair);
  rect(10,4,12,1,P.lightHair); rect(7,6,2,5,P.lightHair);
  rect(25,9,2,12,P.darkHair); rect(26,25,2,7,P.lightHair);
  ctx.restore();
  ears(false,direction === 'up');
  if (direction === 'up') {
    // Reveal the coat hem and sleeves below the hair so the body reads as a
    // separate volume rather than legs attached directly to a hair silhouette.
    poly([8,32,25,32,25,37,23,39,9,39,7,37],P.ink);
    rect(9,33,14,4,P.coat); rect(10,37,12,1,P.coatLight);
    rect(16,34,1,4,P.coatDark);
    rect(4,26-step,4,8,P.ink); rect(5,27-step,3,5,P.coatLight);
    rect(5,32-step,3,3,P.skin);
    rect(25,26+step,4,8,P.ink); rect(25,27+step,3,5,P.coat);
    rect(25,32+step,3,3,P.skin);
    // Staggered ends stop above the hem and overlap the sleeve shoulders.
    poly([8,24,25,24,25,30,23,30,23,33,20,33,20,35,17,35,17,33,14,33,14,35,11,35,11,32,8,32],P.darkHair);
    poly([9,24,24,24,24,29,22,29,22,32,19,32,19,33,17,33,17,31,14,31,14,33,12,33,12,30,9,30],P.hair);
    rect(9,13,2,15,P.darkHair); rect(20,11,2,20,P.darkHair);
    rect(6,23,2,9,P.lightHair); rect(14,21,2,13,P.lightHair);
    rect(23,19,2,14,P.lightHair); rect(11,31,2,5,P.darkHair);
    rect(18,32,2,4,P.darkHair);
    rect(10,35,12,2,P.red); rect(15,35,3,1,P.redLight);
    if (work) {
      rect(4,27 + phase % 2,3,3,P.skin);
      rect(27,28 - phase % 2,3,3,P.skin);
      if (action === 'read') { rect(28,25,3,5,P.book); rect(28,25,2,1,P.white); }
    }
    ctx.restore(); ctx.restore(); return;
  }
  // Coat and white buttoned collar.
  poly([11,23,22,23,24,26,25,35,22,38,10,38,7,35,8,27],P.ink);
  poly([11,25,21,25,23,29,23,35,20,36,10,36,9,33,10,28],P.coat);
  rect(11,28,2,6,P.coatLight); rect(20,29,2,6,P.coatDark);
  poly([12,24,21,24,20,27,18,27,17,31,15,28,13,27],P.white);
  rect(16,26,1,2,P.coatDark);
  rect(10,31,13,2,P.red); rect(11,31,11,1,P.redLight);
  poly([13,33,16,34,18,33,21,33,20,35,18,35,18,37,16,37,16,35,13,35],P.red);
  rect(16,33,2,1,P.redLight);
  // Slightly narrower cheeks and a rounded taper, retaining the soft skin edge.
  poly([10,11,24,11,24,20,21,23,13,23,10,20],P.shade);
  poly([11,12,23,12,23,20,20,22,14,22,11,20],P.skin);
  rect(11,19,2,1,P.cheek); rect(21,19,2,1,P.cheek);
  rect(12,20,1,1,P.blush); rect(21,20,1,1,P.blush);
  const blink = action === 'idle' && phase === 3;
  for (const x of [11,19]) {
    eye(x,14,blink);
  }
  rect(16,21,2,1,P.mouth);
  // Swept fringe stays above the eye line.
  poly([8,7,24,7,25,10,26,13,24,13,21,9,20,11,18,13,16,13,18,9,15,11,12,13,9,13,8,15,7,14],P.darkHair);
  poly([9,7,22,7,24,10,24,11,21,8,18,10,17,11,18,8,14,10,11,12,9,12,8,13],P.hair);
  poly([10,6,19,6,17,8,13,9,10,11,8,11,9,8],P.lightHair);
  for (const x of [8,24]) { rect(x,13,3,15,P.darkHair); rect(x,14,2,13,P.hair); rect(x,18,1,8,P.lightHair); }
  // Tiny silver tassels occupy the hair, not the chin or cheeks.
  for (const x of [8,24]) { rect(x,21,1,2,P.lightHair); rect(x,24,1,3,P.lightHair); }
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
    rect(8,29-step,3,1,P.red); rect(22,29+step,3,1,P.red);
  }
  ctx.restore(); ctx.restore();
}
