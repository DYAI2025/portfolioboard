
type ChordFreqs = number[];

// Minor triads: Root, Minor Third, Fifth
// Frequencies adjusted for a pleasant middle octave
const CHORDS: Record<string, ChordFreqs> = {
  'Cm': [261.63, 311.13, 392.00], // C4, Eb4, G4
  'Dm': [293.66, 349.23, 440.00], // D4, F4, A4
  'Em': [329.63, 392.00, 493.88], // E4, G4, B4
  'Fm': [349.23, 415.30, 523.25], // F4, Ab4, C5
  'Gm': [392.00, 466.16, 587.33], // G4, Bb4, D5
  'Am': [440.00, 523.25, 659.25], // A4, C5, E5
};

let audioCtx: AudioContext | null = null;

// Initialize or resume AudioContext
export const initAudio = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(e => console.warn("Audio resume failed", e));
  }
  return audioCtx;
};

// Play a chord and return a stop function
export const playChord = (key: string): (() => void) => {
  const ctx = initAudio();
  if (!ctx) return () => {};

  const freqs = CHORDS[key] || CHORDS['Cm'];
  
  const now = ctx.currentTime;
  // Envelope configuration: "Soft fading... around 3 seconds"
  // Swell in (Attack) -> Fade out (Decay) -> Silence
  const attack = 0.8; 
  const duration = 3.0; // Total audible duration

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0, now);
  // Swell up
  masterGain.gain.linearRampToValueAtTime(0.12, now + attack);
  // Fade out completely automatically
  masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  // Filter for soft "matte" organ texture
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(400, now);
  // "Open" the sound slightly during attack
  filter.frequency.linearRampToValueAtTime(700, now + attack);
  // Close it back down during decay
  filter.frequency.linearRampToValueAtTime(300, now + duration);
  filter.Q.value = 0.6;

  masterGain.connect(filter);
  filter.connect(ctx.destination);

  const oscillators: OscillatorNode[] = [];

  freqs.forEach(freq => {
    // 1. Main Oscillator (Triangle for body)
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    // Slight detune for analog feel
    osc.detune.value = Math.random() * 6 - 3; 

    osc.connect(masterGain);
    osc.start(now);
    // Stop slightly after fade out to save resources
    osc.stop(now + duration + 0.2);
    oscillators.push(osc);

    // 2. Sub-Oscillator (Sine for depth)
    const subOsc = ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.value = freq / 2;
    
    const subGain = ctx.createGain();
    subGain.gain.value = 0.25; // Sub is quieter
    
    subOsc.connect(subGain);
    subGain.connect(masterGain);
    subOsc.start(now);
    subOsc.stop(now + duration + 0.2);
    oscillators.push(subOsc);
  });

  // Schedule garbage collection of nodes
  const cleanupTimeout = setTimeout(() => {
    masterGain.disconnect();
    filter.disconnect();
  }, (duration + 0.5) * 1000);

  // Return manual stop function (for when mouse leaves early)
  return () => {
    const stopNow = ctx.currentTime;
    // If sound has already finished naturally, just ensure cleanup
    if (stopNow > now + duration) {
        return;
    }

    // If interrupted (mouse leave), fade out quickly (release)
    masterGain.gain.cancelScheduledValues(stopNow);
    masterGain.gain.setValueAtTime(masterGain.gain.value, stopNow);
    masterGain.gain.exponentialRampToValueAtTime(0.001, stopNow + 0.5);

    oscillators.forEach(osc => {
        osc.stop(stopNow + 0.6);
    });
    
    // Clear the original cleanup and schedule a new one
    clearTimeout(cleanupTimeout);
    setTimeout(() => {
        masterGain.disconnect();
        filter.disconnect();
    }, 700);
  };
};
