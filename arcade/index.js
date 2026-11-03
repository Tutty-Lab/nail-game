import {memory} from './memory.js';
import {match3} from './match3.js';
import {catching} from './catch.js';
import {sorting} from './sort.js';
import {merging} from './merge.js';
import {painting} from './painter.js';
import {mixing} from './mixer.js';
export const modes={
  painter:{title:'Polish Painter',hint:'Copy the design brief by painting with your finger. Choose a color and brush size, use Fill nail for the base, and the bare-nail swatch to erase. Peek shows your current match. Reach the goal percentage to pass; higher matches earn more stars. 24 levels.',mount:painting},
  mixer:{title:'Gradient Mixer',hint:'Recreate the target ombre. Choose a band, then tap pigments to drip them in; the band color is the mix of its drops. You have a limited number of drops. Compare when ready: 85% earns one star, 92% two, 97% three. Early levels show a live match percentage. 24 levels.',mount:mixing},
  sort:{title:'Polish Sort',hint:'Tap a bottle, then tap another to pour. Polish only stacks on the same color or into an empty bottle. Fill every bottle with a single color. Grey layers are hidden until uncovered. 60 levels; fewer tools used means more stars.',mount:sorting},
  merge:{title:'Polish Merge',hint:'Swipe or use the arrow keys. Every item slides; two matching items merge into the next item on the ladder. Reach the crown before the board fills. Your best score is saved on this device.',mount:merging},
  pop:{title:'Polish Pop',hint:'Tap two neighboring tiles to swap them. Reach the score goal before moves run out; some levels also ask you to collect a marked item. Chain reactions multiply points. 30 levels.',mount:match3},
  memory:{title:'Memory Match',hint:'Flip two cards at a time and find every pair. Early levels let you peek first; later levels add more cards and a move limit. 20 levels.',mount:memory},
  catch:{title:'Polish Catch',hint:'Drag the basket or use the arrow keys. Catch polish, avoid bottles marked ×. Gold stars give +50, hearts restore a life. Reach the target score before time runs out. 20 levels.',mount:catching}
};
