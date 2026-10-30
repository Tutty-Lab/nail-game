import {feedback} from '../feedback.js';
import {scope,art,freshNails,nailSVG,announce,finish} from './ui.js';
import {shuffled} from './logic.js';

export function puzzle(root){
  const life=scope(root);let pieces=shuffled(Array.from({length:9},(_,i)=>i)),selected=null,moves=0,done=false;
  if(pieces.every((p,i)=>p===i))[pieces[0],pieces[1]]=[pieces[1],pieces[0]];
  const image=`url("data:image/svg+xml,${encodeURIComponent(nailSVG(freshNails().map((n,i)=>({color:i,decor:i%4}))))}")`;
  root.innerHTML='<div class="arc-stats"><span>Swaps <strong id="puzzle-moves">0</strong></span><button class="arc-button" id="puzzle-preview" aria-pressed="false">Preview</button></div><div class="puzzle-preview" hidden></div><div class="puzzle-grid"></div><p class="arc-feedback" role="status">Tap two pieces to swap them. The small numbers show their correct positions.</p>';
  const grid=root.querySelector('.puzzle-grid');root.querySelector('.puzzle-preview').innerHTML=nailSVG(freshNails().map((n,i)=>({color:i,decor:i%4})));
  const render=()=>{grid.innerHTML=pieces.map((piece,i)=>`<button class="puzzle-piece ${selected===i?'selected':''}" data-piece="${i}" aria-label="Piece ${piece+1}, position ${i+1}" ${done?'disabled':''}><span>${piece+1}</span></button>`).join('');grid.querySelectorAll('button').forEach((b,i)=>{const piece=pieces[i];b.style.backgroundImage=image;b.style.backgroundPosition=`${piece%3*50}% ${Math.floor(piece/3)*50}%`;});root.querySelector('#puzzle-moves').textContent=moves;};
  life.on(root.querySelector('#puzzle-preview'),'click',e=>{const preview=root.querySelector('.puzzle-preview');preview.hidden=!preview.hidden;e.target.setAttribute('aria-pressed',String(!preview.hidden));});
  life.on(grid,'click',e=>{const b=e.target.closest('[data-piece]');if(!b||done)return;const i=Number(b.dataset.piece);if(selected===null){selected=i;render();return;}if(selected===i){selected=null;render();return;}[pieces[i],pieces[selected]]=[pieces[selected],pieces[i]];selected=null;moves++;done=pieces.every((p,i)=>p===i);render();if(done)finish(root,'Picture perfect!',`You assembled all 9 pieces in ${moves} swaps.`);});
  render();return ()=>life.dispose();
}

export function differences(root){
  const life=scope(root),left=Array.from({length:12},()=>Math.floor(Math.random()*8)),changed=new Set(shuffled(Array.from({length:12},(_,i)=>i)).slice(0,3)),found=new Set();let mistakes=0,done=false;
  const right=left.map((type,i)=>changed.has(i)?(type+1+Math.floor(Math.random()*7))%8:type);
  root.innerHTML=`<div class="arc-stats"><span>Found <strong id="diff-found">0 / 3</strong></span><span>Mistakes <strong id="diff-lives">0 / 5</strong></span></div><div class="difference-panels"><section><h3>Original</h3><div class="difference-grid reference">${left.map(type=>`<div class="difference-cell">${art(type)}</div>`).join('')}</div></section><section><h3>Find the differences</h3><div class="difference-grid choices">${right.map((type,i)=>`<button data-spot="${i}" class="difference-cell" aria-label="Check position ${i+1}">${art(type)}</button>`).join('')}</div></section></div><p class="arc-feedback" role="status">Compare the boards. Tap the 3 different pictures on the right.</p>`;
  life.on(root.querySelector('.choices'),'click',e=>{const b=e.target.closest('[data-spot]');if(!b||done)return;const i=Number(b.dataset.spot);if(found.has(i))return;if(changed.has(i)){feedback('match',b);found.add(i);b.classList.add('found');b.disabled=true;b.setAttribute('aria-label',`Difference ${i+1} found`);root.querySelector('#diff-found').textContent=`${found.size} / 3`;}else{feedback('error',b);mistakes++;b.classList.add('wrong');life.later(()=>b.classList.remove('wrong'),400);root.querySelector('#diff-lives').textContent=`${mistakes} / 5`;announce(root,'These pictures match. Look for another difference.');}if(found.size===3||mistakes===5){done=true;root.querySelectorAll('[data-spot]').forEach(b=>b.disabled=true);finish(root,found.size===3?'Sharp eyes!':'No guesses left',`You found ${found.size} / 3 differences with ${mistakes} mistakes.`,found.size===3?'success':'lose');}});
  return ()=>life.dispose();
}
