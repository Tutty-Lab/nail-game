let context,enabled=true;
const voices=new Set();
try{enabled=localStorage.getItem('nail-play-sound')!=='off';}catch{}
const melodies={tap:[560],pick:[660],match:[660,880,1100],success:[523,659,784,1047],error:[260,195],lose:[392,330,262],shuffle:[440,660,550]};
export function soundEnabled(){return enabled;}
export function setSoundEnabled(value){
  enabled=Boolean(value);
  try{localStorage.setItem('nail-play-sound',enabled?'on':'off');}catch{}
  if(!enabled){voices.forEach(voice=>{try{voice.stop();}catch{}});voices.clear();}
}
export function sound(kind='tap'){
  if(!enabled||document.hidden)return;
  try{
    context??=new (window.AudioContext||window.webkitAudioContext)();
    if(context.state==='suspended')context.resume().catch(()=>{});
    if(context.state!=='running'||voices.size>=12)return;
    const notes=melodies[kind]||melodies.tap;
    notes.forEach((frequency,i)=>{
      const voice=context.createOscillator(),gain=context.createGain(),start=context.currentTime+i*.065;
      voice.type=kind==='error'||kind==='lose'?'triangle':'sine';voice.frequency.value=frequency;
      gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(kind==='tap'?.025:.045,start+.008);gain.gain.exponentialRampToValueAtTime(.0001,start+.16);
      voice.connect(gain);gain.connect(context.destination);voices.add(voice);
      voice.onended=()=>{voices.delete(voice);voice.disconnect();gain.disconnect();};voice.start(start);voice.stop(start+.18);
    });
  }catch{}
}
export function feedback(kind='match',anchor){
  sound(kind);
  if(!anchor||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const node=document.createElement('span');node.className=`feedback-burst ${kind}`;node.setAttribute('aria-hidden','true');
  const rect=anchor.getBoundingClientRect();
  node.style.left=`${rect.left+rect.width/2}px`;node.style.top=`${rect.top+rect.height/2}px`;
  node.innerHTML=Array.from({length:kind==='success'?12:6},(_,i)=>`<i style="--angle:${i*(kind==='success'?30:60)}deg;--distance:${kind==='success'?100:40}px;--spark-color:${['#ea5e9c','#f2c15f','#6dc6b1'][i%3]}"></i>`).join('');
  document.body.append(node);setTimeout(()=>node.remove(),700);
}
export function installFeedback(){
  const toggle=document.getElementById('sound-toggle');
  const update=()=>{toggle.textContent=enabled?'Sound on':'Sound off';toggle.setAttribute('aria-pressed',String(enabled));toggle.setAttribute('aria-label',enabled?'Mute sound':'Enable sound');};
  toggle.addEventListener('click',()=>{setSoundEnabled(!enabled);update();if(enabled)sound('match');});
  document.addEventListener('click',event=>{
    const button=event.target.closest('button');
    if(!button||button===toggle||button.disabled||button.getAttribute('aria-disabled')==='true')return;
    sound('tap');
  },true);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){voices.forEach(voice=>{try{voice.stop();}catch{}});voices.clear();context?.suspend().catch(()=>{});}
    else if(enabled)context?.resume().catch(()=>{});
  });update();
}
