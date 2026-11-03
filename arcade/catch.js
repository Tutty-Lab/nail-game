import {feedback} from '../feedback.js';
import {scope,art,artSets,leveled} from './ui.js';
import {floatText,bounce,shake} from '../motion.js';
export const CATCH_LEVELS=20;
export const catchConfig=level=>({target:120+level*40,time:40,speed:22+level*2.2,bad:Math.min(.38,.14+level*.012),gap:Math.max(.3,.8-level*.022),set:artSets[Math.floor((level-1)/4)%artSets.length]});
export const catching=root=>leveled(root,{id:'catch',total:CATCH_LEVELS,play});
function play(root,level,{win,lose}){
  const life=scope(root),config=catchConfig(level);
  let running=false,done=false,time=config.time,score=0,lives=3,x=50,spawn=0,items=[],keys=new Set(),combo=0;
  root.innerHTML=`<div class="arc-stats"><span>Score <strong id="catch-score">0 / ${config.target}</strong></span><span>Seconds <strong id="catch-time">${config.time}</strong></span><span>Lives <strong id="catch-lives">♥♥♥</strong></span></div><div class="catch-field" tabindex="0" aria-label="Polish catch area. Drag the basket or use the left and right arrow keys."><div class="catch-start"><button class="arc-button accent" id="catch-start">Start level ${level}</button><small>Gold stars = +50 · Hearts = +1 life · Avoid ×</small></div><div class="catch-basket">nailplay</div></div><div class="catch-controls"><button class="arc-button" data-direction="-1" aria-label="Move left">←</button><span>Drag to catch · Combos score more</span><button class="arc-button" data-direction="1" aria-label="Move right">→</button></div>`;
  const field=root.querySelector('.catch-field'),basket=root.querySelector('.catch-basket');
  const place=()=>basket.style.left=`${x}%`;
  life.on(root.querySelector('#catch-start'),'click',()=>{running=true;root.querySelector('.catch-start').remove();field.focus();});
  let dragging=false;
  const steer=e=>{if(!running)return;const rect=field.getBoundingClientRect();x=Math.max(9,Math.min(91,(e.clientX-rect.left)/rect.width*100));place();};
  life.on(field,'pointerdown',e=>{if(e.target.closest('button'))return;dragging=true;field.setPointerCapture(e.pointerId);steer(e);});
  life.on(field,'pointermove',e=>{if(dragging)steer(e);});life.on(field,'pointerup',()=>dragging=false);life.on(field,'pointercancel',()=>dragging=false);
  life.on(field,'keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();keys.add(e.key);}});
  life.on(field,'keyup',e=>keys.delete(e.key));life.on(window,'blur',()=>keys.clear());
  root.querySelectorAll('[data-direction]').forEach(b=>life.on(b,'click',()=>{if(running){x=Math.max(9,Math.min(91,x+Number(b.dataset.direction)*12));place();}}));
  const update=()=>{root.querySelector('#catch-score').textContent=`${score} / ${config.target}`;root.querySelector('#catch-time').textContent=Math.ceil(time);root.querySelector('#catch-lives').textContent='♥'.repeat(lives)||'–';};
  life.loop(dt=>{
    if(!running||done||!dt)return;
    time=Math.max(0,time-dt);spawn-=dt;
    if(keys.has('ArrowLeft'))x=Math.max(9,x-dt*90);if(keys.has('ArrowRight'))x=Math.min(91,x+dt*90);place();
    if(spawn<=0){
      spawn=config.gap*(.7+Math.random()*.6);const roll=Math.random();
      const kind=roll<config.bad?'bad':roll<config.bad+.05?'star':roll<config.bad+.07&&lives<3?'heart':'good';
      const node=document.createElement('div');node.className=`falling-item ${kind}`;
      node.innerHTML=kind==='bad'?'<span class="broken-mark">×</span>'+art(0):kind==='star'?art(5):kind==='heart'?art(20):art(config.set[Math.floor(Math.random()*8)]);
      field.append(node);items.push({x:8+Math.random()*84,y:-12,kind,node,drift:(Math.random()-.5)*(level>10?14:0)});
    }
    items=items.filter(item=>{
      const previous=item.y;item.y+=dt*config.speed*(item.kind==='star'?1.35:1);item.x=Math.max(6,Math.min(94,item.x+item.drift*dt));
      item.node.style.left=`${item.x}%`;item.node.style.top=`${item.y}%`;
      const caught=previous<=83&&item.y>=83&&Math.abs(item.x-x)<13;
      if(caught){
        if(item.kind==='bad'){lives--;combo=0;feedback('error',basket);shake(field);floatText(basket,'-1 ♥','#7d4fbf');}
        else if(item.kind==='heart'){lives=Math.min(3,lives+1);feedback('match',basket);floatText(basket,'+1 ♥');}
        else{combo++;const gained=item.kind==='star'?50:10+Math.min(20,combo*2);score+=gained;feedback(item.kind==='star'?'success':'match',basket);floatText(basket,combo>=5?`+${gained} ×${combo}`:`+${gained}`,item.kind==='star'?'#e3a02f':'#d83071');}
        bounce(basket,1.15);
        item.node.remove();return false;
      }
      if(item.y>100){if(item.kind==='good'){lives--;combo=0;}item.node.remove();return false;}
      return true;
    });
    lives=Math.max(0,lives);update();
    if(score>=config.target){done=true;running=false;win(lives===3?3:lives===2?2:1,'Great catching!',`Level ${level}: ${score} points with ${Math.ceil(time)} seconds left.`);}
    else if(time<=0||lives<=0){done=true;running=false;lose(lives?'Time is up':'Out of lives',`You scored ${score} of ${config.target} points.`);}
  });place();return ()=>life.dispose();
}
