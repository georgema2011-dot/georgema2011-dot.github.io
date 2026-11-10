// Render the real website into a PDF. No substitute typography or layout.
import { chromium } from '/Users/gma/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';

const root=resolve(process.argv[2] || 'dist/client');
const output=resolve('public/george-ma-portfolio.pdf');
const captures=resolve('tmp/pdf-web-captures');
await mkdir(captures,{recursive:true});
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'};
const server=createServer(async(req,res)=>{
 try {
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let path=resolve(root,'.'+pathname);
  if(!path.startsWith(root+'/') && path!==root)throw Error('Invalid path');
  if(pathname.endsWith('/'))path+='/index.html';
  const data=await readFile(path);
  res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream'});res.end(data);
 }catch{res.writeHead(404);res.end()}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,executablePath:'/Users/gma/.cache/hyperframes/chrome/chrome-headless-shell/mac_arm-152.0.7977.30/chrome-headless-shell-mac-arm64/chrome-headless-shell'});
const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:2});
const sheets=[];
let projectCount=9;
async function load(path){
 await page.goto(origin+path,{waitUntil:'networkidle'});
 await page.evaluate(async()=>{
  await document.fonts.ready;
  document.querySelectorAll('img').forEach(i=>{i.loading='eager'});
  await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));
  const missing=[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src);
  if(missing.length)throw Error(`Missing PDF assets: ${missing.join(', ')}`);
  if(!document.fonts.check('16px Anton'))throw Error('Portfolio heading font did not load');
 });
 await page.addStyleTag({content:'a[download]{display:none!important}.site-nav{position:relative!important}*{scroll-behavior:auto!important}'});
}
async function capture(selector,label){
 const locator=page.locator(selector);
 await locator.scrollIntoViewIfNeeded();
 await page.waitForTimeout(350);
 const text=await locator.innerText();
 const image=await locator.screenshot({type:'jpeg',quality:94,animations:'disabled'});
 await writeFile(resolve(captures,`${String(sheets.length+1).padStart(2,'0')}.jpg`),image);
 sheets.push({label,text,image:image.toString('base64')});
}
try{
 if(process.argv.includes('--reuse')){
  const manifest=JSON.parse(await readFile(resolve(captures,'manifest.json'),'utf8'));
  for(let i=0;i<manifest.length;i++)sheets.push({...manifest[i],image:(await readFile(resolve(captures,`${String(i+1).padStart(2,'0')}.jpg`))).toString('base64')});
 }else{
 await load('/');
 await page.waitForTimeout(2000);
 for(const selector of ['.site-nav','.hero-intro','.project-coverflow','.proof-strip','.about-grid','.experience','.project-index','.press-feature','.photo-archive','.site-footer']){
  await capture(selector,selector);
 }
 const ids=await page.locator('.index-list a').evaluateAll(as=>as.map(a=>a.getAttribute('href')));
 for(const href of [...new Set(ids)]){
  await load(href);
  await capture('.dossier-head',href);
  const count=await page.locator('.board').count();
  for(let i=0;i<count;i++)await capture(`.board:nth-child(${i+1})`,`${href} board ${i+1}`);
 }
 projectCount=new Set(ids).size;
 }
 // Fit each complete section on a landscape page without cropping. Combine
 // short adjacent homepage sections so navigation and proof strips stay in context.
 const printPage=await browser.newPage();
 const groups=[];
 for(let i=0;i<sheets.length;i++){
  if(i===0||i===2||i===4){groups.push([sheets[i],sheets[++i]])}
  else groups.push([sheets[i]]);
 }
 const markup=(await Promise.all(groups.map(async group=>{
  const heights=await Promise.all(group.map(async s=>{return printPage.evaluate(async image=>{const i=new Image();i.src='data:image/jpeg;base64,'+image;await i.decode();return i.naturalHeight/i.naturalWidth*1440},s.image)}));
  const scale=Math.min(1,1000/heights.reduce((a,b)=>a+b,0));
  return `<section class="sheet"><div>${group.map((s,i)=>`<img style="width:${1440*scale}px;height:${heights[i]*scale}px" src="data:image/jpeg;base64,${s.image}">`).join('')}</div><span class="text">${group.map(s=>s.text).join(' ').replaceAll('&','&amp;').replaceAll('<','&lt;')}</span></section>`;
 }))).join('');
 await printPage.setContent(`<html><head><style>@page{size:1440px 1000px;margin:0}*{box-sizing:border-box}body{margin:0;background:#fdfdfb}.sheet{width:1440px;height:1000px;break-after:page;display:flex;align-items:center;justify-content:center;position:relative}.sheet:last-child{break-after:auto}.sheet img{display:block;object-fit:contain}.text{position:absolute;inset:0;color:transparent;font-size:1px;pointer-events:none}</style></head><body>${markup}</body></html>`);
 await printPage.evaluate(async()=>{await Promise.all([...document.images].map(i=>i.decode()))});
 await printPage.pdf({path:output,printBackground:true,preferCSSPageSize:true});
 await writeFile(resolve(captures,'manifest.json'),JSON.stringify(sheets.map(({label,text})=>({label,text})),null,2));
 console.log(JSON.stringify({output,pages:groups.length,projects:projectCount}));
}finally{await browser.close();server.close()}
