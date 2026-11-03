// Original vector illustrations. Each instance has its own gradient IDs.
let serial = 0;
export function art(type) {
  const id = `nail-art-${serial++}`;
  const paint = name => `url(#${id}-${name})`;
  const illustrations = [
    `<ellipse cx="48" cy="84" rx="26" ry="5" fill="#ce8aa3" opacity=".2"/>
     <rect x="35" y="9" width="26" height="30" rx="7" fill="${paint('cap')}" stroke="#6f3757" stroke-width="2"/>
     <path d="M41 15v16m7-16v16m7-16v16" stroke="#fff" opacity=".25" stroke-width="2"/>
     <rect x="23" y="35" width="50" height="47" rx="14" fill="${paint('pink')}" stroke="#c13570" stroke-width="2"/>
     <rect x="29" y="40" width="8" height="28" rx="4" fill="white" opacity=".65"/>
     <rect x="39" y="49" width="26" height="21" rx="6" fill="#fff3ed"/>
     <path d="M46 57c-4-5-10 3 6 9 16-6 10-14 6-9l-6 5z" fill="#e95386"/>
     <path d="m73 23 2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#f4bf59"/>`,
    `<ellipse cx="49" cy="84" rx="23" ry="5" fill="#d2a7c5" opacity=".25"/>
     <path d="M24 58V33c0-34 49-34 49 0v25c0 34-49 34-49 0" fill="${paint('pink')}" stroke="#bd3c72" stroke-width="2"/>
     <path d="M31 39V31c0-13 7-20 14-21" stroke="#fff" stroke-width="7" opacity=".75" fill="none" stroke-linecap="round"/>
     <path d="M25 56c17 8 31 1 47-12v15c0 31-47 31-47 0" fill="#fff4ed"/>
     <path d="m49 38 3 8 9 1-7 6 2 9-7-5-8 5 2-9-7-6 9-1z" fill="#f7cf74" stroke="#c79738" stroke-width="1.5"/>
     <circle cx="65" cy="26" r="3" fill="#ffdfaf"/>`,
    `<ellipse cx="48" cy="84" rx="28" ry="5" fill="#8ebbbb" opacity=".25"/>
     <path d="m27 14 43 0 17 23-39 47L9 37z" fill="${paint('aqua')}" stroke="#278e9e" stroke-width="2" stroke-linejoin="round"/>
     <path d="m27 14 7 23 14 47 14-47 8-23M9 37h78M27 14l21 23 22-23" fill="none" stroke="#d2fff9" stroke-width="2"/>
     <path d="M10 37h24L27 15z" fill="#c0fff6"/><path d="m48 37 14 0-14 47" fill="#319db5" opacity=".7"/>
     <path d="m76 6 2 7 7 2-7 2-2 7-2-7-7-2 7-2z" fill="#fff"/>`,
    `<ellipse cx="49" cy="85" rx="27" ry="4" fill="#d1a0bd" opacity=".25"/>
     <g transform="rotate(30 48 48)"><rect x="40" y="38" width="17" height="49" rx="8" fill="${paint('violet')}" stroke="#8c5dac" stroke-width="2"/>
     <rect x="39" y="29" width="19" height="17" rx="4" fill="${paint('gold')}" stroke="#b58a45" stroke-width="1.5"/>
     <path d="M39 31V15c0-12 19-12 19 0v16z" fill="${paint('cap')}"/><path d="M44 13v15m5-18v18m5-15v15" stroke="#dcaebd" stroke-width="2"/>
     <path d="M45 51v22" stroke="#fff" opacity=".55" stroke-width="4" stroke-linecap="round"/></g>
     <path d="m20 24 3 7 8 2-8 2-3 8-2-8-8-2 8-2z" fill="#edaccc"/>`,
    `<ellipse cx="48" cy="83" rx="34" ry="5" fill="#bca4ca" opacity=".25"/>
     <path d="M11 62V49c0-39 74-39 74 0v13z" fill="${paint('violet')}" stroke="#9e6eba" stroke-width="2"/>
     <path d="M19 56c0-31 58-31 58 0" stroke="#f8e6ff" stroke-width="5" fill="none"/>
     <path d="M12 59h72v13c0 9-73 9-73 0z" fill="#dcbfe9" stroke="#9e6eba" stroke-width="2"/>
     <path d="M24 68v-9c0-23 48-23 48 0v9z" fill="#5c477d"/>
     <path d="M31 64c0-18 34-18 34 0" stroke="#eaa4ed" stroke-width="5" fill="none"/>
     <rect x="38" y="26" width="21" height="9" rx="4" fill="#fff4ff"/><circle cx="48" cy="30" r="2" fill="#a574c4"/>`,
    `<ellipse cx="47" cy="85" rx="28" ry="4" fill="#c5ab7c" opacity=".2"/>
     <path d="m48 7 11 24 27 4-20 19 5 28-23-14-24 14 5-28L9 35l28-4z" fill="${paint('gold')}" stroke="#cf9339" stroke-width="2" stroke-linejoin="round"/>
     <path d="m48 16-8 21-18 3" fill="none" stroke="#fff4bc" stroke-width="5" stroke-linecap="round"/>
     <path d="m48 44 18 10 5 28-23-14" fill="#eca64b" opacity=".55"/>
     <path d="m78 9 2 6 6 2-6 2-2 7-2-7-6-2 6-2z" fill="#f4c66b"/>`,
    `<ellipse cx="48" cy="84" rx="28" ry="4" fill="#bb9aac" opacity=".2"/>
     <g transform="rotate(32 48 48)"><rect x="34" y="7" width="28" height="80" rx="14" fill="${paint('peach')}" stroke="#cd7b8c" stroke-width="2"/>
     <rect x="39" y="12" width="18" height="69" rx="9" fill="#ffebde" opacity=".6"/>
     <path d="m42 23 11-5m-11 14 11-5m-11 14 11-5m-11 14 11-5m-11 14 11-5m-11 14 11-5m-11 14 11-5" stroke="#d48a9a" stroke-width="2.5" stroke-linecap="round"/>
     </g>`,
    `<ellipse cx="48" cy="84" rx="27" ry="4" fill="#c996af" opacity=".2"/>
     <g fill="${paint('pink')}" stroke="#cb4e80" stroke-width="1.5">
     ${Array.from({length:5},(_,i)=>`<ellipse cx="48" cy="28" rx="14" ry="23" transform="rotate(${i*72} 48 48)"/>`).join('')}</g>
     <circle cx="48" cy="48" r="15" fill="${paint('gold')}" stroke="#d79b43" stroke-width="2"/>
     <circle cx="44" cy="44" r="5" fill="#fff3bd" opacity=".8"/>`
  ,...extras(paint)];
  return `<svg viewBox="0 0 96 96" aria-hidden="true"><defs>
   <linearGradient id="${id}-pink" x2=".8" y2="1"><stop stop-color="#ffb9d7"/><stop offset=".5" stop-color="#f76eaa"/><stop offset="1" stop-color="#df3f7d"/></linearGradient>
   <linearGradient id="${id}-cap" x2="1" y2=".5"><stop stop-color="#674364"/><stop offset=".45" stop-color="#986b8b"/><stop offset="1" stop-color="#49324e"/></linearGradient>
   <linearGradient id="${id}-aqua" x2=".6" y2="1"><stop stop-color="#b3fff2"/><stop offset=".5" stop-color="#66d4d6"/><stop offset="1" stop-color="#329cba"/></linearGradient>
   <linearGradient id="${id}-violet" x2=".7" y2="1"><stop stop-color="#ead7ff"/><stop offset=".6" stop-color="#c49ce5"/><stop offset="1" stop-color="#a475c6"/></linearGradient>
   <linearGradient id="${id}-gold" x2=".7" y2="1"><stop stop-color="#fff1af"/><stop offset=".5" stop-color="#ffda79"/><stop offset="1" stop-color="#e9a843"/></linearGradient>
   <linearGradient id="${id}-peach" x2="1" y2="1"><stop stop-color="#ffe1c8"/><stop offset="1" stop-color="#eea2b4"/></linearGradient>
   <radialGradient id="${id}-shine" cx=".35" cy=".3" r=".8"><stop stop-color="#fff" stop-opacity=".9"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/></radialGradient>
  </defs>${illustrations[type%illustrations.length]}</svg>`;
}

export function collectionArt() {
  return `<div class="collection-art" aria-hidden="true"><div class="art-orbit"></div><span class="art-spark spark-one">✦</span><span class="art-spark spark-two">✧</span><div class="display-tile display-back">${art(2)}</div><div class="display-tile display-left">${art(7)}</div><div class="display-tile display-front">${art(0)}</div><span class="mini-pill">3 matching tiles = 1 set!</span></div>`;
}

// Extra pieces: color variants of the classic bottle and gem, plus new salon items.
const tints=[['#ff9ec4','#e2367a'],['#c9a5f0','#7d4fbf'],['#8fe3d2','#2f9e8c'],['#ffd98a','#e3a02f'],['#ffb39e','#d9583c'],['#a7d2ff','#3d7fd0'],['#e88aa9','#8f2350'],['#f4f0ff','#b7a7d8']];
function extras(paint){
  const bottles=tints.map(([light,dark],i)=>`<ellipse cx="48" cy="85" rx="24" ry="4" fill="${dark}" opacity=".2"/>
     <rect x="38" y="${8+i%2*3}" width="20" height="${28-i%2*3}" rx="${i%3?4:9}" fill="#5c3d59"/>
     <path d="M${i%2?22:26} 44q0-10 22-10t22 10v26q0 14-22 14t-22-14z" fill="${light}" stroke="${dark}" stroke-width="2.5"/>
     <path d="M${i%2?22:26} 58q22 8 44 0v12q0 14-22 14t-22-14z" fill="${dark}" opacity=".55"/>
     <rect x="32" y="44" width="6" height="22" rx="3" fill="#fff" opacity=".7"/>`);
  const gems=tints.slice(0,4).map(([light,dark],i)=>i%2
    ?`<ellipse cx="48" cy="85" rx="24" ry="4" fill="${dark}" opacity=".2"/><path d="M48 82 16 42q-6-18 12-24 12-4 20 10 8-14 20-10 18 6 12 24z" fill="${light}" stroke="${dark}" stroke-width="2.5" stroke-linejoin="round"/><path d="M48 82 34 30m14 52 14-52M18 40h60" stroke="#fff" stroke-width="2" opacity=".7"/><ellipse cx="32" cy="30" rx="6" ry="4" fill="#fff" opacity=".8"/>`
    :`<ellipse cx="48" cy="85" rx="24" ry="4" fill="${dark}" opacity=".2"/><circle cx="48" cy="46" r="32" fill="${light}" stroke="${dark}" stroke-width="2.5"/><path d="m48 14 16 32-16 32-16-32zM16 46h64" fill="none" stroke="#fff" stroke-width="2" opacity=".75"/><circle cx="48" cy="46" r="32" fill="${paint('shine')}"/>`);
  const items=[
    // heart sticker
    `<ellipse cx="48" cy="85" rx="24" ry="4" fill="#c13570" opacity=".2"/><path d="M48 80C8 54 10 22 30 18c10-2 16 4 18 10 2-6 8-12 18-10 20 4 22 36-18 62z" fill="${paint('pink')}" stroke="#fff" stroke-width="5"/><path d="M28 30q4-6 10-4" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".8"/>`,
    // butterfly
    `<ellipse cx="48" cy="85" rx="24" ry="4" fill="#7d4fbf" opacity=".2"/><path d="M46 46C30 14 6 18 12 38c4 12 20 12 34 10zM50 46c16-32 40-28 34-8-4 12-20 12-34 10zM46 50C28 52 16 70 30 76c10 4 14-10 16-26zM50 50c18 2 30 20 16 26-10 4-14-10-16-26z" fill="${paint('violet')}" stroke="#8c5dac" stroke-width="2"/><rect x="45" y="30" width="6" height="46" rx="3" fill="#5c3d59"/><circle cx="26" cy="34" r="5" fill="#fff" opacity=".7"/><circle cx="70" cy="34" r="5" fill="#fff" opacity=".7"/>`,
    // bow
    `<ellipse cx="48" cy="85" rx="26" ry="4" fill="#c13570" opacity=".2"/><path d="M48 46 14 26q-8 20 0 40zM48 46l34-20q8 20 0 40z" fill="${paint('pink')}" stroke="#c13570" stroke-width="2.5" stroke-linejoin="round"/><path d="m42 52-10 28 10-4 6 8 4-30z" fill="#e2367a"/><circle cx="48" cy="46" r="9" fill="#ffb9d7" stroke="#c13570" stroke-width="2.5"/>`,
    // crown
    `<ellipse cx="48" cy="85" rx="28" ry="4" fill="#c79738" opacity=".2"/><path d="m14 30 16 18 18-28 18 28 16-18-6 44H20z" fill="${paint('gold')}" stroke="#c79738" stroke-width="2.5" stroke-linejoin="round"/><rect x="20" y="66" width="56" height="10" rx="4" fill="#e9a843"/><circle cx="48" cy="54" r="6" fill="#f26ba2" stroke="#fff" stroke-width="2"/><circle cx="30" cy="58" r="4" fill="#53bbaa"/><circle cx="66" cy="58" r="4" fill="#9868c9"/>`,
    // lipstick
    `<ellipse cx="48" cy="86" rx="20" ry="4" fill="#a73561" opacity=".2"/><path d="M38 34V18l20-10v26z" fill="#e2367a" stroke="#a73561" stroke-width="2.5" stroke-linejoin="round"/><rect x="34" y="34" width="28" height="14" rx="3" fill="${paint('gold')}" stroke="#c79738" stroke-width="2"/><rect x="30" y="48" width="36" height="36" rx="7" fill="${paint('cap')}"/><rect x="36" y="52" width="5" height="28" rx="2.5" fill="#fff" opacity=".3"/>`,
    // hand mirror
    `<ellipse cx="48" cy="86" rx="22" ry="4" fill="#278e9e" opacity=".2"/><rect x="42" y="56" width="12" height="30" rx="6" fill="${paint('peach')}" stroke="#cd7b8c" stroke-width="2"/><circle cx="48" cy="36" r="27" fill="${paint('peach')}" stroke="#cd7b8c" stroke-width="2.5"/><circle cx="48" cy="36" r="20" fill="${paint('aqua')}"/><path d="M36 30q6-10 16-10" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".85"/>`,
    // nail clipper
    `<ellipse cx="48" cy="86" rx="28" ry="4" fill="#6f5f80" opacity=".2"/><path d="M14 62q34 10 70-22l2 6Q52 80 16 70z" fill="#c9c3dc" stroke="#7d7397" stroke-width="2.5" stroke-linejoin="round"/><path d="M18 56q32 4 64-28l2 8q-30 30-64 28z" fill="#e8e4f4" stroke="#7d7397" stroke-width="2.5" stroke-linejoin="round"/><circle cx="74" cy="40" r="5" fill="${paint('violet')}"/><path d="M20 68Q40 40 74 38" stroke="#f26ba2" stroke-width="4" stroke-linecap="round" fill="none"/>`,
    // moon and stars sticker
    `<ellipse cx="48" cy="85" rx="24" ry="4" fill="#7d4fbf" opacity=".2"/><path d="M56 12a34 34 0 1 0 22 58A28 28 0 0 1 56 12z" fill="${paint('gold')}" stroke="#c79738" stroke-width="2.5"/><path d="m68 20 2 6 6 2-6 2-2 6-2-6-6-2 6-2zM78 44l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z" fill="#9868c9"/><path d="M28 34q4-10 14-14" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".7"/>`
  ];
  return [...bottles,...gems,...items];
}
export const TYPE_COUNT=8+tints.length+4+8;
// Eight-piece sets used by levels, so each stage shows a fresh collection.
export const artSets=[
  [0,1,2,3,4,5,6,7],
  [8,9,10,11,20,21,22,23],
  [12,13,14,15,16,17,18,19],
  [24,25,26,27,0,2,5,7],
  [20,23,24,27,9,13,16,19],
  [1,3,4,6,21,22,25,26]
];
export const artName=type=>['Polish','Pink nail','Gem','Brush','Nail lamp','Star','Nail file','Flower','Pink polish','Lilac polish','Mint polish','Honey polish','Coral polish','Sky polish','Berry polish','Pearl polish','Pink gem','Lilac heart','Mint gem','Gold heart','Heart sticker','Butterfly','Bow','Crown','Lipstick','Mirror','Clipper','Moon'][type]??'Charm';
