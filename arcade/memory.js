import {feedback} from '../feedback.js';
import {TYPE_COUNT} from '../art.js';
import {scope,art,announce,leveled} from './ui.js';
import {floatText,bounce,shake,stagger} from '../motion.js';
import {shuffled} from './logic.js';
export const MEMORY_LEVELS=20;
export function memoryConfig(level){
  const pairs=Math.min(12,3+Math.ceil(level/2));
  return {pairs,limit:level<4?null:Math.ceil(pairs*(2.9-level*.04)),peek:Math.max(0,3-level*.25),columns:pairs<=6?4:pairs<=10?5:6};
}
export const memory=root=>leveled(root,{id:'memory',total:MEMORY_LEVELS,play});
function play(root,level,{win,lose}){
  const life=scope(root),{pairs,limit,peek,columns}=memoryConfig(level);
  const picked=shuffled(Array.from({length:TYPE_COUNT},(_,t)=>t)).slice(0,pairs);
  const cards=shuffled(picked.flatMap(type=>[type,type]));
  let opened=[],matched=new Set(),busy=true,moves=0,done=false,streak=0;
  root.innerHTML=`<div class="arc-stats"><span>Moves <strong id="memory-moves">0${limit?` / ${limit}`:''}</strong></span><span>Pairs <strong id="memory-pairs">0 / ${pairs}</strong></span><span>Streak <strong id="memory-streak">0</strong></span></div><div class="memory-grid" style="--columns:${columns}"></div><p class="arc-feedback" role="status">${peek?'Peek! Remember where everything is…':'Flip two cards to find a matching pair.'}</p>`;
  const grid=root.querySelector('.memory-grid');
  grid.innerHTML=cards.map((type,i)=>`<button class="memory-card" data-card="${i}" aria-label="Face-down card ${i+1}"><span class="card-back">✿</span><span class="card-face">${art(type)}</span></button>`).join('');
  const render=(all=false)=>grid.querySelectorAll('button').forEach((b,i)=>{const up=all||opened.includes(i)||matched.has(i);b.classList.toggle('flipped',up);b.classList.toggle('matched',matched.has(i));b.disabled=done||matched.has(i);b.setAttribute('aria-label',matched.has(i)?'Matched pair':up?`Picture ${cards[i]+1}`:`Face-down card ${i+1}`);});
  const stats=()=>{root.querySelector('#memory-moves').textContent=`${moves}${limit?` / ${limit}`:''}`;root.querySelector('#memory-pairs').textContent=`${matched.size/2} / ${pairs}`;root.querySelector('#memory-streak').textContent=streak;};
  stagger(grid.children,[{transform:'scale(.4) rotate(-12deg)',opacity:0},{transform:'none',opacity:1}],{each:25});
  if(peek){render(true);life.later(()=>{busy=false;render();announce(root,'Now find the pairs!');},peek*1000);}else{busy=false;render();}
  life.on(grid,'click',e=>{
    const b=e.target.closest('[data-card]');if(!b||busy||done)return;const i=Number(b.dataset.card);if(matched.has(i)||opened.includes(i))return;
    opened.push(i);render();if(opened.length<2)return;moves++;
    if(cards[opened[0]]===cards[opened[1]]){
      streak++;feedback(streak>=3?'success':'match',b);const pair=[...opened];opened.forEach(i=>matched.add(i));opened=[];render();stats();pair.forEach(i=>bounce(grid.children[i].querySelector('.card-face'),1.2));floatText(b,streak>=2?`Streak ×${streak}`:'Pair!');
      if(streak>=2)announce(root,`${streak} in a row!`);
      if(matched.size===cards.length){done=true;render();win(moves<=pairs*1.6?3:moves<=pairs*2.2?2:1,'All pairs found!',`Level ${level} done in ${moves} moves.`);return;}
    }else{streak=0;feedback('error',b);busy=true;life.later(()=>opened.forEach(i=>shake(grid.children[i].querySelector('.card-face'))),320);stats();announce(root,'Not a pair. Remember where these pictures are.');life.later(()=>{opened=[];busy=false;render();},750);}
    if(limit&&moves>=limit&&matched.size<cards.length){done=true;life.later(()=>{render();lose('Out of moves',`You found ${matched.size/2} of ${pairs} pairs within ${limit} moves.`);},780);}
  });return ()=>life.dispose();
}
