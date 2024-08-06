const cWidth = 64;
const cHeight = 64;

// setup
const canv = document.createElement('canvas');
canv.width = cWidth;
canv.height = cHeight;
document.body.appendChild(canv);
canv.style = `
position: fixed;
top:0;
left:0;
z-index: -1;
filter: opacity(80%) blur(3px);
width: 200%;
image-rendering: pixelated;
`;
const ctx = canv.getContext('2d');
const bgImg = ctx.getImageData(0,0,cWidth,cHeight);
const bgData = new Uint8ClampedArray(
  cWidth * cHeight * 4
);

/////////////////////////////////
const drawFrame = (f)=>{
  bgData.set(f);
  bgImg.data.set(bgData);
  ctx.putImageData(bgImg,0,0);
}
const startWorld = ()=>{
  const f = new Uint8ClampedArray(
    cWidth * cHeight * 4
  );
  const newColor = [64 + Math.random() * 128, 64 + Math.random() * 128, 64 + Math.random() * 128];
  for(let i=0;i<cWidth*cHeight;i++){
    f.set(
      Math.random()>.80?[...newColor,255]:[...newColor,0],
      i*4
    );
  }
  drawFrame(f);
  setTimeout(startWorld, 20000);
}
startWorld();

// next frame

const readArea = (id)=>{
  let pop = 0;
  let x = id + cWidth;
  let y = Math.floor(id/cWidth) + cHeight;
  const alive = !!bgData[(x % cWidth + (y % cHeight) * cWidth) * 4 + 3];
  for(let i = -1; i < 2; i++){
    for(let j = -1; j < 2; j++){
      pop += !!bgData[((x + i) % cWidth + ((y + j) % cHeight) * cWidth) * 4 + 3];
    }
  }
  return {pop, alive}
}
const nextFrame = ()=>{
  const newFrame = new Uint8ClampedArray([...bgData]);
  for(let i=0; i<cWidth*cHeight; i++){
    const cell = readArea(i);
    newFrame.set(
      cell.alive ?
        cell.pop < 3 ? [0]: cell.pop > 4 ? [0] : [255] : cell.pop == 3 ? [255] : [0],
      i * 4 + 3
    );
  }
  drawFrame(newFrame);
  setTimeout(nextFrame, 1000/12);
}
nextFrame();
