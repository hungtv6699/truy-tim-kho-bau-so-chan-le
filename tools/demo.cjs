const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const {pathToFileURL}=require('node:url'),path=require('node:path'),fs=require('node:fs');
const questions=JSON.parse(fs.readFileSync('src/questions.json','utf8'));
(async()=>{
 const browser=await chromium.launch({channel:'msedge'});
 try{
  fs.mkdirSync('outputs',{recursive:true});
  const context=await browser.newContext({offline:true,viewport:{width:1280,height:720},recordVideo:{dir:'tmp/demo',size:{width:1280,height:720}}});
  const page=await context.newPage(),video=page.video();
  await page.goto(pathToFileURL(path.resolve('index.html')).href);
  await page.waitForTimeout(1400);await page.click('#start');
  await page.waitForTimeout(1300);await page.click('#help');
  await page.click('#numberline [data-n="4"]');await page.waitForTimeout(1600);
  await page.click('#closeHint');
  for(const [i,q] of questions.entries()){
   await page.waitForFunction(i=>document.querySelector('#step')?.textContent==='Ổ KHÓA '+(i+1)+' / 5',i);
   await page.waitForTimeout(1150);
   if(i===0){await page.click('#choices [data-n="7"]');await page.waitForTimeout(800)}
   await page.click('#choices [data-n="'+q.a+'"]');
  }
  await page.locator('#open').waitFor();await page.waitForTimeout(1250);
  await page.click('#open');await page.locator('#replay').waitFor();await page.waitForTimeout(2700);
  await context.close();
  await video.saveAs('outputs/GAME_03_DEMO.webm');
  await video.delete();
  fs.rmdirSync('tmp/demo');
  console.log('Saved GAME_03_DEMO.webm; removed the Playwright intermediate.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});