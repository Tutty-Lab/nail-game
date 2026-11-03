import {feedback} from '../feedback.js';
import {art,artSets} from '../art.js';
import {setTheme} from '../backdrop.js';
import {unlocked,stars,complete} from '../progress.js';
export {art,artSets};
export const colors=['#f26ba2','#9868c9','#53bbaa','#f5bf58','#ea8265','#69a7df','#a73561','#faf0df'];
export const colorNames=['Pink','Purple','Mint','Yellow','Peach','Blue','Berry','Cream'];
export const decorations=['','✦','♡','❀'];
export const freshNails=()=>Array.from({length:5},()=>({color:0,decor:0}));
export function nailSVG(nails){
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 340"><rect width="500" height="340" rx="32" fill="#ffedf4"/><path d="M60 300Q52 160 90 155Q125 150 128 240L138 110Q144 72 165 82L180 225 193 70Q199 32 222 55L236 222 250 86Q259 51 279 76L290 239 306 144Q327 111 342 149L340 281Q342 319 294 324H115Q80 322 60 300" fill="#edbdac" stroke="#d89f91" stroke-width="3"/>${nails.map((n,i)=>{
    const positions=[[78,173,39,65,-15],[140,93,34,70,-5],[196,62,33,75,0],[256,86,33,72,2],[308,151,32,64,13]];
    const [x,y,w,h,rotation]=positions[i];return `<g transform="rotate(${rotation} ${x+w/2} ${y+h/2})"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w/2}" fill="${colors[n.color]}" stroke="#ffffff" stroke-width="2"/><path d="M${x+8} ${y+18}v${h/3}" stroke="white" opacity=".6" stroke-width="4" stroke-linecap="round"/><text x="${x+w/2}" y="${y+h*.67}" text-anchor="middle" font-size="23" fill="${n.color===7?'#ac527b':'#fff1c9'}">${decorations[n.decor]}</text></g>`;
  }).join('')}<text x="386" y="285" text-anchor="middle" fill="#aa5176" font-family="sans-serif" font-size="19" font-weight="bold">nailplay</text><path d="m375 200 5 13 13 5-13 5-5 13-5-13-13-5 13-5" fill="#f5bf58"/></svg>`;
}
export function scope(root){
  const controller=new AbortController(),timeouts=new Set();let frame=0,disposed=false;
  return {
    root,
    on(target,event,callback){target.addEventListener(event,callback,{signal:controller.signal});},
    later(callback,delay){const id=setTimeout(()=>{timeouts.delete(id);if(!disposed)callback();},delay);timeouts.add(id);},
    loop(callback){let previous=performance.now();const tick=now=>{if(disposed)return;const dt=(document.hidden||document.querySelector('dialog[open]'))?0:Math.min((now-previous)/1000,.05);previous=now;callback(dt);frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);},
    dispose(){disposed=true;controller.abort();timeouts.forEach(clearTimeout);cancelAnimationFrame(frame);}
  };
}
export function button(label,action,cls='arc-button'){
  const node=document.createElement('button');node.type='button';node.className=cls;node.textContent=label;node.onclick=action;return node;
}
export function announce(root,text){const node=root.querySelector('.arc-feedback');if(node)node.textContent=text;}
export function finish(root,title,copy,effect='success',actions=[]){
  root.querySelector('.arc-result')?.remove();
  const panel=document.createElement('div');panel.className='arc-result';panel.setAttribute('role','status');
  const heading=document.createElement('h2');heading.textContent=title;
  const p=document.createElement('p');p.textContent=copy;panel.append(heading,p);
  if(actions.length){const row=document.createElement('div');row.className='arc-actions';actions.filter(Boolean).forEach(([label,action,cls])=>row.append(button(label,action,`arc-button ${cls||''}`)));panel.append(row);}
  root.append(panel);feedback(effect,panel);panel.scrollIntoView?.({block:'nearest',behavior:'smooth'});
}
export const themeFor=level=>['morning','pastel','sunset','evening','neon'][Math.floor((level-1)/4)%5];
export const starText=n=>'★'.repeat(n)+'☆'.repeat(3-n);
// Shared level flow: map of levels, play a level, then next / replay / map.
export function leveled(root,{id,total,play}){
  let dispose=null;
  const clear=()=>{dispose?.();dispose=null;root.innerHTML='';};
  const map=()=>{
    clear();setTheme('menu');const open=unlocked(id);
    root.innerHTML=`<div class="level-map-head"><strong>Choose a level</strong><span>${Array.from({length:total},(_,i)=>stars(id,i+1)).reduce((a,b)=>a+b,0)} / ${total*3} ★</span></div><div class="level-map">${Array.from({length:total},(_,i)=>{const n=i+1,s=stars(id,n);return `<button class="level-dot ${n===open?'current':''}" data-level="${n}" ${n>open?'disabled aria-label="Level '+n+', locked"':`aria-label="Level ${n}, ${s} stars"`}><b>${n>open?'🔒':n}</b><small>${n>open?'':starText(s)}</small></button>`;}).join('')}</div>`;
    root.querySelector('.level-map').addEventListener('click',e=>{const b=e.target.closest('[data-level]');if(b&&!b.disabled)start(Number(b.dataset.level));});
    root.querySelector('.level-dot.current')?.scrollIntoView?.({block:'center'});
  };
  const start=level=>{
    clear();setTheme(themeFor(level));
    const bar=document.createElement('div');bar.className='level-bar';bar.innerHTML=`<button class="arc-button" data-map>☰ Levels</button><strong>Level ${level} <small>/ ${total}</small></strong><span>${starText(stars(id,level))}</span>`;
    bar.querySelector('[data-map]').onclick=map;root.append(bar);
    const stage=document.createElement('div');root.append(stage);
    dispose=play(stage,level,{
      win(earned,title,copy){complete(id,level,earned);finish(stage,`${title} ${starText(earned)}`,copy,'success',[level<total&&['Next level →',()=>start(level+1),'accent'],['Replay',()=>start(level)],['Levels',map]]);},
      lose(title,copy){finish(stage,title,copy,'lose',[['Try again',()=>start(level),'accent'],['Levels',map]]);}
    });
  };
  start(Math.min(unlocked(id),total));
  return ()=>{dispose?.();dispose=null;};
}
