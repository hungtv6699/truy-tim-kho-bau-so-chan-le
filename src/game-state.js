class Hunt {
  constructor(){this.reset()}
  reset(){this.phase='home';this.code=[]}
  begin(){if(this.phase==='home')this.phase='play'}
  get current(){return questions[this.code.length]}
  select(n){if(this.phase!=='play')return null;if(n!==this.current.a)return false;this.phase='unlock';return true}
  collect(){if(this.phase!=='unlock')return;this.code.push(this.current.a);this.phase=this.code.length===questions.length?'ready':'play'}
  open(){if(this.phase!=='ready'||this.code.length!==5)return false;this.phase='opening';return true}
  finish(){if(this.phase==='opening')this.phase='win'}
}