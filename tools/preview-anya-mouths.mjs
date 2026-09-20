// Isolated design study: alternatives never replace the office character.
import { build } from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const source = await readFile('src/renderer/src/scene/office/anyaHeadArt.ts','utf8');
const start = source.indexOf('  // Portrait-style peach smile:');
const end = source.indexOf('  // End mouth study region.',start);
if(start<0 || end<0) throw new Error('Mouth section not found');
const variants = [
  ['A','小圆口', `r(16,19,2,2,C.mouth);r(16,20,1,1,C.tongue);`],
  ['B','开口笑', `r(14,19,1,1,C.mouth);r(19,19,1,1,C.mouth);r(15,19,4,2,'#98536d');r(16,20,2,1,C.tongue);`],
  ['C','闭嘴微笑', `r(15,19,1,1,C.mouth);r(18,19,1,1,C.mouth);r(16,20,2,1,C.mouth);`],
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
<main><header><img src="data:image/png;base64,${portrait}" alt="现有头像参考"><div><h1>嘴型对比</h1><p>同一张脸，仅替换嘴型。均不露齿，侧脸不画嘴巴。<br>每列依次是头像、脸部放大和全身效果。</p></div></header><div class="grid">${variants.map(([k,label])=>`<article class="card"><h2>${k} · ${label}</h2><canvas class="head" id="head${k}" width="32" height="32"></canvas><canvas class="face" id="face${k}" width="19" height="13"></canvas><canvas class="full" id="full${k}" width="32" height="48"></canvas></article>`).join('')}</div><small>当前 C · 闭嘴微笑，角色与动作预览已同步。A、B 保留作对比。</small></main>
<script>${bundles.join('\n')}</script><script>
for(const [key,variant] of [['A',VariantA],['B',VariantB],['C',VariantC]]) {
const full=document.getElementById('full'+key);variant.paintAnya(full.getContext('2d'),'down','idle',0);
document.getElementById('head'+key).getContext('2d').drawImage(full,0,0);
document.getElementById('face'+key).getContext('2d').drawImage(full,7,14,19,13,0,0,19,13);
}
</script></html>`;
await mkdir('outputs',{recursive:true});
await writeFile('outputs/anya-mouth-options.html',html);
console.log('outputs/anya-mouth-options.html');
