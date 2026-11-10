type SoundType = 'move' | 'merge' | 'win' | 'gameover';

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private initialized: boolean = false;

  private readonly frequencies: Record<SoundType, { freq: number; duration: number; type: OscillatorType }> = {
    move: { freq: 440, duration: 0.1, type: 'sine' },
    merge: { freq: 660, duration: 0.15, type: 'sine' },
    win: { freq: 880, duration: 0.5, type: 'triangle' },
    gameover: { freq: 220, duration: 0.8, type: 'sawtooth' },
  };

  initialize(): void {
    if (this.initialized) return;
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async play(soundType: SoundType): Promise<void> {
    if (!this.enabled || !this.audioContext) return;

    // Resume audio context if suspended (browser autoplay policy)
    if (this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (e) {
        console.warn('Could not resume audio context:', e);
        return;
      }
    }

    const { freq, duration, type } = this.frequencies[soundType];

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);

      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (e) {
      console.warn('Failed to play sound:', e);
    }
  }
}

export const soundManager = new SoundManager();