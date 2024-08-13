import gameOfLife from './gameOfLife.js';
import waves from './waves.js';

///////////
// Setup //
///////////

//<-- Creating Main Canvas -->//

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);


//<-- Resize event -->//
const resize = ()=>{
  const newSize = gameOfLife.resize(window.innerWidth,window.innerHeight, 4);
  canvas.width = newSize.w;
  canvas.height = newSize.h;
}
window.addEventListener('resize', resize);
resize();


//<-- Rendering background -->//
const renderBg = ()=>{
  //ctx.drawImage(gameOfLife.frame(),0,0);
  ctx.drawImage(waves.frame(gameOfLife.frame()),0,0);
  requestAnimationFrame(renderBg);
}
renderBg();
