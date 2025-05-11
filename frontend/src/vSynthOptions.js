const vSynthOptions = {
  vSynthClock: 60,  
    // Default: 60
    // vSynth clock in ms 
    // Larger values = Better performance at the risk of choppier video
  downsampleFactor: 4, 
    // Default: 2
    // Leahs Default: 4
    // Divides vSynth's internal resolution by int
    // Large values = Better performance but reduces detail

  playerWidth: 100,  
    // Default: 100
    // In %
  playerHeight: 100,
    // Default: 100  
    // In %
  playerNudge: 0,  
    // Default: 0
    // Positive or Negative Int in %


  willReadFrequentlyFlag: false,
    // Default: false
    // I changed this flag to false in person bc I read it priorited CPU processing
    // Maybe flip it to true to verify there's still a performance drop?
  alphaFlag: false,
    // Default: false
    // ignore
  desynchronizedFlag: true, 
    // Default: true
    // ignore
}  

export default vSynthOptions
