import { Graphics } from 'pixi.js';

// Authored at the map's native pixel resolution. These graphics replace only
// surface/furniture art; the Tiled map remains the source of interaction data.
export const OAK_FLOOR_GIDS = new Set([783, 784, 799, 800]);
const ink = 0x40332a;

export function paintOakTile(g: Graphics, tx: number, ty: number): void {
  const shades = [0xdec08f, 0xe1c493, 0xddbd89, 0xdfc18f, 0xe3c695];
  for (let py = 0; py < 16; py++) {
    const y = ty * 16 + py;
    const row = Math.floor(y / 12);
    const offset = (row % 3) * 23;
    let start = 0;
    let previous = -1;
    for (let px = 0; px <= 16; px++) {
      const x = tx * 16 + px;
      const board = Math.floor((x + offset) / 76);
      const u = (x + offset) % 76;
      const v = y % 12;
      let color = shades[(row * 3 + board * 7) % shades.length];
      if (v === 0) color = 0xcaa775;
      else if (v === 1) color = 0xe8cd9f;
      else if (u === 0) color = 0xcfad7e;
      else if ((v === 5 || v === 9) && (u + row * 11) % 37 < 22) color = 0xdec08e;
      if (px === 16 || (previous !== -1 && color !== previous)) {
        g.rect(tx * 16 + start, y, px - start, 1).fill(previous);
        start = px;
      }
      previous = color;
    }
  }
}

/** Match each existing wall tile's opaque footprint, including narrow side
 * partitions, so no door, floor or silhouette is filled accidentally. */
export function paintWarmWall(g: Graphics, gid: number, tx: number, ty: number, closeBottom = false): boolean {
  const r = (x: number, y: number, w: number, h: number, c: number) =>
    g.rect(tx * 16 + x, ty * 16 + y, w, h).fill(c);
  const face = (x: number, y: number, w: number, h: number) => {
    r(x, y, w, h, 0xeee6d5);
    // Vertical shading only: stacked 16px tiles must read as one tall panel.
    // A highlight on every tile's top edge creates an unwanted horizontal grid.
    // Panel seams span the stacked face and base tiles every 24 native pixels.
    for (let dx = x; dx < x + w; dx++) {
      const panelX = (tx * 16 + dx) % 24;
      if (panelX === 0) r(dx, y, 1, h, 0xcdbfa7);
      else if (panelX === 1) r(dx, y, 1, h, 0xf7f0df);
      else if (panelX > 20) r(dx, y, 1, h, 0xeae1d0);
    }
  };
  switch (gid) {
    case 522: // horizontal cap
      r(0, 0, 16, 1, ink); r(0, 1, 16, 1, 0x795a41); face(0, 2, 16, 8);
      r(0, 10, 16, 1, 0x795a41); r(0, 11, 16, 2, ink); face(0, 13, 16, 3); break;
    case 554: face(0, 0, 16, 16); break;
    case 570: face(0, 0, 16, 13); r(0, 13, 16, 1, 0x997653); r(0, 14, 16, 1, 0x674b36); r(0, 15, 16, 1, ink); break;
    case 611: case 643:
      r(2, 0, 12, 16, ink); r(4, 0, 1, 16, 0x87684d);
      r(5, 0, 8, 16, 0xeee6d5); r(5, 0, 1, 16, 0xf9f3e5);
      r(12, 0, 1, 16, 0xd8cbb5);
      if (gid === 611) { r(2, 0, 12, 1, ink); r(3, 1, 10, 1, 0x795a41); }
      if (closeBottom) { r(2, 14, 12, 1, 0x795a41); r(2, 15, 12, 1, ink); }
      break;
    default: return false;
  }
  return true;
}

export function paintWalnutDesk(g: Graphics, tx: number, ty: number): void {
  const r = (x: number, y: number, w: number, h: number, c: number) =>
    g.rect(tx * 16 + x, ty * 16 + y, w, h).fill(c);
  // Same 40px silhouette as the original three-tile desk, now with metal legs.
  r(4, 0, 40, 19, ink);
  r(4, 19, 5, 3, ink); r(39, 19, 5, 3, ink);
  r(5, 1, 38, 15, 0x795740);
  r(5, 2, 38, 1, 0x89654b);
  r(5, 7, 38, 1, 0x674833); r(5, 13, 38, 1, 0x674833);
  r(6, 4, 10, 1, 0x805d44); r(31, 10, 10, 1, 0x89654b);
  r(5, 16, 38, 2, 0xd9ba7c); r(5, 18, 38, 1, 0x9b7b52);
  // Transparent space under the apron is achieved by only drawing the legs.
  // The initial silhouette is limited to the top plus the two side frames.
  r(5, 19, 3, 3, 0x343840); r(40, 19, 3, 3, 0x343840);
  r(6, 19, 1, 2, 0x87908b); r(41, 19, 1, 2, 0x87908b);
  // The original monitor remains in its own atlas layer above this desk.
}

export function paintDeskAccessories(g: Graphics, tx: number, ty: number): void {
  const r = (x: number, y: number, w: number, h: number, c: number) =>
    g.rect(tx * 16 + x, ty * 16 + y, w, h).fill(c);
  r(19, 9, 10, 4, 0x494c54); r(20, 9, 8, 3, 0xc9cfd0);
  for (let y = 9; y < 12; y++) for (let x = 20; x < 28; x += 2) r(x, y, 1, 1, y % 2 ? 0xe7e4d8 : 0x87949c);
  r(32, 9, 3, 4, 0x474149); r(32, 9, 2, 3, 0xc8c5ba); r(33, 9, 1, 1, 0xf1e9d5);
}

export function paintRoundStool(g: Graphics, tx: number, ty: number, blue: boolean): void {
  const r = (x: number, y: number, w: number, h: number, c: number) =>
    g.rect(tx * 16 + x, ty * 16 + y, w, h).fill(c);
  const outline = 0x36333b;
  // A short connected swivel base and paired casters, tucked beneath the seat.
  r(6, 11, 4, 3, outline);
  r(4, 12, 8, 1, outline);
  for (const dx of [3, 11]) {
    r(dx, 11, 2, 3, outline);
    r(dx + 1, 13, 2, 2, outline);
    r(dx, 12, 1, 1, 0x997e59);
    r(dx + 1, 14, 1, 1, 0x686569);
  }
  const spans = [[5, 6], [3, 10], [2, 12], [2, 12], [1, 14], [1, 14], [1, 14], [1, 14], [2, 12], [2, 12], [3, 10], [5, 6]];
  const fabric = blue ? 0x648398 : 0xb57858;
  const highlight = blue ? 0x89a2b1 : 0xd09a76;
  const shadow = blue ? 0x465d74 : 0x8e5947;
  // Paint the cushion's darker lower rim before the top face.
  r(3, 9, 10, 3, outline);
  r(4, 10, 8, 1, shadow);
  spans.forEach(([x, w], y) => {
    r(x, y, w, 1, outline);
    if (y === 0 || y === spans.length - 1) return;
    // Retain the whole stepped boundary, including horizontal corner ledges.
    // Insetting only this row's endpoints leaves gaps where the arc widens.
    const [aboveX, aboveW] = spans[y - 1];
    const [belowX, belowW] = spans[y + 1];
    const left = Math.max(x + 1, aboveX, belowX);
    const right = Math.min(x + w - 1, aboveX + aboveW, belowX + belowW);
    if (right <= left) return;
    r(left, y, right - left, 1, y > 8 ? shadow : fabric);
    if (y < 3) r(left, y, right - left, 1, highlight);
    else if (y < 8) r(left, y, 1, 1, blue ? 0x7895a7 : 0xc58b68);
  });
}
