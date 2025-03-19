import React, { useState, useEffect, useContext } from "react";

const loadVideos = (clouds) => {
  
  setTimeout(() => {
    let video = document.getElementById('cloud-video-element')
    // let sourceElements = video.getElementsByTagName('source') || []

      // if (sourceElements !== undefined) sourceElements[0].src = `/cloud-set/clouds1.mp4`

    // sourceElements.forEach((e, idx) => {
    //     e.src = `/cloud-set${clouds[idx]}`
    //   })

    // if (sourceElements != []) {
    //   for (var i = 0; i < sourceElements.length; i++) {
    //     sourceElements[i].src = `/cloud-set/${clouds[i]}`
    //   }
    // }  

    // video.src = `/cloud-set/${clouds[Math.floor(Math.random() * clouds.length)]}` // random GOES movie on load
    // video.load()
    video.play()

  }, "100");
}

export default loadVideos