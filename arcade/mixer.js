import {feedback} from '../feedback.js';
import {scope,announce,leveled} from './ui.js';
import {fly,bounce,shake,floatText} from '../motion.js';
import {MIXER_LEVELS,mixerLevel,pigments,mix,hex,accuracy,mixerStars} from './creative.js';
export const mixing=root=>leveled(root,{id:'mixer',total:MIXER_LEVELS,play});
const nail=(colors,label)=>`<div class="mix-nail" role="img" aria-label="${label}" style="--bands:${colors.length===1?colors[0]:`linear-gradient(180deg,${colors.map((c,i)=>`${c} ${i/colors.length*100}%,${c} ${(i+1)/colors.length*100}%`).join(',')})`};--smooth:${colors.length===1?colors[0]:`linear-gradient(180deg,${colors.join(',')})`}"><i></i></div>`;
function play(root,level,{win,lose}){
  const life=scope(root),config=mixerLevel(level),targets=config.targets.map(hex),guide=level<=6;
  let bands=Array.from({length:config.bands},()=>Array(config.available).fill(0)),history=[],selected=0,used=0,done=false;
  root.innerHTML=`<div class="arc-stats"><span>Drops <strong id="mix-used">0 / ${config.limit}</strong></span><span>Bands <strong>${config.bands}</strong></span><span>Pigments <strong>${config.available}</strong></span></div>
  <div class="mix-stage"><figure><figcaption>Target</figcaption>${nail(targets,'Target gradient')}</figure><figure><figcaption>Yours</figcaption><div id="mix-yours"></div></figure></div>
  <div class="mix-bands" role="group" aria-label="Choose a band"></div>
  <div class="mix-pigments">${pigments.slice(0,config.available).map(([name,color],i)=>`<button class="pigment" data-pigment="${i}" style="--pigment:${color}" aria-label="Add a drop of ${name}"><i></i><span>${name}</span></button>`).join('')}</div>
  <div class="arc-actions"><button class="arc-button" data-act="undo">↶ Undo drop</button><button class="arc-button" data-act="empty">Empty band</button><button class="arc-button accent" data-act="check">Compare ✓</button></div>
  <p class="arc-feedback" role="status">Pick a band, then tap pigments to drip them in. Match every band of the target ombre.</p>`;
  const yours=root.querySelector('#mix-yours'),bandRow=root.querySelector('.mix-bands');
  const colorOf=i=>hex(mix(bands[i]));
  const render=()=>{
    yours.innerHTML=nail(bands.map((_,i)=>colorOf(i)),'Your gradient');
    bandRow.innerHTML=bands.map((drops,i)=>{const score=accuracy(mix(drops),config.targets[i]);return `<button class="mix-band ${i===selected?'selected':''}" data-band="${i}" aria-pressed="${i===selected}" aria-label="Band ${i+1}${guide?`, ${score}% match`:''}"><span style="--a:${targets[i]};--b:${colorOf(i)}"></span><small>${drops.reduce((a,b)=>a+b,0)} drops${guide?` · ${score}%`:''}</small></button>`;}).join('');
    root.querySelector('#mix-used').textContent=`${used} / ${config.limit}`;
    root.querySelectorAll('[data-pigment]').forEach(b=>b.disabled=done||used>=config.limit);
  };
  life.on(bandRow,'click',e=>{const b=e.target.closest('[data-band]');if(!b||done)return;selected=Number(b.dataset.band);feedback('pick');render();});
  life.on(root.querySelector('.mix-pigments'),'click',async e=>{
    const b=e.target.closest('[data-pigment]');if(!b||done||used>=config.limit)return;const p=Number(b.dataset.pigment);
    history.push(bands.map(d=>[...d]));bands[selected][p]++;used++;feedback('tap');
    await fly(b.querySelector('i'),bandRow.children[selected].querySelector('span'),{html:`<b style="background:${pigments[p][1]}"></b>`,className:'drop-flyer',duration:300,lift:60});
    if(!root.isConnected)return;render();bounce(bandRow.children[selected].querySelector('span'),1.18);
    if(used>=config.limit)announce(root,'Out of drops. Compare now, or undo to adjust.');
  });
  life.on(root.querySelector('.arc-actions'),'click',e=>{
    const act=e.target.closest('[data-act]')?.dataset.act;if(!act||done)return;
    if(act==='undo'){if(!history.length)return;bands=history.pop();used=bands.flat().reduce((a,b)=>a+b,0);render();}
    if(act==='empty'){history.push(bands.map(d=>[...d]));bands[selected]=bands[selected].map(()=>0);used=bands.flat().reduce((a,b)=>a+b,0);render();}
    if(act==='check'){
      if(bands.some(d=>!d.some(Boolean))){shake(bandRow);announce(root,'Every band needs at least one drop.');return;}
      const scores=bands.map((d,i)=>accuracy(mix(d),config.targets[i])),score=Math.round(scores.reduce((a,b)=>a+b,0)/scores.length),stars=mixerStars(score);
      done=true;render();floatText(yours,`${score}%`,stars?'#d83071':'#7d4fbf');
      root.querySelector('.mix-stage').classList.add('revealed');
      if(stars)win(stars,'Shade perfect!',`Level ${level}: ${score}% match (${scores.map(s=>s+'%').join(' · ')}).`);
      else lose('Not quite the shade',`${score}% match. You need 85% or more. Band scores: ${scores.map(s=>s+'%').join(' · ')}.`);
    }
  });
  render();return ()=>life.dispose();
}
