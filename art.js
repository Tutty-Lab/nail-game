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
  ];
  return `<svg viewBox="0 0 96 96" aria-hidden="true"><defs>
   <linearGradient id="${id}-pink" x2=".8" y2="1"><stop stop-color="#ffb9d7"/><stop offset=".5" stop-color="#f76eaa"/><stop offset="1" stop-color="#df3f7d"/></linearGradient>
   <linearGradient id="${id}-cap" x2="1" y2=".5"><stop stop-color="#674364"/><stop offset=".45" stop-color="#986b8b"/><stop offset="1" stop-color="#49324e"/></linearGradient>
   <linearGradient id="${id}-aqua" x2=".6" y2="1"><stop stop-color="#b3fff2"/><stop offset=".5" stop-color="#66d4d6"/><stop offset="1" stop-color="#329cba"/></linearGradient>
   <linearGradient id="${id}-violet" x2=".7" y2="1"><stop stop-color="#ead7ff"/><stop offset=".6" stop-color="#c49ce5"/><stop offset="1" stop-color="#a475c6"/></linearGradient>
   <linearGradient id="${id}-gold" x2=".7" y2="1"><stop stop-color="#fff1af"/><stop offset=".5" stop-color="#ffda79"/><stop offset="1" stop-color="#e9a843"/></linearGradient>
   <linearGradient id="${id}-peach" x2="1" y2="1"><stop stop-color="#ffe1c8"/><stop offset="1" stop-color="#eea2b4"/></linearGradient>
  </defs>${illustrations[type]}</svg>`;
}

export function collectionArt() {
  return `<div class="collection-art" aria-hidden="true"><div class="art-orbit"></div><span class="art-spark spark-one">✦</span><span class="art-spark spark-two">✧</span><div class="display-tile display-back">${art(2)}</div><div class="display-tile display-left">${art(7)}</div><div class="display-tile display-front">${art(0)}</div><span class="mini-pill">3 matching tiles = 1 set!</span></div>`;
}
