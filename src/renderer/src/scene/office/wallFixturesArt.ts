import { Graphics } from 'pixi.js';

/** Native-pixel fixtures, sized to fit the existing wall and interaction anchors. */
export function paintOfficeWindow(g: Graphics, x: number, y: number): void {
  const r = (dx: number, dy: number, w: number, h: number, c: number) =>
    g.rect(x + dx, y + dy, w, h).fill(c);
  // 26x18 frame, centred in the 32px map block with its base unchanged.
  r(5, 12, 24, 18, 0xb9ab94);
  r(3, 10, 26, 18, 0x4b4943);
  r(4, 11, 24, 16, 0xc5baa3);
  r(5, 12, 22, 14, 0x7699ac);
  r(6, 13, 20, 6, 0xb5d1db);
  r(6, 19, 20, 6, 0x9cbdca);
  // Slim off-centre sash keeps the glass predominantly horizontal.
  r(7, 15, 5, 1, 0xe8efdf);
  r(9, 14, 3, 1, 0xe8efdf);
  r(21, 17, 4, 1, 0xdbe8dd);
  r(7, 24, 4, 1, 0x819eac);
  r(22, 23, 4, 2, 0x839fac);
  r(18, 12, 2, 14, 0x666e6c);
  r(18, 12, 1, 14, 0xe2d9c4);
  r(6, 12, 11, 1, 0xd6e5e4);
  r(4, 27, 24, 1, 0x79644c);
  r(3, 28, 26, 1, 0xe0c9a3);
  r(4, 29, 24, 1, 0x8e7758);
}

export function paintOfficeClock(g: Graphics, x: number, y: number): void {
  const r = (dx: number, dy: number, w: number, h: number, c: number) =>
    g.rect(x + dx, y + dy, w, h).fill(c);
  // Closed stepped round contour; no fractional strokes at pixel zoom.
  const spans = [[5,6],[3,10],[2,12],[1,14],[1,14],[0,16],[0,16],[0,16],
    [0,16],[0,16],[0,16],[1,14],[1,14],[2,12],[3,10],[5,6]];
  spans.forEach(([left,width],row)=>r(left,row+10,width,1,0x584536));
  spans.slice(1,-1).forEach(([left,width],row)=>r(left+1,row+11,width-2,1,0xbb9465));
  for(let dy=-5;dy<=5;dy++) for(let dx=-5;dx<=5;dx++)
    if(dx*dx+dy*dy<=30)r(8+dx,18+dy,1,1,0xf5edda);
  r(8,12,1,2,0x685c4e);r(8,23,1,2,0x685c4e);
  r(2,18,2,1,0x685c4e);r(13,18,2,1,0x685c4e);
  r(5,15,2,1,0x45545b);r(6,16,2,1,0x45545b);r(7,17,2,2,0x45545b);
  r(9,16,1,2,0x45545b);r(10,14,1,3,0x45545b);r(11,13,1,2,0x45545b);
  r(8,18,1,1,0xb66550);
}

export function paintOfficeCalendar(g: Graphics): void {
  const r=(x:number,y:number,w:number,h:number,c:number)=>g.rect(x,y,w,h).fill(c);
  r(1,1,18,22,0xbaa88a); r(0,0,18,22,0x574637);
  r(1,1,16,19,0xf4ecd7);r(1,20,16,1,0xcfbea1);
  r(1,1,16,5,0xa96052);r(2,1,14,1,0xd89a7d);
  for(const x of [4,12]){r(x,-1,2,4,0x505455);r(x,-1,1,3,0xd6d9c9);}
  r(3,7,12,1,0xc2ac89);
  for(let row=0;row<4;row++)for(let col=0;col<7;col++){
    r(2+col*2,10+row*2,1,1,col===6?0xb37463:0x9d9985);
  }
  r(7,13,3,3,0xb36b56);r(8,14,1,1,0xfff4dc);
  r(13,18,4,2,0xe0d1b6);r(16,18,1,2,0xbaaa8c);
}
