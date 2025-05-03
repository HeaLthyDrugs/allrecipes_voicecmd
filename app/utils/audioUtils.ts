'use client';

/**
 * Plays a short sound when the timer ends
 */
export function playTimerEndSound() {
  try {
    // Create an audio context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    
    // Create an oscillator
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    
    // Create a gain node for volume control
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    // Play sound
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 1);
    
    // Play a second tone after a short delay
    setTimeout(() => {
      const oscillator2 = audioCtx.createOscillator();
      oscillator2.type = 'sine';
      oscillator2.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      
      const gainNode2 = audioCtx.createGain();
      gainNode2.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode2.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
      
      oscillator2.connect(gainNode2);
      gainNode2.connect(audioCtx.destination);
      
      oscillator2.start(audioCtx.currentTime);
      oscillator2.stop(audioCtx.currentTime + 1.5);
    }, 200);
  } catch (error) {
    console.error('Error playing timer end sound:', error);
  }
}

/**
 * Plays a short sound when voice recognition is activated
 */
export function playActivationSound() {
  try {
    // Create an audio context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    
    // Create an oscillator
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
    
    // Create a gain node for volume control and fade out
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    // Play sound
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.2);
  } catch (error) {
    console.error('Error playing activation sound:', error);
  }
} 