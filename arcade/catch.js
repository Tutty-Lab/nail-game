import {feedback} from '../feedback.js';
import {scope,art,finish} from './ui.js';

export function catching(root){
  const life=scope(root);let running=false,done=false,time=45,score=0,lives=3,x=50,spawn=0,items=[],keys=new Set(),nextId=0;
  root.innerHTML='<div class="arc-stats"><span>Score <strong id="catch-score">0</strong></span><span>Seconds <strong id="catch-time">45</strong></span><span>Lives <strong id="catch-lives">3</strong></span></div><div class="catch-field" tabindex="0" aria-label="Polish catch area. Drag the basket or use the left and right arrow keys."><div class="catch-start"><button class="arc-button accent" id="catch-start">Start</button></div><div class="catch-basket">nailplay</div></div><div class="catch-controls"><button class="arc-button" data-direction="-1" aria-label="Move left">←</button><span>Drag to catch polish · Avoid broken bottles</span><button class="arc-button" data-direction="1" aria-label="Move right">→</button></div>';
  const field=root.querySelector('.catch-field'),basket=root.querySelector('.catch-basket');
  const place=()=>basket.style.left=`${x}%`;
  life.on(root.querySelector('#catch-start'),'click',()=>{running=true;root.querySelector('.catch-start').remove();field.focus();});
  let dragging=false;
  const move=e=>{if(!running)return;const rect=field.getBoundingClientRect();x=Math.max(9,Math.min(91,(e.clientX-rect.left)/rect.width*100));place();};
  life.on(field,'pointerdown',e=>{if(e.target.closest('button'))return;dragging=true;field.setPointerCapture(e.pointerId);move(e);});
  life.on(field,'pointermove',e=>{if(dragging)move(e);});life.on(field,'pointerup',()=>dragging=false);life.on(field,'pointercancel',()=>dragging=false);
  life.on(field,'keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();keys.add(e.key);}});
  life.on(field,'keyup',e=>keys.delete(e.key));life.on(window,'blur',()=>keys.clear());
  root.querySelectorAll('[data-direction]').forEach(b=>life.on(b,'click',()=>{if(running){x=Math.max(9,Math.min(91,x+Number(b.dataset.direction)*12));place();}}));
  const update=()=>{root.querySelector('#catch-score').textContent=score;root.querySelector('#catch-time').textContent=Math.ceil(time);root.querySelector('#catch-lives').textContent=lives;};
  life.loop(dt=>{
    if(!running||done||!dt)return;
    time=Math.max(0,time-dt);spawn-=dt;
    if(keys.has('ArrowLeft'))x=Math.max(9,x-dt*90);if(keys.has('ArrowRight'))x=Math.min(91,x+dt*90);place();
    if(spawn<=0){spawn=Math.max(.35,.85-score/1200);const bad=Math.random()<.2;const node=document.createElement('div');node.className=`falling-item ${bad?'broken':''}`;node.innerHTML=bad?'<span class="broken-mark">×</span>'+art(0):art(0);field.append(node);items.push({id:nextId++,x:8+Math.random()*84,y:-12,bad,node});}
    items=items.filter(item=>{const previous=item.y;item.y+=dt*(24+score/35);item.node.style.left=`${item.x}%`;item.node.style.top=`${item.y}%`;const caught=previous<=83&&item.y>=83&&Math.abs(item.x-x)<13;
      if(caught){if(item.bad){lives--;feedback('error',basket);}else{score+=10;feedback('match',basket);}item.node.remove();return false;}
      if(item.y>100){if(!item.bad)lives--;item.node.remove();return false;}return true;});
    lives=Math.max(0,lives);update();if(time<=0||lives<=0){done=true;running=false;finish(root,lives?'Great catching!':'Out of lives',`You scored ${score} points in ${Math.ceil(45-time)} seconds.`,lives?'success':'lose');}
  });place();return ()=>life.dispose();
}
