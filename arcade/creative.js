// Pure logic shared by the two creative games.
import {seeded} from './sortlogic.js';
export const pigments=[['Rose','#f2468a'],['Ocean','#2f7fd6'],['Sun','#ffd23f'],['Cloud','#ffffff'],['Ink','#2b2233'],['Lilac','#9b6ad6']];
const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
export const hex=c=>'#'+c.map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
// Average of the drops in RGB; an empty mix is bare nail.
export function mix(drops){
  const total=drops.reduce((a,b)=>a+b,0);if(!total)return [248,232,226];
  return [0,1,2].map(c=>drops.reduce((sum,n,i)=>sum+n*rgb(pigments[i][1])[c],0)/total);
}
export const accuracy=(a,b)=>Math.max(0,Math.round(100-100*Math.hypot(...a.map((v,i)=>v-b[i]))/Math.sqrt(3*255**2)*2.2));
export const MIXER_LEVELS=24;
export function mixerLevel(level){
  const random=seeded(level*104729+7),bands=Math.min(5,1+Math.ceil(level/5)),available=level<5?3:level<12?4:level<18?5:6,maxDrops=level<8?3:4;
  const recipes=[];
  while(recipes.length<bands){
    const drops=Array(available).fill(0);let used=0;
    for(let i=0;i<available;i++)if(random()<.55){drops[i]=1+Math.floor(random()*maxDrops);used++;}
    if(used<2)continue;
    // Keep neighbouring bands visibly different.
    if(recipes.length&&accuracy(mix(drops),mix(recipes.at(-1)))>88)continue;
    recipes.push(drops);
  }
  return {bands,available,recipes,targets:recipes.map(mix),limit:recipes.reduce((s,r)=>s+r.reduce((a,b)=>a+b,0),0)+bands*2};
}
export const mixerStars=score=>score>=97?3:score>=92?2:score>=85?1:0;

// Polish Painter: target designs drawn on a nail-shaped grid of cells.
export const PAINTER_LEVELS=24;
export const GRID=[20,30];
export const palettes=[['#f8e8e2','#f26ba2','#ffffff'],['#f8e8e2','#9868c9','#ffd23f'],['#f8e8e2','#53bbaa','#ffffff','#f26ba2'],['#f8e8e2','#2b2233','#f5bf58','#ffffff'],['#f8e8e2','#e2367a','#69a7df','#ffffff','#ffd23f']];
const designs=[
  ['Classic solid',(x,y)=>1],
  ['French tip',(x,y)=>y<7?2:1],
  ['Two-tone split',(x,y)=>x<10?1:2],
  ['Half moon',(x,y)=>Math.hypot(x-9.5,y-30)<9?0:1],
  ['Candy stripes',(x,y)=>Math.floor(y/5)%2?1:2],
  ['Diagonal',(x,y)=>x+y*.6<20?1:2],
  ['Polka dots',(x,y)=>Math.hypot((x%7)-3,(y%7)-3)<2.2?2:1],
  ['Color block',(x,y)=>y<10?1:y<20?2:3],
  ['Heart',(x,y)=>{const u=(x-9.5)/7,v=(16-y)/7;return (u*u+v*v-1)**3-u*u*v*v*v<0?3:1;}],
  ['Chevron',(x,y)=>(y+Math.abs(x-9.5)*.8)%10<5?1:2],
  ['Reverse French',(x,y)=>y>23?2:1],
  ['Checker',(x,y)=>(Math.floor(x/5)+Math.floor(y/5))%2?1:3]
];
export function painterLevel(level){
  const palette=palettes[Math.min(palettes.length-1,Math.floor((level-1)/5))],[name,draw]=designs[(level-1)%designs.length];
  const cells=[];for(let y=0;y<GRID[1];y++)for(let x=0;x<GRID[0];x++)cells.push(Math.min(palette.length-1,draw(x,y)));
  // Goals count only the detail work: a single "fill nail" scores the baseline and never passes.
  const base=Math.max(...palette.map((_,c)=>compare(cells.map(()=>c),cells)));
  return {name,palette,cells,base,goal:base===100?100:Math.round(base+(100-base)*Math.min(.75,.45+level*.013))};
}
// The nail outline: a rounded tip on top, straight sides, flat cuticle at the bottom.
export function inNail(x,y){
  const [w,h]=GRID,cx=(w-1)/2,rx=w/2-.5,top=rx;
  if(x<0||x>=w||y<0||y>=h)return false;
  if(y<top)return ((x-cx)/rx)**2+((y-top)/top)**2<=1.02;
  return y<h-.5;
}
export function compare(painted,target){
  let hit=0,total=0;
  for(let y=0;y<GRID[1];y++)for(let x=0;x<GRID[0];x++){if(!inNail(x,y))continue;const i=y*GRID[0]+x;total++;if(painted[i]===target[i])hit++;}
  return Math.round(hit/total*100);
}
export const painterStars=(score,goal)=>score>=goal+(100-goal)*.75?3:score>=goal+(100-goal)*.4?2:score>=goal?1:0;
