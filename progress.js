// Local-only progress. Nothing leaves the device.
const KEY='nail-play-progress-v1';
let data={};
try{data=JSON.parse(localStorage.getItem(KEY))||{};}catch{data={};}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(data));}catch{}};
const game=id=>(data[id]??={unlocked:1,stars:{},best:0});
export const unlocked=id=>game(id).unlocked;
export const stars=(id,level)=>game(id).stars[level]||0;
export const totalStars=id=>Object.values(game(id).stars).reduce((a,b)=>a+b,0);
export function complete(id,level,earned=1){
  const g=game(id);g.stars[level]=Math.max(g.stars[level]||0,earned);g.unlocked=Math.max(g.unlocked,level+1);save();
}
export const best=id=>game(id).best;
export function record(id,score){const g=game(id);if(score>g.best){g.best=score;save();return true;}return false;}
