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
  const r = window.innerWidth > window.innerHeight ? window.innerWidth : window.innerHeight; 
  const newSize = gameOfLife.resize(r,3);
  canvas.width = newSize;
  canvas.height = newSize;
  console.log(newSize);
}
window.addEventListener('resize', resize);
resize();


//<-- Rendering background -->//
const renderBg = ()=>{
  ctx.drawImage(gameOfLife.frame(),0,0);
  requestAnimationFrame(renderBg);
}
renderBg();
