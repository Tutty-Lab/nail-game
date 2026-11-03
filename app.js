import {installMusic} from './music.js';
import {installFeedback,feedback} from './feedback.js';
import {fly,bounce,shake,floatText,stagger,enter,installPress} from './motion.js';
installPress();
import {modes} from './arcade/index.js';
import {available,pick,createState,shuffleBoard,MAX_LEVEL,clampLevel} from './engine.js';
const $=id=>document.getElementById(id);
installFeedback();
installMusic();
import {art,artSets,artName,collectionArt} from './art.js';
import {installBackdrop,setTheme} from './backdrop.js';
import {unlocked,totalStars,best as bestOf} from './progress.js';
installBackdrop();
const themesByLevel=['morning','pastel','sunset','evening','neon'];
let set=artSets[0];
const names=type=>artName(set[type]);
// [mode, title, tagline, art, total levels]
const games=[['painter','Polish Painter','Paint the brief with your fingertip.',1,24],['mixer','Gradient Mixer','Drip pigments into the perfect ombre.',12,24],['sort','Polish Sort','Pour until every bottle is one color.',12,60],['tiles','Nail Match','Uncover tiles. Find your triples.',0,5],['merge','Polish Merge','Merge charms all the way to the crown.',23,0],['pop','Polish Pop','Swap, match, and make colors pop.',16,30],['memory','Memory Match','A little memory magic.',21,20],['catch','Polish Catch','Catch polish. Dodge broken bottles.',4,20]];
document.querySelector('.side-art').innerHTML=collectionArt();
const progressLabel=(mode,total)=>mode==='merge'?`Best ${bestOf('merge')}`:mode==='tiles'?`Best ${best}`:total?`Level ${Math.min(unlocked(mode),total)} / ${total} · ${totalStars(mode)}★`:'Free play';
const drawMenu=()=>{$('games').innerHTML=games.map(([mode,title,copy,type,total],i)=>`<button class="game-card ${i===0?'featured':''}" data-game="${mode}" style="--delay:${i*60}ms"><div class="card-top"><span class="card-art">${art(type)}</span><span class="badge">${progressLabel(mode,total)}</span></div><h2>${title}</h2><p>${copy}</p></button>`).join('');};
let disposeArcade=null,activeGame='';
let state,history=[],level=1,undos=3,hints=3,best=0,dialogAction;
try{best=Number(localStorage.getItem('nail-play-best'))||0}catch{}
drawMenu();
function message(title,copy,label,action){$('dialog-title').textContent=title;$('dialog-copy').textContent=copy;$('dialog-action').textContent=label;dialogAction=action;if(!$('dialog').open)$('dialog').showModal();}
function start(){
  disposeArcade?.();disposeArcade=null;activeGame='';$('arcade').hidden=true;
  level=clampLevel(level);set=artSets[level-1];setTheme(themesByLevel[level-1]);history=[];undos=3;hints=3;state=createState(level);
  $('menu').hidden=true;$('game').hidden=false;
  document.body.classList.add('is-playing');$('back').hidden=false;
  $('level').textContent=`${level} / ${MAX_LEVEL}`;
  $('level-name').textContent=['Warm-up','Getting tricky','Challenge','Expert','The trap'][level-1];
  $('status').textContent=level===MAX_LEVEL?'Fixed trap: this level cannot be cleared with a 7-slot tray. Score as much as you can!':'Choose uncovered tiles. Match 3 to clear your tray.';
  render();enter($('game'));stagger($('board').children,[{transform:'translateY(-30px) scale(.6)',opacity:0},{transform:'none',opacity:1}],{each:12,duration:300});
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
    node.setAttribute('aria-label',`${names(t.type)}, layer ${t.z+1}${blocked?', covered':''}`);
    const look=`${level}-${t.type}`;if(node.dataset.type!==look){node.innerHTML=art(set[t.type]);node.dataset.type=look;}
  }
  existing.forEach(node=>node.remove());
  $('tray').innerHTML=Array.from({length:7},(_,i)=>`<div class="slot ${state.tray[i]?'filled':''}" ${state.tray[i]?`aria-label="${names(state.tray[i].type)}"`:''}>${state.tray[i]?art(set[state.tray[i].type]):''}</div>`).join('');
  $('tray').classList.toggle('danger',state.tray.length>=5);$('capacity').textContent=`${state.tray.length} / 7`;$('score').textContent=state.score;$('remaining').textContent=state.tiles.length;$('best').textContent=Math.max(best,state.score);
  $('shuffle').title=level===MAX_LEVEL?'Level 5 has a fixed trap layout':'Shuffle tiles on the board';
  $('shuffle').disabled=level===MAX_LEVEL||state.status!=='playing'||state.tiles.length<2;
  $('undo').disabled=!history.length||!undos;$('hint').disabled=!hints||state.status!=='playing';$('undo-count').textContent=`${undos} left`;$('hint-count').textContent=`${hints} left`;
}
let flying=false;
$('board').addEventListener('click',async event=>{const button=event.target.closest('[data-id]');if(!button||flying)return;if(button.getAttribute('aria-disabled')==='true'){shake(button);$('status').textContent='This tile is covered. Pick an uncovered tile first.';return;}const next=pick(state,Number(button.dataset.id));if(next===state)return;
  // Fly the tile into its tray slot before the board updates.
  flying=true;feedback('pick');button.style.visibility='hidden';await fly(button,$('tray').children[Math.min(state.tray.length,6)],{duration:240,lift:30});flying=false;
  if($('game').hidden)return;
  history.push(state);if(history.length>12)history.shift();const matched=next.score>state.score;state=next;render();
  if(matched){feedback('match',$('tray'));bounce($('tray'),1.05);floatText($('tray'),'+30');}else bounce($('tray').children[state.tray.length-1],1.15);$('status').textContent=matched?'Lovely! Three matching tiles cleared.':state.tray.length>=5?'Tray almost full. Look for matching tiles!':'Keep looking for matching tiles.';
  if(state.score>best){best=state.score;try{localStorage.setItem('nail-play-best',String(best))}catch{}}
  if(state.status==='won'){feedback('success',$('board'));message('Beautifully matched!',`Board cleared with ${state.score} points. Ready for the next level?`,'Next level',()=>{level=Math.min(MAX_LEVEL,level+1);start()});}
  if(state.status==='lost'){feedback('lose',$('tray'));message('Your tray is full!','Try again, or close this message and use Undo to change your last move.','Try again',start);}
});
$('undo').onclick=()=>{if(history.length&&undos){state=history.pop();undos--;render();$('status').textContent='Last move undone. Try another tile.';}};
$('hint').onclick=()=>{if(!hints||state.status!=='playing')return;const open=state.tiles.filter(t=>available(state.tiles,t));const count=type=>state.tray.filter(t=>t.type===type).length;open.sort((a,b)=>count(b.type)-count(a.type)||open.filter(t=>t.type===b.type).length-open.filter(t=>t.type===a.type).length);const chosen=open[0];if(!chosen)return;hints--;render();$('board').querySelector(`[data-id="${chosen.id}"]`).classList.add('hinted');$('status').textContent=`Try the highlighted ${names(chosen.type).toLowerCase()}. Hints do not guarantee a win.`;};
$('shuffle').onclick=()=>{const next=shuffleBoard(state);if(next===state)return;history.push(state);if(history.length>12)history.shift();state=next;feedback('shuffle',$('board'));render();$('status').textContent='Board shuffled. Your tray and score stay the same.';};
$('restart').onclick=()=>message('Restart this level?','This board and its score will be reset.','Restart',start);
$('back').onclick=()=>{disposeArcade?.();disposeArcade=null;activeGame='';setTheme('menu');drawMenu();$('arcade').hidden=true;$('game').hidden=true;$('menu').hidden=false;document.body.classList.remove('is-playing');$('back').hidden=true;};
document.querySelector('.brand').onclick=event=>{event.preventDefault();$('back').click()};
function openArcade(id){
  disposeArcade?.();activeGame=id;
  $('menu').hidden=true;$('game').hidden=true;$('arcade').hidden=false;$('back').hidden=false;
  document.body.classList.add('is-playing');$('arcade-title').textContent=modes[id].title;
  $('arcade-content').innerHTML='';disposeArcade=modes[id].mount($('arcade-content'));enter($('arcade-content'));
  window.scrollTo(0,0);
}
$('games').addEventListener('click',event=>{const card=event.target.closest('[data-game]');if(!card)return;const id=card.dataset.game;if(id==='tiles'){level=1;start();}else openArcade(id);});
$('arcade-restart').onclick=()=>message('Restart this game?','Your current round will be reset.','Restart',()=>openArcade(activeGame));
$('help').onclick=()=>{if(activeGame){message(modes[activeGame].title,modes[activeGame].hint,'Got it',()=>{});return;}message('Three tiles, one match!','Choose uncovered tiles to add them to your tray. Three identical tiles disappear. Clear the board to win; filling all 7 tray slots ends the round. Each level has 3 undos and 3 hints. There are 5 levels. Level 5 is a fixed, impossible trap with no extra tiles. Shuffle is available in levels 1–4.','Got it',()=>{});};
$('close').onclick=()=>$('dialog').close();$('dialog-action').onclick=()=>{$('dialog').close();dialogAction?.()};
