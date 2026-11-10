type HapticType = 'merge' | 'win' | 'gameover' | 'move';

class HapticsManager {
  private enabled: boolean = true;
  private supported: boolean = false;

  constructor() {
    this.checkSupport();
  }

  private checkSupport(): void {
    this.supported = 'vibrate' in navigator;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  isSupported(): boolean {
    return this.supported;
  }

  trigger(type: HapticType): void {
    if (!this.enabled || !this.supported) return;

    try {
      switch (type) {
        case 'merge':
          navigator.vibrate(10);
          break;
        case 'win':
          navigator.vibrate([50, 50, 50, 50, 100]);
          break;
        case 'gameover':
          navigator.vibrate([100, 50, 100]);
          break;
        case 'move':
          navigator.vibrate(5);
          break;
      }
    } catch (e) {
      console.warn('Haptic feedback failed:', e);
    }
  }
}

export const hapticsManager = new HapticsManager();