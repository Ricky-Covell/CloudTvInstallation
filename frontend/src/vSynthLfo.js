class vSynthLfo {
  constructor(depth, interval, rDepth){
    this.depth = depth
    this.interval = interval || 1
    this.intervalCount = 1
    this.rDepth = rDepth || 0
    this.randomVar = 0
    this.stop = false
    this.forward = true
    this.val = 0
    
  }

  absVal() {
    return Math.abs(this.val)
  }

  run(){
    if (this.intervalCount !== this.interval) {
      this.intervalCount++
      return this.absVal()
    }

    this.intervalCount=1

    if (this.rDepth !== 0) this.randomVar = (Math.floor(Math.random() * this.rDepth) * 2) - this.rDepth

    switch (this.forward) {        
      case true:
        if (this.val < this.depth) {
          this.val += (1 + this.randomVar)
          return this.absVal()
        } else {
          this.forward = false
          this.val -= (1 + this.randomVar)
          return this.absVal()
        }

      case false:
        if (this.val > (this.depth)) {
          this.val -= (1 + this.randomVar)
          return this.absVal()
        } else {
          this.forward = true
          this.val += (1 + this.randomVar)
          return this.absVal()
        }
    }
  }
}

const lfo = new vSynthLfo(10)

export default vSynthLfo