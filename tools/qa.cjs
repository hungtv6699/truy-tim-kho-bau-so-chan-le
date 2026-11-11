const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm'),{pathToFileURL}=require('node:url'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const local=!process.argv[2],url=process.argv[2]||pathToFileURL(path.resolve('index.html')).href;
const qs=JSON.parse(fs.readFileSync('src/questions.json','utf8'));
assert.deepEqual(JSON.parse(vm.runInNewContext(fs.readFileSync('src/questions.js','utf8')+'JSON.stringify(questions)')),qs);
for(const q of qs){
  assert.equal(new Set(q.options).size,4);
  const valid=Array.from({length:10},(_,i)=>i+1).filter(n=>q.text.includes('nhỏ nhất')?n===Math.min(...[1,3,5,7,9]):n%2===Number(q.text.includes('lẻ'))&&n>q.l&&n<q.h);
  assert.deepEqual(valid,[q.a]);assert(q.options.includes(q.a));
}
assert.equal(qs.map(q=>q.a).join(''),'83619');
(async()=>{
fs.mkdirSync('reports/previews',{recursive:true});
for(const channel of ['chrome','msedge']){
const browser=await chromium.launch({channel,headless:true});
try{
const touch=channel==='msedge',context=await browser.newContext({viewport:{width:1280,height:720},offline:local,hasTouch:touch});
const page=await context.newPage(),errors=[],failed=[],network=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('requestfailed',r=>{if(r.failure()?.errorText!=='net::ERR_ABORTED')failed.push(r.url())});
page.on('request',r=>{if(r.url().startsWith('http'))network.push(r.url())});
page.on('response',r=>{if(r.status()>=400)failed.push(r.url()+': '+r.status())});
const l=s=>page.locator(s),press=s=>touch?l(s).tap():l(s).click();
const text=s=>l(s).innerText();
const phase=p=>l('[data-phase='+p+']').waitFor();
const audio=k=>page.waitForFunction(k=>speech.src.endsWith('/'+k+'.mp3')&&speech.currentTime>0&&!speech.paused,k);
const shot=async name=>{if(touch&&local)await page.screenshot({path:'reports/previews/'+name+'.png',animations:'disabled'})};
await page.goto(url);await l('#start').waitFor();
assert.equal(await page.evaluate(()=>document.querySelector('.friends').naturalWidth>0),true);
const clips=await page.evaluate(()=>Promise.all(audioManifest.map(k=>new Promise((ok,fail)=>{
 const a=new Audio();a.onloadedmetadata=()=>ok(a.duration);a.onerror=()=>fail(Error(k));a.src='audio/'+k+'.mp3';
}))));
assert.equal(clips.length,24);assert(clips.every(d=>Number.isFinite(d)&&d>0));
await press('#full');await page.waitForFunction(()=>!!document.fullscreenElement);
await press('#full');await page.waitForFunction(()=>!document.fullscreenElement);
await shot('01-gioi-thieu');
await press('#intro');await audio('intro');
await press('#start');await audio('q0');assert.equal(await l('#code .found').count(),0);
await shot('02-cau-do');
await press('#help');await audio('hint');assert.equal(await l('#numberline button').count(),10);assert.equal(await l('#numberline .dim').count(),0);
await press('#numberline [data-n="5"]');await audio('n5');assert.match(await text('#pairs'),/2 đôi và thừa 1/);
await press('#compare');await press('#compare');assert.equal(await l('#numberline button:not(.dim)').count(),3);
await shot('03-goi-y');await press('#closeHint');
for(const [i,q] of qs.entries()){
  await l('#step').waitFor();await page.waitForFunction(i=>document.querySelector('#step')?.textContent==='Ổ KHÓA '+(i+1)+' / 5',i);
  assert.equal(await l('#open').count(),0);assert.equal(await l('.unlocked').count(),i);
  assert.equal(await l('#choices button').count(),4);
  await press('#choices [data-n="'+q.options.find(n=>n!==q.a)+'"]');
  assert.equal(await text('#feedback'),'Con thử lại nhé!');assert.equal(await l('#code .found').count(),i);
  if(i===0){await audio('wrong');await press('#listen');await audio('q0')}
  await press('#choices [data-n="'+q.a+'"]');
  await l('.unlocked').nth(i).waitFor();
  assert.equal(await l('.unlocked').count(),i+1);
}
await l('#open').waitFor();
assert.equal((await l('#code .found').allTextContents()).join(''),'83619');
await shot('04-mat-ma');
await press('#open');await phase('win');await audio('win');
await shot('05-kho-bau');
await press('#sound');assert(await page.evaluate(()=>speech.paused));await press('#sound');await audio('win');
await press('#replay');await phase('play');assert.equal(await l('.unlocked').count(),0);assert.equal(await l('#code .found').count(),0);
await press('#back');await phase('home');
assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);if(local)assert.deepEqual(network,[]);
console.log(JSON.stringify({channel,version:browser.version(),touch,offline:local,url,clips:clips.length,code:'83619',complete:true,errors,failed}));
}finally{await browser.close()}
}
})().catch(e=>{console.error(e);process.exitCode=1});