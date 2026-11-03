import {feedback} from '../feedback.js';
import {scope,announce,leveled} from './ui.js';
import {SORT_LEVELS,CAPACITY,sortConfig,makeSortLevel,pour,isSolved,solvedBottle,top} from './sortlogic.js';
import {calm,shake,bounce,stagger,floatText} from '../motion.js';
// Tip the source bottle over the target and draw a stream of polish.
function pourMotion(source,target,color,amount){
  if(calm()||!source||!target)return Promise.resolve();
  const a=source.getBoundingClientRect(),b=target.getBoundingClientRect(),fromLeft=a.left<b.left;
  const dx=b.left+b.width/2-(a.left+a.width/2)+(fromLeft?-b.width*.55:b.width*.55),dy=b.top-a.top-a.height*.62,tilt=fromLeft?72:-72;
  source.style.zIndex=5;
  const move=source.animate([{transform:'translateY(-18px)'},{transform:`translate(${dx}px,${dy}px) rotate(${tilt}deg)`,offset:.4},{transform:`translate(${dx}px,${dy}px) rotate(${tilt}deg)`,offset:.82},{transform:'translateY(0)'}],{duration:620+amount*60,easing:'ease-in-out'});
  const stream=document.createElement('div');stream.className='pour-stream';stream.style.cssText+=`left:${b.left+b.width/2-3}px;top:${b.top-8}px;height:${b.height*.7}px;background:${color}`;document.body.append(stream);
  stream.animate([{transform:'scaleY(0)',opacity:0},{transform:'scaleY(0)',opacity:1,offset:.38},{transform:'scaleY(1)',opacity:1,offset:.5},{transform:'scaleY(1)',opacity:1,offset:.78},{transform:'scaleY(0) translateY(100%)',opacity:0}],{duration:620+amount*60});
  return move.finished.catch(()=>{}).then(()=>stream.remove());
}
export const polish=['#f26ba2','#9868c9','#53bbaa','#f5bf58','#ea8265','#69a7df','#a73561','#8bcf6a','#3d3a6b','#f4ece0'];
const polishNames=['Pink','Purple','Mint','Honey','Coral','Sky','Berry','Lime','Midnight','Pearl'];
export const sorting=root=>leveled(root,{id:'sort',total:SORT_LEVELS,play});
function play(root,level,{win,lose}){
  const life=scope(root),config=sortConfig(level);
  let busy=false,bottles=makeSortLevel(level),history=[],selected=null,moves=0,undos=5,extra=config.extra,toolsUsed=0,done=false;
  // Hidden layers: everything under each starting top run stays a mystery until uncovered.
  let hidden=bottles.map(b=>b.map((_,i)=>config.hidden&&i<b.length-1));
  root.innerHTML=`<div class="arc-stats"><span>Moves <strong id="sort-moves">0</strong></span><span>Colors <strong>${config.colors}</strong></span><span>Undo <strong id="sort-undos">5</strong></span></div><div class="sort-shelf"></div><div class="arc-actions sort-tools"><button class="arc-button" data-tool="undo">↶ Undo</button><button class="arc-button" data-tool="bottle">＋ Empty bottle <small id="sort-extra"></small></button><button class="arc-button" data-tool="reset">↻ Reset</button></div><p class="arc-feedback" role="status">${config.hidden?'Grey layers are hidden. Pour off the top to reveal them.':'Tap a bottle, then tap where to pour. Only matching colors stack.'}</p>`;
  const shelf=root.querySelector('.sort-shelf');
  const reveal=()=>{hidden=hidden.map((h,i)=>{const b=bottles[i];h=h.slice(0,b.length);while(h.length<b.length)h.push(false);if(h.length)h[h.length-1]=false;return h;});};
  const render=()=>{
    shelf.style.setProperty('--per-row',Math.min(bottles.length,bottles.length>8?Math.ceil(bottles.length/2):bottles.length));
    shelf.innerHTML=bottles.map((b,i)=>`<button class="sort-bottle ${selected===i?'lifted':''} ${b.length&&solvedBottle(b)?'complete':''}" data-bottle="${i}" aria-label="Bottle ${i+1}: ${b.length?b.map((c,j)=>hidden[i][j]?'hidden':polishNames[c]).join(', '):'empty'}" ${done?'disabled':''}><span class="sort-cap"></span><span class="sort-glass">${b.map((c,j)=>`<i class="${hidden[i][j]?'mystery':''}" style="--polish:${hidden[i][j]?'#cfc3cc':polish[c]}"></i>`).join('')}</span></button>`).join('');
    root.querySelector('#sort-moves').textContent=moves;root.querySelector('#sort-undos').textContent=undos;
    root.querySelector('#sort-extra').textContent=extra?`(${extra})`:'(0)';
    root.querySelector('[data-tool="undo"]').disabled=done||!history.length||!undos;
    root.querySelector('[data-tool="bottle"]').disabled=done||!extra;
  };
  const stuck=()=>bottles.every((b,from)=>bottles.every((_,to)=>!pour(bottles,from,to)));
  life.on(shelf,'click',e=>{
    const b=e.target.closest('[data-bottle]');if(!b||done||busy)return;const i=Number(b.dataset.bottle);
    if(selected===null){if(!bottles[i].length){announce(root,'That bottle is empty. Pick one with polish.');return;}selected=i;feedback('pick');render();return;}
    if(selected===i){selected=null;render();return;}
    const result=pour(bottles,selected,i);
    if(!result){feedback('error',b);shake(b);announce(root,bottles[i].length>=CAPACITY?'That bottle is full.':'Colors must match the top layer.');selected=bottles[i].length?i:null;render();return;}
    const source=shelf.querySelector(`[data-bottle="${selected}"]`),color=polish[top(bottles[selected])];
    busy=true;feedback('pick');
    pourMotion(source,b,color,result.amount).then(()=>{
      if(done||!root.isConnected)return;busy=false;
      history.push({bottles,hidden});if(history.length>30)history.shift();
      // Poured layers arrive visible; whatever they uncover is revealed.
      bottles=result.bottles;moves++;selected=null;reveal();
      const filled=bottles[i],complete=filled.length===CAPACITY&&solvedBottle(filled);render();
      const target=shelf.querySelector(`[data-bottle="${i}"]`);
      stagger([...target.querySelectorAll('i')].slice(-result.amount),[{transform:'translateY(-40px) scaleY(.4)',opacity:0},{transform:'none',opacity:1}],{each:70,duration:260});
      if(complete){feedback('match',target);bounce(target,1.15);floatText(target,'Perfect!',color);}
      if(isSolved(bottles)){done=true;render();stagger(shelf.children,[{transform:'none'},{transform:'translateY(-22px) rotate(-4deg)'},{transform:'none'}],{each:70,duration:500});const earned=toolsUsed===0?3:toolsUsed<=2?2:1;win(earned,'All sorted!',`Level ${level} finished in ${moves} moves.`);return;}
      if(stuck()&&!extra){done=true;render();lose('No moves left','Every bottle is blocked. Try a different pouring order.');}
      else if(stuck())announce(root,'No moves left. Add an empty bottle or undo.');
    });
  });
  life.on(root.querySelector('.sort-tools'),'click',e=>{
    const tool=e.target.closest('[data-tool]')?.dataset.tool;if(!tool||done||busy)return;
    if(tool==='undo'&&history.length&&undos){({bottles,hidden}=history.pop());undos--;toolsUsed++;selected=null;render();}
    if(tool==='bottle'&&extra){history.push({bottles,hidden});bottles=[...bottles,[]];hidden=[...hidden,[]];extra--;toolsUsed++;feedback('shuffle',shelf);render();}
    if(tool==='reset'){bottles=makeSortLevel(level);hidden=bottles.map(b=>b.map((_,i)=>config.hidden&&i<b.length-1));history=[];moves=0;selected=null;render();announce(root,'Level reset.');}
  });
  render();return ()=>life.dispose();
}
