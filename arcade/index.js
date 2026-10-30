import {design,mixing} from './design.js';
import {memory} from './memory.js';
import {match3} from './match3.js';
import {puzzle,differences} from './puzzles.js';
import {catching} from './catch.js';
import {salon} from './salon.js';
export const modes={
  1:{title:'Nail Designer',hint:'Pick a finger, a polish color, and a decoration. Save your manicure when you finish.',mount:design},
  2:{title:'Memory Match',hint:'Flip two cards at a time. Find all 8 matching pairs to win.',mount:memory},
  3:{title:'Polish Pop',hint:'Tap two neighboring tiles to swap them. Reach 600 points in 20 moves. Swaps without a match do not cost a move.',mount:match3},
  4:{title:'Copy the Look',hint:'Study the design for 8 seconds, then recreate all 5 nail colors and decorations. Check your score when ready.',mount:root=>design(root,{copy:true})},
  5:{title:'Color Lab',hint:'Adjust the pink, blue, and yellow pigments to match the target shade. Tap Compare colors to see your score.',mount:mixing},
  6:{title:'Polish Catch',hint:'Drag the basket or use the left/right buttons or arrow keys. Catch polish and avoid bottles marked ×. Missing a good bottle or catching a broken one costs a life. You have 3 lives and 45 seconds.',mount:catching},
  7:{title:'Nail Jigsaw',hint:'Tap two pieces to swap them. Assemble all 9 pieces using the preview. Piece numbers show their correct positions, left to right and top to bottom.',mount:puzzle},
  8:{title:'Spot the Difference',hint:'Compare the boards and select the 3 differences on the right. Five incorrect guesses end the game.',mount:differences},
  9:{title:'Mini Nail Salon',hint:'Select a customer, match their requested color and service, then complete the order. Serve 8 customers in 60 seconds. The game ends if 3 customers leave.',mount:salon}
};
