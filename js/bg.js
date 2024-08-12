import gameOfLife from './gameOfLife.js';
///////////
// Setup //
///////////

//<-- Creating Main Canvas -->//

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);


//<-- Resize event -->//
const resize = ()=>{
  const newSize = gameOfLife.resize(window.innerWidth,window.innerHeight, 2);
  canvas.width = newSize.w;
  canvas.height = newSize.h;
}
window.addEventListener('resize', resize);
resize();


//<-- Rendering background -->//
const renderBg = ()=>{
  //ctx.drawImage(gameOfLife.frame(),0,0);
  requestAnimationFrame(renderBg);
}
renderBg();
