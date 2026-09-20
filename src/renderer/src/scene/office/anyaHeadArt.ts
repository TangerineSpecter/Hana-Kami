/** Short pink bob on Feilen's 32px grid, with compact cheeks and a smiling face. */
export function paintAnyaHead(ctx: CanvasRenderingContext2D, direction: 'down' | 'up' | 'right', blink: boolean): void {
  const C={outline:'#624052',hair:'#f5a7b8',shadow:'#d87894',light:'#ffccd3',skin:'#fff0d9',shade:'#efc4ad',blush:'#f4b6ac',white:'#fff9eb',eye:'#3e5539',green:'#77a657',lime:'#bad783',horn:'#403c43',gold:'#e9c783',mouth:'#b8767f',tongue:'#f5ac9c'};
  const r=(x:number,y:number,w:number,h:number,c:string)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h);};
  const p=(v:number[],c:string)=>{
    for(let y=0;y<48;y++){
      const xs:number[]=[];
      for(let i=0;i<v.length;i+=2){const j=(i+2)%v.length;
        if((v[i+1]<=y+.5&&v[j+1]>y+.5)||(v[j+1]<=y+.5&&v[i+1]>y+.5))xs.push(v[i]+(y+.5-v[i+1])*(v[j]-v[i])/(v[j+1]-v[i+1]));
      }
      xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2){const x=Math.ceil(xs[i]-.5);r(x,y,Math.ceil(xs[i+1]-.5)-x,1,c);}
    }
  };
  const eye=(x:number,y:number,side=false)=>{
    if(blink){r(x,y+2,1,1,C.eye);r(x+1,y+3,2,1,C.eye);r(x+3,y+2,1,1,C.eye);return;}
    r(x,y,4,1,C.eye);r(x,y+1,4,4,C.white);
    r(x+1,y+1,side?2:3,2,C.eye);r(x+1,y+3,side?2:3,1,C.green);
    r(x+1,y+4,2,1,C.lime);r(x+1,y+1,1,1,C.white);
  };
  const ornament=(x:number,y:number,flip=false)=>{
    ctx.save();ctx.translate(x,y);if(flip){ctx.translate(6,0);ctx.scale(-1,1);}
    p([0,1,5,0,6,2,5,5,3,7,1,5],C.horn);
    p([1,2,4,1,5,2,4,5,3,6,2,4],C.gold);
    p([1,2,3,2,4,3,3,5,2,4],C.horn);ctx.restore();
  };
  if(direction==='right'){
    p([10,2,20,2,24,4,27,7,28,12,26,19,25,23,22,26,18,28,11,27,6,25,4,22,5,16,5,8,7,5],C.outline);
    p([11,4,20,4,23,6,25,8,26,12,24,19,23,23,20,25,17,26,11,25,8,23,6,21,7,16,7,9,9,6],C.hair);
    p([8,16,10,16,9,21,12,24,11,25,7,22],C.shadow);
    // Dedicated Feilen profile, rather than the front face turned sideways.
    p([19,11,26,11,26,15,27,16,27,19,26,21,24,22,20,22,18,20,17,16],C.outline);
    p([19,12,25,12,25,15,26,16,26,19,25,20,24,21,20,21,19,19],C.skin);
    p([18,9,21,9,21,14,20,14,20,22,18,25,16,24,17,19,17,13],C.shadow);
    r(18,14,1,8,C.hair);r(18,19,1,3,C.light);
    p([19,7,26,7,26,13,24,13,23,11,21,12,19,11],C.hair);
    eye(21,13,true);r(21,19,2,1,C.blush);
    ornament(10,9);r(9,6,4,1,C.light);return;
  }
  // Same crown width as Feilen, ending in a bob at the shoulders.
  p([11,1,21,1,21,2,25,2,25,4,27,4,27,7,29,7,29,19,30,23,28,26,24,27,20,26,16,27,11,26,7,27,3,25,2,22,4,18,4,7,6,7,6,4,8,4,8,2,11,2],C.outline);
  p([11,3,22,3,22,4,25,4,25,7,27,7,27,19,28,23,26,25,23,25,20,24,16,25,11,24,7,25,5,23,4,22,6,18,6,7,8,7,8,4,11,4],C.hair);
  r(10,3,12,1,C.light);r(7,7,1,9,C.light);
  if(direction==='up'){
    p([9,13,11,12,10,20,12,24,10,24,8,20],C.shadow);
    p([21,12,23,13,23,20,25,23,23,25,21,20],C.shadow);
    p([15,18,16,17,16,21,18,24,16,24,14,21],C.light);
    ornament(3,6);ornament(24,6,true);return;
  }
  // Separate the jaw from a short collar; pale neck pixels lengthen the face.
  r(12,23,10,4,C.white);
  p([10,11,23,11,23,20,21,23,13,23,10,20],C.outline);
  p([11,12,22,12,22,20,20,22,14,22,11,20],C.skin);
  r(11,19,2,1,C.blush);r(20,19,2,1,C.blush);
  eye(11,14);eye(18,14);
  // Portrait-style peach smile: a thin closed curve with gently lifted corners.
  r(15,19,1,1,C.mouth);r(18,19,1,1,C.mouth);r(16,20,2,1,C.mouth);
  // End mouth study region.
  p([8,7,25,7,25,13,23,14,21,13,20,10,20,14,16,14,15,10,15,14,11,14,10,12,8,13],C.hair);
  r(12,8,1,4,C.shadow);r(18,8,1,4,C.shadow);r(23,9,1,3,C.shadow);
  p([7,13,11,13,11,20,13,23,10,26,7,24,6,20],C.shadow);
  p([8,14,9,14,9,21,11,23,10,24,8,23],C.hair);
  p([22,13,27,13,27,20,26,24,23,26,21,24,22,21],C.shadow);
  r(25,15,1,7,C.light);ornament(3,6);ornament(24,6,true);
}
