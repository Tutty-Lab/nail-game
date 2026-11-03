import {feedback} from '../feedback.js';
import {scope,announce,leveled} from './ui.js';
import {bounce,shake,floatText} from '../motion.js';
import {PAINTER_LEVELS,painterLevel,GRID,inNail,compare,painterStars} from './creative.js';
export const painting=root=>leveled(root,{id:'painter',total:PAINTER_LEVELS,play});
const SCALE=12,[W,H]=[GRID[0]*SCALE,GRID[1]*SCALE];
// Nail outline in canvas pixels, matching inNail() on the scoring grid.
function nailPath(ctx){const r=W/2;ctx.beginPath();ctx.moveTo(0,H);ctx.lineTo(0,r);ctx.arc(r,r,r,Math.PI,0);ctx.lineTo(W,H);ctx.closePath();}
function gloss(ctx){
  const g=ctx.createLinearGradient(0,0,W,0);g.addColorStop(0,'#ffffff00');g.addColorStop(.18,'#ffffff70');g.addColorStop(.3,'#ffffff00');
  ctx.save();nailPath(ctx);ctx.clip();ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.restore();
  ctx.save();nailPath(ctx);ctx.lineWidth=4;ctx.strokeStyle='#ffffffcc';ctx.stroke();ctx.restore();
}
function drawCells(ctx,cells,palette){
  ctx.clearRect(0,0,W,H);ctx.save();nailPath(ctx);ctx.clip();
  cells.forEach((c,i)=>{ctx.fillStyle=palette[c];ctx.fillRect(i%GRID[0]*SCALE-.5,Math.floor(i/GRID[0])*SCALE-.5,SCALE+1,SCALE+1);});
  ctx.restore();gloss(ctx);
}
const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
function play(root,level,{win,lose}){
  const life=scope(root),config=painterLevel(level),{palette}=config;
  let color=1,size=2,strokes=[],painting=false,last=null,done=false;
  root.innerHTML=`<div class="paint-brief"><canvas class="paint-target" width="${W}" height="${H}" aria-label="Target design: ${config.name}"></canvas><div><span class="eyebrow">Design brief</span><h3>${config.name}</h3><p>Copy the design. Reach <strong>${config.goal}%</strong> to pass.</p></div></div>
  <div class="paint-wrap"><div class="paint-finger"><canvas class="paint-canvas" width="${W}" height="${H}" aria-label="Your nail. Drag to paint."></canvas></div></div>
  <div class="paint-palette">${palette.map((c,i)=>`<button class="swatch ${i===color?'active':''}" style="--swatch:${c}" data-color="${i}" aria-label="${i?'Polish color '+i:'Bare nail (eraser)'}">${i?'':'⌫'}</button>`).join('')}</div>
  <div class="paint-tools"><button class="arc-button" data-size="1">Fine</button><button class="arc-button active" data-size="2">Medium</button><button class="arc-button" data-size="4">Wide</button><button class="arc-button" data-act="fill">Fill nail</button><button class="arc-button" data-act="undo">↶</button></div>
  <div class="arc-actions"><button class="arc-button" data-act="peek">Peek score</button><button class="arc-button accent" data-act="done">Done ✓</button></div>
  <p class="arc-feedback" role="status">Drag a finger across the nail to paint. Fill the base first, then add details.</p>`;
  drawCells(root.querySelector('.paint-target').getContext('2d'),config.cells,palette);
  const canvas=root.querySelector('.paint-canvas'),ctx=canvas.getContext('2d',{willReadFrequently:true});
  // The paint layer is replayed from strokes so undo stays exact.
  const paint=()=>{
    ctx.clearRect(0,0,W,H);ctx.save();nailPath(ctx);ctx.clip();ctx.fillStyle=palette[0];ctx.fillRect(0,0,W,H);ctx.lineCap=ctx.lineJoin='round';
    for(const s of strokes){
      ctx.strokeStyle=ctx.fillStyle=palette[s.color];
      if(s.fill){ctx.fillRect(0,0,W,H);continue;}
      ctx.lineWidth=s.size*SCALE;ctx.beginPath();ctx.moveTo(...s.points[0]);
      if(s.points.length===1){ctx.arc(...s.points[0],s.size*SCALE/2,0,7);ctx.fill();}else{s.points.forEach(p=>ctx.lineTo(...p));ctx.stroke();}
    }
    ctx.restore();
  };
  const redraw=()=>{paint();gloss(ctx);};
  // Read the colour at each grid cell centre and snap it to the closest palette colour.
  const sample=()=>{
    const data=ctx.getImageData(0,0,W,H).data,shades=palette.map(rgb),cells=[];
    for(let y=0;y<GRID[1];y++)for(let x=0;x<GRID[0];x++){
      if(!inNail(x,y)){cells.push(-1);continue;}
      const i=((y*SCALE+SCALE/2|0)*W+(x*SCALE+SCALE/2|0))*4,p=[data[i],data[i+1],data[i+2]];
      let best=0,dist=1e9;shades.forEach((s,k)=>{const d=(s[0]-p[0])**2+(s[1]-p[1])**2+(s[2]-p[2])**2;if(d<dist){dist=d;best=k;}});cells.push(best);
    }
    return cells;
  };
  // Score the flat colours, without the gloss highlight.
  const score=()=>{paint();const result=compare(sample(),config.cells);gloss(ctx);return result;};
  const point=e=>{const r=canvas.getBoundingClientRect();return [(e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H];};
  life.on(canvas,'pointerdown',e=>{if(done)return;e.preventDefault();try{canvas.setPointerCapture(e.pointerId);}catch{}painting=true;last=point(e);strokes.push({color,size,points:[last]});redraw();});
  life.on(canvas,'pointermove',e=>{if(!painting)return;const p=point(e);if(Math.hypot(p[0]-last[0],p[1]-last[1])<2)return;last=p;strokes.at(-1).points.push(p);redraw();});
  const end=()=>{if(painting){painting=false;feedback('tap');}};life.on(canvas,'pointerup',end);life.on(canvas,'pointercancel',end);
  life.on(root.querySelector('.paint-palette'),'click',e=>{const b=e.target.closest('[data-color]');if(!b)return;color=Number(b.dataset.color);root.querySelectorAll('[data-color]').forEach(n=>n.classList.toggle('active',n===b));bounce(b,1.2);});
  life.on(root,'click',e=>{
    const b=e.target.closest('[data-size],[data-act]');if(!b||done)return;
    if(b.dataset.size){size=Number(b.dataset.size);root.querySelectorAll('[data-size]').forEach(n=>n.classList.toggle('active',n===b));return;}
    const act=b.dataset.act;
    if(act==='fill'){strokes.push({fill:true,color});redraw();feedback('match',canvas);bounce(canvas.parentElement,1.04);}
    if(act==='undo'){strokes.pop();redraw();}
    if(act==='peek'){const s=score();floatText(canvas,`${s}%`);announce(root,`Current match: ${s}%. Goal: ${config.goal}%.`);}
    if(act==='done'){
      const s=score(),stars=painterStars(s,config.goal);done=true;floatText(canvas,`${s}%`,stars?'#d83071':'#7d4fbf');
      if(stars)win(stars,'Gorgeous nail!',`${config.name}: ${s}% match.`);else{shake(canvas);lose('Almost there',`${s}% match. You need ${config.goal}% or more.`);}
    }
  });
  redraw();return ()=>life.dispose();
}
