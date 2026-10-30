import {feedback} from '../feedback.js';
import {scope,colors,colorNames,decorations,freshNails,nailSVG,announce,finish} from './ui.js';
import {designScore,mixColor,colorAccuracy} from './logic.js';

export function design(root,{copy=false}={}){
  const life=scope(root);let nails=freshNails(),selected=0,target=freshNails().map(()=>({color:Math.floor(Math.random()*colors.length),decor:Math.floor(Math.random()*4)})),phase=copy?'ready':'paint';
  root.innerHTML=`<div class="design-stage"></div><div class="nail-picker" aria-label="Choose a finger"></div><div class="paint-controls"><h3>Polish color</h3><div class="swatches"></div><h3>Decorations</h3><div class="decor-picker"></div></div><div class="arc-actions"></div><p class="arc-feedback" role="status" aria-live="polite"></p>`;
  const stage=root.querySelector('.design-stage'),actions=root.querySelector('.arc-actions');
  const paint=()=>{stage.innerHTML=nailSVG(phase==='view'?target:nails);root.querySelectorAll('[data-nail]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.nail)===selected)));};
  root.querySelector('.nail-picker').innerHTML=Array.from({length:5},(_,i)=>`<button data-nail="${i}" class="arc-button" aria-label="Finger ${i+1}">${i+1}</button>`).join('');
  root.querySelector('.swatches').innerHTML=colors.map((color,i)=>`<button data-color="${i}" class="swatch" style="--swatch:${color}" aria-label="Paint ${colorNames[i]}"></button>`).join('');
  root.querySelector('.decor-picker').innerHTML=decorations.map((d,i)=>`<button class="arc-button" data-decor="${i}" aria-label="${i?'Decoration '+i:'No decoration'}">${d||'Plain'}</button>`).join('');
  const editable=()=>phase==='paint';
  life.on(root,'click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.dataset.nail!==undefined){selected=Number(b.dataset.nail);paint();}
    if(!editable())return;
    if(b.dataset.color!==undefined){feedback('pick',stage);nails[selected].color=Number(b.dataset.color);paint();announce(root,`Finger ${selected+1}: ${colorNames[nails[selected].color]}.`);}
    if(b.dataset.decor!==undefined){nails[selected].decor=Number(b.dataset.decor);paint();}
  });
  const controls=enabled=>root.querySelectorAll('.paint-controls button').forEach(b=>b.disabled=!enabled);
  if(copy){
    actions.innerHTML='<button class="arc-button accent" data-action="memorize">Study design for 8 seconds</button>';
    controls(false);announce(root,'Remember the colors and decorations, then recreate all 5 nails.');
    life.on(actions,'click',e=>{
      if(e.target.dataset.action==='memorize'&&phase==='ready'){
        phase='view';paint();actions.innerHTML='<strong class="countdown">Remember the look… 8</strong>';let elapsed=0,last=8;
        life.loop(dt=>{if(phase!=='view')return;elapsed+=dt;const left=Math.max(0,Math.ceil(8-elapsed));if(left!==last){last=left;actions.querySelector('.countdown').textContent=`Remember the look… ${left}`;}if(elapsed>=8){phase='paint';controls(true);paint();actions.innerHTML='<button class="arc-button accent" data-action="submit">Check my design</button>';announce(root,'Design hidden. Choose each finger, then add its color and decoration.');}});
      }
      if(e.target.dataset.action==='submit'&&phase==='paint'){
        phase='done';controls(false);const score=designScore(nails,target);actions.innerHTML='';
        const preview=document.createElement('div');preview.className='target-preview';preview.innerHTML='<h3>Original design</h3>'+nailSVG(target);root.append(preview);
        finish(root,`${score}% correct`,score===100?'You remembered the entire manicure!':'Compare your work with the original, then try again.');
      }
    });
  }else{
    actions.innerHTML='<button class="arc-button accent" data-action="save">Save manicure SVG</button><button class="arc-button" data-action="clear">Clear design</button>';
    life.on(actions,'click',e=>{
      if(e.target.dataset.action==='clear'){nails=freshNails();paint();}
      if(e.target.dataset.action==='save'){
        const url=URL.createObjectURL(new Blob([nailSVG(nails)],{type:'image/svg+xml'}));
        const link=document.createElement('a');link.href=url;link.download='nailplay-manicure.svg';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);announce(root,'Your manicure SVG is ready to download.');
      }
    });
    announce(root,'Choose a finger, tap a polish color, and add a decoration.');
  }
  paint();return ()=>life.dispose();
}

export function mixing(root){
  const life=scope(root);const targetWeights=[1+Math.floor(Math.random()*9),1+Math.floor(Math.random()*9),1+Math.floor(Math.random()*9)],target=mixColor(targetWeights);let submitted=false;
  root.innerHTML=`<div class="mix-bottles"><div><div class="color-bottle target-color"></div><h3>Target shade</h3></div><div><div class="color-bottle mixed-color"></div><h3>Your shade</h3></div></div><div class="mix-sliders">${['Pink','Blue','Yellow'].map((name,i)=>`<label>${name}<input type="range" min="0" max="10" value="0" data-pigment="${i}" aria-label="${name} pigment amount"><output>0</output></label>`).join('')}</div><button class="arc-button accent" id="mix-submit">Compare colors</button><p class="arc-feedback" role="status">Move the sliders to mix your polish.</p>`;
  root.querySelector('.target-color').style.background=`rgb(${target})`;
  const weights=()=>[...root.querySelectorAll('input')].map(i=>Number(i.value));
  const update=()=>{root.querySelector('.mixed-color').style.background=`rgb(${mixColor(weights())})`;root.querySelectorAll('label').forEach(label=>label.querySelector('output').textContent=label.querySelector('input').value);};
  life.on(root,'input',()=>{if(!submitted)update();});
  life.on(root.querySelector('#mix-submit'),'click',()=>{
    if(submitted)return;
    if(!weights().some(Boolean)){announce(root,'Add at least one pigment first.');return;}
    submitted=true;root.querySelectorAll('input,button').forEach(b=>b.disabled=true);const score=colorAccuracy(mixColor(weights()),target);
    finish(root,`${score}% match`,score>=95?'A beautifully matched shade!':'Try again with a different pigment ratio.');
  });update();return ()=>life.dispose();
}
