// Small Web Animations helpers for tap feedback. Every helper resolves immediately under reduced motion.
export const calm=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const done=animation=>animation.finished.catch(()=>{});
export function fly(from,to,{html=from.innerHTML,className='flyer',duration=320,lift=40}={}){
  if(calm()||!from||!to)return Promise.resolve();
  const a=from.getBoundingClientRect(),b=to.getBoundingClientRect(),node=document.createElement('div');
  node.className=className;node.innerHTML=html;node.setAttribute('aria-hidden','true');
  Object.assign(node.style,{position:'fixed',left:`${a.left}px`,top:`${a.top}px`,width:`${a.width}px`,height:`${a.height}px`,zIndex:50,pointerEvents:'none'});
  document.body.append(node);
  const dx=b.left+b.width/2-(a.left+a.width/2),dy=b.top+b.height/2-(a.top+a.height/2),scale=Math.min(b.width/a.width,b.height/a.height)||1;
  return done(node.animate([{transform:'translate(0,0) scale(1)'},{transform:`translate(${dx/2}px,${dy/2-lift}px) scale(${(1+scale)/2*1.1}) rotate(-6deg)`,offset:.5},{transform:`translate(${dx}px,${dy}px) scale(${scale})`}],{duration,easing:'cubic-bezier(.3,.7,.3,1)'})).then(()=>node.remove());
}
export function floatText(anchor,text,color='#d83071'){
  if(calm()||!anchor)return;
  const r=anchor.getBoundingClientRect(),node=document.createElement('span');
  node.className='float-text';node.textContent=text;node.style.color=color;node.setAttribute('aria-hidden','true');
  Object.assign(node.style,{left:`${r.left+r.width/2}px`,top:`${r.top+r.height/3}px`});document.body.append(node);
  done(node.animate([{transform:'translate(-50%,0) scale(.6)',opacity:0},{transform:'translate(-50%,-18px) scale(1.15)',opacity:1,offset:.25},{transform:'translate(-50%,-60px) scale(1)',opacity:0}],{duration:900,easing:'ease-out'})).then(()=>node.remove());
}
export function shake(node){if(!calm()&&node)node.animate([{transform:'translateX(0)'},{transform:'translateX(-7px)'},{transform:'translateX(6px)'},{transform:'translateX(-4px)'},{transform:'translateX(0)'}],{duration:300});}
export function bounce(node,amount=1.12){if(!calm()&&node)node.animate([{transform:'scale(1)'},{transform:`scale(${amount})`},{transform:'scale(1)'}],{duration:260,easing:'cubic-bezier(.3,1.6,.5,1)'});}
export function stagger(nodes,keyframes,{each=30,duration=320}={}){if(calm())return;[...nodes].forEach((n,i)=>n.animate(keyframes,{duration,delay:i*each,easing:'cubic-bezier(.2,.9,.3,1.2)',fill:'backwards'}));}
// Remember positions, change the DOM, then glide each keyed node from its old spot (FLIP).
export function flip(container,selector,key,change){
  const before=new Map([...container.querySelectorAll(selector)].map(n=>[n.dataset[key],n.getBoundingClientRect()]));
  change();if(calm())return;
  container.querySelectorAll(selector).forEach(n=>{const old=before.get(n.dataset[key]);if(!old)return;const now=n.getBoundingClientRect(),dx=old.left-now.left,dy=old.top-now.top;if(dx||dy)n.animate([{transform:`translate(${dx}px,${dy}px)`},{transform:'none'}],{duration:160,easing:'ease-out'});});
}
// Global press squish for every button.
export function installPress(){
  if(calm())return;
  document.addEventListener('pointerdown',e=>{const b=e.target.closest('button');if(b&&!b.disabled&&b.getAttribute('aria-disabled')!=='true')b.animate([{scale:1},{scale:.94},{scale:1}],{duration:180,easing:'ease-out'});},{passive:true});
}
export function enter(node){if(!calm()&&node)node.animate([{opacity:0,transform:'translateY(14px) scale(.985)'},{opacity:1,transform:'none'}],{duration:280,easing:'cubic-bezier(.2,.8,.3,1)'});}
