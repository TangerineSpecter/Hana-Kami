/** 64px-wide head drawing: integer scanlines keep the enlarged art crisp. */
export function paintAnyaHead(ctx: CanvasRenderingContext2D, direction: 'down' | 'up' | 'right', blink: boolean): void {
  const C = {
    outline: '#704253', hair: '#f3a1af', shadow: '#d47b92', deep: '#b85f7a', light: '#ffd0ce',
    skin: '#fff0dd', skinShade: '#edc0ac', blush: '#efb2a7', white: '#fffbed',
    lash: '#4c3540', irisDark: '#354e38', iris: '#608653', green: '#8cb665', lime: '#d0dd91',
    horn: '#403c43', hornLight: '#5e5056', gold: '#e9c686', mouth: '#925962', tongue: '#f1aa99', tongueLight: '#ffc4ac',
  };
  const r = (x: number, y: number, w: number, h: number, c: string) => { ctx.fillStyle=c; ctx.fillRect(x,y,w,h); };
  const p = (v: number[], c: string) => {
    for (let y=0;y<62;y++) {
      const xs: number[]=[];
      for(let i=0;i<v.length;i+=2) {
        const j=(i+2)%v.length;
        if((v[i+1]<=y+.5 && v[j+1]>y+.5)||(v[j+1]<=y+.5 && v[i+1]>y+.5))
          xs.push(v[i]+(y+.5-v[i+1])*(v[j]-v[i])/(v[j+1]-v[i+1]));
      }
      xs.sort((a,b)=>a-b);
      for(let i=0;i+1<xs.length;i+=2) {const x=Math.ceil(xs[i]-.5);r(x,y,Math.ceil(xs[i+1]-.5)-x,1,c);}
    }
  };
  const eye=(x:number,y:number,profile=false,rightEye=false) => {
    // Reduce each eye around its center by two native pixels in each axis.
    // Round both edges on the pixel grid so highlights stay sharp and aligned.
    const ex=(v:number) => x+1+Math.round((v-x)*10/12);
    const ey=(v:number) => y+1+Math.round((v-y)*12/14);
    const ep=(points:number[],color:string) => p(points.map((v,i)=>i%2?ey(v):ex(v)),color);
    const er=(rx:number,ry:number,w:number,h:number,color:string) =>
      r(ex(rx),ey(ry),ex(rx+w)-ex(rx),ey(ry+h)-ey(ry),color);
    if(blink) {
      // Closed lid sits across the eye, not high on the forehead like a brow.
      er(x+1,y+7,2,1,C.lash);er(x+3,y+8,5,1,C.lash);
      er(x+8,y+7,2,1,C.lash);er(x,y+6,1,1,C.lash);
      return;
    }
    // The reference has broad white margins, one clear vertical green oval,
    // an upright pupil and a large top-left reflection. Avoid scattered speckles.
    ep([x+3,y+1,x+8,y+1,x+11,y+4,x+12,y+8,x+10,y+12,x+8,y+14,x+3,y+14,x+1,y+12,x,y+8,x+1,y+4],C.white);
    ep([x,y+7,x,y+4,x+2,y+1,x+4,y,x+8,y,x+11,y+3,x+12,y+6,x+11,y+6,x+9,y+3,x+7,y+2,x+4,y+2,x+2,y+4,x+1,y+7],C.lash);
    const ix=x+(profile?4:3);
    ep([ix+2,y+3,ix+4,y+3,ix+6,y+5,ix+7,y+9,ix+5,y+13,ix+2,y+14,ix,y+12,ix-1,y+8,ix,y+5],C.irisDark);
    ep([ix+2,y+4,ix+4,y+4,ix+5,y+6,ix+6,y+9,ix+4,y+12,ix+2,y+13,ix+1,y+11,ix,y+8,ix+1,y+5],C.iris);
    ep([ix,y+10,ix+2,y+9,ix+5,y+9,ix+5,y+12,ix+4,y+13,ix+2,y+13,ix+1,y+12],C.green);
    ep([ix+2,y+5,ix+3,y+5,ix+4,y+7,ix+4,y+10,ix+3,y+11,ix+2,y+11,ix+1,y+9,ix+1,y+7],C.irisDark);
    ep([ix,y+3,ix+2,y+3,ix+3,y+4,ix+3,y+6,ix+1,y+7,ix-1,y+6,ix-1,y+4],C.white);
    er(ix+3,y+11,2,2,C.lime);
    const outer=x+(rightEye?11:-1);
    er(outer,y+4,2,1,C.lash);er(outer,y+7,2,1,C.lash);
  };
  if(direction==='right') {
    p([28,10,29,5,34,2,40,2,37,5,33,9,42,11,49,15,53,21,55,29,53,39,50,49,45,54,37,57,32,60,23,59,17,57,11,53,8,48,9,39,11,31,11,23,15,17,21,12],C.outline);
    p([30,11,31,6,36,3,37,3,32,8,32,11,42,13,47,16,51,22,53,29,51,39,48,48,43,52,35,55,31,58,23,57,18,55,13,51,11,47,12,39,14,30,14,23,18,17,23,13],C.hair);
    p([16,30,18,29,16,42,17,49,23,55,20,55,15,51,13,45],C.shadow);
    p([24,36,26,32,24,46,27,54,30,56,25,55,21,47],C.shadow);
    // Neck stays in front of the bob; the cheek has no projecting hair tip.
    p([39,49,46,49,45,56,48,58,41,61,37,58],C.skinShade);
    // Like Feilen, the forehead sits behind a rounded forward cheek;
    // the short chin then tucks back in, rather than forming a flat face edge.
    p([37,26,49,26,52,28,52,34,54,37,55,40,55,44,53,48,50,51,45,53,41,53,36,50,33,45,32,35],C.outline);
    p([38,28,48,28,50,30,50,35,52,38,53,40,53,44,51,47,49,49,45,51,41,51,38,48,35,44,34,35],C.skin);
    eye(39,31,true);r(39,46,4,2,C.blush);
    p([33,18,43,20,50,25,51,29,47,31,44,27,41,30,37,32,36,39,35,48,31,56,26,57,29,52,31,43,30,34,29,27],C.hair);
    p([35,24,36,25,34,34,34,45,31,52,30,53,32,44,32,34],C.shadow);
    p([30,23,27,21,23,21,20,23,18,27,18,31,21,35,25,37,29,35,32,31,32,27],C.outline);
    p([24,23,28,24,30,27,30,31,27,34,24,35,21,32,20,28,22,25],C.gold);
    p([24,25,28,26,29,29,27,32,23,32,22,29],C.horn);
    r(20,17,6,2,C.light);r(15,23,2,4,C.light);
    return;
  }
  // Rear mass has a center cutout below the jaw in the front view.
  ctx.save();
  if(direction==='down') {ctx.beginPath();ctx.rect(0,0,64,64);ctx.rect(22,51,20,13);ctx.clip('evenodd');}
  p([27,10,27,7,30,3,37,1,42,1,40,4,34,7,32,10,42,10,49,13,54,18,57,25,58,36,59,43,62,49,60,53,56,53,55,57,50,59,44,58,40,60,25,59,21,60,17,58,11,59,6,56,3,52,3,47,5,39,6,30,7,24,10,19,15,14,21,11],C.outline);
  p([29,11,29,7,32,4,38,3,33,6,30,10,32,12,42,12,48,15,52,19,55,25,56,36,57,44,60,49,58,51,54,51,53,55,49,57,44,55,40,58,25,57,22,58,18,55,12,57,8,54,5,51,5,47,7,39,8,30,9,25,12,20,17,15,22,13],C.hair);
  p([11,31,13,28,11,40,10,47,12,53,16,56,13,55,9,52,8,47],C.shadow);
  p([51,30,53,33,54,43,56,48,53,53,51,55,52,49,51,44],C.shadow);
  ctx.restore();
  const horn=(flip:boolean) => {
    ctx.save();if(flip){ctx.translate(64,0);ctx.scale(-1,1);}
    p([5,20,16,16,18,18,16,29,12,34,8,29,4,23],C.outline);
    p([6,21,15,18,16,20,15,24,14,27,12,31,10,29,7,26],C.gold);
    p([6,22,13,20,14,22,12,24,13,26,11,29,8,26],C.horn);
    r(7,22,3,1,C.hornLight);ctx.restore();
  };
  if(direction==='up') {
    p([19,28,21,25,19,40,19,49,23,56,20,55,16,49,17,37],C.shadow);
    p([39,25,41,28,42,42,46,52,48,54,43,52,39,44],C.shadow);
    p([29,39,31,34,29,45,32,54,30,55,27,47],C.light);
    r(18,17,9,2,C.light);r(41,18,6,2,C.light);horn(false);horn(true);return;
  }
  r(25,53,14,7,C.white);r(29,51,7,7,C.skinShade);r(30,52,5,5,C.skin);
  // Broad cheeks taper to a short rounded chin, with space below the eyes.
  p([18,26,43,25,49,30,51,38,50,45,47,50,42,54,36,56,28,56,22,54,17,50,14,44,13,36,15,30],C.outline);
  p([19,27,42,27,47,31,49,38,48,45,45,49,41,52,35,54,29,54,23,52,19,49,16,43,15,36,17,31],C.skin);
  // Multiple wide, curved fringe locks share a crown instead of a side-swept slab.
  p([14,23,20,17,29,14,37,15,43,18,48,23,51,30,49,35,47,34,43,28,44,33,42,34,38,33,34,29,37,33,34,34,29,33,25,29,27,33,24,34,21,32,20,29,18,34,15,37,13,36],C.hair);
  p([26,19,27,19,25,25,25,28,29,32,27,32,23,28,24,23],C.shadow);
  p([35,19,36,20,36,26,40,32,38,31,34,26],C.shadow);
  p([44,23,46,26,48,32,46,30],C.shadow);
  // Face-framing locks end below the cheeks, with a visible gap under the chin.
  p([13,30,16,29,16,39,18,46,23,52,24,57,20,59,17,56,13,53,10,48,10,42],C.shadow);
  p([13,32,15,32,14,40,16,47,20,52,22,56,20,57,17,54,13,50,12,45],C.hair);
  p([49,30,52,33,52,43,51,50,47,56,43,59,42,55,44,50,46,45,47,37],C.shadow);
  p([49,33,50,36,50,44,48,51,44,56,45,52,47,46,48,38],C.hair);
  // Front expression follows the portrait's simple broad color blocks.
  // Keep the existing profile eye recipe separate from this frontal redraw.
  const portraitEye=(x:number,y:number,rightEye=false) => {
    if(blink) {
      // A shallow downward lid at mid-eye height, with an outer lash.
      r(x,y+6,2,1,C.lash);r(x+1,y+7,2,1,C.lash);
      r(x+3,y+8,4,1,C.lash);r(x+7,y+7,2,1,C.lash);
      r(x+9,y+6,1,1,C.lash);
      r(rightEye?x+10:x-1,y+5,1,1,C.lash);
      return;
    }
    p([x+3,y+1,x+7,y+1,x+9,y+3,x+10,y+6,x+9,y+10,x+7,y+12,x+3,y+12,x+1,y+10,x,y+6,x+1,y+3],C.white);
    // Warm upper lash only; avoid dark outlines under the white of the eye.
    p([x,y+6,x,y+3,x+2,y+1,x+4,y,x+7,y,x+9,y+2,x+10,y+4,x+9,y+4,x+7,y+2,x+4,y+2,x+2,y+4,x+1,y+6],C.lash);
    const ix=x+(rightEye?2:3);
    p([ix+1,y+3,ix+4,y+3,ix+5,y+5,ix+5,y+9,ix+4,y+11,ix+1,y+12,ix-1,y+10,ix-1,y+6], '#405b39');
    r(ix,y+5,5,3,'#68994f');
    r(ix,y+8,5,2,'#b6d879');
    r(ix+1,y+10,3,1,'#b6d879');
    r(ix,y+3,2,2,C.white);
    r(rightEye?x+9:x-1,y+4,2,1,C.lash);
  };
  portraitEye(18,32);portraitEye(37,32,true);
  r(19,45,5,2,'#f4b6a6');r(42,45,5,2,'#f4b6a6');
  // Portrait-style peach smile: upper-wide, rounded lower lip, no teeth,
  // dark cavity, or horizontal bands. Leave skin between mouth and jaw.
  p([28,45,31,44,35,44,38,45,38,47,36,50,33,51,30,50,28,47], '#c87983');
  p([29,45,32,45,35,45,37,46,36,48,34,50,32,50,30,48], '#f5ac9c');
  p([16,23,19,21,24,21,24,23,20,23,18,25,16,25],C.light);
  p([40,20,44,22,45,25,42,24,40,23],C.light);
  horn(false);horn(true);
}
