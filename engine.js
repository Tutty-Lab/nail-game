export const overlaps = (a,b) => Math.abs(a.x-b.x)<.98 && Math.abs(a.y-b.y)<.98;
export const MAX_LEVEL = 5;
export const clampLevel = level => Math.min(MAX_LEVEL, Math.max(1, Math.floor(Number(level)) || 1));
export const available = (tiles,tile) => !tiles.some(other=>other.z>tile.z && overlaps(other,tile));
export function makeFinalBoard() {
  const tiles=[];
  const add=(x,y,z,type,section)=>tiles.push({id:tiles.length,x,y,z,type,section});
  // The outer triples use types 4–7, disjoint from the central lock.
  const rim=[];
  for(let y=0;y<6;y++) for(let x=0;x<6;x++)
    if(x===0||x===5||y===0||y===5) rim.push({x,y});
  rim.slice(1,-1).forEach(({x,y},i)=>{
    for(let z=0;z<3;z++) add(x,y,z,4+i%4,'outer');
  });
  // A strictly ordered stack. Each image still has a multiple of 3 copies.
  // Its first seven picks are 0,1,2,0,1,2,3: none can clear a triple.
  // The missing matches are all below that barrier, so a 7-slot tray must lose.
  const topToBottom=[0,1,2,0,1,2,3,0,1,2,3,3];
  [...topToBottom].reverse().forEach((type,z)=>add(1.8+z*.09,1.8+z*.09,z+3,type,'lock'));
  return tiles;
}
export function makeBoard(level=1, random=Math.random) {
  level=clampLevel(level);
  if(level===MAX_LEVEL) return makeFinalBoard();
  const tiles=[];
  const sizes = level===1 ? [4,3,2] : level===2 ? [5,4,3] : [6,5,4];
  sizes.forEach((size,z)=>{
    for(let y=0;y<size;y++) for(let x=0;x<size;x++)
      tiles.push({id:tiles.length,x:x+(6-size)/2,y:y+(6-size)/2,z,type:0});
  });
  // Remove corner positions so every board contains complete triples.
  while(tiles.length%3) tiles.shift();
  const remaining=[...tiles], solution=[];
  while(remaining.length){
    const open=remaining.filter(t=>available(remaining,t));
    const next=open[Math.floor(random()*open.length)];
    solution.push(next); remaining.splice(remaining.indexOf(next),1);
  }
  // A legal top-to-bottom path with consecutive triples guarantees a solution.
  for(let i=0;i<solution.length;i+=3){
    const type=Math.floor(random()*8);
    solution.slice(i,i+3).forEach(t=>t.type=type);
  }
  return tiles;
}
function randomizeTiles(tiles,random) {
  const types=tiles.map(t=>t.type);
  for(let i=types.length-1;i>0;i--){
    const j=Math.floor(random()*(i+1));
    [types[i],types[j]]=[types[j],types[i]];
  }
  return tiles.map((tile,i)=>({...tile,type:types[i]}));
}
export function shuffleBoard(state, random=Math.random) {
  if(state.level===MAX_LEVEL||state.status!=='playing'||state.tiles.length<2) return state;
  return {...state,tiles:randomizeTiles(state.tiles,random)};
}
export function createState(level=1,random=Math.random) {
  level=clampLevel(level);
  return {level,tiles:makeBoard(level,random),tray:[],score:0,status:'playing'};
}
export function pick(state,id) {
  if(state.status!=='playing') return state;
  const tile=state.tiles.find(t=>t.id===id);
  if(!tile || !available(state.tiles,tile)) return state;
  let tray=[...state.tray,tile];
  const matched=tray.filter(t=>t.type===tile.type).length===3;
  if(matched) tray=tray.filter(t=>t.type!==tile.type);
  const tiles=state.tiles.filter(t=>t.id!==id);
  const status=tray.length>=7?'lost':!tiles.length&&!tray.length?'won':'playing';
  return {...state,tiles,tray,score:state.score+(matched?30:0),status};
}
