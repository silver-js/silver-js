const cWidth = 32;
const cHeight = 32;

// setup
const canv = document.createElement('canvas');
canv.width = cWidth;
canv.height = cHeight;
document.body.appendChild(canv);
const ctx = canv.getContext('2d');

// img refresh funciion
const bgImg = new Image();
bgImg.onload = ()=>{
  console.log('image loaded');
}
const bgImgData = ctx.getImageData(
  0,0,
  cWidth,cHeight
);

/////////////////////////////////
const startWorld = ()=>{
  const newData = new Uint8ClampedArray(
    cWidth*cHeight*4
    ).fill(255);
    for(let i=0;i<cWidth*cHeight;i++){
      newData.set(
        Math.random()>.4?[]:[0,0,0],
        i*4
      );
    }
    bgImgData.data.set(newData);
    ctx.putImageData(bgImgData,0,0)
}

// next frame
const nextFrame = ()=>{
  const pxData = bgImgData.data;
  const bgCells = pxData.length/4;
  const nextData = pxData.map(n=>{
    return Math.floor(Math.random()*255);
  });
  bgImgData.data.set(nextData);
  ctx.putImageData(bgImgData,0,0);
}
startWorld();
//bg.src = canv.toDataURL();







export default true;