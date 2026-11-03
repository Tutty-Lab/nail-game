// Copy the static game into www/ for Capacitor. No bundler needed.
import {cp,rm,mkdir} from 'node:fs/promises';
const out=new URL('../www/',import.meta.url);
await rm(out,{recursive:true,force:true});await mkdir(out);
for(const entry of ['index.html','style.css','app.js','engine.js','art.js','backdrop.js','motion.js','progress.js','feedback.js','music.js','arcade','vendor'])
  await cp(new URL(`../${entry}`,import.meta.url),new URL(entry,out),{recursive:true,filter:src=>!src.endsWith('.test.js')});
console.log('Web assets copied to www/');
