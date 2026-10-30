import test from 'node:test';
import assert from 'node:assert/strict';
import {available,makeBoard,pick,createState,shuffleBoard,MAX_LEVEL} from './engine.js';
test('covered tiles cannot be selected; removing the top unlocks the lower tile',()=>{
 const tiles=[{id:0,x:0,y:0,z:0,type:0},{id:1,x:.5,y:.5,z:1,type:1}];
 const s={tiles,tray:[],score:0,status:'playing'};
 assert.equal(available(tiles,tiles[0]),false);assert.equal(pick(s,0),s);
 assert.equal(available(pick(s,1).tiles,tiles[0]),true);
});
test('final board is fixed, finite, balanced and immune to shuffle',()=>{
 const a=createState(5,()=>0), b=createState(99,()=>.9);
 assert.equal(b.level,MAX_LEVEL);assert.equal(a.tiles.length,66);
 assert.deepEqual(a.tiles,b.tiles);assert.equal(shuffleBoard(a),a);
 for(let type=0;type<8;type++)assert.equal(a.tiles.filter(t=>t.type===type).length%3,0);
});
test('final lock has no winning path, including all available branches',()=>{
 const board=createState(5).tiles;
 const lock=board.filter(t=>t.section==='lock');
 const outer=board.filter(t=>t.section==='outer');
 assert.ok(outer.every(t=>t.type>=4));assert.ok(lock.every(t=>t.type<4));
 let visited=0;
 function solve(state){
  visited++;
  if(state.status==='won')return true;
  if(state.status==='lost')return false;
  const open=state.tiles.filter(t=>available(state.tiles,t));
  assert.equal(open.length,1);
  return open.some(t=>solve(pick(state,t.id)));
 }
 assert.equal(solve({level:5,tiles:lock,tray:[],score:0,status:'playing'}),false);
 assert.equal(visited,8);
 // Solving every outer triple cannot supply any of the missing lock matches.
 let state=createState(5);
 for(const top of outer.filter(t=>t.z===2)){
  for(let z=2;z>=0;z--){const t=state.tiles.find(t=>t.section==='outer'&&t.x===top.x&&t.y===top.y&&t.z===z);state=pick(state,t.id);}
 }
 assert.equal(state.tray.length,0);assert.equal(state.tiles.length,12);assert.equal(state.score,540);
 for(let i=0;i<7;i++){
  const t=state.tiles.find(t=>available(state.tiles,t));state=pick(state,t.id);
 }
 assert.equal(state.status,'lost');assert.equal(state.tiles.length,5);
});
test('shuffle preserves geometry, tile inventory, tray and score without mutating history',()=>{
 const state=createState(3);state.tray=[{id:100,type:4}];state.score=60;
 const before=structuredClone(state);
 const next=shuffleBoard(state,()=>0);
 assert.deepEqual(state,before);assert.equal(next.tray,state.tray);assert.equal(next.score,60);
 assert.deepEqual(next.tiles.map(({id,x,y,z})=>({id,x,y,z})),state.tiles.map(({id,x,y,z})=>({id,x,y,z})));
 assert.deepEqual(next.tiles.map(t=>t.type).sort(),state.tiles.map(t=>t.type).sort());
 assert.equal(shuffleBoard({...state,status:'lost'}).status,'lost');
});
test('triple clears before capacity is checked, including seventh slot',()=>{
 const tray=[0,1,2,3,4,4].map((type,id)=>({type,id}));
 const next=pick({tiles:[{id:8,x:0,y:0,z:0,type:4}],tray,score:0,status:'playing'},8);
 assert.equal(next.tray.length,4);assert.equal(next.score,30);assert.equal(next.status,'playing');
});
test('seven unmatched tiles lose; final triple wins',()=>{
 const tiles=[{id:9,x:0,y:0,z:0,type:7}];
 assert.equal(pick({tiles,tray:[0,1,2,3,4,5].map(type=>({type})),score:0,status:'playing'},9).status,'lost');
 assert.equal(pick({tiles,tray:[{type:7},{type:7}],score:0,status:'playing'},9).status,'won');
});
test('generated boards have a legal winning path across all difficulty levels',()=>{
 for(let level=1;level<=4;level++)for(let run=0;run<20;run++){
  let seed=run+1;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
  const board=makeBoard(level,random);let state={tiles:board,tray:[],score:0,status:'playing'};
  seed=run+1;const remaining=[...board];
  while(remaining.length){const open=remaining.filter(t=>available(remaining,t));const t=open[Math.floor(random()*open.length)];state=pick(state,t.id);remaining.splice(remaining.indexOf(t),1);assert.notEqual(state.status,'lost');}
  assert.equal(state.status,'won');
 }
});
