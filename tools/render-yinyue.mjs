// Offline review of the native integer-rectangle painter, without browser access.
import { build } from 'esbuild';
import { runInNewContext } from 'node:vm';
import { writeFile, mkdir } from 'node:fs/promises';
import { deflateSync } from 'node:zlib';
const bundled = await build({entryPoints:['src/renderer/src/scene/office/yinyueArt.ts'],bundle:true,write:false,format:'iife',globalName:'Yinyue'});
const sandbox = {}; runInNewContext(bundled.outputFiles[0].text,sandbox);
const {paintYinyue,YINYUE_W:W,YINYUE_H:H} = sandbox.Yinyue;
class PixelContext {
  constructor(){this.data=Buffer.alloc(W*H*4);this.state=[1,1,0,0];this.stack=[];this.fillStyle='#000000';this.clipped=0;}
  save(){this.stack.push({state:[...this.state],fill:this.fillStyle});}
  restore(){const s=this.stack.pop();this.state=s.state;this.fillStyle=s.fill;}
  translate(x,y){this.state[2]+=x*this.state[0];this.state[3]+=y*this.state[1];}
  scale(x,y){this.state[0]*=x;this.state[1]*=y;}
  clearRect(){this.data.fill(0);}
  fillRect(x,y,w,h){
    if(w<=0||h<=0)return;
    const [sx,sy,tx,ty]=this.state;
    const x1=Math.min(x*sx+tx,(x+w)*sx+tx), x2=Math.max(x*sx+tx,(x+w)*sx+tx);
    const y1=Math.min(y*sy+ty,(y+h)*sy+ty), y2=Math.max(y*sy+ty,(y+h)*sy+ty);
    if(![x1,x2,y1,y2].every(Number.isInteger))throw Error('Fractional pixel boundary');
    if(x1<0||y1<0||x2>W||y2>H)this.clipped++;
    const c=parseInt(this.fillStyle.slice(1),16);
    for(let yy=Math.max(0,y1);yy<Math.min(H,y2);yy++)for(let xx=Math.max(0,x1);xx<Math.min(W,x2);xx++){
      const i=(yy*W+xx)*4;this.data[i]=c>>16;this.data[i+1]=(c>>8)&255;this.data[i+2]=c&255;this.data[i+3]=255;
    }
  }
}
const crc32 = bytes => {let c=0xffffffff;for(const b of bytes){c^=b;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;};
function chunk(type,data){const t=Buffer.from(type);const size=Buffer.alloc(4);size.writeUInt32BE(data.length);const crc=Buffer.alloc(4);crc.writeUInt32BE(crc32(Buffer.concat([t,data])));return Buffer.concat([size,t,data,crc]);}
function png(width,height,data){const header=Buffer.alloc(13);header.writeUInt32BE(width,0);header.writeUInt32BE(height,4);header[8]=8;header[9]=6;const rows=Buffer.alloc(height*(width*4+1));for(let y=0;y<height;y++)data.copy(rows,y*(width*4+1)+1,y*width*4,(y+1)*width*4);return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(rows)),chunk('IEND',Buffer.alloc(0))]);}
function blit(dst,width,src,x,y,scale){for(let yy=0;yy<H;yy++)for(let xx=0;xx<W;xx++){const i=(yy*W+xx)*4;if(!src[i+3])continue;for(let dy=0;dy<scale;dy++)for(let dx=0;dx<scale;dx++)src.copy(dst,((y+yy*scale+dy)*width+x+xx*scale+dx)*4,i,i+4);}}
await mkdir('outputs',{recursive:true});
const dirs=['down','up','right','left'],acts=['walk','type','read','idle'];
const sheet=Buffer.alloc(1024*384*4),overview=Buffer.alloc(1024*448*4);
for(let i=0;i<overview.length;i+=4){overview[i]=255;overview[i+1]=249;overview[i+2]=233;overview[i+3]=255;}
let count=0;
for(const [row,d] of dirs.entries())for(const [group,a] of acts.entries())for(let frame=0;frame<4;frame++){
  const ctx=new PixelContext();paintYinyue(ctx,d,a,frame);
  if(ctx.clipped)throw Error('Clipped drawing: '+[d,a,frame]);
  if(ctx.stack.length)throw Error('Unbalanced canvas state');
  blit(sheet,1024,ctx.data,(group*4+frame)*W*2,row*H*2,2);count++;
}
for(const [i,d] of dirs.entries()){const ctx=new PixelContext();paintYinyue(ctx,d,'idle',0);blit(overview,1024,ctx.data,i*256,32,8);if(i===0){const front=Buffer.alloc(256*384*4);blit(front,256,ctx.data,0,0,8);await writeFile('outputs/yinyue-front.png',png(256,384,front));}}
await writeFile('outputs/yinyue-directions.png',png(1024,448,overview));
await writeFile('outputs/yinyue-spritesheet.png',png(1024,384,sheet));
console.log('Rendered '+count+' frames. Integer pixels, no clipped drawing, balanced canvas state.');

// Same pixel grid and scale: Feilen on the left, Yinyue on the right.
const feilenBundle=await build({entryPoints:['src/renderer/src/scene/office/feilenArt.ts'],bundle:true,write:false,format:'iife',globalName:'Feilen'});
const feilenSandbox={};runInNewContext(feilenBundle.outputFiles[0].text,feilenSandbox);
const comparison=Buffer.alloc(576*416*4);
for(let i=0;i<comparison.length;i+=4){comparison[i]=248;comparison[i+1]=242;comparison[i+2]=223;comparison[i+3]=255;}
const fc=new PixelContext();feilenSandbox.Feilen.paintFeilen(fc,'down','idle',0);
const yc=new PixelContext();paintYinyue(yc,'down','idle',0);
blit(comparison,576,fc.data,16,16,8);blit(comparison,576,yc.data,304,16,8);
await writeFile('outputs/yinyue-feilen-comparison.png',png(576,416,comparison));
