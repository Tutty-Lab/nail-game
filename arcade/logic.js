export function shuffled(items,random=Math.random){
  const result=[...items];
  for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
  return result;
}
export const adjacent=(a,b,size=6)=>Math.abs(a-b)===size || (Math.floor(a/size)===Math.floor(b/size)&&Math.abs(a-b)===1);
export function findMatches(board,size=6){
  const found=new Set();
  for(let r=0;r<size;r++)for(let c=0;c<size;c++){
    const i=r*size+c;
    if(board[i]===null)continue;
    for(const step of [1,size]){
      if(step===1&&c>size-3||step===size&&r>size-3)continue;
      if(board[i]===board[i+step]&&board[i]===board[i+step*2]){
        let n=i;
        while(n<board.length&&(step!==1||Math.floor(n/size)===r)&&board[n]===board[i]){found.add(n);n+=step;}
      }
    }
  }
  return [...found];
}
export function swap(board,a,b){const copy=[...board];[copy[a],copy[b]]=[copy[b],copy[a]];return copy;}
export function legalMoves(board,size=6){
  const moves=[];
  for(let a=0;a<board.length;a++)for(const b of [a+1,a+size])
    if(b<board.length&&adjacent(a,b,size)&&findMatches(swap(board,a,b),size).length)moves.push([a,b]);
  return moves;
}
export function makeMatchBoard(random=Math.random,size=6){
  const board=[];
  for(let i=0;i<size*size;i++){
    const choices=[0,1,2,3,4,5].filter(type=>!(i%size>=2&&board[i-1]===type&&board[i-2]===type)&&!(i>=size*2&&board[i-size]===type&&board[i-size*2]===type));
    board.push(choices[Math.floor(random()*choices.length)]);
  }
  // Guaranteed legal swap, without an initial match.
  board[0]=0;board[1]=1;board[2]=0;board[size+1]=0;
  if(findMatches(board,size).length || !legalMoves(board,size).length){
    const fixed=Array.from({length:size*size},(_,i)=>(Math.floor(i/size)*2+i%size)%6);
    fixed[0]=0;fixed[1]=1;fixed[2]=0;fixed[size+1]=0;return fixed;
  }
  return board;
}
export function collapse(board,matched,random=Math.random,size=6){
  const result=[...board],removed=new Set(matched);
  for(let c=0;c<size;c++){
    const kept=[];for(let r=size-1;r>=0;r--)if(!removed.has(r*size+c))kept.push(board[r*size+c]);
    for(let r=size-1;r>=0;r--)result[r*size+c]=kept[size-1-r]??Math.floor(random()*6);
  }
  return result;
}
export function mixColor(weights){
  const pigments=[[244,72,121],[51,130,219],[255,217,64]];
  const total=weights.reduce((a,b)=>a+b,0);
  return [0,1,2].map(c=>total?Math.round(weights.reduce((sum,w,i)=>sum+w*pigments[i][c],0)/total):255);
}
export const colorAccuracy=(a,b)=>Math.max(0,Math.round(100-100*Math.hypot(...a.map((v,i)=>v-b[i]))/Math.sqrt(3*255**2)));
export const designScore=(actual,target)=>Math.round(actual.reduce((sum,n,i)=>sum+Number(n.color===target[i].color)+Number(n.decor===target[i].decor),0)/target.length/2*100);
