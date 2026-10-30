import {installMusic} from './music.js';
import {installFeedback,feedback} from './feedback.js';
import {modes} from './arcade/index.js';
import {available,pick,createState,shuffleBoard,MAX_LEVEL,clampLevel} from './engine.js';
const $=id=>document.getElementById(id);
installFeedback();
installMusic();
import {art,collectionArt} from './art.js';
const names=['Polish','Pink nail','Gem','Brush','Nail lamp','Star','Nail file','Flower'];
const games=[['Nail Match','Uncover tiles. Find your triples.',0],['Nail Designer','Create your signature manicure.',1],['Memory Match','A little memory magic.',7],['Polish Pop','Swap, match, and make colors pop.',0],['Copy the Look','Remember it. Recreate it.',3],['Color Lab','Mix the perfect polish shade.',0],['Polish Catch','Catch polish. Dodge broken bottles.',4],['Nail Jigsaw','Piece together a pretty manicure.',2],['Spot the Difference','Look closely. Find what changed.',5],['Mini Nail Salon','Your own little salon rush.',6]];
document.querySelector('.side-art').innerHTML=collectionArt();
$('games').innerHTML=games.map(([title,copy,type],i)=>`<button class="game-card ${i===0?'featured':''}" data-game="${i}"><div class="card-top"><span class="card-art">${art(type)}</span><span class="badge">Play</span></div><h2>${title}</h2><p>${copy}</p></button>`).join('');
let disposeArcade=null,activeGame=0;
let state,history=[],level=1,undos=3,hints=3,best=0,dialogAction;
try{best=Number(localStorage.getItem('nail-play-best'))||0}catch{}
function message(title,copy,label,action){$('dialog-title').textContent=title;$('dialog-copy').textContent=copy;$('dialog-action').textContent=label;dialogAction=action;if(!$('dialog').open)$('dialog').showModal();}
function start(){
  disposeArcade?.();disposeArcade=null;activeGame=0;$('arcade').hidden=true;
  level=clampLevel(level);history=[];undos=3;hints=3;state=createState(level);
  $('menu').hidden=true;$('game').hidden=false;
  document.body.classList.add('is-playing');$('back').hidden=false;
  $('level').textContent=`${level} / ${MAX_LEVEL}`;
  $('level-name').textContent=['Warm-up','Getting tricky','Challenge','Expert','The trap'][level-1];
  $('status').textContent=level===MAX_LEVEL?'Fixed trap: this level cannot be cleared with a 7-slot tray. Score as much as you can!':'Choose uncovered tiles. Match 3 to clear your tray.';
  render();
}
function render(){
  const columns=level===1?4:level===2?5:6;
  const step=86/columns;
  const offset=(6-columns)/2;
  $('board').style.setProperty('--tile-size',`${step}%`);
  const existing=new Map([...$('board').children].map(node=>[Number(node.dataset.id),node]));
  for(const t of state.tiles){
    let node=existing.get(t.id);
    if(!node){
      node=document.createElement('button');node.type='button';node.className='tile';node.dataset.id=t.id;
      $('board').append(node);
    }
    existing.delete(t.id);
    node.classList.remove('hinted');
    node.style.left=`${(t.x-offset)*step+7}%`;node.style.top=`${(t.y-offset)*step+5}%`;node.style.zIndex=t.z+1;
    const blocked=!available(state.tiles,t)||state.status!=='playing';
    node.setAttribute('aria-disabled',String(blocked));
    node.setAttribute('aria-label',`${names[t.type]}, layer ${t.z+1}${blocked?', covered':''}`);
    if(node.dataset.type!==String(t.type)){node.innerHTML=art(t.type);node.dataset.type=t.type;}
  }
  existing.forEach(node=>node.remove());
  $('tray').innerHTML=Array.from({length:7},(_,i)=>`<div class="slot ${state.tray[i]?'filled':''}" ${state.tray[i]?`aria-label="${names[state.tray[i].type]}"`:''}>${state.tray[i]?art(state.tray[i].type):''}</div>`).join('');
  $('tray').classList.toggle('danger',state.tray.length>=5);$('capacity').textContent=`${state.tray.length} / 7`;$('score').textContent=state.score;$('remaining').textContent=state.tiles.length;$('best').textContent=Math.max(best,state.score);
  $('shuffle').title=level===MAX_LEVEL?'Level 5 has a fixed trap layout':'Shuffle tiles on the board';
  $('shuffle').disabled=level===MAX_LEVEL||state.status!=='playing'||state.tiles.length<2;
  $('undo').disabled=!history.length||!undos;$('hint').disabled=!hints||state.status!=='playing';$('undo-count').textContent=`${undos} left`;$('hint-count').textContent=`${hints} left`;
}
$('board').addEventListener('click',event=>{const button=event.target.closest('[data-id]');if(!button)return;if(button.getAttribute('aria-disabled')==='true'){$('status').textContent='This tile is covered. Pick an uncovered tile first.';return;}const next=pick(state,Number(button.dataset.id));if(next===state)return;history.push(state);if(history.length>12)history.shift();const matched=next.score>state.score;state=next;feedback(matched?'match':'pick',$('tray'));render();$('status').textContent=matched?'Lovely! Three matching tiles cleared.':state.tray.length>=5?'Tray almost full. Look for matching tiles!':'Keep looking for matching tiles.';
  if(state.score>best){best=state.score;try{localStorage.setItem('nail-play-best',String(best))}catch{}}
  if(state.status==='won'){feedback('success',$('board'));message('Beautifully matched!',`Board cleared with ${state.score} points. Ready for the next level?`,'Next level',()=>{level=Math.min(MAX_LEVEL,level+1);start()});}
  if(state.status==='lost'){feedback('lose',$('tray'));message('Your tray is full!','Try again, or close this message and use Undo to change your last move.','Try again',start);}
});
$('undo').onclick=()=>{if(history.length&&undos){state=history.pop();undos--;render();$('status').textContent='Last move undone. Try another tile.';}};
$('hint').onclick=()=>{if(!hints||state.status!=='playing')return;const open=state.tiles.filter(t=>available(state.tiles,t));const count=type=>state.tray.filter(t=>t.type===type).length;open.sort((a,b)=>count(b.type)-count(a.type)||open.filter(t=>t.type===b.type).length-open.filter(t=>t.type===a.type).length);const chosen=open[0];if(!chosen)return;hints--;render();$('board').querySelector(`[data-id="${chosen.id}"]`).classList.add('hinted');$('status').textContent=`Try the highlighted ${names[chosen.type].toLowerCase()}. Hints do not guarantee a win.`;};
$('shuffle').onclick=()=>{const next=shuffleBoard(state);if(next===state)return;history.push(state);if(history.length>12)history.shift();state=next;feedback('shuffle',$('board'));render();$('status').textContent='Board shuffled. Your tray and score stay the same.';};
$('restart').onclick=()=>message('Restart this level?','This board and its score will be reset.','Restart',start);
$('back').onclick=()=>{disposeArcade?.();disposeArcade=null;activeGame=0;$('arcade').hidden=true;$('game').hidden=true;$('menu').hidden=false;document.body.classList.remove('is-playing');$('back').hidden=true;};
document.querySelector('.brand').onclick=event=>{event.preventDefault();$('back').click()};
function openArcade(id){
  disposeArcade?.();activeGame=id;
  $('menu').hidden=true;$('game').hidden=true;$('arcade').hidden=false;$('back').hidden=false;
  document.body.classList.add('is-playing');$('arcade-title').textContent=modes[id].title;
  $('arcade-content').innerHTML='';disposeArcade=modes[id].mount($('arcade-content'));
  window.scrollTo(0,0);
}
$('games').addEventListener('click',event=>{const card=event.target.closest('[data-game]');if(!card)return;const id=Number(card.dataset.game);if(id===0){level=1;start();}else openArcade(id);});
$('arcade-restart').onclick=()=>message('Restart this game?','Your current round will be reset.','Restart',()=>openArcade(activeGame));
$('help').onclick=()=>{if(activeGame){message(modes[activeGame].title,modes[activeGame].hint,'Got it',()=>{});return;}message('Three tiles, one match!','Choose uncovered tiles to add them to your tray. Three identical tiles disappear. Clear the board to win; filling all 7 tray slots ends the round. Each level has 3 undos and 3 hints. There are 5 levels. Level 5 is a fixed, impossible trap with no extra tiles. Shuffle is available in levels 1–4.','Got it',()=>{});};
$('close').onclick=()=>$('dialog').close();$('dialog-action').onclick=()=>{$('dialog').close();dialogAction?.()};
