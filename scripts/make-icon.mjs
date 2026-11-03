// Render the 1024px App Store icon and launch splash from the game's own SVG art.
import sharp from 'sharp';
import {art} from '../art.js';
const inner=art(0).replace('<svg viewBox="0 0 96 96" aria-hidden="true">','').replace(/<\/svg>$/,'');
const icon=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><defs><radialGradient id="bg" cx=".3" cy=".2" r="1"><stop stop-color="#ffe4ef"/><stop offset=".6" stop-color="#f9c6dc"/><stop offset="1" stop-color="#e98bb5"/></radialGradient></defs><rect width="1024" height="1024" fill="url(#bg)"/><circle cx="512" cy="540" r="330" fill="#fff" opacity=".55"/><g transform="translate(152 150) scale(7.5)">${inner}</g><path d="m800 190 18 48 48 18-48 18-18 48-18-48-48-18 48-18z" fill="#fff"/><path d="m210 760 10 26 26 10-26 10-10 26-10-26-26-10 26-10z" fill="#fff" opacity=".8"/></svg>`;
await sharp(Buffer.from(icon)).flatten({background:'#ffe4ef'}).png().toFile('ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png');
const splash=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2732 2732"><rect width="2732" height="2732" fill="#fff1f5"/><g transform="translate(1066 1000) scale(6)">${inner}</g><text x="1366" y="1720" text-anchor="middle" font-family="Arial Rounded MT Bold,Arial" font-weight="bold" font-size="150" fill="#563448">nail<tspan fill="#e74b86">play</tspan></text></svg>`;
for(const name of ['splash-2732x2732.png','splash-2732x2732-1.png','splash-2732x2732-2.png'])
  await sharp(Buffer.from(splash)).png().toFile(`ios/App/App/Assets.xcassets/Splash.imageset/${name}`);
console.log('Icon and splash written');
