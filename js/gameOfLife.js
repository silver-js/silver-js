//<-- Creating canvas -->//
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const glCanvas = document.createElement('canvas');
const gl = glCanvas.getContext('webgl');


//<-- First frame drawn -->//
const reset = ()=>{
  const w = canvas.width;
  const h = canvas.height;
  const canvImg = ctx.getImageData(0, 0, w, h);
  const imgData = new Uint8ClampedArray(w * h * 4).fill(255);
  for(let i = 0; i < w * h; i++){
    if(Math.random() < .8){
      imgData.set([0,0,0],i*4);
    }
  }
  canvImg.data.set(imgData);
  ctx.putImageData(canvImg, 0, 0);
}


const setup = ()=>{
  const vertShaderSource = [
    `attribute vec2 position;`,
    `varying vec2 texCoords;`,
    `int lifeNumber=0;`,
    `void main(){`,
    `  texCoords = (position+1.0)/2.0;`,
    `  texCoords.y = 1.0-texCoords.y;`,
    `  gl_Position = vec4(position,0,1.0);`,
  `}`
  ].join('\n');
  const fragShaderSource = [
    `precision highp float;`,
    `varying vec2 texCoords;`,
    `uniform sampler2D textureSampler;`,
    
    `float xSize = 1.0/${canvas.width}.0;`,
    `float ySize = 1.0/${canvas.height}.0;`,
    
    `void main(){`,
    `  vec4 color = texture2D(textureSampler,texCoords);`,
    `  vec4 aColor = texture2D(textureSampler,texCoords+vec2(-xSize,ySize));`,
    `  vec4 bColor = texture2D(textureSampler,texCoords+vec2(0.0,ySize));`,
    `  vec4 cColor = texture2D(textureSampler,texCoords+vec2(xSize,ySize));`,
    `  vec4 dColor = texture2D(textureSampler,texCoords+vec2(-xSize,0.0));`,
    `  vec4 eColor = texture2D(textureSampler,texCoords+vec2(xSize,0.0));`,
    `  vec4 fColor = texture2D(textureSampler,texCoords+vec2(-xSize,-ySize));`,
    `  vec4 gColor = texture2D(textureSampler,texCoords+vec2(0.0,-ySize));`,
    `  vec4 hColor = texture2D(textureSampler,texCoords+vec2(xSize,-ySize));`,
    
    //check neighbors
    `  float neighbors = aColor.r + bColor.r + cColor.r + dColor.r + eColor.r + fColor.r + gColor.r + hColor.r;`,
    `  if(color.r>0.5){`,
    
    //alive rules
    `    if(neighbors<2.0 || neighbors>3.0){`,
    `      color=vec4(0.0,0.0,0.0,1.0);`,
    `    }`,
    `  }else{`,
    //dead rules
    `    if(neighbors==3.0){`,
    `      color=vec4(1.0,1.0,1.0,1.0);`,
    `    }`,
    `  }`,
    /////////////////////////////
    `  gl_FragColor = color;`,
    `}`
  ].join('\n');
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
}


//<-- Resize function -->//
const resize = (w, zoom)=>{
  const bitWidth = w. toString(2).length - zoom;
  const newWidth = Math.pow(2, bitWidth);
  if(newWidth != canvas.width){
    canvas.width = newWidth;
    glCanvas.width = canvas.width;
    canvas.height = newWidth;
    glCanvas.height = canvas.height;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    reset();
    setup();
  }
  return newWidth;
}


//<-- Game Loop -->//
const gameLoop = ()=>{
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  ctx.drawImage(glCanvas,0,0);
  setTimeout(gameLoop,200);
}
resize(128,0);
gameLoop();


export default {
  reset,
  resize,
  frame: ()=>{
    return canvas;
  }
}
