import React, { useState, useEffect, useContext } from "react";
import vSynthLfo from "./vSynthLfo";
import CloudContext from "./CloudContext";
import MidiFighterTwister from "./MidiFighterTwister";

// https://www.phpied.com/pixel-manipulation-in-canvas/
// https://stackoverflow.com/questions/51294998/convolve-kernal-matrics-in-javascript-for-image-filter-in-html5canvas

const vSynthProcessor = () => {
  // const isLoaded = false
  setTimeout(() => {vSynth()}, 50);         // Temporary fix because listening for DOMContentLoaded wasn't working?
  
  const { clouds } = useContext(CloudContext);

  const vSynth = () => {
    // // // // // // // // // ELEMENTS // // // // // // // // // // // // // // // 
    const canvas = document.getElementById('cloud-player');
    const video = document.getElementById('cloud-video-element');
    
    let fps = 60
    let res = 8

    let canvasInterval = null;
    const ctx = canvas.getContext('2d', { 
      alpha: false, 
      willReadFrequently: true, 
      desynchronized: false 
    })
    
    // // // // // // // // // MIDI FIGHTER TWISTER // // // // // // // // // // // // // // // 
    const MFT = new MidiFighterTwister()
    let paramSliderArray;

    // // // // // // // // // // // // // // PARAMETERS // // // // // // // // // // // // 
      // this seemed preferable over managing parameters VIA array/obj to avoid any unnecessary additional steps in memory considering the rate of <canvas> animations?
      // PARAM LAYOUT
        // p1Val  :  DOWNSAMPLE
        // p2Val  :  z
        // p3Val  :  PRISM
        // p4Val  :  z
        // p5Val  :  z
        // p6Val  :  z
        // p7Val  :  INVERT R
        // p8Val  :  INVERT G
        // p9Val  :  INVERT B
        // p10Val :  WIDTHGLITCH

        const speedSlider = document.getElementById('param-speed')
        const fpsSlider = document.getElementById('param-fps')
        const cloudSlider = document.getElementById('param-cloud')
        const resSlider = document.getElementById('param-resolution')
        
        video.playbackRate = 1
        
        speedSlider.addEventListener('input', (evt) => {
          video.playbackRate = (evt.target.value / 2.5) 
        })
        
        cloudSlider.addEventListener('input', (evt) => {
          video.src = `/cloud-set/${clouds[evt.target.value]}`
          video.play()
          console.log(clouds[evt.target.value])
        })
        
        resSlider.addEventListener('input', (evt) => {
          res = evt.target.value
          DOWNSAMPLE()
        })
        
        fpsSlider.addEventListener('input', (evt) => {
          fps = evt.target.value 
          
          window.clearInterval(canvasInterval)
          canvasInterval = window.setInterval(() => {
            draw() 
          }, fps);
        })
        
    let p1Val=8, p2Val=0, p3Val=0, p4Val=25, p5Val=0, p6Val=0, p7Val=0, p8Val=0, p9Val=0, p10Val=1 
    
    const param1 = document.getElementById('param-p1')
    const param2 = document.getElementById('param-p2')
    const param3 = document.getElementById('param-p3')
    const param4 = document.getElementById('param-p4')
    const param5 = document.getElementById('param-p5')
    const param6 = document.getElementById('param-p6')
    const param7 = document.getElementById('param-p7')
    const param8 = document.getElementById('param-p8')
    const param9 = document.getElementById('param-p9')
    const param10 = document.getElementById('param-p10')

    param1.addEventListener('change', () => {
      p1Val = param1.value
    })
    param2.addEventListener('change', () => {
      p2Val = param2.value
      console.log(p2Val)
    })
    param3.addEventListener('change', () => {
      p3Val = param3.value
      console.log(p3Val)
    })
    param4.addEventListener('change', () => {
      p4Val = param4.value
      console.log(p4Val)
    })
    param5.addEventListener('change', () => {
      p5Val = param5.value * 100
      console.log(p5Val)
    })
    param6.addEventListener('change', () => {
      p6Val = param6.value
      console.log(p6Val)
    })
    param7.addEventListener('change', () => {
      p7Val = param7.value
      console.log(p7Val)
    })
    param8.addEventListener('change', () => {
      p8Val = param8.value
      console.log(p8Val)
    })
    param9.addEventListener('change', () => {
      p9Val = param9.value
      console.log(p9Val)
    })
    param10.addEventListener('change', () => {
      p10Val = param10.value
      console.log(p10Val)
    })

    // MFT AGAIN 
    // paramSliderArray = [p1Val, p2Val, p3Val, p4Val, p5Val, p6Val, p7Val, p8Val, p9Val, p10Val]
    const MFTtoRange = (val, inMin, inMax, outMin, outMax) => {
      return (val - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }
    const MFTupdate = () => {
      
      p2Val  = MFTtoRange(MFT.inputArray[0], 0, 127, 0, 101)
      p3Val  = MFTtoRange(MFT.inputArray[1], 0, 127, 0, 3000)
      p4Val  = MFTtoRange(MFT.inputArray[2], 0, 127, -50, 100 )
      p5Val  = MFTtoRange(MFT.inputArray[3], 0, 127, -50, 200)
      p6Val  = MFTtoRange(MFT.inputArray[4], 0, 127, 0, 10)
      p7Val  = MFTtoRange(MFT.inputArray[5], 0, 127, 0, 1)
      p8Val  = MFTtoRange(MFT.inputArray[6], 0, 127, 0, 1)
      p9Val  = MFTtoRange(MFT.inputArray[7], 0, 127, 0, 1)
      p10Val = MFTtoRange(MFT.inputArray[8], 0, 127, 1, 10)
      
      video.playbackRate = MFTtoRange(MFT.inputArray[12], 0, 127, 0, 10)

      // if (video.src != `/cloud-set/${clouds[Math.round(MFTtoRange(MFT.inputArray[15], 0, 127, 0, 15))]}`) {
      //   video.src =     `/cloud-set/${clouds[Math.round(MFTtoRange(MFT.inputArray[15], 0, 127, 0, 15))]}`
      //   // video.play()
      // }
      
      
      // res = evt.target.value
      // DOWNSAMPLE()
      
      // fps = MFTtoRange(MFT.inputArray[13], 0, 127, 30, 300)
      // window.clearInterval(canvasInterval)
      // canvasInterval = window.setInterval(() => {
      //   draw() 
      // }, fps);

    }
    MFT.setUpdate(MFTupdate)
    // MFT.setSliders(paramSliderArray)
    
    // // // // // // // // // EFFECTS // // // // // // // // // // // // // // // 
    const drawOriginal = () => {
      ctx.drawImage(video, 0, 0, ctx.canvas.width,ctx.canvas.height);
    }

    const BRIGHTNESS = (data, limit) => {
      if (p4Val == 50) return

      for (let i = 0; i < limit; i+=4) {
        data[i]   += ((255 * (p4Val / 100)) - 50);
        data[i+1] += ((255 * (p4Val / 100)) - 50);
        data[i+2] += ((255 * (p4Val / 100)) - 50);
      }
    }

    
    // let contrastFactor = (259.0 * (contrast + 255.0)) / (255.0 * (259.0 - contrast));
    const CONTRAST = (data, limit) => {
      // if (p5Val == 0) return

      for (var i = 0; i < limit; i+= 4) { 
        data[i+0] = Math.ceil(259.0 * (p5Val + 255.0) / (255.0 * (259.0 - p5Val)) * (data[i+0] - 128.0) + 128.0)
        data[i+1] = Math.ceil(259.0 * (p5Val + 255.0) / (255.0 * (259.0 - p5Val)) * (data[i+1] - 128.0) + 128.0)
        data[i+2] = Math.ceil(259.0 * (p5Val + 255.0) / (255.0 * (259.0 - p5Val)) * (data[i+2] - 128.0) + 128.0) 
        // data[i+3] = Math.ceil(259.0 * (p5Val + 255.0) / (255.0 * (259.0 - p5Val)) * (data[i+3] - 128.0) + 128.0)
      }
    }

    const PRISM1 = (data, limit) => {
      if (p2Val == 0 && p3Val == 0) return
      
      if (p3Val != 0) {
        for (let i = 0; i < limit; i+=4) {
          data[i+0] =  data[(Math.round(i+0+(p3Val*4)+1300)) % limit]   // red
          data[i+1] =  data[(Math.round(i+1+(p3Val*5)+300)) % limit]   // green
          data[i+2] =  data[(Math.round(i+2+(p3Val*6)+580)) % limit]   // blue
          data[i+3] =  data[(Math.round(i+3+(p3Val*9)+3000)) % limit] 
        }
      }
      }

      const PRISM3 = (data, limit) => {
        if (p3Val == 0) return
        
        if (p3Val != 0) {
          for (let i = 0; i < limit; i+=4) {
            data[i+0] =  data[(Math.round(i+0+(p3Val*4)+1300)) % limit]   // red
            data[i+1] =  data[(Math.round(i+1+(p3Val*5)+300)) % limit]   // green
            data[i+2] =  data[(Math.round(i+2+(p3Val*6)+580)) % limit]   // blue
            data[i+3] =  data[(Math.round(i+3+(p3Val*9)+3000)) % limit] 
          }
        }
        }  

    const PRISM2 = (data, limit) => {
      if (p2Val == 0) return

        for (let i = 0; i < limit; i+=4) {
          data[(i+0*(Math.round(p2Val*.231)) % limit)] = data[i+0]   
          data[(i+1*(Math.round(p2Val*.213)) % limit)] = data[i+1] 
          data[(i+2*(Math.round(p2Val*.221)) % limit)] = data[i+2] 
          data[(i+3*(Math.round(p2Val*.247)) % limit)] = data[i+3]  
        }
    }

    const EMBOSS1 = (data, limit, w) => {
        for(var i = 0; i < limit; i+=4) {                
          data[i] = Math.round((((100 + 2*data[i] - data[i+4] - data[(i-p6Val) + w*4]) + (data[i]*7))));          
        }
    }

    const EMBOSS2 = (data, limit, w) => {        
      if (p6Val == 0) return 
       for(var i = 0; i < limit; i+=4) {        
          data[i] = (Math.round(p6Val/.5)-50) + 2*data[i] - data[i] - data[i + w*4];          
          data[i+3] = (Math.round(p6Val/.5)-50) + 2*data[i+2] - data[i+2] - data[Math.round((i+2) + (w*3.97))];          
          data[i+1] = (Math.round(p6Val/.5)-50) + 2*data[i+1] - data[i+1] - data[i+1 + w*4];          
      }

    // for(var i = 0; i < limit; i+=4) {        
    //     // if (data[i]<p2Val)
    //     data[Math.round(i)] =   (Math.round(p1Val/.5)-50) + 2*data[Math.round(i+0)] - data[Math.round(i+0)] - data[Math.round(i+0 + w*4)];          
    //     data[Math.round(i+2)] = (Math.round(p2Val/.5)-50) + 2*data[Math.round(i+2)] - data[Math.round(i+2)] - data[Math.round((i+2) + (w*3.97))];          
    //     data[Math.round(i+4)] = (Math.round(p1Val/.5)-50) + 2*data[Math.round(i+1)] - data[Math.round(i+1)] - data[Math.round(i+1 + w*4)];          
    //  }
    }

    const PRICONV = (data, limit, h) => {   
      let nuHeight=h/3

      for(var i = 0; i < limit; i+=4) {        
       // if (data[i]<p2Val)
         data[i] = (Math.round(p1Val/.5)-50) + 2*data[i] - data[i] - data[i + nuHeight*4];          
         data[i+3] = (Math.round(p2Val/.5)-50) + 2*data[i+2] - data[i+2] - data[Math.round((i+2) + (nuHeight*3.97))];          
         data[i+1] = (Math.round(p1Val/.5)-50) + 2*data[i+1] - data[i+1] - data[i+1 + nuHeight*4];          
     }

      for(var i = 0; i < limit; i+=4) {        
        // if (data[i]<p2Val)
          data[Math.round(i)] =   (Math.round(p1Val/.5)-50) + 2*data[Math.round(i+0)] - data[Math.round(i+0)] - data[Math.round(i+0 + nuHeight*4)];          
          data[Math.round(i+2)] = (Math.round(p2Val/.5)-50) + 2*data[Math.round(i+2)] - data[Math.round(i+2)] - data[Math.round((i+2) + (nuHeight*3.97))];          
          data[Math.round(i+4)] = (Math.round(p1Val/.5)-50) + 2*data[Math.round(i+1)] - data[Math.round(i+1)] - data[Math.round(i+1 + nuHeight*4)];          
      }
    }

    const INVERT = (data, limit) => {
      if (p7Val == 0 && p8Val == 0 && p9Val == 0) return

      // interpolating between full inversion value and original, per color channel
      for (let i = 0; i < limit; i += 4) {        
        data[i] = Math.round(data[i] * (1 - p7Val) + (255 - data[i]) * p7Val) 
        data[i+1] = Math.round(data[i+1] * (1 - p8Val) + (255 - data[i+1]) * p8Val)
        data[i+2] = Math.round(data[i+2] * (1 - p9Val) + (255 - data[i+2]) * p9Val)
      }
    };

    const DOWNSAMPLE = () => {
      canvas.width  = 4096 / res
      canvas.height = 2160 / res
    }

    const WIDTHGLITCH = () => {
      // if (p9Val === 1) return  1

      return p10Val
    }

    const CONVOLUTION = (data, limit, w, h, kernel) => {
        if (p6Val == 0) return

        const k1 = [
          1, 0, -1,
          2, 0, -2,
          1, 0, -1
        ];
    
        const k2 = [
          -1, -1, -1,
          -1, 8, -1,
          -1, -1, -1
        ];

        const sharpen = [
           2,  0,  0,
           0, -1,  0,
           0,  0, -1
        ]


        const emboss2= [
          0,  (p6Val*3),  0,
          0, -2,  0,
          (p6Val),  (p6Val*-3), 0
       ]
      
    
        kernel = emboss2;
    
    
        const dim = Math.sqrt(kernel.length);
        const pad = Math.floor(dim / 2);
    
        const pixels = data
    
        if (dim % 2 !== 1) {
          console.log('Invalid kernel dimension');
        }
    
    
    
        let pix, i, r, g, b;
        const cw = (w + pad * 2) - 2; // add padding
        const ch = h + pad * 2;
    
        for (let row = 0; row < h; row++) {
          for (let col = 0; col < w; col++) {
    
            r = 0;
            g = 0;
            b = 0;
    
    
            for (let kx = -pad; kx <= pad; kx++) {
              for (let ky = -pad; ky <= pad; ky++) {
    
                i = (ky + pad) * dim + (kx + pad); // kernel index
                pix = 4 * ((row + ky) * cw + (col + kx)); // image index
                r += pixels[pix++] * kernel[i];
                g += pixels[pix++] * kernel[i];
                b += pixels[pix  ] * kernel[i];
              }
            }
    
            pix = 4 * ((row - pad) * w + (col - pad)); // destination index
            pixels[pix++] = r;
            pixels[pix++] = g;
            pixels[pix++] = b;
            pixels[pix  ] = 255; // we want opaque image
    
          }
        }
    
        // ctx.putImageData(pixels,0,0);
    
    }
    // // // // // // // // // EXECUTE // // // // // // // // // // // // // // // 
    const draw = () => {
      ctx.drawImage(video,0,0,(ctx.canvas.width/WIDTHGLITCH()),ctx.canvas.height);
      // ctx.drawImage(video,0,0,ctx.canvas.width,ctx.canvas.height);
      let idata = ctx.getImageData(0,0,canvas.width, canvas.height);
      let data = idata.data;
      let w = idata.width;
      let h = idata.height;
      let limit = data.length

      CONVOLUTION(data, limit, w, h, )
      PRISM1(data, limit)
      PRISM2(data, limit)
      INVERT(data, limit)
      BRIGHTNESS(data,limit)
      CONTRAST(data,limit)
      

      
      ctx.putImageData(idata,0,0);
    }
    
    canvasInterval = window.setInterval(() => {
      // drawOriginal()
      // requestAnimationFrame(draw)
      draw() 
      // PRISMcheck()
    }, fps);

    DOWNSAMPLE()
    // canvas.width = 4096/32
    // canvas.height = 2160/32
  } 


  // window.onload = (evt) => {vSynth}

  // addEventListener('load', (evt)=>{
  //   vSynth()
  // })
} 

export default vSynthProcessor




// clearInterval(canvasInterval);
  // canvasInterval = window.setInterval(() => {
    // drawOriginal()
    // draw()
// }, );

// video.onpause = function() {
  //   clearInterval(canvasInterval);
    // };
    // video.onended = function() {
    //   clearInterval(canvasInterval);
    // };


    