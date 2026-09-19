import { Graphics } from 'pixi.js';

type BoardKind = 'blocked' | 'todo' | 'ask';
const digits = ['111101101101111', '010110010010111', '111001111100111', '111001111001111', '101101111001001', '111100111001111', '111100111101111', '111001010010010', '111101111101111', '111101111001111'];
const symbols: Record<BoardKind, string[]> = {
  blocked: ['00100','01110','01110','00100','00000','00100','00000'],
  todo: ['11011','00000','11011','00000','11011','00000','00000'],
  ask: ['01110','10001','00010','00100','00100','00000','00100'],
};

/** Shared native-pixel art; note count and colors always come from live state. */
export function paintTaskBoard(g: Graphics, ox: number, kind: BoardKind, notes: number[], pulse = 0): void {
  const r = (x: number, y: number, w: number, h: number, c: number, alpha = 1) =>
    g.rect(ox + x, y, w, h).fill({color:c,alpha});
  const accent = {blocked:0xb86759,todo:0xb89a49,ask:0x8e729f}[kind];
  const bright = {blocked:0xf2b09a,todo:0xf0d583,ask:0xd6bfe4}[kind];
  const stamp = (x: number, y: number, color: number) => symbols[kind].forEach((row,dy)=>
    [...row].forEach((bit,dx)=>{if(bit==='1')r(x+dx,y+dy,1,1,color);}));
  r(1,-7,30,22,0x786249,0.35);
  r(0,-9,30,23,0x4f4035); r(1,-8,28,21,0x9a7955);
  r(1,-8,28,1,0xd7bb8c); r(1,12,28,1,0x715239);
  r(2,-7,26,18,0xe4d6b5);
  r(2,-7,26,7,accent); r(3,-7,24,1,bright);
  stamp(4,-6,0xfff0d6);
  // Header tally remains readable at the scene's integer pixel zoom.
  const count = String(Math.min(notes.length,99));
  [...count].forEach((digit,index)=>{
    const x = 26-count.length*4+index*4;
    [...digits[Number(digit)]].forEach((bit,i)=>{if(bit==='1')r(x+i%3,-6+Math.floor(i/3),1,1,0xfff3dc);});
  });
  if(notes.length>99){r(26,-3,1,3,0xfff3dc);r(25,-2,3,1,0xfff3dc);}
  if(notes.length===0) {
    // Quiet watermark: never draw pretend task cards when the board is empty.
    stamp(12,2,0xb7aa8b);
  } else {
    notes.slice(0,8).forEach((color,i)=>{
      const x=3+(i%4)*6, y=2+Math.floor(i/4)*5;
      r(x+1,y+1,5,4,0xb7a180);r(x,y,5,4,color);
      r(x+2,y,1,1,0x64534b);r(x+1,y+2,3,1,0x786e60,0.5);
    });
    if(notes.length>8){r(25,9,3,2,bright);r(26,8,2,1,accent);}
  }
  if(kind==='ask' && notes.length>0){
    g.rect(ox-1,-10,32,25).stroke({color:bright,width:1,alpha:0.35+0.25*Math.sin(pulse*4)});
  }
}
