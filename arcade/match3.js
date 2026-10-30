import {feedback} from '../feedback.js';
import {scope,art,announce,finish} from './ui.js';
import {makeMatchBoard,findMatches,collapse,swap,adjacent,legalMoves} from './logic.js';
export function match3(root){
  const life=scope(root);let board=makeMatchBoard(),selected=null,score=0,moves=20,busy=false,done=false;
  root.innerHTML='<div class="arc-stats"><span>Score <strong id="m3-score">0 / 600</strong></span><span>Moves <strong id="m3-moves">20</strong></span></div><div class="match-grid"></div><p class="arc-feedback" role="status">Swap neighboring tiles to match 3 or more.</p>';
  const grid=root.querySelector('.match-grid');
  const render=()=>{
    grid.innerHTML=board.map((type,i)=>`<button class="match-cell ${selected===i?'selected':''}" data-cell="${i}" aria-label="Picture ${type+1}, row ${Math.floor(i/6)+1}, column ${i%6+1}" ${done?'disabled':''}>${art(type)}</button>`).join('');
    root.querySelector('#m3-score').textContent=`${score} / 600`;root.querySelector('#m3-moves').textContent=moves;
  };
  const settle=(chain=0)=>{
    const matches=findMatches(board);
    if(matches.length&&chain<30){
      feedback('match',grid);matches.forEach(i=>grid.children[i].classList.add('clearing'));score+=matches.length*10;
      life.later(()=>{board=collapse(board,matches);render();settle(chain+1);},200);return;
    }
    if(matches.length)board=makeMatchBoard(); // Bound cascades even under pathological RNG.
    busy=false;
    if(score>=600||moves===0){done=true;render();finish(root,score>=600?'Polish perfection!':'Out of moves',`You scored ${score} points. The goal is 600 in 20 moves.`,score>=600?'success':'lose');return;}
    if(!legalMoves(board).length){board=makeMatchBoard();announce(root,'No moves left on the board. Free shuffle!');}
    render();
  };
  life.on(grid,'click',e=>{
    const b=e.target.closest('[data-cell]');if(!b||busy||done)return;const i=Number(b.dataset.cell);
    if(selected===null){selected=i;render();return;}
    if(selected===i){selected=null;render();return;}
    if(!adjacent(selected,i)){selected=i;render();return;}
    const next=swap(board,selected,i);selected=null;
    if(!findMatches(next).length){feedback('error',grid);render();announce(root,'That swap makes no match. No move used.');return;}
    board=next;moves--;busy=true;render();settle();
  });render();return ()=>life.dispose();
}
