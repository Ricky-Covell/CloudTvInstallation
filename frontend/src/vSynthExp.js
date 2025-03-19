// // // // // // // // // EXPERIMENTING // // // // // // // // // // // // // // // 

function applyContrast(data, contrast) {
  var factor = (259.0 * (contrast + 255.0)) / (255.0 * (259.0 - contrast));

  for (var i = 0; i < data.length; i+= 4) {
    data[i] = truncateColor(factor * (data[i] - 128.0) + 128.0);
    data[i+1] = truncateColor(factor * (data[i+1] - 128.0) + 128.0);
    data[i+2] = truncateColor(factor * (data[i+2] - 128.0) + 128.0);
  }
}

const PRISMS = () => {
  ctx.drawImage(video, 0, 0, ctx.canvas.width,ctx.canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i+=4) {
    data[i+0] =  data[i+0+1300]  // red
    data[i+1] =  data[i+1+300]  // green
    data[i+2] =  data[i+2+580]  // blue
    data[i+3] =  data[i+3+3000]
  }
  ctx.putImageData(imageData, 0, 0);
}

const SPASMS = (data, limit) => {
  let randomRed = Math.floor(Math.random() * 102);
  let randomBlue = Math.floor(Math.random() * 330);
  let randomGreen = Math.floor(Math.random() * 1115);
  
  for (let i = 0; i < limit; i += 4) {
    data[i+randomGreen] = 255 - data[i+randomRed]; // red
    data[i+randomBlue] = randomGreen - data[i+randomRed]; // green
    data[i+randomRed] = 255 - data[i+randomBlue]; // blue 
  }
}

const SPECTRALGATE = () => {
  let randomRed = Math.floor(Math.random() * 20);
  let randomGreen = Math.floor(Math.random() * 10);
  let randomBlue = Math.floor(Math.random() * 30);

  ctx.drawImage(video, 0, 0, ctx.canvas.width,ctx.canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i]     = data[i] >     1110 ? data[i]     : data[i+133]  - randomRed
    data[i + 1] = data[i + 1] > 2140 ? data[i + 1] : data[i+2333] - randomGreen
    data[i + 2] = data[i + 2] > 210 ? data[i + 2] : data[i+333] - randomBlue
    // data[i + 3] = data[i + 3] > 120 ? data[i + 3] : data[i+333]
  }
  ctx.putImageData(imageData, 0, 0);
}


const PRISMS1 = () => {
  ctx.drawImage(video, 0, 0, ctx.canvas.width,ctx.canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i + 0] =  data[i+ 180] // red
    data[i+1] = data[i+2000] // green
    data[i+2] = data[i+3000] // blue
    data[i+3] =  data[i+800] // ALPHA
  }

  for (let i = 0; i < data.length; i++) {
    data[i] = data[i+234] + data[i] - 250
  }
  ctx.putImageData(imageData, 0, 0);
}


const invert = () => {
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i]; // red
    data[i + 1] = 255 - data[i + 1]; // green
    data[i + 2] = 255 - data[i + 2]; // blue
  }
  ctx.putImageData(imageData, 0, 0);
};

const PRISMS2 = () => {
  let randomRed = Math.floor(Math.random() * 5)+10;
  let randomBlue = Math.floor(Math.random() * 102)+150;
  let randomGreen = Math.floor(Math.random() * 6)+300;
  let randomALPHA = Math.floor(Math.random() * 5);
  
  ctx.drawImage(video, 0, 0, ctx.canvas.width,ctx.canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i+52210] = data[i] // red
    data[i+43333] = data[i+13] // green
    data[i+14390] = data[i+2] // blue
    data[i+10] = data[i+3] // ALPHA
  }
  ctx.putImageData(imageData, 0, 0);
}




const reverb = () => {
  ctx.drawImage(video, 0, 0, ctx.canvas.width,ctx.canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const numb = 2

  for (let i = 0; i < data.length; i += 4) {
    data[i] = data[i]; // red
    data[i + 1] = data[i+1]; // green
    data[i + 2] = data[i+2]; // blue
    // data[i + 8] = 115; // blue

  }
  ctx.putImageData(imageData, 0, 0);
}

function EMBOSS() {
  // First, draw it into the backing canvas
  ctx.drawImage(video ,0,0,ctx.canvas.width,ctx.canvas.height);
  // Grab the pixel data from the backing canvas
  var idata = ctx.getImageData(0,0,canvas.width, canvas.height);
  var data = idata.data;
  var w = idata.width;
  var limit = data.length
  
  // Loop through the subpixels, convoluting each using an edge-detection matrix.
  // for(var i = 0; i < limit; i++) {
  //     if( i%4 == 3 ) continue;
  //     data[i] = 127 + 2*data[i] - data[i + 4] - data[i + w*4];
  // }


  for (let j = 0; j < p4Val; j++) {
    for(var i = 0; i < limit; i+=1) {                
      data[i] = 200 + 2*data[i] - data[i] - data[i + w*4];          
    }}

  // for(var i = 0; i < limit; i+=1) {        
  //   // data[i] = 50 + (p1Val/20)*data[i] - data[i] - data[i + w*4];          
  //   if (data[i]<p2Val)
  //     data[i] = (Math.round(p1Val/.5)-50) + 2*data[i] - data[i] - data[i + w*4];          
  // }



    
    // for (let i = 0; i < data.length; i+=4) {
    //   data[i+0] = data[i+0+(p3Val*4)]  // red
    //   data[i+1] = data[i+1+(p3Val*8)]  // green
    //   data[i+2] = data[i+2+(p3Val*16)] // blue
    //   data[i+3] = data[i+3+p3Val]
    // }

  // Draw the pixels onto the visible canvas
  ctx.putImageData(idata,0,0);
}