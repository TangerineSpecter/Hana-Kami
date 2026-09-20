// Build the standalone Yinyue design review; office integration is a separate step.
import { build } from 'esbuild';
import { mkdir, writeFile } from 'node:fs/promises';
const result = await build({
  entryPoints: ['src/renderer/src/scene/office/yinyueArt.ts'],
  bundle: true, write: false, format: 'iife', globalName: 'Yinyue',
});
const feilen = await build({ entryPoints: ['src/renderer/src/scene/office/feilenArt.ts'], bundle: true, write: false, format: 'iife', globalName: 'Feilen' });
const html = `<!doctype html><html lang="zh-CN"><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>银月 · 动作预览</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#f8f2df;color:#362a42;font-family:system-ui;padding:32px}main{max-width:1000px;margin:auto}h1{font-size:28px;margin:0 0 8px}p{color:#766581;line-height:1.6}button{padding:8px 18px;background:#fff9ed;border:1px solid #8b7495;color:inherit;cursor:pointer}section{margin-top:26px}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.card{background:#e5e9ef;border:1px solid #b3bdac;text-align:center;padding:14px 6px}.card canvas{display:block;width:128px;height:192px;image-rendering:pixelated;margin:auto}.card small{display:block;color:#74677a;margin-top:8px}.sheet{overflow:auto;background:#eee7d7;border:1px solid #cbbdd0;padding:16px}.sheet canvas{image-rendering:pixelated;display:block}@media(max-width:620px){body{padding:16px}.grid{grid-template-columns:repeat(2,1fr)}}
.hero{display:flex;gap:32px;align-items:center;justify-content:center;background:#e5e9ef;border:1px solid #bac1ce;padding:24px;flex-wrap:wrap}.hero canvas{image-rendering:pixelated}.hero figure{margin:0;text-align:center}.hero figcaption{margin-top:12px;color:#74677a}.hero .main{width:192px;height:288px}.hero .friend{width:192px;height:288px}.hero .actual{width:32px;height:48px}button:focus-visible{outline:3px solid #b95361;outline-offset:3px}</style><main><h1>银月 · 像素动作预览</h1><p>银白长发 · 毛茸茸尖耳 · 蓝灰眼睛 · 小红腰结<br>32 × 48 像素，直接沿用菲伦的头身比例与五官坐标。第三版设计预览 · 已接入办公室银月角色。</p><button id="pause">暂停动画</button>
<section><div class="hero"><figure><canvas id="hero" class="main" width="32" height="48"></canvas><figcaption>银月 · 正面站立 × 6</figcaption></figure><figure><canvas id="friend" class="friend" width="32" height="48"></canvas><figcaption>菲伦 · 比例参考 × 6</figcaption></figure><figure><canvas id="actual" class="actual" width="32" height="48"></canvas><figcaption>银月 · 办公室尺寸参考</figcaption></figure></div></section><section><h2>坐姿桌沿遮挡 · 示意预览</h2><p>长发在桌沿处遮住，手和上身仍可出现在桌面上。此处桌子是示意，非楼层截图。</p><div class="grid" id="seats"></div></section>
<section><h2>四向走路</h2><div class="grid" id="directions"></div></section>
<section><h2>动作对比 · 正面 / 侧面</h2><div class="grid" id="actions"></div></section>
<section><h2>动画帧表</h2><p>每行依次为：走路 4 帧、打字 4 帧、阅读 4 帧、待机 4 帧；四行分别为正面、背面、右侧、左侧。</p><div class="sheet"><canvas id="sheet" width="1024" height="384"></canvas></div></section></main>
<script>${result.outputFiles[0].text}
${feilen.outputFiles[0].text}</script><script>
const dirs=['down','up','right','left'], acts=['walk','type','read','idle'];
const names={down:'正面',up:'背面',right:'右侧',left:'左侧',walk:'走路',type:'打字',read:'阅读',idle:'待机'};
const items=[];
function add(parent,d,a){const card=document.createElement('div');card.className='card';const c=document.createElement('canvas');c.width=32;c.height=48;const label=document.createElement('div');label.textContent=names[d]+' · '+names[a];card.append(c,label);document.getElementById(parent).append(card);items.push({ctx:c.getContext('2d'),d,a});}
dirs.forEach(d=>add('directions',d,'walk'));['down','right'].forEach(d=>acts.forEach(a=>add('actions',d,a)));
const seats=[];['idle','type','read'].forEach(a=>{const card=document.createElement('div');card.className='card';const c=document.createElement('canvas');c.width=64;c.height=64;c.style.width='192px';c.style.height='192px';const label=document.createElement('div');label.textContent='坐姿 · '+names[a];card.append(c,label);document.getElementById('seats').append(card);seats.push({ctx:c.getContext('2d'),a});});
const sheet=document.getElementById('sheet').getContext('2d');sheet.imageSmoothingEnabled=false;
const cell=document.createElement('canvas');cell.width=32;cell.height=48;const cc=cell.getContext('2d');
dirs.forEach((d,row)=>acts.forEach((a,group)=>{for(let f=0;f<4;f++){Yinyue.paintYinyue(cc,d,a,f);sheet.drawImage(cell,(group*4+f)*64,row*96,64,96);}}));
let paused=false,tick=0;document.getElementById('pause').onclick=e=>{paused=!paused;e.target.textContent=paused?'继续动画':'暂停动画'};
function draw(){const idle=tick%16===15?3:0;Yinyue.paintYinyue(document.getElementById('hero').getContext('2d'),'down','idle',idle);Yinyue.paintYinyue(document.getElementById('actual').getContext('2d'),'down','idle',idle);Feilen.paintFeilen(document.getElementById('friend').getContext('2d'),'down','idle',idle);items.forEach(({ctx,d,a})=>Yinyue.paintYinyue(ctx,d,a,a==='idle'?(tick%16===15?3:0):tick%4));seats.forEach(({ctx,a})=>{ctx.clearRect(0,0,64,64);ctx.fillStyle='#79583e';ctx.fillRect(3,41,58,19);ctx.fillStyle='#c7a56c';ctx.fillRect(5,42,54,15);Yinyue.paintYinyue(cc,'down',a,a==='idle'?(tick%16===15?3:0):tick%4,true);ctx.imageSmoothingEnabled=false;ctx.drawImage(cell,0,0,32,36,16,8,32,36);ctx.fillStyle='#515364';ctx.fillRect(23,43,20,12);ctx.fillStyle='#c4ccce';ctx.fillRect(25,45,16,7);ctx.fillStyle='#79583e';ctx.fillRect(3,57,58,3);});}draw();setInterval(()=>{if(!paused){tick++;draw()}},180);
</script></html>`;
await mkdir('outputs', { recursive: true });
await writeFile('outputs/yinyue-preview.html', html);
console.log('outputs/yinyue-preview.html');
