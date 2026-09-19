// Isolated design study: alternatives never replace the office character.
import { build } from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const source = await readFile('src/renderer/src/scene/office/anyaHeadArt.ts','utf8');
const start = source.indexOf('  // Portrait-style peach smile:');
const end = source.indexOf('  p([16,23',start);
if(start<0 || end<0) throw new Error('Mouth section not found');
const variants = [
  ['A','头像式圆口', `
  p([30,44,35,44,37,46,37,49,35,52,32,52,30,50,29,46], '#c87983');
  p([30,45,35,45,36,47,36,49,34,51,32,51,31,49], '#f5ac9c');`],
  ['B','宽一些的笑口', `
  p([28,45,31,44,35,44,38,45,38,47,36,50,33,51,30,50,28,47], '#c87983');
  p([29,45,32,45,35,45,37,46,36,48,34,50,32,50,30,48], '#f5ac9c');`],
  ['C','略微倾斜的笑口', `
  p([29,46,32,44,36,44,38,45,37,48,35,51,32,52,30,50], '#c87983');
  p([30,46,33,45,36,45,37,46,36,48,34,51,32,51,31,49], '#f5ac9c');`],
];
const bundles=[];
for(const [key,label,mouth] of variants) {
  const result=await build({entryPoints:['src/renderer/src/scene/office/anyaArt.ts'],bundle:true,write:false,format:'iife',globalName:'Variant'+key,
    plugins:[{name:'mouth-study',setup(b){b.onLoad({filter:/anyaHeadArt\.ts$/},()=>({contents:source.slice(0,start)+mouth+'\n'+source.slice(end),loader:'ts'}));}}]});
  bundles.push(result.outputFiles[0].text);
}
const portrait=(await readFile('src/renderer/src/assets/Anya.png')).toString('base64');
const html=`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>阿尼亚 · 嘴型对比</title>
<style>*{box-sizing:border-box}body{margin:0;background:#f8f2df;color:#362a42;font-family:system-ui;padding:24px}main{max-width:940px;margin:auto}header{display:flex;align-items:center;gap:20px;margin-bottom:22px}header img{width:112px;height:112px;object-fit:contain}h1{font-size:25px;margin:0 0 8px}p{font-size:14px;line-height:1.6;margin:0;color:#75647b}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.card{text-align:center;background:#e1ece6;border:1px solid #b3bdac;padding:16px 8px}h2{font-size:16px;margin:0 0 12px}canvas{display:block;image-rendering:pixelated;margin:0 auto;max-width:100%;height:auto}.head{width:192px}.face{width:190px;margin-top:12px}.full{width:96px;margin-top:16px}small{display:block;margin-top:14px;color:#75647b}@media(max-width:560px){.grid{grid-template-columns:1fr}header img{width:88px;height:88px}}</style>
<main><header><img src="data:image/png;base64,${portrait}" alt="现有头像参考"><div><h1>嘴型对比</h1><p>同一张脸，仅替换嘴型。均不露齿，侧脸不画嘴巴。<br>每列依次是头像、脸部放大和全身效果。</p></div></header><div class="grid">${variants.map(([k,label])=>`<article class="card"><h2>${k} · ${label}</h2><canvas class="head" id="head${k}" width="64" height="64"></canvas><canvas class="face" id="face${k}" width="38" height="27"></canvas><canvas class="full" id="full${k}" width="64" height="96"></canvas></article>`).join('')}</div><small>已采用 B · 宽一些的笑口，角色与动作预览已同步。A、C 保留作对比。</small></main>
<script>${bundles.join('\n')}</script><script>
for(const [key,variant] of [['A',VariantA],['B',VariantB],['C',VariantC]]) {
const full=document.getElementById('full'+key);variant.paintAnya(full.getContext('2d'),'down','idle',0);
document.getElementById('head'+key).getContext('2d').drawImage(full,0,0);
document.getElementById('face'+key).getContext('2d').drawImage(full,14,29,38,27,0,0,38,27);
}
</script></html>`;
await mkdir('outputs',{recursive:true});
await writeFile('outputs/anya-mouth-options.html',html);
console.log('outputs/anya-mouth-options.html');
