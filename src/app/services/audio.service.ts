import { inject, Injectable } from '@angular/core';
import { ConfigService } from './config.service';

type Som = 'scan' | 'click' | 'success' | 'error' | 'coin';

const CAMINHOS: Record<Som, string> = {
  scan: 'assets/sounds/scan.mp3',
  click: 'assets/sounds/click.mp3',
  success: 'assets/sounds/success.mp3',
  error: 'assets/sounds/error.mp3',
  coin: 'assets/sounds/coin.mp3',
};

@Injectable({ providedIn: 'root' })
export class AudioService {
  private configSvc = inject(ConfigService);
  private pool = new Map<string, HTMLAudioElement>();

  play(nome: Som) {
    const cfg = this.configSvc.config.preferencias;
    if (!cfg.som && !cfg.vibrar) return;
    if (cfg.som) {
      const src = CAMINHOS[nome];
      let audio = this.pool.get(nome);
      if (!audio) {
        try {
          audio = new Audio(src);
          audio.preload = 'auto';
          this.pool.set(nome, audio);
        } catch {
          return;
        }
      }
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
    if (cfg.vibrar && navigator.vibrate) {
      navigator.vibrate(nome === 'error' ? 30 : 10);
    }
  }
}
