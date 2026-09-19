import { Graphics } from 'pixi.js';

// Authored at the map's native pixel resolution. These graphics replace only
// surface/furniture art; the Tiled map remains the source of interaction data.
export const OAK_FLOOR_GIDS = new Set([783, 784, 799, 800]);
const ink = 0x40332a;

/** Front-facing drinks machine: display, controls, and an accessible pickup bay. */
export function paintVendingMachine(g: Graphics, active = false): void {
  const r = (x: number, y: number, w: number, h: number, c: number) => g.rect(x, y, w, h).fill(c);
  r(3, 61, 42, 3, 0xb09371);
  r(2, 1, 44, 61, 0x374448); r(4, 0, 40, 63, 0x374448);
  r(3, 3, 41, 55, 0x78968d); r(4, 3, 2, 53, 0xb3c6ac);
  r(43, 4, 2, 53, 0x536e69);
  r(6, 4, 35, 8, 0x33494b); r(7, 5, 33, 6, 0xe2dfc3);
  // Drink pictograms on the illuminated sign.
  for (const x of [12, 22, 32]) {
    r(x, 6, 4, 4, 0x688f91); r(x, 6, 4, 1, 0xffffff);
  }
  r(7, 14, 26, 30, 0x344449); r(8, 15, 24, 28, 0x45616a);
  r(9, 16, 2, 25, 0x607f85);
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const x = 12 + col * 7, y = 18 + row * 8;
      r(x, y, 4, 6, [0xb86e59, 0xd3b566, 0x88b3a8][col]);
      r(x, y, 4, 1, 0xe6ecdf); r(x + 1, y + 2, 2, 2, 0xf1e9d3);
    }
    r(9, 24 + row * 8, 22, 1, 0x91a7a0);
  }
  r(35, 15, 6, 27, 0x465557);
  r(36, 17, 4, 4, active ? 0xc3edac : 0x85b6a5);
  for (const y of [25, 29, 33]) {
    r(36, y, 2, 2, active && y === 25 ? 0xf6d287 : 0xb8c2b7);
    r(39, y, 1, 2, 0x91aaa1);
  }
  r(36, 38, 4, 1, 0x202e32);
  r(8, 47, 32, 11, 0x354448); r(10, 49, 28, 7, 0x26383e);
  r(10, 48, 28, 2, 0x536d70); r(10, 56, 28, 1, 0xb8c6b6);
  r(8, 45, 32, 1, active ? 0xc4e8a0 : 0x93b2a2);
  r(5, 59, 38, 2, 0x52625f);
}

/** Raised two-tier mug rack; empty slots remain empty as clean cups are taken. */
export function paintMugRack(g: Graphics, cleanCups: number): void {
  const r = (x: number, y: number, w: number, h: number, c: number) =>
    g.rect(x, y, w, h).fill(c);
  r(1, -10, 14, 26, ink);
  r(2, -9, 12, 21, 0x78563e);
  r(3, -8, 10, 20, 0x98734f);
  r(1, -10, 14, 2, 0xc39b69);
  r(1, 1, 14, 2, 0xd2ac77);
  r(1, 11, 14, 2, 0xd2ac77);
  r(2, 13, 12, 1, 0x674b37);
  r(2, 14, 2, 2, ink); r(12, 14, 2, 2, ink);
  const slots = [[3, -6], [9, -6], [3, 4], [9, 4]];
  for (let i = 0; i < Math.min(4, Math.max(0, cleanCups)); i++) {
    const [x, y] = slots[i];
    r(x, y, 4, 7, 0x4f5557);
    r(x, y + 1, 4, 5, 0xe7e9df);
    r(x, y + 1, 1, 4, 0xffffff);
    r(x + 3, y + 2, 3, 3, 0xf4f0de);
    r(x + 4, y + 3, 1, 1, 0x78563e); // open handle
    r(x, y, 4, 1, 0xf9f5e8);
    r(x + 1, y, 2, 1, 0x525e65); // dark, visibly open cup rim
    r(x + 1, y + 5, 3, 1, 0x99b5b4);
  }
}

/** Four cafe seats: two north and two south of the blocked table row. */
export function paintCafeSet(g: Graphics, tx: number, tableRow: number): void {
  const r = (x: number, y: number, w: number, h: number, c: number) =>
    g.rect(tx * 16 + x, tableRow * 16 + y, w, h).fill(c);
  for (const x of [0, 16]) {
    for (const y of [-16, 16]) {
      // Seats fit their walkable tile; the aisle and cup rack stay clear.
      r(x + 3, y + 12, 10, 2, 0xbea078);
      r(x + 3, y + 10, 2, 3, ink); r(x + 11, y + 10, 2, 3, ink);
      r(x + 2, y + 2, 12, 9, 0x39444b);
      r(x + 3, y + 3, 10, 7, 0x6f8c91);
      r(x + 4, y + 3, 8, 1, 0xa4b9b5);
      r(x + 3, y + 9, 10, 1, 0x526c76);
      const back = y < 0 ? y : y + 8;
      r(x + 2, back, 12, 4, 0x39444b);
      r(x + 3, back + 1, 10, 2, 0x809d9f);
      r(x + 4, back + 1, 8, 1, 0xb2c6bd);
    }
  }
  // Real tabletop, rather than the old patterned floor tile under the chairs.
  r(2, 14, 28, 2, 0xb59770);
  r(3, 11, 3, 4, ink); r(26, 11, 3, 4, ink);
  r(1, 0, 30, 13, ink); r(0, 2, 32, 9, ink);
  r(2, 1, 28, 9, 0xb18a59); r(1, 3, 30, 6, 0xb18a59);
  r(3, 1, 26, 1, 0xe0bf88);
  r(2, 10, 28, 2, 0x795638);
  r(4, 5, 24, 1, 0xa27a4e);
  // Shared tissue box leaves room for the characters' carried coffee cups.
  r(13, 4, 6, 4, 0x607e78); r(14, 4, 4, 2, 0xa9bdb0);
  r(15, 2, 3, 3, 0xf4edda);
}

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
  // Thin chamfered top, a recessed apron, and metal legs.
  r(6, 20, 36, 2, 0xb19572);
  for (const x of [6, 39]) {
    r(x, 15, 3, 7, 0x394249); r(x + 1, 16, 1, 5, 0x89928c);
  }
  r(5, 0, 38, 19, ink); r(4, 2, 40, 15, ink);
  r(6, 1, 36, 14, 0xa78059); r(5, 3, 38, 11, 0xa78059);
  r(6, 1, 36, 1, 0xd8b98b);
  r(7, 5, 32, 1, 0x9b7350); r(9, 12, 30, 1, 0x9b7350);
  r(7, 3, 11, 1, 0xb58d63); r(34, 9, 7, 1, 0xb58d63);
  r(5, 15, 38, 2, 0x775239); r(6, 17, 36, 1, 0x543e30);
}

export function paintDeskAccessories(g: Graphics, tx: number, ty: number): void {
  const r = (x: number, y: number, w: number, h: number, c: number) =>
    g.rect(tx * 16 + x, ty * 16 + y, w, h).fill(c);
  // A desaturated desk mat gives the separate keyboard and mouse clear edges.
  r(14, 7, 26, 7, 0x687775); r(15, 8, 24, 5, 0x7d8c83);
  r(16, 8, 15, 5, 0x41494e); r(17, 8, 13, 4, 0xd4d6c9);
  for (let y = 9; y <= 10; y++) for (let x = 18; x <= 28; x += 2)
    r(x, y, 1, 1, 0x79868b);
  r(21, 11, 6, 1, 0x899493);
  r(34, 8, 4, 5, 0x465257); r(35, 7, 2, 6, 0x465257);
  r(35, 8, 2, 4, 0xe8e5d6); r(35, 8, 1, 1, 0x7c8b8b);
}

/** Same pixel geometry for the static off monitor and live on-screen overlay. */
export const WORK_MONITOR_SCREEN = { x: -2, y: 4, w: 20, h: 11 };

/** A tiny word processor and spreadsheet, authored on the native pixel grid. */
export function paintWorkScreen(g: Graphics, px = 0, py = 0, time = 0): void {
  const r = (x: number, y: number, w: number, h: number, c: number) =>
    g.rect(px + WORK_MONITOR_SCREEN.x + x, py + WORK_MONITOR_SCREEN.y + y, w, h).fill(c);
  r(0, 0, 20, 11, 0xf5f3e8);
  r(0, 0, 20, 2, 0xa8c5d8);
  for (const x of [1, 3, 5]) r(x, 0, 1, 1, 0x6c8d9f);
  r(0, 2, 3, 9, 0xd3dfe0);
  for (const y of [3, 6, 9]) r(1, y, 1, 1, 0x8ea7b0);
  // Keep completed paragraphs visible while the next line is typed; pause
  // on the finished page before beginning the next one (a ten-second loop).
  const step = Math.min(15, Math.floor((time % 10) / 0.4));
  const line = Math.min(2, Math.floor(step / 5));
  for (let row = 0; row <= line; row++) {
    const width = row < line ? 5 : Math.min(5, step - row * 5 + 1);
    r(4, 3 + row * 3, width, 1, 0x839ba9);
    if (row === line && Math.floor(time / 0.6) % 2 === 0)
      r(4 + width, 3 + row * 3, 1, 1, 0x476879);
  }
  r(11, 3, 8, 7, 0xadc3a2);
  r(12, 3, 2, 1, 0x7f9f76); r(15, 3, 3, 1, 0x7f9f76);
  // Alternating cell highlight is deliberately slow and never flashes.
  const selected = Math.floor(time / 2.4) % 4;
  for (let row = 0; row < 2; row++) for (let col = 0; col < 2; col++)
    r(12 + col * 3, 5 + row * 3, col === 0 ? 2 : 3, 2,
      selected === row * 2 + col ? 0xc9dcb9 : 0xf5f3e8);
}

export function paintWorkMonitor(g: Graphics, px: number, py: number, on: boolean): void {
  const r = (x: number, y: number, w: number, h: number, c: number) =>
    g.rect(px + x, py + y, w, h).fill(c);
  r(6, 16, 4, 5, 0x424d53); r(7, 17, 2, 3, 0xa3afab);
  r(2, 21, 12, 2, 0x4a5559); r(3, 21, 10, 1, 0xb4bbb2);
  r(-4, 2, 24, 15, 0x303c43); r(-3, 1, 22, 17, 0x303c43);
  r(-3, 2, 22, 1, 0x9aa9ab); r(-3, 3, 22, 13, 0x52626a);
  r(-2, 4, 20, 11, on ? 0x254858 : 0x25353f);
  if (on) {
    paintWorkScreen(g, px, py);
  } else {
    r(-1, 5, 8, 1, 0x465c67); r(-1, 6, 3, 2, 0x384c58);
  }
  r(16, 16, 1, 1, on ? 0xc4e9aa : 0x7b918c);
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

/**
 * Walnut conference table with ten upholstered chairs, drawn at native pixels.
 * Furniture stays within the original boardroom footprint.
 */
export function paintConferenceTable(g: Graphics, tx: number, ty: number): void {
  const r = (x: number, y: number, w: number, h: number, c: number) =>
    g.rect(tx * 16 + x, ty * 16 + y, w, h).fill(c);
  const edge = 0x423331;
  const fabric = 0x795267;
  const light = 0xa4798b;
  const shade = 0x563e52;
  const steel = 0x55525a;

  const chair = (x: number, y: number, front: boolean) => {
    // One continuous silhouette connects the back, cushion, arms and feet.
    r(x + 2, y + 14, 10, 2, 0xb39773);
    r(x + 2, y + 11, 2, 4, edge);
    r(x + 10, y + 11, 2, 4, edge);
    r(x + 3, y + 13, 1, 1, steel);
    r(x + 10, y + 13, 1, 1, steel);
    r(x + 1, y + 2, 12, 11, edge);
    r(x + 2, y, 10, 13, edge);
    r(x + 2, y + 2, 10, 9, fabric);
    r(x + 3, y + 1, 8, 1, light);
    r(x + 3, y + 3, 8, 4, front ? 0x91667d : 0x80596f);
    r(x + 2, y + 7, 10, 1, shade);
    r(x + 3, y + 8, 8, 3, front ? 0xa07589 : 0x68495e);
    r(x + 3, y + 11, 8, 1, shade);
    r(x, y + 7, 2, 4, edge);
    r(x + 12, y + 7, 2, 4, edge);
    r(x, y + 7, 2, 1, steel);
    r(x + 12, y + 7, 2, 1, steel);
  };
  const sideChair = (x: number, y: number, left: boolean) => {
    const s = (u: number, v: number, w: number, h: number, c: number) =>
      r(x + (left ? u : 14 - u - w), y + v, w, h, c);
    s(2, 16, 10, 1, 0xb39773);
    s(3, 13, 2, 3, edge); s(10, 13, 2, 3, edge);
    s(1, 1, 4, 13, edge); s(2, 0, 2, 15, edge);
    s(2, 2, 2, 10, fabric); s(2, 1, 1, 10, light);
    s(5, 5, 8, 9, edge);
    s(5, 6, 7, 6, fabric); s(5, 6, 6, 1, light);
    s(5, 12, 7, 1, shade);
    s(4, 4, 9, 2, edge); s(5, 4, 7, 1, steel);
    s(4, 13, 9, 1, edge);
  };

  for (const x of [17, 33, 49, 65]) chair(x, -16, true);
  sideChair(-15, 9, true);
  sideChair(98, 9, false);

  // Subtle ground shadow and recessed legs make this read as a raised table.
  r(4, 32, 89, 4, 0xb3956c);
  for (const x of [8, 83]) {
    r(x, 29, 5, 8, edge);
    r(x + 1, 30, 2, 6, 0x72513c);
  }
  // Chamfered corners with a one-pixel contour, never a nested frame.
  r(3, 0, 90, 34, edge);
  r(1, 2, 94, 30, edge);
  r(0, 4, 96, 26, edge);
  r(3, 2, 90, 28, 0x956d4c);
  r(2, 4, 92, 24, 0x956d4c);
  r(4, 1, 88, 1, 0xcfaa76);
  r(2, 3, 92, 1, 0xb48b5d);
  r(2, 5, 1, 22, 0xb48b5d);
  // Quiet horizontal wood grain with staggered, low-contrast streaks.
  for (const y of [9, 18, 27]) r(4, y, 88, 1, 0x876144);
  r(9, 6, 22, 1, 0xa47a53); r(58, 14, 29, 1, 0xa47a53);
  r(13, 23, 19, 1, 0xa47a53); r(48, 25, 24, 1, 0x8c6546);
  r(3, 30, 90, 2, 0x684936);
  r(5, 32, 86, 1, 0x503a2e);
  // Central cable hatch and a slim closed laptop; papers sit near attendees.
  r(43, 13, 10, 4, 0x684f3d);
  r(44, 14, 8, 1, 0xb59066);
  r(71, 10, 13, 9, 0x604936);
  r(71, 9, 12, 8, 0x454750);
  r(72, 10, 10, 5, 0x78818a);
  r(72, 10, 10, 1, 0xa8afb0);
  r(76, 12, 2, 1, 0xbec4be);
  r(70, 17, 14, 1, 0xb6b9b5);
  for (const [x, y] of [[18, 8], [53, 22]]) {
    r(x + 1, y + 1, 9, 6, 0x75573e);
    r(x, y, 8, 6, 0xe8dfc9);
    r(x + 1, y + 1, 6, 1, 0xf9f1dd);
    r(x + 2, y + 3, 4, 1, 0xb6b2a4);
    r(x + 10, y + 1, 1, 5, 0x42535a);
  }
  for (const x of [17, 33, 49, 65]) chair(x, 34, false);
}
