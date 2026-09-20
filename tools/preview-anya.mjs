// Build a self-contained review page from exactly the drawing code used on the floor.
import { build } from 'esbuild';
import { mkdir, writeFile } from 'node:fs/promises';
const result = await build({
  entryPoints: ['src/renderer/src/scene/office/anyaArt.ts'],
  bundle: true, write: false, format: 'iife', globalName: 'Anya',
});
const comparison = await build({
  entryPoints: ['src/renderer/src/scene/office/feilenArt.ts'],
  bundle: true, write: false, format: 'iife', globalName: 'Feilen',
});
const html = `<!doctype html><html lang="zh-CN"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>阿尼亚 · 动作预览</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#f8f2df;color:#362a42;font-family:system-ui;padding:32px}main{max-width:1000px;margin:auto}h1{font-size:28px;margin:0 0 8px}p{color:#766581;line-height:1.6}button{padding:8px 18px;background:#fff9ed;border:1px solid #8b7495;color:inherit;cursor:pointer}section{margin-top:26px}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.card{background:#e1ece6;border:1px solid #b3bdac;text-align:center;padding:14px 6px}.card canvas{display:block;width:128px;height:192px;image-rendering:pixelated;margin:auto}.card small{display:block;color:#74677a;margin-top:8px}.sheet{overflow:auto;background:#eee7d7;border:1px solid #cbbdd0;padding:16px}.sheet canvas{image-rendering:pixelated;display:block}@media(max-width:620px){body{padding:16px}.grid{grid-template-columns:repeat(2,1fr)}}
</style><main><h1>阿尼亚 · 像素动作预览</h1><p>代码绘制 · 32 × 48 像素，与菲伦同规格 · 四向造型<br>待机眨眼、交替迈步、打字抬手、阅读持书。场景中的桌椅独立绘制。</p><button id="pause">暂停动画</button>
<section><h2>开心表情 · 放大检查</h2><div class="grid" id="faces"></div></section>
<section><h2>同尺寸对比 · 菲伦 / 阿尼亚</h2><p>同一显示高度，检查绘制精度与整体比例。</p><div class="grid" id="compare"></div></section>
<section><h2>坐姿桌沿遮挡 · 示意预览</h2><p>短发、白衬衫和蓝色背带裙；手和上身出现在桌面上。此处桌子是示意，非楼层截图。</p><div class="grid" id="seats"></div></section>
<section><h2>四向走路</h2><div class="grid" id="directions"></div></section>
<section><h2>动作对比 · 正面 / 侧面</h2><div class="grid" id="actions"></div></section>
<section><h2>动画帧表</h2><p>每行依次为：走路 4 帧、打字 4 帧、阅读 4 帧、待机 4 帧；四行分别为正面、背面、右侧、左侧。</p><div class="sheet"><canvas id="sheet" width="1024" height="384"></canvas></div></section></main>
<script>${result.outputFiles[0].text}</script><script>${comparison.outputFiles[0].text}</script><script>
const dirs=['down','up','right','left'], acts=['walk','type','read','idle'];
const names={down:'正面',up:'背面',right:'右侧',left:'左侧',walk:'走路',type:'打字',read:'阅读',idle:'待机'};
const items=[];
for(const [d,label,f] of [['down','正面 · 开心',0],['down','正面 · 眨眼',3],['right','侧面 · 开心',0]]){
  const source=document.createElement('canvas');source.width=32;source.height=48;
  Anya.paintAnya(source.getContext('2d'),d,'idle',f);
  const card=document.createElement('div');card.className='card';
  const c=document.createElement('canvas');c.width=32;c.height=32;c.style.width='192px';c.style.height='192px';c.style.maxWidth='100%';c.style.objectFit='contain';
  c.getContext('2d').drawImage(source,0,0);
  const name=document.createElement('div');name.textContent=label;
  card.append(c,name);document.getElementById('faces').append(card);
}
for(const [name,w,h,paint,d] of [['菲伦 · 正面',32,48,Feilen.paintFeilen,'down'],['阿尼亚 · 正面',32,48,Anya.paintAnya,'down'],['菲伦 · 侧面',32,48,Feilen.paintFeilen,'right'],['阿尼亚 · 侧面',32,48,Anya.paintAnya,'right']]){
  const card=document.createElement('div');card.className='card';
  const c=document.createElement('canvas');c.width=w;c.height=h;
  paint(c.getContext('2d'),d,'idle',0);
  const label=document.createElement('div');label.textContent=name;
  card.append(c,label);document.getElementById('compare').append(card);
}
function add(parent,d,a){const card=document.createElement('div');card.className='card';const c=document.createElement('canvas');c.width=Anya.ANYA_W;c.height=Anya.ANYA_H;const label=document.createElement('div');label.textContent=names[d]+' · '+names[a];card.append(c,label);document.getElementById(parent).append(card);items.push({ctx:c.getContext('2d'),d,a});}
dirs.forEach(d=>add('directions',d,'walk'));['down','right'].forEach(d=>acts.forEach(a=>add('actions',d,a)));
const seats=[];['idle','type','read'].forEach(a=>{const card=document.createElement('div');card.className='card';const c=document.createElement('canvas');c.width=128;c.height=128;c.style.width='192px';c.style.height='192px';const label=document.createElement('div');label.textContent='坐姿 · '+names[a];card.append(c,label);document.getElementById('seats').append(card);const ctx=c.getContext('2d');ctx.scale(2,2);ctx.imageSmoothingEnabled=false;seats.push({ctx,a});});
const sheet=document.getElementById('sheet').getContext('2d');sheet.imageSmoothingEnabled=false;
const cell=document.createElement('canvas');cell.width=Anya.ANYA_W;cell.height=Anya.ANYA_H;const cc=cell.getContext('2d');
dirs.forEach((d,row)=>acts.forEach((a,group)=>{for(let f=0;f<4;f++){Anya.paintAnya(cc,d,a,f);sheet.drawImage(cell,(group*4+f)*64,row*96,64,96);}}));
let paused=false,tick=0;document.getElementById('pause').onclick=e=>{paused=!paused;e.target.textContent=paused?'继续动画':'暂停动画'};
function draw(){items.forEach(({ctx,d,a})=>Anya.paintAnya(ctx,d,a,a==='idle'?(tick%16===15?3:0):tick%4));seats.forEach(({ctx,a})=>{ctx.clearRect(0,0,64,64);ctx.fillStyle='#79583e';ctx.fillRect(3,41,58,19);ctx.fillStyle='#c7a56c';ctx.fillRect(5,42,54,15);Anya.paintAnya(cc,'down',a,a==='idle'?(tick%16===15?3:0):tick%4,true);ctx.drawImage(cell,0,0,32,36,16,8,32,36);ctx.fillStyle='#515364';ctx.fillRect(23,43,20,12);ctx.fillStyle='#c4ccce';ctx.fillRect(25,45,16,7);ctx.fillStyle='#79583e';ctx.fillRect(3,57,58,3);});}draw();setInterval(()=>{if(!paused){tick++;draw()}},180);
</script></html>`;
await mkdir('outputs', { recursive: true });
await writeFile('outputs/anya-preview.html', html);
console.log('outputs/anya-preview.html');
