import React, { useState, useEffect, useContext } from "react";
import axios from 'axios'
import CloudContext from "./CloudContext";


const VideoSynthNav = () => {
  const { clouds } = useContext(CloudContext)

  // const [satelliteVals, setSatelliteVals] = useState({
  //   density: 1,
  //   time: 1,
  //   speed: 1,
  //   nonlinearity: 1,
  // })

  // const [synthVals, setSynthVals] = useState({
  //   prism: 1,
  //   spectralGate: 1,
  //   averaging: 1,
  //   reverberation: 1,
  // })

  // // Updates slider values in realtime 
  // const handleSatChange = (evt) => {
  //   const { name, value } = evt.target
  //   setSatelliteVals((satelliteVals) => ({
  //       ...satelliteVals,
  //       [name]: value
  //   }))}

  // const handleSynthChange = (evt) => {
  //   const { name, value } = evt.target
  //   setSynthVals((synthVals) => ({
  //       ...synthVals,
  //       [name]: value
  //   }))}  

  // console.log(synthVals.prism)
    
  // are onChange callbacks even necessary?
  return (
    <div id="vSynth-container" class='vSynth-Params-flexbox'>
        <div id="vSynth-satellite-params">              
          <h3>Satellite Feed</h3>
          {/* <h4>density</h4> */}
          <input type="range" id="param-fps" min="30" max="300" defaultValue='90' name="fps"/>
          {/* <h4>time</h4> */}
          <input id='param-speed' type="range" min="0" max="40"  defaultValue='15'/>
          {/* <h4>nonlinearity</h4> */}
          <input type="range" id="param-resolution" min="4" max="24"  defaultValue='8'/>
          {/* <h4>speed</h4> */}
          <input type="range" id="param-cloud" min="0" max={clouds.length - 1}  defaultValue='1'/>
        </div>   
      <div>

      <div id="vSynth-synth-params">        
          {/* <h3>Video Synth</h3> */}
          {/* <h4>p1</h4>           */}
          <input id="param-p1" class='vSynth-slider' type="range" min="4" max="24" defaultValue='8' step='.1' name="p1" />
          {/* <h4>p2</h4> */}
          <input id="param-p2" class='vSynth-slider' type="range" min="0" max="100" defaultValue='0' step='0.17' name="p2" />
          {/* <h4>p3</h4> */}
          <input id="param-p3" class='vSynth-slider' type="range" min="0" max="3000" step="3.79" defaultValue='0' name="p3" />
          {/* <h4>p4</h4> */}
          <input id="param-p4" class='vSynth-slider' type="range" min="-50" max="100" defaultValue='25' step='1' name="p4" />
          {/* <h4>p5</h4> */}
          <input id="param-p5" class='vSynth-slider' type="range" min="-2" max="2" step='0.1' defaultValue='0' name="p5" />
          {/* <h4>p6</h4> */}
          <input id="param-p6" class='vSynth-slider' type="range" min="0" max="2" step='0.25' defaultValue='0' name="p6" />
          {/* <h4>p7</h4> */}
          <input id="param-p7" class='vSynth-slider' type="range" min="0" max="1" step="0.01" defaultValue='0' name="p7" />
          {/* <h4>p8</h4> */}
          <input id="param-p8" class='vSynth-slider' type="range" min="0" max="1" step="0.01" defaultValue='0' name="p8" />
          {/* <h4>p9</h4> */}
          <input id="param-p9" class='vSynth-slider' type="range" min="0" max="1" step="0.01" defaultValue='0' name="p9" />
          {/* <h4>p10</h4> */}
          <input id="param-p10" class='vSynth-slider' type="range" min="1" max="10" step="0.1" defaultValue='0' name="p10" />
          
      </div>
      </div>   
    </div>
  )
}

export default VideoSynthNav