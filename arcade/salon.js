import {feedback} from '../feedback.js';
import {scope,art,colors,finish,announce} from './ui.js';
function portrait(id){
  const hair=['#674154','#a86d4d','#3f3c56'][id%3],shirt=['#b894d4','#e99bb7','#78baaa'][id%3];
  return `<svg viewBox="0 0 64 66" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#fce5ee"/><path d="M10 60q0-22 22-22t22 22" fill="${shirt}"/><path d="M15 39V24c0-27 34-27 34 0v18z" fill="${hair}"/><ellipse cx="32" cy="29" rx="14" ry="18" fill="#f0c1a4"/><path d="M18 24q-3-23 20-19 16 4 10 23L36 15q-4 9-18 9" fill="${hair}"/><path d="M25 29h1m12 0h1" stroke="#6b4348" stroke-width="3" stroke-linecap="round"/><path d="M28 37q4 4 8 0" fill="none" stroke="#b56b75" stroke-width="2" stroke-linecap="round"/><circle cx="22" cy="34" r="3" fill="#e9a2a2"/><circle cx="42" cy="34" r="3" fill="#e9a2a2"/></svg>`;
}
export function salon(root){
  const life=scope(root);let running=false,done=false,time=60,customers=[],spawn=0,nextId=0,selected=null,color=null,tool=null,served=0,missed=0;
  root.innerHTML='<div class="arc-stats"><span>Served <strong id="salon-served">0</strong></span><span>Seconds <strong id="salon-time">60</strong></span><span>Left <strong id="salon-missed">0 / 3</strong></span></div><div class="salon-room"><div class="salon-desk">nailplay studio</div><div class="customer-list"></div></div><div class="salon-controls"><h3>Match the requested color</h3><div class="salon-colors"></div><h3>Choose a service</h3><div class="salon-services"></div><button class="arc-button accent" id="salon-serve">Complete order</button></div><button class="arc-button accent" id="salon-start">Open the salon</button><p class="arc-feedback" role="status">Serve 8 customers in 60 seconds. The salon closes if 3 customers leave.</p>';
  const list=root.querySelector('.customer-list');
  root.querySelector('.salon-colors').innerHTML=colors.slice(0,4).map((c,i)=>`<button class="swatch" style="--swatch:${c}" data-salon-color="${i}" aria-label="Color ${['pink','purple','mint','yellow'][i]}" aria-pressed="false"></button>`).join('');
  root.querySelector('.salon-services').innerHTML=[['Polish',0],['Add gems',2],['Flower art',7]].map(([name,type],i)=>`<button class="service-button" data-service="${i}" aria-pressed="false">${art(type)}<span>${name}</span></button>`).join('');
  const draw=()=>{
    list.innerHTML=customers.map(c=>`<button class="customer ${selected===c.id?'selected':''}" data-customer="${c.id}" aria-label="Customer ${c.id+1}, color ${c.color+1}, service ${c.tool+1}"><span class="customer-avatar">${portrait(c.id)}</span><span class="customer-order"><span class="order-color" style="background:${colors[c.color]}"></span>${art([0,2,7][c.tool])}</span><progress value="${c.patience}" max="18" aria-label="Customer ${c.id+1} patience"></progress></button>`).join('');
    root.querySelector('#salon-served').textContent=served;root.querySelector('#salon-missed').textContent=`${missed} / 3`;
  };
  life.on(root.querySelector('#salon-start'),'click',()=>{running=true;root.querySelector('#salon-start').remove();});
  life.on(root,'click',e=>{
    const b=e.target.closest('button');if(!b||!running||done)return;
    if(b.dataset.customer!==undefined){selected=Number(b.dataset.customer);draw();}
    if(b.dataset.salonColor!==undefined){color=Number(b.dataset.salonColor);root.querySelectorAll('[data-salon-color]').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));}
    if(b.dataset.service!==undefined){tool=Number(b.dataset.service);root.querySelectorAll('[data-service]').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));}
    if(b.id==='salon-serve'){
      const customer=customers.find(c=>c.id===selected);
      if(!customer){announce(root,'Select a customer first.');return;}
      if(customer.color!==color||customer.tool!==tool){feedback('error',list);customer.patience=Math.max(0,customer.patience-3);announce(root,'That does not match the order. The customer loses 3 seconds of patience.');return;}
      feedback('match',list);customers=customers.filter(c=>c!==customer);served++;selected=null;draw();announce(root,'Happy customer! Choose the next order.');
    }
  });
  life.loop(dt=>{
    if(!running||done||!dt)return;time=Math.max(0,time-dt);spawn-=dt;
    if(spawn<=0&&customers.length<3){customers.push({id:nextId++,color:Math.floor(Math.random()*4),tool:Math.floor(Math.random()*3),patience:18});spawn=4.5;draw();}
    let expired=false;customers=customers.filter(c=>{c.patience-=dt;if(c.patience<=0){missed++;expired=true;return false;}return true;});
    if(expired){if(!customers.some(c=>c.id===selected))selected=null;draw();}
    customers.forEach(c=>{const progress=list.querySelector(`[data-customer="${c.id}"] progress`);if(progress)progress.value=c.patience;});
    root.querySelector('#salon-time').textContent=Math.ceil(time);
    if(served>=8||missed>=3||time<=0){done=true;running=false;root.querySelectorAll('.salon-controls button').forEach(b=>b.disabled=true);finish(root,served>=8?'Salon superstar!':'Shift complete',`Served ${served} / 8 customers; ${missed} customers left.`,served>=8?'success':'lose');}
  });draw();return ()=>life.dispose();
}
