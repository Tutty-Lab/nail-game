import {feedback} from '../feedback.js';
import {setTheme} from '../backdrop.js';
import {best,record} from '../progress.js';
import {scope,art,announce,finish,themeFor} from './ui.js';
import {calm,shake,floatText} from '../motion.js';
// Each merge upgrades the item one step along the salon collection.
export const tiers=[10,13,9,8,15,2,16,3,5,7,21,22,23];
const tierNames=['Mint drop','Sky drop','Lilac polish','Pink polish','Pearl polish','Aqua gem','Rose gem','Brush','Star','Flower','Butterfly','Bow','Crown'];
export function slideLine(line){
  const filled=line.map((v,i)=>[v,i]).filter(([v])=>v!==null),out=[],sources=[];let gained=0,merged=[];
  for(let i=0;i<filled.length;i++){
    const [value,at]=filled[i];
    if(value===filled[i+1]?.[0]){out.push(value+1);sources.push([at,filled[i+1][1]]);gained+=2**(value+2);merged.push(out.length-1);i++;}
    else{out.push(value);sources.push([at]);}
  }
  while(out.length<line.length)out.push(null);
  return {line:out,gained,merged,sources};
}
export function move(board,direction,size=4){
  const next=[...board];let gained=0,changed=false;const merged=[],from=new Map();
  for(let k=0;k<size;k++){
    const cells=Array.from({length:size},(_,i)=>direction==='left'?k*size+i:direction==='right'?k*size+size-1-i:direction==='up'?i*size+k:(size-1-i)*size+k);
    const result=slideLine(cells.map(c=>board[c]));
    cells.forEach((c,i)=>{if(next[c]!==result.line[i])changed=true;next[c]=result.line[i];});
    result.merged.forEach(i=>merged.push(cells[i]));result.sources.forEach((list,i)=>from.set(cells[i],list.map(j=>cells[j])));gained+=result.gained;
  }
  return {board:next,gained,changed,merged,from};
}
export const canMove=board=>['left','right','up','down'].some(d=>move(board,d).changed);
export function spawn(board,random=Math.random){
  const empty=board.map((v,i)=>v===null?i:-1).filter(i=>i>=0);if(!empty.length)return board;
  const next=[...board];next[empty[Math.floor(random()*empty.length)]]=random()<.9?0:1;return next;
}
export function merging(root){
  const life=scope(root);let board=spawn(spawn(Array(16).fill(null))),score=0,done=false,highest=0,newCell=-1;
  setTheme('pastel');
  root.innerHTML=`<div class="arc-stats"><span>Score <strong id="merge-score">0</strong></span><span>Best <strong id="merge-best">${best('merge')}</strong></span><span>Top item <strong id="merge-top"></strong></span></div><div class="merge-board" tabindex="0" aria-label="Merge board. Swipe or use arrow keys."></div><div class="merge-ladder" aria-label="Collection ladder">${tiers.map((t,i)=>`<span data-tier="${i}" title="${tierNames[i]}">${art(t)}</span>`).join('')}</div><p class="arc-feedback" role="status">Swipe or use arrow keys. Two matching items merge into the next one. Reach the crown!</p>`;
  const grid=root.querySelector('.merge-board');
  const render=(merged=[])=>{
    grid.innerHTML=board.map((v,i)=>`<div class="merge-cell">${v===null?'':`<span class="merge-item tier-${v} ${merged.includes(i)?'pop':''} ${i===newCell?'fresh':''}" aria-label="${tierNames[v]}">${art(tiers[Math.min(v,tiers.length-1)])}<b>${v+1}</b></span>`}</div>`).join('');
    root.querySelector('#merge-score').textContent=score;root.querySelector('#merge-top').textContent=highest+1;
    root.querySelectorAll('[data-tier]').forEach(n=>n.classList.toggle('reached',Number(n.dataset.tier)<=highest));
  };
  const go=direction=>{
    if(done)return;const result=move(board,direction);if(!result.changed){feedback('error');shake(grid);return;}
    const origin=[...grid.children].map(c=>c.getBoundingClientRect());
    score+=result.gained;const before=highest;board=result.board;highest=Math.max(...board.map(v=>v??0));
    const after=spawn(board);newCell=after.findIndex((v,i)=>v!==board[i]);board=after;
    feedback(result.merged.length?'match':'pick');
    if(highest>before){setTheme(themeFor(highest*2+1));announce(root,`New item unlocked: ${tierNames[highest]}!`);}
    if(record('merge',score))root.querySelector('#merge-best').textContent=score;
    render(result.merged);slide(result.from,origin);if(result.gained)floatText(grid.children[result.merged[0]],`+${result.gained}`);
    if(highest>=tiers.length-1){done=true;finish(root,'Crowned salon star!',`You built the full collection with ${score} points.`,'success',[['Play again',reset,'accent']]);}
    else if(!canMove(board)){done=true;finish(root,'Board full',`Final score ${score}. Highest item: ${tierNames[highest]}.`,'lose',[['Play again',reset,'accent']]);}
  };
  const reset=()=>{root.querySelector('.arc-result')?.remove();board=spawn(spawn(Array(16).fill(null)));score=0;done=false;highest=0;newCell=-1;setTheme('pastel');render();grid.focus({preventScroll:true});};
  // Every item glides from the cell it came from; merged pairs glide in together.
  const slide=(from,origin)=>{
    if(calm())return;
    from.forEach((sources,cell)=>{
      const item=grid.children[cell].firstElementChild,to=origin[cell];if(!item)return;
      sources.forEach((source,k)=>{
        const dx=origin[source].left-to.left,dy=origin[source].top-to.top;if(!dx&&!dy&&k===0)return;
        const target=k===0?item:item.cloneNode(true);
        if(k>0){target.classList.remove('pop');target.style.cssText='position:absolute;inset:0';grid.children[cell].style.position='relative';grid.children[cell].append(target);}
        target.animate([{transform:`translate(${dx}px,${dy}px)`},{transform:'none'}],{duration:130,easing:'ease-out'}).finished.then(()=>{if(k>0)target.remove();},()=>{});
      });
    });
  };
  life.on(grid,'keydown',e=>{const d={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'}[e.key];if(d){e.preventDefault();go(d);}});
  let start=null;
  life.on(grid,'pointerdown',e=>{start=[e.clientX,e.clientY];grid.setPointerCapture?.(e.pointerId);});
  life.on(grid,'pointerup',e=>{if(!start)return;const dx=e.clientX-start[0],dy=e.clientY-start[1];start=null;if(Math.max(Math.abs(dx),Math.abs(dy))<24)return;go(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'));});
  render();grid.focus({preventScroll:true});return ()=>life.dispose();
}
