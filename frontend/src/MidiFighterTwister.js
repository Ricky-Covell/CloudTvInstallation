class MidiFighterTwister {
  constructor() {
    this.inputVals;
    this.inputArray = [
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
    ]
    this.htmlSliders;
    this.update;
    this.leahsMFTindex = 176;

    const assignInputs = (midi) => {
      this.inputVals = midi.inputs.values()
    }

    const getInputVals = () => {
      for (let input = this.inputVals.next(); input && !input.done; input = this.inputVals.next()) {         
        input.value.onmidimessage = onMIDIMessage;
      }
    }
    
    const onMIDIMessage = (message) => {
        
        this.inputArray[message.data[1]] = message.data[2]
        this.update()

        console.log(`
          ${this.inputArray[0]}, ${this.inputArray[1]}, ${this.inputArray[2]}, ${this.inputArray[3]},  
          ${this.inputArray[4]}, ${this.inputArray[5]}, ${this.inputArray[6]}, ${this.inputArray[7]},  
          ${this.inputArray[8]}, ${this.inputArray[9]}, ${this.inputArray[10]}, ${this.inputArray[11]},  
          ${this.inputArray[12]}, ${this.inputArray[13]}, ${this.inputArray[14]}, ${this.inputArray[15]},  
          `
        )

      }

    navigator.requestMIDIAccess()
          .then(assignInputs)
          .then(getInputVals)
  }

  setSliders(paramSliderArray) {
    this.htmlSliders = paramSliderArray
  }

  setUpdate(MFTupdate) {
    this.update = MFTupdate
  } 

  static testMidiAccess = () => {
    const success = (midi) => {
      console.log('Got midi!', midi);
    }
    const failure = () => {
      console.error('No access to your midi devices.')
    }
  
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess()
          .then(success, failure);
    }
  }
}



// execute
const midiTwister = new MidiFighterTwister()

export default MidiFighterTwister