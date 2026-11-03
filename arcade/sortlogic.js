// Polish Sort: pour layers between bottles until each bottle holds one color.
export const SORT_LEVELS=60,CAPACITY=4;
export function seeded(seed){let a=seed>>>0;return ()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}
export function sortConfig(level){
  return {colors:Math.min(10,3+Math.floor((level-1)/5)),empty:2,hidden:level>=21,extra:level>40?0:1};
}
export const top=bottle=>bottle[bottle.length-1];
export function topRun(bottle){let n=0;const t=top(bottle);for(let i=bottle.length-1;i>=0&&bottle[i]===t;i--)n++;return n;}
export const canPour=(bottles,from,to)=>from!==to&&bottles[from].length>0&&bottles[to].length<CAPACITY&&(!bottles[to].length||top(bottles[to])===top(bottles[from]));
export function pour(bottles,from,to){
  if(!canPour(bottles,from,to))return null;
  const next=bottles.map(b=>[...b]),amount=Math.min(topRun(next[from]),CAPACITY-next[to].length);
  for(let i=0;i<amount;i++)next[to].push(next[from].pop());
  return {bottles:next,amount};
}
export const solvedBottle=b=>!b.length||(b.length===CAPACITY&&b.every(c=>c===b[0]));
export const isSolved=bottles=>bottles.every(solvedBottle);
const key=bottles=>bottles.map(b=>b.join(',')).sort().join('|');
// Depth-first search with memo; returns a move list or null when the budget runs out.
export function solve(bottles,budget=150000){
  const seen=new Set(),path=[];let nodes=0;
  const dfs=state=>{
    if(isSolved(state))return true;
    if(++nodes>budget)return false;
    const k=key(state);if(seen.has(k))return false;seen.add(k);
    for(let from=0;from<state.length;from++){
      const source=state[from];if(!source.length||solvedBottle(source)&&source.length===CAPACITY)continue;
      const run=topRun(source);
      for(let to=0;to<state.length;to++){
        if(!canPour(state,from,to))continue;
        // Moving a whole single-color bottle into an empty one is pointless.
        if(!state[to].length&&run===source.length)continue;
        const next=pour(state,from,to);path.push([from,to]);
        if(dfs(next.bottles))return true;path.pop();
      }
    }
    return false;
  };
  return dfs(bottles)?path:null;
}
export function makeSortLevel(level){
  const {colors,empty}=sortConfig(level),random=seeded(level*7919+13);
  for(let attempt=0;attempt<60;attempt++){
    const units=[];for(let c=0;c<colors;c++)for(let i=0;i<CAPACITY;i++)units.push(c);
    for(let i=units.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[units[i],units[j]]=[units[j],units[i]];}
    const bottles=Array.from({length:colors},(_,i)=>units.slice(i*CAPACITY,(i+1)*CAPACITY));
    for(let i=0;i<empty;i++)bottles.push([]);
    if(bottles.some(b=>b.length&&solvedBottle(b)))continue;
    if(solve(bottles))return bottles;
  }
  throw new Error(`No solvable layout for level ${level}`);
}
