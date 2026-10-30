import test from 'node:test';
import assert from 'node:assert/strict';
import {findMatches,makeMatchBoard,legalMoves,collapse,swap,adjacent,mixColor,colorAccuracy,designScore,shuffled} from './logic.js';
test('match-three detects rows, columns, crosses and never wraps rows',()=>{
 const board=Array.from({length:36},(_,i)=>i);
 board[0]=board[1]=board[2]=90;board[7]=board[13]=board[19]=91;
 assert.deepEqual(findMatches(board).sort((a,b)=>a-b),[0,1,2,7,13,19]);
 const wrapped=Array.from({length:36},(_,i)=>i);wrapped[5]=wrapped[6]=wrapped[7]=90;
 assert.deepEqual(findMatches(wrapped),[]);assert.equal(adjacent(5,6),false);
});
test('new match-three boards have no matches and at least one valid move',()=>{
 for(let seed=1;seed<=100;seed++){
  let n=seed;const random=()=>((n=(n*1664525+1013904223)>>>0)/2**32);
  const board=makeMatchBoard(random);assert.equal(findMatches(board).length,0);
  const moves=legalMoves(board);assert.ok(moves.length);
  assert.ok(findMatches(swap(board,...moves[0])).length>=3);
 }
 for(const value of [0,.99])assert.equal(findMatches(makeMatchBoard(()=>value)).length,0);
});
test('collapse keeps column order and fills only removed positions',()=>{
 const board=Array.from({length:36},(_,i)=>i);
 const next=collapse(board,[24,30],()=>.5);
 assert.deepEqual([0,6,12,18,24,30].map(i=>next[i]),[3,3,0,6,12,18]);
 for(let i=0;i<36;i++)if(i%6!==0)assert.equal(next[i],board[i]);
 assert.equal(board[30],30);
});
test('mixing is ratio based; color and nail scores match exact targets',()=>{
 assert.deepEqual(mixColor([0,0,0]),[255,255,255]);
 assert.deepEqual(mixColor([1,2,3]),mixColor([2,4,6]));
 assert.equal(colorAccuracy([1,2,3],[1,2,3]),100);
 assert.equal(colorAccuracy([0,0,0],[255,255,255]),0);
 const nails=Array.from({length:5},()=>({color:1,decor:2}));
 assert.equal(designScore(nails,nails),100);
 assert.equal(designScore(nails,nails.map(n=>({...n,decor:0}))),50);
});
test('shuffling preserves all pieces without mutating input',()=>{
 const values=[0,1,2,3,4,5,6,7,8];const next=shuffled(values,()=>0);
 assert.deepEqual([...next].sort(),values);assert.notDeepEqual(next,values);
});
