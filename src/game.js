const $=s=>document.querySelector(s);
const game=new Hunt(), board=$('#game'), scene=$('#scene'), hint=$('#hint');
let muted=false, speech=new Audio(), sequence=0, version=0, hintStep=0;
const available=new Set(audioManifest);
function speak(...keys){
  const ticket=++sequence;
  speech.pause();speech.onended=null;
  function next(){
    if(ticket!==sequence||muted)return;
    const key=keys.shift();
    if(!key)return;
    if(!available.has(key))return next();
    speech.src='audio/'+key+'.mp3';
    speech.onended=next;
    speech.play().catch(()=>{});
  }
  next();
}
let toneContext;
function chime(){
  if(muted)return;
  try{
    toneContext??=new AudioContext();toneContext.resume().catch(()=>{});
    [523,659,784].forEach((n,i)=>{
      const t=toneContext.currentTime+i*.07, o=toneContext.createOscillator(), g=toneContext.createGain();
      o.type='sine';o.frequency.value=n;g.gain.setValueAtTime(.065,t);g.gain.exponentialRampToValueAtTime(.001,t+.23);
      o.connect(g).connect(toneContext.destination);o.start(t);o.stop(t+.24);
    });
  }catch{}
}
const motion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait=ms=>new Promise(ok=>setTimeout(ok,motion()?10:ms));
const buttons=(values,fn)=>values.map(n=>{
  const b=document.createElement('button');b.textContent=n;b.dataset.n=n;b.onclick=()=>fn(n,b);return b;
});
const lockSvg='<svg viewBox="0 0 48 56" aria-hidden="true"><path class="shackle" d="M12 26V16a12 12 0 0 1 24 0v10" fill="none" stroke="#ffe9a7" stroke-width="6"/><rect x="4" y="22" width="40" height="32" rx="10" fill="#ffbf4f" stroke="#fff0b9" stroke-width="3"/><path d="M24 32a4 4 0 0 0-2 7l-1 6h6l-1-6a4 4 0 0 0-2-7" fill="#81532a"/></svg>';
for(let i=0;i<5;i++){
  const lock=document.createElement('span');lock.className='lock';lock.style.setProperty('--i',i);lock.innerHTML=lockSvg;$('.locks').append(lock);
}
for(let i=0;i<18;i++){
  const star=document.createElement('i');star.style.cssText='--x:'+((i*31+7)%94)+'%;--y:'+((i*17+9)%83)+'%;--i:'+i;$('.sparkles').append(star);
}
function paint(){
  board.dataset.phase=game.phase;
  document.querySelectorAll('.lock').forEach((x,i)=>{
    x.classList.toggle('unlocked',i<game.code.length);x.classList.toggle('active',i===game.code.length&&game.phase==='play');
  });
}
function digits(){
  const row=$('#code');if(!row)return;
  row.replaceChildren(...Array.from({length:5},(_,i)=>{
    const e=document.createElement('span');e.textContent=game.code[i]??'·';e.className=i<game.code.length?'found':'';e.style.setProperty('--i',i);return e;
  }));
}
function show(){
  paint();
  scene.replaceChildren(document.getElementById(game.phase).content.cloneNode(true));
  digits();
  if($('#back'))$('#back').onclick=home;
  if(game.phase==='home'){
    $('#intro').onclick=()=>{startMusic();speak('intro')};
    $('#start').onclick=()=>begin('choose');
  }else if(game.phase==='play'){
    $('#step').textContent='Ổ KHÓA '+(game.code.length+1)+' / 5';
    $('#question').textContent=game.current.text;
    $('#choices').replaceChildren(...buttons(game.current.options,choose));
    $('#listen').onclick=()=>speak('q'+game.code.length);
    $('#help').onclick=openHint;
  }else if(game.phase==='ready')$('#open').onclick=openChest;
  else if(game.phase==='win')$('#replay').onclick=()=>{game.reset();begin('replay')};
}
function home(){version++;if(hint.open)hint.close();speak();game.reset();show();$('#start').focus()}
function begin(line){startMusic();game.begin();show();speak(line,'q0')}
async function choose(n,b){
  const result=game.select(n);
  if(result===null)return;
  if(!result){
    $('#feedback').textContent='Con thử lại nhé!';
    b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');speak('wrong');return;
  }
  const token=version;
  paint();
  for(const selector of ['#choices button','#listen','#help'])document.querySelectorAll(selector).forEach(x=>x.disabled=true);
  $('#feedback').textContent='Chính xác!';
  speak('correct');
  const a=b.getBoundingClientRect(), t=document.querySelectorAll('.lock')[game.code.length].getBoundingClientRect();
  const flyer=b.cloneNode(true);flyer.className='flyer';flyer.disabled=true;
  Object.assign(flyer.style,{left:a.left+'px',top:a.top+'px',width:a.width+'px',height:a.height+'px'});
  board.append(flyer);
  if(!motion())flyer.animate([{transform:'translate(0,0)'},{transform:'translate('+(t.x+t.width/2-a.x-a.width/2)+'px,'+(t.y+t.height/2-a.y-a.height/2)+'px) scale(.24)'}],{duration:510,fill:'forwards',easing:'cubic-bezier(.35,.02,.32,1)'});
  await wait(520);flyer.remove();
  if(token!==version)return;
  const lock=document.querySelectorAll('.lock')[game.code.length];
  lock.classList.add('pop');chime();game.collect();paint();digits();
  await wait(600);
  lock.classList.remove('pop');
  if(token!==version)return;
  show();
  // Keep the praise audible, then read the next prompt if the child is still on it.
  const next=game.phase==='ready'?'ready':'q'+game.code.length;
  if(!speech.paused&&speech.src.endsWith('/correct.mp3')){
    const ticket=sequence;speech.onended=()=>{if(ticket===sequence&&token===version)speak(next)};
  }else speak(next);
}
function openHint(){
  if(game.phase!=='play')return;
  game.phase='hint';paint();hintStep=0;
  $('#numberline').replaceChildren(...buttons(Array.from({length:10},(_,i)=>i+1),pair));
  document.querySelectorAll('#numberline button').forEach((b,i)=>{b.className=(i+1)%2?'odd':'even';b.setAttribute('aria-pressed','false')});
  $('#pairs').textContent='Chạm vào một số để xem các đôi.';
  $('#compare').disabled=false;$('#compare').textContent='Gợi ý tiếp';
  hint.showModal();speak('hint');
}
function pair(n,b){
  document.querySelectorAll('#numberline button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  const row=document.createElement('div');row.className='pairgrid';row.setAttribute('aria-hidden','true');
  for(let i=0;i<n;i++){const dot=document.createElement('i');if(i===n-1&&n%2)dot.className='single';row.append(dot)}
  const label=document.createElement('span');label.textContent=Math.floor(n/2)+' đôi'+(n%2?' và thừa 1':'');
  $('#pairs').replaceChildren(row,label);speak('n'+n);
}
$('#compare').onclick=()=>{
  hintStep++;
  const q=game.current;
  document.querySelectorAll('#numberline button').forEach(b=>{
    const n=Number(b.dataset.n);
    b.classList.toggle('dim',q.a===1? n>5 : n<q.l||(hintStep>1&&n>q.h));
  });
  if(hintStep===2||q.a===1)$('#compare').disabled=true;
  speak('range');
};
$('#closeHint').onclick=()=>hint.close();
hint.onclose=()=>{if(game.phase==='hint'){game.phase='play';paint();speak('q'+game.code.length);$('#help').focus()}};
async function openChest(){
  if(!game.open())return;
  const token=version;
  $('#open').disabled=true;paint();speak();chime();
  await wait(1150);if(token!==version)return;
  game.finish();show();speak('win');$('#replay').focus({preventScroll:true});
}
$('#sound').onclick=()=>{
  muted=!muted;$('#sound').textContent='Âm thanh: '+(muted?'tắt':'bật');
  $('#sound').setAttribute('aria-pressed',String(!muted));
  if(muted){stopMusic();speak();toneContext?.suspend().catch(()=>{});}
  else if(game.phase==='play')speak('q'+game.code.length);
  if(!muted)startMusic();
  if(!muted&&game.phase==='home')speak('intro');
  else if(!muted&&game.phase==='ready')speak('ready');
  else if(!muted&&game.phase==='win')speak('win');
};
$('#full').onclick=async()=>{
  try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}
  catch{$('#full').textContent='Không thể toàn màn hình'}
};
document.addEventListener('fullscreenchange',()=>{$('#full').textContent=document.fullscreenElement?'Thoát toàn màn hình':'Toàn màn hình'});
show();