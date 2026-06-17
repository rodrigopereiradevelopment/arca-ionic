import { inject, Injectable } from '@angular/core';
import { ConfigService } from './config.service';

type Som = 'scan' | 'click' | 'success' | 'error' | 'coin';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private configSvc = inject(ConfigService);
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  play(nome: Som) {
    const cfg = this.configSvc.config.preferencias;
    if (!cfg.som && !cfg.vibrar) return;

    if (cfg.som) {
      try {
        const ctx = this.getContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;
        gain.gain.setValueAtTime(0.3, now);

        switch (nome) {
          case 'scan':
            osc.type = 'square';
            osc.frequency.setValueAtTime(1800, now);
            osc.frequency.setValueAtTime(1200, now + 0.06);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
            break;

          case 'click':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1000, now);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
            break;

          case 'success':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523, now);
            osc.frequency.setValueAtTime(659, now + 0.1);
            osc.frequency.setValueAtTime(784, now + 0.2);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            osc.start(now);
            osc.stop(now + 0.35);
            break;

          case 'error':
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.setValueAtTime(200, now + 0.15);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
            break;

          case 'coin':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.setValueAtTime(1200, now + 0.08);
            osc.frequency.setValueAtTime(1600, now + 0.16);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
            break;
        }
      } catch {
        /* Web Audio API indisponível ou bloqueada */
      }
    }

    if (cfg.vibrar && navigator.vibrate) {
      navigator.vibrate(nome === 'error' ? 30 : 10);
    }
  }
}
