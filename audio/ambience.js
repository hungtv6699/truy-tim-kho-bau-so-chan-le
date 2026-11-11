// A quiet, locally synthesized music bed. No network or recorded music.
let musicContext, musicBus, musicTimer, beat=0;
const melody=[60,64,67,71,69,67,64,62,57,60,64,67,65,64,62,55];
function startMusic(){
  if(muted||musicTimer)return;
  try{
    musicContext??=new AudioContext();
    if(!musicBus){musicBus=musicContext.createGain();musicBus.gain.value=.024;musicBus.connect(musicContext.destination)}
    musicContext.resume().catch(()=>{});
    const pluck=()=>{
      const t=musicContext.currentTime, o=musicContext.createOscillator(), g=musicContext.createGain();
      o.frequency.value=440*2**((melody[beat++%melody.length]-69)/12);
      g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(.8,t+.065);g.gain.exponentialRampToValueAtTime(.001,t+.82);
      o.connect(g).connect(musicBus);o.start();o.stop(t+.85);
    };
    pluck();musicTimer=setInterval(pluck,920);
  }catch{}
}
function stopMusic(){clearInterval(musicTimer);musicTimer=null;musicContext?.suspend().catch(()=>{});}
