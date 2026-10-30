// Original, soft 16-bar lounge loop. No external recording or download.
let context,timer,output,unlocked=false,enabled=true,nextTime=0,step=0;
const notes=new Set();
try{enabled=localStorage.getItem('nail-play-music')!=='off';}catch{}
const chords=[[60,64,67,71],[57,60,64,67],[53,57,60,64],[55,59,62,67]];
const melody=[76,null,79,null,83,79,76,null,74,null,76,null,79,null,76,null,72,null,76,null,79,76,72,null,71,null,74,null,79,null,74,null];
function note(midi,at,duration,volume,type='sine'){
  const oscillator=context.createOscillator(),gain=context.createGain();
  oscillator.type=type;oscillator.frequency.value=440*2**((midi-69)/12);
  gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(volume,at+.03);
  gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
  oscillator.connect(gain);gain.connect(output);notes.add(oscillator);
  oscillator.onended=()=>{notes.delete(oscillator);oscillator.disconnect();gain.disconnect();};
  oscillator.start(at);oscillator.stop(at+duration+.02);
}
function schedule(){
  if(!enabled||document.hidden||context?.state!=='running')return;
  if(nextTime<context.currentTime)nextTime=context.currentTime+.05;
  while(nextTime<context.currentTime+.18){
    const chord=chords[Math.floor(step/16)%4];
    if(step%8===0){chord.forEach((n,i)=>note(n,nextTime+i*.025,2.1,.014));note(chord[0]-24,nextTime,1.4,.025);}
    const n=melody[step%melody.length];if(n!==null)note(n,nextTime,.7,.022);
    if(step%4===2)note(chord[2]+12,nextTime,.25,.009);
    nextTime+=60/78/2;step=(step+1)%128;
  }
}
function stop(){
  clearInterval(timer);timer=null;
  notes.forEach(n=>{try{n.stop();}catch{}});notes.clear();
}
async function start(){
  if(!enabled||!unlocked||document.hidden)return;
  try{
    context??=new (window.AudioContext||window.webkitAudioContext)();
    if(!output){output=context.createGain();output.gain.value=.65;output.connect(context.destination);}
    await context.resume();
    if(!enabled||document.hidden||timer)return;
    nextTime=context.currentTime+.08;schedule();timer=setInterval(schedule,100);
  }catch{}
}
export function installMusic(){
  const button=document.getElementById('music-toggle');
  const update=()=>{button.textContent=enabled?'Music on':'Music off';button.setAttribute('aria-pressed',String(enabled));button.setAttribute('aria-label',enabled?'Mute background music':'Enable background music');};
  button.addEventListener('click',()=>{
    unlocked=true;enabled=!enabled;
    try{localStorage.setItem('nail-play-music',enabled?'on':'off');}catch{}
    if(enabled)start();else stop();update();
  });
  const unlock=()=>{unlocked=true;start();};
  document.addEventListener('pointerdown',unlock,{once:true});
  document.addEventListener('keydown',unlock,{once:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();context?.suspend().catch(()=>{});}else start();});
  window.addEventListener('pagehide',()=>{stop();context?.suspend().catch(()=>{});});
  window.addEventListener('pageshow',()=>start());update();
}
