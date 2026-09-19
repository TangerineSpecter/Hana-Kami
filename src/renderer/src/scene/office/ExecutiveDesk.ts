import { Container, Graphics } from 'pixi.js';
import type { TiledMapRenderer } from './TiledMapRenderer';

/** A dedicated pixel-art desk for the office's south-facing CEO seat.
 * Keep the desk's collision footprint and the CEO seat. Remove the decorative
 * visitor stool, which is not registered with the work or break seat pools.
 * Owned by the map container, so scene rebuilds also dispose of this graphic. */
export function installExecutiveDesk(map: TiledMapRenderer): void {
  const seat = map.getSpawnPoint('desk-ceo');
  if (!seat || map.tileSize !== 16) return;
  const x = (seat.x - 1) * map.tileSize;
  const y = (seat.y + 1) * map.tileSize;
  const root = map.getContainer();

  for (const layer of root.children) {
    if (!(layer instanceof Container)
      || !['furniture-below', 'furniture-above'].includes(layer.label)) continue;
    for (const tile of layer.children) {
      const isDesk = tile.x >= x && tile.x < x + 48 && tile.y >= y && tile.y < y + 32;
      // The stool's upper tile lies inside the desk rectangle; its lower tile
      // extends into the already-walkable floor immediately in front of it.
      const isStoolFoot = layer.label === 'furniture-below'
        && tile.x === x + 16 && tile.y === y + 32;
      const isBossStool = layer.label === 'furniture-below'
        && tile.x === seat.x * 16 && tile.y === seat.y * 16;
      if (isDesk || isStoolFoot || isBossStool) tile.visible = false;
    }
  }

  const desk = new Graphics();
  desk.label = 'executive-desk';
  desk.eventMode = 'none';
  desk.position.set(x, y);
  const rect = (dx: number, dy: number, w: number, h: number, color: number): void => {
    desk.rect(dx, dy, w, h).fill(color);
  };
  const ink = 0x45373d;
  const walnut = 0x765044;
  const lightWood = 0x9a6c50;
  const gold = 0xc9a665;

  // Keep the original compact oval chair footprint at the CEO's seat.
  // Upholstery and a slim brass rim replace the wooden slats, without a back.
  rect(19, -4, 3, 4, ink); rect(27, -4, 3, 4, ink);
  rect(20, -2, 1, 1, gold); rect(28, -2, 1, 1, gold);
  const cushion = [[21,6],[19,10],[18,12],[18,12],[17,14],[17,14],
    [17,14],[17,14],[18,12],[18,12],[19,10],[21,6]];
  cushion.forEach(([left,width],row) => {
    const y = -15 + row;
    rect(left,y,width,1,ink);
    if(row===0 || row===cushion.length-1)return;
    const [ax,aw]=cushion[row-1], [bx,bw]=cushion[row+1];
    const l=Math.max(left+1,ax,bx), end=Math.min(left+width-1,ax+aw,bx+bw);
    if(end>l)rect(l,y,end-l,1,row<3?0xae8670:row>8?0x654149:0x885760);
    if(row>=3 && row<8 && end>l)rect(l,y,1,1,0xad7780);
  });
  rect(20,-5,8,1,gold);
  rect(23,-11,1,1,0x704650);rect(26,-9,1,1,0x704650);

  // Substantial drawer pedestals, with brass feet and handles.
  rect(1, 17, 12, 9, ink);
  rect(35, 17, 12, 9, ink);
  for (const dx of [3, 37]) {
    rect(dx, 19, 8, 5, walnut);
    rect(dx + 2, 20, 4, 1, gold);
    rect(dx, 24, 8, 1, gold);
  }
  // Stepped corners, a thick walnut top and a slim brass inlay.
  rect(1, 0, 46, 21, ink);
  rect(0, 2, 48, 17, ink);
  rect(2, 1, 44, 17, lightWood);
  rect(1, 3, 46, 13, walnut);
  rect(3, 2, 42, 1, gold);
  rect(2, 17, 44, 2, gold);
  rect(2, 19, 44, 1, walnut);
  // Restrained wood grain at the exposed ends.
  rect(3, 5, 6, 1, lightWood);
  rect(4, 13, 5, 1, lightWood);
  rect(39, 14, 5, 1, lightWood);
  // Green leather writing pad with a stitched edge.
  rect(11, 4, 25, 12, ink);
  rect(12, 4, 23, 11, gold);
  rect(13, 5, 21, 9, 0x3e6255);
  rect(14, 6, 19, 1, 0x6e8870);
  // A document and fountain pen, readable at the native 16 px tile scale.
  rect(18, 6, 10, 7, 0xb9b2a0);
  rect(18, 5, 9, 7, 0xeee7d5);
  rect(20, 7, 5, 1, 0x9d9d91);
  rect(20, 9, 4, 1, 0x9d9d91);
  rect(30, 7, 1, 5, ink);
  rect(30, 6, 1, 2, gold);
  // A tiny lucky cat for the magical-girl boss: pointed ears, raised paw,
  // pink ribbon and a gold bell. Keep its silhouette clear at native scale.
  const ivory = 0xfff0d6;
  const pink = 0xd9829c;
  rect(2, 14, 9, 2, ink);
  rect(3, 14, 7, 1, pink); // cushion
  rect(3, 8, 7, 6, ink);
  rect(4, 9, 5, 5, ivory);
  rect(3, 1, 2, 4, ink); // pointed ears
  rect(8, 1, 2, 4, ink);
  rect(2, 3, 9, 5, ink);
  rect(3, 4, 7, 4, ivory);
  rect(4, 3, 5, 1, ivory);
  rect(4, 2, 1, 2, pink);
  rect(8, 2, 1, 2, pink);
  rect(4, 5, 1, 1, ink); // eyes and nose
  rect(8, 5, 1, 1, ink);
  rect(6, 6, 1, 1, pink);
  rect(1, 6, 3, 6, ink); // raised beckoning paw
  rect(1, 5, 3, 3, ink);
  rect(2, 6, 1, 5, ivory);
  rect(2, 7, 1, 1, pink);
  rect(4, 8, 2, 2, pink); // ribbon
  rect(7, 8, 2, 2, pink);
  rect(6, 9, 1, 2, gold); // bell
  rect(6, 12, 2, 2, gold); // lucky coin
  rect(4, 13, 1, 1, 0xdac7b2);
  rect(9, 11, 1, 3, ivory); // curled tail
  // Burgundy notebook on the right.
  rect(38, 5, 7, 8, ink);
  rect(39, 6, 5, 6, 0x854c50);
  rect(39, 11, 5, 1, 0xe0d2af);
  rect(40, 6, 1, 4, gold);
  // Centered brass nameplate on the front apron.
  rect(19, 17, 10, 3, ink);
  rect(20, 17, 8, 2, gold);

  // Same layering as the original furniture: seated avatars remain above it.
  root.addChildAt(desk, root.getChildIndex(map.getCharacterContainer()));
}
