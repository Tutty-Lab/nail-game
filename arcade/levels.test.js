import test from 'node:test';
import assert from 'node:assert/strict';
import {SORT_LEVELS,CAPACITY,makeSortLevel,solve,pour,isSolved,canPour} from './sortlogic.js';
import {slideLine,move,canMove} from './merge.js';
import {popConfig,POP_LEVELS} from './match3.js';
import {memoryConfig,MEMORY_LEVELS} from './memory.js';
test('every Polish Sort level is solvable and replaying the solution clears it',()=>{
 for(let level=1;level<=SORT_LEVELS;level++){
  const bottles=makeSortLevel(level);
  assert.deepEqual(makeSortLevel(level),bottles,'levels are deterministic');
  const counts={};bottles.flat().forEach(c=>counts[c]=(counts[c]||0)+1);
  assert.ok(Object.values(counts).every(n=>n===CAPACITY));
  let state=bottles;for(const [from,to] of solve(bottles))state=pour(state,from,to).bottles;
  assert.ok(isSolved(state),`level ${level}`);
 }
});
test('pouring moves only the matching top run and respects capacity',()=>{
 const result=pour([[0,1,1],[1,1],[2]],0,1);
 assert.deepEqual(result.bottles,[[0],[1,1,1,1],[2]]);assert.equal(result.amount,2);
 assert.equal(canPour([[0],[1]],0,1),false);assert.equal(pour([[0],[0,0,0,0]],0,1),null);
});
test('merge slides, merges each pair once and scores',()=>{
 assert.deepEqual(slideLine([0,0,0,0]).line,[1,1,null,null]);
 assert.deepEqual(slideLine([null,1,null,1]).line,[2,null,null,null]);
 assert.deepEqual(slideLine([1,1,2,null]).line,[2,2,null,null]);
 assert.equal(slideLine([0,0,null,null]).gained,4);
 assert.equal(move([0,null,null,null,...Array(12).fill(null)],'left').changed,false);
 assert.equal(canMove([0,1,0,1,1,0,1,0,0,1,0,1,1,0,1,0]),false);
});
test('level curves get harder',()=>{
 assert.ok(popConfig(POP_LEVELS).target>popConfig(1).target);
 assert.ok(memoryConfig(MEMORY_LEVELS).pairs>memoryConfig(1).pairs);
});
import {MIXER_LEVELS,mixerLevel,mix,accuracy,PAINTER_LEVELS,painterLevel,compare,inNail,GRID} from './creative.js';
test('every mixer target is reachable with the offered pigments and bands differ',()=>{
 for(let level=1;level<=MIXER_LEVELS;level++){
  const l=mixerLevel(level);assert.equal(l.targets.length,l.bands);
  l.recipes.forEach((r,i)=>{assert.equal(r.length,l.available);assert.equal(accuracy(mix(r),l.targets[i]),100);});
  assert.deepEqual(mixerLevel(level).recipes,l.recipes);
 }
 assert.ok(mixerLevel(24).bands>mixerLevel(1).bands);
});
test('painter targets use only their palette and a perfect copy scores 100',()=>{
 for(let level=1;level<=PAINTER_LEVELS;level++){
  const l=painterLevel(level);assert.equal(l.cells.length,GRID[0]*GRID[1]);
  assert.ok(l.cells.every(c=>c>=0&&c<l.palette.length));
  assert.equal(compare(l.cells,l.cells),100);
  assert.ok(new Set(l.cells.filter((_,i)=>inNail(i%GRID[0],Math.floor(i/GRID[0])))).size>=1);
 }
 assert.ok(compare(Array(600).fill(0),painterLevel(2).cells)<100);
});
test('a single fill never passes a painter level with details',()=>{
 for(let level=1;level<=PAINTER_LEVELS;level++){
  const l=painterLevel(level);if(l.base===100)continue;
  assert.ok(l.palette.every((_,c)=>compare(l.cells.map(()=>c),l.cells)<l.goal),`level ${level}`);
 }
});
