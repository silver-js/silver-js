///////////
// Setup //
///////////

//<-- Creating canvas -->//

const mCanvas = document.createElement('canvas');
const mCtx = mCanvas.getContext('2d');
document.body.appendChild(mCanvas);
const glCanvas=document.createElement('canvas');
const gl=glCanvas.getContext('webgl');

//<-- First frame draw -->//

const firstFrame = ()=>{
  const bgImg = mCtx.getImageData(0, 0, mCanvas.width, mCanvas.height);
  const bgData = new Uint8ClampedArray(
    mCanvas.width * mCanvas.height * 4
  ).fill(255);
  for(let i = 0; i < mCanvas.width * mCanvas.height; i++){
    if(Math.random() < .3){
      bgData.set([0,0,0,255],i*4);
    }
  }
  bgImg.data.set(bgData);
  mCtx.putImageData(bgImg, 0, 0);
}

//<-- Resize function -->//

const resizeCanvas = ()=>{
  const winBitX = window.innerWidth.toString(2).length - 3;
  const winBitY = window.innerHeight.toString(2).length - 2;
  const newWidth = Math.pow(2, winBitX);
  const newHeight = Math.pow(2, winBitY);
  let changed = false;
  if(newWidth != mCanvas.width){
    mCanvas.width = Math.pow(2, winBitX);
    glCanvas.width = mCanvas.width;
    changed = true;
  }
  if(newHeight != mCanvas.height){
    mCanvas.height = Math.pow(2, winBitY);
    glCanvas.height = mCanvas.height;
    changed = true;
  }
  if(changed){
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    firstFrame();
  }
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

//////////////////////////// unoptimized //////////////////////
//<-- Setting up webGL canvas -->//

gl.clearColor(1.0,0.0,1.0,1.0);
gl.clear(gl.COLOR_BUFFER_BIT);


//<-- Setting up shader code -->//

const vertShaderSource=`
attribute vec2 position;
varying vec2 texCoords;
int lifeNumber=0;
void main(){
texCoords = (position+1.0)/2.0;
texCoords.y = 1.0-texCoords.y;
gl_Position = vec4(position,0,1.0);
}
`;

const fragShaderSource=`
precision highp float;
varying vec2 texCoords;
uniform sampler2D textureSampler;

float xSize = 1.0/${mCanvas.width}.0;
float ySize = 1.0/${mCanvas.height}.0;

void main(){
vec4 color = texture2D(textureSampler,texCoords);
vec4 aColor = texture2D(textureSampler,texCoords+vec2(-xSize,ySize));
vec4 bColor = texture2D(textureSampler,texCoords+vec2(0.0,ySize));
vec4 cColor = texture2D(textureSampler,texCoords+vec2(xSize,ySize));
vec4 dColor = texture2D(textureSampler,texCoords+vec2(-xSize,0.0));
vec4 eColor = texture2D(textureSampler,texCoords+vec2(xSize,0.0));
vec4 fColor = texture2D(textureSampler,texCoords+vec2(-xSize,-ySize));
vec4 gColor = texture2D(textureSampler,texCoords+vec2(0.0,-ySize));
vec4 hColor = texture2D(textureSampler,texCoords+vec2(xSize,-ySize));

//check neighbors

float neighbors = aColor.r + bColor.r + cColor.r + dColor.r + eColor.r + fColor.r + gColor.r + hColor.r;

if(color.r>0.5){
//alive rules	
if(neighbors<2.0 || neighbors>3.0){
color=vec4(0.0,0.0,0.0,1.0);
}
}else{
//dead rules
if(neighbors==3.0){
color=vec4(1.0,1.0,1.0,1.0);	
}
}
/////////////////////////////

gl_FragColor = color;
}
`;

//<-- Creating the shaders -->//

const vertShader = gl.createShader(gl.VERTEX_SHADER);
const fragShader = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vertShader,vertShaderSource);
gl.shaderSource(fragShader,fragShaderSource);

gl.compileShader(vertShader);
gl.compileShader(fragShader);


//<-- Creating program -->//

const program = gl.createProgram();
gl.attachShader(program,vertShader);
gl.attachShader(program,fragShader);
gl.linkProgram(program);

gl.useProgram(program);


//<-- Creating vertices -->//

const vertices = new Float32Array([
  -1,-1,-1,1,1,1,
  -1,-1,1,1,1,-1
]);


//< Buffering data -->//

const vertexBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const positionLocation = gl.getAttribLocation(program, "position");

gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionLocation);

const texture = gl.createTexture();
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

function nextFrame(){

  //<-- Creating texture -->//

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mCanvas);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  ///////////////////////////////////////////////////////////////////////////////////////

  mCtx.drawImage(glCanvas,0,0);
}

function gLoop() {
  nextFrame();
  setTimeout(gLoop,200);
}
gLoop();


/////////////////
// Main canvas //
/////////////////
/*
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

const newGame = ()=>{
  const bgImg = ctx.getImageData(
    0,0,canvas.width,canvas.height
  );
  const newColor = [128 + Math.random() * 128, 128, 128 + Math.random() * 128];
  for(let i = 0; i < canvas.width * canvas.height; i++){
    bgImg.data.set(
      Math.random()>.80?[...newColor,255]:[...newColor,0],
      i*4
    );
  }
  ctx.putImageData(bgImg,0,0);
}
const resizeGame = ()=>{
  let winBitX = window.innerWidth.toString(2);
  let winBitY = window.innerHeight.toString(2);
  const xCalc = Math.pow(2, winBitX.length - 3);
  const yCalc = Math.pow(2, winBitY.length - 2);
  let changed = false;
  if(xCalc != canvas.width){
    canvas.width = xCalc;
    changed = true;
  }
  if(yCalc != canvas.height){
    canvas.height = yCalc;
    changed = true;
  }
  if(changed){
    newGame();
  }
}
resizeGame();
window.addEventListener('resize', resizeGame);


///////////////////
// Web GL Canvas //
///////////////////

const glCanvas = document.createElement('canvas');
const gl = glCanvas.getContext('webgl');
const program = gl.createProgram();
const glResize = ()=>{
  glCanvas.width = canvas.width;
  glCanvas.height = canvas.height;
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  // setting up shader code

  const vertShaderSource=`
    attribute vec2 position;
    varying vec2 texCoords;
    int lifeNumber = 0;
    void main(){
      texCoords = (position + 1.0) / 2.0;
      texCoords.y = 1.0 - texCoords.y;
      gl_Position = vec4(position, 0, 1.0);
    }
  `;

  const fragShaderSource=`
    precision highp float;
    varying vec2 texCoords;
    uniform sampler2D textureSampler;

    float xSize = 1.0/${canvas.width}.0;
    float ySize = 1.0/${canvas.height}.0;

    void main(){
      vec4 color = texture2D(textureSampler,texCoords);
      vec4 aColor = texture2D(textureSampler,texCoords+vec2(-xSize,ySize));
      vec4 bColor = texture2D(textureSampler,texCoords+vec2(0.0,ySize));
      vec4 cColor = texture2D(textureSampler,texCoords+vec2(xSize,ySize));
      vec4 dColor = texture2D(textureSampler,texCoords+vec2(-xSize,0.0));
      vec4 eColor = texture2D(textureSampler,texCoords+vec2(xSize,0.0));
      vec4 fColor = texture2D(textureSampler,texCoords+vec2(-xSize,-ySize));
      vec4 gColor = texture2D(textureSampler,texCoords+vec2(0.0,-ySize));
      vec4 hColor = texture2D(textureSampler,texCoords+vec2(xSize,-ySize));

      //check neighbors

      float neighbors = aColor.w + bColor.w + cColor.w + dColor.w + eColor.w + fColor.w + gColor.w + hColor.w;

      if(color.r>0.5){
        //alive rules	
        if(neighbors<2.0 || neighbors>3.0){
          color=vec4(0.0,0.0,0.0,0.0);
        }
      }else{
        //dead rules
        if(neighbors==3.0){
          color=vec4(0.0,0.0,0.0,1.0);	
        }
      }
      /////////////////////////////

      gl_FragColor = color;
    }
  `;
	//<-- Creating the shaders -->//

	const vertShader = gl.createShader(gl.VERTEX_SHADER);
	const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
	
	gl.shaderSource(vertShader,vertShaderSource);
	gl.shaderSource(fragShader,fragShaderSource);
	
	gl.compileShader(vertShader);
	gl.compileShader(fragShader);
	
	//<-- Creating program -->//
	
	gl.attachShader(program,vertShader);
	gl.attachShader(program,fragShader);
	gl.linkProgram(program);

	gl.useProgram(program);
}
glResize();
gl.clearColor(0.0, 0.0, 0.0, 0.0);
gl.clear(gl.COLOR_BUFFER_BIT);


//<-- Creating vertices -->//

const vertices = new Float32Array([
  -1,-1,-1,1,1,1,
  -1,-1,1,1,1,-1
]);

//< Buffering data -->//

const vertexBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const positionLocation = gl.getAttribLocation(program, "position");

gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionLocation);

const texture = gl.createTexture();
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);


function nextFrame(){

  //<-- Creating texture -->//

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);

  gl.drawArrays(gl.TRIANGLES, 0, 6);

  ///////////////////////////////////////////////////////////////////////////////////////

  ctx.drawImage(glCanvas,0,0);
}
setInterval(nextFrame,200);





/*
const cWidth = 128;

const cHeight = 128;

// setup
const canv = document.createElement('canvas');
canv.width = cWidth;
canv.height = cHeight;
document.body.appendChild(canv);
canv.style = `
position: fixed;
top:-3px;
left:-3px;
z-index: -1;
filter: blur(2px);
image-rendering: pixelated;
`;
const resCanv = ()=>{
  canv.width = Math.floor(window.innerWidth / window.innerHeight * 128);
};
window.addEventListener('resize', resCanv);
const ctx = canv.getContext('2d');
const bgImg = ctx.getImageData(0,0,cWidth,cHeight);
const bgData = new Uint8ClampedArray(
  cWidth * cHeight * 4
);

/////////////////////////////////
const drawFrame = (f)=>{
  bgData.set(f);V
  bgImg.data.set(bgData);
  ctx.putImageData(bgImg,0,0);
}
const startWorld = ()=>{
  const f = new Uint8ClampedArray(
    cWidth * cHeight * 4
  );
  const newColor = [128 + Math.random() * 128, 128, 128 + Math.random() * 128];
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
*/
