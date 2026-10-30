import {feedback} from '../feedback.js';
import {scope,art,announce,finish} from './ui.js';
import {shuffled} from './logic.js';
export function memory(root){
  const life=scope(root),cards=shuffled(Array.from({length:8},(_,type)=>[type,type]).flat());
  let opened=[],matched=new Set(),busy=false,moves=0;
  root.innerHTML='<div class="arc-stats"><span>Moves <strong id="memory-moves">0</strong></span><span>Pairs <strong id="memory-pairs">0 / 8</strong></span></div><div class="memory-grid"></div><p class="arc-feedback" role="status">Flip two cards to find a matching pair.</p>';
  const grid=root.querySelector('.memory-grid');
  grid.innerHTML=cards.map((type,i)=>`<button class="memory-card" data-card="${i}" aria-label="Face-down card ${i+1}"><span class="card-back">✿</span><span class="card-face">${art(type)}</span></button>`).join('');
  const render=()=>grid.querySelectorAll('button').forEach((b,i)=>{b.classList.toggle('flipped',opened.includes(i)||matched.has(i));b.disabled=matched.has(i)||opened.includes(i);b.setAttribute('aria-label',matched.has(i)?`Matched pair ${cards[i]+1}`:opened.includes(i)?`Picture ${cards[i]+1}`:`Face-down card ${i+1}`);});
  life.on(grid,'click',e=>{
    const b=e.target.closest('[data-card]');if(!b||busy)return;const i=Number(b.dataset.card);if(matched.has(i)||opened.includes(i))return;
    opened.push(i);render();if(opened.length<2)return;moves++;root.querySelector('#memory-moves').textContent=moves;
    if(cards[opened[0]]===cards[opened[1]]){
      feedback('match',grid);opened.forEach(i=>matched.add(i));opened=[];render();root.querySelector('#memory-pairs').textContent=`${matched.size/2} / 8`;
      if(matched.size===cards.length)finish(root,'All 8 pairs found!',`Completed in ${moves} moves.`);
    }else{feedback('error',grid);busy=true;announce(root,'Not a pair. Remember where these pictures are.');life.later(()=>{opened=[];busy=false;render();},800);}
  });return ()=>life.dispose();
}
