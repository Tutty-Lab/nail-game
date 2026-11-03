import {feedback} from '../feedback.js';
import {scope,art,artSets,announce,leveled} from './ui.js';
import {calm,floatText,shake} from '../motion.js';
import {makeMatchBoard,findMatches,collapse,swap,adjacent,legalMoves} from './logic.js';
export const POP_LEVELS=30;
export function popConfig(level){
  const kinds=level<=6?5:6;
  const collect=level%2===0?{type:level%kinds,count:6+Math.floor(level/3)}:null;
  return {kinds,moves:18+(level%3)*2+(collect?4:0),target:450+level*25,collect,set:artSets[Math.floor((level-1)/5)%artSets.length]};
}
export const match3=root=>leveled(root,{id:'pop',total:POP_LEVELS,play});
function play(root,level,{win,lose}){
  const life=scope(root),config=popConfig(level),{kinds,set,target,collect}=config;
  let board=makeMatchBoard(Math.random,6,kinds),selected=null,score=0,moves=config.moves,collected=0,busy=false,done=false;
  root.innerHTML=`<div class="arc-stats"><span>Score <strong id="m3-score"></strong></span><span>Moves <strong id="m3-moves"></strong></span>${collect?`<span class="collect-goal">Collect <strong><i>${art(set[collect.type])}</i><em id="m3-collect"></em></strong></span>`:''}</div><div class="goal-bar"><i id="m3-progress"></i></div><div class="match-grid"></div><p class="arc-feedback" role="status">Swap neighboring tiles to match 3 or more.</p>`;
  const grid=root.querySelector('.match-grid');
  const goalMet=()=>score>=target&&(!collect||collected>=collect.count);
  const render=()=>{
    grid.innerHTML=board.map((type,i)=>`<button class="match-cell ${selected===i?'selected':''}" data-cell="${i}" aria-label="Picture ${type+1}, row ${Math.floor(i/6)+1}, column ${i%6+1}" ${done?'disabled':''}>${art(set[type])}</button>`).join('');
    root.querySelector('#m3-score').textContent=`${score} / ${target}`;root.querySelector('#m3-moves').textContent=moves;
    if(collect)root.querySelector('#m3-collect').textContent=`${Math.min(collected,collect.count)} / ${collect.count}`;
    root.querySelector('#m3-progress').style.width=`${Math.min(100,score/target*100)}%`;
  };
  const settle=(chain=0)=>{
    const matches=findMatches(board);
    if(matches.length&&chain<30){
      feedback(chain?'success':'match',grid);
      if(!calm())matches.forEach(i=>grid.children[i].animate([{transform:'scale(1)',opacity:1},{transform:'scale(1.25) rotate(8deg)',opacity:1,offset:.35},{transform:'scale(0)',opacity:0}],{duration:240,fill:'forwards'}));
      if(collect)collected+=matches.filter(i=>board[i]===collect.type).length;
      const gained=matches.length*10*(chain+1);score+=gained;
      floatText(grid.children[matches[Math.floor(matches.length/2)]],chain?`Combo ×${chain+1}  +${gained}`:`+${gained}`,chain?'#9868c9':'#d83071');
      life.later(()=>{board=collapse(board,matches,Math.random,6,kinds);render();drop(matches);settle(chain+1);},250);return;
    }
    if(matches.length)board=makeMatchBoard(Math.random,6,kinds); // Bound cascades even under pathological RNG.
    busy=false;
    if(goalMet()){done=true;render();win(moves>=6?3:moves>=3?2:1,'Polish perfection!',`Level ${level}: ${score} points with ${moves} moves to spare.`);return;}
    if(moves===0){done=true;render();lose('Out of moves',`You scored ${score} of ${target}${collect?` and collected ${collected} of ${collect.count}`:''}.`);return;}
    if(!legalMoves(board).length){board=makeMatchBoard(Math.random,6,kinds);announce(root,'No moves left on the board. Free shuffle!');}
    render();
  };
  // Slide two cells into each other's place (and back again for a miss).
  const swapMotion=(a,b,back)=>{
    if(calm())return Promise.resolve();
    const A=grid.children[a],B=grid.children[b],ra=A.getBoundingClientRect(),rb=B.getBoundingClientRect(),dx=rb.left-ra.left,dy=rb.top-ra.top;
    const frames=t=>back?[{transform:'none'},{transform:t,offset:.5},{transform:'none'}]:[{transform:'none'},{transform:t}];
    A.style.zIndex=2;B.animate(frames(`translate(${-dx}px,${-dy}px)`),{duration:back?300:170,easing:'ease-in-out',fill:'forwards'});
    return A.animate(frames(`translate(${dx}px,${dy}px)`),{duration:back?300:170,easing:'ease-in-out',fill:'forwards'}).finished.catch(()=>{});
  };
  // New tiles fall into the gaps left in each column.
  const drop=matches=>{
    if(calm())return;const removed=Array(6).fill(0),lowest=Array(6).fill(-1);
    matches.forEach(i=>{removed[i%6]++;lowest[i%6]=Math.max(lowest[i%6],Math.floor(i/6));});
    const h=grid.children[0].getBoundingClientRect().height+6;
    [...grid.children].forEach((cell,i)=>{const c=i%6,r=Math.floor(i/6);if(removed[c]&&r<=lowest[c])cell.animate([{transform:`translateY(${-removed[c]*h}px)`,opacity:r<removed[c]?0:1},{transform:'none',opacity:1}],{duration:230+removed[c]*30,easing:'cubic-bezier(.4,1.4,.6,1)'});});
  };
  life.on(grid,'click',e=>{
    const b=e.target.closest('[data-cell]');if(!b||busy||done)return;const i=Number(b.dataset.cell);
    if(selected===null){selected=i;render();return;}
    if(selected===i){selected=null;render();return;}
    if(!adjacent(selected,i)){selected=i;render();return;}
    const next=swap(board,selected,i),from=selected;selected=null;busy=true;
    const valid=findMatches(next).length>0;
    swapMotion(from,i,!valid).then(()=>{
      if(!root.isConnected)return;
      if(!valid){busy=false;feedback('error',grid);render();shake(grid.children[from]);shake(grid.children[i]);announce(root,'That swap makes no match. No move used.');return;}
      board=next;moves--;render();settle();
    });
  });
  announce(root,collect?`Reach ${target} points and collect ${collect.count} of the marked item.`:`Reach ${target} points. Chain combos score double, triple and more.`);
  render();return ()=>life.dispose();
}
