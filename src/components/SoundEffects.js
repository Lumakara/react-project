class UI_SFX {
  constructor() {
    this.audioCtx = null;
  }
  
  init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }
  
  playHover() {
    try {
      this.init();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(850, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1150, this.audioCtx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.007, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.04);
    } catch {
      /* Sound effects not supported or AudioContext suspended */
    }
  }
  
  playClick() {
    try {
      this.init();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, this.audioCtx.currentTime + 0.07);
      
      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.07);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.07);
    } catch {
      /* Sound effects not supported or AudioContext suspended */
    }
  }
  
  playTab() {
    try {
      this.init();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      const playTone = (freq, delay, dur) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);
        
        gain.gain.setValueAtTime(0.02, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);
        
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + dur);
      };
      playTone(523.25, 0, 0.12); // C5
      playTone(659.25, 0.04, 0.15); // E5
    } catch {
      /* Sound effects not supported or AudioContext suspended */
    }
  }
  
  playOpenModal() {
    try {
      this.init();
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      const playTone = (freq, delay, dur) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.35, now + delay + dur);
        
        gain.gain.setValueAtTime(0.022, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);
        
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + dur);
      };
      playTone(392.00, 0, 0.22); // G4 -> D5
    } catch {
      /* Sound effects not supported or AudioContext suspended */
    }
  }
}

export const sfx = new UI_SFX();
