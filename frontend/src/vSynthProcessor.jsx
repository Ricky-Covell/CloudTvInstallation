import React, { useState, useEffect, useContext } from "react";
import vSynthLfo from "./vSynthLfo";
import CloudContext from "./CloudContext";
import MidiFighterTwister from "./MidiFighterTwister";

// MAY CHECKLIST
  // Drop Convolution
  // Pre/Post Bright and  Cont?
  // Color Inv to two knobs
  // 

//        PRISM I | PRISM II | BRIGHTNESS | CONTRAST
//        CONV I  | R INV    | G INV      | B INV   
//        W Pinch | W Scan   |            |    
//        SPEED   |          |            | VOLUME    



const vSynthProcessor = () => {
  // const isLoaded = false
  setTimeout(() => {vSynth()}, 50);         // Temporary fix because listening for DOMContentLoaded wasn't working?
  
  const { clouds } = useContext(CloudContext);

  const vSynth = () => {
    // // // // // // // // // ELEMENTS // // // // // // // // // // // // // // // 
    const canvas = document.getElementById('cloud-player');
    const video = document.getElementById('cloud-video-element');
    
    let fps = 60
    let res = 4

    let canvasInterval = null;
    const ctx = canvas.getContext('2d', { 
      alpha: false, 
      willReadFrequently: true, 
      desynchronized: true 
    })
    
    // // // // // // // // // MIDI FIGHTER TWISTER // // // // // // // // // // // // // // // 
    const MFT = new MidiFighterTwister()
    let paramSliderArray;

    // // // // // // // // // // // // // // PARAMETERS // // // // // // // // // // // // 

        const speedSlider = document.getElementById('param-speed')
        const fpsSlider = document.getElementById('param-fps')
        const cloudSlider = document.getElementById('param-cloud')
        const resSlider = document.getElementById('param-resolution')
        
        video.playbackRate = 1
        
    let prism1Val=0, 
        prism2Val=0, 
        brightVal=25, 
        contrastVal=0, 
        postbrightVal=25, 
        postcontrastVal=0, 
        convVal=0, 
        rInvVal=0, 
        gInvVal=0, 
        bInvVal=0, 
        colorInv1Val=0,  
        colorInv2Val=0,
        colorInv3Val=0,
        wPinchVal=1, 
        wScanVal=1,
        p12Val=1, 
        p13Val=1


    // MFT AGAIN 
    const MFTtoRange = (val, inMin, inMax, outMin, outMax) => {
      return (val - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }
    const MFTupdate = () => {
    
        brightVal  = MFTtoRange(MFT.inputArray[0], 0, 127, -50, 100 )
        contrastVal  = MFTtoRange(MFT.inputArray[1], 0, 127, -50, 200)
        postbrightVal  = MFTtoRange(MFT.inputArray[2], 0, 127, -50, 100 )
        postcontrastVal  = MFTtoRange(MFT.inputArray[3], 0, 127, -50, 200)
        // bInvVal  = MFTtoRange(MFT.inputArray[7], 0, 127, 0, 1)
        
        colorInv1Val  = MFTtoRange(MFT.inputArray[4], 0, 127, 0, 5)
        colorInv2Val  = MFTtoRange(MFT.inputArray[5], 0, 127, 0, 5)
        rInvVal  = MFTtoRange(MFT.inputArray[6], 0, 127, -1, 1)
        gInvVal  = MFTtoRange(MFT.inputArray[7], 0, 127, -1, 1)
        // bInvVal  = MFTtoRange(MFT.inputArray[7], 0, 127, -1, 1)        

        wPinchVal = MFTtoRange(MFT.inputArray[8], 0, 127, 1, 10)
        wScanVal = MFTtoRange(MFT.inputArray[9], 0, 127, 0, 5)
        prism1Val  = MFTtoRange(MFT.inputArray[10], 0, 127, 0, 10113331)
        prism2Val  = MFTtoRange(MFT.inputArray[11], 0, 127, 0.5, 30000)

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
    
    // // // // // // // // // PROCESSORS // // // // // // // // // // // // // // // 
    const drawOriginal = () => {
      ctx.drawImage(video, 0, 0, ctx.canvas.width,ctx.canvas.height);
    }

    const BRIGHTNESS = (data, limit) => {
      if (brightVal == 50) return

      for (let i = 0; i < limit; i+=4) {
        data[i]   += ((255 * (brightVal / 100)) - 50);
        data[i+1] += ((255 * (brightVal / 100)) - 50);
        data[i+2] += ((255 * (brightVal / 100)) - 50);
      }
    }

    
    // let contrastFactor = (259.0 * (contrast + 255.0)) / (255.0 * (259.0 - contrast));
    const POSTCONTRAST = (data, limit) => {
      // if (p5Val == 0) return

      for (var i = 0; i < limit; i+= 4) { 
        data[i+0] = Math.floor(259.0 * (postcontrastVal + 255.0) / (255.0 * (259.0 - postcontrastVal)) * (data[i+0] - 128.0) + 128.0)
        data[i+1] = Math.floor(259.0 * (postcontrastVal + 255.0) / (255.0 * (259.0 - postcontrastVal)) * (data[i+1] - 128.0) + 128.0)
        data[i+2] = Math.floor(259.0 * (postcontrastVal + 255.0) / (255.0 * (259.0 - postcontrastVal)) * (data[i+2] - 128.0) + 128.0) 
        // data[i+3] = Math.ceil(259.0 * (postcontrastVal + 255.0) / (255.0 * (259.0 - postcontrastVal)) * (data[i+3] - 128.0) + 128.0)
      }
    }

    const POSTBRIGHTNESS = (data, limit) => {
      if (postbrightVal == 50) return

      for (let i = 0; i < limit; i+=4) {
        data[i]   += ((255 * (postbrightVal / 100)) - 50);
        data[i+1] += ((255 * (postbrightVal / 100)) - 50);
        data[i+2] += ((255 * (postbrightVal / 100)) - 50);
      }
    }

    
    // let contrastFactor = (259.0 * (contrast + 255.0)) / (255.0 * (259.0 - contrast));
    const CONTRAST = (data, limit) => {
      // if (p5Val == 0) return

      for (var i = 0; i < limit; i+= 4) { 
        data[i+0] = (Math.floor(259.0 * (contrastVal + 255.0) / (255.0 * (259.0 - contrastVal)) * (data[i+0] - 128.0) + 128.0))
        data[i+1] = (Math.floor(259.0 * (contrastVal + 255.0) / (255.0 * (259.0 - contrastVal)) * (data[i+1] - 128.0) + 128.0))
        data[i+2] = (Math.floor(259.0 * (contrastVal + 255.0) / (255.0 * (259.0 - contrastVal)) * (data[i+2] - 128.0) + 128.0) )
        // data[i+3] = Math.ceil(259.0 * (p5Val + 255.0) / (255.0 * (259.0 - p5Val)) * (data[i+3] - 128.0) + 128.0)
      }
    }

    const PRISM1 = (data, limit) => {
      if (prism1Val == 0 && prism2Val == 0) return
      
      if (prism2Val != 0) {
        for (let i = 0; i < limit; i+=4) {
          data[i+0] =  data[(Math.round(i+0+(prism2Val*4)+1300)) % limit]   // red
          data[i+1] =  data[(Math.round(i+1+(prism2Val*5)+300)) % limit]   // green
          data[i+2] =  data[(Math.round(i+2+(prism2Val*6)+580)) % limit]   // blue
          data[i+3] =  data[(Math.round(i+3+(prism2Val*9)+3000)) % limit] 
        }
      }
      }

      const PRISM3 = (data, limit) => {
        if (prism2Val == 0) return
        
        if (prism2Val != 0) {
          for (let i = 0; i < limit; i+=4) {
            data[i+0] =  data[(Math.round(i+0+(prism2Val*4)+1300)) % limit]   // red
            data[i+1] =  data[(Math.round(i+1+(prism2Val*5)+300)) % limit]   // green
            data[i+2] =  data[(Math.round(i+2+(prism2Val*6)+580)) % limit]   // blue
            data[i+3] =  data[(Math.round(i+3+(prism2Val*9)+3000)) % limit] 
          }
        }
        }  

    const PRISM2 = (data, limit) => {
      if (prism1Val == 0) return

        for (let i = 0; i < limit; i+=4) {
          data[(i+0*(Math.round(prism1Val*.231)) % limit)] = data[i+0]   
          data[(i+1*(Math.round(prism1Val*.213)) % limit)] = data[i+1] 
          data[(i+2*(Math.round(prism1Val*.221)) % limit)] = data[i+2] 
          data[(i+3*(Math.round(prism1Val*.247)) % limit)] = data[i+3]  
        }
    }

    const EMBOSS1 = (data, limit, w) => {
      if (colorInv3Val == 0) return 
        for(var i = 0; i < limit; i+=3) {                
          data[i] = Math.round((((100 + 2*data[i] - data[i+4] - data[(i-colorInv3Val) + w*4]) + (data[i]*7))));          
        }
    }

    const EMBOSS2 = (data, limit, w) => {        
      if (colorInv3Val == 0) return 
       for(var i = 0; i < limit; i+=4) {        
          data[i] = (Math.round(colorInv3Val/.5)-50) + 2*data[i] - data[i] - data[i + w*4];          
          data[i+3] = (Math.round(colorInv3Val/.5)-50) + 2*data[i+2] - data[i+2] - data[Math.round((i+2) + (w*3.97))];          
          data[i+1] = (Math.round(colorInv3Val/.5)-50) + 2*data[i+1] - data[i+1] - data[i+1 + w*4];          
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

    const CLOUDFOLDER1 = (data, limit) => {
      if (colorInv1Val == 0) return

      if (colorInv1Val > 0) {
        let r = colorInv1Val
        let g = colorInv1Val * .35
        let b = colorInv1Val * .77
  
        // interpolating between full inversion value and original, per color channel
        for (let i = 0; i < limit; i += 8) {        
          data[i] = 255 % (Math.round(data[i] * (1 - r) + (255 - data[i]) * r))
          data[i+1] = 255 % (Math.round(data[i+1] * (1 - g) + (255 - data[i+1]) * g)) 
          data[i+2] = 255 % (Math.round(data[i+2] * (1 - b) + (255 - data[i+2]) * b))
          // data[i+2] += 50 
        }
      }
    }

    const CLOUDFOLDER2 = (data, limit) => {
      if (colorInv2Val == 0) return
      
      let r = colorInv2Val * 1.57
      let g = colorInv2Val * 1.04
      let b = colorInv2Val * 1.92

      if (colorInv2Val > 0) {
        for (let i = 0; i < limit; i +=4) {        
          data[i+0] = 255% (Math.round(data[i] * (1 - r) + (255 - data[i]) * b))     
          data[i+1] = 255% (Math.round(data[i+1] * (1 - g) + (255 - data[i+1]) * g)) 
          data[i+2] = 255% (Math.round(data[i+2] * (1 - b) + (255 - data[i+2]) * b)) 
        }
      }
    }

    const ALPHAFOLD = (data, limit) => {
      if (colorInv3Val == 0) return

        // interpolating between full inversion value and original, per color channel
        for (let i = 0; i < limit; i += 4) {        
          data[i+3] = 255 % (Math.round(data[i+3] * (1 - colorInv3Val) + (255 - data[i+3]) * colorInv3Val))    
          // data[i+7] = 255 % (Math.round(data[i+4] * (1 - colorInv3Val) + (255 - data[i+2]) * (colorInv3Val)))    
        }

        // for (let i = 0; i < limit; i += 4) {        
        //   data[i+3] = 255 % (Math.round(data[i+7] * (1 - colorInv3Val) + (255 - data[i+7]) * colorInv3Val))    
        //   // data[i+7] = 255 % (Math.round(data[i+4] * (1 - colorInv3Val) + (255 - data[i+2]) * (colorInv3Val)))    
        // }
      }
    

    const ACCIDENTVERTICALGLITCHTHING = (data, limit) => {
      if (colorInv2Val == 0) return
      
      let r = colorInv2Val * 1.57
      let g = colorInv2Val * 1.04
      let b = colorInv2Val * 1.92

      if (colorInv2Val > 0) {
        for (let i = 0; i < limit; i +=4) {        
          data[(Math.round(limit/(colorInv2Val)))%(i+0)] = 255%  (Math.round(data[i] * (1 - r) + (255 - data[i]) * b))     
          data[(Math.round(limit/(colorInv2Val)))%(i+1)] = 255%  (Math.round(data[i+1] * (1 - r) + (255 - data[i+1]) * g)) 
          data[(Math.round(limit/(colorInv2Val)))%(i+2)] = 255%  (Math.round(data[i+2] * (1 - b) + (255 - data[i+2]) * b)) 
        }
      }
    }

    const INVERT = (data, limit) => {
      if (rInvVal == 0 && gInvVal == 0 && bInvVal == 0) return

      // interpolating between full inversion value and original, per color channel
      for (let i = 0; i < limit; i += 4) {        
        data[i] = Math.round(data[i] * (1 - rInvVal) + (255 - data[i]) * rInvVal) 
        data[i+1] = Math.round(data[i+1] * (1 - gInvVal) + (255 - data[i+1]) * gInvVal)
        data[i+2] = Math.round(data[i+2] * (1 - (Math.round(rInvVal/2))) + (255 - data[i+2]) * Math.round(gInvVal))
      }
    };

    const CLOUDFOLDER3 = (data, limit) => {
      if (colorInv3Val == 0) return

      if (colorInv3Val > 0) {
        let r = colorInv3Val
        let g = colorInv3Val * .35
        let b = colorInv3Val * .77
  
        // interpolating between full inversion value and original, per color channel
        for (let i = 0; i < limit; i +=  2) {        
          data[i] = 255 % (Math.round(data[i] * (1 - r) + (255 - data[i]) * r))
          data[i+1] = 255 % (Math.round(data[i+1] * (1 - g) + (255 - data[i+1]) * g)) 
          data[i+2] = 255 % (Math.round(data[i+2] * (1 - b) + (255 - data[i+2]) * b))
          // data[i+2] += 50 
        }

      }
    }


    const DOWNSAMPLE = () => {
      canvas.width  = 4096 / res
      canvas.height = 2160 / res
    }

    const WIDTHGLITCH = () => {
      // if (p9Val === 1) return  1

      return wPinchVal
    }

    const WIDTHSCAN = () => {
      // if (p9Val === 1) return  1

      return wScanVal
    }

    const CONVOLUTION = (data, limit, w, h, kernel) => {
        if (convVal == 0) return

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
          0,  (convVal*3),  0,
          0, -2,  0,
          (convVal),  (convVal*-3), 0
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
      ctx.drawImage(video,WIDTHSCAN()*100,0,(ctx.canvas.width/WIDTHGLITCH() ),(ctx.canvas.height));
      let idata = ctx.getImageData(0,0,canvas.width, canvas.height);
      let data = idata.data;
      let w = idata.width;
      let h = idata.height;
      let limit = data.length

      PRISM1(data, limit)
      BRIGHTNESS(data,limit)
      CONTRAST(data,limit)
      CLOUDFOLDER1(data,limit)
      CLOUDFOLDER2(data,limit) 
      PRISM2(data, limit) 
      INVERT(data, limit)
      POSTBRIGHTNESS(data,limit)
      POSTCONTRAST(data,limit)
      // INVERT(data, limit)

      

      
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


    